// (c) Copyright 2006-2007.  Adobe Systems, Incorporated.  All rights reserved.

//
// Photomerge in ExtendScript.
// Translated from the original C++ automation & filter plugins
//
// John Peterson, Adobe Systems, 2006
//
// Adobe Patent or Adobe Patent Pending Invention Included Within this File


/*
@@@BUILDINFO@@@ Photomerge.jsx 3.0.0.2
*/

/*
// BEGIN__HARVEST_EXCEPTION_ZSTRING

<javascriptresource>
<name>$$$/JavaScripts/Photomerge/Menu=Photomerge...</name>
<menu>automate</menu>
</javascriptresource>

// END__HARVEST_EXCEPTION_ZSTRING
*/

// on localized builds we pull the $$$/Strings from a .dat file
$.localize = true;

// Put header files in a "Stack Scripts Only" folder.  The "...Only" tells
// PS not to place it in the menu.  For that reason, we do -not- localize that
// portion of the folder name.
var g_StackScriptFolderPath = app.path + "/"+ localize("$$$/ScriptingSupport/InstalledScripts=Presets/Scripts") + "/"
										+ localize("$$$/private/Exposuremerge/StackScriptOnly=Stack Scripts Only/");

$.evalFile(g_StackScriptFolderPath + "LatteUI.jsx");

$.evalFile(g_StackScriptFolderPath + "StackSupport.jsx");

$.evalFile(g_StackScriptFolderPath + "CreateImageStack.jsx");

$.evalFile(g_StackScriptFolderPath + "Geometry.jsx");

$.evalFile(g_StackScriptFolderPath + "PolyClip.jsx");

// debug level: 0-2 (0:disable, 1:break on error, 2:break at beginning)
// Must leave at zero, otherwise trapping gFileFromBridge fails on QA's debug builds.
$.level = 0; // (Window.version.search("d") != -1) ? 1 : 0;
// debugger; // launch debugger on next line

if (typeof(PMDebug) == 'undefined')
	var PMDebug = false;

/************************************************************/
// photomerge routines

// Debug - write the trapezoid in Matlab format
function dumpTrap( name, corners )
{
	var i;
	if (! PMDebug) return;
	$.write( name + "= [" );
	for (i in corners)
		$.write( ((i > 0) ? "; " : "" ) + corners[i].fX + " " + corners[i].fY );
	$.writeln( "];");
}

StackElement.prototype.dumpMLCorners = function()
{
	// Weed out file suffix (chokes matlab)
	dumpTrap( this.fName.match(/([^.]+)/)[1], this.fCorners );
}

// Set the fCorners of the layer to the bounds of the Photoshop layer.
StackElement.prototype.setCornersToLayerBounds = function( stackDoc )
{
	if (typeof(stackDoc) == "undefined")
		stackDoc = app.activeDocument;
		
	var bounds = stackDoc.layers[this.fName].bounds;
	this.fCorners = new Array();
	this.fCorners[0] = new TPoint( bounds[0].as("px"), bounds[1].as("px") );
	this.fCorners[2] = new TPoint( bounds[2].as("px"), bounds[3].as("px") );
	
	this.fCorners[1] = new TPoint( this.fCorners[2].fX, this.fCorners[0].fY );
	this.fCorners[3] = new TPoint( this.fCorners[0].fX, this.fCorners[2].fY );
}
	

// Add the corner data to the string of per-stackElement information
// that gets passed to the filter plugin
StackElement.prototype.addPieceData = function()
{
	if (typeof(this.fCorners) != "undefined")
	{
		// Add corners in place of trailing '\n'
		this.fString = this.fString.slice(0,-1) + "fCorners=";
		for (j = 0; j < 4; j++)
			this.fString += " " + this.fCorners[j].fX.toString() + " " + this.fCorners[j].fY.toString();
		this.fString += "\t";
		
		if (typeof(this.fScale) != "undefined")
			this.fString += ("fScale=" + this.fScale.toString() + "\t");
			
		if ((typeof(this.fConnectedTo) != "undefined") && this.fConnectedTo)
			this.fString += "fConnectedTo=" + this.fConnectedTo.fLayerID + "\t";
			
		if (typeof(this.fLayerID) != "undefined")
			this.fString += "fLayerID=" + this.fLayerID.toString() + "\t";
			
		this.fString += "\n";
	}
	else
		debugger;	// Corner data missing!
}

StackElement.prototype.overlapArea = function( other )
{
	if (other == this)
		return TPoint.polygonArea( this.fCorners );

	var overlapBounds = TRect.intersection( this.fBoundsCache, other.fBoundsCache );
	if (overlapBounds.isEmpty())
		return 0.0;

	var clipPoly = TPoint.intersectConvexPolygons( this.fCorners, other.fCorners );
	if (! clipPoly)
		return 0.0;
	else return TPoint.polygonArea( clipPoly );
}

