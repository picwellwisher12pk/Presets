// (c) Copyright 2006-2007  Adobe Systems, Incorporated.  All rights reserved.

/*
@@@BUILDINFO@@@ CreateImageStack.jsx 1.0.0.1
*/

//
// Prototype classes for creating image stacks.
//

// on localized builds we pull the $$$/Strings from a .dat file
$.localize = true;

// Note: this file assumes StackSupport.jsx has been previously evalFile'd.

const kUserCanceledError = 8007;
const kFilesFromPMLoad = 1233;
const kErrTempDiskFull = -25010; // happens when scratch disk is full

/************************************************************/
// StackElement class.
//
// A StackElement is the ES equivalent of "PSPiece", and holds
// all the info need to pass the document's metadata to the filter plugin
//

// Constructor
function StackElement( f )
{
	this.fAlreadyOpen = false;
	this.fExistingLayer = null;
	this.fPSDoc = null;
	this.fViewlessDoc = null;
	this.fExposure = 0.0;
	this.fAperture = 0.0;
	this.fLightroomDocID = null;
	this.fLightroomOpenParams = null;
	this.fLightroomSaveParams = null;
	this.fLightroomBridgeTalkID = null;
	this.fISOValue = 0;
	this.fCameraID = "UNKNOWN_CAMERA";

	// Check to see if we're passed an existing layer instead of a file.
	if ((typeof(f) == "object") 
		&& (typeof(f.typename) != "undefined") 
		&& (f.typename == "ArtLayer"))
	{
		this.fName = f.name;
		this.fFullName = f.name;
		this.fAlreadyOpen = true;
		this.fExistingLayer = f;
		return;
	}

	this.file = f;
	this.fName = decodeURI(f.name);
	this.fFullName = this.file.path + "/" + this.file.name;

	// Keep track of documents that were already open, so we don't close them
	var i;
	for (i = 0; i < app.documents.length; ++i)
	{
		var curName = null;
		try {
			// This fails if it's not saved.
			curName = app.documents[i].fullName;
		}
		catch (err) {
			continue;
		}
		if ((this.fFullName) == curName)
		{
			// Must also set these here, because silentOpen isn't called.
			this.setDocParams( app.documents[i] );
			this.fAlreadyOpen = true;
			break;
		}
	}
}

StackElement.prototype.setDocParams = function( srcDoc )
{
	this.fPSDoc = srcDoc;
	this.fWidth = this.fPSDoc.width.as("px");	
	this.fHeight= this.fPSDoc.height.as("px");
}

// The standard open insists on a dialog, so we roll our own.
StackElement.prototype.silentOpen = function( linearizeCameraRaw, useViewlessDoc )
{
	const eventOpen				= app.charIDToTypeID('Opn ');
	const keyCamRawReadLinear	= app.charIDToTypeID('EmCr');
	const kReadLinearRegEntry	= "EM_CR_ReadLinearCameraDataEntry";
	
	// Need to set registry Entry EM_CR_ReadLinearCameraDataEntry, key 'EmCr',
	// to "true" during the open, then set it back to "false" afterwords, 
	// so Camera Raw linearizes luminance parameters and does not auto-correct (or prompt!) for them
	function setCamRawLinearFlag( flagvalue )
	{
		var crDesc = new ActionDescriptor();
		crDesc.putBoolean( keyCamRawReadLinear, flagvalue );
		app.putCustomOptions( kReadLinearRegEntry, crDesc, false );
		if (! flagvalue)
			app.eraseCustomOptions( kReadLinearRegEntry );	// Really nuke it
	}

	function cleanupCamRawFlags()
	{
		setCamRawLinearFlag( false );
		setUseCameraRawJPEGPreference( savedCamRawJPEGPreference )
	}

	// Just return it if it's already open
	if (this.fAlreadyOpen)
		return this.fPSDoc;
		
	// Don't attempt the viewless doc trick if opening from Lightroom (yet)
	if (this.fLightroomDocID || this.fLightroomOpenParams)
		useViewlessDoc = false;

	var status, oldActiveDoc = (app.documents.length > 0) ? app.activeDocument : null;
	var savedCamRawJPEGPreference = getUseCameraRawJPEGPreference();
	var desc = new ActionDescriptor();
	desc.putPath( typeNULL, new File( this.file ) );
	desc.putBoolean( kpreferXMPFromACRStr, true );

	try {
		if (linearizeCameraRaw)
		{
			setCamRawLinearFlag( true );
			setUseCameraRawJPEGPreference( false );
		}
		if (this.fLightroomDocID || this.fLightroomOpenParams)
		{
			status = photoshop.openFromLightroom( this.file, this.fLightroomOpenParams,
												  this.fLightroomDocID, this.fLightroomBridgeTalkID,
												  this.fLightroomSaveParams, DialogModes.NO );
		}
		else
		{
			if (useViewlessDoc)
			{
				this.fPSDoc = openViewlessDocument( this.file );
				if (this.fPSDoc)
				{
					// Basically, if this is anything but a vanilla JPEG
					// or Camera Raw file, then bail now and open it the
					// old-fashioned way below.
					if ((this.fPSDoc.mode != DocumentMode.RGB)
						|| (this.fPSDoc.layerCount != 1)
						|| (! this.fPSDoc.isSimple)
						|| (this.fPSDoc.activeLayer.kind != LayerKind.NORMAL)
						|| (app.activeDocument.bitsPerChannel != this.fPSDoc.bitsPerChannel))
					{
						this.fPSDoc.close();
					}
					else
					{
						this.setDocParams( this.fPSDoc );
						cleanupCamRawFlags();
						return this.fPSDoc;
					}
				}
			}
		
			// Viewless didn't work out; do it the old way
			status = executeAction( eventOpen, desc, DialogModes.NO );
		}
		// On normal open status has a typeNULL key, but if it fails, it's
		// empty.  This seems to be our only clue you've whacked the escape key.
		if (status.count == 0)
			throw Error( kUserCanceledError );
	}
	catch (err)
	{
		cleanupCamRawFlags();
		if (err.number == kErrTempDiskFull) {
			this.scratchDiskFullAlert();
			throw err;
		}
		else if (err.number == kUserCanceledError)
			throw err;
		return null;
	}
	
	cleanupCamRawFlags();

	// Check to see if the open failed (this is the only way??)
	if ((app.documents.length == 0) || (oldActiveDoc == app.activeDocument))
		return null;
		
	this.setDocParams( app.activeDocument );	
	return this.fPSDoc;
}

