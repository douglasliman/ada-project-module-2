// ================= date ========================================

document.getElementById('calendar').textContent = getCurrentDate();

function getCurrentDate() {
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return today.toLocaleDateString('pt-BR', options);
}

const addTaskBtn = document.getElementById('addTaskBtn');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');



const filterInput = document.getElementById('filterInput');
const completedTaskList = document.getElementById('finishedList');

// =================  id ========================================


function create_UUID() {
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx'.replace(/[x]/g, function (c) {
        var r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}

// ============== remove task ========================================
function removeTask(taskId) {
    removeTaskFromLocalStorage(taskId);

    const taskToRemove = document.getElementById(taskId);
    if (taskToRemove) {
        taskToRemove.remove();
    }
}

document.addEventListener('click', function (event) {
    const target = event.target;

    const btnErase = findParentWithClass(target, 'btn-erase');
    
    if (btnErase) {
        const taskId = btnErase.getAttribute('data-task-id');

        removeTask(taskId);
        removeCompletedTask(taskId)
    }
});

function findParentWithClass(element, className) {
    while ((element = element.parentElement) && !element.classList.contains(className));
    return element;
}


// ================= add task ========================================

function AddATask() {
    const contentTask = taskInput.value.trim();

    if (contentTask !== '') {
        const taskId = create_UUID();

        const listItem = document.createElement('li');
        listItem.className = 'todoTask';
        listItem.id = taskId;

        listItem.innerHTML = `
            <div>${contentTask}</div>
            <div class="editTask">
                <button class="update" data-task-id="${taskId}"><img src="./assets/update.svg" alt=""></button> 
                <button class="btn-erase" data-task-id="${taskId}"><img src="./assets/delete.svg" alt=""></button>
                <button class="btn-done" data-task-id="${taskId}"><img src="./assets/done.svg" alt=""></button>
            </div>
        `;

        taskList.insertBefore(listItem, taskList.firstChild);
        taskInput.value = '';

        saveTasksToLocalStorage(); 
    } else {
 
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Tentando criar uma tarefa vazia?",
          });
    }
}

// ================= LOCAL STORAGE TASK ========================================


function saveTasksToLocalStorage() {
    const tasks = [];
    for (const task of taskList.children) {
        tasks.push({
            id: task.id,
            content: task.firstElementChild.textContent
        });
    }

    localStorage.setItem('tasks', JSON.stringify(tasks));
}


function loadTasksFromLocalStorage() {
    const storedTasks = localStorage.getItem('tasks');

    if (storedTasks) {
        const tasks = JSON.parse(storedTasks);

        tasks.forEach(task => {
            const listItem = document.createElement('li');
            listItem.className = 'todoTask';
            listItem.id = task.id;

            listItem.innerHTML = `
                <div>${task.content}</div>
                <div class="editTask">
                    <button class="update" data-task-id="${task.id}"><img src="./assets/update.svg" alt=""></button> 
                    <button class="btn-erase" data-task-id="${task.id}"><img src="./assets/delete.svg" alt=""></button>
                    <button class="btn-done" data-task-id="${task.id}"><img src="./assets/done.svg" alt=""></button>
                </div>
            `;

            taskList.appendChild(listItem);
        });
    }
}
function removeTaskFromLocalStorage(taskId) {
    const storedTasks = localStorage.getItem('tasks');

    if (storedTasks) {
        const tasks = JSON.parse(storedTasks);

        const filteredTasks = tasks.filter(task => task.id !== taskId);

        localStorage.setItem('tasks', JSON.stringify(filteredTasks));
    }
}

// ====================== FILTRO ========================================


function filterTasks() {
    const filterText = filterInput.value.toLowerCase();
    filterList(taskList, filterText);
    filterList(completedTaskList, filterText);
}
function filterList(list, filterText) {
    const tasks = list.getElementsByClassName('todoTask');

    for (const task of tasks) {
        const title = task.firstElementChild.textContent.toLowerCase();
        task.style.display = title.includes(filterText) ? 'flex' : 'none';
    }
}




// =================  LOCAL STORAGE  COMPLETED TASKS ========================================




function saveCompletedTasksToLocalStorage() {
    const completedTasks = [];
    for (const completedTask of completedTaskList.children) {
        completedTasks.push({
            id: completedTask.id,
            content: completedTask.firstElementChild.textContent
        });
    }

    localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
}



function loadCompletedTasksFromLocalStorage() {
    const storedCompletedTasks = localStorage.getItem('completedTasks');

    if (storedCompletedTasks) {
        const completedTasks = JSON.parse(storedCompletedTasks);

        completedTasks.forEach(completedTask => {
            const listItem = document.createElement('li');
            listItem.className = 'todoTask';
            listItem.id = completedTask.id;

            listItem.innerHTML = `
                <div>${completedTask.content}</div>
                <div class="editTask">
                    <button class="update" data-task-id="${completedTask.id}"><img src="./assets/update.svg" alt=""></button> 
                    <button class="btn-erase" data-task-id="${completedTask.id}"><img src="./assets/delete.svg" alt=""></button>
                    <button class="btn-done" data-task-id="${completedTask.id}"><img src="./assets/done.svg" alt=""></button>
                </div>
            `;

            completedTaskList.appendChild(listItem);
        });
    }
}

document.addEventListener('click', function (event) {
    const target = event.target;

    const btnDone = findParentWithClass(target, 'btn-done');

    if (btnDone) {
        const taskId = btnDone.getAttribute('data-task-id');
        const taskElement = document.getElementById(taskId);

        if (taskList.contains(taskElement)) {
            taskElement.remove();
            completedTaskList.appendChild(taskElement);
            removeTaskFromLocalStorage(taskId); 
            saveCompletedTasksToLocalStorage(); 
        } else if (completedTaskList.contains(taskElement)) {
            taskElement.remove();
            taskList.appendChild(taskElement);
            removeCompletedTaskFromLocalStorage(taskId); 
            saveTasksToLocalStorage(); 
        }
    }
});

function removeCompletedTaskFromLocalStorage(taskId) {
    const storedCompletedTasks = localStorage.getItem('completedTasks');
    console.log('Removing task from completedTasks:', taskId);
    if (storedCompletedTasks) {
        const completedTasks = JSON.parse(storedCompletedTasks);

        const filteredCompletedTasks = completedTasks.filter(task => task.id !== taskId);

        localStorage.setItem('completedTasks', JSON.stringify(filteredCompletedTasks));
       
    }
}

function removeCompletedTask(taskId) {
    removeCompletedTaskFromLocalStorage(taskId);

    const taskToRemove = document.getElementById(taskId);
    if (taskToRemove) {
        taskToRemove.remove();
    }
}



// ==================== EXECUÇÃO ========================================

taskInput.addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        addTaskBtn.click();
    }
});

addTaskBtn.addEventListener('click', AddATask);
filterInput.addEventListener('input', filterTasks);

function loadAllFromLocalStorage() {
    loadTasksFromLocalStorage();
    loadCompletedTasksFromLocalStorage();
}

loadAllFromLocalStorage();