// Find the points where the two quadrilaterals intersect (yes, eight is a theoretical max)
// Note situations where one piece intersects the same edge twice - special
// case handled by SoftEdgeBlend
StackElement.prototype.findQuadIntersections = function( other, intersections )
{
	var i, j;
	var curIntersections, numIntersections = 0;

	var innerEdgeIntersections = [ 0, 0, 0, 0 ];
	var outerEdgeIntersections = [ 0, 0, 0, 0 ];
	var thisEdge = false;
	var otherEdge = false;

	for (i = 0; i < 4; i++)
	{
		var eb0 = other.fCorners[i];
		var eb1 = other.fCorners[(i + 1) > 3 ? 0 : i + 1];
		curIntersections = numIntersections;
		for (j = 0; j < 4; j++)
		{
			var ed0 = this.fCorners[j];
			var ed1 = this.fCorners[(j + 1) > 3 ? 0 : j + 1];
			var cross = TPoint.lineSegmentIntersect( eb0, eb1, ed0, ed1 );
			
			if (cross != TPoint.kInfinite)
			{
				intersections[numIntersections++] = cross;
				innerEdgeIntersections[j]++;
			}
		}
		outerEdgeIntersections[i] = numIntersections - curIntersections;
	}

	if (numIntersections == 2)
		for (i = 0; i < 4; i++)
		{
			if (innerEdgeIntersections[i] == 2) thisEdge = true;
			if (outerEdgeIntersections[i] == 2) otherEdge = true;
		}
	
	return {"numIntersections":numIntersections, "thisEdge":thisEdge, "otherEdge":otherEdge};
}

// Look for a point of this that's inside the corners of other.

StackElement.prototype.findSingleInsidePoint = function( other )
{
	var i;
	var result = new Object();
	result.numFound = 0;
	for (i = 0; i < 4; i++)
		if (this.fCorners[i].pointInQuad( other.fCorners ))
		{
			result.numFound++;
			result.insidePt = this.fCorners[i];
		}
	return result;
}

// "Adobe patent application tracking # B349, entitled 'Method and apparatus for Layer-based Panorama Adjustment and Editing', inventor: John Peterson"
//
// Because we're dealing with quads, we can't use the simple scheme
// to generate blend rects that the rectangles use - black stuff
// from the rects will seep in. So instead, we use various heuristics to
// figure out how the quads themselves intersect.  This isn't too hard
// when there's just two intersection points (usual case), but there are
// some pathological cases where there are many more intersections (the octogon
// from one square 45 deg. off from another is the classic example).			

StackElement.prototype.softEdgeBlend = function( other, blendRad )
{
	var i, j;
	var intersections = new Array();	// Worst case is a square inside a 45 degree rot square

	// If there's no distortion, do the blend strictly on the rectangles
/*	if ((!IsQuadMapped() && !other->IsQuadMapped())
		|| (IsRectilinear() && other->IsRectilinear()))
	{
		Assert_( other->fWarpedRaster );
		fWarpedRaster->SoftEdgeBlendRasters( *(other->fWarpedRaster), blendRad );
		return;
	}
*/
	var bounds = this.getBounds();

	// Find the points where the two quadrilaterals intersect
	var intResult = this.findQuadIntersections( other, intersections );
	var numIntersections = intResult.numIntersections;
	var thisEdgeTwice = intResult.thisEdge;
	var otherEdgeTwice = intResult.otherEdge;
	
	var thisInsidePt = this.findSingleInsidePoint( other );
	var otherInsidePt = other.findSingleInsidePoint( this );

	// If quads don't overlap, just bail
	if (numIntersections == 0)
		return;

	// Handle cases where just one point overlaps the other piece
	
	var insidePoint;
	if (otherEdgeTwice || ((numIntersections == 2) && (thisInsidePt.numFound == 1)))
	{
		insidePoint = thisInsidePt.insidePt;
		this.makeBlendTrapezoid( intersections[0], intersections[1], insidePoint, blendRad, false );
		return;
	}
	if (thisEdgeTwice /*|| ((numIntersections == 2) && (otherInsidePt.numFound == 1))*/)
	{
		insidePoint = otherInsidePt.insidePt;
		this.makeBlendTrapezoid( intersections[0], intersections[1], insidePoint, blendRad, false );
		return;
	}

	// ...More than two corners overlap, apply heuristics to find reasonable blending 
	$.bp( numIntersections > 8 );

	// If we got more than two points, pick the two furthest apart
	if (numIntersections > 2)
	{
		var max0, max1;
		var maxDist = -1.0;

		for (i = 0; i < numIntersections - 1; i++)
			for (j = i + 1; j < numIntersections; j++)
			{
				var dist = (intersections[i] - intersections[j]).vectorLength();
				if (dist > maxDist)
				{
					max0 = intersections[i];
					max1 = intersections[j];
					maxDist = dist;
				}
			}

		$.bp( maxDist <= -1.0 );
		intersections[0] = max0;
		intersections[1] = max1;
		numIntersections = 2;
	}

	TPoint.clipLineToRect( bounds, intersections[0], intersections[1] );

	// The point furthest away from the cut line on the "other" image
	// is the one that we blend toward (the "dark" corner).
	var maxPoint = 0, maxDist = -1;
	for (i = 0; i < 4; i++)
	{
		var dist = Math.abs( other.fCorners[i].distanceToLine( intersections[0], intersections[1] ) );
		if (dist > maxDist)
		{
			maxDist = dist;
			maxPoint = i;
		}
	}

	this.makeBlendTrapezoid( intersections[0], intersections[1], other.fCorners[maxPoint], blendRad, true );
}

