/*!
 * Description: 
 * Exports layers to SVG files
 * http://sixtudio.com/
 * http://github.com/mtreik/export-svg
 */
 
//Global
var _docRef = app.activeDocument;
var _docPath = _docRef.path;
var _ignoreHidden = true;
var _destination;
var _auxDoc;

//ArtBoard size
var boardSize = 150; //Modify if you vary the size of the canvas where the layer is exported
var artBoardSize = (function setArtBoardSize(){
		var size = [0 - boardSize, 0, 0, 0 - boardSize];
		return size;
}());

//SVG Export Options
var svgExportOptions = (function svgExportOptions(){
		var options = new ExportOptionsSVG();
		options.fontSubsetting = SVGFontSubsetting.GLYPHSUSED;
		options.embedRasterImages = false;
		options.fontType = SVGFontType.OUTLINEFONT;
		options.artBoardClipping = true;
		return options;
}());

//-*-Start export
function initExport(){

	//Get N1 layers
	var layersN1 = _docRef.layers;

	for(i = 0; i < layersN1.length; i++){
		
		//Get N1 layer
		var layerN1 = layersN1[i];
		
		//Export N1 layer
		exportLayer(layerN1);
	}	
	
	//Close the auxiliar document
	_auxDoc.close(SaveOptions.DONOTSAVECHANGES);
}

//-*-Export Layer
function exportLayer(layer, path){
	
	if(!(_ignoreHidden && !layer.visible)){
	
		copyLayerTo(layer, _auxDoc);		
		selectAll(_auxDoc);		
		reNameLayer(_auxDoc, layer.name);		
		centerLayer(_auxDoc);				
		exportAsSVG(validateLayerName(layer.name, '-'), _auxDoc, path);
		
		//Delete all the content of auxiliar document
		_auxDoc.activeLayer.pageItems.removeAll();
	}
};

//-*-Copy layer to auxiliar document
function copyLayerTo(layer, doc){
	var pageItem;
	var numPageItems = layer.pageItems.length;
	for (var i = 0; i < numPageItems; i += 1){
		pageItem = layer.pageItems[i];
		pageItem.duplicate(_auxDoc.activeLayer, ElementPlacement.PLACEATEND);
	}
};

//-*-Selectt all
function selectAll(doc){
	var pageItems = doc.pageItems;
	var numPageItems = doc.pageItems.length;
	for (var i = 0; i < numPageItems; i += 1){
		pageItems[i].selected = true;
	}
};

//-*-Rename layer
function reNameLayer(doc, name){
	doc.activeLayer.name = name;
};

//-*-Center layer
function centerLayer(doc){
	var layer = doc.layers;
	var group = layer[0].groupItems[0];	
		
	group.top = 0;
	group.left = 0;
	group.translate(0 - boardSize, 0);
	
	var halfWidth = group.width / 2;
	var halfHeight = group.height / 2;
	var halfBoardSize = boardSize / 2;
	
	var posX = halfBoardSize - halfWidth;
	var posY = halfHeight - halfBoardSize;
		
	group.translate(posX, posY);			
};

//-*-Export as SVG
function exportAsSVG(name, doc){
	var file = new File(_destination + '/' + name + '.svg');
	_auxDoc.exportFile(file, ExportType.SVG, svgExportOptions);
};

//-*-Validate name
function validateLayerName(value, separator){
	separator = separator || '_';
	
	return value.toLowerCase().replace(/\s/, separator);
};
 
 
//Init
(function(){
	
	//Choose destination folder
	_destination = Folder.selectDialog('Select folder for SVG files.', _docPath);	
	if(!_destination){return;}
	
	//Create auxiliar document
	_auxDoc = app.documents.add(DocumentColorSpace.RGB);
	_auxDoc.artboards[0].artboardRect = artBoardSize;
	
	//Star the export
	initExport();
}());
