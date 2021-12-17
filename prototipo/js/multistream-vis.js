var pathCandadoOpen =  "./img/icon_lock_open.svg";
var pathCandadoClose = "./img/icon_lock_close.svg";
var pathEyeOpen = "./img/eye_open.svg";
var pathEyeClose = "./img/eye_close.svg";

var eventsArray = [

	//STORIES
	{"label":"story","pathImg":"img/events/news.png","iconVisible":true,"aggregation":true,"order":20,"mobil":false},
	{"label":"tweet","pathImg":"img/events/tweet.png","iconVisible":true,"aggregation":true,"order":20,"mobil":false},
	//SOCCER
	{"label":"home_attack","pathImg":"img/events/home_attack.png","iconVisible":true,"aggregation":true,"order":0,"mobil":false},
	{"label":"away_attack","pathImg":"img/events/away_attack.png","iconVisible":true,"aggregation":true,"order":1,"mobil":false},
	{"label":"yellow_card","pathImg":"img/events/yellow_card.png","iconVisible":true,"aggregation":true,"order":2,"mobil":true},
	{"label":"red_card","pathImg":"img/events/red_card.png","iconVisible":true,"aggregation":false,"order":3,"mobil":true},
	{"label":"offside","pathImg":"img/events/offside.png","iconVisible":true,"aggregation":true,"order":4,"mobil":false},
	{"label":"corner","pathImg":"img/events/corner.png","iconVisible":true,"aggregation":true,"order":5,"mobil":false,"story":false},
	{"label":"penalty","pathImg":"img/events/penalty.png","iconVisible":true,"aggregation":false,"order":6,"mobil":false,"story":false},
	{"label":"penalty_fail","pathImg":"img/events/penalty_fail.png","iconVisible":true,"aggregation":false,"order":7,"mobil":true},
	{"label":"goal_penalty","pathImg":"img/events/goal_penalty.png","iconVisible":true,"aggregation":false,"order":8,"mobil":true},
	{"label":"goal","pathImg":"img/events/goal.png","iconVisible":true,"aggregation":false,"order":9,"mobil":true},
	//BYCICLE RACE
	{"label":"stage_start","pathImg":"img/events/stage_start.png","iconVisible":true,"aggregation":false,"order":0,"mobil":false},
	{"label":"stage_finish","pathImg":"img/events/stage_finish.png","iconVisible":true,"aggregation":false,"order":0,"mobil":false},
	{"label":"stage_third_place","pathImg":"img/events/stage_third_place.png","iconVisible":true,"aggregation":false,"order":1,"mobil":true},
	{"label":"stage_second_place","pathImg":"img/events/stage_second_place.png","iconVisible":true,"aggregation":false,"order":2,"mobil":true},
	{"label":"stage_first_place","pathImg":"img/events/stage_first_place.png","iconVisible":true,"aggregation":false,"order":3,"mobil":true},
	//TENNIS
	{"label":"start","pathImg":"img/events/start.png","iconVisible":true,"aggregation":false,"order":0,"mobil":false},
	{"label":"finish","pathImg":"img/events/finish.png","iconVisible":true,"aggregation":false,"order":0,"mobil":false},
	{"label":"score","pathImg":"img/events/score.png","iconVisible":true,"aggregation":false,"order":1,"mobil":false},
	{"label":"tie_break","pathImg":"img/events/tie_break.png","iconVisible":true,"aggregation":false,"order":2,"mobil":false},
	{"label":"point","pathImg":"img/events/point.png","iconVisible":true,"aggregation":false,"order":3,"mobil":false},
	{"label":"winner","pathImg":"img/events/winner.png","iconVisible":true,"aggregation":false,"order":4,"mobil":false},

	//UFC
	{"label":"start_main_event","pathImg":"img/events/start_main_event.png","iconVisible":true,"aggregation":false,"order":0,"mobil":false},
	{"label":"finish_main_event","pathImg":"img/events/finish_main_event.png","iconVisible":true,"aggregation":false,"order":1,"mobil":false},
	{"label":"winner_ufc","pathImg":"img/events/winner_ufc.png","iconVisible":true,"aggregation":false,"order":2,"mobil":false}
];
var eventsNestedByDate = [];


var storiesInit;




var minInputValue = 1;
var maxInputValue = 100;
var stepInputValue= 1;

var svg_multistream_vis; 
var blocage = false;
var verticalRuler;
var verticalRulerBackground;

var tooltipStories;
var tooltipEvents;
var tooltip;
var tooltipFlag = new Date();
var storyDateFlag = new Date();

//
var sDisLeft;
var sDisRight;

//
var scaleFlowLabel = d3.scale.sqrt();
var nest_by_key = d3.nest().key(function(d) {return d.key;});
var stack = d3.layout.stack()
				.values(function(d) {return d.values;})
				.x(function(d) {return d.date;})
				.y(function(d) {return d.value;});

function orderTest(data) {
	return d3.range(data.length);
}


//===============================================
/* MULTIRESOLUTION */
var multiresolution;
var yScaleMultiresolution = d3.scale.linear();
var yAxisMultiresolution = d3.svg.axis().scale(yScaleMultiresolution)
																			.tickSize(5, 0)
																			.tickPadding(5)
																			.ticks(10)
																			.tickFormat(customNumberFormat)
																			.orient("left");

var scalesMultiresolution = []; 
var axisMultiresolution = [];
var rangesDomainMultiresolution=[];
var marginMultiresolution;
var heightMultiresolution;
//===============================================

var heightGapFocusContext;

//===============================================
/*  CONTEXT */
var areaContext = d3.svg.area()
					.x(function(d) { return xScaleContext(d.date);})
					.y0(function(d) {return yScaleContext(d.y0);})
					.y1(function(d) {return yScaleContext(d.y0 + d.y);}); 

var marginContext;
var widthIntern;
var heightContext;

var flowContext; 
var context;
var beginContext;


//1 Scales
//2 Axis

//SCALE
var yScaleContext = d3.scale.linear();
var xScaleContext = d3.time.scale(); 
var xScaleContextDisLeft = d3.time.scale(); 
var xScaleContextNorLeft = d3.time.scale();  
var xScaleContextDisRight = d3.time.scale(); 
var xScaleContextNorRight = d3.time.scale();

//AXIS
var xAxisContext = d3.svg.axis().scale(xScaleContext)
							 .tickSize(5, 0) //(tickSize, extremSize)
							 .tickPadding(7)
							//  .ticks(10)
							 .tickFormat(customTimeFormat)
							 .orient("bottom");
							 
var yAxisContext = d3.svg.axis().scale(yScaleContext)
						.tickSize(-5, 0)
						.tickPadding(5)
						.orient("left");



//BRUSH
var brushContext = d3.svg.brush();
var brushContextDisLeft = d3.svg.brush();
var brushContextNorLeft = d3.svg.brush();
var brushContextDisRight = d3.svg.brush(); 
var brushContextNorRight = d3.svg.brush();

//To improve the responde of the app
//to just update data when there is a really change of the mouse pointer
var brushContextFlag = [];
var brushContextNorLeftFlag = [];
var brushContextNorRightFlag = [];
var brushContextDisLeftFlag = [];
var brushContextDisRightFlag = [];

//==================================================
//DATA CURRENTLY
var dataCurrentlyContext;
var dataCurrentlyMultiresolution;
var data_bottom_level;
var data_top_level;
//=================================================

var lockedLeft= true;
var lockedRight=true;
var topKCategoriesTooltip =5;


function updateFlows(){
	
	//--CONTEXT---
	dataCurrentlyContext = stack(nest_by_key.entries(nivel_context_origin));
	dataCurrentlyContext.forEach(function(node){
		var node_hierarchy = jerarquiaOrigen.getNodeByKey(node.key);
		node.key = node_hierarchy.key;
		node.category = node_hierarchy.name;
		
		if(optsMultiresolution.layersFadingColors){
			node.color = node_hierarchy.color.desaturate().brighten(layersFadingColorsFactor);
		}else{
			node.color = node_hierarchy.color;
		}
	});
	

	
	xScaleContext.domain(dateExtRange);

	//Update Axis
	let maxDomainYScale = d3.max(nivel_context_origin, function(d) {return d.y0 + d.y;});
	yScaleContext.domain([ 0, maxDomainYScale + (maxDomainYScale*0.05)]);//add 10% of value to this axis
	
	//Flows in OVERVIEW
	var fContext = context.select("#flowsInContext").selectAll(".area") //just for 4 flow, 1 level
						.data(dataCurrentlyContext,function (d){return d.key;});

	//UPDATE Context
	fContext.transition()
			.duration(durationTransition)
				.attr("d",  function(d) {return areaContext(d.values);})
				.style({
						"fill" : function(d) {return d.color;},
						"stroke" : function(d) {return d.color;},
						"opacity":1
				});
	
	//ENTER Context
	fContext.enter()
			.append("path")
			.attr("id", function(d){return "area_" + d.key;})
			.attr("class", "area")
			.style("opacity",0)
		.transition()
		.duration(durationTransition)
			.attr("d", function(d) {return areaContext(d.values);})
			.style({
					"fill" : function(d) {return d.color;},
					"stroke" : function(d) {return d.color;},
					"opacity":1
			});
	
	//EXIT Context
	fContext.exit().transition()
				.duration(durationTransition)
					.style("opacity", 0)
					.remove();	
	
	context.select(".x.axis.context").call(xAxisContext);	
	
	
	//--MULTIRESOLUTION---
	dataCurrentlyMultiresolution = stack(nest_by_key.entries(nivel_focus_origin));//Used in Focus Local
	dataCurrentlyMultiresolution.forEach(function(node){
		var node_hierarchy = jerarquiaOrigen.getNodeByKey(node.key);
		node.key = node_hierarchy.key;
		node.category = node_hierarchy.name;
		node.color =  node_hierarchy.color;
	});

	//Update Axis
	yScaleMultiresolution.domain(yScaleContext.domain());
	
	optsMultistream.offsetType == "zero" ? multiresolution.select(".y.axis.focus").style({"display":"inline"}) : multiresolution.select(".y.axis.focus").style({"display":"none"});
	optsMultistream.offsetType == "zero" ? multiresolution.select(".y.axis.label").style({"display":"inline"}) : multiresolution.select(".y.axis.label").style({"display":"none"});
	

	multiresolution.select(".y.axis.focus").call(yAxisMultiresolution);
	
	var flowFocusNormal = multiresolution.select("#flowsInFocus").selectAll(".focus.area0") //Normal Area, 1 level
										.data(dataCurrentlyContext,function (d){return d.key;});
	
	//UPDATE
	flowFocusNormal.transition(t)
				.duration(durationTransition)
					.attr("d", function(d) {return areaFocus(d, 0);})
					.style({
							"fill" : function(d) {return d.color;},
							"stroke" : function(d){return optsMultiresolution.layersShowBorderline ? layersBorderlineColor : d.color;}
					});

	//CREATE
	flowFocusNormal.enter()
				.append("path")
				.attr("id", function(d){return "focus_area0_" + d.key;})
				.attr("class", function(d){return "focus area0 " + d.key;})
				.style("opacity",0)
			.transition(t)
			.duration(durationTransition)
				.attr("d", function(d) {return areaFocus(d, 0);})
				.style({
						"fill" : function(d) {return d.color;},
						"stroke" : function(d){return optsMultiresolution.layersShowBorderline ? layersBorderlineColor : d.color;},
						"opacity" : 1
				});	

	
	flowFocusNormal.exit().transition(t)
				.duration(durationTransition)
					.style("opacity", 0)
					.remove();
	
	//---FOCUS ---
	for(var index=1;index<4;index++){
		
		var flowFocusIndex = multiresolution.select("#flowsInFocus").selectAll(".focus.area"+index) 
												.data(dataCurrentlyMultiresolution,function (d){return d.key;});

		//UPDATE
		flowFocusIndex.transition(t)
				.duration(durationTransition)
					.attr("d", function(d) {return areaFocus(d, index);})
					.style({
							"fill" : function(d) {
								switch (index) {
									case 1: return "url(#gradientLeft"+ d.values[0]["key"]+")";// Distortion area
									case 2: return "url(#gradientRight"+ d.values[0]["key"]+")";// Distortion area
									case 3: return d.color;
								}
							},
							"stroke" : function(d) {
								switch (index) {
									case 1: return optsMultiresolution.layersShowBorderline ? layersBorderlineColor : "url(#gradientLeftStroke"+ d.values[0]["key"]+")";
									case 2: return optsMultiresolution.layersShowBorderline ? layersBorderlineColor : "url(#gradientRightStroke"+ d.values[0]["key"]+")";
									case 3: return optsMultiresolution.layersShowBorderline ? layersBorderlineColor : d.color;
								}
							}
						});

		//ENTER
		flowFocusIndex.enter()
					.append("path")
					.attr("id", function(d){return "focus_area"+index+"_" + d.key;})
					.attr("class", function(d){return "focus area" +index +" "+  d.parentKey;})
					.style("opacity",0)
				.transition(t)
					.attr("d", function(d) {return areaFocus(d, index);})
					.style({
							"opacity" : 1,	
							"fill" : function(d) {
								switch (index) {
									case 1: return "url(#gradientLeft"+ d.values[0]["key"]+")";// Distortion area
									case 2: return "url(#gradientRight"+ d.values[0]["key"]+")";// Distortion area
									case 3: return d.color;
								}
							},
							"stroke" : function(d) {
								switch (index) {
									case 1: return optsMultiresolution.layersShowBorderline ? layersBorderlineColor : "url(#gradientLeftStroke"+ d.values[0]["key"]+")";
									case 2: return optsMultiresolution.layersShowBorderline ? layersBorderlineColor : "url(#gradientRightStroke"+ d.values[0]["key"]+")";
									case 3: return optsMultiresolution.layersShowBorderline ? layersBorderlineColor : d.color;
								}
							}
					});				
		
		flowFocusIndex.exit()
					.transition(t)
				.duration(durationTransition)
					.style("opacity", 0)
					.remove();		
	}
	
	createTooltip();
	// execAlgosInZoomArea();
}

function beforeExport(){
	focus.select("#linksProjetions").selectAll("rect")
										.style({
											"display":"none",
											"stroke-width":0
										});
//	context.select("#candadoLeft").style("display","none");
//	context.select("#candadoRight").style("display","none");
	svg_tree_vis.selectAll("text").call(wrap, 250);
	svg_tree_vis.selectAll("text").style("text-transform","capitalize");
}


function updateOpts(){
	areaContext.interpolate(interpolateType);
	stack.offset(optsMultistream.offsetType)
			.order(optsMultistream.orderTest);
}

// function listenToTheKey(e){
// 	let evtobj=window.event? event : e;
//     if (evtobj.altKey || evtobj.ctrlKey || evtobj.shiftKey)
//         alert("you pressed one of the 'Alt', 'Ctrl', or 'Shift' keys")
// }

function loadMultiresolutionVis(){
	//
	updateOpts();

	//create svg main and axes
	createSvg(); 
	
	let isPressedCtrl = false;

	document.onkeydown = (e)=>{

		let isBrushLockLeft = false;
		let isBrushLockRight = false;
		let stampTemporal; 
		let moving=false;

		if (e.keyCode == 17){
			isPressedCtrl = true;
		}
		switch(e.keyCode){
			case 39: // ->
				stampTemporal = 5;
				moving=true;
				if(isPressedCtrl){
					isBrushLockLeft = true;
					isBrushLockRight = false;
				}
				break;
			case 37: // <-
				stampTemporal = -5;
				moving=true;
				if(isPressedCtrl){
					isBrushLockLeft = false;
					isBrushLockRight = true;
				}
				break;
		}


		if(optsContext.showContext && moving){
			moveContextByKeyboard(stampTemporal,isBrushLockLeft,isBrushLockRight);		
		}


	};

	document.onkeyup = (e)=>{
		//e.ctrlKey the same
		if (e.keyCode == 17){
			isPressedCtrl = false;
		}
	};

	//
	display(); 

	
	updateMainTitle(optsMatch);
		

	d3.select("#close-alert").on("click",function(d){
		document.getElementById("alert-msg").classList.toggle("hidden");
	});
	
	d3.select("#svg-export").on("click",function() {
		beforeExport();
		var num_svg = [0,1]; //num_svg to download
		svgExport(fileName, num_svg);
	});
	
	d3.select("#time").on("mouseup", function() {
		console.log(+this.value);
		stepTemporal = +this.value;
		changeGranularity();
	});
	d3.select("#animation").on("change", function() {
		animation = document.getElementById("animation").checked;
	});
	
	d3.select("#outline-layers").on("change", function() {
		optsMultiresolution.layersShowBorderline = document.getElementById("outline-layers").checked;
		
		for(var index=0;index<4;index++){
			focus.select("#flowsInFocus").selectAll(".focus.area" + index) 
						.style({
								"stroke" : function(d) {
									switch (index) {
										case 0: return optsMultiresolution.layersShowBorderline ? layersBorderlineColor : d.color;
										case 1: return optsMultiresolution.layersShowBorderline ? layersBorderlineColor : "url(#gradientLeftStroke"+ d.values[0]["key"]+")";
										case 2: return optsMultiresolution.layersShowBorderline ? layersBorderlineColor : "url(#gradientRightStroke"+ d.values[0]["key"]+")";
										case 3: return optsMultiresolution.layersShowBorderline ? layersBorderlineColor : d.color;
									}
								}
						});
		}		
	});
	
	d3.select("#fading-colors").on("change", function() {
		optsMultiresolution.layersFadingColors = document.getElementById("fading-colors").checked;
		callUpdate();
	});
	d3.select("#limit-ranges").on("change", function() {
		optsMultiresolution.showLimitsAreas = document.getElementById("limit-ranges").checked;
		
		var visibleLimitRanges;
		if(optsMultiresolution.showLimitsAreas){
			visibleLimitRanges = "visible";
		}else{
			visibleLimitRanges = "hidden";
		}
		
		focus.select(".focusNorRight").style({"visibility": visibleLimitRanges});
		focus.select(".focusNorLeft").style({"visibility": visibleLimitRanges});
		focus.select(".focusDisRight").style({"visibility": visibleLimitRanges});
		focus.select(".focusDisLeft").style({"visibility": visibleLimitRanges});
		focus.select(".focusZoom").style({"visibility": visibleLimitRanges});
		
	});
	
	
	
	
	//
	//
	//ALPHA
	//
	//
	d3.select("#alpha").attr({
							"min":minInputValue,
							"max":maxInputValue,
							"step":stepInputValue,
							"value":optsMultistream.facteurZoom
						});
	
	
	d3.select("#alpha").on("input", function() {
		var calcule = calculateRangeFocus(optsMultistream.facteurNor, optsMultistream.facteurDis, +this.value);
		if (calcule != null) {
			optsMultistream.facteurZoom = +this.value;
			beginValidation();
		}else{
			backContext();
			if(document.getElementById("alert-msg").classList.contains("hidden")){
				document.getElementById("alert-msg").classList.toggle("hidden");
			}
		}
		updateFocus(calcule);
	});
	d3.select("#alpha").on("mouseover", function() {
		brushZoomOver();
	});
	d3.select("#alpha").on("mouseout", function() {
		brushOutAll();
	});
	
	//
	//BETA
	//
	d3.select("#beta").attr({
							"min":minInputValue,
							"max":maxInputValue,
							"step":stepInputValue,
							"value":optsMultistream.facteurDis
						});
	
	d3.select("#beta").on("input", function() {
		var calcule = calculateRangeFocus(optsMultistream.facteurNor, +this.value,  optsMultistream.facteurZoom);
		if (calcule != null) {
			optsMultistream.facteurDis = +this.value;
			beginValidation();
		}else{
			backContext();
			if(document.getElementById("alert-msg").classList.contains("hidden")){
				document.getElementById("alert-msg").classList.toggle("hidden");
			}
		}
		updateFocus(calcule);
	});
	d3.select("#beta").on("mouseover", function() {
		brushDisLeftOver();
		brushDisRightOver();
	});
	d3.select("#beta").on("mouseout", function() {
		brushOutAll();
	});
	//
	//
	//GAMMA
	//
	d3.select("#gamma").attr({
							"min":minInputValue,
							"max":maxInputValue,
							"step":stepInputValue,
							"value":optsMultistream.facteurNor
						});
	
	d3.select("#gamma").on("input", function() {
		var calcule = calculateRangeFocus(+this.value, optsMultistream.facteurDis, optsMultistream.facteurZoom);
		if (calcule != null) {
			optsMultistream.facteurNor = +this.value;
			beginValidation();
			
		}else{
			backContext();
			if(document.getElementById("alert-msg").classList.contains("hidden")){
				document.getElementById("alert-msg").classList.toggle("hidden");
			}
		}
		updateFocus(calcule);
	});
	d3.select("#gamma").on("mouseover", function() {
		brushNorLeftOver();
		brushNorRightOver();
	});
	d3.select("#gamma").on("mouseout", function() {
		brushOutAll();
	});
	//
//	d3.select("#col-visualization").selectAll("input").on("change", function(event){
	$("#col-visualization :input").change(function() {
		if(this.value === "streamgraph"){ optsMultistream.offsetType = "silhouette"} //Streamgraph
		else {optsMultistream.offsetType = "zero"} //Stackedgraph, baseline at 0
		stack.offset(optsMultistream.offsetType);
		//changeOffset();
		updateFlows();
	});
	
	
	
	lockedLeft = optsContext.blockedBrushNormal;
	lockedRight = optsContext.blockedBrushNormal;

	d3.select("#candadoLeft").on("click",function(d){
		document.getElementById("candadoLeft").classList.toggle("consin");		
		if(document.getElementById("candadoLeft").classList.contains("consin")){

			d3.select("#candadoLeft").attr('xlink:href',pathCandadoOpen);
			lockedLeft = false;
		}else{
			d3.select("#candadoLeft").attr('xlink:href',pathCandadoClose);
			lockedLeft = true;
		}
	});

	d3.select("#candadoRight").on("click",function(d){
		document.getElementById("candadoRight").classList.toggle("consin");		
		if(document.getElementById("candadoRight").classList.contains("consin")){
			d3.select("#candadoRight").attr('xlink:href',pathCandadoOpen);
			lockedRight = false;
		}else{
			d3.select("#candadoRight").attr('xlink:href',pathCandadoClose);
			lockedRight = true;
		}
	});



	if(!optsContext.showContext){
		context.style({
			"opacity":0,
			"display":"none"
		});

	}
	
	let calcule = calculateRangeFocus(optsMultistream.facteurNor, optsMultistream.facteurDis, optsMultistream.facteurZoom);
	totalito(calcule);

	//
	execAlgosInZoomArea();
}

