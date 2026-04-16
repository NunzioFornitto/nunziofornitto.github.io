const sidebar = document.getElementById('sidebar');
const hamburger = document.getElementById('hamburger');
const sidebarOverlay = document.getElementById('sidebar-overlay');
const navLinks = document.querySelectorAll('.sidebar-nav a');

function openSidebar() {
  sidebar.classList.add('open');
  hamburger.classList.add('open');
  sidebarOverlay.classList.add('active');
}
function closeSidebar() {
  sidebar.classList.remove('open');
  hamburger.classList.remove('open');
  sidebarOverlay.classList.remove('active');
}
function toggleSidebar() {
  sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
}

hamburger.addEventListener('click', toggleSidebar);
sidebarOverlay.addEventListener('click', closeSidebar);
navLinks.forEach(link => link.addEventListener('click', closeSidebar));

// ── Hammer-like Swipe for Sidebar (native touch) ──
let tx = 0, ty = 0;
document.addEventListener('touchstart', e => {
  tx = e.touches[0].clientX;
  ty = e.touches[0].clientY;
}, { passive: true });

document.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - tx;
  const dy = Math.abs(e.changedTouches[0].clientY - ty);
  // Only trigger if horizontal swipe dominates
  if (Math.abs(dx) > dy) {
    if (dx > 60 && tx < 40) openSidebar();
    if (dx < -60 && sidebar.classList.contains('open')) closeSidebar();
  }
}, { passive: true });

// ── Scroll direction tracker ──
let lastScrollY = window.scrollY;
let isScrollingDown = true;
window.addEventListener('scroll', () => {
  isScrollingDown = window.scrollY > lastScrollY;
  lastScrollY = window.scrollY;
}, { passive: true });

// ── Scroll reveal (generic .reveal and .reveal-stagger) ──
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      if (e.target.classList.contains('reveal-stagger')) {
        const children = Array.from(e.target.children);
        children.forEach((child, i) => {
          // Se si scende: ritardo normale. Se si sale: ritardo inverso.
          const delay = isScrollingDown ? (i * 0.1) : ((children.length - 1 - i) * 0.1);
          child.style.transitionDelay = `${delay + 0.05}s`;
        });
      }
      e.target.classList.add('visible');
    } else {
      e.target.classList.remove('visible'); // Allow re-triggering
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => io.observe(el));

// ── Timeline items individual reveal ──
const ioTl = new IntersectionObserver(entries => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
    } else {
      e.target.classList.remove('visible'); // Allow re-triggering
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.tl-item').forEach(el => ioTl.observe(el));

// ── Active nav link on scroll ──
const sections = document.querySelectorAll('section[id]');
const sideLinks = document.querySelectorAll('.sidebar-nav a');
const onScroll = () => {
  let cur = 'hero';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 160) cur = s.id;
  });
  sideLinks.forEach(a =>
    a.classList.toggle('active', a.getAttribute('href') === `#${cur}`)
  );
};
window.addEventListener('scroll', onScroll, { passive: true });

// ── Contact form (via Formspree) ──
document.getElementById('contactForm')?.addEventListener('submit', async function (e) {
  e.preventDefault();
  const name = document.getElementById('senderName').value.trim();
  const surname = document.getElementById('senderSurname').value.trim();
  const email = document.getElementById('senderEmail').value.trim();
  const msg = document.getElementById('senderMessage').value.trim();
  const status = document.getElementById('formStatus');
  const btn = this.querySelector('button[type="submit"]');

  if (!name || !surname || !email || !msg) {
    status.textContent = 'Please fill in all fields.';
    status.className = 'form-status error';
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Sending…';
  status.className = 'form-status';

  try {
    const res = await fetch('https://formspree.io/f/meepqwvo', {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: `${name} ${surname}`,
        email,
        message: msg
      })
    });

    if (res.ok) {
      status.textContent = '✓ Message sent! I\'ll get back to you soon.';
      status.className = 'form-status success';
      this.reset();
    } else {
      const data = await res.json();
      status.textContent = data?.errors?.[0]?.message ?? 'Something went wrong. Try again.';
      status.className = 'form-status error';
    }
  } catch (_) {
    status.textContent = 'Network error. Please try again.';
    status.className = 'form-status error';
  } finally {
    btn.disabled = false;
    btn.textContent = 'Send message →';
  }
});

// ── Skill card spotlight effect ──
document.querySelectorAll('.skill-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
    card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
  });
});

