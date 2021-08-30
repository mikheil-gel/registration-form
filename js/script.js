// Getting DOM elements
const mainForm = document.getElementById('main-form'),
  region = document.getElementById('region-group'),
  position = document.getElementById('position-group'),
  positionOther = document.getElementById('position-other-group'),
  job = document.getElementById('job-group'),
  email = document.getElementById('email-group'),
  nameGroup = document.getElementById('name-group'),
  surname = document.getElementById('surname-group'),
  password = document.getElementById('password-group'),
  passwordRep = document.getElementById('password-rep-group'),
  conditionsCheck = document.getElementById('conditions-check-group'),
  politicsCheck = document.getElementById('politics-check-group'),
  popup = document.getElementById('popup');

//Getting element's labels,inputs,error messages & checkboxes

const [regionLabel, regionInput, regionMessage] = getElemets(region),
  [positionLabel, positionInput, positionMessage] = getElemets(position),
  [positionOtherLabel, positionOtherInput, positionOtherMessage] = getElemets(positionOther),
  jobLabel = job.querySelector('label'),
  jobInput = job.querySelector('input'),
  [emailLabel, emailInput, emailMessage] = getElemets(email),
  [nameLabel, nameInput, nameMessage] = getElemets(nameGroup),
  [surnameLabel, surnameInput, surnameMessage] = getElemets(surname),
  [passwordLabel, passwordInput, passwordMessage] = getElemets(password),
  passwordToggle = password.querySelector('span.pass-toggle'),
  passwordShow = password.querySelector('img.pass-show'),
  passwordHide = password.querySelector('img.pass-hide'),
  [passwordRepLabel, passwordRepInput, passwordRepMessage] = getElemets(passwordRep),
  passwordRepToggle = passwordRep.querySelector('span.pass-toggle'),
  passwordRepShow = passwordRep.querySelector('img.pass-show'),
  passwordRepHide = passwordRep.querySelector('img.pass-hide'),
  conditionsCheckLabel = conditionsCheck.querySelector('label'),
  conditionsCheckInput = conditionsCheck.querySelector('input'),
  conditionsCheckMark = conditionsCheck.querySelector('.checkmark'),
  politicsCheckLabel = politicsCheck.querySelector('label'),
  politicsCheckInput = politicsCheck.querySelector('input'),
  politicsCheckMark = politicsCheck.querySelector('.checkmark'),
  dropdownRegion = document.querySelector('.drop-reg'),
  dropdownRegionFirst = document.querySelector('.drop-reg p'),
  dropdownPosition = document.querySelector('.drop-pos'),
  dropdownPositionFirst = document.querySelector('.drop-pos p'),
  dropdownLis = document.querySelectorAll('.dropdown-li'),
  popupClose = popup.querySelector('.popup-close'),
  popupContent = popup.querySelector('.popup-content'),
  popupName = popup.querySelector('.popup-name'),
  popupSurmame = popup.querySelector('.popup-surname'),
  popupRegion = popup.querySelector('.popup-region'),
  popupPosition = popup.querySelector('.popup-position'),
  popupEmail = popup.querySelector('.popup-email'),
  reminder = document.querySelector('.form-reminder'),
  burger = document.querySelector('.burger'),
  burgerIcon = document.querySelector('.burger-icon'),
  navPopup = document.querySelector('.nav-popup'),
  closeBurger = document.querySelector('.nav-popup-close span');

function getElemets(element) {
  return [element.querySelector('label'), element.querySelector('input'), element.querySelector('p.error')];
}

// Regex
const regexEmail = /^([\w\.-]+)@([\w-]+)\.([a-z]{2,6})(\.[a-z]{2,6})?$/,
  regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z0-9]+$/,
  regexName = /^(?=.*[ა-ჰ])[ა-ჰ]+$/;


//scroll variable
let scrollElement = regionInput.offsetTop;

//Submitting form

