var Message = function()
{
	this._startY = -RenderSettings.resolution().h / 2 + 120;
	this._shift = 160;

	this._timer = {
		time: 0,
		speed: 0.075
	}

	this.initialise = function()
	{
		this._text = Text.new();
		this._text.setText("");
		this._text.setFontSize(24);
		this._text.setFontFamily("fonts/dinpro.otf");
		this._text.setAlignment(TextAlignment.Center);
		this._text.setTranslation(0, this._startY, 0);
		this._text.setSpacing(5, 0);
		this._text.spawn("UI");
	}

	this.update = function(dt)
	{
		if (this._timer.time < 1)
		{
			this._timer.time += dt*this._timer.speed;

			var height = Math.lerp(this._startY, this._startY - this._shift, this._timer.time);
			this._text.setTranslation(0, height, 0);

			this._text.setAlpha(Math.sin(this._timer.time * Math.PI * 2));
		}
		else
		{
			this._text.setTranslation(0, this._startY - this._shift, 0);
		}
	}

	this.show = function(text)
	{
		this._text.setText(text);
		this._timer.time = 0;
		this._text.setAlpha(0);
	}

	this.initialise();
}