function createSvg(){

	let multiresolutionHeightProportion = 7.5/10; 
	let contextHeightProportion = 2.5/10;

	if(!optsContext.showContext){
		multiresolutionHeightProportion = 1;
	}

	var alturaMultiresolution = multistreamVisHeight*multiresolutionHeightProportion;
	var alturaContext = multistreamVisHeight*contextHeightProportion;
	
	let marginContextInternTop = 0;
	let marginLeft = 60;
	let marginRight = 20;

	if(isMobileDevice()){
		marginLeft = 25;
		marginRight = 0;
	}

	/* Creation margin Focus */
	marginMultiresolution = {top : 50, right : marginRight,  bottom : 60, left : marginLeft};
	heightMultiresolution = (alturaMultiresolution) - marginMultiresolution.top - marginMultiresolution.bottom;

	//marginFocus.bottom is the height space for the gapBetweenFocusContext and Context
	heightGapFocusContext = marginMultiresolution.bottom+marginContextInternTop;

	/* Creation margin Context */
	marginContext = {top : alturaMultiresolution+marginContextInternTop, right :  marginRight, bottom : 35, left : marginLeft};
	heightContext = alturaContext - marginContext.bottom-marginContextInternTop;
	widthIntern = multistreamVisWidth - marginMultiresolution.left - marginMultiresolution.right;

	
	
	/* SVG */
	svg_multistream_vis = d3.select("body").select("#svg-multistream-vis")
						.attr("xmlns","http://www.w3.org/2000/svg")
						.attr("xlink","http://www.w3.org/1999/xlink")
						.attr("svg","http://www.w3.org/2000/svg")
						.attr("version","1")
						.attr("width",multistreamVisWidth)
						.attr("height", multistreamVisHeight);						

	svg_multistream_vis.attr('viewBox', '0 0 ' +  ( multistreamVisWidth) + ' '  + ( multistreamVisHeight) )
							.attr('height', multistreamVisHeight)
							.attr('width', '100%')
							.attr('preserveAspectRatio', 'none');

	// svg_multistream_vis.on("click",function(){
	// 	console.log("click..");
	// });
	
	
	/* MULTIRESOLUTION */
	multiresolution = svg_multistream_vis.append("g")
				.attr("id","focus")
				.attr("class", "focus")
				.attr("transform","translate(" + (marginMultiresolution.left) + "," + marginMultiresolution.top + ")");

	if(!isMobileDevice()){

		multiresolution.append("text")
					.attr("class", "y axis label legend")
					.attr("x",0 - heightMultiresolution / 2)
					.attr("y", -marginMultiresolution.left)
					.attr("dy","1em")
					.attr("transform", "rotate(-90)")
					.text(legend_y_origin);

		}

	multiresolution.append("rect")
			.attr("id","multiresolutionBackground")
			.attr("class", "background")
			.attr("width", widthIntern)
			.attr("height",heightMultiresolution);

	yScaleMultiresolution.range([ heightMultiresolution, 0 ]);			

								
	// optsMultistream.offsetType == "zero" ? multiresolution.select(".y.axis.focus").style({"display":"inline"}) : multiresolution.select(".y.axis.focus").style({"display":"none"});
	// optsMultistream.offsetType == "zero" ? multiresolution.select(".y.axis.label").style({"display":"inline"}) : multiresolution.select(".y.axis.label").style({"display":"none"});
						
	multiresolution.append("g").attr("id","x_grid_focus");

	multiresolution.append("g").attr("id","x_axis_focus");

	createGradientArrays(key_focus_list_origin);

	multiresolution.append("g").attr("id","flowsInFocus");

	multiresolution.append("g")
								.attr("class", "y axis focus")
								.attr("transform","translate(0,0)");

	//CREATE THE LINK LINKS PROJETIONS GROUP
	multiresolution.append("g").attr("id","linksProjetions");
	
	//CREATE THE POINTCHANGES GROUP
	multiresolution.append("g").attr("id","gPointChanges");

	//TEXT LABELS GROUP
	multiresolution.append("g").attr("id","textsLabels");

	/* Context */
	context = svg_multistream_vis.append("g")
					.attr("id","context")
					.attr("class", "context")
					.attr("transform","translate(" + marginContext.left + "," +( marginContext.top) + ")")
					.style({
						"background-color":"grey"
					});
	

	context.append("rect")
				.attr("id","contextBackground")
				.attr("class", "background")
				.attr("width", widthIntern)
				.attr("height",heightContext);

	context.append("text")
			.attr("class","x axis label")
			.attr("transform","translate(" + (widthIntern/2) + " ," + (heightContext+20) + ")")
			.text("");

	context.append("g").attr("id","flowsInContext");			

	xScaleContext.range([ 0, widthIntern ]);
	yScaleContext.range([ heightContext, 0 ]);

	context.append("g")
					.attr("class", "x axis context")
					.attr("transform","translate(0," + heightContext + ")");


	createBrushInContext();

	createGroupForContextBrushes();

	InitBarPositionBrushInContext();

	/* ToolTip */
	tooltip = d3.select("body").append("div")
							.attr("id","tooltipFlow")
							.attr("class", "tooltip tooltip-nopointer tooltip-multiresolution")
							.style({
								"opacity":0,
								"display":"none"
							});

	tooltipEvents = d3.select("body").append("div")
											.attr("id","tooltipEvent")
											.attr("class", "tooltip tooltip-nopointer tooltip-multiresolution")
											.style({
												"opacity":0,
												"display":"none"
											});

											
	tooltipStories = d3.select("body").append("div")
											.attr("id","tooltipStory")
											.attr("class", "tooltip tooltip-multiresolution storytelling-wrapper")
											.style({
												"opacity":0,
												"display":"none"
											});
											

	verticalRulerBackground = multiresolution.append("line")
										.attr("class","vertical-ruler-background");

	verticalRuler = multiresolution.append("line")
									.attr("class","vertical-ruler");											

	
	if(isMobileDevice()){
		eventsArray = eventsArray.filter(d=>{return d.mobil==true;});
	}

	createTimeSeriesLegend();

}

function createTimeSeriesLegend(){

	let dataForEventLegend = jerarquiaOrigen.getBottomLevelNodes();
	// .map(d=>{
	// 	return {
	// 		"key":d.key,
	// 		"name":d.name,
	// 		"color":d.color,
	// 		"img":d.img,
	// 		"level":d.level
	// 	};
	// });
	dataForEventLegend.reverse();


	let symbolPxSize = 20;
	let verticalGapEntries = 3;
	let numEntries =  dataForEventLegend.length;
	let legendMargin= {top:10,left:10,bottom:10};
	let legendHeight = numEntries * symbolPxSize + (numEntries+1)*verticalGapEntries;
	let legend_wrapper_height = legendHeight + legendMargin.top + legendMargin.bottom;
	let legend_wrapper_width = 220;

	let yPositionLegendEntry = d3.scale.ordinal()
							.domain(dataForEventLegend.map(d=>d.name))
							.rangePoints([verticalGapEntries+symbolPxSize/2, legendHeight-(verticalGapEntries+symbolPxSize/2)]);

	
	let gWrapperLegend = multiresolution.append("g")
					.attr("class","legend")
					.attr("transform","translate("+ 10 +","+ 10 + ")");
	
	gWrapperLegend.append("rect")
			.attr("class",'background')
			.attr("rx",8)
			.attr("ry",8)
			.attr("width",legend_wrapper_width)
			.attr("height",legend_wrapper_height);
	
	let gLegend = gWrapperLegend.append("g")
							.attr("transform","translate("+legendMargin.left+","+legendMargin.top+")");

	let legend_items = gLegend.selectAll(".legendEntry").data(dataForEventLegend,d=>d.name);
		
	let legendEntry = legend_items.enter().append("g")
						.attr("class","legendEntry");
			
	legendEntry.append("image")
			.attr("class","filter")
			.attr("xlink:href",pathEyeOpen)
			.attr("width", symbolPxSize)
			.attr("height", symbolPxSize)
			.attr("x",0)
			// .on("click", nodeClick)
			.on("click",function(d){
				if(this.classList.contains("consin")){
					d3.select(this).attr('xlink:href',pathEyeOpen);
				}else{
					d3.select(this).attr('xlink:href',pathEyeClose);
				}
				this.classList.toggle("consin");		
				nodeClick(d);
			})
			.attr("y",d=>{return yPositionLegendEntry(d.name)-symbolPxSize/2;})
			.style({
				"cursor":"hand"
			});


			

	legendEntry.append("image")
			.attr("class","symbol")
			.attr("xlink:href",d=>{return d.img;})
			.attr("width", symbolPxSize)
			.attr("height", symbolPxSize)
			.attr("x",symbolPxSize+5)
			.attr("y",d=>{return yPositionLegendEntry(d.name)-symbolPxSize/2;});


	legendEntry.append("rect")
			.attr("class","")
			.attr("width", 150)
			.attr("height", symbolPxSize)
			.attr("x",(2*symbolPxSize+10))
			.attr("y",d=>{return yPositionLegendEntry(d.name)-symbolPxSize/2;})
			.style({
				"fill":d=>d.color,
				"opacity":0.8
			});

	legendEntry.append("text")
			.attr("class","text")
			.attr("x",2*symbolPxSize+10)
			.attr("y",d=>yPositionLegendEntry(d.name))
			.text(d=>d.name)
			.style({
				"fill":"rgba(0,0,0,0.8)",
				"font-size":"smaller",
				"alignment-baseline":"central" //only for text
			});
}

function legendClick(d){

}


function timeout() {
	setTimeout(function () {
		// Do Something Here
		// Then recall the parent function to
		// create a recursive loop.
		moveContextByKeyboard();
		timeout();
	}, 100);
}

function display() {
	
	let calcule = calculateRangeFocus(optsMultistream.facteurNor, optsMultistream.facteurDis, optsMultistream.facteurZoom);
	rangesDomainMultiresolution = nest_by_key.entries(calcule);
	createScalesAxisFocus(rangesDomainMultiresolution);
	
	updateFlows();
	
	InitBarPositionBrushInContext();
	
	updateRectanglesAndLinksInFocus();// Rectangles BORDERS
	
	beginValidation();//To set the values at begging
}





function getDataInFocus(dateLimMin, dateLimMax){

	let dataInFocus = [];
	if(dataCurrentlyMultiresolution==null){
		dataInFocus = data_bottom_level;
	}else{
		dataInFocus = dataCurrentlyMultiresolution;
	}

	let lim = getTimeOffset(dateMaxRange, -2, polarityTemporal);
	if(dateLimMax > lim){
		dateLimMax = lim;
	}
	
	let result = [];
	dataInFocus.forEach(function(element){
		
		//add the color propertie to the all values for an element
		element.values.forEach(d=>{d.color = element.color;});

		let filterValues = element.values.filter(function(obj){return (obj.date>=dateLimMin && obj.date<=dateLimMax );});
		
		result.push({
			"key":element.key,
			"color":element.color,
			"category":element.category,
			"values":filterValues
		});
		
	});

	return result;
}


// function handleMouseOver(d, i) {  // Add interactivity
// 	console.log(d)
// 	// Use D3 to select element, change color and size
// 	d3.select(this).attr({
// 	  fill: "orange"
// 	});
// }


