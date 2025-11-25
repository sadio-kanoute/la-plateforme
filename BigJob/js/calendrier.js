const monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

const joursSemaineEl = document.getElementById('joursSemaine');
const titleEl = document.getElementById('cldt');
let cases = Array.from(document.getElementsByClassName('case'));
const btnPrev = document.getElementById('avant');
const btnNext = document.getElementById('apres');

let today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();

function renderCalendar(month, year) {
    if (cases.length === 0) return;

    const first = new Date(year, month, 1);
    const startIndex = (first.getDay() + 6) % 7;

    const daysInMonth = new Date(year, month + 1, 0).getDate();

    cases.forEach(c => { c.classList.remove('other-month', 'today', 'selected'); c.innerHTML = ''; c.removeAttribute('data-day'); });

    for (let i = 0; i < startIndex; i++) {
        cases[i].innerHTML = '';
        cases[i].classList.remove('other-month', 'today');
        cases[i].removeAttribute('data-day');
    }

    let idx = startIndex;
    for (let d = 1; d <= daysInMonth; d++) {
        const cell = cases[idx];
        cell.innerHTML = `<div class="date">${d}</div>`;
        cell.setAttribute('data-day', `curr-${d}`);
        cell.classList.remove('other-month');
        if (d === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
            cell.classList.add('today');
        }
        idx++;
    }

    while (idx < cases.length) {
        cases[idx].innerHTML = '';
        cases[idx].classList.remove('other-month', 'today');
        cases[idx].removeAttribute('data-day');
        idx++;
    }

    if (titleEl) titleEl.innerText = `${monthNames[month]} ${year}`;

    try {
        const storageKey = 'calendar-reservations';
        const raw = localStorage.getItem(storageKey);
        const reservations = raw ? JSON.parse(raw) : {};

        cases.forEach((c, i) => {
            const dateAttr = c.getAttribute('data-day');
            if (dateAttr && dateAttr.startsWith('curr-')) {
                const parts = dateAttr.split('-');
                const d = parts[1].padStart(2, '0');
                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${d}`;
                c.onclick = (ev) => {
                    ev.stopPropagation();
                    openReservationModal(dateStr, c);
                };
                c.style.cursor = 'pointer';
            } else {
                c.onclick = null;
                c.style.cursor = '';
            }
            if (dateAttr && dateAttr.startsWith('curr-')) {
                const parts = dateAttr.split('-');
                const d = parts[1].padStart(2, '0');
                const key = `${year}-${String(month + 1).padStart(2, '0')}-${d}`;
                if (reservations[key])
                    c.classList.add('reserved'); else {
                    c.classList.remove('reserved'); c.innerText = c.innerText + " Reserver";
                }
            } else {
                c.classList.remove('reserved');
            }
        });
    } catch (e) { console.error(e); }
}

function buildGridIfNeeded() {
    if (!joursSemaineEl) return;
    const existingDays = joursSemaineEl.querySelector('.days');
    if (existingDays && existingDays.querySelectorAll('.case').length === 42) {
        cases = Array.from(existingDays.querySelectorAll('.case'));
        return;
    }

    const weekdayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    let html = '';
    html += '<div class="weekdays">';
    for (const w of weekdayNames) html += `<div class="weekday">${w}</div>`;
    html += '</div>';
    html += '<div class="days">';
    for (let i = 0; i < 42; i++) html += '<div class="case"></div>';
    html += '</div>';
    joursSemaineEl.innerHTML = html;
    cases = Array.from(joursSemaineEl.querySelectorAll('.case'));
}

buildGridIfNeeded();

if (btnPrev) btnPrev.addEventListener('click', () => {
    if (currentMonth === 0) { currentMonth = 11; currentYear--; }
    else currentMonth--;
    renderCalendar(currentMonth, currentYear);
});
if (btnNext) btnNext.addEventListener('click', () => {
    if (currentMonth === 11) { currentMonth = 0; currentYear++; }
    else currentMonth++;
    renderCalendar(currentMonth, currentYear);
});

renderCalendar(currentMonth, currentYear);

function openReservationModal(dateStr, cell) {
    if (document.getElementById('resv-modal')) return;
    const overlay = document.createElement('div');
    overlay.id = 'resv-modal';
    overlay.innerHTML = `
      <div class="resv-modal-overlay"></div>
      <div class="resv-modal">
        <h3>Réserver le ${dateStr}</h3>
        <form id="resv-inline-form">
          <div style="margin-top:12px;display:flex;gap:8px;justify-content:flex-end;">
            <button type="button" class="btn-ghost" id="r-cancel">Annuler</button>
            <button type="submit" class="btn-primary">Confirmer</button>
          </div>
        </form>
      </div>
    `;
    document.body.appendChild(overlay);

    const form = document.getElementById('resv-inline-form');
    const cancel = document.getElementById('r-cancel');

    try {
        const storageKey = 'calendar-reservations';
        const raw = localStorage.getItem(storageKey);
        const reservations = raw ? JSON.parse(raw) : {};
        if (reservations[dateStr]) {
            document.getElementById('r-name').value = reservations[dateStr].name || '';
            document.getElementById('r-email').value = reservations[dateStr].email || '';
        }
    } catch (e) { console.error(e) }

    cancel.addEventListener('click', () => { closeModal(); });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        /*   const name = document.getElementById('r-name').value.trim();
          const email = document.getElementById('r-email').value.trim(); */
        const user_id = localStorage.getItem('user_id') || '';
        const login = localStorage.getItem('login') || '';
        const role = localStorage.getItem('role') || '';
        // if (!user_id || !login) return;
        const storageKey = 'calendar-reservations';
        const raw = localStorage.getItem(storageKey);
        const reservations = raw ? JSON.parse(raw) : {};
        reservations[dateStr] = { user_id, login, date: dateStr, status: "pending", id: reservations.length + 1 };
        localStorage.setItem(storageKey, JSON.stringify(reservations));
        console.log(localStorage.getItem(storageKey));
        if (cell) cell.classList.add('reserved');
        closeModal();
    });

    function closeModal() {
        const el = document.getElementById('resv-modal');
        if (el) el.remove();
    }
}
