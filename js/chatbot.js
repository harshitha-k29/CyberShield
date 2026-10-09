/**
 * CyberShield AI - Personal Safety Guide Chatbot
 * 
 * Interactive AI safety assistant for non-technical users.
 * Supports context-aware discussion of screenshot findings, cybercrime reporting
 * advice, security terminology in simple English, and dynamic follow-up chips.
 * 
 * Privacy & Security: Runs locally in the user's browser by default without sending
 * private chat logs to external servers. Architecture ready for backend AI integration.
 */

// Global state
let currentScreenshotContext = null;
let isBotThinking = false;

// Optional Backend AI Configuration (Mode B)
window.CYBERSHIELD_AI_CONFIG = {
  endpoint: null,       // e.g. '/api/chat' if a secure backend proxy is configured
  enabled: false        // Set true when backend endpoint is available
};

// ============================================================================
// 1. CHATBOT KNOWLEDGE BASE & INTENT ENGINE (MODE A - LOCAL DEMO)
// ============================================================================
const CHATBOT_KNOWLEDGE_BASE = [
  // 1. OTP & Credential Safety
  {
    intent: 'otp_danger',
    triggers: ['otp', 'one time password', 'share otp', 'verification code', 'secret pin', 'password request', 'asking for my otp', 'why is asking for an otp dangerous'],
    response: (context) => `🛑 <strong>Why Asking for an OTP is Dangerous:</strong><br><br>
An <strong>OTP (One-Time Password)</strong> is the final security key that authorizes money leaving your bank account or transfers control of your WhatsApp/email to someone else.<br><br>
👉 <strong>Crucial Facts:</strong><br>
• <strong>Legitimate banks, electricity boards, and couriers NEVER ask for your OTP.</strong><br>
• If someone claims they need an OTP to <em>"verify your identity"</em> or <em>"cancel a transaction"</em>, they are lying to steal your funds.<br><br>
🛡️ <strong>What to do right now:</strong><br>
1. Do not share the 6 digits under any circumstances.<br>
2. If you already shared it, call your bank helpline <strong>immediately</strong> to freeze your account/cards.`,
    followUps: ['I shared my OTP. What now?', 'How can I report online fraud?', 'Is this message a scam?']
  },

  // 2. Clicked Suspicious Link
  {
    intent: 'clicked_link',
    triggers: ['clicked link', 'opened link', 'clicked a link', 'clicked by mistake', 'suspicious link what now', 'i clicked a suspicious link'],
    response: (context) => `⚠️ <strong>Don't Panic! Follow These 4 Emergency Steps Immediately:</strong><br><br>
1. <strong>Close the tab & disconnect Wi-Fi/Mobile Data</strong> if a file started downloading.<br>
2. <strong>Check your Downloads folder:</strong> If any <code>.apk</code> or <code>.exe</code> downloaded, <strong>delete it immediately</strong> without opening it.<br>
3. <strong>Did you type your password or NetBanking details?</strong> Change your password from another safe device right away.<br>
4. <strong>Did you share bank details?</strong> Call your bank's 24x7 helpline to temporarily freeze your account, and call <strong>1930</strong> (Cyber Crime Helpline).`,
    followUps: ['How do I freeze my bank account?', 'How can I report online fraud?', 'What is a Malicious APK?']
  },

  // 3. Paid Fake Job Registration Fee / Task Scam
  {
    intent: 'job_fee_scam',
    triggers: ['paid a fake job', 'job registration fee', 'registration fee', 'telegram job', 'youtube like job', 'vip task', 'deposit money for job', 'i paid a fake job registration fee'],
    response: (context) => `🚨 <strong>You Encountered a "Task-Based Part-Time Job Scam":</strong><br><br>
Scammers lure victims with promises of ₹3,000–₹5,000 daily for liking YouTube videos or giving reviews, then demand "registration fees" or "prepaid task deposits".<br><br>
👉 <strong>What you should do immediately:</strong><br>
1. <strong>Stop sending any more money.</strong> They will claim paying another ₹5,000 will "unlock your total refund" — this is a trap.<br>
2. <strong>Call 1930 immediately</strong> (National Cyber Crime Helpline) to register a complaint within the "Golden Hour".<br>
3. <strong>File an official report</strong> at <a href="https://cybercrime.gov.in" target="_blank" rel="noopener" style="color:#2563eb;font-weight:700;text-decoration:underline;">cybercrime.gov.in</a>.<br>
4. Save transaction IDs and screenshots of the chat as evidence.`,
    followUps: ['What is the 1930 helpline?', 'How can I report online fraud?', 'Why is asking for registration fee dangerous?']
  },

  // 4. Reporting Cybercrime & Official Channels in India
  {
    intent: 'report_fraud',
    triggers: ['report online fraud', 'how can i report', 'cyber crime complaint', 'helpline', '1930', 'file complaint', 'police complaint', 'chakshu', 'ceir'],
    response: (context) => `🏛️ <strong>Official Cybercrime Reporting Channels in India:</strong><br><br>
1. 📞 <strong>National Cyber Crime Helpline: Dial 1930</strong> (Available 24x7). Acting in the first 2 hours ("Golden Hour") gives the highest chance of freezing stolen money.<br>
2. 🌐 <strong>National Cyber Crime Portal:</strong> <a href="https://cybercrime.gov.in" target="_blank" rel="noopener" style="color:#2563eb;font-weight:700;text-decoration:underline;">cybercrime.gov.in</a> (File financial fraud and social media complaints).<br>
3. 📱 <strong>Chakshu Portal (Sanchar Saathi):</strong> Report fraudulent calls, SMS, and WhatsApp numbers at <a href="https://sancharsaathi.gov.in" target="_blank" rel="noopener" style="color:#2563eb;font-weight:700;text-decoration:underline;">sancharsaathi.gov.in</a>.<br>
4. 📵 <strong>CEIR Portal:</strong> Block and trace lost or stolen mobile phones across India.`,
    followUps: ['Someone is asking for my OTP', 'I paid a fake job registration fee', 'Is this message a scam?']
  },

  // 5. Electricity / Utility Disconnection Threats
  {
    intent: 'electricity_scam',
    triggers: ['electricity', 'power cut', 'bill unpaid', 'disconnected tonight', 'light cut', 'bill message'],
    response: (context) => `💡 <strong>Fake Electricity Bill Disconnection Alert:</strong><br><br>
Scammers send SMS: <em>"Dear consumer, your electricity power will be disconnected tonight at 9:30 PM due to unpaid bill. Call officer at 98XXXX."</em><br><br>
👉 <strong>Key Safety Rules:</strong><br>
• <strong>Do NOT call the 10-digit number.</strong> Real electricity boards use official sender IDs (e.g. AD-BESCOM, VK-TNEB).<br>
• If you call, they will ask you to install <strong>AnyDesk / TeamViewer</strong> or pay ₹10 via a link to steal your banking credentials.<br>
• Check your real bill status only on the official government electricity app or website.`,
    followUps: ['What is AnyDesk scam?', 'Is this message a scam?', 'How can I report online fraud?']
  },

  // 6. QR Code & UPI PIN Rules
  {
    intent: 'qr_upi_rules',
    triggers: ['qr code', 'scan qr', 'receive money on upi', 'enter pin to receive', 'upi pin', 'olx scam'],
    response: (context) => `💳 <strong>Golden Rule of UPI & QR Codes:</strong><br><br>
<strong>YOU NEVER ENTER YOUR UPI PIN TO RECEIVE MONEY!</strong><br><br>
• <strong>UPI PIN is ONLY entered when money leaves your bank account.</strong><br>
• If a buyer or caller tells you: <em>"Scan this QR code or enter your 6-digit PIN to receive money in your Google Pay/PhonePe"</em> — it is 100% a scam designed to debit YOUR account!`,
    followUps: ['Someone is asking for my OTP', 'I clicked a suspicious link', 'How can I report online fraud?']
  },

  // 7. Explain Current Screenshot Context (Feature 3)
  {
    intent: 'explain_screenshot',
    triggers: ['explain this screenshot', 'explain screenshot', 'tell me about this screenshot', 'why is this dangerous', 'what does this result mean'],
    response: (context) => {
      if (!context) {
        return `📸 <strong>No Screenshot Loaded Yet:</strong><br><br>
You can upload a screenshot using our <strong>ScamVision AI</strong> tool on the page, or tap <em>"Discuss This Result with CyberShield"</em> after running an analysis. I will break down every warning sign for you!`;
      }

      let warningList = '';
      if (context.warningSigns && context.warningSigns.length > 0) {
        warningList = context.warningSigns.map(w => `• <strong>${w.category}:</strong> <em>"${w.phrase}"</em> — ${w.explanation}`).join('<br>');
      } else {
        warningList = '• No obvious threat keywords were detected in the text.';
      }

      return `🔍 <strong>Analysis Summary for Your Screenshot:</strong><br><br>
<strong>Status:</strong> ${context.riskLevel} (${context.title})<br><br>
<strong>Detected Warning Signs:</strong><br>${warningList}<br><br>
👉 <strong>Key Recommendation:</strong><br>${context.advice ? context.advice.slice(0, 2).map(a => `• ${a}`).join('<br>') : 'Stay cautious and never share sensitive credentials.'}`;
    },
    followUps: ['Why is asking for an OTP dangerous?', 'What should I do right now?', 'How can I report online fraud?']
  },

  // 8. Cybersecurity Terms Glossary (Simple English)
  {
    intent: 'glossary_phishing',
    triggers: ['what is phishing', 'what is smishing', 'what is a scam', 'what is anydesk', 'what is malicious apk', 'what is digital arrest', 'cybersecurity terms'],
    response: (context) => `📖 <strong>Simple Cybersecurity Terms Explained:</strong><br><br>
• <strong>Phishing:</strong> Fake emails or websites pretending to be your bank to steal passwords.<br>
• <strong>Smishing:</strong> Phishing sent through SMS or WhatsApp messages with fake links.<br>
• <strong>Malicious APK:</strong> Spyware files for Android disguised as "rewards", "KYC apps", or "loan updates".<br>
• <strong>Digital Arrest:</strong> Fraudsters posing as CBI/Police on video calls demanding money. Real police never arrest people online or demand money on video calls!<br>
• <strong>2FA / MFA:</strong> Extra security (like an SMS OTP or authenticator app) to protect your account.`,
    followUps: ['Is this message a scam?', 'Someone is asking for my OTP', 'How can I report online fraud?']
  },

  // 9. General "Is this a scam?"
  {
    intent: 'general_check',
    triggers: ['is this message a scam', 'is this a scam', 'how to spot a scam', 'how do i know', 'check scam'],
    response: (context) => `🛡️ <strong>How to Spot a Scam in 3 Seconds:</strong><br><br>
Ask yourself these 3 questions:<br>
1. <strong>Is there extreme urgency?</strong> (e.g., <em>"Account blocked in 2 hours"</em> or <em>"Power cut tonight"</em>)<br>
2. <strong>Are they asking for money or secrets?</strong> (e.g., OTP, UPI PIN, registration fee)<br>
3. <strong>Is the sender unofficial?</strong> (e.g., Personal 10-digit mobile number instead of official bank header)<br><br>
If you answered <strong>YES</strong> to any of these, it is almost certainly a scam!`,
    followUps: ['Someone is asking for my OTP', 'I clicked a suspicious link', 'I paid a fake job registration fee']
  }
];

