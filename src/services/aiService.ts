export const generateTacticalAnalysis = async (matchData: any): Promise<string> => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('OpenAI API kaliti topilmadi.');
  }

  const prompt = `
  Siz professional futbol tahlilchisisiz (tactical analyst). 
  Quyidagi o'yin ma'lumotlarini (statistika va sodir bo'lgan voqealarni) o'qib, o'zbek tilida professional taktik tahlil yozib bering.
  Tahlilda ustunlik qilayotgan jamoa, asosiy xavfli o'yinchilar, taktik xatolar va keyingi qadamlar bo'yicha maslahatlar bo'lishi kerak.
  
  Ma'lumot:
  ${JSON.stringify(matchData, null, 2)}
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
