const calendar = document.getElementById('calendar');

function createCalendar(year, month) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();

  calendar.innerHTML = '';

  let day = firstDay.getDay(); // Day of the week (0-6)

  // Add empty cells for days before the 1st
  for (let i = 0; i < day; i++) {
    const cell = document.createElement('div');
    cell.classList.add('calendar-day', 'past');
    calendar.appendChild(cell);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month, i);
    const cell = document.createElement('div');
    cell.classList.add('calendar-day');
    cell.textContent = i;
    
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
      cell.classList.add('today');
    } else if (date < today) {
      cell.classList.add('past');
    } else {
      cell.classList.add('future');
    }

    calendar.appendChild(cell);
  }
}

const today = new Date();
createCalendar(today.getFullYear(), today.getMonth());