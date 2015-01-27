require("js/level/player");
require("js/level/wall");
require("js/level/message");
require("js/level/firefly");

var Level = function(camera)
{
	this._camera = camera;

	this.initialise = function()
	{
		Log.debug("Initialising level");

		this._walls = [];
		this.resetPlayer();
		this._segments = [];
		this._triggers = [];
		this._segmentWidth = 800;
		this._editLevel = true;
		this._mouseHeld = false;
		this._startPoint = {x: 0, y: 0}
		this._endPoint = {x: 0, y: 0}
		this._zoom = 1;
		this._scrollspeed = 5;
		this._textTimer = 0;
		this._currentTrigger = 10;

		this._texts = [
			"This feels like a familiar place..",
			"Hey! It's the [b]firefly![/b]\nIt's been quite a while",
			"You see [b]scafolds[/b] in the distance,\nresembling something that has yet\nto be built",
			"On the horizon you catch a glimpse of a\nstructure that looks like an [b]Abbey[/b]",
			"Enchanted environment sparkles around you..\n[b]Monks[/b] at the [b]Abbey[/b] made this magic happen",
			"You also know of some monks\nwho made magic happen..\n..[b]divine[/b] even",
			"They needed some help..\n..They chose [b]you[/b] eventually",
			"All because of that firefly\nthat told you to [b]keep going[/b]",
			"And mother of a [b]giant[/b], you did",
			"And that's not just because I was\ncapable of doing so..",
			".. But also because you've given\nme the space to [b]explore[/b]",
			"You've given me a reason to\ncontinue doing what I do..",
			"..To not let anything bring me down..",
			"..To work like a [b]monk[/b]",
			"I cannot express in words how\ngrateful I am for that one chance..",
			"..I've experienced a form of kindness\nI've never really felt before",
			"And that's the kindness of appreciation",
			"Keep on going you all!\nBecause as everyone knows..",
			".. After rain ..",
			".. Comes sunshine",
			"I'll pack my bags and go on a journey",
			"A journey of a lifetime",
			"Stay legendary, thank you",
			"(Dáárk Sóls)"
		]

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

			var w = segment.textureMetrics().width;
			var h = segment.textureMetrics().height;
			var trigger = {x: curSegment * w + w / 2, y: h / 2, triggered: false}

			this._triggers.push(trigger)

			++curSegment;
		}

		this._message = new Message();
		this._firefly = new Firefly();

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
			this._message.update(dt);

			if (this._triggers[1].triggered == true)
			{
				this._firefly.update(dt, this._player);
			}

			if (this._triggers[9].triggered == true)
			{
				this._camera.translateBy(0, dt * this._scrollspeed, 0);
				this._player.setAnimationSpeed("walk", 0);

				if (this._textTimer < 1)
				{
					this._textTimer += dt * 0.15;
				}
				else
				{
					if (this._currentTrigger > this._texts.length-1)
					{
						return;
					}
					this._message.show(this._texts[this._currentTrigger]);
					this._textTimer = 0;
					this._currentTrigger++;
				}
				return;
			}
			
			this._player.update(dt, this._walls);
			this._camera.setTranslation(this._player.translation().x, this._player.translation().y, 0);
			
			var trigger
			for (var i = 0; i < this._triggers.length; ++i)
			{
				trigger = this._triggers[i];

				if (trigger.triggered == false)
				{
					var p = this._player.pos();
					var triggerRadius = 500
					if (Math.distance(p.x, p.y, trigger.x, trigger.y) < triggerRadius)
					{
						trigger.triggered = true;
						this._message.show(this._texts[i]);
					}
				}
			}
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
			this._locked = false;
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
		this._player = new Player(this._camera);
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