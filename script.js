const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz11tu_56wCzmKP-hI8iJEV9Ou5SHDpAA6v6e_81Vt8yStChI9iilbZBDymfvQrZ2c4/exec';
const WEB3FORMS_URL = 'https://api.web3forms.com/submit';
const HOURLY_RATE = 3000;
const EXTRA_PRICES = {
  'C-Stand + Amaran 200x + октабокс — 1 100 ₽': 1100,
  'Генератор дыма — 1 000 ₽': 1000,
  'Генератор снега — 2 000 ₽': 2000,
  'Свечи — 1 000 ₽': 1000,
  'Гардероб — от 1 000 ₽': 1000,
  'Отпариватель — 500 ₽': 500
};
// ===== REVEAL ON SCROLL =====
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
revealElements.forEach(el => revealObserver.observe(el));
// ===== HEADER SCROLL =====
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  if (header) header.classList.toggle('scrolled', window.scrollY > 100);
});
// ===== BURGER MENU =====
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
if (burger && mobileMenu) {
  burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
  });
}
document.querySelectorAll('.mobile-menu__link').forEach(link => {
  link.addEventListener('click', () => {
    if (burger) burger.classList.remove('active');
    if (mobileMenu) mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
  });
});
// ===== SERVICES TOGGLE =====
const servicesToggle = document.getElementById('servicesToggle');
const servicesListWrap = document.getElementById('servicesListWrap');
if (servicesToggle && servicesListWrap) {
  servicesToggle.addEventListener('click', () => {
    servicesToggle.classList.toggle('open');
    servicesListWrap.classList.toggle('open');
  });
}
// ===== CREATIVE PRODUCTION EXPAND =====
const creativeExpand = document.getElementById('creativeExpand');
if (creativeExpand) {
  creativeExpand.addEventListener('click', () => {
    creativeExpand.classList.toggle('open');
  });
}
// ===== PORTFOLIO FILTER =====
const filterBtns = document.querySelectorAll('.portfolio__filter');
const portfolioItems = document.querySelectorAll('.portfolio__item');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    portfolioItems.forEach(item => {
      item.classList.toggle('hidden', filter !== 'all' && item.dataset.category !== filter);
    });
  });
});
// ===== CONTACT FORM =====
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const btn = this.querySelector('[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = 'Отправлено ✓';
    btn.disabled = true;
    this.reset();
    setTimeout(() => {
      btn.textContent = originalText;
      btn.disabled = false;
    }, 3000);
  });
}
// ===== BOOKING SYSTEM =====
let BOOKINGS = [];
const WORK_START = 10;
const WORK_END = 21; // последний старт
const TOTAL_SLOTS = WORK_END - WORK_START + 1;
const MONTHS = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
const MONTHS_GEN = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
let calYear = new Date().getFullYear();
let calMonth = new Date().getMonth();
let selectedDate = null;
let selStartH = null;
let selEndH = null;
const calMonthEl = document.getElementById('calMonth');
const calDaysEl = document.getElementById('calDays');
const stepCalendarEl = document.getElementById('stepCalendar');
const stepTimeEl = document.getElementById('stepTime');
const stepFormEl = document.getElementById('stepForm');
const timeSlotsEl = document.getElementById('timeSlots');
const selectedDateDisp = document.getElementById('selectedDateDisplay');
const selectedInfoDisp = document.getElementById('selectedInfoDisplay');
const formDateInput = document.getElementById('formDate');
const formTimeInput = document.getElementById('formTime');
const bookingSuccessEl = document.getElementById('bookingSuccess');
const bookingForm = document.getElementById('bookingForm');
function dateKey(y, m, d) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}
function pad(h) {
  return `${String(h).padStart(2, '0')}:00`;
}
function normalizeDateKey(value) {
  if (!value) return '';
  if (typeof value === 'string') {
    const raw = value.trim();
    // 2026-03-18
    const isoMatch = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (isoMatch) {
      return `${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}`;
    }
    // 18.03.2026
    const ruMatch = raw.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
    if (ruMatch) {
      return `${ruMatch[3]}-${ruMatch[2]}-${ruMatch[1]}`;
    }
    const dt = new Date(raw);
    if (!isNaN(dt.getTime())) {
      return dateKey(dt.getFullYear(), dt.getMonth(), dt.getDate());
    }
  }
  if (value instanceof Date && !isNaN(value.getTime())) {
    return dateKey(value.getFullYear(), value.getMonth(), value.getDate());
  }
  try {
    const dt = new Date(value);
    if (!isNaN(dt.getTime())) {
      return dateKey(dt.getFullYear(), dt.getMonth(), dt.getDate());
    }
  } catch (_) {}
  return String(value).trim();
}
function parseHour(timeStr) {
  if (timeStr == null) return null;
  const s = String(timeStr).trim();
  // 13:00 или 13:00:00
  let m = s.match(/^(\d{1,2}):(\d{2})(?::\d{2})?/);
  if (m) return Number(m[1]);
  // Date string
  const d = new Date(s);
  if (!isNaN(d.getTime())) {
    return d.getHours();
  }
  return null;
}
function hoursWord(n) {
  if (n === 1) return '1 час';
  if (n >= 2 && n <= 4) return `${n} часа`;
  return `${n} часов`;
}
function normalizeBooking(item) {
  return {
    ...item,
    date: normalizeDateKey(item.date),
    start: item.start != null ? String(item.start).trim() : '',
    end: item.end != null ? String(item.end).trim() : ''
  };
}
function getBookingsForDate(key) {
  return BOOKINGS.filter(item => normalizeDateKey(item.date) === key);
}
function getBookedHoursForDate(key) {
  const hours = [];
  getBookingsForDate(key).forEach(item => {
    const start = parseHour(item.start);
    const end = parseHour(item.end);
    if (start !== null && end !== null && end > start) {
      for (let h = start; h < end; h++) {
        hours.push(h);
      }
    }
  });
  return hours;
}
function dayStatus(key) {
  const bookedHours = [...new Set(getBookedHoursForDate(key))];
  const n = bookedHours.length;
  if (n === 0) return 'available';
  if (n >= TOTAL_SLOTS) return 'full';
  return 'partial';
}
async function loadBookings() {
  try {
    const res = await fetch(`${APPS_SCRIPT_URL}?action=bookings&_=${Date.now()}`, {
      cache: 'no-store'
    });
    const data = await res.json();
    if (data.success) {
      BOOKINGS = (data.bookings || []).map(normalizeBooking);
      console.log('BOOKINGS:', BOOKINGS);
    } else {
      BOOKINGS = [];
      console.warn(data.message || 'Не удалось загрузить брони');
    }
  } catch (error) {
    BOOKINGS = [];
    console.warn('Ошибка загрузки броней:', error);
  }
  renderCalendar();
  if (selectedDate) {
    renderTimeSlots(dateKey(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate()
    ));
  }
}
function renderCalendar() {
  if (!calMonthEl || !calDaysEl) return;
  calMonthEl.textContent = `${MONTHS[calMonth]} ${calYear}`;
  calDaysEl.innerHTML = '';
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const total = new Date(calYear, calMonth + 1, 0).getDate();
  const offset = firstDay === 0 ? 6 : firstDay - 1;
  for (let i = 0; i < offset; i++) {
    const blank = document.createElement('div');
    blank.className = 'cal-day';
    calDaysEl.appendChild(blank);
  }
  for (let d = 1; d <= total; d++) {
    const date = new Date(calYear, calMonth, d);
    const key = dateKey(calYear, calMonth, d);
    const isPast = date < today;
    const status = dayStatus(key);
    const isSelected = selectedDate &&
      selectedDate.getFullYear() === calYear &&
      selectedDate.getMonth() === calMonth &&
      selectedDate.getDate() === d;
    const cell = document.createElement('div');
    cell.className = 'cal-day';
    cell.textContent = d;
    if (isPast) {
      cell.classList.add('cal-day--past');
    } else if (status === 'full') {
      cell.classList.add('cal-day--full');
    } else {
      cell.classList.add('cal-day--available');
      if (status === 'partial') cell.classList.add('cal-day--partial');
      if (date.getTime() === today.getTime()) cell.classList.add('cal-day--today');
      if (isSelected) cell.classList.add('cal-day--selected');
      cell.addEventListener('click', () => handleDateClick(date, key));
    }
    calDaysEl.appendChild(cell);
  }
}
function handleDateClick(date, key) {
  selectedDate = date;
  selStartH = null;
  selEndH = null;
  renderCalendar();
  const wd = date.toLocaleDateString('ru-RU', { weekday: 'long' });
  selectedDateDisp.textContent = `${wd}, ${date.getDate()} ${MONTHS_GEN[date.getMonth()]} ${date.getFullYear()}`;
  renderTimeSlots(key);
  setStep(2);
}
function renderTimeSlots(key) {
  if (!timeSlotsEl) return;
  const bookedH = new Set(getBookedHoursForDate(key));
  const titleEl = document.getElementById('timeStepTitle');
  console.log('Selected date key:', key);
  console.log('Booked hours for date:', [...bookedH]);
  timeSlotsEl.innerHTML = '';
  if (selStartH === null) {
    if (titleEl) titleEl.textContent = 'Выберите время начала';
    const label = document.createElement('span');
    label.className = 'time-slots__label';
    label.textContent = 'Нажмите на свободный слот — это будет начало аренды';
    timeSlotsEl.appendChild(label);
    const grid = document.createElement('div');
    grid.className = 'time-slots';
    timeSlotsEl.appendChild(grid);
    for (let h = WORK_START; h <= WORK_END; h++) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = pad(h);
      if (bookedH.has(h)) {
        btn.className = 'time-slot time-slot--booked';
        btn.disabled = true;
      } else {
        btn.className = 'time-slot time-slot--free';
        btn.addEventListener('click', () => {
          selStartH = h;
          renderTimeSlots(key);
        });
      }
      grid.appendChild(btn);
    }
    return;
  }
  if (selEndH === null) {
    if (titleEl) titleEl.textContent = 'Выберите время окончания';
    let maxEndH = WORK_END + 1;
    for (let h = selStartH; h <= WORK_END; h++) {
      if (bookedH.has(h)) {
        maxEndH = h;
        break;
      }
    }
    const label = document.createElement('span');
    label.className = 'time-slots__label';
    label.innerHTML = `Начало: <strong style="color:#e8e4de">${pad(selStartH)}</strong> · Выберите время окончания`;
    timeSlotsEl.appendChild(label);
    const resetBtn = document.createElement('button');
    resetBtn.type = 'button';
    resetBtn.className = 'booking__back';
    resetBtn.style.cssText = 'display:block; margin-bottom:14px;';
    resetBtn.textContent = '← Изменить начало';
    resetBtn.addEventListener('click', () => {
      selStartH = null;
      renderTimeSlots(key);
    });
    timeSlotsEl.appendChild(resetBtn);
    const grid = document.createElement('div');
    grid.className = 'time-slots';
    timeSlotsEl.appendChild(grid);
    for (let h = WORK_START; h <= WORK_END + 1; h++) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = pad(h);
      if (h < selStartH) {
        btn.className = 'time-slot time-slot--past';
        btn.disabled = true;
      } else if (h === selStartH) {
        btn.className = 'time-slot time-slot--range-start';
        btn.disabled = true;
      } else if (h <= maxEndH) {
        btn.className = 'time-slot time-slot--end-option';
        btn.addEventListener('click', () => {
          selEndH = h;
          renderTimeSlots(key);
        });
      } else {
        btn.className = bookedH.has(h)
          ? 'time-slot time-slot--booked'
          : 'time-slot time-slot--blocked';
        btn.disabled = true;
      }
      grid.appendChild(btn);
    }
    return;
  }
  if (titleEl) titleEl.textContent = 'Время выбрано';
  const startStr = pad(selStartH);
  const endStr = pad(selEndH);
  const hours = selEndH - selStartH;
  const summary = document.createElement('div');
  summary.className = 'time-range-summary';
  summary.innerHTML = `
    <div class="time-range-summary__time">${startStr} — ${endStr}</div>
    <div class="time-range-summary__hours">${hoursWord(hours)}</div>
  `;
  timeSlotsEl.appendChild(summary);
  const costBlock = document.createElement('div');
  costBlock.className = 'time-range-summary';
  costBlock.style.marginTop = '12px';
  costBlock.innerHTML = `
    <div class="time-range-summary__time">${formatPrice(hours * HOURLY_RATE)}</div>
    <div class="time-range-summary__hours">только аренда студии</div>
  `;
  timeSlotsEl.appendChild(costBlock);
  const changeBtn = document.createElement('button');
  changeBtn.type = 'button';
  changeBtn.className = 'booking__back';
  changeBtn.style.cssText = 'display:block; margin:16px 0;';
  changeBtn.textContent = '← Изменить время';
  changeBtn.addEventListener('click', () => {
    selStartH = null;
    selEndH = null;
    renderTimeSlots(key);
  });
  timeSlotsEl.appendChild(changeBtn);
  const continueBtn = document.createElement('button');
  continueBtn.type = 'button';
  continueBtn.className = 'btn btn--full';
  continueBtn.textContent = 'Продолжить →';
  continueBtn.addEventListener('click', () => {
    const d = selectedDate.getDate();
    const m = MONTHS_GEN[selectedDate.getMonth()];
    const y = selectedDate.getFullYear();
    selectedInfoDisp.textContent = `${d} ${m} ${y} · ${startStr} — ${endStr} (${hoursWord(hours)})`;
    formDateInput.value = dateKey(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate()
    );
    formTimeInput.value = `${startStr} — ${endStr}`;
    setStep(3);
    updateTotalBox();
  });
  timeSlotsEl.appendChild(continueBtn);
}
function setStep(step) {
  [stepCalendarEl, stepTimeEl, stepFormEl].forEach(el => {
    if (el) el.classList.add('booking__step-content--hidden');
  });
  if (step === 1 && stepCalendarEl) stepCalendarEl.classList.remove('booking__step-content--hidden');
  if (step === 2 && stepTimeEl) stepTimeEl.classList.remove('booking__step-content--hidden');
  if (step === 3 && stepFormEl) stepFormEl.classList.remove('booking__step-content--hidden');
  document.querySelectorAll('.booking__step').forEach((el, i) => {
    el.classList.toggle('active', i + 1 === step);
    el.classList.toggle('done', i + 1 < step);
  });
}
function getSelectedHoursCount() {
  if (selStartH === null || selEndH === null) return 0;
  return selEndH - selStartH;
}
function getSelectedExtras() {
  return [...document.querySelectorAll('input[name="extras[]"]:checked')].map(el => el.value);
}
function getExtrasTotal() {
  return getSelectedExtras().reduce((sum, item) => sum + (EXTRA_PRICES[item] || 0), 0);
}
function getBookingTotal() {
  return getSelectedHoursCount() * HOURLY_RATE + getExtrasTotal();
}
function formatPrice(value) {
  return new Intl.NumberFormat('ru-RU').format(value) + ' ₽';
}
function ensureTotalBox() {
  if (!bookingForm) return null;
  let box = document.getElementById('bookingTotalBox');
  if (box) return box;
  box = document.createElement('div');
  box.id = 'bookingTotalBox';
  box.style.marginBottom = '20px';
  box.style.padding = '20px';
  box.style.border = '1px solid #2a2a2a';
  box.style.background = '#111';
  const submitBtn = document.getElementById('bookingSubmitBtn');
  if (submitBtn) {
    submitBtn.parentNode.insertBefore(box, submitBtn);
  } else {
    bookingForm.appendChild(box);
  }
  return box;
}
function updateTotalBox() {
  const box = ensureTotalBox();
  if (!box) return;
  const hours = getSelectedHoursCount();
  const extras = getSelectedExtras();
  const extrasTotal = getExtrasTotal();
  const rentTotal = hours * HOURLY_RATE;
  const total = rentTotal + extrasTotal;
  const extrasList = extras.length
    ? extras.map(item => `<div style="margin-top:6px;color:#aaa;">• ${item}</div>`).join('')
    : '<div style="margin-top:6px;color:#666;">Без доп. оборудования</div>';
  box.innerHTML = `
    <div style="font-size:11px; text-transform:uppercase; letter-spacing:0.2em; color:#666; margin-bottom:10px;">
      Итоговая стоимость
    </div>
    <div style="font-family:'Cormorant Garamond', serif; font-size:34px; color:#e8e4de; margin-bottom:16px;">
      ${formatPrice(total)}
    </div>
    <div style="font-size:13px; color:#aaa; line-height:1.7;">
      Аренда: ${hours} ч × ${formatPrice(HOURLY_RATE)} = ${formatPrice(rentTotal)}
    </div>
    <div style="font-size:13px; color:#aaa; line-height:1.7; margin-top:8px;">
      Доп. оборудование: ${formatPrice(extrasTotal)}
    </div>
    <div style="margin-top:12px;">
      ${extrasList}
    </div>
  `;
}
if (bookingForm) {
  bookingForm.addEventListener('change', updateTotalBox);
}
const calPrev = document.getElementById('calPrev');
const calNext = document.getElementById('calNext');
const backToCalendar = document.getElementById('backToCalendar');
const backToTime = document.getElementById('backToTime');
if (calPrev) {
  calPrev.addEventListener('click', () => {
    calMonth--;
    if (calMonth < 0) {
      calMonth = 11;
      calYear--;
    }
    renderCalendar();
  });
}
if (calNext) {
  calNext.addEventListener('click', () => {
    calMonth++;
    if (calMonth > 11) {
      calMonth = 0;
      calYear++;
    }
    renderCalendar();
  });
}
if (backToCalendar) {
  backToCalendar.addEventListener('click', () => {
    selStartH = null;
    selEndH = null;
    setStep(1);
  });
}
if (backToTime) {
  backToTime.addEventListener('click', () => {
    setStep(2);
  });
}
if (bookingForm) {
  bookingForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const btn = document.getElementById('bookingSubmitBtn');
    const originalText = 'Отправить заявку';
    const formData = new FormData(this);
    const hours = getSelectedHoursCount();
    const extras = getSelectedExtras();
    const total = getBookingTotal();
    if (!selectedDate || selStartH === null || selEndH === null) {
      alert('Сначала выберите дату и время');
      return;
    }
    const payload = {
      action: 'create',
      date: formDateInput.value,
      start: pad(selStartH),
      end: pad(selEndH),
      hours: hours,
      name: formData.get('name'),
      contact: formData.get('contact'),
      service: formData.get('service'),
      extras: extras,
      message: formData.get('message') || '',
      total: total
    };
    btn.textContent = 'Отправляем...';
    btn.disabled = true;
    try {
      const res = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        try {
          const serviceLabel =
            payload.service === 'rent' ? 'Аренда студии' :
            payload.service === 'event' ? 'Мероприятие' :
            payload.service;
          await fetch(WEB3FORMS_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              access_key: '9f6b060c-94e5-4b7a-9243-cc51e3cc97fb',
              from_name: 'Lumière Noire — Сайт',
              subject: `Новое бронирование — ${payload.date} · ${payload.start} — ${payload.end}`,
              name: payload.name,
              contact: payload.contact,
              service: serviceLabel,
              date: payload.date,
              time: `${payload.start} — ${payload.end}`,
              hours: `${payload.hours} ч`,
              extras: payload.extras.length ? payload.extras.join(', ') : 'Нет',
              total: formatPrice(payload.total),
              message: payload.message || 'Без комментария'
            })
          });
        } catch (mailError) {
          console.warn('Письмо через Web3Forms не отправилось:', mailError);
        }
        await loadBookings();
        stepFormEl.classList.add('booking__step-content--hidden');
        bookingSuccessEl.classList.remove('booking__success--hidden');
      } else {
        alert(data.message || 'Не удалось создать бронь');
        btn.textContent = originalText;
        btn.disabled = false;
      }
    } catch (error) {
      console.error(error);
      alert('Ошибка соединения. Если сайт открыт просто файлом с компьютера, открой его через хостинг или Live Server.');
      btn.textContent = originalText;
      btn.disabled = false;
    }
  });
}
const newBookingBtn = document.getElementById('newBookingBtn');
if (newBookingBtn) {
  newBookingBtn.addEventListener('click', () => {
    selectedDate = null;
    selStartH = null;
    selEndH = null;
    bookingForm.reset();
    bookingSuccessEl.classList.add('booking__success--hidden');
    setStep(1);
    renderCalendar();
    updateTotalBox();
    const btn = document.getElementById('bookingSubmitBtn');
    if (btn) {
      btn.textContent = 'Отправить заявку';
      btn.disabled = false;
    }
  });
}
loadBookings();
setInterval(() => {
  if (!document.hidden) {
    loadBookings();
  }
}, 30000);
// ===== LEVITATION MODAL =====
(function() {
  const modal = document.getElementById('levModal');
  const openBtn = document.getElementById('levDocBtn');
  const closeBtn = document.getElementById('levModalClose');
  const backdrop = document.getElementById('levModalBackdrop');
  const bookBtn = document.getElementById('levModalBookBtn');
  if (!modal || !openBtn) return;
  function openModal() {
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    // scroll panel to top each time
    const panel = modal.querySelector('.lev-modal__panel');
    if (panel) panel.scrollTop = 0;
  }
  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
  }
  openBtn.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);
  // Close modal when user clicks "Забронировать" inside it
  if (bookBtn) {
    bookBtn.addEventListener('click', closeModal);
  }
  // Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });
})();
// ===== PORTFOLIO TOGGLE =====
(function() {
  const toggle = document.getElementById('portfolioToggle');
  const wrap = document.getElementById('portfolioListWrap');
  if (!toggle || !wrap) return;
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('open');
    wrap.classList.toggle('open');
  });
})();