function getEventsChanges(dataInZoomArea){
	
	// console.log(dataInZoomArea)

	dataInZoomArea.forEach(function(layerInZoom){

		//
		let a = layerInZoom.values[0];
		let b = layerInZoom.values[layerInZoom.values.length-1];

		let dataPointDetection = [];
		let currTimeWindows = getTimeWindow(a.date,b.date,polarityTemporal,stepTemporal);

		let eventsByCateAndDate = getEventsByCategory(layerInZoom.category);

		// console.log(currTimeWindows)
		for (let i = 0; i < currTimeWindows.length; i++) {
			if((i+1) < currTimeWindows.length){
				let sinceDate = currTimeWindows[i];
				let untilDate = currTimeWindows[i+1];

				eventsByCateAndDate.forEach(function(d){
					if(sinceDate <= d.date  && d.date < untilDate){
						let event = eventsArray.find(e=>e.label.toLowerCase()===d.action.toLowerCase());
						if(typeof event !='undefined'){		
							d.event = event;
						}
						d.date = sinceDate;
						dataPointDetection.push(d);
					}
				});	
			}
		}

		let nestedByDate = d3.nest().key(function(d) {return d.date;});
		let nestedByAction = d3.nest().key(function(d) {return d.action;});
	

		eventsNestedByDate = nestedByDate.entries(dataPointDetection);

		let aryPointDetection = [];
	
		//At least one layer pour parcourir chaque date
		layerInZoom.values.forEach(function(elementInLayer){
			
			// console.log("------------------")
	
			let currPointsDetections = eventsNestedByDate.filter(d=>{return new Date(d.key).getTime() === elementInLayer.date.getTime();});
			

			//Si hay eventos en esa fecha al menos 1
			if(typeof currPointsDetections[0]!='undefined'){
				
				let nestByActions = nestedByAction.entries(currPointsDetections[0].values);

				//get only actions that have an event array and there are visibles
				let filteredNestByAction = nestByActions.filter(function(d){return d.values[0].event && d.values[0].event.iconVisible;});
	
				//we must order nestByActions array
				filteredNestByAction.sort(function(a,b){return a.values[0].event.order - b.values[0].event.order;});

				
	
				//hay que ver si la accion permite agregacion
				let count = 0;
				
				filteredNestByAction.forEach(function(actionNested){
					//see if this action allows aggregation
					let isEventAggregated = actionNested.values[0].event.aggregation;
					let pathImg = actionNested.values[0].event.pathImg;
					//
					let category  = elementInLayer.category;
					let date = elementInLayer.date;
					let key = elementInLayer.key;
					let value = elementInLayer.value;
					let y = elementInLayer.y;
					let y0 = elementInLayer.y0;
					// console.log(key)
					let weight;
					let what;
					let who;
					let who_from;
					let media;
					let text;
					//
					let title;
					let subtitle;
	
					if(isEventAggregated){
						count ++;
						
						what = actionNested.values[0].action;
						weight = actionNested.values.length;
	
						let k = {
									"category":category,
									"date":date,
									"key":key,
									"count":count,
									"what":what,
									"weight":weight,
									"pathImg":pathImg,
									"events":actionNested.values,
									"value":value,
									"y":y,
									"y0":y0,
				
								};
	
						aryPointDetection.push(k);
	
					}else{
						actionNested.values.forEach(d=>{
							count ++;
							weight=1;
							
							what = d.action;
							who = d.who;
							who_from = d.who_from;
							media = d.media;
							event = d.event;
							text = d.text;
	
						let e = {"action": d.action,
								"date": d.date,
								"event": d.event,
								"media": d.media,
								"subtitle": d.subtitle,
								"text": d.text,
								"title": d.title,
								"who": d.who,
								"who_from": d.who_from
							};
	
						let k = {
								"category":category,
								"date":date,
								"key":key,
								"count":count,
								"what":what,
								"weight":weight,
								"pathImg":pathImg,
								"value":value,
								"y":y,
								"y0":y0,
								"events":[e]
							};
	
							aryPointDetection.push(k);
						});
					}
				});
			}
	
			// if(currPointsDetections.length>0){
			// 	console.log(currPointsDetections)
			// 	// console.log(filteredNestByAction)
			// 	console.log(aryPointDetection)

			// }



			let scala = d3.scale.sqrt()
									.domain([1,10])
									.range([1.2,2])
									.clamp(true);
	
			let points = multiresolution.select("#gPointChanges").selectAll(".point-detection."+elementInLayer.key)
											// .data(aryPointDetection,function(d){return (d.key+"-"+d.date+"-"+d.what+"-"+d.category+"-"+d.count);});
											.data(aryPointDetection,function(d){return (d.key+"-"+d.category+"-"+d.date);});
	
			//exit
			points.exit().remove();
	
			//update
			points.attr("x", function(d) {return scalesMultiresolution[selectAxisFocus(d.date)](d.date)-getPxFromRem(scala(d.weight)/2); })
						.attr("y", function(d) {return yScaleMultiresolution(d.y0 + d.value/2) - getPxFromRem(scala(d.weight)/2); })
						;
	
			//enter
			points.enter()
				.append("image")
						.attr("class","point-detection "+elementInLayer.key)
						.attr("x", function(d) {return scalesMultiresolution[selectAxisFocus(d.date)](d.date)-getPxFromRem(scala(d.weight)/2); })
						.attr("y", function(d) {return yScaleMultiresolution(d.y0 + d.value/2) - getPxFromRem(scala(d.weight)/2); })
						.attr("xlink:href",(d)=>{return d.pathImg;})
						.attr("width",d=>{return getPxFromRem(scala(d.weight));})
						.attr("height",d=>{return getPxFromRem(scala(d.weight));})
						.on("mouseover",pointChangeMouseOver)
						.on("mouseout", function(d, i) {
							ratonOutMultiresolution();
							ratonOutFlow();
							//startTimeStories();
					});



	// 				flowLabel.exit()
	// 			.remove();

	// //update
	// flowLabel
	// 		.attr("x", function(d) {return scalesMultiresolution[selectAxisFocus(d.date)](d.date) - getPxFromRem(scaleFlowLabel(d.value)/2); })
	// 		.attr("y", function(d) {return yScaleMultiresolution(d.y0 + d.value/2) - getPxFromRem(scaleFlowLabel(d.value)/2); }) 
	// 		.attr("width",function(d){return getPxFromRem(scaleFlowLabel(d.value));})
	// 		.attr("height",function(d){return getPxFromRem(scaleFlowLabel(d.value));});

	// //enter
	// flowLabel.enter().append("image")
	// 			.attr("class",function(d){return "textLabel" + " " + d.parentKey + " " +d.key;})
	// 			.attr("x", function(d) {return scalesMultiresolution[selectAxisFocus(d.date)](d.date) - getPxFromRem(scaleFlowLabel(d.value)/2); })
	// 			.attr("y", function(d) {return yScaleMultiresolution(d.y0 + d.value/2) - getPxFromRem(scaleFlowLabel(d.value)/2); }) 
	// 			.attr("xlink:href",d=>{return d.img;})
	// 			.attr("width",function(d){return getPxFromRem(scaleFlowLabel(d.value));})
	// 			.attr("height",function(d){return getPxFromRem(scaleFlowLabel(d.value));})
	// 			.style({
	// 					"opacity":1,
	// 					"text-anchor":"middle",
	// 					"pointer-events": "none",
	// 			});
	
	
		});


	});

	// return;

	// //Agrupar por fecha
	// let dataPointDetection = [];
	// for (let i = 0; i < dataInZoomArea[0].values.length; i++) {
	// 	if((i+1) < dataInZoomArea[0].values.length){
	// 		let sinceDate = dataInZoomArea[0].values[i].date;
	// 		let untilDate = dataInZoomArea[0].values[i+1].date;

	// 		let eventsByCateAndDate = getAllEventsByDate(sinceDate, untilDate);

	// 		eventsByCateAndDate.forEach((d)=>{
	// 			let event = eventsArray.find(e=>e.label.toLowerCase()===d.action.toLowerCase());
	// 			if(typeof event !='undefined'){		
	// 				d.event = event;
	// 			}
	// 			d.date = untilDate;
	// 			dataPointDetection.push(d);
	// 		});
	// 	}
	// }

	// let nestedByDate = d3.nest().key(function(d) {return d.date;});
	// let nestedByAction = d3.nest().key(function(d) {return d.action;});
	
	// eventsNestedByDate = nestedByDate.entries(dataPointDetection);

	// let aryPointDetection = [];

	// //At least one layer pour parcourir chaque date
	// dataInZoomArea[0].values.forEach(function(elementInLayer){

	// 	console.log(elementInLayer)

	// 	let currPointsDetections = eventsNestedByDate.filter(d=>{return new Date(d.key).getTime() === elementInLayer.date.getTime();});

	// 	//Si hay eventos en esa fecha al menos 1
	// 	if(typeof currPointsDetections[0]!='undefined'){
	// 		// console.log(currPointsDetections)
			
	// 		let nestByActions = nestedByAction.entries(currPointsDetections[0].values);

	// 		//get only actions that have an event array and there are visibles
	// 		let filteredNestByAction = nestByActions.filter(function(d){return d.values[0].event && d.values[0].event.iconVisible;});

	// 		//we must order nestByActions array
	// 		filteredNestByAction.sort(function(a,b){return a.values[0].event.order - b.values[0].event.order;});

	// 		//hay que ver si la accion permite agregacion
	// 		let count = 0;
			
	// 		filteredNestByAction.forEach(function(actionNested){
	// 			//see if this action allows aggregation
	// 			let isEventAggregated = actionNested.values[0].event.aggregation;
	// 			let pathImg = actionNested.values[0].event.pathImg;
	// 			//
	// 			let category  = elementInLayer.category;
	// 			let date = elementInLayer.date;
	// 			let key = elementInLayer.key;
	// 			let weight;
	// 			let what;
	// 			let who;
	// 			let who_from;
	// 			let media;
	// 			let text;
	// 			//
	// 			let title;
	// 			let subtitle;

	// 			if(isEventAggregated){
	// 				count ++;
					
	// 				what = actionNested.values[0].action;
	// 				weight = actionNested.values.length;

	// 				let k = {
	// 							"category":category,
	// 							"date":date,
	// 							"key":key,
	// 							"count":count,
	// 							"what":what,
	// 							"weight":weight,
	// 							"pathImg":pathImg,
	// 							"events":actionNested.values
	// 						};

	// 				aryPointDetection.push(k);

	// 			}else{
	// 				actionNested.values.forEach(d=>{
	// 					count ++;
	// 					weight=1;
						
	// 					what = d.action;
	// 					who = d.who;
	// 					who_from = d.who_from;
	// 					media = d.media;
	// 					event = d.event;
	// 					text = d.text;

	// 				let e = {"action": d.action,
	// 						"date": d.date,
	// 						"event": d.event,
	// 						"media": d.media,
	// 						"subtitle": d.subtitle,
	// 						"text": d.text,
	// 						"title": d.title,
	// 						"who": d.who,
	// 						"who_from": d.who_from
	// 					};

	// 				let k = {
	// 						"category":category,
	// 						"date":date,
	// 						"key":key,
	// 						"count":count,
	// 						"what":what,
	// 						"weight":weight,
	// 						"pathImg":pathImg,
	// 						"events":[e]
	// 					};

	// 					aryPointDetection.push(k);

	// 				});
	// 			}
	// 		});
	// 	}

	// 	let scala = d3.scale.sqrt()
	// 							.domain([1,10])
	// 							.range([1.2,2])
	// 							.clamp(true);

	// 	let points = multiresolution.select("#gPointChanges").selectAll(".point-detection")
	// 									// .data(aryPointDetection,function(d){return (d.key+"-"+d.date+"-"+d.who+"-"+d.what+"-"+d.media+"-"+d.count);});
	// 									.data(aryPointDetection,function(d){return (d.key+"-"+d.date+"-"+d.what+"-"+d.count);});

	// 	//exit
	// 	points.exit().remove();

	// 	//update
	// 	points.attr("x", function(d) {return scalesMultiresolution[selectAxisFocus(d.date)](d.date)-getPxFromRem(scala(d.weight)/2); })
	// 				.attr("y", function(d,index) {return heightMultiresolution - (d.count*35);});

	// 	//enter
	// 	points.enter()
	// 		.append("image")
	// 				.attr("class","point-detection")
	// 				.attr("x", function(d) {return scalesMultiresolution[selectAxisFocus(d.date)](d.date)-getPxFromRem(scala(d.weight)/2); })
	// 				.attr("y", function(d) {return heightMultiresolution - (d.count*35);})
	// 				// .attr("xlink:href",(d)=>{return d.event.pathImg;})
	// 				.attr("xlink:href",(d)=>{return d.pathImg;})
	// 				.attr("width",d=>{return getPxFromRem(scala(d.weight));})
	// 				.attr("height",d=>{return getPxFromRem(scala(d.weight));})
	// 				.on("mouseover",pointChangeMouseOver)
	// 				.on("mouseout", function(d, i) {
	// 					ratonOutMultiresolution();
	// 					ratonOutFlow();
	// 					//startTimeStories();
	// 			});


	// });

}


function getEventsByCategory(category){
	return events.filter((d)=>{return d.category==category;});
}

function getEventsByCategoryAndByDate(category,since,until){
	
	let eventByCategory = events.filter(d=>{return d.category.toLowerCase()===category.toLowerCase();});
	let eventByCategoryByDate = eventByCategory.filter(d=>{return since < d.date && d.date <=until;});

	return eventByCategory;// eventByCategoryByDate.sort(function(a,b){return a.action-b.action;});
}

function getAllEventsByDate(since,until){
	let eventByDate = events.filter((d)=>{return since < d.date && d.date <=until;});

	return eventByDate.sort(function(a,b){return a.action-b.action;});
}


function pointChangeMouseOver(d){
	ratonOutMultiresolution();
	ratonOutFlow();
	//showStoryTelling(d.events);
}


///

function getFlowLabelWithoutOverlapping(data){
	let datesForTextLabel = []; 
	
	data.forEach(function(element){
		const max = element.values.reduce(function(prev, current) {
		    return (prev.value > current.value) ? prev : current;
		},{});
		datesForTextLabel.push(max);
	});
	
	//Ordering descending this array to get the maximun and minimun
	datesForTextLabel.sort(function(a,b){return a.value-b.value;});
	
	const minValueTextLabel = 0; //datesForTextLabel[0].valueNormal;
	const maxValueTextLabel = datesForTextLabel[datesForTextLabel.length-1].value;
	
	//Scale to get the HEIGHT of the text 
	scaleFlowLabel.clamp(true)
					.domain([minValueTextLabel, maxValueTextLabel])
					.range(layersOutputRangeLabelScale);
		
	datesForTextLabel.forEach(function(element){
		element.category = getCapitalize(element.category);
		var value = element.value;
		var objectWidth;
		switch(layersLabelType){
			case "flowLabelText":
				let font = scaleFlowLabel(value).toString().concat("rem ").concat(text_font_family);
				objectWidth = getTextWidthInPx(element.category,font);
				break;
			case 'flowLabelImg':
				objectWidth = getPxFromRem(scaleFlowLabel(value));// scaleFlowLabel(value); // getTextWidth(element.category,font);
				break;
		}

		var objectHeight = getPxFromRem(scaleFlowLabel(value));
		var objectWidthMiddle = objectWidth/2;
		var objectHeightMiddle = objectHeight/2;
		
		var x1 = scalesMultiresolution[selectAxisFocus(element.date)](element.date)-objectWidthMiddle;
		var y1 = yScaleMultiresolution(element.y0 + element.value/2 )-objectHeightMiddle;
		var x2 = (x1+objectWidth);
		var y2 = (y1+objectHeight);
		
		element.coordinates = {"x1":x1,"y1":y1,"x2":x2,"y2":y2};
		element.overlaping = false;
	});


	return removeOverlapping(datesForTextLabel);
}


function flowTextLabel(flowWithoutOverlapping){
	let flowLabel = multiresolution.select("#textsLabels").selectAll(".textLabel")
										.data(flowWithoutOverlapping,function (d){return d.key;});
	
	//exit
	flowLabel.exit()
				.remove();

	//update
	flowLabel
			.attr("x", function(d) {return scalesMultiresolution[selectAxisFocus(d.date)](d.date); })
			.attr("y", function(d) {return yScaleMultiresolution(d.y0 + d.value/2 ); })
			.style({
				"font-size":function(d) {return scaleFlowLabel(d.value) + "rem";},
		});
		
	//enter
	flowLabel.enter().append("text")
					.attr("class",function(d){return "subtitle1 textLabel" + " " + d.parentKey + " " +d.key;})
					.attr("x", function(d) {return scalesMultiresolution[selectAxisFocus(d.date)](d.date); })
					.attr("y", function(d) {return yScaleMultiresolution(d.y0 + d.value/2); }) 
					.attr("dy",".35em")
					.text(function(d) {return d.category;})
					.style({
							"opacity":1,
							"font-size":function(d) {return scaleFlowLabel(d.value) + "rem";},
							"font-family":text_font_family,
							"text-anchor":"middle",
							"pointer-events": "none",
					});	
					
					
	
	
	// //To create RECTANGLES around the text label 
	
	
	// var rectangleLabel = multiresolution.select("#textsLabels").selectAll(".rect")
	// 			.data(flowWithoutOverlapping,function (d){return d.key;});

	// //update
	// rectangleLabel
	// 			//.style({"opacity":0})	
	// 			.attr("x",function(d){return d.coordinates.x1;})
	// 			.attr("y",function(d){return d.coordinates.y1;})
	// 			.attr("width",(function(d){return d.coordinates.x2-d.coordinates.x1;}))
	// 			.attr("height",(function(d){return d.coordinates.y2-d.coordinates.y1;}))
	// 			.text(function(d) {return d.name;})
	// 			.style({
	// 					"display":"inline",
	// 					"fill":"none",
	// 					"stroke":"black"
	// 			})
	
	// //enter RECTANGLE
	// rectangleLabel.enter().append("rect")
	// 					.attr("class",function(d){return "rect" + " " + d.parentKey + " " +d.key;})
	// 					.attr("x",function(d){return d.coordinates.x1;})
	// 					.attr("y",function(d){return d.coordinates.y1;})
	// 					.attr("width",(function(d){return d.coordinates.x2-d.coordinates.x1;}))
	// 					.attr("height",(function(d){return d.coordinates.y2-d.coordinates.y1;}))
	// 					.style({
	// 						"display":"inline",
	// 						"fill":"none",
	// 						"stroke":"black"
	// 						})
	
	// //exit
	// rectangleLabel.exit()
	// 			.style("opacity",0)
	// 			// .transition()
	// 			// .duration(transitionDuration)
	// 			.style("opacity",0)
	// 			.remove();

}

function flowImgLabel(flowWithoutOverlapping){
	let flowLabel = multiresolution.select("#textsLabels").selectAll(".textLabel")
										.data(flowWithoutOverlapping,function (d){return d.key;});
	
	//exit
	flowLabel.exit()
				.remove();

	//update
	flowLabel
			.attr("x", function(d) {return scalesMultiresolution[selectAxisFocus(d.date)](d.date) - getPxFromRem(scaleFlowLabel(d.value)/2); })
			.attr("y", function(d) {return yScaleMultiresolution(d.y0 + d.value/2) - getPxFromRem(scaleFlowLabel(d.value)/2); }) 
			.attr("width",function(d){return getPxFromRem(scaleFlowLabel(d.value));})
			.attr("height",function(d){return getPxFromRem(scaleFlowLabel(d.value));});

	//enter
	flowLabel.enter().append("image")
				.attr("class",function(d){return "textLabel" + " " + d.parentKey + " " +d.key;})
				.attr("x", function(d) {return scalesMultiresolution[selectAxisFocus(d.date)](d.date) - getPxFromRem(scaleFlowLabel(d.value)/2); })
				.attr("y", function(d) {return yScaleMultiresolution(d.y0 + d.value/2) - getPxFromRem(scaleFlowLabel(d.value)/2); }) 
				.attr("xlink:href",d=>{return d.img;})
				.attr("width",function(d){return getPxFromRem(scaleFlowLabel(d.value));})
				.attr("height",function(d){return getPxFromRem(scaleFlowLabel(d.value));})
				.style({
						"opacity":1,
						"text-anchor":"middle",
						"pointer-events": "none",
				});




//
	//
	//To create RECTANGLES around the text label 
	//
	//
	
	// var rectangleLabel = multiresolution.select("#textsLabels").selectAll(".rect")
	// 			.data(flowWithoutOverlapping,function (d){return d.key;});

	// //update
	// rectangleLabel
	// 			//.style({"opacity":0})	
	// 			.attr("x",function(d){return d.coordinates.x1;})
	// 			.attr("y",function(d){return d.coordinates.y1;})
	// 			.attr("width",(function(d){return d.coordinates.x2-d.coordinates.x1;}))
	// 			.attr("height",(function(d){return d.coordinates.y2-d.coordinates.y1;}))
	// 			.text(function(d) {return d.name;})
	// 			.style({
	// 					"display":"inline",
	// 					"fill":"none",
	// 					"stroke":"black"
	// 			})
	
	// //enter RECTANGLE
	// rectangleLabel.enter().append("rect")
	// 					.attr("class",function(d){return "rect" + " " + d.parentKey + " " +d.key;})
	// 					.attr("x",function(d){return d.coordinates.x1;})
	// 					.attr("y",function(d){return d.coordinates.y1;})
	// 					.attr("width",(function(d){return d.coordinates.x2-d.coordinates.x1;}))
	// 					.attr("height",(function(d){return d.coordinates.y2-d.coordinates.y1;}))
	// 					.style({
	// 						"display":"inline",
	// 						"fill":"none",
	// 						"stroke":"black"
	// 						})
	
	// //exit
	// rectangleLabel.exit()
	// 			.style("opacity",0)
	// 			// .transition()
	// 			// .duration(transitionDuration)
	// 			.style("opacity",0)
	// 			.remove();

}

function execAlgosInZoomArea(){

	//--get the focusArea data
	let dataInZoomArea = getDataInFocus(brushContext.extent()[0],brushContext.extent()[1]);	
	//--and pass the the algos

	//--flow labels
	//flowLabel(dataInZoomArea);

	//--events
	getEventsChanges(dataInZoomArea);

	//--storytelling
	storiesInit = agregatedStories(dataInZoomArea);
	updateStorytellingPanels(storiesInit);

	//--update title
	updateMainTitle(optsMatch);
}