// reuse "^0" string as extendScript "%1" string
StackElement.prototype.scratchDiskFullAlert = function()
{
	alert(localize("$$$/Err/Mesaba/SpillSuite/DiskFull=There is not enough space on the scratch disk."));
}


// Close a StackElement document -unless- it was already open before
// the stacking process started.  The goal of the script is to leave everything
// the way it was before running, so if a window was open (fAlreadyOpen == true)
// leave it that way.
StackElement.prototype.closeDocIfNotAlreadyOpen = function ()
{
	if (this.fPSDoc && (! this.fAlreadyOpen))
	{
		this.fPSDoc.close(SaveOptions.DONOTSAVECHANGES);
		// After a window closes, the FrontDocument (aka app.activeDocument) is
		// set to NULL until the activate event for the next doc window in the stack is
		// processed.  If windows are not open as tabs, this won't happen until the script
		// is done, so we explictly process a redraw to force the next Window to be
		// activated.
		WaitForPhotoshopRedraw();
		if (app.documents.length > 0)
		{
			const kFailMax = 4;
			var failures = 0;
			var frontDocIsReady = false;
			while (! frontDocIsReady)
			{
				try {
					app.activeDocument;  // If this fails, then the activation event hasn't happened yet.
					frontDocIsReady = true;
				}
				catch (err)
				{
					failures++;
					if (failures > kFailMax)	// Avoid infinite loop.
						throw err;
					WaitForPhotoshopRedraw();
					$.sleep(100);
				}
			}
		}
		this.fPSDoc = null;
	}
}

// Stash the document's XMP data
StackElement.prototype.setupXMPData = function ()
{
	if (this.fExistingLayer)
	{
		// XMP Metadata on layers is....strange.
		try {
			this.xmpMetadata = this.fExistingLayer.xmpMetadata.rawData;
		}
		catch (err)
		{
			this.xmpMetadata = null;
		}
	}
	else
	{
		if (this.fPSDoc.xmpMetadata != undefined)
			this.xmpMetadata = this.fPSDoc.xmpMetadata.rawData;
	}
}

StackElement.prototype.setupEXIFDataFromXMP = function()
{

	this.fExposure = getXMPTagFromXML( "ExposureTime", this.xmpMetadata, true );
	this.fISOValue = getXMPTagFromXML( "ISOSpeedRatings", this.xmpMetadata, true );
	var make = getXMPTagFromXML( "Make", this.xmpMetadata, false );
	this.fCameraID = make + '-' + getXMPTagFromXML( "Model", this.xmpMetadata, false );
	this.fAperture = getXMPTagFromXML( "ApertureValue", this.xmpMetadata, true );
	if (this.fAperture == 0.0)
		this.fAperture = getXMPTagFromXML( "FNumber", this.xmpMetadata, true );
	
	// Some cheap lenses report bogus aperture values that overlow the math
	// An Aperture of zero is explictly ignored by Merge to HDR
	if ((this.fAperture < 0.8) || (this.fAperture > 128.0))
		this.fAperture = 0;
		
	// Stash the text now, so we have it when the document
	// is closed in PS and fPSDoc is no longer available
	this.fString = this.toString();
}

