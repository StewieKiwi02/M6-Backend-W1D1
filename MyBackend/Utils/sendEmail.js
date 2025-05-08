const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

console.log("SendGrid API Key: ", process.env.SENDGRID_API_KEY); 

const msg = {
  to: 'test@example.com', 
  from: 'no-reply@sendgrid.net',
  subject: 'Nuovo post pubblicato!',
  text: 'Un nuovo post è stato pubblicato nel nostro blog!',
};

sgMail.send(msg)
  .then(() => {
    console.log('Email inviata con successo!');
  })
  .catch((error) => {
    console.error('Errore durante l\'invio dell\'email:', error);

    if (error.response) {
      console.error('Risposta dettagliata dall\'errore:', error.response.body);
    }
  });
