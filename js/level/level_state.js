require("js/level/level");

var LevelState = function()
{
	this.name = "Level";

	this.initialise = function()
	{
		ContentManager.load("box", "boxes/level.box");
		
		this._camera = Camera.new("orthographic");
		this._level = new Level(this._camera);
	}

	this.update = function(dt)
	{
		this._level.update(dt);
	}

	this.draw = function(dt)
	{
		this._level.draw(dt);
		Game.render(this._camera);
	}

	this.destroy = function()
	{
		ContentManager.unload("box", "boxes/level.box");
	}

	this.reload = function()
	{
		this._level = new Level(this._camera);
	}
}