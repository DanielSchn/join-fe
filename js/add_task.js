const PRIOS = [null, 'urgent', 'medium', 'low'];

let submitOnEnter = true;
let currentTask = {};
let assignedToUser = [];
let message = 'Task added to board';


window.addEventListener('resize', function () {
    if (isAddTaskFromBoard()) {
        let viewportWidth = window.innerWidth || document.documentElement.clientWidth;
        if (viewportWidth <= 700) {
            closeTask();
        }
    }
});


/**
 * Überprüfung, ob das Add Task-Formular vom Board aus aufgerufen wurde
 * @returns true, falls vom Board aus aufgerufen, sonst false
 */
function isAddTaskFromBoard() {
    return document.getElementById('addTaskForm') && document.getElementById('taskContainer') &&
        !document.getElementById('addTaskCard').classList.contains('editTaskCard');
}


/**
 * Initialisierung (bei Onload, Body)
 * @param {string} status - Bearbeitungsstatus des Tasks
 */
async function initAddTask(status) {
    initCurrentTask();
    await init();
    styleWebkit();
    submitBtn.disabled = true;
    renderAddTaskForm();
    document.addEventListener('keydown', submitFormOnEnter);
    let today = new Date();
    addTaskDue.min = today.toISOString().slice(0, -14);
    submitBtn.disabled = false;
    currentTask['status'] = status;
}


/**
 * Initialisierung des globalen "currentTask"-JSONs zum Zwischenspeichern
 */
function initCurrentTask() {
    currentTask = {
        id: -1,
        assigned_to: [],
        subtasks: [],
        status: ''
    }
}


/**
 * Custom-Icons für Webkit-Browser
 */
function styleWebkit() {
    if ('WebkitAppearance' in document.documentElement.style && !('MozAppearance' in document.documentElement.style)) {
        addTaskDescription.classList.add('customResizeHandle');
        addTaskDue.classList.add('customDatePicker');
    }
}


/**
 * Initialisierung des Bearbeitungsmodis
 * @param {number} id - Laufindex des Tasks im globalen tasks-Array
 */
async function editTask(id) {
    let task = tasks.find(element => element.id === id);
    await showEditTaskCard(task['status']);
    setCurrentTaskEdit(task);
    renderAddTaskForm();
    togglePrioTransition();
    unselectPrioBtn(2);
    prefillForm(task);
    togglePrioTransition();
    setFormEdit();
}


/**
 * currentTask zur Initialisierung des Bearbeitungsmodus zwischenspeichern
 * @param {JSON} task - Task-JSON aus Tasks-Array 
 */
function setCurrentTaskEdit(task) {
    currentTask['id'] = task['id'];
    currentTask['assigned_to'] = task['assigned_to'];
    currentTask['subtasks'] = task['subtasks'];
}


/**
 * Task entfernen
 * @param {number} id - ID des Tasks im tasks-Array 
 */
async function deleteTask(id) {
    await setItem('tasks', null, id);
    showToastMsg('Task deleted');
    goToBoard();
}


/**
 * allgemeine Render-Funktion
 */
function renderAddTaskForm() {
    renderAddTaskAssignedList();
    renderAddTaskSubtasks();
}


/**
 * Form zur Bearbeitung vorausfüllen
 * @param {JSON} task - Task-JSON aus tasks-Array 
 */
function prefillForm(task) {
    const prio = PRIOS.indexOf(task['prio']);
    addTaskTitle.value = task['title'];
    addTaskDescription.value = task['description'];
    precheckAssignedList();
    addTaskDueText.value = task['due'];
    addTaskDue.value = task['due'];
    stylePrioBtn(prio, prio);
    addTaskCategory.value = categories[task['category']];
}


/**
 * Clear-Button durch Cancel-Button ersetzen
 */
function changeClearBtn() {
    hideClearBtn();
    addTaskCancelBtn.style.display = '';
}


/**
 * Clear-Button verbergen
 */
function hideClearBtn() {
    addTaskClearBtn.style.display = 'none';
}


/**
 * Form-Details im Bearbeitungsmodus, die über erstes Rendern und Vorausfüllen hinausgehen
 */
function setFormEdit() {
    addTaskHeadline.style.display = 'none';
    addTaskCategoryContainer.style.display = 'none';
    addTaskCancelBtn.style.display = 'none';
    submitBtn.innerHTML = 'Ok';
    message = 'Task edited';
}


