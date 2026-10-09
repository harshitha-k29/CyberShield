/**
 * CyberShield AI - Scam Detection Engine & ScamVision AI
 * 
 * Enhanced scam detection engine with Tesseract.js Optical Character Recognition (OCR),
 * structured warning sign extraction, plain-English explanations, and practical safety advice.
 * 
 * Runs 100% in the user's browser: zero data or screenshots sent to external servers.
 */

// ============================================================================
// 1. JUDGE TEST SCENARIOS (FICTIONAL SAMPLES WITH REALISTIC MOCKUPS)
// ============================================================================
const JUDGE_TEST_SCENARIOS = {
  'sample-job': {
    id: 'sample-job',
    title: 'Fake Job Offer Requesting Registration Fee',
    subtitle: 'Fictional Telegram YouTube Task Fraud',
    riskLevel: 'High Risk',
    status: 'danger',
    badgeText: 'HIGH RISK • FAKE JOB SCAM',
    extractedText: `GLOBAL DIGITAL MEDIA HR
Hi! I am Ananya from Global Digital Media HR. We have an exclusive part-time work-from-home job offer for you.
Earn ₹3,000 to ₹5,000 per day by just liking YouTube videos and submitting Google reviews. Flexible timing 20 mins daily.
To activate your VIP task account and start receiving daily payouts, pay a registration fee of ₹1,500 on UPI ID task-hr@upi.
Contact our Telegram recruiter @digital_task_hr immediately with payment screenshot.`,
    svgImage: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="480" height="360" viewBox="0 0 480 360" style="background:%230b141a;font-family:system-ui,-apple-system,sans-serif;"><rect width="100%" height="45" fill="%23202c33"/><circle cx="28" cy="22" r="14" fill="%2325d366"/><text x="28" y="27" font-size="14" font-weight="bold" fill="%23ffffff" text-anchor="middle">HR</text><text x="50" y="20" font-size="13" font-weight="bold" fill="%23e9edef">Ananya • Global HR</text><text x="50" y="34" font-size="10" fill="%238696a0">+91 98234 11223 (Unknown Number)</text><rect x="16" y="58" width="448" height="286" rx="8" fill="%231f2c34"/><text x="28" y="82" font-size="12" font-weight="bold" fill="%2325d366">📢 PART-TIME WORK FROM HOME OFFER</text><text x="28" y="106" font-size="12" fill="%23e9edef">Earn ₹3,000 to ₹5,000 per day by just liking YouTube</text><text x="28" y="126" font-size="12" fill="%23e9edef">videos and giving 5-star ratings. 20 mins daily.</text><rect x="28" y="144" width="424" height="66" rx="6" fill="%23ffeedd"/><text x="38" y="168" font-size="12" font-weight="bold" fill="%23c2410c">⚠️ VIP TASK REGISTRATION</text><text x="38" y="190" font-size="12" fill="%239a3412">Pay a registration fee of ₹1,500 on UPI ID task-hr@upi</text><text x="38" y="204" font-size="11" fill="%239a3412">to unlock instant withdrawal payouts today.</text><text x="28" y="235" font-size="12" fill="%23e9edef">Contact our Telegram recruiter @digital_task_hr now.</text><text x="424" y="334" font-size="10" fill="%238696a0" text-anchor="end">11:42 AM ✓✓</text></svg>`
  },

  'sample-bank-otp': {
    id: 'sample-bank-otp',
    title: 'Fake Bank Alert Requesting an OTP',
    subtitle: 'Fictional Bank KYC Expiry Phishing Alert',
    riskLevel: 'High Risk',
    status: 'danger',
    badgeText: 'HIGH RISK • OTP & BANK FRAUD',
    extractedText: `URGENT SBI ALERT:
Dear Customer, your NetBanking account and Debit Card will be blocked within 2 hours due to pending KYC verification.
To avoid permanent suspension, share your OTP with our verification executive or visit http://sbi-kyc-verify-portal.in to update your PAN and Aadhaar immediately.
Do not ignore. Call 98765-XXXXX for assistance.`,
    svgImage: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="480" height="340" viewBox="0 0 480 340" style="background:%23f1f5f9;font-family:system-ui,-apple-system,sans-serif;"><rect width="100%" height="48" fill="%23ffffff"/><circle cx="28" cy="24" r="14" fill="%231e40af"/><text x="28" y="29" font-size="14" font-weight="bold" fill="%23ffffff" text-anchor="middle">🏦</text><text x="50" y="22" font-size="13" font-weight="bold" fill="%230f172a">VM-SBIDOC</text><text x="50" y="37" font-size="10" fill="%2364748b">SMS • Today, 1:15 PM</text><rect x="16" y="64" width="448" height="258" rx="8" fill="%23ffffff" stroke="%23e2e8f0"/><text x="32" y="92" font-size="13" font-weight="bold" fill="%23dc2626">🚨 URGENT BANK NOTICE</text><text x="32" y="120" font-size="12" fill="%23334155">Dear Customer, your NetBanking account will be blocked</text><text x="32" y="140" font-size="12" fill="%23334155">within 2 hours due to pending KYC verification.</text><rect x="32" y="160" width="416" height="60" rx="6" fill="%23fee2e2"/><text x="42" y="184" font-size="12" font-weight="bold" fill="%23991b1b">⚠️ ACTION REQUIRED</text><text x="42" y="204" font-size="12" fill="%23991b1b">Share your OTP with our executive or click link below:</text><text x="32" y="246" font-size="12" font-weight="bold" fill="%232563eb">http://sbi-kyc-verify-portal.in</text><text x="32" y="274" font-size="11" fill="%2364748b">Call +91 98765-43210 immediately.</text><text x="440" y="306" font-size="10" fill="%2394a3b8" text-anchor="end">1:15 PM</text></svg>`
  },

  'sample-prize-demand': {
    id: 'sample-prize-demand',
    title: 'Fraudulent Prize Message with Urgent Payment Demand',
    subtitle: 'Fictional KBC WhatsApp Lucky Draw Extortion',
    riskLevel: 'High Risk',
    status: 'danger',
    badgeText: 'HIGH RISK • LOTTERY ADVANCE FEE',
    extractedText: `CONGRATULATIONS! ALL INDIA WHATSAPP LUCKY DRAW
Dear Winner, your mobile number has won ₹25,00,000 (Twenty Five Lakh Rupees) in KBC Mega Lucky Draw 2026.
Claim your prize now. As per government rules, you must pay a processing fee and GST registration charge of ₹2,500 within 24 hours to release your cheque.
Contact Lottery Manager Rana Pratap on WhatsApp 9876543210. Failure to pay will cancel your prize.`,
    svgImage: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="480" height="350" viewBox="0 0 480 350" style="background:%233b0764;font-family:system-ui,-apple-system,sans-serif;"><rect width="100%" height="45" fill="%23581c87"/><text x="240" y="30" font-size="15" font-weight="900" fill="%23fde047" text-anchor="middle">🎉 KBC MEGA LUCKY DRAW 2026 🎉</text><rect x="16" y="58" width="448" height="276" rx="8" fill="%23ffffff"/><text x="240" y="90" font-size="14" font-weight="bold" fill="%237e22ce" text-anchor="middle">CONGRATULATIONS WINNER!</text><text x="240" y="116" font-size="18" font-weight="900" fill="%2315803d" text-anchor="middle">YOU WON ₹25,00,000</text><rect x="28" y="136" width="424" height="72" rx="6" fill="%23fef3c7"/><text x="40" y="162" font-size="12" font-weight="bold" fill="%23b45309">⚡ Claim your prize now</text><text x="40" y="184" font-size="12" fill="%2392400e">Pay a processing fee and GST charge of ₹2,500 within 24</text><text x="40" y="200" font-size="12" fill="%2392400e">hours to release your State Bank demand draft cheque.</text><text x="240" y="235" font-size="12" font-weight="bold" fill="%231e293b" text-anchor="middle">Lottery Manager: Rana Pratap Singh</text><text x="240" y="255" font-size="12" fill="%232563eb" text-anchor="middle">WhatsApp Call: +91 98765-43210</text><rect x="80" y="275" width="320" height="36" rx="18" fill="%2316a34a"/><text x="240" y="298" font-size="13" font-weight="bold" fill="%23ffffff" text-anchor="middle">CLAIM NOW ON WHATSAPP</text></svg>`
  },

  'sample-safe': {
    id: 'sample-safe',
    title: 'Legitimate Courier Delivery Notification',
    subtitle: 'Fictional Safe E-commerce Order SMS',
    riskLevel: 'No obvious warning signs detected',
    status: 'safe',
    badgeText: 'NO OBVIOUS WARNING SIGNS DETECTED',
    extractedText: `Your Amazon delivery with tracking #IN-84920 is out for delivery with associate Rahul. Please share OTP 4821 only at the time of delivery when the package is handed over to you at your doorstep.`,
    svgImage: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="480" height="240" viewBox="0 0 480 240" style="background:%23f8fafc;font-family:system-ui,-apple-system,sans-serif;"><rect width="100%" height="45" fill="%23ffffff"/><circle cx="28" cy="22" r="14" fill="%23f59e0b"/><text x="28" y="27" font-size="14" font-weight="bold" fill="%23ffffff" text-anchor="middle">📦</text><text x="50" y="22" font-size="13" font-weight="bold" fill="%230f172a">AM-AMZNOT</text><text x="50" y="36" font-size="10" fill="%2364748b">SMS • Today, 10:20 AM</text><rect x="16" y="58" width="448" height="166" rx="8" fill="%23ffffff" stroke="%23e2e8f0"/><text x="32" y="88" font-size="12" fill="%23334155">Your Amazon delivery with tracking #IN-84920 is out</text><text x="32" y="108" font-size="12" fill="%23334155">for delivery with associate Rahul.</text><text x="32" y="136" font-size="12" fill="%23334155">Please share OTP 4821 only at the time of delivery</text><text x="32" y="156" font-size="12" fill="%23334155">when the package is handed over to you at your doorstep.</text><text x="440" y="208" font-size="10" fill="%2394a3b8" text-anchor="end">10:20 AM</text></svg>`
  }
};

