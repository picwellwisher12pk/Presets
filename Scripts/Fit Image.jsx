// c2008 Adobe Systems, Inc. All rights reserved.
// Written by Ed Rose
// based on the ADM Fit Image by Charles A. McBrian from 1997
// edited by Mike Hale added option to avoid resize on images already smaller than target size


/*
@@@BUILDINFO@@@ Fit Image.jsx 1.0.0.21
*/


/* Special properties for a JavaScript to enable it to behave like an automation plug-in, the variable name must be exactly
   as the following example and the variables must be defined in the top 1000 characters of the file

// BEGIN__HARVEST_EXCEPTION_ZSTRING
<javascriptresource>
<name>$$$/JavaScripts/FitImage/Name=Fit Image...</name>
<menu>automate</menu>
<enableinfo>true</enableinfo>
<eventid>3caa3434-cb67-11d1-bc43-0060b0a13dc4</eventid>
<terminology><![CDATA[<< /Version 1
                         /Events <<
                          /3caa3434-cb67-11d1-bc43-0060b0a13dc4 [($$$/AdobePlugin/FitImage/Name=Fit Image) /imageReference <<
	                       /width [($$$/AdobePlugin/FitImage/Width=width) /pixelsUnit]
	                       /height [($$$/AdobePlugin/FitImage/Height=height) /pixelsUnit]
	                       /limit [($$$/AdobePlugin/FitImage/limit=Don't Enlarge) /boolean]
                          >>]
                         >>
                      >> ]]></terminology>
</javascriptresource>
// END__HARVEST_EXCEPTION_ZSTRING
*/


// enable double clicking from the Macintosh Finder or the Windows Explorer
#target photoshop

// debug level: 0-2 (0:disable, 1:break on error, 2:break at beginning)
// $.level = 2;
// debugger; // launch debugger on next line

// on localized builds we pull the $$$/Strings from a .dat file, see documentation for more details
$.localize = true;

var isCancelled = true; // assume cancelled until actual resize occurs

// the main routine
// the FitImage object does most of the work
try {

	// create our default params
	var sizeInfo = new SizeInfo();

	GlobalVariables();
	CheckVersion();

	var gIP = new FitImage();

	if ( DialogModes.ALL == app.playbackDisplayDialogs ) {
        gIP.CreateDialog();
        gIP.RunDialog();
	}
	else {
		gIP.InitVariables();
		ResizeTheImage(sizeInfo.width.value, sizeInfo.height.value);
	}

	if (!isCancelled) {
		SaveOffParameters(sizeInfo);
	}

}


// Lot's of things can go wrong
// Give a generic alert and see if they want the details
catch( e ) {
	if ( DialogModes.NO != app.playbackDisplayDialogs ) {
		alert( e + " : " + e.line );
	}
}



// restore the dialog modes
app.displayDialogs = gSaveDialogMode;

isCancelled ? 'cancel' : undefined;

//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////

function ResizeTheImage(width, height) {
	var oldPref = app.preferences.rulerUnits;
	var docWidth;
	var docHeight;
	var docRatio;
	var newWidth;
	var newHeight;
	var resolution = app.activeDocument.resolution;
	var limit = sizeInfo.limit;

    app.preferences.rulerUnits = Units.PIXELS; // save old preferences

	// original width, height
	docWidth = (1.0 * app.activeDocument.width * resolution) / 72.0; // decimal inches assuming 72 dpi (used in docRatio)
	docHeight = (1.0 * app.activeDocument.height * resolution) / 72.0; // ditto

	if (docWidth < 1.0 || docHeight < 1.0)
		return true; // error

	if (width < 1 || height < 1)
		return true; // error

	if ( limit && ( docWidth <= width && docHeight <= height ) ){
		app.preferences.rulerUnits = oldPref; // restore old prefs
		isCancelled = false; // if get here, definitely executed
		return false; // no error
	}

	docRatio = docWidth / docHeight; // decimal ratio of original width/height

	newWidth = width;
	newHeight = ((1.0 * width) / docRatio); // decimal calc

	if (newHeight > height) {
		newWidth = docRatio * height; // decimal calc
		newHeight = height;
	}

    // resize the image using a good conversion method while keeping the pixel resolution
    // and the aspect ratio the same
    app.activeDocument.resizeImage(newWidth, newHeight, resolution, ResampleMethod.BICUBIC);
    app.preferences.rulerUnits = oldPref; // restore old prefs
	isCancelled = false; // if get here, definitely executed
	return false; // no error
}


// created in
function SaveOffParameters(sizeInfo) {

	// save off our last run parameters
	var d = objectToDescriptor(sizeInfo, strMessage);
	app.putCustomOptions("3caa3434-cb67-11d1-bc43-0060b0a13dc4", d);
	app.playbackDisplayDialogs = DialogModes.ALL;

	// save off another copy so Photoshop can track them corectly
	var dd = objectToDescriptor(sizeInfo, strMessage);
	app.playbackParameters = dd;
}