/**
 * assigned-Liste rendern
 */
function renderAddTaskAssignedList() {
    const list = document.getElementById('addTaskAssignedMenu');
    list.innerHTML = '';
    renderActiveUserToAssignedList();
    for (let i = 0; i < users.length; i++) {
        const user = users[i];
        if (user.id != userId) {
            let checkbox = 'assignedContact' + user.id;
            list.innerHTML += contactAssignedHTML(user, checkbox);
        }
    }
}


/**
 * aktiven User (ausgenommen Guest) zuerst rendern
 */
function renderActiveUserToAssignedList() {
    if (userId != -1) {
        const list = document.getElementById('addTaskAssignedMenu');
        const activeUser = users.find(user => {
            return user.id == userId
        });
        console.log('ACTIVEUSER', activeUser);
        
        if (activeUser) {
            let checkbox = 'assignedContact' + activeUser.id;
            list.innerHTML += contactAssignedHTML(activeUser, checkbox);
        } else {
            console.error('User with ID', userId, 'not found in the users array');
        }
    }
}


/**
 * (Bearbeitungsmodus:) Vorauswahl zugeordneter Kontakte im Dropdown-Menü
 */
function precheckAssignedList() {
    const assigned = currentTask['assigned_to'];
    for (let i = 0; i < users.length; i++) {
        if (assigned.includes(i)) {
            let checkboxId = 'assignedContact' + i;
            let checkbox = document.getElementById(checkboxId);
            toggleAssignedStyle(checkbox);
        }
    }
}


/**
 * assigned-Icons rendern
 */
function renderAddTaskAssignedIcons() {
    const assigned = currentTask['assigned_to'];
    assignedIcons.innerHTML = '';
    for (let i = 0; i < users.length; i++) {
        let contact = users[i];
        if (assigned.includes(i)) {
            assignedIcons.innerHTML += contactAssignedIconHTML(contact);
        }
    }
}


/**
 * bei Enter-Key Submit-Button auslösen (Ergänzung zu HTML-Mechanik)
 * @param {event} e - Event für Key-Abfrage
 */
function submitFormOnEnter(e) {
    if (submitOnEnter) {
        if (addTaskForm && e.key == 'Enter') {
            unfocusAll();
            submitBtn.click();
        }
        removeEventListener('keydown', submitFormOnEnter);
    }
}


/**
 * Formular resetten
 */
function resetTaskForm() {
    const prio = getTaskPrioId();
    if (prio) {
        unselectPrioBtn(prio);
    }
    stylePrioBtn(2, 2);
    currentTask['assignedTo'] = [];
    currentTask['subtasks'] = [];
    renderAddTaskForm();
}


/**
 * Task hinzufügen und zum Board weiterleiten
 */
async function submitTask() {
    setAddTaskDueText();
    const currentId = currentTask['id'];
    let taskData = generateTaskJSON(currentId);
    submitBtn.disabled = true;
    if (!currentId || currentId === -1) {
        const token = localStorage.getItem('token');
        const createdTask = await setItem('tasks', taskData, null, token);
        if (createdTask && createdTask.id) {
            currentTask['id'] = createdTask.id;
        }
    } else {
        await setItem('tasks', taskData, currentId);
    }
    submitBtn.disabled = false;
    showToastMsg(message);
    goToBoard();
}



/**
 * JSON-String für neuen oder bearbeiteten Task erzeugen
 * @param {number} id - ID des Tasks im tasks-Array 
 * @returns Task-JSON im Format des tasks-Arrays
 */
function generateTaskJSON(id) {
    return {
        title: addTaskTitle.value,
        description: addTaskDescription.value,
        assigned_to: assignedToUser,
        due: addTaskDueText.value,
        prio: PRIOS[getTaskPrioId()],
        category: categories.indexOf(addTaskCategory.value),
        subtasks: currentTask['subtasks'],
        timestamp: getTimestamp(),
        status: currentTask['status']
    };
}


/**
 * Message in Viewport bewegen
 */
function showToastMsg(message) {
    const container = document.getElementById('toastMsg');
    container.innerHTML = '';
    container.innerHTML += message;
    container.innerHTML += '<img src="./assets/img/menu_icons/board.svg" alt="icon">';
    container.style.bottom = '50vh';
}


/**
 * Weiterleitung zum Kanban-Board
 */
function goToBoard() {
    window.setTimeout(function () {
        window.location.href = './board.html';
    }, 500);
}