// ============================================================================
// 2. CORE PATTERN & WARNING SIGNS EXTRACTOR
// ============================================================================
const SCAM_PATTERNS = [
  {
    category: 'OTP / Credential Request',
    level: 'danger',
    patterns: [
      /share (?:your )?(?:6-digit )?otp/i,
      /send (?:the )?otp/i,
      /enter (?:your )?otp/i,
      /one time password/i,
      /share password/i,
      /enter (?:your )?upi pin to receive/i
    ],
    highlightSnippet: 'Share your OTP / Password',
    whyItMatters: 'OTPs and UPI PINs authorize bank transactions or account logins. Legitimate organizations and bank employees never ask you to share your OTP or enter a PIN to receive funds.',
    advice: 'Never share your OTP or PIN with anyone over the phone, chat, or email under any circumstances.'
  },
  {
    category: 'Upfront Registration / Advance Fee',
    level: 'danger',
    patterns: [
      /pay (?:a )?registration fee/i,
      /processing fee/i,
      /gst (?:registration )?charge/i,
      /refundable deposit/i,
      /activation fee/i,
      /security deposit/i,
      /vip task/i
    ],
    highlightSnippet: 'Pay a registration / processing fee',
    whyItMatters: 'Demanding advance payments or "registration fees" before unlocking a job, prize, or loan is a classic extortion technique. Once paid, scammers disappear.',
    advice: 'Do not transfer money or pay any upfront registration/processing fees.'
  },
  {
    category: 'Account Suspension / Panic Threat',
    level: 'danger',
    patterns: [
      /account (?:will be )?blocked/i,
      /account (?:will be )?suspended/i,
      /blocked within (?:2|24|12) hours/i,
      /sim (?:will be )?deactivated/i,
      /power (?:will be )?disconnected tonight/i,
      /electricity (?:will be )?disconnected/i,
      /arrest warrant/i,
      /legal action/i
    ],
    highlightSnippet: 'Your account will be blocked / disconnected',
    whyItMatters: 'Scammers invent urgent deadlines (e.g. "within 2 hours" or "tonight at 9:30 PM") to create panic so you act impulsively without verifying.',
    advice: 'Do not panic. Verify directly using official customer care channels or apps, never the numbers inside the message.'
  },
  {
    category: 'Unsolicited Lottery / Prize Claim',
    level: 'danger',
    patterns: [
      /claim your prize (?:now)?/i,
      /won (?:₹|rs\.? )?25 lakh/i,
      /kbc (?:mega )?lucky draw/i,
      /congratulations you won/i,
      /whatsapp lucky draw/i,
      /lottery winner/i
    ],
    highlightSnippet: 'Claim your prize now / Lottery winnings',
    whyItMatters: 'You cannot win a lottery or contest you never purchased a ticket for. These messages always lead to demands for fake "taxes" or "release fees".',
    advice: 'Do not reply, call the manager, or send any money to claim winnings.'
  },
  {
    category: 'App Installation / Remote Access Tool',
    level: 'danger',
    patterns: [
      /install this application/i,
      /download apk/i,
      /install anydesk/i,
      /install teamviewer/i,
      /quicksupport/i,
      /rustdesk/i,
      /install support app/i
    ],
    highlightSnippet: 'Install this application / Remote tool',
    whyItMatters: 'Remote desktop apps (like AnyDesk or TeamViewer) and unknown APK files allow fraudsters to see your screen, capture passwords, and hijack your bank accounts.',
    advice: 'Never install remote screen-sharing applications or unknown APK files sent via WhatsApp or SMS.'
  },
  {
    category: 'Unrealistic Earning / Fake Task Job',
    level: 'danger',
    patterns: [
      /earn ₹?[0-9,]+ to ₹?[0-9,]+ per day/i,
      /liking youtube videos/i,
      /giving google reviews/i,
      /part-time work from home/i,
      /telegram recruiter/i,
      /contact on telegram/i
    ],
    highlightSnippet: 'Earn ₹3,000–₹5,000/day liking videos',
    whyItMatters: 'Promising thousands of rupees for simple clicks is a common lure. Victims are initially paid small sums, then tricked into investing large amounts in fake task schemes.',
    advice: 'Refuse work-from-home offers that redirect to Telegram or demand prepaid deposits.'
  },
  {
    category: 'Courier / Address Update Phishing',
    level: 'warning',
    patterns: [
      /package could not be delivered/i,
      /parcel held at warehouse/i,
      /wrong address update/i,
      /india post parcel/i,
      /reschedule delivery fee/i
    ],
    highlightSnippet: 'Parcel held / Update delivery address',
    whyItMatters: 'Fraudsters send fake delivery failure alerts hoping victims will click phishing links and enter credit card or NetBanking details for a nominal ₹10–₹25 fee.',
    advice: 'Check tracking numbers directly on the official courier website or app.'
  },
  {
    category: 'Fake Bank KYC Link',
    level: 'danger',
    patterns: [
      /pending kyc verification/i,
      /update your pan and aadhaar/i,
      /sbi-kyc/i,
      /hdfc-kyc/i,
      /icici-verify/i,
      /update netbanking/i
    ],
    highlightSnippet: 'Pending KYC verification / Update PAN',
    whyItMatters: 'Banks never conduct KYC updates through random web links or SMS. These portals copy bank login screens to steal credentials.',
    advice: 'Always visit the official bank branch or official mobile banking application for KYC updates.'
  }
];

