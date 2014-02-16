// c2008 Adobe Systems, Inc. All rights reserved.
// Written by Jeffrey Tranberry

/*
@@@BUILDINFO@@@ Flatten All Layer Effects.jsx 1.0.0.2
*/

/*

// BEGIN__HARVEST_EXCEPTION_ZSTRING

<javascriptresource>
<name>$$$/JavaScripts/FlattenAllLayerEffects/Menu=Flatten All Layer Effects</name>
<category>Flatten</category>
<enableinfo>true</enableinfo>
<eventid>8a761c74-f362-4a1b-a3f7-e779ab319a08</eventid>
<terminology><![CDATA[<< /Version 1 
                         /Events << 
                          /8a761c74-f362-4a1b-a3f7-e779ab319a08 [($$$/JavaScripts/FlattenAllLayerEffects/Menu=Flatten All Layer Effects) /noDirectParam <<
                          >>] 
                         >> 
                      >> ]]></terminology>
</javascriptresource>

// END__HARVEST_EXCEPTION_ZSTRING

*/

/* 
Description:
This script flattens styles for all layers
*/

// enable double clicking from the 
// Macintosh Finder or the Windows Explorer
#target photoshop

// Make Photoshop the frontmost application
app.bringToFront();

/////////////////////////
// SETUP
/////////////////////////

// all the strings that need localized
strFlattenAllLayerEffectsHistoryStepName = localize( "$$$/JavaScripts/FlattenAllLayerEffects/Menu=Flatten All Layer Effects" );

/////////////////////////
// MAIN
/////////////////////////

// remember the document
var doc = app.activeDocument; 


// Create only one history state for the entire script
doc.suspendHistory(strFlattenAllLayerEffectsHistoryStepName, "main()");

// Record the script in the Actions palette when recording an action
try{ 
	var playbackDescription = new ActionDescriptor;
	var playbackReference = new ActionReference;
	playbackReference.putEnumerated( charIDToTypeID("Dcmn"), charIDToTypeID("Ordn"), charIDToTypeID("Trgt") );
	playbackDescription.putReference( charIDToTypeID("null"), playbackReference);
	app.playbackDisplayDialogs = DialogModes.NO;
	app.playbackParameters = playbackDescription;
}catch(e) {
	; // do nothing
}

/////////////////////////
// FUNCTIONS
/////////////////////////

///////////////////////////////////////////////////////////////////////////////
// Function: main
// Usage: container function to hold all the working code that generates history states
// Input: <none> Must have an open document
// Return: <none>
///////////////////////////////////////////////////////////////////////////////
function main(){
	
	var currentLayer = doc.activeLayer; // remember the selected layer
	var currentVisible = currentLayer.visible; // remember the visibility setting of the selected layer
	var currentSelectedLayers = getSelectedLayers(); // remember the selected layers
	if (currentSelectedLayers.length < 1){
		var currentLayer = activeDocument.activeLayer; // remember the selected layers
	}

	// create an array and store all the art layers states
	var currentState = new Array;
	try{ 
		getCurrentStateAlteringAsNeeded(activeDocument, currentState);
	}catch(e) {
		; // do nothing
	}
	
	// Do some voodoo on the layer selection incase no layer is selected or multiple layers are selected
	try{ 
		touchUpLayerSelection()
	}catch(e) {
		; // do nothing
	}
	
	// create an array and store all the art layers in that array
	var allArtLayers = new Array;
	var allVisibleInfo = new Array;
	getAllArtLayers(doc, allArtLayers, allVisibleInfo);

	// Walk the layer stack
	for (var i = 0; i < allArtLayers.length; i++){ 
		try{ 
			doc.activeLayer = allArtLayers[i];
			if (hasLayerStyle() == true){ // Only if the has a layer style
					flattenLayerStyles(); // Flatten the styles into the layer
				}
		}catch(e) {
			; // do nothing
		}
	}

	// restore the current state of the layers
	try{ 
		setCurrentState(currentState);
	}catch(e) {
		; // do nothing
	}
	if (currentSelectedLayers.length > 1){
		try{ 
			setSelectedLayers(currentSelectedLayers);
		}catch(e) {
			; // do nothing
		}
	}

	// restore the selected layer
	try{ 
		doc.activeLayer = currentLayer;
	}catch(e) {
		; // do nothing
	}

	// restore the visibility setting of the original layer
	try{ 
		currentLayer.visible = currentVisible;
	}catch(e) {
		; // do nothing
	}

}

