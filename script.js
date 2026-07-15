// ===== NOTES =====
const noteModal = document.getElementById("note-modal");
const openNoteModal = document.getElementById("new-note-btn");
const cancelNoteModal = document.getElementById("cancel-note-btn");
const noteForm = document.getElementById("note-form");
const emptyState = document.getElementById("notes-empty-state");

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

    const noteItem = document.createElement('li');

    const noteName = document.createElement('h3');
    noteName.textContent = title;

    noteItem.appendChild(noteName);

    const noteText = document.createElement('p');
    noteText.textContent = content;

    noteItem.appendChild(noteText);

    const noteList = document.getElementById("notes-list");
    noteList.appendChild(noteItem);

    emptyState.style.display = "none";

    noteModal.close();
});

// ===== CALENDAR =====
const eventModal = document.getElementById("event-modal");
const cancelEventBtn = document.getElementById("cancel-event-btn");

cancelEventBtn.addEventListener('click', function() {
    eventModal.close();
});