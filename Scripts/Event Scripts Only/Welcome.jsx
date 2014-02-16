// (c) Copyright 2005.  Adobe Systems, Incorporated.  All rights reserved.

/*
@@@BUILDINFO@@@ Welcome.jsx 1.0.0.1
*/

var begDesc = "$$$/JavaScripts/Welcome/Description=Show a simple alert when Photoshop starts." // endDesc
var begName = "$$$/JavaScripts/Welcome/MenuName=Welcome" // endName

// on localized builds we pull the $$$/Strings from a .dat file, see documentation for more details
$.localize = true;

try {
	alert( localize( "$$$/JavaScripts/Welcome=You have successfully configured an event triggering a JavaScript." ) );
}

catch( e ) {
	// always wrap your script with try/catch blocks so you don't stop production
	// remove comments below to see error for debugging 
	// alert( e );
}