///////////////////////////////////////////////////////////////////////////////
// Function: touchUpLayerSelection
// Usage: deal with odd layer selections of no layer selected or multiple layers
// Input: <none> Must have an open document
// Return: <none>
///////////////////////////////////////////////////////////////////////////////
function touchUpLayerSelection() {
	try{ 
		// Select all Layers
		var idselectAllLayers = stringIDToTypeID( "selectAllLayers" );
			var desc252 = new ActionDescriptor();
			var idnull = charIDToTypeID( "null" );
				var ref174 = new ActionReference();
				var idLyr = charIDToTypeID( "Lyr " );
				var idOrdn = charIDToTypeID( "Ordn" );
				var idTrgt = charIDToTypeID( "Trgt" );
				ref174.putEnumerated( idLyr, idOrdn, idTrgt );
			desc252.putReference( idnull, ref174 );
		executeAction( idselectAllLayers, desc252, DialogModes.NO );
		// Select the previous layer
		var idslct = charIDToTypeID( "slct" );
			var desc209 = new ActionDescriptor();
			var idnull = charIDToTypeID( "null" );
				var ref140 = new ActionReference();
				var idLyr = charIDToTypeID( "Lyr " );
				var idOrdn = charIDToTypeID( "Ordn" );
				var idBack = charIDToTypeID( "Back" );
				ref140.putEnumerated( idLyr, idOrdn, idBack );
			desc209.putReference( idnull, ref140 );
			var idMkVs = charIDToTypeID( "MkVs" );
			desc209.putBoolean( idMkVs, false );
		executeAction( idslct, desc209, DialogModes.NO );
	}catch(e) {
		; // do nothing
	}
}

///////////////////////////////////////////////////////////////////////////////
// Function: hasLayerStyle
// Usage: see if there are styles present on a layer
// Input: <none> Must have an open document
// Return: true if there is a layer style/effect present
///////////////////////////////////////////////////////////////////////////////
function hasLayerStyle() {
	var hasLayerStyle = false;
	try {
		var ref = new ActionReference();
		var keyLayerEffects = app.charIDToTypeID( 'Lefx' );
		ref.putProperty( app.charIDToTypeID( 'Prpr' ), keyLayerEffects );
		ref.putEnumerated( app.charIDToTypeID( 'Lyr ' ), app.charIDToTypeID( 'Ordn' ), app.charIDToTypeID( 'Trgt' ) );
		var desc = executeActionGet( ref );
		if ( desc.hasKey( keyLayerEffects ) ) {
			hasLayerStyle = true;
		}
	}catch(e) {
		hasLayerStyle = false;
	}
	return hasLayerStyle;
}

///////////////////////////////////////////////////////////////////////////////
// Function: flattenLayerStyles
// Usage: worker function for flattening styles into the layer
// Input: <none> Must have an open document
// Return: <none>
///////////////////////////////////////////////////////////////////////////////
function flattenLayerStyles() {
	try {
		var targetLayer = app.activeDocument.activeLayer.name; // Remember the layers name
		makeLayerBelow(targetLayer); // Make a new layer below with the target layers name
		selectPreviousLayer(); // select the previous layer
		mergeDown(); // and merge it down
	}catch(e) {
		; // do nothing
	}
}

