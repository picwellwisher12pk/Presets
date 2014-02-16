//
// Copyright 2006-2007 Adobe Systems, Incorporated.  All Rights Reserved.
//

/*
@@@BUILDINFO@@@ Geometry.jsx 1.0.0.0
*/
//
// Geometry definitions, based on PMGeometry.h
//

function className( thing )
{
    if ((typeof(thing) == "object") && (typeof(thing.className) != "undefined"))
		return thing.className;
    else
		return typeof(thing);
}

//
// =================================== TPoint ===================================
//

function TPoint( x, y )
{
    this.fX = x;
    this.fY = y;
}

// TPoint Constants
const kTPointOrigion = new TPoint( 0, 0 );
TPoint.kOrigin = kTPointOrigion;

const kTPointInfinite = new TPoint( Infinity, Infinity );
TPoint.kInfinite = kTPointInfinite;

const kTPointClassname = "TPoint";
TPoint.prototype.className = kTPointClassname;

// Overloaded math operators
TPoint.prototype["=="] = function( Src )
{
	return (this.fX == Src.fX) && (this.fY == Src.fY);
}

TPoint.prototype["+"] = function( b )
{
	return new TPoint( this.fX + b.fX, this.fY + b.fY );
}

TPoint.prototype["-"] = function( b, reversed )
{
	if (typeof(b) == "undefined")		// unary minus
		return new TPoint( -this.fX, -this.fY )
	else
	{
		if (reversed)
			return new TPoint( b.fX - this.fX, by.fY - this.fY );
		else
			return new TPoint( this.fX - b.fX, this.fY - b.fY);
	}
}

//
// Multiply and divide work with scalars as well as points
//
TPoint.prototype["*"] = function( b )
{
    if (typeof(b) == 'number')
		return new TPoint( this.fX * b, this.fY * b );
	else
		return new TPoint( this.fX * b.fX, this.fY * b.fY );
}

TPoint.prototype["/"] = function( b, reversed )
{
	if (reversed)
	{
		if (typeof(b) == "number")
			debugger;	// Can't divide a number by a point
		else
			return new TPoint( b.fX / this.fX, b.fY / this.fY );
	}
	else
	{
		if (typeof(b) == 'number')
			return new TPoint( this.fX / b, this.fY / b );
		else
			return new TPoint( this.fX / b.fX, this.fY / b.fY );
	}
}

TPoint.prototype.toString = function()
{
	return "[" + this.fX.toString() + "," + this.fY.toString() + "]";
}

TPoint.prototype.vectorLength = function()
{
    return Math.sqrt( this.fX * this.fX + this.fY * this.fY );
}

// Return normalized vector
TPoint.prototype.normalize = function()
{
    var vecLen = this.vectorLength();
    if (vecLen == 0.0)
        return new TPoint( 0.0, 0.0 );
    else
        return new TPoint( this.fX / vecLen, this.fY / vecLen );
}

// Return the angle between the vector from the origin to this and the X axis
TPoint.prototype.vectorAngle = function() 
{
	var offset = 0.0;
	
	if (this.fX == 0.0)
	{
		if (this.fY == 0.0)
			return 0.0;
		if (this.fY > 0.0)
			return Math.PI / 2.0;
		else
			return 3 * (Math.PI/2);
	}
	else
	{
		if ((this.fX > 0.0) && (this.fY < 0.0))
			offset = 2*Math.PI;
		else
			if (this.fX < 0.0)
				offset = Math.PI;
		return Math.atan( this.fY / this.fX ) + offset;
	}
}

// Rotate point around angle (in radians) and return the rotated point.
TPoint.prototype.rotate = function( angle )
{
	var ca = Math.cos(angle);
	var sa = Math.sin(angle);
	
	var nx = this.fX * ca - this.fY * sa;
	var ny = this.fY * ca + this.fX * sa;
    return new TPoint( nx, ny );
}