function agregatedStories(dataInZoomArea){
	let totalSumValues  = 0;
	let totalArrayHashtags = [];
	let totalArrayMentions = [];
	let totalArrayScreennames = [];
	dataInZoomArea.forEach(function(element){

		let currValues = element.values.reduce(function(prev, current) {
			return prev + current.value;
		},0);
		totalSumValues+=currValues;

		let currArrayHashtag = [];
		let currArrayMention = [];
		let currArrayScreenname = [];
		element.values.forEach(function(item){
			currArrayHashtag = currArrayHashtag.concat(item.hashtags);
			currArrayMention = currArrayMention.concat(item.mentions);
			// currArrayScreenname = currArrayScreenname.concat(item.screennames);
		});
		totalArrayHashtags = totalArrayHashtags.concat(currArrayHashtag);
		totalArrayMentions = totalArrayMentions.concat(currArrayMention);
		// totalArrayScreennames = totalArrayScreennames.concat(currArrayScreenname);
	});
	return {"numTweets":totalSumValues,
			"hashtags":groupedTerm(totalArrayHashtags),
			"mentions":groupedTerm(totalArrayMentions),
			// "screennames":groupedTerm(totalArrayScreennames)
		};
}

function removeFirstCharacter(aString){
	return aString.slice(1,aString.length);
}

function updateStorytellingPanels(stories){
	let topK = 5;

	//remove
	removeAllChildrenOfAList("hashtags");
	removeAllChildrenOfAList("mentions");
	removeAllChildrenOfAList("interactions");
	removeAllChildrenOfAList("interactionsMobil");

	//tweets
	document.getElementById("tweets").innerHTML = customNumberFormat(stories.numTweets);
	document.getElementById("tweetsMobil").innerHTML = customNumberFormat(stories.numTweets);

	//hashtags
	for(let i = 0; i<Math.min(stories.hashtags.length,topK);i++){
		let parentId = "hashtags";
		let elementTag = "li";
		let elementId = "";
		let hashtag = stories.hashtags[i].term;
		let htmlRef= "<a href='https://twitter.com/search?q=%23" + removeFirstCharacter(hashtag) + "' target='_blank'>" + hashtag + "</a>";
		let htmlWeight = "<span class='button'>" + customNumberFormat(stories.hashtags[i].weight) + "</span>";
		let html = htmlRef + " "+  htmlWeight;
		let element = addElement(parentId, elementTag, elementId, html);
		element.classList.add("list-group-item");
		element.classList.add("body2");
		element.classList.add("text-truncate");
	}

	//mentions
	for(let i = 0; i<Math.min(stories.mentions.length,topK);i++){
		let parentId = "mentions";
		let elementTag = "li";
		let elementId = "";
		let mention = stories.mentions[i].term;
		let htmlRef = "<a href='https://twitter.com/" + removeFirstCharacter(mention) + "' target='_blank'>" + mention + "</a>";
		let htmlWeight = "<span class='button'>" + customNumberFormat(stories.mentions[i].weight) + "</span>";
		let html = htmlRef + " "+  htmlWeight;
		let element = addElement(parentId, elementTag, elementId, html);
		element.classList.add("list-group-item");
		element.classList.add("body2");
		element.classList.add("text-truncate");
	}

	// //active users
	// for(let i = 0; i<Math.min(stories.screennames.length,topK);i++){
	// 	let parentId = "interactions";
	// 	let parentIdMobil = "interactionsMobil";
	// 	let elementTag = "li";
	// 	let elementId = "";
	// 	let screen_name = stories.screennames[i].term;
	// 	let htmlRef = "<a href='https://twitter.com/" + removeFirstCharacter(screen_name) + "' target='_blank'>" + screen_name + "</a>";
	// 	let htmlWeight = "<span class='button'>" + customNumberFormat(stories.screennames[i].weight) + "</span>";
	// 	let html = htmlRef + " "+  htmlWeight;
	// 	let element = addElement(parentId, elementTag, elementId, html);
	// 	element.classList.add("list-group-item");
	// 	element.classList.add("body2");
	// 	element.classList.add("text-truncate");

	// 	let elementMobil = addElement(parentIdMobil, elementTag, elementId, html);
	// 	elementMobil.classList.add("list-group-item");
	// 	elementMobil.classList.add("body2");
	// 	elementMobil.classList.add("text-truncate");


	// }

}

function updateEventTitle(){

}



function flowLabel(dataInZoomArea){

	let flowWithoutOverlapping = getFlowLabelWithoutOverlapping(dataInZoomArea);

	switch(layersLabelType){
		case "flowLabelText":
			flowTextLabel(flowWithoutOverlapping);
			break;
		case 'flowLabelImg':
			flowImgLabel(flowWithoutOverlapping);
			break;
	}
}

function ratonOverFlow(selectedFlow){

	multiresolution.select("#flowsInFocus").selectAll(".focus") 	
					.style({
							"fill-opacity":function(d){
								return (selectedFlow.key == d.key || selectedFlow.key == getFatherKey(d.key) ) ? layersOpacitySelected : layersOpacityNotSelected;
							},
							"stroke-opacity":function(d){
								return (selectedFlow.key == d.key || selectedFlow.key == getFatherKey(d.key) ) ? layersOpacitySelected : 0;
							}
					});

	multiresolution.select("#textsLabels").selectAll(".textLabel")
				.style({
					"opacity":function(d){
						return (selectedFlow.key == d.key || selectedFlow.key == getFatherKey(d.key) ) ? layersOpacitySelected : layersOpacityNotSelected;
					},
					"font-weight":function(d){
						return (selectedFlow.key == d.key || selectedFlow.key == getFatherKey(d.key) ) ? "bold" : "normal";
					}
				});

	multiresolution.select("#gPointChanges").selectAll(".point-detection")
				.style({
					"opacity":function(d){
						return (selectedFlow.key == d.key || selectedFlow.key == getFatherKey(d.key) ) ? layersOpacitySelected : layersOpacityNotSelected;
					}
				});

}


function ratonOutFlow(){
	
	tooltipFlag = new Date();
	
	//ratonOutTree();

	multiresolution.select("#flowsInFocus").selectAll(".focus") 	
						.style({
								"fill-opacity" : 1,
								"stroke-opacity" : 1
						});	
								
	multiresolution.select("#textsLabels").selectAll(".textLabel")
			.style({
				"opacity":1,
				"font-weight":"normal"
			});

	multiresolution.select("#gPointChanges").selectAll(".point-detection")
			.style({
							"opacity":1 
			});
	
}

function createTooltip(){
	
	multiresolution.select("#multiresolutionBackground")
					.on("mousemove",function(d){

						mousex = d3.mouse(this);
						mousex = mousex[0];// + 5;
						let dateSelected = timeTooltip(scalesMultiresolution[selectScaleFocusPixel(mousex)].invert(mousex)); //invert: get the domain, return range and viceversa
						var mouseDateIndex = timeWindow.map(Number).indexOf(+dateSelected); //To get the index of the date in array
							
							//If date existe in the array
							if(mouseDateIndex!=-1 && (dateSelected.getTime() != tooltipFlag.getTime())){
								let dataInFocus = getDataInFocus(timeWindow[0], timeWindow[timeWindow.length-1]);

								let dataOverMouse = [];
								dataInFocus.forEach(function(d){
									let currData = d.values[mouseDateIndex];
									dataOverMouse.push(currData);
								});
								//order descending
								dataOverMouse.sort(function(a,b){return b.value-a.value;});

															
								let categoriesInfo = [];
								for(let i = 0; i < Math.min(topKCategoriesTooltip,dataInFocus.length); i++){
									try {
											let currVal = dataOverMouse[i];
											categoriesInfo.push(currVal);
									}
									catch(err) {
									}
								}

								let x1 = scalesMultiresolution[selectAxisFocus(dateSelected)](dateSelected);  
								let y1 = 0;
								let x2 = scalesMultiresolution[selectAxisFocus(dateSelected)](dateSelected);  
								let y2 = heightMultiresolution;

								showVerticalRuler(x1,y1,x2,y2);
								showToolTipMultiresolution(dateSelected,"","",categoriesInfo,"","baselinetop");
								// showStoryTelling(dateSelected);

								// if(storyDateFlag.getTime()!= dateSelected.getTime()){
								// 	storyDateFlag = dateSelected;
								// 	showStoryTelling(dateSelected);
								// }

								tooltipFlag = dateSelected;
							}	
						
					})
					.on("mouseout",function(d){
						ratonOutMultiresolution();
						updateStorytellingPanels(storiesInit);
					});

					

					
	multiresolution.select("#flowsInFocus").selectAll(".focus")
			.on("mouseover",d=>{
					//ratonOverFlow(d);

			})
			.on("mousemove",function(d, i) {

				mousex = d3.mouse(this);
				mousex = mousex[0];// + 5;
				
				let dateSelected = timeTooltip(scalesMultiresolution[selectScaleFocusPixel(mousex)].invert(mousex)); //invert: get the domain, return range and viceversa
				let mouseDateIndex = timeWindow.map(Number).indexOf(+dateSelected); //To get the index of the date in array
				
					//If date existe in the array
					if(mouseDateIndex!=-1 && (dateSelected.getTime() != tooltipFlag.getTime())){
						
						let selectedCategory ="";
						selectedCategory = d.values[mouseDateIndex];

						//points for vertical ruler
						let x1 = scalesMultiresolution[selectAxisFocus(dateSelected)](dateSelected);  
						let y1 = yScaleMultiresolution(selectedCategory.y0);
						let x2 = scalesMultiresolution[selectAxisFocus(dateSelected)](dateSelected);  
						let y2 = yScaleMultiresolution((selectedCategory.y0 + selectedCategory.y));


						
						showVerticalRuler(x1,y1,x2,y2);
						showToolTipMultiresolution(dateSelected,"","",[selectedCategory],"","baselinebottom");
						// showStoryTelling(dateSelected);

						// if(storyDateFlag.getTime()!= dateSelected.getTime()){
						// 	storyDateFlag = dateSelected;
						// 	showStoryTelling(dateSelected);
						// }

						tooltipFlag = dateSelected;
					}
			})
			.on("mouseout", function(d, i) {
					ratonOutMultiresolution();
					ratonOutFlow();
					updateStorytellingPanels(storiesInit);					
			});
}

// function showToolTipEvents(date, event, what, who, media, who_from,text){
// 		//  showToolTipEvents(date, event, what, who, media, who_from);

// 	let imgPathEvent = event.pathImg;

	
// 	let first_line="";
// 	let second_line="";
// 	let thrid_line="";
// 	let four_line="";
// 	let five_line="";
// 	let six_line="";


// 	if(date!=""){
// 		first_line ="<div class='timeWrapper timeToWrapper'>"+
// 												"<span class='timeUp subtitle1'>" + lineUpTimeFormat(date) + "</span>"+
// 												"<span class='caption timeDown'>" + lineDownTimeFormat(date) +"</span>"+
// 										"</div>";
// 	}

// 	second_line = "<p></p>";
// 	thrid_line = "<p>"+
// 						"<span class='overline'>" + what + "&nbsp;</span>"+
// 						"<img class='icon' src='"+ imgPathEvent +"'>"+
// 					"</p>";
// 	if(who!="" && who_from!=""){
// 		four_line = "<p>"+
// 							"<span class='overline'>" + who + "&nbsp;</span>"+
// 							"<span class='overline'>(" + who_from + ")</span>"+
// 						"</p>";
// 	}

// 	let gapPosition = -100;
// 	if(media!=""){
// 		five_line = "<iframe id='myFrame' src='"+ media +"' allow='autoplay'></iframe>";
// 		gapPosition = -250;
// 	}

// 	if(text!=""){
// 		six_line = "<p>"+
// 							"<span class='overline'>" + text + "&nbsp;</span>"+
// 						"</p>";
// 	}


// 	// https://developers.google.com/youtube/player_parameters
// 	//"<iframe src='https://en.wikipedia.org/wiki/Beyoncé></iframe>"
// 	// <iframe id='myFrame' src='https://www.youtube.com/embed/gd_zSH0dFZg?&autoplay=1&controls=0&start=50' allow='autoplay'></iframe>
// 	//&start=50&end=60&loop=1
// 	let htmlText = 	first_line + second_line + thrid_line + four_line + five_line + six_line;


// 	tooltipEvents.style({
// 		"opacity":1,
// 		"display":"inline"
// 	});

// 	tooltipEvents.html(htmlText);
// 	let widthToolTipEvents = $("#tooltipEvent").width();
// 	let heightToolTipEvents = $("#tooltipEvent").height();
// 	tooltipEvents.style({"left":getTooltipLeftPosition(d3.event.pageX,widthToolTipEvents) + "px",
// 						"top":(d3.event.pageY + gapPosition) + "px"});
	
// }


function showVerticalRuler(x1,y1,x2,y2){

	verticalRulerBackground.attr("x1", x1 + "px")
								.attr("y1", y1 + "px")
								.attr("x2", x2 + "px")
								.attr("y2", y2 + "px")
								.style({
									// "left": (mousex) + "px",
									"opacity": 1,
									"display":"inline"
								});

	verticalRuler.attr("x1", x1 + "px")
								.attr("y1", y1 + "px")
								.attr("x2", x2 + "px")
								.attr("y2", y2 + "px")
								.style({
									// "left": (mousex) + "px",
									"opacity": 1,
									"display":"inline"
								});
}


function groupedTerm(myArrayTerm){
	let arrayOfTermControl = []; //faster
	let result = [];
	for(let i=0;i<myArrayTerm.length;i++){
		let curr = myArrayTerm[i];
		let index = arrayOfTermControl.indexOf(curr.term.toLowerCase());
		if(index==-1){ //means there is new
			arrayOfTermControl.push(curr.term.toLowerCase());//control
			result.push({"term":curr.term,"weight":curr.weight});
		}else{//means there is old
			result[index].weight = result[index].weight+curr.weight;
		}
	}

	result.sort(function(a,b){return b.weight-a.weight;});
	return result;
	// return d3.nest().key(function(d) {return d.key;}).entries(myArrayTerm.map(d=>{return {"key":d.term,"weight":d.weight};})).map(d=>{ return {"term":d.key,"weight":d.values[0].weight};});
}

function getMediaType(strMediaPath){
	if(strMediaPath.indexOf("http")==-1){
		return "tweet";	
	}
	return "image";
}

function appendAStory(id_parent_stories, index, currStory){

	let who = currStory.who;
	let who_from = currStory.who_from;
	let action = currStory.action;

	let date = currStory.date;
	let title = currStory.title;
	let subTitle = currStory.subtitle;
	let description = currStory.text;
	let arrayMedias = currStory.media;

	//STORY-ENTRY
	let story_entry = addElement(id_parent_stories,"div",id_parent_stories+"_story_"+index,"");
	story_entry.classList.add("story-entry");

	//DATE
	let htmlDate = "<span class='caption'>"+ lineUpTimeFormat(date) + " | " + lineDownTimeFormat(date)+"</span>";
	let story_date = addElement(story_entry.id,"div","",htmlDate);
	story_date.classList.add("date");

	//HEAD
	if(title!="" && typeof title !='undefined'){
		let htmlHead = "<h6 class='title'>"+title+"</h6>";
		let story_head = addElement(story_entry.id,"div","",htmlHead);
		story_head.classList.add("head");
	}

	//SUBHEAD 1
	// if(typeof currStory.subtitle !='undefined'){	
	if(subTitle !="" && typeof subTitle !='undefined'){		
		let htmlSubHead = "<p class='overline'>"+subTitle+"</p>";
		let story_sub_head = addElement(story_entry.id,"div","",htmlSubHead);
		story_sub_head.classList.add("subhead");
	}

	//SUBHEAD 2
	if(title == "" || typeof title =='undefined'){	
		let sub_head_two = who_from + " | "+ who + " | " + action;
		let htmlSubHeadTwo = "<p class='overline'>"+sub_head_two+"</p>";
		let story_sub_head_two = addElement(story_entry.id,"div","",htmlSubHeadTwo);
		story_sub_head_two.classList.add("subhead");
	}

	//DESCRIPTION
	if(description!=""){
		let htmlDescription = "<p class='body2'>"+description+"</p>";
		let story_description = addElement(story_entry.id,"div","",htmlDescription);
		story_description.classList.add("description");
	}

	//MEDIAS
	arrayMedias.forEach(function(currMedia,indexMedia){
		if(currMedia!=""){
			let typeMedia = getMediaType(currMedia);
			let idMedia = story_entry.id+"_"+indexMedia;
			let htmlMedia = "";
			let story_media = "";
			
			switch (typeMedia) {
				case "image":
					htmlMedia = "<img src='"+ currMedia+"' alt='UDAVIZ'></img>";
					story_media = addElement(story_entry.id,"div",idMedia,htmlMedia);
					// document.getElementById(idMedia).style.opacity=0;
					break;
				case "tweet":
					// let htmlMedia = ""; // "<blockquote class='twitter-tweet'><p lang='en' dir='ltr'>THIS is <a href='https://twitter.com/hashtag/Warframe?src=hash&amp;ref_src=twsrc%5Etfw'>#Warframe</a>. 🚀<br>🌎 Explore 18 Corrupted Worlds<br>💪 Wield 40 Legendary Warframes<br>⚔ Craft 100s of Distinct Weapons<br>⚙️ Experience Unrivaled Customization<br><br>Play now and you could win $250,000 towards a trip to space!</p>&mdash; WARFRAME (@PlayWarframe) <a href='https://twitter.com/PlayWarframe/status/1149347609338757122?ref_src=twsrc%5Etfw'>July 11, 2019</a></blockquote>";
					story_media = addElement(story_entry.id,"div",idMedia,htmlMedia);
					// document.getElementById(idMedia).style.opacity=0;
					twttr.widgets.createTweet(
						currMedia,
						document.getElementById(idMedia),
						{
							// theme: 'dark'
						}
					).then(function (el) {
						// console.log("Tweet displayed.");
						// document.getElementById(idMedia).style.opacity=1;
					});
					break;
				default:
					break;
			}
			story_media.classList.add("media");
		}
	});

	// let htmlMedia = "<blockquote class='twitter-tweet'><p lang='en' dir='ltr'>THIS is <a href='https://twitter.com/hashtag/Warframe?src=hash&amp;ref_src=twsrc%5Etfw'>#Warframe</a>. 🚀<br>🌎 Explore 18 Corrupted Worlds<br>💪 Wield 40 Legendary Warframes<br>⚔ Craft 100s of Distinct Weapons<br>⚙️ Experience Unrivaled Customization<br><br>Play now and you could win $250,000 towards a trip to space!</p>&mdash; WARFRAME (@PlayWarframe) <a href='https://twitter.com/PlayWarframe/status/1149347609338757122?ref_src=twsrc%5Etfw'>July 11, 2019</a></blockquote>";
	// let story_media = addElement(story_entry.id,"div","",htmlMedia);

	// //LOAD A TWEET AFTER DOM
	// // twttr.widgets.load();
	// // twttr.widgets.load(
	// // 	document.getElementById("id_parent_stories")
	// // );

}


