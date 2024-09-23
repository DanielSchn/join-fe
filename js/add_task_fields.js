/**
 * Kontakt in sichtbarer Assigned-Liste markieren oder Markierung entfernen
 * @param {element} checkbox - ID/Element der Checkbox ('assignedContact' + jeweilige User-ID)
 */
function toggleAssigned(userId) {
    const checkboxElement = document.getElementById(`assignedContact${userId}`);
    if (checkboxElement) {
        toggleAssignedArray(userId);
        toggleAssignedStyle(checkboxElement);
    } else {
        console.error(`Checkbox for user ID ${userId} not found.`);
    }
}



/**
 * 
 * @param {element} checkbox - ID/Element der Checkbox 
 */
function toggleAssignedStyle(checkbox) {
    const li = checkbox.parentNode.parentNode;
    li.classList.toggle('addTaskAssignedChecked');
    toggleCheckbox(checkbox);
    renderAddTaskAssignedIcons();
}


/**
 * Kontakt in assignedTo-Array hinzufügen oder entfernen
 * @param {number} id - Kontakt-ID aus assignedTo-Array
 */
function toggleAssignedArray(id) {
    let assigned = currentTask['assigned_to'];
    if (assigned.includes(id)) {
        assigned = assigned.filter(assignedId => assignedId !== id);
    } else {
        assigned.push(id);
    }
    currentTask['assigned_to'] = assigned;
}


/**
 * subtasks rendern
 */
function renderAddTaskSubtasks() {
    const subtasks = currentTask['subtasks'];
    const list = document.getElementById('subtasksList');
    list.innerHTML = '';
    for (let i = 0; i < subtasks.length; i++) {
        let subtask = subtasks[i];
        list.innerHTML += subtaskHTML(subtask['title'], i);
    }
}


/**
 * due-Feld fokussieren
 */
function focusAddTaskDue() {
    const container = document.getElementById('addTaskDueContainer');
    unfocusAll();
    container.style.borderColor = 'var(--lightBlue1)';
    addTaskDueText.focus();
    document.addEventListener("mousedown", unfocusAddTaskDue);
}


/**
 * due-Fokus aufheben
 */
function unfocusAddTaskDue() {
    const container = document.getElementById('addTaskDueContainer');
    container.style.borderColor = '';
    setAddTaskDueText();
    document.removeEventListener("mousedown", unfocusAddTaskDue);
}


/**
 * an passenden Stellen automatisch '/' einfügen
 * @param {event} e 
 */
function autofillAddTaskDueText(e) {
    const value = addTaskDueText.value;
    const key = e.key;
    const length = value.length;
    if (key != ('Backspace' || '/') && (length == 2 || length == 5)) {
        addTaskDueText.value = value + '/';
    }
}


/**
 * Datumseingabe prüfen
 */
function checkAddTaskDueText() {
    const value = addTaskDueText.value;
    let transformedValue = transformDate(value);
    if (value.length == 10 && isDateValid(transformedValue)) {
        addTaskDue.value = transformedValue;
    } else {
        if (value.length > 10) {
            addTaskDueText.value = value.substring(0, 10);
        }
    }
}


/**
 * Datumsstring umkehren
 * @param {string} ddmmyyyy
 * @returns yyyymmdd
 */
function transformDate(ddmmyyyy) {
    let yyyy = ddmmyyyy.substring(6);
    let mm = ddmmyyyy.substring(3, 5);
    let dd = ddmmyyyy.substring(0, 2);
    return yyyy + '-' + mm + '-' + dd;
}


/**
 * Datum auf Gültigkeit prüfen
 * @param {string} yyyymmdd 
 * @returns TRUE, falls Datum gültig, FALSE, falls ungültig
 */
function isDateValid(yyyymmdd) {
    let date = new Date(yyyymmdd);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    return date !== 'Invalid Date' &&
        Date.now() <= Date.parse(date) &&
        monthContainsDay(day, month, year);
}


