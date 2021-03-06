"use strict";

let explorer = {
	techLevel: 0,
	symbol: "@",
	initialized: false,
	deployed: false,
	activated: false,
	pos: {x:65, y:25},
	onBoard: {energy:0, droids:0},
	cargo: {},
	currentMove: 0,
	battery:15,
	shield:0,
	maxShield:0,
	health:10,
	maxHealth:10,
	maxCargo: 10,
	cargoWeight: 0,
	weapon:1,
	weaponSpeed:200, //speed of the weapons bullet
	weaponIcon:"·",
	plasma:false,
	plasmaSpeed:400, //speed of the plasma weapons bullet
	plasmaIcon:"o",
	slowdown:false,
	slowdownSpeed:1000,
	slowdownIcon:"#",
	amphibious:false,
	distanceFromBase:0,
	upgradeCooldowns:{ batteryI:5000, batteryII:10000, batteryIII:20000, batteryIV:50000,
	 shieldI:5000, shieldII:10000, shieldIII:20000 },


	initPanel: function(){
		const explorerViewLeft = document.getElementById("explorer-view-left");
		const explorerMonitorTable = document.createElement("table");
		explorerMonitorTable.setAttribute("id", "explorer-monitor-table");
		explorerViewLeft.appendChild(explorerMonitorTable);

		buttons.addEnergy();
		buttons.addDroids();
	},

	updateMonitor: function(){
		// this is the monitor on the planet-x view
		const explorerMonitor = document.getElementById("planet-monitor-explorer");
		while (explorerMonitor.firstChild){
			explorerMonitor.removeChild(explorerMonitor.firstChild);
		}
		//update onboard items
		for ( let key in explorer.onBoard ){
      if ( explorer.onBoard.hasOwnProperty(key) ){
        let div = document.createElement("div");
        div.setAttribute("id", "onboard-"+key);
        div.setAttribute("class", "onboard");
        div.textContent = key+":"+explorer.onBoard[key];
        explorerMonitor.appendChild(div);
      }
		}
		//update cargo items (metals and other resources)
		for ( let key in explorer.cargo ){
      if ( explorer.cargo.hasOwnProperty(key) ){
        let div = document.createElement("div");
        div.setAttribute("id", "onboard-"+key);
        div.setAttribute("class", "onboard");
        div.textContent = key+":"+explorer.cargo[key];
        explorerMonitor.appendChild(div);
      }
		}		
		let hitPointCounter = document.createElement("div");
		hitPointCounter.setAttribute("id", "hit-point-counter");
		hitPointCounter.textContent = "hp: "+explorer.health+"/"+explorer.maxHealth;

		let cargoSpace = document.createElement("div");
		cargoSpace.setAttribute("id", "cargo-space");
		cargoSpace.textContent = "cargo: "+explorer.cargoWeight+"/"+explorer.maxCargo;

		explorerMonitor.appendChild(hitPointCounter);
		explorerMonitor.appendChild(cargoSpace);

	},

	cargoMove: function(){
		// move cargo to or from cargo object

	},

	upgrade: function(){
		switch (explorer.techLevel){

			case 0:
			buttons.upgBatteryBtn();
			buttons.upgShieldBtn();
			break;

			case 1:
			messages.display([">> retrieved lost tech", ">> can now upgrade explorer"]);
			buttons.upgPlasmaBtn();
      		break;
			
			case 2:
			messages.display([">> retrieved lost tech", ">> can now upgrade explorer"]);
			let upgShieldBtn = document.getElementById("upgrade-shield-button").setAttribute("class", "tooltip button");
			let upgBatteryBtn = document.getElementById("upgrade-battery-button").setAttribute("class", "tooltip button");
			break;

			case 3:
			messages.display([">> retrieved lost tech", ">> can now upgrade explorer"]);
			document.getElementById("upgrade-shield-button").setAttribute("class", "tooltip button");
			document.getElementById("upgrade-battery-button").setAttribute("class", "tooltip button");
			buttons.upgAmphibious();
			break;

			case 4:
			//Amphibous, ultimate battery
			messages.display([">> retrieved lost tech", ">> can now upgrade explorer"]);
			document.getElementById("upgrade-battery-button").setAttribute("class", "tooltip button");
			buttons.upgSlowBomb();
			break;

			case 5:
			messages.display([">> retrieved lost tech", ">> can now build satellite"]);
			//final solution, satelite
			buttons.upgSatellite();
			break;
		}
		//explorer.updateMonitor();
	},

	charge: function(){
		if ( explorer.onBoard.energy < explorer.battery ){
			explorer.onBoard.energy +=1;
			return true;
		}
		else {
			return false;
		}
		explorer.updateMonitor();
	},

	chargeShield: function(){
		if ( explorer.shield < explorer.maxShield ){
			explorer.onBoard.energy -= 1;
			explorer.shield = ( (explorer.maxShield-explorer.shield) < 10 )? explorer.maxShield:explorer.shield+10;
		}
		explorer.updateMonitor();
	},

	exploring: function(){
		map.reveal(explorer.pos.x, explorer.pos.y, "@");

		document.onkeydown = explorer.move;

	},

	setDistance: function(){
		explorer.distanceFromBase = Math.abs(explorer.pos.x-base.pos.x) + 
      Math.abs(explorer.pos.y-base.pos.y);
	},

	move: function(e) {
		//console.log(e.keyCode);

		if ( explorer.deployed && explorer.onBoard.energy > 0){
			let newPos = {};
			Object.assign(newPos, explorer.pos);

		    e = e || window.event;

		    if (e.keyCode == '38' || e.keyCode == '87') {
		    	newPos.y = map.validY(newPos.y-1) || newPos.y;
		    }
		    else if (e.keyCode == '40' || e.keyCode == '83') {
		        newPos.y = map.validY(newPos.y+1) || newPos.y;
		    }
		    else if (e.keyCode == '37' || e.keyCode == '65') {
		    	newPos.x = map.validX(newPos.x-1);
		    }
		    else if (e.keyCode == '39' || e.keyCode == '68') {
		    	newPos.x = map.validX(newPos.x+1);
		    }

		    let tile = map.getTile(newPos.x, newPos.y);
		    // TILE == BASE
		    if ( newPos.x == base.pos.x && newPos.y == base.pos.y ){
		    	map.setExplorer(explorer.pos.x, explorer.pos.y, false);
		    	Object.assign(explorer.pos, base.pos);
		    	if ( !base.underAttack ){
		    		explorer.distanceFromBase = 0;
			    	explorer.deployed = false;
			    	map.reveal(explorer.pos.x, explorer.pos.y, "");
			    	explorer.health = explorer.maxHealth;
			    	explorer.shield = explorer.maxShield;

			    	for ( let key in explorer.cargo ){
              if ( explorer.cargo.hasOwnProperty(key) ){
                resources[key] = (resources[key])? resources[key]+explorer.cargo[key]:explorer.cargo[key];
                resourcePanel.updateViewResource(key);
              }
			    	}
			    	explorer.cargo = {};
			    	explorer.cargoWeight = 0;

			    	document.getElementById("explorerMenu").click();
		    	}
		    	else{
		    		fight.manager("baseAttackBeast");
		    	}
		    }
		    // TILE == RESOURCE
		    else if ( tile.symbol == "R" || tile.symbol == "M" || tile.symbol == "U" ){
		    	if ( !offBase.baseExist(newPos.x, newPos.y ) ){
		    		explorer.makeMove(newPos);
		    		offBase.addOffbase(tile.symbol, newPos.x, newPos.y );
		    		events.resource(tile.symbol, newPos.x, newPos.y);    		
		    	}
		    	else if ( offBase.underAttack( newPos.x, newPos.y ) ){
		    		explorer.makeMove(newPos);
		    		fight.manager("mineAttackBeast");
		    	}
		    	else{
		    		explorer.makeMove(newPos);
		    		events.resource(tile.symbol, newPos.x, newPos.y);
		    	}

		    }
		    // TILE == HIVE
		    else if ( tile.symbol == 'H' && explorer.amphibious){
		    	explorer.makeMove(newPos);
		    	fight.manager("hiveAttackBeast");
		    }
		    // TILE == DESTROYED HIVE
		    else if ( tile.symbol == 'X'){
		    	explorer.makeMove(newPos);
		    	console.log("The ruins of a destroyed hive");
		    }
		    // RANDOM ENEMY
		    else if ( explorer.distanceFromBase > 2  && Math.random() > 0.95 && 
                 tile.symbol == '\u00A0' ) {
		    	if ( explorer.distanceFromBase < 15 ){
		    		fight.manager("submarineBeast");
		    	}
		    	else if ( explorer.distanceFromBase < 35 &&
		    		 explorer.distanceFromBase > 15 ){
		    		fight.manager("battleShipBeast");
		    	}
		    	else if ( explorer.distanceFromBase > 35 ){
		    		fight.manager("missileCruiserBeast");
		    	}		    	
		    }
		    // TECH RETRIEVED
		    else if ( tile.symbol == 'T' ){
		    	explorer.makeMove(newPos);
		    	explorer.techLevel += 1;
		    	tile.symbol = '\u00A0';
		    	explorer.upgrade();
		    }
		    else if ( tile.symbol == '*' ){
		    	if ( explorer.amphibious ){
			    	explorer.makeMove(newPos);
		    	}
		    	else {
		    		messages.display([">> needs amphibious upgrade"]);
		    	}
		    }
		    else if ( tile.symbol == '\u00A0' ){
		    	explorer.makeMove(newPos);
		    }
		    
		}
		else if ( explorer.deployed ) {
			map.reveal(explorer.pos.x, explorer.pos.y, "");
			explorer.dead(">> ran out of energy");
			map.setExplorer(base.pos.x, base.pos.y);
		}
		explorer.updateMonitor();
	},

	makeMove: function(newPos){
		map.setExplorer(explorer.pos.x, explorer.pos.y, false);
    	explorer.currentMove += 1;
    	explorer.onBoard.energy -= 1;
    	Object.assign(explorer.pos, newPos);
    	explorer.setDistance();
    	map.reveal(explorer.pos.x, explorer.pos.y, "@");
    	map.setExplorer(newPos.x, newPos.y);
    	explorer.updateView();
    	planet.display();
	},

	dead: function(message){
		messages.display([message]);
		map.setExplorer(explorer.pos.x, explorer.pos.y, false);
		Object.assign(explorer.pos, base.pos);
		explorer.onBoard.energy = 0;
		explorer.onBoard.droids = 0;
		explorer.health = explorer.maxHealth;
		explorer.updateView();
		explorer.deployed = false;
		let deployBtn = document.getElementById("deploy-button");
		deployBtn.parentNode.removeChild(deployBtn);
		document.getElementById("explorer-button").setAttribute("class", "tooltip button");
		document.getElementById("explorer-monitor-table").parentNode.removeChild(document.getElementById("explorer-monitor-table"));
		document.getElementById("explorerMenu").click();
		document.getElementById("planetMenu").parentNode.removeChild(document.getElementById("planetMenu"));
	},

	updateView: function(){
		for ( let key in explorer.onBoard ){
      if (explorer.onBoard.hasOwnProperty(key) ){
      	let quantity = document.getElementById("explorer-"+key+"-quant");
      	quantity.textContent = explorer.onBoard[key];
      }
		}				
	},

	onBase: function(){
		if ( explorer.pos.x == base.pos.x && explorer.pos.y == base.pos.y ){
			return true;
		}
		else{
			return false;
		}
	},

	displayShield: function(){
		if ( explorer.shield > 0 && explorer.shield <= 5 ){
			return " |";
		}
		else if( explorer.shield > 0 && explorer.shield <= 10 ){
			return " ||";
		}
		else if( explorer.shield > 0 && explorer.shield <= 15 ){
			return " |||";
		}
		else{
			return "";
		}
	},
};