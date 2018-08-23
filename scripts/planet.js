"use strict";

let planet ={
	/*planet makes the spherical representation of the map,
	which is visible in the planet-monitor.
	*/
	center: {x:35, y:35},
	radius: 37,

	init: function(){
		this.initSphere();
		this.display();
	},

	initSphere: function(){
		let sphere = document.createElement("div");
		sphere.setAttribute("id", "sphere");

		for ( let i=0; i<map.fullMap.length; i++ ){
			let row = document.createElement("p");
			row.setAttribute("id", i);
			row.setAttribute("class", "latitude")
			sphere.appendChild(row);
		}
		document.getElementById("planet-monitor").appendChild(sphere);
	},

	display: function(dx=0){
		let sphere = document.getElementById("sphere")
		let lats = sphere.getElementsByTagName("p");

		for ( let i=0; i<map.fullMap.length; i++ ){
			let rowHTML = "";
			for ( let j=0; j<map.fullMap.length; j++ ){

				if ( (i-this.center.x)**2 + (j-this.center.y)**2 <= this.radius**2 ){

					let x = explorer.pos.x+dx-this.center.x+j;
					let y = i;

					x = map.validX(x);
					y = map.validY(y);

					let symbol = ( map.isVisible(x,y) )?  map.objectMap[y][x].symbol:String.fromCharCode(178);
					symbol = ( map.isExplorer(x,y) )?  explorer.symbol:symbol;
					rowHTML += symbol;
				}
				else {
					rowHTML += "\u00A0";
				}
			}
			lats[i].innerHTML = rowHTML+"</span>";
		}
	},

	rotate: function(dx){
		this.display(dx);
	}
};