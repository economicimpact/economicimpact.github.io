var jerarquiaOrigen;

var key_focus_list_origin = [];
var key_context_list_origin = [];

var leaf_level = [];
var nivel_focus_origin = [];
var nivel_context_origin = [];

var legend_y_origin = "Num. of tweets";
var timerStoriesPanel;

//used in multistream text label and map land label
var text_font_family = "Roboto";
var t = d3.transition();
var customNumberFormat = d3.format(".2s");

var customMatchDate = d3.time.format("%a %d %b %Y, %H:%M");

var lineUpTimeFormat = d3.time.format.multi([
	["%H:%M", function(d) {return d.getMinutes(); }],
	["%H %p", function(d) { return d.getHours(); }],
	["%a %d %b", function(d) { return d.getDay() && d.getDate() != 1; }],
	["%b %d", function(d) { return d.getDate() != 1; }],
	["%B", function(d) { return d.getMonth(); }],
	["%Y", function() { return true; }]
	]);

var lineDownTimeFormat = d3.time.format.multi([
	// ["%a %d %b", function(d) { return d.getDay() && d.getDate() != 1; }],
	["%b %d, %Y", function(d) { return d.getDate() != 1; }],
	["%B", function(d) { return d.getMonth(); }],
	["%Y", function() { return true; }]
	]);

	
// var customTimeFormatTitle = d3.time.format.multi([
// 	["%I:%M", function(d) { return d.getMinutes(); }],
// 	["%I %p", function(d) { return d.getHours(); }],
// 	["%a %d %b", function(d) { return d.getDay() && d.getDate() != 1; }],
// 	["%b %d", function(d) { return d.getDate() != 1; }],
// 	["%B", function(d) { return d.getMonth(); }],
// 	["%Y", function() { return true; }]
//   ]);

  var customTimeFormat = d3.time.format.multi([
	[".%L", function(d) { return d.getMilliseconds(); }],
	[":%S", function(d) { return d.getSeconds(); }],
	["%H:%M", function(d) { return d.getMinutes(); }],
	["", function(d) { return d.getHours() ; }],
	["%d %B", function(d) { return d.getDay() && d.getDate() != 1; }],
	["%d %B ", function(d) { return d.getDate() != 1; }],
	["%B %Y", function(d) { return d.getMonth(); }],
	["%Y", function() { return true; }]
  ]);


// =========================
// TREE
var hierarchy = [];
var root_key = 'R0' ;
var color_range_children = [];
var num_leaf_children;
var tree_height;
const node_radius = 9; // px
var colores_d3 =  d3.scale.category10(); 
var tree = d3.layout.tree();
var color_begin_range = "white";


// ==========================
// MULTIRESOLUTION
var dateExtRange; 
var dateMinRange; 
var dateMaxRange; 
var categories;

// ==========================
//GLOBALS
var events;
var dataType;
var timeWindow;

// ==========================
//OPTS
var optsGeneral;
var optsMultistream;
var optsMultiresolution;
var optsContext;
var optsMap;
var optsTree;
var optsEvents;
var optsMatch;

// ==========================
// LOG
var timerStart;

function setNumChildrenLeaf(d){
	if(d.children){
		d.children.forEach(setNumChildrenLeaf);
	}else{
		num_leaf_children ++;
	}
}

function addingKeyNuevo(d,index){

	d.name = d.name.toLowerCase();
	d.key =  d.parent.key + "_" + index;
	
	if(d.depth == 1){
		//num_initial_color < 5 ? color_root = colores_d3(index) : color_root = colores_brewer(index);
		color_root = num_initial_color < 5 ? colores_d3(index) : colores_brewer(index);
		d.color = chroma(color_root).desaturate().brighten(0.4);
		
		num_leaf_children = 0;
		// child_index = 0;
		setNumChildrenLeaf(d);
		
		let color_finish_range = chroma(color_root).saturate().darken();

		if(num_leaf_children>10){
			num_leaf_children = num_leaf_children+3;
		}else{
			num_leaf_children = num_leaf_children+1;
		}
		color_range_children =  chroma.scale([color_begin_range,color_finish_range]).colors(num_leaf_children);
	}
	if(d.children){
		numberChild = d.children.length;
			// d.children.forEach(addingKeyNuevo,index);
			d.children.forEach((c,i)=>{
				addingKeyNuevo(c,i);
			});
	}else{
		let child_index = --num_leaf_children;
		if(!d.color)
		d.color = color_range_children[child_index];
		// d.color = color_range_children[child_index];
		d.visible = true;
		if(!d.img)
		d.img = "";
	}
}


