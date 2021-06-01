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
  document.querySelector('#email-details').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#email-details').style.display = 'none';
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

        sender_element.onclick = () => get_email(email.id);
        subject_element.onclick = () => get_email(email.id);
        timestamp_element.onclick = () => get_email(email.id);

        sender_element.innerHTML = email.sender;
        subject_element.innerHTML = email.subject;

        date = new Date(email.timestamp);
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

function get_email(email_id) {

  // Get an specific email using id
  fetch(`/emails/${email_id}`)
    .then(response => response.json())
    .then(email => {
      // Show the mail details and hide other views
      document.querySelector('#emails-view').style.display = 'none';
      document.querySelector('#email-details').style.display = 'block';
      document.querySelector('#compose-view').style.display = 'none';

      // get emails_view and clear
      const email_details = document.querySelector('#email-details');
      email_details.innerHTML = '';

      // create from_line
      const from_line_element = document.createElement('div');
      const from_title_element = document.createElement('span');
      const from_data_element = document.createElement('span');

      // create to_line
      const to_line_element = document.createElement('div');
      const to_title_element = document.createElement('span');
      const to_data_element = document.createElement('span');

      // create subject_line
      const subject_line_element = document.createElement('div');
      const subject_title_element = document.createElement('span');
      const subject_data_element = document.createElement('span');

      // create timestamp_line
      const timestamp_line_element = document.createElement('div');
      const timestamp_title_element = document.createElement('span');
      const timestamp_data_element = document.createElement('span');

      // create body_line
      const body_line_element = document.createElement('div');
      const body_data_element = document.createElement('textarea');

      // configuring from elements
      from_title_element.className = 'bold';

      // configuring to elements
      to_title_element.className = 'bold';

      // configuring subject elements
      subject_title_element.className = 'bold';

      // configuring timestamp elements
      timestamp_title_element.className = 'bold';

      // configuring body elements
      body_data_element.id = 'email-body';

      // from data input
      from_title_element.innerHTML = "From: ";
      from_data_element.innerHTML = email.sender;

      // to data input
      to_title_element.innerHTML = "To: ";
      to_data_element.innerHTML = email.recipients[0];

      // subject data input
      subject_title_element.innerHTML = "Subject: ";
      subject_data_element.innerHTML = email.subject;

      // timestamp data input
      timestamp_title_element.innerHTML = "Timestamp: ";
      timestamp_data_element.innerHTML = email.timestamp;

      // body data input
      body_data_element.innerHTML = email.body;

      // from append elements
      from_line_element.appendChild(from_title_element);
      from_line_element.appendChild(from_data_element);

      // to append elements
      to_line_element.appendChild(to_title_element);
      to_line_element.appendChild(to_data_element);

      // subject append elements
      subject_line_element.appendChild(subject_title_element);
      subject_line_element.appendChild(subject_data_element);

      // timestamp append elements
      timestamp_line_element.appendChild(timestamp_title_element);
      timestamp_line_element.appendChild(timestamp_data_element);

      // body append elements
      body_line_element.appendChild(body_data_element);

      // add reply button
      const reply_button_element = document.createElement('button');
      reply_button_element.className = 'btn btn-sm btn-outline-primary';
      reply_button_element.innerHTML = 'Reply';
      reply_button_element.id = 'reply-button';

      // add archive button
      const archive_button_element = document.createElement('button');
      archive_button_element.className = 'btn btn-sm btn-outline-primary';
      archive_button_element.innerHTML = email.archived ? 'Unarchive' : 'Archive';
      archive_button_element.id = 'archive-button';
      archive_button_element.onclick = () => archive_email(email.id, email.archived);

      // add hr to separate header and body
      const hr_element = document.createElement('hr');
      hr_element.id = "email-header-bottom-hr";

      // add all elements to email_view
      email_details.appendChild(from_line_element);
      email_details.appendChild(to_line_element);
      email_details.appendChild(subject_line_element);
      email_details.appendChild(timestamp_line_element);
      email_details.appendChild(reply_button_element);
      email_details.appendChild(archive_button_element);
      email_details.appendChild(hr_element);
      email_details.appendChild(body_line_element);

      return email.id;
    })
    .then(email_id => {
      fetch(`/emails/${email_id}`, {
        method: 'PUT',
        body: JSON.stringify({
          read: true
        })
      });
    });
}

function archive_email(email_id, is_archived) {
  fetch(`/emails/${email_id}`, {
    method: 'PUT',
    body: JSON.stringify({
      archived: !is_archived
    })
  })
    .then(() => {
      load_mailbox('inbox');
    })
}