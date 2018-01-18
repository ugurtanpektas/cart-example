/** 
 * JSON tipindeki datayı okuyup dom'a ekleme yapar. Data içerisinde arama yapar.
 * @class
 */
var DataReader = (function() {
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
	/** @description Verilen object içerisinde key,value bazlı arama yapar.  
	 * @param {object} obj Arama yapılacak object.  
	 * @param {string} appendingElementId İçerisine html eklenecek elementin id değeri.  
	 * @param {string} val Aranacak değer. 
	 * @return {object}  
	 */
	searchProduct = function(obj, key, val) {
	    var objects = [];
	    for (var i in obj) {
	        if (!obj.hasOwnProperty(i)) continue;
	        if (typeof obj[i] == 'object') {
	            objects = objects.concat(DataReader.searchProduct(obj[i], key, val));    
	        }
	        if(typeof obj[i] == "string"){
	        	if (i == key && (obj[i].toLowerCase().search(val) >= 0) || i == key && val == '') { //
		            objects.push(obj);
		        } else if ((obj[i].toLowerCase().search(val) >= 0) && key == ''){
		            if (objects.lastIndexOf(obj) == -1){
		                objects.push(obj);
		            }
		        }
	        }  
	    }
	    return objects;
	}
	/** @description local bir dosyadan veya external bir url'den product datalarını getirir.  
	 * @param {function} callback fonksiyonu.   
	 * @return {void}
	 *  
  	 * HTTP isteği göndermek için XMLHttpRequest methodu kullanılmıştır.
	 * @external XMLHttpRequest
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest
	 */ 
	getProducts = function(callback){   
		var xobj = new XMLHttpRequest();
		xobj.overrideMimeType("application/json");
		xobj.open('GET', '/sepet/data/menuData.json', true); 
		xobj.onreadystatechange = function () {
		  if (xobj.readyState == 4 && xobj.status == "200") {
		    callback(xobj.responseText);
		  }
		};
		xobj.send(null);  
	};
	/** @description Productları dom'a ekler. search değeri gönderilmez ise tüm productlar dom'a eklenir.  
	 * @param {object} products Dom'a eklenecek productların tamamı.  
	 * @param {object} search Arama sonucundan dönen productlar. 
	 * @return {void}  
	 */ 
	initProducts = function(products, search = null){
		if(search == null){
			document.getElementById('productList').innerHTML = "";
			var menus = products.d.ResultSet;//response.d.ResultSet;
			for(menuKey = 0; menuKey < menus.length; menuKey++){
				//console.log(menus[menuKey]);
				var menuHeader = menus[menuKey].CategoryDisplayName;
				DataReader.appendHtml('li', 'productList', menuHeader, 'header');
				var products = menus[menuKey].Products;
				for(productKey = 0; productKey < products.length; productKey++){
					var productHtml = 	'<div class="add-to-cart"><input type="number" min="1" step="1" value="1" id="newItem'+products[productKey].ProductId+'"/> <a href="#" title="Sepete ekle" onclick="addToCartEvent(\''+products[productKey].ProductId+'\')">+</a></div>'+
										'<div class="product-name">'+products[productKey].DisplayName+'</div>'+
										'<div class="product-price">'+products[productKey].ListPrice+'₺</div>';
					DataReader.appendHtml('li', 'productList', productHtml);
				} 
			}
		}else{
			document.getElementById('productList').innerHTML = "";
			var products = search;
			for(productKey = 0; productKey < products.length; productKey++){
				if(products[productKey].hasOwnProperty('ProductId')){
					var productHtml = 	'<div class="add-to-cart"><input type="number" min="1" step="1" value="1" id="newItem'+products[productKey].ProductId+'"/> <a href="#" title="Sepete ekle" onclick="addToCartEvent(\''+products[productKey].ProductId+'\')">+</a></div>'+
										'<div class="product-name">'+products[productKey].DisplayName+'</div>'+
										'<div class="product-price">'+products[productKey].ListPrice+'₺</div>';
					DataReader.appendHtml('li', 'productList', productHtml);
				}
			} 
		}
	};

 return this;
})();
