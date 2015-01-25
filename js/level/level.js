require("js/level/player");
require("js/level/wall");

var Level = function(camera)
{
	this._camera = camera;

	this.initialise = function()
	{
		Log.debug("Initialising level");

		this._player = new Player();
		this._walls = [];

		this._walls.push(new Wall(-100, 220, 100, 200));
		this._walls.push(new Wall(100, 200, 300, 220));
		this._walls.push(new Wall(300, 220, 560, 310));
		this._walls.push(new Wall(560, 310, 760, 330));
		this._walls.push(new Wall(760, 330, 780, 280));
		this._walls.push(new Wall(780, 280, 1000, 270));

		Log.debug("Initialised level");
	}

	this.update = function(dt)
	{
		this._player.update(dt, this._walls);
		this._camera.setTranslation(this._player.translation().x, this._player.translation().y, 0);
	}

	this.draw = function(dt)
	{
		var drawWalls = true

		if (drawWalls == true)
		{
			for (var i = this._walls.length - 1; i >= 0; --i)
			{
				var wall = this._walls[i];
				wall.debugDraw(dt);
			}
		}
	}

	this.initialise();
}