// (c) Copyright 2008.  Adobe Systems, Incorporated.  All rights reserved.

/*
@@@BUILDINFO@@@ Open As Layer.jsx 1.0.0.1
*/

var begDesc = "$$$/JavaScripts/OpenAsLayer/Description=Assign this to the open document event. This will promote a document with only a background layer to a layer with the document name." // endDesc
var begName = "$$$/JavaScripts/OpenAsLayer/MenuName=Open As Layer" // endName

// on localized builds we pull the $$$/Strings from a .dat file, see documentation for more details
$.localize = true;

try {

	if ( app.documents.length > 0 ) {
		var doc = activeDocument;
		if ( doc.layers.length == 1 && doc.activeLayer.isBackgroundLayer ) {
			doc.activeLayer.isBackgroundLayer = false;
			doc.activeLayer.name = doc.name;
		}
	}

} // try end

catch( e ) {
	// always wrap your script with try/catch blocks so you don't stop production
	// remove comments below to see error for debugging 
	// alert( e );
}