///////////////////////////////////////////////////////////////////////////////
// Function: makeLayerBelow
// Usage: Creates a new layer below with the target layers name
// Input: targetName. the name of the layer we want to create a new layer below
// Return: <none>
///////////////////////////////////////////////////////////////////////////////
function makeLayerBelow(targetName) {
	try {
		var id829 = charIDToTypeID( "Mk  " );
			var desc169 = new ActionDescriptor();
			var id830 = charIDToTypeID( "null" );
				var ref105 = new ActionReference();
				var id831 = charIDToTypeID( "Lyr " );
				ref105.putClass( id831 );
			desc169.putReference( id830, ref105 );
			var id832 = stringIDToTypeID( "below" );
			desc169.putBoolean( id832, true );
			var id833 = charIDToTypeID( "Usng" );
				var desc170 = new ActionDescriptor();
				var id834 = charIDToTypeID( "Nm  " );
				desc170.putString( id834, targetName );
			var id835 = charIDToTypeID( "Lyr " );
			desc169.putObject( id833, id835, desc170 );
		executeAction( id829, desc169, DialogModes.NO );
	}catch(e) {
		; // do nothing
	}
}

///////////////////////////////////////////////////////////////////////////////
// Function: selectPreviousLayer
// Usage: Selects the layer above the selected layer, adding that layer to the current layer selection
// Input: <none> Must have an open document
// Return: <none>
///////////////////////////////////////////////////////////////////////////////
function selectPreviousLayer() {
	try {
		var idslct = charIDToTypeID( "slct" );
			var desc9 = new ActionDescriptor();
			var idnull = charIDToTypeID( "null" );
				var ref8 = new ActionReference();
				var idLyr = charIDToTypeID( "Lyr " );
				var idOrdn = charIDToTypeID( "Ordn" );
				var idFrwr = charIDToTypeID( "Frwr" );
				ref8.putEnumerated( idLyr, idOrdn, idFrwr );
			desc9.putReference( idnull, ref8 );
			var idselectionModifier = stringIDToTypeID( "selectionModifier" );
			var idselectionModifierType = stringIDToTypeID( "selectionModifierType" );
			var idaddToSelection = stringIDToTypeID( "addToSelection" );
			desc9.putEnumerated( idselectionModifier, idselectionModifierType, idaddToSelection );
			var idMkVs = charIDToTypeID( "MkVs" );
			desc9.putBoolean( idMkVs, false );
		executeAction( idslct, desc9, DialogModes.NO );
	}catch(e) {
		; // do nothing
	}
}

///////////////////////////////////////////////////////////////////////////////
// Function: mergeDown
// Usage: merges the currently selected layers into one layer. If only one layer is selected it merges the current layer down into the layer below
// Input: <none> Must have an open document
// Return: <none>
///////////////////////////////////////////////////////////////////////////////
function mergeDown() {
	try {
		var id828 = charIDToTypeID( "Mrg2" );
			var desc168 = new ActionDescriptor();
		executeAction( id828, desc168, DialogModes.NO );
	}catch(e) {
		; // do nothing
	}
}

///////////////////////////////////////////////////////////////////////////////
// Function: getAllArtLayers
// Usage: get a reference to all artLayers in 
// the document, does recursion into groups
// Input: obj, current object, document or layerSet
// layersArray, place to put the resulting artLayers,
// layersArray is both input and output
// Return: <none>
///////////////////////////////////////////////////////////////////////////////
function getAllArtLayers(obj, layersArray, visibleArray) {
	for( var i = 0; i < obj.artLayers.length; i++) {
		layersArray.push(obj.artLayers[i]);
		//alert(obj.artLayers[i].name);
		visibleArray.push(obj.artLayers[i].visible);
	}
	for( var i = 0; i < obj.layerSets.length; i++) {
		getAllArtLayers(obj.layerSets[i], layersArray, visibleArray);	// recursive call
	}
}