// ── Language switcher ──
const i18n = {
  en: {
    'nav-home': 'Home', 'nav-about': 'About', 'nav-experience': 'Experience',
    'nav-skills': 'Skills', 'nav-projects': 'Projects', 'nav-contact': 'Contact',
    'hero-tag': '// Software Engineer',
    'hero-role': 'MSc Computer Engineering · Italy',
    'hero-desc': 'Passionate about building software systems from embedded firmware to distributed cloud architectures. Recently graduated with 109/110 at University of Catania. Open to new challenges across Europe.',
    'hero-cta-primary': 'Get in touch →',
    'about-eyebrow': '// 01 — about',
    'about-title': 'Who I <span>am</span>',
    'about-p1': 'I\'m a <strong>Software Engineer</strong> from Italy with a strong academic background in Computer Engineering. My passion lives at the intersection of software architecture, embedded systems, and intelligent data pipelines.',
    'about-p2': 'During my master\'s thesis at <strong>Leonardo S.p.A.</strong>, I developed Matlab/Simulink models for train dynamics and integrated them into a <strong>VR train driving simulator</strong> for Trenitalia — bridging physics modeling with real-time software engineering.',
    'about-p3': 'I thrive in technically challenging environments where clean code, system design, and curiosity matter. Currently working as a <strong>DevOps Engineer</strong> at <strong>Reeturn - Enduring evolution</strong>, focusing on infrastructure automation and cloud-native technologies.',
    'info-degree-key': 'degree', 'info-degree-val': 'MSc Computer Engineering',
    'info-univ-key': 'university', 'info-lang-key': 'language',
    'info-lang-val': 'Italian (native) · English (B1)',
    'info-mobility-key': 'mobility', 'info-mobility-val': 'Available for Europe',
    'info-msc-key': 'msc grade', 'info-bsc-key': 'bsc grade',
    'exp-eyebrow': '// 02 — experience & education',
    'exp-title': 'My <span>Journey</span>',
    'tl0-date': 'Apr 2026 — Present',
    'tl0-title': 'DevOps Engineer',
    'tl0-desc': 'Working as a DevOps Engineer, focusing on infrastructure automation, CI/CD pipelines, container orchestration, and cloud-native deployment strategies.',
    'tl0-badge': 'DevOps · CI/CD · Docker · Kubernetes · Cloud',
    'tl1-title': 'Software Engineer Intern',
    'tl1-desc': 'Developed Matlab/Simulink models for train dynamics and physics simulation. Integrated the models into a pilot Virtual Reality train driving simulator for Trenitalia, bridging mathematical modeling with real-time rendering and control systems.',
    'tl1-badge': 'VR Simulator · Simulink · Embedded · Physics Modeling',
    'tl2-title': 'MSc — Computer Engineering (LM-32)',
    'tl2-desc': 'Specialised in embedded systems, real-time architectures, IoT, distributed systems, and machine learning. Thesis: <em>Development of Matlab/Simulink models for train dynamics and their integration into a pilot VR train simulator for Trenitalia.</em>',
    'tl2-badge': 'Graduated 11 Mar 2026',
    'tl3-title': 'BSc — Computer Science (L-31)',
    'tl3-desc': 'Core curriculum in algorithms, data structures, networking, operating systems and databases. Thesis: <em>Peer-to-peer sharing of copyrighted content</em> — distributed architectures and IT Law analysis.',
    'tl3-badge': 'Graduated 28 Apr 2023',
    'tl4-title': 'Technical Certificate — Information Systems',
    'tl4-desc': 'Technological sector, specialisation in Information Systems and Telecommunications.',
    'skills-eyebrow': '// 03 — skills', 'skills-title': 'Tech <span>Stack</span>',
    'proj-eyebrow': '// 04 — projects', 'proj-title': 'Open Source <span>Projects</span>',
    'proj-github-btn': 'View all projects on GitHub ↗',
    'proj-fallback-desc': 'No description available for this repository.',
    'contact-eyebrow': '// 05 — contact', 'contact-title': 'Get in <span>Touch</span>',
    'contact-desc': 'Open to new opportunities, collaborations, and conversations around software engineering, embedded systems, and AI.',
    'form-name': 'Name', 'form-name-ph': 'Your name',
    'form-surname': 'Surname', 'form-surname-ph': 'Your surname',
    'form-email': 'Email', 'form-message': 'Message',
    'form-message-ph': 'Tell me about your project or opportunity...',
    'form-submit': 'Send message →',
    'footer-text': 'Designed &amp; built by <span>Nunzio Fornitto</span> · 2026 · Italy 🇮🇹',
    'form-err-fields': 'Please fill in all fields.',
    'form-sending': 'Sending…', 'form-ok': '✓ Message sent! I\'ll get back to you soon.',
    'form-err-net': 'Network error. Please try again.',
  },
  it: {
    'nav-home': 'Home', 'nav-about': 'Chi sono', 'nav-experience': 'Esperienza',
    'nav-skills': 'Competenze', 'nav-projects': 'Progetti', 'nav-contact': 'Contatti',
    'hero-tag': '// Ingegnere del Software',
    'hero-role': 'Laurea Magistrale Ing. Informatica · Italia',
    'hero-desc': 'Appassionato di sistemi software, dal firmware embedded alle architetture cloud distribuite. Laureato con 109/110 all\'Università di Catania. Aperto a nuove sfide in Europa.',
    'hero-cta-primary': 'Contattami →',
    'about-eyebrow': '// 01 — chi sono',
    'about-title': 'Chi <span>sono</span>',
    'about-p1': 'Sono un <strong>Ingegnere del Software</strong> italiano con una solida formazione accademica in Ingegneria Informatica. La mia passione si trova all\'intersezione tra architettura software, sistemi embedded e pipeline di dati intelligenti.',
    'about-p2': 'Durante la tesi magistrale presso <strong>Leonardo S.p.A.</strong>, ho sviluppato modelli Matlab/Simulink per la dinamica ferroviaria e li ho integrati in un <strong>simulatore VR di guida del treno</strong> per Trenitalia.',
    'about-p3': 'Prospero in ambienti tecnicamente stimolanti dove contano codice pulito, design dei sistemi e curiosità. Attualmente lavoro come <strong>DevOps Engineer</strong> presso <strong>Reeturn - Enduring evolution</strong>, occupandomi di automazione infrastrutturale e tecnologie cloud-native.',
    'info-degree-key': 'laurea', 'info-degree-val': 'LM Ingegneria Informatica',
    'info-univ-key': 'università', 'info-lang-key': 'lingue',
    'info-lang-val': 'Italiano (madrelingua) · Inglese (B1)',
    'info-mobility-key': 'disponibilità', 'info-mobility-val': 'Disponibile per l\'Europa',
    'info-msc-key': 'voto LM', 'info-bsc-key': 'voto L',
    'exp-eyebrow': '// 02 — esperienza & formazione',
    'exp-title': 'Il mio <span>Percorso</span>',
    'tl0-date': 'Apr 2026 — In corso',
    'tl0-title': 'DevOps Engineer',
    'tl0-desc': 'Lavoro come DevOps Engineer, occupandomi di automazione infrastrutturale, pipeline CI/CD, orchestrazione di container e strategie di deployment cloud-native.',
    'tl0-badge': 'DevOps · CI/CD · Docker · Kubernetes · Cloud',
    'tl1-title': 'Tirocinante Ingegnere del Software',
    'tl1-desc': 'Sviluppato modelli Matlab/Simulink per la dinamica e la simulazione fisica dei treni. Integrati i modelli in un simulatore VR pilota di guida del treno per Trenitalia presso Leonardo S.p.A.',
    'tl1-badge': 'Simulatore VR · Simulink · Embedded · Modellazione Fisica',
    'tl2-title': 'LM — Ingegneria Informatica (LM-32)',
    'tl2-desc': 'Specializzazione in sistemi embedded, architetture real-time, IoT, sistemi distribuiti e machine learning. Tesi: <em>Sviluppo di modelli Matlab/Simulink per la dinamica ferroviaria e integrazione in un simulatore VR pilota per Trenitalia.</em>',
    'tl2-badge': 'Laureato l\'11 Mar 2026',
    'tl3-title': 'L — Informatica (L-31)',
    'tl3-desc': 'Curriculum di base in algoritmi, strutture dati, reti, sistemi operativi e basi di dati. Tesi: <em>Condivisione P2P di contenuti protetti da copyright</em> — architetture distribuite e analisi della normativa IT.',
    'tl3-badge': 'Laureato il 28 Apr 2023',
    'tl4-title': 'Diploma Tecnico — Sistemi Informativi',
    'tl4-desc': 'Settore tecnologico, specializzazione in Sistemi Informativi e Telecomunicazioni.',
    'skills-eyebrow': '// 03 — competenze', 'skills-title': 'Tech <span>Stack</span>',
    'proj-eyebrow': '// 04 — progetti', 'proj-title': 'Progetti <span>Open Source</span>',
    'proj-github-btn': 'Vedi tutti i progetti su GitHub ↗',
    'proj-fallback-desc': 'Nessuna descrizione disponibile per questa repository.',
    'contact-eyebrow': '// 05 — contatti', 'contact-title': 'Scrivimi <span>un messaggio</span>',
    'contact-desc': 'Aperto a nuove opportunità, collaborazioni e conversazioni su ingegneria del software, sistemi embedded e AI.',
    'form-name': 'Nome', 'form-name-ph': 'Il tuo nome',
    'form-surname': 'Cognome', 'form-surname-ph': 'Il tuo cognome',
    'form-email': 'Email', 'form-message': 'Messaggio',
    'form-message-ph': 'Raccontami del tuo progetto o opportunità...',
    'form-submit': 'Invia messaggio →',
    'footer-text': 'Progettato &amp; sviluppato da <span>Nunzio Fornitto</span> · 2026 · Italia 🇮🇹',
    'form-err-fields': 'Compila tutti i campi.',
    'form-sending': 'Invio in corso…', 'form-ok': '✓ Messaggio inviato! Ti risponderò presto.',
    'form-err-net': 'Errore di rete. Riprova.',
  }
};

