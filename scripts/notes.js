// ===== NOTES =====
const noteModal = document.getElementById("note-modal");
const noteError = document.getElementById("note-error");
const openNoteModal = document.getElementById("new-note-btn");
const cancelNoteModal = document.getElementById("cancel-note-btn");
const noteForm = document.getElementById("note-form");
const emptyState = document.getElementById("notes-empty-state");
const noteList = document.getElementById("notes-list");
const noteAttachmentInput = document.getElementById("note-attachment");
const checklistBtn = document.getElementById("checklist-item-btn");
const checklistItemInput = document.getElementById("checklist-item-input");
const checklistItemsContainer = document.getElementById("checklist-items");
const checklistError = document.getElementById("checklist-error");
const searchNotesInput = document.getElementById('search-notes');
const filterBtn = document.getElementById('filter-btn');
const filterPanel = document.getElementById('filter-panel');
const filterUrgent = document.getElementById('filter-urgent');
const filterInProgress = document.getElementById('filter-in-progress');
const filterDone = document.getElementById('filter-done');
const filterToDo = document.getElementById('filter-todo');
const trashBtn = document.getElementById('trash-btn');
const trashModal = document.getElementById('trash-modal');
const trashList = document.getElementById('trash-list');
const closeTrashBtn = document.getElementById('close-trash-btn');  
const showMoreNotesBtn = document.getElementById('show-more-notes-btn');
const filterCheckboxes = [filterUrgent, filterInProgress, filterDone, filterToDo];
let noteBeingEdited = null;
let notes = JSON.parse(localStorage.getItem('notes')) || [];
let trashedNotes = JSON.parse(localStorage.getItem('trashedNotes')) || [];
let pendingNoteAttachment = null;
let pendingNoteChecklist = [];
let visibleNotesCount = 5;

function saveNotes() {
    try {
        localStorage.setItem('notes', JSON.stringify(notes));
        return true;
    } catch (error) {
        alert("Unable to save. Your browser's storage may be full.");
        return false;
    }
}

function renderNotes(notesToRender) {
    noteList.innerHTML = '';

    const notesToShow = notesToRender.slice(0, visibleNotesCount);

    if (notesToRender.length === 0) {
        emptyState.style.display = 'block';
    } else {
        emptyState.style.display = 'none';
    }

    notesToShow.forEach(function(note, index) {
        const realIndex = notes.indexOf(note);
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

        if (note.checklist && note.checklist.length > 0) {
            const itemsMarcados = note.checklist.filter(function(item) {
                return item.checked === true;
            });

            const checkedCount = itemsMarcados.length;

            const checklistText = checkedCount + "/" + note.checklist.length + " concluídos";

            const checklistProgress = document.createElement('p');
            checklistProgress.classList.add('checklist-progress');
            checklistProgress.textContent = checklistText;
            noteItem.appendChild(checklistProgress);
        }

        if (note.attachment) {
            const noteAttachmentIndicator = document.createElement('p');
            noteAttachmentIndicator.classList.add('note-attachment-indicator');
            const paperClipIcon = document.createElement('i');
            paperClipIcon.classList.add('fa-solid', 'fa-paperclip');
            const noteAttachmentNumber = document.createElement('span');
            noteAttachmentNumber.classList.add('note-attachment-number');
            noteAttachmentNumber.textContent = "1";
            noteAttachmentIndicator.appendChild(paperClipIcon);
            noteAttachmentIndicator.appendChild(noteAttachmentNumber);
            noteItem.appendChild(noteAttachmentIndicator);
        }

        if (note.updatedAt) {
            const noteUpdatedAt = document.createElement('p');
            noteUpdatedAt.classList.add('note-updated-at');
            noteUpdatedAt.textContent = monthNames[new Date(note.updatedAt).getMonth()] + " " + new Date(note.updatedAt).getDate() + ", " + new Date(note.updatedAt).getFullYear();
            noteItem.appendChild(noteUpdatedAt);
        }

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = "Delete";
        deleteBtn.classList.add('delete-btn');
        noteItem.appendChild(deleteBtn);
        deleteBtn.addEventListener('click', function() {
            const deletedNote = notes[realIndex];
            trashedNotes.push(deletedNote);
            notes.splice(realIndex, 1);
            saveNotes();
            saveTrashedNotes();
            renderNotes(getFilteredNotes());
            updateDashboard();
        });

        const editBtn = document.createElement('button');
        editBtn.textContent = "Edit";
        editBtn.classList.add('edit-btn');
        noteItem.appendChild(editBtn);
        editBtn.addEventListener('click', function() {
        openEditNoteModal(note);
        }); 

        noteList.appendChild(noteItem);
    });

    if (notesToRender.length > visibleNotesCount) {
        showMoreNotesBtn.style.display = 'block';
        showMoreNotesBtn.textContent = 'Show more';
    } else if (visibleNotesCount > 5) {
        showMoreNotesBtn.style.display = 'block';
        showMoreNotesBtn.textContent = 'Show less';
    } else {
        showMoreNotesBtn.style.display = 'none';
    }
}

