import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const HF_KEY = process.env.HF_KEY;

app.post("/qa", async (req, res) => {
  const { text, lang } = req.body;

  try {
    const hfRes = await fetch(
      "https://api-inference.huggingface.co/models/google/flan-t5-base",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${HF_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs: text
        })
      }
    );

    const result = await hfRes.json();
    console.log("HF RAW:", result);

    let answer =
      result?.[0]?.generated_text ||
      result?.generated_text ||
      "No answer";

    res.json({ reply: answer });

  } catch (err) {
    console.error(err);
    res.json({ reply: "Try again" });
  }
});

app.get("/", (req, res) => {
  res.send("Backend running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server started on", PORT);
});
