let enemies = {
	submarineBeast: function(){
		return new this.EnemyFactory(this.submarineBeastObj);
	},

	missileCruiserBeast: function(){
		return new this.EnemyFactory(this.missileCruiserBeastObj);
	},

	battleShipBeast: function(){
		return new this.EnemyFactory(this.battleShipBeastObj);
	},

	mineAttackBeast: function(){
		return new this.EnemyFactory(this.mineAttackerBeastObj);
	},

	hiveAttackBeast: function(){
		return new this.EnemyFactory(this.hiveAttackObj);
	},

	baseAttackBeast: function(){
		return new this.EnemyFactory(this.baseAttackBeastObj);
	},



	EnemyFactory: function(beastObj){
		this.hitPoints = beastObj.hitPoints;
		this.damage = beastObj.damage;
		this.delay = beastObj.delay;
		this.weaponIcon = beastObj.weaponIcon;
		this.icon = beastObj.icon;
		this.titleText = beastObj.titleText;
		this.messageText = beastObj.messageText;
		this.deadMessage = beastObj.deadMessage;
		this.loot = {};
		Object.assign( this.loot, beastObj.loot );
		this.init = beastObj.init;
		this.playerArrives = beastObj.playerArrives;
		this.defeated = beastObj.defeated;
		this.victorious = beastObj.victorious;
	},

	submarineBeastObj: {
		hitPoints:5,
		damage:1,
		delay:1500,
		weaponIcon:"-",
		icon:"@enemy",
		titleText:"An Unknown Alien",
		messageText:"An unknown alien attacks.",
		deadMessage:"Alien attacker defeated.",
		loot:{metals:2, energy:5},

		playerArrives: function(){
		},

		defeated: function(){
			console.log("enemy dead")
		},
		victorious: function(){
			console.log("player dead")
		},
	},

	battleShipBeastObj: {
		hitPoints:15,
		damage:2,
		delay:1500,
		weaponIcon:"*",
		icon:"@enemy",
		titleText:"A Large Alien",
		messageText:"A large unknown alien attacks.",
		deadMessage:"Large alien attacker defeated.",
		loot:{metals:15, energy:15, rare:1},

		playerArrives: function(){
		},

		defeated: function(){
			console.log("enemy dead")
		},
		victorious: function(){
			console.log("player dead")
		},		
	},

	missileCruiserBeastObj: {
		hitPoints:30,
		damage:10,
		delay:1500,
		weaponIcon:"<=",
		icon:"@enemy",
		titleText:"A Huge Alien",
		messageText:"A huge unknown alien attacks.",
		deadMessage:"Huge alien attacker defeated.",
		loot:{metals:20, energy:15, rare:5},

		playerArrives: function(){
		},

		defeated: function(){
			console.log("enemy dead")
		},
		victorious: function(){
			console.log("player dead")
		},		
	},

	mineAttackerBeastObj: {
		hitPoints:15,
		damage:2,
		delay:1500,
		weaponIcon:"*",
		icon:"@enemy",
		titleText:"Large Alien Attacker",
		messageText:"Large alien attacking our mine from above",
		deadMessage:"Mine succesfully defended!",
		loot:{metals:7, energy:10},

		playerArrives: function(){
			clearTimeout(baseObj);
		},

		defeated: function(){
			let offBaseObj = offBase.getOffbaseAtPos(explorer.pos.x, explorer.pos.y);
			offBaseObj.underAttack = false;
			clearTimeout(offBaseObj.underAttackTimer);
		},
		victorious: function(){
			let offBaseObj = getOffbaseAtPos(explorer.pos.x, explorer.pos.y);
			AI.delayMessage(["Mine lost..."]);
			offBaseObj.underAttack = false;
			offBaseObj.droids = 0;
			offBase.removeBase(offBaseObj);
			clearTimeout(offBaseObj.underAttackTimer);
		},
	},


	hiveAttackObj: {
		hitPoints:20,
		damage:2,
		delay:1500,
		weaponIcon:"<",
		icon:"@enemy",
		titleText:"A Hive of Alien Creatures.",
		messageText:"Exterminate the hive creatures!",
		deadMessage:"Hive destroyed!",
		loot:{metals:7, energy:10},

		playerArrives: function(){
		},

		defeated: function(){
			tile = map.getTile(explorer.pos.x, explorer.pos.y);
			tile.symbol = "X";
			tile.event = "destroyed hive";
		},	
		victorious: function(){
		},
	},

	baseAttackBeastObj: {
		hitPoints:30,
		damage:5,
		delay:1500,
		weaponIcon:"o",
		icon:"@enemy",
		titleText:"Base is under attack!",
		messageText:"We are being attacked!",
		deadMessage:"Victory!",
		loot:{metals:7, energy:10},


		playerArrives: function(){
			clearTimeout(base.underAttackTimer);
		},

		defeated: function(){
			base.underAttack = false;
		},	
		victorious: function(){
			console.log("Base bombarded, droids lost");
			for ( let key in base.droids ){
				base.droids[key] = Math.floor(base.droids[key]/2);
			}
			base.underAttack = false;
		},
	},
}