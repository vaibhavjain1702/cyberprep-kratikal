# CyberPrep — Kratikal Interview Preparation

A self-contained, browser-based cybersecurity learning tool for preparing for the Kratikal Tech interview. It covers VAPT, OWASP, networking, Linux and more, with progress tracking and a built-in study chatbot.

**Live demo:** <https://cyberprep-kratikal.vercel.app>

## Features

- **Structured modules** with a sidebar navigator and per-topic progress tracking
- **Overall progress bar** and estimated time remaining
- **Study chatbot** with an offline knowledge base, plus an optional AI mode powered by the Google Gemini API
- **Responsive layout** that works on desktop and mobile
- **No build step, no dependencies** — plain HTML, CSS and JavaScript

## Tech stack

| Layer | Technology |
| --- | --- |
| Markup | HTML5 |
| Styling | CSS3 |
| Logic | Vanilla JavaScript (ES6+) |
| AI (optional) | Google Gemini API |

## Project structure

```
.
├── index.html    # App shell and entry point
├── style.css     # Styles and responsive layout
├── app.js        # Modules, content, navigation and progress tracking
└── chatbot.js    # Study chatbot (offline knowledge base + optional Gemini mode)
```

## Getting started

No installation is required. Clone the repository and serve it with any static file server:

```bash
git clone https://github.com/vaibhavjain1702/cyberprep-kratikal.git
cd cyberprep-kratikal

# Option 1: open index.html directly in your browser
# Option 2: serve locally
python3 -m http.server 8000
```

Then visit <http://localhost:8000>.

## Enabling AI mode (optional)

The chatbot works offline out of the box. For richer answers:

1. Create a free API key at [Google AI Studio](https://aistudio.google.com/apikey).
2. Open the chatbot settings and paste the key.

The key is stored only in your browser's `localStorage` and is sent only to Google's Gemini API. It is never committed to this repository.

## Deployment

The site is fully static and deploys to any static host (Vercel, Netlify, GitHub Pages) with no configuration.

## Disclaimer

This is an independent study aid and is not affiliated with or endorsed by Kratikal Tech. Security content is provided for educational purposes only.
