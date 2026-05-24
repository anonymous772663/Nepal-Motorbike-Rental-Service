
/* ════════════════════════════════════════════
   DATABASE  — localStorage as persistent store
   Key: rental_contacts
   Each record: { id, name, phone, email, type, date, subject, message, rating, submittedAt }
   ════════════════════════════════════════════ */
const DB_KEY = 'rental_contacts';

function dbLoad() {
    try { return JSON.parse(localStorage.getItem(DB_KEY)) || []; }
    catch { return []; }
}
function dbSave(records) {
    localStorage.setItem(DB_KEY, JSON.stringify(records));
}
function dbInsert(record) {
    const records = dbLoad();
    record.id = records.length ? Math.max(...records.map(r => r.id)) + 1 : 1;
    records.push(record);
    dbSave(records);
    return record;
}
function dbDelete(id) {
    const records = dbLoad().filter(r => r.id !== id);
    dbSave(records);
}
function dbClear() { localStorage.removeItem(DB_KEY); }

/* ════════════════════════════════════════════
   CURSOR
   ════════════════════════════════════════════ */
const cursor = document.getElementById('cursor');
const ring   = document.getElementById('cursor-ring');
document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px'; cursor.style.top = e.clientY + 'px';
    ring.style.left   = e.clientX + 'px'; ring.style.top   = e.clientY + 'px';
});
document.querySelectorAll('a,button,input,select,textarea,.info-card').forEach(el => {
    el.addEventListener('mouseenter', () => { cursor.style.width='20px'; cursor.style.height='20px'; ring.style.width='55px'; ring.style.height='55px'; });
    el.addEventListener('mouseleave', () => { cursor.style.width='12px'; cursor.style.height='12px'; ring.style.width='36px'; ring.style.height='36px'; });
});

/* ════════════════════════════════════════════
   SCROLL
   ════════════════════════════════════════════ */
window.addEventListener('scroll', () => {
    const s = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    document.getElementById('progress-bar').style.width = (s*100) + '%';
    document.getElementById('header').classList.toggle('scrolled', window.scrollY > 60);
});

/* ════════════════════════════════════════════
   SIDEBAR
   ════════════════════════════════════════════ */
function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('active');
    document.getElementById('overlay').classList.toggle('active');
}

/* ════════════════════════════════════════════
   SCROLL REVEAL
   ════════════════════════════════════════════ */
const revObs = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
        if (e.isIntersecting) { setTimeout(() => e.target.classList.add('visible'), i*90); revObs.unobserve(e.target); }
    });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => revObs.observe(el));

/* ════════════════════════════════════════════
   TOAST
   ════════════════════════════════════════════ */
function showToast(msg, type='success') {
    const t = document.getElementById('toast');
    document.getElementById('toastMsg').textContent = msg;
    document.getElementById('toastIcon').className = type === 'success' ? 'fas fa-check-circle' : 'fas fa-times-circle';
    t.className = `toast ${type === 'success' ? 'success-toast' : 'error-toast'} show`;
    setTimeout(() => t.classList.remove('show'), 3800);
}

/* ════════════════════════════════════════════
   FORM VALIDATION
   ════════════════════════════════════════════ */
function setErr(id, msg) {
    const el = document.getElementById(id + '-err');
    const inp = document.getElementById(id);
    if (el) el.innerHTML = msg ? `<i class="fas fa-exclamation-circle"></i> ${msg}` : '';
    if (inp) { inp.classList.toggle('error', !!msg); inp.classList.toggle('success', !msg && inp.value.trim()); }
}
function clearErr(id) { setErr(id, ''); }

function validateField(id) {
    const el = document.getElementById(id);
    if (!el) return true;
    const val = el.value.trim();
    if (id === 'fname') {
        if (!val) { setErr(id, 'Full name is required'); return false; }
        if (val.length < 2) { setErr(id, 'Name too short'); return false; }
    }
    if (id === 'femail') {
        if (!val) { setErr(id, 'Email is required'); return false; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) { setErr(id, 'Enter a valid email address'); return false; }
    }
    if (id === 'ftype') {
        if (!val) { setErr(id, 'Please select an enquiry type'); return false; }
    }
    if (id === 'fsubject') {
        if (!val) { setErr(id, 'Subject is required'); return false; }
        if (val.length < 4) { setErr(id, 'Subject too short'); return false; }
    }
    if (id === 'fmessage') {
        if (!val) { setErr(id, 'Message is required'); return false; }
        if (val.length < 10) { setErr(id, 'Please write at least 10 characters'); return false; }
    }
    if (id === 'fphone' && val) {
        if (!/^[+\d\s\-()]{7,20}$/.test(val)) { setErr(id, 'Enter a valid phone number'); return false; }
    }
    clearErr(id);
    return true;
}