//
// Test to see if the point is in the quadrilateral (or any convex polygon)
// defined by four points by checking to see if it's on the same side of
// the four edges.  Assumes points are in clockwise (or counterclockwise)
// order.  This is from the classic "10 Algorithms" paper by Sutherland, 
// et al.
//
TPoint.prototype.pointInQuad = function( pts )
{
	var i = 0, j;

	var inside = true;
	var whichSide;
	while ((i < pts.length) && inside)
	{
		j = (i == pts.length-1) ? 0 : i + 1;
		var A = (this.fX - pts[j].fX) * (pts[i].fY - pts[j].fY);
		var B = (this.fY - pts[j].fY) * (pts[i].fX - pts[j].fX);

		if (i == 0)
			whichSide = (A > B);
		else
			inside = (whichSide == (A > B));
		i++;
	}
	return inside;
}

// Report what "side" of the line p0, p1 the point is on.
TPoint.prototype.sideOf = function( p0, p1 )
{
	var dist = this.distanceToLine( p0, p1 );
	if (dist == 0.0) return 0;
	if (dist < 0.0) return -1;
	return 1;
}

//
// Compute the distance from "this" to the line defined by p0, p1
//
TPoint.prototype.distanceToLine = function( p0, p1 )
{
	var fBase = p0;
	var fDirection = p1 - p0;

	var other_base = this;
	var other_dir = new TPoint( -fDirection.fY, fDirection.fX );
	
	// Find point where line perpendicular to p0p1 through this intersects p0p1
	var online = TPoint.lineSegmentIntersect( fBase, fDirection + fBase, 
													 other_base, other_dir + other_base, false );
	var fromDir = this - online;
	var dist = fromDir.vectorLength();

	// Determine the sign by comparing the vector signs between the
	// point and the line and the line's perpendicular vector.

	if (Math.abs( fromDir.fX ) > Math.abs( fromDir.fY ))
		return (fromDir.fX * fDirection.fY <= 0.0) ? dist : -dist;
	else
		return (fromDir.fY * fDirection.fX > 0.0) ? dist : -dist;
};

// Find where (parametrically) test falls on the
// segment p10 p11.  If it's beyond 0..1, there's no hit
TPoint.prototype.pointInSeg = function( p0, p1 )
{
	// Find two vectors, p0p1 & p0test
	var v0 = p1 - p0;
	var vm = this - p0;

	// Ratio of dot prodcuts gives the projection of vm onto v0
	var t, denom = v0.fX * v0.fX + v0.fY * v0.fY;
	if (denom == 0.0)
		// First line seg zero length...
		return (this == p0);
	else
		t = (v0.fX * vm.fX + v0.fY * vm.fY ) / denom;

	return ((t >= 0.0) && (t <= 1.0));
}


// Class static methods

// Find where line segment (p10 p11) intersects (p20 p21).
// Returns [INF, INF] if no intersection (lines parallel)
TPoint.lineSegmentIntersect = function( p10, p11, p20, p21, checkEndpoints )
{
	var A1, B1, C1, A2, B2, C2;	// Line equations
	var tmp;
	var cross = new TPoint( Infinity, Infinity );
	
	if (typeof(checkEndpoints) == "undefined")
		checkEndpoints = true;

	// Generate the line equations (Ax+By=C) of the
	// vectors Perpendicular to center->endpoint lines.
	
	A1 = p10.fY - p11.fY;
	B1 = p11.fX - p10.fX;
	C1 = A1 * p10.fX + B1 * p10.fY;
	
	A2 = p20.fY - p21.fY;
	B2 = p21.fX - p20.fX;
	C2 = A2 * p20.fX + B2 * p20.fY;
	
	// Find the intersection of above two lines by solving:
	//	[A1 B1] [x] = [C1]
	//	[A2 B2] [y] = [C2]
	
	tmp = A1 * B2 - B1 * A2;
	if (tmp == 0.0)		// Parallel
		return cross;
	else
	{
		cross.fX = (B2 * C1 - B1 * C2) / tmp;
		cross.fY = (A1 * C2 - A2 * C1) / tmp;
	}

	if (!checkEndpoints
		|| (cross.pointInSeg( p10, p11 ) && cross.pointInSeg( p20, p21 )))
		return cross;
	else
		return new TPoint( Infinity, Infinity );
}

