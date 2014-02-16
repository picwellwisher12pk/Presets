// (c) Copyright 2005-2007  Adobe Systems, Incorporated.  All rights reserved.

/*
@@@BUILDINFO@@@ StackSupport.jsx 1.0.0.0
*/

//
// Support routines for Stack based imaging scripts.  These
// routines mostly fill in for holes in the Document Object Model,
// and ideally should be replaced with DOM equivalents someday.
//

// on localized builds we pull the $$$/Strings from a .dat file
$.localize = true;

if (typeof typeNULL == "undefined")
    $.evalFile(g_StackScriptFolderPath + "Terminology.jsx");

// Handy debugging function helps you figure out what descriptor keywords are.
function numToOSType( number )
{
	function decodeByte(num)
	{
		const hex = '0123456789ABCDEF';
		num = num & 0xFF;
		var hi = hex[(num >> 4)];
		var lo = hex[num & 0xF];
		return decodeURI( "%" + hi + lo );
	}

	return decodeByte(number >> 24) + decodeByte(number >> 16) + decodeByte(number >> 8) + decodeByte(number);
}

// Returns true if the active layer has a layer mask
function hasLayerMask()
{
	ref = new ActionReference();
	args = new ActionDescriptor();
	ref.putProperty( classProperty, keyUserMaskEnabled );
	ref.putEnumerated( classLayer, typeOrdinal, enumTarget );
	args.putReference( keyTarget, ref );

	var resultDesc = executeAction( eventGet, args, DialogModes.NO );
	return resultDesc.hasKey( keyUserMaskEnabled );
}

// Create a layer mask in the active document.	Leaves layer mask the active channel
function createLayerMask()
{
	if (hasLayerMask()) return;
	var desc = new ActionDescriptor();
	var ref = new ActionReference();
	desc.putClass( keyNew, typeChannel );
	ref.putEnumerated( typeChannel, typeChannel, classMask );
	desc.putReference( keyAt, ref );
	desc.putEnumerated( keyUsing, keyUserMaskEnabled, enumRevealAll );
	executeAction( eventMake, desc, DialogModes.NO );
}

// Apply the layer mask, deleting it in the process.
function applyLayerMask()
{
	var desc = new ActionDescriptor();
	var ref = new ActionReference();
	ref.putEnumerated( typeChannel, typeOrdinal, enumTarget );
	desc.putReference( typeNULL, ref );
	desc.putBoolean( keyApply, true );
	executeAction( eventDelete, desc, DialogModes.NO );
}

// Returns the name of the layer mask of the active layer
// (or "Alpha" if none...in English at least...)
function layerMaskName()
{
	ref = new ActionReference();
	args = new ActionDescriptor();
	ref.putProperty( classProperty, keyChannelName );	// keyChannelName
	ref.putEnumerated( classChannel, typeOrdinal, enumMask );
	args.putReference( keyTarget, ref );

	var resultDesc = executeAction( eventGet, args, DialogModes.NO );
	return resultDesc.getString( keyChannelName );
}

// This is the same as app.activeDocument.activeLayer.translate( dx, dy ),
// which seems to be broken at the moment.
// Potential DOM FIX
function translateActiveLayer( deltaX, deltaY )
{
	var desc = new ActionDescriptor();
	var ref = new ActionReference();
	ref.putEnumerated( classLayer, typeOrdinal, enumTarget );
	desc.putReference( typeNULL, ref );
	var coords = new ActionDescriptor();
	coords.putUnitDouble( enumHorizontal, unitPixels, deltaX );
	coords.putUnitDouble( keyVertical, unitPixels, deltaY );
	desc.putObject( keyTo, keyOffset, coords );
	executeAction( eventMove, desc, DialogModes.NO );
}

