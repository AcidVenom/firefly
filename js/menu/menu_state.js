require("js/menu/menu");

var MenuState = function()
{
	this.name = "Main Menu";

	this.initialise = function()
	{
		ContentManager.load("box", "boxes/menu.box")
		this._camera = Camera.new("orthographic");
		this._menu = new Menu();
	}

	this.update = function(dt)
	{
		this._menu.update(dt);
	}

	this.draw = function(dt)
	{
		Game.render(this._camera);
	}

	this.destroy = function()
	{
		ContentManager.unload("box", "boxes/menu.box");
	}

	this.reload = function()
	{
		this._menu = new Menu();
	}
}