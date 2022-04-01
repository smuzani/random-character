'use strict';
/* global register:true, login:true, resetPassword: true, showModal: true, 
hideModal: true, showError: true, handleParseError:true */
/* global ERROR_DOM_ID:true */

const REGISTER_LANDING_PAGE = 'sets.html'; 
const LOGIN_LANDING_PAGE = 'sets.html'; 

if (window.location.hash != '#login') {
  showRegisterForm();
} else {
  showLoginForm();
}

$('#login-form-link').on('click touchstart', function(event) {
  if(event.handled === false) return;
  event.stopPropagation();
  event.preventDefault();
  event.handled = true;

  showLoginForm();
});

$('#register-form-link').on('click touchstart', function(event) {
  if(event.handled === false) return;
  event.stopPropagation();
  event.preventDefault();
  event.handled = true;

  showRegisterForm();
});

function showLoginForm() {
  $('#login-form').delay(100).fadeIn(100);
  $('#register-form').fadeOut(100);
  $('#register-form-link').removeClass('active');
  $('#login-form-link').addClass('active');
}

function showRegisterForm() {
  $('#register-form').delay(100).fadeIn(100);
  $('#login-form').fadeOut(100);
  $('#login-form-link').removeClass('active');
  $('#register-form-link').addClass('active');
}

$('#register-submit').on('click touchstart', submitRegistration);

function submitRegistration(event) {
  if(event.handled === false) return;
  event.stopPropagation();
  event.preventDefault();
  event.handled = true;

  const username = $('#register-username').val();
  const email = $('#register-email').val();
  const password = $('#register-password').val();
  const confirmedPassword = $('#register-confirm-password').val();

  if (password !== confirmedPassword) {
    $(ERROR_DOM_ID).show();
    $(ERROR_DOM_ID).removeClass('hidden');
    $(ERROR_DOM_ID).text('Passwords do not match');
    return;
  }
  if (!password) {
    $(ERROR_DOM_ID).show();
    $(ERROR_DOM_ID).removeClass('hidden');
    $(ERROR_DOM_ID).text('Please enter a password');
    return;
  }
  register(username, email, password);  
}

$('#login-submit').on('click touchstart', submitLogin);

function submitLogin(event){
  if(event.handled === false) return;
  event.stopPropagation();
  event.preventDefault();
  event.handled = true;

  const email = $('#login-username').val();
  const password = $('#login-password').val();
  login(email, password);
}

$('#reset-password').on('click touchstart', function(event){
  if(event.handled === false) return;
  event.stopPropagation();
  event.preventDefault();
  event.handled = true;

  $('#reset-password').addClass('disabled');
  const email = $('#reset-email').val();
  resetPassword(email);
});

/* Connect to Parse functionality */

function register(username, email, password) {
  Parse.User.logOut();
  const user = new Parse.User();
  $(ERROR_DOM_ID).hide();
  user.set('username', username);
  user.set('password', password);
  user.set('email', email);
  showModal('Registering', '', true);
  user.signUp().then(
    function(user){
      // jshint unused: false
      hideModal();
      // eventCreatedAccount(email); // analytics.js
      window.location = REGISTER_LANDING_PAGE;
    },
    function(error){
      hideModal();
      console.log(`error ${error}`);
      showError(error);
      handleParseError(error);
    });
}

function login(email, password) {
  Parse.User.logOut();
  $(ERROR_DOM_ID).hide();
  showModal('Logging in', '', true);
  Parse.User.logIn(email, password).then(
    function(user){
      // jshint unused: false
      hideModal();
      // eventLogin(email); // analytics.js
      window.location = LOGIN_LANDING_PAGE;
    },
    function(error){
      hideModal();
      showError(error);
      handleParseError(error);
    });
}

function resetPassword(email) {
  showModal('Requesting password reset', '', true);
  Parse.User.requestPasswordReset(email)
  .then(() => {
    hideModal();
    /* global showSuccess: true */
    showSuccess(`Password request for ${email} sent!`);
    // eventPasswordReset(email); // analytics.js
    $('#reset-password').removeClass('disabled');
  }).catch((error) => {
    hideModal();
    $('#reset-password').removeClass('disabled');
    showError(error);
    handleParseError(error);
  });
}