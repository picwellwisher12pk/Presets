function callAction(count)
{
	for(var i = count-1; i >= 0; i--)
	{		
		layer = app.activeDocument.artLayers[i];
		layer.visible = true;
		saveImage(i);
		layer.visible = false;
	}
}

function hideLayers(count)
{
        for(var i = count-1; i >= 0; i--)
	{		
		layer = app.activeDocument.artLayers[i];
		layer.visible = false;
	}
}

function saveImage(i)
{
	var Name = app.activeDocument.name.replace(/\.[^\.]+$/, ''); 
	var Ext = decodeURI(app.activeDocument.name).replace(/^.*\./,''); 
	if(Ext.toLowerCase() != 'psd') return; 
	var Path = app.activeDocument.path; 
	var saveFile = File(Path + "/" + Name + i + ".png"); 
	if(saveFile.exists) saveFile.remove(); 
	SavePNG(saveFile); 
}

function SavePNG(saveFile){ 
    pngSaveOptions = new PNGSaveOptions(); 
	activeDocument.saveAs(saveFile, pngSaveOptions, true, Extension.LOWERCASE); 
} 

function main()
{

var count = app.activeDocument.artLayers.length;
    var firstQ = confirm("This process will save all layers to PNGs and hide all layers. This may take time depending on the amount of layers. This document contains " + count + " layers. Continue?");
    if(firstQ) {
        hideLayers(count);
		callAction(count);
		alert("Process complete");
	}	
}

main();