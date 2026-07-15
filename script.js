const noteModal = document.getElementById("note-modal");
const showModal = document.getElementById("new-note-btn");
const cancelModal = document.getElementById("cancel-note-btn");

showModal.addEventListener('click', function() {
    noteModal.showModal();
})

cancelModal.addEventListener('click', function() {
    noteModal.close();
})
