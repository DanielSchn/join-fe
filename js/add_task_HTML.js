/**
 * erzeugt Kontaktfeld für assignedTo-Dropdown-Menü
 * @param {JSON} contact - Kontaktdaten
 * @param {string} id - ID des Kontakts ('assignedContact' + Index) 
 * @returns HTML-String
 */
function contactAssignedHTML(contact) {
    let html = '';
    const checkboxId = `assignedContact${contact.id}`;
    html += /* html */`
    <li onclick="event.stopPropagation(); toggleAssigned(${contact.id})">
        ${contactAssignedIconHTML(contact)}
        <div class="contactDetails">
            <div>${contact.first_name + ' ' + contact.last_name}`;
    if (contact.id == userId) {
        html += ' (You)';
    }
    html += /* html */`</div>
            </div>
            <button type="button">
                <img id="${checkboxId}" src="./assets/img/checkbox.svg" alt="unchecked">
            </button>
        </li>`;
    return html;
}


/**
 * erzeugt Kontakt-Icon unter assignedTo-Eingabefeld
 * @param {JSON} contact - Kontaktdaten
 * @returns HTML-String
 */
function contactAssignedIconHTML(contact) {
    const profile = profiles.find(profile => profile.user === contact.id);
    const color = profile ? profile.color : '#000';
    const initials = profile ? profile.initials : '?';
    return /* html */`
        <div class="contactInitials" style="background: ${color}">
            <span>${initials}</span>
        </div>
    `;
}


/**
 * erzeugt Subtask für Subtasks-Liste
 * @param {string} subtask - Subtask-Titel (wie in ['subtasks'][#]['title'])
 * @param {number} index - Laufindex zur Identifikation
 * @returns HTML-String
 */
function subtaskHTML(subtask, index) {
    return /* html */`
        <li id="subtask${index}">
            &bull;
            <span ondblclick="editSubtask(${index})">${subtask}</span>
            <button type="button" onclick="event.stopPropagation(); editSubtask(${index})">
                <img src="./assets/img/edit.svg" alt="edit subtask">
            </button>
            <div class="vr"></div>
            <button type="button" onclick="removeSubtask(${index})">
                <img src="./assets/img/remove.svg" alt="remove subtask">
            </button>
        </li>`;
}


/**
 * erzeugt Bearbeitungsfeld für Subtask in Subtasks-Liste
 * @param {string} subtask - Subtask-Titel (wie in ['subtasks'][#]['title'])
 * @param {number} index - Laufindex zur Identifikation
 * @returns HTML-String
 */
function editSubtaskHTML(subtask, index) {
    return /* html */`
        <input id="editSubtaskInput" onclick="event.stopPropagation()" type="text" value="${subtask}">    
        <button type="button" onclick="event.stopPropagation(); removeSubtask(${index})" class="subtasksButton">
            <img src="./assets/img/remove.svg" alt="remove subtask">
        </button>
        <div class="vr"></div>
        <button type="button" onclick="event.stopPropagation(); confirmSubtaskEdit(${index})" class="subtasksButton">
            <img src="./assets/img/check.svg" alt="confirm subtask edit">
        </button>
    `;
}