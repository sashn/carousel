
var carousel = {
	"options": {},
	"items": (function() {
		return {};
	}()),
	"visiblePositions": (function() {
		return {};
	}()),
	"init": function() {
		this.initItemPositions();
		this.initControls();
	},
	"initItemPositions": function() {
		console.log("initItemPositions: showing some, hiding the rest");
	},
	"initControls": function() {
		var btnLeft = $(".js-btn-left").get(0),
			btnRight = $(".js-btn-right").get(0);

		console.log("initControls");
		btnLeft.onclick = this.cycleLeft;
		btnRight.onclick = this.cycleRight;

	},
	"cycleLeft": function() {
		console.log("cycleLeft");
	},
	"cycleRight": function() {
		console.log("cycleRight");
	}





}


