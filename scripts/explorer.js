let explorer = {
	techLevel: 0,
	symbol: "@",
	initialized: false,
	deployed: false,
	activated: false,
	pos: {x:67, y:25},
	onBoard: {energy:0, droids:0},
	currentMove: 0,
	battery:15,
	shield:0,
	maxShield:0,
	health:10,
	maxHealth:100,
	weapon:100,
	weaponSpeed:200, //speed of the weapons bullet
	weaponIcon:"·",
	plasma:false,
	plasmaSpeed:400, //speed of the plasma weapons bullet
	plasmaIcon:"o",
	amphibious:false,
	distanceFromBase:0,
	upgradeCooldowns:{ batteryI:5000, batteryII:10000, shieldI:5000, shieldII:10000, shieldIII:20000 },

	init: function(){
		const explorerView = document.getElementById("explorerView");
		const explorerPanel = document.createElement("div");
		explorerPanel.setAttribute("id", "explorer-panel");
		explorerView.appendChild(explorerPanel);
	},

	initPanel: function(){
		explorer.onBoard.energy = 0;
		explorer.onBoard.droids = 0;
		const explorerPanel = document.getElementById("explorer-panel");
		const explorerMonitor = document.createElement("div");
		explorerMonitor.setAttribute("id", "explorer-monitor");
		explorerMonitor.setAttribute("data-legend", "explorer");

		const explorerMonitorTable = document.createElement("table");
		explorerMonitorTable.setAttribute("id", "explorer-monitor-table");

		explorerMonitor.appendChild(explorerMonitorTable);
		explorerPanel.appendChild(explorerMonitor);

		buttons.addEnergy();
		buttons.addDroids();
	},

	upgrade: function(){
		switch (explorer.techLevel){
			case 1:
			buttons.upgBatteryBtn();
			break;
		}
	},

	charge: function(){
		if ( explorer.onBoard.energy < explorer.battery ){
			explorer.onBoard.energy +=1;
			return true;
		}
		else {
			return false;
		}
	},

	chargeShield: function(){
		if ( explorer.shield < explorer.maxShield ){
			explorer.onBoard.energy -= 1;
			explorer.shield = ( (explorer.maxShield-explorer.shield) < 10 )? explorer.maxShield:explorer.shield+10;
		}
	},

	exploring: function(){
		map.reveal(explorer.pos.x, explorer.pos.y, "@");

		document.onkeydown = explorer.move;

	},

	setDistance: function(){
		explorer.distanceFromBase = Math.abs(explorer.pos.x-base.pos.x) 
			+ Math.abs(explorer.pos.y-base.pos.y);
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

		    tile = map.getTile(newPos.x, newPos.y);
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

			    	document.getElementById("explorerMenu").click()
		    	}
		    	else{
		    		fight.manager("baseAttackBeast");
		    	}
		    }
		    // TILE == RESOURCE
		    else if ( tile.symbol == "R" || tile.symbol == "M" || tile.symbol == "U" ){
		    	if ( !offBase.baseExist(newPos.x, newPos.y ) ){
		    		map.setExplorer(explorer.pos.x, explorer.pos.y, false);
		    		explorer.makeMove(newPos);
		    		offBase.addOffbase(tile.symbol, newPos.x, newPos.y );
		    		event.resource(tile.symbol, newPos.x, newPos.y);    		
		    	}
		    	else if ( offBase.underAttack( newPos.x, newPos.y ) ){
		    		explorer.makeMove(newPos);
		    		fight.manager("mineAttackBeast");
		    	}
		    	else{
		    		map.setExplorer(explorer.pos.x, explorer.pos.y, false);
		    		explorer.makeMove(newPos);
		    		event.resource(tile.symbol, newPos.x, newPos.y);
		    	}

		    }
		    // TILE == HIVE
		    else if ( tile.symbol == 'H' ){
		    	explorer.makeMove(newPos);
		    	fight.manager("hiveAttackBeast");
		    }
		    // TILE == DESTROYED HIVE
		    else if ( tile.symbol == 'X'){
		    	explorer.makeMove(newPos);
		    	console.log("The ruins of a destroyed hive");
		    }
		    // RANDOM ENEMY
		    else if ( explorer.distanceFromBase > 2  && Math.random() > 0.95 
		    	&& tile.symbol == '\u00A0' ) {
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
		    	explorer.techLevel += 1;
		    	tile.symbol = ' ';
		    	explorer.upgrade();
		    }
		    else{
		    	explorer.currentMove += 1;
		    	explorer.onBoard.energy -= 1;
		    	map.objectMap[explorer.pos.y][explorer.pos.x].explorer = false;
		    	Object.assign(explorer.pos, newPos);
		    	explorer.setDistance();
		    	explorer.makeMove(newPos);
		    }
		    
		}
		else if ( explorer.deployed ) {
			map.reveal(explorer.pos.x, explorer.pos.y, "");
			explorer.dead("ran out of energy");
			map.setExplorer(base.pos.x, base.pos.y);
		}
	},

	makeMove: function(newPos){
    	explorer.currentMove += 1;
    	explorer.onBoard.energy -= 1;
    	Object.assign(explorer.pos, newPos);
    	map.reveal(explorer.pos.x, explorer.pos.y, "@");
    	map.setExplorer(newPos.x, newPos.y);
    	explorer.updateView();
    	planet.display();
	},

	dead: function(message){
		alert("Explorer lost!");
		console.log(message);
		Object.assign(explorer.pos, base.pos);
		explorer.onBoard.energy = 0;
		explorer.onBoard.droids = 0;
		explorer.updateView();
		explorer.deployed = false;
		let deployBtn = document.getElementById("deploy-button");
		deployBtn.parentNode.removeChild(deployBtn);
		document.getElementById("explorer-button").setAttribute("class", "tooltip button");
		document.getElementById("explorer-monitor").parentNode.removeChild(document.getElementById("explorer-monitor"));
	},

	updateView: function(){
		for ( key in explorer.onBoard ){
			let quantity = document.getElementById("explorer-"+key+"-quant");
			quantity.textContent = explorer.onBoard[key];
		}				
	},

	onBase: function(){
		if ( explorer.pos.x == base.pos.x && explorer.pos.y == base.pos.y ){
			return true
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
}