// "Adobe patent application tracking # B349, entitled 'Method and apparatus for Layer-based Panorama Adjustment and Editing', inventor: John Peterson"
//
// Create a layer mask that fades out from the edge0,edge1 cutline towards "insidePt"
// If two points are inside, construct the mask fade from the edge of the image.
//
//                       insidePt
//             |            *           |
//             |           / \          |
//             |          /   \         |
// insetLine-> |       +-/-----\-+      |  --
//             |       |/       \|      |   | radius
// baseLine->  +-------*---------*------+  --
//                    /edge0      \edge1
//                   /             \           
//
//
StackElement.prototype.makeBlendTrapezoid = function( edge0, edge1, insidePt, radius, useCorners )
{
	function sgn(x) { if (x < 0) return -1; if (x > 0) return 1; return 0; }
	function wrap4(i, next)
	{
		i += next;
		if (i > 3) return i % 4;
		if (i < 0) return 3;
		return i;
	}
	
	// Create a layer mask
	selectOneLayer( app.activeDocument, this.fName );
//	app.activeDocument.activeLayer = app.activeDocument.layers[this.fName];	// Broken if multiple layers selected.
	createLayerMask();	// Does nothing if the layer already has a mask
	
	// Create vector perpendicular to edge towards insidePt
	var edgeDir = edge1 - edge0;
	var blendDir = new TPoint( -edgeDir.fY, edgeDir.fX );
	blendDir /= blendDir.vectorLength();	// Make unit length
	
	// Make a polygonal selection covering the area
	var dist = insidePt.distanceToLine( edge0, edge1 );
	var blendOffset = blendDir * dist;
	var blendBox;
	if (! useCorners)
		blendBox = [edge0, edge0+blendOffset, edge1+blendOffset, edge1, edge0];
	else
	{
		// If the cutline slices across the image (two points on each side), then
		//		- Look for the edge edge0 is on
		//		- Figure out which corner is on the same side as "insdePt"
		//		- Construct the blendBox from that.
		var i, nextPtInd;
		for (i = 0; i < 4; i++)
			if (edge0.distanceToLine( this.fCorners[i], this.fCorners[wrap4(i,1)] ) < 0.0001 )
			{
				if (this.fCorners[i].sideOf( edge0, edge1 ) == sgn( dist ))
					nextPtInd = -1;
				else
					nextPtInd = 1;
				blendBox = new Array();
				blendBox[0] = edge0;
				blendBox[1] = (nextPtInd < 0) ? this.fCorners[i] : this.fCorners[i+1];
				blendBox[2] = (nextPtInd < 0) ? this.fCorners[wrap4(i, -1)] : this.fCorners[wrap4(i, 2)];
				blendBox[3] = edge1;
				break;
			}
		$.bp( i == 4 );	// Never found edge0?
	}
			
	createPolygonSelection( blendBox );
	
	// Fill it.
	var midPoint = (edge0 + edge1) * 0.5;
	gradientFillLayerMask( midPoint, midPoint + blendDir * radius * sgn(dist) );
	app.activeDocument.selection.deselect();
}

//////////////////////////////////////////////////////////////////////////////////
// Photomerge base class
//////////////////////////////////////////////////////////////////////////////////

const kPhotomergeAdvancedBlendingFlag = app.stringIDToTypeID( "PhotomergeAdvancedBlendingFlag" );	

photomerge = new ImageStackCreator( localize("$$$/AdobePlugin/Shared/Photomerge/Process/Name=Photomerge"),
										  localize('$$$/AdobePlugin/Shared/Photomerge/Auto/untitled=Untitled_Panorama' ), null );

// For now, alignment is turned OFF, because we want to
// invoke it independantly.			  
photomerge.useAlignment			= false;	// We do the alignment, not PS
photomerge.hideAlignment		= true;

photomerge.mustBeSameSize		= false;
photomerge.mustBeUnmodifiedRaw = false;
photomerge.mustNotBe32Bit		= ! app.featureEnabled(localize("$$$/private/32BitLayersFeature=32-Bit Layers"));
photomerge.radioButtons = ["_LOauto", "_LOperspective", "_LOcylindrical", "_LOspherical", "_LOcollage", "_LOnormal", "_LOinteractive"];
photomerge.interactiveFlag		= false;
photomerge.alignmentKey			= "Auto";	// Defaults to perspective
photomerge.compositionFile		= null;

photomerge.advancedBlending		= true;
photomerge.lensCorrection		= false;
photomerge.removeVignette		= false;

try {
// We want to steer people to the advanced blending option,
// so have it be on by default, rather than sticky.
//	var desc = app.getCustomOptions("PhotomergeFlags001");
//	photomerge.advancedBlending = desc.getBoolean( kPhotomergeAdvancedBlendingFlag );
}
catch (e)
{
}


// Get the bounds of all of the stackElements.
photomerge.getBounds = function()
{
	var i;
	for (i in this.stackElements)
	{
		if (i == 0) 
			this.fBounds = this.stackElements[i].getBounds();
		else
			this.fBounds.extendTo( this.stackElements[i].getBounds() );
	}
	return this.fBounds;
}

