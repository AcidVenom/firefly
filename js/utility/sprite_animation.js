var SpriteAnimation = function(element, frames)
{
	this._frames = frames;
	this._element = element;
	this._playing = false;
	this._timer = 1;
	this._speed = 1;
	this._currentFrame = 0;
	this._loop = false;
	this._wasPlaying = false;

	this._callbacks = {
		started: function(){},
		ended: function(){}
	}

	this.start = function()
	{
		this._playing = true;
	}

	this.stop = function()
	{
		this._playing = false;
		this._wasPlaying = false;
		this._currentFrame = 0;
	}

	this.pause = function()
	{
		this._playing = false;
	}

	this.isPlaying = function()
	{
		return this._playing;
	}

	this.setSpeed = function(speed)
	{
		this._speed = speed;
	}

	this.setFrame = function(frame)
	{
		this._currentFrame = frame;
	}

	this.setToFrame = function(index)
	{
		var frame = this._frames[index];

		var textureMetrics = this._element.textureMetrics();

		var width = frame.width / textureMetrics.width;
		var height = frame.height / textureMetrics.height;

		var offsetX = frame.x / textureMetrics.width;
		var offsetY = frame.y / textureMetrics.height;

		if (frame.event !== undefined)
		{
			frame.event();
		}

		this._element.setUniform("float4", "AnimationMetrics", offsetX, offsetY, width, height);
		this._element.setSize(frame.width, frame.height);
	}

	this.setLoop = function(loop)
	{
		this._loop = loop;
	}

	this.on = function(type, func)
	{
		this._callbacks[type] = func;
	}

	this.update = function(dt)
	{
		if (this._playing == false)
		{
			return;
		}
		else
		{
			if (this._wasPlaying == false)
			{
				this._callbacks["started"]();
				this.setToFrame(0);
				this._wasPlaying = true;
			}
		}

		if (this._timer < 1)
		{
			this._timer += dt*this._speed;
		}
		else
		{
			this.setToFrame(this._currentFrame);
			this._timer = 0;
			++this._currentFrame;

			if (this._currentFrame >= this._frames.length)
			{
				this._callbacks["ended"]();

				if (this._loop == true)
				{
					this._currentFrame = 0;
					this._callbacks["started"]();
				}
				else
				{
					this.stop();
					return;
				}
			}
		}
	}
}