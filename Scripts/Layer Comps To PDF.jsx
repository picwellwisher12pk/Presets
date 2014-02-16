// Copyright 2007.  Adobe Systems, Incorporated.  All rights reserved.
// This script will apply each comp and then export to a PDF Presentation
// Written by Naoki Hada
// ZStrings and auto layout by Tom Ruark

/*
@@@BUILDINFO@@@ Layer Comps To PDF.jsx 1.0.0.11
*/

/*

// BEGIN__HARVEST_EXCEPTION_ZSTRING

<javascriptresource>
<name>$$$/JavaScripts/LayerCompsToPDF/Menu=Layer Comps to PDF...</name>
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

//=================================================================
// Globals
//=================================================================

// ok and cancel button
var runButtonID = 1;
var cancelButtonID = 2;

// UI strings to be localized
var strTitle = localize("$$$/JavaScripts/LayerCompsToPDF/Title=Layer Comps To PDF");
var strButtonRun = localize("$$$/JavaScripts/LayerCompsToPDF/Run=Run");
var strButtonCancel = localize("$$$/JavaScripts/LayerCompsToPDF/Cancel=Cancel");
var strHelpText = localize("$$$/JavaScripts/LayerCompsToPDF/HelpText=Please specify the location where flat image files should be saved. Once Photoshop has saved these files, it will launch PDF Presentation in order to convert each file into a PDF page.");
var strLabelDestination = localize("$$$/JavaScripts/LayerCompsToPDF/Destination=Destination:");
var strButtonBrowse = localize("$$$/JavaScripts/LayerCompsToPDF/Browse=&Browse...");
var strCheckboxSelectionOnly = localize("$$$/JavaScripts/LayerCompsToPDF/Selected=&Selected Layer Comps Only");
var strPanelSlideShowOptions = localize("$$$/JavaScripts/LayerCompsToPDF/SlideShow=Slideshow Options:");
var strLabelAdvaceEvery = localize("$$$/JavaScripts/LayerCompsToPDF/AdvanceEvery=&Advance Every");
var strLabelSecond = localize("$$$/JavaScripts/LayerCompsToPDF/Seconds=Seconds");
var strLabelLoopAfterLastPage = localize("$$$/JavaScripts/LayerCompsToPDF/Loop=&Loop after last page");
var strAlertSpecifyDestination = localize("$$$/JavaScripts/LayerCompsToPDF/SpecifyDestination=Please specify destination.");
var strTitleSelectDestination = localize("$$$/JavaScripts/LayerCompsToPDF/SelectDestination=Select Destination");
var strAlertDocumentMustBeOpened = localize("$$$/JavaScripts/LayerCompsToPDF/OneDocument=You must have a document open to export!");
var strAlertNoLayerCompsFound = localize("$$$/JavaScripts/LayerCompsToPDF/NoComps=No layer comps found in document!");
var strAlertWasSuccessful = localize("$$$/JavaScripts/LayerCompsToPDF/Success= was successful.");
var strAlertFailed = localize("$$$/JavaScripts/LayerCompsToPDF/Fail= failed.");
var strMessage = localize("$$$/JavaScripts/LayerCompsToPDF/Message=Layer Comps To PDF action settings");
var	strEditTextDestinationLength = localize("$$$/locale_specific/JavaScripts/LayerCompsToPDF/EditTextDestinationLength=160" );
var strEditTextSecondsLength = localize("$$$/locale_specific/JavaScripts/LayerCompsToPDF/EditTextSecondsLength=25" );

main();

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////



///////////////////////////////////////////////////////////////////////////////
// Function: settingDialog
// Usage: create the main dialog
// Input: settings to initialize the dialog with , ExportInfo object
// Return: true if ok, false if cancel
///////////////////////////////////////////////////////////////////////////////
function settingDialog(exportInfo) 
{
    dlgMain = new Window("dialog", strTitle);
    
    // match our dialog background color to the host application
    dlgMain.graphics.backgroundColor = dlgMain.graphics.newBrush (dlgMain.graphics.BrushType.THEME_COLOR, "appDialogBackground");

	dlgMain.orientation = 'column';
	dlgMain.alignChildren = 'left';
	
	// -- top of the dialog, first line
    dlgMain.add("statictext", undefined, strLabelDestination);

	// -- two groups, one for left and one for right ok, cancel
	dlgMain.grpTop = dlgMain.add("group");
	dlgMain.grpTop.orientation = 'row';
	dlgMain.grpTop.alignChildren = 'top';
	dlgMain.grpTop.alignment = 'fill';

	// -- group contains four lines
	dlgMain.grpTopLeft = dlgMain.grpTop.add("group");
	dlgMain.grpTopLeft.orientation = 'column';
	dlgMain.grpTopLeft.alignChildren = 'left';
	dlgMain.grpTopLeft.alignment = 'fill';
	
	// -- the second line in the dialog
	dlgMain.grpSecondLine = dlgMain.grpTopLeft.add("group");
	dlgMain.grpSecondLine.orientation = 'row';
	dlgMain.grpSecondLine.alignChildren = 'center';

    dlgMain.etDestination = dlgMain.grpSecondLine.add("edittext", undefined, exportInfo.destination.toString());
    dlgMain.etDestination.preferredSize.width = StrToIntWithDefault( strEditTextDestinationLength, 160 );

    dlgMain.btnBrowse = dlgMain.grpSecondLine.add("button", undefined, strButtonBrowse);
    dlgMain.btnBrowse.onClick = btnBrowseOnClick;

	// -- the third line in the dialog
    dlgMain.cbSelection = dlgMain.grpTopLeft.add("checkbox", undefined, strCheckboxSelectionOnly);
    dlgMain.cbSelection.value = exportInfo.selectionOnly;

	// -- the fourth line is a panel
	dlgMain.pnlSlideShow = dlgMain.grpTopLeft.add("panel");
	dlgMain.pnlSlideShow.orientation = 'column';
	dlgMain.pnlSlideShow.alignChildren = 'left';
	dlgMain.pnlSlideShow.alignment = 'fill';
	dlgMain.pnlSlideShow.text = strPanelSlideShowOptions;
	
	// -- the fifth line, three things in row orientation
	dlgMain.grpFifthLine = dlgMain.pnlSlideShow.add("group");
	dlgMain.grpFifthLine.orientation = 'row';
	dlgMain.grpFifthLine.alignChildren = 'center';
	dlgMain.grpFifthLine.alignment = 'left';
	
    dlgMain.cbAdvance = dlgMain.grpFifthLine.add( "checkbox", undefined, strLabelAdvaceEvery );
    dlgMain.cbAdvance.value = exportInfo.ssoAdvance;

    dlgMain.etSeconds = dlgMain.grpFifthLine.add("edittext", undefined, exportInfo.ssoSeconds.toString());
    dlgMain.etSeconds.preferredSize.width = StrToIntWithDefault( strEditTextSecondsLength, 25 );

    dlgMain.grpFifthLine.add("statictext", undefined, strLabelSecond);
	
    dlgMain.cbLoop = dlgMain.pnlSlideShow.add( "checkbox", undefined, strLabelLoopAfterLastPage );
    dlgMain.cbLoop.value = exportInfo.ssoLoop;

	// the right side of the dialog, the ok and cancel buttons
	dlgMain.grpTopRight = dlgMain.grpTop.add("group");
	dlgMain.grpTopRight.orientation = 'column';
	dlgMain.grpTopRight.alignChildren = 'fill';
	
	dlgMain.btnRun = dlgMain.grpTopRight.add("button", undefined, strButtonRun );
    dlgMain.btnRun.onClick = btnRunOnClick;

	dlgMain.btnCancel = dlgMain.grpTopRight.add("button", undefined, strButtonCancel );
    dlgMain.btnCancel.onClick = function() { 
		var d = this;
		while (d.type != 'dialog') {
			d = d.parent;
		}
		d.close(cancelButtonID); 
	}

	dlgMain.defaultElement = dlgMain.btnRun;
	dlgMain.cancelElement = dlgMain.btnCancel;

	// the bottom of the dialog
	dlgMain.grpBottom = dlgMain.add("group");
	dlgMain.grpBottom.orientation = 'column';
	dlgMain.grpBottom.alignChildren = 'left';
	dlgMain.grpBottom.alignment = 'fill';
    
    dlgMain.pnlHelp = dlgMain.grpBottom.add("panel");
    dlgMain.pnlHelp.alignment = 'fill';

    dlgMain.etHelp = dlgMain.pnlHelp.add("statictext", undefined, strHelpText, {multiline:true});
    dlgMain.etHelp.alignment = 'fill';

	// do not allow anything except for numbers 0-9
	//dlgMain.etSeconds.addEventListener ('keydown', NumericEditKeyboardHandler);

	// in case we double clicked the file
    app.bringToFront();

    dlgMain.center();

    var result = dlgMain.show();

    if (cancelButtonID == result) {
		return result;
	}
    
    // get setting from dialog
    exportInfo.destination = dlgMain.etDestination.text;
    exportInfo.selectionOnly = dlgMain.cbSelection.value;
    exportInfo.ssoAdvance = dlgMain.cbAdvance.value;
    exportInfo.ssoSeconds = dlgMain.etSeconds.text;
    exportInfo.ssoLoop = dlgMain.cbLoop.value;

    var pdf = ".pdf";
    
    if ((exportInfo.destination.length - pdf.length) != exportInfo.destination.toLowerCase().lastIndexOf(pdf )) {
        exportInfo.destination += pdf; // add ".pdf" if there is no PDF extension
    }

    return result;
}


///////////////////////////////////////////////////////////////////////////////
// Function: btnRunOnClick
// Usage: routine is assigned to the onClick method of the run button
// Input: checks the dialog params and closes with the dialog with true
// Return: <none>, dialog is closed with true on success
///////////////////////////////////////////////////////////////////////////////
function btnRunOnClick()
{
    // check if the setting is properly
    var destination = dlgMain.etDestination.text;
    if (destination.length == 0) {
        alert(strAlertSpecifyDestination);
        return;
    }

	// find the dialog in this auto layout mess
	var d = this;
	while (d.type != 'dialog') {
		d = d.parent;
	}
	d.close(runButtonID); 
}


///////////////////////////////////////////////////////////////////////////////
// Function: btnBrowseOnClick
// Usage: routine is assigned to the onClick method of the browse button
// Input: pop the selectDialog, and get a folder
// Return: <none>, sets the destination edit text
///////////////////////////////////////////////////////////////////////////////
function btnBrowseOnClick()
{
    var selFile = File.saveDialog(strTitleSelectDestination);
    if ( selFile != null ) {
        dlgMain.etDestination.text = selFile.fsName;
    }
	dlgMain.defaultElement.active = true;
    return;
}


///////////////////////////////////////////////////////////////////////////////
// Function: ExportInfo
// Usage: object for holding the dialog parameters
// Input: <none>
// Return: object holding the export info
///////////////////////////////////////////////////////////////////////////////
function ExportInfo() {
    this.destination = new String("");
    this.tempLocation = new String("");
    this.selectionOnly = false;
    this.ssoAdvance = true;
    this.ssoSeconds = 5;
    this.ssoLoop = false;
}


///////////////////////////////////////////////////////////////////////////////
// Function: setTempFolder
// Usage: create a temp folder using random numbers
// Input: export info object
// Return: tempLocation of the object is set 
///////////////////////////////////////////////////////////////////////////////
function setTempFolder(exportInfo)
{
    var folder = Folder.temp; // File(exportInfo.destination).parent;
    while(true) {   // set temporary folder with random name
        exportInfo.tempLocation = folder.toString() + "/temp" + Math.floor(Math.random()*10000);
        var testFolder = new Folder(exportInfo.tempLocation);
        if (!testFolder.exists) {
            testFolder.create();
            break;
        }
    }
}


///////////////////////////////////////////////////////////////////////////////
// Function: zeroSuppress
// Usage: create a string padded with 0's
// Input: num and number of digits to pad
// Return: zero padded num
///////////////////////////////////////////////////////////////////////////////
function zeroSuppress (num, digit) {
    var tmp = num.toString();
    while(tmp.length < digit)   tmp = "0" + tmp;
    return tmp
}


///////////////////////////////////////////////////////////////////////////////
// Function: main
// Usage: the main routine for this JavaScript
// Input: <none>
// Return: <none>
///////////////////////////////////////////////////////////////////////////////
function main()
{
    if ( app.documents.length <= 0 ) {
        if ( DialogModes.NO != app.playbackDisplayDialogs ) {
            alert( strAlertDocumentMustBeOpened );
        }
    	return 'cancel'; // quit, returning 'cancel' (dont localize) makes the actions palette not record our script
    }

    var exportInfo = new ExportInfo();
    
 	// look for last used params via Photoshop registry, getCustomOptions will throw if none exist
	try {
		var d = app.getCustomOptions("f2e27792-1ef0-4f6f-a157-3a6ad8f6edf0");
		descriptorToObject(exportInfo, d, strMessage);
	}
	catch(e) {
		// it's ok if we don't have any options, continue with defaults
	}
    
	// see if I am getting descriptor parameters
    descriptorToObject(exportInfo, app.playbackParameters, strMessage);
    
    if ( DialogModes.ALL == app.playbackDisplayDialogs ) {
    	if (cancelButtonID == settingDialog(exportInfo)) {
        	return 'cancel'; // quit, returning 'cancel' (dont localize) makes the actions palette not record our script
	    }
	}

    try {
        var docName = app.activeDocument.name;
        setTempFolder(exportInfo);
    
        var compsName = new String("none");
        var compsCount = app.activeDocument.layerComps.length;
        if ( compsCount <= 1 ) {
            if ( DialogModes.NO != app.playbackDisplayDialogs ) {
                alert ( strAlertNoLayerCompsFound );
            }
        	return 'cancel'; // quit, returning 'cancel' (dont localize) makes the actions palette not record our script
        } else {
            app.activeDocument = app.documents[docName];
            docRef = app.activeDocument;
    
            var tempFileList = new Array();   // array of File
    
            var exportFileCount = 0;
            for ( compsIndex = 0; compsIndex < compsCount; compsIndex++ ) {
                var compRef = docRef.layerComps[compsIndex];
                if (exportInfo.selectionOnly && !compRef.selected) continue; // selected only
                compRef.apply();
                var duppedDocument = app.activeDocument.duplicate();    
	    	    if (duppedDocument.bitsPerChannel == BitsPerChannelType.THIRTYTWO)
				    duppedDocument.bitsPerChannel = BitsPerChannelType.SIXTEEN;
                var fileNameBody = zeroSuppress(compsIndex, 4);
                fileNameBody += "_" + compRef.name;
                if (null != compRef.comment)    fileNameBody += "_" + compRef.comment;
                fileNameBody = fileNameBody.replace(/[:\/\\*\?\"\<\>\|\\\r\\\n]/g, "_");  // '/\:*?"<>|\r\n' -> '_'
                if (fileNameBody.length > 120) fileNameBody = fileNameBody.substring(0,120);
                var tempFile = exportInfo.tempLocation + "/" + fileNameBody + ".psd";
                tempFile = new File( tempFile );
                tempFileList[exportFileCount] = tempFile;
                duppedDocument.saveAs( tempFile );
                duppedDocument.close();
                exportFileCount++;
            }
    
            if (exportFileCount == 0) {
                if ( DialogModes.NO != app.playbackDisplayDialogs ) {
                    alert(strTitle + strAlertFailed );
                }
            	return 'cancel'; // quit, returning 'cancel' (dont localize) makes the actions palette not record our script
            }
    
            // run PDF Presentation
            var presentationOptions = new PresentationOptions();
            presentationOptions.presentation = true;
            presentationOptions.view = true;
            presentationOptions.autoAdvance = exportInfo.ssoAdvance;
            presentationOptions.interval = exportInfo.ssoSeconds;
            presentationOptions.loop = exportInfo.ssoLoop;
            app.makePDFPresentation(tempFileList, File(exportInfo.destination), presentationOptions);
    
            // delete temporary files
            for ( compsIndex = 0; compsIndex < exportFileCount; compsIndex++ ) {
                tempFileList[compsIndex].remove();
            }
            // delete temprary folder
            var tempFolder = new Folder(exportInfo.tempLocation);
            tempFolder.remove();
    
    		var d = objectToDescriptor(exportInfo, strMessage);
            app.putCustomOptions("f2e27792-1ef0-4f6f-a157-3a6ad8f6edf0", d);

    		var dd = objectToDescriptor(exportInfo, strMessage);
            app.playbackParameters = dd;

            if ( DialogModes.ALL == app.playbackDisplayDialogs ) {
                alert(strTitle + strAlertWasSuccessful);
            }

            app.playbackDisplayDialogs = DialogModes.ALL;

        }
    } catch (e) {
        if ( DialogModes.NO != app.playbackDisplayDialogs ) {
            alert(e);
        }
    	return 'cancel'; // quit, returning 'cancel' (dont localize) makes the actions palette not record our script
    }
}
///////////////////////////////////////////////////////////////////////////////
// Function: objectToDescriptor
// Usage: create an ActionDescriptor from a JavaScript Object
// Input: JavaScript Object (o)
//        object unique string (s)
//        Pre process converter (f)
// Return: ActionDescriptor
// NOTE: Only boolean, string, number and UnitValue are supported, use a pre processor
//       to convert (f) other types to one of these forms.
// REUSE: This routine is used in other scripts. Please update those if you 
//        modify. I am not using include or eval statements as I want these 
//        scripts self contained.
///////////////////////////////////////////////////////////////////////////////
function objectToDescriptor (o, s, f) {
	if (undefined != f) {
		o = f(o);
	}
	var d = new ActionDescriptor;
	var l = o.reflect.properties.length;
	d.putString( app.charIDToTypeID( 'Msge' ), s );
	for (var i = 0; i < l; i++ ) {
		var k = o.reflect.properties[i].toString();
		if (k == "__proto__" || k == "__count__" || k == "__class__" || k == "reflect")
			continue;
		var v = o[ k ];
		k = app.stringIDToTypeID(k);
		switch ( typeof(v) ) {
			case "boolean":
				d.putBoolean(k, v);
				break;
			case "string":
				d.putString(k, v);
				break;
			case "number":
				d.putDouble(k, v);
				break;
			default:
			{
				if ( v instanceof UnitValue ) {
					var uc = new Object;
					uc["px"] = charIDToTypeID("#Rlt"); // unitDistance
					uc["%"] = charIDToTypeID("#Prc"); // unitPercent
					d.putUnitDouble(k, uc[v.type], v.value);
				} else {
					throw( new Error("Unsupported type in objectToDescriptor " + typeof(v) ) );
				}
			}
		}
	}
    return d;
}


///////////////////////////////////////////////////////////////////////////////
// Function: descriptorToObject
// Usage: update a JavaScript Object from an ActionDescriptor
// Input: JavaScript Object (o), current object to update (output)
//        Photoshop ActionDescriptor (d), descriptor to pull new params for object from
//        object unique string (s)
//        JavaScript Function (f), post process converter utility to convert
// Return: Nothing, update is applied to passed in JavaScript Object (o)
// NOTE: Only boolean, string, number and UnitValue are supported, use a post processor
//       to convert (f) other types to one of these forms.
// REUSE: This routine is used in other scripts. Please update those if you 
//        modify. I am not using include or eval statements as I want these 
//        scripts self contained.
///////////////////////////////////////////////////////////////////////////////
function descriptorToObject (o, d, s, f) {
	var l = d.count;
	if (l) {
	    var keyMessage = app.charIDToTypeID( 'Msge' );
        if ( d.hasKey(keyMessage) && ( s != d.getString(keyMessage) )) return;
	}
	for (var i = 0; i < l; i++ ) {
		var k = d.getKey(i); // i + 1 ?
		var t = d.getType(k);
		strk = app.typeIDToStringID(k);
		switch (t) {
			case DescValueType.BOOLEANTYPE:
				o[strk] = d.getBoolean(k);
				break;
			case DescValueType.STRINGTYPE:
				o[strk] = d.getString(k);
				break;
			case DescValueType.DOUBLETYPE:
				o[strk] = d.getDouble(k);
				break;
			case DescValueType.UNITDOUBLE:
				{
				var uc = new Object;
				uc[charIDToTypeID("#Rlt")] = "px"; // unitDistance
				uc[charIDToTypeID("#Prc")] = "%"; // unitPercent
				uc[charIDToTypeID("#Pxl")] = "px"; // unitPixels
				var ut = d.getUnitDoubleType(k);
				var uv = d.getUnitDoubleValue(k);
				o[strk] = new UnitValue( uv, uc[ut] );
				}
				break;
			case DescValueType.INTEGERTYPE:
			case DescValueType.ALIASTYPE:
			case DescValueType.CLASSTYPE:
			case DescValueType.ENUMERATEDTYPE:
			case DescValueType.LISTTYPE:
			case DescValueType.OBJECTTYPE:
			case DescValueType.RAWTYPE:
			case DescValueType.REFERENCETYPE:
			default:
				throw( new Error("Unsupported type in descriptorToObject " + t ) );
		}
	}
	if (undefined != f) {
		o = f(o);
	}
}

///////////////////////////////////////////////////////////////////////////
// Function: StrToIntWithDefault
// Usage: convert a string to a number, first stripping all characters
// Input: string and a default number
// Return: a number
///////////////////////////////////////////////////////////////////////////
function StrToIntWithDefault( s, n ) {
    var onlyNumbers = /[^0-9]/g;
    var t = s.replace( onlyNumbers, "" );
	t = parseInt( t );
	if ( ! isNaN( t ) ) {
        n = t;
    }
    return n;
}

///////////////////////////////////////////////////////////////////////////////
// Function: NumericEditKeyboardHandler
// Usage: Do not allow anything except for numbers 0-9
// Input: ScriptUI keydown event
// Return: <nothing> key is rejected and beep is sounded if invalid
///////////////////////////////////////////////////////////////////////////////
function NumericEditKeyboardHandler (event) {
    try {
        var keyIsOK = KeyIsNumeric (event) || 
		              KeyIsDelete (event) || 
					  KeyIsLRArrow (event) ||
					  KeyIsTabEnterEscape (event);
					  
        if (! keyIsOK) {
            //    Bad input: tell ScriptUI not to accept the keydown event
            event.preventDefault();
            /*    Notify user of invalid input: make sure NOT
                to put up an alert dialog or do anything which
                requires user interaction, because that
                interferes with preventing the 'default'
                action for the keydown event */
            app.beep();
        }
    }
    catch (e) {
        ; // alert ("Ack! bug in NumericEditKeyboardHandler: " + e);
    }
}


//    key identifier functions
function KeyHasModifier (event) {
    return event.shiftKey || event.ctrlKey || event.altKey || event.metaKey;
}

function KeyIsNumeric (event) {
    return  (event.keyName >= '0') && (event.keyName <= '9') && ! KeyHasModifier (event);
}

function KeyIsDelete (event) {
    //    Shift-delete is ok
    return (event.keyName == 'Backspace') && ! (event.ctrlKey);
}

function KeyIsLRArrow (event) {
    return ((event.keyName == 'Left') || (event.keyName == 'Right')) && ! (event.altKey || event.metaKey);
}

function KeyIsTabEnterEscape (event) {
	return event.keyName == 'Tab' || event.keyName == 'Enter' || event.keyName == 'Escape';
}

// End Layer Comps To PDF.jsx
