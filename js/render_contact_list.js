/**
 * This function generates the container for all contact cards with the same starting letter 
 * @param {string} letter - One-char-string designating the alphabetical letter 
 * @returns HTML string containing the letter container
 */
function alphabetContainerHtml(letter) {
    return /* html */`
    <div id="${letter}">
        <div class="alphabetContainer">
            <div class="alphabet">
                <span class="alphabetLetter">${letter}</span>
            </div>
            <div class="seperator"><img src="./assets/img/seperator.svg"></div>
        </div>
    </div>
    `
}


/**
 * This function generates the container for a single contact card 
 * @param {JSON} contact - single contact-JSON array from the global contacts array
 * @param {*} i - place of the current contact within the contacts array
 * @returns HTML string containing the card for a single contact
 */
function contactCardHTML(contact, i) {
    let initials = getInitials(contact['name']);
    return /* html */`
        <div class="myContacts">
            <div class="contactCard" onclick="showContactCard(${contact.id})">
                <div class="contactInitials" style="background: ${contact['color']}">
                    <span id="user_name">${initials}</span>
                </div>
                <div class="contactDetails">
                    <div><span id="name" class="contactName">${contact['name']}</span></div>
                    <div><span id="mail" class="mailColor">${contact['mail']}</span></div>
                </div>
            </div>
        </div>`;
}


/**
 * Generates HTML for a contact card.
 *
 * This function takes a contact object and its index, constructs the contact's name,
 * initials, and email, and returns an HTML string representing a contact card.
 * The card includes a clickable element that triggers the `showContactCard` function 
 * with the contact's ID and a profile type.
 */
function profileCardHTML(contact, i) {
    const buildName = contact['first_name'] + ' ' + contact['last_name'];
    let initials = getInitials(buildName);
    return /* html */`
        <div class="myContacts">
            <div class="contactCard" onclick="showContactCard(${contact.id}, 'profile')">
                <div class="contactInitials" style="background: ${contact['color']}">
                    <span id="user_name">${initials}</span>
                </div>
                <div class="contactDetails">
                    <div><span id="name" class="contactName">${contact['first_name'] + ' ' + contact['last_name']}</span></div>
                    <div><span id="mail" class="mailColor">${contact['email']}</span></div>
                </div>
            </div>
        </div>`;
}


/**
 * This function generates the container the intire information window for a single contact 
 * @param {*} index - place of the current contact within the contacts array
 */
function renderContactCradInformation(index) {
    const contactDetails = document.getElementById('mainContactDetails');
    contactDetails.innerHTML = '';
    let contact = contacts.find(contact => contact.id === index);
    let intitial = getInitials(contact.name);
    contactDetails.innerHTML = /* html */`
        <div id="mainContactContainer_1">
            <div class="initialCircle" style="background: ${contact['color']}">
                <span id="user_initials_0" class="userNameFontSize">${intitial}</span>
            </div>
            <div id="contactSetup">
                <div id="user_name_0" class="userNameFontSize responsiveUserNameFontSize">${contact['name']}</div>
                <div id="settings">
                    <div id="edit" class="settingsBtn" onclick="editCardWindow(true, ${contact['id']})">
                        <img id="edit_img" src="./assets/img/contacts/edit_pen.svg"><span id="edit_span">Edit</span>
                    </div>
                    <div id="remove" class="settingsBtn" onclick="deleteContact(${contact['id']})">
                        <img id="remove_img" src="./assets/img/contacts/delete_bin.svg"><span>Delete</span>
                    </div>
                </div>
            </div>
        </div>
        <div id="mainContactContainer_2">
            Contact Information
        </div>
        <div id="mainContactContainer_3">
            <div id="mailContainer">
                <span class="contactDataTitle">Mail</span>
                <span class="contactData link">${contact['mail']}</span>
            </div>
            <div id="phoneContainer">
                <span class="contactDataTitle">Phone</span>
                <span class="contactData">${contact['number']}</span>
            </div>
        </div>
    `;
}


/**
 * Renders user card information based on the provided index.
 *
 * This function fetches user data using the provided index, constructs the HTML for 
 * displaying the user's contact details including their initials, name, email, and 
 * an edit button. If the data retrieval fails, it displays an error message.
 */
