var Player = function(camera)
{
	this._pos = new Vector2D(0, 0);
	this._camera = camera;

	this._points = [
		new Vector2D(-10, -3),
		new Vector2D(10, -3),
		new Vector2D(-5, 0),
		new Vector2D(5, 0),
		new Vector2D(0, 1),
		new Vector2D(-10, -32),
		new Vector2D(10, -32)
	]
	this._origin = {
		x: 0.5,
		y: 0.85
	}

	this._velocity = new Vector2D(0, 0);

	this._gravity = 1500;
	this._maxVelocity = 500;
	this._jumpHeight = 400;
	this._friction = 0;
	this._slopeOffset = 1.2;

	this._jump = false;

	this._armHeight = 25;

	this._moveSpeed = {
		acceleration: 600,
		maxSpeed: 150
	}

	this.velocity = function()
	{
		return this._velocity;
	}

	this.pos = function()
	{
		return this._pos;
	}

	this.initialise = function()
	{
		this._quad = Quad2D.new();

		extend(this, this._quad);

		this.setTexture("textures/character/character.png");
		this.setToTexture();
		this.setOffset(this._origin.x, this._origin.y);
		this.spawn("Default");
		this.setSampling(Sampling.Point);

		this._eyes = Quad2D.new();
		this._eyes.setTexture("textures/character/character_eyes.png");
		this._eyes.setToTexture();
		this._eyes.setOffset(this._origin.x, this._origin.y);
		this._eyes.spawn("Default");
		this._eyes.setSampling(Sampling.Point);

		this._arm = Quad2D.new();
		this._arm.setTexture("textures/character/character_arm.png");
		this._arm.setToTexture();
		this._arm.setOffset(0.1, 0.5);
		this._arm.spawn("Default");
		this._arm.setSampling(Sampling.Point);

		this._bag = Quad2D.new();
		this._bag.setTexture("textures/character/character_bag.png");
		this._bag.setToTexture();
		this._bag.setOffset(this._origin.x, this._origin.y);
		this._bag.spawn("Default");
		this._bag.setSampling(Sampling.Point);

		var frames = [];
		var numFrames = 6;
		var frameWidth = 48;
		var frameHeight = 80;

		for (var i = 0; i < numFrames; ++i)
		{
			frames.push({
				x: i * frameWidth,
				y: 0,
				width: frameWidth,
				height: frameHeight,
				wait: 0
			});
		}

		this.addAnimation("walk", "textures/character/character.png", frames);
		this.setAnimation("walk");
		this.setAnimationSpeed("walk", 0);
		this.playAnimation("walk");

	}

	this._updateMovement = function(dt)
	{
		if (Keyboard.isDown("D"))
		{
			this._velocity.x += this._moveSpeed.acceleration * dt;

			if (this._velocity.x > this._moveSpeed.maxSpeed)
			{
				this._velocity.x = this._moveSpeed.maxSpeed;
			}
		}

		if (Keyboard.isDown("A"))
		{
			this._velocity.x -= this._moveSpeed.acceleration * dt;

			if (this._velocity.x < -this._moveSpeed.maxSpeed)
			{
				this._velocity.x = -this._moveSpeed.maxSpeed;
			}
		}

		this._velocity.y += this._gravity*dt;

		if (this._velocity.y > this._maxVelocity)
		{
			this._velocity.y = this._maxVelocity;
		}
	}

	this._endMovement = function(dt)
	{
		this._pos.x += this._velocity.x * dt;
		this._pos.y += this._velocity.y * dt;

		var wobble = 0;
		if (this._velocity.x > 0.02 || this._velocity.x < 0.02)
		{
			wobble = Math.sin(this._pos.x / 10) * 1;
		}

		this.setTranslation(this._pos.x, this._pos.y, 0);
		this._eyes.setTranslation(this._pos.x, this._pos.y - 2 + wobble * -1.1, 1);
		this._arm.setTranslation(this._pos.x, this._pos.y + wobble - this._armHeight, 1);
		this._bag.setTranslation(this._pos.x, this._pos.y + wobble / 1.5, 1);

		var mousePos = Mouse.position(Mouse.Relative);
		var t = this._camera.translation();

		var x1 = this._pos.x;
		var y1 = this._pos.y - this._armHeight;

		var x2 = mousePos.x + t.x;
		var y2 = mousePos.y + t.y;

		var angle = Math.atan2(y2 - y1, x2 - x1);

		this._arm.setRotation(0, 0, angle);

		angle = angle * 180 / Math.PI + 180;
		if (angle < 270 && angle > 90)
		{
			this._arm.setScale(1, 1);
		}
		else
		{
			this._arm.setScale(1, -1);
		}

		if (!Keyboard.isDown("A") && !Keyboard.isDown("D"))
		{
			this._velocity.x /= 5;
			this.setAnimationSpeed("walk", 0);
			this.setFrame("walk", 0);
		}
		else
		{
			var scale = this._velocity.x / Math.abs(this._velocity.x);
			this.setScale(scale, 1);
			this._eyes.setScale(scale, 1);
			this._bag.setScale(scale, 1);

			this.setAnimationSpeed("walk", Math.abs(this._velocity.x / 40));
		}

		if (Keyboard.isPressed("W"))
		{
			if (this._jump == false)
			{
				this._velocity.y -= this._jumpHeight;
				this._jump = true;
			}
		}
	}

	this._checkWallCollision = function(dt, walls)
	{
		var velo = {x: this._velocity.x * dt, y: this._velocity.y * dt}
		var wall, points, normal, d1, d2, collision, collided, vec, projected, line, onLine;
		var point;

		for (var j = 0; j < this._points.length; ++j)
		{
			point = this._pos.add(this._points[j]);
			for (var i = 0; i < walls.length; ++i)
			{
				wall = walls[i];
				points = wall.points();
				normal = wall.normal();

				d1 = point.subtract(points[0]).dot(normal);
				d2 = new Vector2D(point.x + velo.x, point.y + velo.y).subtract(points[0]).dot(normal);

				collision = d1 > -1 && d2 < 1
				collided = false;

				if (collision)
				{
					vec = point.subtract(points[0]);
					projected = vec.project(normal);
					line = points[1].subtract(points[0]);
					onLine = vec.project(line);

					if (line.dot(vec) > 0 && onLine.length() < line.length())
					{
						collided = true;
					}

					if (collided == true)
					{
						var v = this._velocity.dot(normal);
						var vn = new Vector2D(normal.x * v, normal.y * v);
						var vt = this._velocity.subtract(vn)
						var x = vt.x * this._friction + vn.x;
						var y = vt.y * this._friction + vn.y;

						if (this._pos.y + y < this._pos.y)
						{
							this._jump = false;
						}

						this._velocity.x -= x * this._slopeOffset;
						this._velocity.y -= y * this._slopeOffset;

						break;
					}
				}
			}
		}
	}

	this.setPos = function(x, y)
	{
		this._pos.x = x;
		this._pos.y = y;
	}

	this.update = function(dt, walls)
	{
		this._updateMovement(dt);
		this._checkWallCollision(dt, walls);
		this._endMovement(dt);
	}

	this.initialise();
}