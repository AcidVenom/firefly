require("js/menu/button");
require("js/menu/menu_firefly");

require("js/level/level_state");

var Menu = function()
{
	this._flareCenter = {
		x: -7,
		y: 90
	}

	this._flareScale = {
		min: 1,
		max: 1.2
	}

	this._timers = {
		flare: {time: 0, speed: 0.75},
		fade: {time: 0, speed: 0.75}
	}

	this._zIndex = {
		background: 0,
		flare: 1,
		elements: 2,
		firefly: 3,
		fade: 4
	}

	this._titleHeight = -200;
	this._buttonHeight = 150;

	this._fadeIn = true;

	this.initialise = function()
	{
		this._fadeWidget = Widget.new();
		this._fadeWidget.setSize(RenderSettings.resolution().w, RenderSettings.resolution().h);
		this._fadeWidget.setBlend(0,0,0);
		this._fadeWidget.setTranslation(0, 0, this._zIndex.fade);
		this._fadeWidget.setOffset(0.5, 0.5);
		this._fadeWidget.spawn("UI");

		Log.info("Initialising menu");
		Log.debug("Initialising menu background");
		this._background = Widget.new();
		this._background.setTexture("textures/menu/background.png");
		this._background.setToTexture();
		this._background.setOffset(0.5, 0.5);
		this._background.setTranslation(0, 0, this._zIndex.background);
		this._background.spawn("Default");

		Log.debug("Initialising menu flare");
		this._flare = Widget.new();
		this._flare.setTexture("textures/menu/flare.png");
		this._flare.setToTexture();
		this._flare.setOffset(0.5, 0.5);
		this._flare.spawn("Default");
		this._flare.setTranslation(this._flareCenter.x, this._flareCenter.y, this._zIndex.flare);

		Log.debug("Initialising menu title");
		this._title = Text.new();
		this._title.setFontFamily("fonts/dinpro.otf");
		this._title.setText("firefly\n[size=24]from past to present[/size]");
		this._title.setFontSize(64);
		this._title.setSpacing(10, 0);
		this._title.spawn("Default");
		this._title.setTranslation(0, this._titleHeight, this._zIndex.elements);
		this._title.setAlignment(TextAlignment.Center);

		Log.debug("Initialising menu buttons");
		this._buttons = [];

		var buttonNames = ["start", "quit"];
		var button;

		for (var i = 0; i < 2; ++i)
		{
			button = new Button(buttonNames[i]);
			button.setTranslation(0, this._buttonHeight + i * 40, this._zIndex.elements);
			button.spawn("Default");
			button.menu = this;

			this._buttons.push(button);
		}

		this._buttons[0].setOnReleased(function(callee, button)
		{
			if (button == 0)
			{
				callee.menu.fadeOut();
			}
		});

		this._buttons[1].setOnReleased(function(callee, button)
		{
			if (button == 0)
			{
				Game.quit();
			}
		});

		Log.debug("Initialising menu firefly");

		this._firefly = new MenuFirefly();
		this._firefly.setTranslation(0, 0, this._zIndex.firefly);

		Log.info("Initialised menu");
	}

	this.fadeOut = function()
	{
		this._fadeIn = false;
	}

	this.update = function(dt)
	{
		this._timers.flare.time += dt * this._timers.flare.speed;

		if (this._timers.flare.time >= Math.PI * 4)
		{
			this._timers.flare.time = 0;
		}

		var r = Math.abs(Math.sin(this._timers.flare.time));
		var scale = this._flareScale.min + r * (this._flareScale.max - this._flareScale.min);
		this._flare.setAlpha(r);
		this._flare.setScale(scale, scale);
		this._title.setAlpha(r / 2 + 0.5);

		this._firefly.update(dt);

		if (this._fadeIn == true)
		{
			var t = this._timers.fade;

			if (t.time < 1)
			{
				t.time += dt * t.speed;
				this._fadeWidget.setAlpha((1-t.time));
			}
			else
			{
				this._fadeWidget.setAlpha(0);
			}
		}
		else
		{
			var t = this._timers.fade;

			if (t.time > 0)
			{
				t.time -= dt * t.speed;
				this._fadeWidget.setAlpha((1-t.time));
			}
			else
			{
				StateManager.switchState(LevelState);
			}
		}
	}

	this.initialise();
}