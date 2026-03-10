const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Enable CORS for all routes so the frontend can easily connect
app.use(cors());
app.use(express.json());

// Set your Fast2SMS API Key here
const FAST2SMS_API_KEY = 'dU1dBOnyOkYhaSYmrVyprVxkyJJ8kRuHWqgvPiAHyIQLhrbje79jTQnNyjRf';

app.post('/send-sms', async (req, res) => {
    try {
        const { phone, message } = req.body;

        if (!phone || !message) {
            return res.status(400).json({ success: false, error: "Phone and message are required." });
        }

        // Fast2SMS supports GET requests where auth and params are in the URL.
        const baseUrl = 'https://www.fast2sms.com/dev/bulkV2';
        const queryParams = new URLSearchParams({
            authorization: FAST2SMS_API_KEY,
            route: 'v3',
            sender_id: 'TXTIND', // Default/free sender routing
            message: message,
            language: 'english',
            flash: 0,
            numbers: phone,
        });

        const targetUrl = `${baseUrl}?${queryParams.toString()}`;

        // This is sent directly from Node.js securely (no browser blocks)
        const fetch = (await import('node-fetch')).default;
        const response = await fetch(targetUrl);
        const data = await response.json();

        // Fast2SMS returns 'return: true' on success
        if (response.ok && data.return === true) {
            console.log(`[SUCCESS] SMS sent to ${phone}`);
            return res.json({ success: true, data: data });
        } else {
            console.error(`[FAST2SMS API FAILED]`, data);
            return res.status(400).json({ success: false, error: data.message || "Fast2SMS API rejected the request." });
        }
    } catch (error) {
        console.error('[SERVER ERROR]', error);
        return res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`UrbanSaarthi SMS Proxy Server running on http://localhost:${PORT}`);
    console.log(`Waiting for frontend to trigger SMS...`);
});
