/* Jelle den Haan 
 11975458
 project.js
 end project for programming course
*/

'use strict';

$(function() {

	// var xhttp = new XMLHttpRequest();
	// xhttp.onreadystatechange = function() {
 //    	if (this.readyState == 4 && this.status == 200) {
 //       	// Typical action to be performed when the document is ready:
 //       	console.log(xhttp.responseText);
 //       	document.getElementById("rawdata").innerHTML = xhttp.responseText;

 //    }
 	$.getJSON('https://api.coinmarketcap.com/v1/ticker/?limit=10', function(d) {
 		$.each(d, function(i, json) {
 			console.log(json.id);
 		});
 	});

});


// xhttp.open("GET",'https://api.coinmarketcap.com/v1/ticker/bitcoin/', true);
// xhttp.send();
// console.log($("#rawdata").innerHTML);

// });

