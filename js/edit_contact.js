/**
 * This function creates the etit form
 * It shows the current contact informations
 * @param {*} index - place of the current contact within the contacts array
 */
function renderEditForm(index) {
    let editCard = document.getElementById('editCardOne');
    editCard.innerHTML = '';
    let contactName = contacts.find(contact => contact.id === index);
    let initial = getInitials(contactName.name);
    editCard.innerHTML = /* html */`
        <div class="leftBlueSection">
            <img class="closeAddCard d-none" onclick="editCardWindow(false)" src="./assets/img/contacts/close.svg">
            <img class="smallCardLogo" src="./assets/img/contacts/logo_card.svg">
            <div class="cardTitle">
                <span class="addCardHeadline">Edit Contact</span>
                <div id="devider3"></div>
            </div>
        </div>
        <div class="cardInitials_bg" style="background-color: ${contactName.color}">
            <span class="cardIntitials">${initial}</span>
        </div>
        <img class="closeAddContact_btn" src="./assets/img/contacts/close.svg" onclick="editCardWindow(false)">
        <form id="editForm" onsubmit="editCurrentContact(${index}); return false">
            <div class="addContactInputContainer"><input id="editName" class="addContactInput" type="text" placeholder="Name"><img src="./assets/img/contacts/person.svg"></div>
            <div class="addContactInputContainer"><input id="editMail" class="addContactInput" type="email" placeholder="Email"><img src="./assets/img/contacts/mail.svg"></div>
            <div class="addContactInputContainer"><input id="editNumber" class="addContactInput" type="tel" placeholder="Phone"><img src="./assets/img/contacts/call.svg"></div>
            <div class="addSummit_btn">
                <button class="addContactCancel_btn">Cancel<img src="./assets/img/contacts/iconoir_cancel.svg"></button>
                <button class="addContactCreate_btn">Save<img src="./assets/img/contacts/check.svg"></button>
            </div>
        </form>
    `;
    prefillEditForm(index);
}


/**
 * Loads the current contact informations
 * @param {*} index - place of the current contact within the contacts array
 */
function prefillEditForm(index) {
    const contact = contacts.find(contact => contact.id === index);
    editName.value = contact['name'];
    editMail.value = contact['mail'];
    editNumber.value = contact['number'];
}

/**
 * Rendert das Bearbeitungsformular für Benutzer, basierend auf den Daten aus der API.
 * @param {number} index - ID des Benutzers, der bearbeitet werden soll.
 */
async function renderUserEditForm(index) {
    let editCard = document.getElementById('editCardOne');
    editCard.innerHTML = '';
    try {
        let response = await getItem(`auth/user/${index}`);
        if (!response) {
            throw new Error(`Failed to fetch user data: ${response.statusText}`);
        }
        let userData = response;
        let initial = getInitials(`${userData.first_name + '' + userData.last_name}`);
        editCard.innerHTML = /* html */`
            <div class="leftBlueSection">
                <img class="closeAddCard d-none" onclick="editCardWindow(false)" src="./assets/img/contacts/close.svg">
                <img class="smallCardLogo" src="./assets/img/contacts/logo_card.svg">
                <div class="cardTitle">
                    <span class="addCardHeadline">Edit User</span>
                    <div id="devider3"></div>
                </div>
            </div>
            <div class="cardInitials_bg" style="background-color: ${userData.color}">
                <span class="cardIntitials">${initial}</span>
            </div>
            <img class="closeAddContact_btn" src="./assets/img/contacts/close.svg" onclick="editCardWindow(false)">
            <form id="editForm" onsubmit="editCurrentUser(${index}); return false">
                <div class="addContactInputContainer">
                    <input id="editFirstName" class="addContactInput" type="text" placeholder="First Name">
                    <img src="./assets/img/contacts/person.svg">
                </div>
                <div class="addContactInputContainer">
                    <input id="editLastName" class="addContactInput" type="text" placeholder="Last Name">
                    <img src="./assets/img/contacts/person.svg">
                </div>
                <div class="addContactInputContainer">
                    <input id="editMail" class="addContactInput" type="email" placeholder="Email">
                    <img src="./assets/img/contacts/mail.svg">
                </div>
                <div class="addSummit_btn">
                    <button class="addContactCancel_btn">Cancel<img src="./assets/img/contacts/iconoir_cancel.svg"></button>
                    <button class="addContactCreate_btn">Save<img src="./assets/img/contacts/check.svg"></button>
                </div>
            </form>
        `;

        // Das Formular mit den Daten aus der API vorbefüllen
        prefillUserEditForm(userData);
    } catch (error) {
        console.error('Error fetching user data:', error);
        editCard.innerHTML = `<p>Error loading user details. Please try again later.</p>`;
    }
}


/**
 * Befüllt das Bearbeitungsformular mit den Daten aus der API.
 * @param {Object} userData - Benutzerobjekt, das die Felder `first_name`, `last_name`, `email` und `number` enthält.
 */
function prefillUserEditForm(userData) {
    document.getElementById('editFirstName').value = userData['first_name'];
    document.getElementById('editLastName').value = userData['last_name'];
    document.getElementById('editMail').value = userData['email'];
}


/**
 * 
 * @param {number} index - ID des bearbeiteten Benutzers.
 */
async function editCurrentUser(index) {
    let firstName = document.getElementById('editFirstName').value;
    let lastName = document.getElementById('editLastName').value;
    let email = document.getElementById('editMail').value;
    let id = localStorage.getItem('userId');
    let username = localStorage.getItem('userName');
    let token = localStorage.getItem('token');
    const updatedUserData = {
        "first_name": firstName,
        "last_name": lastName,
        "email": email,
        "id": id,
        "username": username
    };
    try {
        const response = await setItem(`auth/user`, updatedUserData, id, token);
        console.log('User updated successfully:', response);
        await refreshContactList();
        editCardWindow(false);
        showContactCard(index, `profile`);
        renderProfile();
    } catch {
        console.error('Failed to update user:', error);
    }
    console.log(`Save edited user with ID: ${index}`);
}


