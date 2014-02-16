// Black & White Variations - Adobe Photoshop Script
// Description: converts and saves an image to black-and-white using various methods
// Requirements: Adobe Photoshop CS2, or higher
// Version: 0.5.0, 24/Dec/2009
// Author: Trevor Morris (trevor@morris-photographics.com)
// Website: http://morris-photographics.com/
// ============================================================================
// Installation:
// 1. Place script in 'C:\Program Files\Adobe\Adobe Photoshop CS#\Presets\Scripts\'
// 2. Restart Photoshop
// 3. Choose File > Scripts > BW Variations
// ============================================================================

// Things left to do/consider:
// ask before overwriting files
// check for illegal fileNameSeparator
// request: option for not converting documents to grayscale mode

// enable double-clicking from Mac Finder or Windows Explorer
// this command only works in Photoshop CS2 and higher
#target photoshop

// bring application forward for double-click events
app.bringToFront();

///////////////////////////////////////////////////////////////////////////////
// main - main function
///////////////////////////////////////////////////////////////////////////////
function main() {
	// user-customizable variables
	var prefs = new Object();
	prefs.saveFolder = new Folder('~');  // save folder (default: '~')
	prefs.reloadFiles = false;           // initial state for reloading files upon completion (default: false)
	prefs.fileNameSeparator = ' - ';     // name/suffix separator (default: ' - ')
	var browseFolder = prefs.saveFolder; // initial browse folder (default: saveFolder)
	var checkBoxState = false;           // initial state for all variations checkboxes (default: false)

	// array of channel mixer presets (R, G, B)
	var cmArray = [
		[30, 60, 10],
		[34, 33, 33],
		[100, 0, 0],
		[0, 100, 0],
		[0, 0, 100],
		[50, 25, 25],
		[25, 50, 25],
		[25, 25, 50],
		[50, 50, 0],
		[50, 0, 50],
		[0, 50, 50],
		[40, 40, 20],
		[40, 20, 40],
		[20, 40, 40]
	];

	// declare local variables
	var doc = activeDocument;
	prefs.fileArray = new Array();
	prefs.count = 0;

	// if the user-customized save folder doesn't exist, use the 'home' folder
	if (!prefs.saveFolder.exists) {
		prefs.saveFolder = Folder('~');
		browseFolder = prefs.saveFolder;
	}

	// begin dialog layout
	var dlg = new Window('dialog');
	dlg.text = 'Black & White Variations';
	dlg.alignChildren = 'fill';

		var variations = dlg.add('panel');
		variations.orientation = 'column';
		variations.text = 'Variations to create:';
		variations.alignChildren = 'left';
		variations.margins = 15;

			var grayCB = variations.add('checkbox');
			grayCB.text = '&Grayscale';
			grayCB.helpTip = 'Creates a black-and-white image using the Grayscale command';
			grayCB.value = checkBoxState;
			grayCB.onClick = function() {checkValues();};

			var desatCB = variations.add('checkbox');
			desatCB.text = '&Desaturate';
			desatCB.helpTip = 'Creates a black-and-white image using the Desaturate command';
			desatCB.value = checkBoxState;
			desatCB.onClick = function() {checkValues();};

			var lumCB = variations.add('checkbox');
			lumCB.text = '&Luminousity Channel';
			lumCB.helpTip = 'Creates a black-and-white image based on the L*a*b* Luminousity channel';
			lumCB.value = checkBoxState;
			lumCB.onClick = function() {checkValues();};

			var rgbCB = variations.add('checkbox');
			rgbCB.text = 'Red, Green, &Blue Channels';
			rgbCB.helpTip = 'Creates one black-and-white image for each of the three RGB channels';
			rgbCB.value = checkBoxState;
			rgbCB.onClick = function() {checkValues();};

			var mixerCB = variations.add('checkbox');
			mixerCB.text = '&Channel Mixer';
			mixerCB.helpTip = 'Creates ' + cmArray.length + ' black-and-white images based on Channel Mixer presets';
			mixerCB.value = checkBoxState;
			mixerCB.onClick = function() {checkValues();};

		var saveOptions = dlg.add('panel');
		saveOptions.orientation = 'column';
		saveOptions.text = 'Save Options';
		saveOptions.alignChildren = 'fill';
		saveOptions.margins = 15;

			var saveLocation = saveOptions.add('group');
			saveLocation.orientation = 'row';
			saveLocation.alignChildren = 'center';

				var st = saveLocation.add('statictext');
				//st.text = '&Save Location:'; // accelerators don't work inside groups in CS2
				st.text = 'Save Location:';
				st.helpTip = 'Specifies the save location for the selected black-and-white images';

				var et = saveLocation.add('edittext');
				et.text = prefs.saveFolder.fsName;
				//et.characters = 35; // not supported in CS2
				et.size = [250, et.preferredSize.height];

				// verify that the save path exists whenever the value changes
				et.onChange = function() {
					if (!checkSaveFolder()) {
						alert('Please enter a valid location or use the Browse button to select a folder.', 'Invalid Save Location', true);
						okBtn.enabled = false;
					}
					else if (checkValues()) {
						okBtn.enabled = true;
					}
				};

				var browseBtn = saveLocation.add('button');
				browseBtn.text = 'Browse';
				browseBtn.helpTip = 'Choose a save location for the selected black-and-white images';
				browseBtn.properties = {name: 'browse'};

				// define browse button behaviour
				browseBtn.onClick = function() {
					prefs.savePath = Folder.selectDialog('Please select a save location:', browseFolder);
					if (prefs.savePath != null) { // use the browse path if the OK button is pressed
						prefs.saveFolder = prefs.savePath;
						et.text = prefs.saveFolder.fsName;
						checkValues();
					}
				};

			var reloadCB = saveOptions.add('checkbox');
			reloadCB.text = '&Reload variations upon completion'; // extra spaces to allow for expansion
			reloadCB.helpTip = 'Enable this option to reload all black-and-white images upon completion';
			reloadCB.value = prefs.reloadFiles;

		var buttons = dlg.add('group');
		buttons.orientation = 'row';
		buttons.alignment = 'right';

			var okBtn = buttons.add('button');
			okBtn.text = 'OK';
			okBtn.properties = {name: 'ok'};
			okBtn.enabled = false;

			var cancelBtn = buttons.add('button');
			cancelBtn.text = 'Cancel';
			cancelBtn.properties = {name: 'cancel'};

	// end dialog layout

	// verify the dialog values and then display the dialog
	checkValues();
	dlg.center(); // center dialog
	dlg.result = dlg.show();

	///////////////////////////////////////////////////////////////////////////////
	// checkValues - check dialog values and enabled the OK button
	///////////////////////////////////////////////////////////////////////////////
	function checkValues() {
		okBtn.enabled = (checkVariations() && checkSaveFolder());
	}

	///////////////////////////////////////////////////////////////////////////////
	// checkVariations - check variation checkboxes
	///////////////////////////////////////////////////////////////////////////////
	function checkVariations() {
		if (grayCB.value || desatCB.value || lumCB.value || rgbCB.value || mixerCB.value) {
			count = grayCB.value + desatCB.value + lumCB.value + rgbCB.value * 3 + mixerCB.value * cmArray.length;
			reloadCB.text = '&Reload ' + count + ' variation' + ((count == 1) ? '' : 's') + ' upon completion';
			return true;
		}
		else {
			prefs.count = 0;
			reloadCB.text = '&Reload variations upon completion';
			return false;
		}
	}

	///////////////////////////////////////////////////////////////////////////////
	// checkSaveFolder - check save location
	///////////////////////////////////////////////////////////////////////////////
	function checkSaveFolder() {
		if (Folder(et.text).exists) {
			return true;
		}
	}

	// execute relevant variation functions when the OK button is pressed (OK = 1, Cancel = 2)
	if (dlg.result == 1) {
		if (grayCB.value) {
			grayscale(doc, prefs);
		}
		if (desatCB.value) {
			desat(doc, prefs);
		}
		if (lumCB.value) {
			luminousityChannel(doc, prefs);
		}
		if (rgbCB.value) {
			rgbChannels(doc, prefs);
		}
		if (mixerCB.value) {
			channelMixer(doc, prefs, cmArray);
		}
	}

	// reload files if reload checkbox is enabled
	if (reloadCB.value) {
		reloadVariations(prefs);
	}
}

