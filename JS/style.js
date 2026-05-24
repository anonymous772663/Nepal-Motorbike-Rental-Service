
        const cursor = document.getElementById('cursor');
        const ring = document.getElementById('cursor-ring');
        document.addEventListener('mousemove', e => {
            cursor.style.left = e.clientX + 'px'; cursor.style.top = e.clientY + 'px';
            ring.style.left = e.clientX + 'px'; ring.style.top = e.clientY + 'px';
        });
        document.querySelectorAll('a, button, .tour-card, .why-card, .step-card, .test-card').forEach(el => {
            el.addEventListener('mouseenter', () => { cursor.style.width = '20px'; cursor.style.height = '20px'; ring.style.width = '55px'; ring.style.height = '55px'; });
            el.addEventListener('mouseleave', () => { cursor.style.width = '12px'; cursor.style.height = '12px'; ring.style.width = '36px'; ring.style.height = '36px'; });
        });
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY / (document.body.scrollHeight - window.innerHeight);
            document.getElementById('progress-bar').style.width = (scrolled * 100) + '%';
        });
        window.addEventListener('scroll', () => {
            document.getElementById('header').classList.toggle('scrolled', window.scrollY > 60);
        });
        window.addEventListener('scroll', () => {
            const ratio = Math.min(window.scrollY / (window.innerHeight * 0.6), 1);
            document.getElementById('heroBg2').style.opacity = ratio;
        });
        function toggleSidebar() {
            document.getElementById('sidebar').classList.toggle('active');
            document.getElementById('overlay').classList.toggle('active');
        }
        const reveals = document.querySelectorAll('.reveal');
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, i) => {
                if (entry.isIntersecting) {
                    setTimeout(() => entry.target.classList.add('visible'), i * 80);
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });
        reveals.forEach(el => revealObserver.observe(el));
  