// ===== NOTES =====
const noteModal = document.getElementById("note-modal");
const openNoteModal = document.getElementById("new-note-btn");
const cancelNoteModal = document.getElementById("cancel-note-btn");
const noteForm = document.getElementById("note-form");
const emptyState = document.getElementById("notes-empty-state");
let noteBeingEdited = null;

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

    if (noteBeingEdited) {
        noteBeingEdited.querySelector('h3').textContent = title;
        noteBeingEdited.querySelector('p').textContent = content;
        noteBeingEdited = null;
    } else {
        const noteItem = document.createElement('li');
        const noteName = document.createElement('h3');
        noteName.textContent = title;
        noteItem.appendChild(noteName);

        const noteText = document.createElement('p');
        noteText.textContent = content;
        noteItem.appendChild(noteText);

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = "Delete";
        noteItem.appendChild(deleteBtn);
        deleteBtn.addEventListener('click', function() {
            noteItem.remove();
        });

        const editBtn = document.createElement('button');
        editBtn.textContent = "Edit";
        noteItem.appendChild(editBtn);
        editBtn.addEventListener('click', function() {
            document.getElementById("note-title").value = noteItem.querySelector('h3').textContent;
            document.getElementById("note-content").value = noteItem.querySelector('p').textContent;
            noteBeingEdited = noteItem;
            noteModal.showModal();
        });

        const noteList = document.getElementById("notes-list");
        noteList.appendChild(noteItem);

        emptyState.style.display = "none";
    }

    noteForm.reset();
    noteModal.close();
});



// ===== CALENDAR =====
const eventModal = document.getElementById("event-modal");
const cancelEventBtn = document.getElementById("cancel-event-btn");

cancelEventBtn.addEventListener('click', function() {
    eventModal.close();
});