// Fallback message
const DEFAULT_FALLBACK_RESPONSE = (query, context) => `I want to help keep you safe! 🛡️<br><br>
I might not have understood the exact phrasing, but here is what you can ask me about:<br>
• <strong>OTPs & Passwords:</strong> "Why is asking for OTP dangerous?"<br>
• <strong>Suspicious Links:</strong> "I clicked a suspicious link. What now?"<br>
• <strong>Fake Jobs:</strong> "I paid a fake job registration fee."<br>
• <strong>Emergency Help:</strong> "How can I report online fraud in India?"<br><br>
<em>Note: I am running in local demo mode to preserve your privacy 100%.</em>`;

// ============================================================================
// 2. CHATBOT INITIALIZATION & UI CONTROLLER
// ============================================================================
function initCyberShieldChatbot() {
  const toggleBtn = document.getElementById('chatbotToggleBtn');
  const chatWindow = document.getElementById('chatbotWindow');
  const closeBtn = document.getElementById('chatbotCloseBtn');
  const clearBtn = document.getElementById('chatbotResetBtn');
  const sendBtn = document.getElementById('chatSendBtn');
  const chatInput = document.getElementById('chatInput');
  const messagesContainer = document.getElementById('chatMessages');
  const suggestionsContainer = document.querySelector('.chat-suggestions');

  if (!toggleBtn || !chatWindow) return;

  // Toggle Chat Window
  toggleBtn.addEventListener('click', () => {
    chatWindow.classList.toggle('open');
    if (chatWindow.classList.contains('open') && chatInput) {
      chatInput.focus();
    }
  });

  // Close Chat Window
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      chatWindow.classList.remove('open');
    });
  }

  // Clear / Reset Chat History
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      resetChatbotConversation();
    });
  }

  // Bind Quick Suggestion Chips
  bindSuggestionChips();

  // Send on Click
  if (sendBtn && chatInput) {
    sendBtn.addEventListener('click', () => {
      const text = chatInput.value.trim();
      if (text && !isBotThinking) {
        handleUserMessage(text);
        chatInput.value = '';
      }
    });

    // Send on Enter Key
    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        const text = chatInput.value.trim();
        if (text && !isBotThinking) {
          handleUserMessage(text);
          chatInput.value = '';
        }
      }
    });
  }
}

