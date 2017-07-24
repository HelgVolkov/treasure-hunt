'use strict';

var model = {
	treasure: document.getElementsByClassName('treasure')[0],
	treasureSize: 100,
	treasureIsFound: false,
	status: [
		'Холоднее',
		'Теплее',
		'Горячо!',
		'Клад найден'
	],
	previousGuess: null,
	guess: function(coords) {
		var X = this.treasure.offsetLeft,
			Y = this.treasure.offsetTop,
			centerX = X + this.treasureSize / 2,
			centerY = Y + this.treasureSize / 2;

		if(Math.abs(centerX - X) <= Math.abs(centerX - coords.X) || Math.abs(centerY - Y) <= Math.abs(centerY - coords.Y)) {

			console.log("Coordinates: " + centerX + " | " + centerY);
			console.log("Guess: " + coords.X + " | " + coords.Y);

			if(this.previousGuess) {
				if(Math.abs(centerX - coords.X) < 100 && Math.abs(centerY - coords.Y) < 100) {
					view.showMessage(this.status[2]);
				} else if(Math.abs(centerX - coords.X) < Math.abs(centerX - this.previousGuess.X) && Math.abs(centerY - coords.Y) < Math.abs(centerY - this.previousGuess.Y)) {
					view.showMessage(this.status[1]);
				} else {
					view.showMessage(this.status[0]);
				}
			}

			this.previousGuess = coords;
			return false;

		}

		return true;
	},
	getPosition: function() {
		var X = Math.floor(Math.random() * (window.innerWidth - this.treasureSize));
		var Y = Math.floor(Math.random() * (window.innerHeight - this.treasureSize));

		return {
			X: X,
			Y: Y
		}
	},
	drawTreasure: function() {
		this.treasure.style.width = model.treasureSize + "px";
		this.treasure.style.height = model.treasureSize + "px";
		do {
			var pos = this.getPosition();
		} while(this.collision(pos)) {
			this.treasure.style.top = pos.Y + "px";
			this.treasure.style.left = pos.X + "px";
		}
	},
	collision: function(coords) {
		var status = document.getElementsByClassName('status')[0];
		if(coords.X <= status.offsetLeft + status.offsetWidth || coords.Y >= status.offsetTop) {
			return true;
		}
		return false;
	}
}

var view = {
	drawMarker: function(coords) {
		var marker = document.createElement('div');
		marker.classList.add('marker');
		marker.style.top = coords.Y + "px";
		marker.style.left = coords.X + "px";
		document.getElementsByTagName('body')[0].appendChild(marker);
	},
	showMessage: function(msg) {
		var status = document.getElementsByClassName('status')[0];
		status.innerHTML = msg;
	},
	showTreasure: function() {
		model.treasure.classList.add('found');
	}
}

var controller = {
	guesses: 0,
	processGuess: function(coords) {
		view.drawMarker(coords);
		var guess = model.guess(coords);
		this.guesses++;

		if(guess) {
			view.showTreasure();
			view.showMessage(model.status[3] + " за " + this.guesses + " попыток!");
			model.treasureIsFound = true;
		}
	}
}

function handleMouseClick(e) {
	var coords = {
		X: e.pageX,
		Y: e.pageY
	};

	if(!model.treasureIsFound) {
		controller.processGuess(coords);
	} else {
		alert("Вы уже нашли клад! Обновите страницу, если хотите сыграть снова.");
	}
}

function init() {
	model.drawTreasure();
}

window.onload = init;
document.onclick = handleMouseClick;