// Stash the document's EXIF data, cleaning it up as we go.
StackElement.prototype.setupEXIFData = function ()
{
	// From ExifTags.h
	const EXIFTAG_ISOSPEEDRATINGS 			= 34855;
	const EXIFTAG_FNUMBER 					= 33437;
	const EXIFTAG_APERTUREVALUE				= 37378;
	const EXIFTAG_EXPOSURETIME 				= 33434;
	const EXIFTAG_SHUTTERSPEEDVALUE			= 37377;
	const EXIFTAG_MAKE						= 271;
	const EXIFTAG_MODEL						= 272;
	const EXIFTAG_SOFTWARE					= 305;

	// Shutter speeds are given in "convenient" units, but
	// they should really be powers of 2 (i.e., 1/500 -> 1/512)
	// On fancy cameras, long times have 1/3 stop intervals, which work
	// out to 2^((1/3)*i) steps.  We've included a few of these that
	// would be egregiously wrong otherwise.
	var shutterSrc = [ 1/8000.0, 1/4000.0, 1/2000.0, 1/1000.0, 1/500.0, 1/250.0, 1/125.0, 1/60.0, 1/30.0, 1/15.0, 6.0,    13.0,    15.0, 20.0,    25.0,    30.0, 60.0];
	var shutterDst = [ 1/8192.0, 1/4096.0, 1/2048.0, 1/1024.0, 1/512.0, 1/256.0, 1/128.0, 1/64.0, 1/32.0, 1/16.0, 6.3496, 12.6992, 16.0, 20.1587, 25.3984, 32.0, 64.0];
	// Likewise, fStops are given in "convenient" units, but are really sqrt(2^i) steps.
	var srcfStop = [ 1.0, 1.4, 2.0, 2.8, 4.0, 5.6, 8.0, 11.0, 16.0, 22.0, 32.0, 45.0, 64.0 ];
	var dstfStop = [];	// Set up below as f[i] = sqrt(2^i)
	
	function fixValue( x, src, dst )
	{
		var j;
		for (j in src)
			if (src[j] == x) return dst[j];
		return x;	// No match
	}

	// Must pass in the exifData as a param, because nested function can't see "this"
	function parseExifNum( exifKey, regexp, exifTable )
	{
		if (exifKey in exifTable)
		{
			var value = eval(exifTable[exifKey].match(regexp)[1]);
			// Weed out bogus values from certain Nokia camera phones
			if ((value < 0) || (value < 0.0000001))
				return 0;
			return eval(exifTable[exifKey].match(regexp)[1]);
		}
		else
			return 0;
	}
	
	function exifString( exifKey, exifTable )
	{
		if (exifKey in exifTable)
			return exifTable[exifKey];
		else
			return "";
	}
	
	// Skip if no EXIF data
	if (this.fPSDoc.info.exif[0] != undefined)
	{
		var i;
		for (i in srcfStop)
			dstfStop[i] = Math.sqrt(Math.pow( 2.0, i ));
	
		// Extract the EXIF data into an asssociative array
		this.exifData = new Array();
		var p;
		for (p in this.fPSDoc.info.exif)
			this.exifData[this.fPSDoc.info.exif[p][2]] = this.fPSDoc.info.exif[p][1];

		// Minolta only supports shutter speed
		if (typeof(this.exifData[EXIFTAG_EXPOSURETIME]) != "undefined")
			this.fExposure = fixValue( parseExifNum(EXIFTAG_EXPOSURETIME,		/([-\d\/.]+)/,  this.exifData), shutterSrc, shutterDst );
		else
			this.fExposure = fixValue( parseExifNum(EXIFTAG_SHUTTERSPEEDVALUE,	/([-\d\/.]+)/,  this.exifData), shutterSrc, shutterDst );

		this.fISOValue = 			   parseExifNum(EXIFTAG_ISOSPEEDRATINGS,	/(\d+)/, 		 this.exifData );
		
		this.fCameraID	= exifString( EXIFTAG_MAKE, this.exifData ) + "-" 
							+ exifString( EXIFTAG_MODEL, this.exifData );
	
		// Aperture is messy.  Not all cameras report both, and Photoshop trashes the
		// aperture value back into an F-Number, even though it's not.
		if (typeof(this.exifData[EXIFTAG_APERTUREVALUE]) != "undefined")
			this.fAperture = parseExifNum( EXIFTAG_APERTUREVALUE, /\D*([\d.]+)/, this.exifData);
		else
			this.fAperture = fixValue( parseExifNum(EXIFTAG_FNUMBER,			/\D*([\d.]+)/, this.exifData), srcfStop, dstfStop );
		
		// Some cheap lenses report bogus aperture values that overlow the math
		// An Aperture of zero is explictly ignored by Merge to HDR
		if ((this.fAperture < 0.8) || (this.fAperture > 128.0))
			this.fAperture = 0;

		// This conversion (from F-Number to Aperture) is only needed because Photoshop
		// insists on doing the inverse (a to f) conversion before it reports the "aperture"
		if (this.fAperture != 0.0)
			this.fAperture = Math.log(this.fAperture) / Math.log(Math.sqrt(2));
	}

	// Stash the text now, so we have it when the document
	// is closed in PS and fPSDoc is no longer available
	this.fString = this.toString();
}

// Add this stackElement as a layer in document "stack"
StackElement.prototype.stackLayer = function ( stack )
{
	function suspendedAction()
	{
		if (app.activeDocument.layers.length > 1)
			app.activeDocument.flatten();
		
		app.activeDocument.activeLayer.duplicate( stack );
	}

	this.setupXMPData();

	// Check to see if the document is regular DOM doc, or a viewless one
	if (typeof(this.fPSDoc.viewlessDocPtr) == "undefined")
	{
		this.setupEXIFData();
		
		app.activeDocument = this.fPSDoc;
		// Keep any flattening out of this history list, so document stays as-is
		app.activeDocument.suspendHistory( "temp", "suspendedAction()" );
		undoLastEvent();
		
		app.activeDocument = stack;
		app.activeDocument.activeLayer.name = this.fName;
		// On the Mac, the assignment pre-composes the name, so we need to get
		// back the pre-composed name so they match later on.
		this.fName = app.activeDocument.activeLayer.name;
		
		// save the per layer XMP metadata
		app.activeDocument.activeLayer.xmpMetadata.rawData = this.xmpMetadata;
			
		this.closeDocIfNotAlreadyOpen();
	}
	else	// Viewless documents are handled differently
	{
		app.activeDocument = stack;
		this.setupEXIFDataFromXMP();
		this.fPSDoc.addToActiveDocument();
	}
}

// Return a string representation of this StackElement
StackElement.prototype.toString = function()
{
	var i, result = '';
	if (Object.isValid(this.fPSDoc))
	{
		var docValues = { 'fAspectRatio':this.fPSDoc.pixelAspectRatio.toString().match(/[\d.]+/),
				 	 	  'fDepth':(this.fPSDoc.bitsPerChannel == BitsPerChannelType.SIXTEEN) ? 16 : 8 };
		for (i in docValues)
			result += i + '=' + docValues[i] + '\t';
	}
	var exifValues = [ 'fWidth', 'fHeight', 'fExposure', 'fAperture', 'fISOValue', 'fCameraID' ];
	for (i in exifValues)
		result += exifValues[i] + '=' + this[exifValues[i]] + '\t';
	result += 'fName' + '=' + encodeURI(this.fName) + '\t';
	result += 'fFullName=' + encodeURI(File(this.fFullName).fsName) + '\t';
	return result + '\n';
}

//
// Extend StackElements to know about quad corners
//
// WARNING:  Geometry.jsx must be loaded to use these methods!
//

StackElement.prototype.getBounds = function()
{
	var i;
	if (typeof(this.fCorners) == "undefined")
		return new TRect( 0, 0, this.fWidth, this.fHeight );
	
	return new TRect( this.fCorners );
}

StackElement.prototype.setCornersToSize = function()
{
	this.fCorners = [new TPoint(0,0), new TPoint(this.fWidth, 0),
						new TPoint(this.fWidth, this.fHeight), new TPoint( 0, this.fHeight) ];
}

