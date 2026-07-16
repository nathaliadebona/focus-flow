// ===== NOTES =====
const noteModal = document.getElementById("note-modal");
const openNoteModal = document.getElementById("new-note-btn");
const cancelNoteModal = document.getElementById("cancel-note-btn");
const noteForm = document.getElementById("note-form");
const emptyState = document.getElementById("notes-empty-state");
const noteList = document.getElementById("notes-list");
let noteBeingEdited = null;
let notes = JSON.parse(localStorage.getItem('notes')) || [];

function saveNotes() {
    localStorage.setItem('notes', JSON.stringify(notes));
}

function renderNotes() {
    noteList.innerHTML = '';

    if (notes.length === 0) {
        emptyState.style.display = 'block';
    } else {
        emptyState.style.display = 'none';
    }

    notes.forEach(function(note, index) {
        const noteItem = document.createElement('li');

        const noteName = document.createElement('h3');
        noteName.textContent = note.title;
        noteItem.appendChild(noteName);

        const noteText = document.createElement('p');
        noteText.textContent = note.content;
        noteItem.appendChild(noteText);

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = "Delete";
        noteItem.appendChild(deleteBtn);
        deleteBtn.addEventListener('click', function() {
            notes.splice(index, 1);
            saveNotes();
            renderNotes();
        });

        const editBtn = document.createElement('button');
        editBtn.textContent = "Edit";
        noteItem.appendChild(editBtn);
        editBtn.addEventListener('click', function() {
            document.getElementById("note-title").value = note.title;
            document.getElementById("note-content").value = note.content;
            noteBeingEdited = index;
            noteModal.showModal();
        });

        noteList.appendChild(noteItem);
    });
}

openNoteModal.addEventListener('click', function() {
    noteModal.showModal();
});

cancelNoteModal.addEventListener('click', function() {
    noteModal.close();
});

noteForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const title = document.getElementById("note-title").value;
    const content = document.getElementById("note-content").value;

    if (noteBeingEdited !== null) {
        notes[noteBeingEdited].title = title;
        notes[noteBeingEdited].content = content;
        noteBeingEdited = null;
    } else {
        notes.push({ title: title, content: content });
    }

    saveNotes();
    renderNotes();

    noteForm.reset();
    noteModal.close();
});

renderNotes();

// ===== CALENDAR =====

// Element references
const eventModal = document.getElementById("event-modal");
const cancelEventBtn = document.getElementById("cancel-event-btn");
const prevMonthBtn = document.getElementById("prev-month");
const nextMonthBtn = document.getElementById("next-month");
const eventForm = document.getElementById("event-form");
const deleteEventBtn = document.getElementById("delete-event-btn");

// Data/state variables
const today = new Date();
let currentYear = today.getFullYear();
let currentMonth = today.getMonth();
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let events = JSON.parse(localStorage.getItem('events')) || [];
let selectedDay = null;
let eventBeingEdited = null;

// Functions
function renderCalendarHeader() {
    const currentMonthEl = document.getElementById("current-month");
    currentMonthEl.textContent = monthNames[currentMonth] + " " + currentYear;
}

function renderCalendarDays() {
    const calendarGrid = document.getElementById("calendar-grid");
    calendarGrid.innerHTML = '';

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();

    let row = document.createElement('tr');

    for (let i = 0; i < firstDayOfWeek; i++) {
        const emptyCell = document.createElement('td');
        row.appendChild(emptyCell);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const cell = document.createElement('td');
        cell.textContent = day;

        if (day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()) {
            cell.classList.add('today');
        }

        cell.dataset.day = day;

        const eventIndex = events.findIndex(function(event) {
            return event.day === day && event.month === currentMonth && event.year === currentYear;
        });

        if (events[eventIndex]) {
            cell.classList.add('has-event');

            const eventTitle = document.createElement('div');
            eventTitle.textContent = events[eventIndex].title;
            cell.appendChild(eventTitle);
        }

        cell.addEventListener('click', function() {
            selectedDay = day;

            if (eventIndex !== -1) {
                eventBeingEdited = eventIndex;

                document.getElementById("event-title").value = events[eventIndex].title;
                document.getElementById("event-time").value = events[eventIndex].time;
                document.getElementById("event-notes").value = events[eventIndex].notes;
                document.getElementById("event-modal-title").textContent = "Edit Event";
            } else {
                eventBeingEdited = null;
                document.getElementById("event-modal-title").textContent = "Add Event";
            }

            eventModal.showModal();
        });

        row.appendChild(cell);

        const totalCellsSoFar = firstDayOfWeek + day;

        if (totalCellsSoFar % 7 === 0) {
            calendarGrid.appendChild(row);
            row = document.createElement('tr');
        }
    }

    if (row.children.length > 0) {
        calendarGrid.appendChild(row);
    }
}

