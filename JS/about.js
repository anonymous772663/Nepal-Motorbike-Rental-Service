
    // ══ CURSOR
    const cursor=document.getElementById('cursor');
    const ring=document.getElementById('cursor-ring');
    document.addEventListener('mousemove',e=>{
        cursor.style.left=e.clientX+'px'; cursor.style.top=e.clientY+'px';
        ring.style.left=e.clientX+'px';   ring.style.top=e.clientY+'px';
    });
    document.querySelectorAll('a,button,.team-card,.value-card,.tl-content').forEach(el=>{
        el.addEventListener('mouseenter',()=>{cursor.style.width='20px';cursor.style.height='20px';ring.style.width='55px';ring.style.height='55px';});
        el.addEventListener('mouseleave',()=>{cursor.style.width='12px';cursor.style.height='12px';ring.style.width='36px';ring.style.height='36px';});
    });

    // ══ SCROLL PROGRESS
    window.addEventListener('scroll',()=>{
        const s=window.scrollY/(document.body.scrollHeight-window.innerHeight);
        document.getElementById('progress-bar').style.width=(s*100)+'%';
    });

    // ══ HEADER STICKY
    window.addEventListener('scroll',()=>{
        document.getElementById('header').classList.toggle('scrolled',window.scrollY>60);
    });

    // ══ SIDEBAR
    function toggleSidebar(){
        document.getElementById('sidebar').classList.toggle('active');
        document.getElementById('overlay').classList.toggle('active');
    }

    // ══ SCROLL REVEAL
    const reveals=document.querySelectorAll('.reveal');
    const obs=new IntersectionObserver((entries)=>{
        entries.forEach((entry,i)=>{
            if(entry.isIntersecting){
                setTimeout(()=>entry.target.classList.add('visible'),i*90);
                obs.unobserve(entry.target);
            }
        });
    },{threshold:0.1});
    reveals.forEach(el=>obs.observe(el));
    