///////////////////////////////////////////////////////////////////////////////
// grayscale - create Grayscale variation
///////////////////////////////////////////////////////////////////////////////
function grayscale(doc, prefs) {
	// duplicate and flatten the original document
	var duplicate = doc.duplicate();
	duplicate.flatten();

	// convert document to grayscale
	if (duplicate.mode != DocumentMode.GRAYSCALE) {
		duplicate.changeMode(ChangeMode.GRAYSCALE);
	}

	// save output
	prefs.fileNameSuffix = 'Grayscale';
	saveFile(duplicate, prefs)
}

///////////////////////////////////////////////////////////////////////////////
// desat - create Desaturate variation
///////////////////////////////////////////////////////////////////////////////
function desat(doc, prefs) {
	// duplicate and flatten the original document
	var duplicate = doc.duplicate();
	duplicate.flatten();

	// convert document to grayscale
	if (duplicate.mode != DocumentMode.GRAYSCALE) {
		// place desat command in here, in case the document is already grayscale
		duplicate.activeLayer.desaturate();
		duplicate.changeMode(ChangeMode.GRAYSCALE);
	}

	// save output
	prefs.fileNameSuffix = 'Desaturate';
	saveFile(duplicate, prefs)
}

///////////////////////////////////////////////////////////////////////////////
// luminousityChannel - create Lightness channel variation (L*a*b* mode)
///////////////////////////////////////////////////////////////////////////////
function luminousityChannel(doc, prefs) {
	// duplicate and flatten the original document
	var duplicate = doc.duplicate();
	duplicate.flatten();

	// convert document to L*a*b* mode
	if (duplicate.mode != DocumentMode.LAB) {
		duplicate.changeMode(ChangeMode.LAB);
	}

	// remove a* and b* channels
	duplicate.channels[2].remove();
	duplicate.channels[1].remove();

	// convert document to grayscale
	duplicate.changeMode(ChangeMode.GRAYSCALE);

	// save output
	prefs.fileNameSuffix = 'Lab (Luminousity)';
	saveFile(duplicate, prefs)
}