// Gradient Fill operator. 
// Note this is hardwired to Darken mode (among other things)
// Potential DOM FIX
function gradientFillLayerMask( fromPoint, toPoint )
{
	function pointDesc( pt )
	{
		var desc = new ActionDescriptor();
		desc.putUnitDouble( keyHorizontal, unitPixels, pt.fX );
		desc.putUnitDouble( keyVertical, unitPixels, pt.fY );
		return desc;
	}
	
	function stopDesc( location, midPoint )
	{
		var desc = new ActionDescriptor();
		desc.putInteger( keyLocation, location );
		desc.putInteger( keyMidpoint, midPoint );
		return desc;
	}
	
	function grayDesc( grayValue )
	{
		var desc = new ActionDescriptor();
		desc.putDouble( enumGray, grayValue );
		return desc;
	}

	var args = new ActionDescriptor();
	args.putObject( keyFrom, classPoint, pointDesc( fromPoint ) );
	args.putObject( keyTo, classPoint, pointDesc( toPoint ) );
	args.putEnumerated( keyMode, typeBlendMode, enumDarken );
	args.putEnumerated( keyType, typeGradientType, enumLinear );
	args.putBoolean( keyDither, true );
	args.putBoolean( keyUseMask, true );
	args.putBoolean( keyReverse, true );
	
	var gradDesc = new ActionDescriptor();
	gradDesc.putString( keyName, "White, Black" );
	gradDesc.putEnumerated( typeGradientForm, typeGradientForm, enumCustomStops );
	gradDesc.putDouble( keyInterpolation, 4096.000000 );
	
	var colorList = new ActionList();
	var stop = stopDesc( 0, 50 );
//	stop.putEnumerated( keyType, typeColorStopType, enumForegroundColor );
	stop.putObject( classColor, classGrayscale, grayDesc( 100 ) );
	stop.putEnumerated( keyType, typeColorStopType, enumUserStop );
	colorList.putObject( classColorStop, stop );
	stop = stopDesc( 4096, 50 );
//	stop.putEnumerated( keyType, typeColorStopType, enumBackgroundColor );
	stop.putObject( classColor, classGrayscale, grayDesc( 0 ) );
	stop.putEnumerated( keyType, typeColorStopType, enumUserStop );
	colorList.putObject( classColorStop, stop );
	gradDesc.putList( typeColors, colorList );
	
	var xferList = new ActionList();
	var xfer = stopDesc( 0, 50 );
	xfer.putUnitDouble( keyOpacity, unitPercent, 100.000000 );
	xferList.putObject( keyTransferSpec, xfer );
	xfer = stopDesc( 4096, 50 );
	xfer.putUnitDouble( keyOpacity, unitPercent, 100.000000 );
	xferList.putObject( keyTransferSpec, xfer );
	
	gradDesc.putList( keyTransparency, xferList );
	args.putObject( keyGradient, classGradient, gradDesc );
	executeAction( eventGradient, args, DialogModes.NO );
}

// Create polygon selection.  The polygon is an array of point arrays,
// e.g. [[20,30][40,30][40,60][20,30]]
// Potential DOM FIX
function createPolygonSelection( polygon )
{
	var i;
	var desc = new ActionDescriptor();
	var ref = new ActionReference();
	var listDesc = new ActionDescriptor();
	var pointList = new ActionList();
	
	ref.putProperty( typeChannel, charIDToTypeID('fsel') );	// What's fsel?
	desc.putReference( typeNULL, ref );

	for (i in polygon)
	{
		var pointDesc = new ActionDescriptor();
		pointDesc.putUnitDouble( keyHorizontal, unitPixels, polygon[i].fX );
		pointDesc.putUnitDouble( keyVertical, unitPixels, polygon[i].fY );
		pointList.putObject( classPoint, pointDesc );
	}

	listDesc.putList( keyPoints, pointList );
	desc.putObject( keyTo, classPolygon, listDesc );
	desc.putBoolean( keyAntiAlias, true );
	executeAction( eventSet, desc, DialogModes.NO );
}

// Content aware fill an existing selection.
// Potential DOM FIX
function contentAwareFillSelection()
{
        var desc = new ActionDescriptor();
        desc.putEnumerated( keyUsing, typeFillContents, kcontentAwareStr );
        desc.putUnitDouble( keyOpacity, unitPercent, 100.000000 );
        desc.putEnumerated( classMode, typeBlendMode, enumNormal );
        executeAction( typeFill, desc, DialogModes.NO );

        app.activeDocument.selection.deselect();
}

function duplicateDocument( newName )
{
	var desc = new ActionDescriptor();
	var ref = new ActionReference();
	ref.putEnumerated( classDocument, typeOrdinal, enumFirst );
	desc.putReference( typeNULL, ref );
	desc.putString( keyName, newName );
	executeAction( eventDuplicate, desc, DialogModes.NO );
}

// Set the exposure of the frontmost document
// Potential DOM FIX
function setFrontmostExposure( exposure, gamma )
{
	if (typeof(gamma) == "undefined")
		gamma = 1.0;

	args = new ActionDescriptor();
	args.putInteger( classVersion, 3 );
	args.putEnumerated( keyMethod, app.stringIDToTypeID( 'hdrToningMethodType' ), 
								   app.stringIDToTypeID( 'hdrtype2' ) );
	args.putDouble( keyExposure, exposure );
	args.putDouble( keyGamma, gamma );

	executeAction( app.stringIDToTypeID('32BitPreviewOptions'), args );
}

// Since you can't assign to doc.resolution
// Potential DOM FIX
function setFrontmostResolution( dpi )
{
	var desc = new ActionDescriptor();
	desc.putUnitDouble( keyResolution, unitDensity, dpi );
	executeAction( eventImageSize, desc, DialogModes.NO );
}

// Forces the frontmost document to save in Photoshop (.psd) format.
function resetFrontmostDocumentFormat()
{
	var desc = new ActionDescriptor();
	executeAction( kresetDocumentFormatStr, desc, DialogModes.NO );
}

