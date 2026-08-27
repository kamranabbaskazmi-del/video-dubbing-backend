const express = require('express');
const cors = require('cors');
const multer = require('multer');

const app = express();

// Enable CORS for all domains (Blogger integration ke liye)
app.use(cors());
app.use(express.json());

// Multer setup to handle video file uploads in memory
const upload = multer({ 
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit to prevent crashes
});

// Test route to check if server is awake
app.get('/', (req, res) => {
  res.send('AI Video Dubbing Backend is running!');
});

// Video Dubbing API Route
app.post('/api/dub', upload.single('video'), async (req, res) => {
  try {
    const targetLang = req.body.targetLang;
    const videoFile = req.file;

    if (!videoFile) {
      return res.status(400).json({ error: 'No video file uploaded' });
    }

    // Yahan par aapki AI / ElevenLabs dubbing processing aayegi.
    // Filhaal testing ke liye hum upload ki gayi file ka data wapas bhej rahe hain 
    // ya koi mock success response de rahe hain.
    
    // Note: Vercel serverless functions ki time limit hoti hai (approx 10-15 seconds),
    // isliye bari videos yahan process nahi ho sakti jab tak external queue use na ho.

    res.json({
      success: true,
      message: 'Video received successfully',
      targetLang: targetLang,
      // Test ke liye original ya processed video URL (agar cloud storage par ho)
      dubbedVideoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' 
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

module.exports = app;
