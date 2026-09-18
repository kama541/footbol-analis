export const generateTacticalAnalysis = async (matchData: any): Promise<string> => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('OpenAI API kaliti topilmadi.');
  }

  // Use all players if available, fallback to topPlayers
  const allPlayers = matchData.players || matchData.topPlayers || [];
  const allEvents = matchData.events || [];

  const prompt = `
Siz professional futbol taktik tahlilchisisiz (Scout). 
Quyidagi o'yin statistikasi, voqealar xronologiyasi va o'yinchilarning jismoniy faolligi asosida murabbiy uchun o'zbek tilida professional taktik xulosa yozib bering.

## O'yin Vaqti:
- Joriy vaqt: ${Math.floor((matchData.currentTime || 0) / 60)} daqiqa ${(matchData.currentTime || 0) % 60} soniya

## Jismoniy Faollik (Computer Vision Tracking):
${allPlayers.length > 0 
  ? allPlayers.map((p: any) => `- ${p.name} (${p.pos}): ${p.dist} km yugurdi, ${p.sprints} ta sprint, Eng yuqori tezligi: ${p.topSpeed} km/h, Joriy tezlik: ${p.currentSpeed} km/h`).join('\n')
  : '- Ma\'lumot yo\'q (o\'yinchilar hali kuzatilmagan)'}

## Umumiy Statistika:
- Hisob: Football Club ${matchData.matchStats?.fcScore ?? 0} - ${matchData.matchStats?.nvScore ?? 0} Navbahor
- To'p nazorati: FC ${matchData.matchStats?.fcPossession ?? 55}% - NV ${matchData.matchStats?.nvPossession ?? 45}%
- Zarbalar: FC ${matchData.matchStats?.fcShots ?? 0} (${matchData.matchStats?.fcShotsOnTarget ?? 0} aniq) vs NV ${matchData.matchStats?.nvShots ?? 0} (${matchData.matchStats?.nvShotsOnTarget ?? 0} aniq)
- Burchak to'plari: FC ${matchData.matchStats?.fcCorners ?? 0} - NV ${matchData.matchStats?.nvCorners ?? 0}
- Qoidabuzarliklar: FC ${matchData.matchStats?.fcFouls ?? 0} - NV ${matchData.matchStats?.nvFouls ?? 0}
- Kutilayotgan gollar (xG): FC ${matchData.matchStats?.fcXG?.toFixed(2) ?? 0} - NV ${matchData.matchStats?.nvXG?.toFixed(2) ?? 0}

## O'yin voqealari (${allEvents.length} ta):
${allEvents.length > 0
  ? allEvents.map((e: any) => `- ${Math.floor(e.time / 60)}'${(e.time % 60).toString().padStart(2,'0')}: [${e.team || 'FC'}] ${e.player || 'Noma\'lum'} — ${e.type} (${e.description || ''})`).join('\n')
  : '- Hali voqealar kiritilmagan'}

Iltimos, javobingizni quyidagi tuzilmada, chiroyli Markdown formatida yozing:

## 1. O'yin Ritmi va Jismoniy Faollik
(Eng tezkor o'yinchilar, kim ko'p yugurgani, sprint statistikasi)

## 2. Hujumkorlik Tahlili  
(xG, zarbalar samaradorligi, imkoniyatlar)

## 3. Mudofaa va Kamchiliklar
(Qoidabuzarliklar, ruxsat etilgan imkoniyatlar)

## 4. Murabbiyga Maslahat
(Keyingi taym yoki o'yin uchun aniq taktik tavsiyalar)
  `;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'Siz professional futbol taktik tahlilchisi va skauting ekspertisiz. Har doim o\'zbek tilida javob bering. Aniq, professional va amaliy maslahatlar bering.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      const errMsg = (errData as any)?.error?.message || `HTTP ${response.status}`;
      throw new Error(`OpenAI xatoligi: ${errMsg}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error: any) {
    console.error('AI Service Error:', error);
    throw error;
  }
};
