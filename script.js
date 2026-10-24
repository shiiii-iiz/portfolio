/* ===================================================
   SHIRLYN MESA PORTFOLIO — script.js
=================================================== */

/* -----------------------------------------------
   1. Navbar: scroll shrink + active link tracking
----------------------------------------------- */
(function initNavbar() {
  const navbar   = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link-item');

  function onScroll() {
    /* Shrink navbar */
    navbar.classList.toggle('scrolled', window.scrollY > 40);

    /* Highlight active section link */
    let currentId = '';
    sections.forEach(section => {
      const top    = section.offsetTop - 120;
      const height = section.offsetHeight;
      if (window.scrollY >= top && window.scrollY < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
})();


/* -----------------------------------------------
   2. Mobile hamburger menu
----------------------------------------------- */
(function initMobileMenu() {
  const btn        = document.getElementById('hamburgerBtn');
  const menu       = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  btn.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
})();


/* -----------------------------------------------
   3. Skills category filter tabs
----------------------------------------------- */
(function initSkillFilter() {
  const tabs  = document.querySelectorAll('.skill-tab-btn');
  const cards = document.querySelectorAll('.skill-card');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');
      cards.forEach(card => {
        card.style.display =
          (filter === 'all' || card.getAttribute('data-cat') === filter)
            ? 'flex'
            : 'none';
      });
    });
  });
})();


/* -----------------------------------------------
   4. Profile photo upload
----------------------------------------------- */
(function initPhotoUpload() {
  const frame       = document.getElementById('avatarPhotoFrame');
  const input       = document.getElementById('photoInput');
  const placeholder = document.getElementById('photoPlaceholder');
  const photoImg    = document.getElementById('profilePhoto');
  const removeBtn   = document.getElementById('removePhotoBtn');

  if (!frame || !input) return;

  /* Click frame → open file picker */
  frame.addEventListener('click', (e) => {
    if (e.target === removeBtn || removeBtn.contains(e.target)) return;
    input.click();
  });

  /* File selected → show preview */
  input.addEventListener('change', () => {
    const file = input.files[0];
    if (!file || !file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      photoImg.src          = e.target.result;
      photoImg.style.display  = 'block';
      placeholder.style.display = 'none';
      removeBtn.style.display   = 'flex';
    };
    reader.readAsDataURL(file);
  });

  /* Remove photo → restore placeholder */
  removeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    photoImg.src           = '';
    photoImg.style.display  = 'none';
    placeholder.style.display = 'flex';
    removeBtn.style.display   = 'none';
    input.value = '';
  });
})();


/* -----------------------------------------------
   5. Project modal viewer
----------------------------------------------- */
(function initProjectModal() {
  /* ── Project data ── */
  const projects = [
    {
      title:    'TaskNet',
      category: 'Full-Stack Web App // Django',
      url:      'https://github.com/shiiii-iiz/tasknest',
      caption:  'Full-featured Django Task & Collaboration Platform',
      desc:     'A full-featured Django task management web application with personal task tracking, group collaboration, interactive calendar view, automated email/in-app notifications, and discussion threads — styled in a soft pink pastel theme.',
      tags:     ['Django', 'Python', 'HTML/CSS', 'JavaScript', 'Pastel UI'],
      highlights: [
        'Django models and relational ORM handling group workspaces, user permissions, and assigned tasks.',
        'Responsive calendar and list views customized with a soft pastel aesthetic for stress-free productivity.',
        'Collaborative discussion threads with real-time feedback and stateful notification badges.'
      ],
      code: 'https://github.com/shiiii-iiz/tasknest'
    },
    {
      title:    'Daily Gratitude Journal API',
      category: 'Backend API & Shared Wall',
      url:      'https://github.com/shiiii-iiz/api',
      caption:  'Daily Reflection & Community Wall Engine',
      desc:     'A daily reflection API helping users reflect on daily gratitude prompts, featuring personal journaling, a shared community wall, and lightweight JSON file storage.',
      tags:     ['Python', 'REST API', 'JSON', 'Architecture'],
      highlights: [
        'Lightweight, dependency-free local JSON file persistence layer optimized for rapid reading and writing.',
        'Dual privacy mode supporting private reflections alongside anonymous community wall posts.',
        'Clean REST endpoints with automated prompt generation logic for daily mindfulness.'
      ],
      code: 'https://github.com/shiiii-iiz/api'
    }
  ];

  /* ── DOM refs ── */
  const backdrop  = document.getElementById('projectModalBackdrop');
  const closeBtn  = document.getElementById('modalCloseBtn');
  const prevBtn   = document.getElementById('modalPrev');
  const nextBtn   = document.getElementById('modalNext');
  const titleEl   = document.getElementById('modalTitle');
  const catEl     = document.getElementById('modalCategory');
  const urlEl     = document.getElementById('modalUrl');
  const captionEl = document.getElementById('modalCaption');
  const descEl    = document.getElementById('modalDesc');
  const tagsEl    = document.getElementById('modalTags');
  const highEl    = document.getElementById('modalHighlights');
  const countEl   = document.getElementById('modalCounter');
  const codeBtn   = document.getElementById('modalCodeBtn');

  let currentIdx = 0;

  function renderModal(idx) {
    currentIdx = idx;
    const p = projects[idx];
    if (!p) return;

    titleEl.textContent   = p.title;
    catEl.textContent     = p.category;
    urlEl.textContent     = p.url;
    captionEl.textContent = p.caption;
    descEl.textContent    = p.desc;
    countEl.textContent   = `${idx + 1} / ${projects.length}`;
    codeBtn.href          = p.code;

    tagsEl.innerHTML = p.tags
      .map(t =>
        `<span style="background:#1e090c;color:#d8899b;border:1px solid #2d1015;
                      padding:0.2rem 0.65rem;border-radius:4px;font-size:0.75rem;
                      font-family:'JetBrains Mono',monospace;">${t}</span>`
      ).join('');

    highEl.innerHTML = p.highlights
      .map(h => `<li style="margin-bottom:0.25rem;">${h}</li>`)
      .join('');
  }

  function openModal(idx) {
    renderModal(idx);
    backdrop.style.display = 'flex';
    backdrop.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    backdrop.style.display = 'none';
    backdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  /* Open via "Quick View" buttons */
  document.querySelectorAll('.preview-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openModal(parseInt(btn.getAttribute('data-index') || '0', 10));
    });
  });

  /* Open via clicking the card itself */
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('a')) return; // let GitHub link work normally
      openModal(parseInt(card.getAttribute('data-index') || '0', 10));
    });
  });

  closeBtn.addEventListener('click', closeModal);

  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) closeModal();
  });

  prevBtn.addEventListener('click', () => {
    renderModal((currentIdx - 1 + projects.length) % projects.length);
  });

  nextBtn.addEventListener('click', () => {
    renderModal((currentIdx + 1) % projects.length);
  });

  window.addEventListener('keydown', (e) => {
    if (backdrop.style.display !== 'flex') return;
    if (e.key === 'Escape')     closeModal();
    if (e.key === 'ArrowLeft')  prevBtn.click();
    if (e.key === 'ArrowRight') nextBtn.click();
  });
})();
