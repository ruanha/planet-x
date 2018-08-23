"use strict";

let resourcePanel = {

	updateViewResource: function(resource){
		let res = document.getElementById(resource);
		res.textContent = resources[resource];
	},

	updateViewBase: function(resource){
		let res = document.getElementById(resource+"-quant");
		res.textContent = base.droids[resource];
	},	

	addResource: function(list){
		let resourceMonitorTable = document.getElementById("resource-monitor-table");

		for ( let i=0; i<list.length; i++ ){

			let newRow = document.createElement("tr");
			let resource = document.createElement("td");
			let resourceQuantity = document.createElement("td");
			resourceQuantity.setAttribute("id", list[i].replace(/ /g,''));

			resource.textContent = list[i];
			resourceQuantity.textContent = 0;

			newRow.appendChild(resource);
			newRow.appendChild(resourceQuantity);
			resourceMonitorTable.appendChild(newRow);
		}
	},

	addBaseHeader: function(type){
		let baseMonitorTable = document.getElementById("base-monitor-table");

		let newRow = document.createElement("tr");
		let baseThing = document.createElement("td");

		baseThing.textContent = type;
		baseThing.setAttribute("class", "monitor-header");

		newRow.appendChild(baseThing);
		baseMonitorTable.appendChild(newRow);
	},

	addBase: function(type, includeController=false){
		let baseMonitorTable = document.getElementById("base-monitor-table");

		let newRow = document.createElement("tr");
		let baseThing = document.createElement("td");
		let baseThingQuantity = document.createElement("td");
		newRow.setAttribute("id", type.replace(/ /g,''));
		baseThing.setAttribute("id", type.replace(/ /g,'')+"-name");
		baseThingQuantity.setAttribute("id", type.replace(/ /g,'')+"-quant");

		baseThing.textContent = type;
		baseThingQuantity.textContent = 0;

		newRow.appendChild(baseThing);
		newRow.appendChild(baseThingQuantity);

		if ( includeController ){
			let subtract = document.createElement("td");
			subtract.setAttribute("class", "controller");
			subtract.setAttribute("id", type.replace(/ /g,'')+"-subtract");	
			subtract.textContent = "-";
			subtract.addEventListener('click', ()=>{
				if ( base.droids[type] ){
					base.droids["idle"] +=1;
					base.droids[type] -=1 ;
					this.updateViewBase("idle");
					this.updateViewBase(type);
				}
			});
					
			let add = document.createElement("td");
			add.setAttribute("class", "controller");
			add.setAttribute("id", type.replace(/ /g,'')+"-add");
			add.textContent = "+";
			add.addEventListener('click', ()=>{
				if ( base.droids["idle"] ){
					base.droids["idle"] -=1
					base.droids[type] +=1 ;	
					this.updateViewBase("idle");
					this.updateViewBase(type);		
				}
			});

			newRow.appendChild(subtract);
			newRow.appendChild(add);
		}

		baseMonitorTable.appendChild(newRow);

	},
}

let resources = {
	energy:0,
	metals:0,
	rare:0,

	subtract: function(shoppingList){
		for ( let item in shoppingList ){
			resources[item] -= shoppingList[item];
			resourcePanel.updateViewResource(item);
		}
	},

	add: function(resource, amount){
		resources[resource] += amount;
	},

}