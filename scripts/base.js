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
			for ( i=0; i<base.droids.extractor; i++ ){
				//let resourceList = ["metals", "metals", "metals", "metals", "metals", "metals", "metals", "metals", "uran", "rare"];
				//let randomResource = resourceList[ Math.floor( Math.random()*resourceList.length ) ];
				resources.metals += 1;
				resourcePanel.updateViewResource("metals");
			}
		}

		if ( base.droids.reactor ){
			resources.energy += Math.min( base.cores, base.droids.reactor );
			resourcePanel.updateViewResource("energy");
		}
	},
}