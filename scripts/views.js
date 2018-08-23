"use strict";
//make View, panels and menu
//display AI message
//land button
//display views and panel menu

let CURRENT_SLIDE_POSITION = 0;

let views={

	init: function(){
		const wrapper = document.getElementById("wrapper");
		const menu = document.getElementById("menu");

		let github = document.createElement("a");
		github.textContent = "github";
		github.setAttribute("href", "https://github.com/ruanha/planet-x");
		github.setAttribute("class", "menu-text");
		menu.appendChild(github);

		const slidingWindow = document.createElement("div");
		slidingWindow.setAttribute("id", "slidingWindow");

		const slidingWindowLeft = document.createElement("div");
		slidingWindowLeft.setAttribute("id", "slidingWindowLeft");

		const slidingWindowRight = document.createElement("div");
		slidingWindowRight.setAttribute("id", "slidingWindowRight");

		const viewPanel = document.createElement("div");
		viewPanel.setAttribute("id", "viewPanel");

		const messages = document.createElement("div");
		messages.setAttribute("id", "messages");

		const view = document.createElement("div");
		view.setAttribute("id","view");

		const resourcePanel = document.createElement("div");
		resourcePanel.setAttribute("id", "resourcePanel");
		resourcePanel.style.visibility = "hidden";

		const resourceMonitor = document.createElement("div");
		resourceMonitor.setAttribute("id", "resource-monitor");
		resourceMonitor.setAttribute("data-legend", "resources");
		const resourceMonitorTable = document.createElement("table");
		resourceMonitorTable.setAttribute("id", "resource-monitor-table");

		const baseMonitor = document.createElement("div");
		baseMonitor.setAttribute("id", "base-monitor");
		baseMonitor.setAttribute("data-legend", "base");
		const baseMonitorTable = document.createElement("table");
		baseMonitorTable.setAttribute("id", "base-monitor-table");

		baseMonitor.appendChild(baseMonitorTable);
		resourcePanel.appendChild(baseMonitor);
		resourceMonitor.appendChild(resourceMonitorTable);
		resourcePanel.appendChild(resourceMonitor);
		slidingWindow.appendChild(slidingWindowLeft);
		slidingWindow.appendChild(slidingWindowRight);
		slidingWindowRight.appendChild(viewPanel);
		slidingWindowLeft.appendChild(messages);
		slidingWindowRight.appendChild(view);
		slidingWindowRight.appendChild(resourcePanel);
		wrapper.appendChild(slidingWindow);

		let controlRoomView = document.createElement("div");
		controlRoomView.setAttribute("class", "views");
		controlRoomView.setAttribute("id", "controlRoomView");
		controlRoomView.textContent = "Actions:"
		view.appendChild(controlRoomView);


		let baseView = document.createElement("div");
		baseView.setAttribute("class", "views");
		baseView.setAttribute("id", "baseView");
		baseView.textContent = "Work:"
		view.appendChild(baseView);

		let explorerView = document.createElement("div");
		explorerView.setAttribute("class", "views");
		explorerView.setAttribute("id", "explorerView");
		explorerView.textContent = "Build:";
		view.appendChild(explorerView);

		buttons.explorer();

		explorer.init();

		let planetView = document.createElement("div");
		planetView.setAttribute("class", "views");
		planetView.setAttribute("id", "planetView");
		view.appendChild(planetView);

		let explorerMonitor = document.createElement("div");
		explorerMonitor.setAttribute("id", "planet-monitor-explorer");
		explorerMonitor.setAttribute("data-legend", "explorer");
		planetView.appendChild(explorerMonitor);
		explorer.updateMonitor();

		let planetMonitor = document.createElement("div");
		planetMonitor.setAttribute("id", "planet-monitor");
		planetMonitor.setAttribute("data-legend", "planet-x");
		planetView.appendChild(planetMonitor);

		map.init();
		planet.init();
	},
};