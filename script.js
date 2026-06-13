const taskForm = document.getElementById("taskForm");
const title = document.getElementById("taskInput");
const category = document.getElementById("categorySelect");
const priority = document.getElementById("prioritySelect");
const dueDate = document.getElementById("dueDate");


const taskContainer = document.getElementById("taskContainer");
const emptyState = document.querySelector(".empty-state");


//states

let tasks = [];

 // Add Task

taskForm.addEventListener("submit", (e) => {

    e.preventDefault();

    const cleanedTitle = title.value.trim();

    if (cleanedTitle === "") {
        return
    }
    
    const taskObj = {
        id: Date.now(),
        title: cleanedTitle,
        category: category.value || "No category",
        priority: priority.value || "No priority",
        dueDate: dueDate.value || "No due date",
        completed: false
    }

    tasks.push(taskObj);

    //reset the form 
    taskForm.reset();

    renderTasks();


});

//complete task
taskContainer.addEventListener("change", (e)=>{

    if(!e.target.classList.contains("task-check")) {
        return;
    }
    
    const taskId = Number(e.target.getAttribute("data-id"));

    const particularTask = tasks.find((element)=> element.id === taskId);

    particularTask.completed = e.target.checked;

    renderTasks();

});


//delete task
taskContainer.addEventListener("click", (e) => {
    
    if(!e.target.classList.contains("delete-btn")) {
        return;
    }

    const taskId = Number(e.target.getAttribute("data-id"));

    tasks = tasks.filter((element)=> element.id !== taskId);

     renderTasks();

});


// Functions

function renderTasks() {

    taskContainer.innerHTML = "";

    if (tasks.length === 0) {
        emptyState.style.display = "flex";
    }else {
        emptyState.style.display = "none";
    }

   
    for(let item of tasks) {

        const taskCard = document.createElement("div");
        taskCard.classList.add("task-card");


        const taskInfo = document.createElement("div");
        taskInfo.classList.add("task-info");
        

        const checkBoxInput = document.createElement("input");
        checkBoxInput.setAttribute("type", "checkbox");
        checkBoxInput.setAttribute("data-id", item.id);
        checkBoxInput.checked = item.completed;
        checkBoxInput.classList.add("task-check");


        const taskDetails = document.createElement("div");
        taskDetails.classList.add("task-details");


        const taskTitle = document.createElement("h3");
        taskTitle.classList.add("task-title");
        taskTitle.textContent = item.title;


        if (item.completed) {

            taskCard.classList.add("completed-card");
            taskTitle.classList.add("completed-title");

        }


        const taskMeta = document.createElement("div");
        taskMeta.classList.add("task-meta");

        const taskCategory = document.createElement("p");
        taskCategory.classList.add("task-category");
        taskCategory.textContent = `Category: ${item.category}`;

        const taskPriority = document.createElement("p");
        taskPriority.classList.add("task-priority");
        taskPriority.textContent = `Priority: ${item.priority}`;

        const taskDate = document.createElement("p");
        taskDate.classList.add("task-date");
        taskDate.textContent = `Due Date: ${item.dueDate}`;


        taskMeta.append(taskCategory,taskPriority,taskDate);
        taskDetails.append(taskTitle, taskMeta);
        taskInfo.append(checkBoxInput, taskDetails);
        

        const taskActions = document.createElement("div");
        taskActions.classList.add("task-actions");


        const editBtn = document.createElement("button");
        editBtn.classList.add("edit-btn");
        editBtn.textContent = "Edit";


        const deleteBtn = document.createElement("button");
        deleteBtn.setAttribute("data-id", item.id);
        deleteBtn.classList.add("delete-btn");
        deleteBtn.textContent = "Delete";


        taskActions.append(editBtn, deleteBtn);


        taskCard.append(taskInfo, taskActions);
        taskContainer.appendChild(taskCard);   

    }

}
renderTasks();

