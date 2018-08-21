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
		event.display( buttons.battleButtons(), true, true );
		fight.enemy.interval = setInterval(fight.enemyAttack.bind(fight), fight.enemy.delay);
	},

	enemyDead: function(){
		clearInterval(fight.enemy.interval);
		fight.enemy.defeated();
		event.closePanel();
		event.display( buttons.lootBtns(), false, false );
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
}