// The only way to test for a custom option is to try accessing
// it and catch the exception if it fails.
// Potential DOM FIX
function getPSCustomOption( optionSet, optionType, optionID, defaultValue )
{
	var result = defaultValue; 
	try {
		var desc = app.getCustomOptions( optionSet );
		result = eval( "desc.get" + optionType + "(" + optionID + ")" );
	}
	catch (e)
	{}
	return result;
}

// Some actions, like closing a window, need to be processed by the PS App
// before other actions are taken.  In particular, when a window is closed and
// "open as tabs" is off, then app.activeDocument is left unset until the app is
// able to process the activate event of the next window coming forward.
function WaitForPhotoshopRedraw()
{
	var desc = new ActionDescriptor();
    desc.putEnumerated( keyState, typeState, enumRedrawComplete );
	executeAction( eventWait, desc, DialogModes.NO );
}

// Set the lightroom "save" parameters for the frontmost document
// Potential DOM FIX
function setLightroomFileParams( lightroomID, bridgetalkID, lightroomDesc )
{
    function setParameter( ID, data, method )
    {
        if (typeof(data) == "undefined")    // Check for empty parameter
            return;

        var ref = new ActionReference();
        var desc = new ActionDescriptor();
         
        ref.putProperty( classProperty, ID );
        ref.putEnumerated( classDocument, typeOrdinal, enumFirst );
        desc.putReference( keyTarget, ref );
        var toDesc = new ActionDescriptor();
        eval( method );
        desc.putObject( keyTo, typeNULL, toDesc );
        executeAction( eventSet, desc, DialogModes.NO );
    }

    setParameter( klightroomDocIDStr, lightroomID, "toDesc.putString( ID, data );" );
    setParameter( klightroomBridgetalkIDStr, bridgetalkID, "toDesc.putString( ID, data );" );
	if ((typeof(lightroomDesc) != "undefined") && (lightroomDesc != null))
		setParameter( klightroomSaveParamsStr, lightroomDesc, "toDesc.putObject( ID, ksaveStr, data );" );
}

// Scale the view on the frontmost document so it fits on the screen
function fitViewOnScreen()
{
	var desc = new ActionDescriptor();
	var ref = new ActionReference();
	ref.putEnumerated( classMenuItem, typeMenuItem, enumFitOnScreen );
	desc.putReference( typeNULL, ref );
	executeAction( eventSelect, desc, DialogModes.NO );
}

// Undo the last operation
// Potential DOM FIX
function undoLastEvent()
{
	executeAction( eventUndo, undefined, DialogModes.NO );
}

// Purge this history states for the active document
// Potential DOM FIX
function purgeHistoryStates()
{
	var desc = new ActionDescriptor();
	desc.putEnumerated( typeNULL, typePurgeItem, enumHistory );
	executeAction( eventPurge, desc, DialogModes.NO );
}

// Get flags controlling whether or not confirmation dialogs
// appear when changing color profiles.
// "settings" is one of kaskMismatchOpeningStr, kaskMismatchPastingStr, kaskMissingStr
function getColorProfileDialogSetting( setting, typeMethod )
{
	if (typeof( typeMethod ) == "undefined")
		typeMethod = "Boolean";
		
	var desc1 = new ActionDescriptor();
	var ref1 = new ActionReference();
	ref1.putProperty( classProperty, kcolorSettingsStr );
	ref1.putEnumerated( classApplication, typeOrdinal, enumTarget );
	desc1.putReference( typeNULL, ref1 );
	
	var result = executeAction( eventGet, desc1, DialogModes.NO );
	var desc2 = result.getObjectValue( kcolorSettingsStr );
	
	if (desc2.hasKey( setting ))
		return eval( "desc2.get" + typeMethod +"( setting )" );
	else
		return null;
}

// Set flags controlling whether or not confirmation dialogs
// appear when changing color profiles.
// "settings" is one of kaskMismatchOpeningStr, kaskMismatchPastingStr, kaskMissingStr
function setColorProfileDialogSetting( setting, value, typeMethod )
{
	if (typeof( typeMethod ) == "undefined")
		typeMethod = "Boolean";

	var desc1 = new ActionDescriptor();
	var ref1 = new ActionReference();
	ref1.putProperty( classProperty, kcolorSettingsStr );
	ref1.putEnumerated( classApplication, typeOrdinal, enumTarget );
	desc1.putReference( typeNULL, ref1 );
	
	var desc2 = new ActionDescriptor();
	
	eval( "desc2.put" + typeMethod + "( setting, value )" );
	desc1.putObject( keyTo, kcolorSettingsStr, desc2 );
	executeAction( eventSet, desc1, DialogModes.NO );
}

// Helper functions to make accessing the XMP metadata simpler.
function getXMPTagFromXML( tag, xmlData, numeric )
{
	var s, xmp = new XML(xmlData);
	
	// Ugly special case
	if (tag == "ISOSpeedRatings")
		s = String(xmp.*::RDF.*::Description.*::ISOSpeedRatings.*::Seq.*::li);
	else
		s = String(eval("xmp.*::RDF.*::Description.*::" + tag));
	if (s.length == 0)
		return numeric ? 0.0 : ""
	return numeric ? eval(s) : s;
}

