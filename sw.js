/* membuat variabel untuk nama cache 
callback dan memutuskan file mana yang akan disimpan 
dialam cache tersebut 
*/
var CACHE_NAME = 'my-site-cache-v1';
var urlsToCache = [
  '/',
  '/fallback.json',
  '/css/main.css',
  '/images/logo.png',
  '/js/jquery.min.js',
  '/js/main.js'
];

// implementasi cache then network

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('in install service worker... cache opened!!');
        return cache.addAll(urlsToCache);
      })
  );
});



//menyimpan cache dan mengembalikan permintaan
self.addEventListener('fetch', function(event) {

  // var 
  var request = event.request
  var url     = new URL(request.url)

  // pisahkan request cache API dan internal
  if(url.origin === location.origin) {
    // jika sama
     event.respondWith(
      // menampilkan apakah di request ada atau tidak 
      // kalau ada , maka akan mengembalikan ke response
      // kalau tidak ada maka akan mengembalikan ke fetch(request)
      caches.match(request).then(function(response){
          return response || fetch(request)
      })
    )
  } // jika url nya tidak sama dengan url origin/API tidak sama maka
    else {
      event.respondWith(
          caches.open('products-cache').then(function(cache){
            return fetch(request).then(function(liveResponse){
              // menyimpan data ke cache , menggunakan metode .clone untuk cache 1x
              cache.put(event.request, liveResponse.clone())
              return liveResponse
            }).catch(function(){
              return caches.match(request).then(function(response){
                if(response) return response
                  return caches.match('/fallback.json')
              })
            })
          })
        )
  }
});




// Aktivasi dan atau mengupdate serviceworker
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        // filter bila bukan nama cache yang sebelumnya
        cacheNames.filter(function(cacheName){
          return cacheName != CACHE_NAME
        }).map(function(cacheName){
          return caches.delete(cacheName)
        })
      );
    })
  );
});