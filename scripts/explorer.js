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

	explorerBtn: function(){
		cost = { metals:5, energy:5 }
		onClick = ()=>{
			if ( utils.canBuy(cost) ){
				if ( explorerBtn.className == "tooltip button" ){
					explorerBtn.setAttribute("class", "tooltip button disabled");
					explorer.deployBtn();
					explorer.initMonitor();
				}
			}
		}
		explorerBtn = utils.newButton("explorer", "explorer-button", cost, onClick);
		const explorerPanel = document.getElementById("explorer-panel");
		explorerPanel.appendChild(explorerBtn);
	},

	deployBtn: function(){
		onClick = ()=>{
			if ( !explorer.actvated ) {
				//if first time to deploy
				explorer.actvated = true
				document.getElementById("planetMenu").click();
			}
			explorer.deployed = true;
			Object.assign(explorer.pos, base.pos);
			explorer.exploring();			
		}

		const explorerPanel = document.getElementById("explorer-panel");
		let deployBtn = utils.newButton("deploy!", "deploy-button", {}, onClick)
		explorerPanel.appendChild(deployBtn);
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

		explorer.addEnergy();
		explorer.addDroids();
	},

	addEnergy: function(){
		let explorerMonitorTable = document.getElementById("explorer-monitor-table");

		let newRow = document.createElement("tr");
		let item = document.createElement("td");
		let itemQuantity = document.createElement("td");
		itemQuantity.setAttribute("id", "explorer-energy-quant");

		item.textContent = "energy";
		itemQuantity.textContent = 0;

		newRow.appendChild(item);
		newRow.appendChild(itemQuantity);

		let subtract = document.createElement("td");
		subtract.setAttribute("class", "controller");
		subtract.setAttribute("id", "explorer-energy-subtract");	
		subtract.textContent = "-";
		subtract.addEventListener('click', ()=>{
			if ( explorer.onBoard.energy && explorer.onBase()){
				explorer.onBoard.energy -=1;
				resources.add("energy", 1);
				explorer.updateView();
			}
		});
				
		let add = document.createElement("td");
		add.setAttribute("class", "controller");
		add.setAttribute("id", "explorer-energy-add");
		add.textContent = "+";
		add.addEventListener('click', ()=>{
			if ( resources.energy > 0 && explorer.onBase() ){
				explorer.charge();
				resources.subtract({energy:1});
				explorer.updateView();
			}
		});

		newRow.appendChild(subtract);
		newRow.appendChild(add);

		explorerMonitorTable.appendChild(newRow);

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

	addDroids: function(type, includeController=false){
		let explorerMonitorTable = document.getElementById("explorer-monitor-table");

		let newRow = document.createElement("tr");
		let item = document.createElement("td");
		let itemQuantity = document.createElement("td");
		itemQuantity.setAttribute("id", "explorer-droids-quant");

		item.textContent = "droids";
		itemQuantity.textContent = 0;

		newRow.appendChild(item);
		newRow.appendChild(itemQuantity);

		let subtract = document.createElement("td");
		subtract.setAttribute("class", "controller");
		subtract.setAttribute("id", "explorer-droids-subtract");	
		subtract.textContent = "-";
		subtract.addEventListener('click', ()=>{
			if ( explorer.onBoard.droids && explorer.onBase()){
				explorer.onBoard.droids -=1;
				base.droids.idle += 1;
				resourcePanel.updateViewBase("idle");
				explorer.updateView();
			}
		});
				
		let add = document.createElement("td");
		add.setAttribute("class", "controller");
		add.setAttribute("id", "explorer-droids-add");
		add.textContent = "+";
		add.addEventListener('click', ()=>{
			if ( base.droids.idle && explorer.onBase()){
				explorer.onBoard.droids +=1;
				base.droids.idle -= 1;
				resourcePanel.updateViewBase("idle");
				explorer.updateView();
			}
		});

		newRow.appendChild(subtract);
		newRow.appendChild(add);

		explorerMonitorTable.appendChild(newRow);
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

	upgBatteryBtn: function(){
		cost = {metals:20, rare:10}
		onClick = ()=>{
			if ( upgBatteryBtn.className == "tooltip button" ){
				if ( explorer.battery == 15 ){
					upgBatteryBtn.setAttribute("class", "tooltip button disabled");
					utils.cooldown(explorer.upgradeCooldowns["batteryI"], upgBatteryBtn, "upgrade battery II", function(){
						explorer.battery += 15;
						upgBatteryBtn.setAttribute("class", "tooltip button");
					});
				}
				else if ( explorer.battery == 30  ){
					upgBatteryBtn.setAttribute("class", "tooltip button disabled");
					utils.cooldown(explorer.upgradeCooldowns["batteryI"], upgBatteryBtn, "upgrade battery II", function(){
						explorer.battery += 15;
					});
				}

			}
		}

		let upgBatteryBtn = utils.newButton("upgrade battery", "upgrade-battery-button", cost, onClick);
		const explorerPanel = document.getElementById("explorer-panel");
		explorerPanel.appendChild(upgBatteryBtn);
	},

	upgPlasmaBtn: function(){
		cost = {metals:20, rare:10}
		onClick = ()=>{
			if ( upgPlasmaBtn.className == "tooltip button" ){
				explorer.plasma = 5;
				upgPlasmaBtn.setAttribute("class", "tooltip button disabled");
			}
		}
		let upgPlasmaBtn = utils.newButton("upgrade plasma weapon", "upgrade-plasma-button", cost, onClick);
		const explorerPanel = document.getElementById("explorer-panel");
		explorerPanel.appendChild(upgPlasmaBtn);
	},

	upgShieldBtn: function(){
		cost = {metals:20, rare:10}
		onClick = ()=>{
			if ( upgShieldBtn.className == "tooltip button" ){
				upgShieldBtn.setAttribute("class", "tooltip button disabled");
				if ( explorer.maxShield == 0 ){
					utils.cooldown(explorer.upgradeCooldowns["shieldI"], upgShieldBtn, "upgrade shield II", function(){
						explorer.maxShield += 5;
						upgShieldBtn.setAttribute("class", "tooltip button");
					});					
				}
				else if ( explorer.maxShield == 5 ){
					utils.cooldown(explorer.upgradeCooldowns["shieldII"], upgShieldBtn, "upgrade shield III", function(){
						explorer.maxShield += 5;
						upgShieldBtn.setAttribute("class", "tooltip button");
					});						
				}
				else if ( explorer.maxShield == 10 ){
					utils.cooldown(explorer.upgradeCooldowns["shieldIII"], upgShieldBtn, "upgrade shield III", function(){
						explorer.maxShield += 5;
					});						
				}
			}
		}

		let upgShieldBtn = utils.newButton("upgrade shield", "upgrade-shield-button", cost, onClick);
		const explorerPanel = document.getElementById("explorer-panel");
		explorerPanel.appendChild(upgShieldBtn);
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

	amphibiousBtn: function(){
		cost = {};
		onClick = ()=>{
			utils.cooldown()
			explorer.amphibious = true;
		}
		let amphibiousBtn = utils.newButton("", "", {}, onClick) 

	},
}