///////////////////////////////////////////////////////////////////////////////
// rgbChannels - create Red, Green and Blue channel variations (RGB mode)
///////////////////////////////////////////////////////////////////////////////
function rgbChannels(doc, prefs) {
	for (var i = 0; i < 3; i++) {
		// duplicate and flatten the original document
		activeDocument = doc;
		var duplicate = doc.duplicate();
		duplicate.flatten();

		// convert document to RGB mode
		if (duplicate.mode != DocumentMode.RGB) {
			duplicate.changeMode(ChangeMode.RGB);
		}

		// duplicate and remove channels
		duplicate.channels[i].duplicate();
		duplicate.channels[2].remove();
		duplicate.channels[1].remove();
		duplicate.channels[0].remove();

		// convert document to grayscale
		duplicate.changeMode(ChangeMode.GRAYSCALE);

		// save output
		if (i == 0) {
			prefs.fileNameSuffix = 'RGB (Red)';
		} else if (i == 1) {
			prefs.fileNameSuffix = 'RGB (Green)';
		} else {
			prefs.fileNameSuffix = 'RGB (Blue)';
		}
		saveFile(duplicate, prefs);
	}
}

///////////////////////////////////////////////////////////////////////////////
// channelMixer - create Channel Mixer variations
///////////////////////////////////////////////////////////////////////////////
function channelMixer(doc, prefs, cmArray) {
	// create a grayscale for each combination
	for (var i = 0; i < cmArray.length; i++) {
		activeDocument = doc;
		var red = cmArray[i][0];
		var green = cmArray[i][1];
		var blue = cmArray[i][2];

		// duplicate and flatten the original document
		var duplicate = doc.duplicate();
		duplicate.flatten();

		// convert document to RGB mode
		if (duplicate.mode != DocumentMode.RGB) {
			duplicate.changeMode(ChangeMode.RGB);
		}

		// channel mixer (modified script listener output)
		var desc1 = new ActionDescriptor();
		desc1.putBoolean(cTID('Mnch'), true);

		var desc2 = new ActionDescriptor();
		desc2.putUnitDouble(cTID('Rd  '), cTID('#Prc'), red);
		desc2.putUnitDouble(cTID('Grn '), cTID('#Prc'), green);
		desc2.putUnitDouble(cTID('Bl  '), cTID('#Prc'), blue);

		desc1.putObject(cTID('Gry '), cTID('ChMx'), desc2);
		executeAction(cTID('ChnM'), desc1, DialogModes.NO);

		// convert document to grayscale
		duplicate.changeMode(ChangeMode.GRAYSCALE);

		// save output
		prefs.fileNameSuffix = 'Mix (R' + red + '-G' + green + '-B' + blue + ')';
		saveFile(duplicate, prefs);
	}
}

