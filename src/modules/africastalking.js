const credentials = {
    apiKey: '181cacd9fa3edf8cea313456754b765601c20046a6db85c50d985b377c56aa84',         // use your sandbox app API key for development in the test environment
    username: 'joelkores',      // use 'sandbox' for development in the test environment
};
const AfricasTalking = require('africastalking')(credentials);

// Initialize a service e.g. SMS
const sms = AfricasTalking.SMS

// Use the service
const options = {
    to: ['+254718879921'],
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