// Align selected layers by content (uses SIFT registration in Photoshop core)
// This just returns the alignment data, it does not actually transform the layers
// unless doTransform is true
photomerge.getAlignmentInfo = function( stackDoc, doTransform )
{
	selectAllLayers(stackDoc, 1);
	const kMargin = 10;
	
	function offsetGroup( delta, group )
	{
		group.bounds.offset( delta );
		var k;
		for (k = 0; k < group.layers.length; ++k)
		{
			group.layers[k].offset( delta );
			if (doTransform)
			{
				selectOneLayer( stackDoc, group.layers[k].fName );
				// Translate gets broken when document DPI isn't 72 DPI...(PR 1417264)
//				activeDocument.activeLayer.translate( UnitValue( delta.fX, "px" ), UnitValue( delta.fY, "px" ) );	
				translateActiveLayer( delta.fX, delta.fY );
			}
		}
	}

	var i, j, alignInfo;
	
	var alignmentFlags = [];
	if (this.lensCorrection) alignmentFlags.push(kradialDistortStr);
	if (this.removeVignette) alignmentFlags.push(kvignetteStr);
	
	alignInfo = getActiveDocAlignmentInfo( this.alignmentKey, doTransform, alignmentFlags );
	// If the alignment fails completely, fake up a plan B...
	// For now, just set the images side by side. 
	if (! alignInfo)
	{
		alert(localize("$$$/AdobePlugin/Shared/Photomerge/alignbad=Some images could not be automatically aligned"));
		var xpos = 0;
		for (i in this.stackElements)
		{
			this.stackElements[i].setCornersToSize();
			this.stackElements[i].offset( new TPoint( xpos, 0 ) );
			xpos += this.stackElements[i].getBounds().getWidth() + kMargin;
		}
		this.fGroups = null;
	}
	else
	{
		var layerList = alignInfo.layerInfo;
		this.fGroups = new Array();
		for (i = 0; i < layerList.length; ++i)
		{
			// Note we depend on stackElement's order matching 
			// the document's sheet list!
			var curGroup = layerList[i].groupNum;

			if (!doTransform && (layerList[i].corners.length > 0))
				this.stackElements[i].fCorners = layerList[i].corners;
			else
				this.stackElements[i].setCornersToLayerBounds( stackDoc );

			this.stackElements[i].fAlignGroup = curGroup;
			this.stackElements[i].fBaseFlag = layerList[i].baseFlag;
			if (typeof(this.fGroups[curGroup]) == "undefined")
			{
				this.fGroups[curGroup] = new Object();
				this.fGroups[curGroup].hasCorners = layerList[i].corners.length > 0;
				this.fGroups[curGroup].bounds = this.stackElements[i].getBounds();
				this.fGroups[curGroup].layers = new Array();
				this.fGroups[curGroup].xformType = layerList[i].xformType;
			}
			else
				this.fGroups[curGroup].bounds.extendTo( this.stackElements[i].getBounds() );
				
			this.fGroups[curGroup].layers.push( this.stackElements[i] );
		}
		
		// Now move the groups into  place
		// Note carefully: if the corners were given, then the group is already
		// transformed into the proper spot, and we just need to move the corners to
		// match.  So shut off moving the layer pixels around from here on out.
		offsetGroup( -this.fGroups[0].bounds.getTopLeft(), this.fGroups[0] );
		
		for (i = 1; i < alignInfo.numGroups; ++i)
		{
			var spacing = Math.round(this.fGroups[i-1].bounds.getHeight() / 10.0);
			offsetGroup( -this.fGroups[i].bounds.getTopLeft() + new TPoint(0, spacing + Math.round(this.fGroups[i-1].bounds.fBottom)), 
						   this.fGroups[i] );
		}
	}
	this.getBounds();
}