// Live validation
['fname','femail','ftype','fsubject','fmessage','fphone'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('blur', () => validateField(id));
    if (el) el.addEventListener('input', () => { if (el.classList.contains('error')) validateField(id); });
});

// Char counter
document.getElementById('fmessage').addEventListener('input', function() {
    const len = this.value.length, max = 1000;
    const c = document.getElementById('fmessage-counter');
    c.textContent = `${len} / ${max}`;
    c.className = 'char-counter' + (len > 900 ? ' over' : len > 750 ? ' warn' : '');
});

/* ════════════════════════════════════════════
   FORM SUBMIT
   ════════════════════════════════════════════ */
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // validate all required
    const valid = ['fname','femail','ftype','fsubject','fmessage','fphone']
        .map(id => validateField(id)).every(Boolean);
    if (!valid) { showToast('Please fix the errors above', 'error'); return; }

    // get rating
    const ratingEl = document.querySelector('input[name="rating"]:checked');
    const rating = ratingEl ? parseInt(ratingEl.value) : 0;

    // loading state
    const btn = document.getElementById('submitBtn');
    const spinner = document.getElementById('spinner');
    const icon = document.getElementById('submitIcon');
    const text = document.getElementById('submitText');
    btn.disabled = true;
    spinner.style.display = 'block';
    icon.style.display = 'none';
    text.textContent = 'Sending...';

    // simulate network delay (replace with real fetch() to backend)
    setTimeout(() => {
        const record = {
            name:        document.getElementById('fname').value.trim(),
            phone:       document.getElementById('fphone').value.trim(),
            email:       document.getElementById('femail').value.trim(),
            type:        document.getElementById('ftype').value,
            preferDate:  document.getElementById('fdate').value,
            subject:     document.getElementById('fsubject').value.trim(),
            message:     document.getElementById('fmessage').value.trim(),
            rating,
            submittedAt: new Date().toISOString()
        };

        // ── INSERT INTO DATABASE (localStorage)
        dbInsert(record);

        // reset form
        this.reset();
        document.getElementById('fmessage-counter').textContent = '0 / 1000';
        ['fname','femail','ftype','fsubject','fmessage'].forEach(id => {
            document.getElementById(id).classList.remove('success');
        });

        // restore button
        btn.disabled = false;
        spinner.style.display = 'none';
        icon.style.display = 'inline';
        text.textContent = 'Send Message';

        showToast('Message sent! We\'ll be in touch within 24 hours.', 'success');
        refreshTable();

        // scroll to admin
        setTimeout(() => document.getElementById('adminPanel').scrollIntoView({ behavior:'smooth', block:'start' }), 600);
    }, 1600);
});

/* ════════════════════════════════════════════
   ADMIN TABLE
   ════════════════════════════════════════════ */
let currentPage = 1;
const PAGE_SIZE  = 8;
let sortField    = 'id';
let sortDir      = 'desc';

const TYPE_LABELS = { hire:'Bike Hire', tour:'Guided Tour', repair:'Repair', event:'Events', general:'General' };
const TYPE_BADGES = { hire:'badge-hire', tour:'badge-tour', repair:'badge-repair', event:'badge-event', general:'badge-general' };

