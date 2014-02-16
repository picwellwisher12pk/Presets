// (c) Copyright 2005.  Adobe Systems, Incorporated.  All rights reserved.

/*
@@@BUILDINFO@@@ Warn If RGB.jsx 1.0.0.1
*/

var begDesc = "$$$/JavaScripts/WarnIfRGBSave/Description=Use this script to switch the active document to RGB mode and then save the document." // endDesc
var begName = "$$$/JavaScripts/WarnIfRGBSave/MenuName=Warn If RGB" // endName


// on localized builds we pull the $$$/Strings from a .dat file, see documentation for more details
$.localize = true;

try {
	if ( documents.length > 0 && DocumentMode.RGB != activeDocument.mode ) {
		var message = localize( '$$$/JavaScripts/WarnIfRGBSaveMessage=Your document is not RGB. Do you want me to switch and resave?' );
		if ( confirm( message ) ) {
			SwitchAndSave();
		}
	}
}

catch( e ) {
	// always wrap your script with try/catch blocks so you don't stop production
	// remove comments below to see error for debugging 
	// alert( e );
}


///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////////////
// Function: SwitchAndSave
// Usage: switch the document to RGB mode and then resave
// Input: document must be active
// Output: active document mode is RGB and is saved
///////////////////////////////////////////////////////////////////////////////
function SwitchAndSave() {
	Switch();
	activeDocument.save();
}


///////////////////////////////////////////////////////////////////////////////
// Function: Switch
// Usage: switch the active document to RGB mode
// Input: document must be active
// Output: active document mode is RGB
// Note: This code is taken from the output of the 
//       ScriptListener utility plug-in
///////////////////////////////////////////////////////////////////////////////
function Switch() {
	var eventModeChange = stringIDToTypeID( "8cba8cd6-cb66-11d1-bc43-0060b0a13dc4" );
	var descSource = new ActionDescriptor();
	var keySourceMode = charIDToTypeID( "SrcM" );
	var list = new ActionList();
	var keyCondition = charIDToTypeID( "Cndn" );
	var keyBitmap = charIDToTypeID( "UBtm" );
	var keyGrayscale = charIDToTypeID( "UGry" );
	var keyDuotone = charIDToTypeID( "UDtn" );
	var keyIndex = charIDToTypeID( "UInd" );
	var keyRGB = charIDToTypeID( "URGB" );
	var keyCMYK = charIDToTypeID( "UCMY" );
	var keyLab = charIDToTypeID( "ULab" );
	var keyMultichannel = charIDToTypeID( "UMlt" );
	list.putEnumerated( keyCondition, keyBitmap );
	list.putEnumerated( keyCondition, keyGrayscale );
	list.putEnumerated( keyCondition, keyDuotone );
	list.putEnumerated( keyCondition, keyIndex );
	list.putEnumerated( keyCondition, keyRGB );
	list.putEnumerated( keyCondition, keyCMYK );
	list.putEnumerated( keyCondition, keyLab );
	list.putEnumerated( keyCondition, keyMultichannel );
	descSource.putList( keySourceMode, list );
	var keyDestination = charIDToTypeID( "DstM" );
	var descDest = new ActionDescriptor();
	var keyRGB = charIDToTypeID( "RGBM" );
	descSource.putObject( keyDestination, keyRGB, descDest );
	executeAction( eventModeChange, descSource, DialogModes.NO );
}