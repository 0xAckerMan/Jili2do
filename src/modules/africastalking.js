const credentials = {
    apiKey: '....',         // use your sandbox app API key for development in the test environment
    username: '...',      // use 'sandbox' for development in the test environment
};
const AfricasTalking = require('africastalking')(credentials);

// Initialize a service e.g. SMS
const sms = AfricasTalking.SMS

// Use the service
const options = {
    to: ['+254......'],
    message: "Tessstt message"
}

// Send message and capture the response or error
sms.send(options)
    .then( response => {
        console.log(response);
    })
    .catch( error => {
        console.log(error);
    });
