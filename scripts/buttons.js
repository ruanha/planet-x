"use strict";

let buttons = {
	cooldowns: {restartReactor:0, activateExtractor:0, extract:0, reactor:0, droid:0},

	newButton: function(text, id, costs, onClick=false, cssClass="button"){
		const button = document.createElement("div");
		button.textContent = text;
		button.setAttribute("id", id);

		if ( !utils.isEmpty(costs) ){
			button.setAttribute("class", "tooltip button");

			let tooltipText = document.createElement("div");
			tooltipText.setAttribute("class", "tooltiptext");
			tooltipText.setAttribute("id", id+"-tooltip");

			for ( let key in costs ){
				let rowKey = document.createElement("div");
				rowKey.setAttribute("class", "rowKey");

				let rowVal = document.createElement("div");
				rowVal.setAttribute("class", "rowVal");

				rowKey.textContent = key;
				rowVal.textContent = costs[key];
				tooltipText.appendChild(rowKey);
				tooltipText.appendChild(rowVal);
			}

			button.appendChild(tooltipText);
		}
		else {
			button.setAttribute("class", cssClass);
		}

		button.addEventListener('click', onClick);

		return button;
	},

	slideMenu: {
		onClick: function(e){
			buttons.slideMenu.resetSliderClass();
			e.target.setAttribute("class", "slider active");

			if ( document.getElementById("planetMenu") &&
				document.getElementById("planetMenu").className != "slider active" ){
				//Make planet visible because it is made hidden by planet btn
				setTimeout(function(){
					let resourcePanel = document.getElementById("resourcePanel");
					resourcePanel.style.visibility='visible';
				}, 500)	
			}

			//all the rest
			let view = document.getElementById("view");
			view.style.position = "relative";

			let endPos = parseInt(e.target.attributes.slidePos.nodeValue);
			utils.slide(CURRENT_SLIDE_POSITION, endPos);
			CURRENT_SLIDE_POSITION = endPos;
		},

		controlRoom: function(){
		// SLIDE MENU: CONTROL ROOM
			let controlRoomMenu = buttons.newButton("Control Room", "controlRoomMenu", {}, this.onClick, "slider");
			controlRoomMenu.setAttribute("slidePos", 0);
			viewPanel = document.getElementById("viewPanel");
			viewPanel.appendChild(controlRoomMenu);
		},

		base: function(){
		// SLIDE MENU: BASE
			let baseMenu = buttons.newButton("Base", "baseMenu", {}, this.onClick, "slider");
			baseMenu.setAttribute("slidePos", -750);

			viewPanel = document.getElementById("viewPanel");
			viewPanel.appendChild(baseMenu);
		},

		explorer: function(){
		// SLIDE MENU: EXPLORER
			let explorerMenu = buttons.newButton("Explorer", "explorerMenu", {}, this.onClick, "slider");
			explorerMenu.setAttribute("slidePos", -1500);

			viewPanel = document.getElementById("viewPanel");
			viewPanel.appendChild(explorerMenu);
		},

		planet: function(){
		// SLIDE MENU: PLANET VIEW
			let planetMenu = buttons.newButton("Planet-X", "planetMenu", {}, this.onClick, "slider");
			planetMenu.setAttribute("slidePos", -2250);

			viewPanel = document.getElementById("viewPanel");
			viewPanel.appendChild(planetMenu);

			//SLIDE RESOURCE PANEL OUT OF VIEW
			planetMenu.addEventListener('click', ()=>{
				let resourcePanel = document.getElementById("resourcePanel");
				resourcePanel.style.visibility='hidden';
			})

		},

		resetSliderClass: function(){
			let viewPanel = document.getElementById("viewPanel");
			for ( let i=0; i<viewPanel.childNodes.length; i++ ){
				viewPanel.childNodes[i].setAttribute("class", "slider");
			}
		},
	},

	landBtn: function(){
		let onClick = ()=>{
			if ( !messages.writesMessage ){
				landBtn.parentNode.removeChild(landBtn);
				buttons.restartReactor();
				game.on = true;
			}
		}

		let landBtn = this.newButton("land ship!", "landBtn", {}, onClick);

		let controlRoomView = document.getElementById("controlRoomView");
		controlRoomView.appendChild(landBtn);
	},

	restartReactor: function(){
		let cost = {}
		let onClick = ()=>{
			if ( restartReactorBtn.className == "button" ) {
				restartReactorBtn.setAttribute("class", "button disabled");

				utils.cooldown(buttons.cooldowns.restartReactor, restartReactorBtn, restartReactorBtn.textContent, function(){
					buttons.slideMenu.base();
					let baseView = document.getElementById("baseView");
					buttons.reactor();
					resourcePanel.addResource(["energy"]);
					resourcePanel.addBaseHeader("Activated")
					resourcePanel.addBase("cores");
					base.cores = 1;
					resourcePanel.updateViewBase("cores");
					document.getElementById("resourcePanel").style.visibility = "visible";
					buttons.activateExtractor();
				});					
			}
		};
		let restartReactorBtn = buttons.newButton("restart reactor", "restart-reactor-button", cost, onClick);
		const actionPanel = document.getElementById("controlRoomView");
		actionPanel.appendChild(restartReactorBtn);
	},	

	activateExtractor: function(){
		let cost = {}
		let onClick = ()=>{
			if ( activateExtractor.className == "button" ){
				activateExtractor.setAttribute("class", "button disabled");
				utils.cooldown(buttons.cooldowns.activateExtractor, activateExtractor, activateExtractor.textContent, function(){
					base.extractorActive = true;
					activateExtractor.textContent = "activate extractor";
					resourcePanel.addResource(["metals", "rare", "uran"]);
					buttons.extract();
					buttons.droidFactory();
				});
			};
		};
		let activateExtractor = buttons.newButton("activate extractor", "activate-extractor-button", cost, onClick)
		const actionPanel = document.getElementById("controlRoomView");
		actionPanel.appendChild(activateExtractor);
	},

	extract: function(){
		let cost = {}
		let onClick = ()=>{
			if ( extract.className == "button" ){
				extract.setAttribute("class", "button disabled");
				utils.cooldown(buttons.cooldowns.extract, extract, extract.textContent, function(){
					resources.metals += 1;
					resourcePanel.updateViewResource("metals");
					extract.setAttribute("class", "button");
				});
			}
		};
		let button = buttons.newButton("extract", "extract", cost, onClick);
		const baseView = document.getElementById("baseView");
		baseView.appendChild(button);
	},

	reactor: function(){
		let cost = {}
		let onClick = ()=>{
			if ( button.className == "button" ){
				button.setAttribute("class", "button disabled");
				utils.cooldown(buttons.cooldowns.reactor, button, button.textContent, function(){
					resources.energy += 1;
					resourcePanel.updateViewResource("energy");
					button.setAttribute("class", "button");
				});
			}
		};
		let button = buttons.newButton("reactor", "reactor", cost, onClick);
		const baseView = document.getElementById("baseView");
		baseView.appendChild(button);
	},


	droidFactory: function(){
		let cost = {metals:2, energy:2};
		let onClick = ()=>{
			if ( droidFactoryBtn.className == "tooltip button" ) {
				if ( utils.canBuy(cost) ){
					resources.subtract(cost);
					droidFactoryBtn.setAttribute("class", "button disabled");
					let tooltip = document.getElementById("droid-factory-button-tooltip")
					tooltip.parentNode.removeChild(tooltip);
					buttons.droidBtn();
					buttons.slideMenu.explorer();
				}
				else{
					messages.display(["Not enough resources"]);
				}
			}
		};

		let droidFactoryBtn = buttons.newButton("activate droid factory", "droid-factory-button", cost, onClick)

		const actionsPanel = document.getElementById("controlRoomView");
		actionsPanel.appendChild(droidFactoryBtn);

		// add droids to base panel
		resourcePanel.addBaseHeader("droids");
		resourcePanel.addBase("idle");
		resourcePanel.addBase("reactor", true);
		resourcePanel.addBase("extractor", true);
		base.droids = {idle:0, reactor:0, extractor:0};
	},

	droidBtn: function(){
		let cost = {metals: 2, energy:1}
		let onClick = ()=>{
			if ( utils.canBuy(cost) ){
				droidBtn.setAttribute("class", "button disabled");
				resources.subtract(cost);
				utils.cooldown(buttons.cooldowns.droid, droidBtn, "droid", function(){
					droidBtn.setAttribute("class", "tooltip button")
					base.droids.idle += 1;
					resourcePanel.updateViewBase("idle");
				})
			}
			else{
				messages.display(["not enough resources"]);
			}
			
		}
		let droidBtn = buttons.newButton("droid", "droid-button", cost, onClick)
		const baseView = document.getElementById("baseView");
		baseView.appendChild(droidBtn);
	},

	//EXPLORER BUTTONS

	explorer: function(){
		let cost = {metals:1, energy:1};
		let onClick = ()=>{
			if ( explorerBtn.className == "tooltip button"){
				if ( utils.canBuy(cost) ){
					explorerBtn.setAttribute("class", "button disabled");
					resources.subtract(cost);
					let tooltip = document.getElementById("explorer-button-tooltip");
					tooltip.parentNode.removeChild(tooltip);
					buttons.deployBtn();

					if ( !document.getElementById("planetMenu") ){
						buttons.slideMenu.planet();
					}

				}
				else{
					messages.display(["not enough resources"]);
				}			
			}
		}
		let explorerBtn = buttons.newButton("explorer", "explorer-button", cost, onClick)
		const explorerView = document.getElementById("explorerView");
		explorerView.appendChild(explorerBtn);
	},

	deployBtn: function(){
		let onClick = ()=>{
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
		let deployBtn = buttons.newButton("deploy!", "deploy-button", {}, onClick)
		explorerPanel.appendChild(deployBtn);
	},

	upgBatteryBtn: function(){
		let cost = {metals:20, rare:10}
		let onClick = ()=>{
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

		let upgBatteryBtn = buttons.newButton("upgrade battery", "upgrade-battery-button", cost, onClick);
		const explorerPanel = document.getElementById("explorer-panel");
		explorerPanel.appendChild(upgBatteryBtn);
	},

	upgPlasmaBtn: function(){
		let cost = {metals:20, rare:10}
		let onClick = ()=>{
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
		let cost = {metals:20, rare:10}
		let onClick = ()=>{
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

	// FIGHT BUTTONS
	battleButtons: function(){
		let onClickShield = ()=>{
			if ( explorer.onBoard.energy > 0 && chargeShield.className == "button" ){
				chargeShield.setAttribute("class", "button disabled");
				explorer.chargeShield();
				document.getElementById("explorer-shield").textContent = "shield "+explorer.shield+"/"+explorer.maxShield;
				document.getElementById("battle-player-icon").textContent = "@explorer"+explorer.displayShield();
				explorer.updateView();
			}
			utils.cooldown(5000, chargeShield, "charge shield", function(){
				chargeShield.setAttribute("class", "button");
			});
		}
		let chargeShield = buttons.newButton( "charge shield", "charge-shield", {}, onClickShield );


		let onClickFire = ()=>{
			if ( fireWeapon.className == "button" ){
				fireWeapon.setAttribute("class", "button disabled");
				utils.cooldown(2000, fireWeapon, "fire weapon", function(){
					fireWeapon.setAttribute("class", "button");
				});
				event.animation(explorer.weaponIcon, fight.player.icon, explorer.weapon);
				setTimeout(fight.playerAttack.bind(fight), explorer.weaponSpeed*NUMBER_OF_CELLS, explorer.weapon);
			}
			
		}
		let fireWeapon = buttons.newButton("fire weapon", "fire-weapon", {}, onClickFire);

		let onClickPlasma = ()=>{
			if ( plasmaWeapon.className == "button" ){
				plasmaWeapon.setAttribute("class", "button disabled");
				utils.cooldown(2000, plasmaWeapon, "plasma weapon", function(){
					plasmaWeapon.setAttribute("class", "button");
				});
				event.animation(explorer.plasmaIcon, fight.player.icon, explorer.plasma);
				setTimeout(fight.playerAttack.bind(fight), explorer.plasmaSpeed*NUMBER_OF_CELLS, explorer.plasma);

			}			
		}
		let plasmaWeapon = buttons.newButton("plasma weapon", "plasma-weapon", {}, onClickPlasma);

		if ( explorer.plasma ){
			return [chargeShield, fireWeapon, plasmaWeapon];
		}
		else{
			return [chargeShield, fireWeapon];
		}
		
	},

	lootBtns: function(){
		// for each loot item make a new button and add to the list of buttons passed.
		let lootBtns = [];
		for ( let key in fight.enemy.loot ){
			let onClick = ()=>{
				key = button.textContent.split(" ")[0];
				if ( key == "energy" ){
					if ( fight.enemy.loot[key] > 0 && explorer.charge() ){
						button.textContent = key+" ["+(fight.enemy.loot[key]-=1)+"]";
						explorer.updateView();
					}
				}
				else {
					if ( fight.enemy.loot[key] > 0  ){
						explorer.onBoard[key] += 1;
						button.textContent = key+" ["+(fight.enemy.loot[key]-=1)+"]";
						explorer.updateView();
					}
				}
			};

			let button = buttons.newButton(key+" ["+fight.enemy.loot[key]+"]", "loot-"+key, {}, onClick);
			lootBtns.push(button);

		};
		return lootBtns;
	},
}