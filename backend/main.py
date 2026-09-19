from fastapi import FastAPI, UploadFile, File, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pathlib import Path
from ultralytics import YOLO
import cv2
import uuid
import shutil
import math

app = FastAPI(title="Football AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = Path(__file__).resolve().parent
UPLOAD_DIR = BASE_DIR / "uploads"
RESULT_DIR = BASE_DIR / "results"

UPLOAD_DIR.mkdir(exist_ok=True)
RESULT_DIR.mkdir(exist_ok=True)

ALLOWED_EXTENSIONS = {".mp4", ".avi", ".mov", ".mkv"}

# YOLO model
model = YOLO("yolo11n.pt")

jobs = {}

def process_video(job_id: str, input_path: Path, output_path: Path):
    print(f"[ANALYSIS] STARTED: {job_id}")

    try:
        jobs[job_id] = {"status": "processing", "progress": 0}

        cap = cv2.VideoCapture(str(input_path))

        if not cap.isOpened():
            print("[ANALYSIS] ERROR: Could not open video")
            jobs[job_id] = {
                "status": "failed",
                "error": "Could not open video"
            }
            return

        fps = cap.get(cv2.CAP_PROP_FPS) or 30
        width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

        print(
            f"[ANALYSIS] Video: {width}x{height}, "
            f"FPS: {fps}, Frames: {total_frames}"
        )

        fourcc = cv2.VideoWriter_fourcc(*"vp80")

        writer = cv2.VideoWriter(
            str(output_path),
            fourcc,
            fps,
            (width, height)
        )

        if not writer.isOpened():
            print("[ANALYSIS] ERROR: VideoWriter failed")
            jobs[job_id] = {
                "status": "failed",
                "error": "Could not create output video"
            }
            cap.release()
            return

        frame_count = 0
        track_history = {}

        try:
            while True:
                success, frame = cap.read()

                if not success:
                    break

                results = model.track(
                    frame,
                    persist=True,
                    tracker="bytetrack.yaml",
                    verbose=False,
                    classes=[0],
                    conf=0.15,
                    imgsz=1280
                )

                annotated_frame = frame.copy()
                boxes = results[0].boxes
                if len(boxes) > 0:
                    xyxy = boxes.xyxy.cpu().numpy()
                    track_ids = boxes.id.int().cpu().tolist() if boxes.id is not None else [None] * len(xyxy)

                    for box, track_id in zip(xyxy, track_ids):
                        x1, y1, x2, y2 = map(int, box)
                        center_x = (x1 + x2) / 2
                        center_y = (y1 + y2) / 2

                        speed_kmh = 0.0
                        if track_id is not None:
                            if track_id in track_history:
                                prev_x, prev_y, prev_frame = track_history[track_id]
                                dist = math.hypot(center_x - prev_x, center_y - prev_y)
                                time_elapsed = (frame_count - prev_frame) / fps
                                if time_elapsed > 0:
                                    speed_px_s = dist / time_elapsed
                                    speed_kmh = speed_px_s * 0.1

                            track_history[track_id] = (center_x, center_y, frame_count)
                            label = f"{speed_kmh:.1f} km/h"
                        else:
                            label = "Player"

                        cv2.rectangle(annotated_frame, (x1, y1), (x2, y2), (255, 0, 0), 2)
                        cv2.putText(annotated_frame, label, (x1, max(y1 - 10, 0)), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 0, 0), 2)

                writer.write(annotated_frame)

                frame_count += 1

                if frame_count >= 300:
                    print(f"[ANALYSIS] Stopping early at 300 frames to save time.")
                    break

                if frame_count % 30 == 0:
                    progress = (
                        int(frame_count / total_frames * 100)
                        if total_frames > 0
                        else 0
                    )

                    jobs[job_id] = {
                        "status": "processing",
                        "progress": progress,
                        "frames_processed": frame_count
                    }

                    print(
                        f"[ANALYSIS] {frame_count}/{total_frames} "
                        f"({progress}%)"
                    )

        finally:
            cap.release()
            writer.release()

        jobs[job_id] = {
            "status": "completed",
            "frames_processed": frame_count,
            "video_url": f"/api/analyze/result/{job_id}/video"
        }

        print(
            f"[ANALYSIS] COMPLETED: {job_id} "
            f"({frame_count} frames)"
        )

    except Exception as e:
        print(f"[ANALYSIS] ERROR: {e}")

        jobs[job_id] = {
            "status": "failed",
            "error": str(e)
        }
@app.get("/")
def root():
    return {
        "message": "Football AI Backend is running!",
        "status": "online"
    }

@app.get("/api/health")
def health():
    return {
        "status": "ok",
        "ai": "ready"
    }

@app.post("/api/analyze/upload")
async def analyze_video(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    extension = Path(file.filename or "").suffix.lower()

    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail="Only video files are supported"
        )

    job_id = str(uuid.uuid4())
    input_path = UPLOAD_DIR / f"{job_id}{extension}"
    output_path = RESULT_DIR / f"{job_id}.webm"

    with input_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    jobs[job_id] = {"status": "processing"}
    background_tasks.add_task(process_video, job_id, input_path, output_path)

    return {
        "job_id": job_id,
        "status": "processing"
    }

@app.get("/api/analyze/result/{job_id}")
def get_result(job_id: str):
    if job_id not in jobs:
        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )
    return {"job_id": job_id, **jobs[job_id]}

@app.get("/api/analyze/result/{job_id}/video")
def get_result_video(job_id: str):
    output_path = RESULT_DIR / f"{job_id}.webm"

    if not output_path.exists():
        raise HTTPException(
            status_code=404,
            detail="Analysis result not found"
        )

    return FileResponse(
        path=str(output_path),
        media_type="video/webm",
        filename=f"analysis-{job_id}.webm"
    )