// Clip the line segment defined by p0, p1 to rect (note the segment may be extended
// as well).  Returns false of the line misses the rect

TPoint.clipLineToRect = function( rect, p0, p1 )
{
	var fBase = p0;
	var fDirection = p1 - p0;
	
	var leftPt, topPt, rightPt, bottomPt;
	var inPts = new Array();
	var incount = 0;
	
	function evaluateAtX( x )
	{
		if (fDirection.fX == 0.0)	// no Y intercept...
		{
			if (x == fBase.fX)
				return new TPoint( x, Infinity );
			else
				return new TPoint( Infinity, Infinity );
		}
		else
			return new TPoint( x, (fDirection.fY / fDirection.fX) * (x - fBase.fX) + fBase.fY );
	}
	
	function evaluateAtY( y )
	{
		if (fDirection.fY == 0.0)	// no X intercept...
		{
			if (y == fBase.fY)
				return new TPoint( Infinity, y );
			else
				return new TPoint( Infinity, Infinity );
		}
		else
			return new TPoint( (fDirection.fX / fDirection.fY) * (y - fBase.fY) + fBase.fX, y );
	}

	// If line has no direction, just use the base point
	if (fDirection == TPoint.kOrigin)
	{
		if (rect.contains( fBase ))
		{
			p0 = fBase;
			p1 = fBase;
			return true;
		}
		else
			return true;		// "Line" is outside of rectangle
	}

	// Find the intercepts of the rectangle on the line
	
	leftPt = evaluateAtX( rect.fLeft );
	if ((leftPt.fY >= rect.fTop) && (leftPt.fY <= rect.fBottom))
		inPts[incount++] = leftPt;

	topPt = evaluateAtY( rect.fTop );
	if ((topPt.fX >= rect.fLeft) && (topPt.fX <= rect.fRight))
		inPts[incount++] = topPt;

	rightPt = evaluateAtX( rect.fRight );
	if ((rightPt.fY >= rect.fTop) && (rightPt.fY <= rect.fBottom))
		inPts[incount++] = rightPt;

	bottomPt = evaluateAtY( rect.fBottom );
	if ((bottomPt.fX >= rect.fLeft) && (bottomPt.fX <= rect.fRight))
		inPts[incount++] = bottomPt;

	if (incount == 0)
		return false;			// Non intersection leaves line unmodified

	$.bp( incount == 1);		// This would be weird...

	p0 = inPts[0];
	if (incount == 2)			// Normal case
		p1 = inPts[1];
	else						// If line hits a corner, find two unique points
	{
		var i;
		for (i = 1; (i < incount) && (inPts[i] == p0); i++) {};
		$.bp( i >= incount );
		p1 = inPts[i];
	}

	return true;
}

// Find the area of a convex polygon.  Always returns
// positive value, so the order (counter/clockwise) doesn't matter.
// From Mathworld: http://mathworld.wolfram.com/PolygonArea.html
TPoint.polygonArea = function( pts )
{
	var i, sum = 0;
	var n = pts.length-1;
	for (i = 0; i < n; ++i)
		sum += pts[i].fX*pts[i+1].fY - pts[i+1].fX * pts[i].fY;
	sum += pts[n].fX*pts[1].fY - pts[1].fX * pts[n].fY;
	return Math.abs(sum) * 0.5;
}

//
// =================================== TRect ===================================
//

