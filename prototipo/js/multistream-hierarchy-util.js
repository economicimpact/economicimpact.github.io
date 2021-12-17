
let children_bottom_list_nuevo = [];

function Jerarquia(hierarchy) {
	this.hierarchy = hierarchy;
	this.key_bottom_list = [];
	this.key_top_list = [];
	this.my_leaf_level = [];
	this.children_bottom_list= [];

	this.getNodeByKey = function(node_key){
		let index = this.hierarchy.map(function(o) { return o.key; }).indexOf(node_key);
		return this.hierarchy[index];
	};

	this.getNodeByName = function (node_name){
		let index = this.hierarchy.map(d=>d.name).indexOf(node_name.toLowerCase());
		if(index!=-1){
			return this.hierarchy[index];
		}else{
			return null;
		}
	}

	this.getLeafNodes = function (){
		let nodes_leaf = [];
		this.hierarchy.forEach((node)=>{
				if(!node.children){
						nodes_leaf.push(node.key);
				}
		});
		return nodes_leaf;
	};

	this.getChildrenDisponible = function (node_key){
			let children_disponibles = [];
			let hierarchy_node = this.getNodeByKey(node_key);

			if(hierarchy_node.children){
					for(let i=0; i<hierarchy_node.children.length;i++){
							let child = hierarchy_node.children[i];
							let index_child = this.key_bottom_list.indexOf(child.key);
							if(index_child == -1 && child.level == ""){
									children_disponibles.push(child);
							}else{
									return null;
							}
					}
			}else{
					return null;
			}
			return children_disponibles;
	};

	this.getFatherDisponible = function (node_key){
			let hierarchy_node = this.getNodeByKey(node_key);
			let parent = hierarchy_node.parent;
			if(parent){
					let index_parent = this.key_top_list.indexOf(parent.key);
					if(index_parent == -1){
							return parent;
					}else{
							return null;
					}
			}else{
					return null;
			}
	};

	this.hijos = function (){
			// bottom_nodes.reverse();
			let nivel_bajo = [];
			this.key_bottom_list.forEach((bottom_node)=>{
					let ds_child = this.my_leaf_level.filter(function(leaf){
							return leaf.key == bottom_node;
					});
					nivel_bajo = nivel_bajo.concat(ds_child);
			});
			return nivel_bajo;
	};

	this.getVisibleLeafNodes = function (){
			let leaf_visible = [];
			this.hierarchy.forEach((node)=>{
					if(!node.children && node.visible == true){
							leaf_visible.push(node.key);
					}
			});
			return leaf_visible;
	};

	this.getNodesByDepth = function (depth){
			let nodes_by_depth = [];
			this.hierarchy.forEach((node)=>{
					if(node.depth == depth){
							nodes_by_depth.push(node.key);
					}
			});
			return nodes_by_depth;
	};

	this.setVisibleNodes = function (arreglo){
			arreglo.forEach((node_key)=>{
					let hierarchy_node = this.getNodeByKey(node_key);
					hierarchy_node.visible = true;
			});
	};
	
	//llena el key_bottom_list
	this.setBottomNodes = function (arreglo){
		// var key_bottom_list = [];
		this.key_bottom_list = [];
		arreglo.forEach((bottom_node)=>{
				this.key_bottom_list.push(bottom_node);
				let hierarchy_node = this.getNodeByKey(bottom_node);
				hierarchy_node.level = "bottom";
				hierarchy_node.visible = true;
		});
	};

	this.setEmptyLevelNode = function (node_key){
			let hierarchy_node = this.getNodeByKey(node_key);
			hierarchy_node.level = "";
	};

	this.getBottomLevelNodes = function (){
		let result = [];
		this.hierarchy.forEach((node)=>{          
				if(node.level == "bottom"){
						result.push(node);
				}
		});
		return result;
	};

	this.getVisibleBottomLevelNodes = function (){
			let result = [];
			this.hierarchy.forEach((node)=>{          
					if(node.level == "bottom" && node.visible){
							result.push(node.key);
					}
			});
			return result;
	};

	this.getVisibleTopLevelNodes = function (){
			let result = [];
			this.hierarchy.forEach((node)=>{
					if(node.level == "top" && node.visible){
							result.push(node.key);
					}
			});
			return result;
	};

	//llena el key_top_list
	this.setTopNodes = function (arreglo){
			this.key_top_list = [];
			arreglo.forEach((top_node)=>{
					this.key_top_list.push(top_node);
					let hierarchy_node = this.getNodeByKey(top_node);
					hierarchy_node.level = "top";
					hierarchy_node.visible = true;
			});
	};

	this.voidHierarchyLevel = function (){
			this.hierarchy.forEach(function(node){
					node.level = "";
					node.visible = false;
			});
	};

	this.splitFather = function (father){
			let split = [];
			father.children.forEach((child)=>{
					let ds_child = this.my_leaf_level.filter(function(leaf){
							return leaf.key == child.key;
					});
					split = split.concat(ds_child);
			});
			return split;
	};

	this.getChild = function (child){
			let ds_child = this.my_leaf_level.filter(function(leaf){
					return leaf.key == child.key;
			});
			return ds_child; 
	};

	
	this.changeNodeVisibility = function (node_key){
			let hierarchy_node = this.getNodeByKey(node_key);
			hierarchy_node.visible = !hierarchy_node.visible;
	};


	this.papa = function (){
			let nivel_alto = [];
			// top_nodes.reverse();
			this.key_top_list.forEach((top_node)=>{
					var hierarchy_node = this.getNodeByKey(top_node);								
					if(hierarchy_node.children){
						children_bottom_list_nuevo = [];
						
						fillChildrenBottomListNuevo(hierarchy_node);

						var fusion = mergingChildrenNuevo(hierarchy_node, children_bottom_list_nuevo,this.my_leaf_level);
						nivel_alto = nivel_alto.concat(fusion);
					}
			});
			return nivel_alto;
	};


	this.changeNodeVisibilityRecursive = function(node_key, isVisible){
		let hierarchy_node = this.getNodeByKey(node_key);
		this.changeNodeVisibility(node_key);
		
		if(isVisible){
			hierarchy_node.children.forEach(cambiarVisibilidadTrue);
		}else{
			hierarchy_node.children.forEach(cambiarVisibilidadFalse);
		}
	};

}



