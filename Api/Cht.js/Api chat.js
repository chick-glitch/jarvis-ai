export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Použij POST." });
  }

  try {
    const { message } = req.body || {};

    if (!message) {
      return res.status(400).json({ error: "Chybí zpráva." });
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-5.6",
        instructions:
          "Jsi JARVIS, osobní AI asistent. " +
          "Mluv přirozeně, klidně, stručně a profesionálně. " +
          "Rozumíš češtině i angličtině a odpovídej ve stejném jazyce jako uživatel.",
        input: message
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || "Chyba AI."
      });
    }

    return res.status(200).json({
      answer: data.output_text
    });

  } catch (error) {
    return res.status(500).json({
      error: "Serverová chyba."
    });
  }
      }
