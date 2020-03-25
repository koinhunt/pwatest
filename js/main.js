document.addEventListener('DOMContentLoaded', function() {
    // navbar
    var nav = document.querySelectorAll('.sidenav');
    M.Sidenav.init(nav, {edge: 'right'});
    loadbar();

    function loadbar() {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function(){
            if(this.readyState == 4) {
                if(this.status != 200) return;

                // muat daftar tautan menu 
                document.querySelectorAll('.sidenav').forEach(function(navs){
                    navs.innerHTML = xhttp.responseText;
                });

                // mendaftarkan setiap tautan menu ke event listener handler
                document.querySelectorAll('.sidenav a, .topnav a').forEach(function(navs){
                    navs.addEventListener("click", function(event){
                        //tutup sidenav
                        var sidenav = document.querySelector('.sidenav');
                        M.Sidenav.getInstance(sidenav).close();

                        //muat konten halam yang di click
                        halaman = event.target.getAttribute("href").substr(1);
                        loadhal(halaman);
                    });
                });
            }
        };
        xhttp.open('GET', 'nav.html', true);
        xhttp.send();
    }

    // load konten halaman
    var halaman = window.location.hash.substr(1);
    if(halaman == "") halaman = "home";
    loadhal(halaman);

    function loadhal(halaman){
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if(this.readyState == 4){
                var konten = document.querySelector("#konten");
                if(this.status == 200) {
                    konten.innerHTML = xhttp.responseText;
                } else if(this.status == 404) {
                    konten.innerHTML = "<h2> Halaman Tidak Ditemukan </h2>";
                } else {
                    konten.innerHTML = "<h2> Tidak Dapat Mengakses Halaman </h2>";
                }
            }
        };
        xhttp.open("GET", "pages/" + halaman + ".html", true);
        xhttp.send();
    }
});

// Registrasi servis worker
if('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
    .then((reg) => console.log('Service worker sudah terdaftar', reg))
    .catch((err) => console.log('Servis worker tidak terdaftar', reg));
}