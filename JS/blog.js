    // ══ CURSOR
    const cursor = document.getElementById('cursor');
    const ring   = document.getElementById('cursor-ring');
    document.addEventListener('mousemove', e => {
        cursor.style.left = e.clientX + 'px'; cursor.style.top = e.clientY + 'px';
        ring.style.left   = e.clientX + 'px'; ring.style.top   = e.clientY + 'px';
    });
    document.querySelectorAll('a, button, .post-card, .popular-item, .tl-content').forEach(el => {
        el.addEventListener('mouseenter', () => { cursor.style.width='20px'; cursor.style.height='20px'; ring.style.width='55px'; ring.style.height='55px'; });
        el.addEventListener('mouseleave', () => { cursor.style.width='12px'; cursor.style.height='12px'; ring.style.width='36px'; ring.style.height='36px'; });
    });

    // ══ PROGRESS BAR
    window.addEventListener('scroll', () => {
        const s = window.scrollY / (document.body.scrollHeight - window.innerHeight);
        document.getElementById('progress-bar').style.width = (s * 100) + '%';
    });

    // ══ HEADER STICKY
    window.addEventListener('scroll', () => {
        document.getElementById('header').classList.toggle('scrolled', window.scrollY > 60);
    });

    // ══ SIDEBAR
    function toggleSidebar() {
        document.getElementById('sidebar').classList.toggle('active');
        document.getElementById('overlay').classList.toggle('active');
    }

    // ══ SCROLL REVEAL
    const obs = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add('visible'), i * 90);
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

    // ══ FILTER POSTS
    function filterPosts(btn, cat) {
        // update active tab
        if (btn) {
            document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
            btn.classList.add('active');
        }
        // show/hide cards
        document.querySelectorAll('#postsGrid .post-card').forEach(card => {
            const match = cat === 'all' || card.dataset.cat === cat;
            card.style.display = match ? 'block' : 'none';
        });
    }

    // ══ SEARCH
    function doSearch() {
        const q = document.getElementById('searchInput').value.toLowerCase().trim();
        document.querySelectorAll('#postsGrid .post-card').forEach(card => {
            const text = card.innerText.toLowerCase();
            card.style.display = (!q || text.includes(q)) ? 'block' : 'none';
        });
    }
    document.getElementById('searchInput').addEventListener('keyup', e => {
        if (e.key === 'Enter') doSearch();
    });

    // ══ LOAD MORE (stub — shows a toast)
    function loadMore() {
        const btn = event.currentTarget;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        setTimeout(() => { btn.innerHTML = '<i class="fas fa-check"></i> All Posts Loaded'; }, 1500);
    }