// The original Photomerge plugin needs to have the "connectivity" of the 
// pieces when in perspective mode, i.e., a pieces distortion is based
// on the distortion of the one it overlaps most.  This takes the 
// "base" piece information from the PS core and uses overlap area to
// determine this.
photomerge.setupConnectivity = function()
{
	var i;
	
	// See if stackElem is connected to the "base".  If "without"
	// is given, then the path to the base must not use "without"
	function isConnectedToBase( stackElem, without, dbg_count )
	{
		if (typeof(dbg_count) == "undefined")
			dbg_count = 0;
			
		if (typeof(without) == "undefined")
			without = null;
			
		$.bp( dbg_count > 150 );	// oops, got stuck in a loop...

		if (stackElem == null)
			return false;
			
		if (stackElem == without)
			return false;
			
		if (stackElem.fConnectedTo == stackElem)
			return true;		// Already at base
		return isConnectedToBase( stackElem.fConnectedTo, without, dbg_count + 1 );
	}
	
	// Initialize
	for (i in this.stackElements)
	{
		this.stackElements[i].fBoundsCache = this.stackElements[i].getBounds();
		this.stackElements[i].fLayerID = i;
		// Bases connect to themselves.
		this.stackElements[i].fConnectedTo = this.stackElements[i].fBaseFlag ? this.stackElements[i] : null;
		this.stackElements[i].fNeighborOverlap = 0;
	}
		
	// Create a connection table based on the overlap of the pieces
	var g, i, j, baseInd = -1;
	if (this.fGroups)
		for (g in this.fGroups)
		{
			var group = this.fGroups[g];
			var connections = new Array();
			var numLayers = group.layers.length;
			
			// Ignore orphan images
			if (numLayers < 2)
			{
				group.layers[0].fBaseFlag = false;
				group.layers[0].fConnectedTo = null;
				continue;
			}
			// If there's no perspective, there's no connections ("0" is kProjective in UAlignment.h)
			if (group.xformType != 0)
			{
				for (i = 0; i < numLayers; ++i)
				{
					group.layers[i].fBaseFlag = false;
					group.layers[i].fConnectedTo = group.layers[i];
				}
				continue;
			}
			
			for (i = 0; i < numLayers; ++i)
			{
				if (group.layers[i].fBaseFlag)
					baseInd = i;
				connections[i] = new Array();
				group.layers[i].fGroupIndex = i;
				if (i > 0)
					for (j = 0; j < i; ++j)
					{
						connections[i][j] = group.layers[i].overlapArea( group.layers[j] );
						connections[j][i] = connections[i][j];	// table is symentric
					}
			}
			
			$.bp( baseInd == -1 );	// Never found the base?
			
			// Debug - dump the connection table
	/*		for (i = 0; i < numLayers; ++i)
			{
				var s = "";
				for (j = 0; j < numLayers; ++j)
					s += ", " + Math.floor(connections[i][j]);
				$.writeln(s);
			}
	*/		
			// Connect everything to the base that's connected.
			for (i = 0; i < numLayers; ++i)
				if ((i != baseInd) && (connections[baseInd][i] > 0))
				{
					group.layers[i].fConnectedTo = group.layers[baseInd];
					group.layers[i].fNeighborOverlap = connections[baseInd][i];
				}
					
			// Walk the cconnectivity table and make sure everything is
			// "optimally" connected.
			var changes = false;
			do {
				changes = false;
				for (i = 0; i < numLayers; ++i)
				{
					if (i != baseInd)
					{
						var curLayer = group.layers[i];
							
						for (j = 0; j < numLayers; ++j)
						{
							if (((j != baseInd) && (j != i))
								&& (((connections[i][j] > curLayer.fNeighborOverlap)
										&& isConnectedToBase( group.layers[j], curLayer ))))
							{
								curLayer.fConnectedTo = group.layers[j];
								curLayer.fNeighborOverlap = connections[i][j];
								changes = true;
							}
						}
					}
				}
			} while (changes);
			
	//		for (i = 0; i < numLayers; ++i)
	//			$.writeln( group.layers[i].fName + " is connected to " + (group.layers[i].fConnectedTo ? group.layers[i].fConnectedTo.fName : "??") );
		}
}

photomerge.offsetStack = function( delta )
{
	for (i in this.stackElements)
		this.stackElements[i].offset( delta );
	this.fBounds.offset( delta );
}

photomerge.scaleStack = function( s )
{
	for (i in this.stackElements)
		this.stackElements[i].scale( s );
	this.getBounds();
}

// This gets executed before a filter plugin is invoked.  "desc"
// allows passing parameters to the filter.
photomerge.customPluginArguments = function( desc )
{
	var f = new File(this.stackElements[0].fFullName);
	var path = File.encode( f.parent.fsName ) + (File.fs == "Windows" ? "\\" : "/");
	desc.putString( app.charIDToTypeID('PMfp'), path );
	
	if (this.compositionFile)
        {
		desc.putString( app.charIDToTypeID('PMrf'), this.compositionFile.fsName );
		desc.putString( app.charIDToTypeID('PMcf'), File.encode( this.compositionFile.fsName ) );
        }
}

