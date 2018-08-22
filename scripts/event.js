const NUMBER_OF_CELLS = 6;

let event = {
	titleText:"",
	message:"",
	mineUnderAttack:false,

	resource: function(tileIcon, x, y){
		titleText = {M:"Metals", R:"Rare Metals", U:"Uran"};
		message = "You have found a source of "+titleText[tileIcon]+". You can set up a mining operation here, by unloading droids."
		event.titleText = "A Source off "+titleText[tileIcon]+"!";
		event.message = message;
		game.pause();
		
		let onClick = ()=>{
			if ( explorer.onBoard.droids > 0){
				explorer.onBoard.droids -= 1;
				let offbaseObj = offBase.getOffbaseAtPos(x, y);
				offBase.addDroid(offbaseObj);
				offBase[tileIcon].droids += 1;
				explorer.updateView();
			}			
		}

		let offloadDroids = buttons.newButton("unload droids", "unload-droids", {}, onClick);

		this.display([offloadDroids], false, false);
	},

	displayEventText: function(titleText, message){
		let eventPanel = document.createElement("div");
		eventPanel.setAttribute("class", "event");
		eventPanel.setAttribute("id", "event");
		eventPanel.setAttribute("data-legend", titleText);
		eventPanel.textContent = message;
		return eventPanel;
	},

	displayTopPanel: function(){
		let topPanel = document.createElement("div");
		topPanel.setAttribute("id", "event-top-panel");
		topPanel.setAttribute("class", "event-top-panel");
		return topPanel;
	},

	displayMidPanel: function(){
		let midPanel = document.createElement("div");
		midPanel.setAttribute("id", "event-mid-panel");
		midPanel.setAttribute("class", "event-mid-panel");
		return midPanel;
	},

	displayBottomPanel: function(){
		let bottomPanel = document.createElement('div');
		bottomPanel.setAttribute("id", "event-bottom-panel");
		bottomPanel.setAttribute("class", "event-bottom-panel");
		return bottomPanel;
	},

	displayFight: function(){
		let explorerHealthBar = document.createElement("div");
		explorerHealthBar.setAttribute("id", "explorer-health-bar");
		explorerHealthBar.textContent = "health   "+ explorer.health+"/"+explorer.maxHealth;

		let enemyHealthBar = document.createElement("div");
		enemyHealthBar.setAttribute("id", "enemy-health-bar");
		enemyHealthBar.textContent = "health   "+ fight.enemy.hitPoints;

		let explorerShield = document.createElement("div");
		explorerShield.setAttribute("id", "explorer-shield");
		explorerShield.textContent = "shield   "+ explorer.shield+"/"+explorer.maxShield;		
		
		// TABLE THING EXPERIMENT
		let table = document.createElement("table");
		table.setAttribute("id", "fight-table");

		let row = document.createElement("tr");

		let cellExplorer = document.createElement("td");
		cellExplorer.setAttribute("id", "battle-player-icon");
		//console.log("shield tesst", explorer.displayShield());
		cellExplorer.textContent = "@explorer"+explorer.displayShield();

		row.appendChild(cellExplorer);

		for ( let i=0; i<NUMBER_OF_CELLS; i++ ){
			let cell = document.createElement("td");
			cell.setAttribute("id", "cell-"+i);
			cell.setAttribute("class", "ground-cells");
			row.appendChild(cell);

		}

		let cellEnemy = document.createElement("td");
		cellEnemy.setAttribute("id", "battle-enemy-icon");
		cellEnemy.textContent = "@enemy";
		
		row.appendChild(cellEnemy);

		table.appendChild(row);

		// END OF TABLE
		topPanel.appendChild(explorerHealthBar);
		topPanel.appendChild(enemyHealthBar);
		topPanel.appendChild(explorerShield);
		topPanel.appendChild(table);
		return topPanel;	
	},

	display: function(buttons=[], closeDisabled=false, battle=false){
		let wrapper = document.getElementById("wrapper");

		topPanel = this.displayTopPanel();
		midPanel = this.displayMidPanel();
		bottomPanel = this.displayBottomPanel();

		let closeBtn = this.closeBtn();

		eventPanel = this.displayEventText(event.titleText, event.message);

		if ( battle ){
			event.titleText = fight.enemy.titleText;
			event.message = fight.enemy.messageText;
			topPanel = this.displayFight(topPanel);
			closeBtn.setAttribute("class", "button disabled")
		}


		for ( i=0; i<buttons.length; i++){
			midPanel.appendChild(buttons[i]);
		}
		bottomPanel.appendChild(closeBtn);

		eventPanel.appendChild(topPanel);
		eventPanel.appendChild(midPanel);
		eventPanel.appendChild(bottomPanel);
		wrapper.appendChild(eventPanel);
	},

	closeBtn: function(){
		let onClick = ()=>{
			let closeBtn = document.getElementById("close-button")
			if ( closeBtn.className != "button disabled" ){
				eventPanel.parentNode.removeChild(eventPanel);
				game.resume();				
			}
		}
		return buttons.newButton("close", "close-button", {}, onClick);
	},

	animation: function(icon, shooter, speed){
		console.log(speed)
		cellIndex = ( shooter == "@explorer" )? 0:NUMBER_OF_CELLS-1 ;

		function recursive(icon, shooter, cellIndex, speed){
			console.log(speed)
			if ( shooter == "@explorer" ){
				// end recursive condition for @explorer
				if ( cellIndex == NUMBER_OF_CELLS ){
					//end animation, assert damage, dead?
					event.clearCell(cellIndex-1, icon);
					return true;
				}
				else {
					if ( cellIndex > 0 ){
						event.clearCell(cellIndex-1, icon);
					}

					let cell = document.getElementById("cell-"+cellIndex)
					cell.textContent = icon;
					setTimeout( recursive, speed, icon, shooter, cellIndex+1, speed  );
				}
			}	
			else {
				cellIndex-=1;
				// end recursive condition for @enemy
				if ( cellIndex == 0){
					//end animation, assert damage, dead?
					event.clearCell(cellIndex+1, icon);
					return true;
				}
				else{
					if ( cellIndex < NUMBER_OF_CELLS-1 ){
						event.clearCell(cellIndex+1, icon);
					}
					let cell = document.getElementById("cell-"+cellIndex)
					cell.textContent = icon;
					setTimeout( recursive, speed, icon, shooter, cellIndex, speed  );					
				}
			}
		}
		recursive(icon, shooter, cellIndex, speed);
		
	},

	clearCell: function(cellIndex, icon){
		let cell = document.getElementById( "cell-"+cellIndex );
		content = cell.textContent;
		cell.textContent = ( content == icon )? "":content;
	},

	closePanel: function(){
		let eventPanel = document.getElementById("event");
		eventPanel.parentNode.removeChild(eventPanel);
	},

	mineAttack: function(){
		AI.delayMessage([">>Aliens are attacking our mine operation!"]);
		let baseObj = offBase.getActiveBase();
		baseObj.underAttack = true;
		baseObj.underAttackTimer = setTimeout( function(){
			AI.delayMessage(["Mine lost..."]);
			baseObj.underAttack = false;
			baseObj.droids = 0;
			offBase.removeBase(baseObj);
		},  30000)
	},

	baseAttack: function(){
		AI.delayMessage([">>Base is under attack!"]);
		base.underAttack = true;
		if ( explorer.pos.x == base.pos.x && explorer.pos.y == base.pos.y ){
			fight.manager("baseAttackBeast");
		}
		base.underAttackTimer = setTimeout( function(){
			fight.enemy.victorious();
		},  30000)
	},
};