StackElement.prototype.offset = function( delta )
{
	var i;
	for (i = 0; i < this.fCorners.length; i++)
		this.fCorners[i] = this.fCorners[i] + delta;
}

StackElement.prototype.scale = function( s )
{
	var i;
	for (i = 0; i < this.fCorners.length; ++i)
		this.fCorners[i] *= s;
}

StackElement.prototype.transform = function()
{
	// Need to make active layer first... (obvious line broken if mulitple layers selected)
//	app.activeDocument.activeLayer = app.activeDocument.layers[this.fName];
	selectOneLayer( app.activeDocument, this.fName );
	transformActiveLayer( this.fCorners );
}

/************************************************************/
// ImageStackCreator routines
//
// The ImageStackCreator is a base class for a number of objects (e.g. Photomerge,
// Merge to HDR, Load Files into Stack, etc.) creating a document with layers
// read from individual files.

// Container object
function ImageStackCreator( stackName, newDocName, introText )
{
	this.pluginName		= stackName; 
	this.untitledName	= newDocName;
	this.hdrDocNum		= 0;
	this.introText = typeof(introText) == "string" ? introText : null;
	this.stackElements	= null;
	this.hideAlignment	= false;
	this.gaveWarning = {"32bit": false, "multichannel": false, "rawmod": false, "smartobj": false, "3D":false };
	// Hook for dialog setup before the dialog is shown
	this.customDialogSetup = function( dialog ) {};
	// Hook for collecting arguments after "OK" is clicked
	this.customDialogFunction = function( dialog ) {};
	// Hook for passing additional parameters into the plugin
	this.customPluginArguments = function( desc ) {};
	this.stackDoc = null;
	this.useAlignment	 = false;
	this.runningFromBridge = false;
	this.linearizeCamRawFiles = false;
	this.stackDepthChanged = false;
	this.allowLayeredDocument = false;
	this.useLayeredDocument = false;
	this.exposureMetadataValid = true;
	this.outputClonedFromFirstFile = true;
	this.saveColorProfileType = null;
	this.saveColorProfileName = null;

	// These flags control what the stack creator will and won't accept.
	// Defaults are for Merge to HDR
	this.mustBeSameSize			= true;	// Images' height & width must match
	this.mustBeUnmodifiedRaw	= true;	// Exposure adjustements in Camera raw are not allowed
	this.mustNotBe32Bit			= true;	// No 32 bit images
	this.mustNotBeSmartObj		= true;	// No smart objects
	this.mustNotBe3D				= true;	// No 3D
}


// Since hdrDocNum is not saved session to session, look at the open documents
// and pick something that's higher than any other untitledName docs open.
ImageStackCreator.prototype.newDocName = function ()
{
	var i;

	for (i = 0; i < app.documents.length; ++i)
	{
		var m = app.documents[i].name.match(eval( "/" + this.untitledName + "([0-9]+)/" ));
		if (m && m[1] > this.hdrDocNum)
			this.hdrDocNum = m[1];
	}
	return this.untitledName + String(++this.hdrDocNum);
}

// Display alerts encountered while stacking files.
// Note all warning text is prefixed with the pluginName
ImageStackCreator.prototype.giveWarning = function( flag, warning, errorIcon )
{
	if (typeof(errorIcon) == "undefined")
		errorIcon = true;
	if (! this.gaveWarning[flag])
	{
		alert( this.pluginName + localize(warning), this.pluginName, errorIcon );
		this.gaveWarning[flag] = true;
	}
}

// Check the mode of the document to make sure it's compatible with the subclass
ImageStackCreator.prototype.checkMode = function( doc )
{
	// Check for any changes introduced by Camera raw.  Must
	// check here while we still have access to the document
	function hasCamRawChanges(doc)
	{
		function hasCRsetting(doc, tag)
		{
			var xmpStr = doc.xmpMetadata.rawData;
			var tagRE = eval( "/<crs:" + tag + ">([-+\\d.]+)</m" );
			var result = xmpStr.match(tagRE);
			if (result)
				return result[1] != 0;
			else
				return false;	// No flag, assume OK (i.e., JPEG file)
		}
	
		// Check for the crs:AlreadyApplied flag.  If it's false, then
		// the pixels are still unmolested by ACR and the settings are
		// ignored when the file is read.
		var alreadyApplied = doc.xmpMetadata.rawData.match(/<crs:AlreadyApplied>\s*([tTrufFalse]+)</m);
		if (alreadyApplied && !eval(alreadyApplied[1].toLowerCase()))
			return false;	// Flag is "false", so ACR settings will be ignored.
		
		// These tags are always in English
		var crsFlags = ["Exposure", "Shadows", "Brightness", "Contrast", "FillLight", "HighlightRecovery"];
		var i;
		for (i in crsFlags)
			if (hasCRsetting( doc, crsFlags[i] ))
				return true;
		return false;
	}

	// Note: All the false (rejection) clauses must come before true ones.
	if (this.mustNotBe32Bit && (doc.bitsPerChannel == BitsPerChannelType.THIRTYTWO))
	{
		this.giveWarning( "32bit", "$$$/AdobePlugin/Shared/Exposuremerge/Auto/EMNo32bit= can not merge 32 bit source files.  They will be skipped");
		return false;
	}
	
	if (this.mustNotBeSmartObj && (doc.activeLayer.kind == LayerKind.SMARTOBJECT))
	{
		this.giveWarning( "smartobj", "$$$/AdobePlugin/Shared/Exposuremerge/Auto/NoSmartObj= can not merge Smart Object documents.  They will be skipped");
		return false;
	}

	if (this.mustNotBe3D && (doc.activeLayer.kind == LayerKind.LAYER3D))
	{
		this.giveWarning( "3D", "$$$/AdobePlugin/Shared/Exposuremerge/Auto/No3DObj= can not merge 3D documents.  They will be skipped");
		return false;
	}
	
	if (this.mustBeUnmodifiedRaw && hasCamRawChanges(doc))
	{
		this.giveWarning( "rawmod", "$$$/AdobePlugin/Shared/Exposuremerge/CamRawChange=: Files converted from Camera Raw format may lose dynamic range.  For best results, merge the original Camera Raw files.", false );
		this.exposureMetadataValid = false;
	}

	// Other conversions happen on layer copy, but these need explicit handling
	if (doc.mode == DocumentMode.MULTICHANNEL)
	{
		this.giveWarning("multichannel", "$$$/AdobePlugin/Shared/Exposuremerge/Auto/EMNoMultichannel= cannot process multichannel images. They will be converted to RGB.", false );
		doc.changeMode( ChangeMode.RGB );
	}
	
	if (doc.mode == DocumentMode.INDEXEDCOLOR)
		doc.changeMode( ChangeMode.RGB );
	
	if (doc.mode == DocumentMode.BITMAP)
		doc.changeMode( ChangeMode.GRAYSCALE );
	
	return true;
}