function TRect( leftTop, rightBottom )
{
    // Four arguments are assumed to be left top right bottom
    if (arguments.length == 4)
    {
		this.fLeft = arguments[0];
		this.fTop = arguments[1];
		this.fRight = arguments[2];
		this.fBottom = arguments[3];
    }
    else
    // One argument is assumed to be a list of points; the bounds is returned
    if ((arguments.length == 1))
    {
		this.setToBoundsOf( arguments[0] );
    }
    else
    {
		this.fLeft = leftTop.fX;
		this.fTop = leftTop.fY;
		this.fRight = rightBottom.fX;
		this.fBottom = rightBottom.fY;
    }
}

// TRect constants

const kZeroRectData = new TRect( 0, 0, 0, 0 );
TRect.kZeroRect = kZeroRectData;

const kInfiniteRectdata = new TRect( -Infinity, -Infinity, Infinity, Infinity );
TRect.kInfiniteRect = kInfiniteRectdata;

const kRectClassname = "TRect"
TRect.prototype.className = kRectClassname;

// Data access

TRect.prototype.getTopLeft = function()
{
	return new TPoint( this.fLeft, this.fTop );
}

TRect.prototype.getBottomRight = function()
{
	return new TPoint( this.fRight, this.fBottom );
}

TRect.prototype.getBottomLeft = function()
{
	return new TPoint(this.fLeft, this.fBottom);
}

TRect.prototype.getTopRight = function()
{
	return new TPoint(this.fRight, this.fTop);
}

// Return the four corner points of the rectangle as an array of points
TRect.prototype.getCornerPoints = function()
{
    return [this.getTopLeft(), this.getTopRight(), this.getBottomRight(), this.getBottomLeft()];
}

// Returns true if (fRight > fLeft) && (fBottom > fTop)
TRect.prototype.isEmpty = function()
{
	return  (this.fLeft >= this.fRight) || (this.fTop >= this.fBottom);
}

// Returns true if no coordinates are infinite and left/right and top/bottom aren't crossed.
TRect.prototype.isValid = function()
{
	if ((this.fLeft == Infinity) || (this.fRight == Infinity)
		|| (this.fTop == Infinity) || (this.fBottom == Infinity))
		return false;
		
	return (this.fLeft <= this.fRight) && (this.fTop <= this.fBottom);
}

TRect.prototype.getSize = function()
{
	return new TPoint( this.fRight-this.fLeft, this.fBottom-this.fTop );
}

TRect.prototype.getWidth = function()
{
	return this.fRight - this.fLeft;
}

TRect.prototype.getHeight = function()
{
	return this.fBottom-this.fTop;
}

TRect.prototype.getArea = function()
{
	return this.getWidth() * this.getHeight();
}

TRect.prototype.contains = function( geometry )
{
	if (className( geometry ) == "TPoint")	// Check for point
	{
		var p = geometry;				
		return ((p.fX >= this.fLeft) &&
				(p.fX < this.fRight) &&
				(p.fY >= this.fTop) &&
				(p.fY < this.fBottom));
	}
	else
	{
		var r = geometry;							// Assume rect instead
		return ((r.fLeft >= this.fLeft) &&
				(r.fRight <= this.fRight) &&
				(r.fTop >= this.fTop) &&
				(r.fBottom <= this.fBottom));
	}
}

// Modifiers

TRect.prototype.setToPoint = function( point )
{
	this.fLeft = point.fX;
	this.fTop = point.fY;
	this.fRight = point.fX;;
	this.fBottom = point.fY;
}

TRect.prototype.setTopLeft = function( point )
{
	this.fLeft = point.fX;
	this.fTop = point.fY;
}

TRect.prototype.setTopRight = function( point )
{
	this.fRight = point.fX;
	this.fTop = point.fY;
}

TRect.prototype.setBottomRight = function( point )
{
	this.fRight = point.fX;;
	this.fBottom = point.fY;
}

TRect.prototype.setBottomLeft = function( point )
{
	this.fLeft = point.fX;;
	this.fBottom = point.fY;
}

TRect.prototype.setSize = function( size )
{
	this.fRight  = this.fLeft + size.fX;
	this.fBottom = this.fTop + size.fY;
}

