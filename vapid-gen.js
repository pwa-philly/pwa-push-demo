const webpush = require('web-push');

// VAPID keys should only be generated only once.
console.log(webpush.generateVAPIDKeys());