// Create a layer stack from the activeDocument
ImageStackCreator.prototype.createStackFromLayeredDoc = function()
{
	function compareLayerSize( a )
	{
		// bounds rect is [left, top, right, bottom]
		function diff(layer, i0, i1 )
		{
			return Number(layer.bounds[i0]) - Number(layer.bounds[i1]);
		}
		// Compare widths and heights
		return (diff(a,2,0) == app.activeDocument.width) && (diff(a,3,1) == app.activeDocument.height);
	}

	// Most of the code depends on a "dummy" extra layer.
	var aLayers = app.activeDocument.artLayers;
	aLayers.add();
	aLayers[0].name = this.pluginName;
	aLayers[0].move( aLayers[aLayers.length-1], ElementPlacement.PLACEAFTER );

	this.stackElements = new Array();
	var numUsedLayers = app.activeDocument.layers.length - 1;
	
	this.saveColorProfileType = app.activeDocument.colorProfileType;
	if ((this.saveColorProfileType == ColorProfile.CUSTOM)
		|| (this.saveColorProfileType == ColorProfile.WORKING))
		this.saveColorProfileName = app.activeDocument.colorProfileName;

	// List is built in reverse order to match the original code
	for (s = numUsedLayers-1; s >= 0; s--)
	{
		selectOneLayer( app.activeDocument, app.activeDocument.layers[s] );
		if (! this.checkMode( app.activeDocument ))
			continue;
			
		if (this.mustBeSameSize 
			&& !compareLayerSize(app.activeDocument.activeLayer ))
		{
			alert(localize("$$$/AdobePlugin/Shared/ExposureMerge/Auto/SameSize=Images to be merged must be the same size"), this.pluginName, true );
			continue;
		}
				
		var stackItem = new StackElement( app.activeDocument.layers[s] );
		stackItem.setDocParams( app.activeDocument );
		stackItem.setupXMPData();
		stackItem.setupEXIFDataFromXMP();
		this.stackElements.push( stackItem );
	}

	if (this.stackElements.length < 2)
	{
		this.stackElements = null;
		return false;
	}
	else
		return true;
}
	
// Align the images in the stack.  Override this if you need to customize it.
ImageStackCreator.prototype.alignStack = function( stackDoc )
{
	// Tell it to extend the select to the next to the last
	// (last layer is the merge result, we don't want that selected)
	selectAllLayers(stackDoc, 2);
	alignLayersByContent();
}