TRect.prototype.setCenter = function( center )
{
	var delta = center - this.getCenter();
	this.fLeft += delta.fX;
	this.fRight += delta.fX;
	
	this.fTop += delta.fY;
	this.fBottom += delta.fY;
}

TRect.prototype.setToBoundsOf = function( pointList )
{
	this.fLeft = pointList[0].fX;
	this.fTop = pointList[0].fY;
	this.fRight = this.fLeft;
	this.fBottom = this.fTop;

	var i;
	for (i = 1; i < pointList.length; i++)
		this.extendTo( pointList[i] );
}

TRect.prototype.extendTo = function( geometry )
{
	// Check incoming geometry for type...
	if (className(geometry) == "TPoint")
	{
		var p = geometry;
		if (p.fX < this.fLeft) this.fLeft = p.fX;
		if (p.fY < this.fTop) this.fTop = p.fY;
		if (p.fX > this.fRight) this.fRight = p.fX;
		if (p.fY > this.fBottom) this.fBottom = p.fY;
	}
	else	// Not point, assume rectangle
	{
		var r = geometry;
		if (this.isEmpty())
		{
			this.fTop = r.fTop;
			this.fLeft = r.fLeft;
			this.fRight = r.fRight;
			this.fBottom = r.fBottom;
		}
		else
		{
			if (! r.isEmpty())
			{
				if (r.fLeft < this.fLeft) this.fLeft = r.fLeft;
				if (r.fTop < this.fTop) this.fTop = r.fTop;
				if (r.fRight > this.fRight) this.fRight = r.fRight;
				if (r.fBottom > this.fBottom) this.fBottom = r.fBottom;
			}
		}
	}	
}

TRect.prototype.intersectWith = function( r )
{
	if (this.isEmpty() || r.isEmpty())
	{
		this.fLeft = this.fRight;
		this.fTop = this.fBottom;
	}
	else
	{
		if (r.fLeft > this.fLeft) this.fLeft = r.fLeft;
		if (r.fTop > this.fTop) this.fTop = r.fTop;
		if (r.fRight < this.fRight) this.fRight = r.fRight;
		if (r.fBottom < this.fBottom) this.fBottom = r.fBottom;
		// If the two don't overlap, avoid an invalid rect
		if (this.fRight < this.fLeft)
			this.fLeft = this.fRight;
		if (this.fBottom < this.fTop)
			this.fTop = this.fBottom;
	}
}

// "static" class member.  Returns a new, distinct rectangle.
TRect.intersection = function( a, b )
{
	var x = new TRect( a.fLeft, a.fTop, a.fRight, a.fBottom );
	x.intersectWith( b );
	return x;
}

TRect.prototype.intersects = function( r )
{
	var result;
	if (this.isEmpty())
		result = false;
	else if (r.isEmpty())
		result = false;
	else
		result =  ( (this.fLeft < r.fRight) && (this.fRight > r.fLeft) &&
		(this.fTop < r.fBottom) && (this.fBottom > r.fTop) );
	return result;
}

TRect.prototype.getCenter = function()
{
	return new TPoint( (this.fLeft + this.fRight) * 0.5,
					   (this.fTop + this.fBottom) * 0.5 );
}

TRect.prototype.equalSize = function( r )
{
	return ( ((this.fRight - this.fLeft) == (r.fRight - r.fLeft)) &&
			((this.fBottom - this.fTop) == (r.fBottom - r.fTop)) );
}

TRect.prototype.offset = function( dg )
{
	this.fLeft += dg.fX;
	this.fTop += dg.fY;
	this.fRight += dg.fX;
	this.fBottom += dg.fY;
}

TRect.prototype.inset = function( inset )
{
	this.fLeft += inset.fX;
	this.fTop += inset.fY;
	this.fRight -= inset.fX;
	this.fBottom -= inset.fY;
}

