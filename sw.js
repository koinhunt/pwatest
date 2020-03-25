const nama_cache = 'cache-pwa-v1';
const aset = [
    '/',
    '/index.html',
    '/pages/home.html',
    '/pages/about.html',
    '/pages/product.html',
    '/pages/contact.html',
    '/js/main.js',
    '/js/materialize.js',
    '/js/materialize.min.js',
    '/css/materialize.css',
    '/css/materialize.min.css',
    '/css/style.css',
    '/images/logo.png',
    '/images/aset/medsos_facebook.png',
    '/images/aset/medsos_instagram.png',
    '/images/aset/medsos_line.png',
    '/images/aset/medsos_twitter.png',
    '/images/aset/banner2.png',
    '/images/aset/pwa.png',
    'https://fonts.googleapis.com/icon?family=Material+Icons'
];

//install service worker
self.addEventListener('install', (event) => {
    // menunggu me load semua aset sebelum mengintal
    event.waitUntil(
        caches.open(nama_cache).then(cache => {
            console.log('mengambil aset');
            cache.addAll(aset);
        })
    );
});


// fetching servis worker
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then(respon => {
            return respon || fetch(event.request);
        })
    );
});


//aktivasi servis worker
self.addEventListener('activate', (event) => {
    // mengganti cache lama dengan yang baru (update)
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(keys
                .filter(k => k !== nama_cache)
                .map(k => caches.delete(k))
            )
        })
    );
});