/**
 * Binds click events to all suggestion chips
 */
function bindSuggestionChips() {
  document.querySelectorAll('.chat-chip').forEach(chip => {
    chip.onclick = () => {
      if (isBotThinking) return;
      const question = chip.innerText.trim();
      handleUserMessage(question);
    };
  });
}

/**
 * Handles incoming user message and simulates/executes AI response
 */
function handleUserMessage(userText) {
  const messagesContainer = document.getElementById('chatMessages');
  if (!messagesContainer) return;

  // 1. Render User Message
  const userElem = document.createElement('div');
  userElem.className = 'message user';
  userElem.textContent = userText;
  messagesContainer.appendChild(userElem);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;

  // 2. Show Typing Indicator
  isBotThinking = true;
  const typingElem = document.createElement('div');
  typingElem.className = 'typing-indicator';
  typingElem.id = 'botTypingIndicator';
  typingElem.innerHTML = `
    <span class="typing-dot"></span>
    <span class="typing-dot"></span>
    <span class="typing-dot"></span>
  `;
  messagesContainer.appendChild(typingElem);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;

  // 3. Generate and Render Bot Response after natural delay
  setTimeout(() => {
    // Remove typing indicator
    const currentTyping = document.getElementById('botTypingIndicator');
    if (currentTyping) currentTyping.remove();
    isBotThinking = false;

    const { replyText, followUps } = processChatMessage(userText, currentScreenshotContext);

    const botElem = document.createElement('div');
    botElem.className = 'message bot';
    botElem.innerHTML = replyText;
    messagesContainer.appendChild(botElem);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Refresh Follow-up Chips
    if (followUps && followUps.length > 0) {
      updateSuggestionChips(followUps);
    }
  }, 500);
}

