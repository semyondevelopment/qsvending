/* ==========================================================
   QS Vending — Shared site JS
   ========================================================== */
(() => {
  'use strict';

  /* ---------- NAV SCROLL + MOBILE MENU + MOBILE CTA BAR ---------- */
  const nav = document.querySelector('nav.main-nav');
  const mobileCta = document.getElementById('mobileCtaBar');
  const handleScroll = () => {
    if (!nav) return;
    nav.classList.toggle('scrolled', window.scrollY > 80);
    if (mobileCta) {
      const show = window.scrollY > window.innerHeight * 0.55;
      mobileCta.classList.toggle('visible', show);
      document.body.classList.toggle('has-mobile-cta', show);
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (hamburger && mobileMenu) {
    const closeMenu = () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    };
    hamburger.addEventListener('click', () => {
      const open = hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  }

  /* ---------- SMOOTH SCROLL for in-page hash links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (href.length > 1) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  /* ---------- REVEAL on scroll ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const revealIO = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          revealIO.unobserve(e.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -80px 0px' });
    revealEls.forEach(el => revealIO.observe(el));
  }

  /* ---------- COUNTER ANIMATION on scroll ---------- */
  const statNums = document.querySelectorAll('.stat-num');
  if (statNums.length) {
    const easeOutQuad = t => t * (2 - t);
    const animate = el => {
      const target = parseFloat(el.dataset.target);
      const prefix = el.dataset.prefix || '';
      const suffix = el.dataset.suffix || '';
      const decimals = parseInt(el.dataset.decimal || '0', 10);
      const duration = 1400;
      const start = performance.now();
      const step = now => {
        const t = Math.min((now - start) / duration, 1);
        const value = target * easeOutQuad(t);
        el.textContent = prefix + value.toFixed(decimals) + suffix;
        if (t < 1) requestAnimationFrame(step);
        else el.textContent = prefix + target.toFixed(decimals) + suffix;
      };
      requestAnimationFrame(step);
    };
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.querySelectorAll('.stat-num').forEach(animate);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });
    document.querySelectorAll('[data-counter-group]').forEach(el => io.observe(el));
  }

  /* ---------- SOCIAL PROOF TICKER ---------- */
  const tickerEl = document.getElementById('socialTickerText');
  if (tickerEl) {
    const entries = [
      { name: 'Jason R.', role: 'Gym Owner', suburb: 'Fortitude Valley' },
      { name: 'Sarah M.', role: 'Office Manager', suburb: 'South Brisbane' },
      { name: 'Mark T.', role: 'Principal', suburb: 'Ipswich' },
      { name: 'David S.', role: 'Event Coordinator', suburb: 'Brisbane CBD' },
      { name: 'Priya K.', role: 'Facility Lead', suburb: 'Chermside' },
      { name: 'Tom H.', role: 'Warehouse Ops', suburb: 'Logan Central' }
    ];
    let idx = 0;
    setInterval(() => {
      idx = (idx + 1) % entries.length;
      const e = entries[idx];
      tickerEl.style.opacity = 0;
      setTimeout(() => {
        tickerEl.innerHTML = `<strong>${e.name} from ${e.suburb}</strong> (${e.role}) just requested a machine <span class="tick">✓</span>`;
        tickerEl.style.opacity = 1;
      }, 400);
    }, 4000);
  }

  /* ---------- INDUSTRIES TABS ---------- */
  const tabs = document.querySelectorAll('.tab[data-tab]');
  if (tabs.length) {
    const panels = document.querySelectorAll('.tab-content[data-panel]');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
        panels.forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
        const p = document.querySelector(`[data-panel="${tab.dataset.tab}"]`);
        if (p) p.classList.add('active');
      });
    });
  }

  /* ---------- QUIZ / CONFIGURATOR ---------- */
  const configRoot = document.getElementById('configurator');
  if (configRoot) {
    const state = { venue: null, size: null, products: [] };
    const progressFill = document.getElementById('progressFill');
    const progressLabel = document.getElementById('progressLabel');
    const seeResultBtn = document.getElementById('seeResultBtn');
    const backBtn = document.getElementById('backBtn');

    const showStep = n => {
      document.querySelectorAll('.quiz-step').forEach(s => s.classList.remove('active'));
      const step = document.querySelector(`.quiz-step[data-step="${n}"]`);
      if (step) step.classList.add('active');
      if (n <= 3) {
        progressFill.style.width = (n / 3 * 100) + '%';
        progressLabel.textContent = `Step ${n} of 3`;
      } else {
        progressFill.style.width = '100%';
        progressLabel.textContent = 'Complete ✓';
      }
    };

    document.querySelectorAll('.quiz-option').forEach(opt => {
      opt.addEventListener('click', () => {
        const q = opt.dataset.q;
        const val = opt.dataset.value;
        const multi = opt.dataset.multi === '1';
        if (multi) {
          opt.classList.toggle('selected');
          state.products = Array.from(document.querySelectorAll('.quiz-option[data-q="products"].selected')).map(o => o.dataset.value);
          if (seeResultBtn) seeResultBtn.disabled = state.products.length === 0;
        } else {
          document.querySelectorAll(`.quiz-option[data-q="${q}"]`).forEach(o => o.classList.remove('selected'));
          opt.classList.add('selected');
          state[q] = val;
          setTimeout(() => {
            if (q === 'venue') showStep(2);
            else if (q === 'size') showStep(3);
          }, 200);
        }
      });
    });

    if (backBtn) backBtn.addEventListener('click', () => showStep(2));

    if (seeResultBtn) seeResultBtn.addEventListener('click', () => {
      const { venue, size, products } = state;
      const machines = {
        office: { name: 'The Office Pro Combo', tag: 'Perfect for teams' },
        school: { name: 'The School Canteen Plus', tag: 'QLD canteen-compliant' },
        gym: { name: 'The Gym Fuel Station', tag: 'Built for athletes' },
        warehouse: { name: 'The Warehouse Heavy-Duty', tag: '24/7 shift-ready' },
        event: { name: 'The Event Pop-Up Unit', tag: 'Flexible hire terms' },
        other: { name: 'The Versatile All-Rounder', tag: 'Tailored to your space' }
      };
      const machine = machines[venue] || machines.other;
      const productNames = {
        snacks: 'Popular snack range (chips, chocolate, bars)',
        cold: 'Cold drinks (water, juice, soft drinks, iced coffee)',
        sports: 'Sports & energy (Gatorade, Red Bull, electrolytes)',
        healthy: 'Healthy options (nuts, fruit, low-sugar snacks)'
      };
      const sizeLabels = {
        small: 'Compact unit (under 20 users)',
        medium: 'Standard unit (20–50 users)',
        large: 'Large-capacity unit (50–150 users)',
        xlarge: 'Double-bay unit (150+ users)'
      };
      const features = [
        sizeLabels[size] || 'Custom-sized for your space',
        ...products.map(p => productNames[p]),
        'Cashless payments (tap, Apple Pay, Google Pay)',
        '$0 install · Free restocking · No lock-in'
      ];
      document.getElementById('resultName').textContent = machine.name;
      document.getElementById('resultMatch').textContent = machine.tag;
      const ul = document.getElementById('resultFeatures');
      ul.innerHTML = '';
      features.forEach(f => {
        const li = document.createElement('li');
        li.textContent = f;
        ul.appendChild(li);
      });
      const payload = `${machine.name} (${venue}, ${size}, ${products.join('+')})`;
      try { sessionStorage.setItem('qs_quiz_result', payload); if (venue) sessionStorage.setItem('qs_quiz_venue', venue); } catch (e) {}
      const hidden = document.getElementById('quiz_result');
      if (hidden) hidden.value = payload;
      const venueSel = document.getElementById('venue');
      if (venueSel && venue) venueSel.value = venue;
      showStep(4);
    });

    const restart = document.getElementById('restartQuiz');
    if (restart) restart.addEventListener('click', () => {
      state.venue = null; state.size = null; state.products = [];
      document.querySelectorAll('.quiz-option').forEach(o => o.classList.remove('selected'));
      if (seeResultBtn) seeResultBtn.disabled = true;
      showStep(1);
    });
  }

  /* ---------- SUBURB TICKER ---------- */
  const track = document.getElementById('suburbTrack');
  if (track) {
    const suburbs = [
      'Brisbane CBD', 'South Brisbane', 'Fortitude Valley', 'Newstead', 'Chermside',
      'Carindale', 'Springwood', 'Logan Central', 'Ipswich', 'Toowoomba',
      'Sunshine Coast', 'Maroochydore', 'Caloundra', 'Gold Coast', 'Southport',
      'Robina', 'Beenleigh', 'Cleveland', 'Redland Bay', 'Caboolture',
      'Morayfield', 'North Lakes', 'Strathpine', 'Indooroopilly', 'Toowong',
      'Milton', 'Paddington', 'Woolloongabba', 'Annerley', 'Moorooka'
    ];
    const html = suburbs.map(s => `<span>${s}</span>`).join('');
    track.innerHTML = html + html;
  }

  /* ---------- TESTIMONIAL CAROUSEL ---------- */
  const carouselTrack = document.getElementById('carouselTrack');
  if (carouselTrack) {
    const slides = carouselTrack.children;
    const dotsWrap = document.getElementById('carouselDots');
    let currentSlide = 0;
    let timer;

    for (let i = 0; i < slides.length; i++) {
      const d = document.createElement('button');
      d.className = 'dot' + (i === 0 ? ' active' : '');
      d.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
      d.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(d);
    }
    const dots = dotsWrap.children;
    const goTo = i => {
      currentSlide = (i + slides.length) % slides.length;
      carouselTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
      for (let k = 0; k < dots.length; k++) dots[k].classList.toggle('active', k === currentSlide);
    };
    const start = () => { timer = setInterval(() => goTo(currentSlide + 1), 5000); };
    const stop = () => clearInterval(timer);
    const prev = document.getElementById('prevBtn');
    const next = document.getElementById('nextBtn');
    if (prev) prev.addEventListener('click', () => { goTo(currentSlide - 1); stop(); start(); });
    if (next) next.addEventListener('click', () => { goTo(currentSlide + 1); stop(); start(); });
    carouselTrack.parentElement.addEventListener('mouseenter', stop);
    carouselTrack.parentElement.addEventListener('mouseleave', start);

    // Touch swipe support
    let touchStartX = 0, touchEndX = 0;
    const viewport = carouselTrack.parentElement;
    viewport.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].screenX;
      stop();
    }, { passive: true });
    viewport.addEventListener('touchend', e => {
      touchEndX = e.changedTouches[0].screenX;
      const dx = touchEndX - touchStartX;
      if (Math.abs(dx) > 40) {
        if (dx < 0) goTo(currentSlide + 1);
        else goTo(currentSlide - 1);
      }
      start();
    }, { passive: true });

    start();
  }

  /* ---------- FAQ ACCORDION ---------- */
  document.querySelectorAll('.faq-item').forEach(item => {
    const btn = item.querySelector('.faq-q');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const open = item.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    btn.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        btn.click();
      }
    });
  });

  /* ---------- CONTACT FORM ---------- */
  const form = document.getElementById('enquiryForm');
  if (form) {
    // Pre-fill from quiz if available
    try {
      const r = sessionStorage.getItem('qs_quiz_result');
      const v = sessionStorage.getItem('qs_quiz_venue');
      if (r) { const f = document.getElementById('quiz_result'); if (f) f.value = r; }
      if (v) { const s = document.getElementById('venue'); if (s) s.value = v; }
    } catch (e) {}

    form.addEventListener('submit', e => {
      if (!form.checkValidity()) {
        e.preventDefault();
        form.reportValidity();
        return;
      }
      // Browser natively submits to Formsubmit which redirects to thanks.html
      const btn = form.querySelector('button[type="submit"]');
      btn.textContent = 'Sending…';
      btn.disabled = true;
    });
  }

  /* ---------- HERO PARALLAX ---------- */
  (() => {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.matchMedia('(max-width: 900px)').matches;
    if (reduced || isMobile) return;

    let rafId = 0;
    const root = document.documentElement;
    const update = () => {
      const y = Math.min(Math.max(window.scrollY, 0), 900);
      root.style.setProperty('--hero-y', y + 'px');
    };
    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    update();
  })();

  /* ==========================================================
     CONVERSION BOOSTERS
     ========================================================== */

  /* ---------- WHATSAPP FLOAT BUTTON (auto-inject on every page) ---------- */
  (() => {
    if (document.querySelector('.wa-float')) return;
    const waMsg = encodeURIComponent("Hi QS Vending, I'd like more info on a free vending machine.");
    const wrap = document.createElement('a');
    wrap.className = 'wa-float';
    wrap.href = `https://wa.me/61494327362?text=${waMsg}`;
    wrap.target = '_blank';
    wrap.rel = 'noopener';
    wrap.setAttribute('aria-label', 'Chat with us on WhatsApp');
    wrap.innerHTML = `
      <span class="wa-bubble-text">Chat with our Brisbane team</span>
      <span class="wa-btn" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      </span>`;
    document.body.appendChild(wrap);
  })();

  /* ---------- SCARCITY BANNER (dynamic slot count) ---------- */
  (() => {
    const bars = document.querySelectorAll('.announce-bar');
    if (!bars.length) return;
    const day = new Date().getDay();
    // Mon=1 → 5 slots, Tue=2 → 4, Wed=3 → 3, Thu=4 → 2, Fri=5 → 1, Sat/Sun → 5 fresh
    const slotMap = { 0: 5, 1: 5, 2: 4, 3: 3, 4: 2, 5: 1, 6: 5 };
    const slots = slotMap[day];
    const dayLabel = day === 0 || day === 6 ? 'next week' : 'this week';
    bars.forEach(bar => {
      bar.innerHTML = `
        <span class="dot-live" aria-hidden="true"></span>
        Only <span class="scarcity-num">${slots}</span> Brisbane install slots left ${dayLabel} —
        <a href="contact.html">Claim yours →</a>
      `;
    });
  })();

  /* ---------- EXIT INTENT MODAL ---------- */
  (() => {
    if (document.body.classList.contains('no-exit')) return;
    if (sessionStorage.getItem('qs_exit_dismissed')) return;
    if (document.querySelector('.exit-modal-backdrop')) return;

    const modalHtml = `
      <div class="exit-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="exitModalTitle">
        <div class="exit-modal">
          <button class="exit-modal-close" aria-label="Close">✕</button>
          <span class="exit-modal-badge">◉ Wait!</span>
          <h3 id="exitModalTitle">Leaving without your free machine?</h3>
          <p>Drop your number and our Brisbane team will call you back ASAP. No cost, no commitment.</p>
          <form id="exitForm" action="https://formsubmit.co/help@qsvending.com.au" method="POST" novalidate>
            <input type="hidden" name="_subject" value="New QS Vending enquiry (exit popup)">
            <input type="hidden" name="_next" value="https://qsvending.com.au/thanks.html">
            <input type="hidden" name="_captcha" value="false">
            <input type="hidden" name="_template" value="table">
            <input type="hidden" name="source" value="exit-intent-modal">
            <input type="text" name="_honey" style="display:none" tabindex="-1" autocomplete="off" aria-hidden="true">
            <div class="field">
              <label for="exitPhone">Phone Number</label>
              <input type="tel" id="exitPhone" name="phone" required placeholder="+61 4xx xxx xxx" autocomplete="tel">
            </div>
            <button type="submit" class="btn btn-primary">Call me back →</button>
          </form>
          <div class="exit-modal-foot">No spam · No lock-in · Brisbane-based team</div>
        </div>
      </div>`;
    document.body.insertAdjacentHTML('beforeend', modalHtml);

    const backdrop = document.querySelector('.exit-modal-backdrop');
    const closeBtn = backdrop.querySelector('.exit-modal-close');
    const form = backdrop.querySelector('#exitForm');
    const open = () => { backdrop.classList.add('open'); sessionStorage.setItem('qs_exit_shown', '1'); };
    const close = () => { backdrop.classList.remove('open'); sessionStorage.setItem('qs_exit_dismissed', '1'); };
    closeBtn.addEventListener('click', close);
    backdrop.addEventListener('click', e => { if (e.target === backdrop) close(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && backdrop.classList.contains('open')) close(); });

    // Desktop: mouse leaving to top
    let armed = false;
    setTimeout(() => { armed = true; }, 8000);
    document.addEventListener('mouseout', e => {
      if (!armed || sessionStorage.getItem('qs_exit_shown')) return;
      if (e.clientY <= 0 && !e.relatedTarget && !e.toElement) open();
    });
    // Mobile: after 45s of reading or scroll >60%
    let mobileArmed = false;
    setTimeout(() => { mobileArmed = true; }, 45000);
    setInterval(() => {
      if (!mobileArmed || sessionStorage.getItem('qs_exit_shown')) return;
      const scrollPct = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;
      if (scrollPct > 0.85) open();
    }, 2000);

    form.addEventListener('submit', e => {
      if (!form.checkValidity()) { e.preventDefault(); form.reportValidity(); return; }
      // Browser natively submits to Formsubmit which redirects to thanks.html
      const btn = form.querySelector('button');
      btn.textContent = 'Sending…';
      btn.disabled = true;
    });
  })();

  /* ---------- REVENUE / USAGE CALCULATOR ---------- */
  const calcSlider = document.getElementById('calcSlider');
  if (calcSlider) {
    const out = {
      count: document.getElementById('calcCount'),
      items: document.getElementById('calcItems'),
      txns: document.getElementById('calcTxns'),
      saved: document.getElementById('calcSaved'),
      machine: document.getElementById('calcMachine')
    };
    const update = () => {
      const n = parseInt(calcSlider.value, 10);
      out.count.textContent = n;
      const weeklyTxns = Math.round(n * 2.8);
      const dailyItems = Math.round(weeklyTxns / 5);
      const hoursSaved = Math.round(n * 0.25 * 4);
      out.items.textContent = dailyItems.toLocaleString();
      out.txns.textContent = weeklyTxns.toLocaleString();
      out.saved.textContent = hoursSaved.toLocaleString() + ' hrs';
      let machine = 'The Compact';
      if (n >= 20) machine = 'The Standard Combo';
      if (n >= 60) machine = 'The Large-Capacity';
      if (n >= 150) machine = 'The Double-Bay';
      out.machine.textContent = machine;
    };
    calcSlider.addEventListener('input', update);
    update();
  }

  /* ---------- MULTI-STEP FORM ---------- */
  const mstepForm = document.querySelector('.contact-form-steps');
  if (mstepForm) {
    const steps = mstepForm.querySelectorAll('.mstep');
    const totalSteps = steps.length;
    const progressFill = mstepForm.querySelector('.mstep-progress-fill');
    const progressNum = mstepForm.querySelector('.mstep-current');
    const progressTotal = mstepForm.querySelector('.mstep-total');
    if (progressTotal) progressTotal.textContent = totalSteps;
    let current = 0;

    const showStep = i => {
      steps.forEach((s, idx) => s.classList.toggle('active', idx === i));
      if (progressFill) progressFill.style.width = ((i + 1) / totalSteps * 100) + '%';
      if (progressNum) progressNum.textContent = i + 1;
      current = i;
    };

    mstepForm.querySelectorAll('.mstep-next').forEach(btn => {
      btn.addEventListener('click', () => {
        const step = steps[current];
        const inputs = step.querySelectorAll('input:not([type="hidden"])[required], select[required]');
        let valid = true;
        inputs.forEach(inp => { if (!inp.checkValidity()) { inp.reportValidity(); valid = false; } });

        // Custom chip-group validation
        const chipGrid = step.querySelector('.chip-grid');
        if (chipGrid) {
          const selected = chipGrid.querySelector('.chip-option.selected');
          if (!selected) {
            chipGrid.animate(
              [{ boxShadow: '0 0 0 0 transparent' },
               { boxShadow: '0 0 0 3px var(--accent)' },
               { boxShadow: '0 0 0 0 transparent' }],
              { duration: 700, iterations: 1 }
            );
            valid = false;
          }
        }

        if (!valid) return;
        if (current < totalSteps - 1) showStep(current + 1);
      });
    });
    mstepForm.querySelectorAll('.mstep-back').forEach(btn => {
      btn.addEventListener('click', () => { if (current > 0) showStep(current - 1); });
    });

    // Chip selector for venue
    mstepForm.querySelectorAll('.chip-option').forEach(chip => {
      chip.addEventListener('click', () => {
        const group = chip.dataset.group;
        mstepForm.querySelectorAll(`.chip-option[data-group="${group}"]`).forEach(c => c.classList.remove('selected'));
        chip.classList.add('selected');
        const hidden = mstepForm.querySelector(`input[name="${group}"]`);
        if (hidden) hidden.value = chip.dataset.value;
      });
    });

    showStep(0);
  }

  /* ---------- COVERAGE MAP POSTCODE CHECKER ---------- */
  const postcodeInput = document.getElementById('postcodeInput');
  if (postcodeInput) {
    const btn = document.getElementById('checkPostcode');
    const result = document.getElementById('zoneResult');
    const userPin = document.getElementById('userPin');
    const mapLabel = document.getElementById('userPinLabel');

    // Map postcode ranges to approximate pin locations on the SVG (viewBox 600x500)
    const zones = [
      { min: 4000, max: 4179, x: 300, y: 250, name: 'Brisbane metro' },
      { min: 4500, max: 4520, x: 320, y: 190, name: 'Moreton Bay' },
      { min: 4550, max: 4575, x: 410, y: 150, name: 'Sunshine Coast' },
      { min: 4207, max: 4230, x: 380, y: 340, name: 'Gold Coast' },
      { min: 4300, max: 4310, x: 210, y: 280, name: 'Ipswich' },
      { min: 4350, max: 4370, x: 140, y: 230, name: 'Toowoomba' },
      { min: 4114, max: 4132, x: 320, y: 310, name: 'Logan' },
      { min: 4157, max: 4184, x: 360, y: 270, name: 'Redlands' }
    ];

    const check = () => {
      const v = postcodeInput.value.trim();
      const n = parseInt(v, 10);
      result.style.display = 'flex';
      result.className = 'zone-result';

      if (!/^\d{4}$/.test(v)) {
        result.classList.add('zone-out');
        result.innerHTML = `
          <div class="zone-icon">!</div>
          <div class="zone-result-body">
            <strong>Enter a 4-digit postcode</strong>
            <p>Australian postcodes are 4 digits — e.g. 4101 for South Brisbane.</p>
          </div>`;
        if (userPin) userPin.style.display = 'none';
        return;
      }

      // Find matching zone for pin placement
      const match = zones.find(z => n >= z.min && n <= z.max);
      if (match && userPin) {
        userPin.style.display = 'block';
        userPin.setAttribute('transform', `translate(${match.x}, ${match.y})`);
        if (mapLabel) mapLabel.textContent = match.name;
      } else if (userPin) {
        userPin.style.display = 'none';
      }

      if (n >= 4000 && n <= 4699) {
        result.classList.add('zone-fast');
        result.innerHTML = `
          <div class="zone-icon">✓</div>
          <div class="zone-result-body">
            <strong>You're in our fast zone${match ? ' — ' + match.name : ''}</strong>
            <p>Priority install available. Our team covers your suburb regularly. <a href="contact.html">Claim your free machine →</a></p>
          </div>`;
      } else if (n >= 4700 && n <= 4899) {
        result.classList.add('zone-regional');
        result.innerHTML = `
          <div class="zone-icon">◉</div>
          <div class="zone-result-body">
            <strong>Regional Queensland coverage</strong>
            <p>We cover you — allow 3–5 business days for first install. <a href="contact.html">Send us a note to confirm →</a></p>
          </div>`;
      } else if (n >= 2000 && n <= 9999) {
        result.classList.add('zone-out');
        result.innerHTML = `
          <div class="zone-icon">✗</div>
          <div class="zone-result-body">
            <strong>Outside our standard zone</strong>
            <p>We're QLD-focused — but we'll check for you. <a href="contact.html">Drop us your details →</a></p>
          </div>`;
      } else {
        result.classList.add('zone-out');
        result.innerHTML = `
          <div class="zone-icon">!</div>
          <div class="zone-result-body">
            <strong>Not a valid postcode</strong>
            <p>Australian postcodes are 4 digits between 0200–9999.</p>
          </div>`;
      }
    };

    if (btn) btn.addEventListener('click', check);
    postcodeInput.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); check(); } });
    postcodeInput.addEventListener('input', () => {
      postcodeInput.value = postcodeInput.value.replace(/\D/g, '').slice(0, 4);
    });
  }

  /* ---------- BOOKING SLOT PICKER ---------- */
  const slotGrid = document.getElementById('slotGrid');
  if (slotGrid) {
    const slotHidden = document.getElementById('preferredSlot');
    const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    const today = new Date();
    const slots = [];
    const times = ['9:30am', '1:00pm', '4:00pm'];
    let added = 0;
    for (let dayOffset = 1; added < 6 && dayOffset < 10; dayOffset++) {
      const d = new Date(today);
      d.setDate(d.getDate() + dayOffset);
      if (d.getDay() === 0 || d.getDay() === 6) continue; // skip weekends
      times.forEach(t => {
        if (added < 6) {
          slots.push({ day: days[d.getDay()], date: d.getDate(), time: t });
          added++;
        }
      });
    }
    slotGrid.innerHTML = slots.map(s => `
      <button type="button" class="slot-chip" data-slot="${s.day} ${s.date} ${s.time}">
        <span class="slot-day">${s.day} ${s.date}</span>
        <span class="slot-time">${s.time}</span>
      </button>
    `).join('');
    slotGrid.querySelectorAll('.slot-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        slotGrid.querySelectorAll('.slot-chip').forEach(c => c.classList.remove('selected'));
        chip.classList.add('selected');
        if (slotHidden) slotHidden.value = chip.dataset.slot;
      });
    });
  }

})();
