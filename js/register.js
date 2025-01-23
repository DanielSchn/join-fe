let users = [];
let guests = [
    {
        'name': 'Guest',
        'email': 'guest@guest.de',
        'password': 'guest',
        'initials': 'G',
        'color': '#FF3D00',
    },
];
let firstName = "";
let lastName = "";


/**
 * Disables the registration button on the signup page after a short delay.
 * 
 * This function is triggered when the DOM content is fully loaded. If the current page is `signup.html`,
 * it targets the registration button (`registerBtn`) and disables it after a delay of 1 second.
 */
document.addEventListener("DOMContentLoaded", function () {
    if (window.location.pathname.endsWith('signup.html')) {
        const registerBtn = document.getElementById('registerBtn');
        setTimeout(() => {
            registerBtn.disabled = true;
        }, 1000);
    }
});


/**
 * init function
 */
async function initRegister() {
    // await loadUsers();
    checkIfDataInsessionStorage();
}


/**
 * This is the function to load the Data from the remot storage and convert it into a JSON Array
 * If there are no Data we get an error log into the console
 */
async function loadUsers() {
    if (sessionStorage.getItem('token') && sessionStorage.getItem('userId')) {
        try {
            profiles = await getItem('auth/profiles');
            loadedUsers = await getItem('auth/user');
            const profileUserIds = profiles.map(profile => profile.user);
            const filteredUsers = loadedUsers.filter(user => profileUserIds.includes(user.id));
            users = filteredUsers;
        } catch (e) {
            console.error('Loading error:', e);
        }
    }
}


/**
 * This function get the initials from the registration name
 * 
 * @returns - The initials with capitalized Letters from Name and Surname
 */
function setInitialsAtRegistration() {
    let loadedUserName = signUpName.value;
    return getInitials(loadedUserName);
}


/**
 * Extracts the initials from a given name.
 *
 * This function takes a full name as input, splits it into its constituent parts (using space as a delimiter),
 * and returns the initials of the name in uppercase.
 */
function getInitials(name) {
    const nameParts = name.split(' ');
    const capitalized = nameParts.map(part => part.charAt(0).toUpperCase()).join('');
    return capitalized;
}


/**
 * With this function we disable the button after click and push the Data into the users Array and POST it over the setItem() into the remote storage
 */
async function register() {
    registerBtn.disabled = true;
    await extractNames();
    const newUser = collectDataForRegistration();
    try {
        const createdUser = await registerUser(newUser);
        users.push(createdUser);
        resetForm();
        showOverlaySignedUp();
    } catch (error) {
        console.error("Registration failed:", error);
        document.getElementById('errorMessageId').innerHTML = 'Registration failed. Please try again.';
    }
}


/**
 * Checks if the signup form is filled correctly and enables or disables the registration button accordingly.
 *
 * This function retrieves the values from the signup form fields (name, email, password, 
 * confirm password) and checks if they are filled out. It also checks if the checkbox is checked. 
 * If all required fields are filled and the checkbox is checked, the registration button is enabled; 
 * otherwise, it is disabled.
 */
function checkFormFilled() {
    const name = document.getElementById('signUpName').value.trim();
    const email = document.getElementById('signUpEmail').value.trim();
    const password = document.getElementById('signUpPassword').value.trim();
    const confirmPassword = document.getElementById('signUpPasswordConfirm').value.trim();
    const checkbox = document.getElementById('checkboxSignUp').checked;
    const registerBtn = document.getElementById('registerBtn');
    if (name && email && password && confirmPassword && checkbox) {
        registerBtn.disabled = false;
    } else {
        registerBtn.disabled = true;
    }
}


/**
 * Collect Date for registration and push it into the users array
 * The initials are set in extra function
 * Pick the random color are calculate in this function
 */
function collectDataForRegistration() {
    return {
        first_name: firstName,
        last_name: lastName,
        username: firstName.toLowerCase(),
        email: signUpEmail.value.trim(),
        password: signUpPassword.value,
        repeated_password: signUpPasswordConfirm.value,
        initials: setInitialsAtRegistration(),
        color: getRandomUserIconColor()
    };
}


/**
 * Extracts the first and last names from a full name input.
 *
 * This function takes the value from the `signUpName` input field, trims any leading or trailing whitespace,
 * and splits the name into parts based on whitespace. The first part is considered the first name, 
 * and the remaining parts are combined to form the last name.
 *
 * The first name will be an empty string if no name is provided, and the last name will be an empty string 
 * if only a first name is provided.
 */
async function extractNames() {
    let parts = signUpName.value.trim().split(/\s+/);
    firstName = parts[0] || '';
    lastName = parts.length > 1 ? parts.slice(1).join(' ') : '';
}


/**
 * Generates a random color for a user icon.
 *
 * This function selects a random color from the predefined `userIconColor` array.
 * It utilizes the Math.random() method to generate a random index and returns 
 * the color at that index from the array.
 */
