import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { image, style = 'cartoon' } = req.body;

    // Convert base64 to image and send to DALL-E
    const response = await openai.images.edit({
      image: image, // Base64 image data
      prompt: "Transform this pet into a cute cartoon-style trading card artwork with vibrant colors and friendly expression",
      n: 1,
      size: "512x512"
    });

    const aiImageUrl = response.data[0].url;

    res.status(200).json({
      success: true,
      processedImageUrl: aiImageUrl
    });

  } catch (error) {
    console.error('Error processing image:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process image'
    });
  }
}
