"use strict";

let messages={
	level: 0,
	delay: [0, 0, 0],
	writesMessage: false,
	onScreen: [],
	maxMessages:5,

	display: function(messageArray) {
		this.writesMessage = true;
		let message = messageArray.shift();
		let delay = this.delay[this.level];

		if ( message != undefined ) {
			this.onScreen.push(message);
			let div = document.getElementById("messages");
			if ( this.onScreen.length >= this.maxMessages ){
				div.removeChild(div.firstChild);
			}
			let i = 0, howManyTimes = message.length;
			const para = document.createElement('p');
			function f(){
				para.textContent = message.slice(0,i+1);
				div.appendChild(para);
				i++;
				if( i < howManyTimes && message != undefined ){
					setTimeout( f, delay );
	    		}
	    		else if ( message !== undefined ){
	    			messages.display(messageArray);
	    		};
	    	};
	    	f();
		}
		else {
			this.writesMessage = false;
		};
	},
}