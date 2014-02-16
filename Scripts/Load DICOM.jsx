// Import DICOM folder - Photoshop CS and higher Script
// Description: Imports a series of images (from the designated folder)
// Author: Mark Maguire

/*
@@@BUILDINFO@@@ Load DICOM.jsx 1.0.0.1
*/

//
// Load DICOM.jsx - does just that.
//

/*

// BEGIN__HARVEST_EXCEPTION_ZSTRING

<javascriptresource>
<name>$$$/JavaScripts/LoadDICOM/Menu=Load Multiple DICOM Files...</name>
<featureenabled>Dicom</featureenabled>
</javascriptresource>

// END__HARVEST_EXCEPTION_ZSTRING

*/
// debugging code
/*
$.level = 2;
debugger;
*/
// on localized builds we pull the $$$/Strings from a .dat file
$.localize = true;

// enable double-clicking from Mac Finder or Windows Explorer
#target photoshop // this command only works in Photoshop CS2 and higher

// bring application forward for double-click events
app.bringToFront();

function SelectTheLayers()
{
	var id77 = stringIDToTypeID("selectAllLayers");
	var desc16 = new ActionDescriptor();
	var id78 = charIDToTypeID("null");
	var ref14 = new ActionReference();
	var id79 = charIDToTypeID("Lyr ");
	var id80 = charIDToTypeID("Ordn");
	var id81 = charIDToTypeID("Trgt");
	ref14.putEnumerated(id79,id80,id81);
	desc16.putReference(id78,ref14);
	executeAction(id77,desc16,DialogModes.NO);
}

// Make a volume
function CreateVolumeFromLayers(x,y,z,type)
{
	
	var key3DXPos		    = app.stringIDToTypeID( "key3DXPos" );
	var key3DYPos		    = app.stringIDToTypeID( "key3DYPos" );
	var key3DZPos		    = app.stringIDToTypeID( "key3DZPos" );
	var key3DTextureType = app.stringIDToTypeID( "key3DTextureType" );
	var key3DFileName = app.stringIDToTypeID( "key3DFileName" );
    var keyCreateVolume	    = app.stringIDToTypeID( "createVolume" );
	  
    var myMakeVolumeDescriptor = new ActionDescriptor();
    myMakeVolumeDescriptor.putInteger( key3DXPos, x );
    myMakeVolumeDescriptor.putInteger( key3DYPos, y );
    myMakeVolumeDescriptor.putInteger( key3DZPos, z);
    myMakeVolumeDescriptor.putInteger( key3DTextureType, type );
    myMakeVolumeDescriptor.putString( key3DFileName,"volume");
 
    executeAction( keyCreateVolume, myMakeVolumeDescriptor, DialogModes.NO );
	
	}

// Please set your own values for these parameters in the importFolder function
function OpenFileList( specList )
{

    var keyfileList		    = app.stringIDToTypeID( "fileList" );
    var keyAddLayerFromFile	    = app.stringIDToTypeID( "addLayerFromFile" );
	
	// Get ID's for the related keys
    var keyDICOM		    = app.stringIDToTypeID( "Dicom" );
	var keyAs     		= charIDToTypeID( "As  " );
	
	var myFileList = new ActionList();
	for (var i = 0; i < specList.length; i++)
		myFileList.putPath(new File(specList[i]));


	var myOpenDescriptor = new ActionDescriptor();
	myOpenDescriptor.putList(keyfileList, myFileList);
    //myOpenDescriptor.putString(keyAs, "Dicom" );

	executeAction( keyAddLayerFromFile, myOpenDescriptor, DialogModes.NO );

}

