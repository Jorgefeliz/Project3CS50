document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  //document.querySelector(".read").addEventListener('click', () => show_one_email());
  document.querySelector('#compose-form').onsubmit = send_email;
  
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

}

function send_email(){


  //------------------------------------------------------------------//
  const recipients = document.querySelector('#compose-recipients').value;
  const subject = document.querySelector('#compose-subject').value;
  const body = document.querySelector('#compose-body').value;

  
  
  console.log(body);
  console.log(recipients);
  console.log(subject);
  
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
localStorage.clear();
load_mailbox('sent');

return false;
}

function load_mailbox(mailbox) {
  
  


  // Show the mailbox and hide other views
  document.querySelector('#email-read').style.display = 'none';
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
  

  let route = '/emails/';
  route = route + mailbox;
  fetch(route)
  .then(response => response.json())
  .then(emails => {
    
    emails.forEach(email => { 
      //console.log(email.id);
      

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
     
      let archived_available = true;
      if (mailbox === "sent"){
        archived_available = false;
      }

             // `<a class="email" href="http://127.0.0.1:8000/emails/${email.id}" > </a>
      myDiv.innerHTML = `<strong> ${email.sender} </strong> <em> ${email.subject} </em> <i> ${email.timestamp} </i>
      <input type="button" value="Read" onclick="show_one_email(${email.id}, ${archived_available});" />`;
      
 
      

      //myDiv.append(strong,' ', em, ' ', time);
      email_view.append(myDiv);
      
    });

   
  });

}

function show_one_email(email_id, archived_available){

  document.querySelector('#email-read').style.display = 'block';
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
//-----------------------------------------------------------
let input_type = "button";
if (archived_available === false) {
  input_type = "hidden";

}

//-------------------------------------------------------
const email_read = document.getElementById('email-read');
while(email_read.firstChild){
  email_read.removeChild(email_read.lastChild);
}
//email_read = document.innerHTML = "";

let route = "/emails/" + email_id;
fetch(route)
.then(response => response.json())
.then(email => {
      
    
    let myDiv = document.createElement('div');
    myDiv.setAttribute("id", "myDiv_read");



   //---------Archived/ unarchived-------------------------------------
   let archived_status = "Archive";
   if (email["archived"] === false){
     //console.log("no esta archivado");
     archived_status = "Archive";
   }
   else{
     //console.log("esta archivado");
     archived_status = "Unarchive";
   }

   //--------------------------------------------



    myDiv.innerHTML = `<div class="form-group">
                          
              <strong> From: </strong>  ${email.sender} <br>
              <strong> To: </strong>  ${email.recipients} <br>
              <strong> Subject: </strong>  ${email.subject} <br>
              <strong> Timestamp: </strong>  ${email.timestamp} <br>
              </div>
                <hr>
              <p disable >${email.body}</p>
              <input type="${input_type}" value="${archived_status}" onclick="archive_email(${email.id});">`;
 
  email_read.append(myDiv);
  //console.log(email_id);

    
});

fetch(route, {
  method: 'PUT',
  body: JSON.stringify({
      read: true
  })
})

}

function archive_email(email_id){

  console.log(email_id);
  const route = '/emails/' + email_id;
  let status = true;

  //--------------------------------------------------
  fetch(route)
  .then(response => response.json())
  .then(email => {
      // Print email


      if (email["archived"] === false){
        status = true;
        console.log("status era falso");
      }
      else{
        status = false;
        console.log("status era verdadero");
        
      }
      //console.log(email);
   

  });

  //--------------------------------------------------

console.log(status);

  fetch(route, {
    method: 'PUT',
    body: JSON.stringify({
      archived: status,
    })
  })
  


}