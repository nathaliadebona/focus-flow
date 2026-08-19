const pendingTasksCard = document.getElementById('pending-tasks-card');
const completedTasksCard = document.getElementById('completed-tasks-card');
const notesSummaryCard = document.getElementById('notes-summary-card');
const dashboardDetailModal = document.getElementById('dashboard-detail-modal');
const dashboardModalTitle = document.getElementById('dashboard-modal-title');
const dashboardList = document.getElementById('dashboard-list');
const closeDashboardModalBtn = document.getElementById('close-dashboard-modal-btn');
let futureEvents;
let pastEvents;

function updateDashboard() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    futureEvents = events.filter(function(event) {
        const eventDate = new Date(event.year, event.month, event.day);
        return eventDate >= today;
    });

    pastEvents = events.filter(function(event) {
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

function openDashboardDetail(items, title, type) {
    dashboardModalTitle.textContent = title;
    dashboardList.innerHTML = '';

    items.forEach(function(item, index) {
        if (type === "event") {
            const detailItem = document.createElement('li');
            detailItem.textContent = item.title + " — " + monthNames[item.month] + " " + item.day; 
            
            detailItem.addEventListener('click', function() {
                dashboardDetailModal.close();
                openEditEventModal(item);
            });
            
            dashboardList.appendChild(detailItem);
        } else {
            const detailItem = document.createElement('li');
            detailItem.textContent = item.title;

            detailItem.addEventListener('click', function() {
                dashboardDetailModal.close();
                openEditNoteModal(item);
            });

            dashboardList.appendChild(detailItem);
        }
    });

    dashboardDetailModal.showModal();
}

pendingTasksCard.addEventListener('click', function() {
    openDashboardDetail(futureEvents, "Pending Tasks", "event");
});

completedTasksCard.addEventListener('click', function() {
    openDashboardDetail(pastEvents, "Completed Tasks", "event");
});

notesSummaryCard.addEventListener('click', function() {
    openDashboardDetail(notes, "Notes", "note");
});

closeDashboardModalBtn.addEventListener('click', function() {
    dashboardDetailModal.close();
});