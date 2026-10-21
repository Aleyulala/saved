<!-- Modern Native SVG Banner (No external image hosting dependencies) -->
<div align="center">
  <svg viewBox="0 0 1000 240" width="100%" xmlns="http://www.w3.org/2000/svg" style="border-radius: 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0d1117" />
        <stop offset="50%" stop-color="#161b22" />
        <stop offset="100%" stop-color="#0d1117" />
      </linearGradient>
      <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#00f2fe" />
        <stop offset="50%" stop-color="#4facfe" />
        <stop offset="100%" stop-color="#0000fe" />
      </linearGradient>
      <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#f6d365" />
        <stop offset="100%" stop-color="#fda085" />
      </linearGradient>
      <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
        <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(255, 255, 255, 0.04)" stroke-width="1" />
      </pattern>
      <filter id="glow">
        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>

    <!-- Card Background -->
    <rect width="1000" height="240" rx="12" fill="url(#bg)" stroke="#30363d" stroke-width="1.5" />
    <rect width="1000" height="240" rx="12" fill="url(#grid)" />

    <!-- Top & Bottom Glowing Accent Lines -->
    <rect x="0" y="0" width="1000" height="3" fill="url(#accent)" />
    <rect x="0" y="237" width="1000" height="3" fill="url(#accent)" />

    <!-- Decorative Circles / Compass Motif -->
    <circle cx="850" cy="120" r="90" stroke="rgba(79, 172, 254, 0.15)" stroke-width="1.5" fill="none" />
    <circle cx="850" cy="120" r="60" stroke="rgba(79, 172, 254, 0.25)" stroke-width="1" stroke-dasharray="4,4" fill="none" />
    <circle cx="850" cy="120" r="6" fill="#00f2fe" filter="url(#glow)" />
    
    <!-- Title and Subtitle -->
    <text x="70" y="95" font-size="42" font-weight="800" fill="#ffffff" letter-spacing="1">Ali Yıldız <tspan fill="url(#gold)">|</tspan> SAVED</text>
    <text x="71" y="135" font-size="18" font-weight="500" fill="#8b949e" letter-spacing="0.5">Open Source Startpage, Dashboard &amp; Bookmarks</text>

    <!-- Tech Badges inside SVG -->
    <g transform="translate(71, 165)">
      <!-- Badge 1: Speed & Privacy -->
      <rect x="0" y="0" width="160" height="28" rx="14" fill="#21262d" stroke="#363b42" stroke-width="1"/>
      <text x="80" y="18" font-size="12" font-weight="600" fill="#58a6ff" text-anchor="middle">⚡ Speed &amp; Privacy</text>

      <!-- Badge 2: Open Source -->
      <rect x="170" y="0" width="130" height="28" rx="14" fill="#21262d" stroke="#363b42" stroke-width="1"/>
      <text x="235" y="18" font-size="12" font-weight="600" fill="#3fb950" text-anchor="middle">🌱 Open Source</text>

      <!-- Badge 3: Client-Side -->
      <rect x="310" y="0" width="120" height="28" rx="14" fill="#21262d" stroke="#363b42" stroke-width="1"/>
      <text x="370" y="18" font-size="12" font-weight="600" fill="#d2a8ff" text-anchor="middle">💻 Client-Side</text>
    </g>
  </svg>
</div>

<br/>

<!-- Bento Grid Layout -->
<table align="center" width="100%" style="border: none;">
<tr>
<!-- Left Column: Bio & Socials -->
<td width="50%" valign="top">
<div align="center">
  <h3>👋 The Developer</h3>
  <br/>
  <a href="https://git.io/typing-svg">
    <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&pause=1000&color=2196F3&center=true&vCenter=true&width=350&lines=Building+Saved+Startpage;Modern+Web+Dashboards;Open+Source+Projects;Code+is+Art" alt="Typing SVG" />
  </a>
  <br/><br/>
  <p align="left">
    🚀 <b>Project:</b> Saved Startpage<br/>
    👨‍💻 <b>Developer:</b> Ali Yıldız (@Aleyulala)<br/>
    📱 <b>Platforms:</b> PC, Mobile &amp; Smart TV<br/>
    🌱 <b>Focus:</b> Client-Side, Speed &amp; Privacy<br/>
    ⚡ <b>Vibe:</b> "Code is Art."
  </p>
  <br/>
  <a href="https://github.com/Aleyulala"><img src="https://img.shields.io/badge/GitHub-black?style=for-the-badge&logo=github" /></a>
  <a href="https://github.com/Aleyulala/saved"><img src="https://img.shields.io/badge/Repo--saved-14b8a6?style=for-the-badge&logo=github" /></a>
  <a href="https://negronshow.blogspot.com/"><img src="https://img.shields.io/badge/Blog-negronshow-FF5722?style=for-the-badge&logo=blogger" /></a>
  <a href="https://www.gnu.org/licenses/gpl-3.0.html"><img src="https://img.shields.io/badge/License-GPL--3.0-blue?style=for-the-badge&logo=gnu" /></a>
