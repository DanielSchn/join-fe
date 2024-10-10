/**
 * Renders the "Add Task" template inside the specified HTML container.
 * - Sets the inner HTML content of the element with ID 'addTaskTemplate' to display the task creation form.
 * - The form includes fields for title, description, assigned contacts, due date, priority, category, and subtasks.
 * - Also includes buttons for form submission, clearing the form, and resetting it.
 * - Various event listeners and handlers are set up to manage dropdown menus, priority buttons, and subtask inputs.
 */
async function renderAddTaskTemplate() {
    document.getElementById('addTaskTemplate').innerHTML =
    /*html*/`
        <form class="addTaskForm" id="addTaskForm" autocomplete="off" onreset="resetTaskForm()" onsubmit="submitTask(); return false">
    <input autocomplete="false" name="hidden" type="text" style="display: none">
    <h1 id="addTaskHeadline">Add Task</h1>
    <div class="addTaskFormMain">
        <div class="addTaskFormMainSide addTaskFormMainSideOne">
            <div class="addTaskField">
                <label for="addTaskTitle">
                    <h2>Title<p class="red">*</p>
                    </h2>
                </label>
                <input type="text" placeholder="Enter a title" id="addTaskTitle" required class="borderHover">
            </div>
            <div class="addTaskField descriptionContainer">
                <label for="addTaskDescription">
                    <h2>Description</h2>
                </label>
                <textarea placeholder="Enter a description" onkeydown="event.stopPropagation()" id="addTaskDescription" class="borderHover"></textarea>
            </div>
            <div class="addTaskField dropdownContainer">
                <label for="addTaskAssigned" onclick="event.preventDefault()">
                    <h2>Assigned to</h2>
                </label>
                <div id="addTaskAssignedInputContainer" class="extendedInput dropdownInput borderHover preventSelect"
                    onclick="event.stopPropagation(); toggleDropdown('addTaskAssigned')">
                    <input type="text" placeholder="Select contacts to assign" id="addTaskAssigned"
                        onmousedown="event.preventDefault()">
                    <button type="button">
                        <img src="./assets/img/select_icon.svg" alt="icon" id="addTaskAssignedIcon" style="transform: none">
                    </button>
                </div>
                <div class="dropdownMenuWrapper preventSelect">
                    <ul class="dropdownMenu" id="addTaskAssignedMenu" style="display: none"></ul>
                </div>
                <div id="assignedIcons"></div>
            </div>
        </div>
        <div class="vr" id="formSeperator"></div>
        <div class="addTaskFormMainSide addTaskFormMainSideTwo">
            <div class="addTaskField">
                <label for="addTaskDue">
                    <h2>Due date<p class="red">*</p>
                    </h2>
                </label>
                <div id="addTaskDueContainer" class="borderHover"
                    onmousedown="event.stopPropagation(); focusAddTaskDue()">
                    <input type="text" id="addTaskDueText" placeholder="dd/mm/yyyy"
                        onkeyup="autofillAddTaskDueText(event)" oninput="checkAddTaskDueText()">
                    <input type="date" id="addTaskDue" required onchange="setAddTaskDueText()">
                </div>
            </div>
            <div class="addTaskField">
                <h2>Prio</h2>
                <div class="addTaskPrioBtns preventSelect">
                    <button type="button" id="addTaskPrio1" onclick="handlePrioBtnClick(1)">Urgent <img
                            src="./assets/img/prio_icons/task_prio_urgent.svg" alt="icon" id="addTaskPrio1Img"></button>
                    <button type="button" id="addTaskPrio2" onclick="handlePrioBtnClick(2)" class="addTaskPrioBtnsSelected addTaskPrio2Selected">Medium <img
                            src="./assets/img/prio_icons/task_prio_medium_white.svg" alt="icon" id="addTaskPrio2Img"></button>
                    <button type="button" id="addTaskPrio3" onclick="handlePrioBtnClick(3)">Low <img
                            src="./assets/img/prio_icons/task_prio_low.svg" alt="icon" id="addTaskPrio3Img"></button>
                </div>
            </div>
            <div class="addTaskField dropdownContainer" id="addTaskCategoryContainer">
                <label for="addTaskCategory" onclick="event.preventDefault()">
                    <h2>Category<p class="red">*</p>
                    </h2>
                </label>
                <div id="addTaskCategoryInputContainer" class="extendedInput dropdownInput borderHover preventSelect"
                    onclick="event.stopPropagation(); toggleDropdown('addTaskCategory')">
                    <input type="text" class="preventSelect" placeholder="Select task category" id="addTaskCategory" required
                        onmousedown="event.preventDefault()">
                    <button type="button">
                        <img src="./assets/img/select_icon.svg" alt="icon" id="addTaskCategoryIcon" style="transform: none">
                    </button>
                </div>
                <ul class="dropdownMenu preventSelect" id="addTaskCategoryMenu" style="display: none">
                    <li onclick="handleDropdownMenuClick(event)">Technical Task</li>
                    <li onclick="handleDropdownMenuClick(event)">User Story</li>
                </ul>
            </div>
            <div class="addTaskField">
                <label for="addSubtask" onclick="event.stopPropagation(); focusSubtask()">
                    <h2>Subtasks</h2>
                </label>
                <div id="addSubtaskInputContainer" class="extendedInput borderHover"
                    onclick="event.stopPropagation(); focusSubtask()">
                    <input type="text" placeholder="Add new subtask" id="addSubtask">
                    <div id="addSubtaskIconsPassive">
                        <button type="button">
                            <img src="./assets/img/plus_icon.svg" alt="icon">
                        </button>
                    </div>
                    <div id="addSubtaskIconsActive" style="display: none">
                        <button type="button" onclick="event.stopPropagation(); cancelSubtask()">
                            <img src="./assets/img/cancel.svg" alt="cancel subtask">
                        </button>
                        <div class="vr"></div>
                        <button type="button" onclick="event.stopPropagation(); createSubtask()">
                            <img src="./assets/img/check.svg" alt="create subtask">
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="subtasksContainer">
        <div id="subtasksLeftMargin"></div>
        <div class="subtasksListContainer">
            <ul id="subtasksList"></ul>
        </div>
    </div>
    <div class="addTaskBottom" id="addTaskBottom">
        <div class="fontSizeSmall">
            <p class="red" style="margin-bottom: 3px">*</p>
            This field is required
        </div>
        <div>
            <button type="reset" id="addTaskCancelBtn" class="btnSecondary" style="display: none" onclick="resetTaskForm(); closeTask()">Cancel</button>
            <button type="reset" id="addTaskClearBtn" class="btnSecondary">Clear</button>
            <button type="submit" class="btnPrimary" id="submitBtn">Create Task</button>
        </div>
    </div>
</form>
    `;
}


