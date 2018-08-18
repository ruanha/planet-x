"use strict";

let utils = {
	cooldown:function(time, button, btnText, callback){
		if (time <= 0) {
			button.textContent = btnText;
			callback();
			return time;
		}
		button.textContent = time/1000;
		setTimeout(function() {
			return utils.cooldown(time-1000, button, btnText, callback);
		}, 1000);
	},

	isEmpty: function(obj) {
	    for(let key in obj) {
	        if(obj.hasOwnProperty(key))
	            return false;
	    }
	    return true;
	},

	canBuy: function(cost){
		for ( let key in cost ){
			if ( !resources.hasOwnProperty(key) || cost[key] > resources[key] ){
				return false;
			}
		}
		return true;
	},

	slide: function(startPos, endPos, time=500, steps=50){
		//slides the view between Control Room <--> Base <--> Explorer
		let view = document.getElementById("view");
		view.style.position = "relative";

		const sign = ( startPos > endPos )? 1:-1;

		const time_step = time/steps;
		const base = Math.abs(endPos-startPos)**(1/time);

		let count = 0;

		function recursive(t){
			let pos = ( startPos > endPos )? startPos - base**t: startPos + base**t
			if ( count >= steps ){
				view.style.left = endPos+"px";
				return endPos;
			}
			else{
				setTimeout(()=>{
					view.style.left = pos+"px";
					recursive(t+10);
				}, 10)
			}
			count ++;
		}
		recursive(0);

	},
	
	array2String: function(arr){
		/* takes an array returns a string of the content - includes whitespace!*/
		let str = "";
		for ( let i=0; i<arr.length; i++){
			if ( arr[i] == ' ')
				str+='\xa0';
			else
				str += arr[i];
		}
		return str;
	},
};