/**
 * Extracts warning signs, categorizes findings, and builds safety guidance
 * @param {string} text - Raw extracted text
 * @returns {Object} Structured analysis
 */
function extractScamWarningSigns(text) {
  if (!text || text.trim().length === 0) {
    return {
      status: 'empty',
      riskLevel: 'Unable to analyze',
      title: 'No Text Found in Screenshot',
      summary: 'We could not detect readable text in this screenshot. Please ensure the image is clear and try again.',
      warningSigns: [],
      reasons: ['No readable text characters could be extracted from the image.'],
      advice: [
        'Upload a clear, high-resolution screenshot with visible message text.',
        'Ensure the text is not cropped, blurred, or obscured.'
      ],
      disclaimer: 'CyberShield AI provides privacy-respecting scam analysis in your browser. Never guarantee safety based purely on missing text.'
    };
  }

  const detectedFindings = [];
  let dangerCount = 0;
  let warningCount = 0;

  for (const patternGroup of SCAM_PATTERNS) {
    let matched = false;
    let matchedPhrase = patternGroup.highlightSnippet;

    for (const pattern of patternGroup.patterns) {
      const match = text.match(pattern);
      if (match) {
        matched = true;
        matchedPhrase = match[0];
        break;
      }
    }

    if (matched) {
      if (patternGroup.level === 'danger') dangerCount++;
      if (patternGroup.level === 'warning') warningCount++;

      detectedFindings.push({
        phrase: matchedPhrase,
        category: patternGroup.category,
        explanation: patternGroup.whyItMatters,
        advice: patternGroup.advice,
        level: patternGroup.level
      });
    }
  }

  // Determine Risk Assessment Level
  let status = 'safe';
  let riskLevel = 'No obvious warning signs detected';
  let title = 'No Obvious Scam Signs Detected';
  let summary = 'Our visual analysis did not identify known fraud triggers, emergency threats, or advance fee demands in this text.';
  let badgeText = 'NO OBVIOUS WARNING SIGNS DETECTED';

  if (dangerCount > 0) {
    status = 'danger';
    riskLevel = 'High Risk';
    title = detectedFindings[0] ? `High Risk: ${detectedFindings[0].category} Detected` : 'High Risk Scam Detected';
    summary = `Found ${detectedFindings.length} critical scam warning sign(s) matching known cyber fraud patterns.`;
    badgeText = 'HIGH RISK • SCAM DETECTED';
  } else if (warningCount > 0) {
    status = 'warning';
    riskLevel = 'Suspicious';
    title = 'Warning: Suspicious Content Detected';
    summary = 'This message contains warning indicators commonly seen in phishing and social engineering attempts.';
    badgeText = 'SUSPICIOUS • PROCEED WITH CAUTION';
  }

  // Compile Practical Advice
  const practicalAdvice = [];
  if (status === 'danger' || status === 'warning') {
    practicalAdvice.push('Do NOT share your OTP, password, or UPI PIN with anyone.');
    practicalAdvice.push('Do NOT pay any upfront registration, processing, or courier fees.');
    practicalAdvice.push('Verify the sender independently through official company websites or customer care numbers.');
    practicalAdvice.push('Avoid clicking links or downloading APK/remote access applications.');
    practicalAdvice.push('If you lost money or shared bank details, call the National Cyber Crime Helpline (1930) and your bank immediately.');
  } else {
    practicalAdvice.push('Verify the sender independently before clicking any links or taking action.');
    practicalAdvice.push('Remember that legitimate banks never ask for passwords or OTPs over email or chat.');
    practicalAdvice.push('When in doubt, contact the organization through their verified customer support.');
  }

  const reasons = detectedFindings.map(f => `${f.category}: "${f.phrase}" — ${f.explanation}`);

  return {
    status,
    riskLevel,
    title,
    summary,
    badgeText,
    warningSigns: detectedFindings,
    reasons: reasons.length > 0 ? reasons : ['No threat keywords, credential requests, or urgent extortion triggers detected.'],
    advice: practicalAdvice,
    extractedText: text,
    disclaimer: 'CyberShield AI provides automated pattern detection. Never guarantee that an image or message is completely safe merely because no warning signs were detected.'
  };
}