mainForm.addEventListener('submit', (e) => {
  e.stopPropagation();
  e.preventDefault();

  if (checkInputs()) {
    reminder.classList.add('display-none');
    scroll(0, 0);
    showPopup();
  } else {
    reminder.classList.remove('display-none');
    if (
      regionInput.value.length &&
      positionInput.value.length &&
      (positionOtherInput.value.length || positionOtherInput.value != 'სხვა') &&
      regexEmail.test(emailInput.value)
    ) {
      scrollElement = nameInput.offsetTop;
    }
    scroll(0, scrollElement);
  }
});

//Selecting region and position


regionInput.addEventListener('click', (e) => {
  if (!e.target.classList.contains('dropdown-li')) {
  
    if (dropdownRegionFirst.textContent === regionInput.placeholder) {
      dropdownRegionFirst.style.color = 'var(--main-gray)';
    } else {
      dropdownRegionFirst.removeAttribute('style');
    }

    regionInput.nextElementSibling.classList.remove('hide');
    e.stopPropagation();
    document.body.addEventListener('click', hideDropdown);
  }
});

positionInput.addEventListener('click', (e) => {
  if (!e.target.classList.contains('dropdown-li')) {

    if (dropdownPositionFirst.textContent === positionInput.placeholder) {
      dropdownPositionFirst.style.color = 'var(--main-gray)';
    } else {
      dropdownPositionFirst.removeAttribute('style');
    }
    e.stopPropagation();
 
    positionInput.nextElementSibling.classList.remove('hide');
    document.body.addEventListener('click', hideDropdown);
  }
});

dropdownLis.forEach((li) => {
  li.addEventListener('click', () => {
    dropdownMenu(li);
  });
});

// show/hide dropdown functions

function dropdownMenu(li) {
  if (li.dataset.type === 'region') {
    regionInput.value = li.textContent;
    dropdownRegionFirst.textContent = li.textContent;

    dropdownRegion.classList.add('hide');
    dropdownPosition.classList.add('hide');
    hideErrorMessage(regionInput, regionLabel, regionMessage);
  } else if (li.dataset.type === 'position') {
    positionInput.value = li.textContent;
    dropdownPosition.classList.add('hide');
    dropdownPositionFirst.textContent = li.textContent;
    hideErrorMessage(positionInput, positionLabel, positionMessage);
    if (li.dataset.option) {
      positionOther.classList.remove('display-none');
    } else if (!positionOther.classList.contains('display-none')) {
      positionOther.classList.add('display-none');
    }
  }
}

function hideDropdown(e) {
  if (!e.target.dataset.type) {
    if (!dropdownPosition.classList.contains('hide')) {
      dropdownPosition.classList.add('hide');
    }
    if (!dropdownRegion.classList.contains('hide')) {
      dropdownRegion.classList.add('hide');
    }
  }

  document.body.removeEventListener('click', hideDropdown);
}

// Email validation

emailInput.addEventListener('blur', () => {
  checkEmail();
  emailInput.addEventListener('keyup', () => {
    checkEmail();
  });
});

// Password and repeat password input validation

passwordInput.addEventListener('blur', (e) => {
  checkPassword(false);
  document.body.addEventListener('click', passwordInputClickEvent);
});

passwordRepInput.addEventListener('blur', () => {
  checkPasswordRep();
  document.body.addEventListener('click', passwordRepInputClickEvent);
});

function passwordInputClickEvent(e) {
  if (e.target !== passwordShow && e.target !== passwordHide) {
    checkPassword(false);
    passwordInput.addEventListener('keyup', () => {
      checkPassword(false);
    });

    document.body.removeEventListener('click', passwordInputClickEvent);
  }
}
function passwordRepInputClickEvent(e) {
  if (e.target !== passwordRepShow && e.target !== passwordRepHide) {
    checkPasswordRep();
    passwordRepInput.addEventListener('keyup', () => {
      checkPasswordRep();
    });
    document.body.removeEventListener('click', passwordRepInputClickEvent);
  }
}

