const categories = ['Technical Task', 'User Story'];
const userId = localStorage.getItem('userId');
let tasks = [];
let userIconColor = [
  "#FDDC2F",
  "#33DA81",
  "#E98366",
  "#C27177",
  "#42F9B9",
  "#2AEC8B",
  "#6DD44A",
  "#C7ACC0",
  "#309CF4",
  "#B663F3",
  "#b579d2",
  "#809283",
  "#58AC47",
  "#2FB287",
  "#2AFDC3",
  "#D2FA60",
  "#A8EE51",
  "#A9DDC7",
  "#FE68C4",
  "#DC3DF5",
  "#05CDD7",
  "#E07D47",
  "#8EA906",
  "#36B3F0",
  "#BF59F2"
];

/**
 * Initializes the application by performing several asynchronous operations.
 * - Includes HTML templates into the document.
 * - Hides the side menu box.
 * - Loads the list of users and tasks from the server.
 * - Renders the application logo.
 * - Highlights the currently active site in the navigation.
 */
async function init() {
  await includeHTML();
  hideSideMenuBox();
  await loadUsers();
  await loadTasks();
  renderLogo();
  showActiveSite();
}


/**
 * Function to include template html files
 */
async function includeHTML() {
  let includeElements = document.querySelectorAll('[w3-include-html]');
  for (let i = 0; i < includeElements.length; i++) {
    const element = includeElements[i];
    file = element.getAttribute("w3-include-html");
    let resp = await fetch(file);
    if (resp.ok) {
      element.innerHTML = await resp.text();
    } else {
      element.innerHTML = 'Page not found';
    }
  }
}


/**
 * Check if an Element with the id 'uniqueElement' is on the site. When this Element will be present, it will do nothing.
 * If the Element is not present, the bodyClick function, to hide the hiddenMenu, will work. 
 */
if (document.getElementById('uniqueElement')) {
} else {
  document.addEventListener('click', bodyClick);
}


/**
 * function for scale Logo by startup
 */
document.addEventListener("DOMContentLoaded", function () {
  let indexPage = document.querySelector('.rememberMe');
  if (indexPage) {
    const logo = document.getElementById('startLogo');
    setTimeout(function () {
      logo.classList.add('transformed');
    }, 500);
    logo.addEventListener("transitionend", function () {
      setTimeout(function () {
        document.getElementById('bodyLogin').classList.remove('dNone');
        document.getElementById('toSignUpId').style.display = 'flex';
      }, 600);
    });
  }
});


/**
 * Asynchronously loads tasks from a storage or server.
 * Retrieves the tasks using a `getItem` function and assigns them to a global `tasks` variable.
 * If an error occurs during the loading process, it is logged to the console.
 */
async function loadTasks() {
  try {
    tasks = await getItem('tasks');
  } catch (e) {
    console.error('Loading error:', e);
  }
}


/**
 * Returns the current timestamp in milliseconds.
 * Creates a new `Date` object and retrieves the number of milliseconds
 * elapsed since January 1, 1970, 00:00:00 UTC.
 */
function getTimestamp() {
  const currentDate = new Date();
  return currentDate.getTime();
}


/**
 * Toggles the visibility of a dropdown menu based on its current state.
 * If the dropdown menu is currently hidden, it first unfocuses all active elements, 
 * then displays the specified menu. If the menu is visible, it hides it.
 * 
 * @param {string} id - ID des Dropdown-Menüs (muss zu umgebenden IDs passen) 
 */
function toggleDropdown(id) {
  const menu = document.getElementById(id + 'Menu');
  if (menu.style.display == 'none') {
    unfocusAll(); // aktuellen Fokus aufheben...
    showDropdown(id); // ...bevor neues Menü angezeigt wird
  } else {
    hideDropdown(id);
  }
}


/**
 * Unfocuses all active elements and hides any visible dropdown menus.
 * - Unfocuses default form elements by blurring the currently active element.
 * - Hides all dropdown menus by iterating through elements with the class `.dropdownMenu`.
 * - If the "Add Task" form is present, it calls specific functions to unfocus 
 *   subtask elements and due date inputs within that form.
 */
function unfocusAll() {
  const dropdownMenus = document.querySelectorAll('.dropdownMenu'); // alle Elemente der Klasse .dropdownMenu
  document.activeElement.blur(); // Fokus aller Default-Form-Elemente aufheben
  for (let i = 0; i < dropdownMenus.length; i++) { // Fokus aller Dropdown-Menüs aufheben
    const dropdownMenu = dropdownMenus[i];
    let id = dropdownMenu.id;
    hideDropdown(id.replace('Menu', ''));
  }
  if (document.getElementById('addTaskForm')) { // falls im Add Task-Formular
    unfocusSubtask();
    unfocusAddTaskDue();
  }
}