function renderChecklistItems () {
    checklistItemsContainer.innerHTML = '';

    pendingNoteChecklist.forEach(function (item, index) {
        const itemWrapper = document.createElement('div');
        itemWrapper.classList.add('checklist-item');

        const itemCheckbox = document.createElement('input');
        itemCheckbox.type = 'checkbox';
        itemCheckbox.checked = item.checked;

        itemCheckbox.addEventListener('click', function() {
            item.checked = !item.checked;
        });

        const labelCheckbox = document.createElement('label');
        labelCheckbox.textContent = item.text;

        labelCheckbox.addEventListener('click', function() {
            const editInput = document.createElement('input');
            editInput.value = item.text;
            labelCheckbox.replaceWith(editInput);

            editInput.addEventListener('blur', function() {
                item.text = editInput.value;
                renderChecklistItems();
            });

            editInput.addEventListener('keydown', function(event) {
                if (event.key === "Enter") {
                    event.preventDefault();
                    editInput.blur();
                }
            });
        });

        const deleteItemBtn = document.createElement('button');
        deleteItemBtn.type = "button";
        deleteItemBtn.classList.add('delete-item-btn');

        const deleteItemIcon = document.createElement('i');
        deleteItemIcon.classList.add('fa-solid', 'fa-xmark');

        deleteItemBtn.addEventListener('click', function() {
              pendingNoteChecklist.splice(index, 1);
              renderChecklistItems();
        });

        itemWrapper.appendChild(itemCheckbox);
        itemWrapper.appendChild(labelCheckbox);
        deleteItemBtn.appendChild(deleteItemIcon);
        itemWrapper.appendChild(deleteItemBtn);
        checklistItemsContainer.appendChild(itemWrapper);
    });
}

function getFilteredNotes() {
    const searchText = searchNotesInput.value;

    const selectedFilterTags = [];
    
    if (filterUrgent.checked) {
        selectedFilterTags.push("Urgent");
    }

    if (filterInProgress.checked) {
        selectedFilterTags.push("In Progress");
    }

    if (filterDone.checked) {
        selectedFilterTags.push("Done");
    }

    if (filterToDo.checked) {
        selectedFilterTags.push("To Do");
    }

    const filteredNotes = notes.filter(function(note) {
        const matchesSearch = note.title.toLowerCase().includes(searchText.toLowerCase()) || note.content.toLowerCase().includes(searchText.toLowerCase());
        const matchesTags = selectedFilterTags.length === 0 || note.tags.some(function(tag) { return selectedFilterTags.includes(tag); });
        return matchesSearch && matchesTags;
    });

    filteredNotes.sort(function(a, b) {
        if (a.tags.includes("Done") && !b.tags.includes("Done")) {
            return 1;
        }

        if (!a.tags.includes("Done") && b.tags.includes("Done")) {
            return -1;
        }

        if (!a.updatedAt && b.updatedAt) {
            return 1;
        }

        if (a.updatedAt && !b.updatedAt) {
            return -1;
        }

        const dateA = new Date(a.updatedAt);
        const dateB = new Date(b.updatedAt);
        return dateB - dateA;
    });

    return filteredNotes;
}

function saveTrashedNotes() {
    try {
        localStorage.setItem('trashedNotes', JSON.stringify(trashedNotes));
        return true;
    } catch (error) {
        alert("Unable to save. Your browser's storage may be full.");
        return false;
    }
}

