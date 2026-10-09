# 🛡️ CyberShield AI — Hackathon Upgrade

**CyberShield AI** is an intelligent, privacy-conscious digital safety platform built to help everyday people—parents, students, small shop owners, and elders—detect online scams, understand fraud warning signs, and take safer actions in seconds.

---

## 🚀 Key Upgraded Features

### 📸 1. ScamVision AI — Screenshot Scam Detector
- **Drag-and-Drop & File Upload**: Supports PNG, JPG, JPEG, and WEBP formats on desktop and mobile.
- **In-Browser Optical Character Recognition (OCR)**: Integrates [Tesseract.js](https://tesseract.projectnaptha.com/) for 100% client-side text extraction without external server transmission.
- **Fraud Warning Signs Extractor**: Detects and highlights critical scam patterns:
  - *"Share your OTP"* / Password / UPI PIN requests
  - *"Pay a registration fee"* / Processing fee / VIP task deposits
  - *"Your account will be blocked"* / 2-hour panic threats
  - *"Claim your prize now"* / Unsolicited lottery winnings
  - *"Install this application"* / Remote access APKs (AnyDesk, TeamViewer)
- **Structured Findings Panel**:
  - **Risk Assessment**: *High Risk* (🚨), *Suspicious* (⚠️), *No Obvious Warning Signs Detected* (✅), or *Unable to Analyze* (ℹ️).
  - **Why This Matters**: Clear, plain-English breakdown of every detected indicator.
  - **What Should I Do?**: Numbered, practical safety action steps.
  - **Collapsible Extracted OCR Drawer**: Shows extracted text and character count.
  - **Copy Safety Report**: One-click plain-text export for sharing with family or police.
  - **Privacy First**: Zero screenshots or private messages are uploaded or stored.

### 💬 2. CyberShield AI Chatbot — Your Personal Safety Guide
- **Floating Assistant**: Shield-shaped icon and `"Ask CyberShield"` toggle button visible on every page.
- **Context-Aware Discussion (Feature 3)**: Tap `"Discuss This Result with CyberShield"` on any screenshot analysis to bridge findings into the chat context.
- **Comprehensive Intent Engine**:
  - Explains why OTPs, remote desktop apps, and registration fees are dangerous.
  - Immediate 4-step emergency guidance after clicking a suspicious link or losing money.
  - Official Indian cybercrime reporting channels: **National Helpline 1930**, **cybercrime.gov.in**, **Chakshu portal**, and **CEIR**.
  - Simple English glossary for technical terms (*Phishing, Smishing, Malicious APKs, 2FA, Digital Arrest*).
- **Interactive UI**:
  - Natural typing indicator animation.
  - Dynamic follow-up chips that adapt after each response.
  - Reset conversation and clear chat controls.
  - **Mode A (Local Demo)** & **Mode B (Backend AI Ready)** architecture.

### 💡 3. Interactive Demo Mode for Judges
Instant 1-click test scenarios with realistic fictional mockups:
1. **Fake Job Offer Requesting a Registration Fee** (Telegram YouTube liking task)
2. **Fake Bank Alert Requesting an OTP** (SBI NetBanking 2-hour suspension notice)
3. **Fraudulent Prize Message with Urgent Payment Demand** (KBC ₹25 Lakhs lucky draw)
4. **Legitimate Courier Delivery Notification** (Safe Amazon order update)

---

## 🎨 Design & Privacy Philosophy

- **Trustworthy Blue & White Palette**: High-contrast, clean typography, badge pills, and accessible layouts.
- **Zero Configuration**: No account creation, API key setup, or external dependencies required to test.
- **No Deceptive Metrics**: Clear pattern explanations without fake percentage scores.
- **Client-Side Privacy**: All processing runs locally inside the user's browser.

---

## 📂 Project Structure

```
CyberShieldAI/
│
├── index.html              # Home Page with Prominent ScamVision AI Card & Chatbot
├── check-screenshot.html   # Dedicated ScamVision AI Screenshot Scanner
├── check-email.html        # Email Phishing & Invoice Scam Detector
├── check-link.html         # URL & Fake Domain Safety Checker
├── check-message.html      # WhatsApp & SMS Fraud Detector
├── blog.html               # Safety Guides & Educational Articles
├── about.html              # Mission & Values Page
├── README.md               # Project documentation
│
├── css/
│   └── style.css           # Blue-and-white responsive CSS design system
│
└── js/
    ├── scanner.js          # ScamVision AI engine, OCR pipeline & fraud rules
    ├── main.js             # UI controller, drag & drop, sample loader & report export
    └── chatbot.js          # CyberShield AI Assistant with context bridge & intent matching
```

---

## 🚀 How to Run

1. Open the project folder in any modern browser:
   - Double-click [`index.html`](file:///c:/Users/ACER/Downloads/CyberShieldAI/index.html) or [`check-screenshot.html`](file:///c:/Users/ACER/Downloads/CyberShieldAI/check-screenshot.html).
2. To test with a live server:
   ```bash
   npx serve .
   # or
   python -m http.server 8000
   ```
3. Test by uploading any screenshot or clicking one of the **Judge Test Scenarios**!