function getXMPTag( tag, numeric )
{
	return getXMPTagFromXML( tag, app.activeDocument.xmpMetadata.rawData, numeric )
}

// Get / set the "Prefer Adobe Camera Raw for JPEG Files" flag.
// This feature was added at the last minute, and thus left out of app.preferences
// Potential DOM FIX
function setUseCameraRawJPEGPreference( flag )
{
	//temporary workaround for #1756346

    //var saveDesc = new ActionDescriptor();
    //var ref = new ActionReference();
    //ref.putProperty( classProperty, keyFileSavePrefs );
    //ref.putEnumerated( classApplication, typeOrdinal, enumTarget );
    //saveDesc.putReference( typeNULL, ref );
    //var rawDesc = new ActionDescriptor();
    //rawDesc.putBoolean( kcameraRawJPEGStr, flag );
    //saveDesc.putObject( keyTo, classFileSavePrefs, rawDesc );
	//executeAction( eventSet, saveDesc, DialogModes.NO );
}

function getUseCameraRawJPEGPreference()
{
	//temporary workaround for #1756346

    //var ref = new ActionReference();
    //ref.putProperty( classProperty, keyFileSavePrefs );
    //ref.putEnumerated( classApplication, typeOrdinal, enumTarget );
	//// Descriptor with the actual prefs is buried one deep...
	//var result = app.executeActionGet( ref );
	//var desc = result.getObjectValue( result.getKey(0) );
	//return desc.getBoolean( kcameraRawJPEGStr );
	return false;
}

// Filters for the open dialog 
function winFileSelection( f )
{
	var suffix = f.name.match(/[.](\w+)$/);
	var t;
	
	if (suffix && suffix.length == 2)
	{
		suffix = suffix[1].toUpperCase();
		for (t in app.windowsFileTypes)
			if (suffix == app.windowsFileTypes[t])
			{
				// Ignore mac-generated system thumbnails
				if (f.name.slice(0,2) != "._")
					return true;
			}
	}
	return false;
}

function macFileSelection( f )
{
	var t;
	for (t in app.macintoshFileTypes)
		if (f.type == app.macintoshFileTypes[t])
			return true;
	
	// Also check windows suffixes...
	return winFileSelection( f );	
}

function isValidImageFile( f )
{
	return ((File.fs == "Macintosh") && macFileSelection(f)) || ((File.fs == "Windows") && winFileSelection(f));
}

// Simple utilities for those lovely four-char-codes
function intToOStype(n)
{
	return String.fromCharCode( (n >> 24) & 0xFF, (n >> 16) & 0xFF, (n >> 8) & 0xFF, n & 0xFF);
}

function osTypeToInt(os)
{
	var n = 0;
	for (i = 0; i < os.length; i++)
		n |= os.charCodeAt(i) << ((3-i)*8);
	return n;
}

