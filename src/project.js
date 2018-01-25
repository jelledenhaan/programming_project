/* Jelle den Haan 
 11975458
 project.js
 end project of programming course
*/

'use strict';

var internet_data;
var total_cap = 0;
var top_button= 20;
var coinData;

var xScatter,
	yScatter,
	colorScatter,
	svgScatter,
	widthScatter,
	radiusDonut,
	heightSCatter;

var xvariableScatter = 'price_usd';
var yvariableScatter = 'market_cap_usd';
var topSelect = 20;

var tooltipScatter; 


var widthDonut,		
	heightDonut,
	radiusDonut,
	colorDonut,
	tooltipDonut,
	svgDonut;
$(function() {

 	$.getJSON('https://api.coinmarketcap.com/v1/ticker/?limit=20', function(d) {
 		

 		$.each(d, function(i, json) {
 			// internet_data = d;
 			// console.log(json.market_cap_usd);
 			total_cap = total_cap + Number(json.market_cap_usd)		
 			
 		});	
 		

 		coinData = d;
 		// console.log(internet_data);
 		
 		create_scatter()
 		create_donut(coinData, total_cap)

 		

 			$(".top-btn").click(function() {
 				
 				topSelect = Number($(this).attr("name"));
 				updatescatterPlot();

 				


 			})
 			$(".x-axis-btn").click(function() {
 				
 				xvariableScatter = $(this).attr("name");

 				updatescatterPlot();

 				


 			})
 			$(".y-axis-btn").click(function() {
 				
 				yvariableScatter = $(this).attr("name");
 				updatescatterPlot();

 				


 			})

	});

 

 	queue()
	.defer(d3.json, "data_json/bitcoin.json")
	.defer(d3.json, "data_json/dash.json")
	.defer(d3.json, "data_json/ethereum.json")
	.defer(d3.json, "data_json/iota.json")
	.defer(d3.json, "data_json/litecoin.json")
	.defer(d3.json, "data_json/monero.json")
	.defer(d3.json, "data_json/nem.json")
	.defer(d3.json, "data_json/neo.json")
	.defer(d3.json, "data_json/omisego.json")
	.defer(d3.json, "data_json/ripple.json")
	.await(init);


 	
	function init(error, bitcoin, dash, ethereum, iota, litecoin, monero, nem, neo, omisego,ripple){
		
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
	var volume = [];
	var market_cap =[];

	// push date to right list
	data.forEach(function(d){ 
		var date = parseDate(d.date);
		// console.log(date);
		low_price.push({date: date, price: d.low});
		high_price.push({date: date, price: d.high});
		market_cap.push({date: date, price: d.market_cap})
		volume.push({date: date, price: d.volume})
		});

	// save data in right form
	var good_data = [{id: "low", values: volume }, {id: "high", values: high_price }];

	// variables for parameters of graph
	var svg = d3.select("#linesvg"),
	margin = {top: 40, right: 20, bottom: 130, left: 50},
		width = $("#linesvg").width() - margin.left - margin.right,
		height = $("#linesvg").height() - margin.top - margin.bottom,
		g= svg.append("g")
			.attr("class", "graph")
			.attr("transform", 
				"translate(" + margin.left + "," + margin.top + ")");

	// scaling the x-axis 
	var x = d3.time.scale().range([0, width]);
	var y = d3.scale.log().range([height, 0]);
	var z = d3.scale.category20();

	// set the domains of x and y axis  
	x.domain(d3.extent(volume, function(d) { return d.date } ));
	y.domain([
		d3.min(low_price, function(d){ return 0.75 * d.price}),
		d3.max(volume, function(d) { return 1.25 * d.price })]);


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


	z.domain([good_data[0].id, good_data[1].id]);
	// console.log(z.domain(good_data.map(function(d) { return d.id; })));
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
    	.style("stroke", function(d) { return z(d.id); });	
    
};


function create_donut(coinData, total_cap){

	widthDonut = $("#donutsvg").width();
	heightDonut = $("#donutsvg").height();
	radiusDonut = Math.min(widthDonut, heightDonut) / 2;

	// var color = d3.scale.ordinal()
 //    	.range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00", "#0000FF", "#7FFF00", "#B8860B"]);
	colorDonut = d3.scale.category20();

	 // // create tooltip 
  //   tooltipDonut = d3.select("body").append("div")
		// .attr("class", "tooltip")
		// .style("opacity", 0);

	var svg = d3.select("#donutsvg")
    	.attr("width", widthDonut)
    	.attr("height", heightDonut)
  	.append("g")
    	.attr("transform", "translate(" + widthDonut / 2 + "," + heightDonut / 2 + ")");

    var arc = d3.svg.arc()
		.outerRadius(radiusDonut - 10)
		.innerRadius(radiusDonut - 70);

	var pie = d3.layout.pie()
		.sort(null)
		.value(function(d) { return d.market_cap_usd;});

    
  	svgDonut = svg.selectAll(".arc")
    	.data(pie(coinData))
    	.enter().append("g")
      	.attr("class", "arc");

  	svgDonut.append("path")
    	.attr("d", arc)
      	.style("fill", function(d) { return colorDonut(d.data.symbol); })
      	.on("mouseover", function(d) {
        	tooltipDonut.transition()
            	.duration(200)
            	.style("opacity", .9)
            tooltipDonut.html(d.data.symbol+ " " + "<br>" +d.data.market_cap_usd)
            	.style("display", "inline-block")
            	.style("left", (d3.event.pageX + 20) + "px")
            	.style("top", (d3.event.pageY - 28) + "px");
		})
		.on("mouseout", function(d) {
		    tooltipDonut.transition()
            	.duration(500)
            	.style("opacity", 0);
		});


  	// svgScatter.append("text")
   //  	.attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
   //    	.attr("dy", ".35em")
   //    	.text(function(d) { return d.data.symbol; });
};


function updateDonut(){

	var newCoinData = [];
	
	for (var i = 0; i < topSelect; i++){
		newCoinData.push(coinData[i]);

	}





	// // create tooltip 
  //tooltipDonut = d3.select("body").append("div")
		// .attr("class", "tooltip")
		// .style("opacity", 0);


}


function create_scatter(){

	var svg = d3.select("#scattersvg"),
		margin = {top: 40, right: 35, bottom: 30, left: 60};
		
	widthScatter = $("#scattersvg").width() - margin.left - margin.right;
	heightSCatter = $("#scattersvg").height() - margin.top - margin.bottom;

	svgScatter = svg.append("g")
			.attr("class", "scatter")
			.attr("transform", 
				"translate(" + margin.left + "," + margin.top + ")");

	// scaling the x and y axis
	xScatter = d3.scale.log().range([0, widthScatter]);
	yScatter = d3.scale.log().range([heightSCatter, 0]);
	colorScatter = d3.scale.category20();
 
	// append g class for x axis and append text
	svgScatter.append('g')
		.attr('class', 'x axis')
        .attr('transform', 'translate(0,' + heightSCatter + ')')
    .append('text')
        .attr('class', 'label')
    	.attr('x', widthScatter-10)
     	.attr('y', -7)
     	.style('text-anchor', 'end')
     	.style("font-weight", "bold");

    // append g class for y axis and append text
    svgScatter.append('g')
    	.attr('class', 'y axis')
    	.attr('transform', 'translate(10, 10)')
    .append('text')
    	.attr('class', 'label')
    	.attr('transform', 'rotate(-90)')
    	// .attr('transform', 'translate(100, 100)')
    	.attr('y', 10)
    	.attr("x", -50)
    	.attr('dy', '.71em')
    	.style('text-anchor', 'end')
    	.style("font-weight", "bold");

    	updatescatterPlot();
}


function updatescatterPlot() {

	var newCoinData = [];
	
	for (var i = 0; i < topSelect; i++){
		newCoinData.push(coinData[i]);

	}
	
	// console.log(coinData, newCoinData);

	// set x and y domain
	xScatter.domain(d3.extent(newCoinData, function(d) { return Number(d[xvariableScatter]); })).nice();
	// y.domain(d3.extent(coin, function(d) {console.log(d.market_cap_usd); return d.market_cap_usd; })).nice();
	yScatter.domain([
		d3.min(newCoinData, function(d){ return 0.75 * +d[yvariableScatter]}),
		d3.max(newCoinData, function(d) { return 1.25 * +d[yvariableScatter] })]);
    // create tooltip 

    colorScatter.domain()

	svgScatter.select(".x")
		.transition()
		.duration(800)
		.call(d3.svg.axis().scale(xScatter).orient("bottom"));

	svgScatter.select(".y")
		.transition()
		.duration(800)
		.call(d3.svg.axis().scale(yScatter).orient("left"));

	svgScatter.select(".x")
		.select("text").text(xvariableScatter);

	svgScatter.select(".y")
		.select("text").transition().duration(750).text(yvariableScatter);

	tooltipScatter = d3.select("body").append("div")
	.attr("class", "tooltip")
	.style("opacity", 0);


	// plot circles in scatterplot with right dimensions
	var circles = svgScatter.selectAll(".dot")
		.data(newCoinData);

	circles.exit().remove()
		.transition()
		.duration(800);

	circles
		.transition()
		.duration(800)
		.attr("cx", function(d) {console.log("hoi", +d[xvariableScatter]); return xScatter(+d[xvariableScatter]); })
      	.attr("cy", function(d) { return yScatter(+d[yvariableScatter]); })
      	.style("fill", function(d) { return colorScatter(d.symbol); });

	circles.enter().append("circle")
		.transition()
		.duration(800)
	    .attr("class", "dot")
	    .attr("r", 10)
	    .attr("cx", function(d) { return xScatter(+d[xvariableScatter]); })
      	.attr("cy", function(d) { return yScatter(+d[yvariableScatter]); })
      	.style("fill", function(d) { return colorScatter(d.symbol); });
      	

      	circles.on("mouseover", function(d) {
        	tooltipScatter.transition()
            	.duration(200)
            	.style("opacity", .9)
            tooltipScatter.html(d.name + "<br>" + xvariableScatter + ":" +d[xvariableScatter] + "<br>" + yvariableScatter + ":" +d[yvariableScatter])
            	.style("display", "inline-block")
            	.style("left", (d3.event.pageX + 20) + "px")
            	.style("top", (d3.event.pageY - 28) + "px");
		})
		.on("mouseout", function(d) {
		    tooltipScatter.transition()
            	.duration(500)
            	.style("opacity", 0);
		});	 	
													
	// append legend to svg 
	var legend = svgScatter.selectAll(".legend")
				.data(colorScatter.domain())
			.enter().append("g")
			    .attr("class", "legend")
			    .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

	legend.append("rect")
		.attr("x", widthScatter - 17)
		.attr("y", 44)
		.attr("width", 17)
		.attr("height", 17)
		.style("fill", colorScatter);

	legend.append("text")
		.attr("x", widthScatter - 24)
		.attr("y", 50)
		.attr("dy", ".35em")
		.style("text-anchor", "end")
		.text(function(d) { return d; });	

};

// function update_scatter(coin) {


// 	var depends on button;
// 	console.log(coin);
// 	var top_list = [];
// 	for (var i = 0; i < depends on button; i++){
// 		top_list.push(coin[i]);

// 	}

// 	console.log(top_list);


// 	// set x and y domain
// 	x.domain(d3.extent(coin, function(d) { return Number(d.price_usd); })).nice();
// 	// y.domain(d3.extent(coin, function(d) {console.log(d.market_cap_usd); return d.market_cap_usd; })).nice();
// 	y.domain([
// 		d3.min(coin, function(d){ return 0.75 * d.market_cap_usd}),
// 		d3.max(coin, function(d) { return 1.25 * d.market_cap_usd })]);

// 	// append g class for x axis and append text
// 	g.append('g')
// 		.attr('class', 'x axis')
//         .attr('transform', 'translate(0,' + height + ')')
//         .call(x_axis)
//     .append('text')
//         .attr('class', 'label')
//     	.attr('x', width-10)
//      	.attr('y', -7)
//      	.style('text-anchor', 'end')
//      	.style("font-weight", "bold")
//       	.text("price in USD");

//     // append g class for y axis and append text
//     g.append('g')
//     	.attr('class', 'y axis')
//     	.attr('transform', 'translate(10, 10)')
//     	.call(y_axis)
//     .append('text')
//     	.attr('class', 'label')
//     	.attr('transform', 'rotate(-90)')
//     	// .attr('transform', 'translate(100, 100)')
//     	.attr('y', 10)
//     	.attr("x", -50)
//     	.attr('dy', '.71em')
//     	.style('text-anchor', 'end')
//     	.style("font-weight", "bold")
//     	.text("market cap in USD");


// 	// plot circles in scatterplot with right dimensions
// 	g.selectAll(".dot")
// 		.data(coin)
// 	.enter().append("circle")
// 	    .attr("class", "dot")
// 	    .attr("r", 10)
// 	    .attr("cx", function(d) { return x(d.price_usd); })
//       	.attr("cy", function(d) { return y(d.market_cap_usd); })
//       	.style("fill", function(d) { return color(d.symbol); })
//       	.on("mouseover", function(d) {
//         	tooltip.transition()
//             	.duration(200)
//             	.style("opacity", .9)
//             tooltip.html(d.name + "<br>" +d.price_usd + "<br>" +d.market_cap_usd)
//             	.style("display", "inline-block")
//             	.style("left", (d3.event.pageX + 20) + "px")
//             	.style("top", (d3.event.pageY - 28) + "px");
// 		})
// 		.on("mouseout", function(d) {
// 		    tooltip.transition()
//             	.duration(500)
//             	.style("opacity", 0);
// 		});	 	
													
// 	// append legend to svg 
// 	var legend = svg.selectAll(".legend")
// 				.data(color.domain())
// 			.enter().append("g")
// 			    .attr("class", "legend")
// 			    .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

// 	legend.append("rect")
// 		.attr("x", width - 17)
// 		.attr("y", 44)
// 		.attr("width", 17)
// 		.attr("height", 17)
// 		.style("fill", color);

// 	legend.append("text")
// 		.attr("x", width - 24)
// 		.attr("y", 50)
// 		.attr("dy", ".35em")
// 		.style("text-anchor", "end")
// 		.text(function(d) { return d; });	


// // };