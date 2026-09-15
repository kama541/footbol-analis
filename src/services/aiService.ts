export const generateTacticalAnalysis = async (matchData: any): Promise<string> => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('OpenAI API kaliti topilmadi.');
  }

  const prompt = `
Siz professional futbol taktik tahlilchisisiz (Scout). 
Quyidagi o'yin statistikasi va yuz bergan voqealar xronologiyasi, hamda o'yinchilarning jismoniy faolligi (tezlik va sprintlar) asosida murabbiy uchun o'zbek tilida professional taktik xulosa yozib bering.

## Jismoniy Faollik (Computer Vision Tracking):
${matchData.players.map((p: any) => `- ${p.name} (${p.pos}): ${p.dist} km yugurdi, ${p.sprints} ta sprint qildi. Eng yuqori tezligi: ${p.topSpeed} km/h`).join('\n')}

## Umumiy Statistika:
- Hisob: Football Club ${matchData.matchStats.fcScore} - ${matchData.matchStats.nvScore} Navbahor
- To'p nazorati: ${matchData.matchStats.fcPossession}% - ${matchData.matchStats.nvPossession}%
- Zarbalar: ${matchData.matchStats.fcShots} (${matchData.matchStats.fcShotsOnTarget} aniq) vs ${matchData.matchStats.nvShots} (${matchData.matchStats.nvShotsOnTarget} aniq)
- Kutilayotgan gollar (xG): ${matchData.matchStats.fcXG} - ${matchData.matchStats.nvXG}

## O'yin voqealari:
${matchData.events.map((e: any) => `- ${Math.floor(e.time / 60)}'${e.time % 60}s: [${e.team}] ${e.player} ${e.type} - ${e.description}`).join('\n')}

Iltimos, javobingizni quyidagi tuzilmada, chiroyli Markdown formatida bering:
1. **O'yin Ritmi va Jismoniy Faollik** (Eng tezkor o'yinchilar, kim ko'p yugurgani va sprint qilgani haqida alohida to'xtaling)
2. **Hujumkorlik** (xG va zarbalar samaradorligi)
3. **Mudofaa va Kamchiliklar**
4. **Murabbiyga Maslahat** (Keyingi taym yoki o'yin uchun)
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
          { role: 'system', content: 'You are a professional football tactical analyst.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error('Tahlil olishda xatolik yuz berdi.');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('AI Service Error:', error);
    throw error;
  }
};
