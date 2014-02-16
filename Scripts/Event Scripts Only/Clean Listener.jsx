// (c) Copyright 2007.  Adobe Systems, Incorporated.  All rights reserved.

/*
@@@BUILDINFO@@@ Clean Listener.jsx 1.0.0.1
*/

var begDesc = "$$$/JavaScripts/CleanListener/Description=Convert ScriptListener code to DOM code. Assign this to Everything and look for a CleanListener.jsx file on your desktop." // endDesc
var begName = "$$$/JavaScripts/CleanListener/MenuName=Clean Listener" // endName

// on localized builds we pull the $$$/Strings from a .dat file, see documentation for more details
$.localize = true;

// This is a work in progress. If you find the // No handler comment found in the output you will need to
// add a handler here.

// 1) Write a routine that walks the actionDescriptor for the event and converts it to DOM code.
// 2) Add your routine to the DumpTable with the correct event. 

// Watch out for events that have multiple uses. eventDelete, eventSelect, etc.

try {
	if ( arguments.length < 2 ) {
	    alert( "This ain't going to work arguments.length < 2!");
	    bybye = byebye;
	}
	var dumpString = "";
	var dumpTable = DumpTable();
	var foundIt = false;
	for (var i = 0; i < dumpTable.length && !foundIt; i++) {
		if (dumpTable[i].event == arguments[1]) {
			dumpString = dumpTable[i].fn(arguments[0]);
			foundIt = true;
		}
	}

	if (!foundIt) {
		// i should get the class if there is one and dump that, for eventMake and eventSelect for example
		dumpString = "// No handler found for event: " + arguments[1] + ":" + app.typeIDToCharID( arguments[1] ) + ":" + app.typeIDToStringID( arguments[1] );
	}

	var f = new File( Folder.desktop + "/Clean Listener.jsx" );

	if ( f.exists ) {
		f.open( "e" );
		f.seek( 0, 2 ); // go to the end
	} else {
		f.open( "w" );
		f.writeln( "#target photoshop" );
	}

	f.writeln( dumpString );
	
	f.close();

	////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////

	// add your event and routine to handle the event here with a push
	function DumpTable() {
	    var a = new Array();
	
	    // here is an example on how we 'clean' the gaussian blur event
	    var b = new DumpEvent( app.charIDToTypeID( 'GsnB' ), DumpGaussianBlur );
	    a.push( b );
	    
		// and this cleans the 'Mk  ' Make event, new Document is a make event for example
	    b = new DumpEvent( app.charIDToTypeID( 'Mk  ' ), DumpMake );
	    a.push( b );
		
		// close
	    b = new DumpEvent( app.charIDToTypeID( 'Cls ' ), DumpClose );
	    a.push( b );

		// open
	    b = new DumpEvent( app.charIDToTypeID( 'Opn ' ), DumpOpen );
	    a.push( b );

		// save and save as
	    b = new DumpEvent( app.charIDToTypeID( 'save' ), DumpSave );
	    a.push( b );
		
	    return a;
	}

	function DumpEvent(a, b) {
	    this.event = a;
	    this.fn = b;
	}

	///////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////
	///////////////////////////// add your dump routine below /////////
	///////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////
	
	// here is an example on how we 'clean' the gaussian blur event
	function DumpGaussianBlur( d ) {
	    var s = "app.activeDocument.activeLayer.applyGaussianBlur(";
	    s += d.getDouble( app.charIDToTypeID( 'Rds ' ) ).toString();
	    s += ");";
	    return s;
	}

	// here is an example on how we 'clean' the close
	function DumpClose( d ) {
		var s = "// TODO difficult for me to know if you saved the document or not, here are some other options\n";
	    s += "app.activeDocument.close( SaveOptions.DONOTSAVECHANGES ); // SaveOptions.SAVECHANGES SaveOptions.PROMPTTOSAVECHANGES";
	    return s;
	}

	// here is an example on how we 'clean' the save this is also saveAs
	function DumpSave( d ) {
		var s = "// TODO needs work to support SaveAs with options and extensions on or off\n";
		if ( d.count == 0 ) {
			s += "app.activeDocument.save();";
		} else {
			s += "app.activeDocument.saveAs( "
			if ( d.hasKey( app.charIDToTypeID( 'In  ' ) ) ) {
				var f = d.getPath( app.charIDToTypeID( 'In  ' ) );
				s += "File ( \"" + f.toString() + "\" ), undefined, ";
			}
			if ( d.hasKey( app.charIDToTypeID( 'Cpy ' ) ) ) {
				s += d.getBoolean( app.charIDToTypeID( 'Cpy ' ) ).toString() + " );";
			}
		}
		return s;
	}

	// here is an example on how we 'clean' the open, watch out for open with params
	function DumpOpen( d ) {
		var s = "// TODO needs work to support open with options and smart object\n";
		s += "app.open( File( ";
		if ( d.hasKey( app.charIDToTypeID( 'null' ) ) ) {
			var f = d.getPath( app.charIDToTypeID( 'null' ) );
			s += "\"" + f.toString() + "\" ) );";
		}
		return s;
	}

	// here is how we dump 'Mk  ' make is annoying because you can make
	// lots of things: documents, layers, channels, etc.
	// for now we are only concerned with new document
	// i should probably make a look up thing just like the events here
	// app.documents.add (width, height, resolution, name, mode, initialFill, pixelAspectRatio, bitsPerChannel, colorProfileName)
	function DumpMake( d ) {
		var newKey = app.charIDToTypeID( 'Nw  ' );
		if ( d.hasKey( newKey ) ) {
			if ( app.charIDToTypeID( 'Dcmn' ) == d.getObjectType( newKey ) ) {
				
				// if you use presets then I get the string of the preset used
				// and not all the params
				// to work around that i will just look at the current activeDocument
				var doc = activeDocument;
				var s = "app.documents.add( ";
				s += "UnitValue( " + doc.width.value.toString() + ", \"" + doc.width.type.toString() + "\"), ";
				s += "UnitValue( " + doc.height.value.toString() + ", \"" + doc.height.type.toString() + "\"), ";
				s += doc.resolution.toString() + ", ";
				s += "\"" + doc.name + "\", ";
				s += "New" + doc.mode.toString() + ", ";
				// initialFill, ugh it is hard to tell the fill color
				var dd = d.getObjectValue( newKey );
				if ( dd.hasKey( app.charIDToTypeID( "Fl  " ) ) ) {
					switch ( dd.getEnumerationValue( app.charIDToTypeID( "Fl  " ) ) ) {
						case app.charIDToTypeID( "Wht " ):
							s += "DocumentFill.WHITE, ";
							break;
						case app.charIDToTypeID( "BckC" ):
							s += "DocumentFill.BACKGROUNDCOLOR, ";
							break;
						case app.charIDToTypeID( "Trns" ):
							s += "DocumentFill.TRANSPARENT, ";
							break;
						default:
							s += "undefined, ";
					} // end switch initialFill
				} else { // this will miss the option of DocumentFill.BACKGROUNDCOLOR
					if ( doc.activeLayer.isBackgroundLayer ) {
						s += "DocumentFill.WHITE, ";
					} else {
						s += "DocumentFill.TRANSPARENT, ";
					}
				}
				s += doc.pixelAspectRatio + ", ";
				s += doc.bitsPerChannel.toString() + ", ";
				s += "\"" + doc.colorProfileName + "\" );";
			}
		} else {
			var s = '// Unknown type for Make ';
			// walk the descriptor looking for the reference and report the class
			for ( var i = 0; i < d.count; i++ ) {
				var keyID = d.getKey( i );
				if ( d.getType( keyID ) == DescValueType.REFERENCETYPE ) {
					var ref = d.getReference( keyID );
					var dClass = ref.getDesiredClass();
					s += "class " + dClass.toString() + ":" + app.typeIDToCharID( dClass ) + ":" + app.typeIDToStringID( dClass );;
				}
			}
		}
	    return s;
	}

}

