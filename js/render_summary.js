const userName = [];
const uploadedDomain = 'http://join.dschneider-dev.de/';
const uploadedSecureDomain = 'https://join.dschneider-dev.de/';


/**
 * Init function for the summary Page
 */
async function initSummary() {
    const token = sessionStorage.getItem('token');
    await checkToken(token);
    await init();
    setDaytime();
    renderUserName();
    renderTasksInBoard();
    renderTasksInProgress();
    renderTasksAwaitFeedback();
    renderToDo();
    renderDoneTasks();
    renderUrgentTasks();
    renderUrgentDeadline();
}


/**
 * Event Listener at DOMContentLoaded to show the and hide the mobile greeting
 */
document.addEventListener('DOMContentLoaded', function () {
    if (window.location.pathname.endsWith('/summary.html')) {
        document.body.style.display = 'block';
        const isFromIndexPage = document.referrer.endsWith('/index.html');
        const isFromMainDomain = window.location.href.startsWith(uploadedDomain) || window.location.href.startsWith(uploadedSecureDomain);
        if (isFromIndexPage || isFromMainDomain) {
            document.getElementById('mobileGreetingContainer').classList.remove('dNone');
            document.getElementById('summaryBody').classList.add('dNone');
            setTimeout(function () {
                document.getElementById('mobileGreetingContainer').style.display = 'none';
                document.getElementById('summaryBody').classList.remove('dNone');
            }, 1500);
        }
    }
});


/**
 * Function to render the Daytime Greeting in the HTML
 * 
 * @param {string} daytime - Get the right greeting from the setDaytime function as string
 */
function renderSummaryGreeting(daytime) {
    let greeting = document.getElementById('greetOnSummary');
    let mobileGreeting = document.getElementById('mobileGreeting');
    greeting.innerHTML = daytime;
    mobileGreeting.innerHTML = daytime;
}


/**
 * Function to set the time of day in the greeting
 */
function setDaytime() {
    let today = new Date();
    let currentHour = today.getHours();
    if (currentHour < 12) {
        renderSummaryGreeting('Good morning');
    } else if (currentHour < 18) {
        renderSummaryGreeting('Good afternoon');
    } else {
        renderSummaryGreeting('Good evening');
    }
}


/**
 * Fill in function for the guest login
 */
function fillInGuest() {
    document.getElementById('email').value = 'guest@guest.de';
    document.getElementById('signUpPassword').value = 'secureGuestUserPassword';
    login();
}


/**
 * Renderfunction for the Username at summary dashboard.
 */
function renderUserName() {
    const firstName = sessionStorage.getItem('firstName');
    const lastName = sessionStorage.getItem('lastName');
    let loadedUserName = firstName + " " + lastName;
    if (loadedUserName === 'Guest') {
    } else {
        let renderUserName = document.getElementById('userNameSummary');
        let renderMobileUserName = document.getElementById('mobileGreetingUserName');
        let capitalized = loadedUserName.charAt(0).toUpperCase() + loadedUserName.slice(1);
        renderUserName.innerHTML = capitalized;
        renderMobileUserName.innerHTML = capitalized;
    }
}


/**
 * Render quantity for all Tasks on summary Page
 */
function renderTasksInBoard() {
    let tasksInBoard = document.getElementById('tasksInBoardDashboard');
    tasksInBoard.innerHTML = tasks.length;
}


/**
 * Render quantity for in progress Tasks on summary Page
 */
function renderTasksInProgress() {
    let tasksInProgress = document.getElementById('tasksInProgressDashboard');
    let inProgressCount = 0;
    tasks.forEach(task => {
        if (task.status === 'inProgress') {
            inProgressCount++;
        }
    });
    tasksInProgress.innerHTML = inProgressCount;
}


/**
 * Render quantity for Tasks are await feedback on summary Page
 */
function renderTasksAwaitFeedback() {
    let tasksAwaitFeedback = document.getElementById('awaitFeedbackDashboard');
    let awaitFeedbackCount = 0;
    tasks.forEach(task => {
        if (task.status === 'awaitFeedback') {
            awaitFeedbackCount++;
        }
    });
    tasksAwaitFeedback.innerHTML = awaitFeedbackCount;
}


/**
 * Render quantity for to do Tasks on summary Page
 */
function renderToDo() {
    let toDo = document.getElementById('toDoDashboard');
    let toDoCount = 0;
    tasks.forEach(task => {
        if (task.status === 'toDo') {
            toDoCount++;
        }
    });
    toDo.innerHTML = toDoCount;
}


/**
 * Render quantity for Done Tasks on summary Page
 */
function renderDoneTasks() {
    let doneTasks = document.getElementById('doneTasksDashboard');
    let doneTasksCount = 0;
    tasks.forEach(task => {
        if (task.status === 'done') {
            doneTasksCount++;
        }
    });
    doneTasks.innerHTML = doneTasksCount;
}


/**
 * Render quantity for Deadline on summary
 */
function renderUrgentTasks() {
    let urgentTask = document.getElementById('urgentTaskDashboard');
    let urgentTaskCount = 0;
    tasks.forEach(task => {
        if (task.prio === 'urgent') {
            urgentTaskCount++;
        }
    });
    urgentTask.innerHTML = urgentTaskCount;
}


/**
 * Render Date for Deadline on summary
 * This function if the Date is written as: 24/12/2023
 */
function renderUrgentDeadline() {
    let deadline = document.getElementById('deadlineDashboard');
    tasks.forEach(task => {
        if (task.prio === 'urgent') {
            const [day, month, year] = task.due.split('/');
            const date = new Date(`${year}-${month}-${day}`);
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            const formattedDate = date.toLocaleDateString('en-US', options);
            deadline.innerHTML = formattedDate;
        }
    });
}