photomerge.callInteractivePlugin = function( stackDoc )
{
	// Scale the results to fit the screen
/*		var scaleFactor = 1.0, screenSize = primaryScreenDimensions() * 0.75;
	
	if (this.fBounds.getHeight() > this.fBounds.getWidth())
	{
		if (this.fBounds.getHeight() > screenSize.fY)
			scaleFactor = screenSize.fY / this.fBounds.getHeight();
	}
	else
	{
		if (this.fBounds.getWidth() > screenSize.fX)
			scaleFactor = screenSize.fX / this.fBounds.getWidth();
	}
*/

	const kMaxPieceSize = 1024;		// Must match value in PhotomergeUI.cpp
	var i;
	// The old plugin insists on eight bit data.
	if (stackDoc.bitsPerChannel != BitsPerChannelType.EIGHT)
	{
		stackDoc.bitsPerChannel = BitsPerChannelType.EIGHT;
		this.stackDepthChanged = true;
	}
		
	if (this.compositionFile == null)
	{
		// Make sure the quad coordinates coorespond to the scale used by the UI plugin
		var maxPieceSize = 0;
		for (i in this.stackElements)
			maxPieceSize = Math.max( Math.max( this.stackElements[i].fWidth, this.stackElements[i].fHeight ), maxPieceSize );
		
		var mipLevel = 0;
		while (maxPieceSize >> mipLevel > kMaxPieceSize)
			mipLevel++;
			
		var imageReduction = 1.0 / (1 << mipLevel);
		this.offsetStack( -this.fBounds.getCenter() );
		this.scaleStack( imageReduction );
		this.offsetStack( -this.fBounds.getTopLeft() );
			
		this.setupConnectivity();
		
		// Add the additional per-piece metadata to pass to the filter plugin
		for (i in this.stackElements)
			this.stackElements[i].addPieceData();
	}
		
	// Make the result layer active
	app.activeDocument.activeLayer = app.activeDocument.layers[app.activeDocument.layers.length -1];
	
	// Note: we need an "unmodified" flag, so if no
	// changes are made we skip the data recovery step...
	var result, err;
	try {
		result = this.invokeFilterPlugin( "AdobePhotomergeUI4SCRIPT", DialogModes.ALL );
	}
	catch (err)
	{
		result = null;
	}
	
	if (result == null)		// Cancelled / bombed out
	{
		stackDoc.close(SaveOptions.DONOTSAVECHANGES);
		return null;
	}

	// Extract the data from the plugin
	var modifiedPieceInfo = result.getString( app.charIDToTypeID('PSpc') ).split('\n');
	for (i in modifiedPieceInfo)
	{
		// If we loaded a composition (.pmg) file, we won't have corners yet.
		if (typeof(this.stackElements[i].fCorners) == "undefined")
			this.stackElements[i].fCorners = new Array();
		var j, pieceData = modifiedPieceInfo[i].split('\t');
		for (j in pieceData)
		{
			var k, pair = pieceData[j].split('=');
			if (pair[0] == 'fUsed')
				this.stackElements[i].fUsed = eval(pair[1]);
			if (pair[0] == 'fCorners')
			{
				var coords = pair[1].split(/\s+/).slice(1);
				for (k = 0; k < 4; k++)
					this.stackElements[i].fCorners[k] = new TPoint( Number(coords[k*2]), Number(coords[k*2+1]) );
			}
		}
	}
	
	// Remove unused photos
	for (i = 0; i < this.stackElements.length; ++i)
		if (! this.stackElements[i].fUsed)
		{
			stackDoc.layers[(this.stackElements.length-1)-i].remove();
			this.stackElements.splice(i,1);
			i--;
		}
			
	// Hey...it could happen.
	if (this.stackElements.length < 2)
		return null;
	
	// If we run the UI, we're restricted to an eight bit stack.
	// If the source images were higher, we need to reload the image stack.
	if (this.stackDepthChanged)
	{
		stackDoc.close(SaveOptions.DONOTSAVECHANGES);
		stackDoc = this.loadStackLayers();
	}
	this.getBounds();		// Update w/new corner data
	return stackDoc;
}

// "Adobe patent application tracking # B349, entitled 'Method and apparatus for Layer-based Panorama Adjustment and Editing', inventor: John Peterson"
//
// Use the geometry of the overlapping pieces to create
// simple rectangular blend masks.
//
photomerge.quickBlend = function()
{
	var i, j;

	var blendRadius = Math.round(Math.min(this.stackElements[0].fWidth, this.stackElements[0].fHeight) / 10.0);
	
	if (PMDebug)
		for (i in this.stackElements)
			this.stackElements[i].dumpMLCorners();
			
	// Set up progress bar for blending
	// The progress bar doesn't work - there's know way in ScriptUI to force it to update.
/*	var progressWindow = latteUI( g_StackScriptFolderPath + "PMBlendingProgress.exv" );
	var num = this.stackElements.length;
	var progressBar = progressWindow.findControl('_progress');
	progressBar.maxvalue = (num * (num + 1)) / 2;
	num = 0;
	progressWindow.center();
	progressWindow.show();
*/	
	// Blend the i'th piece against the 0..i-1 pieces below it
	for (i = this.stackElements.length-1; i > 0; --i)
		for (j = i-1; j >= 0; j--)
		{
//			num++;
//			progressBar.value = num; // ScriptUI bug - there's no way to force this to update.
			this.stackElements[i].softEdgeBlend( this.stackElements[j], blendRadius );
		}
//	progressWindow.close();
}

// Wrap the advancedBlend in a try/catch so errors (i.e., user cancel)
// just stop the blend process.
photomerge.advancedBlend = function( stackDoc )
{
	try {
		selectAllLayers(stackDoc, 1);
		advancedMergeLayers();
	}
	catch (err)
	{
	}
}