// Load the stack elements in this.stackElements into a layered document
ImageStackCreator.prototype.loadStackLayers = function( stackBitsPerChannel )
{
	var bridgeFilesAlertGiven = false;
	var i;

	var colorDialogs = [kaskMismatchOpeningStr, kaskMismatchPastingStr, kaskMissingStr];
	var dialogSettings = [];
	var colorSettingsName = null;

	// Note: in order to avoid dialogs poppping up, the color
	// dialogs are forced off
	function pushColorProfileDialogSettings()
	{
		colorSettingsName = getColorProfileDialogSetting( keyName, "String" );
		var i;
		for (i in colorDialogs)
		{
			dialogSettings.push( getColorProfileDialogSetting( colorDialogs[i] ) );
			setColorProfileDialogSetting( colorDialogs[i], false );
		}
	}

	// Restore dialog settings
	function popColorProfileDialogSettings()
	{
		var i;
		for (i in colorDialogs)
			setColorProfileDialogSetting( colorDialogs[i], dialogSettings[i] );
		if (colorSettingsName)
			setColorProfileDialogSetting( keyName, colorSettingsName, "String" );
	}

	// Close everything before we bail out
	function shutdown(stackElemList)
	{
		var j;
		if (stackDoc)
			stackDoc.close(SaveOptions.DONOTSAVECHANGES);
		for (j = 0; j < stackElemList.length; ++j)
			stackElemList[j].closeDocIfNotAlreadyOpen();
		if (typeof(saveUnits) != 'undefined')
			app.preferences.rulerUnits = saveUnits;
	}
	
	function nullFileAlert(usingBridge, filename, pluginName)
	{
		if (usingBridge)
		{
			if (! bridgeFilesAlertGiven)
			{
				alert(localize("$$$/AdobePlugin/Shared/Exposuremerge/Auto/BRFileSkip=Some files selected in Bridge are not compatible and will be skipped"), pluginName );
				bridgeFilesAlertGiven = true;
			}
		}
		else
			alert(localize("$$$/AdobePlugin/Shared/ExposureMerge/Auto/CantOpen=Unable to open file: ") + filename, pluginName );
	}
	
	try {
		var stackDoc = null;
		this.stackDoc = null;

		// Reverse so layers match load order; (layers go from bottom to top)
		this.stackElements.reverse(); 

		var firstDoc = this.stackElements[0].silentOpen( this.linearizeCamRawFiles, false );
		
		// Ensure the first document is valid
		while ((firstDoc == null) || (! this.checkMode( firstDoc )))
		{
			if (firstDoc == null)
				nullFileAlert( this.runningFromBridge, this.stackElements[0].fName, this.pluginName );
			this.stackElements[0].closeDocIfNotAlreadyOpen();
			this.stackElements = this.stackElements.slice(1);
			if (this.stackElements.length > 1)
				firstDoc = this.stackElements[0].silentOpen( this.linearizeCamRawFiles, false );
			else
				break;
		}	

		if (this.stackElements.length < 2)
		{
			shutdown(this.stackElements);
			return null;
		}

		// Work in pixels
		var saveUnits = app.preferences.rulerUnits;
		app.preferences.rulerUnits = Units.PIXELS;

		// Create the destination stack doc to resemble the first one.
		// If we "add" the document, we can't copy any custom color profiles;
		// so instead we duplicate it, and then throw away the contents.
		app.activeDocument = firstDoc;
		duplicateDocument( this.newDocName() );
		if (this.checkForLightroomGlobals() && this.outputClonedFromFirstFile)
		{
			// Normally, the destination document is duplicated off of firstDoc.  However,
			// if we're driven from Lightroom, firstDoc has all of the magic open/save param magic,
			// and we need that to be the destination document.  So swap the two...
			stackDoc = firstDoc;
			firstDoc = app.activeDocument;
			this.stackElements[0].fPSDoc = firstDoc;
			app.activeDocument = stackDoc;
		}
		stackDoc = app.activeDocument;
		stackDoc.flatten();
		stackDoc.activeLayer.isBackgroundLayer = false;
		stackDoc.activeLayer.clear();
		stackDoc.selection.deselect();		// DOM bug - shouldn't need to do this.
										  
		// The old ADM Photomerge filter plugin needs eight bit data,Lo
		// so if that's requested we force the stack to eight bits
		// and flag this.
		this.stackDepthChanged = false;
		if (typeof( stackBitsPerChannel ) == "undefined")
			stackBitsPerChannel = firstDoc.bitsPerChannel;
		else
			this.stackDepthChanged = firstDoc.bitsPerChannel != stackBitsPerChannel;

		stackDoc.bitsPerChannel = stackBitsPerChannel;
		stackDoc.layers[0].name = this.pluginName;
		
		// MergeToHDR may need this
		this.saveColorProfileType = firstDoc.colorProfileType;
		if ((this.saveColorProfileType == ColorProfile.CUSTOM)
			|| (this.saveColorProfileType == ColorProfile.WORKING))
			this.saveColorProfileName = firstDoc.colorProfileName;

		this.stackElements[0].stackLayer( stackDoc );
		// firstDoc is closed and unavailable after this point

		for (i = 1; i < this.stackElements.length; ++i)
		{
			doc = this.stackElements[i].silentOpen( this.linearizeCamRawFiles, true );
			if (doc == null)		// Open failed
			{
				nullFileAlert( this.runningFromBridge, this.stackElements[i].fName, this.pluginName );
							
				this.stackElements.splice(i,1);
				i -= 1;
				if (this.stackElements.length < 2)
				{
					shutdown(this.stackElements);
					return null;
				}
				continue;
			}
		
			// If the sizes change, bail
			if (this.mustBeSameSize)
			{
				if ((Number(doc.height) != Number(stackDoc.height)) || (Number(doc.width) != Number(stackDoc.width)))
				{
					alert(localize("$$$/AdobePlugin/Shared/ExposureMerge/Auto/SameSize=Images to be merged must be the same size"), this.pluginName, true );
					shutdown(this.stackElements);
					return null;
				}
			}

			// Toss out any files we can't use.
			if (! this.checkMode( doc ))
			{
				this.stackElements[i].closeDocIfNotAlreadyOpen();
				this.stackElements.splice(i,1);
				i -= 1;
				if (this.stackElements.length < 2)
				{
					shutdown(this.stackElements);
					return null;
				}
				continue;
			}
			
			// If the depth doesn't match the dest stack, fix the dest stack
			if ( (!this.stackDepthChanged) &&
				(doc.bitsPerChannel == BitsPerChannelType.SIXTEEN)
				&& (stackDoc.bitsPerChannel == BitsPerChannelType.EIGHT))
			{
				app.activeDocument = stackDoc;
				stackDoc.bitsPerChannel = BitsPerChannelType.SIXTEEN;
			}
			
			// Extend the size of the stackDoc to hold the largest layer encountered
			// (need to do this as we go, because we haven't actually opened the docs until now)
			if ((this.stackElements[i].fWidth > stackDoc.width.as("px"))
				|| (this.stackElements[i].fHeight > stackDoc.height.as("px")))
			{
				var maxw = UnitValue( Math.max( this.stackElements[i].fWidth, stackDoc.width.as("px") ), "px" );
				var maxh = UnitValue( Math.max( this.stackElements[i].fHeight,stackDoc.height.as("px") ), "px" );

				app.activeDocument = stackDoc;
				app.activeDocument.resizeCanvas( maxw, maxh, AnchorPosition.TOPLEFT );
			}

			pushColorProfileDialogSettings();
			this.stackElements[i].stackLayer( stackDoc );
			popColorProfileDialogSettings();
		}

		if (this.useAlignment)
		{
			this.alignStack( stackDoc );
			stackDoc.activeLayer = stackDoc.layers.getByName(this.pluginName);
		}
	
	}
	catch (err)
	{
		if (err.number == kErrTempDiskFull) {
			this.stackElements[0].scratchDiskFullAlert();
			shutdown(this.stackElements);
		} 
		else if (err.number == kUserCanceledError)
			shutdown(this.stackElements);
		return null;
	}
	app.preferences.rulerUnits = saveUnits;
	this.stackDoc = stackDoc;
	return stackDoc;
}