// Please set your own values for these parameters in the importDICOMFolder function
function openDICOM( inFileName, inRows, inCols, inAnonymize, inOverlays, inWindowLevel, inWindowWidth, inReverseImage )
{
    // Get ID's for the related keys
    var keyRowsID      		= charIDToTypeID( "RoWs" );
    var keyColsID     		= charIDToTypeID( "ColM" );
    var keyAnonymizeID  	= charIDToTypeID( "OvLy" );
    var keyOverlaysID   	= charIDToTypeID( "AnYm" );
    var keyWLevelID     	= charIDToTypeID( "WleV" );
    var keyWWidthID      	= charIDToTypeID( "WWiT" );
    var keyReverseImageID   = charIDToTypeID( "RvsE" );
    var keyOpen 			= charIDToTypeID( "Opn " );
    var keyAS				= charIDToTypeID( "OpAs" );
    var keyDICOM		    = app.stringIDToTypeID( "Dicom" );
    var keyNULL				= charIDToTypeID( "null" );
     
   
    var myOpenDescriptor = new ActionDescriptor();
    myOpenDescriptor.putPath( keyNULL, new File(inFileName) );
    
    var myAsDescriptor = new ActionDescriptor();
    myAsDescriptor.putInteger( keyRowsID, inRows );
    myAsDescriptor.putInteger( keyColsID, inCols );
    myAsDescriptor.putBoolean( keyAnonymizeID, inAnonymize);
    myAsDescriptor.putBoolean( keyOverlaysID, inOverlays );
    myAsDescriptor.putInteger( keyWLevelID, inWindowLevel);
    myAsDescriptor.putInteger( keyWWidthID, inWindowWidth );
    myAsDescriptor.putBoolean( keyReverseImageID, inReverseImage );
    
    myOpenDescriptor.putObject(keyAS, keyDICOM, myAsDescriptor);

    executeAction( keyOpen, myOpenDescriptor, DialogModes.NO );
}

// determine Photoshop version number
function getCSVersion() {
	return parseInt(app.version);
}

function getFolder() {
	// display the Path Entry dialog with Browse option for Photoshop CS
	if (getCSVersion() === 8) {
		alert(localize("$$$/AdobeDicom/AdobeScripts/Shared/LoadDICOM/incompatiblePSVersion=The version of Photoshop does not support DICOM files."));
		return null;
	}
	// display only the browse dialog for Photoshop CS2+
	else {
		return Folder.selectDialog(localize("$$$/AdobeDicom/AdobeScripts/Shared/LoadDICOM/SelectFiles=Select the folder of DICOM files to be imported:"), Folder('~'));
	}
}

function importDICOMFolder(selectedFolder,makeVolume) {

	// if a folder was selected continue with action, otherwise quit
	if (selectedFolder) 
	{

		// create document list from files in selected folder
		var docList = selectedFolder.getFiles();
		
		if (docList.length > 0)
		{
			// open first file to get params
			var nDocWidth;
			var nDocHeight;
			var nDocMode;
			var nDocRes;
			var nDocBitsPerPixel;
			
			openDICOM(docList[0], 0, 0, true, false, 0, 0, false );
			
			var docRef = activeDocument;
			
			nDocWidth = docRef.width;
			nDocHeight = docRef.height;
			nDocRes= docRef.resolution;
			nDocMode = docRef.mode;
			nDocBitsPerPixel = docRef.bitsPerChannel;
			
			docRef.close(SaveOptions.DONOTSAVECHANGES); // don't need it anymore
			
			var newDoc;
			
			if (!newCanvas) {
					// remember unit settings and change to pixels
					var originalRulerUnits = preferences.rulerUnits;
					preferences.rulerUnits = Units.PIXELS;

					var newDocName = 'DICOM Files' + (documents.length ? ' ' + documents.length : '');
					
					
					if (nDocMode == DocumentMode.GRAYSCALE)
						newDoc = documents.add(nDocWidth,nDocHeight,nDocRes, newDocName, NewDocumentMode.GRAYSCALE, DocumentFill.TRANSPARENT, 1, nDocBitsPerPixel);
					else
					    newDoc = documents.add(nDocWidth,nDocHeight,nDocRes, newDocName, NewDocumentMode.RGB, DocumentFill.TRANSPARENT, 1, nDocBitsPerPixel);

					// restore original unit setting
					preferences.rulerUnits = originalRulerUnits;
					var newCanvas = true;
			}
	
			OpenFileList( docList);
			
			if (newCanvas) {
				newDoc.artLayers[newDoc.layers.length - 1].remove();
				newDoc.revealAll();
				newDoc.trim(TrimType.TRANSPARENT, true, true, true, true);
			}

			
			if (makeVolume)
			{
				//select layers
				SelectTheLayers();
				//create volume
			   CreateVolumeFromLayers(nDocWidth, nDocHeight, 2 * docList.length, 2);
			 }

		}

		if (docList.length <= 0) 
		{
			// display error message if no supported documents were found in the designated folder
			alert(localize("$$$/AdobeDicom/AdobeScripts/Shared/LoadDICOM/NoSupportedFiles=Sorry, but the designated folder does not contain any DICOM files.\n\nPlease choose another folder."));
			importDICOMFolder(getFolder());
		}
	}
}

importDICOMFolder(getFolder(),false);
