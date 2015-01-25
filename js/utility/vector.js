var Vector2D = function(x, y)
{
	this.x = x;
	this.y = y;

	this.dot = function(other)
	{
		return (this.x * other.x) + (this.y * other.y);
	}

	this.length = function()
	{
		var x = this.x
		var y = this.y
		return Math.sqrt(x * x + y * y);
	}

	this.normalise = function()
	{
		var l = this.length();
		return new Vector2D(this.x / l, this.y / l);
	}

	this.project = function(other)
	{
		var d = this.dot(other);
		var x = other.x
		var y = other.y
		var v = x * x + y * y
		return new Vector2D(d / v * x, d / v * y)
	}

	this.rightHandNormal = function()
	{
		return new Vector2D(-this.y, this.x);
	}

	this.leftHandNormal = function()
	{
		return new Vector2D(this.y, -this.x);
	}

	this.add = function(other)
	{
		return new Vector2D(this.x + other.x, this.y + other.y);
	}

	this.subtract = function(other)
	{
		return new Vector2D(this.x - other.x, this.y - other.y);
	}

	this.multiply = function(other)
	{
		return new Vector2D(this.x * other.x, this.y * other.y);
	}

	this.divide = function(other)
	{
		return new Vector2D(this.x / other.x, this.y / other.y);
	}
}