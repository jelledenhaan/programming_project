/* Jelle den Haan 
 11975458
 project.js
 end project for programming course
*/

'use strict';

var internet_data;
var total_cap = 0;


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
 			// internet_data = d;
 			// console.log(json.market_cap_usd);
 			total_cap = total_cap + Number(json.market_cap_usd)
 			
 			
 		});	
 		console.log(total_cap);

 		internet_data = d;
 		// console.log(internet_data);
 		
 		create_scatter(internet_data)
 		// create_pie(internet_data, total_cap)




 		
	});

 	// console.log(internet_data);

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
		
		if (error) throw error;

		create_line(dash)
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


function create_pie(coin, total_cap){

	var width = $("#donutsvg").width(),
		height = $("#donutsvg").height(),
		radius = Math.min(width, height) / 2;

	var color = d3.scale.ordinal()
    	.range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00", "#0000FF", "#7FFF00", "#B8860B"]);
	
	var arc = d3.svg.arc()
		.outerRadius(radius -10)
		.innerRadius(radius - 70);

	var pie = d3.layout.pie()
		.sort(null)
		.value(function(d) { return d.undefined;});

	var svg = d3.select("body").append("svg")
    	.attr("width", width)
    	.attr("height", height)
  	.append("g")
    	.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    d3.csv("data.csv", type, function(error, data) {
  		if (error) throw error;

  	var g = svg.selectAll(".arc")
    	.data(pie(data))
    	.enter().append("g")
      	.attr("class", "arc");

  	g.append("path")
    	.attr("d", arc)
      	.style("fill", function(d) { return color(d.data.age); });

  	g.append("text")
    	.attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
      	.attr("dy", ".35em")
      	.text(function(d) { return d.data.age; });
});






function create_scatter(coin){

	var svg = d3.select("#scattersvg"),
		margin = {top: 40, right: 15, bottom: 30, left: 5},
		width = $("#scattersvg").width() - margin.left - margin.right,
		height = $("#scattersvg").height() - margin.top - margin.bottom,
		g= svg.append("g")
			.attr("class", "scatter")
			.attr("transform", 
				"translate(" + margin.left + "," + margin.top + ")");
	


	// scaling the x and y axis
	var x = d3.scale.log().range([0, width]);
	var y = d3.scale.log().range([height, 0]);

	// set x and y domain
	x.domain(d3.extent(coin, function(d) { return Number(d.price_usd); })).nice();
	// y.domain(d3.extent(coin, function(d) {console.log(d.market_cap_usd); return d.market_cap_usd; })).nice();
	y.domain([
		d3.min(coin, function(d){ return 0.75 * d.market_cap_usd}),
		d3.max(coin, function(d) { return 1.25 * d.market_cap_usd })]);

	var color = d3.scale.category10();

	var x_axis = d3.svg.axis()
		.scale(x)
		.orient("bottom");

	var y_axis = d3.svg.axis()
		.scale(y)
		.orient("left");


	// append g class for x axis and append text
	svg.append('g')
		.attr('class', 'x axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(x_axis)
    .append('text')
        .attr('class', 'label')
    	.attr('x', width)
     	.attr('y', -6)
     	.style('text-anchor', 'end')
      	.text("price in USDT");

    // append g class for y axis and append text
    svg.append('g')
    	.attr('class', 'y axis')
    	.attr('transform', 'translate(10, 10)')
    	.call(y_axis)
    .append('text')
    	.attr('class', 'label')
    	.attr('transform', 'rotate(-90)')
    	// .attr('transform', 'translate(100, 100)')
    	.attr('y', 10)
    	.attr("x", -width/2)
    	.attr('dy', '.71em')
    	.style('text-anchor', 'end')
    	.text("market_cap_usd");

    // create tooltip 
    var tooltip = d3.select("body").append("div")
		.attr("class", "tooltip")
		.style("opacity", 0);

	// .attr("r", function(d) { return Math.sqrt(d.population / 10000000);})

	// plot circles in scatterplot with right dimensions
	svg.selectAll(".dot")
		.data(coin)
	.enter().append("circle")
	    .attr("class", "dot")
	    .attr("r", 10)
	    .attr("cx", function(d) { return x(d.price_usd); })
      	.attr("cy", function(d) { return y(d.market_cap_usd); })
      	.style("fill", function(d) { return color(d.symbol); })
      	.on("mouseover", function(d) {
        	tooltip.transition()
            	.duration(200)
            	.style("opacity", .9)
            tooltip.html(d.symbol)
            	.style("left", (d3.event.pageX + 5) + "px")
            	.style("top", (d3.event.pageY - 28) + "px");
		})
		.on("mouseout", function(d) {
		    tooltip.transition()
            	.duration(500)
            	.style("opacity", 0);
		});	 	
								
	// append legend to svg 
	var legend = svg.selectAll(".legend")
				.data(color.domain())
			.enter().append("g")
			    .attr("class", "legend")
			    .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

	legend.append("rect")
		.attr("x", width - 17)
		.attr("y", 44)
		.attr("width", 17)
		.attr("height", 17)
		.style("fill", color);

	legend.append("text")
		.attr("x", width - 24)
		.attr("y", 50)
		.attr("dy", ".35em")
		.style("text-anchor", "end")
		.text(function(d) { return d; });	

};