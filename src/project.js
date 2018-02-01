/* Jelle den Haan 
 11975458
 project.js
 end project of programming course
*/

'use strict';

var coin_data;

// variables line chart
var width_line,
	height_line,
	svg_line,
	x_line,
	y_line,
	z_line;
var line_data;
var line_variable;
var scale = "logaritmic";
var selector = 0;
var title = "Bitcoin";

// variables scatterplot
var x_scatter,
	y_scatter,
	color_scatter,
	svg_scatter,
	width_scatter,
	height_scatter;

var x_title = "Price ($)"
var y_title = "Marketcap ($)"
var xvariable_scatter = "price_usd";
var yvariable_scatter = "market_cap_usd";
var top_select = 20;

var tooltip_scatter; 

// variables donutchart
var width_donut,		
	height_donut,
	radius_donut,
	color_donut,
	tooltip_donut,
	arc_donut,
	pie_donut,
	svg_donut;

$(function() {

 	$.getJSON("https://api.coinmarketcap.com/v1/ticker/?limit=20", function(d) {
 		
 		// store API data in global variable
 		coin_data = d;
 		 		
 		// create the default scatter and donut chart
 		create_scatter()
 		create_donut()

 			// button listeners in order to update the graphs
 			$(".top-btn").click(function() {
 				
 				// change selection of coins and update scatter and donut chart
 				top_select = Number($(this).attr("name"));
 				
 				update_scatter();
 				update_donut();	

 			})
 			
 			$(".x-axis-btn").click(function() {
 				
 				// change x variable and x axis and call update scatter function
 				xvariable_scatter = $(this).attr("name");
 				x_title = $(this).attr("id");

 				update_scatter();

 			})
 			
 			$(".y-axis-btn").click(function() {
 				
 				// change y variable and y axis and call update scatter function
 				yvariable_scatter = $(this).attr("name");
 				y_title = $(this).attr("id");

 				update_scatter();

 			})

 			$(".currency").click(function() {
 				
 				// update title and call update line 
 				title = $(this).attr("id");
 				update_line(line_data[+$(this).attr("name")]);
 				selector = +$(this).attr("name");

 			})

 			$(".scale").click(function() {
 				
 				// update scale and cale update line function
 				scale = $(this).attr("name");
 				
 				update_line(line_data[selector]);
 			
 			})
	});

	// load all json files 
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

	function init(error, Bitcoin, Dash, Ethereum, IOTA, Litecoin, Monero, NEM, NEO, Omisego, Ripple){
		
		// check for error 
		if (error) throw error;

		// arrays that contain different coins that can be showed in linegraph
		line_data = [Bitcoin, Dash, Ethereum, IOTA, Litecoin, Monero, NEM, 
		NEO, Omisego, Ripple];
		
		line_variable = ["Bitcoin", "Dash", "Ethereum", "IOTA", "Litecoin", 
		"Monero", "NEM", "NEO", "Omisego", "Ripple"];
		
		create_line(line_data[0]);
		update_line(line_data[0]);
	};

});


function create_line(coin){

	// variables for parameters of the linegraph
	var svg = d3.select("#linesvg"),
	margin = {top: 40, right: 20, bottom: 130, left: 60};

	width_line = $("#linesvg").width() - margin.left - margin.right,
	height_line = $("#linesvg").height() - margin.top - margin.bottom,
	svg_line = svg.append("g")
				.attr("class", "graph")
				.attr("transform", 
					"translate(" + margin.left + "," + margin.top + ")");

	// append x axis class to svg element
	svg_line.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height_line + ")")
		.append("text")
        .attr("class", "label")
    	.attr("x", width_line-10)
     	.attr("y", -7)
     	.style("text-anchor", "end")
     	.style("font-weight", "bold");

	// append y axis class to svg element
	svg_line.append("g")
		.attr("class", "y axis")
		.attr("transform", "translate(0," + height_line + ")")
		.attr("transform", "rotate(-0)")
		.append("text")
    	.attr("class", "label")
    	.attr("transform", "rotate(-90)")
    	.attr("y", 10)
    	.attr("x", -50)
    	.attr("dy", ".71em")
    	.style("text-anchor", "end")
    	.style("font-weight", "bold");
		   
};