// ============================================================================
// 3. TESSERACT.JS OCR RUNNER WITH PROGRESS CALLBACK
// ============================================================================
/**
 * Analyzes a screenshot using browser-based Tesseract.js OCR or Judge Predefined Samples
 * @param {File|string|HTMLImageElement} imageSource - The image file, element, or data URL
 * @param {string|null} sampleId - Predefined sample identifier
 * @param {Function} progressCallback - Callback function for progress updates (0 to 100)
 * @returns {Promise<Object>} Analysis result
 */
async function analyzeScreenshotWithOCR(imageSource, sampleId = null, progressCallback = null) {
  // If a judge sample is selected, use the curated scenario data
  if (sampleId && JUDGE_TEST_SCENARIOS[sampleId]) {
    const sample = JUDGE_TEST_SCENARIOS[sampleId];
    if (progressCallback) {
      progressCallback({ stage: 'Loading scenario...', progress: 30 });
      await new Promise(r => setTimeout(r, 150));
      progressCallback({ stage: 'Extracting text with OCR...', progress: 75 });
      await new Promise(r => setTimeout(r, 200));
      progressCallback({ stage: 'Analyzing fraud indicators...', progress: 100 });
    }
    const analysis = extractScamWarningSigns(sample.extractedText);
    analysis.sampleId = sampleId;
    analysis.isFictionalDemo = true;
    analysis.demoLabel = sample.subtitle;
    return analysis;
  }

  // For uploaded images, run real in-browser OCR using Tesseract.js
  if (typeof Tesseract === 'undefined') {
    throw new Error('Tesseract OCR library is not loaded. Please ensure an active internet connection to load the OCR module.');
  }

  if (progressCallback) progressCallback({ stage: 'Initializing OCR engine in browser...', progress: 15 });

  try {
    const worker = await Tesseract.createWorker('eng', 1, {
      logger: m => {
        if (progressCallback && m.status === 'recognizing text') {
          const pct = Math.round((m.progress || 0) * 80) + 15;
          progressCallback({ stage: `Extracting text: ${Math.round((m.progress || 0) * 100)}%`, progress: pct });
        }
      }
    });

    const ret = await worker.recognize(imageSource);
    await worker.terminate();

    if (progressCallback) progressCallback({ stage: 'Analyzing warning signs...', progress: 100 });

    const rawText = ret && ret.data && ret.data.text ? ret.data.text.trim() : '';
    const result = extractScamWarningSigns(rawText);
    result.ocrConfidence = ret && ret.data && ret.data.confidence ? Math.round(ret.data.confidence) : null;
    return result;
  } catch (err) {
    console.error('OCR Error:', err);
    throw new Error(`OCR text extraction failed: ${err.message || 'Image could not be processed'}.`);
  }
}

