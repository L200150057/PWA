const CACHE_NAME = "bundesliga-v1";
var urlsToCache = [
    "/",
    "/nav.html",
    "/index.html",
    "/article.html",
    "/pages/home.html",
    "/pages/standing.html",
    "/pages/match.html",
    "/pages/contact.html",
    "/css/materialize.min.css",
    "/css/custom.css",
    "/css/icon.css",
    "/js/materialize.min.js",
    "/manifest.json",
    "/js/nav.js",
    "/js/api.js",
    "/js/standing.js",
    "/js/match.js",
    "/js/idb.js",
    "/js/db.js",
    "/favicon.ico",
    "/images/icon-512.png",
    "/images/Bundesliga.svg",
    "/manifest.json",
    "https://fonts.googleapis.com/icon?family=Material+Icons",
    "https://fonts.gstatic.com/s/materialicons/v67/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2",
];

self.addEventListener("install", function (event) {
    event.waitUntil(
        caches
            .open(CACHE_NAME)
            .then(function (cache) {
                return cache.addAll(urlsToCache);
            })
            .catch((error) => {
                console.log(error);
            })
    );
});

self.addEventListener("fetch", function (event) {
    event.respondWith(
        caches
            .match(event.request, { cacheName: CACHE_NAME })
            .then(function (response) {
                if (response) {
                    return response;
                }
                var fetchRequest = event.request.clone();
                return fetch(fetchRequest).then(function (response) {
                    if (!response || response.status !== 200) {
                        return response;
                    }
                    var responseToCache = response.clone();
                    caches.open(CACHE_NAME).then(function (cache) {
                        cache.put(event.request, responseToCache);
                    });
                    return response;
                });
            })
            .catch((error) => {
                console.log(error);
            })
    );
});

self.addEventListener("activate", function (event) {
    event.waitUntil(
        caches
            .keys()
            .then(function (cacheNames) {
                return Promise.all(
                    cacheNames.map(function (cacheName) {
                        if (cacheName != CACHE_NAME) {
                            console.log(
                                "ServiceWorker: cache " + cacheName + " dihapus"
                            );
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .catch((error) => {
                console.log(error);
            })
    );
});

self.addEventListener("push", function (event) {
    var body;
    if (event.data) {
        body = event.data.text();
    } else {
        body = "Push message no payload";
    }
    var options = {
        body: body,
        icon: "img/notification.png",
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1,
        },
    };
    event.waitUntil(
        self.registration.showNotification("Push Notification", options)
    );
});
