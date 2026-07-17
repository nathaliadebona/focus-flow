# Focus & Flow

A personal productivity dashboard built with vanilla HTML, CSS, and JavaScript — bringing together notes, a calendar, and quick stats in one clean, calm interface.

This is a learning project focused on practicing core JavaScript concepts (DOM manipulation, `localStorage`, `FileReader`, array methods) without any frameworks or libraries.

## Features

- **Dashboard** — at-a-glance summary cards for pending/completed events, saved notes, and the next upcoming event
- **Notes** — create, edit, and delete notes, with persistent storage
- **Calendar** — full month navigation, create/edit/delete events on any day, with file attachments (image preview or download link for other file types)
- **Import** — bulk-import notes and events from a `.csv` or `.json` file

## Built with

- HTML5 (semantic markup)
- CSS3 (custom properties, Flexbox, no frameworks)
- Vanilla JavaScript (no libraries — DOM API, `localStorage`, `FileReader`)
- [Font Awesome](https://fontawesome.com/) for icons
- [Google Fonts](https://fonts.google.com/) — Poppins & Inter

## Running locally

This is a static site — no build step or dependencies required.

1. Clone the repository
2. Open `index.html` in your browser, or serve it with a tool like [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)

## Data & privacy

All data (notes, events, attachments) is stored locally in the browser via `localStorage` — nothing is sent to any server.

## Known limitations

- CSV import doesn't support commas inside a text field (use JSON for text with commas)
- Only one event per day is currently supported

## Roadmap

This project is actively evolving. Some features planned for future updates:

- Drag-and-drop note reordering
- Note categories/tags
- Search and filtering
- Trash/recovery for deleted items
- File attachments on notes (currently only available on calendar events)

---

Made with 💙 by Nathalia
