# Focus & Flow

A personal productivity dashboard built with vanilla HTML, CSS, and JavaScript — bringing together notes, a calendar, and quick stats in one clean, calm interface. Installable as a PWA, with full dark mode support.

This is a learning project focused on practicing core JavaScript concepts (DOM manipulation, `localStorage`, `FileReader`, array methods, Service Workers) without any frameworks or libraries.

<img width="846" height="388" alt="Design sem nome" src="https://github.com/user-attachments/assets/877b0d74-84f8-431f-a820-5962f1bba6b9" />
<img width="1348" height="443" alt="notes-lightmode" src="https://github.com/user-attachments/assets/8bffc098-258a-4592-8757-9d27ff25f573" />
<img width="1349" height="576" alt="calendar" src="https://github.com/user-attachments/assets/f9870e2f-4cd0-4c68-ae73-76e18c82efcc" />

## Features

- **Dashboard** — at-a-glance summary cards for pending/completed events, saved notes, and the next upcoming event
- **Notes** — create, edit, and delete notes, with a checklist per note, multiple file attachments, tags (fixed and custom, with your own name and color), search, tag filtering, and a trash with restore
- **Calendar** — full month navigation, multiple events per day (with a day overview, Google Calendar–style), multiple file attachments per event, and a trash with restore
- **Import** — bulk-import notes and events from a `.csv` or `.json` file
- **Dark mode** — full light/dark theme toggle, saved between sessions
- **PWA** — installable on desktop and mobile (iOS included), works offline via a Service Worker

## Built with

- HTML5 (semantic markup)
- CSS3 (custom properties, Flexbox, no frameworks)
- Vanilla JavaScript (no libraries — DOM API, `localStorage`, `FileReader`, Service Worker API)
- [Font Awesome](https://fontawesome.com/) for icons
- [Google Fonts](https://fonts.google.com/) — Poppins & Inter

## Running locally

This is a static site — no build step or dependencies required.

1. Clone the repository
2. Open `index.html` in your browser, or serve it with a tool like [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)

## Data & privacy

All data (notes, events, attachments, tags) is stored locally in the browser via `localStorage` — nothing is sent to any server.

## Roadmap

This project is actively evolving. Some ideas planned for future updates:

- A dedicated Tasks area, followed by a shared folder system between Notes and Tasks
- A persistent sidebar for navigation
- Deleting custom tags (currently only creation is supported)

---

Made with 💙 by Nathalia

