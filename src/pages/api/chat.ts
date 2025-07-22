import type { NextApiRequest, NextApiResponse } from 'next';

// Use Hugging Face OpenAI-compatible chat completions endpoint
const HF_MODEL_URL = 'https://router.huggingface.co/v1/chat/completions';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  const { prompt } = req.body;
  if (!prompt) {
    res.status(400).json({ error: 'Prompt is required' });
    return;
  }
  // Format messages for OpenAI-compatible endpoint
  const messages = [
    { role: 'user', content: prompt }
  ];
  // Choose a supported model (example: Qwen/Qwen3-8B-Base:featherless-ai)
  const model = 'Qwen/Qwen3-8B-Base:featherless-ai';
  try {
    // Log the token presence (do not log the full token for security)
    console.log('HUGGINGFACE_API_TOKEN present:', !!process.env.HUGGINGFACE_API_TOKEN);
    const hfRes = await fetch(HF_MODEL_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.HUGGINGFACE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages,
      }),
    });
    if (!hfRes.ok) {
      const err = await hfRes.text();
      console.error('Hugging Face API error:', err);
      res.status(hfRes.status).json({ error: err });
      return;
    }
    const data = await hfRes.json();
    // OpenAI-compatible: response.choices[0].message.content
    const text = data.choices?.[0]?.message?.content || 'No response from model.';
    res.status(200).json({ response: text });
  } catch (e) {
    console.error('Exception in /api/chat:', e);
    res.status(500).json({ error: 'Failed to fetch from Hugging Face', details: e instanceof Error ? e.message : e });
  }
}
