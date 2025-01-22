let contacts = [];


/**
 * This function initiate and loads the contact list
 */
async function initContacts() {
    await init();
    await loadContacts();
    renderContacts();
    renderProfile();
}


/**
 * This function saves a new created contact and loads the contact into the remot storage
 */
async function saveNewContact(isDesktopForm) {

    if(isDesktopForm === true) {
        await addNewContact();
    } else {
        await mobileAddNewContact();
    }
    await loadContacts();
    closeAddCardOne();
    renderContacts();
}


/**
 * This function is pulling all informations out of the "add new contact" form
 * It pushes the information into the contact array
 * Loads the new contact array into the remote storage
 */
async function addNewContact() {
    const contactName = document.getElementById('contactName');
    const contactEmail = document.getElementById('contactMail');
    const contactNumber = document.getElementById('contactNumber');
    const getName = contactName.value;
    const firstLetter = getName.charAt(0).toUpperCase();
    const newContact = {
        'name': getName,
        'mail': contactEmail.value,
        'number': contactNumber.value,
        'letter': firstLetter,
        'color': getRandomUserIconColor()
    };
    try {
        const token = sessionStorage.getItem('token');
        const response = await setItem('contacts', newContact, null, token);
        sortContacts();
    } catch (error) {
        console.error('Error adding contact:', error);
    }
}


/**
 * This function is pulling all informations out of the "add new contact" form
 * It pushes the information into the contact array
 * Loads the new contact array into the remote storage
 */
async function mobileAddNewContact() {
    const contactName = document.getElementById('contactMobileName');
    const contactEmail = document.getElementById('contactMobileMail');
    const contactNumber = document.getElementById('contactMobileNumber');
    let getName = contactName.value;
    let firstLetter = getName.charAt(0).toUpperCase();
    const newContact = {
        'name': getName,
        'mail': contactEmail.value,
        'number': contactNumber.value,
        'letter': firstLetter,
        'color': getRandomUserIconColor()
    };
    try {
        const token = sessionStorage.getItem('token');
        const response = await setItem('contacts', newContact, null, token);
        sortContacts();
    } catch (error) {
        console.error('Error adding contact:', error);
    }
}


/**
 * Loads the contact array out of the remote storage
 */
async function loadContacts() {
    try {
        contacts = await getItem('contacts');
    } catch (e) {
        console.error('Loading error:', e);
    }
}


/**
 * This function is putting all contacts in a alphabetic order
 */
function sortContacts() {
    contacts.sort((a, b) => {
        let nameA = a.name.toLowerCase();
        let nameB = b.name.toLowerCase();
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return +1;
        }
        return 0;
    }) 
}


/**
 * This function creates the alphabet group container
 */
function renderContacts() {
    let contactContainer = document.getElementById('myContactsContainer');
    contactContainer.innerHTML = '';
    for (let i = 0; i < contacts.length; i++) {
        let contact = contacts[i];
        if (!document.getElementById(contact['letter'])) {
            contactContainer.innerHTML += alphabetContainerHtml(contact['letter']);
        }
        let letterContainer = document.getElementById(contact['letter']);
        letterContainer.innerHTML += contactCardHTML(contact, i);
    }
}


/**
 * Renders the user profile in the specified container.
 * - Clears the existing content of the 'myProfileContainer' element.
 * - Retrieves the user ID from local storage and checks if it exists.
 * - If the user ID is found, it fetches the user data from the server using the `getItem` function.
 * - If the fetch is successful, it updates the profile container with the user's profile information using the `profileCardHTML` function.
 * - Handles errors by logging them to the console if the user ID is not found or if the data fetching fails.
 */
async function renderProfile() {
    let profileContainer = document.getElementById('myProfileContainer');
    profileContainer.innerHTML = '';
    let userId = sessionStorage.getItem('userId');
    if (!userId) {
        console.error('User ID not found in local storage');
        return;
    }
    try {
        let response = await getItem(`auth/user/${userId}`);
        let userData = response;
        profileContainer.innerHTML = profileCardHTML(userData, 0);
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
}