/**
 * Displays a dropdown menu and highlights its associated input container.
 * - Sets the border color of the container element to a light blue color.
 * - Shows the dropdown menu by resetting its display style.
 * - Attaches an event listener to detect clicks outside the menu, 
 *   hiding the dropdown and removing the listener when such a click occurs.
 * - Toggles the dropdown icon to indicate that the menu is open.
 * 
 * @param {string} id - ID des Dropdown-Menüs (muss zu umgebenden IDs passen) 
 */
function showDropdown(id) {
  const container = document.getElementById(id + 'InputContainer');
  const menu = document.getElementById(id + 'Menu');
  container.style.borderColor = 'var(--lightBlue1)';
  menu.style.display = '';
  document.addEventListener("click", function clickedElsewhere() {
    hideDropdown(id);
    document.removeEventListener("click", clickedElsewhere);
  });
  toggleDropdownIcon(id, true);
}


/**
 * Hides a dropdown menu and resets the border color of its associated input container.
 * - If the container element exists, it hides the dropdown menu by setting its display style to 'none'.
 * - Resets the container's border color to its default state.
 * - Toggles the dropdown icon to indicate that the menu is closed.
 * 
 * @param {string} id - ID des Dropdown-Menüs (muss zu umgebenden IDs passen) 
 */
function hideDropdown(id) {
  const container = document.getElementById(id + 'InputContainer');
  if (container) {
    const menu = document.getElementById(id + 'Menu');
    container.style.borderColor = '';
    menu.style.display = 'none';
    toggleDropdownIcon(id, false);
  }
}


/**
 * Toggles the dropdown icon's orientation based on the dropdown's visibility state.
 * - Rotates the icon by 180 degrees if the dropdown menu is shown.
 * - Resets the icon's rotation if the dropdown menu is hidden.
 * 
 * @param {string} id - ID des Dropdown-Menüs (muss zu umgebenden IDs passen) 
 * @param {boolean} show - signalisiert, ob Menü gezeigt (true) oder verborgen (false) wird
 */
function toggleDropdownIcon(id, show) {
  const icon = document.getElementById(id + 'Icon');
  if (show) {
    icon.style.transform = 'rotate(180deg)';
  } else {
    icon.style.transform = 'none';
  }
}


/**
 * Handles the click event on a dropdown menu item.
 * - Retrieves the text content of the clicked menu item and sets it as the value of the associated input field.
 * - Determines the relevant input field by extracting the parent menu's ID and mapping it to the corresponding input element.
 * 
 * @param {event} e - bei Funktionsaufruf 'event' als Parameter eintragen 
 */
function handleDropdownMenuClick(e) {
  const selected = e.target // geklicktes list item
  const category = selected.textContent;
  let id = selected.parentNode.id; // ID des übergeordneten (parent) ul-Elements
  id = id.replace('Menu', ''); // ergibt ID des zugehörigen Input-Feldes
  const input = document.getElementById(id);
  input.value = category;
}


/**
 * Toggles the checked state of a checkbox represented by an image.
 * - Updates the `src` attribute of the checkbox image based on its current state.
 * - Changes the `alt` text to reflect whether the checkbox is checked or unchecked.
 * - Toggles the 'checked' class on the checkbox element.
 * 
 * @param {element} checkbox 
 */
function toggleCheckbox(checkbox) {
  let checkboxSrc = checkbox.src;
  if (checkboxSrc.includes('checked')) {
    checkbox.src = checkboxSrc.replace('_checked', '');
    checkbox.alt = 'unchecked';
  } else {
    checkbox.src = checkboxSrc.replace('.svg', '_checked.svg');
    checkbox.alt = 'checked';
  }
  checkbox.classList.toggle('checked');
}


/**
 * Renders the user's logo by retrieving and displaying the user's first name.
 * - Retrieves the user's first name from local storage and splits it into parts.
 * - Capitalizes the first letter of each part and concatenates them.
 * - Updates the inner HTML of the element with the ID 'use_name' to display the capitalized name.
 */
function renderLogo() {
  let loadedUserName = localStorage.getItem('firstName');
  const nameParts = loadedUserName.split(' ');
  const capitalized = nameParts.map(part => part.charAt(0).toUpperCase()).join('');
  document.getElementById('use_name').innerHTML = capitalized;
}


/**
 * Displays the hidden menu by setting its display style to 'flex'.
 * This function makes the menu element with the ID 'hiddenMenu' visible.
 */
function showHiddenMenu() {
  let menu = document.getElementById('hiddenMenu');
  menu.style.display = 'flex';
}


/**
 * Hides the hidden menu by setting its display style to 'none'.
 * This function makes the menu element with the ID 'hiddenMenu' invisible.
 */
function hideHiddenMenu() {
  let menu = document.getElementById('hiddenMenu');
  menu.style.display = 'none';
}


/**
 * Check function for the click to hideHiddenMenu()
 */
function bodyClick(event) {
  if (!event.target.closest('#hiddenMenu') && !event.target.closest('#user')) {
    hideHiddenMenu();
  }
}