/**
 * This function creates the etit form (mobile)
 * It shows the current contact informations
 * @param {*} index - place of the current contact within the contacts array
 */
function renderMobileEditForm(index) {
    let mobileEditCard = document.getElementById('mobileEditCardOne');
    mobileEditCard.innerHTML = '';
    let contactName = contacts.find(contact => contact.id === index);
    let initial = getInitials(contactName.name);
    mobileEditCard.innerHTML = /* html */`
    <div class="mobileLeftBlueSection">
            <img class="mobileCloseAddCard d-none" onclick="editCardWindow(false)" src="./assets/img/contacts/close.svg">
            <div class="mobileAddCardTitle">
                <span class="addCardHeadline">Edit Contact</span>
                <div class="mobileDevider3"></div>
            </div>
        </div>
        <div class="mobileCardInitials_bg" style="background-color: ${contactName.color}">
            <span class="mobileCardIntitials">${initial}</span>
        </div>
        <img class="mobileCloseAddContact_btn" src="./assets/img/contacts/close.svg" onclick="editCardWindow(false)">
        <form id="editMobileForm" onsubmit="mobileEditCurrentContact(${index}); return false">
            <div class="addContactInputContainer"><input id="editMobileName" class="addContactInput" type="text" placeholder="Name"><img src="./assets/img/contacts/person.svg"></div>
            <div class="addContactInputContainer"><input id="editMobileMail" class="addContactInput" type="email" placeholder="Email"><img src="./assets/img/contacts/mail.svg"></div>
            <div class="addContactInputContainer"><input id="editMobileNumber" class="addContactInput" type="tel" placeholder="Phone"><img src="./assets/img/contacts/call.svg"></div>
            <div class="mobileAddSummit_btn">
                <button class="mobileAddContactCancel_btn">Cancel<img src="./assets/img/contacts/iconoir_cancel.svg"></button>
                <button class="mobileAddContactCreate_btn">Save<img src="./assets/img/contacts/check.svg"></button>
            </div>
        </form>
        `;
    prefillMobileEditForm(index);
}


/**
 * Loads the current contact informations (mobile)
 * @param {*} index - place of the current contact within the contacts array
 */
function prefillMobileEditForm(index) {
    const contact = contacts.find(contact => contact.id === index);
    editMobileName.value = contact['name'];
    editMobileMail.value = contact['mail'];
    editMobileNumber.value = contact['number'];
}


/**
 * this function pulls all informations out of the edit form
 * @param {*} index - place of the current contact within the contacts array
 * @param {string} newName - returns the current name
 * @param {string} newMail - returns the current mail
 * @param {string} newNumber - returns the current number
 * @param {string} firstLetter - returns the firstletter of the name
 */
async function editCurrentContact(index) {
    const name = document.getElementById('editName');
    const mail = document.getElementById('editMail');
    const number = document.getElementById('editNumber');
    const getName = name.value;
    const firstLetter = getName.charAt(0).toUpperCase();
    const updatedContact = {
        'name': getName,
        'mail': mail.value,
        'number': number.value,
        'letter': firstLetter,
    };
    try {
        const token = localStorage.getItem('token');
        await setItem('contacts', updatedContact, index, token);
        contacts[index] = { ...contacts[index], ...updatedContact };
        await refreshContactList();
        editCardWindow(false);
        showContactCard(index);
    } catch (error) {
        console.error('Error editing contact:', error);
    }
}


/**
 * this function pulls all informations out of the edit form (mobile)
 * @param {*} index - place of the current contact within the contacts array
 * @param {string} newName - returns the current name
 * @param {string} newMail - returns the current mail
 * @param {string} newNumber - returns the current number
 * @param {string} firstLetter - returns the firstletter of the name
 */
async function mobileEditCurrentContact(index) {
    let name = document.getElementById('editMobileName');
    let mail = document.getElementById('editMobileMail');
    let number = document.getElementById('editMobileNumber');
    let getName = name.value;
    let firstLetter = getName.charAt(0).toUpperCase();
    const updatedContact = {
        'name': getName,
        'email': mail.value,
        'tel': number.value,
        'letter': firstLetter,
    };
    try {
        const token = localStorage.getItem('token');
        await setItem('contacts', updatedContact, contacts[index].id, token);
        contacts[index] = { ...contacts[index], ...updatedContact };
        refreshContactList();
        editCardWindow(false);
        showContactCard(index);
    } catch (error) {
        console.error('Error editing contact:', error);
    }
}


/**
 * this function removes the current contact out of the contact array
 * @param {*} index - place of the current contact within the contacts array
 */
async function deleteContact(index) {
    const contactId = index;
    const guestUser = document.getElementById('user_name_0').innerHTML;
    if (guestUser === 'Guest User') {
        const failureMobile = document.getElementById('onlyGuestMobile');
        failureMobile.innerHTML = 'Not allowed, you are in Guest Mode!'
    } else {
        try {
            await setItem('contacts', null, contactId);
            contacts.splice(index, 1);
            refreshContactList();
            let contactDetails = document.getElementById('mainContactDetails');
            contactDetails.innerHTML = '';
            let mobileContactDetails = document.getElementById('mobileMainContactDetails');
            mobileContactDetails.innerHTML = '';
            hideContactCard();
        } catch (error) {
            console.error('Error deleting contact:', error);
        }
    }

}


/**
 * This function refreshes the contact list
 */
async function refreshContactList() {
    sortContacts();
    await loadContacts();
    renderContacts();
}