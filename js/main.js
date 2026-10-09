/**
 * CyberShield AI - Main UI Interactivity & ScamVision AI Controller
 * 
 * Handles mobile menu navigation, FAQ accordions, sample fillers,
 * clipboard copy, drag-and-drop image uploads, and rendering ScamVision AI results.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const navLinks = document.getElementById('navLinks');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('show');
      const isExpanded = navLinks.classList.contains('show');
      mobileToggle.setAttribute('aria-expanded', isExpanded);
    });
  }

  // 2. FAQ Accordion Handling
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(questionBtn => {
    questionBtn.addEventListener('click', () => {
      const parentItem = questionBtn.closest('.faq-item');
      const isAlreadyActive = parentItem.classList.contains('active');

      document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
      });

      if (!isAlreadyActive) {
        parentItem.classList.add('active');
      }
    });
  });

  // 3. Quick Sample Text Fillers (for Email / Link / Message tools)
  const sampleButtons = document.querySelectorAll('[data-sample]');
  sampleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const sampleText = btn.getAttribute('data-sample');
      const targetInput = document.getElementById('scannerInput');
      if (targetInput) {
        targetInput.value = sampleText;
        targetInput.focus();
        
        const checkBtn = document.getElementById('checkNowBtn');
        if (checkBtn) {
          checkBtn.click();
        }
      }
    });
  });

  // 4. Clear Input Button
  const clearBtn = document.getElementById('clearInputBtn');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      const targetInput = document.getElementById('scannerInput');
      const resultBox = document.getElementById('resultBox');
      if (targetInput) {
        targetInput.value = '';
        targetInput.focus();
      }
      if (resultBox) {
        resultBox.className = 'result-box';
        resultBox.style.display = 'none';
        resultBox.innerHTML = '';
      }
    });
  }

  // 5. Initialize ScamVision AI Component (if present on current page)
  initScamVisionComponent();
});

// ============================================================================
// SCAMVISION AI COMPONENT CONTROLLER
// ============================================================================
function initScamVisionComponent() {
  const dropzone = document.getElementById('screenshotDropzone');
  const fileInput = document.getElementById('screenshotFileInput');
  const previewContainer = document.getElementById('screenshotPreviewContainer');
  const previewImg = document.getElementById('screenshotPreviewImg');
  const previewFilename = document.getElementById('screenshotFilename');
  const previewFilesize = document.getElementById('screenshotFilesize');
  const removeBtn = document.getElementById('removeScreenshotBtn');
  const replaceBtn = document.getElementById('replaceScreenshotBtn');
  const analyzeBtn = document.getElementById('analyzeScreenshotBtn');
  const progressContainer = document.getElementById('ocrProgressContainer');
  const progressBar = document.getElementById('ocrProgressBar');
  const progressText = document.getElementById('ocrProgressText');
  const resultBox = document.getElementById('screenshotResultBox');

  if (!dropzone || !fileInput || !analyzeBtn) return;

  let currentImageSource = null;
  let currentSampleId = null;

  // File Upload Handlers
  fileInput.addEventListener('change', function(e) {
    if (this.files && this.files[0]) {
      handleSelectedFile(this.files[0]);
    }
  });

  // Drag and Drop
  ['dragenter', 'dragover'].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      dropzone.classList.add('drag-over');
    });
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      dropzone.classList.remove('drag-over');
    });
  });

  dropzone.addEventListener('drop', (e) => {
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleSelectedFile(e.dataTransfer.files[0]);
    }
  });

  // Clipboard Paste (Ctrl+V)
  window.addEventListener('paste', (e) => {
    const items = (e.clipboardData || e.originalEvent.clipboardData).items;
    for (let index in items) {
      const item = items[index];
      if (item.kind === 'file' && item.type.startsWith('image/')) {
        const blob = item.getAsFile();
        handleSelectedFile(blob, 'Pasted-Screenshot.png');
        break;
      }
    }
  });

  function handleSelectedFile(file, customName) {
    // Validate file type
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type) && !file.type.startsWith('image/')) {
      alert('Please upload a valid image file (PNG, JPG, JPEG, or WEBP).');
      return;
    }

    // Validate size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size exceeds 10MB limit. Please upload a smaller image.');
      return;
    }

    currentSampleId = null;
    const reader = new FileReader();
    reader.onload = function(e) {
      currentImageSource = e.target.result;
      if (previewImg) previewImg.src = currentImageSource;
      if (previewFilename) previewFilename.textContent = file.name || customName || 'Uploaded-Screenshot.png';
      if (previewFilesize) previewFilesize.textContent = (file.size ? (file.size / 1024).toFixed(1) + ' KB' : 'Image loaded');
      
      dropzone.style.display = 'none';
      if (previewContainer) previewContainer.style.display = 'flex';
      if (resultBox) resultBox.style.display = 'none';
    };
    reader.readAsDataURL(file);
  }

  // Sample Scenarios for Demonstration / Judges
  document.querySelectorAll('[data-scenario]').forEach(btn => {
    btn.addEventListener('click', function() {
      const scenarioId = this.getAttribute('data-scenario');
      if (typeof JUDGE_TEST_SCENARIOS !== 'undefined' && JUDGE_TEST_SCENARIOS[scenarioId]) {
        const scenario = JUDGE_TEST_SCENARIOS[scenarioId];
        currentSampleId = scenarioId;
        currentImageSource = scenario.svgImage;

        if (previewImg) previewImg.src = scenario.svgImage;
        if (previewFilename) previewFilename.textContent = `[DEMO] ${scenario.title}`;
        if (previewFilesize) previewFilesize.textContent = `Fictional Test Scenario (${scenario.subtitle})`;

        dropzone.style.display = 'none';
        if (previewContainer) previewContainer.style.display = 'flex';
        if (resultBox) resultBox.style.display = 'none';

        // Auto trigger analysis for instant judge demonstration
        analyzeBtn.click();
      }
    });
  });

  // Remove & Replace Buttons
  if (removeBtn) {
    removeBtn.addEventListener('click', () => {
      resetScreenshotState();
    });
  }

  if (replaceBtn) {
    replaceBtn.addEventListener('click', () => {
      fileInput.click();
    });
  }

  function resetScreenshotState() {
    fileInput.value = '';
    currentImageSource = null;
    currentSampleId = null;
    if (previewContainer) previewContainer.style.display = 'none';
    dropzone.style.display = 'block';
    if (progressContainer) progressContainer.style.display = 'none';
    if (resultBox) {
      resultBox.style.display = 'none';
      resultBox.innerHTML = '';
    }
  }

  // Analyze Screenshot Trigger
  analyzeBtn.addEventListener('click', async () => {
    if (!currentImageSource) {
      if (resultBox) {
        resultBox.className = 'result-box warning';
        resultBox.style.display = 'block';
        resultBox.innerHTML = `
          <div class="result-header">
            <div class="result-icon-badge">ℹ️</div>
            <div>
              <div class="result-verdict-title">No Screenshot Chosen</div>
              <div class="result-verdict-subtitle">Please click the upload area above to select a screenshot or click one of the 3 judge test scenarios.</div>
            </div>
          </div>
        `;
      }
      return;
    }

    // Show Progress State
    analyzeBtn.disabled = true;
    analyzeBtn.innerHTML = '<span class="spinner"></span> <span>Analyzing Screenshot...</span>';
    if (progressContainer) progressContainer.style.display = 'block';
    if (progressBar) progressBar.style.width = '10%';
    if (progressText) progressText.textContent = 'Starting ScamVision AI...';

    try {
      const result = await analyzeScreenshotWithOCR(currentImageSource, currentSampleId, (progressInfo) => {
        if (progressBar) progressBar.style.width = `${progressInfo.progress}%`;
        if (progressText) progressText.textContent = progressInfo.stage;
      });

      // Render Result
      setTimeout(() => {
        if (progressContainer) progressContainer.style.display = 'none';
        analyzeBtn.disabled = false;
        analyzeBtn.innerHTML = '<span>Analyze Screenshot</span> <span>&rarr;</span>';

        renderScanResult(resultBox, result);
      }, 300);

    } catch (err) {
      if (progressContainer) progressContainer.style.display = 'none';
      analyzeBtn.disabled = false;
      analyzeBtn.innerHTML = '<span>Analyze Screenshot</span> <span>&rarr;</span>';

      if (resultBox) {
        resultBox.className = 'result-box warning';
        resultBox.style.display = 'block';
        resultBox.innerHTML = `
          <div class="result-header">
            <div class="result-icon-badge">⚠️</div>
            <div>
              <div class="result-verdict-title">Unable to Complete OCR Scan</div>
              <div class="result-verdict-subtitle">${err.message || 'We could not extract text from this image. Please try uploading a clearer image or use one of the test scenarios.'}</div>
            </div>
          </div>
        `;
      }
    }
  });
}

// ============================================================================
// RESULTS RENDERING ENGINE
// ============================================================================
/**
 * Renders complete structured safety report into the target result container
 * @param {HTMLElement} resultBox - Container element
 * @param {Object} result - Analysis object
 */