catch( e ) {
	// always wrap your script with try/catch blocks so you don't stop production
	// remove comments below to see error for debugging 
	alert( "Error: " + e + ":" + e.line );
}


//////////////////////////////////////////////////////////////////////////////////////////////// 
//////////////////////////////////////////////////////////////////////////////////////////////// 
//////////////////////////////// code for reference only //////////////////////////////// 
//////////////////////////////////////////////////////////////////////////////////////////////// 
//////////////////////////////////////////////////////////////////////////////////////////////// 
				/* if you use a preset in the new dialog this code will not work
				var dd = d.getObjectValue( newKey );
				if ( dd.hasKey( app.charIDToTypeID( "Wdth" ) ) ) {
					var s = "app.documents.add( UnitValue( ";
					// width
					var ss = dd.getUnitDoubleValue( app.charIDToTypeID( "Wdth" ) );
					s += ss + ", 'px' ), UnitValue( ";	
					// height
					ss = dd.getUnitDoubleValue( app.charIDToTypeID( "Hght" ) );
					s += ss + ", 'px' ), ";	
					// resolution
					ss = dd.getUnitDoubleValue( app.charIDToTypeID( "Rslt" ) );
					s += ss + ", ";
					// name, may not be there
					var keyName = charIDToTypeID( "Nm  " );
					if ( dd.hasKey( keyName ) ) {
						s += "\"" + dd.getString( keyName ) + "\", ";
					} else {
						s += "\"Untitled\", ";
					}
					// mode
					switch ( dd.getClass( app.charIDToTypeID( "Md  " ) ) ) {
						case app.charIDToTypeID( "RGBM" ):
							s += "NewDocumentMode.RGB, ";
							break;
						case app.charIDToTypeID( "BtmM" ):
							s += "NewDocumentMode.BITMAP, ";
							break;
						case app.charIDToTypeID( "CMYM" ):
							s += "NewDocumentMode.CMYK, ";
							break;
						case app.charIDToTypeID( "Grys" ):
							s += "NewDocumentMode.GRAYSCALE, ";
							break;
						case app.charIDToTypeID( "LbCM" ):
							s += "NewDocumentMode.LAB, ";
							break;
						default:
							s += "undefined, ";
					} // end switch mode
					// initialFill
					switch ( dd.getEnumerationValue( app.charIDToTypeID( "Fl  " ) ) ) {
						case app.charIDToTypeID( "Wht " ):
							s += "DocumentFill.WHITE, ";
							break;
						case app.charIDToTypeID( "BckC" ):
							s += "DocumentFill.BACKGROUNDCOLOR, ";
							break;
						case app.charIDToTypeID( "Trns" ):
							s += "DocumentFill.TRANSPARENT, ";
							break;
						default:
							s += "undefined, ";
					} // end switch initialFill
					// pixelAspectRatio
					ss = dd.getDouble( app.stringIDToTypeID( "pixelScaleFactor" ) );
					s += ss + ", ";
					switch ( dd.getInteger( app.charIDToTypeID( "Dpth" ) ) ) {
						case 1:
							s += "BitsPerChannelType.ONE, ";
							break;
						case 8:
							s += "BitsPerChannelType.EIGHT, ";
							break;
						case 16:
							s += "BitsPerChannelType.SIXTEEN, ";
							break;
						case 32:
							s += "BitsPerChannelType.THIRTYTWO, ";
							break;
						default:
							s += "undefined, ";
					} // end switch initialFill
					// colorProfileName
					ss = dd.getString( app.stringIDToTypeID( "profile" ) );
					s += "\"" + ss + "\"";
					// end the method
					s += ");";
				} else { // the document is made so i could just pull the info from the current active document?
					// then i wouldn't need this routine and the if/else stuff
					var s = '// no support for presets in new documents';
				} // if haskey width
				*/