function appendStoriesForADate(storiesByLabel,idDivStories){
	d3.select("#"+idDivStories).selectAll("div").remove();
	document.getElementById(idDivStories).style.opacity=1;
	storiesByLabel.forEach(function(d,index){
		appendAStory(idDivStories,index,d);
	});
}


function showStoryTelling(events){

	return
	
	if(isMobileDevice()){
		return;
	}

	let idTooltipStories = "tooltipStory";

	//d3.event.pageX
	tooltipStories.style({
		"opacity":1,
		"display":"inline",
		"left":(d3.event.pageX+5)+'px',
		"top":(d3.event.pageY-heightMultiresolution)+'px',
	});

	appendStoriesForADate(events,idTooltipStories);

}

function showToolTipMultiresolution(titleTool,subtitleTool1, subtitleTool2,categoriesTool,footnoteTool,baseline){

	let title_line ="<div class='timeWrapper timeToWrapper'><span class='timeUp subtitle1 text-bold'>" + lineUpTimeFormat(titleTool) + "</span><span class='caption timeDown text-bold'>" + lineDownTimeFormat(titleTool) +"</span></div>";
	let subtitle1_line = "<p class='subtitle1'>" + subtitleTool1  + "</p>";
	let subtitle2_line = "<p class='caption'>" + subtitleTool2  + "</p>";
	let categories_lines = "";
	for(let i=0;i<categoriesTool.length;i++){
		let currVal = categoriesTool[i];
		categories_lines = categories_lines + "<div><div class='category_color' style='background-color:"+ currVal.color + ";'></div><span class='subtitle2'>" + currVal.category + ":</span> <span class='subtitle1 quantitative'>" + customNumberFormat(currVal.value) + "</span><span class='overline'>" + " "+  dataType + "</span></div>";
	}

	let currStory = [];
	for(let i=0;i<categoriesTool.length;i++){
		currStory.push({"values":[categoriesTool[i]]});
	}

	updateStorytellingPanels(agregatedStories(currStory));

	let footnote_line = "<p class='caption foot'>" + footnoteTool  + "</p>";

	let htmlText = title_line + subtitle1_line+subtitle2_line+categories_lines+footnote_line;

	tooltip.style({
		"opacity":1,
		"display":"inline"
	});

	tooltipStories.style({
		"opacity":0,
		"display":"none"
	});


	tooltip.html(htmlText);

	let tooltipWidth =  $("#tooltipFlow").width();
	let tooltipHeight = $("#tooltipFlow").height();



	tooltip.style({
		"left":(getTooltipLeftPosition(d3.event.pageX,tooltipWidth))  + "px",
		"top":(d3.event.pageY-tooltipHeight) + "px"
	});

}

function getTooltipLeftPosition(left, widthTooltip){
	let left_position;
	let with_tooltip = widthTooltip;
	if((d3.event.pageX + with_tooltip) >= multistreamVisWidth){
		left_position = d3.event.pageX  - with_tooltip; 
	}else{
		left_position = left; // + with_tooltip/2 +16; 
	}
	return left_position;
}

function updateMainTitle(matchDetails){

	// let matches = getMatchesBetweenDates(matchDetails.matches, brushContext.extent()[0], brushContext.extent()[1]);
	// let currMatch;
	
	// if(matches.length===1){
	// 	currMatch = matches[0];
	// }else{
	// 	currMatch = matchDetails.default;
	// }

	// //clear before
	// document.getElementById("homeTeamName").innerHTML = "";
	// document.getElementById("homeTeamScore").innerHTML = "";
	// document.getElementById("homeTeamLogo").setAttribute("src","");
	// document.getElementById("awayTeamName").innerHTML = "";
	// document.getElementById("awayTeamScore").innerHTML = "";
	// document.getElementById("awayTeamLogo").setAttribute("src","");
	// document.getElementById("championship").innerHTML = "";
	// document.getElementById("stage").innerHTML = "";
	// document.getElementById("matchDate").innerHTML = "";
	// document.getElementById("matchPlace").innerHTML = "";

	// //clear mobil
	// document.getElementById("homeTeamLogoMobil").setAttribute("src","");
	// document.getElementById("awayTeamLogoMobil").setAttribute("src","");
	// document.getElementById("championshipMobil").innerHTML = "";
	// document.getElementById("matchDateMobil").innerHTML = "";

	// //setting
	// let homeTeamName = currMatch.homeTeamName;
	// let homeTeamPathImg = currMatch.homeTeamLogoPathImg;
	// let awayTeamName = currMatch.awayTeamName;
	// let awayTeamPathImg = currMatch.awayTeamLogoPathImg;
	// let homeTeamScore = currMatch.homeTeamScore;
	// let awayTeamScore = currMatch.awayTeamScore;
	// let matchDate = new Date(currMatch.matchDateStartUTC);
	// let championship = currMatch.championship;
	// let stage = currMatch.stage;
	// let matchPlace = currMatch.matchPlace;

	// document.getElementById("homeTeamName").innerHTML = homeTeamName;
	// document.getElementById("homeTeamScore").innerHTML = homeTeamScore;
	// document.getElementById("homeTeamScoreMobil").innerHTML = homeTeamScore;
	// document.getElementById("homeTeamLogo").setAttribute("src",homeTeamPathImg);
	// document.getElementById("homeTeamLogoMobil").setAttribute("src",homeTeamPathImg);

	// document.getElementById("awayTeamName").innerHTML = awayTeamName;
	// document.getElementById("awayTeamScore").innerHTML = awayTeamScore;
	// document.getElementById("awayTeamScoreMobil").innerHTML = awayTeamScore;
	// document.getElementById("awayTeamLogo").setAttribute("src",awayTeamPathImg);
	// document.getElementById("awayTeamLogoMobil").setAttribute("src",awayTeamPathImg);

	// if(championship!=""){
	// 	document.getElementById("championship").innerHTML = championship;
	// 	document.getElementById("championshipMobil").innerHTML = championship;
	// }
	// if(stage!=""){
	// 	document.getElementById("stage").innerHTML = "-"+stage+"-";
	// }
	// if(currMatch.matchDateStartUTC!=""){
	// 	document.getElementById("matchDate").innerHTML = customMatchDate(matchDate);
	// 	document.getElementById("matchDateMobil").innerHTML = customMatchDate(matchDate);
	// }
	// if(matchPlace!=""){
	// 	// let stadiumPlace = "Stadium: "+ matchPlace;
	// 	let stadiumPlace = 	"<i>"+matchPlace+"</i>";
	// 	document.getElementById("matchPlace").innerHTML = stadiumPlace;
	// }
}

function getMatchesBetweenDates(matches, dateLimMin, dateLimMax){
	return matches.filter(d=>{
		let matchStartDate = new Date(d.matchDateStartUTC);
		let matchFinishDate = new Date(d.matchDateFinishUTC);
		return isDateBetweenInclus(dateLimMin,dateLimMax,matchStartDate) || isDateBetweenInclus(dateLimMin,dateLimMax,matchFinishDate) ;
	});
}



function createGroupForContextBrushes() {
	/**
	 * CONTEXT CREATE BRUSHES
	 */
	var heighBrushContext = heightContext - 2;
//	var widthBrush = 3;
	
	if(optsContext.showBrushNormal){

		context.append("g")
				.attr("class", "brushNorRight")
				.call(brushContextNorRight)
				.selectAll("rect")
					.attr("y", 1)
					.attr('height',heighBrushContext)
					.on("mouseover", brushNorRightOver)
					.on("mouseout", brushOutAll);
			
		context.append("g")
				.attr("class", "brushNorLeft")
				.call(brushContextNorLeft)
				.selectAll("rect")
					.attr("y", 1)
					.attr('height', heighBrushContext)
					.on("mouseover", brushNorLeftOver)
					.on("mouseout", brushOutAll);

	}
	
	if(optsContext.showBrushDistortion){
	
		context.append("g")
				.attr("class", "brushDisLeft")
				.call(brushContextDisLeft)
				.selectAll("rect")
					.attr("y", 1)
					.attr('height', heighBrushContext)
					.on("mouseover", brushDisLeftOver)
					.on("mouseout", brushOutAll);
		
		context.append("g")
				.attr("class", "brushDisRight")
				.call(brushContextDisRight)
				.selectAll("rect")
					.attr("y", 1)
					.attr('height',heighBrushContext)
					.on("mouseover", brushDisRightOver)
					.on("mouseout", brushOutAll);

	}
	
	context.append("g")
			.attr("class", "brushZoom")
			.call(brushContext)
			.selectAll("rect")
				.attr("y", 1)
				.attr('height', heighBrushContext)
				.on("mouseover", brushZoomOver)
				.on("mouseout", brushOutAll)
				
				

	if(optsContext.blockedBrushZoom){
		d3.selectAll(".brushZoom").selectAll(".resize")
									.selectAll("rect")
									.style({
										"pointer-events":"none"
									});
	}				



	context.select(".brushNorLeft .resize.w").selectAll("rect")
	.style("visibility","visible");

	context.select(".brushNorLeft .resize.e").selectAll("rect")
		.style("display","none");

	/*  */
	context.select(".brushDisLeft .resize.w").selectAll("rect")
		.style("visibility","visible")
		;

	context.select(".brushDisLeft .resize.e").selectAll("rect")
		.style("display","none");

	/*  */
	context.select(".brushDisRight .resize.w").selectAll("rect")
		.style("display","none");

	context.select(".brushDisRight .resize.e").selectAll("rect")
		.style("visibility","visible")
		;

	/*  */
	context.select(".brushNorRight .resize.w").selectAll("rect")
		.style("display","none");
		
	context.select(".brushNorRight .resize.e").selectAll("rect")
		.style("visibility","visible")
		;


	/*  */
	context.select(".brushZoom .resize.w").selectAll("rect")
		.style("visibility","visible");

	context.select(".brushZoom .resize.e").selectAll("rect")
		.style("visibility","visible");



}

function brushOutAll(){
	return;
	brushZoomOut();
	brushDisLeftOut();
	brushDisRightOut();
	brushNorRightOut();
	brushNorLeftOut();
}



//
function brushZoomOver() {
	return;
	if(!optsMultiresolution.showLimitsAreas){
		if(blocage){
			brushOutAll();
		}else{
			multiresolution.select(".focusZoom")
				.style({
					"visibility": "visible"
				});
		}
	}
}
//
function brushZoomOut() {
	return;
	if(!optsMultiresolution.showLimitsAreas){
		multiresolution.select(".focusZoom").style({
			"visibility": "hidden"
		});
	}
}
//
//// -------------------------------------------------------
function brushDisLeftOver() {
	return;
	if(!optsMultiresolution.showLimitsAreas){
		if(blocage){
			brushOutAll();
		}else{
			multiresolution.selectAll(".focusDisLeft").style({
				"visibility": "visible"
			});
		}
	}
}
//
function brushDisLeftOut() {
	return;
	if(!optsMultiresolution.showLimitsAreas){
		multiresolution.selectAll(".focusDisLeft").style({
			"visibility": "hidden"
		});
	}
}
//
//// -------------------------------------------------------
function brushDisRightOver() {
	return;
	if(!optsMultiresolution.showLimitsAreas){
		if(blocage){
			brushOutAll();
		}else{
			multiresolution.select(".focusDisRight").style({
				"visibility": "visible"
			});
		}
	}
}
//
function brushDisRightOut() {
	return;
	if(!optsMultiresolution.showLimitsAreas){
		multiresolution.select(".focusDisRight").style({
			"visibility": "hidden"
		});
	}
}
//
//// -------------------------------------------------------
function brushNorRightOver() {
	return;
	if(!optsMultiresolution.showLimitsAreas){
		if(blocage){
			brushOutAll();
		}else{
			multiresolution.select(".focusNorRight").style({
				"visibility": "visible"
			});
		}
	}
}
//
function brushNorRightOut() {
	return;
	if(!optsMultiresolution.showLimitsAreas){
		multiresolution.select(".focusNorRight").style({
			"visibility": "hidden"
		});
	}
}
//
//// -------------------------------------------------------
//
function brushNorLeftOver() {
	return;
	if(!optsMultiresolution.showLimitsAreas){
		if(blocage){
			brushOutAll();
		}else{
			multiresolution.select(".focusNorLeft").style({
				"visibility": "visible"
			});
		}
	}
}
//
function brushNorLeftOut() {
	if(!optsMultiresolution.showLimitsAreas){
		multiresolution.select(".focusNorLeft").style({
			"visibility": "hidden"
		});
	}
}

//

// *************************************************
function lineNorLeftEnable() {
	multiresolution.selectAll(".lineNorLeft").style({
		"stroke-opacity" : 1
	})
}
function lineNorLeftDisable() {
	multiresolution.selectAll(".lineNorLeft").style({
		"stroke-opacity" : 0.2
	})
}

function lineNorRightEnable() {
	multiresolution.selectAll(".lineNorRight").style({
		"stroke-opacity" : 1
	})
}
function lineNorRightDisable() {
	multiresolution.selectAll(".lineNorRight").style({
		"stroke-opacity" : 0.2
	})
}

// ***************************************************
function lineDisLeftEnable() {
	multiresolution.selectAll(".lineDisLeft").style({
		"stroke-opacity" : 1
	})
}
function lineDisLeftDisable() {
	multiresolution.selectAll(".lineDisLeft").style({
		"stroke-opacity" : 0.2
	})
}

function lineDisRightEnable() {
	multiresolution.selectAll(".lineDisRight").style({
		"stroke-opacity" : 1
	})
}

function lineDisRightDisable() {
	multiresolution.selectAll(".lineDisRight").style({
		"stroke-opacity" : 0.2
	})
}

/**
 * 
 * Create Scales and Axis in Focus FOCUS : Normal , Zoom , Fisheye
 * 
 *	i 0 : Normal Left 
 *	i 1 : Transition Left
 *	i 2 : Zoom
 *	i 3 : Transition Right
 *	i 4 : Normal Right
 */
function createScalesAxisFocus(rangesDomainMultiresolution) {

	rangesDomainMultiresolution.map(function(element) {
		if (element.key == "NL") {
			element.domain = brushContextNorLeft.extent();
			element.values.map(function(element) {element.domain = brushContextNorLeft.extent();})
		} else if (element.key == "FL") {
			element.domain = brushContextDisLeft.extent();
			element.values.map(function(element, index) {element.domain = calculeExtent(brushContextDisLeft.extent(), index);})
		} else if (element.key == "Z") {
			element.domain = brushContext.extent();
			element.values.map(function(element) {element.domain = brushContext.extent();})
		} else if (element.key == "FR") {
			element.domain = brushContextDisRight.extent();
			element.values.map(function(element, index) {element.domain = calculeExtent(brushContextDisRight.extent(), index);})
		} else if (element.key == "NR") {
			element.domain = brushContextNorRight.extent();
			element.values.map(function(element) {element.domain = brushContextNorRight.extent();})
		}
	});

	// Delete All axis focus
	var div = multiresolution.selectAll(".x.axis").data([]);
	div.exit().remove();
	
	var divGrid = multiresolution.selectAll(".x.grid").data([]);
	divGrid.exit().remove();

	scalesMultiresolution = [];
	axisMultiresolution = [];
	
	//xAxisFocus
	for (var i = 0; i < rangesDomainMultiresolution.length; i++) {
		for (var j = 0; j < rangesDomainMultiresolution[i].values.length; j++) {
			
			scalesMultiresolution[scalesMultiresolution.length] = d3.time.scale()
					.clamp(true) // 
					.range([rangesDomainMultiresolution[i].values[j].range[0],rangesDomainMultiresolution[i].values[j].range[1]])
					.domain(rangesDomainMultiresolution[i].values[j].domain);

			axisMultiresolution[axisMultiresolution.length] = d3.svg.axis()
						.scale(scalesMultiresolution[scalesMultiresolution.length - 1])
						.tickFormat(customTimeFormat)
						.tickSize(-heightMultiresolution, 0)
						.tickPadding(5) // space-between-axis-label-and-axis
						.orient("top")
						;
			
			/* Grid Division Chaque interval of time */
			var axisGridDivision = d3.svg.axis()
								.scale(scalesMultiresolution[scalesMultiresolution.length-1])
								.orient("top")
								.tickSize(heightMultiresolution)
								// .ticks(getTimePolarity(polarityTemporal),stepTemporal)
								.ticks(getTimePolarity(getSuperiorTimePolarity(polarityTemporal)),stepTemporal)
								.tickFormat("");
			
			multiresolution.select("#x_grid_focus").append("g")
									.attr("class", "x grid area" +i+" "+j)
									.attr("transform", "translate(" +0 + ","+ heightMultiresolution + ")")
									.call(axisGridDivision)
//							 .selectAll(".tick")//V4 d3.js ??
//							 	 .classed("minor", function(d) { return d.getMinutes(); })
			



			//Default 1 minute or 1 hour or 1...
			//TEXT TICKS
			//i=1 and i=3 distortion.
			//else normal and zoom
			switch (polarityTemporal) { 
				case "m"://minutes
					if(i==1 || i==3){
						axisMultiresolution[axisMultiresolution.length - 1].ticks(d3.time.minutes, getNumIntervalsDistortion(polarityTemporal, i, j, sDisLeft, sDisRight));
					}else{
						axisMultiresolution[axisMultiresolution.length - 1].ticks(getNumberOfLabels(polarityTemporal, i, j));
					}
					break;
				case "h"://hours
					if(i==1 || i==3){
						axisMultiresolution[axisMultiresolution.length - 1].ticks(d3.time.hours, getNumIntervalsDistortion(polarityTemporal, i, j, sDisLeft, sDisRight));
					}else{
						axisMultiresolution[axisMultiresolution.length - 1].ticks(getNumberOfLabels(polarityTemporal, i, j));
					}
					break;
				case "d":
					if(i==1 || i==3){
						axisMultiresolution[axisMultiresolution.length - 1].ticks(d3.time.days, getNumIntervalsDistortion(polarityTemporal, i, j, sDisLeft, sDisRight));
					}else{
						axisMultiresolution[axisMultiresolution.length - 1].ticks(getNumberOfLabels(polarityTemporal, i, j));
					}
					break;
				case "b":
					if(i==1 || i==3){
						axisMultiresolution[axisMultiresolution.length - 1].ticks(d3.time.months, getNumIntervalsDistortion(polarityTemporal, i, j, sDisLeft, sDisRight));
					}else{
						axisMultiresolution[axisMultiresolution.length - 1].ticks(getNumberOfLabels(polarityTemporal, i, j));
					}
					break;
				case "y":
					if(i==1 || i==3){
						axisMultiresolution[axisMultiresolution.length - 1].ticks(d3.time.years, getNumIntervalsDistortion(polarityTemporal, i, j, sDisLeft, sDisRight));
					}else{
						axisMultiresolution[axisMultiresolution.length - 1].ticks(getNumberOfLabels(polarityTemporal, i, j));
					}
					break;
			}

		}
	}
	

	/* Append Axis Focus */
	for (var k = 0; k < axisMultiresolution.length; k++) {
		multiresolution.select("#x_axis_focus").append("g")
								.attr("class", "x axis focus" + k)
								.attr("transform", "translate(0,0)")
								.call(axisMultiresolution[k]);
	}	

}