function renderScanResult(resultBox, result) {
  if (!resultBox) return;

  if (result.status === 'empty') {
    resultBox.className = 'result-box warning';
    resultBox.style.display = 'block';
    resultBox.innerHTML = `
      <div class="result-header">
        <div class="result-icon-badge">ℹ️</div>
        <div>
          <div class="result-verdict-title">${result.title}</div>
          <div class="result-verdict-subtitle">${result.summary || result.message}</div>
        </div>
      </div>
    `;
    return;
  }

  // Determine Icon & Risk Badge Class
  let icon = '🛡️';
  let badgeClass = 'likely-safe';
  let riskLabel = result.riskLevel || 'No obvious warning signs detected';

  if (result.status === 'danger') {
    icon = '🚨';
    badgeClass = 'high-risk';
    riskLabel = 'High Risk';
  } else if (result.status === 'warning') {
    icon = '⚠️';
    badgeClass = 'suspicious';
    riskLabel = 'Suspicious';
  } else if (result.status === 'safe') {
    icon = '✅';
    badgeClass = 'likely-safe';
    riskLabel = 'No obvious warning signs detected';
  }

  // 1. Warning Signs Found Section
  let warningSignsHtml = '';
  if (result.warningSigns && result.warningSigns.length > 0) {
    const tagsHtml = result.warningSigns.map(w => `
      <span class="warning-tag-pill">
        <span>⚠️</span>
        <span>"${w.phrase}"</span>
      </span>
    `).join('');

    const explanationsHtml = result.warningSigns.map(w => `
      <div class="finding-item-card ${w.level === 'danger' ? 'danger-level' : 'warning-level'}">
        <div class="finding-item-header">
          <span>🚩 ${w.category}</span>
        </div>
        <div class="finding-item-desc">${w.explanation}</div>
      </div>
    `).join('');

    warningSignsHtml = `
      <div class="warning-signs-container">
        <div class="warning-signs-title">
          <span>🚩 Warning Signs Found in Image:</span>
        </div>
        <div class="warning-tags-list">
          ${tagsHtml}
        </div>
        <div class="findings-explanation-list">
          <div style="font-weight:700;font-size:0.95rem;color:#1e293b;margin-bottom:6px;">🔍 Why this matters:</div>
          ${explanationsHtml}
        </div>
      </div>
    `;
  }

  // 2. Practical Advice Section ("What should I do?")
  let adviceHtml = '';
  if (result.advice && result.advice.length > 0) {
    const stepsHtml = result.advice.map((item, index) => `
      <li class="action-step-item">
        <span class="step-num-badge">${index + 1}</span>
        <span>${item}</span>
      </li>
    `).join('');

    adviceHtml = `
      <div class="practical-advice-card">
        <div class="advice-card-header">
          <span>👉 What Should I Do?</span>
        </div>
        <ul class="action-steps-list">
          ${stepsHtml}
        </ul>
      </div>
    `;
  }

  // 3. Extracted OCR Text Drawer
  let ocrDrawerHtml = '';
  if (result.extractedText && result.extractedText.trim().length > 0) {
    const charCount = result.extractedText.length;
    ocrDrawerHtml = `
      <div class="extracted-ocr-details">
        <div class="extracted-ocr-header" id="ocrToggleBtn" role="button" tabindex="0">
          <span>📝 Extracted Text from Screenshot (${charCount} characters detected)</span>
          <span class="extracted-ocr-toggle-icon" id="ocrToggleIcon">▼ Show Text</span>
        </div>
        <div class="extracted-ocr-body" id="ocrBody">
          <pre class="ocr-text-pre">${escapeHtml(result.extractedText)}</pre>
        </div>
      </div>
    `;
  }

  // 4. Action Buttons Toolbar (Copy Report & Discuss in Chatbot)
  const isFictionalBadge = result.isFictionalDemo ? `<div style="display:inline-block;background:#e0f2fe;color:#0369a1;font-size:0.75rem;font-weight:700;padding:2px 8px;border-radius:4px;margin-bottom:8px;">FICTIONAL DEMO SCENARIO</div>` : '';

  resultBox.className = `result-box ${result.status}`;
  resultBox.style.display = 'block';
  resultBox.innerHTML = `
    ${isFictionalBadge}
    <div class="result-header">
      <div class="result-icon-badge">${icon}</div>
      <div>
        <span class="result-risk-badge ${badgeClass}">${riskLabel}</span>
        <div class="result-verdict-title">${result.title}</div>
        <div class="result-verdict-subtitle">${result.summary}</div>
      </div>
    </div>

    ${warningSignsHtml}
    ${adviceHtml}
    ${ocrDrawerHtml}

    <div class="result-actions-toolbar">
      <button type="button" class="btn-discuss-chat" id="discussWithChatbotBtn">
        <span>💬 Discuss This Result with CyberShield</span>
      </button>
      <button type="button" class="btn-copy-report" id="copyReportBtn">
        <span>📋 Copy Safety Report</span>
      </button>
    </div>

    <div class="safety-disclaimer-note">
      🛡️ <strong>Safety Disclaimer:</strong> ${result.disclaimer || 'CyberShield AI provides automated pattern detection. Never guarantee that an image or message is completely safe merely because no warning signs were detected.'}
    </div>
  `;

  // Attach Event Handlers to Result Controls
  // OCR Toggle
  const ocrToggleBtn = resultBox.querySelector('#ocrToggleBtn');
  const ocrBody = resultBox.querySelector('#ocrBody');
  const ocrToggleIcon = resultBox.querySelector('#ocrToggleIcon');
  if (ocrToggleBtn && ocrBody) {
    ocrToggleBtn.addEventListener('click', () => {
      const isOpen = ocrBody.classList.toggle('open');
      if (ocrToggleIcon) {
        ocrToggleIcon.textContent = isOpen ? '▲ Hide Text' : '▼ Show Text';
      }
    });
  }

  // Discuss in Chatbot Button
  const discussBtn = resultBox.querySelector('#discussWithChatbotBtn');
  if (discussBtn) {
    discussBtn.addEventListener('click', () => {
      if (typeof loadScreenshotContextInChat === 'function') {
        loadScreenshotContextInChat(result);
      } else {
        const chatToggle = document.getElementById('chatbotToggleBtn');
        if (chatToggle) chatToggle.click();
      }
    });
  }

  // Copy Safety Report Button
  const copyBtn = resultBox.querySelector('#copyReportBtn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const reportText = generatePlainReport(result);
      navigator.clipboard.writeText(reportText).then(() => {
        copyBtn.innerHTML = '<span>✅ Report Copied!</span>';
        copyBtn.classList.add('copied');
        setTimeout(() => {
          copyBtn.innerHTML = '<span>📋 Copy Safety Report</span>';
          copyBtn.classList.remove('copied');
        }, 2500);
      }).catch(err => {
        console.error('Clipboard copy failed:', err);
      });
    });
  }

  // Smooth scroll to result
  resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * Builds clean plain text report for clipboard export
 */
function generatePlainReport(result) {
  let text = `====================================\n`;
  text += `🛡️ CYBERSHIELD AI - SAFETY REPORT\n`;
  text += `====================================\n\n`;
  text += `Risk Assessment: ${result.riskLevel || 'Analyzed'}\n`;
  text += `Finding: ${result.title}\n`;
  text += `Summary: ${result.summary}\n\n`;

  if (result.warningSigns && result.warningSigns.length > 0) {
    text += `WARNING SIGNS DETECTED:\n`;
    result.warningSigns.forEach(w => {
      text += `• "${w.phrase}" (${w.category}): ${w.explanation}\n`;
    });
    text += `\n`;
  }

  if (result.advice && result.advice.length > 0) {
    text += `RECOMMENDED ACTIONS:\n`;
    result.advice.forEach((a, i) => {
      text += `${i + 1}. ${a}\n`;
    });
    text += `\n`;
  }

  text += `Helpline (India): Call 1930 or report at cybercrime.gov.in\n`;
  text += `Generated privately on CyberShield AI.\n`;
  return text;
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
}
