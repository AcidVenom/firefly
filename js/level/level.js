require("js/level/player");
require("js/level/wall");

var Level = function(camera)
{
	this._camera = camera;

	this.initialise = function()
	{
		Log.debug("Initialising level");

		this._walls = [];
		this.resetPlayer();
		this._segments = [];
		this._segmentWidth = 800;
		this._editLevel = true;
		this._mouseHeld = false;
		this._startPoint = {x: 0, y: 0}
		this._endPoint = {x: 0, y: 0}
		this._zoom = 1;

		this._camera.setZoom(this._zoom);

		var curSegment = 0;
		while(IO.fileExists("textures/level/segments/segment_" + curSegment + ".png"))
		{
			var segment = Quad2D.new();
			segment.setTexture("textures/level/segments/segment_" + curSegment + ".png");
			segment.setToTexture();
			segment.spawn("Default");
			segment.setTranslation(curSegment * segment.textureMetrics().width, 0, -1);
			segment.setOffset(0.5, 0.5);
			segment.setSampling(Sampling.Point);
			segment.setShader("shaders/segments.fx");
			this._segments.push(segment);

			++curSegment;
		}

		this.loadLevel();
		Log.debug("Initialised level");
	}

	this.update = function(dt)
	{
		if (Keyboard.isReleased("Q"))
		{
			this._editLevel = !this._editLevel;
			this._camera.setZoom(1);
			this._zoom = 1;
		}
		if (this._editLevel == true)
		{
			this.updateEdit(dt);
		}
		else
		{
			this._player.update(dt, this._walls);
			this._camera.setTranslation(this._player.translation().x, this._player.translation().y, 0);
		}
	}

	this.updateEdit = function(dt)
	{
		var pos = Mouse.position(Mouse.Relative);
		var t = this._camera.translation();

		var x = pos.x / this._zoom + t.x;
		var y = pos.y / this._zoom + t.y;

		Line.draw(x - 2, y - 2, 0, 1, 0, 0, x + 2, y + 2, 0, 1, 0, 0);
		Line.draw(x + 2, y - 2, 0, 1, 0, 0, x - 2, y + 2, 0, 1, 0, 0);

		if (Mouse.isDown(0))
		{
			var movement = Mouse.movement();
			var xx = -movement.x * 100 * dt / this._zoom;
			var yy = movement.y * 100 * dt / this._zoom;
			this._camera.translateBy(xx, yy, 0);
		}

		if (Mouse.wheelDown())
		{
			this._camera.setZoom(this._zoom /= 1.2);
		}

		if (Mouse.wheelUp())
		{
			this._camera.setZoom(this._zoom *= 1.2);
		}

		if (Mouse.isPressed(1))
		{
			this._mouseHeld = true;
			this._startPoint = {x: x, y: y}
		}

		if (this._mouseHeld == true)
		{
			this._endPoint = {x: x, y: y}
		}

		if (Mouse.isReleased(1))
		{
			if (this._mouseHeld == true)
			{
				this._mouseHeld = false;
				this._walls.push(new Wall(this._startPoint.x, this._startPoint.y, this._endPoint.x, this._endPoint.y));
			}
		}

		if (Keyboard.isReleased("Z"))
		{
			if (this._walls.length > 0)
			{
				this._walls.pop();
			}
		}

		if (Keyboard.isReleased("P"))
		{
			this.resetPlayer();
		}

		if (Keyboard.isReleased("S"))
		{
			this.saveLevel();
		}

		if (Keyboard.isReleased("L"))
		{
			this.loadLevel();
		}

		if (Keyboard.isReleased("E"))
		{
			this.setPlayerPosition(x, y);
		}
	}

	this.resetPlayer = function()
	{
		this._player = new Player();
		this._player.update(0, this._walls);
		Game.cleanUp();
	}

	this.setPlayerPosition = function(x, y)
	{
		this._player.setPos(x, y);
		this._player.update(0, this._walls);
	}

	this.saveLevel = function()
	{
		var json = {
			walls: []
		}
		for (var i = 0; i < this._walls.length; ++i)
		{	
			var points = this._walls[i].points();
			var point;
			var newPoints = [];
			for (var j = 0; j < points.length; ++j)
			{
				point = points[j];
				newPoints.push(point.x);
				newPoints.push(point.y);
			}
			json.walls.push(newPoints);
		}

		IO.save("json/level.json", JSON.stringify(json));
	}

	this.loadLevel = function()
	{
		if (IO.fileExists("json/level.json") == true)
		{
			this._walls = [];
			var json = JSON.parse(IO.open("json/level.json"));

			for (var key in json)
			{
				if (key == "walls")
				{
					var walls = json[key];
					var wall;
					for (var i = 0; i < walls.length; ++i)
					{
						wall = walls[i];

						this._walls.push(new Wall(wall[0], wall[1], wall[2], wall[3]));
					}
				}
			}
		}
	}

	this.draw = function(dt)
	{
		if (this._editLevel == true)
		{
			for (var i = this._walls.length - 1; i >= 0; --i)
			{
				var wall = this._walls[i];
				wall.debugDraw(dt);
			}

			if (this._mouseHeld == true)
			{
				Line.draw(this._startPoint.x, this._startPoint.y, 0, 0, 1, 0, this._endPoint.x, this._endPoint.y, 0, 0, 1, 0);
			}
		}
	}

	this.initialise();
}