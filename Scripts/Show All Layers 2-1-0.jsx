// Show All Layers - Adobe Photoshop Script
// Description: set the visibility of all layers to on (visible)
// Requirements: Adobe Photoshop CS2, or higher
// Version: 2.1.0, 5/July/2009
// Author: Trevor Morris (trevor@morris-photographics.com)
// Website: http://morris-photographics.com/
// ============================================================================
// Installation:
// 1. Place script in 'C:\Program Files\Adobe\Adobe Photoshop CS#\Presets\Scripts\'
// 2. Restart Photoshop
// 3. Choose File > Scripts > Show All Layers
// ============================================================================

// enable double-clicking from Mac Finder or Windows Explorer
// this command only works in Photoshop CS2 and higher
#target photoshop

// bring application forward for double-click events
app.bringToFront();

///////////////////////////////////////////////////////////////////////////////
// main - set the visibility of all layers to on (visible)
///////////////////////////////////////////////////////////////////////////////
function main() {
	// declare local variables
	var doc = activeDocument;
	var layer = doc.activeLayer;

	// select and show all layers
	selectAllLayers();
	showLayers();

	// turn on Background if it exists
	var background = doc.layers[doc.layers.length -1];
	if (background.isBackgroundLayer) {
		background.visible = true;
	}

	// restore original layer selection
	doc.activeLayer = layer;
}

///////////////////////////////////////////////////////////////////////////////
// selectAllLayers - select all layers (Select > All Layers)
///////////////////////////////////////////////////////////////////////////////
function selectAllLayers() {
	var ref = new ActionReference();
	ref.putEnumerated(cTID('Lyr '), cTID('Ordn'), cTID('Trgt'));
	var desc = new ActionDescriptor();
	desc.putReference(cTID('null'), ref);
	executeAction(sTID('selectAllLayers'), desc, DialogModes.NO);
}

///////////////////////////////////////////////////////////////////////////////
// showLayers - show all selected layers (Layer > Show Layers)
///////////////////////////////////////////////////////////////////////////////
function showLayers() {
	var ref = new ActionReference();
	ref.putEnumerated(cTID('Lyr '), cTID('Ordn'), cTID('Trgt'));
	var list = new ActionList();
	list.putReference(ref);
	var desc = new ActionDescriptor();
	desc.putList(cTID('null'), list);
	executeAction(cTID('Shw '), desc, DialogModes.NO);
}

function cTID(s) {return app.charIDToTypeID(s);}
function sTID(s) {return app.stringIDToTypeID(s);}


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
// hasLayers - ensure that the active document contains at least one layer
///////////////////////////////////////////////////////////////////////////////
function hasLayers() {
	var doc = activeDocument;
	if (doc.layers.length == 1 && doc.activeLayer.isBackgroundLayer) {
		alert('The active document contains no layers.', 'No Layers', false);
		return false;
	}
	else {
		return true;
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
// showError - display error message if something goes wrong
///////////////////////////////////////////////////////////////////////////////
function showError(err) {
	if (confirm('An unknown error has occurred.\n' +
		'Would you like to see more information?', true, 'Unknown Error')) {
			alert(err + ': on line ' + err.line, 'Script Error', true);
	}
}


// test initial conditions prior to running main function
if (isCorrectVersion() && isOpenDocs() && hasLayers()) {
	try {
		// suspend history for CS3 (v10) or higher
		if (parseInt(version, 10) >= 10) {
			activeDocument.suspendHistory('Show All Layers', 'main()');
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
}