</div>
</td>

<!-- Right Column: Tech Stack & Stats -->
<td width="50%" valign="top">
<div align="center">
  <h3>🛠️ The Arsenal</h3>
  <img src="https://skillicons.dev/icons?i=html,css,js,regex,git,github,vscode,linux&perline=4" />
  <br/><br/>
  <h3>📊 The Numbers</h3>
  <img src="https://github-readme-streak-stats.herokuapp.com/?user=Aleyulala&theme=tokyonight&hide_border=true&background=00000000" width="100%" />
  <br/>
  <img src="https://github-profile-trophy.vercel.app/?username=Aleyulala&theme=flat&column=3&margin-w=10&margin-h=10&no-bg=true" width="100%" />
</div>
</td>
</tr>
</table>

<br/>

<!-- Featured Projects Grid -->
<h3 align="center">🚀 Featured Projects</h3>
<table align="center" width="100%">
<tr>
<td width="33%" align="center">
  <b><a href="https://github.com/Aleyulala/saved">🎨 SAVED</a></b><br/>
  Startpage &amp; Bookmarks<br/>
  <img src="https://img.shields.io/badge/Startpage-14b8a6?style=flat-square" />
</td>
<td width="33%" align="center">
  <b><a href="https://github.com/Aleyulala/saved">📺 Coco TV Bookmarks</a></b><br/>
  Smart TV &amp; Gamepad UI<br/>
  <img src="https://img.shields.io/badge/Smart%20TV-blue?style=flat-square" />
</td>
<td width="33%" align="center">
  <b><a href="https://negronshow.blogspot.com/">🌐 NegronShow</a></b><br/>
  Tech &amp; Dev Blog<br/>
  <img src="https://img.shields.io/badge/Blogger-orange?style=flat-square" />
</td>
</tr>
<tr>
<td width="33%" align="center">
  <b><a href="https://github.com/Aleyulala/saved">⚡ Command Palette</a></b><br/>
  Ctrl+K Quick Search<br/>
  <img src="https://img.shields.io/badge/Palette-purple?style=flat-square" />
</td>
<td width="33%" align="center">
  <b><a href="https://github.com/Aleyulala/saved">🛠️ Quick Tools</a></b><br/>
  Timer &amp; Routine Automations<br/>
  <img src="https://img.shields.io/badge/Tools-yellow?style=flat-square" />
</td>
<td width="33%" align="center">
  <b><a href="https://github.com/Aleyulala/saved">🛡️ Privacy First</a></b><br/>
  100% Client-Side &amp; GPL 3.0<br/>
  <img src="https://img.shields.io/badge/Privacy-green?style=flat-square" />
</td>
</tr>
</table>

<br/>

<!-- Contribution Snake -->
<div align="center">
  <h3>🐍 Contribution Snake</h3>
  <img src="https://raw.githubusercontent.com/Aleyulala/Aleyulala/output/github-contribution-grid-snake.svg" alt="Snake Game" width="100%" />
</div>

<br/>
<hr/>

<!-- Community Discussions Section -->
## 👋 Hoş geldiniz!

<a href="https://github.com/Aleyulala/saved/discussions">Tartışmalar (Discussions)</a> bölümünü topluluk üyeleriyle iletişim kurmak ve fikir alışverişinde bulunmak için kullanıyoruz. Burada:

- ❓ Merak ettiğiniz konularda soru sorabilir,
- 💡 Fikirlerinizi ve proje önerilerinizi paylaşabilir,
- 💬 Diğer topluluk üyeleriyle sohbet edebilir,
- 👋 Yeni katılanlara hoş geldiniz diyebilirsiniz.

Bu topluluğu hep birlikte büyütüyoruz. 💪  

👉 **[SAVED Discussions Bölümüne Git ve Kendini Tanıt](https://github.com/Aleyulala/saved/discussions)**
