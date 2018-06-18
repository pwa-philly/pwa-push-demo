const rootPath = ''; // Path to assets
const currentCache = 'v1';

// // Push Event
// // ----------
// self.addEventListener('push', function (event) {

//   var data = {};

//   if (event.data) {
//     data = JSON.parse(event.data.text());
//   }

//   console.log('Push data:', data);

//   // Send the data to all clients, triggering navigator.serviceWorker.onmessage in each client.
//   event.waitUntil(
//     clients.claim().then(function () {
//       return self.clients.matchAll().then(function (clients) {
//         return Promise.all(clients.map(function (client) {
//           return client.postMessage(event.data.text());
//         }));
//       });
//     })
//   );

// });



// // On notification click
// // ---------------------
// self.addEventListener('notificationclick', function (event) {
//   var notification = event.notification;
//   var action = event.action;
//   console.group('Notification Click');
//   console.log('Notification:', notification, 'Action:', action);
//   console.log('Action:', action);
//   console.groupEnd();
// });



// // On notification close
// // ---------------------
// self.addEventListener('notificationclose', function (event) {
//   // Do Stuff
//   // update analytics data.
//   console.log('Notification close', event);
// });





/********************
 ** Start Caching
 ********************/

// Installing Service Worker. This is the perfect time to create and populate our local cache!
// Learn more about the Cache Interface:
// https://developer.mozilla.org/en-US/docs/Web/API/Cache
self.addEventListener('install', function(event) {

  event.waitUntil(
    caches
      .open(currentCache)
      .then(function(cache) {
        return cache.addAll([
          `${rootPath}/`,
          `${rootPath}/index.html`,
          // `${rootPath}/app.js`,
          `${rootPath}/data.js`,
          `${rootPath}/assets/style.css`,
          `${rootPath}/assets/images/starwarslogo.svg`,
          `${rootPath}/assets/images/imperial.svg`,
          `${rootPath}/assets/images/characters/1.jpg`,
          `${rootPath}/assets/images/characters/2.jpg`,
          `${rootPath}/assets/images/characters/3.jpg`,
          `${rootPath}/assets/images/characters/4.jpg`,
          `${rootPath}/assets/images/characters/5.jpg`,
          `${rootPath}/assets/images/characters/6.jpg`,
          `${rootPath}/assets/images/characters/7.jpg`,
          `${rootPath}/assets/images/characters/8.jpg`,
          `${rootPath}/assets/images/characters/9.jpg`,
          `${rootPath}/assets/images/characters/10.jpg`
        ]);
      })
      .then(function() {
        // Moves immediately to activate handler
        return self.skipWaiting();
      })
  );
});

 // Deleting old Caches during activation
self.addEventListener('activate', function(event) {

  // Names of caches you want to preserve
  var cacheWhitelist = [currentCache];

  event.waitUntil(
    caches
      .keys()
      .then(function(keyList) {
        return Promise.all(
          keyList.map(function(key) {
            if (cacheWhitelist.indexOf(key) === -1) {
              return caches.delete(key);
            }
          })
        );
      })
      .then(function() {
        // Force new service worker to take control
        return self.clients.claim();
      })
  );
});


// Getting the cached content from the cache first.
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      // caches.match() always resolves
      // but in case of success response will have value
      if (response !== undefined) {
        // Return the matching resource found in our cache
        // console.warn('[From Cache]:', response);
        return response;
      } else {
        // Otherwise, request the resource from the network
        return fetch(event.request)
          .then(function(response) {
            // Responses may only be read once,
            // so we need to clone the response and put it in the cache,
            // while we serve the original response to the client
            let responseClone = response.clone();

            // console.warn('[Cloned response]:', responseClone);
            caches.open(currentCache).then(function(cache) {
              // cache.put(event.request, responseClone);
            });
            return response;
          })
          .catch(function() {
            // If we don't have a response in our cache OR the network,
            // match a file we already have so installation isn't blocked
            return caches.match(`${rootPath}/index.html`);
          });
      }
    })
  );
});

/********************
 ** End Caching
 ********************/