// Set up and call a filter plugin
ImageStackCreator.prototype.invokeFilterPlugin = function( filterPluginID, showDialog )
{
	var args = new ActionDescriptor();
	var i, j, pieceData = '';
	
	// Collect the per-element metadata
	for (i in this.stackElements)
		pieceData += this.stackElements[i].fString;
		
	args.putString( app.charIDToTypeID('EmPs'), pieceData );

	// Custom hook, defined in subclass, for passing additional parameters.
	this.customPluginArguments( args );
	
	try {
		var result = executeAction( app.stringIDToTypeID( filterPluginID ), args, 
									    showDialog ? DialogModes.ALL : DialogModes.NO );
		return result;
	}
	catch (err)
	{
		if (err.number != kUserCanceledError)		// psUserCanceled, as found in CPsError.h, found in the ScriptingSupport plugin sources
			alert(err, this.pluginName, true );

		return null;
	}
	return -1;	// Should never get here
}

// Implement the dialog to collect the files to process.
ImageStackCreator.prototype.stackDialog = function( dialogFilename )
{
	var w = latteUI( g_StackScriptFolderPath + dialogFilename );
	var mergeFiles = new Array();
	var fileSelectStr;
	var fileMenuItem = 		localize("$$$/Project/Exposuremerge/Files/Files=Files");
	var folderMenuItem = 	localize("$$$/Project/Exposuremerge/Files/Folder=Folder");
	var openFilesMenuItem = localize("$$$/Project/Exposuremerge/Files/Open=Open Files");
	var openLayeredDocMenuItem = localize("$$$/Project/Exposuremerge/Files/Layered=Open Layered Document");
	// We can't use this.useLayeredDocument because it's not visibile in
	// lexically scoped functions.
	var localUseLayeredDocument = false;

	function enableControls()
	{
		w.findControl
		w.findControl('_align').enabled = (mergeFiles.length > 1) || localUseLayeredDocument;
		w.findControl('_remove').enabled = (mergeFiles.length > 0) && w.findControl('_fileList').selection;
		w.findControl('_ok').enabled = (mergeFiles.length > 1) || localUseLayeredDocument;
		w.findControl('_browse').enabled = !localUseLayeredDocument;
		w.findControl('_addOpenDocs').enabled = !localUseLayeredDocument && (app.documents.length > 0);
	}
	
	function addFileToList(f)
	{
		var i;
		if (f == null)
			return;
			
		for (i in mergeFiles)
			if (f.toString() == mergeFiles[i].file.toString())	// Already in list?
				return;
				
		// Windows - use filter to skip evil sidecar files
		if ((File.fs == "Windows") && !winFileSelection( f ))
			return;

		var fileList = w.findControl('_fileList');
		fileList.add('item', File.decode(f.name) );
		mergeFiles.push(new StackElement(f));
	}
		
	// Dialog event handling routines
	
	function removeOnClick()
	{
		var i, s;
		var selList = w.findControl('_fileList').selection;
		for (s in selList)
		{
			for (i in mergeFiles)
				if (File.decode(mergeFiles[i].file.name) == selList[s].text)
				{
					mergeFiles.splice(i,1);
					break;
				}
			w.findControl('_fileList').remove(selList[s]);
		}
		enableControls();
	}
	
	function browseOnClick()
	{
		// Spring back to the "File..." menu item
		var menu = w.findControl('_source');
//		menu.items[0].selected = true;
		switch (menu.selection.text)
		{
			case fileMenuItem:
			{
				var i, filenames = photoshopFileOpenDialog();
				if (filenames.length)
				{
					if (File.fs == "Macintosh")	// Mac gratiuitously scrambles them...why?
						filenames.sort();
					for (i in filenames)
						addFileToList( File(filenames[i]) );
				}
				break;
			}
			case folderMenuItem:
			{
				var folder = Folder.selectDialog(localize('$$$/AdobePlugin/Exposuremerge/FolderSelect=Select folder'));
				if (folder)
				{
					fileList = folder.getFiles( $.os.match(/^Macintosh.*/) ? macFileSelection : winFileSelection );
					var f;
					for (f in fileList)
						addFileToList(fileList[f]);
				}
				break;
			}
		}
		enableControls();
		return;
	}
	
	function addOpenDocuments()
	{
		var gaveUnsavedWarning = false;

		// doc.saved is true when a new empty document is created.
		function isReallySaved( doc )
		{
			if (! doc.saved)
				return false;
			try
			{
				var n = doc.fullName;
			}
			catch (err)	// Mainly for err.number == 8103, error.message == "The document has not yet been saved"
			{				// But if anything else goes wrong, we still don't want it.
				return false;
			}
			return true;
		}
		
		var i, haveUnsavedDocuments = false;
		for (i = 0; i < app.documents.length; i++)
			if (isReallySaved(app.documents[i]))
				addFileToList( File( app.documents[i].fullName ) );
			else
				haveUnsavedDocuments = true;
				
		if (haveUnsavedDocuments && !gaveUnsavedWarning)
		{
			alert(localize('$$$/AdobePlugin/Exposuremerge/Mustsave=Documents must be saved before they can be merged'));
			gaveUnsavedWarning = true;
			w.findControl('_source').items[0].selected = true;
		}
		enableControls();
	}
	
	function sourceMenuOnChange()
	{
		var menu = w.findControl('_source');
		localUseLayeredDocument = false;
		
		switch (menu.selection.text) 
		{
			case fileMenuItem:		break;		// default
			case folderMenuItem:		break;
			case openFilesMenuItem:
				addOpenDocuments();
				break;
			case openLayeredDocMenuItem:
				w.findControl('_fileList').removeAll();
				mergeFiles = [];
				localUseLayeredDocument = true;
		}
		enableControls();
	}

	function listOnChange()
	{
		enableControls();
	}
	
	w.center();
	w.text = this.pluginName;
	if (this.introText)
		w.findControl('_intro').text = this.introText;
	// Set up source menu
	var menu = w.findControl('_source');
	menu.add( 'item', fileMenuItem );
	menu.add( 'item', folderMenuItem );
	
	// The "addOpenDocs" button was added at the last moment.  If it's
	// there, then use that in favor of the menu.
	var addOpenDocsButton = w.findControl('_addOpenDocs');
	// Really, you want to disable the menu, but that's not possible w/ScriptUI
	if (app.documents.length > 0 && !addOpenDocsButton)
		menu.add( 'item', openFilesMenuItem ); 
		
	// If we have multiple layers, we can load from that.
	if (this.allowLayeredDocument 
	&& (app.documents.length > 0)
	&& (app.activeDocument.layers.length > 1))
		menu.add( 'item', openLayeredDocMenuItem );

	menu.items[0].selected = true;
	menu.preferredSize.width = 214;	// Brute force fix for PR1355780
	
	this.customDialogSetup( w );
	
	var fileSelection;
	
	w.findControl('_browse').onClick = browseOnClick;
	w.findControl('_fileList').onChange = listOnChange;
	w.findControl('_remove').onClick = removeOnClick;
	w.findControl('_source').onChange = sourceMenuOnChange;
	if (this.hideAlignment)
		w.findControl('_align').visible = false;
	w.findControl('_align').value = this.useAlignment;
	
	if (addOpenDocsButton)
	{
		addOpenDocsButton.onClick = addOpenDocuments;
		addOpenDocsButton.enabled = app.documents.length > 0;
	}
	else		
		addOpenDocuments();
		
	// If we already have stackElements (e.g., from Bridge) add them
	if (this.stackElements)
	{
		for (i in this.stackElements)
			addFileToList( this.stackElements[i].file );
	}
	
	enableControls();

	var result = w.show();
	if (result != kCanceled)
	{
		if (! this.hideAlignment)
			this.useAlignment = w.findControl('_align').value;
		this.customDialogFunction( w );
		if (localUseLayeredDocument)
		{
			this.useLayeredDocument = true;
			if (this.createStackFromLayeredDoc())
			{
				if (this.useAlignment)
					this.alignStack( app.activeDocument );
				return this.stackElements;
			}
			else
				return null;
		}
		if (result == kFilesFromPMLoad)
			return this.stackElements;		// Already loaded by photomerge.loadCompositionClick()
		else
			return mergeFiles
	}
	else
	{
		// Strange fix for PS problem where a cancel out of file selection & this dialog would
		// leave most of the Photoshop menus disabled.
		if (File.fs == "Macintosh")
			app.bringToFront();
		return null;
	}
}

