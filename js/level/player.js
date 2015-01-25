var Player = function()
{
	this._pos = new Vector2D(0, 0);

	this._points = [
		new Vector2D(-10, -10),
		new Vector2D(10, -10),
		new Vector2D(-5, 0),
		new Vector2D(5, 0),
		new Vector2D(0, 0),
		new Vector2D(-10, -64),
		new Vector2D(10, -64)
	]
	this._origin = {
		x: 0.5,
		y: 0.85
	}

	this._velocity = new Vector2D(0, 0);

	this._gravity = 1500;
	this._maxVelocity = 500;
	this._jumpHeight = 500;
	this._friction = 0;
	this._slopeOffset = 10;

	this._jump = false;

	this._moveSpeed = {
		acceleration: 600,
		maxSpeed: 200
	}

	this.initialise = function()
	{
		this._quad = Quad2D.new();

		extend(this, this._quad);

		this.setTexture("textures/character/character.png");
		this.setToTexture();
		this.setOffset(this._origin.x, this._origin.y);
		this.spawn("Default");

		this._eyes = Quad2D.new();
		this._eyes.setTexture("textures/character/character_eyes.png");
		this._eyes.setToTexture();
		this._eyes.setOffset(this._origin.x, this._origin.y);
		this._eyes.spawn("Default");
	}

	this._updateMovement = function(dt)
	{
		if (Keyboard.isDown("Right"))
		{
			this._velocity.x += this._moveSpeed.acceleration * dt;

			if (this._velocity.x > this._moveSpeed.maxSpeed)
			{
				this._velocity.x = this._moveSpeed.maxSpeed;
			}
		}

		if (Keyboard.isDown("Left"))
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


		this.setTranslation(this._pos.x, this._pos.y, 0);
		this._eyes.setTranslation(this._pos.x, this._pos.y, 1);

		if (!Keyboard.isDown("Left") && !Keyboard.isDown("Right"))
		{
			this._velocity.x /= 5;
		}

		if (Keyboard.isDown("Up"))
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

						this._velocity.x -= x;
						this._velocity.y -= y + this._slopeOffset;

						break;
					}
				}
			}
		}
	}

	this.update = function(dt, walls)
	{
		this._updateMovement(dt);
		this._checkWallCollision(dt, walls);
		this._endMovement(dt);
	}

	this.initialise();
}