/**
 * Get Scale Focus by Mouse Pixel Used for tool tip text
 * 
 * @param mouseCoordenate
 *            Get mouse coordenate
 * @returns {Number}
 */
function selectScaleFocusPixel(mouseCoordenate) {
//	console.log(rangesDomainFocus)
	var index = 0, count = 0;
	for (var i = 0; i < rangesDomainMultiresolution.length; i++) {
		for (var j = 0; j < rangesDomainMultiresolution[i].values.length; j++) {
			if (mouseCoordenate >= (rangesDomainMultiresolution[i].values[j].range[0])
					&& mouseCoordenate <= (rangesDomainMultiresolution[i].values[j].range[1])) {
				index = count;
			}
			count++;
		}
	}
	return index;
}



/**
 * FOCUS CREATION OF GRADIENTS FOR INTERPOLATE COLEURS
 */
function createGradientArrays(bottom_list) {
	
	multiresolution.append("g").attr("id","linearGradient");
	
	/* Gradient Part */

	var newGradientRight = function(index, colorBegin, colorEnd) {
		
		multiresolution.selectAll("#gradientRight"+index).data([]).exit().remove();
		
		var gradient = multiresolution.select("#linearGradient").append("defs").append("linearGradient")
														.attr("id", "gradientRight" + index)
														.attr("x1", "0%")
														.attr("y1", "0%")
														.attr("x2", "100%")
														.attr("y2", "0%")
														.attr("spreadMethod", "pad"); // pad, repeat, reflect

		gradient.append("stop")
				.attr("offset", "0%")
				.attr("stop-color",colorBegin)
				.attr("stop-opacity", 1)
				.style("fill-opacity", "1");

		gradient.append("stop")
				.attr("offset", "100%")
				.attr("stop-color",colorEnd)
				.attr("stop-opacity", 1);

	}

	// For Stroke line
	var newGradientRightStroke = function(index, colorBegin, colorEnd) {
		
		multiresolution.selectAll("#gradientRightStroke"+index).data([]).exit().remove();
		
		var gradient = multiresolution.select("#linearGradient").append("defs").append("linearGradient")
														.attr("id", "gradientRightStroke" + index)
														.attr("x1", "0%")
														.attr("y1", "0%")
														.attr("x2", "100%")
														.attr("y2", "0%")
														.attr("spreadMethod", "pad"); // pad, repeat, reflect

		gradient.append("stop")
				.attr("offset", "0%")
				.attr("stop-color",colorBegin)
				.attr("stop-opacity", 1)

		gradient.append("stop")
				.attr("offset", "80%")
				.attr("stop-color",colorEnd)
				.attr("stop-opacity", 1);

	}

	var newGradientLeft = function(index, colorBegin, colorEnd) {
		
		multiresolution.selectAll("#gradientLeft"+index).data([]).exit().remove();
		
		var gradient = multiresolution.select("#linearGradient").append("defs").append("linearGradient")
														.attr("id", "gradientLeft" + index)
														.attr("x1", "0%")
														.attr("y1", "0%")
														.attr("x2", "100%")
														.attr("y2", "0%")
														.attr("spreadMethod", "pad"); // pad, repeat, reflect

		gradient.append("stop")
				.attr("offset", "0%")
				.attr("stop-color",colorBegin)
				.attr("stop-opacity", 1);

		gradient.append("stop")
				.attr("offset", "100%")
				.attr("stop-color",colorEnd)
				.attr("stop-opacity", 1);

	}

	// For stroke line
	var newGradientLeftStroke = function(index, colorBegin, colorEnd) {
		
		multiresolution.selectAll("#gradientLeftStroke"+index).data([]).exit().remove();
		
		var gradient = multiresolution.select("#linearGradient").append("defs").append("linearGradient")
														.attr("id", "gradientLeftStroke" + index)
														.attr("x1", "0%")
														.attr("y1", "0%")
														.attr("x2", "100%")
														.attr("y2", "0%")
														.attr("spreadMethod", "pad"); // pad, repeat, reflect

		gradient.append("stop")
					.attr("offset", "20%")
					.attr("stop-color",colorBegin)
					.attr("stop-opacity", 1);

		gradient.append("stop")
					.attr("offset", "100%")
					.attr("stop-color",colorEnd)
					.attr("stop-opacity", 1);

	}

	bottom_list.forEach(function(key_bottom){
		var father_key = getFatherKey(key_bottom);
		var hierarchy_father_node = jerarquiaOrigen.getNodeByKey(father_key);
		var hierarchy_hijo_node = jerarquiaOrigen.getNodeByKey(key_bottom);
		if(optsMultiresolution.layersFadingColors){
			colorBegin = hierarchy_father_node.color.desaturate().brighten(layersFadingColorsFactor);	
		}else{
			colorBegin = hierarchy_father_node.color;
		}
		
		var colorEnd = hierarchy_hijo_node.color; // "red"; // color(index);

		newGradientLeft(hierarchy_hijo_node.key, colorBegin, colorEnd); // Gradient Left
		newGradientLeftStroke(hierarchy_hijo_node.key, colorBegin, colorEnd); // Gradient Left Stroke

		newGradientRight(hierarchy_hijo_node.key, colorEnd, colorBegin); // Gradient Right
		newGradientRightStroke(hierarchy_hijo_node.key, colorEnd, colorBegin); // Gradient Left Stroke			

	})
}


function getFatherKey(node_key){
	for(var i = 0; i < key_context_list_origin.length; i++){
		var top_key = key_context_list_origin[i];
		if(node_key.indexOf(top_key)!==-1){
			return top_key;
		}
	}
}

function calculateRangeFocus(factNor, factDis, factZoom) {
	
	//on pourrait savoir STi, pero deberia calcular con el # de interavlos del area de transicion y 
	//tomando en cuanta tambien los nuevos SD and SCi
	
	// number-of-minute-in-interval
	let nNorLeft = calculeNumIntervals(brushContextNorLeft,polarityTemporal, stepTemporal); 
	let nDisLeft = calculeNumIntervals(brushContextDisLeft,polarityTemporal, stepTemporal);
	let nZoom = calculeNumIntervals(brushContext,polarityTemporal, stepTemporal);
	let nDisRight = calculeNumIntervals(brushContextDisRight,polarityTemporal, stepTemporal);
	let nNorRight = calculeNumIntervals(brushContextNorRight,polarityTemporal, stepTemporal);
	let nTotal = nNorLeft + nDisLeft + nZoom + nDisRight + nNorRight;

	// Proportions
	let pNorLeft = (factNor * nNorLeft) / nTotal; 
	let pDisLeft = (factDis * nDisLeft) / nTotal; 
	let pZoom = (factZoom * nZoom)/ nTotal;
	let pDisRight = (factDis * nDisRight) / nTotal;
	let pNorRight = (factNor * nNorRight) / nTotal; 
	let pTotal = pNorLeft + pDisLeft + pZoom + pNorRight + pDisRight;
	
	//SNorLeft and SDisLeft are global
	// Size
	let sNorLeft = pNorLeft * ((widthIntern) / pTotal); 
	sDisLeft = pDisLeft * ((widthIntern) / pTotal); 
	let sZoom = pZoom * ((widthIntern) / pTotal);
	sDisRight = pDisRight * ((widthIntern) / pTotal); 
	let sNorRight = pNorRight * ((widthIntern) / pTotal);
	let sTotal = sNorLeft + sDisLeft + sZoom + sDisRight + sNorRight;
	
	// tailles-des-intervals fixes
	let iNorLeft = sNorLeft / nNorLeft;
	let iZoom = sZoom / nZoom;
	let iNorRight = sNorRight / nNorRight;

	//Calcule constante de croissance left distortion
	var stringConstanteLeft = "";
	stringConstanteLeft = stringConstanteLeft+nDisLeft; //#number of intervals
	for (var i = 0; i < nDisLeft; i++) {
		stringConstanteLeft = stringConstanteLeft + "\n" + iNorLeft;
	}
	stringConstanteLeft=stringConstanteLeft+"\n-"+sDisLeft; //add SDISLEFT
	var constanteL = PolyReSolveT(stringConstanteLeft);
	//
	
	//Calcule constante de croissance right distortion
	var stringConstanteRight = "";
	stringConstanteRight = stringConstanteRight+nDisRight;
	for (var i = 0; i < nDisRight; i++) {
		stringConstanteRight = stringConstanteRight + "\n" + iNorRight;
	}
	stringConstanteRight=stringConstanteRight+"\n-"+sDisRight;
	var constanteR = PolyReSolveT(stringConstanteRight);
//	console.log("R-" + optsMultistream.constanteR + "--");
	//
	
	if(optsMultistream.log){
		console.log("FACTEUR : factNor : " + factNor + ", factDis : " + factDis + ", factZoom : " + factZoom);
		console.log("NINTERVALS : nNorLeft : " + nNorLeft + ", nDisLeft : " + nDisLeft + ", nZoom : " + nZoom 
				+ ", nDisRight : " + nDisRight + ", nNorRight : " + nNorRight + ", nTotal : " + nTotal);
		console.log("PROPORTIONS : " + " pNorLeft : " + pNorLeft + ", pDisLeft : " + pDisLeft + ", pZoom : " + pZoom  + 			
				", pDisRight : " + pDisRight + ", pNorRight : " + pNorRight + ", pTotal : " + pTotal);
		console.log("SIZE : " + " sNorLeft : " + sNorLeft + ", sDisLeft : " + sDisLeft + ", sZoom : " + sZoom + 
				" sDisRight : " + sDisRight + ", sNorRight : " + sNorRight + ", sTotal : " + sTotal);
		console.log("SIZE INTERVALS : " + " iNorLeft : " + iNorLeft + ", iZoom : " + iZoom + ", iNorRight : " + iNorRight);
		console.log("--------------------------------")
	}
	
	var rangesFocus = []; // range-Local-Area
	rangesFocus.push({
		key : "NL",
		size : sNorLeft
	});
	
	calculateDistortionL(iNorLeft, nDisLeft, constanteL).forEach(function(element) { // return-valeurs-ascendent
		rangesFocus = rangesFocus.concat({
			key : "FL",
			size : element
		})
	});
	// Range Detail Area
	rangesFocus.push({
		key : "Z",
		size : sZoom
	});

	// Range Distortion Area
	calculateDistortionR(iNorRight, nDisRight,constanteR).forEach(function(element) { // return-valeurs-descendent
			rangesFocus = rangesFocus.concat({
				key : "FR",
				size : element
			})
	});

	// Range Local Area
	rangesFocus.push({
		key : "NR",
		size : sNorRight
	});

	if (validateDistortion(factNor, factDis, factZoom, iNorLeft, iNorRight, iZoom)) {
		return calculateAxisFocusIntervals(rangesFocus);
	} else {
		return null;
	}
}


function calculateAxisFocusIntervals(rangesFocus) {
	var axisFocus = [];

	for (var i = 0; i < rangesFocus.length; i++) {
		var axis = [];
		if (i == 0) {
			axis.push({
				key : rangesFocus[i].key,
				range : [ 0, rangesFocus[i].size ]
			})
		} else {
			axis.push({
				key : rangesFocus[i].key,
				range : [ axisFocus[i - 1].range[1],axisFocus[i - 1].range[1] + rangesFocus[i].size ]
			})
		}
		axisFocus = axisFocus.concat(axis);
	}
	return axisFocus;
}

// DISTORTION
/**
 * @param iNorLeft Size of an interval in NorLeft
 * @param numberInterval Number of intervals in DisLeft
 * @returns {Array}
 */
function calculateDistortionL(iNorLeft, numberInterval, constanteL) {
	iFunctionL = [];
	if(optsMultistream.log){
		console.log("calculando con optsMultistream.constanteL : " + constanteL);
	}
	for (var x = 1; x <= numberInterval; x++) {
		var g = (iNorLeft)*(Math.pow(constanteL, x));
		iFunctionL.push(g);
	}
	
	var sumDisLeft = 0;
	for (var i = 0; i < iFunctionL.length; i++) {
		sumDisLeft = sumDisLeft + iFunctionL[i];
	}
	return iFunctionL;
}

/**
 * @param iNorRight Size of an interval in NorRight
 * @param numberInterval Number of intervals in DisRight
 * @returns
 */
function calculateDistortionR(iNorRight, numberInterval,constanteR) {
	iFunctionR = [];
	if(optsMultistream.log){
		console.log("calculando con optsMultistream.constanteR : " + constanteR);
	}
	for (var x = 1; x <= numberInterval; x++) {
		var g = (iNorRight)*(Math.pow(constanteR, x));					
		iFunctionR.push(g);
	}
	return iFunctionR.reverse();
}

function validateDistortion(factNor, factDis, factZoom, iNorLeft, iNorRight, iZoom) {
	
	var validationIntervals = false;
	var validationDisLeft = false;
	var validationDisRight = false;
	var validationAlphaBetaGamma = false;
	
	let minIntervalNormal = 1;
	let minIntervalDis =  1;
	let minIntervalZoom = 1;


	//validate num intervals minimum for every interval in context brushes
	if((minIntervalNormal <= intervals(polarityTemporal, 0)) //normal left
	&& (minIntervalDis <= intervals(polarityTemporal, 1)) //dist left
	&& (minIntervalZoom <= intervals(polarityTemporal, 2)) //zoom
	&& (minIntervalDis <= intervals(polarityTemporal, 3)) //dist right
	&& (minIntervalNormal <= intervals(polarityTemporal, 4))){ // normal right
		validationIntervals = true;
	}
	
	//validation factZoom>factDis>factNor
	if((factZoom>factDis)&&(factDis>factNor)){
		validationAlphaBetaGamma = true;
	}
	
	//validation left distortion
	if (iFunctionL[0] >= iNorLeft && iFunctionL[iFunctionL.length-1]<=iZoom) {
		validationDisLeft = true
	}

	// validation Right distortion
	if (iFunctionR[0] <= iZoom && iFunctionR[iFunctionR.length-1] >= iNorRight) {
		validationDisRight = true;
	}
	
	if(validationIntervals 
	&& validationDisLeft
	&& validationDisRight
	&& validationAlphaBetaGamma
	){
		return true;
	}
	return false;
}




//This is the hardest process	
function updateFocus(calcule) {
	
	rangesDomainMultiresolution = (nest_by_key.entries(calcule));

	createScalesAxisFocus(rangesDomainMultiresolution)

	//HARD PART
	/* Move area */// 4 it is 3 areas
	for (var index = 0; index < 4; index++) {
		multiresolution.selectAll(".focus.area" + index)
					.attr("d", function(d) {return areaFocus(d, index);});
	}

}

/*  */
function beginValidation() {

	beginContext = [ {
			brushBegin : brushContextNorLeft.extent(),
			scaleDomain : xScaleContextNorLeft.domain(),
			scaleRange : xScaleContextNorLeft.range()
		}, {
			brushBegin : brushContextDisLeft.extent(),
			scaleDomain : xScaleContextDisLeft.domain(),
			scaleRange : xScaleContextDisLeft.range()
		}, {
			brushBegin : brushContext.extent(),
			scaleDomain : xScaleContext.domain(),
			scaleRange : xScaleContext.range()
		}, {
			brushBegin : brushContextDisRight.extent(),
			scaleDomain : xScaleContextDisRight.domain(),
			scaleRange : xScaleContextDisRight.range()
		}, {
			brushBegin : brushContextNorRight.extent(),
			scaleDomain : xScaleContextNorRight.domain(),
			scaleRange : xScaleContextNorRight.range()
		}, {
			facteurZoom : optsMultistream.facteurZoom,
			facteurDis : optsMultistream.facteurDis,
			facteurNor : optsMultistream.facteurNor
		} 
	];
	
}

/*  */
function backContext() {
	
	console.log("returning back context :(")
	
	/* NorLeft */
	xScaleContextNorLeft.domain(beginContext[0].scaleDomain)
						.range(beginContext[0].scaleRange);

	/* DisLeft */
	xScaleContextDisLeft.domain(beginContext[1].scaleDomain)
						.range(beginContext[1].scaleRange);

	/* Zoom */
	xScaleContext.domain(beginContext[2].scaleDomain)
					.range(beginContext[2].scaleRange);

	/* DisRight */
	xScaleContextDisRight.domain(beginContext[3].scaleDomain)
						.range(beginContext[3].scaleRange);

	/* NorRight */
	xScaleContextNorRight.domain(beginContext[4].scaleDomain)
						.range(beginContext[4].scaleRange);
	

	brushContextNorLeft.extent(beginContext[0].brushBegin);
	brushContextDisLeft.extent(beginContext[1].brushBegin);
	brushContext.extent(beginContext[2].brushBegin);
	brushContextDisRight.extent(beginContext[3].brushBegin);
	brushContextNorRight.extent(beginContext[4].brushBegin);
	
	context.select(".brushNorLeft").call(brushContextNorLeft);
	context.select(".brushDisLeft").call(brushContextDisLeft);
	context.select(".brushZoom").call(brushContext);
	context.select(".brushDisRight").call(brushContextDisRight);
	context.select(".brushNorRight").call(brushContextNorRight);

	
	var candadoLeft = context.selectAll("#candadoLeft");
	candadoLeft.attr("x",xScaleContext(brushContextNorLeft.extent()[0])-8);

	var candadoRight = context.selectAll("#candadoRight");
	candadoRight.attr("x",xScaleContext(brushContextNorRight.extent()[1])-8);
	
	updateRectanglesAndLinksInFocus();
	
}


function totalito(calcule){	
	updateFocus(calcule);
	updateRectanglesAndLinksInFocus();
	// execAlgosInZoomArea();
}

function callAnimation() {

	let calcule = calculateRangeFocus(optsMultistream.facteurNor, optsMultistream.facteurDis, optsMultistream.facteurZoom);

	if (calcule != null) {
		beginValidation();
		updateRectanglesAndLinksInFocus();
		if(animation){
			totalito(calcule);
		}
	}else{
		backContext();
	}
}