// With the stack elements specified, this
// portion actually creates the Panorama.
// Returns boolean indicating success/failure
photomerge.doPanorama = function()
{
	var i, stackDoc = null;
	
	function primaryScreenDimensions()
	{
		var i;
		for (i in $.screens)
			if ($.screens[i].primary)
				return new TPoint( $.screens[i].right - $.screens[i].left, 
									  $.screens[i].bottom - $.screens[i].top );
	} 

	function resizeCanvasToFitPano()
	{
		// Extend the canvas to hold the panorama
		var w = UnitValue( photomerge.getBounds().getWidth(), "px" );
		var h = UnitValue( photomerge.getBounds().getHeight(), "px" );
		app.activeDocument.resizeCanvas( w, h, AnchorPosition.TOPLEFT );
	}
	
	if (this.interactiveFlag)
	{
		// Filter must have eight bit depth and RGB color space
		stackDoc = this.loadStackLayers( BitsPerChannelType.EIGHT );
		stackDoc.changeMode(ChangeMode.RGB);
	}
	else
		stackDoc = this.loadStackLayers();

	if (! stackDoc)
		return false;
		
	// Remove spurious last layer (not needed by Photomerge)
	if (app.activeDocument.layers[app.activeDocument.layers.length-1].name == this.pluginName)
		app.activeDocument.layers[app.activeDocument.layers.length-1].remove();

	// The UI needs everything in the top left corner
	if (this.interactiveFlag)
		for (i = 0; i < stackDoc.layers.length; ++i)
		{
			var xoff = stackDoc.layers[i].bounds[0].as("px");
			var yoff = stackDoc.layers[i].bounds[1].as("px");
			if ((xoff != 0) || (yoff != 0))
				stackDoc.layers[i].translate( UnitValue( -xoff, "px" ), UnitValue( -yoff, "px" ) );
		}
	
	// Sort out exactly what operations we want to do.
	if (! this.interactiveFlag)
	{
		selectAllLayers(stackDoc, 1);
		this.getAlignmentInfo( stackDoc, true );
		resizeCanvasToFitPano();
		if (this.advancedBlending)
		{
			stackDoc.changeMode( ChangeMode.RGB );	// Auto-blend requires  RGB
			this.advancedBlend( stackDoc );
		}
// The Advanced blending works so well that there's little point
// in having the rectangular gradient blends anymore.  Uncomment the
// following two lines if you still want them (see similar code below
// for the interactive case).
//		else
//			this.quickBlend();
		purgeHistoryStates();
		return true;
	}

	// Interactive happens here
	if (this.compositionFile == null)
	{
		this.getAlignmentInfo( stackDoc, false );	
	
		// With the corners computed by getAlignmentInfo,
		// find the bounds and use that to slide the images
		// over so their bounds has origin 0,0 (top left)
		this.offsetStack( -this.fBounds.getTopLeft() );
	}
	
	if (this.interactiveFlag)
		stackDoc = this.callInteractivePlugin( stackDoc );
	if (stackDoc == null)
		return false;
	
	resizeCanvasToFitPano();

	// Now apply the transformation to the pieces
	for (i in this.stackElements)
		this.stackElements[i].transform();

	if (this.advancedBlending)
	{
		selectAllLayers( stackDoc, 1 );
		stackDoc.changeMode( ChangeMode.RGB );	// Auto-blend requires  RGB
		advancedMergeLayers();
	}
// The new "advanced blending" works well enough that there's
// little point in invoking the rectangular gradient blends anymore.
// If you really want them, you can uncomment the two lines below.
//	else
//		this.quickBlend();

	purgeHistoryStates();
	return true;
}

// Extra group breaks the main dialog's radio buttons,
// so we manually implement it here (ScriptUI lossage)
// NOTE: When called, this is a member function of radioControl,
// -not- photomerge.  JavaScript voodoo.
photomerge.radioClick = function()
{
	var w = this.window;
	var i;

	// Some of the transforms don't allow lens correction...
	var allowLensCor = ((this.button_id != '_LOnormal') 
						&& (this.button_id != '_LOcollage') 
						&& (this.button_id != '_LOinteractive'));
	w.findControl('_useLensCorrection').enabled = allowLensCor;
	w.findControl('_removeVignette').enabled = allowLensCor;
	
	// Be aggressive about it...
	if (! allowLensCor)
	{
		w.findControl('_useLensCorrection').value = false;
		w.findControl('_removeVignette').value = false;
	}
	
	for (i in photomerge.radioButtons)
	{
		var b = w.findControl(photomerge.radioButtons[i]);
		
		if (b != this)
			b.value = false;
	}
}

// Callback when "Load Composition" is clicked.
// NOTE: When called, this is a member function of buttonControl,
// -not- photomerge.  JavaScript voodoo.
photomerge.loadCompositionClick = function()
{
	function MacPMGType( f )
	{
		if (f.type == 'PhMg')
			return true;
		var match = f.name.match(/.*[.](.+)$/);
		var suffix = match != null ? match[1].toLowerCase() : "";
		if (suffix == "pmg")
			return true;
		if (f instanceof Folder)
		{
			// If the item is an app or a bundle it will be an 
			// instance of folder. If we return true it will 
			// appear as an enabled item. While the OS will not
			// let the user navigate into it, it is better to 
			// have it appear as disabled.
			if (suffix.match(/app|bundle/i) != null)
			{
				// Do not navigate folders that end in .app or .bundle
				return false;
			}
			// navigate any other folder
			return true;
		}
		// some unknown file type/suffix
		return false;
	}

	var fileType = File.fs == "Windows" ? localize("$$$/AdobePlugin/Shared/Photomerge/Auto/Win=Photomerge Compositions:*.pmg") 
									: MacPMGType;
									
	photomerge.compositionFile = File.openDialog( localize("$$$/AdobePlugin/Photomerge/LoadComp=Load Photomerge Composition"), fileType );
	if (photomerge.compositionFile == null || !photomerge.compositionFile.open("r"))
		return;
		
	var line = photomerge.compositionFile.readln();
	if (! line.match(/^VIS/))
	{
		alert( this.pluginName + localize("$$$/AdobePlugin/Photomerge/BadComp=The Composition file is corrupt"), this.pluginName, true );
		return;
	}
	
	// Read through the composition file and extract the file paths in it.
	var mergeFiles = new Array();
	while (! photomerge.compositionFile.eof)
	{
		line = photomerge.compositionFile.readln();
		var f = line.match(/^\s*PATH\s+<([^>]+)/);
		if (f)
		{
			// If no file path delimiters, image paths are assumed relative to the composition file
			var relPath = (f[1].indexOf( (File.fs == "Windows") ? "\\" : "/" ) < 0);
			f = (relPath ? photomerge.compositionFile.path + "/" : "") + f[1];
			mergeFiles.push( new StackElement( new File(f) ) );
		}
	}
	
	if (mergeFiles.length < 2)
	{
		alert( this.pluginName + localize("$$$/AdobePlugin/Photomerge/BadComp=The Composition file is corrupt"), this.pluginName, true );
		return;
	}

	photomerge.stackElements = mergeFiles;
	photomerge.interactiveFlag = true;
	this.window.close(kFilesFromPMLoad);
}

