

// enable double clicking from the Macintosh Finder or the Windows Explorer
#target photoshop

// in case we double clicked the file
app.bringToFront();


main();

function main() {
    if ( app.documents.length > 0 )
	{
	var startRulerUnits = app.preferences.rulerUnits;
	app.preferences.rulerUnits = Units.PIXELS;
	removeAllEmpty(app.activeDocument);
	app.preferences.rulerunits = startRulerUnits;
	}
}

function removeAllEmptyArtLayers(obj) {
    for( var i = obj.artLayers.length-1; 0 <= i; i--) {
        try {
		if (obj.artLayers[i].kind == LayerKind.NORMAL && obj.artLayers[i].bounds[2] == 0 && obj.artLayers[i].bounds[3] == 0)
			{
			obj.artLayers[i].remove();
			}
        } 
        catch (e) {
        }
    }
    for( var i = obj.layerSets.length-1; 0 <= i; i--) {
        removeAllEmptyArtLayers(obj.layerSets[i]);
    }
}

function removeAllEmptyLayerSets(obj) {
    var foundEmpty = true;
    for( var i = obj.layerSets.length-1; 0 <= i; i--) {
        if( removeAllEmptyLayerSets(obj.layerSets[i])) {
            obj.layerSets[i].remove();
        } else {
            foundEmpty = false;
        }
    }
    if (obj.artLayers.length > 0) {
		foundEmpty = false;
	}
    return foundEmpty;
}

function removeAllEmpty(docRef) {
    removeAllEmptyArtLayers(docRef);
    removeAllEmptyLayerSets(docRef);
}