let currentLang = 'en';
const veil = document.getElementById('lang-veil');

function applyLang(lang) {
  // Translate text nodes
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (i18n[lang][key] !== undefined) el.innerHTML = i18n[lang][key];
  });
  // Translate placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (i18n[lang][key] !== undefined) el.placeholder = i18n[lang][key];
  });
  // Update document lang
  document.documentElement.lang = lang;
}

document.getElementById('langToggle')?.addEventListener('click', () => {
  const next = currentLang === 'en' ? 'it' : 'en';
  // Fade out
  veil.style.opacity = '1';
  veil.style.pointerEvents = 'all';
  setTimeout(() => {
    applyLang(next);
    currentLang = next;
    // Update button
    const btn = document.getElementById('langToggle');
    btn.querySelector('.lang-flag').textContent = next === 'en' ? '🇬🇧' : '🇮🇹';
    btn.querySelector('.lang-label').textContent = next === 'en' ? 'EN' : 'IT';
    // Fade in
    veil.style.opacity = '0';
    veil.style.pointerEvents = 'none';
  }, 260);
});

// ── Theme Switcher with Interactive Scrubbing ──
const themeToggle = document.getElementById('themeToggle');
const themeThumb = themeToggle?.querySelector('.theme-switch-thumb');

// Load saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
  document.documentElement.classList.add('light-mode');
}