function fillChildrenBottomListNuevo(node){
	//tomar los hijos que estan en el array de bottom list
	if(node.level == "bottom" && node.visible){
		children_bottom_list_nuevo.push({
			"key":node.key,
			"category":node.category,
		});
	}
	if(node.children){
		node.children.forEach(fillChildrenBottomListNuevo);
	}
}

function mergingChildrenNuevo (father, children, my_leaf_level){
	let fusion = [];
	
	children.forEach((child)=>{
		
		let value = 0;
		var hashtags = [];
		var mentions = [];
		var screennames= [];
		
		let ds_child = my_leaf_level.filter((leaf)=>{
			return leaf.key == child.key;
		});
		
		if(ds_child.length>0){
			for(var i = 0; i < ds_child.length; i++) {
				if(!fusion[i]){
					value = ds_child[i].value;
					hashtags = ds_child[i].hashtags;
					mentions = ds_child[i].mentions;
					screennames = ds_child[i].screennames;
				}else{
					value = fusion[i].value + ds_child[i].value;
					hashtags = fusion[i].hashtags.concat(ds_child[i].hashtags);
					mentions = fusion[i].mentions.concat(ds_child[i].mentions);
					screennames = fusion[i].screennames.concat(ds_child[i].screennames);
					// link = fusion[i].link.concat(ds_child[i].link);
				}
				fusion[i] = {
								"date":ds_child[i].date,
								"key":father.key,
								"category":father.name,
								"value":value,
								"hashtags":hashtags,
								"mentions":mentions,
								"screennames":screennames
							};	
			}
		}
		
	});
	return fusion;
	
}


function cambiarVisibilidadFalse(d){
	if(d.level == "bottom"){
		d.visible = false;
	}
	if (d.children){
		d.children.forEach(cambiarVisibilidadFalse);
	}
}

function cambiarVisibilidadTrue(d){
	if(d.level == "bottom"){
		d.visible = true;
	}
	if (d.children){
		d.children.forEach(cambiarVisibilidadTrue);
	}
}
