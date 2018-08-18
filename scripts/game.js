"use strict";

function game(){
	game.on = false;

	views.init(); //set initial divs
	messages.display([">> Starship has entered orbit", ">> Get ready..."]);
	buttons.landBtn();
	buttons.slideMenu.controlRoom();

	let gameLoop = setInterval( function(){
		if ( game.on ){
			console.log("game on...")
		}
	}, 1000);
};

game();