function update_line(coin){

	// function to parse the date
	var parse_date = d3.time.format("%Y/%m/%d").parse
	
    // variables to store data
    var data = coin;
    var low_price = [];
	var high_price = [];
	var volume = [];
	var market_cap =[];

	// push date to right list
	data.forEach(function(d){ 
		
		var date = parse_date(d.date);
		low_price.push({date: date, price: d.low});
		high_price.push({date: date, price: d.high});
		market_cap.push({date: date, price: d.market_cap})
		volume.push({date: date, price: d.volume})
		
		});

	// if statement to determine which scale the user selected
	if (scale == "linear") {

		// change all variables if scale is changed
		y_line = d3.scale.linear().range([height_line, 0]);
		var good_data = [{id: "high", values: high_price}];
			y_line.domain([
		d3.min(low_price, function(d){ return 0.75 * d.price}),
		d3.max(low_price, function(d) { return 1.5 * d.price })]);
		// z_line.domain([good_data[0].id]);

	}

	else {
		
		y_line = y_line = d3.scale.log().range([height_line, 0]);
		var good_data = [{id: "high", values: high_price }, {id: "low", values: volume }];
		y_line.domain([
		d3.min(low_price, function(d){ return 0.75 * d.price}),
		d3.max(volume, function(d) { return 1.25 * d.price })]);
		// z_line.domain([good_data[0].id, good_data[1].id]);
	};

	// scaling the x-axis
	x_line = d3.time.scale().range([0, width_line]);
	
	// determine domain of x axis
	x_line.domain(d3.extent(low_price, function(d) { return d.date } ));
	
	// select x axis to update this axis
	svg_line.select(".x")
		.transition()
		.duration(800)
		.call(d3.svg.axis().scale(x_line).orient("bottom"));

	// select y axis to update this axis
	svg_line.select(".y")
		.transition()
		.duration(800)
		.call(d3.svg.axis().scale(y_line).orient("left"));

	// append x axis title
	svg_line.select(".x")
		.select("text").text("Date");

	// append y axis title
	svg_line.select(".y")
		.select("text").transition().duration(750).text("($)");

	// variables to draw lines 
  	var line = d3.svg.line()
	    .x(function(d) { return x_line(d.date); })
	    .y(function(d) { return y_line(d.price); });

	// set color for the lines
	var line_color = ["slategray", "black"]

	// select new data 
	var punt = svg_line.selectAll(".point").data(good_data)

	// remove the old line
	svg_line.selectAll(".line").remove();

	punt.exit().remove()
		.transition()
		.duration(800);

	// enter and append new path in order to draw new line
	punt.enter().append("path")
		.attr("class", "line")
    	.attr("d", function(d) { return line(d.values); })
    	// .style("stroke", function(d) { return z_line(d.id); })
    	.style("stroke", function(d, i) { return line_color[i]; })
    	.style("fill", "none");

   	// append text to graph 
   	svg_line.selectAll(".text").remove();
    svg_line.append("text") 
    		.attr("class", "text")     
	        .attr("x", width_line/1.6)
	        .attr("y",  -10 )
	        .style("text-anchor", "middle")
	        .attr("font-size", "20px")
	        .attr("text-decoration", "underline") 
	        .text(title);

	svg_line.append("text") 
    		.attr("class", "legendLine")     
	        .attr("x", width_line/3)
	        .attr("y",  525 )
	        .style("text-anchor", "middle")
	        .attr("font-size", "20px")
	        .style("fill", "slategray")
	        .text("Price ($)");

	svg_line.append("text") 
		.attr("class", "legendLine")     
        .attr("x", width_line/7)
        .attr("y",  525 )
        .style("text-anchor", "middle")
        .attr("font-size", "20px")
        .style("fill", "black")
        .text("24h Volume ($)");

};

function create_scatter(){

	// determine parameters of scatter svg
	var svg = d3.select("#scattersvg"),
		margin = {top: 40, right: 90, bottom: 30, left: 50};
		
	width_scatter = $("#scattersvg").width() - margin.left - margin.right;
	height_scatter = $("#scattersvg").height() - margin.top - margin.bottom;

	// append g element to svg
	svg_scatter = svg.append("g")
			.attr("class", "scatter")
			.attr("transform", 
				"translate(" + margin.left + "," + margin.top + ")");

	// scaling the x and y axis and scaling the color (same as donutchart)
	x_scatter = d3.scale.log().range([0, width_scatter]);
	y_scatter = d3.scale.log().range([height_scatter, 0]);
	color_scatter = d3.scale.category20();
 
	// append x axis class and determine text position and style
	svg_scatter.append("g")
		.attr("class", "x axis")
        .attr("transform", "translate(0," + height_scatter + ")")
    .append("text")
        .attr("class", "label")
    	.attr("x", width_scatter-10)
     	.attr("y", -7)
     	.style("text-anchor", "end")
     	.style("font-weight", "bold");

    // append y axis class and determine text position and style
    svg_scatter.append("g")
    	.attr('class', "y axis")
    	.attr("transform", "translate(10, 10)")
    .append("text")
    	.attr("class", "label")
    	.attr("transform", "rotate(-90)")
    	.attr("y", 10)
    	.attr("x", -50)
    	.attr("dy", ".71em")
    	.style("text-anchor", "end")
    	.style("font-weight", "bold");

    	update_scatter();

};