// toggle Show/hide password

passwordToggle.addEventListener('click', (e) => {
  if (e.target === passwordShow) {
    passwordInput.type = 'text';
    passwordToggle.classList.remove('pass-show');
    passwordToggle.classList.add('pass-hide');
  } else if (e.target === passwordHide) {
    passwordInput.type = 'password';
    passwordToggle.classList.remove('pass-hide');
    passwordToggle.classList.add('pass-show');
  }
  passwordInput.focus();
});

passwordInput.addEventListener('keyup', () => {
  if (!passwordInput.value.length) {
    passwordInput.type = 'password';
    if (passwordToggle.classList.contains('pass-show') || passwordToggle.classList.contains('pass-hide')) {
      passwordToggle.classList.remove('pass-show');
      passwordToggle.classList.remove('pass-hide');
    }
  } else {
    if (!passwordToggle.classList.contains('pass-show') && !passwordToggle.classList.contains('pass-hide')) {
      passwordToggle.classList.add('pass-show');
    }
  }
});

passwordRepInput.addEventListener('keyup', () => {
  if (!passwordRepInput.value.length) {
    passwordRepInput.type = 'password';
    if (passwordRepToggle.classList.contains('pass-show') || passwordRepToggle.classList.contains('pass-hide')) {
      passwordRepToggle.classList.remove('pass-show');
      passwordRepToggle.classList.remove('pass-hide');
    }
  } else {
    if (!passwordRepToggle.classList.contains('pass-show') && !passwordRepToggle.classList.contains('pass-hide')) {
      passwordRepToggle.classList.add('pass-show');
    }
  }
  if (
    passwordInput.value.length >= 6 &&
    regexPassword.test(passwordInput.value) &&
    passwordRepInput.value.length >= passwordInput.value.length
  ) {
    checkPasswordRep();
  }
});

passwordRepToggle.addEventListener('click', (e) => {
  if (e.target === passwordRepShow) {
    passwordRepInput.type = 'text';
    passwordRepToggle.classList.remove('pass-show');
    passwordRepToggle.classList.add('pass-hide');
  } else if (e.target === passwordRepHide) {
    passwordRepInput.type = 'password';
    passwordRepToggle.classList.remove('pass-hide');
    passwordRepToggle.classList.add('pass-show');
  }
  passwordRepInput.focus();
});

//name and surname input
nameInput.addEventListener('blur', () => {
  checkName();
  nameInput.addEventListener('keyup', checkName);
});

surnameInput.addEventListener('blur', () => {
  checkSurname();
  surnameInput.addEventListener('keyup', checkSurname);
});

positionOtherInput.addEventListener('blur', () => {
  checkPositionOther();
  positionOtherInput.addEventListener('keyup', checkPositionOther);
});

// Popup

function showPopup() {
  let html = document.querySelector('html');
  html.style.position = 'relative';
  html.style.overflow = 'hidden';
  popup.classList.remove('display-none');
  popupName.textContent = nameInput.value;
  popupSurmame.textContent = surnameInput.value;
  popupRegion.textContent = regionInput.value;
  popupPosition.textContent = positionInput.value === 'სხვა' ? positionOtherInput.value : positionInput.value;
  popupEmail.textContent = emailInput.value;


  popup.addEventListener('click', (e) => {
    if (e.target.id === 'popup' || e.target.id === 'popup-close' || e.target.id === 'popup-wrapper') {
      html.removeAttribute('style');
      popup.classList.add('display-none');
      document.body.removeEventListener('keydown', popupTabEvent);
    }
  });

  document.body.addEventListener('keydown', popupTabEvent);
}

function popupTabEvent(e) {
  let html = document.querySelector('html');
  if (e.key === 'Tab') {
    html.removeAttribute('style');
    popup.classList.add('display-none');
    document.body.removeEventListener('keydown', popupTabEvent);
  }
}

// burger menu