// Bridge voodoo taken from Ruark's code
ImageStackCreator.prototype.checkForBridgeFiles = function() 
{
	try {
		this.filesFromBridge = gFilesFromBridge;
		this.runningFromBridge = (this.filesFromBridge.length > 0);
		app.displayDialogs = DialogModes.NO;
		return this.runningFromBridge;
	}
	catch( e ) { 
		this.runningFromBridge = false;
		this.filesFromBridge = undefined;
	}
	return false;
}

ImageStackCreator.prototype.checkForLightroomFiles = function()
{
	try {
		this.filesFromBridge = gFilesFromLightroom;
		this.runningFromBridge = (this.filesFromBridge.length > 0);
		app.displayDialogs = DialogModes.NO;
		return this.runningFromBridge;
	}
	catch( e ) { 
		this.runningFromBridge = false;
		this.filesFromBridge = undefined;
	}
	return false;
}

ImageStackCreator.prototype.checkForLightroomGlobals = function()
{
	return ((typeof(gFilesFromLightroom) != "undefined" && gFilesFromLightroom) 
			&& (gFilesFromLightroom.length > 0) 
			&& (this.stackElements && this.stackElements.length > 0)
			&& (typeof(gLightroomDocID) != "undefined" && gLightroomDocID) 
			&& (gLightroomDocID.length > 0));
}


ImageStackCreator.prototype.getFilesFromBridgeOrDialog = function( dialogFile, preloadDialogFromBridge )
{
	this.stackElements = null;
	if (typeof(preloadDialogFromBridge) == "undefined")
		preloadDialogFromBridge = false;
	if (this.checkForBridgeFiles() || this.checkForLightroomFiles())
	{
		this.stackElements = new Array();
		var j;
		for (j in this.filesFromBridge)
			if ( isValidImageFile( this.filesFromBridge[j] ) )
				this.stackElements.push( new StackElement( this.filesFromBridge[j] ));

		if (this.stackElements.length < 2)
		{
			alert(this.pluginName + localize("$$$/AdobePlugin/Shared/Exposuremerge/Auto/NeedAtLeast2= needs at least two files selected."), this.pluginName, true );
			this.stackElements = null;
			return;
		}
	}
	
	if ((this.stackElements == null) || preloadDialogFromBridge)
		this.stackElements = this.stackDialog( dialogFile );

	// Add LightroomDocID's
	if ((this.stackElements != null) && (this.checkForLightroomGlobals()))
	{
		// We want to add the LR "open magic" to the last file, because
		// the list gets reversed in the stack dialog (because that'll match layer order).
		// I.e., the "last" file now becomes the "first" file in the stack,
		// and that's the one the final saved output is going to.
		var lastElem = this.stackElements.length - 1;
		if ((typeof(gLightroomDocID) != "undefined"))
			this.stackElements[lastElem].fLightroomDocID = gLightroomDocID;
		if (typeof(gLightroomSaveParams) != "undefined")
			this.stackElements[lastElem].fLightroomSaveParams = gLightroomSaveParams;
		if (typeof(gBridgeTalkID) != "undefined")
			this.stackElements[lastElem].fLightroomBridgeTalkID = gBridgeTalkID;
		
		// Check for additional lightroom meta-data that applies to all the images
		if ((typeof(gOpenParamsFromLightroom) != "undefined")
			&& gOpenParamsFromLightroom
			&& (gOpenParamsFromLightroom.length == this.stackElements.length))
		{
			for (j in gOpenParamsFromLightroom)
					this.stackElements[j].fLightroomOpenParams = gOpenParamsFromLightroom[j];
		}
	}
}