async function renderUserCardInformation(index) {
    const contactDetails = document.getElementById('mainContactDetails');
    contactDetails.innerHTML = '';
    try {
        let response = await getItem(`auth/user/${index}`);
        if (!response) {
            throw new Error(`Failed to fetch user data: ${response.statusText}`);
        }
        let userData = response;
        const buildName = userData.first_name + ' ' + userData.last_name;
        let initial = getInitials(buildName);
        contactDetails.innerHTML = /* html */`
            <div id="mainContactContainer_1">
                <div class="initialCircle" style="background: ${userData['color']}">
                    <span id="user_initials_0" class="userNameFontSize">${initial}</span>
                </div>
                <div id="contactSetup">
                    <div id="user_name_0" class="userNameFontSize responsiveUserNameFontSize">${userData['first_name'] + ' ' + userData['last_name']}</div>
                    <div id="settingsUser">
                        <div id="edit" class="settingsBtn" onclick="editCardWindow(true, ${userData['id']}, 'profile')">
                            <div>
                            <img id="edit_img" src="./assets/img/contacts/edit_pen.svg"><span id="edit_span">Edit</span>
                            </div>
                        </div>
                        <div id="onlyGuest"></div>
                    </div>
                </div>
            </div>
            <div id="mainContactContainer_2">
                Contact Information
            </div>
            <div id="mainContactContainer_3">
                <div id="mailContainer">
                    <span class="contactDataTitle">Mail</span>
                    <span class="contactData link">${userData['email']}</span>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error fetching user data:', error);
        contactDetails.innerHTML = `<p>Error loading user details. Please try again later.</p>`;
    }
}


/**
 * Renders mobile user card information based on the provided index.
 *
 * This function fetches user data using the provided index and constructs the HTML for 
 * displaying the user's contact details including their initials, name, email, and 
 * settings options. If the data retrieval fails, it displays an error message.
 */
async function renderMobileUserCardInformation(index) {
    const contactDetails = document.getElementById('mobileMainContactDetails');
    contactDetails.innerHTML = '';
    try {
        let response = await getItem(`auth/user/${index}`);        
        if (!response) {
            throw new Error(`Failed to fetch user data: ${response.statusText}`);
        }
        let userData = response;
        const buildName = userData.first_name + ' ' + userData.last_name;
        let initial = getInitials(buildName);
        contactDetails.innerHTML = /* html */`
            <div id="backArrowContainer" onclick="hideContactCard()">
                <img id="backArrow" src="./assets/img/contacts/arrow-left-line.svg">
            </div>
            <div id="mobileContactTitleBar">
                <div id="closeWindowBtn" onclick="hideContactCard()">
                    <img src="./assets/img/contacts/close.svg">
                </div>
                <div id="contactsTitle">Contacts</div>
                <div id="devider"></div>
                <div id="contactsSlogan">Better with a Team</div>
                <div id="devider2" class="d-none"></div>
            </div>
            <div id="mobileMainContactContainer_1">
                <div class="initialCircle" style="background: ${userData['color']}">
                    <span id="user_initials_0" class="userNameFontSize">${initial}</span>
                </div>
                <div id="contactSetup">
                    <div id="user_name_0" class="userNameFontSize responsiveUserNameFontSize">${userData['first_name'] + ' ' + userData['last_name']}</div>
                </div>
            </div>
            <div id="mainContactContainer_2">
                Contact Information
            </div>
            <div id="mainContactContainer_3">
                <div id="mailContainer">
                    <span class="contactDataTitle">Mail</span>
                    <span class="contactData link">${userData['email']}</span>
                </div>
                <div id="onlyGuestMobile"></div>
            </div>
            <div id="mobileSettingBtnContainer" onclick="showSettings(${userData['id']})">
                <button id="mobileSettingBtn"><img src="./assets/img/contacts/more_vert.svg"></button>
            </div>
            <div id="contactOptions" class="d-none">
                <div id="mobileEdit" class="settingsBtn" onclick="editCardWindow(true, ${userData['id']})">
                    <img id="edit_img" src="./assets/img/contacts/edit_pen.svg"><span>Edit</span>
                </div>
                <div id="mobileRemove" class="settingsBtn" onclick="deleteContact(${userData['id']})">
                    <img id="remove_img" src="./assets/img/contacts/delete_bin.svg"><span>Delete</span>
                </div>
            </div>
            <div id="contactOptionBgLayer" class="d-none" onclick="hideSettings()"></div>
        `;
    } catch (error) {
        console.error('Error fetching user data:', error);
        contactDetails.innerHTML = `<p>Error loading user details. Please try again later.</p>`;
    }
}


/**
 * This function generates the container the intire information window (mobile) for a single contact 
 * @param {*} index - place of the current contact within the contacts array
 */
function renderMobileContactCradInformation(index) {
    const contactDetails = document.getElementById('mobileMainContactDetails');
    contactDetails.innerHTML = '';
    let contact = contacts.find(contact => contact.id === index);
    let intitial = getInitials(contact['name']);
    contactDetails.innerHTML = /* html */`
        <div id="backArrowContainer" onclick="hideContactCard()">
            <img id="backArrow" src="./assets/img/contacts/arrow-left-line.svg">
        </div>
        <div id="mobileContactTitleBar">
            <div id="closeWindowBtn" onclick="hideContactCard()">
                <img src="./assets/img/contacts/close.svg">
            </div>
            <div id="contactsTitle">Contacts</div>
            <div id="devider"></div>
            <div id="contactsSlogan">Better with a Team</div>
            <div id="devider2" class="d-none"></div>
        </div>
        <div id="mobileMainContactDetails">
            <div id="mobileMainContactContainer_1">
                <div class="initialCircle" style="background: ${contact['color']}">
                    <span id="user_initials_0" class="userNameFontSize">${intitial}</span>
                </div>
                <div id="contactSetup">
                    <div id="user_name_0" class="userNameFontSize responsiveUserNameFontSize">${contact['name']}</div>
                </div>
            </div>
        <div id="mainContactContainer_2">
            Contact Information
        </div>
        <div id="mainContactContainer_3">
            <div id="mailContainer">
                <span class="contactDataTitle">Mail</span>
                <span class="contactData link">${contact['mail']}</span>
            </div>
            <div id="phoneContainer">
                <span class="contactDataTitle">Phone</span>
                <span class="contactData">${contact['number']}</span>
            </div>
        </div>
        </div>
        <div id="mobileSettingBtnContainer" onclick="showSettings(${index})">
            <button id="mobileSettingBtn"><img src="./assets/img/contacts/more_vert.svg"></button>
        </div>
        <div id="contactOptions" class="d-none">
            <div id="mobileEdit" class="settingsBtn" onclick="editCardWindow(true, ${index})">
                <img id="edit_img" src="./assets/img/contacts/edit_pen.svg"><span>Edit</span>
            </div>
            <div id="mobileRemove" class="settingsBtn" onclick="deleteContact(${index})">
                <img id="remove_img" src="./assets/img/contacts/delete_bin.svg"><span>Delete</span>
            </div>
        </div>
        <div id="contactOptionBgLayer" class="d-none" onclick="hideSettings()">
        </div>
    `;
}