function saveEvents() {
    localStorage.setItem('events', JSON.stringify(events));
}

// Click events (addEventListener)
cancelEventBtn.addEventListener('click', function() {
    eventModal.close();
});

prevMonthBtn.addEventListener('click', function() {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendarHeader();
    renderCalendarDays();
});

nextMonthBtn.addEventListener('click', function() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendarHeader();
    renderCalendarDays();
});

eventForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const title = document.getElementById("event-title").value;
    const time = document.getElementById("event-time").value;
    const notes = document.getElementById("event-notes").value;

    if (eventBeingEdited !== null) {
        events[eventBeingEdited].title = title;
        events[eventBeingEdited].time = time;
        events[eventBeingEdited].notes = notes;
        eventBeingEdited = null;
    } else {
        events.push({
            day: selectedDay,
            month: currentMonth,
            year: currentYear,
            title: title,
            time: time,
            notes: notes
        });
    }

    saveEvents();
    renderCalendarDays();

    eventForm.reset();
    eventModal.close();
});

deleteEventBtn.addEventListener('click', function() {
    if (eventBeingEdited !== null) {
        events.splice(eventBeingEdited, 1);
        eventBeingEdited = null;

        saveEvents();
        renderCalendarDays();
        eventForm.reset();
        eventModal.close();
    }
});

// Initialization calls (run once when the page loads)
renderCalendarHeader();
renderCalendarDays();

// ===== DASHBOARD =====

function updateDashboard() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const futureEvents = events.filter(function(event) {
        const eventDate = new Date(event.year, event.month, event.day);
        return eventDate >= today;
    });

    const pastEvents = events.filter(function(event) {
        const eventDate = new Date(event.year, event.month, event.day);
        return eventDate < today;
    });

    futureEvents.sort(function(a, b) {
        const dateA = new Date(a.year, a.month, a.day);
        const dateB = new Date(b.year, b.month, b.day);
        return dateA - dateB;
    });

    const nextEvent = futureEvents[0];
        const upcomingEventEl = document.getElementById("upcoming-event");

        if (nextEvent) {
            upcomingEventEl.textContent = nextEvent.title + " — " + monthNames[nextEvent.month] + " " + nextEvent.day;
        } else {
            upcomingEventEl.textContent = "No upcoming events";
        }

    document.getElementById("pending-count").textContent = futureEvents.length;
    document.getElementById("completed-count").textContent = pastEvents.length;
    document.getElementById("notes-count").textContent = notes.length;
}

updateDashboard();

// ===== IMPORT =====

const importFileInput = document.getElementById("import-file");

importFileInput.addEventListener('change', function() {
    const file = importFileInput.files[0];

    if (!file) {
        return;
    }

    const statusEl = document.getElementById("import-status");

    if (!file.name.endsWith('.csv') && !file.name.endsWith('.json')) {
        statusEl.textContent = "Invalid file format. Please upload a .csv or .json file.";
        return;
    }

    const reader = new FileReader();

    reader.onload = function(event) {
        const fileContent = event.target.result;

        if (file.name.endsWith('.json')) {
        const data = JSON.parse(fileContent);

        if (data.notes) {
            data.notes.forEach(function(note) {
                notes.push(note);
            });
        }

        if (data.events) {
            data.events.forEach(function(evt) {
                events.push(evt);
            });
        }

        saveNotes();
        renderNotes();
        saveEvents();
        renderCalendarDays();
        updateDashboard();

        statusEl.textContent = "File imported successfully!";
    }
};

    reader.readAsText(file);
});