let isDraggingTheme = false;
let themeCloneContainer = null;
let startDragX = 0;
let maxRadius = 0;
let isDarkTheme = true;
let currentProgress = 0;
let dragRafId = null;

function createThemeClone() {
  if (themeCloneContainer) return;

  isDarkTheme = !document.documentElement.classList.contains('light-mode');

  themeCloneContainer = document.createElement('div');
  themeCloneContainer.style.position = 'fixed';
  themeCloneContainer.style.inset = '0';
  themeCloneContainer.style.overflow = 'hidden';
  themeCloneContainer.style.pointerEvents = 'none';
  themeCloneContainer.style.zIndex = '9998';
  themeCloneContainer.style.willChange = 'clip-path';

  themeCloneContainer.className = isDarkTheme ? 'light-theme-scope' : 'dark-theme-scope';

  const cloneBody = document.createElement('div');
  cloneBody.innerHTML = document.body.innerHTML;

  const scripts = cloneBody.querySelectorAll('script');
  for (let s of scripts) s.remove();
  const oldClone = cloneBody.querySelector('.dark-theme-scope, .light-theme-scope');
  if (oldClone) oldClone.remove();

  cloneBody.style.width = window.innerWidth + 'px';
  cloneBody.style.height = document.body.scrollHeight + 'px';
  cloneBody.style.transform = `translate(${-window.scrollX}px, ${-window.scrollY}px)`;
  cloneBody.style.background = 'var(--bg)';
  cloneBody.style.color = 'var(--text)';
  cloneBody.style.fontFamily = 'var(--font-display)';

  themeCloneContainer.appendChild(cloneBody);
  document.body.appendChild(themeCloneContainer);

  const thumbRect = themeThumb.getBoundingClientRect();
  const thumbCenterX = thumbRect.left + thumbRect.width / 2;
  const thumbCenterY = thumbRect.top + thumbRect.height / 2;

  maxRadius = Math.hypot(
    Math.max(thumbCenterX, window.innerWidth - thumbCenterX),
    Math.max(thumbCenterY, window.innerHeight - thumbCenterY)
  );

  themeCloneContainer.style.clipPath = `circle(0px at ${thumbCenterX}px ${thumbCenterY}px)`;
}

