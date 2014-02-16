// Duplicate Image (Copies) - Adobe Photoshop Script
// Description: create one or more copies of the active document
// Requirements: Adobe Photoshop CS3, or higher
// Version: 0.1.1, 21/June/2011
// Author: Trevor Morris (trevor@morris-photographics.com)
// Website: http://morris-photographics.com/
// ============================================================================
// Installation:
// 1. Place script in:
//    PC(32):  C:\Program Files (x86)\Adobe\Adobe Photoshop CS#\Presets\Scripts\
//    PC(64):  C:\Program Files\Adobe\Adobe Photoshop CS# (64 Bit)\Presets\Scripts\
//    Mac:     <hard drive>/Applications/Adobe Photoshop CS#/Presets/Scripts/
// 2. Restart Photoshop
// 3. Choose File > Scripts > Duplicate Image (Copies)
// ============================================================================

// enable double-clicking from Mac Finder or Windows Explorer
#target photoshop

// bring application forward for double-click events
app.bringToFront();

///////////////////////////////////////////////////////////////////////////////
// main - main function
///////////////////////////////////////////////////////////////////////////////
function main() {
	// get Duplicate Image dialog
	var dialog = duplicateImageDialog(activeDocument);
	if (dialog.show() == 1) {
		// create duplicate copies
		for (var i = 0; i < dialog.copies; i++) {
			// merge layers
			duplicateImage(dialog.merged);
		}
	}
}

///////////////////////////////////////////////////////////////////////////////
// duplicateImageDialog - create Duplicate Image dialog
///////////////////////////////////////////////////////////////////////////////
function duplicateImageDialog(doc) {
	// dialog properties
	var dlg = new Window('dialog', 'Duplicate Image (Copies)', undefined, {closeButton: false});
	dlg.orientation = 'row';
	dlg.alignChildren = 'fill';
	dlg.merged = false;
	dlg.copies = 1;

	// left side
	var main = dlg.add('group');
	main.orientation = 'column';
	main.alignChildren = 'left';

		// document name group
		var source = main.add('group');
		source.orientation = 'row';

			// label
			source.label = source.add('statictext');
			source.label.text = 'Duplicate:';

			// document name
			source.name = source.add('statictext');
			source.name.text = doc.name;
			source.name.helpTip = getDocumentPath(doc);

		// document copies group
		var copies = main.add('group');
		copies.orientation = 'row';

			// label
			copies.label = copies.add('statictext');
			copies.label.justify = 'right';
			copies.label.text = '&Copies:';
			copies.label.preferredSize.width = source.label.preferredSize.width;

			// document copies field
			copies.field = copies.add('edittext');
			copies.field.characters = 5;
			copies.field.text = 1;
			copies.field.active = true;
			copies.field.addEventListener('keydown', NumericEditKeyboardHandler);
			copies.field.onChange = function() {
				var num = parseInt(this.text, 10);
				if (num < 1 || num > 99) {
					alert('An integer between 1 and 99 is required.', 'Invalid Entry', true);
					num > 99 ? num = 99 : num = 1;
					this.text = num;
					this.active = true;
				}
				dlg.copies = num;
			}

		// merge layers group
		var merged = main.add('group');
		merged.orientation = 'row';

			// merge layers checkbox
			merged.cb = merged.add('checkbox');
			merged.cb.text = 'Duplicate &Merged Layers Only';
			merged.value = false;
			merged.enabled = doc.layers.length > 1 ? true : false;
			merged.cb.onClick = function() {
				dlg.merged = this.value;
			}

	// buttons group
	var buttons = dlg.add('group');
	buttons.orientation = 'column';
	buttons.alignChildren = 'fill';

		// OK button
		var btnOK = buttons.add('button');
		btnOK.text = 'OK';
		dlg.defaultElement = btnOK;

		// Cancel button
		var btnCancel = buttons.add('button');
		btnCancel.text = 'Cancel';
		dlg.cancelElement = btnCancel;

	return dlg;
}

///////////////////////////////////////////////////////////////////////////////
// getDocumentPath - returns the document path if one exists
///////////////////////////////////////////////////////////////////////////////
function getDocumentPath(doc) {
	try {
		return File(doc.fullName).fsName;
	}
	catch(e) {
		return '';
	}
}

///////////////////////////////////////////////////////////////////////////////
// duplicateImage - Image Duplicate 
///////////////////////////////////////////////////////////////////////////////
function duplicateImage(merged) {
	var desc1 = new ActionDescriptor();
	var ref1 = new ActionReference();
	ref1.putEnumerated(cTID('Dcmn'), cTID('Ordn'), cTID('Frst'));
	desc1.putReference(cTID('null'), ref1);
	if (merged) {desc1.putBoolean(cTID('Mrgd'), true);}
	executeAction(cTID('Dplc'), desc1, DialogModes.NO);
}

function cTID(s) {return app.charIDToTypeID(s);}


///////////////////////////////////////////////////////////////////////////////
// Function: NumericEditKeyboardHandler
// Source: Adobe
// Usage: Do not allow anything except for numbers 0-9
// Input: ScriptUI keydown event
// Return: <nothing> key is rejected and beep is sounded if invalid
///////////////////////////////////////////////////////////////////////////////
function NumericEditKeyboardHandler(event) {
	try {
		var keyIsOK = KeyIsNumeric(event) || KeyIsDelete(event) || KeyIsLRArrow(event) || KeyIsTabEnterEscape(event);
		if (!keyIsOK) {
			//	Bad input: tell ScriptUI not to accept the keydown event
			event.preventDefault();
			// Notify user of invalid input:
			// make sure NOT to put up an alert dialog or do anything which requires user interaction,
			// because that interferes with preventing the 'default' action for the keydown event
			app.beep();
		}
	}
	catch(e) {
		// alert('Ack! Bug in NumericEditKeyboardHandler: ' + e);
	}
}

// key identifier functions
function KeyHasModifier(event) {
	return event.shiftKey || event.ctrlKey || event.altKey || event.metaKey;
}

function KeyIsNumeric(event) {
	return (event.keyName >= '0') && (event.keyName <= '9') && !KeyHasModifier(event);
}

function KeyIsDelete(event) {
	//	Shift-delete is ok
	return (event.keyName == 'Backspace') && !(event.ctrlKey);
}

function KeyIsLRArrow(event) {
	return ((event.keyName == 'Left') || (event.keyName == 'Right')) && !(event.altKey || event.metaKey);
}

function KeyIsTabEnterEscape(event) {
	return event.keyName == 'Tab' || event.keyName == 'Enter' || event.keyName == 'Escape';
}


///////////////////////////////////////////////////////////////////////////////
// isCorrectVersion - check for Adobe Photoshop CS3 (v10) or higher
///////////////////////////////////////////////////////////////////////////////
function isCorrectVersion() {
	if (parseInt(version, 10) >= 10) {
		return true;
	}
	else {
		alert('This script requires Adobe Photoshop CS3 or higher.', 'Wrong version', false);
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
		alert('There are no documents open.', 'No documents open', false);
		return false;
	}
}

///////////////////////////////////////////////////////////////////////////////
// showError - display error message if something goes wrong
///////////////////////////////////////////////////////////////////////////////
function showError(err) {
	if (confirm('An unknown error has occurred.\n' +
		'Would you like to see more information?', true, 'Unknown error')) {
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