/**
 * Prüfen, ob der jeweilige Tag sich im Monat befindet (wird durch Default-Methoden für Date-Objekte noch nicht erfüllt)
 * @param {number} day 
 * @param {number} month
 * @param {number} year  
 * @returns TRUE, falls Tag in Monat enthalten, FALSE, falls nicht
 */
function monthContainsDay(day, month, year) {
    return (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) ||
        ((month == 4 || month == 6 || month == 9 || month == 11) && day <= 30) ||
        (month == 2 && year % 4 == 0 && day <= 29) ||
        (month == 2 && year % 4 != 0 && day <= 28);
}


/**
 * Text-Input an Date-Input anpassen
 */
function setAddTaskDueText() {
    if (addTaskDue.value) {
        const date = new Date(addTaskDue.value);
        const yyyy = date.getFullYear();
        let mm = date.getMonth() + 1;
        mm = ('0' + mm).slice(-2);
        let dd = date.getDate();
        dd = ('0' + dd).slice(-2);
        addTaskDueText.value = `${yyyy}-${mm}-${dd}`;
    } else {
        addTaskDueText.value = '';
    }
}


/** 
 * Funktion bestimmt, was bei Klick auf einen der drei Prioritätsbuttons geschieht 
 * @param {number} btnNumber - Laufindex des geklickten Buttons (1: urgent, 2: medium, 3: low) 
 */
function handlePrioBtnClick(btnNumber) {
    for (let i = 1; i <= 3; i++) {
        stylePrioBtn(i, btnNumber);
    }
}


/** 
 * Prio-Button stylen
 * @param {number} index - Laufindex des zu stylenden Buttons
 * @param {*} btnNumber - Laufindex des geklickten Buttons
 */
function stylePrioBtn(index, btnNumber) {
    const btn = document.getElementById('addTaskPrio' + index);
    if (index == btnNumber) {
        btn.classList.toggle('addTaskPrioBtnsSelected');
        btn.classList.toggle(`addTaskPrio${index}Selected`);
        togglePrioBtnImg(index);
    } else {
        unselectPrioBtn(index);
    }
}


/**
 * entfernt die bei Selektion hinzugefügten Klassen und Färbung
 * @param {*} index - Laufindex des zu stylenden Buttons 
 */
function unselectPrioBtn(index) {
    const btn = document.getElementById('addTaskPrio' + index);
    btn.classList.remove('addTaskPrioBtnsSelected');
    btn.classList.remove(`addTaskPrio${index}Selected`);
    colorPrioBtnImg(index);
}


/** 
 * <img> im Button durch Pfadänderung stylen
 * @param {number} index - Laufindex des Buttons 
 */
function togglePrioBtnImg(index) {
    const img = document.getElementById(`addTaskPrio${index}Img`);
    if (img.src.includes('white')) {
        colorPrioBtnImg(index);
    } else {
        let newSrc = img.src.replace('.svg', '_white.svg');
        img.src = newSrc;
    }
}


/** 
 * <img> im Button bunt färben
 * @param {number} index - Laufindex des Buttons 
 */
function colorPrioBtnImg(index) {
    const img = document.getElementById(`addTaskPrio${index}Img`);
    if (img.src.includes('white')) {
        let newSrc = img.src.replace('_white', '');
        img.src = newSrc;
    }
}


/**
 * Task-Priorität aus Formularstatus auslesen
 * @returns Priorität als Zahl (wie im globalem PRIOS-Array)
 */
function getTaskPrioId() {
    const prioBtn = document.getElementsByClassName('addTaskPrioBtnsSelected');
    let prioId = 0;
    if (prioBtn.length > 0) {
        prioId = prioBtn[0].id;
        prioId = prioId.slice(-1);
        prioId = parseInt(prioId);
    }
    return prioId;
}


/**
 * Schaltet Transition-Dauer zwischen 0ms und Default-Wert, um Rendern zu beschleunigen
 */