function GlobalVariables() {

	// a version for possible expansion issues
	gVersion = 1.1;

	gMaxResize = 300000;

	// remember the dialog modes
	gSaveDialogMode = app.displayDialogs;
	app.displayDialogs = DialogModes.NO;
    gInAlert = false;

	// all the strings that need to be localized
	strTitle = localize( "$$$/JavaScript/FitImage/Title=Fit Image" );
	strConstrainWithin = localize( "$$$/JavaScript/FitImage/ConstrainWithin=Constrain Within" );
	strTextWidth = localize("$$$/JavaScripts/FitImage/Width=&Width:");
	strTextHeight = localize("$$$/JavaScripts/FitImage/Height=&Height:");
	strTextPixels = localize("$$$/JavaScripts/FitImage/Pixels=pixels");
	strButtonOK = localize("$$$/JavaScripts/FitImage/OK=OK");
	strButtonCancel = localize("$$$/JavaScripts/FitImage/Cancel=Cancel");
	strTextSorry = localize("$$$/JavaScripts/FitImage/Sorry=Sorry, Dialog failed");
	strTextInvalidType = localize("$$$/JavaScripts/FitImage/InvalidType=Invalid numeric value");
	strTextInvalidNum = localize("$$$/JavaScripts/FitImage/InvalidNum=A number between 1 and 300000 is required. Closest value inserted.");
	strTextNeedFile = localize("$$$/JavaScripts/FitImage/NeedFile=You must have a file selected before using Fit Image");
	strMessage = localize("$$$/JavaScripts/FitImage/Message=Fit Image action settings");
	strMustUse = localize( "$$$/JavaScripts/ImageProcessor/MustUse=You must use Photoshop CS 2 or later to run this script!" );
	strLimitResize = localize("$$$/JavaScripts/FitImage/Limit=Don^}t Enlarge");
}

