document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

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

  document.querySelector('#compose-form').onsubmit = function(){


    //------------------------------------------------------------------//
    let recipients = document.querySelector('#compose-recipients').value;
    let subject = document.querySelector('#compose-subject').value;
    let body = document.querySelector('#compose-body').value;

    
    console.log(subject);
    console.log(body);
    console.log(recipients);
    
    fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
          recipients: recipients,
          subject: subject,
          body: body
          
      })
    })
    .then(response => response.json())
    .then(result => {
        // Print result
        console.log(recipients);
        console.log(result);
    });

  }
}

function load_mailbox(mailbox) {
  
  


  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  if (mailbox === "sent"){
    show_emails(mailbox);
  
  }  

  if (mailbox === "inbox"){
    show_emails(mailbox);
  }

  if (mailbox === "archive"){
    show_emails(mailbox);
  }

}

function show_emails(mailbox){
  document.querySelector('#emails-view').textContent = "";

  let route = '/emails/';
  route = route + mailbox;
  fetch(route)
  .then(response => response.json())
  .then(emails => {
    // Print emails
    
    console.log(mailbox);
 
    // ... do something else with emails ...
    emails.forEach(email => { 
      console.log(email.id);

      const email_view = document.getElementById('emails-view');

      let myDiv = document.createElement('div');
      myDiv.setAttribute("id", "myDiv");
      const strong = document.createElement('strong');
      const em = document.createElement('em');
      const time = document.createElement('i');
   
     

      strong.textContent = email.sender;
      em.textContent = email.subject;
      time.textContent = email.timestamp;

      if (email.read === false){
        myDiv.setAttribute("style", "background-color: white");
      }
      else{
        myDiv.setAttribute("style", "background-color: gray");
      }
     
      /*
      myDiv.innerHTML = `<a href="http://127.0.0.1:8000/emails/${email.id}" >
                        <strong> ${email.sender} </strong> <em> ${email.subject} </em> <i> ${email.timestamp} </i>
                        </a>`;
      */

      myDiv.append(strong,' ', em, ' ', time);
      email_view.append(myDiv);
      
    });

  });

}