function loadExtent1(extent0) {
	var extent1;
	var d0;
	var d1;
	d0 = timeParser(extent0[0]), 
	d1 = timeParser(extent0[1]);
	extent1 = [d0,d1];
	return extent1;
}

function timeTooltip(time){
	let subHalf;
	let addHalf;
	let moyenne;
	
	if(stepTemporal==1){
		return getTimeRound(scalesMultiresolution[selectScaleFocusPixel(mousex)].invert(mousex),polarityTemporal);
	}
	subHalf = getTimeOffset(time, -stepTemporal,polarityTemporal);
	addHalf = getTimeOffset(time, stepTemporal,polarityTemporal);
	moyenne = getTimeOffset(getTimeWindow(subHalf, addHalf, polarityTemporal, stepTemporal)[0], Math.floor(stepTemporal/2),polarityTemporal);
	if(time <= moyenne){
		return getTimeWindow(subHalf, addHalf, polarityTemporal, stepTemporal)[0];
	}else{
		return getTimeWindow(subHalf, addHalf, polarityTemporal, stepTemporal)[1];
	}
	
}

//Used to get the moyen when brush move
//depends de stepTemporal
function timeParser(time) {
	let subHalf = getTimeOffset(getTimeRound(time,polarityTemporal), -stepTemporal, polarityTemporal);
	let addHalf = getTimeOffset(getTimeRound(time,polarityTemporal), stepTemporal, polarityTemporal);
	let timeParse = getTimeWindow(subHalf, addHalf, polarityTemporal, stepTemporal)[1];
	return timeParse;
}


function brushContextMove(jj) {

	ratonOutMultiresolution();

	let extent1 = loadExtent1(jj);	
	context.select(".brushZoom").call(brushContext.extent(extent1));

	if(brushContextFlag[0].getTime() != extent1[0].getTime() || brushContextFlag[1].getTime() != extent1[1].getTime()){
		// console.log("ACTUALIZAR;;;;;;;;;;;;")	
		// Distortion Areas
		let facteurBrusDisLeft = getTimeWindow(brushContextDisLeft.extent()[0],brushContextDisLeft.extent()[1], polarityTemporal,stepTemporal).length;
		let facteurBrusDisRight =  getTimeWindow(brushContextDisRight.extent()[0],brushContextDisRight.extent()[1], polarityTemporal,stepTemporal).length; 
		
		let extentDisLeft = [getTimeOffset(extent1[0],-facteurBrusDisLeft*stepTemporal,polarityTemporal), extent1[0]];
		let extentDisRight = [extent1[1], getTimeOffset(extent1[1],+facteurBrusDisRight*stepTemporal,polarityTemporal)];
		
		brushContextDisLeft.extent(extentDisLeft);
		context.select(".brushDisLeft").call(brushContextDisLeft);
	
		brushContextDisRight.extent(extentDisRight);
		context.select(".brushDisRight").call(brushContextDisRight);
		
		
		/* Distortion Area Left */
		// Update Scales por no ver l mouse en forma de cruz fea
		xScaleContextDisLeft.range([ xScaleContext(brushContextNorLeft.extent()[0]), xScaleContext(extent1[0]) ])
							.domain([ brushContextNorLeft.extent()[0], extent1[0] ]);
		
		xScaleContextDisRight.range([ xScaleContext(extent1[1]), xScaleContext(brushContextNorRight.extent()[1]) ])
							.domain([ extent1[1], brushContextNorRight.extent()[1] ]);
		
	
		// Local Areas
		let facteurBrusNorLeft = getTimeWindow(brushContextNorLeft.extent()[0],brushContextNorLeft.extent()[1], polarityTemporal,stepTemporal).length;
		let facteurBrusNorRight =  getTimeWindow(brushContextNorRight.extent()[0],brushContextNorRight.extent()[1], polarityTemporal,stepTemporal).length; 
		
		let extentNorLeft;
		if(lockedLeft){
			extentNorLeft = [brushContextNorLeft.extent()[0], brushContextDisLeft.extent()[0] ];	
		}else{
			extentNorLeft = [getTimeOffset(brushContextDisLeft.extent()[0],-facteurBrusNorLeft*stepTemporal,polarityTemporal), brushContextDisLeft.extent()[0]]
		}
		
		let extentNorRight
		if(lockedRight){
			extentNorRight = [brushContextDisRight.extent()[1],brushContextNorRight.extent()[1] ];
		}else{
			extentNorRight = [brushContextDisRight.extent()[1],getTimeOffset(brushContextDisRight.extent()[1],+facteurBrusNorRight*stepTemporal,polarityTemporal)];
		}
		
		brushContextNorLeft.extent(extentNorLeft);
		context.select(".brushNorLeft").call(brushContextNorLeft);
	
		brushContextNorRight.extent(extentNorRight);
		context.select(".brushNorRight").call(brushContextNorRight);
		
		// Update Scales por no ver l mouse en forma de cruz fea
		xScaleContextNorLeft.range([ 0, xScaleContext(brushContextDisLeft.extent()[0]) ])
							.domain([ dateMinRange, brushContextDisLeft.extent()[0] ]);
		
		xScaleContextNorRight.range([ xScaleContext(brushContextDisRight.extent()[1]), widthIntern ])
							.domain([ brushContextDisRight.extent()[1], dateMaxRange ]);
		

		if(!validatorBrushes()){
			backContext();
			return;
		}

		// ANIMATION
		callAnimation();
		
		//update the Flag
		brushContextFlag = extent1;
	}
}

function brushContextNorLeftMove() {
	
	let extent0 = brushContextNorLeft.extent(); 
	let extent1 = loadExtent1(extent0);
	d3.select(this).call(brushContextNorLeft.extent(extent1));
	
	if(brushContextNorLeftFlag[0].getTime() != extent1[0].getTime() || brushContextNorLeftFlag[1].getTime() != extent1[1].getTime()){
		
		//Changing range and domain in brushContextDifLeft
		xScaleContextDisLeft.range([xScaleContext(brushContextNorLeft.extent()[0]), xScaleContext(brushContext.extent()[0])])
							.domain([brushContextNorLeft.extent()[0], brushContext.extent()[0]]);
		
		context.select(".brushDisLeft").call(brushContextDisLeft);
	
		// ANIMATION
		callAnimation();
		
		brushContextNorLeftFlag = brushContextNorLeft.extent();
	}
}


function brushContextDisLeftMove() {

	let extent0 = brushContextDisLeft.extent();
	let extent1 = loadExtent1(extent0);
	d3.select(this).call(brushContextDisLeft.extent(extent1));
	
	if(brushContextDisLeftFlag[0].getTime() != extent1[0].getTime() || brushContextDisLeftFlag[1].getTime() != extent1[1].getTime()){
		
		let facteurBrusNorLeft = getTimeWindow(brushContextNorLeft.extent()[0],brushContextNorLeft.extent()[1], polarityTemporal,stepTemporal).length;
		let extentNorLeft;
		if(lockedLeft){
			extentNorLeft = [brushContextNorLeft.extent()[0], brushContextDisLeft.extent()[0] ];	
		}else{
			extentNorLeft = [getTimeOffset(brushContextDisLeft.extent()[0],-facteurBrusNorLeft,polarityTemporal), brushContextDisLeft.extent()[0]]
		}
		
		//Changing range and domain in BrushContextNorLeft
		xScaleContextNorLeft.range([0, xScaleContext(brushContextDisLeft.extent()[0])])
							.domain([dateMinRange, brushContextDisLeft.extent()[0]]);
		
		context.select(".brushNorLeft").call(brushContextNorLeft.extent(extentNorLeft));
	
		
		//Changing range and domain in DisLeft
		xScaleContextDisLeft.range([ xScaleContext(extentNorLeft[0]), xScaleContext(brushContext.extent()[0]) ])
							.domain([ extentNorLeft[0], brushContext.extent()[0] ]);
							
		// ANIMATION
		callAnimation();
		
		brushContextDisLeftFlag = brushContextDisLeft.extent();
	}
}

function brushContextDisRightMove() {

	let extent0 = brushContextDisRight.extent(); 
	let extent1 = loadExtent1(extent0);
	d3.select(this).call(brushContextDisRight.extent(extent1));

	if(brushContextDisRightFlag[0].getTime() != extent1[0].getTime() || brushContextDisRightFlag[1].getTime() != extent1[1].getTime()){
		
		let facteurBrusNorRight =  getTimeWindow(brushContextNorRight.extent()[0],brushContextNorRight.extent()[1], polarityTemporal,stepTemporal).length; 
		
		let extentNorRight
		if(lockedRight){
			extentNorRight = [brushContextDisRight.extent()[1],brushContextNorRight.extent()[1] ];
		}else{
			extentNorRight = [brushContextDisRight.extent()[1],getTimeOffset(brushContextDisRight.extent()[1],+facteurBrusNorRight,polarityTemporal)];
		}
		
		//Changing range and domain in BrushContextNorRight
		xScaleContextNorRight.range([xScaleContext(brushContextDisRight.extent()[1]),widthIntern ])
							 .domain([brushContextDisRight.extent()[1], dateMaxRange]);
		
		context.select(".brushNorRight").call(brushContextNorRight.extent(extentNorRight));
		
		//Changing range and domain in DisRight
		xScaleContextDisRight.range([xScaleContext(brushContext.extent()[1]), xScaleContext(extentNorRight[1]) ])
							.domain([ brushContext.extent()[1], extentNorRight[1] ]);
							
	
		// ANIMATION
		callAnimation();
	
		brushContextDisRightFlag = brushContextDisRight.extent();
	}

}

function brushContextNorRightMove() {
	
	let extent0 = brushContextNorRight.extent(); 
	let extent1 = loadExtent1(extent0);
	d3.select(this).call(brushContextNorRight.extent(extent1));
	
	if(brushContextNorRightFlag[0].getTime() != extent1[0].getTime() || brushContextNorRightFlag[1].getTime() != extent1[1].getTime()){
		
		xScaleContextDisRight.range([xScaleContext(brushContext.extent()[1]), xScaleContext(brushContextNorRight.extent()[1])])
							.domain([brushContext.extent()[1], brushContextNorRight.extent()[1]]);
		
		context.select(".brushDisRight").call(brushContextDisRight);
		
		// ANIMATION
		callAnimation();
		
		brushContextNorRightFlag = brushContextNorRight.extent();
	}
	
}


function updateRectanglesAndLinksInFocus(){
	
	var objNl = selectScaleFocus("NL");
	var objFl = selectScaleFocus("FL");
	var objZ = selectScaleFocus("Z");
	var objFr = selectScaleFocus("FR");
	var objNr = selectScaleFocus("NR");
	var heightVertical = heightMultiresolution + heightGapFocusContext;
	
	
	if(optsContext.showBrushNormal){

		// // --------------------------------------------------------
		// var verticalNl = multiresolution.select("#linksProjetions").selectAll(".lineNorLeft").data(objNl);
		
		// // update
		// verticalNl.attr("class", "lineNorLeft")
		// 			.attr("x1", function(d) {return scalesMultiresolution[d.index](d.domainMin)})
		// 			.attr("y1", heightMultiresolution)
		// 			.attr("x2", function(d) {return xScaleContext(brushContextNorLeft.extent()[0])})
		// 			.attr("y2", heightVertical);
		
		// // create
		// verticalNl.enter().append("line")
		// 		.attr("class", "lineNorLeft")
		// 		.attr("x1", function(d) {return scalesMultiresolution[d.index](d.domainMin)})
		// 		.attr("y1", heightMultiresolution)
		// 		.attr("x2", function(d) {return xScaleContext(brushContextNorLeft.extent()[0])}) 
		// 		.attr("y2", heightVertical);
		// // exit
		// verticalNl.exit().remove();

		// var verticalNr = multiresolution.select("#linksProjetions").selectAll(".lineNorRight").data(objNr);
		// // update
		// verticalNr.attr("class", "lineNorRight")
		// 			.attr("x1", function(d) {return scalesMultiresolution[d.index](d.domainMax)})
		// 			.attr("y1", heightMultiresolution)
		// 			.attr("x2", function(d) {return xScaleContext(brushContextNorRight.extent()[1])})
		// 			.attr("y2", heightVertical);
		// // create
		// verticalNr.enter().append("line")
		// 		.attr("class", "lineNorRight")
		// 		.attr("x1",function(d) {return scalesMultiresolution[d.index](d.domainMax)})
		// 		.attr("y1", heightMultiresolution)
		// 		.attr("x2", function(d) {return xScaleContext(brushContextNorRight.extent()[1])})
		// 		.attr("y2", heightVertical);
				
		// // exit
		// verticalNr.exit().remove();
	
	}

	if(optsContext.showBrushDistortion){

		var verticalFl = multiresolution.select("#linksProjetions").selectAll(".lineDisLeft").data(objNl);
		// update
		verticalFl.attr("class", "lineDisLeft")
					.attr("x1", function(d) {return scalesMultiresolution[d.index](d.domainMax)})
					.attr("y1", heightMultiresolution)
					.attr("x2", function(d) {return xScaleContext(brushContextDisLeft.extent()[0])})
					.attr("y2", heightVertical);
		// create
		verticalFl.enter().append("line")
				.attr("class", "lineDisLeft")
				.attr("x1",function(d) {return scalesMultiresolution[d.index](d.domainMax)}) //d.index = 0 always in local
				.attr("y1", heightMultiresolution)
				.attr("x2", function(d) {return xScaleContext(brushContextDisLeft.extent()[0])})
				.attr("y2", heightVertical);
		// exit
		verticalFl.exit().remove();
	
	
	
		var verticalFr = multiresolution.select("#linksProjetions").selectAll(".lineDisRight").data(objNr);
		// update
		verticalFr.attr("class", "lineDisRight")
					.attr("x1", function(d) {return scalesMultiresolution[d.index](d.domainMin)})
					.attr("y1", heightMultiresolution)
					.attr("x2", function(d) {return xScaleContext(brushContextNorRight.extent()[0])})
					.attr("y2", heightVertical);
		// create
		verticalFr.enter().append("line")
				.attr("class", "lineDisRight")
				.attr("x1",function(d) {return scalesMultiresolution[d.index](d.domainMin)})
				.attr("y1", heightMultiresolution)
				.attr("x2", function(d) {return xScaleContext(brushContextNorRight.extent()[0])})
				.attr("y2", heightVertical);
		// exit
		verticalFr.exit().remove();

	}
	
	


	if(optsContext.showContext){

		// var verticalZl = multiresolution.select("#linksProjetions").selectAll(".lineZoomLeft").data(objZ);
		// // update
		// verticalZl.attr("class", "lineZoomLeft")
		// 			.attr("x1", function(d) {return scalesMultiresolution[d.index](d.domainMin)})
		// 			.attr("y1", heightMultiresolution)
		// 			.attr("x2", function(d) {return xScaleContext(brushContext.extent()[0])})
		// 			.attr("y2", heightVertical);
		// // create
		// verticalZl.enter().append("line")
		// 		.attr("class", "lineZoomLeft")
		// 		.attr("x1",function(d) {return scalesMultiresolution[d.index](d.domainMin)})
		// 		.attr("y1", heightMultiresolution)
		// 		.attr("x2", function(d) {return xScaleContext(brushContext.extent()[0])})
		// 		.attr("y2", heightVertical);
		// // exit
		// verticalZl.exit().remove();

		// var verticalZr = multiresolution.select("#linksProjetions").selectAll(".lineZoomRight").data(objZ);
		// // update
		// verticalZr.attr("class", "lineZoomRight")
		// 			.attr("x1", function(d) {return scalesMultiresolution[d.index](d.domainMax)})
		// 			.attr("y1", heightMultiresolution)
		// 			.attr("x2", function(d) {return xScaleContext(brushContext.extent()[1])})
		// 			.attr("y2", heightVertical);
		// // create
		// verticalZr.enter().append("line")
		// 		.attr("class", "lineZoomRight")
		// 		.attr("x1",function(d) {return scalesMultiresolution[d.index](d.domainMax)})
		// 		.attr("y1", heightMultiresolution)
		// 		.attr("x2", function(d) {return xScaleContext(brushContext.extent()[1])})
		// 		.attr("y2", heightVertical);
		// // exit
		// verticalZr.exit().remove();

	}
		
	
	
	
	
	
	

	
	var nl = multiresolution.select("#linksProjetions").selectAll(".focusNorLeft").data(objNl);
	// update
	nl.attr("class", "focusNorLeft")
			.attr("x", function(d) {return scalesMultiresolution[d.index](d.domainMin)})
			.attr("y", 0)
			.attr("width",function(d) {return (scalesMultiresolution[d.index](d.domainMax) - scalesMultiresolution[d.index](d.domainMin))})
			.attr("height", heightMultiresolution)

	// create
	nl.enter().append("rect")
		.attr("class", "focusNorLeft")
		.attr("x", function(d) {return scalesMultiresolution[0](d.domainMin)})
		.attr("y", 0)
		.attr("width",function(d) {return (scalesMultiresolution[0](d.domainMax) - scalesMultiresolution[0](d.domainMin))})
		.attr("height", heightMultiresolution)

	// exit
	nl.exit().remove()


	var fl = multiresolution.select("#linksProjetions").selectAll(".focusDisLeft").data(objFl);
	// update
	fl.attr("class", "focusDisLeft")
			.attr("x", function(d) {return scalesMultiresolution[1](d.domainMin)})
			.attr("y", 0)
			.attr("width",function(d) {return (scalesMultiresolution[objFl.length](d.domainMax) - scalesMultiresolution[1](d.domainMin))})
			.attr("height", heightMultiresolution)

	// create
	fl.enter().append("rect")
		.attr("class", "focusDisLeft")
		.attr("x",function(d) {return scalesMultiresolution[1](d.domainMin)})
		.attr("y", 0)
		.attr("width",function(d) {return (scalesMultiresolution[objFl.length](d.domainMax) - scalesMultiresolution[1](d.domainMin))})
		.attr("height", heightMultiresolution)

	// exit
	fl.exit().remove()

	var nr = multiresolution.select("#linksProjetions").selectAll(".focusNorRight").data(objNr);
	// update
	nr.attr("class", "focusNorRight")
			.attr("x", function(d) {return scalesMultiresolution[d.index](d.domainMin)})
			.attr("y", 0)
			.attr("width",function(d) {return (scalesMultiresolution[d.index](d.domainMax) - scalesMultiresolution[d.index](d.domainMin))})
			.attr("height", heightMultiresolution)

	// create
	nr.enter().append("rect")
		.attr("class", "focusNorRight")
		.attr("x", function(d) {return scalesMultiresolution[d.index](d.domainMin)})
		.attr("y", 0)
		.attr("width",function(d) {return (scalesMultiresolution[d.index](d.domainMax) - scalesMultiresolution[d.index](d.domainMin))})
		.attr("height", heightMultiresolution)

	// exit
	nr.exit().remove()

	
	var fr = multiresolution.select("#linksProjetions").selectAll(".focusDisRight").data(objFr);

	// update
	fr.attr("class", "focusDisRight")
			.attr("x", function(d) {return scalesMultiresolution[objNr[0].index - objFr.length](d.domainMin)})
			.attr("y", 0)
			.attr("width",function(d) {return (scalesMultiresolution[objNr[0].index - 1](d.domainMax) - scalesMultiresolution[objNr[0].index- objFr.length](d.domainMin))})
			.attr("height", heightMultiresolution)
	
	// create
	fr.enter().append("rect")
		.attr("class", "focusDisRight")
		.attr("x", function(d) {return scalesMultiresolution[objNr[0].index - objFr.length](d.domainMin)})
		.attr("y", 0)
		.attr("width",function(d) {return (scalesMultiresolution[objNr[0].index - 1](d.domainMax) - scalesMultiresolution[objNr[0].index- objFr.length](d.domainMin))})
		.attr("height", heightMultiresolution)

	// exit
	fr.exit().remove()
	
	var z = multiresolution.select("#linksProjetions").selectAll(".focusZoom").data(objZ);
	// update
	z.attr("class", "focusZoom")
			.attr("x", function(d) {return scalesMultiresolution[d.index](d.domainMin)})
			.attr("y", 0)
			.attr("width",function(d) {return (scalesMultiresolution[d.index](d.domainMax) - scalesMultiresolution[d.index](d.domainMin))})
			.attr("height", heightMultiresolution)
	
	// create
	z.enter().append("rect")
			.attr("class", "focusZoom")
			.attr("x", function(d) {return scalesMultiresolution[d.index](d.domainMin)})
			.attr("y", 0)
			.attr("width",function(d) {return (scalesMultiresolution[d.index](d.domainMax) - scalesMultiresolution[d.index](d.domainMin))})
			.attr("height", heightMultiresolution)

	// exit
	z.exit().remove()
	
	
	
	
	
	
	
	
	
	
	
	if(optsContext.showBrushNormal){
	
		//CANDADO
		var candadoLeft = context.selectAll("#candadoLeft").data([1]);
			
		//update
		candadoLeft.attr("x",xScaleContext(brushContextNorLeft.extent()[0])-8);
		
		//create
		candadoLeft.enter().append("image")
				.attr("id","candadoLeft")
				.attr("class","candadoLeft")
				.attr({
					'xlink:href': function(){return (optsContext.blockedBrushNormal)?pathCandadoClose:pathCandadoOpen;},  // can also add svg file here
					x: xScaleContext(brushContextNorLeft.extent()[0])-8,
					y: heightContext,
					width: 16,
					height: 16
				})
				.style("cursor","hand")
				.style("visibility","visible")
				;
			
		
		var candadoRight = context.selectAll("#candadoRight").data([1]);
			
		//update
		candadoRight.attr("x",xScaleContext(brushContextNorRight.extent()[1])-8);
		
		//create
		candadoRight.enter().append("image")
				.attr("id","candadoRight")
				.attr("class","candadoRight")
				.attr({
					'xlink:href': function(){return (optsContext.blockedBrushNormal)?pathCandadoClose:pathCandadoOpen;},  // can also add svg file here
					x: xScaleContext(brushContextNorRight.extent()[1])-8,
					y: heightContext,
					width: 16,
					height: 16
				})
				.style("cursor","hand")
				;
	}
	
}



