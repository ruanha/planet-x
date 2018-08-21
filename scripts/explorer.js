let explorer = {
	initialized: false,
	deployed: false,
	activated: false,
	pos: {x:67, y:25},
	onBoard: {energy:0, droids:0},
	currentMove: 0,
	battery:100,
	shield:0,
	maxShield:0,
	health:10,
	maxHealth:10,
	weapon:1,
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
		    	newPos.y -= 1;
		    }
		    else if (e.keyCode == '40' || e.keyCode == '83') {
		        newPos.y += 1;
		    }
		    else if (e.keyCode == '37' || e.keyCode == '65') {
		    	newPos.x -= 1
		    }
		    else if (e.keyCode == '39' || e.keyCode == '68') {
		    	newPos.x += 1
		    }

		    // SCROLL MAP
		    if ( (explorer.pos.x - newPos.x) == -1 && newPos.x > 100 && newPos.x < 140 ){
		    	document.getElementById("planet-monitor").scrollTo(
		    		document.getElementById("planet-monitor").scrollLeft+10, 0);
		    }
		    else if ( (explorer.pos.x - newPos.x) == 1 && newPos.x < 100 ){
		    	document.getElementById("planet-monitor").scrollTo(
		    		document.getElementById("planet-monitor").scrollLeft-10, 0);
			}

		    console.log(newPos.x, newPos.y);

		    tile = map.getTile(newPos.x, newPos.y);
		    // TILE == BASE
		    if ( newPos.x == base.pos.x && newPos.y == base.pos.y ){
		    	Object.assign(explorer.pos, base.pos);
		    	if ( !base.underAttack ){
			    	explorer.deployed = false;
			    	map.reveal(explorer.pos.x, explorer.pos.y, "");
			    	explorer.health = explorer.maxHealth;
			    	explorer.shield = explorer.maxShield;
		    	}
		    	else{
		    		fight.manager("baseAttackBeast");
		    	}
		    }
		    // TILE == RESOURCE
		    else if ( tile == "R" || tile == "M" || tile == "U" ){
		    	if ( !offBase.baseExist(newPos.x, newPos.y ) ){
		    		explorer.makeMove(newPos);
		    		offBase.addOffbase(tile, newPos.x, newPos.y );
		    		event.resource(tile, newPos.x, newPos.y);    		
		    	}
		    	else if ( offBase.underAttack( newPos.x, newPos.y ) ){
		    		explorer.makeMove(newPos);
		    		fight.manager("mineAttackBeast");
		    	}
		    	else{
		    		explorer.makeMove(newPos);
		    		event.resource(tile, newPos.x, newPos.y);
		    	}

		    }
		    // TILE == HIVE
		    else if ( tile == 'H' ){
		    	explorer.makeMove(newPos);
		    	fight.manager("hiveAttackBeast");
		    }
		    // TILE == DESTROYED HIVE
		    else if ( tile == 'X'){
		    	explorer.makeMove(newPos);
		    	console.log("The ruins of a destroyed hive");
		    }
		    else{
		    	explorer.currentMove += 1;
		    	explorer.onBoard.energy -= 1;
		    	Object.assign(explorer.pos, newPos);
		    	explorer.setDistance();
		    	map.reveal(explorer.pos.x, explorer.pos.y, "@");
		    	explorer.updateView();
		    }
		    
		}
		else if ( explorer.deployed ) {
			map.reveal(explorer.pos.x, explorer.pos.y);
			explorer.dead("ran out of energy");
		}
	},

	makeMove: function(newPos){
    	explorer.currentMove += 1;
    	explorer.onBoard.energy -= 1;
    	Object.assign(explorer.pos, newPos);
    	map.reveal(explorer.pos.x, explorer.pos.y, "@");
    	explorer.updateView();
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