burgerIcon.addEventListener('click', () => {
  navPopup.classList.remove('hide');
  navPopup.style.marginTop = '0';
  document.body.addEventListener('click', navPopupClickEvent);
});
closeBurger.addEventListener('click', () => {
  navPopup.classList.add('hide');
  navPopup.style.marginTop = '-16rem';
});

function navPopupClickEvent(e) {
  if (!e.path.includes(burger)) {
    navPopup.classList.add('hide');
    navPopup.style.marginTop = '-16rem';
    document.body.removeEventListener('click', navPopupClickEvent);
  }
}

//FUNCTIONS

//Check if any required input is empty

function checkRegion() {
  if (!regionInput.value) {
    errorMessage(regionInput, regionLabel, regionMessage, 'აირჩიეთ რეგიონი');
    regionInput.style.backgroundImage = "url('./img/arrowDownRed.svg')";
    return false;
  } else {
    hideErrorMessage(regionInput, regionLabel, regionMessage);
    return true;
  }
}

function checkPosition() {
  if (!positionInput.value) {
    errorMessage(positionInput, positionLabel, positionMessage, 'აირჩიეთ პოზიცია');
    positionInput.style.backgroundImage = "url('./img/arrowDownRed.svg')";
    return false;
  } else {
    hideErrorMessage(positionInput, positionLabel, positionMessage);
    return true;
  }
}

function checkPositionOther() {
  if (positionInput.value === 'სხვა') {
    if (!positionOtherInput.value) {
      errorMessage(positionOtherInput, positionOtherLabel, positionOtherMessage, 'შეიყვანეთ პოზიცია');
      return false;
    } else {
      hideErrorMessage(positionOtherInput, positionOtherLabel, positionOtherMessage);
      return true;
    }
  } else {
    hideErrorMessage(positionOtherInput, positionOtherLabel, positionOtherMessage);
    return true;
  }
}

function checkEmail() {
  if (!emailInput.value) {
    errorMessage(emailInput, emailLabel, emailMessage, 'შეიყვანეთ ელ. ფოსტა');
    return false;
  } else if (!regexEmail.test(emailInput.value)) {
    errorMessage(emailInput, emailLabel, emailMessage, 'შეიყვანეთ ვალიდური ელ. ფოსტა');
    return false;
  } else {
    hideErrorMessage(emailInput, emailLabel, emailMessage);
    return true;
  }
}

function checkName() {
  if (!nameInput.value) {
    errorMessage(nameInput, nameLabel, nameMessage, 'შეიყვანეთ სახელი');
    return false;
  } else if (nameInput.value && !regexName.test(nameInput.value)) {
    errorMessage(nameInput, nameLabel, nameMessage, 'შეიყვანეთ სახელი ქართულად (ა-ჰ სიმბოლოები)');
    return false;
  } else {
    hideErrorMessage(nameInput, nameLabel, nameMessage);
    return true;
  }
}

function checkSurname() {
  if (!surnameInput.value) {
    errorMessage(surnameInput, surnameLabel, surnameMessage, 'შეიყვანეთ გვარი');
    return false;
  } else if (surnameInput.value && !regexName.test(surnameInput.value)) {
    errorMessage(surnameInput, surnameLabel, surnameMessage, 'შეიყვანეთ გვარი ქართულად (ა-ჰ სიმბოლოები)');
    return false;
  } else {
    hideErrorMessage(surnameInput, surnameLabel, surnameMessage);
    return true;
  }
}

