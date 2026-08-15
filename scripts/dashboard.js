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