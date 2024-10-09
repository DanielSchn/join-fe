/**
 * Opens the Conatct Overview Windows (Desktop and Mobiledevices)
 */
function showContactCard(index, profile = null) {
  openContactCardWindow();
  openMobileContactCardWindow();
  if (profile == 'profile') {
    renderUserCardInformation(index);
    renderMobileUserCardInformation(index);
  } else {
    renderContactCradInformation(index);
    renderMobileContactCradInformation(index);
  }


}


/**
 * Opens just the Conatct Overview Windows for Desktop
 */
function openContactCardWindow() {
  const contactContainer = document.getElementById('mainContactDetails');
  const responsiveBackgroundSetup = document.getElementById('responsivContactCardBg');
  const mainContactContainer = document.getElementById('mainContactContainer');
  contactContainer.classList.add('slideIn');
  contactContainer.classList.remove('d-none');
  responsiveBackgroundSetup.classList.remove('d-none');
  mainContactContainer.classList.add('responsiveSlideIn');
  mainContactContainer.classList.remove('mobile-d-none');
}


/**
 * Opens just the Conatct Overview Windows for Mobiledevices
 */
function openMobileContactCardWindow() {
  const mainContactContainer = document.getElementById('mobileMainContactContainer');
  const setting_btn = document.getElementById('contactOptions');
  mainContactContainer.classList.remove('d-none');
  setting_btn.classList.add('d-none');
}


/**
 * Closes the Conatct Overview Windows (Desktop and Mobiledevices)
 */
function hideContactCard() {
  closeContactCardWindow();
  closeMobileContactCardWindow();
}


/**
 * Closess just the Conatct Overview Windows for Desktop
 */
function closeContactCardWindow() {
  const contactContainer = document.getElementById('mainContactDetails');
  const responsiveBackgroundSetup = document.getElementById('responsivContactCardBg');
  const mainContactContainer = document.getElementById('mainContactContainer');
  contactContainer.classList.add('slideIn');
  contactContainer.classList.add('d-none');
  responsiveBackgroundSetup.classList.add('d-none');
  mainContactContainer.classList.add('responsiveSlideIn');
  mainContactContainer.classList.add('mobile-d-none');
}


/**
 * Closes just the Conatct Overview Windows for Mobiledevices
 */
function closeMobileContactCardWindow() {
  const mainContactContainer = document.getElementById('mobileMainContactContainer');
  const setting_btn = document.getElementById('contactOptions');
  mainContactContainer.classList.add('d-none');
  setting_btn.classList.add('d-none');
}


/**
 * Opens and Closes the Window for editing the Conatct informations (Desktop and Mobiledevices)
 */
function editCardWindow(isGoingToOpen, index, profile = null) {
  const userName = document.getElementById('user_name_0').innerHTML;
  if (userName === 'Guest User') {
    const failure = document.getElementById('onlyGuest');
    failure.innerHTML = 'Not allowed, you are in Guest Mode!'
    const failureMobile = document.getElementById('onlyGuestMobile');
    failureMobile.innerHTML = 'Not allowed, you are in Guest Mode!'
  } else {
    if (isGoingToOpen === true) {
      openEditCard();
      openMobileEditCard();
      toggleEditCard();
      if (profile == 'profile') {
        renderUserEditForm(index);
      } else {
        renderEditForm(index);
        renderMobileEditForm(index);
      }
    } else {
      closeEditCard();
      closeMobileEditCard();
      toggleEditCard();
      showResponsiveEditCardWindow();
    }
  }
}


/**
 * Opens and handels the responsive behavior of the Contact Card and Backround
 */
function showResponsiveEditCardWindow() {
  const contact = document.getElementById('mainContactDetails');
  const responsiveBackgroundSetup = document.getElementById('responsivContactCardBg');
  contact.classList.remove('d-none');
  responsiveBackgroundSetup.classList.remove('d-none');
}


/**
 * Opens a Popup on the lower right creen (on mobiledivices) when clicking the edit-button
 */
function showSettings() {
  const setting_btn = document.getElementById('contactOptions');
  const setting_bg_layer = document.getElementById('contactOptionBgLayer');
  const mobileSettingsBtnContainer = document.getElementById('mobileSettingBtnContainer');
  setting_btn.classList.remove('d-none');
  setting_btn.classList.remove('mobileSlideOutToRight');
  setting_btn.classList.add('mobileSlideInFromRight');
  setting_bg_layer.classList.remove('d-none');
  mobileSettingsBtnContainer.classList.add('mobile-d-none');
}


/**
 * Closes the Popup when clicking outside of the edit-button
 */
