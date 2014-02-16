// Sort Layers - Adobe Photoshop Script
// Description: sorts all layers in the active document alphanumerically (top to bottom, or bottom to top)
// Requirements: Adobe Photoshop CS2, or higher
// Version: 0.7.0, 5/July/2009
// Author: Trevor Morris (trevor@morris-photographics.com)
// Website: http://morris-photographics.com/
// ============================================================================
// Installation:
// 1. Place script in 'C:\Program Files\Adobe\Adobe Photoshop CS#\Presets\Scripts\'
// 2. Restart Photoshop
// 3. Choose File > Scripts > Sort Layers
// ============================================================================

// Things to do/consider:
// * Sort groups (and layers within groups)

// enable double-clicking from Mac Finder or Windows Explorer
// this command only works in Photoshop CS2 and higher
#target photoshop

// bring application forward for double-click events
app.bringToFront();

///////////////////////////////////////////////////////////////////////////////
// main - sorts all layers in the active document
///////////////////////////////////////////////////////////////////////////////
function main() {
	// user-customizable variables
	var topToBottom = false; // sort top to bottom (true) or bottom to top (false)

	// declare local variables
	var layers = activeDocument.layers;
	var layersArray = new Array();
	var len = layers.length;
	
	// check for Background layer
	var bgLayer = layers[len - 1];
	if (bgLayer.isBackgroundLayer) {
		// include Background in sort?
		if (confirm('Would you like the Background layer included in the sort?', false, 'Sort Background Layer?')) {
			bgLayer.name = 'Background';
			layersArray.push(bgLayer);
		}
		len--;
	}

	// store all layers in an array
	for (var i = 0; i < len; i++) {
		layersArray.push(layers[i]);
	}

	// sort layer top to bottom
	layersArray.sort();

	// sort bottom to top
	if (!topToBottom) {
		layersArray.reverse();
	}

	// sort layers
	len = layersArray.length;
	for (i = 0; i < len; i++) {
		layersArray[i].move(layers[i], ElementPlacement.PLACEBEFORE);
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
			activeDocument.suspendHistory('Sort Layers', 'main()');
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