/**
 * FOCUS Get scale in focus
 * 
 * @param codeScale
 * @returns {Array}
 */
function selectScaleFocus(codeScale) {
	var result = [];
	count = 0;

	for (var i = 0; i < rangesDomainMultiresolution.length; i++) {
		for (var j = 0; j < rangesDomainMultiresolution[i].values.length; j++) {
			if (codeScale == rangesDomainMultiresolution[i].values[j].key
					&& codeScale != "FL" && codeScale != "FR") {
				var obj = {};
				obj.index = count;
				obj.domainMin = rangesDomainMultiresolution[i].values[j].domain[0];
				obj.domainMax = rangesDomainMultiresolution[i].values[j].domain[1];
				result.push(obj);
			} else if (codeScale == rangesDomainMultiresolution[i].values[j].key
					&& codeScale == "FL"
					|| codeScale == rangesDomainMultiresolution[i].values[j].key
					&& codeScale == "FR") {
				var obj = {};
				obj.index = count;
				obj.domainMin = rangesDomainMultiresolution[i].domain[0];
				obj.domainMax = rangesDomainMultiresolution[i].domain[1];
				result.push(obj);
			}
			count++;
		}
	}

	return result;
}

/**
 * FOCUS Get axis in focus given a date
 * 
 * @param date
 * @returns {Number}
 */
function selectAxisFocus(date) {
//	console.log("fecha es:",date)
	var index = 0;
	var count = 0;
	for (var i = 0; i < rangesDomainMultiresolution.length; i++) {
		for (var j = 0; j < rangesDomainMultiresolution[i].values.length; j++) {
			if (date >= (rangesDomainMultiresolution[i].values[j].domain[0]) //>=
					&& date <= (rangesDomainMultiresolution[i].values[j].domain[1])) {
				index = count;
			}
			count++;
		}
	}
	if(date<=brushContextNorLeft.extent()[0]){
		index = 0; //first range
	}else if(date>=brushContextNorRight.extent()[1]){
		index = count - 1;// rangesDomainFocus.length; //last range
	}
	return index;
}


/**
 * FOCUS Append areas
 * 
 * @param index
 * @returns
 */
function areaFocus(d, index) {
	// Update each x axis in focus : Local, Distortion, Detailed
	
	/* NORMAL AREA */
	areaNormal = d3.svg.area()
			.interpolate(interpolateType)
			.defined(function(d) {
						let var1 = getTimeOffset(brushContextNorLeft.extent()[0], -stepTemporal, polarityTemporal);
						let var2 = getTimeOffset(brushContextNorLeft.extent()[1], stepTemporal, polarityTemporal);
						let var3 = getTimeOffset(brushContextNorRight.extent()[0], -stepTemporal, polarityTemporal);
						let var4 = getTimeOffset(brushContextNorRight.extent()[1], stepTemporal, polarityTemporal);

						let interpolationLeft1 = getTimeOffset(brushContextNorLeft.extent()[0],-1*stepTemporal,polarityTemporal);
						let interpolationLeft2 = getTimeOffset(brushContextNorLeft.extent()[1],-2*stepTemporal,polarityTemporal);
						let interpolationRight1 = getTimeOffset(brushContextNorRight.extent()[0],+3*stepTemporal,polarityTemporal);
						let interpolationRight2 = getTimeOffset(brushContextNorRight.extent()[1],+1*stepTemporal,polarityTemporal);
//						return d.date;
						if(interpolationLeft1 < dateMinRange && interpolationLeft2 < dateMinRange){
							return d.date >= (var3) && d.date <= (var4);
						}else if(interpolationRight1 > dateMaxRange && interpolationRight2 > dateMaxRange){
							return d.date >= (var1) && d.date <= (var2);
						} else{						
							return (d.date >= (var1) && d.date <= (var2))
							||     
							(d.date >= (var3) && d.date <= (var4))
							;
						}
					})
					.x(function(d) {return scalesMultiresolution[selectAxisFocus(d.date)](d.date);})
					.y0(function(d) {return yScaleMultiresolution(d.y0);})
					.y1(function(d) {return yScaleMultiresolution(d.y0 + d.y);});

	/* LEFT DISTORTION */
	areaDistortionLeft = d3.svg.area()
				.interpolate(interpolateType)
				.defined(function(d) {
						
						let var1 = getTimeOffset(brushContextDisLeft.extent()[0], -stepTemporal,polarityTemporal);
						let var2 = getTimeOffset(brushContextDisLeft.extent()[1], stepTemporal,polarityTemporal);
						//
						let interpolationLeft1 = getTimeOffset(brushContextDisLeft.extent()[0],-2*stepTemporal,polarityTemporal);
						let interpolationLeft2 = getTimeOffset(brushContextDisLeft.extent()[1],-2*stepTemporal,polarityTemporal);
						
						if(interpolationLeft1 < dateMinRange && interpolationLeft2 < dateMinRange ){
							return false;
						}
						return d.date >= (var1) && d.date <= (var2)
					})
					.x(function(d) {return scalesMultiresolution[selectAxisFocus(d.date)](d.date);})
					.y0(function(d) {return yScaleMultiresolution(d.y0);})
					.y1(function(d) {return yScaleMultiresolution(d.y0 + d.y);});

	/* ZOOM */
	areaZoom = d3.svg.area() 
			.interpolate(interpolateType)
			.defined(function(d) {
				
				let var1 = getTimeOffset(brushContext.extent()[0],-stepTemporal,polarityTemporal);
				let var2 = getTimeOffset(brushContext.extent()[1],stepTemporal,polarityTemporal);
//				return d.date;
				return d.date >= (var1) && d.date <= (var2);
			})
			.x(function(d) { return scalesMultiresolution[selectAxisFocus(d.date)](d.date);})
			.y0(function(d) { return yScaleMultiresolution(d.y0);})
			.y1(function(d) { return yScaleMultiresolution(d.y0 + d.y);});

	/* RIGHT DISTORTION */
	areaDistortionRight = d3.svg.area()
			.interpolate(interpolateType)
			.defined(function(d) {
				let var1 = getTimeOffset(brushContextDisRight.extent()[0],-stepTemporal,polarityTemporal);
				let var2 = getTimeOffset(brushContextDisRight.extent()[1], stepTemporal,polarityTemporal);
				//
				let interpolationRight1 = getTimeOffset(brushContextDisRight.extent()[0],+4*stepTemporal,polarityTemporal);
				let interpolationRight2 = getTimeOffset(brushContextDisRight.extent()[1],+4*stepTemporal,polarityTemporal);
				
				if(interpolationRight1 > dateMaxRange && interpolationRight2 > dateMaxRange ){
					return false;
				}
				return d.date >= (var1) && d.date <= (var2);
			})
			.x(function(d) {return scalesMultiresolution[selectAxisFocus(d.date)](d.date);})
			.y0(function(d) {return yScaleMultiresolution(d.y0);})
			.y1(function(d) {return yScaleMultiresolution(d.y0 + d.y);});

	switch (index) {
		case 0:
//			return null;
			return areaNormal(d.values);
			break;
		case 1:
//			return null;
			return areaDistortionLeft(d.values);
			break;
		case 2:
//			return null;
			return areaDistortionRight(d.values);
			break;
		case 3:
			return areaZoom(d.values);
			break;
	}
}

/**
 * CONTEXT Calcule each interval in brushExtent
 * 
 * @param brushExtent
 * @param index
 * @returns {Array}
 */
function calculeExtent(brushExtent, index) {
	let extent = [];
	let d0 = getTimeOffset(brushExtent[0], index * stepTemporal, polarityTemporal);
	let d1 = getTimeOffset(brushExtent[0], index * stepTemporal + stepTemporal, polarityTemporal);
	
	extent = [d0, d1]
	return extent;
}


function ratonOutMultiresolution(){

	tooltipFlag = new Date();

	verticalRulerBackground.style({
		"opacity":0,
		"display":"none"
	});
	verticalRuler.style({
		"opacity":0,
		"display":"none"
	});
	tooltip.style({
		"opacity":0,
		"display":"none"
	});
	tooltipEvents.style({
		"opacity":0,
		"display":"none"
	});

	$( "#myFrame" ).remove();
	
	d3.select("#multiresolutionBackground").attr("class","background");
	
	// multiresolution.selectAll(".x.grid").style({
	// 	"stroke":"black"
	// });
}


function brushStart(){

	
	ratonOutMultiresolution();
	blocage = true;
}


function brushEnd(){
	ratonOutMultiresolution();
	blocage = false;
	if (!animation) {
		// console.log("call totalito")
		let calcule = calculateRangeFocus(optsMultistream.facteurNor, optsMultistream.facteurDis, optsMultistream.facteurZoom);
		totalito(calcule);
	}
	execAlgosInZoomArea();
}


function updateScaleDomainRangeBrushContext(barZoomLeft,barZoomRight,barNorLeft,barDisLeft,barDisRight,barNorRight){

	//get domain and range
	/* NorLeft */
	xScaleContextNorLeft.range([ 0, xScaleContext(barDisLeft) ])//px
											.domain([ dateMinRange, barDisLeft ]);//dates

	/* DisLeft */
	xScaleContextDisLeft.range([xScaleContext(barNorLeft), xScaleContext(barZoomLeft)])
											.domain([barNorLeft, barZoomLeft]);

	/* DisRight */
	xScaleContextDisRight.range([ xScaleContext(barZoomRight), xScaleContext(barNorRight)]) //px
												.domain([ barZoomRight, barNorRight ]); //dates
	
	/* NorRight */
	xScaleContextNorRight.range([ xScaleContext(barDisRight), widthIntern ])
												.domain([ barDisRight, dateMaxRange ]);										

	//get extent
	brushContext.extent([barZoomLeft,barZoomRight]);
	brushContextNorRight.extent([barDisRight, barNorRight]);
	brushContextDisRight.extent([barZoomRight,barDisRight]);
	brushContextNorLeft.extent([barNorLeft, barDisLeft]);
	brushContextDisLeft.extent([barDisLeft,barZoomLeft]);

	context.select(".brushNorLeft").call(brushContextNorLeft);
	context.select(".brushDisLeft").call(brushContextDisLeft);
	context.select(".brushZoom").call(brushContext);
	context.select(".brushDisRight").call(brushContextDisRight);
	context.select(".brushNorRight").call(brushContextNorRight);


	//FLAG TO IMPROVE UPDATE TIME
	brushContextFlag = brushContext.extent();
	brushContextNorLeftFlag = brushContextNorLeft.extent();
	brushContextNorRightFlag = brushContextNorRight.extent();
	brushContextDisLeftFlag = brushContextDisLeft.extent();
	brushContextDisRightFlag = brushContextDisRight.extent();

}


function InitBarPositionBrushInContext(){

	let barZoomLeft;
	let barZoomRight;
	let barNorLeft;
	let barDisLeft;
	let barDisRight;
	let barNorRight;

	if(optsContext.timeIntervalBrushZoom.length == 0 
		&& optsContext.timeIntervalBrushNormalLeft.length==0
		&& optsContext.timeIntervalBrushNormalRight.length ==0
		&& optsContext.timeIntervalBrushDistortionLeft.length ==0
		&& optsContext.timeIntervalBrushDistortionRight.length ==0){
		
		//Getting Averange date depends of stepTemporal
		let indexDateAveRange = Math.round(timeWindow.length/2);
		
		//Colors bars position in scale
		let timeStepUntilZoomLeft = indexDateAveRange - numTimeStepBrushZoom;
		let timeStepUntilZoomRight = indexDateAveRange + numTimeStepBrushZoom;
		let timeStepUntilDisLeft = timeStepUntilZoomLeft - numTimeStepBrushDistortion;
		let timeStepUntilNorLeft = timeStepUntilDisLeft - numTimeStepBrushNormal;
		let timeStepUntilDisRight = timeStepUntilZoomRight + numTimeStepBrushDistortion;
		let timeStepUntilNorRight = timeStepUntilDisRight + numTimeStepBrushNormal;

		//
		barZoomLeft = timeWindow[timeStepUntilZoomLeft];
		barZoomRight = timeWindow[timeStepUntilZoomRight];
		barNorLeft = timeWindow[timeStepUntilNorLeft];
		barDisLeft = timeWindow[timeStepUntilDisLeft];
		barDisRight = timeWindow[timeStepUntilDisRight];
		barNorRight = timeWindow[timeStepUntilNorRight];
		
	}else{
		barZoomLeft = new Date(optsContext.timeIntervalBrushZoom[0]);
		barZoomRight = new Date(optsContext.timeIntervalBrushZoom[1]);
		barNorLeft = new Date(optsContext.timeIntervalBrushNormalLeft[0]);
		barDisLeft = new Date(optsContext.timeIntervalBrushDistortionLeft[0]);
		barDisRight = new Date(optsContext.timeIntervalBrushDistortionRight[1]);
		barNorRight = new Date(optsContext.timeIntervalBrushNormalRight[1]);
	}


	updateScaleDomainRangeBrushContext(barZoomLeft,barZoomRight,barNorLeft,barDisLeft,barDisRight,barNorRight);


}


function createBrushInContext(){

	brushContext.x(xScaleContext)
							.on("brushstart",brushStart)
					.on("brush",function(d){
						brushContextMove(brushContext.extent())
					})
					.on("brushend", brushEnd);

	//NorRight
	brushContextNorRight.x(xScaleContextNorRight)
								.on("brushstart", brushStart)
								.on("brush", brushContextNorRightMove)
								.on("brushend", brushEnd);
					

	//DisRight
	brushContextDisRight.x(xScaleContextDisRight)
								.on("brushstart", brushStart)
								.on("brush", brushContextDisRightMove)
								.on("brushend", brushEnd);

	//////////////////

	
	//NorLeft
	brushContextNorLeft.x(xScaleContextNorLeft)
								.on("brushstart", brushStart)
								.on("brush", brushContextNorLeftMove)
								.on("brushend", brushEnd);
	
	
	//DisLeft
	brushContextDisLeft.x(xScaleContextDisLeft)
								.on("brushstart", brushStart) // click down
								.on("brush", brushContextDisLeftMove) // move
								.on("brushend", brushEnd); // 
		


	

}


function validatorBrushes(){

	let limitNorLeft = brushContextNorLeft.extent()[0];
	let limitDisLeft = brushContextDisLeft.extent()[0];
	let limitZoomLeft = brushContext.extent()[0];
	let limitZoomRight = brushContext.extent()[1];
	let limitDisRight = brushContextDisRight.extent()[1];
	let limitNorRight = brushContextNorRight.extent()[1];

	
	if(limitNorLeft<limitDisLeft 
		&& limitDisLeft<limitZoomLeft 
		&& limitZoomRight<limitDisRight
		&& limitDisRight<limitNorRight){
			return true;
		}
	return false;
}

function moveContextByKeyboard(cuantosPasosTemporal, blockLeft, blockRight){

	let newTimeExtentLeft = brushContext.extent()[0];
	if(!blockLeft){
		newTimeExtentLeft = getNewTimeStep(newTimeExtentLeft,cuantosPasosTemporal)
	}
	
	let newTimeExtentRight = brushContext.extent()[1];
	if (!blockRight){
		newTimeExtentRight = getNewTimeStep(newTimeExtentRight,cuantosPasosTemporal)
	}

	brushContextMove([newTimeExtentLeft,newTimeExtentRight]);

}

function getNewTimeStep(currTimeStep,howManySteps){
	return getTimeOffset(currTimeStep,howManySteps*stepTemporal,polarityTemporal);
}