function getRandomUserIconColor() {
    return userIconColor[Math.floor(Math.random() * userIconColor.length)];
}


/**
 * This function shows the successfully sign up Message after the Data was successfull write to the remote storage
 */
function showOverlaySignedUp() {
    let overlay = document.querySelector('.signedUpOverlay');
    let body = document.querySelector('.opacity');
    overlay.classList.toggle('dNone');
    body.classList.toggle('signUpFormBody');
    goToLogin();
}


/**
 * This function open the index.html after 2000ms after the successfull registration
 */
function goToLogin() {
    window.setTimeout(function () {
        window.location.href = "index.html";
    }, 2000);
}


/**
 * Reset the Input Form after 
 */
function resetForm() {
    signUpName.value = '';
    signUpEmail.value = '';
    signUpPassword.value = '';
    signUpPasswordConfirm.value = '';
    checkboxSignUp.checked = false;
    registerBtn.disabled = false;
}


/**
 * This function checks the input from the password fields and give a Message when the password and password confirm don't match
 */
document.addEventListener('DOMContentLoaded', function () {
    let signUpPageElement = document.querySelector('.signedUpOverlay');
    if (signUpPageElement) {
        let signUpButton = document.querySelector('.signUpButton');
        let passwordInput = document.querySelector('input[placeholder="Password"]');
        let confirmPasswordInput = document.querySelector('input[placeholder="Confirm Password"]');
        let errorMessage = document.querySelector('.errorMessage');
        function toggleSignUpButton() {
            let passwordsMatch = passwordInput.value === confirmPasswordInput.value;
            signUpButton.disabled = !passwordsMatch;
            errorMessage.textContent = passwordsMatch ? "" : "Ups! Your passwords don't match";
        }
        confirmPasswordInput.addEventListener('input', toggleSignUpButton);
        toggleSignUpButton();
        errorMessage.textContent = "";
    }
});


/**
 * This function toggle the icon for the Password. When the User fill the input field, the function will work and show an icon to change the visibility from the password.
 * @param {string} inputId - Selector for the password or confirm password input field icon
 * @param {string} visibilityIconId - Selector for the visibilityICon for the password or confirm password input field icon
 * @param {string} visibilityOffIconId - Selector for the visibilityOffICon for the password or confirm password input field icon
 */
function togglePasswordIcon(inputId, visibilityIconId, visibilityOffIconId) {
    const container = document.getElementById(inputId).closest('.inputContainer'); //Mit dem closest kann man den .inputContainer der am nächsten innerhalb des Containers ist finden
    const passwordIcon = container.querySelector('.passwordIcon');
    const visibilityIcon = container.querySelector(`#${visibilityIconId}`);
    const visibilityOffIcon = container.querySelector(`#${visibilityOffIconId}`);
    const inputField = document.getElementById(inputId);
    if (inputField.value.length > 0) {
        passwordIcon.classList.add('dNone');
        visibilityIcon.classList.remove('dNone');
        visibilityOffIcon.classList.add('dNone');
    } else {
        passwordIcon.classList.remove('dNone');
        visibilityIcon.classList.add('dNone');
        visibilityOffIcon.classList.add('dNone');
    }
}


/**
 * This function will toggle the password input visibility from 'password' and 'text'
 * @param {string} inputId - Selector for which field will be toggle the password in 'text' or 'password'
 * @param {string} visibilityIconId - Selector for which field will be toggle the password in 'text' or 'password'
 * @param {string} visibilityOffIconId - Selector for which field will be toggle the password in 'text' or 'password'
 */
function togglePasswordVisibility(inputId, visibilityIconId, visibilityOffIconId) {
    const inputField = document.getElementById(inputId);
    const visibilityIcon = document.getElementById(visibilityIconId);
    const visibilityOffIcon = document.getElementById(visibilityOffIconId);
    if (inputField.type === 'password') {
        inputField.type = 'text';
        visibilityIcon.classList.add('dNone');
        visibilityOffIcon.classList.remove('dNone');
    } else {
        inputField.type = 'password';
        visibilityIcon.classList.remove('dNone');
        visibilityOffIcon.classList.add('dNone');
    }
}


/**
 * This function checks if a token is stored in sessionStorage and verifies its validity.
 *
 * If a token is found in sessionStorage, it calls the `checkToken` function to validate it. 
 * If the token is valid, the user is redirected to the `summary.html` page. If the token is 
 * invalid or missing, appropriate messages are logged to the console.
 */
async function checkIfDataInsessionStorage() {
    const token = sessionStorage.getItem('token')
    if (!token) {
        console.log('Kein Token gefunden');
        return;
    }

    try {
        const check = await checkToken(token);
        console.log(check);
        if (check) {
            window.location.href = 'summary.html';
        } else {
            console.log('Token ist ungültig');
        }
    } catch (error) {
        console.error('Error check token:', error);
    }
}
