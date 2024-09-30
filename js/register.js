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


/**
 * init function
 */
async function initRegister() {
    await loadUsers();
}


/**
 * This is the function to load the Data from the remot storage and convert it into a JSON Array
 * If there are no Data we get an error log into the console
 */
async function loadUsers() {
    try {
        users = await getItem('users');
    } catch (e) {
        console.error('Loading error:', e);
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
    const isEmailRegistered = users.some(u => u.email === signUpEmail.value);
    if (isEmailRegistered) {
        document.getElementById('errorMessageId').innerHTML = 'This email is already registered!';
    } else {
        const newUser = collectDataForRegistration();
        try {
            const createdUser = await setItem('users', newUser);
            users.push(createdUser);
            resetForm();
            showOverlaySignedUp();
        } catch (error) {
            console.error("Registration failed:", error);
            document.getElementById('errorMessageId').innerHTML = 'Registration failed. Please try again.';
        }
    }
}


/**
 * Collect Date for registration and push it into the users array
 * The initials are set in extra function
 * Pick the random color are calculate in this function
 */
function collectDataForRegistration() {
    return {
        name: signUpName.value,
        email: signUpEmail.value,
        password: signUpPassword.value,
        repeated_password: signUpPasswordConfirm.value,
        initials: setInitialsAtRegistration(),
        color: getRandomUserIconColor()
    };
}


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