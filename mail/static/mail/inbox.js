document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  //document.querySelector(".read").addEventListener('click', () => show_one_email());
 
  
  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#email-read').style.display = 'none';
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
  document.querySelector('#email-read').style.display = 'none';
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  document.querySelector('#emails-view').textContent = "";
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
     
      // `<a class="email" href="http://127.0.0.1:8000/emails/${email.id}" > </a>
      myDiv.innerHTML = `<strong> ${email.sender} </strong> <em> ${email.subject} </em> <i> ${email.timestamp} </i>
                        <input type="button" value="Read" onclick="show_one_email(${email.id});" />
                        <input type="button" value="Archive" onclick="archive_email(${email.id});" />`;
      

      //myDiv.append(strong,' ', em, ' ', time);
      email_view.append(myDiv);
      
    });

   
  });

}

function show_one_email(email_id){
  document.querySelector('#email-read').style.display = 'block';
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
//-----------------------------------------------------------

let route = "/emails/" + email_id;
fetch(route)
.then(response => response.json())
.then(email => {
    // Print email
    console.log(email_id);

      
    let email_read = document.getElementById('email-read');
    let myDiv = document.createElement('div');
    myDiv.setAttribute("id", "myDiv_read");
    myDiv.innerHTML = `<div class="form-group">
                        <small> ${email.timestamp} </small><br>
                        From: <input disabled class="form-control" value="${email.sender}">
                        
                        To: <input disabled class="form-control" value="${email.recipients}">

                        Subject: <p disable class="form-control"  >${email.subject}</p>
                         </div>
                        Body:
                      <p disable class="form-control"  >${email.body}</p>`;
    email_read.append(myDiv);
});

fetch(route, {
  method: 'PUT',
  body: JSON.stringify({
      read: true
  })
})

}