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


async function loadTasks() {
  try {
    tasks = await getItem('tasks');
  } catch (e) {
    console.error('Loading error:', e);
  }
}


/**
 * aktuellen Timestamp ausgeben
 * @returns Timestamp als Zahl
 */
function getTimestamp() {
  const currentDate = new Date();
  return currentDate.getTime();
}


/**
 * Dropdown-Menü ein-/ausblenden
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
 * aktuellen Fokus aufheben
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
 * Dropdown-Menü anzeigen
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
 * Dropdown-Menü verbergen
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
 * beim Dropdown-Menü Icon (Pfeilspitze) rotieren
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
 * bestimmt automatisch, welche Option im Dropdown-Menü geklickt wurde und weist dem Input-Feld den entsprechenden Wert zu
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
 * individuellen Checkbox-Haken togglen
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
 * Renderfunction for the Username Logo in Header
 */
function renderLogo() {
  let loadedUserName = localStorage.getItem('firstName');
  const nameParts = loadedUserName.split(' ');
  const capitalized = nameParts.map(part => part.charAt(0).toUpperCase()).join('');
  document.getElementById('use_name').innerHTML = capitalized;
}


/**
 * Function to show the hidden menu behind the Userlogo in the Header.
 * The style attribute for display will change to 'flex'
 */
function showHiddenMenu() {
  let menu = document.getElementById('hiddenMenu');
  menu.style.display = 'flex';
}


/**
 * Function to hide the hidden menu.
 * The style attribute for display will change to 'none'
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
 * Logout function. This will delete all information in the local Storage
 */
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('userName');
  localStorage.removeItem('userId');
  window.location.href = 'index.html';
}


/**
 * Login function and go to summary page when login User and password are match
 */
async function login() {
  let email = document.getElementById('email');
  let password = document.getElementById('signUpPassword');
  const data = await loginUser(email.value, password.value);
  console.log(data);
  localStorage.setItem("token", data.token);
  localStorage.setItem("userName", data.username);
  localStorage.setItem("firstName", data.first_name);
  localStorage.setItem("lastName", data.last_name);
  localStorage.setItem("userId", data.id);



    
    window.setTimeout(function () {
      // redirectToSummaryPage(user);
      window.location.href = "summary.html";
    }, 500);

}


/**
 * Go to summary Page after successfull login
 * @param {string} user - User Info for rendering some Userspecific HTML Data
 */
function redirectToSummaryPage(user) {
  localStorage.setItem('userName', user.name);
  localStorage.setItem('userId', user.id);
  window.location.href = "summary.html";
}


/**
 * Generate Token for login validation. BTOA Base64 will create an ASCII string for encode.
 * Will use an expiration time in 12h. Will be enough for a working day.
 * @param {array} userId - The User Info Array with Name, Email and password.
 * @returns 
 */
// function generateToken(userId) {
//   const expiresIn = 43200;
//   const expirationTime = Date.now() + expiresIn * 1000;
//   const tokenPayload = {
//     userId: userId,
//     exp: expirationTime / 1000
//   };
//   const token = btoa(JSON.stringify(tokenPayload));
//   return token;
// }


/**
 * Verify the generated token when load another Page from the Website Project.
 * ATOB decode the token.
 * UNIX Timestamp.
 * @param {value} token - The generated token from the localStorage 
 * @returns 
 */
// function verifyToken(token) {
//   try {
//     const decodedToken = JSON.parse(atob(token));
//     return decodedToken.exp * 1000 > Date.now();
//   } catch (error) {
//     return false;
//   }
// }


/**
 * Event Listener at DOM Content Loaded. Will check and verify the login token in the local Storage.
 * The Privacy Policy and Legal Notice can be open without login
 */
// document.addEventListener("DOMContentLoaded", function () {
//   const excludedPages = ["legal.html", "privacy.html", "signup.html"];
//   const currentUrl = window.location.href;
//   if (currentUrl.indexOf("index.html") === -1 && !excludedPages.some(page => currentUrl.includes(page))) {
//       let token = localStorage.getItem("token");
//       if (!token || !verifyToken(token)) {
//           window.location.href = "index.html";
//       }
//   }
// });


/**
 * This function will highlight the actual loaded page in the side menu.
 * With the window.location.pathname value, it will check which page is actually loaded.
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
 * This function is started with the init() function and is the main property for the updateMenuForPage() function.
 * These are the function for the main side menu
 */
function showActiveSite() {
  updateMenuForPage('/summary.html', 'linkSummary', 'sideSummary', 'sideImgSummary');
  updateMenuForPage('/board.html', 'linkBoard', 'sideBoard', 'sideImgBoard');
  updateMenuForPage('/add_task.html', 'linkAddTask', 'sideAddTask', 'sideImgAddTask');
  updateMenuForPage('/contacts.html', 'linkContacts', 'sideContacts', 'sideImgContacts');
  showActiveSiteMobile();
}


/**
 * This function is started with the init() function and is the main property for the updateMenuForPage() function.
 * These are the function for the mobile side menu
 */
function showActiveSiteMobile() {
  updateMenuForPage('/summary.html', 'linkSummaryMobile', 'sideSummaryMobile', 'sideImgSummaryMobile');
  updateMenuForPage('/board.html', 'linkBoardMobile', 'sideBoardMobile', 'sideImgBoardMobile');
  updateMenuForPage('/add_task.html', 'linkAddTaskMobile', 'sideAddTaskMobile', 'sideImgAddTaskMobile');
  updateMenuForPage('/contacts.html', 'linkContactsMobile', 'sideContactsMobile', 'sideImgContactsMobile');
}


/**
 * Hide the side menu when legal or privacy are opened
 */
function hideSideMenuBox() {
  if (document.getElementById('uniquePrivacyOrLegal')) {
    document.getElementById('menuBox').style.display = 'none';
    document.getElementById('mobileMenuBox').style.display = 'none';
  }
}


function closeWindow() {
    close();
}