function preProcessingRawData(rawData){
	rawData.forEach(d=>d.date = new Date(d.date));
}

function preProcessingRawEvents(rawEvents){
	rawEvents.forEach(d=>d.date = new Date(d.date));
}

function setLoader(display){
	if(display){
		document.getElementById("loader").style.display = "inline";
		document.getElementById("mainWrapper").style.opacity = 0;
		
	}else{
		document.getElementById("loader").style.display = "none";
		document.getElementById("mainWrapper").style.opacity = 1;
	}
}


function groupByCategory(arrayIndicators){
	
	let sumGroup = 0;
	let textGroup = [];
	let placeGroup = [];
	let linkGroup = [];
	
	let gByCategory = d3.nest().key(function(d) {return d.category;}).entries(arrayIndicators.map(d=>d));
	
	gByCategory.forEach(function(d){
		//sum by group
		sumGroup = d.values.reduce(function(acc,curr){
			return acc + curr.value;
		},0);
		
		//aggregate text, places, links
		d.values.forEach(function(element){
			textGroup.push(element.text);
			placeGroup.push(element.place);
			linkGroup.push(element.link);
		});
	});

	let grouped  = {
				"date":gByCategory[0].values[0].date,
				"category":gByCategory[0].values[0].category,
				"text":textGroup,
				"value":sumGroup,
				"place":placeGroup,
				"link":linkGroup
			};

	return grouped;
}

function preProcessingHierarchydata(rawDataHierarchy){
	
	const node_gap = 9; // px
	let node_diameter = node_radius*2;

	tree_height = (40 * node_diameter) + (40 * node_gap);
	// tree_height = 1000;
	tree.size([tree_height, treeVisWidth]); // width
	//var GLOBAL
	//tree.nodes adds: children, depth, name, x, y
	hierarchy = tree.nodes(rawDataHierarchy).reverse();// array of objects
	// hierarchy[hierarchy.length-1].key = root_key;
	// hierarchy[hierarchy.length-1].color = "#a65628";
	// num_initial_color = 5; //getNodesByDepth(1).length;
	// hierarchy[hierarchy.length-1].children.forEach((curr,index)=>{
	// 	addingKeyNuevo(curr,index);
	// });

	num_initial_color = 5;
	// //ROOT NODE
	let root_node = hierarchy[hierarchy.length-1];
	root_node.key = root_key;
	if(!root_node.color)
	root_node.color = "#a65628";
	root_node.children.reverse().forEach((curr,index)=>{
		addingKeyNuevo(curr,index);
	});
}

function removeElementsInVis(){
	hierarchy = [];
	color_range_children = [];
	//
	//
	d3.select("#svg-map-vis").selectAll("g").remove();
	removeElement("tooltip-map");
	//
	d3.select("#svg-tree-vis").selectAll("g").remove();
	removeElement("tooltip-tree");
	//
	d3.select("#svg-multistream-vis").selectAll("g").remove();
	removeElement("tooltipFlow");
	removeElement("tooltipEvent");
	removeElement("tooltipStory");
	
}