function hideSettings() {
  const setting_btn = document.getElementById('contactOptions');
  const setting_bg_layer = document.getElementById('contactOptionBgLayer');
  setting_btn.classList.remove('mobileSlideInFromRight');
  setting_btn.classList.add('mobileSlideOutToRight');
  setting_bg_layer.classList.add('d-none');
}


/**
 * Opens and closes the main elements of the edit contact card window
 */
function toggleEditCard() {
  const closeEditCardWindow = document.getElementById('closeEditCardWindow');
  const addContactCard = document.getElementById('editCardOne');
  const editCardBg = document.getElementById('editCardBg');
  const mainContactCard = document.getElementById('mainContactContainer');
  const closeWindowLayer = document.getElementById('closeWindowLayer');
  closeEditCardWindow.classList.toggle('d-none');
  addContactCard.classList.toggle('slideIn');
  addContactCard.classList.toggle('slideOut');
  editCardBg.classList.toggle('d-none');
  mainContactCard.classList.toggle('mobile-d-none');
  closeWindowLayer.classList.toggle('d-none');
}


/**
 * Just opens the edit card window
 */
function openEditCard() {
  const editCard = document.getElementById('editCardOne');
  editCard.classList.remove('d-none');
}


/**
 * Removes the slide-in animation of the contact card 
 */
function closeEditCard() {
  const mainContactCard = document.getElementById('mainContactContainer');
  const contactContainer = document.getElementById('mainContactDetails');
  mainContactCard.classList.remove('responsiveSlideIn');
  contactContainer.classList.remove('slideIn');
  stopEditCardAnimation();
}


/**
 * Stops the slide-out animation of the edit contact card window (stays outside of the screen)
 * Hides the edit contact card window on mobiledevices
 */
function stopEditCardAnimation() {
  const animation = document.getElementById('editCardOne');
  function onAnimationEnd() {
    animation.classList.add('d-none');
    hideMobileEditContactCardOne();
    animation.removeEventListener('animationend', onAnimationEnd);
  }
  animation.addEventListener('animationend', onAnimationEnd);
}


/**
 * Hides the edit contact card window on sreccns bigger than mobiledevices
 */
function hideEditContactCardOne() {
  const addContact_bg = document.getElementById('editCardBg');
  const addContactCard = document.getElementById('editCardOne');
  const mainContactCard = document.getElementById('mainContactContainer');
  const contactContainer = document.getElementById('mainContactDetails');
  addContact_bg.classList.add('d-none');
  addContactCard.classList.remove('slideIn');
  addContactCard.classList.add('slideOut');
  mainContactCard.classList.add('mobile-d-none');
  mainContactCard.classList.remove('responsiveSlideIn');
  contactContainer.classList.remove('slideIn');
}


/* Mobile Edit Contact Card */

/**
 * Just opens the edit card window on mobiledivices
 */
function openMobileEditCard() {
  const mobileAddCardBg = document.getElementById('mobileEditCardBg');
  const mobileAddCardOne = document.getElementById('mobileEditCardOne');
  mobileAddCardBg.classList.remove('d-none');
  mobileAddCardOne.classList.remove('d-none');
  mobileAddCardOne.classList.remove('slideDown');
  mobileAddCardOne.classList.add('slideUp');
}


/**
 * Removes the slide-in animation of the contact card and removes the background blure of it
 */
function closeMobileEditCard() {
  const mobileAddCardBg = document.getElementById('mobileEditCardBg');
  const mobileAddCardOne = document.getElementById('mobileEditCardOne');
  mobileAddCardBg.classList.add('d-none');
  mobileAddCardOne.classList.remove('slideUp');
  mobileAddCardOne.classList.add('slideDown');
  stopMobileEditCardAnimation();
}


/**
 * Stops the slide-out animation of the edit contact card window (stays outside of the screen)
 * Hides the edit contact card window on Desktop
 */
function stopMobileEditCardAnimation() {
  const animation = document.getElementById('mobileEditCardOne');
  function onAnimationEnd() {
    animation.classList.add('d-none');
    hideEditContactCardOne();
    animation.removeEventListener('animationend', onAnimationEnd);
  }
  animation.addEventListener('animationend', onAnimationEnd);
}


/**
 * Hides the edit contact card window on mobiledevices
 */
function hideMobileEditContactCardOne() {
  const mobileAddCardBg = document.getElementById('mobileEditCardBg');
  const mobileAddCardOne = document.getElementById('mobileEditCardOne');
  mobileAddCardBg.classList.add('d-none');
  mobileAddCardOne.classList.add('slideDown');
  mobileAddCardOne.classList.remove('slideUp');
}