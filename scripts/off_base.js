"use strict";



let offBase = {
	operations: [], //list of active off base operations

	M:{pos:{}, name:"metals", droids:0, underAtack:false, underAttackTimer: false},
	R:{pos:{}, name:"rare", droids:0, underAtack:false, underAttackTimer: false},
	
	output: function(){
		for ( let i=0; i<offBase.operations.length; i++){
			resources.add( offBase.operations[i].name, offBase.operations[i].droids );
			resourcePanel.updateViewResource(offBase.operations[i].name);
		}
	},

	underAttack: function(posx, posy){
		for ( let i=0; i<offBase.operations.length; i++ ){
			if ( posx == offBase.operations[i].pos.x && posy == offBase.operations[i].pos.y && 
				offBase.operations[i].underAttack ){
				return offBase.operations[i];
			}		
		}
	},

	addOffbase: function(tileIcon, posx, posy){
		let newBase = {};
		Object.assign(newBase, offBase[tileIcon] );
		newBase.pos = {x:posx, y:posy};
		offBase.operations.push(newBase);
	},

	baseExist: function(posx, posy){
		for ( let i=0; i<offBase.operations.length; i++){
			if ( posx == offBase.operations[i].pos.x && posy == offBase.operations[i].pos.y ){
				return true;
			}
		}
		return false;
	},

	getOffbaseAtPos: function(posx, posy){
		for ( let i=0; i<offBase.operations.length; i++ ){
			if ( posx == offBase.operations[i].pos.x && posy == offBase.operations[i].pos.y ){
				return offBase.operations[i];
			}		
		}
	},

	addDroid: function(obj){
		obj.droids += 1;
	},

	getActiveBase: function(){
		for ( let i=0; i<offBase.operations.length; i++ ){
			if ( offBase.operations[i].droids > 0 ){
				return offBase.operations[i];
			}
			else {
				return false;
			}
		}		
	},

	removeBase: function(obj){
		for ( let i=0; i<offBase.operations.length; i++ ){
			if ( offBase.operations[i] == obj){
				offBase.operations.splice(i, 1);
			}
		}		
	},
};