function update_scatter() {

	// variable to store data
	var newcoin_data = [];
	
	// change size of data if needed
	for (var i = 0; i < top_select; i++){
		newcoin_data.push(coin_data[i]);

	}
	
	// set x and y domain of scatterplot
	x_scatter.domain(d3.extent(newcoin_data, function(d)
		{ return Number(d[xvariable_scatter]); })).nice();
	y_scatter.domain([
		d3.min(newcoin_data, function(d){ return 0.75 * +d[yvariable_scatter]}),
		d3.max(newcoin_data, function(d) { return 1.25 * +d[yvariable_scatter] })]);

	// set domain
    color_scatter.domain()

	// select x axis to change the axis
	svg_scatter.select(".x")
		.transition()
		.duration(800)
		.call(d3.svg.axis().scale(x_scatter).orient("bottom"));

	// select y axis to change the axis
	svg_scatter.select(".y")
		.transition()
		.duration(800)
		.call(d3.svg.axis().scale(y_scatter).orient("left"));

	// select x axis and apply title to axis 
	svg_scatter.select(".x")
		.select("text").text(x_title);

	// select y axis and apply title to axis
	svg_scatter.select(".y")
		.select("text").transition().duration(750).text(y_title);

	// create tooltip 
	tooltip_scatter = d3.select("body").append("div")
	.attr("class", "tooltip")
	.style("opacity", 0);


	// select dots and update data
	var circles = svg_scatter.selectAll(".dot")
		.data(newcoin_data);

	// remove the old data 
	circles.exit().remove()
		.transition()
		.duration(800);

	// change circle positions in scatterplot
	circles
		.transition()
		.duration(800)
		.attr("cx", function(d) { return x_scatter(+d[xvariable_scatter]); })
      	.attr("cy", function(d) { return y_scatter(+d[yvariable_scatter]); })
      	.style("fill", function(d) { return color_scatter(d.symbol); });

	// append new data to circles and create them
	circles.enter().append("circle")
		.transition()
		.duration(800)
	    .attr("class", function(d){ return "dot " + d.id;})
	    .attr("id", function(d){ return d.id;})
	    .attr("r", 10)
	    .attr("cx", function(d) { return x_scatter(+d[xvariable_scatter]); })
      	.attr("cy", function(d) { return y_scatter(+d[yvariable_scatter]); })
      	.style("fill", function(d) { return color_scatter(d.symbol); })
      	.style("stroke", "black")
      	.style("stroke-width", "2.5px");
      	

  	// apply tooltip to scatterdots when hovering over them
  	circles.on("mouseover", function(d) {
    	tooltip_scatter.transition()
        	.duration(200)
        	.style("opacity", .9)
        tooltip_scatter.html(d.name + "<br>" + x_title + ":" +d[xvariable_scatter]
        	+ "<br>" + y_title + ":" +d[yvariable_scatter])
        	.style("display", "inline-block")
        	.style("left", (d3.event.pageX + 20) + "px")
        	.style("top", (d3.event.pageY - 28) + "px");

		// change opacity of other dots
		var self = this
		d3.selectAll(".dot").filter(function(x) { return self != this})
		.style("opacity", .2);

		// change stroke of donutchart when hovering over dots
		var id = this["id"]
		svg_donut.selectAll("#"+id).style("stroke", "black")
			.style("stroke-width", "2.5px");

	})
	.on("mouseout", function(d) {
	    tooltip_scatter.transition()
        	.duration(500)
        	.style("opacity", 0);
        	d3.selectAll(".dot").style("opacity", 1);
        	
        	var id = this["id"]
			svg_donut.selectAll("#"+id).style("stroke", "white");

	});	

	// apply on click function on dots in order to update linegraph
	circles.on("click", function(d) {
		clickDonut(d.name);
	
	});
												
	// create variable to append legend  
	var legend = svg_scatter.selectAll(".legend")
				.data(color_scatter.domain())
			.enter().append("g")
			    .attr("class", "legend")
			    .attr("transform", function(d, i) 
			    	{ return "translate(0," + i * 20 + ")"; });

	// append rectangles to legend on right position
	legend.append("rect")
		.attr("x", width_scatter + 70)
		.attr("y", 44)
		.attr("width", 17)
		.attr("height", 17)
		.style("fill", color_scatter)
		.style("stroke","black");

	// append text to legend on right position
	legend.append("text")
		.attr("x", width_scatter + 63)
		.attr("y", 50)
		.attr("dy", ".35em")
		.style("text-anchor", "end")
		.text(function(d) { return d; });	

};