function renderTable() {
    const search  = (document.getElementById('adminSearch').value || '').toLowerCase();
    const typeF   = document.getElementById('adminFilterType').value;
    const sortSel = document.getElementById('adminSortBy').value;

    let records = dbLoad();

    // filter
    if (typeF) records = records.filter(r => r.type === typeF);
    if (search) records = records.filter(r =>
        (r.name||'').toLowerCase().includes(search) ||
        (r.email||'').toLowerCase().includes(search) ||
        (r.subject||'').toLowerCase().includes(search) ||
        (r.message||'').toLowerCase().includes(search)
    );

    // sort
    if (sortSel === 'newest') records.sort((a,b) => b.id - a.id);
    else if (sortSel === 'oldest') records.sort((a,b) => a.id - b.id);
    else if (sortSel === 'name') records.sort((a,b) => (a.name||'').localeCompare(b.name||''));
    else {
        records.sort((a,b) => {
            let av = a[sortField], bv = b[sortField];
            if (typeof av === 'string') av = av.toLowerCase();
            if (typeof bv === 'string') bv = bv.toLowerCase();
            if (av < bv) return sortDir === 'asc' ? -1 : 1;
            if (av > bv) return sortDir === 'asc' ? 1 : -1;
            return 0;
        });
    }

    // stats
    const all = dbLoad();
    const today = new Date().toDateString();
    document.getElementById('statTotal').textContent = all.length;
    document.getElementById('statToday').textContent = all.filter(r => new Date(r.submittedAt).toDateString() === today).length;
    document.getElementById('statHire').textContent  = all.filter(r => r.type === 'hire').length;
    document.getElementById('statTour').textContent  = all.filter(r => r.type === 'tour').length;

    // pagination
    const total = records.length;
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    if (currentPage > totalPages) currentPage = totalPages;
    const start = (currentPage - 1) * PAGE_SIZE;
    const paged = records.slice(start, start + PAGE_SIZE);

    // render rows
    const tbody = document.getElementById('tableBody');
    if (!paged.length) {
        tbody.innerHTML = `<tr><td colspan="8">
            <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <p>${total === 0 && !search && !typeF ? 'No submissions yet. Fill the form above!' : 'No records match your search.'}</p>
            </div>
        </td></tr>`;
    } else {
        tbody.innerHTML = paged.map(r => {
            const stars = r.rating ? '★'.repeat(r.rating) + '☆'.repeat(5-r.rating) : '—';
            const date  = r.submittedAt ? new Date(r.submittedAt).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'2-digit',hour:'2-digit',minute:'2-digit'}) : '—';
            const typeLabel = TYPE_LABELS[r.type] || r.type || '—';
            const typeBadge = TYPE_BADGES[r.type] || 'badge-general';
            return `<tr>
                <td style="color:var(--muted);font-size:0.75rem">#${r.id}</td>
                <td class="td-name">${esc(r.name)}</td>
                <td class="td-email"><a href="mailto:${esc(r.email)}">${esc(r.email)}</a></td>
                <td><span class="badge ${typeBadge}">${typeLabel}</span></td>
                <td style="max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${esc(r.subject)}">${esc(r.subject)}</td>
                <td class="stars-display">${stars}</td>
                <td style="white-space:nowrap;font-size:0.78rem;color:var(--muted)">${date}</td>
                <td><div class="td-actions">
                    <button class="act-btn act-view" onclick="viewRecord(${r.id})" title="View"><i class="fas fa-eye"></i></button>
                    <button class="act-btn act-delete" onclick="deleteRecord(${r.id})" title="Delete"><i class="fas fa-trash"></i></button>
                </div></td>
            </tr>`;
        }).join('');
    }

    // pagination controls
    document.getElementById('paginationInfo').textContent =
        total ? `Showing ${start+1}–${Math.min(start+PAGE_SIZE,total)} of ${total} record${total>1?'s':''}` : '';

    const btnWrap = document.getElementById('paginationBtns');
    btnWrap.innerHTML = '';
    if (totalPages > 1) {
        const prev = document.createElement('button');
        prev.className = 'pag-btn'; prev.innerHTML = '<i class="fas fa-chevron-left"></i>';
        prev.disabled = currentPage === 1;
        prev.onclick = () => { currentPage--; renderTable(); };
        btnWrap.appendChild(prev);

        for (let p = 1; p <= totalPages; p++) {
            const b = document.createElement('button');
            b.className = 'pag-btn' + (p === currentPage ? ' active' : '');
            b.textContent = p;
            b.onclick = () => { currentPage = p; renderTable(); };
            btnWrap.appendChild(b);
        }

        const next = document.createElement('button');
        next.className = 'pag-btn'; next.innerHTML = '<i class="fas fa-chevron-right"></i>';
        next.disabled = currentPage === totalPages;
        next.onclick = () => { currentPage++; renderTable(); };
        btnWrap.appendChild(next);
    }
}

