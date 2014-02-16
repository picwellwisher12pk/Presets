// (c) Copyright 2006.  Adobe Systems, Incorporated.  All rights reserved.

/*
@@@BUILDINFO@@@ Load Files into Stack.jsx 1.0.0.1
*/

//
// Load Files into Stack.jsx - does just that.
//

/*

// BEGIN__HARVEST_EXCEPTION_ZSTRING

<javascriptresource>
<name>$$$/JavaScripts/LoadFilesintoStack/Menu=Load Files into Stack...</name>
</javascriptresource>

// END__HARVEST_EXCEPTION_ZSTRING

*/

// debug level: 0-2 (0:disable, 1:break on error, 2:break at beginning)
//$.level = (Window.version.search("d") != -1) ? 1 : 0;	// This chokes bridge
$.level = 0;

// debugger; // launch debugger on next line

// on localized builds we pull the $$$/Strings from a .dat file
$.localize = true;

// Put header files in a "Stack Scripts Only" folder.  The "...Only" tells
// PS not to place it in the menu.  For that reason, we do -not- localize that
// portion of the folder name.
var g_StackScriptFolderPath = app.path + "/"+ localize("$$$/ScriptingSupport/InstalledScripts=Presets/Scripts") + "/"
										+ localize("$$$/private/LoadStack/StackScriptOnly=Stack Scripts Only/");

$.evalFile(g_StackScriptFolderPath + "LatteUI.jsx");

$.evalFile(g_StackScriptFolderPath + "StackSupport.jsx");

$.evalFile(g_StackScriptFolderPath + "CreateImageStack.jsx");

/************************************************************/
// loadLayers routines

loadLayers = new ImageStackCreator( localize("$$$/AdobePlugin/Shared/LoadStack/Process/Name=Load Layers"),
										  localize('$$$/AdobePlugin/Shared/LoadStack/Auto/untitled=Untitled' ) );

// LoadLayers is less restrictive than MergeToHDR
loadLayers.mustBeSameSize			= false;	// Images' height & width don't need to match
loadLayers.mustBeUnmodifiedRaw		= false;	// Exposure adjustements in Camera raw are allowed
loadLayers.mustNotBe32Bit			= false;	// 32 bit images
loadLayers.createSmartObject		= false;	// If true, option to create smart object is checked.

// Add hooks to read the value of the "Create Smart Object" checkbox
loadLayers.customDialogSetup = function( w )
{
	w.findControl('_createSO').value = loadLayers.createSmartObject;
	if (! app.featureEnabled( localize( "$$$/private/ExtendedImageStackCreation=ImageStack Creation" ) ))
		w.findControl('_createSO').hide();
}

loadLayers.customDialogFunction = function( w )
{
	loadLayers.createSmartObject = w.findControl('_createSO').value;
}

// Override the default to use "Auto" alignment.
loadLayers.alignStack = function( stackDoc )
{
	selectAllLayers(stackDoc, 2);
	alignLayersByContent( "Auto" );
}

loadLayers.stackLayers = function()
{
	var result, i, stackDoc = null;
	
	stackDoc = this.loadStackLayers();
	if (! stackDoc)
		return;
	
	// Nuke the "destination" layer that got created (M2HDR holdover)
	stackDoc.layers[this.pluginName].remove();
	
	// Stack 'em up.
	if (this.createSmartObject)
	{
		selectAllLayers( stackDoc );
		executeAction( knewPlacedLayerStr, new ActionDescriptor(), DialogModes.NO );
	}
}

// "Main" execution of Merge to HDR
loadLayers.doInteractiveLoad = function ()
{
	this.getFilesFromBridgeOrDialog( localize("$$$/private/LoadStack/LoadLayersexv=LoadLayers.exv") );

	if (this.stackElements)
		this.stackLayers();
}

loadLayers.intoStack = function(filelist, alignFlag)
{
	if (typeof(alignFlag) == 'boolean')
		loadLayers.useAlignment = alignFlag;
		
	if (filelist.length < 2)
	{
		alert(localize("$$$/AdobeScripts/Shared/LoadLayers/AtLeast2=At least two files must be selected to create a stack."), this.pluginName, true );
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
		this.stackLayers();
}

if (typeof(loadLayersFromScript) == 'undefined')
	loadLayers.doInteractiveLoad();