TRect.prototype.pin = function( pt )
{
	if (this.fLeft > this.fRight) pt.fX = (this.fLeft + this.fRight) / 2;
	else if (pt.fX < this.fLeft) pt.fX = this.fLeft;
	else if (pt.fX > this.fRight) pt.fX = this.fRight;

	if (this.fTop > this.fBottom) pt.fY = (this.fTop + this.fBottom) / 2;
	else if (pt.fY < this.fTop) pt.fY = this.fTop;
	else if (pt.fY > this.fBottom) pt.fY = this.fBottom;
}

// Takes the r's size and position relative to the object's rectangle and
// maps it to the same size and position (proportionally) to the dest
// rectangle.  If the source rectangle has a height or width of zero
// the rectangle r  will have a corresponding infinite height or width.
TRect.prototype.mapRect = function( r, dest )
{
	var victLT = new TPoint( r.fLeft, r.fTop );
	var victRB = new TPoint( r.fRight, r.fBottom );
	var srcLT = new TPoint( this.fLeft, this.fTop );
	var srcRB = new TPoint( this.fRight, this.fBottom );
	var destLT = new TPoint( dest.fLeft, dest.fTop );
	var destRB = new TPoint( dest.fRight, dest.fBottom );
	
	victLT -= srcLT;
	victRB -= srcLT;
	
	// bk bug fix - we need to use floating, rather than integer, arithmetic for scaling to work correctly.
//	TPoint scale = (destRB - destLT) / (srcRB - srcLT);
//	victLT *= scale;
//	victRB *= scale;

	var x_scale = (destRB.fX - destLT.fX) / (srcRB.fX - srcLT.fX);
	var y_scale = (destRB.fY - destLT.fY) / (srcRB.fY - srcLT.fY);
	victLT.fX = (victLT.fX * x_scale);
	victLT.fY = (victLT.fY * y_scale);
	victRB.fX = (victRB.fX * x_scale);
	victRB.fY = (victRB.fY * y_scale);
	
	victLT += destLT;
	victRB += destLT;
	
	return new TRect( victLT, victRB );
}

TRect.prototype.mapPoint = function( pt, dest )
{
	var srcLT = new TPoint( this.fLeft, this.fTop );
	var srcRB = new TPoint( this.fRight, this.fBottom );
	var destLT = new TPoint( dest.fLeft, dest.fTop );
	var destRB = new TPoint( dest.fRight, dest.fBottom );
	
	pt -= srcLT;

	var x_scale = (destRB.fX - destLT.fX) / (srcRB.fX - srcLT.fX);
	var y_scale = (destRB.fY - destLT.fY) / (srcRB.fY - srcLT.fY);
	pt.fX = (pt.fX * x_scale);
	pt.fY = (pt.fY * y_scale);
	
	pt += destLT;
	return pt;
}

TRect.prototype.orderPoints = function()
{
	if (this.fLeft > this.fRight)
	{
		var tmp = this.fRight;
		this.fRight = this.fLeft;
		this.fLeft = tmp;
	}
	if (this.fTop > this.fBottom)
	{
		var tmp = this.fTop;
		this.fTop = this.fBottom;
		this.fBottom = tmp;
	}
}

TRect.prototype["=="] = function( src ) 
{
	if (this.fLeft != src.fLeft) return false;
	if (this.fTop != src.fTop) return false;
	if (this.fRight != src.fRight) return false;
	if (this.fBottom != src.fBottom) return false;
	return true;
}

TRect.prototype.toString = function()
{
	return "[" + this.fLeft.toString() + "," + this.fTop.toString()
		+ "," + this.fRight.toString() + "," + this.fBottom.toString() + "]";
}

// DEBUG
//aa = new TPoint(2,3);
//bb = new TPoint(7,7);
//r = new TRect(0,0,2,2);

//t0 = new TPoint(2,7);
//t1 = new TPoint(6,3);
//p0 = new TPoint(2,3);
//p1 = new TPoint(6,7);