function initOpts(init){

	//General
	log = init.optsGeneral.log;
	title = init.optsGeneral.title;
	dataType = init.optsGeneral.dataType;
	durationTransition = init.optsGeneral.durationTransition;
	//Multistream
	polarityTemporal = init.optsMultistream.polarityTemporal;
	stepTemporal = init.optsMultistream.stepTemporal;
	animation = init.optsMultistream.animation;
	interpolateType = init.optsMultistream.interpolateType;
	orderType = init.optsMultistream.orderType;
	//Multiresolution
	layersFadingColorsFactor = init.optsMultistream.optsMultiresolution.layersFadingColorsFactor;
	layersBorderlineColor = init.optsMultistream.optsMultiresolution.layersBorderlineColor;
	layersOpacitySelected = init.optsMultistream.optsMultiresolution.layersOpacitySelected;
	layersOpacityNotSelected = init.optsMultistream.optsMultiresolution.layersOpacityNotSelected;
	layersOutputRangeLabelScale = init.optsMultistream.optsMultiresolution.layersOutputRangeLabelScale;
	layersLabelType = init.optsMultistream.optsMultiresolution.layersLabelType;
	//Context
	numTimeStepBrushZoom = init.optsMultistream.optsContext.numTimeStepBrushZoom;
	numTimeStepBrushDistortion = init.optsMultistream.optsContext.numTimeStepBrushDistortion;
	numTimeStepBrushNormal = init.optsMultistream.optsContext.numTimeStepBrushNormal;
	//Map
	outputRangeColorScaleMap = init.optsMap.outputRangeColorScaleMap;
	featuresOutputRangeLabelScale = init.optsMap.featuresOutputRangeLabelScale;
	//Tree

	//Events
	eventWidthSizeLabelScale = init.optsEvents.eventWidthSizeLabelScale;
	eventHeightSizeLabelScale = init.optsEvents.eventHeightSizeLabelScale;

	//Match
	optsMatch = init.matchDetails;
}

function initOptsVariables(list){

	list.forEach(item=>{
		if(item.optsGeneral.active){
			//LOAD OPTS
			optsGeneral = item.optsGeneral;
			optsMultistream = item.optsMultistream;
			optsMultiresolution = item.optsMultistream.optsMultiresolution;
			optsContext = item.optsMultistream.optsContext;
			optsEvents = item.optsEvents;
			optsMap = item.optsMap;
			optsTree = item.optsTree;
		}
	});

}

function ready(error, rawDataHierarchyParser, rawData,rawEventsParser, rawConfiguration){
	
	if (error){
		alert(error);
		setLoader(false);
		throw error;
	}

	//REMOVE OLD Elements in all VIS
	removeElementsInVis();

	//var GLOBAL	
	events = rawEventsParser.events;
	
	//PREPROCESSING
	preProcessingRawData(rawData);
	preProcessingRawEvents(events);
	preProcessingHierarchydata(rawDataHierarchyParser.ranges);
	
	//INIT OPTS
	initOpts(rawConfiguration.init);

	//OPTS VARIABLES
	initOptsVariables(rawConfiguration.list);

	let dateExt = d3.extent(rawData,d=>d.date);
	let sinceDate = dateExt[0];
	// let sinceDate = getTimeOffset(dateExt[0], -2*stepTemporal, polarityTemporal);
	let untilDate = getTimeOffset(dateExt[1], 2*stepTemporal, polarityTemporal);

	//var GLOBAL	
	timeWindow = getTimeWindow(sinceDate,untilDate,polarityTemporal,stepTemporal);

	dateExtRange = d3.extent(timeWindow); // max and min date
	dateMinRange = dateExtRange[0]; // min date
	dateMaxRange = dateExtRange[1]; // max date
	




	jerarquiaOrigen = new Jerarquia(hierarchy);
	jerarquiaOrigen.my_leaf_level = rawData;
	jerarquiaOrigen.setBottomNodes(jerarquiaOrigen.getLeafNodes());
	jerarquiaOrigen.setTopNodes(jerarquiaOrigen.getNodesByDepth(1));
		
	nivel_focus_origin = jerarquiaOrigen.hijos();
	key_focus_list_origin = jerarquiaOrigen.key_bottom_list;

	nivel_context_origin = jerarquiaOrigen.papa();
	key_context_list_origin = jerarquiaOrigen.key_top_list;



	// kaka(rawData);
	loadTreeVis();
	loadMultiresolutionVis();	

	printLog(timeWindow, "getting leaf_level");
	
	setLoader(false);





















}

