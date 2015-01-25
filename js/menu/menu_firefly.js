var MenuFirefly = function()
{
	this._timer = 1;
	this._oldPos = Mouse.position(Mouse.Relative);
	this._moveFrom = {x: 0, y: 0}
	this._speed = 3;

	this.initialise = function()
	{
		this._widget = Widget.new();
		extend(this, this._widget);

		var frames = [
			{
				x: 0,
				y: 0,
				width: 32,
				height: 32,
				wait: 0
			},
			{
				x: 32,
				y: 0,
				width: 32,
				height: 32,
				wait: 0
			}
		]

		this.addAnimation("idle", "textures/menu/firefly.png", frames);
		this.setAnimation("idle");
		this.playAnimation("idle");
		this.setAnimationSpeed("idle", 4);

		this.spawn("Default");

		this.setOffset(0.5, 0.5);
	}

	this.update = function(dt)
	{
		var pos = Mouse.position(Mouse.Relative);

		if (pos.x != this._oldPos.x || pos.y != this._oldPos.y)
		{
			this._timer = 0;
			this._moveFrom = {x: this.translation().x, y: this.translation().y}
			this._oldPos = pos;
		}

		if (this._timer < 1)
		{
			var t = this.translation();
			this._timer += dt * Math.distance(t.x, t.y, this._oldPos.x, this._oldPos.y) / RenderSettings.resolution().w * this._speed;
			var newPos = Math.lerp2D(this._moveFrom.x, this._moveFrom.y, this._oldPos.x, this._oldPos.y, this._timer);

			this.setTranslation(newPos.x, newPos.y, t.z);
		}
	}

	this.initialise();
}