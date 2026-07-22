//DOM Selections

const taskForm = document.getElementById("taskForm");
const title = document.getElementById("taskInput");
const category = document.getElementById("categorySelect");
const priority = document.getElementById("prioritySelect");
const dueDate = document.getElementById("dueDate");


const taskContainer = document.getElementById("taskContainer");
const emptyState = document.querySelector(".empty-state");
const emptyStateTitle = document.querySelector(".empty-state h3");
const emptyStateText = document.querySelector(".empty-state p");


const totalTask = document.getElementById("totalTasks");
const completedTask = document.getElementById("completedTasks");
const pendingTask = document.getElementById("pendingTasks");


const progressPercentage = document.getElementById("progressPercentage");
const progressFill = document.querySelector(".progress-fill");


const searchInput = document.getElementById("searchInput");

const filterSelect = document.getElementById("filterSelect");

const clearCompletedBtn = document.getElementById("clearCompletedBtn");

const categoryFilter = document.getElementById("categoryFilter");

const priorityFilter = document.getElementById ("priorityFilter");


//states

let tasks = [];

let editingTaskId = null;

let searchTerm = "";

let statusFilter = "All Tasks";

let filterCategory = "All Categories";

let filterPriority = "All Priorities";



// Functions

// rendering function - render task card

function renderTasks() {

    taskContainer.innerHTML = "";

    let finalFilteredArr;

    const filteredTasks = tasks.filter((item)=>item.title.toLowerCase().includes(searchTerm.toLowerCase()));

    if (statusFilter === "All Tasks") {
        
        finalFilteredArr = filteredTasks;

    }else if (statusFilter === "Completed") {

        finalFilteredArr = filteredTasks.filter((item)=> item.completed);

    }else {

        finalFilteredArr = filteredTasks.filter((item)=> !item.completed);
    }


    if (filterCategory !== "All Categories") {

        finalFilteredArr = finalFilteredArr.filter((item)=> item.category === filterCategory);
    }


    if (filterPriority !== "All Priorities") {

        finalFilteredArr = finalFilteredArr.filter((item)=> item.priority === filterPriority);
    }

    // TODAYS DATE FOR OVERDUE FEATURE 
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    

    if (tasks.length === 0) {

        emptyState.style.display = "flex";

        emptyStateTitle.textContent = "No tasks yet.";
        emptyStateText.textContent = "Start by adding your first task.";

    } else if (finalFilteredArr.length === 0) {

        emptyState.style.display = "flex";

        emptyStateTitle.textContent = "No matching tasks found.";
        emptyStateText.textContent = "Try a different search term.";

    } else {

        emptyState.style.display = "none";

    }

    
    for (let item of finalFilteredArr) {

        const taskCard = document.createElement("div");
        taskCard.classList.add("task-card");

        // due date feature
        if (item.dueDate !== "No due date"){
            const [year, month, date] = item.dueDate.split("-");

           const monthIndex = month -1;

            const taskDueDate = new Date(year, monthIndex, date);

            if (today > taskDueDate && !item.completed) {

                 taskCard.classList.add("overdue-card");
            }
        }


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


        taskMeta.append(taskCategory, taskPriority, taskDate);
        taskDetails.append(taskTitle, taskMeta);
        taskInfo.append(checkBoxInput, taskDetails);
        

        const taskActions = document.createElement("div");
        taskActions.classList.add("task-actions");


        const editBtn = document.createElement("button");
        editBtn.setAttribute("data-id", item.id);
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
    updateStats();
    updateProgress();
}

// Statistics Functions - update states card

function updateStats() {

    totalTask.textContent = tasks.length;

    completedTask.textContent = tasks.filter((item)=> item.completed).length;

    pendingTask.textContent = tasks.filter((item)=> !item.completed).length;
}


// update progress

function updateProgress() {

    const total = tasks.length;
    const completed = tasks.filter((item)=> item.completed).length;

    if (total === 0) {

        progressPercentage.textContent = "0%";
        progressFill.style.width = "0%";
    }else {
        const progress = Math.round((completed / total)*100)
        progressPercentage.textContent = `${progress}%`;
        progressFill.style.width = `${progress}%`;
    }
}


// save tasks to local storage

function saveTasks() {

    const jsonStringArr =  JSON.stringify(tasks);
    localStorage.setItem("tasks", jsonStringArr);
}


// load task from local Storage

function loadTasks() {

    const storedTasks = localStorage.getItem("tasks");
    
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
    }

    renderTasks();
}
// initial rendering
loadTasks();


// events

 // Add Task form submit

taskForm.addEventListener("submit", (e) => {

    e.preventDefault();

    const cleanedTitle = title.value.trim();

    if (cleanedTitle === "") {
        return
    }


    if (editingTaskId !== null) {
        const particularTask = tasks.find((element) => element.id === editingTaskId);

        particularTask.title = cleanedTitle;
        particularTask.category = category.value || "No category";
        particularTask.priority = priority.value || "No priority";
        particularTask.dueDate = dueDate.value || "No due date";

        editingTaskId = null;
    }else {

        const taskObj = {
            id: Date.now(),
            title: cleanedTitle,
            category: category.value || "No category",
            priority: priority.value || "No priority",
            dueDate: dueDate.value || "No due date",
            completed: false
        }

         tasks.push(taskObj);
    }
   
    saveTasks();

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

    saveTasks();

    renderTasks();

});



//edit task

taskContainer.addEventListener("click", (e) => {

    if (!e.target.classList.contains("edit-btn")) {
        return;
    }

    const taskId = Number(e.target.getAttribute("data-id"));

    const particularTask = tasks.find((element)=> element.id === taskId);

    title.value = particularTask.title;
    category.value = particularTask.category;
    priority.value = particularTask.priority;
    dueDate.value = particularTask.dueDate;

    editingTaskId = taskId;

});


//delete task

taskContainer.addEventListener("click", (e) => {
    if(!e.target.classList.contains("delete-btn")) {
        return;
    }

    const taskId = Number(e.target.getAttribute("data-id"));

    tasks = tasks.filter((element)=> element.id !== taskId);

    saveTasks();

    renderTasks();

});


// search task

searchInput.addEventListener("input", (e) => {

    searchTerm = e.target.value.trim();

    renderTasks();
});


//  filter select 

filterSelect.addEventListener("change", (e)=> {

    statusFilter = e.target.value;

    renderTasks();
});


// category Filter

categoryFilter.addEventListener("change", (e)=> {

    filterCategory = e.target.value;

    renderTasks();
});

// priority Filter

priorityFilter.addEventListener("change", (e)=> {

    filterPriority = e.target.value;

    renderTasks();
});



// clear complete task 

clearCompletedBtn.addEventListener("click",()=> {
    tasks = tasks.filter((item)=> !item.completed);

    saveTasks();

    renderTasks();
});









