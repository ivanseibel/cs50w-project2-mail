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

  // Get emails
  get_emails(mailbox);
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

function get_emails(mailbox) {
  // Get params
  const recipients = document.querySelector('#compose-recipients').value;
  const subject = document.querySelector('#compose-subject').value;
  const body = document.querySelector('#compose-body').value;
  const status = document.querySelector('#status');

  // Get emails from an specific mailbox
  fetch(`/emails/${mailbox}`)
    .then(response => response.json())
    .then(emails => {
      // Print emails
      console.log(emails);

      // List all emails
      const emails_view = document.querySelector('#emails-view');
      emails.forEach(email => {
        const row_element = document.createElement("div");
        const sender_element = document.createElement("div");
        const subject_element = document.createElement("div");
        const timestamp_element = document.createElement("div");

        row_element.className = "mail-row";

        if (email.read === true) {
          row_element.className = row_element.className + " read";
        }

        sender_element.className = "col-2 sender"
        subject_element.className = "col-7"
        timestamp_element.className = "col-3"

        sender_element.innerHTML = email.sender;
        subject_element.innerHTML = email.subject;
        console.log(email.timestamp);
        date = new Date(email.timestamp);
        console.log(date);
        timestamp_element.innerHTML = date.toLocaleString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });


        row_element.appendChild(sender_element);
        row_element.appendChild(subject_element);
        row_element.appendChild(timestamp_element);

        emails_view.appendChild(row_element);
      });
    });
}
