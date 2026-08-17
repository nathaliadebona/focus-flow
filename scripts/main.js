// ===== INITIALIZATION =====
// Runs once, after every other script has finished defining its
// variables and functions. Order matters here (calendar before dashboard,
// since updateDashboard reads from both `notes` and `events`).

renderNotes(getFilteredNotes());
renderCalendarHeader();
renderCalendarDays();
updateDashboard();

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js');
}