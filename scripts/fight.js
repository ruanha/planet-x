"use strict";

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
		events.titleText=this.enemy.titleText;
		events.message=this.enemy.messageText;
		this.initPlayer();

		game.pause();
		events.display( buttons.battleButtons(), true, true );
		fight.enemy.interval = setInterval(fight.enemyAttack.bind(fight), fight.enemy.delay);
	},

	enemyDead: function(){
		clearInterval(fight.enemy.interval);
		fight.enemy.defeated();
		events.closePanel();
		events.display( buttons.lootBtns(), false, false );
	},

	playerDead: function(){
		clearInterval(fight.enemy.interval);
		fight.enemy.victorious();
		events.closePanel();
		explorer.dead("explorer destroyed by aliens!");
	},

	initPlayer: function(){
		this.player.hitPoints = explorer.health;
		this.player.icon = "@explorer";
	},

	enemyAttack: function(){
		events.animation(fight.enemy.weaponIcon, fight.enemy.icon, 200);
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
		}, 200*6 );
	},

	playerAttack: function(damage){
		console.log(damage);
		if ( damage == "slow"){
			fight.enemy.delay = Math.round(fight.enemy.delay * 3);
			clearInterval(fight.enemy.interval);
			fight.enemy.interval = setInterval(fight.enemyAttack.bind(fight), fight.enemy.delay);
		}
		else{
			this.enemy.hitPoints -= damage;
			console.log("player attack!");
			if ( this.enemy.hitPoints <= 0 ){
				fight.enemyDead();
			}
			else {
				document.getElementById("enemy-health-bar").textContent = "health   "+ this.enemy.hitPoints;
			}				
		}
	},
};