// memulai dokumen
$(document).ready(function(){

	// membuat dan memamsukkan variabel url untuk API
	var _url = "https://my-json-server.typicode.com/koinhunt/pwatest/products"

	// membuat variabel tambahan untuk menampilkan data
	var dataResults = ''
	var catResults = ''
	// membuat dan menyimpan variabel untuk mengidentifikasi Unique ke dalam array
	var categories = []
// fungsi
function renderPage(data){
		// membuat looping dengan key value = items
		$.each(data, function(key, items){

		// membuat fungsi menampilkan data

		_cat = items.category

		dataResults += "<div>"

						+ "<h3>" + items.name + "</h3>"
						+ "<p>" + _cat + "</p>"
						"</div>";


		// memasukkan data data kedalam menu pilihan kategori
		if ($.inArray(_cat, categories) == -1) {
			categories.push(_cat)
			catResults += "<option value'" + _cat+"'>" + _cat + "</option>"
		}

		})

	// mengakses data
	$('#products').html(dataResults)
	$('#cat_select').html("<option value='all'>Semua</option>" + catResults)

}

// AJAX , melakukan fetch

	var networkDataReceived = false

	// fresh data from online
	var networkUpdate = fetch(_url).then(function(response){
		return response.json()
	}).then(function(data){
		networkDataReceived = true
		renderPage(data)
	})

	// return data from cache
	caches.match(_url).then(function(response){
		if(!response) throw Error('no data on cache')
		return response.json()
	}).then(function(data){
		if(!networkDataReceived){
			renderPage(data)
			console.log('render data from cache')
		}
	}).catch(function(){
		return networkUpdate
	})






	// fungsi untuk filter
	// mendeteksi fungsi cat_select dipilih atau tidak berdasarkan metode on change
	$("#cat_select").on('change', function(){
		updateProduct($(this).val())
	})

	// fungsi update produk
	function updateProduct(cat){

	//membuat variabel  baru untuk mengakses update produk
	var _newUrl = _url
	var dataResults = ''

	if(cat != 'all')
		_newUrl = _url + "?category=" + cat

	//mengakses url menggunakan fungsi
	$.get(_newUrl, function(data){

		// membuat looping dengan key value = items
		$.each(data, function(key, items){

		// membuat fungsi menampilkan data
		_cat = items.category

		dataResults += "<div>"

						+ "<h3>" + items.name + "</h3>"
						+ "<p>" + _cat + "</p>"
						"</div>";

		})

	// mengakses data
	$('#products').html(dataResults)
	})

	}


}) // end document jquery ready






//PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js').then(function(registration) {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function(err) {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}
