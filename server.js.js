import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const HF_KEY = process.env.HF_KEY;
const MODEL = "https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill";

async function callHF(prompt) {
  const r = await fetch(MODEL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${HF_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ inputs: prompt })
  });
  const d = await r.json();
  return d[0]?.generated_text || "Try again";
}

app.post("/qa", async (req, res) => {
  const { text, lang } = req.body;
  const prompt =
    lang === "ta"
      ? `Answer in simple Tanglish with example:\n${text}`
      : `Answer with explanation and example:\n${text}`;
  res.json({ reply: await callHF(prompt) });
});

app.post("/code", async (req, res) => {
  const prompt = `Generate clean code:\n${req.body.text}`;
  res.json({ code: await callHF(prompt) });
});

app.listen(3000, () => console.log("Backend running"));
