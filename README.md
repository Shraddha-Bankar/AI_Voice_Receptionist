<<<<<<< HEAD
# Vaaniai — AI Voice Receptionist

AI-powered voice receptionist for City General Hospital, Nagpur.  
Supports **English, Hindi, and Marathi** with real two-way voice conversation.

---

## 🚀 Deploy to Vercel (5 minutes)

### Option A — Vercel CLI
```bash
npm install -g vercel
cd vaaniai
vercel
# Follow prompts. No build step needed — it's a static site.
```

### Option B — Vercel Dashboard (drag & drop)
1. Go to https://vercel.com → New Project
2. Drag and drop the `vaaniai` folder
3. Click Deploy — done!

### Option C — GitHub + Vercel (recommended for ongoing use)
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/vaaniai.git
git push -u origin main
# Then import the repo at vercel.com/new
```

---

## 🔑 API Key Setup

1. Get a free key at **https://openrouter.ai** (sign up → Keys → Create)
2. In the running app: go to **Settings** → paste your key → Save
   - OR edit `src/services/openrouter.js` and add your key to `FALLBACK_KEYS`

> Without a key the app runs in **simulation mode** — good for testing UI.

---

## 🎙️ Using the Voice Agent

1. Open the app in **Google Chrome or Microsoft Edge** (required for Web Speech API)
2. Go to **Dashboard** → click **Start Agent**
3. Allow microphone access when prompted
4. Speak — Priya will greet you and start a conversation
5. Works in English, Hindi, and Marathi — language is auto-detected

---

## 🏗️ Project Structure

```
vaaniai/
├── index.html              ← SPA entry point (all CSS + routing)
├── vercel.json             ← Vercel deployment config
├── src/
│   ├── components/
│   │   ├── voiceOrb.js     ← Voice agent UI + conversation loop
│   │   ├── sidebar.js      ← Navigation
│   │   ├── topbar.js       ← Header
│   │   ├── charts.js       ← SVG charts
│   │   └── modals.js       ← Popup dialogs
│   ├── pages/
│   │   ├── dashboard.js    ← Main dashboard
│   │   ├── calls.js        ← Call logs
│   │   ├── appointments.js ← Appointment manager
│   │   ├── crm.js          ← Contacts / CRM
│   │   ├── analytics.js    ← Analytics charts
│   │   ├── transcripts.js  ← Call transcripts
│   │   ├── notifications.js← Alerts
│   │   ├── voiceConfig.js  ← Agent configuration
│   │   └── settings.js     ← App settings
│   ├── services/
│   │   ├── openrouter.js   ← LLM API (OpenRouter)
│   │   ├── speech.js       ← STT + TTS (Web Speech API)
│   │   ├── intentDetector.js
│   │   └── languageDetector.js
│   ├── store/appState.js   ← Global state
│   └── utils/
│       ├── constants.js    ← Mock data + config
│       └── formatters.js   ← Date/time helpers
└── public/favicon.svg
```

---

## 🐛 Fixed Issues (v1.1)

| Issue | Fix |
|-------|-----|
| Start Agent did nothing | `voiceOrb.js` rewritten — proper TTS→STT→LLM loop |
| TTS cut off mid-sentence | Long utterances split into chunks, Chrome bug workaround |
| No Marathi support | Language detector + STT locale `mr-IN` added |
| Language not switching | Detected language now updates STT locale dynamically |
| API key not persisted | Saved to `localStorage`, restored on page load |
| Voices list empty on Chrome | Proper async `voiceschanged` wait + fallback timeout |
| Simulated responses used Aria | Updated to Priya + City General Hospital |
| No toast helper globally | `window.__showToast` added to index.html |
| `window.__formatters` missing | Exposed from formatters.js for modal use |

---

## 💡 Tips

- **Microphone not working?** Check browser permissions (address bar → lock icon)
- **TTS not speaking?** Chrome requires a user gesture before audio — clicking Start Agent counts
- **Marathi voice unavailable?** Chrome on Android has `mr-IN` voices; desktop Chrome may fall back to Hindi
- **Rate limited?** Add 2–3 OpenRouter keys in `FALLBACK_KEYS` in `openrouter.js`
=======
# AI Voice Receptionist  

## Author  
Shraddha Bankar  

## Affiliation  
Computer Science Engineering (Data Science)  

## Date  
March 2026  

---

## Abstract  
This project is about building an AI Voice Receptionist that can handle tasks like answering queries, booking appointments, and sending reports.  

It works using voice and chat, and also supports multiple languages. Reports can be shared through WhatsApp and email, and all data is stored in a database.  

The system helps reduce manual work and provides fast and 24/7 service.  

---

## Introduction  
In places like hospitals, receptionists manage calls, appointments, and records. This can take a lot of time and effort.  

This project creates an AI-based receptionist that can do these tasks automatically using voice and chat. The goal is to save time, reduce workload, and improve user experience.  

---

## Literature Review  
AI assistants like Alexa and Google Assistant show how voice technology can help users.  

Most systems support only voice or chat, but this project combines both along with features like multi-language support and report sharing.  

---

## Methodology  
- Take input through voice or chat  
- Convert voice to text  
- Understand user request using NLP  
- Perform actions (book appointment, send report, etc.)  
- Convert response back to voice  
- Store all data in database  

---

## Implementation  

**Language:** Python  

**Technologies:**  
- SpeechRecognition  
- gTTS / pyttsx3  
- NLTK / spaCy  
- Flask / Django  
- Twilio API  
- SMTP  

**Tools:**  
- VS Code  
- Jupyter Notebook  
- Google Colab  
- GitHub  
- MySQL / MongoDB  

---

## Results  
The system can book appointments, answer questions, and send reports successfully.  

It supports voice and chat, making it easy to use. It also reduces manual work and improves response time.  

---

## Limitations  
- Depends on voice clarity  
- Cannot handle very complex queries  
- Needs internet connection  
- Accent may affect accuracy  

---

## Future Scope  
- Improve AI understanding  
- Add more languages  
- Build mobile app  
- Better security and privacy  

---

## Conclusion  
This project shows how AI can automate receptionist tasks using voice and chat.  

It is simple, useful, and can be used in hospitals and service industries.  

---

## References  
1. Speech Recognition Systems (2021)  
2. NLP Applications (2020)  
3. https://cloud.google.com/speech-to-text  
4. https://www.twilio.com/  
>>>>>>> 9a2a165d33eaf3b8f5c7cf9a84c3e32bed244c49