///////////////////////////////////////////////////////////////////////////////
// Function: getSelectedLayers
// Usage: creates and array of the currently selected layers
// Input: <none> Must have an open document
// Return: Array selectedLayers
///////////////////////////////////////////////////////////////////////////////
function getSelectedLayers() {
	var selectedLayers = [];
	try {
		var backGroundCounter = activeDocument.artLayers[activeDocument.artLayers.length-1].isBackgroundLayer ? 0 : 1;
		var ref = new ActionReference();
		var keyTargetLayers = app.stringIDToTypeID( 'targetLayers' );
		ref.putProperty( app.charIDToTypeID( 'Prpr' ), keyTargetLayers );
		ref.putEnumerated( app.charIDToTypeID( 'Dcmn' ), app.charIDToTypeID( 'Ordn' ), app.charIDToTypeID( 'Trgt' ) );
		var desc = executeActionGet( ref );
		if ( desc.hasKey( keyTargetLayers ) ) {
			var layersList = desc.getList( keyTargetLayers );
			for ( var i = 0; i < layersList.count; i++) {
				var listRef = layersList.getReference( i );
				selectedLayers.push( listRef.getIndex() + backGroundCounter );
			}
		}
	}
	catch(e) {
		; // do nothing
	}
	return selectedLayers;
}

///////////////////////////////////////////////////////////////////////////////
// Function: setSelectedLayers
// Usage: Selects an array of layers
// Input:  Array selectedLayers
// Return: <none>
///////////////////////////////////////////////////////////////////////////////
function setSelectedLayers( layerIndexesOrNames ) {
	// first select the first one
	setSelectedLayer( layerIndexesOrNames[0] );

	// then add to the selection
	for ( var i = 1; i < layerIndexesOrNames.length; i++) {
		addSelectedLayer( layerIndexesOrNames[i] );
	}
}

///////////////////////////////////////////////////////////////////////////////
// Function: setSelectedLayer
// Usage: Selects the first layer
// Input:  Array selectedLayers
// Return: <none>
///////////////////////////////////////////////////////////////////////////////
function setSelectedLayer( layerIndexOrName ) {
	try {
		var id239 = charIDToTypeID( "slct" );
		var desc45 = new ActionDescriptor();
		var id240 = charIDToTypeID( "null" );
		var ref43 = new ActionReference();
		var id241 = charIDToTypeID( "Lyr " );
		if ( typeof layerIndexOrName == "number" ) {
			ref43.putIndex( id241, layerIndexOrName );
		} else {
			ref43.putName( id241, layerIndexOrName );
		}
		desc45.putReference( id240, ref43 );
		var id242 = charIDToTypeID( "MkVs" );
		desc45.putBoolean( id242, false );
		executeAction( id239, desc45, DialogModes.NO );
	}
	catch(e) {
		alert(e + ":" + e.line); // do nothing
	}
}

///////////////////////////////////////////////////////////////////////////////
// Function: addSelectedLayer
// Usage: adds the rest of the layers in the array to the first layer
// Input:  Array selectedLayers
// Return: <none>
///////////////////////////////////////////////////////////////////////////////
function addSelectedLayer( layerIndexOrName ) {
	try {
		var id243 = charIDToTypeID( "slct" );
		var desc46 = new ActionDescriptor();
		var id244 = charIDToTypeID( "null" );
		var ref44 = new ActionReference();
		var id245 = charIDToTypeID( "Lyr " );
		if ( typeof layerIndexOrName == "number" ) {
			ref44.putIndex( id245, layerIndexOrName );
		} else {
			ref44.putName( id245, layerIndexOrName );
		}
		desc46.putReference( id244, ref44 );
		var id246 = stringIDToTypeID( "selectionModifier" );
		var id247 = stringIDToTypeID( "selectionModifierType" );
		var id248 = stringIDToTypeID( "addToSelection" );
		desc46.putEnumerated( id246, id247, id248 );
		var id249 = charIDToTypeID( "MkVs" );
		desc46.putBoolean( id249, false );
		executeAction( id243, desc46, DialogModes.NO );
	}
	catch(e) {
		alert(e + ":" + e.line); // do nothing
	}
}

