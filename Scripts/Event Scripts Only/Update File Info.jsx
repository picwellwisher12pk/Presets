// (c) Copyright 2005.  Adobe Systems, Incorporated.  All rights reserved.

/*
@@@BUILDINFO@@@ Update File Info.jsx 1.0.0.1
*/

var begDesc = "$$$/JavaScripts/UpdateFileInfoOnSave/Description=Pop the file info dialog when you save the document." // endDesc
var begName = "$$$/JavaScripts/UpdateFileInfoOnSave/MenuName=Update File Info" // endName

// on localized builds we pull the $$$/Strings from a .dat file, see documentation for more details
$.localize = true;

try {
	var message = localize( '$$$/JavaScripts/UpdateFileInfoMessage=Do you want to update the File Info now?' );

	if ( confirm( message ) ) {
		PopFileInfo();
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
// Function: PopFileInfo
// Usage: pop the file info dialog to get params
// Input: an active document
// Output: <none>
///////////////////////////////////////////////////////////////////////////////
function PopFileInfo() {
	var desc = new ActionDescriptor();
	
	var ref = new ActionReference();
	ref.putProperty( charIDToTypeID( 'Prpr' ), charIDToTypeID( 'FlIn' ) );
	ref.putEnumerated( charIDToTypeID( 'Dcmn' ), charIDToTypeID( 'Ordn' ), charIDToTypeID( 'Trgt' ) );
	desc.putReference( charIDToTypeID( 'null' ), ref );
	
	var obj = new ActionDescriptor();

	desc.putObject( charIDToTypeID( 'T   ' ), charIDToTypeID( 'FlIn' ), obj );
	
	executeAction( charIDToTypeID( 'setd' ), desc, DialogModes.ALL );
}
