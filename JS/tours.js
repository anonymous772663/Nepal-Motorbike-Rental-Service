
    const cur = document.getElementById('cur'), crng = document.getElementById('crng');
    document.addEventListener('mousemove', e => { cur.style.left = e.clientX + 'px'; cur.style.top = e.clientY + 'px'; crng.style.left = e.clientX + 'px'; crng.style.top = e.clientY + 'px'; });
    document.querySelectorAll('a,button,.tc,.wc').forEach(el => { el.addEventListener('mouseenter', () => { cur.style.width = '20px'; cur.style.height = '20px'; crng.style.width = '55px'; crng.style.height = '55px'; }); el.addEventListener('mouseleave', () => { cur.style.width = '12px'; cur.style.height = '12px'; crng.style.width = '36px'; crng.style.height = '36px'; }); });
    window.addEventListener('scroll', () => { const s = window.scrollY / (document.body.scrollHeight - window.innerHeight); document.getElementById('pb').style.width = (s * 100) + '%'; document.getElementById('hd').classList.toggle('sc', window.scrollY > 60); });
    function ts() { document.getElementById('sb').classList.toggle('active'); document.getElementById('so').classList.toggle('active'); }
    const ob = new IntersectionObserver((en) => { en.forEach((e, i) => { if (e.isIntersecting) { setTimeout(() => e.target.classList.add('vis'), i * 80); ob.unobserve(e.target); } }); }, { threshold: .08 });
    document.querySelectorAll('.rv').forEach(el => ob.observe(el));
    function ft(btn, cat) { document.querySelectorAll('.tt').forEach(b => b.classList.remove('on')); btn.classList.add('on'); document.querySelectorAll('.tc').forEach(c => { c.style.display = (cat === 'all' || c.dataset.cat === cat) ? 'block' : 'none'; }); }
    function sortT(v) { const g = document.getElementById('tg'); const cs = [...g.querySelectorAll('.tc')]; cs.sort((a, b) => { if (v === 'pa') return +a.dataset.price - +b.dataset.price; if (v === 'pd') return +b.dataset.price - +a.dataset.price; if (v === 'dur') return +a.dataset.days - +b.dataset.days; return 0; }); cs.forEach(c => g.appendChild(c)); }