function cTID(s) {return app.charIDToTypeID(s);}

///////////////////////////////////////////////////////////////////////////////
// saveFile - save b&w variations as 'Filename + Suffix.psd'
///////////////////////////////////////////////////////////////////////////////
function saveFile(doc, prefs) {
	// remove file extension
	var fileNameBody = doc.name;
	fileNameBody = fileNameBody.replace(/(?:\.[^.]*$|$)/, '');

	// convert saveFolder to string and add a trailing slash (if necessary)
	var saveFolderString = prefs.saveFolder.absoluteURI;
	if (!/\/$/.test(saveFolderString)) {
		saveFolderString += '/';
	}

	// build complete path and add to fileArray
	var saveFile = new File(saveFolderString + fileNameBody + prefs.fileNameSeparator + prefs.fileNameSuffix + '.psd');
	prefs.fileArray.push(saveFile);

	// PSD save options
	var psdSaveOptions = new PhotoshopSaveOptions();
	psdSaveOptions.embedColorProfile = true;
	psdSaveOptions.maximizeCompatibility = true;

	// save and close file
	doc.saveAs(saveFile, psdSaveOptions, true, Extension.LOWERCASE);
	doc.close(SaveOptions.DONOTSAVECHANGES);
}

///////////////////////////////////////////////////////////////////////////////
// reloadVariations - reload saved variations upon script completion
///////////////////////////////////////////////////////////////////////////////
function reloadVariations(prefs) {
	for (var i = 0; i < prefs.fileArray.length; i++) {
		open(prefs.fileArray[i]);
	}
}

///////////////////////////////////////////////////////////////////////////////
// isCorrectVersion - check for Adobe Photoshop CS2 (v9) or higher
///////////////////////////////////////////////////////////////////////////////
function isCorrectVersion() {
	if (parseInt(version, 10) >= 9) {
		return true;
	}
	else {
		alert('This script requires Adobe Photoshop CS2 or higher.', 'Wrong Version', false);
		return false;
	}
}

///////////////////////////////////////////////////////////////////////////////
// isOpenDocs - ensure at least one document is open
///////////////////////////////////////////////////////////////////////////////
function isOpenDocs() {
	if (documents.length) {
		return true;
	}
	else {
		alert('There are no documents open.', 'No Documents Open', false);
		return false;
	}
}

///////////////////////////////////////////////////////////////////////////////
// showError - display error message if something goes wrong
///////////////////////////////////////////////////////////////////////////////
function showError(err) {
	if (confirm('An unknown error has occurred.\n' +
		'Would you like to see more information?', true, 'Unknown Error')) {
			alert(err + ': on line ' + err.line, 'Script Error', true);
	}
}


// test initial conditions prior to running main function
if (isCorrectVersion() && isOpenDocs()) {
	try {
		main();
	}
	catch(e) {
		// don't report error on user cancel
		if (e.number != 8007) {
			showError(e);
		}
	}
}