function kaka(rawData){
	voidHierarchyLevel();
	//Children
	setBottomNodes(getLeafNodes());
	setVisibleNodes(key_focus_list_origin);
	key_focus_list_origin.reverse();
	hijos(key_focus_list_origin, rawData);

	// Parent
	setTopNodes(getNodesByDepth(1));
	setVisibleNodes(key_context_list_origin);
	key_context_list_origin.reverse();
	papas(key_context_list_origin,rawData);
}


function setBodyBackgroundImg(pathImgBackgground){
	document.getElementById("bodyContainer").style.backgroundImage ="url("+pathImgBackgground+")";
}

function load_d3(path,pathImgBackground) {

	setBodyBackgroundImg(pathImgBackground);

	let myRawDataPath = path+"data.json";
	let myHierarchyJSONPath = path+"hierarchy.json";
	let myRawEventsPath = path+"events.json";
	let myConfigurationPath = path+"config.json";

	//clossing menu dataset
	// let openCloseBtnDataset = document.getElementById("openCloseBtnDataset");
	// let leftNav = document.getElementById("datasetNav");
	// openCloseBtnDataset.style.left = "0px";
	// leftNav.style.width = "0";
	// openCloseBtnDataset.classList.remove("active");



	setLoader(true);
	
	setTimeout(function(){ 
		d3.queue(4)
				.defer(d3.json,myHierarchyJSONPath)
				.defer(d3.json,myRawDataPath)
				.defer(d3.json,myRawEventsPath)
				.defer(d3.json,myConfigurationPath)
				.await(ready);

	},100);
}


function colores_brewer(n){
	var colors = [
		      "#e41a1c", // red
					,"#377eb8" // blue
					,"#ffff33" // jaune
					,"#984ea3" // purple
					,"#ff7f00" // orange
					,"#4daf4a" // green
					,"#a65628"
					,"#f781bf"
				];
	
	return colors[n % colors.length];
}

function openTreeNav() {
	if (!document.getElementById("btnTreeNav").classList
			.contains("active")) {
		document.getElementById("tree-vis-wrapper").style.width = "600px";
		document.getElementById("main").style.marginLeft = "600px";
		document.getElementById("btnTreeNav").innerHTML = "Hide Categories"
	} else {
		closeTreeNav();
		document.getElementById("btnTreeNav").innerHTML = "Show Categories"
	}
}

/* Set the width of the side navigation to 0 and the left margin of the page content to 0 */
function closeTreeNav() {
	document.getElementById("tree-vis-wrapper").style.width = "0";	
	document.getElementById("main").style.marginLeft = "0";
}

function makeMenuDataset(url){
	$.getJSON(url,function(items){
		for(let i = 0; i<items.length; i++){
			
			let currMenu = items[i];
			let currMenuBody = makeAccordionMenu(i,currMenu);

			for(let j=0;j<currMenu.children.length;j++){
				let currElemBody = currMenu.children[j];
				makeBody(j,currMenuBody,currElemBody);
			}

		}
	});
}

function makeAccordionMenu(i,item){

	let idParent = "accordionExample";
	let aMenu = addElement(idParent,"div","menu_"+i,"");
	aMenu.classList.add("card-menu");

	//header of the menu
	let aHeader = addElement(aMenu.id,"div","header_"+i,"");
	aHeader.classList.add("card-header");

	//h6 button header wrapper
	let aButtonWrapper = addElement(aHeader.id,"h6","h_"+i,"");
	aButtonWrapper.classList.add("mb-0");

	//button header
	let aButtonHeader = addElement(aButtonWrapper.id,"button","button_"+i,item.name);
	aButtonHeader.classList.add("btn");
	aButtonHeader.classList.add("btn-link");
	aButtonHeader.classList.add("collapsed");
	aButtonHeader.setAttribute("type","button");
	aButtonHeader.setAttribute("data-toggle","collapse");
	aButtonHeader.setAttribute("data-target","#collapse_"+i);
	aButtonHeader.setAttribute("aria-expanded",true)
	aButtonHeader.setAttribute("aria-controls","collapse_"+i);

	//---------------
	//Div for the body
	let aBody = addElement(aMenu.id,"div","collapse_"+i,"");
	aBody.classList.add("collapse");
	// aBody.classList.add("show");
	aBody.setAttribute("aria-labelledby",aHeader.id);
	aBody.setAttribute("data-parent","#"+idParent);

	return aBody;
}

