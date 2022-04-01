'use strict';

const APP_ID = 'GEpO18XvugGV';
const SERVER_URL = 'https://rdchargen.herokuapp.com/parse';
const LOGIN_PAGE = 'login.html#login'; 
const ERROR_DOM_ID = '#errors';
const SUCCESS_DOM_ID = '#success';

Parse.initialize(APP_ID);
Parse.serverURL = SERVER_URL;

$(ERROR_DOM_ID).hide();
$(SUCCESS_DOM_ID).hide();

class Feedback extends Parse.Object {
  constructor(name, message) {
    // Pass the ClassName to the Parse.Object constructor
    super('Feedback');
    this.name = name;
    this.message = message;
  }
}

Parse.Object.registerSubclass('Feedback', Feedback);

// $(document).ready(function(){
//   $('#submit-feedback').on('click touchstart', submitFeedback);
//   $('#contact-form').submit(function(e) {
//     e.preventDefault();
//   });
// });

let isSubmitting = false;
function submitFeedback() {
  if (event.handled === false) return;
  if (isSubmitting) return;

  isSubmitting = true;
  event.stopPropagation();
  event.preventDefault();
  event.handled = true;

  $(SUCCESS_DOM_ID).addClass('hidden');
  $(ERROR_DOM_ID).addClass('hidden');
  let name = $('input#form-name').val();
  let email = $('input#form-email').val();
  let type = $('select#form-type option:selected').attr('id');
  let message = $('#form-message').val();

  if (!name || !message) {
    showError('Form is incomplete');
    isSubmitting = false;
    return;
  }

  const feedback = new Feedback();
  feedback.set('name', name);
  feedback.set('email', email);
  feedback.set('type', type);
  feedback.set('message', message);
  showModal('Submitting', '', true);
  feedback.save()
  .then((feedback) => {
    hideModal();
    // jshint unused:false
    showSuccess('Feedback submitted. Thank you!');
    isSubmitting = false;
  }, (error) => {
    hideModal();
    showError(error);
    handleParseError(error);
    isSubmitting = false;
  });
}

function logout() {
  Parse.User.logOut();
  window.location = LOGIN_PAGE;
}

function showSuccess(message) {
  $(SUCCESS_DOM_ID).show();
  $(SUCCESS_DOM_ID).removeClass('hidden');
  $(SUCCESS_DOM_ID).text(message);
}

function showError(error) {
  $(ERROR_DOM_ID).show();
  $(ERROR_DOM_ID).removeClass('hidden');
  $(ERROR_DOM_ID).text(error.message);
}

function handleParseError(error) {
  switch (error.code) {
    case Parse.Error.INVALID_SESSION_TOKEN:
    logout();
    console.log('Invalid session. Logging out.');
    break;
    default:
    console.log(`Unhandled error code: ${error.code}`);
  }
}

function showModal(title, body, isSpinnerVisible) {
  $('#modalGeneric .modal-title').text(title);
  if (body) {
    $('#modalGeneric .modal-body').removeClass('hidden');
    $('#modalGeneric .modal-body').text(body);
  } 
  if (isSpinnerVisible) $('#modalGeneric .spinner-border').removeClass('hidden');
  $('#modalGeneric').addClass('in');
  $('.modal-backdrop').show();
  $('#modalGeneric').show();
  $('#modalGeneric').modal({
    keyboard: false
  });
}

function hideModal() {
  $('#modalGeneric .modal-body').addClass('hidden');
  $('#modalGeneric .spinner-border').addClass('hidden');
  $('#modalGeneric').removeClass('in');
  $('#modalGeneric').modal('hide');
  $('.modal-backdrop').hide();
  $('#modalGeneric').hide();
}