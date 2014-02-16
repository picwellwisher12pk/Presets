// (c) Copyright 2006.  Adobe Systems, Incorporated.  All rights reserved.

/*
@@@BUILDINFO@@@ Statistics.jsx 1.0.0.2
*/

//
// Statistics.jsx - Front end to the Statistics Image Stack plugins
//

/*

// BEGIN__HARVEST_EXCEPTION_ZSTRING

<javascriptresource>
<name>$$$/JavaScripts/Statistics/Menu=Statistics...</name>
<featureenabled>ImageStack Creation</featureenabled>
</javascriptresource>

// END__HARVEST_EXCEPTION_ZSTRING

*/


// on localized builds we pull the $$$/Strings from a .dat file
$.localize = true;

// Only run if we're in a supported version of Photoshop
// Note, removing this will not make the script work, as it depends on
// core application code, it just makes it fail better.
if (!app.featureEnabled("ImageStack Creation")) 
{
	throw( new Error(localize("$$$/JavaScripts/Statistics/CommandNotAvailable=The Statistics feature is not available in this version of Photoshop.")));
}

// Put header files in a "Stack Scripts Only" folder.  The "...Only" tells
// PS not to place it in the menu.  For that reason, we do -not- localize that
// portion of the folder name.
var g_StackScriptFolderPath = app.path + "/"+ localize("$$$/ScriptingSupport/InstalledScripts=Presets/Scripts") + "/"
										+ localize("$$$/private/Statistics/StackScriptOnly=Stack Scripts Only/");

$.evalFile(g_StackScriptFolderPath + "LatteUI.jsx");

$.evalFile(g_StackScriptFolderPath + "StackSupport.jsx");

$.evalFile(g_StackScriptFolderPath + "CreateImageStack.jsx");

// debug level: 0-2 (0:disable, 1:break on error, 2:break at beginning)
//$.level = (Window.version.search("d") != -1) ? 1 : 0;
$.level = 0;
// debugger; // launch debugger on next line

const kImageStatisticsAlignmentFlag = app.stringIDToTypeID( "ImageStatisticsAlignmentFlag" );
const kImageStatisticsStackMode = app.stringIDToTypeID( "ImageStatisticsStackMode" );


/************************************************************/
// Image Statistics routines

imageStats = new ImageStackCreator( localize("$$$/AdobePlugin/Shared/Statistics/Process/Name=Image Statistics"),
										  localize('$$$/AdobePlugin/Shared/Statistics/Auto/untitled=Untitled' ) );

// Image Statistics is less restrictive than MergeToHDR
imageStats.mustBeSameSize			= false;	// Images' height & width don't need to match
imageStats.mustBeUnmodifiedRaw		= false;	// Exposure adjustements in Camera raw are allowed
imageStats.mustNotBe32Bit			= false;	// 32 bit images


imageStats.menuItems = new Object();
// Table of menu items/operations uses the same ZString tags as the plugin - see statistics.r
imageStats.menuItems[localize("$$$/AdobePlugin/statistics/Mean=Mean")]				= 'avrg';
imageStats.menuItems[localize("$$$/AdobePlugin/statistics/Summation=Summation")]	= 'summ';
imageStats.menuItems[localize("$$$/AdobePlugin/statistics/Minimum=Minimum")]		= 'minn';
imageStats.menuItems[localize("$$$/AdobePlugin/statistics/Maximum=Maximum")]		= 'maxx';
imageStats.menuItems[localize("$$$/AdobePlugin/statistics/Median=Median")]			= 'medn';
imageStats.menuItems[localize("$$$/AdobePlugin/statistics/Variance=Variance")]		= 'vari';
imageStats.menuItems[localize("$$$/AdobePlugin/statistics/StandardDeviation=Standard Deviation" )]	= 'stdv';
imageStats.menuItems[localize("$$$/AdobePlugin/statistics/Skewness=Skewness")]		= 'skew';
imageStats.menuItems[localize("$$$/AdobePlugin/statistics/Kurtosis=Kurtosis")]		= 'kurt';
imageStats.menuItems[localize("$$$/AdobePlugin/statistics/Range=Range")]			= 'rang';
imageStats.menuItems[localize("$$$/AdobePlugin/statistics/Entropy=Entropy")]		= 'entr';
imageStats.selectedOperation = null;
imageStats.selectedOperationStr = null;

