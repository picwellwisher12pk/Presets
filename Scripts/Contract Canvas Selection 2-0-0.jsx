// Contract Canvas Selection - Adobe Photoshop Script
// Description: contracts a selection that touches the document boundaries on one or more sides
// Requirements: Adobe Photoshop CS2, or higher
// Version: 2.0.0, 9/July/2009
// Author: Trevor Morris (trevor@morris-photographics.com)
// Website: http://morris-photographics.com/
// ============================================================================
// Installation:
// 1. Place script in 'C:\Program Files\Adobe\Adobe Photoshop CS#\Presets\Scripts\'
// 2. Restart Photoshop
// 3. Choose File > Scripts > Contract Canvas Selection
// ============================================================================

// Known issues
// hasSelection fails in CS2 due to try/catch bug in CS2

// enable double-clicking from Mac Finder or Windows Explorer
// this command only works in Photoshop CS2 and higher
#target photoshop

// bring application forward for double-click events
app.bringToFront();

///////////////////////////////////////////////////////////////////////////////
// main - main function
///////////////////////////////////////////////////////////////////////////////
function main() {
	// get dialog
	var dlg = getDialog();

	// display dialog; OK == 1; Cancel == 2;
	if (dlg.show() == 1) {
		// add temp layer to ensure the Stroke command is available
		var layer = activeDocument.artLayers.add();

		// store selection in new channel
		var sel = activeDocument.selection;
		var chan = activeDocument.channels.add();
		sel.store(chan);

		// set foreground color to black
		var black = new SolidColor();
		black.gray.gray = 100;

		// stroke inside of selection
		sel.stroke(black, dlg.value, StrokeLocation.INSIDE);

		// load channel as selection
		sel.load(chan);

		// delete channel and temp layer
		chan.remove();
		layer.remove();
	}
}

///////////////////////////////////////////////////////////////////////////////
// getDialog - create Contract Selection dialog
///////////////////////////////////////////////////////////////////////////////
function getDialog() {
	// dialog properties
	var dlg = new Window('dialog');
	dlg.text = 'Contract Seletion';
	dlg.orientation = 'row';
	dlg.margins = 10;
	//dlg.isCancel = false;

	// contract text
	dlg.cst = dlg.add('statictext');
	//dlg.cst.text = '&Contract By:'; // accelerators aren't supported in CS2
	dlg.cst.text = 'Contract By:';

	// contract field
	dlg.cet = dlg.add('edittext');
	var cet = dlg.cet;
	//cet.characters = 4; // characters not supported in CS2
	cet.size = [35, cet.preferredSize.height];
	cet.text = 1;
	cet.active = true;
/*
		// contract field behaviour
		cet.onChange = function() {
			if (!dlg.isCancel) {
				cet.text = checkValue(cet.text);
			}
		};
*/
	// pixel text
	dlg.pst = dlg.add('statictext');
	dlg.pst.text = 'pixels';

	// button group
	dlg.btns = dlg.add('group');
	var btns = dlg.btns;
	btns.orientation = 'column';
	btns.margins.left = 10;

		// ok button
		btns.ok = btns.add('button');
		var ok = btns.ok;
		ok.text = 'OK';

			// ok button behaviour
			ok.onClick = function() {
				var dlgValue = cet.text;
				var chkValue = checkValue(dlgValue);

				if (dlgValue == chkValue) {
					dlg.value = Number(dlgValue);
					dlg.close(1);
				}
				else {
					cet.text = chkValue;
					cet.active = true;
				}
			};

		// cancel button
		btns.cancel = btns.add('button');
		var cancel = btns.cancel;
		btns.cancel.text = 'Cancel';

			// cancel button behaviour
			cancel.onClick = function() {
				//dlg.isCancel = true;
				dlg.close(2);
			};

	// dialog properties
	dlg.defaultElement = ok;
	dlg.cancelElement = cancel;
	dlg.center();
	return dlg;
}

///////////////////////////////////////////////////////////////////////////////
// checkValue - error-check value on change
///////////////////////////////////////////////////////////////////////////////
function checkValue(dlgValue) {
	// declare local variables
	var value = Number(dlgValue);

	// ensure value is a valid number greater than or equal to 1
	if (isNaN(value) || value < 1) {
		value = 1;
	}
	// ensure value is less than 100
	else if (value > 100) {
		value = 100;
	}
	// ensure value is an integer
	else if (Math.round(value) != value) {
		value = Math.round(value);
	}
	// value is fine
	else {
		return dlgValue;
	}

	// show error and return correct value
	alert('An integer between 1 and 100 is required.\nClosest value inserted.', 'Integer Required', true);
	return value.toString();
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
// hasSelection - check for a selection
///////////////////////////////////////////////////////////////////////////////
function hasSelection() {
	// declare local variables
	var doc = activeDocument;
	var layer = doc.activeLayer;
	var history = doc.activeHistoryState;
	var isSelection = false;

	// try Selection > Modify > Border; then undo if selection is detected
	try {
		doc.selection.selectBorder(1);
		doc.activeHistoryState = history;
		doc.activeLayer = layer;
		isSelection = true;
	}
	// catch errors - no selection detected
	catch (e) {
		alert('This script requires a selection.', 'Selection Required', false);
	}
	return isSelection;
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
if (isCorrectVersion() && isOpenDocs() && hasSelection()) {
	// remember unit settings; switch to pixels
	var originalRulerUnits = preferences.rulerUnits;
	preferences.rulerUnits = Units.PIXELS;

	try {
		// suspend history for CS3 (v10) or higher
		if (parseInt(version, 10) >= 10) {
			activeDocument.suspendHistory('Contract Canvas Selection', 'main()');
		}
		// just run main for CS2 (v9)
		else {
			main();
		}
	}
	catch(e) {
		// don't report error on user cancel
		if (e.number != 8007) {
			showError(e);
		}
	}

	// restore original unit setting
	preferences.rulerUnits = originalRulerUnits;
}
