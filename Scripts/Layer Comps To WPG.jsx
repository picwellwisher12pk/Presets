// Copyright 2008.  Adobe Systems, Incorporated.  All rights reserved.
// Web Photo Gallery has now been replaced be Adobe Media Gallery. 
// You can find Adobe Media Gallery in Bridge.

/*
@@@BUILDINFO@@@ Layer Comps To WPG.jsx 1.0.0.14
*/

/*

// BEGIN__HARVEST_EXCEPTION_ZSTRING

<javascriptresource>
<name>$$$/JavaScripts/LayerCompsToWPG/Name=Layer Comps to WPG...</name>
<category>layercomps</category>
<enableinfo>true</enableinfo>
</javascriptresource>

// END__HARVEST_EXCEPTION_ZSTRING

*/

// enable double clicking from the Macintosh Finder or the Windows Explorer
#target photoshop

// debug level: 0-2 (0:disable, 1:break on error, 2:break at beginning)
// $.level = 0;
// debugger; // launch debugger on next line

// on localized builds we pull the $$$/Strings from a .dat file, see documentation for more details
$.localize = true;


var message = localize("$$$/JavaScripts/LayerCompsToWPG/Message=Web Photo Gallery has now been replaced by Adobe Output Module. You can find Adobe Output Module in Bridge.");

alert(message);

// so i don't get recorded in history or actions panel
'cancel';

// End Layer Comps To WPG.jsx
