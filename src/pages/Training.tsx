import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { User, Activity, Map, AlertTriangle, Zap, Camera, Play, Pause, Upload } from 'lucide-react';

const mockPlayers = [
  { id: 1, name: "Jaloliddin Masharipov", position: "Winger", maxSpeed: 34.2, avgSpeed: 18.5, passes: 85, possessionLoss: 4, errors: 2 },
  { id: 2, name: "Oston Urunov", position: "Midfielder", maxSpeed: 32.1, avgSpeed: 19.2, passes: 92, possessionLoss: 3, errors: 1 },
  { id: 3, name: "Eldor Shomurodov", position: "Forward", maxSpeed: 33.8, avgSpeed: 17.8, passes: 78, possessionLoss: 5, errors: 3 },
];

const Training = () => {
  const { t } = useTranslation();
  const [selectedPlayerId, setSelectedPlayerId] = useState(mockPlayers[0].id);

  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [analysisStatus, setAnalysisStatus] = useState<'idle' | 'analyzing' | 'complete'>('idle');
  const [progress, setProgress] = useState(0);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const player = mockPlayers.find(p => p.id === selectedPlayerId);

  // Automatically trigger AI analysis when player changes
  React.useEffect(() => {
    setAnalysisStatus('analyzing');
    setProgress(0);
  }, [selectedPlayerId]);

  // Simulate AI analysis progress
  React.useEffect(() => {
    if (analysisStatus === 'analyzing') {
      const interval = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            clearInterval(interval);
            setAnalysisStatus('complete');
            return 100;
          }
          return p + 5;
        });
      }, 150); // Takes ~3 seconds
      return () => clearInterval(interval);
    }
  }, [analysisStatus]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const startAnalysis = (file: File) => {
    const url = URL.createObjectURL(file);
    setVideoSrc(url);
    setIsPlaying(true);
    setAnalysisStatus('analyzing');
    setProgress(0);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('video/')) {
      startAnalysis(file);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      startAnalysis(file);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  return (
    <div className="p-6 md:p-8 animate-fade-in pb-24 lg:pb-8 max-w-7xl mx-auto bg-[#0f1115] min-h-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Activity className="text-football-blue" size={32} />
            {t('training.title', 'Futbolchi Sintezi')}
          </h1>
          <p className="text-slate-400 mt-2">
            Individual o'yinchilarning mashg'ulot ko'rsatkichlari tahlili
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <select 
            className="w-full appearance-none bg-[#161920] border border-slate-800 text-slate-200 py-3 px-4 pr-8 rounded-xl focus:outline-none focus:border-[#FFE600] shadow-sm font-medium"
            value={selectedPlayerId}
            onChange={(e) => setSelectedPlayerId(Number(e.target.value))}
          >
            <option value="" disabled>{t('training.select_player', 'Futbolchini tanlang')}</option>
            {mockPlayers.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
            <User size={18} />
          </div>
        </div>
      </div>

      {player && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Camera/Recording Section */}
          <div className="col-span-1 lg:col-span-3 bg-[#161920] rounded-2xl shadow-lg border border-slate-800 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#FFE600]/20 flex items-center justify-center text-[#FFE600]">
                <Camera size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Mashg'ulot Videoyozuvi</h3>
                <p className="text-sm text-slate-400">Tahlil ushbu videodan olinmoqda (Videoni tashlang yoki yuklang)</p>
              </div>
            </div>
            
            <div 
              className={`relative w-full aspect-video bg-slate-900 rounded-xl overflow-hidden border-2 transition-all ${isDragging ? 'border-football-blue bg-slate-800 scale-[1.01]' : 'border-slate-700 group'}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {videoSrc ? (
                <>
                  <video 
                    ref={videoRef}
                    src={videoSrc} 
                    className="w-full h-full object-cover"
                    autoPlay
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onClick={togglePlay}
                  />
                  {!isPlaying && (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center cursor-pointer" onClick={togglePlay}>
                      <div className="w-16 h-16 bg-football-blue/90 text-white rounded-full flex items-center justify-center hover:bg-football-blue transition-colors shadow-lg shadow-football-blue/30 scale-110">
                        <Play size={24} className="ml-1" />
                      </div>
                    </div>
                  )}
                  {isPlaying && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-2 animate-pulse">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      REC
                    </div>
                  )}
                  <div className="absolute bottom-4 right-4 bg-football-blue/90 text-white text-xs font-medium px-3 py-1 rounded shadow-lg flex items-center gap-2 animate-pulse">
                    <Zap size={14} />
                    AI Tahlil qilyapti...
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer">
                  {/* Mock Video Thumbnail / Background */}
                  <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1518605368461-1e1e38ce81ba?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center"></div>
                  
                  <label className="relative z-10 flex flex-col items-center gap-4 cursor-pointer">
                    <div className="w-16 h-16 bg-football-blue/90 text-white rounded-full flex items-center justify-center hover:bg-football-blue transition-colors shadow-lg shadow-football-blue/30 group-hover:scale-110 duration-300">
                      <Upload size={24} />
                    </div>
                    <span className="text-white font-medium bg-black/50 px-4 py-2 rounded-lg backdrop-blur">
                      Videoni shu yerga tashlang yoki bosing
                    </span>
                    <input type="file" accept="video/*" className="hidden" onChange={handleFileUpload} />
                  </label>
                </div>
              )}
            </div>
          </div>
          {/* Player Info & Synthesis Card */}
          <div className="col-span-1 lg:col-span-3 bg-[#161920] rounded-2xl shadow-lg border border-slate-800 p-6 flex flex-col md:flex-row gap-6 items-center">
            <div className="w-24 h-24 bg-football-blue/10 rounded-full flex items-center justify-center text-football-blue shrink-0">
              <User size={48} />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold text-white">{player.name}</h2>
              <p className="text-slate-400 font-medium">{player.position}</p>
            </div>
            <div className="flex gap-4 w-full md:w-auto">
              <div className="flex-1 bg-[#0f1115] rounded-xl p-4 text-center border border-slate-800">
                <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">{t('training.avg_speed', 'O\'rtacha tezlik')}</div>
                <div className="text-xl font-bold text-white">{player.avgSpeed} <span className="text-sm font-normal text-slate-500">km/h</span></div>
              </div>
              <div className="flex-1 bg-[#0f1115] rounded-xl p-4 text-center border border-slate-800">
                <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">{t('training.max_speed', 'Maksimal tezlik')}</div>
                <div className="text-xl font-bold text-football-blue">{player.maxSpeed} <span className="text-sm font-normal text-slate-500">km/h</span></div>
              </div>
            </div>
          </div>

          {/* Heatmap / Zone Analysis */}
          <div className="col-span-1 lg:col-span-2 bg-[#161920] rounded-2xl shadow-lg border border-slate-800 p-6 relative overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center text-green-600">
                <Map size={20} />
              </div>
              <h3 className="text-lg font-bold text-white">{t('training.heatmap', 'Harakatlar Zonasi')}</h3>
            </div>
            
            {analysisStatus === 'analyzing' && (
              <div className="absolute inset-0 z-20 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-4 border-football-blue border-t-transparent rounded-full animate-spin mb-4"></div>
                <div className="text-football-blue font-bold">Ma'lumotlar olinmoqda... {progress}%</div>
                <div className="w-64 h-2 bg-slate-200 dark:bg-slate-700 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-football-blue transition-all duration-300" style={{ width: `${progress}%` }}></div>
                </div>
              </div>
            )}

            <div className={`relative w-full aspect-[16/9] bg-green-600 rounded-xl overflow-hidden border-2 border-white/20 transition-opacity duration-500 ${analysisStatus === 'analyzing' ? 'opacity-20' : 'opacity-100'}`}>
              {/* Pitch Lines */}
              <div className="absolute inset-0 border border-white/30 m-4 rounded"></div>
              <div className="absolute left-1/2 top-4 bottom-4 border-l border-white/30"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border border-white/30 rounded-full"></div>
              <div className="absolute left-4 top-1/2 -translate-y-1/2 w-16 h-32 border border-white/30 border-l-0"></div>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 w-16 h-32 border border-white/30 border-r-0"></div>
              
              {/* Mock Heatmap Overlay */}
              <div className="absolute inset-0 opacity-50 mix-blend-screen" style={{ background: 'radial-gradient(circle at 70% 30%, rgba(255,0,0,0.8) 0%, rgba(255,255,0,0.6) 20%, rgba(0,255,0,0) 50%), radial-gradient(circle at 80% 60%, rgba(255,100,0,0.7) 0%, rgba(255,255,0,0.4) 30%, rgba(0,255,0,0) 60%)' }}></div>
              <div className="absolute inset-0 opacity-40 mix-blend-screen" style={{ background: 'radial-gradient(circle at 30% 50%, rgba(255,255,0,0.5) 0%, rgba(0,255,0,0) 40%)' }}></div>
              
              {/* Player Movement Paths */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                  <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                    <polygon points="0 0, 6 3, 0 6" fill="white" className="opacity-70" />
                  </marker>
                </defs>
                {/* Runs */}
                <path d="M 40 70 Q 60 80, 80 60" fill="none" stroke="white" strokeWidth="0.5" strokeDasharray="2 2" className="opacity-70" markerEnd="url(#arrowhead)" />
                <path d="M 50 50 Q 70 30, 75 20" fill="none" stroke="white" strokeWidth="0.5" strokeDasharray="2 2" className="opacity-70" markerEnd="url(#arrowhead)" />
                <path d="M 30 40 Q 50 30, 65 35" fill="none" stroke="white" strokeWidth="0.5" strokeDasharray="2 2" className="opacity-70" markerEnd="url(#arrowhead)" />
                
                {/* Action spots */}
                <circle cx="80" cy="60" r="1.5" fill="#facc15" className="animate-pulse" />
                <circle cx="75" cy="20" r="1.5" fill="#ef4444" className="animate-pulse" />
                <circle cx="65" cy="35" r="1.5" fill="#facc15" className="animate-pulse" />
              </svg>
              
              <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-xs font-medium border border-white/10">
                Eng faol hududlar: Hujumning o'ng qanoti
              </div>
            </div>
          </div>

          {/* Mistakes Analysis */}
          <div className="col-span-1 bg-[#161920] rounded-2xl shadow-lg border border-slate-800 p-6 flex flex-col relative overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500">
                <AlertTriangle size={20} />
              </div>
              <h3 className="text-lg font-bold text-white">{t('training.mistakes', 'Xatolar Tahlili')}</h3>
            </div>
            
            {analysisStatus === 'analyzing' && (
              <div className="absolute inset-0 z-20 bg-[#161920]/80 backdrop-blur-sm flex flex-col items-center justify-center">
                <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                <div className="text-red-500 font-bold text-sm">Xatolar hisoblanmoqda...</div>
              </div>
            )}

            <div className={`flex-1 flex flex-col gap-4 transition-opacity duration-500 ${analysisStatus === 'analyzing' ? 'opacity-20' : 'opacity-100'}`}>
              <div className="bg-[#0f1115] p-4 rounded-xl border border-slate-800">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-300 font-medium">{t('training.passing_error', 'Noaniq pas')}</span>
                  <span className="bg-red-500/20 text-red-400 font-bold px-2 py-1 rounded-md text-sm">{player.errors} marta</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-1.5">
                  <div className="bg-red-500 h-1.5 rounded-full" style={{ width: `${(player.errors / 10) * 100}%` }}></div>
                </div>
              </div>

              <div className="bg-[#0f1115] p-4 rounded-xl border border-slate-800">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-300 font-medium">{t('training.possession_lost', 'To\'p yo\'qotish')}</span>
                  <span className="bg-orange-500/20 text-orange-400 font-bold px-2 py-1 rounded-md text-sm">{player.possessionLoss} marta</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-1.5">
                  <div className="bg-orange-500 h-1.5 rounded-full" style={{ width: `${(player.possessionLoss / 10) * 100}%` }}></div>
                </div>
              </div>
              
              <div className="bg-[#0f1115] p-4 rounded-xl border border-slate-800">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-300 font-medium">{t('training.positioning_error', 'Pozitsion xato')}</span>
                  <span className="bg-yellow-500/20 text-yellow-400 font-bold px-2 py-1 rounded-md text-sm">1 marta</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-1.5">
                  <div className="bg-yellow-500 h-1.5 rounded-full" style={{ width: '10%' }}></div>
                </div>
              </div>
            </div>
            
            <div className={`mt-4 p-4 bg-football-blue/10 rounded-xl border border-football-blue/20 transition-opacity duration-500 ${analysisStatus === 'analyzing' ? 'opacity-20' : 'opacity-100'}`}>
              <p className="text-sm text-football-blue font-medium flex gap-2 mb-3">
                <Zap size={16} className="shrink-0 mt-0.5" />
                Sintez xulosasi: Ushbu o'yinchi hujumning o'ng qanotida ancha faol, lekin noaniq uzatmalar foizini kamaytirishi kerak.
              </p>
              
              <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-football-blue to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2.5 px-4 rounded-lg font-bold text-sm transition-all transform hover:scale-[1.02] shadow-lg shadow-football-blue/20">
                <Zap size={16} className="fill-white" />
                AI orqali mashg'ulot rejasini tuzish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Training;