// Set up the radio buttons
photomerge.customDialogSetup = function( w )
{
	var i, button;
	for (i in this.radioButtons)
	{
		button = w.findControl(this.radioButtons[i]);
		button.onClick = this.radioClick;
		// Flag with name so we can identify it in radioClick
		button.button_id = this.radioButtons[i];
	}
	
	// Missing feature: We should query the selected file's metadata and
	// automatically turn on the '_useLensCorrection' checkbox if the
	// file has the proper support for it.
		
	w.findControl("_loadcomp").onClick = this.loadCompositionClick;
	
	// Julie didn't like the intro line; nuke it here because stackDialog looks for it.
	w.findControl("_intro").parent.remove(['_intro']);
	var size = w.findControl("_fileList").size;
	size[1] += 20;
		
	w.findControl("_LOauto").value = true;		// Set default
	w.findControl("_advancedBlend").value = this.advancedBlending;

	// If the PhotomergeUI or ADM plugins aren't there, 
	// or we're not 32 bit, don't display the option for it.
	if ((app.systemInformation.search(/PhotomergeUI/) < 0) 
	 || (app.systemInformation.search(/ADM /) < 0)
	 || ((File.fs == "Macintosh")
          && (app.systemInformation.split('\r')[0].search(/.+Photoshop.*x32/) < 0)))
	{
	   w.findControl("_PMInteractive").hide();
	   w.findControl("_loadcomp").hide();
	}	   
}

// Called by the dialog on closing to collect the results
photomerge.customDialogFunction = function( w )
{
	if (w.findControl("_LOinteractive").value)
	{
		this.interactiveFlag = true;
		this.alignmentKey = 'interactive';
	}
	else
	{			
		var i, d = [{k:"_LOauto",v:"Auto"},{k:"_LOnormal",v:"translation"},{k:"_LOperspective",v:"Prsp"},{k:"_LOcylindrical",v:"cylindrical"},{k:"_LOspherical",v:"spherical"},{k:"_LOcollage",v:"sceneCollage"}];
		for (i in d)
			if (w.findControl(d[i].k).value)
			{
				this.alignmentKey = d[i].v;
				break;
			}
	}
	this.advancedBlending = w.findControl("_advancedBlend").value;
	this.lensCorrection = w.findControl("_useLensCorrection").value;
	this.removeVignette = w.findControl("_removeVignette").value;
}

// "Main" execution of Photomerge from the menu
photomerge.doInteractivePano = function ()
{
	// Because of the ",true", the dialog is pre-loaded with any bridge files.
	this.getFilesFromBridgeOrDialog( localize("$$$/private/Photomerge/PMDialogexv=PMDialog.exv"), true );

	try {
		if (this.stackElements && this.doPanorama())
		{
			fitViewOnScreen();
			var flagDesc = new ActionDescriptor();
			flagDesc.putBoolean( kPhotomergeAdvancedBlendingFlag, photomerge.advancedBlending );
			app.putCustomOptions( "PhotomergeFlags001", flagDesc, true );
		}
	}
	catch (err)
	{
		if (this.stackDoc)
			this.stackDoc.close(SaveOptions.DONOTSAVECHANGES)
	}
}

// Use this version to call Photomerge from a script.
photomerge.createPanorama = function(filelist, displayDialog)
{
	this.interactiveFlag = (typeof(displayDialog) == 'boolean') ? displayDialog : false;
		
	if (filelist.length < 2)
	{
		alert(localize("$$$/AdobePlugin/Shared/Photomerge/AtLeast2=Photomerge needs at least two files selected."), this.pluginName, true );
		return;
	}
	var j;
	this.stackElements = new Array();
	for (j in filelist)
	{
		var f = filelist[j];
		this.stackElements.push( new StackElement( (typeof(f) == 'string') ? File(f) : f ) );
	}
		
	if (this.stackElements.length > 1)
		this.doPanorama();
}

if ((typeof(runphotomergeFromScript) == 'undefined')
	|| (runphotomergeFromScript==false))
	photomerge.doInteractivePano();