function updateThemeDrag(e) {
  if (!isDraggingTheme) return;

  const toggleRect = themeToggle.getBoundingClientRect();
  const thumbMaxDrag = toggleRect.width - 22;

  const deltaX = e.clientX - startDragX;

  if (isDarkTheme) {
    currentProgress = Math.max(0, Math.min(1, deltaX / thumbMaxDrag));
  } else {
    currentProgress = Math.max(0, Math.min(1, -deltaX / thumbMaxDrag));
  }

  const r = currentProgress * maxRadius;

  if (!dragRafId) {
    dragRafId = requestAnimationFrame(() => {
      dragRafId = null;
      const thumbOffset = isDarkTheme ? currentProgress * 20 : 20 - (currentProgress * 20);
      if (themeThumb) themeThumb.style.transform = `translateX(${thumbOffset}px)`;

      if (themeCloneContainer) {
        const cloneThumb = themeCloneContainer.querySelector('.theme-switch-thumb');
        if (cloneThumb) cloneThumb.style.transform = `translateX(${thumbOffset}px)`;

        // Recalculate center based on thumb position
        const thumbRect = themeThumb.getBoundingClientRect();
        const thumbCenterX = thumbRect.left + thumbRect.width / 2;
        const thumbCenterY = thumbRect.top + thumbRect.height / 2;
        themeCloneContainer.style.clipPath = `circle(${r}px at ${thumbCenterX}px ${thumbCenterY}px)`;
      }
    });
  }
}

function stopThemeDrag() {
  if (!isDraggingTheme) return;
  isDraggingTheme = false;

  let isComplete = currentProgress > 0.5;
  
  // If it was just a quick click (no drag), toggle automatically
  if (currentProgress < 0.05) {
    isComplete = true;
  }

  if (themeThumb) themeThumb.style.transform = '';
  if (themeToggle) themeToggle.style.transition = '';

  if (themeCloneContainer) {
    const thumbRect = themeThumb.getBoundingClientRect();
    const thumbCenterX = thumbRect.left + thumbRect.width / 2;
    const thumbCenterY = thumbRect.top + thumbRect.height / 2;

    themeCloneContainer.style.transition = 'clip-path 0.3s ease-out';
    const finalRadius = isComplete ? maxRadius : 0;
    themeCloneContainer.style.clipPath = `circle(${finalRadius}px at ${thumbCenterX}px ${thumbCenterY}px)`;

    setTimeout(() => {
      if (isComplete) {
        document.documentElement.classList.toggle('light-mode');
        localStorage.setItem('theme', document.documentElement.classList.contains('light-mode') ? 'light' : 'dark');
      }
      themeCloneContainer.remove();
      themeCloneContainer = null;
    }, 300);
  }
  currentProgress = 0;
}

themeToggle?.addEventListener('pointerdown', (e) => {
  e.preventDefault();
  themeToggle.setPointerCapture(e.pointerId);
  isDraggingTheme = true;
  startDragX = e.clientX;
  currentProgress = 0;
  createThemeClone();
  
  if (themeThumb) themeThumb.style.transition = 'transform 0.05s linear';
  if (themeToggle) themeToggle.style.transition = 'none';
  if (themeCloneContainer) {
    themeCloneContainer.style.transition = 'clip-path 0.05s linear';
    const cloneThumb = themeCloneContainer.querySelector('.theme-switch-thumb');
    if (cloneThumb) cloneThumb.style.transition = 'transform 0.05s linear';
  }
});

themeToggle?.addEventListener('pointermove', updateThemeDrag);
themeToggle?.addEventListener('pointerup', (e) => {
  themeToggle.releasePointerCapture(e.pointerId);
  stopThemeDrag();
});
themeToggle?.addEventListener('pointercancel', stopThemeDrag);

