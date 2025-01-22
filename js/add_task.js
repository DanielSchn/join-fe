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
async function initAddTask(status, assignedTo) {
    generateAddTaskTemplateInner();
    await renderAddTaskTemplate();
    await initCurrentTask(assignedTo);
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
async function initCurrentTask(assignedTo) {
    currentTask = {
        id: -1,
        assigned_to: assignedTo,
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
    await showEditTaskCard(task['status'], task['assigned_to']);
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
    const token = sessionStorage.getItem('token');
    await setItem('tasks', null, id, token);
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
    addTaskDueText.value = task['due'];
    addTaskDue.value = task['due'];
    stylePrioBtn(prio, prio);
    addTaskCategory.value = categories[task['category']];
    precheckAssignedList(task['assigned_to']);
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
function precheckAssignedList(assigned) {
    assignedToUser = assigned;
    for (let i = 0; i < users.length; i++) {
        let checkboxId = 'assignedContact' + users[i].id;
        let checkbox = document.getElementById(checkboxId);
        if (assigned.includes(users[i].id)) {
            checkbox.checked = true;
            toggleAssignedStyle(checkbox);
        } else {
            checkbox.checked = false;
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
        if (assigned.includes(contact.id)) {
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
    const token = sessionStorage.getItem('token');
    setAddTaskDueText();
    const currentId = currentTask['id'];
    submitBtn.disabled = true;
    if (!currentId || currentId === -1) {
        let taskData = generateTaskJSON(true);
        const createdTask = await setItem('tasks', taskData, null, token);
        if (createdTask && createdTask.id) {
            currentTask['id'] = createdTask.id;
        }
    } else {
        let taskData = generateTaskJSON(false);
        await setItem('tasks', taskData, currentId, token);
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
function generateTaskJSON(newTask) {
    if (newTask) {
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
    } else {
        return {
            title: addTaskTitle.value,
            description: addTaskDescription.value,
            due: addTaskDueText.value,
            assigned_to: assignedToUser,
            prio: PRIOS[getTaskPrioId()],
            category: categories.indexOf(addTaskCategory.value),
            subtasks: currentTask['subtasks'],
            timestamp: getTimestamp(),
            status: currentTask['status']
        };
    }

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


async function renderAddTaskTemplate() {
    document.getElementById('addTaskTemplate').innerHTML =
    /*html*/`
        <form class="addTaskForm" id="addTaskForm" autocomplete="off" onreset="resetTaskForm()" onsubmit="submitTask(); return false">
    <input autocomplete="false" name="hidden" type="text" style="display: none">
    <h1 id="addTaskHeadline">Add Task</h1>
    <div class="addTaskFormMain">
        <div class="addTaskFormMainSide addTaskFormMainSideOne">
            <div class="addTaskField">
                <label for="addTaskTitle">
                    <h2>Title<p class="red">*</p>
                    </h2>
                </label>
                <input type="text" placeholder="Enter a title" id="addTaskTitle" required class="borderHover">
            </div>
            <div class="addTaskField descriptionContainer">
                <label for="addTaskDescription">
                    <h2>Description</h2>
                </label>
                <textarea placeholder="Enter a description" onkeydown="event.stopPropagation()" id="addTaskDescription" class="borderHover"></textarea>
            </div>
            <div class="addTaskField dropdownContainer">
                <label for="addTaskAssigned" onclick="event.preventDefault()">
                    <h2>Assigned to</h2>
                </label>
                <div id="addTaskAssignedInputContainer" class="extendedInput dropdownInput borderHover preventSelect"
                    onclick="event.stopPropagation(); toggleDropdown('addTaskAssigned')">
                    <input type="text" placeholder="Select contacts to assign" id="addTaskAssigned"
                        onmousedown="event.preventDefault()">
                    <button type="button">
                        <img src="./assets/img/select_icon.svg" alt="icon" id="addTaskAssignedIcon" style="transform: none">
                    </button>
                </div>
                <div class="dropdownMenuWrapper preventSelect">
                    <ul class="dropdownMenu" id="addTaskAssignedMenu" style="display: none"></ul>
                </div>
                <div id="assignedIcons"></div>
            </div>
        </div>
        <div class="vr" id="formSeperator"></div>
        <div class="addTaskFormMainSide addTaskFormMainSideTwo">
            <div class="addTaskField">
                <label for="addTaskDue">
                    <h2>Due date<p class="red">*</p>
                    </h2>
                </label>
                <div id="addTaskDueContainer" class="borderHover"
                    onmousedown="event.stopPropagation(); focusAddTaskDue()">
                    <input type="text" id="addTaskDueText" placeholder="dd/mm/yyyy"
                        onkeyup="autofillAddTaskDueText(event)" oninput="checkAddTaskDueText()">
                    <input type="date" id="addTaskDue" required onchange="setAddTaskDueText()">
                </div>
            </div>
            <div class="addTaskField">
                <h2>Prio</h2>
                <div class="addTaskPrioBtns preventSelect">
                    <button type="button" id="addTaskPrio1" onclick="handlePrioBtnClick(1)">Urgent <img
                            src="./assets/img/prio_icons/task_prio_urgent.svg" alt="icon" id="addTaskPrio1Img"></button>
                    <button type="button" id="addTaskPrio2" onclick="handlePrioBtnClick(2)" class="addTaskPrioBtnsSelected addTaskPrio2Selected">Medium <img
                            src="./assets/img/prio_icons/task_prio_medium_white.svg" alt="icon" id="addTaskPrio2Img"></button>
                    <button type="button" id="addTaskPrio3" onclick="handlePrioBtnClick(3)">Low <img
                            src="./assets/img/prio_icons/task_prio_low.svg" alt="icon" id="addTaskPrio3Img"></button>
                </div>
            </div>
            <div class="addTaskField dropdownContainer" id="addTaskCategoryContainer">
                <label for="addTaskCategory" onclick="event.preventDefault()">
                    <h2>Category<p class="red">*</p>
                    </h2>
                </label>
                <div id="addTaskCategoryInputContainer" class="extendedInput dropdownInput borderHover preventSelect"
                    onclick="event.stopPropagation(); toggleDropdown('addTaskCategory')">
                    <input type="text" class="preventSelect" placeholder="Select task category" id="addTaskCategory" required
                        onmousedown="event.preventDefault()">
                    <button type="button">
                        <img src="./assets/img/select_icon.svg" alt="icon" id="addTaskCategoryIcon" style="transform: none">
                    </button>
                </div>
                <ul class="dropdownMenu preventSelect" id="addTaskCategoryMenu" style="display: none">
                    <li onclick="handleDropdownMenuClick(event)">Technical Task</li>
                    <li onclick="handleDropdownMenuClick(event)">User Story</li>
                </ul>
            </div>
            <div class="addTaskField">
                <label for="addSubtask" onclick="event.stopPropagation(); focusSubtask()">
                    <h2>Subtasks</h2>
                </label>
                <div id="addSubtaskInputContainer" class="extendedInput borderHover"
                    onclick="event.stopPropagation(); focusSubtask()">
                    <input type="text" placeholder="Add new subtask" id="addSubtask">
                    <div id="addSubtaskIconsPassive">
                        <button type="button">
                            <img src="./assets/img/plus_icon.svg" alt="icon">
                        </button>
                    </div>
                    <div id="addSubtaskIconsActive" style="display: none">
                        <button type="button" onclick="event.stopPropagation(); cancelSubtask()">
                            <img src="./assets/img/cancel.svg" alt="cancel subtask">
                        </button>
                        <div class="vr"></div>
                        <button type="button" onclick="event.stopPropagation(); createSubtask()">
                            <img src="./assets/img/check.svg" alt="create subtask">
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="subtasksContainer">
        <div id="subtasksLeftMargin"></div>
        <div class="subtasksListContainer">
            <ul id="subtasksList"></ul>
        </div>
    </div>
    <div class="addTaskBottom" id="addTaskBottom">
        <div class="fontSizeSmall">
            <p class="red" style="margin-bottom: 3px">*</p>
            This field is required
        </div>
        <div>
            <button type="reset" id="addTaskCancelBtn" class="btnSecondary" style="display: none" onclick="resetTaskForm(); closeTask()">Cancel</button>
            <button type="reset" id="addTaskClearBtn" class="btnSecondary">Clear</button>
            <button type="submit" class="btnPrimary" id="submitBtn">Create Task</button>
        </div>
    </div>
</form>
    `;
}