// ===== NOTES =====
const noteModal = document.getElementById("note-modal");
const noteError = document.getElementById("note-error");
const openNoteModal = document.getElementById("new-note-btn");
const cancelNoteModal = document.getElementById("cancel-note-btn");
const noteForm = document.getElementById("note-form");
const emptyState = document.getElementById("notes-empty-state");
const noteList = document.getElementById("notes-list");
const noteAttachmentInput = document.getElementById("note-attachment");
let noteBeingEdited = null;
let notes = JSON.parse(localStorage.getItem('notes')) || [];
let pendingNoteAttachment = null;

function saveNotes() {
    try {
        localStorage.setItem('notes', JSON.stringify(notes));
        return true;
    } catch (error) {
        alert("Unable to save. Your browser's storage may be full.");
        return false;
    }
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

        const noteHeader = document.createElement('div');
        noteHeader.classList.add('note-header');

        const noteName = document.createElement('h3');
        noteName.textContent = note.title;
        noteHeader.appendChild(noteName);
        noteItem.appendChild(noteHeader);

        note.tags.forEach(function(tag) {
            const tagSpan = document.createElement('span');
            tagSpan.textContent = tag;
            tagSpan.classList.add('note-tag');

            if (tag === "Urgent") {
                tagSpan.classList.add('tag-urgent');
            }

            if (tag === "In Progress") {
                tagSpan.classList.add('tag-in-progress');
            }

            if (tag === "Done") {
                tagSpan.classList.add('tag-done');
            }

            if (tag === "To Do") {
                tagSpan.classList.add('tag-todo');
            }

            noteHeader.appendChild(tagSpan);
        }); 

        const noteText = document.createElement('p');
        noteText.textContent = note.content;
        noteItem.appendChild(noteText);

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = "Delete";
        deleteBtn.classList.add('delete-btn');
        noteItem.appendChild(deleteBtn);
        deleteBtn.addEventListener('click', function() {
            notes.splice(index, 1);
            saveNotes();
            renderNotes();
            updateDashboard();
        });

        const editBtn = document.createElement('button');
        editBtn.textContent = "Edit";
        editBtn.classList.add('edit-btn');
        noteItem.appendChild(editBtn);
        editBtn.addEventListener('click', function() {
            noteError.style.display = 'none';
            document.getElementById("note-title").value = note.title;
            document.getElementById("note-content").value = note.content;
            document.getElementById("tag-urgent").checked = note.tags.includes("Urgent");
            document.getElementById("tag-in-progress").checked = note.tags.includes("In Progress");
            document.getElementById("tag-done").checked = note.tags.includes("Done");
            document.getElementById("tag-todo").checked = note.tags.includes("To Do");
            noteBeingEdited = index;
            renderAttachmentPreview(note.attachment, "note-attachment-preview");
            noteModal.showModal();
        });

        noteList.appendChild(noteItem);
    });
}

openNoteModal.addEventListener('click', function() {
    noteError.style.display = 'none';
    document.getElementById("tag-urgent").checked = false;
    document.getElementById("tag-in-progress").checked = false;
    document.getElementById("tag-done").checked = false;
    document.getElementById("tag-todo").checked = false;
    renderAttachmentPreview(null, "note-attachment-preview");
    noteModal.showModal();
});

cancelNoteModal.addEventListener('click', function() {
    noteBeingEdited = null;
    noteError.style.display = 'none';
    noteForm.reset();
    noteModal.close();
    pendingNoteAttachment = null;
});

noteForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const title = document.getElementById("note-title").value;
    const content = document.getElementById("note-content").value;
    const tags = [];

    if (document.getElementById("tag-urgent").checked) {
        tags.push("Urgent");
    }

    if (document.getElementById("tag-in-progress").checked) {
        tags.push("In Progress");
    }

    if (document.getElementById("tag-done").checked) {
        tags.push("Done");
    }

    if (document.getElementById("tag-todo").checked) {
        tags.push("To Do");
    }

    if (title.trim() === "") {
        noteError.style.display = 'block';
        return;
    }

    noteError.style.display = 'none';

    if (noteBeingEdited !== null) {
        notes[noteBeingEdited].title = title;
        notes[noteBeingEdited].content = content;
        notes[noteBeingEdited].attachment = pendingNoteAttachment;
        notes[noteBeingEdited].tags = tags;
        noteBeingEdited = null;
    } else {
        notes.push({ title: title, content: content, attachment: pendingNoteAttachment, tags: tags });
    }

    saveNotes();
    renderNotes();
    updateDashboard();

    noteForm.reset();
    noteModal.close();
    pendingNoteAttachment = null;
});

noteAttachmentInput.addEventListener('change', function() {
    const attachment = noteAttachmentInput.files[0];

    if (!attachment) {
        return;
    }

    const attachmentReader = new FileReader();

    attachmentReader.onload = function(event) {
        pendingNoteAttachment = event.target.result;
    }

    attachmentReader.readAsDataURL(attachment);
})