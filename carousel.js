
/*

1 collect items
2 collect css needed for different carousel positions (final + animations in between):
	top, left, width, height
3 init initial item positions
4 init controls (buttons, click on item, etc.)

*/


var carousel = {
	options: {},

	items: (function() {
		return {};
	}()),

	visiblePositions: (function() {
		return {};
	}()),

	init: function() {
		this.initItemPositions();
		this.initControls();
	},
	initItemPositions: function() {
		console.log("initItemPositions: showing some, hiding the rest");
	},
	initControls: function() {
		var btnLeft = $(".js-btn-left").get(0),
			btnRight = $(".js-btn-right").get(0);

		console.log("initControls");
		btnLeft.onclick = this.cycleLeft;
		btnRight.onclick = this.cycleRight;

	},
	cycleLeft: function() {
		console.log("cycleLeft");
	},
	cycleRight: function() {
		console.log("cycleRight");
	}





}


