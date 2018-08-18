"use strict";

let base = {
	active: false,
	reactorActive: false,
	extractorActive: false,
	droids: {}, //will contain: idle, reactor, extractor
	pos: {x:67, y:25},
	cores:1,
	installed: {
		//contains cores
	},
	underAttack: false,
	underAttackTimer: undefined,
}