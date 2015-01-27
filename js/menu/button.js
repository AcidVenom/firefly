var Button = function(text)
{
	this._text = text

	this.initialise = function()
	{
		this._root = Widget.new();
		this._root.setOffset(0.5, 0);

		this._button = Text.new(this._root);
		this._button.setText(this._text);
		this._button.setBlend(0.4, 0.4, 0.4);
		this._button.setAlignment(TextAlignment.Center);
		this._button.setFontFamily("fonts/dinpro.otf");
		this._button.setFontSize(24);
		this._button.setSpacing(5, 0);

		var metrics = this._button.metrics();

		this._root.setSize(metrics.width, metrics.height);

		this._mouseArea = MouseArea.new(this._root);
		this._mouseArea.setOnEnter(function(callee, button)
		{
			callee.setBlend(1, 1, 1);
		}, this._button);

		this._mouseArea.setOnLeave(function(callee, button)
		{
			callee.setBlend(0.4, 0.4, 0.4);
		}, this._button);
	}

	this.setOnReleased = function(func)
	{
		this._mouseArea.setOnReleased(func, this);
	}

	this.setTranslation = function(x, y, z)
	{
		this._button.setTranslation(0, 0, z + 0.1);
		this._root.setTranslation(x, y, z);
	}

	this.spawn = function(target)
	{
		this._button.spawn(target);
	}

	this.destroy = function()
	{
		this._button.destroy();
	}

	this.initialise();
}