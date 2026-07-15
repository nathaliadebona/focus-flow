// ===== NOTES =====
const noteModal = document.getElementById("note-modal");
const openNoteModal = document.getElementById("new-note-btn");
const cancelNoteModal = document.getElementById("cancel-note-btn");

openNoteModal.addEventListener('click', function() {
    noteModal.showModal();
});

cancelNoteModal.addEventListener('click', function() {
    noteModal.close();
});

const noteForm = document.getElementById("note-form");

noteForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const title = document.getElementById("note-title").value;
    const content = document.getElementById("note-content").value;

    

    noteModal.close();
});

// ===== CALENDAR =====
const eventModal = document.getElementById("event-modal");
const cancelEventBtn = document.getElementById("cancel-event-btn");

cancelEventBtn.addEventListener('click', function() {
    eventModal.close();
});