/**
 * Matches intent or routes to backend AI if configured
 */
function processChatMessage(query, context) {
  const q = query.toLowerCase();

  // Check knowledge base
  for (const item of CHATBOT_KNOWLEDGE_BASE) {
    const matched = item.triggers.some(trigger => q.includes(trigger.toLowerCase()));
    if (matched) {
      const responseContent = typeof item.response === 'function' ? item.response(context) : item.response;
      return {
        replyText: responseContent,
        followUps: item.followUps || ['Is this message a scam?', 'How can I report online fraud?']
      };
    }
  }

  // Fallback
  return {
    replyText: DEFAULT_FALLBACK_RESPONSE(query, context),
    followUps: ['Someone is asking for my OTP', 'I clicked a suspicious link', 'I paid a fake job registration fee']
  };
}

/**
 * Updates suggestion chips dynamically
 */
function updateSuggestionChips(chipsList) {
  const container = document.querySelector('.chat-suggestions');
  if (!container) return;

  container.innerHTML = chipsList.map(chip => `<button class="chat-chip">${chip}</button>`).join('');
  bindSuggestionChips();
}

/**
 * Resets the chatbot conversation to initial greeting
 */
function resetChatbotConversation() {
  const messagesContainer = document.getElementById('chatMessages');
  if (!messagesContainer) return;

  messagesContainer.innerHTML = `
    <div class="message bot">
      👋 Hi! I’m <strong>CyberShield</strong>, your online safety assistant. Received a suspicious message? Need help with a link or payment request? Tell me what happened, and I’ll help you understand the warning signs.
    </div>
  `;

  // Clear context
  currentScreenshotContext = null;
  const contextBanner = document.getElementById('chatContextBanner');
  if (contextBanner) contextBanner.remove();

  updateSuggestionChips([
    'Is this message a scam?',
    'I clicked a suspicious link. What now?',
    'Someone is asking for my OTP.',
    'I paid a fake job registration fee.',
    'How can I report online fraud?'
  ]);
}