function sortBy(field) {
    if (sortField === field) sortDir = sortDir === 'asc' ? 'desc' : 'asc';
    else { sortField = field; sortDir = 'asc'; }
    renderTable();
}

function esc(str) {
    if (!str) return '';
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function refreshTable() { currentPage = 1; renderTable(); }

function deleteRecord(id) {
    if (!confirm('Delete this record? This cannot be undone.')) return;
    dbDelete(id);
    showToast('Record deleted.', 'success');
    renderTable();
}

function clearAllRecords() {
    if (!confirm('Clear ALL contact records? This cannot be undone.')) return;
    dbClear();
    showToast('All records cleared.', 'success');
    renderTable();
}

/* ── VIEW MODAL ── */
function viewRecord(id) {
    const r = dbLoad().find(x => x.id === id);
    if (!r) return;
    const stars = r.rating ? '★'.repeat(r.rating) + '☆'.repeat(5-r.rating) : 'Not rated';
    const date  = r.submittedAt ? new Date(r.submittedAt).toLocaleString() : '—';
    const typeLabel = TYPE_LABELS[r.type] || r.type || '—';
    document.getElementById('modalBody').innerHTML = `
        <div class="modal-row"><i class="fas fa-user"></i><div><div class="modal-label">Full Name</div><div class="modal-value">${esc(r.name)}</div></div></div>
        <div class="modal-row"><i class="fas fa-envelope"></i><div><div class="modal-label">Email</div><div class="modal-value"><a href="mailto:${esc(r.email)}" style="color:var(--fire)">${esc(r.email)}</a></div></div></div>
        ${r.phone ? `<div class="modal-row"><i class="fas fa-phone"></i><div><div class="modal-label">Phone</div><div class="modal-value">${esc(r.phone)}</div></div></div>` : ''}
        <div class="modal-row"><i class="fas fa-tag"></i><div><div class="modal-label">Enquiry Type</div><div class="modal-value">${typeLabel}</div></div></div>
        ${r.preferDate ? `<div class="modal-row"><i class="fas fa-calendar"></i><div><div class="modal-label">Preferred Date</div><div class="modal-value">${esc(r.preferDate)}</div></div></div>` : ''}
        <div class="modal-row"><i class="fas fa-heading"></i><div><div class="modal-label">Subject</div><div class="modal-value">${esc(r.subject)}</div></div></div>
        <div class="modal-row"><i class="fas fa-comment"></i><div><div class="modal-label">Message</div><div class="modal-value" style="white-space:pre-wrap">${esc(r.message)}</div></div></div>
        <div class="modal-row"><i class="fas fa-star"></i><div><div class="modal-label">Rating</div><div class="modal-value" style="color:var(--amber);font-size:1rem">${stars}</div></div></div>
        <div class="modal-row"><i class="fas fa-clock"></i><div><div class="modal-label">Submitted At</div><div class="modal-value">${date}</div></div></div>
    `;
    document.getElementById('modalOverlay').classList.add('open');
}
function closeModal(e) {
    if (e.target === document.getElementById('modalOverlay')) closeModalDirect();
}
function closeModalDirect() {
    document.getElementById('modalOverlay').classList.remove('open');
}

/* ── EXPORT CSV ── */
function exportCSV() {
    const records = dbLoad();
    if (!records.length) { showToast('No records to export', 'error'); return; }
    const headers = ['ID','Name','Phone','Email','Type','Preferred Date','Subject','Message','Rating','Submitted At'];
    const rows = records.map(r => [
        r.id, r.name, r.phone, r.email,
        TYPE_LABELS[r.type]||r.type, r.preferDate, r.subject,
        (r.message||'').replace(/\n/g,' '), r.rating,
        r.submittedAt ? new Date(r.submittedAt).toLocaleString() : ''
    ].map(v => `"${String(v||'').replace(/"/g,'""')}"`).join(','));
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = `rental_contacts_${new Date().toISOString().slice(0,10)}.csv`;
    a.click(); URL.revokeObjectURL(url);
    showToast(`Exported ${records.length} record${records.length>1?'s':''} to CSV`, 'success');
}

/* ── INIT ── */
renderTable();