function create_donut(){

	// determine parameters of donutchart
	width_donut = $("#donutsvg").width();
	height_donut = $("#donutsvg").height();
	radius_donut = Math.min(width_donut, height_donut) / 2;

	// set colors of donutchart (same as scatterplot)
	color_donut = d3.scale.category20();

	// create tooltip 
    tooltip_donut = d3.select("body").append("div")
		.attr("class", "tooltip")
		.style("opacity", 0);

	// create svg
	var svg = d3.select("#donutsvg")
    	.attr("width", width_donut)
    	.attr("height", height_donut)
  	.append("g")
    	.attr("transform", "translate(" + width_donut / 2 + "," 
    		+ height_donut / 2 + ")");

    // determine inner and outer radius
    arc_donut = d3.svg.arc()
		.outerRadius(radius_donut - 10)
		.innerRadius(radius_donut - 70);

	// select which data to show 
	pie_donut = d3.layout.pie()
		.sort(null)
		.value(function(d) { return d.market_cap_usd;});
 
	update_donut();

};

function update_donut(){

	// variables to store new data
	var newcoin_data = [];
	var total_cap = 0;
	
	// change size of data if user wants to view more/less coins
	for (var i = 0; i < top_select; i++){
		newcoin_data.push(coin_data[i]);
		total_cap +=  Number(newcoin_data[i].market_cap_usd)
	}

    // select svg to apply changes
    svg_donut = d3.select("#donutsvg").attr("width", width_donut)
			.attr("height", height_donut);
  	svg_donut = svg_donut.select("g")
			.attr("transform", "translate(" + width_donut / 2 + ","
				+ height_donut / 2 + ")");
    
    // new variable to store new data
    var pieces = svg_donut.selectAll(".arc")
    	.data(pie_donut(newcoin_data));

    // pieces.selectAll(".path").remove();

    // remove old data
    pieces.exit().remove()
    	.transition()
    	.duration(750);

  	// append new path when graph needs to be updated
  	pieces.enter().append("path")
    	.attr("d", arc_donut)
    	.attr("id",function(d){ return d.data.id;})
    	.style("fill", "lightgrey")
    	.transition()
    	.duration(1500)
      	.style("fill", function(d) { return color_donut(d.data.symbol); })
      	.style("stroke", "white")
      	.style("stroke-width", "2.5px");
      	
    // apply tooltip on pieces of donutchart and make sure user can hover 
    // over the pieces in order to change stroke of dots in scatterplot
  	pieces.on("mouseover", function(d) {
    	tooltip_donut.transition()
        	.duration(200)
        	.style("opacity", .9)
        tooltip_donut.html(d.data.name +  "<br>" + "Marketcap ($):" + 
        		+d.data.market_cap_usd + "<br>" + "% of top " + top_select + ": " 
        		+((d.data.market_cap_usd/total_cap)*100))
        			.style("display", "inline-block")
        			.style("left", (d3.event.pageX + 20) + "px")
        			.style("top", (d3.event.pageY - 28) + "px");
        	
        	// change stroke of scatterdots when hovering over donutchart
        	var id = this["id"]
			svg_scatter.selectAll("#"+id).style("stroke", "red");
		})
		.on("mouseout", function(d) {
		    tooltip_donut.transition()
            	.duration(500)
            	.style("opacity", 0);
            	
 			// change stroke of scatterdots back to normal
        	var id = this["id"]
			svg_scatter.selectAll("#"+id).style("stroke", "black");
		});

		// make sure pieces are clickable in order to update linegraph
		pieces.on("click", function(d) {
			clickDonut(d.data.name);
		});

		// select text and remove old text
		svg_donut.selectAll(".text").remove();
    	
    	// append new text to donutchart when updated
    	svg_donut.append("text") 
    		.attr("class", "text")     
	        .attr("x", width_donut /4)
	        .attr("y",  height_donut/50 )
	        .style("text-anchor", "end")
	        .attr("font-size", "10px")
	        .attr("font-weight", "bold")
	        .attr("text-decoration", "underline") 
	        .text("Total marketcap of top" + " " + top_select + ":" + " "
	        + total_cap);

};

function clickDonut(currency){

	// check if variable is in list of currencies
	var a = line_variable.indexOf(currency);

	// if variable is in list, change data to update linegraph
	if ( a != -1 ){
		title = currency;
		selector = a;
		update_line(line_data[a]);
		$("html, body").animate({ scrollTop: 0 }, "slow");
	
	}
	// show alert message if there is no data of the desired currency
	else {
			alert("Sorry! There is no historical data of this currency");
	};

};

