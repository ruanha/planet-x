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
		let baseMonitor = document.getElementById("base-monitor");

		let newRow = document.createElement("div");
		let baseThing = document.createElement("div");

		baseThing.textContent = type;
		baseThing.setAttribute("class", "monitor-header");

		newRow.appendChild(baseThing);
		baseMonitor.appendChild(newRow);
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