"use strict";

let base = {
	active: false,
	reactorActive: false,
	extractorActive: false,
	droids: {}, //will contain: idle, reactor, extractor
	pos: {x:65, y:25},
	cores:1,
	underAttack: false,
	underAttackTimer: undefined,

	output: function(){
		//BASE EXTRACTOR
		if ( base.droids.extractor ) {
			for ( let i=0; i<base.droids.extractor; i++ ){
				resources.metals += 1;
				resourcePanel.updateViewResource("metals");
			}
		}

		if ( base.droids.reactor ){
			resources.energy += Math.min( base.cores, base.droids.reactor );
			resourcePanel.updateViewResource("energy");
		}
	},
};