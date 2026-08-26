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
        const targetLang = req.body.target_lang || 'es';
        const apiKey = process.env.ELEVENLABS_API_KEY;

        if (!apiKey) {
            return res.status(500).json({ error: "API Key missing" });
        }

        const data = new FormData();
        data.append('file', fs.createReadStream(req.file.path), req.file.originalname);
        data.append('target_lang', targetLang);

        const response = await axios.post('https://api.elevenlabs.io/v1/dubbing', data, {
            headers: {
                'xi-api-key': apiKey,
                ...data.getHeaders()
            }
        });

        fs.unlinkSync(req.file.path);
        res.json({ success: true, dubbing_id: response.data.dubbing_id });

    } catch (error) {
        res.status(500).json({ error: "Dubbing failed" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
