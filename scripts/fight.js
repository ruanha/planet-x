let fight = {
	// fight obj is called by the event obj to arrange and complete fights.
	// who handles the loot?
	/*enemy: {
		hitPoints:false,
		damage:false,
		delay:false,
		weaponIcon:false,
		icon:false,
		messageText:false,
		titleText:false,
		deadMessage:false,
		loot:{},
		interval:false, //this contains the interval function
		victorious:false,
		defeated:false,
	},*/

	player: {
		hitPoints:false,
		weapons:[],
		weaponIcon:false,
		icon:false,
	},

	manager: function(typeOfEnemy){
		this.enemy = enemies[typeOfEnemy]();
		this.initPlayer();

		game.pause();
		event.display(this.battleButtons(), true, true);
		fight.enemy.interval = setInterval(fight.enemyAttack.bind(fight), fight.enemy.delay);
	},

	enemyDead: function(){
		clearInterval(fight.enemy.interval);
		fight.enemy.defeated();
		event.closePanel();
		event.display(this.lootBtns(), false, false);
	},

	playerDead: function(){
		clearInterval(fight.enemy.interval);
		fight.enemy.victorious();
		event.closePanel();
		explorer.dead();
	},

	initPlayer: function(){
		this.player.hitPoints = explorer.health;
		this.player.icon = "@explorer";
	},

	enemyAttack: function(){
		event.animation(fight.enemy.weaponIcon, fight.enemy.icon, fight.enemy.damage);
		setTimeout(function(){
			if ( explorer.shield > 0 ){
				explorer.shield -= fight.enemy.damage;
				document.getElementById("explorer-shield").textContent = "shield   "+ explorer.shield+"/"+explorer.maxShield;
				document.getElementById("battle-player-icon").textContent = "@explorer"+explorer.displayShield();
			}
			else {
				explorer.health -= fight.enemy.damage;
				document.getElementById("explorer-health-bar").textContent = "health   "+ explorer.health+"/"+explorer.maxHealth;
			}
			// Is dead?
			if ( explorer.health <= 0 ){
				fight.playerDead();
			}
		}, this.enemy.delay );
	},

	playerAttack: function(damage){
		this.enemy.hitPoints -= damage;
		console.log("player attack!")
		if ( this.enemy.hitPoints <= 0 ){
			fight.enemyDead();
		}
		else {
			document.getElementById("enemy-health-bar").textContent = "health   "+ this.enemy.hitPoints;
		}	
	},

	battleButtons: function(){
		onClickShield = ()=>{
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


		onClickFire = ()=>{
			if ( fireWeapon.className == "button" ){
				fireWeapon.setAttribute("class", "button disabled");
				utils.cooldown(2000, fireWeapon, "fire weapon", function(){
					fireWeapon.setAttribute("class", "button");
				});
				event.animation(explorer.weaponIcon, fight.player.icon, explorer.weapon);
				setTimeout(this.playerAttack.bind(fight), explorer.weaponSpeed*NUMBER_OF_CELLS, explorer.weapon);
			}
			
		}
		let fireWeapon = buttons.newButton("fire weapon", "fire-weapon", {}, onClickFire);

		onClickPlasma = ()=>{
			if ( plasmaWeapon.className == "button" ){
				plasmaWeapon.setAttribute("class", "button disabled");
				utils.cooldown(2000, plasmaWeapon, "plasma weapon", function(){
					plasmaWeapon.setAttribute("class", "button");
				});
				event.animation(explorer.plasmaIcon, fight.player.icon, explorer.plasma);
				setTimeout(this.playerAttack.bind(fight), explorer.plasmaSpeed*NUMBER_OF_CELLS, explorer.plasma);

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
			onClick = ()=>{
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


