document.addEventListener("DOMContentLoaded", () => {
    const titleInput = document.getElementById("titleInput");
    const noteBody = document.getElementById("noteBody");
    const addButton = document.getElementById("addButton");
    const cancelButton = document.getElementById("cancelButton");
    const taskList = document.getElementById("taskList");
    const noteList = document.getElementById("noteList");
    const toggleTheme = document.getElementById("toggleTheme");

    const modeToggle = document.getElementById("modeToggle");
    const noteSection = document.getElementById("noteSection");
    const taskSection = document.getElementById("taskSection");
    const inputFields = document.getElementById("inputFields");

    let inputVisible = false;

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let notes = JSON.parse(localStorage.getItem("notes")) || [];

    function saveData() {
        localStorage.setItem("tasks", JSON.stringify(tasks));
        localStorage.setItem("notes", JSON.stringify(notes));
    }

    function renderTasks() {
        taskList.innerHTML = "";
        tasks.forEach((task, index) => {
            const li = document.createElement("li");
            li.className = task.completed ? "completed" : "";

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = task.completed;
            checkbox.addEventListener("change", () => {
                tasks[index].completed = !tasks[index].completed;
                saveData();
                renderTasks();
            });

            const span = document.createElement("span");
            span.textContent = task.title;
            if (!task.completed) span.classList.add("blurred-task");
            span.addEventListener("click", () => {
                span.classList.toggle("blurred-task");
            });

            const del = document.createElement("button");
            del.textContent = "❌";
            del.addEventListener("click", () => {
                tasks.splice(index, 1);
                saveData();
                renderTasks();
            });

            li.appendChild(checkbox);
            li.appendChild(span);
            li.appendChild(del);
            taskList.appendChild(li);
        });
    }

    function renderNotes() {
        noteList.innerHTML = "";
        notes.forEach((note, index) => {
            const div = document.createElement("div");
            div.className = "note";

            const title = document.createElement("h4");
            title.textContent = note.title;

            const body = document.createElement("p");
            body.textContent = note.body;

            const del = document.createElement("button");
            del.textContent = "🗑️";
            del.addEventListener("click", () => {
                notes.splice(index, 1);
                saveData();
                renderNotes();
            });

            div.appendChild(title);
            div.appendChild(body);
            div.appendChild(del);
            noteList.appendChild(div);
        });
    }

    function resetInputForm() {
        inputFields.classList.remove("expanded");
        inputFields.classList.add("collapsed");
        inputVisible = false;
        addButton.textContent = "➕ Add";
        cancelButton.style.display = "none";
        titleInput.value = "";
        noteBody.value = "";
    }

    addButton.addEventListener("click", () => {
        if (!inputVisible) {
            inputFields.classList.remove("collapsed");
            inputFields.classList.add("expanded");
            inputVisible = true;
            addButton.textContent = "✅ Submit";
            cancelButton.style.display = "inline-block";
            return;
        }

        const title = titleInput.value.trim();
        const body = noteBody.value.trim();

        if (!title) {
            alert("Title cannot be empty.");
            return;
        }

        const isNoteMode = noteSection.style.display !== "none";

        if (isNoteMode) {
            notes.push({ title, body });
            renderNotes();
        } else {
            tasks.push({ title, completed: false });
            renderTasks();
        }

        saveData();
        resetInputForm();
    });

    cancelButton.addEventListener("click", resetInputForm);

    toggleTheme.addEventListener("click", () => {
        document.body.classList.toggle("dark");
    });

    modeToggle.addEventListener("click", () => {
        const showingNotes = modeToggle.textContent.trim() === "My Notes";
        modeToggle.textContent = showingNotes ? "To Do List" : "My Notes";
        noteSection.style.display = showingNotes ? "none" : "block";
        taskSection.style.display = showingNotes ? "block" : "none";

        // toggle textarea for notes only
        noteBody.style.display = showingNotes ? "none" : "block";
    });

    renderTasks();
    renderNotes();
    taskSection.style.display = "none";
    noteBody.style.display = "block";
});
