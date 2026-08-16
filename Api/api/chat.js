export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Použij POST."
    });
  }

  try {
    const { message } = req.body || {};

    if (!message) {
      return res.status(400).json({
        error: "Chybí zpráva."
      });
    }

    const response = await fetch(
      "https://api.openai.com/v1/responses",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization":
            `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-5.6",
          instructions:
            "Jsi JARVIS, osobní AI asistent. " +
            "Odpovídej přirozeně a profesionálně. " +
            "Rozumíš mnoha jazykům a odpovídej ve stejném jazyce jako uživatel.",
          input: message
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || "Chyba OpenAI."
      });
    }

    return res.status(200).json({
      answer: data.output_text
    });

  } catch (error) {
    return res.status(500).json({
      error: "Chyba serveru."
    });
  }
        }
