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
 		// $.each(d, function(i, json) {
 		// 	console.log(json.id);
 		// });	
	});


 	queue()
	.defer(d3.json, "data_json/bitcoin.json")
	.defer(d3.json, "data_json/dash.json")
	.await(init);
	// .defer(d3.json, "ethereum.json")
	// .defer(d3.json, "iota.json")
	// .defer(d3.json, "litecoin.json")
	// .defer(d3.json, "monero.json")
	// .defer(d3.json, "nem.json")
	// .defer(d3.json, "neo.json")
	// .defer(d3.json, "omisego.json")
	// .defer(d3.json, "ripple.json")
	// .await(init);

	// , ethereum, iota, litecoin, monero, nem, neo, omisego,ripple
 	
	function init(error, bitcoin, dash){
		// console.log(bitcoin);
		if (error) throw error;

		create_line(dash)
	};


});

function create_line(coin){

	var parseDate = d3.time.format("%Y/%m/%d").parse

	// first make sure that the data is in the right form 
    // variables to store data
    var data = coin;
    var low_price = [];
	var high_price = [];
	

	// push date to right list
	data.forEach(function(d){ 
		var date = parseDate(d.date);
		// console.log(date);
		low_price.push({date: date, price: d.low});
		high_price.push({date: date, price: d.high});
		});

	// save data in right form
	var good_data = [{id: "low", values: low_price }, {id: "high", values: high_price }];

	// variables for parameters of graph
	var svg = d3.select("#linesvg"),
	margin = {top: 40, right: 20, bottom: 130, left: 50},
		width = 1200 - margin.left - margin.right,
		height = 500 - margin.top - margin.bottom,
		g= svg.append("g")
			.attr("class", "graph")
			.attr("transform", 
				"translate(" + margin.left + "," + margin.top + ")");

	// scaling the x-axis 
	var x = d3.time.scale().range([0, width]);
	var y = d3.scale.log().range([height, 0]);
	var z = d3.scale.ordinal(d3.schemeCategory10);

	// set the domains of x and y axis  
	x.domain(d3.extent(low_price, function(d) { return d.date } ));
	y.domain([
		d3.min(low_price, function(d){ return 0.75 * d.price}),
		d3.max(high_price, function(d) { return 1.25 * d.price })]);

	// define and create x axis
	var x_axis = d3.svg.axis().scale(x)
		.orient("bottom");
		// .ticks(17)
		// .tickFormat(function(d){ return d;});

	// define and create y axis
	var y_axis = d3.svg.axis().scale(y)
		.orient("left");
		// .ticks(15);

	// append x axis to g element
	g.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(x_axis);

	// append y axis to g element
	g.append("g")
		.attr("class", "y axis")
		.attr("transform", "translate(0," + height + ")")
		.attr("transform", "rotate(-0)")
		.call(y_axis);		


	z.domain(good_data.map(function(d) { return d.id; }));

	// // variables to draw lines 
  	var line = d3.svg.line()
	    .x(function(d) { return x(d.date); })
	    .y(function(d) { return y(d.price); });

 	var point= g.selectAll(".point")
		.data(good_data)
		.enter().append("g")
			.attr("class", "point" );

	// draw lines 
    point.append("path")
    	.attr("class", "line")
    	.attr("d", function(d) { return line(d.values); })
    	.style("stroke", "black")
    	.style("fill", "none");	
};