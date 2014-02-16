// (c) Copyright 2005.  Adobe Systems, Incorporated.  All rights reserved.

/*
@@@BUILDINFO@@@ Resize.jsx 1.0.0.1
*/

var begDesc = "$$$/JavaScripts/ResizeOnOpen/Description=Pop the image size dialog. Pre populate the menu with 100 x 100 pixels." // endDesc
var begName = "$$$/JavaScripts/ResizeOnOpen/MenuName=Resize" // endName

// on localized builds we pull the $$$/Strings from a .dat file, see documentation for more details
$.localize = true;

var startRulerUnits;
var startTypeUnits;
var startDisplayDialogs;

try {
	startDisplayDialogs = displayDialogs;
	startRulerUnits = preferences.rulerUnits;
	startTypeUnits = preferences.typeUnits;
	
	displayDialogs = DialogModes.NO;
	preferences.rulerUnits = Units.PIXELS;
	preferences.typeUnits = TypeUnits.PIXELS;

	if ( activeDocument.width != 100 || activeDocument.height != 100 ) {
		displayDialogs = DialogModes.ALL;
		activeDocument.resizeImage( 100, 100, 72, ResampleMethod.BICUBIC );
		displayDialogs = DialogModes.NO;
	}

	displayDialogs = startDisplayDialogs;
	preferences.rulerUnits = startRulerUnits;
	preferences.typeUnits = startTypeUnits;

}

catch(e) {
	// always wrap your script with try/catch blocks so you don't stop production
	// remove comments below to see error for debugging 
	// alert( e );

	if ( undefined != startDisplayDialogs ) {
		displayDialogs = startDisplayDialogs;
	}

	if ( undefined != startRulerUnits ) {
		preferences.rulerUnits = startRulerUnits;
	}

	if ( undefined != startTypeUnits ) {
		preferences.typeUnits = startTypeUnits;
	}
}