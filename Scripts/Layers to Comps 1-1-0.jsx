// Layers to Comps - Adobe Photoshop Script 
// Description: Creates a layer comp for each layer in the current document
// Requirements: Adobe Photoshop CS, or higher
// Version: 1.1.0, 9/July/2009
// Author: Trevor Morris (trevor@morris-photographics.com)
// Website: http://morris-photographics.com/
// ============================================================================
// Installation:
// 1. Place script in 'C:\Program Files\Adobe\Adobe Photoshop CS#\Presets\Scripts\'
// 2. Restart Photoshop
// 3. Choose File > Scripts > Layers to Comps
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
	var doc = app.activeDocument;

	// check for groups (layer sets)
	if (doc.layerSets.length) {
		 alert('This script only creates comps from layers.\n' +
		 	'Layers within groups (layer sets) will be ignored.', 'Layers to Comps', false);
	}

	// check for existing comps; offer to delete them
	var comps = doc.layerComps.length;
	if (comps && confirm('The current document already contains ' + comps + ' layer comps.\n' +
		'Would you like to delete them before creating new ones?', true, 'Remove Existing Comps?')) {
			doc.layerComps.removeAll();
	}

	// save initial document state as a layer comp
	doc.layerComps.add('Initial Conditions', '', true, true, true);

	// hide layers; create comps
	hideAllLayers(doc);
	createLayerComps(doc);

	// apply 'Initial Conditions' comp to restore original document state
	doc.layerComps.getByName('Initial Conditions').apply();
}

///////////////////////////////////////////////////////////////////////////////
// hideAllLayers - set visibility of all layers to off
///////////////////////////////////////////////////////////////////////////////
function hideAllLayers(doc) {
	var len = doc.layers.length;
	for (var i = 0; i < len; i++) {
		doc.layers[i].visible = false;
	}
}

///////////////////////////////////////////////////////////////////////////////
// createLayerComps - create layer comps for all layers
///////////////////////////////////////////////////////////////////////////////
function createLayerComps(doc) {
	// declare local variables
	var compName = '';
	var compIndex = 1;
	var zeroPadding = 2;
	var layerIndex = doc.layers.length - 1;

	// loop through all layers to create comps
	for (layerIndex, compIndex; layerIndex >= 0; layerIndex--, compIndex++) {
		doc.layers[layerIndex].visible = true;
		compName = 'Comp ' + (compIndex + Math.pow(10, zeroPadding)).toString().substr(1);
		doc.layerComps.add(compName, '', true, true, true);
		doc.layers[layerIndex].visible = false;
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
// hasLayers - ensure that the active document contains at least one layer
///////////////////////////////////////////////////////////////////////////////
function hasLayers() {
	var doc = activeDocument;
	if (doc.layers.length == 1 && doc.activeLayer.isBackgroundLayer) {
		alert('The active document has no layers.', 'No Layers', false);
		return false;
	}
	else {
		return true;
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
			activeDocument.suspendHistory('Layers to Comps', 'main()');
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
