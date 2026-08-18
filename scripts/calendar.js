// ===== CALENDAR =====

// Element references
const eventModal = document.getElementById("event-modal");
const eventError = document.getElementById("event-error");
const cancelEventBtn = document.getElementById("cancel-event-btn");
const prevMonthBtn = document.getElementById("prev-month");
const nextMonthBtn = document.getElementById("next-month");
const eventForm = document.getElementById("event-form");
const deleteEventBtn = document.getElementById("delete-event-btn");
const eventAttachmentInput = document.getElementById("event-attachment");
const trashEventsBtn = document.getElementById('trash-events-btn');
const trashEventsModal = document.getElementById('trash-events-modal');
const trashEventsList = document.getElementById('trash-events-list');
const closeTrashEventsBtn = document.getElementById('close-trash-events-btn');

// Data/state variables
const today = new Date();
let currentYear = today.getFullYear();
let currentMonth = today.getMonth();
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let events = JSON.parse(localStorage.getItem('events')) || [];
let trashedEvents = JSON.parse(localStorage.getItem('trashedEvents')) || [];
let selectedDay = null;
let eventBeingEdited = null;
let pendingAttachment = null;

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
            eventTitle.classList.add('event-label');
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
                renderAttachmentPreview(events[eventIndex].attachment, "attachment-preview");
            } else {
                eventBeingEdited = null;
                renderAttachmentPreview(null, "attachment-preview");
                document.getElementById("event-modal-title").textContent = "Add Event";
            }

            eventError.style.display = 'none';

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

function renderAttachmentPreview(attachmentData, previewElementId) {
    const preview = document.getElementById(previewElementId);
    preview.innerHTML = '';

    if (!attachmentData) {
        return;
    }

    if (attachmentData.startsWith("data:image")) {
        const img = document.createElement('img');
        img.src = attachmentData;
        preview.appendChild(img); 
    } else {
        const link = document.createElement('a');
        link.href = attachmentData;
        const linkIcon = document.createElement('span');
        linkIcon.classList.add('download-icon');
        const downloadIcon = document.createElement('i');
        downloadIcon.classList.add('fa-solid', 'fa-download');
        linkIcon.appendChild(downloadIcon);
        link.appendChild(linkIcon);
        const linkText = document.createElement('span');
        linkText.textContent = "Download attachment";
        link.appendChild(linkText);
        link.setAttribute('download', 'attachment');
        preview.appendChild(link);
    }
}

function saveEvents() {
    try {
        localStorage.setItem('events', JSON.stringify(events));
        return true;
    } catch (error) {
        alert("Unable to save your event. Your browser's storage may be full.");
        return false;
    }
}

function saveTrashedEvents() {
    try {
        localStorage.setItem('trashedEvents', JSON.stringify(trashedEvents));
        return true;
    } catch (error) {
        alert("Unable to save. Your browser's storage may be full.");
        return false;
    }
}

function renderTrashEvents() {
    trashEventsList.innerHTML = "";

    trashedEvents.forEach(function(event, index) {
        const trashItem = document.createElement('li');

        const trashItemInfo = document.createElement('div');
        trashItemInfo.classList.add('trash-item-info');

        const trashItemTitle = document.createElement('h3');
        trashItemTitle.textContent = event.title;
        trashItemInfo.appendChild(trashItemTitle);

        const trashItemDate = document.createElement('p');
        trashItemDate.textContent = monthNames[event.month] + " " + event.day;
        trashItemDate.classList.add('trash-item-date');
        trashItemInfo.appendChild(trashItemDate);
        trashItem.appendChild(trashItemInfo);

        const trashContainer = document.createElement('div');
        trashContainer.classList.add('trash-container');

        const restoreBtn = document.createElement('button');
        restoreBtn.textContent = "Restore";
        restoreBtn.classList.add('restore-btn');
        trashContainer.appendChild(restoreBtn);

        const deleteForeverBtn = document.createElement('button');
        deleteForeverBtn.textContent = "Delete Forever";
        deleteForeverBtn.classList.add('delete-forever-btn');
        trashContainer.appendChild(deleteForeverBtn);

        trashItem.appendChild(trashContainer);
        trashEventsList.appendChild(trashItem);

        restoreBtn.addEventListener('click', function() {
            const restoredEvent = trashedEvents[index];
            events.push(restoredEvent);
            trashedEvents.splice(index, 1);
            saveEvents();
            saveTrashedEvents();
            renderCalendarDays();
            renderTrashEvents();
        });

        deleteForeverBtn.addEventListener('click', function() {
            trashedEvents.splice(index, 1);

            saveTrashedEvents();
            renderTrashEvents();
        });
    });
}

// Click events (addEventListener)
cancelEventBtn.addEventListener('click', function() {
    eventBeingEdited = null;
    eventError.style.display = 'none';
    eventForm.reset();
    document.getElementById("event-modal-title").textContent = "Add Event";
    eventModal.close();
    pendingAttachment = null;
});

prevMonthBtn.addEventListener('click', function() {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendarHeader();
    renderCalendarDays();
    updateDashboard();
});

nextMonthBtn.addEventListener('click', function() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendarHeader();
    renderCalendarDays();
    updateDashboard();
});

eventForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const title = document.getElementById("event-title").value;
    const time = document.getElementById("event-time").value;
    const eventNotesValue = document.getElementById("event-notes").value;
    
    if (title.trim() === "") {
        eventError.style.display = 'block';
        return;
    }

    eventError.style.display = 'none';

    if (eventBeingEdited !== null) {
        events[eventBeingEdited].title = title;
        events[eventBeingEdited].time = time;
        events[eventBeingEdited].notes = eventNotesValue;
        events[eventBeingEdited].attachment = pendingAttachment;
        eventBeingEdited = null;
    } else {
        events.push({
            day: selectedDay,
            month: currentMonth,
            year: currentYear,
            title: title,
            time: time,
            notes: eventNotesValue,
            attachment: pendingAttachment
        });
    }

    saveEvents();
    renderCalendarDays();
    updateDashboard();

    eventForm.reset();
    eventModal.close();
    pendingAttachment = null;
});

deleteEventBtn.addEventListener('click', function() {
    if (eventBeingEdited !== null) {
        const deletedEvent = events[eventBeingEdited];
        trashedEvents.push(deletedEvent);
        events.splice(eventBeingEdited, 1);
        eventBeingEdited = null;

        saveEvents();
        saveTrashedEvents();
        renderCalendarDays();
        updateDashboard();
        eventForm.reset();
        eventModal.close();
    }
});

eventAttachmentInput.addEventListener('change', function() {
    const attachment = eventAttachmentInput.files[0];

    if (!attachment) {
        return;
    }

    const attachmentReader = new FileReader();

    attachmentReader.onload = function(event) {
        pendingAttachment = event.target.result;
    }

    attachmentReader.readAsDataURL(attachment);
});

trashEventsBtn.addEventListener('click', function() {
    renderTrashEvents();
    trashEventsModal.showModal();
});

closeTrashEventsBtn.addEventListener('click', function() {
    trashEventsModal.close();
});