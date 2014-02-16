// Find Layer - Adobe Photoshop Script
// Description: searches all layers by name and selects the first match
// Requirements: Adobe Photoshop CS2, or higher
// Version: 0.8.1, 15/July/2009
// Author: Trevor Morris (trevor@morris-photographics.com)
// Website: http://morris-photographics.com/
// ============================================================================
// Installation:
// 1. Place script in 'C:\Program Files\Adobe\Adobe Photoshop CS#\Presets\Scripts\'
// 2. Restart Photoshop
// 3. Choose File > Scripts > Find Layer
// ============================================================================

// enable double-clicking from Mac Finder or Windows Explorer
// this command only works in Photoshop CS2 and higher
#target photoshop

// bring application forward for double-click events
app.bringToFront();

///////////////////////////////////////////////////////////////////////////////
// main - main function
///////////////////////////////////////////////////////////////////////////////
function main(name) {
	// prompt for layer name (first run)
	if (!name) {
		var name = prompt('Enter the name of the layer you wish to find:', 'Layer Name', 'Find Layer');
	}
	// prompt for layer name (after unsuccessful find)
	else {
		name = prompt('"' + name + '" not found.\n' +
			'Would you like try another search?', name, 'Find Layer');
	}

	// find layer; quit on cancel button or escape key
	if (name) {
		var match = findLayer(activeDocument, name);

		// repeat find if layer not found
		if (!match) {
			main(name);
		}
	}
}

///////////////////////////////////////////////////////////////////////////////
// findLayer - iterate through layers to find a match
///////////////////////////////////////////////////////////////////////////////
function findLayer(ref, name) {
	// declare local variables
	var layers = ref.layers;
	var len = layers.length;
	var match = false;

	// iterate through layers to find a match
	for (var i = 0; i < len; i++) {
		// test for matching layer
		var layer = layers[i];
		if (layer.name.toLowerCase() == name.toLowerCase()) {
			// select matching layer
			activeDocument.activeLayer = layer;
			match = true;
			break;
		}
		// handle groups (layer sets)
		else if (layer.typename == 'LayerSet') {
			match = findLayer(layer, name);
			if (match) {
				break;
			}
		}
	}
	return match;
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
			activeDocument.suspendHistory('Find Layer', 'main()');
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
