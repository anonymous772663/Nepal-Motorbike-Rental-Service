
        // GALLERY CURSOR & HOVER EFFECTS
        const cursor = document.getElementById('cursor');
        const ring = document.getElementById('cursor-ring');

        // Enhance cursor for gallery items and interactive elements
        document.querySelectorAll('a, button, .gallery-item').forEach(el => {
            el.addEventListener('mouseenter', () => {
                if (cursor && ring) {
                    cursor.style.width = '20px';
                    cursor.style.height = '20px';
                    ring.style.width = '55px';
                    ring.style.height = '55px';
                }
            });
            el.addEventListener('mouseleave', () => {
                if (cursor && ring) {
                    cursor.style.width = '12px';
                    cursor.style.height = '12px';
                    ring.style.width = '36px';
                    ring.style.height = '36px';
                }
            });
        });

        // HOVER DETECTION for gallery items
        const interactive = document.querySelectorAll('a, .gallery-item');
        interactive.forEach(item => {
            item.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
            item.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
        });
    