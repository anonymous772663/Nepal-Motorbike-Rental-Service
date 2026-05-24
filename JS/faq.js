
    // ── Cursor
    const cursor = document.getElementById('cursor');
    const ring = document.getElementById('cursor-ring');
    document.addEventListener('mousemove', e => {
      cursor.style.left = e.clientX + 'px'; cursor.style.top = e.clientY + 'px';
      ring.style.left = e.clientX + 'px'; ring.style.top = e.clientY + 'px';
    });
    document.querySelectorAll('a, button, .faq-card').forEach(el => {
      el.addEventListener('mouseenter', () => { cursor.style.width = '20px'; cursor.style.height = '20px'; ring.style.width = '55px'; ring.style.height = '55px'; });
      el.addEventListener('mouseleave', () => { cursor.style.width = '12px'; cursor.style.height = '12px'; ring.style.width = '36px'; ring.style.height = '36px'; });
    });

    // ── Scroll
    window.addEventListener('scroll', () => {
      const s = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      document.getElementById('progress-bar').style.width = (s * 100) + '%';
      document.getElementById('header').classList.toggle('scrolled', window.scrollY > 60);
    });

    // ── Reveal
    document.querySelectorAll('.reveal').forEach((el, i) => {
      new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) { setTimeout(() => el.classList.add('visible'), i * 60); } });
      }, { threshold: 0.08 }).observe(el);
    });

    // ── Filter
    function filterFAQ(filter, btn) {
      document.querySelectorAll('.faq-tab').forEach(t => t.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.faq-category').forEach(cat => {
        if (filter === 'all') {
          cat.classList.remove('hidden');
        } else {
          cat.id === 'cat-' + filter ? cat.classList.remove('hidden') : cat.classList.add('hidden');
        }
      });
      // scroll to first visible category
      const first = document.querySelector('.faq-category:not(.hidden)');
      if (first && filter !== 'all') first.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }