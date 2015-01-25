var Wall = function(x1, y1, x2, y2)
{
	this._p1 = new Vector2D(x1, y1);
	this._p2 = new Vector2D(x2, y2);

	var p = this._p1.subtract(this._p2);
	this._normal = p.normalise().rightHandNormal();

	this.points = function()
	{
		return [this._p1, this._p2];
	}

	this.normal = function()
	{
		return this._normal;
	}

	this.debugDraw = function(dt)
	{
		var pos = this._p2.subtract(this._p1);
		var x = this._p1.x + pos.x / 2;
		var y = this._p1.y + pos.y / 2;

		Line.draw(x, y, 0, 1,0,0, x + this._normal.x*20, y + this._normal.y*20, 0, 1,0,0);
		Line.draw(this._p1.x, this._p1.y, 0, 0, 0, 1, this._p2.x, this._p2.y, 0, 0, 0, 1);
	}
}