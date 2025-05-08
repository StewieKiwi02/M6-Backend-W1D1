const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  to: 'destinatario@example.com',
  from: 'noreply@sendgrid.net', 
  subject: 'Nuovo post pubblicato!',
  text: 'Un nuovo post è stato pubblicato nel nostro blog!',
};

sgMail.send(msg)
  .then(() => {
    console.log('Email inviata con successo!');
  })
  .catch((error) => {
    console.error(error);
  });