///////////////////////////////////////////////////////////////////////////////
// Function:  getCurrentStateAlteringAsNeeded
// Usage: capture the current state of the layers in an array
// Input: <none> Must have an open document
// Return: <none>
///////////////////////////////////////////////////////////////////////////////
function getCurrentStateAlteringAsNeeded( obj, stateArray ) {
	for( var i = 0; i < obj.artLayers.length; i++) {
		var oState = new ObjectState(obj.artLayers[i]);
		if ( oState.fixState( obj.artLayers[i], obj.artLayers[i].visible, true)) {
			obj.artLayers[i].visible = true;
		}
		if ( ! obj.artLayers[i].isBackgroundLayer) {
			if ( oState.fixState( obj.artLayers[i], obj.artLayers[i].allLocked, false)) {
				obj.artLayers[i].allLocked = false;
			}
			if ( oState.fixState( obj.artLayers[i], obj.artLayers[i].pixelsLocked, false)) {
				obj.artLayers[i].pixelsLocked = false;
			}
			if ( oState.fixState( obj.artLayers[i], obj.artLayers[i].positionLocked, false)) {
				obj.artLayers[i].positionLocked = false;
			}
			if ( oState.fixState( obj.artLayers[i], obj.artLayers[i].transparentPixelsLocked, false)) {
				obj.artLayers[i].transparentPixelsLocked = false;
			}
		}
		stateArray.push(oState);
	}
	for( var i = 0; i < obj.layerSets.length; i++ ) {
		var oState = new ObjectState(obj.layerSets[i]);
		if ( oState.fixState( obj.layerSets[i], obj.layerSets[i].visible, true)) {
			obj.layerSets[i].visible = true;
		}
		if ( oState.fixState( obj.layerSets[i], obj.layerSets[i].allLocked, false)) {
			obj.layerSets[i].allLocked = false;
		}
		stateArray.push(oState);
		getCurrentStateAlteringAsNeeded(obj.layerSets[i], stateArray);	// recursive call
	}
}

///////////////////////////////////////////////////////////////////////////////
// Function:  setCurrentState
// Usage: set the state of the layers back to what what captured
// Input: <none> Must have an open document
// Return: <none>
///////////////////////////////////////////////////////////////////////////////
function setCurrentState(stateArray) {
	for ( var i = 0; i < stateArray.length; i++ ) {
		try {
			if (stateArray[i].altered) {
				app.refresh();
				activeDocument.activeLayer = stateArray[i].layer;
				stateArray[i].layer.allLocked = stateArray[i].allLocked;
				if ( ! stateArray[i].allLocked) {
					stateArray[i].layer.pixelsLocked = stateArray[i].pixelsLocked;
					stateArray[i].layer.positionLocked = stateArray[i].positionLocked;
					stateArray[i].layer.transparentPixelsLocked = stateArray[i].transparentPixelsLocked;
				}
				stateArray[i].layer.visible = stateArray[i].visible;
			}
		}
		catch(e) { alert(e + ":" + e.line); }
	}
}


///////////////////////////////////////////////////////////////////////////////
// Function:  ObjectState
// Usage: 
// Input: <none> Must have an open document
// Return: <none>
///////////////////////////////////////////////////////////////////////////////
function ObjectState( inObject ) {
	this.layer = inObject;
	this.visible = inObject.visible;
	this.allLocked = inObject.allLocked;
	this.pixelsLocked = inObject.pixelsLocked;
	this.positionLocked = inObject.positionLocked;
	this.transparentPixelsLocked = inObject.transparentPixelsLocked;
	this.altered = false;
	this.current = false;
	this.fixState = function (inObject, inState, wantState) {
		var wasAltered = false;
		if (inState != wantState) {
			if (this.current == false) {
				activeDocument.activeLayer = inObject;
				this.altered = true;
				this.current = true;
			}
			wasAltered = true;
		}
		return wasAltered;
	}
}


// End Flatten All Layer Effects.jsx