function makeBody(i,body,item){

	let homeTeamPathImg = item.matchDetails.homeTeamLogoPathImg;
	let homeTeamName = item.matchDetails.homeTeamName;
	let homeTeamScore = item.matchDetails.homeTeamScore;
	let awayTeamPathImg = item.matchDetails.awayTeamLogoPathImg;
	let awayTeamName = item.matchDetails.awayTeamName;
	let awayTeamScore = item.matchDetails.awayTeamScore;
	let matchDate = new Date(item.matchDetails.matchDateStartUTC);
	let championship = item.matchDetails.championship;
	let stage = item.matchDetails.stage;

	//a card
	let aCard = addElement(body.id,"div","div_"+body.id+"_"+i,"");
	aCard.classList.add("card-body");
	aCard.classList.add("menu-entry");

	//title
	if(item.matchDetails.matchDateStartUTC!=""){
		let htmlTitle = "<p class='caption text-uppercase'>"+stage+"</p>"+
						"<p class='date overline'>"+customMatchDate(matchDate)+"</p>";

		let aTitle = addElement(aCard.id,"div","",htmlTitle);
		aTitle.classList.add("card-title");
	}

	let htmlDescription = "<div class='teamWrapper'>"+
								"<div class='teamInfo' style='left:0;'>"+
									"<img class='teamLogo clearfix' style='right:0%' src='"+ homeTeamPathImg +"'>"+
									"<p class='overline teamName text-truncate text-uppercase' style='right:0%'>" + homeTeamName+ "</p>"+
								"</div>"+
								"<div class='teamScore' style='right:0%;'>"+
									"<h6 class='teamScoreValue'>" + homeTeamScore+ "</h6>"+
								"</div>"+
						  "</div>"+
						  "<div class='centerTextTeamWrapper'>"+
						  	"<h4>&nbsp;</h4>"+
						  "</div>"+
						  "<div class='teamWrapper'>"+
								"<div class='teamScore' style='left:0%;'>"+
									"<h6 class='teamScoreValue'>" + awayTeamScore+ "</h6>"+
								"</div>"+
								"<div class='teamInfo' style='right:0;'>"+
									"<img class='teamLogo clearfix' style='left:0%' src='"+ awayTeamPathImg +"'>"+
									"<p class='overline teamName text-truncate text-uppercase' style='left:0%'>" + awayTeamName+ "</p>"+
								"</div>"+
						  "</div>";



	////description
	//
	//
	// let iconTeams = "";
	// if (homeTeamPathImg!="" &&awayTeamPathImg!=""){
	// 	iconTeams = "<img class='icon' src='"+item.matchDetails.homeTeamLogoPathImg+"'>" +
	// 	"&nbsp;vs&nbsp;" + 
	// 	"<img class='icon' src='"+item.matchDetails.awayTeamLogoPathImg+"'>";
	// }

	// let htmlDescription = "<div>"+
	// 							"<p class='body1'>"+championship+"</p>"+
	// 							"<p>"+iconTeams+"</p>"+
	// 							"<p class='overline'>"+homeTeamName+" - "+awayTeamName+"</p>"+
	// 						"</div>";


	let aDescription = addElement(aCard.id,"p","",htmlDescription);
	aDescription.classList.add("card-text");

	//aref
	let aRef = addElement(aCard.id, "button", "", "show me!");
	aRef.classList.add("button");
	aRef.classList.add("btn");
	aRef.addEventListener('click', function(){
		load_d3(item.url,item.urlBackground);
	});

	if(item.showFirst){
		load_d3(item.url,item.urlBackground);
	}
}