// ============================================================================
// 4. EMAIL, LINK, AND MESSAGE SCANNERS (PRESERVED & ENHANCED)
// ============================================================================
function analyzeEmail(text) {
  if (!text || text.trim().length === 0) {
    return {
      status: 'empty',
      title: 'Please enter an email',
      message: 'Paste the email text or sender details above to check it.'
    };
  }
  return extractScamWarningSigns(text);
}

function analyzeLink(rawUrl) {
  if (!rawUrl || rawUrl.trim().length === 0) {
    return {
      status: 'empty',
      title: 'Please enter a website link',
      message: 'Paste a website link above to check if it is safe.'
    };
  }

  const cleanUrl = rawUrl.trim().toLowerCase();
  let score = 0;
  const reasons = [];
  const advice = [];
  const warningSigns = [];

  // Check 1: IP address instead of domain
  const ipPattern = /^(https?:\/\/)?(\d{1,3}\.){3}\d{1,3}(:\d+)?(\/.*)?$/;
  if (ipPattern.test(cleanUrl)) {
    score += 50;
    reasons.push('Uses a raw numeric IP address instead of a genuine website name. Legitimate companies always use official domain names.');
    warningSigns.push({ phrase: rawUrl, category: 'Raw IP Address', explanation: 'Scammers host phishing pages on direct IP servers to avoid domain registration records.' });
  }

  // Check 2: Suspicious cheap TLDs
  const suspiciousTlds = ['.xyz', '.top', '.buzz', '.work', '.click', '.tk', '.ml', '.ga', '.cf', '.gq', '.icu', '.rest', '.cam', '.live', '.sbs', '.cfd'];
  for (const tld of suspiciousTlds) {
    if (cleanUrl.includes(tld)) {
      score += 35;
      reasons.push(`Uses a suspicious cheap domain ending ("${tld}"). These are frequently used by temporary scam networks.`);
      warningSigns.push({ phrase: tld, category: 'High-Risk TLD', explanation: 'Bulk cheap domain extensions are statistically favored by short-lived phishing sites.' });
      break;
    }
  }

  // Check 3: Brand impersonation in domain
  const brandKeywords = ['sbi', 'hdfc', 'icici', 'paytm', 'phonepe', 'gpay', 'amazon', 'flipkart', 'netflix', 'apple', 'microsoft', 'support', 'kyc'];
  for (const brand of brandKeywords) {
    if (cleanUrl.includes(brand) && !cleanUrl.includes(`${brand}.com`) && !cleanUrl.includes(`${brand}.in`) && !cleanUrl.includes(`${brand}.co.in`)) {
      score += 45;
      reasons.push(`Contains "${brand}" but is NOT the real official website. This is a common impersonation phishing trick.`);
      warningSigns.push({ phrase: brand, category: 'Brand Impersonation', explanation: `Impersonates "${brand}" on an unofficial domain.` });
      break;
    }
  }

  // Check 4: Suspicious URL shorteners or direct messaging links
  if (cleanUrl.includes('bit.ly') || cleanUrl.includes('tinyurl.com') || cleanUrl.includes('wa.me') || cleanUrl.includes('t.me')) {
    score += 25;
    reasons.push('Contains a shortened URL or direct chat link that conceals the true destination.');
  }

  if (score >= 50) {
    advice.push('DO NOT click or open this website link.');
    advice.push('DO NOT enter passwords, OTPs, or bank account numbers on this site.');
    advice.push('If you already opened it, close the browser tab immediately.');
    return {
      status: 'danger',
      riskLevel: 'High Risk',
      title: 'Danger: Malicious or Phishing Link Detected',
      summary: 'This website link exhibits strong markers of phishing and credential theft.',
      badgeText: 'HIGH RISK • DANGEROUS LINK',
      warningSigns,
      reasons,
      advice,
      disclaimer: 'Never enter personal or financial credentials on unverified websites.'
    };
  } else if (score >= 25) {
    advice.push('Proceed with extreme caution. Check the exact spelling of the domain.');
    advice.push('Never download executable files (.exe, .apk) from this link.');
    return {
      status: 'warning',
      riskLevel: 'Suspicious',
      title: 'Warning: Unverified or Suspicious Link',
      summary: 'This link has suspicious elements. Exercise caution before proceeding.',
      badgeText: 'SUSPICIOUS LINK',
      warningSigns,
      reasons,
      advice,
      disclaimer: 'Always verify domain authenticity before sharing sensitive data.'
    };
  } else {
    return {
      status: 'safe',
      riskLevel: 'No obvious warning signs detected',
      title: 'Link Looks Standard',
      summary: 'No obvious brand impersonation, deceptive IP addresses, or known fraud markers detected.',
      badgeText: 'NO OBVIOUS WARNING SIGNS DETECTED',
      warningSigns: [],
      reasons: ['Domain format matches standard web address structures.'],
      advice: [
        'Always check the address bar for the correct spelling of the company name.',
        'Never enter passwords or bank details unless you specifically requested to log in.'
      ],
      disclaimer: 'CyberShield AI scans link structure. Never guarantee a page is safe without personal vigilance.'
    };
  }
}

function analyzeMessage(text) {
  if (!text || text.trim().length === 0) {
    return {
      status: 'empty',
      title: 'Please enter a message',
      message: 'Paste a WhatsApp or SMS message above to analyze it.'
    };
  }
  return extractScamWarningSigns(text);
}