function checkPassword(repCheck) {
  if (!passwordInput.value.length) {
    errorMessage(passwordInput, passwordLabel, passwordMessage, 'შეიყვანეთ პაროლი');
    passwordShow.src = './img/showRed.svg';
    passwordHide.src = './img/hideRed.svg';
    return false;
  } else if (passwordInput.value.length < 6 && passwordInput.value.length > 0) {
    errorMessage(
      passwordInput,
      passwordLabel,
      passwordMessage,
      'პაროლი უნდა შეიცავდეს მინიმუმ 6 სიმბოლოს (a-z, A-Z, 0-9)'
    );
    passwordShow.src = './img/showRed.svg';
    passwordHide.src = './img/hideRed.svg';
    return false;
  } else if (!regexPassword.test(passwordInput.value) && passwordInput.value.length > 0) {
    errorMessage(
      passwordInput,
      passwordLabel,
      passwordMessage,
      'პაროლი უნდა შეიცავდეს შემდეგ სიმბოლოებს: a-z, A-Z და 0-9'
    );
    passwordShow.src = './img/showRed.svg';
    passwordHide.src = './img/hideRed.svg';
    return false;
  } else {
    passwordShow.src = './img/show.svg';
    passwordHide.src = './img/hide.svg';
    hideErrorMessage(passwordInput, passwordLabel, passwordMessage);
    if (passwordInput.value.length >= 6 && regexPassword.test(passwordInput.value)) {
      passwordRepInput.disabled = false;
      if (repCheck) {
        return checkPasswordRep();
      } else {
        return true;
      }
    }
  }
}

function checkPasswordRep() {
  if (passwordRepInput.value.length) {
    if (
      passwordInput.value.length >= 6 &&
      regexPassword.test(passwordInput.value) &&
      passwordRepInput.value !== passwordInput.value
    ) {
      errorMessage(passwordRepInput, passwordRepLabel, passwordRepMessage, 'პაროლი არ ემთხვევა');
      passwordRepShow.src = './img/showRed.svg';
      passwordRepHide.src = './img/hideRed.svg';
      return false;
    } else {
      passwordRepShow.src = './img/show.svg';
      passwordRepHide.src = './img/hide.svg';
      hideErrorMessage(passwordRepInput, passwordRepLabel, passwordRepMessage);
      return true;
    }
  } else {
    errorMessage(passwordRepInput, passwordRepLabel, passwordRepMessage, 'გაიმეორეთ პაროლი');
    return false;
  }
}

function checkCondition() {
  if (!conditionsCheckInput.checked) {
    checkboxError(conditionsCheckLabel, conditionsCheckMark);
    return false;
  } else {
    hideCheckboxError(conditionsCheckLabel, conditionsCheckMark);
    return true;
  }
}

function checkPolitics() {
  if (!politicsCheckInput.checked) {
    checkboxError(politicsCheckLabel, politicsCheckMark);
    return false;
  } else {
    hideCheckboxError(politicsCheckLabel, politicsCheckMark);
    return true;
  }
}

function checkInputs() {
  if (
    checkRegion() &&
    checkPosition() &&
    checkPositionOther() &&
    checkEmail() &&
    checkName() &&
    checkSurname() &&
    checkPassword(true) &&
    checkCondition() &&
    checkPolitics()
  ) {
    return true;
  } else {
    // checkRegion();
    checkPosition();
    checkPositionOther();
    checkEmail();
    checkName();
    checkSurname();
    checkPassword(true);
    checkCondition();
    checkPolitics();

    return false;
  }
}

// show/hide error messages

function errorMessage(input, label, message, text) {
  input.style.borderColor = 'var(--main-red)';
  label.style.color = 'var(--main-red)';
  message.classList.remove('hide');
  message.textContent = text;
  if (input.id === 'password' || input.id === 'password-rep') {
    input.nextElementSibling.style.borderColor = 'var(--main-red)';
  }
}

function hideErrorMessage(input, label, message) {
  input.removeAttribute('style');
  label.removeAttribute('style');
  message.classList.add('hide');
  message.textContent = '';
  if (input.id === 'password' || input.id === 'password-rep') {
    input.nextElementSibling.removeAttribute('style');
  }
}
function checkboxError(label, mark) {
  mark.style.borderColor = 'var(--main-red)';
  label.style.color = 'var(--main-red)';
}
function hideCheckboxError(label, mark) {
  mark.removeAttribute('style');
  label.removeAttribute('style');
}