// Create the image stack from the selected images, and run the statistics operation on it.
imageStats.invokePlugin = function()
{
	var result, i, stackDoc = null;

	stackDoc = this.loadStackLayers();
	if (! stackDoc)
		return;
	
	// Nuke the "destination" layer that got created (M2HDR holdover)
	stackDoc.layers[this.pluginName].remove();
	
	// Stack 'em up.
	selectAllLayers( stackDoc );
	executeAction( knewPlacedLayerStr, new ActionDescriptor(), DialogModes.NO );

	var desc = new ActionDescriptor();
	desc.putString( keyName, this.selectedOperationStr );
	desc.putClass( app.stringIDToTypeID("imageStackPlugin"), osTypeToInt(this.selectedOperation) );
	executeAction( app.stringIDToTypeID("applyImageStackPluginRenderer"), desc, DialogModes.NO );

}

// These hook functions into the dialog set and get the stat operation from the menu
imageStats.customDialogSetup = function( w )
{
	var s, stackMenu = w.findControl('_operation');
	var tmpIndex = 0;
	var tmpCounter = 0;
	var tmpDesc;
	var tmpMenu;
	var tmpUseAlignment = this.useAlignment;


	try {
		tmpDesc = app.getCustomOptions('ImageStatistics');
		tmpMenu = tmpDesc.getString( kImageStatisticsStackMode );
		tmpUseAlignment = tmpDesc.getBoolean( kImageStatisticsAlignmentFlag );
	}
	catch (e)  {
		tmpDesc = null;
		tmpMenu = null;
	}
	
	this.useAlignment = tmpUseAlignment;

	for (s in this.menuItems) {
		stackMenu.add( 'item', s );
		if (tmpMenu != null) {
			if (s == tmpMenu)
				tmpIndex = tmpCounter;
		}
		tmpCounter++;
	}
	stackMenu.items[tmpIndex].selected = true;
}

imageStats.customDialogFunction = function( w )
{
	var stackMenu = w.findControl('_operation');
	this.selectedOperation = this.menuItems[stackMenu.selection.text];
	this.selectedOperationStr = stackMenu.selection.text;

	var myDesc = new ActionDescriptor();
	myDesc.putString(kImageStatisticsStackMode, this.selectedOperationStr);
	myDesc.putBoolean(kImageStatisticsAlignmentFlag, this.useAlignment);
	app.putCustomOptions('ImageStatistics', myDesc, true);
}

// "Main" execution of statistics that brings up dialog
imageStats.doInteractiveStatistics = function ()
{
	this.getFilesFromBridgeOrDialog( localize("$$$/private/Statistics/StatDlogEXV=Statistics.exv"), true );

	if (this.stackElements)
		this.invokePlugin();
}

// "Main" version of statistics you call from another script.  
// Be sure to set the
//    runStatisticsFromScript
// flag to "true" before loading this file (otherwise the dialog comes up)
imageStats.computeStatistics = function(filelist, alignFlag)
{
	if (typeof(alignFlag) == 'boolean')
		imageStats.useAlignment = alignFlag;
		
	if (filelist.length < 2)
	{
		alert(localize("$$$/AdobePlugin/Shared/Statistics/AtLeast2=Statistics needs at least two files selected."), this.pluginName, true );
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
		this.invokePlugin();
}

if (typeof(runStatisticsFromScript) == 'undefined')
	imageStats.doInteractiveStatistics();
