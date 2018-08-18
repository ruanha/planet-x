"use strict";

let game = {
	on: false,
	round: 0,

	pause: function(){
		game.on = false;
	},

	resume: function(){
		game.on = true;
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
game.loop();