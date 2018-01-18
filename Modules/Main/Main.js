/* Sayfa açıldığında tüm ürünleri çeker ve değişkene atar. İlk açılışta tüm ürünler gösterilir. */
var products = {};
DataReader.getProducts(function(response){
	response = JSON.parse(response);
	products = response;
	DataReader.initProducts(products);
	Cart.appendCart();
});
/* Arama yapan yardımcı fonksiyon */
function search() {
	var searchText = document.getElementById('searchText').value;
	searchText = searchText.toLowerCase();
	if(searchText.length >= 3){
		searchResult = DataReader.searchProduct(products, 'DisplayName', searchText);
		if(searchResult.length > 0){
			DataReader.initProducts(products, searchResult);
		}else{
			document.getElementById('productList').innerHTML = "Aramanıza ait ürün bulunamadı.";
		}
	}else{
		DataReader.initProducts(products);
	}
}
/* Mobil menuyu toggle eden yardımcı fonksiyon */
function toggleMobileCart(){
	var cart = document.getElementById('cart');
	cart.classList.toggle('mobile-hidden');
	var overlay = document.getElementById('overlay');
	overlay.classList.toggle('mobile-hidden');
}
/* Sepete ürün ekleyen yardımcı fonksiyon */
function addToCartEvent(productId){
	 var quantity = document.getElementById('newItem'+productId).value;
	 var addProduct = DataReader.searchProduct(products, 'ProductId', productId);
	 addProduct = addProduct[0];
	 Cart.addToCart(addProduct,quantity);
}
function removeToCartEvent(productId){
	Cart.removeToCart(productId);
}
function clearCartEvent(){
	Cart.clearCart();
}

var delay = (function(){
  var timer = 0;
  return function(callback, ms){
  clearTimeout (timer);
  timer = setTimeout(callback, ms);
 };
})();
/* Sepetteki ürünün adedini güncelleyen yardımcı fonksiyon */
function updateProductCountEvent(productId, quantity, oldQuantity){
	//Kullanıcı 2 veya 3 basamaklı sayı yazarsa diye bekletiliyor.	
	delay(function(){
		if(quantity.value == '' || quantity.value == 0){
			quantity.value = oldQuantity;
		}
		var updateProduct = DataReader.searchProduct(products, 'ProductId', productId);
		updateProduct = updateProduct[0];
		Cart.updateProductCount(updateProduct, quantity.value);
	}, 1000 );
}
/* Sayfanın scroll eventini dinler ve yukarı git butonunu gösterir */
window.addEventListener("scroll", function(event) {
    var top = this.scrollY;
    if(top > 300){
    	document.getElementById('goTop').classList.add('show');
    }else{
		document.getElementById('goTop').classList.remove('show');
    }
}, false);