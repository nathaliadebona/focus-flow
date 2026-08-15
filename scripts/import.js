// ===== IMPORT =====

const importFileInput = document.getElementById("import-file");

importFileInput.addEventListener('change', function() {
    const file = importFileInput.files[0];

    if (!file) {
        return;
    }

    const statusEl = document.getElementById("import-status");

    if (!file.name.endsWith('.csv') && !file.name.endsWith('.json')) {
        statusEl.textContent = "Invalid file format. Please upload a .csv or .json file.";
        return;
    }

    const reader = new FileReader();

    reader.onload = function(event) {
        const fileContent = event.target.result;

        if (file.name.endsWith('.json')) {
            const data = JSON.parse(fileContent);

            if (data.notes) {
                data.notes.forEach(function(note) {
                     if (!note.title || note.title.trim() === "") {
                        return;
                    }

                    const alreadyExists = notes.some(function(existing) {
                        return existing.title === note.title && existing.content === note.content;
                    });

                    if (!alreadyExists) {
                        notes.push(note);
                    }
                });
            }

            if (data.events) {
                data.events.forEach(function(evt) {
                    if (!evt.title || evt.title.trim() === "") {
                        return;
                    }

                    if (isNaN(Number(evt.day)) || isNaN(Number(evt.month)) || isNaN(Number(evt.year))) {
                        return;
                    }

                    if (Number(evt.month) < 0 || Number(evt.month) > 11) {
                        return;
                    }

                    const daysInMonth = new Date(Number(evt.year), Number(evt.month) + 1, 0).getDate();

                    if (Number(evt.day) < 1 || Number(evt.day) > daysInMonth) {
                        return;
                    }

                    const alreadyExists = events.some(function(existing) {
                        return existing.title === evt.title && existing.day === evt.day && existing.month === evt.month && existing.year === evt.year;
                    });

                    if (!alreadyExists) {
                        events.push(evt);
                    }
                });
            }
        }

        if (file.name.endsWith('.csv')) {
            const lines = fileContent.split("\n");
            const headers = lines[0].split(",");

            for (let i = 1; i < lines.length; i++) {
                if (lines[i].trim() === "") {
                    continue;
                }

                const values = lines[i].split(",");
                const record = {};

                headers.forEach(function(header, index) {
                    record[header.trim()] = values[index] ? values[index].trim() : "";
                });

                if (record.type === "note") {
                    if (!record.title || record.title.trim() === "") {
                        continue;
                    }

                    const alreadyExists = notes.some(function(existing) {
                        return existing.title === record.title && existing.content === record.content;
                    });

                    if (!alreadyExists) {
                        notes.push({ title: record.title, content: record.content });
                    }

                } else if (record.type === "event") {
                    const newEvent = {
                        title: record.title,
                        day: Number(record.day),
                        month: Number(record.month),
                        year: Number(record.year),
                        time: record.time,
                        notes: record.notes || ""
                    };

                    if (!newEvent.title || newEvent.title.trim() === "") {
                        continue;
                    }

                    if (isNaN(newEvent.day) || isNaN(newEvent.month) || isNaN(newEvent.year)) {
                        continue;
                    }

                    if (newEvent.month < 0 || newEvent.month > 11) {
                        continue;
                    }

                    const daysInMonth = new Date(newEvent.year, newEvent.month + 1, 0).getDate();

                    if (newEvent.day < 1 || newEvent.day > daysInMonth) {
                        continue;
                    }

                    const alreadyExists = events.some(function(existing) {
                        return existing.title === newEvent.title && existing.day === newEvent.day && existing.month === newEvent.month && existing.year === newEvent.year;
                    });

                    if (!alreadyExists) {
                        events.push(newEvent);
                    }
                }
            }
        }

        const notesSaved = saveNotes();
        renderNotes();
        const eventsSaved = saveEvents();
        renderCalendarDays();
        updateDashboard();

        if (notesSaved && eventsSaved) {
        statusEl.textContent = "File imported successfully!";
        }
        
        importFileInput.value = '';
    };

    reader.readAsText(file);
});