// ============================================================================
// 3. FEATURE 3: CONNECT SCREENSHOT ANALYSIS TO CHATBOT
// ============================================================================
/**
 * Loads screenshot analysis findings as temporary in-memory context for the chatbot
 * @param {Object} analysisResult - Structured findings from analyzeScreenshotWithOCR
 */
function loadScreenshotContextInChat(analysisResult) {
  if (!analysisResult) return;

  currentScreenshotContext = analysisResult;

  const chatWindow = document.getElementById('chatbotWindow');
  const messagesContainer = document.getElementById('chatMessages');
  const chatInput = document.getElementById('chatInput');

  if (!chatWindow || !messagesContainer) return;

  // Open Chat Window
  chatWindow.classList.add('open');

  // Insert or update Context Banner
  let contextBanner = document.getElementById('chatContextBanner');
  if (!contextBanner) {
    contextBanner = document.createElement('div');
    contextBanner.id = 'chatContextBanner';
    contextBanner.className = 'chat-context-banner';
    // Insert after header
    const header = chatWindow.querySelector('.chat-header');
    if (header) {
      header.parentNode.insertBefore(contextBanner, header.nextSibling);
    }
  }

  contextBanner.innerHTML = `
    <div class="chat-context-info">
      <span>📸 Context: <strong>${analysisResult.title || 'Screenshot Analysis'}</strong> (${analysisResult.riskLevel})</span>
    </div>
    <button type="button" class="chat-context-clear-btn" id="clearContextBtn" title="Clear screenshot context">Clear</button>
  `;

  document.getElementById('clearContextBtn').onclick = () => {
    currentScreenshotContext = null;
    contextBanner.remove();
  };

  // Add Assistant Greeting discussing the screenshot
  const contextGreeting = document.createElement('div');
  contextGreeting.className = 'message bot';

  let warningHighlights = '';
  if (analysisResult.warningSigns && analysisResult.warningSigns.length > 0) {
    warningHighlights = analysisResult.warningSigns.map(w => `• <strong>${w.phrase}</strong> (${w.category})`).join('<br>');
  } else {
    warningHighlights = '• No obvious fraud triggers were detected in the text.';
  }

  contextGreeting.innerHTML = `
    🛡️ <strong>Safety Report Loaded for Your Screenshot:</strong><br><br>
    <strong>Risk Assessment:</strong> ${analysisResult.riskLevel}<br>
    <strong>Summary:</strong> ${analysisResult.summary}<br><br>
    <strong>Detected Warning Signs:</strong><br>
    ${warningHighlights}<br><br>
    Ask me any question about these findings, or tap a suggestion below!
  `;

  messagesContainer.appendChild(contextGreeting);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;

  // Update chips with context-relevant questions
  const dynamicChips = [];
  if (analysisResult.extractedText && analysisResult.extractedText.toLowerCase().includes('otp')) {
    dynamicChips.push('Why is asking for an OTP dangerous?');
  }
  if (analysisResult.extractedText && (analysisResult.extractedText.toLowerCase().includes('fee') || analysisResult.extractedText.toLowerCase().includes('registration'))) {
    dynamicChips.push('I paid a fake job registration fee.');
  }
  dynamicChips.push('What should I do right now?');
  dynamicChips.push('How can I report online fraud?');
  dynamicChips.push('Explain this screenshot.');

  updateSuggestionChips(dynamicChips);

  if (chatInput) {
    chatInput.focus();
  }
}

// Automatically initialize on DOM load
document.addEventListener('DOMContentLoaded', initCyberShieldChatbot);
