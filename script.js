const taskName = document.getElementById("itemName");
const taskButton = document.getElementById("addBtn");
const itemsList = document.getElementById("itemsList");


// Enter key support

taskName.addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
        taskButton.click();
    }
});


// Add Task

taskButton.addEventListener("click", () => {

    const task = taskName.value.trim();

    if (!task) {
        alert("Please enter a valid task name");
        return;
    }

    const li = document.createElement("li");

    const span = document.createElement("span");
    span.textContent = task;

    const completeButton = document.createElement("button");
    completeButton.textContent = "✔";

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "✖";

    li.append(span, completeButton, deleteButton);
    itemsList.appendChild(li);

    taskName.value = "";
    taskName.focus();
});


// ✅ Event Delegation (ONLY ONCE)

itemsList.addEventListener("click", (e) => {

    const li = e.target.closest("li");

    if (!li) return;

    if (e.target.textContent === "✔") {
        li.classList.toggle("completed");
    }

    if (e.target.textContent === "✖") {
        li.remove();
    }
});