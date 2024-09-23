/**
 * Opens the add contact window
 */
function openAddCardOne() {
    const addNewContactBg = document.getElementById('addContactBg');
    const addNewContactBtn = document.getElementById('addCardOne');
    addNewContactBg.classList.remove('d-none');
    addNewContactBtn.classList.remove('d-none');
    addNewContactBtn.classList.remove('slideOut');
    addNewContactBtn.classList.add('slideIn');
}


/**
 * Closes the add contact window
 */
function closeAddCardOne() {
    const addNewContactBg = document.getElementById('addContactBg');
    const addNewContactBtn = document.getElementById('addCardOne');
    addNewContactBg.classList.add('d-none');
    addNewContactBtn.classList.remove('slideIn');
    addNewContactBtn.classList.add('slideOut');
    stopAnimation();
    hideMobileAddContactCardOne();
}


/**
 * Prevents to start the slide-out animation
 */
function stopAnimation() {
    const animation = document.getElementById('addCardOne');
    function onAnimationEnd() {
      animation.classList.add('d-none');
      animation.removeEventListener('animationend', onAnimationEnd);
    }
    animation.addEventListener('animationend', onAnimationEnd);
  }


/**
 * Closes the add contact window on desktop
 */
  function hideAddContactCardOne() {
    const addNewContactBg = document.getElementById('addContactBg');
    const addNewContactBtn = document.getElementById('addCardOne');
    addNewContactBg.classList.add('d-none');
    addNewContactBtn.classList.add('d-none');
    addNewContactBtn.classList.remove('slideIn');
    addNewContactBtn.classList.add('slideOut');
  }
  

/* Mobile Add Contact Card */

/**
 * Opens the add contact window on mobiledevices
 */
  function openMobileAddContactCardOne() {
    const mobileAddCardBg = document.getElementById('mobileAddCardBg');
    const mobileAddCardOne = document.getElementById('mobileAddCardOne');
    mobileAddCardBg.classList.remove('d-none');
    mobileAddCardOne.classList.remove('d-none');
    mobileAddCardOne.classList.remove('slideDown');
    mobileAddCardOne.classList.add('slideUp');
}


/**
 * Closes the add contact window on mobiledevices
 */
function closeMobileAddContactCardOne() {
    const mobileAddCardBg = document.getElementById('mobileAddCardBg');
    const mobileAddCardOne = document.getElementById('mobileAddCardOne');
    mobileAddCardBg.classList.add('d-none');
    mobileAddCardOne.classList.add('slideDown');
    mobileAddCardOne.classList.remove('slideUp');
    stopMobileAnimation();
    hideAddContactCardOne();
}


/**
 * Prevents to start the slide-out animation on mobiledevices
 */
function stopMobileAnimation() {
    const animation = document.getElementById('mobileAddCardOne');
    function onMobileAnimationEnd() {
      animation.classList.add('d-none');
      animation.removeEventListener('animationend', onMobileAnimationEnd);
    }
    animation.addEventListener('animationend', onMobileAnimationEnd);
  }


/**
 * Closes the add contact window on mobiledevices
 */
  function hideMobileAddContactCardOne() {
    const mobileAddCardBg = document.getElementById('mobileAddCardBg');
    const mobileAddCardOne = document.getElementById('mobileAddCardOne');
    mobileAddCardBg.classList.add('d-none');
    mobileAddCardOne.classList.add('d-none');
    mobileAddCardOne.classList.add('slideDown');
    mobileAddCardOne.classList.remove('slideUp');
  }