function renderTrash() {
    trashList.innerHTML = '';

    trashedNotes.forEach(function(note, index) {
        const trashContainer = document.createElement('div');
        trashContainer.classList.add('trash-container');

        const trashItem = document.createElement('li');

        const trashItemTitle = document.createElement('h3');
        trashItemTitle.textContent = note.title;
        trashItem.appendChild(trashItemTitle);

        const restoreBtn = document.createElement('button');
        restoreBtn.textContent = "Restore";
        restoreBtn.classList.add('restore-btn');
        trashContainer.appendChild(restoreBtn);

        const deleteForeverBtn = document.createElement('button');
        deleteForeverBtn.textContent = "Delete Forever";
        deleteForeverBtn.classList.add('delete-forever-btn');
        trashContainer.appendChild(deleteForeverBtn);

        restoreBtn.addEventListener('click', function() {
            const restoredNote = trashedNotes[index];
            notes.push(restoredNote);
            trashedNotes.splice(index, 1);
            saveNotes();
            saveTrashedNotes();
            renderNotes(getFilteredNotes());
            renderTrash();
        });

        deleteForeverBtn.addEventListener('click', function() {
            trashedNotes.splice(index, 1);

            saveTrashedNotes();
            renderTrash();
        });

        trashItem.appendChild(trashContainer);
        trashList.appendChild(trashItem);
    });
}

function openEditNoteModal(note) {
    const realIndex = notes.indexOf(note);
    noteError.style.display = 'none';
    document.getElementById("note-title").value = note.title;
    document.getElementById("note-content").value = note.content;
    document.getElementById("tag-urgent").checked = note.tags.includes("Urgent");
    document.getElementById("tag-in-progress").checked = note.tags.includes("In Progress");
    document.getElementById("tag-done").checked = note.tags.includes("Done");
    document.getElementById("tag-todo").checked = note.tags.includes("To Do");

    noteBeingEdited = realIndex;
    renderAttachmentPreview(note.attachment, "note-attachment-preview");
    pendingNoteChecklist = note.checklist || [];
    renderChecklistItems();
    noteModal.showModal();
}

openNoteModal.addEventListener('click', function() {
    noteError.style.display = 'none';
    document.getElementById("tag-urgent").checked = false;
    document.getElementById("tag-in-progress").checked = false;
    document.getElementById("tag-done").checked = false;
    document.getElementById("tag-todo").checked = false;
    renderAttachmentPreview(null, "note-attachment-preview");
    pendingNoteChecklist = [];
    renderChecklistItems();
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
        notes[noteBeingEdited].checklist = pendingNoteChecklist;
        notes[noteBeingEdited].updatedAt = new Date();
        noteBeingEdited = null;
    } else {
        notes.push({ title: title, content: content, attachment: pendingNoteAttachment, tags: tags, checklist: pendingNoteChecklist, updatedAt: new Date() });
    }

    saveNotes();
    renderNotes(getFilteredNotes());
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
});

checklistBtn.addEventListener('click', function() {
    const itemText = checklistItemInput.value;
    if (itemText.trim() === "") {
        checklistError.style.display = 'block';
        return;
    }

    checklistError.style.display = 'none';
    
    const newItem = { text: itemText, checked: false };
    pendingNoteChecklist.push(newItem);
    renderChecklistItems();
    checklistItemInput.value = "";
});

checklistItemInput.addEventListener('keydown', function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        checklistBtn.click();
    }
});

filterBtn.addEventListener('click', function() {
    if (filterPanel.style.display === "flex") {
        filterPanel.style.display = "none";
    } else {
        filterPanel.style.display = "flex";
    }
});

filterCheckboxes.forEach(function(checkbox) {
    checkbox.addEventListener('change', function() {
        filterPanel.style.display = "none";
        renderNotes(getFilteredNotes());
    });
});

document.addEventListener('click', function(event) {
    if (!filterPanel.contains(event.target) && !filterBtn.contains(event.target)) {
        filterPanel.style.display = "none";
    }
});

searchNotesInput.addEventListener('input', function() {
    renderNotes(getFilteredNotes());
});

trashBtn.addEventListener('click', function() {
    renderTrash();
    trashModal.showModal();
});

closeTrashBtn.addEventListener('click', function() {
    trashModal.close();
})

showMoreNotesBtn.addEventListener('click', function() {
    if (showMoreNotesBtn.textContent === "Show less") {
        visibleNotesCount = 5;
    } else {
        visibleNotesCount = visibleNotesCount + 5;
    }

    renderNotes(getFilteredNotes());
});