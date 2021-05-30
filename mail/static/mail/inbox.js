document.addEventListener('DOMContentLoaded', function () {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // New events
  document.querySelector('#compose-form').onsubmit = () => {
    send_email();
    return false;
  };

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
}

function send_email() {
  // Get params
  const recipients = document.querySelector('#compose-recipients').value;
  const subject = document.querySelector('#compose-subject').value;
  const body = document.querySelector('#compose-body').value;
  const status = document.querySelector('#status');

  // Post email
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
      recipients,
      subject,
      body,
    })
  })
    .then(response => response.json())
    .then(result => {
      const { error } = result;

      if (error) {
        status.innerHTML = error
        status.style.color = "red";
      } else {
        load_mailbox('sent');
        alert('Your email has been sent!');
      }
    })
    .catch(error => {
      console.log(error)
      status.innerHTML = error;
      status.style.color = "red";
    });
}
