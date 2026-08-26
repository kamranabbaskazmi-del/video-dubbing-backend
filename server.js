const express = require('express');
const cors = require('cors');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const app = express();
app.use(cors());

const upload = multer({ dest: 'uploads/' });

app.post('/api/dub', upload.single('video'), async (req, res) => {
  try {
    const targetLang = req.body.targetLang;
    const apiKey = process.env.ELEVENLABS_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "API Key not configured on server" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No video file provided" });
    }

    res.json({ dubbedVideoUrl: "https://www.w3schools.com/html/mov_bbb.mp4" });

    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to process video" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

