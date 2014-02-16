// Center Layer - Adobe Photoshop Script
// Description: a simple script that centers the active layer
// Requirements: Adobe Photoshop CS, or higher
// Version: 1.1.0, 6/July/2009
// Author: Trevor Morris (trevor@morris-photographics.com)
// Website: http://morris-photographics.com/
// ============================================================================
// Installation:
// 1. Place script in 'C:\Program Files\Adobe\Adobe Photoshop CS#\Presets\Scripts\'
// 2. Restart Photoshop
// 3. Choose File > Scripts > Center Layer
// ============================================================================

// enable double-clicking from Mac Finder or Windows Explorer
// this command only works in Photoshop CS2 and higher
#target photoshop

// bring application forward for double-click events
app.bringToFront();

///////////////////////////////////////////////////////////////////////////////
// main - main function
///////////////////////////////////////////////////////////////////////////////
function main() {
	// declare local variables
	var doc = activeDocument;
	var layer = doc.activeLayer;
	var bounds = layer.bounds;

	// check if Background layer is selected
	if (layer.isBackgroundLayer) {
		alert("The Background layer can't be centered.\n" +
			'Please select another layer and try again.', 'Background Layer', false);
		return;
	}
	
	// check if current layer contains artwork
	if (bounds[0] == bounds[2]) {
		alert('The current layer contains no artwork.\n' +
			'Please select another layer and try again.', 'Empty Layer', false);
		return;
	}
	
	// check if a group (layer set) is selected; prompt to center entire group
	if (layer.typename == 'LayerSet' && !confirm('Are you sure you want to center the entire group?', false, 'Center Entire Group?')) {
		return;
	}
	
	// set document resolution to 72 ppi (required for CS2)
	var res = doc.resolution;
	doc.resizeImage(undefined, undefined, 72, ResampleMethod.NONE);

	// remember layer lock state
	var allLock = layer.allLocked; 
	var posLock = layer.positionLocked;

	// unlock layer
	layer.allLocked = false;
	layer.positionLocked = false;

	// get doc dimensions
	// BUG: both width and height will be off by +2 px for shape layers
	// NOTE: layers with styles might not be centered correctly
	var docWidth = Number(doc.width);
	var docHeight = Number(doc.height);

	// get layer dimensions
	var layerWidth = Number(bounds[2] - bounds[0]);
	var layerHeight = Number(bounds[3] - bounds[1]);

	// calculate offsets
	var dX = (docWidth - layerWidth) / 2 - Number(bounds[0]);
	var dY = (docHeight - layerHeight) / 2 - Number(bounds[1]);

	// centers the active layer
	layer.translate(dX, dY);

	// restore original document resolution (required for CS2)
	doc.resizeImage(undefined, undefined, res, ResampleMethod.NONE);

	// restore original layer lock state
	layer.allLocked = allLock;
	layer.positionLocked = posLock;
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
	// remember unit settings; switch to pixels
	var originalRulerUnits = preferences.rulerUnits;
	preferences.rulerUnits = Units.PIXELS;

	try {
		// suspend history for CS3 (v10) or higher
		if (parseInt(version, 10) >= 10) {
			activeDocument.suspendHistory('Center Layer', 'main()');
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
