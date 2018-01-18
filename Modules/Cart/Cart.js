/** 
 * Sepet işlemlerini yapar.
 * @class
 */
var Cart = (function() {
	/** @description elementType tipinde bir elementi appendingElementId nesnesine ekler.  
	 * @param {string} elementType Eklenecek elementin tipi.Ör:li  
	 * @param {string} appendingElementId İçerisine html eklenecek elementin id değeri.  
	 * @param {string} str Eklenecek elementin içerisindeki string. 
	 * @param {string} className elementType'a verilecek css class. 
	 * @return {void}  
	 */ 
	appendHtml = function(elementType,appendingElementId,str,className = null){
		var element = document.createElement(elementType);
		element.innerHTML = str;
		if(className !== null) element.classList.add(className);
		document.getElementById(appendingElementId).appendChild(element);
	};

	/** @description Gönderilen ürünü sepete ekler. Eğer ürün sepette var ise günceller.  
	 * @param {object} product Eklenecek product objesi.  
	 * @param {string} addQuantity Eklenecek ürünün kaç adet olduğu bilgisi. 
	 * @return {void}  
	 */
	addToCart = function(product, addQuantity){
		addQuantity = parseInt(addQuantity);
		var cartData  = {};
		if(!Cart.getCartData()){
			cartData.TotalPrice = 0;
			cartData.Products = [];
		}else{
			cartData = Cart.getCartData();
		}
		var products = cartData.Products;
		var productCheck = true;
		for(productKey = 0; productKey < products.length; productKey++){
				if(products[productKey].id == product.ProductId ){
					productCheck = false;
					products[productKey].quantity = parseInt(products[productKey].quantity) + addQuantity;
				}
		}
		if(productCheck){
			newProduct = {};
			newProduct.id = product.ProductId;
			newProduct.DisplayName = product.DisplayName; 
			newProduct.price = parseFloat(product.ListPrice.replace(',','.'));
			newProduct.quantity = addQuantity;
			products.push(newProduct);
		}
		Cart.setCartData(cartData);
	};

	/** @description Gönderilen ürünün sepetteki adedini günceller.  
	 * @param {object} product Eklenecek product objesi.  
	 * @param {string} updateQuantity Güncellenecek ürünün kaç adet olduğu bilgisi. 
	 * @return {void}  
	 */
	updateProductCount = function(product, updateQuantity){
		updateQuantity = parseInt(updateQuantity);
		cartData = Cart.getCartData();
		var products = cartData.Products;
		for(productKey = 0; productKey < products.length; productKey++){
				if(products[productKey].id == product.ProductId ){
					products[productKey].quantity = updateQuantity;
				}
		}
		Cart.setCartData(cartData);
	};

	/** @description Gönderilen ürünü sepetten çıkartır.  
	 * @param {string} productId Çıkartılacak ürünün id bilgisi. 
	 * @return {object|false}  
	 */
	removeToCart = function(productId){
		obj = Cart.getCartData();
		if(obj.hasOwnProperty('Products') && typeof obj.Products === 'object' && obj.Products.length > 0){
			var products = obj.Products;
			var newProducts = [];
			for(productKey = 0; productKey < products.length; productKey++){
				if(products[productKey].id !== productId ){
					newProducts.push(products[productKey]);
				}
			}
			obj.Products = newProducts;
			Cart.setCartData(obj);
			return obj;
		}else{
			return false;
		}
	};

	/** @description localStorage'den sepet bilgisini getirir. Eğer sepet yok ise false döner.  
	 * @return {object|false}  
	 */
	getCartData = function(){
		if(localStorage.getItem("cart") !== null){
			var cartData = localStorage.getItem("cart");
			cartData = JSON.parse(cartData);
			return cartData;
		}else{
			return false;
		}	
	};

	/** @description localStorage'a sepet bilgisini ekler.
	 * @param {object} cartData Sepet objesi.  
	 * @return {void}  
	 */
	setCartData = function(cartData){
		var products = cartData.Products;
		var TotalPrice = 0;
		for(productKey = 0; productKey < products.length; productKey++){
			TotalPrice = TotalPrice + products[productKey].quantity * products[productKey].price;
		}
		cartData.TotalPrice = TotalPrice;
		cartData = JSON.stringify(cartData);
		localStorage.setItem("cart", cartData);
		Cart.appendCart();
	};

	/** @description localStorage'daki sepet bilgilerini DOM'a basar.  
	 * @return {void}  
	 */
	appendCart = function(){
		document.getElementById('cartContainer').innerHTML = '';
		cartData = Cart.getCartData();	
		if(cartData.hasOwnProperty('Products') && typeof cartData.Products === 'object' && cartData.Products.length > 0){
			document.getElementById('cartContainer').innerHTML = '<table class="cart-products" id="cartItems"></table>';
			var products = cartData.Products;
			for(productKey = 0; productKey < products.length; productKey++){
				var html = '<td class="product-name">'+products[productKey].DisplayName+'</td>'+
							'<td class="product-quantity"><input type="number" value="'+products[productKey].quantity+'" onkeydown="updateProductCountEvent(\''+products[productKey].id+'\',this, '+products[productKey].quantity+');"></td>'+
							'<td class="product-price">'+(products[productKey].quantity*products[productKey].price)+'₺</td>'+
							'<td><a href="#" class="delete-product" onclick="removeToCartEvent(\''+products[productKey].id+'\')">x</a></td>';
				Cart.appendHtml('tr','cartItems',html);
			}
			var totalPriceHtml = '<td colspan="4" class="total-price"><span class="clear-cart"><a href="#" onclick="clearCartEvent()">Sepeti Boşalt</a></span>Toplam Tutar : '+cartData.TotalPrice+' ₺</td>';
			Cart.appendHtml('tr','cartItems',totalPriceHtml);
		}else{
			var html = '<img src="assets/img/cart.png" width="64" height="64"/> Sepetiniz henüz boş';
			Cart.appendHtml('div','cartContainer',html,'empty-cart');
		}
			var cartCount = Cart.getCartProductCount();
			document.getElementById('mobileCartCount').innerHTML = '('+cartCount+')';
	}

	/** @description Sepetteki ürün sayısını döner.  
	 * @return {integer}  
	 */
	getCartProductCount = function(){
		if(cartData = Cart.getCartData()){
			return cartData.Products.length;
		}else{
			return 0;
		}
	};

	/** @description Sepetteki ürünlerin tamamını siler.  
	 */
	clearCart = function(){
		localStorage.removeItem('cart');
		Cart.appendCart();
	};

 return this;
})();
