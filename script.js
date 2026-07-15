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
const eventModal = document.getElementById("event-modal");
const cancelEventBtn = document.getElementById("cancel-event-btn");
const prevMonthBtn = document.getElementById("prev-month");
const nextMonthBtn = document.getElementById("next-month");

const today = new Date();
let currentYear = today.getFullYear();
let currentMonth = today.getMonth();

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function renderCalendarHeader() {
    const currentMonthEl = document.getElementById("current-month");
    currentMonthEl.textContent = monthNames[currentMonth] + " " + currentYear;
}

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
});

nextMonthBtn.addEventListener('click', function() {
    currentMonth++;

    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }

    renderCalendarHeader();
});

renderCalendarHeader();