// the main class
function FitImage() {

	this.CreateDialog = function() {

		// I will keep most of the important dialog items at the same level
		// and use auto layout
		// use overriding group so OK/Cancel buttons placed to right of panel

		var res =
			"dialog { \
				pAndB: Group { orientation: 'row', \
					info: Panel { orientation: 'column', borderStyle: 'sunken', \
						text: '" + strConstrainWithin +"', \
						w: Group { orientation: 'row', alignment: 'right',\
							s: StaticText { text:'" + strTextWidth +"' }, \
							e: EditText { preferredSize: [70, 20] }, \
							p: StaticText { text:'" + strTextPixels + "'} \
						}, \
						h: Group { orientation: 'row', alignment: 'right', \
							s: StaticText { text:'" + strTextHeight + "' }, \
							e: EditText { preferredSize: [70, 20] }, \
							p: StaticText { text:'" + strTextPixels + "'} \
						}, \
						l: Group { orientation: 'row', alignment: 'left', \
								c:Checkbox { text: '" + strLimitResize + "', value: false }, \
						} \
					}, \
					buttons: Group { orientation: 'column', alignment: 'top',  \
						okBtn: Button { text:'" + strButtonOK +"', properties:{name:'ok'} }, \
						cancelBtn: Button { text:'" + strButtonCancel + "', properties:{name:'cancel'} } \
					} \
				} \
			}";

		// the following, when placed after e: in w and h doesn't show up
		// this seems to be OK since px is put inside the dialog box
		//p: StaticText { text:'" + strTextPixels + "'}

		// create the main dialog window, this holds all our data
		this.dlgMain = new Window(res,strTitle);

		// create a shortcut for easier typing
		var d = this.dlgMain;

	    // match our dialog background color to the host application
        d.graphics.backgroundColor = d.graphics.newBrush (d.graphics.BrushType.THEME_COLOR, "appDialogBackground");
		d.defaultElement = d.pAndB.buttons.okBtn;
		d.cancelElement = d.pAndB.buttons.cancelBtn;
	} // end of CreateDialog

	// initialize variables of dialog
	this.InitVariables = function() {

		var oldPref = app.preferences.rulerUnits;
		app.preferences.rulerUnits = Units.PIXELS;

		// look for last used params via Photoshop registry, getCustomOptions will throw if none exist
		try {
			var desc = app.getCustomOptions("3caa3434-cb67-11d1-bc43-0060b0a13dc4");
			descriptorToObject(sizeInfo, desc, strMessage);
		}

		catch(e) {
			// it's ok if we don't have any options, continue with defaults
		}

		// see if I am getting descriptor parameters
		var fromAction = !!app.playbackParameters.count;
		if( fromAction ){
			// reset sizeInfo to defaults
			SizeInfo = new SizeInfo();
			// set the playback options to sizeInfo
			descriptorToObject(sizeInfo, app.playbackParameters, strMessage);
		}

		// make sure got parameters before this
		if (app.documents.length <= 0) // count of documents viewed
		{
			if ( DialogModes.NO != app.playbackDisplayDialogs ) {
				alert(strTextNeedFile); // only put up dialog if permitted
			}
			app.preferences.rulerUnits = oldPref;
			return false; // if no docs, always return
		}

		var w = app.activeDocument.width;
		var h = app.activeDocument.height;
		var l = true;
		if (sizeInfo.width.value == 0) {
			sizeInfo.width = w;
		}
		else {
			w = sizeInfo.width;
		}
		if (sizeInfo.height.value == 0) {
			sizeInfo.height = h;
		}
		else {
			h = sizeInfo.height;
		}

		app.preferences.rulerUnits = oldPref;
		if ( DialogModes.ALL == app.playbackDisplayDialogs ) {
			var d = this.dlgMain;
			d.ip = this;
			d.pAndB.info.w.e.text = Number(w);
			d.pAndB.info.h.e.text = Number(h);
			d.pAndB.info.l.c.value = sizeInfo.limit;
		}
		return true;
	}

	// routine for running the dialog and it's interactions
	this.RunDialog = function () {
		var d = this.dlgMain;

		// in case hit cancel button, don't close
		d.pAndB.buttons.cancelBtn.onClick = function() {
			var dToCancel = FindDialog( this );
			dToCancel.close( false );
		}

		// nothing for now
		d.onShow = function() {
		}

		// do not allow anything except for numbers 0-9
		d.pAndB.info.w.e.addEventListener ('keydown', NumericEditKeyboardHandler);

		// do not allow anything except for numbers 0-9
		d.pAndB.info.h.e.addEventListener ('keydown', NumericEditKeyboardHandler);

		// hit OK, do resize
		d.pAndB.buttons.okBtn.onClick = function () {
            if (gInAlert == true) {
                gInAlert = false;
                return;
            }

            var wText = d.pAndB.info.w.e.text;
            var hText = d.pAndB.info.h.e.text;
            var lValue = d.pAndB.info.l.c.value;
            var w = Number(wText);
            var h = Number(hText);
            sizeInfo.limit = Boolean(lValue);
            var inputErr = false;

            if ( isNaN( w ) || isNaN( h ) ) {
                if ( DialogModes.NO != app.playbackDisplayDialogs ) {
                    alert( strTextInvalidType );
                }
                if (isNaN( w )) {
                    sizeInfo.width = new UnitValue( 1, "px" );
                    d.pAndB.info.w.e.text = 1;
                } else {
                    sizeInfo.height = new UnitValue( 1, "px" );
                    d.pAndB.info.h.e.text = 1;
                }
                    return false;
            }
            else if (w < 1 || w > gMaxResize || h < 1 || h > gMaxResize) {
                if ( DialogModes.NO != app.playbackDisplayDialogs ) {
                    gInAlert = true;
                    alert( strTextInvalidNum );
                }
            }

            if ( w < 1) {
				inputErr = true;
				sizeInfo.width = new UnitValue( 1, "px" );
				d.pAndB.info.w.e.text = 1;
			}


            if ( w > gMaxResize) {
				inputErr = true;
				sizeInfo.width = new UnitValue( gMaxResize, "px" );
				d.pAndB.info.w.e.text = gMaxResize;
            }

            if ( h < 1) {
				inputErr = true;
				sizeInfo.height = new UnitValue( 1, "px" );
				d.pAndB.info.h.e.text = 1;
            }

            if ( h > gMaxResize) {
				inputErr = true;
				sizeInfo.height = new UnitValue( gMaxResize, "px" );
				d.pAndB.info.h.e.text = gMaxResize;
            }

            if (inputErr == false)  {
                sizeInfo.width = new UnitValue( w, "px" );
                sizeInfo.height = new UnitValue( h, "px" );
                if (ResizeTheImage(w, h)) { // the whole point
                    // error, input or output size too small
                }
                d.close(true);
            }
			return;
		}

		if (!this.InitVariables())
		{
			return true; // handled it
		}

		// give the hosting app the focus before showing the dialog
		app.bringToFront();
		this.dlgMain.center();

		return d.show();
	}
}

function CheckVersion() {
	var numberArray = version.split(".");
	if ( numberArray[0] < 9 ) {
		if ( DialogModes.NO != app.playbackDisplayDialogs ) {
			alert( strMustUse );
		}
		throw( strMustUse );
	}
}

function FindDialog( inItem ) {
	var w = inItem;
	while ( 'dialog' != w.type ) {
		if ( undefined == w.parent ) {
			w = null;
			break;
		}
		w = w.parent;
	}
	return w;
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
					uc["px"] = charIDToTypeID("#Pxl"); // pixelsUnit
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

///////////////////////////////////////////////////////////////////////////////
// Function: SizeInfo
// Usage: object for holding the dialog parameters
// Input: <none>
// Return: object holding the size info
///////////////////////////////////////////////////////////////////////////////
function SizeInfo() {
    this.height = new UnitValue( 0, "px" );
    this.width = new UnitValue( 0, "px" );
    this.limit = false;
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
    return ((event.keyName == 'Backspace') || (event.keyName == 'Delete')) && ! (event.ctrlKey);
}

function KeyIsLRArrow (event) {
    return ((event.keyName == 'Left') || (event.keyName == 'Right')) && ! (event.altKey || event.metaKey);
}

function KeyIsTabEnterEscape (event) {
	return event.keyName == 'Tab' || event.keyName == 'Enter' || event.keyName == 'Escape';
}
// End Fit Image.jsx