// Open Photoshop's FileOpen dialog, and return a list of filenames
// Potential DOM FIX
function photoshopFileOpenDialog()
{
	result = new Array();

	var nlist = app.openDialog();
	
	for (var i = 0; i < nlist.length; i++)
	{
		var s = decodeURI(nlist[i].toString());
		s = s.replace(/^file:\/\//, "");
		if ($.os.match(/^Windows.*/))	// Pull off ":" from drive letter
			s = s.replace(/^\/(.):\//, "/$1/");
		result.push(s);
	}
	
	return result;
}

// A viewless document doesn't have a window open in Photoshop,
// doesn't have a corresponding "document" object in the DOM,
// and isn't known to the DOM in general.  Instead, it carries
// a pointer to the TImageDocument in PS, and manipulates it via
// PS events.  The code supporting this is hiding in U3DCommands.cpp
function ViewlessDocument( desc, pathname )
{
	var bppdict = {  1:BitsPerChannelType.ONE,
					 8:BitsPerChannelType.EIGHT,
					16:BitsPerChannelType.SIXTEEN,
					32:BitsPerChannelType.THIRTYTWO };
	var modeDict = {};
	modeDict[classBitmapMode]		= DocumentMode.BITMAP;
	modeDict[classGrayscaleMode]	= DocumentMode.GRAYSCALE;
	modeDict[classDuotoneMode]		= DocumentMode.DUOTONE;
	modeDict[classIndexedColorMode]	= DocumentMode.INDEXEDCOLOR;
	modeDict[classRGBColorMode]		= DocumentMode.RGB;
	modeDict[classCMYKColorMode]	= DocumentMode.CMYK;
	modeDict[classLabColorMode]		= DocumentMode.LAB;
	modeDict[classMultichannelMode] = DocumentMode.MULTICHANNEL;

	this.height = new UnitValue( desc.getInteger( keyHeight ), "px" );
	this.width = new UnitValue( desc.getInteger( keyWidth ), "px" );
	this.bitsPerChannel = bppdict[desc.getInteger( keyDepth )];
	this.xmpMetadata = new Object();
	this.pixelAspectRatio = desc.getDouble( kaspectRatioStr );
	this.layerCount = desc.getInteger( klayersStr );
	this.isSimple = desc.getBoolean( kflatnessStr );
	this.xmpMetadata.rawData = desc.getString( kXMPMetadataAsUTF8Str );
	this.activeLayer = new Object();
	
	// Note: "TEXT" here really DOES NOT necessarily mean text, it just
	// means "not normal"
	if (desc.getBoolean( kpixelStr ))
		this.activeLayer.kind = LayerKind.NORMAL;
	else
		this.activeLayer.kind = LayerKind.TEXT;
	this.mode = modeDict[desc.getClass( keyMode )];
	this.viewlessDocPtr = desc.getData( kdocumentStr );
	this.path = pathname;
	this.isOpen = true;
}

ViewlessDocument.prototype.addToActiveDocument = function()
{
	function isWierdMode( m )
	{
		var j, wierdModes = [DocumentMode.BITMAP, DocumentMode.INDEXEDCOLOR, DocumentMode.GRAYSCALE, DocumentMode.DUOTONE, DocumentMode.MULTICHANNEL];
		for (j in wierdModes)
			if (m == wierdModes[j])
				return true;
		return false;
	}

	// Bug 2510186: Favor non-whacky modes vs. whacky ones, or else the
	// action below silently fails.
	if (isWierdMode( app.activeDocument.mode ) && ! isWierdMode( this.mode ))
	{
		var thisModeTag = this.mode.toString().match(/DocumentMode[.](\w+)/)[1];
		app.activeDocument.changeMode( eval( "ChangeMode." + thisModeTag ) );
	}

	var i, fileListDesc = new ActionList();
	var ptrListDesc = new ActionList();
	
	fileListDesc.putPath( new File( this.path ) );
	ptrListDesc.putData( this.viewlessDocPtr );
	
	var desc = new ActionDescriptor();
	desc.putList( keyFileList, fileListDesc );
	desc.putList( keyViewlessDoc, ptrListDesc );
	executeAction( kaddLayerFromViewlessDocStr, desc, DialogModes.NO );
	this.isOpen = false; // Adding the layer closes the document
}	
	
ViewlessDocument.prototype.changeMode = function( mode )
{
	alert("Assert - changemode not implemented yet");
}

ViewlessDocument.prototype.close = function( options )
{
	if (this.isOpen)
	{
		var desc = new ActionDescriptor();
		desc.putData( kdocumentStr, this.viewlessDocPtr );
		executeAction( kcloseViewlessDocumentStr, desc );
		this.isOpen = false;
	}
}

// Open a document -without- a corresponding view
function openViewlessDocument( pathname )
{
	var desc = new ActionDescriptor();
	desc.putBoolean( kpreferXMPFromACRStr, true );
	desc.putPath( app.charIDToTypeID('File'), new File( pathname ) );
	var result = executeAction( kopenViewlessDocumentStr, desc, DialogModes.NO );
	var psViewPtr = result.getData( kdocumentStr );
	if (psViewPtr.length == 0)
	{
		return null;
	}
	return new ViewlessDocument( result, pathname );
}

// Return a list of color profile names corresponding to a given
// OSCode tag for the ACE_SelectorCode (defined in ACETypes.h)
// Potential DOM fix
function getColorProfileList( profileTagStr )
{
	var profileTag = osTypeToInt( profileTagStr );
	var args = new ActionDescriptor();
	ref = new ActionReference();
	ref.putProperty( classProperty, kcolorProfileListStr );
	ref.putEnumerated( classApplication, typeOrdinal, profileTag );
	args.putReference( keyTarget, ref );
	args.putInteger( kprofileStr, profileTag );

	var resultDesc = executeAction( eventGet, args, DialogModes.NO );
	var profileList = resultDesc.getList( kcolorProfileListStr );
	var i, profileStrings = [];
	for (i = 0; i < profileList.count; ++i)
		profileStrings.push( profileList.getString(i) );
	
	return profileStrings;
}

// Apply a perspective transform to the current layer, with the
// corner TPoints given in newCorners (starts at top left, in clockwise order)
// Potential DOM fix
function transformActiveLayer( newCorners )
{
	function pxToNumber( px )
	{
		return px.as("px");
	}
	
	var saveUnits = app.preferences.rulerUnits;
	app.preferences.rulerUnits = Units.PIXELS;

	var i;
	var setArgs = new ActionDescriptor();
	var chanArg = new ActionReference();
	
	chanArg.putProperty( classChannel, keySelection );
	setArgs.putReference( keyNull, chanArg );
	
	var boundsDesc = new ActionDescriptor();
	var layerBounds = app.activeDocument.activeLayer.bounds;
	boundsDesc.putUnitDouble( keyTop, unitPixels, pxToNumber( layerBounds[1] ) );
	boundsDesc.putUnitDouble( keyLeft, unitPixels, pxToNumber( layerBounds[0] ) );
	boundsDesc.putUnitDouble( keyRight, unitPixels, pxToNumber( layerBounds[2] ) );
	boundsDesc.putUnitDouble( keyBottom, unitPixels, pxToNumber( layerBounds[3] ) );
	
	setArgs.putObject( keyTo, classRectangle, boundsDesc );
	executeAction( eventSet, setArgs );
	
	var result = new ActionDescriptor();
	var args = new ActionDescriptor();
	var quadRect = new ActionList();
	quadRect.putUnitDouble( unitPixels, pxToNumber( layerBounds[0] ) );	// ActionList put is different from ActionDescriptor put
	quadRect.putUnitDouble( unitPixels, pxToNumber( layerBounds[1] ) );
	quadRect.putUnitDouble( unitPixels, pxToNumber( layerBounds[2] ) );
	quadRect.putUnitDouble( unitPixels, pxToNumber( layerBounds[3] ) );
	
	var quadCorners = new ActionList();
	for (i = 0; i < 4; ++i)
	{
		quadCorners.putUnitDouble( unitPixels, newCorners[i].fX );
		quadCorners.putUnitDouble( unitPixels, newCorners[i].fY );
	}
	args.putList( krectangleStr, quadRect );
	args.putList( kquadrilateralStr, quadCorners );
	executeAction( eventTransform, args );
	
	// Deselect
	deselArgs = new ActionDescriptor();
	deselRef = new ActionReference();
	deselRef.putProperty( classChannel, keySelection );
	deselArgs.putReference( keyNull, deselRef );
	deselArgs.putEnumerated( keyTo, typeOrdinal, enumNone );
	executeAction( eventSet, deselArgs );
	app.preferences.rulerUnits = saveUnits;
}

const kAlignAuto			= "Auto";
const kAlignCylindrical	= "cylindrical";
const kAlignSpherical	= "spherical";
const kAlignPerspective	= "Prsp";
const kAlignTranslation	= "translation";
const kAlignCollage		= "sceneCollage";

// Convert plain string to the alignment key.
// Avoids clients having to load Terminology.jsx
function stringToAlignmentKey( alignMethod )
{
	// Today's JavaScript lesson:  You can not use the constants above in the table below, because
	// the parser interns the symbol on the left of the ":" into a new ID, whether or not it's already
	// defined in scope.  The new interned symbols only work as object field IDs (table.xyz) not
	// array indicies (table[xyz])
	var table = {"interactive":kinteractiveStr, "Prsp":keyPerspectiveIndex, "Auto":keyAuto, "spherical":ksphericalStr, "cylindrical":kcylindricalStr, "translation":ktranslationStr, "sceneCollage":ksceneCollageStr};
	if (typeof(alignMethod) == "string")
		alignMethod = table[alignMethod];
	return alignMethod;
}

// Align selected layers in the active document by content 
// (uses SIFT registration in Photoshop core)
// Potential DOM FIX
function getActiveDocAlignmentInfo( alignmentKey, doTransform, flagList )
{
	const kUserCancelledError = 8007;

	function getUnitPoint( pointDesc, key )
	{
		var desc = pointDesc.getObjectValue( key );
		var xType = desc.getUnitDoubleType( keyHorizontal ); 
		var yType = desc.getUnitDoubleType( keyVertical );
		var x = desc.getUnitDoubleValue( keyHorizontal );
		var y = desc.getUnitDoubleValue( keyVertical );
		return new TPoint( x, y );
	}

	alignmentKey = stringToAlignmentKey( alignmentKey );

	var layerInfo = new Array();
	var returnInfo = null;
	var projection, numGroups = 1;
	
	// Must match enums in AlignContentInfo.h, AlignContentInfo::transformation_type
	const kXfmAuto			=-1;
	const kXfmProjective	= 0;
	const kXfmCylindrical	= 1;
	const kXfmSpherical		= 2;
	const kXfmTranslate		= 3;
	const kXfmEuclidean		= 4;
	const kXfmSimilarity	= 5;
	const kXfmAffine		= 6;
	const kXfmInteractive	= 7;
	const kXfmReposition	= 8;
	const kSceneCollage		= 9;   // Tries to scene collage based on Projective/Cylindrical/Spherical with a relaxation of allowing rotation and isotropic scaling
	const kProjectiveRd2	= 10;  // projective with two-parameter radial distortion
	const kSphericalFisheye = 11;
	
	try {
		var saveUnits = app.preferences.rulerUnits;
		app.preferences.rulerUnits = Units.PIXELS;

		var i,j, desc = new ActionDescriptor();
		var result, ref = new ActionReference();
		ref.putEnumerated( classLayer, typeOrdinal, enumTarget );
		desc.putReference( typeNULL, ref );
		desc.putEnumerated( keyUsing, typeAlignDistributeSelector, kADSContentStr );
		if (alignmentKey)
			desc.putEnumerated( keyApply, kprojectionStr, alignmentKey );
		if ((typeof(doTransform) != "undefined") && doTransform)
			desc.putBoolean( kgeometryRecordStr, true );
		else
			desc.putBoolean( kgeometryOnlyStr, true );
			
		// Set any flags passed in (highQuality, lensCorrection, etc.)
		if ((typeof(flagList) != "undefined") && (flagList.length > 0))
			for (i in flagList)
				desc.putBoolean( flagList[i], true );

		result = executeAction( keyAlignment, desc, DialogModes.NO );
		
//		projection = result.getEnumerationValue( kprojectionStr );
		if (result.hasKey( kgroupStr ))
			numGroups = result.getInteger( kgroupStr );

		// Pick apart the data returned by the alignment engine.
		// Clues are found in ULayerCommand.cpp, PostLayoutCommand.
		var layerList = result.getList( klayerTransformationStr );
		for (i = 0; i < layerList.count; ++i)
		{
			var layerXformDesc = layerList.getObjectValue( i );
			var layerID = layerXformDesc.getInteger( klayerIDStr );
			var groupNum = layerXformDesc.getInteger( kgroupStr );
			// Note xformType here is the xform actually used (vs. what was requested)
			var xformType = layerXformDesc.getInteger( ktransformStr );	
			var baseFlag = layerXformDesc.hasKey( kignoreStr ) ? layerXformDesc.getBoolean( kignoreStr ) : false;
			var pts = new Array();
			// JavaScript note 1: ignore the ":1"s below, it's just a way to get a set membership test.
			// JavaScript note 2: Using symbolic constants for this fails.
//			if (xformType in {kXfmProjective:1, kXfmTranslate:1, kXfmEuclidean:1, kXfmSimilarity:1, kXfmAffine:1, kXfmReposition:1})
			if (xformType in {0:1, 3:1, 4:1, 5:1, 6:1, 8:1})
			{
				var quadType = layerXformDesc.getObjectType( keyTo );
				var quadDescriptor = layerXformDesc.getObjectValue( keyTo );
				pts[0] = getUnitPoint( quadDescriptor, kquadCorner0Str );
				pts[1] = getUnitPoint( quadDescriptor, kquadCorner1Str );
				pts[2] = getUnitPoint( quadDescriptor, kquadCorner2Str );
				pts[3] = getUnitPoint( quadDescriptor, kquadCorner3Str );
			}
			// Note we depend on stackElement's order matching the sheet list.
			layerInfo[i] = {"baseFlag":baseFlag, "corners":pts, "groupNum":groupNum, "layerID":layerID, "xformType":xformType};
		}
	}
	catch (e) 
	{
		app.preferences.rulerUnits = saveUnits;
		numGroups = 0;
		if (e.number == kUserCancelledError)
			throw e;
	}
	app.preferences.rulerUnits = saveUnits;
	if (numGroups == 0)
		return null;
	else
		return {"numGroups":numGroups, "layerInfo":layerInfo}
}

// Convert a 32 bit HDR document to eight bit (brings up the dialog)
// Potential DOM FIX						   
function convertFromHDR( newDepth )
{
	args = new ActionDescriptor();
	args.putInteger( keyDepth, newDepth );
	executeAction( eventConvertMode, args, DialogModes.ALL );
}

// Convert a 32 bit HDR document to eight bit (brings up the dialog)
// Potential DOM FIX						   
function convertFromHDRNoDialog( newDepth, srcDesc )
{
	function descCopyNum( key )
	{
		toneDesc.putDouble( key, srcDesc.getDouble( key ));
	}

    function descCopyFlag( key )
    {
        toneDesc.putBoolean( key, srcDesc.getBoolean( key ));
    }

	args = new ActionDescriptor();
	args.putInteger( keyDepth, newDepth );
	
	var toneDesc = new ActionDescriptor();
	
	toneDesc.putInteger( kversionStr, 4 );

	var method = srcDesc.getInteger( kmethodStr );
	switch (method)
	{
		// Methods provided from the Dept. of Mismatched Constants.
		case 0:	// kHighlightCompression
		{
			toneDesc.putEnumerated( keyMethod, khdrToningMethodTypeStr, khdrToningType1Str );
			break;
		}
			
		case 2:	// kEqualizeHistogram
		{
			toneDesc.putEnumerated( keyMethod, khdrToningMethodTypeStr, khdrToningType3Str );
			break;
		}
			
		case 1:	// kExposureAndGamma
		{
			toneDesc.putEnumerated( keyMethod, khdrToningMethodTypeStr, khdrToningType2Str );
			descCopyNum( kgammaStr );
			descCopyNum( kexposureStr );
			break;
		}
			
		case 3:	// kLocalAdaptation
		{
			toneDesc.putEnumerated( keyMethod, khdrToningMethodTypeStr, khdrToningType4Str );
			
			// Need special case handling for kexposure
			descCopyNum( kradiusStr );
			descCopyNum( kthresholdStr );
			descCopyNum( ksaturationStr );
			descCopyNum( kvibranceStr );
			descCopyNum( kdetailStr );
			descCopyNum( kshallowStr );
			descCopyNum( khighlightsStr );
			descCopyNum( kcontrastStr );
			descCopyNum( kbrightnessStr );
			descCopyFlag( ksmoothStr );
			
             // Copy the toning curve as well
             var srcCurve = srcDesc.getObjectValue( kclassContour );
             var srcCurvePts = srcCurve.getList( keyCurve );
			
			var pointList = new ActionList();
			var i, curveDesc = new ActionDescriptor()
			curveDesc.putString( keyName, "Default" );
            
             for (i = 0; i < srcCurvePts.count; ++i)
             {
                 var srcPt = srcCurvePts.getObjectValue(i);
                 var ptDesc = new ActionDescriptor();
                 ptDesc.putDouble( keyHorizontal, srcPt.getDouble( keyHorizontal ) );
                 ptDesc.putDouble( keyVertical, srcPt.getDouble( keyVertical ) );
                 ptDesc.putBoolean( keyContinuity, srcPt.getBoolean( keyContinuity ) );
                 pointList.putObject( classCurvePoint, ptDesc );
             }
 
			curveDesc.putList( keyCurve, pointList );
			toneDesc.putObject( kclassContour, classShapingCurve, curveDesc );
			break;
		}
	}

	args.putObject( keyWith, khdrOptionsStr, toneDesc );
	executeAction( eventConvertMode, args, DialogModes.NO );
}

// Use the core graph-cut facility to merge the layers.  Assumes
// layers to be merged are selected.
// Potential DOM FIX
function advancedMergeLayers()
{
	executeAction( kmergeAlignedLayersStr, undefined, DialogModes.NO );
}

// Select all of the layers, except the one named pluginName.  
// Currently the DOM only allows for a single layer selected at one time.
// Potential DOM FIX
function selectAllLayers(doc, upToLayer)
{
	var i;
	app.activeDocument = doc;
	// Select the first layer...
	doc.activeLayer = doc.layers[0];
	
	var desc = new ActionDescriptor();
	var ref = new ActionReference();
	if (typeof(upToLayer) == 'undefined')
		upToLayer = 1;
	// Note - the event indexing is the -reverse- of the JavaScript indexing,
	// so "2" refers to the next to the last.
	ref.putIndex( classLayer, upToLayer );
	desc.putReference( typeNULL, ref );
	desc.putEnumerated( kselectionModifierStr, kselectionModifierTypeStr, kaddToSelectionContinuousStr );
	desc.putBoolean( keyMakeVisible, false );
	executeAction( eventSelect, desc, DialogModes.NO );
}

// Select one layer.  Native JS is broken if multiple layers are
// already selected. 
// Potential DOM FIX
function selectOneLayer(doc, layer)
{
	app.activeDocument = doc;
	if (typeof(layer) != "string")
		layer = layer.name;
	var desc = new ActionDescriptor();
	var ref = new ActionReference();
	ref.putName( classLayer, layer );
	desc.putReference( typeNULL, ref );
	desc.putBoolean( keyMakeVisible, false );
	executeAction( eventSelect, desc, DialogModes.NO );
}

// Align selected layers by content (uses SIFT registration in Photoshop core)
// Potential DOM FIX
function alignLayersByContent( alignMethod )
{
	var desc = new ActionDescriptor();
	var ref = new ActionReference();
	
	alignMethod = stringToAlignmentKey( alignMethod );
	if (! alignMethod)
		alignMethod = keyPerspectiveIndex;

	ref.putEnumerated( classLayer, typeOrdinal, enumTarget );
	desc.putReference( typeNULL, ref );
	desc.putEnumerated( keyUsing, typeAlignDistributeSelector, kADSContentStr );
	desc.putEnumerated( keyApply, kprojectionStr, alignMethod );
		
	executeAction( keyAlignment, desc, DialogModes.NO );
}

// Invoke the graph-cut based blending method
// Potential DOM FIX
function graphCutMergeLayers()
{
	var desc = new ActionDescriptor();
	var ref = new ActionReference();
	ref.putEnumerated( classLayer, typeOrdinal, enumTarget );
	desc.putReference( typeNULL, ref );
	executeAction( kmergeAlignedLayersStr, desc, DialogModes.NO );
}

// This is sleazy - check if a char/string ID is present by seeing if
// a "new" one is made when we ask for it.
// Note *THIS ONLY WORKS ONCE*.  The second time it's called, it'll report
// the ID as valid even if it's not, since the act of testing it defines it.

function isIDDefined(idStr)
{
	var d = new Date();
	var bogusID = app.stringIDToTypeID( "s" + d.getTime().toString() );
	var testID = app.stringIDToTypeID( idStr );
	// If bogus and test are one apart, then they both defined new IDs.
	// Otherwise, the ID already existed.
	return !(testID - bogusID == 1)
}