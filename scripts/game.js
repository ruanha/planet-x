"use strict";

let game = {
	on: false,
	round: 0,
	development: (location.hostname == "localhost")? true:false,

	pause: function(){
		game.on = false;
		explorer.deployed = false;
	},

	resume: function(){
		game.on = true;
		explorer.deployed = ( explorer.pos.x == base.pos.x && explorer.pos.y == base.pos.y )? false:true;
	},

	init: function(){
		views.init(); //set initial divs
		messages.display([">> Starship has entered orbit", ">> Get ready..."]);
		buttons.landBtn();
		buttons.slideMenu.controlRoom();	
	},

	loop: function(){
		setInterval( function(){
			if ( game.on ){
				base.output();
				offBase.output();
				game.round += 1;
			}
		}, 1000);
	},
}

game.init();

if ( game.development ){
	setTimeout(function(){
		document.getElementById("landBtn").click();
		setTimeout(function(){
			document.getElementById("restart-reactor-button").click();
			setTimeout(function(){
				document.getElementById("activate-extractor-button").click();
				resources.energy = 1000;
				resourcePanel.updateViewResource("energy")
				resources.metals = 1000;
				resourcePanel.updateViewResource("metals")
				document.getElementById("droid-factory-button").click()
				base.droids.idle = 10;
				resourcePanel.updateViewBase("idle")
				document.getElementById("explorer-button").click()
				explorer.onBoard.energy = 1000;
				explorer.onBoard.droids = 1;
				explorer.maxHealth = 100;
				explorer.health = 100;
				explorer.weapon = 10;
				document.getElementById("deploy-button").click()
			}, 100)
		}, 100)
	}, 500)
}


game.loop();