function togglePrioTransition() {
    for (let i = 1; i < 3; i++) {
        const btn = document.getElementById('addTaskPrio' + i);
        btn.style.transition = (btn.style.transition === '') ? '0ms' : '';     
    }
}


/** 
 * Fokussierung des Input-Feldes für Subtasks
 */
function focusSubtask() {
    const container = document.getElementById('addSubtaskInputContainer');
    const btnsPassive = document.getElementById('addSubtaskIconsPassive');
    const btnsActive = document.getElementById('addSubtaskIconsActive');
    unfocusAll();
    container.style.borderColor = 'var(--lightBlue1)';
    addSubtask.focus();
    btnsPassive.style.display = 'none';
    btnsActive.style.display = '';
    document.addEventListener("click", unfocusSubtask);
    submitOnEnter = false;
    document.addEventListener("keydown", createSubtaskOnEnter);
}


/**
 * Fokus aufheben
 */
function unfocusSubtask() {
    const container = document.getElementById('addSubtaskInputContainer');
    container.style.borderColor = '';
    if (addSubtask.value == '') {
        const btnsPassive = document.getElementById('addSubtaskIconsPassive');
        const btnsActive = document.getElementById('addSubtaskIconsActive');
        btnsPassive.style.display = '';
        btnsActive.style.display = 'none';
    }
    document.removeEventListener("click", unfocusSubtask);
    submitOnEnter = true;
    document.removeEventListener("keydown", createSubtaskOnEnter);
}


/**
 * Cancel-Button löscht eingetragenen Wert und hebt Fokus auf
 */
function cancelSubtask() {
    addSubtask.value = '';
    unfocusSubtask();
}


/**
 * Check-Button erzeugt Subtask, falls Wert eingetragen
 */
function createSubtask() {
    if (addSubtask.value) {
        currentTask['subtasks'].push({
            title: addSubtask.value,
            status: 'toDo'
        });
        renderAddTaskSubtasks();
    }
    subtasksScrollBottom();
    cancelSubtask();
}


/**
 * Subtasks nach unten scrollen
 */
function subtasksScrollBottom() {
    let element = window;
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    if (vw > 1050) {
        element = subtasksList.parentNode.parentNode;
    }
    element.scrollTo(0, document.body.scrollHeight);
}


/**
 * wird ein Subtask mittels Enter-Key erstellt, wird das Input-Feld danach wieder fokussiert
 * @param {event} e - Event zur Key-Abfrage
 */
function createSubtaskOnEnter(e) {
    if (e.key == 'Enter') {
        e.preventDefault();
        createSubtask();
        focusSubtask();
    }
}


/**
 * erstellt Input-Feld in Subtasks-Liste, um Subtask zu bearbeiten
 * @param {number} index - Laufindex innerhalb des subtasks-Array 
 */
function editSubtask(index) {
    let subtask = currentTask['subtasks'][index];
    const li = document.getElementById(`subtask${index}`);
    li.innerHTML = editSubtaskHTML(subtask['title'], index);
    li.classList.add('editSubtask');
    const input = document.getElementById('editSubtaskInput');
    const length = input.value.length;
    input.focus();
    input.setSelectionRange(length, length);
    document.addEventListener("click", renderAddTaskSubtasks);
}


/**
 * Bestätigung der Subtask-Bearbeitung
 * @param {number} index - Laufindex innerhalb des subtasks-Array 
 */
function confirmSubtaskEdit(index) {
    const input = document.getElementById('editSubtaskInput');
    let subtasks = currentTask['subtasks'];
    if (input.value) {
        subtasks[index]['title'] = input.value;
    } else {
        subtasks.splice(index, 1);
    }
    renderAddTaskSubtasks();
}


/**
 * Subtask aus Liste und Daten entfernen
 * @param {number} index - Laufindex innerhalb des subtasks-Array 
 */
function removeSubtask(index) {
    let subtasks = currentTask['subtasks'];
    subtasks.splice(index, 1);
    renderAddTaskSubtasks();
}