/**
 * Renders the header section of the page.
 * - Updates the inner HTML of the element with the ID 'headerRender' to include the header layout.
 * - The header consists of a logo, a title, user information, and a help link.
 * - Includes a hidden menu with links to the legal notice, privacy policy, and logout functionality.
 */
async function renderHeader() {
    document.getElementById('headerRender').innerHTML =
    /*html*/`
    <div>
      <div class="headerStyle">
          <img id="mobileLogo" src="./assets/img/menu_icons/capa_3.svg">
          <div id="headerName">Kanban Project Management Tool</div>
          <div id="smalInterface">
              <div id="help">
                  <a href="help.html"><img src="./assets/img/menu_icons/help.svg"></a>
              </div>
              <div id="user" onclick="showHiddenMenu();">
                  <span id="use_name"></span>
              </div>
          </div>
      </div>
      <div class="hiddenMenuPos">
          <div id="hiddenMenu" class="hiddenMenuText" style="display: none;">
              <a onclick="hideHiddenMenu();" href="./legal.html" target="_blank">Legal Notice</a>
              <a onclick="hideHiddenMenu();" href="./privacy.html" target="_blank">Privacy Policy</a>
              <a onclick="logout();">Log out</a>
          </div>
      </div>
    </div>
    `;
  }
  
  
  /**
   * Renders the side menu of the application.
   * - Updates the inner HTML of the element with the ID 'sideMenu' to include the side menu layout.
   * - The side menu consists of a logo, navigation links for various pages (Summary, Add Task, Board, Contacts),
   *   and links to the Privacy Policy and Legal Notice.
   */
  async function renderSidemenu() {
    document.getElementById('sideMenu').innerHTML =
    /*html*/`
  <div id="logo">
      <img src="./assets/img/menu_icons/white_logo.svg">
  </div>
  <div id="menuBox">
      <a href="./summary.html"><div id="sideSummary" class="linkAlign menuHover"><img id="sideImgSummary" class="" src="./assets/img/menu_icons/summary.svg"><p id="linkSummary" class="menuLink">Summary</p></div></a>
      <a href="./add_task.html"><div id="sideAddTask" class="linkAlign menuHover"><img id="sideImgAddTask" class="" src="./assets/img/menu_icons/add_task.svg"><p id="linkAddTask" class="menuLink">Add Task</p></div></a>
      <a href="./board.html"><div id="sideBoard" class="linkAlign menuHover"><img id="sideImgBoard" class="" src="./assets/img/menu_icons/board.svg"><p id="linkBoard" class="menuLink">Board</p></div></a>
      <a href="./contacts.html"><div id="sideContacts" class="linkAlign menuHover"><img id="sideImgContacts" class="" src="./assets/img/menu_icons/contacts.svg"><p id="linkContacts" class="menuLink">Contacts</p></div></a>
  </div>
  <div id="infos">
      <a target="_blank" href="./privacy.html">Privacy Policy</a>
      <a target="_blank" href="./legal.html">Legal Notice</a>
  </div>
    `;
  }
  

  /**
   * Renders the mobile side menu of the application.
   * - Updates the inner HTML of the element with the ID 'mobileMenuBox' to include the mobile side menu layout.
   * - The mobile side menu consists of navigation links for various pages (Summary, Add Task, Board, Contacts),
   *   with corresponding icons for each link.
   */
  async function mobileSideMenu() {
    document.getElementById('mobileMenuBox').innerHTML =
    /*html*/`
      <div id="mobileSideMenuBox">
      <a href="./summary.html">
          <div id="sideSummaryMobile" class="linkAlign menuHover"><img id="sideImgSummaryMobile" class=""
                  src="./assets/img/menu_icons/summary.svg">
              <p id="linkSummaryMobile" class="menuLink">Summary</p>
          </div>
      </a>
      <a href="./add_task.html">
          <div id="sideAddTaskMobile" class="linkAlign menuHover"><img id="sideImgAddTaskMobile" class=""
                  src="./assets/img/menu_icons/add_task.svg">
              <p id="linkAddTaskMobile" class="menuLink">Add Task</p>
          </div>
      </a>
      <a href="./board.html">
          <div id="sideBoardMobile" class="linkAlign menuHover"><img id="sideImgBoardMobile" class=""
                  src="./assets/img/menu_icons/board.svg">
              <p id="linkBoardMobile" class="menuLink">Board</p>
          </div>
      </a>
      <a href="./contacts.html">
          <div id="sideContactsMobile" class="linkAlign menuHover"><img id="sideImgContactsMobile" class=""
                  src="./assets/img/menu_icons/contacts.svg">
              <p id="linkContactsMobile" class="menuLink">Contacts</p>
          </div>
      </a>
  </div>
    `;
  }