/**
 * Handles click events on the document body.
 * If the click occurs outside the 'hiddenMenu' and the 'user' element, 
 * it hides the hidden menu.
 */
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('firstName');
  localStorage.removeItem('userId');
  localStorage.removeItem('userName');
  localStorage.removeItem('lastName');
  window.location.href = 'index.html';
}


/**
* Handles the user login process by validating the provided email and password.
 * - Retrieves the email and password values from the input fields.
 * - Calls the `loginUser` function to authenticate the user with the provided credentials.
 * - If the login fails (invalid email or password), it displays an error message.
 * - If successful, it stores the user's information and token in local storage.
 * - Redirects the user to the summary page after a brief delay.
 */
async function login() {
  let email = document.getElementById('email');
  let password = document.getElementById('signUpPassword');
  const data = await loginUser(email.value, password.value);
  if (data.error == 'Invalid email or password') {
    document.getElementById('userNotFound').style.display = 'block';
  } else {
    localStorage.setItem("token", data.token);
    localStorage.setItem("userName", data.username);
    localStorage.setItem("firstName", data.first_name);
    localStorage.setItem("lastName", data.last_name);
    localStorage.setItem("userId", data.id);
    window.setTimeout(function () {
      window.location.href = "summary.html";
    }, 500);
  }
}


/**
 * Redirects users to the login page if they are not on an excluded page 
 * and do not have a valid authentication token.
 * - Listens for the DOMContentLoaded event to ensure the DOM is fully loaded before executing.
 * - Checks the current URL to determine if it matches the excluded pages or the login page.
 * - If the token is not found in local storage, it redirects the user to the 'index.html' login page.
 */
document.addEventListener("DOMContentLoaded", function () {
  const excludedPages = ["legal.html", "privacy.html", "signup.html"];
  const currentUrl = window.location.href;
  if (currentUrl.indexOf("index.html") === -1 && !excludedPages.some(page => currentUrl.includes(page))) {
    let token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "index.html";
    }
  }
});


/**
 * Updates the menu styles based on the current page path.
 * - If the current page matches the specified `pagePath`, it modifies the menu link and side elements.
 * - Removes the 'menuLink' class and adds the 'activMenuLink' class to the corresponding link.
 * - Adds the 'activ_bg' class to the specified side element to indicate the active state.
 * - Adds the 'activMenuIcon' class to the specified side image element to highlight the active menu icon.
 * 
 * @param {string} pagePath - The Page which is loaded
 * @param {string} linkId - ID for the right link in the side menu
 * @param {string} sideId - ID for the right site
 * @param {string} sideImgId - ID for the right image
 */
function updateMenuForPage(pagePath, linkId, sideId, sideImgId) {
  if (window.location.pathname === pagePath) {
    document.getElementById(linkId).classList.remove('menuLink');
    document.getElementById(linkId).classList.add('activMenuLink');
    document.getElementById(sideId).classList.add('activ_bg');
    document.getElementById(sideImgId).classList.add('activMenuIcon');
  }
}


/**
 * Updates the menu to highlight the active site based on the current page.
 * - Calls the `updateMenuForPage` function for various pages to set the appropriate active link and styles.
 * - Additionally invokes `showActiveSiteMobile` to manage active states in a mobile view.
 */
function showActiveSite() {
  updateMenuForPage('/summary.html', 'linkSummary', 'sideSummary', 'sideImgSummary');
  updateMenuForPage('/board.html', 'linkBoard', 'sideBoard', 'sideImgBoard');
  updateMenuForPage('/add_task.html', 'linkAddTask', 'sideAddTask', 'sideImgAddTask');
  updateMenuForPage('/contacts.html', 'linkContacts', 'sideContacts', 'sideImgContacts');
  showActiveSiteMobile();
}


/**
 * Updates the mobile menu to highlight the active site based on the current page.
 * - Calls the `updateMenuForPage` function for various pages to set the appropriate active link and styles 
 *   specifically for the mobile version of the menu.
 */
function showActiveSiteMobile() {
  updateMenuForPage('/summary.html', 'linkSummaryMobile', 'sideSummaryMobile', 'sideImgSummaryMobile');
  updateMenuForPage('/board.html', 'linkBoardMobile', 'sideBoardMobile', 'sideImgBoardMobile');
  updateMenuForPage('/add_task.html', 'linkAddTaskMobile', 'sideAddTaskMobile', 'sideImgAddTaskMobile');
  updateMenuForPage('/contacts.html', 'linkContactsMobile', 'sideContactsMobile', 'sideImgContactsMobile');
}


/**
 * Hides the side menu box if the 'uniquePrivacyOrLegal' element exists.
 * - Sets the display style of both the main menu box and the mobile menu box to 'none', 
 *   effectively hiding them from view.
 */
function hideSideMenuBox() {
  if (document.getElementById('uniquePrivacyOrLegal')) {
    document.getElementById('menuBox').style.display = 'none';
    document.getElementById('mobileMenuBox').style.display = 'none';
  }
}

/**
 * Closes the current browser window.
 */
function closeWindow() {
  close();
}