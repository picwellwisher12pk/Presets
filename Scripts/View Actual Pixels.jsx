// View Actual Pixels - Adobe Photoshop Script
// Description: an event-based script that displays the current document at 100% zoom (actual pixels)
// Requirements: Adobe Photoshop CS2, or higher
// Version: 1.1.0, 9/July/2009
// Author: Trevor Morris (trevor@morris-photographics.com)
// Website: http://morris-photographics.com/
// =======================================================
/** "$$$/JavaScripts/ViewActualPixels/Description=Displays the current document at 100% zoom (actual pixels)." **/
// =======================================================
// Installation:
// 1. Place script in "C:\Program Files\Adobe\Adobe Photoshop CS#\Presets\Scripts\Event Scripts Only"
// 2. Choose File > Scripts > Scripts Event Manager
// 3. Select an event (e.g., Open Document, New Document) from the Photoshop Event drop-down
// 4. Select ViewActualPixels.jsx from the Script drop-down
// 5. Press the Add button
// 6. Press the Done button
// =======================================================

function viewActualPixels() {
	var desc = new ActionDescriptor();
	var ref = new ActionReference();
	ref.putEnumerated(cTID('Mn  '), cTID('MnIt'), cTID('ActP'));
	desc.putReference(cTID('null'), ref);
	executeAction(cTID('slct'), desc, DialogModes.NO);
}

function cTID(s) {return app.charIDToTypeID(s);}

viewActualPixels();
