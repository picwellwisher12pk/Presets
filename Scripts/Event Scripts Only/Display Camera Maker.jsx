// (c) Copyright 2005.  Adobe Systems, Incorporated.  All rights reserved.

/*
@@@BUILDINFO@@@ Display Camera Maker.jsx 1.0.0.1
*/

var begDesc = "$$$/JavaScripts/DisplayCameraMaker/Description=Check the xmp metadata for the camera Make and Model. Display this information to the user." // endDesc 
var begName = "$$$/JavaScripts/DisplayCameraMaker/MenuName=Display Camera Maker" // endName

// on localized builds we pull the $$$/Strings from a .dat file, see documentation for more details
$.localize = true;

try {
     var xmpString = activeDocument.xmpMetadata.rawData.toString();
     var tiffMakeLength = ('<tiff:Make>').length;
     var tiffMake = xmpString.search( '<tiff:Make>' );
     var tiffMakeEnd = xmpString.search( '</tiff:Make>' );
     var tiffMakeStr = xmpString.substr( tiffMake + tiffMakeLength, tiffMakeEnd - tiffMake - tiffMakeLength );

     var tiffModelLength = ('<tiff:Model>').length;
     var tiffModel = xmpString.search( '<tiff:Model>' );
     var tiffModelEnd = xmpString.search( '</tiff:Model>' );
     var tiffModelStr = xmpString.substr( tiffModel + tiffModelLength, tiffModelEnd - tiffModel - tiffModelLength );

     if ( tiffMakeStr.length > 0 && tiffModelStr.length > 0 ) {
          alert( tiffMakeStr + ', ' + tiffModelStr + localize( '$$$/JavaScripts/DisplayCameraSuccess=, was used to shoot this file!' ) );
     } else {
          alert( localize( '$$$/JavaScripts/DisplayCameraNone=No camera data was found in this file.' ) );
     }

     // check the exif
     var exifMakeStr = '';
     var exifModelStr = '';
     var exifData = activeDocument.info.exif;
     for ( var i = 0; i < exifData.length; i++ ) {
          if ( exifData[i][0] == 'Make' ) {
               exifMakeStr = exifData[i][1];
          }
          if ( exifData[i][0] == 'Model' ) {
               exifModelStr = exifData[i][1];
          }
     }

} // try end

catch( e ) {
	// always wrap your script with try/catch blocks so you don't stop production
	// remove comments below to see error for debugging 
	// alert( e );
}