// ── Fetch GitHub Projects & READMEs ──
async function fetchGitHubProjects() {
  const track = document.getElementById('projectsTrack');
  if (!track) return;
  try {
    const res = await fetch('https://api.github.com/users/NunzioFornitto/repos?sort=updated&per_page=100');
    if (!res.ok) throw new Error('API Error');
    const repos = await res.json();
    
    // Fetch READMEs in parallel for better performance
    const reposWithReadme = await Promise.all(repos.map(async repo => {
      if (repo.fork) return null;
      
      let previewText = repo.description || '';
      try {
        const branch = repo.default_branch || 'main';
        // Try fetching raw README
        const rmRes = await fetch(`https://raw.githubusercontent.com/NunzioFornitto/${repo.name}/${branch}/README.md`);
        if (rmRes.ok) {
          const rawMd = await rmRes.text();
          // Strip markdown: remove headers, images, links, bold, code blocks, and collapse newlines
          let plainText = rawMd
            .replace(/<[^>]*>?/gm, '') // HTML tags
            .replace(/!\[.*?\]\(.*?\)/g, '') // images
            .replace(/\[(.*?)\]\(.*?\)/g, '$1') // links
            .replace(/#+\s/g, '') // headers
            .replace(/[*_~`>]/g, '') // formatting chars
            .replace(/```[\s\S]*?```/g, '') // code blocks
            .replace(/\n\s?/g, ' ') // collapse newlines
            .trim();
          
          if (plainText.length > 0) {
            // Truncate to ~140 chars
            previewText = plainText.length > 140 ? plainText.substring(0, 140).trim() + '...' : plainText;
          }
        }
      } catch (e) {
        // Silently fallback to description if README fetch fails
      }

      return { ...repo, previewText };
    }));

    let html = '';
    reposWithReadme.filter(Boolean).forEach(repo => {
      let langHtml = '';
      if (repo.language) {
        langHtml = `<div class="project-stack"><span class="stack-tag">${repo.language}</span></div>`;
      }
      
      const finalDesc = repo.previewText || `<span data-i18n="proj-fallback-desc" style="font-style:italic;color:var(--muted)">${i18n[currentLang]['proj-fallback-desc']}</span>`;

      html += `
        <div class="project-card">
          <div class="project-top">
            <div class="project-icon">📂</div>
            <a href="${repo.html_url}" target="_blank" class="project-link">GitHub ↗</a>
          </div>
          <div class="project-title">${repo.name}</div>
          <div class="project-desc">${finalDesc}</div>
          ${langHtml}
        </div>
      `;
    });

    // Insert exactly TWICE for the infinite scroll marquee
    track.innerHTML = html + html;

    // Apply translations on newly generated nodes
    applyLang(currentLang);

    // ── Interactive Scrolling Animation ──
    requestAnimationFrame(() => {
      // Half of the scrollWidth is exactly one set of the cards
      let halfWidth = track.scrollWidth / 2;
      let targetVx = -0.5; // Default slow slide left
      let vx = -0.5;
      let xPos = 0;
      let isHovering = false;

      function animateSlider() {
        vx += (targetVx - vx) * 0.08; // Smooth easing
        xPos += vx;

        if (xPos <= -halfWidth) {
          xPos += halfWidth;
        } else if (xPos > 0) {
          xPos -= halfWidth;
        }
        
        track.style.transform = `translateX(${xPos}px)`;
        requestAnimationFrame(animateSlider);
      }
      animateSlider();

      const wrapper = document.querySelector('.projects-slider-wrapper');
      if (wrapper) {
        wrapper.addEventListener('mouseenter', () => { isHovering = true; });
        wrapper.addEventListener('mouseleave', () => { 
          isHovering = false; 
          targetVx = -0.5; 
        });
        
        wrapper.addEventListener('mousemove', (e) => {
          if (!isHovering) return;
          const rect = wrapper.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const dist = (x - (rect.width / 2)) / (rect.width / 2); 
          
          if (Math.abs(dist) < 0.25) {
            targetVx = 0;
          } else {
            const sign = Math.sign(dist);
            const activeDist = Math.abs(dist) - 0.25; 
            targetVx = -sign * (activeDist / 0.75) * 6; 
          }
        });
      }
      
      window.addEventListener('resize', () => {
         halfWidth = track.scrollWidth / 2;
      });
    });

  } catch (err) {
    track.innerHTML = `<p style="color:var(--muted);padding:2rem;">Failed to load projects. Visit my GitHub profile to see them.</p>`;
  }
}

// Initialize
fetchGitHubProjects();
