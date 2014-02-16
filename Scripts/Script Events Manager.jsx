// (c) Copyright 2007.  Adobe Systems, Incorporated.  All rights reserved.
// Written by Tom Ruark
// UI Design by Julie Meridian

/*
@@@BUILDINFO@@@ Script Events Manager.jsx 1.0.0.9
*/

/*

// BEGIN__HARVEST_EXCEPTION_ZSTRING

<javascriptresource>
<name>$$$/JavaScripts/ScriptEventsManager/Menu=Script Events Manager...</name>
<category>scriptevents</category>
</javascriptresource>

// END__HARVEST_EXCEPTION_ZSTRING

*/

// enable double clicking from the Macintosh Finder or the Windows Explorer
#target photoshop

// debug level: 0-2 (0:disable, 1:break on error, 2:break at beginning)
// $.level = 0;
// debugger; // launch debugger on next line

// on localized builds we pull the $$$/Strings from a .dat file, see documentation for more details
$.localize = true;

var gOneTime = true; // for CS3 we don't need this helper flag
var gCustomFileIndex;

try {

	gUniqueID = "// 8eabd3c5-dcb2-4967-8f4d-f40e2f20476a";
	
	GlobalVariables();
	
	GlobalStrings();

	var gParams = new Parameters( GetDefaultParamsFile(), InitParams );

	gParams.Load();

	var gEvents = gParams.Get( 'events' );

	var gExtraFiles = gParams.Get( 'extrafiles' );

	var actionInfo = GetActionSetInfo();
	
	var dlgMain = new Window( 'dialog' );

	// match our dialog background color to the host application
	var brush = dlgMain.graphics.newBrush(dlgMain.graphics.BrushType.THEME_COLOR, "appDialogBackground");
	var forePen = dlgMain.graphics.newPen(dlgMain.graphics.PenType.SOLID_COLOR, [1-brush.color[0], 1-brush.color[1], 1-brush.color[2]], brush.color[3]);
	var disabledForePen = dlgMain.graphics.newPen(dlgMain.graphics.PenType.SOLID_COLOR, [brush.color[0]/1.5, brush.color[1]/1.5, brush.color[2]/1.5], brush.color[3]);
    dlgMain.graphics.backgroundColor = brush;
    dlgMain.graphics.disabledBackgroundColor = brush;
	dlgMain.graphics.foregroundColor = forePen;
	dlgMain.graphics.disabledForegroundColor = disabledForePen;

	dlgMain.text = strTitle;
	dlgMain.orientation = 'row';
	dlgMain.alignChildren = 'top';
		var grpLeft = dlgMain.add( 'group' );
		grpLeft.orientation = 'column';
		grpLeft.alignChildren = 'left';
			var grpGrpLeft = grpLeft.add( 'group' );
			grpGrpLeft.orientation = 'column';
			grpGrpLeft.alignChildren = 'fill';

				var cbEnabled = grpGrpLeft.add( 'checkbox' );
				cbEnabled.text = strEnabled;
				cbEnabled.helpTip = strEnabledHelp;
				cbEnabled.value = app.notifiersEnabled;

				var lbEvents = grpGrpLeft.add( 'listbox', undefined, undefined, {multiselect: true} );
				lbEvents.preferredSize = [StrToIntWithDefault( strlbEventsWidth, 400 ), StrToIntWithDefault( strlbEventsHeight, 126 )]; // 7 rows
				lbEvents.helpTip = strEventsHelp;
				try {
				lbEvents.graphics.backgroundColor = brush;
				lbEvents.graphics.disabledBackgroundColor = brush;
				lbEvents.graphics.foregroundColor = forePen; // dlgMain.graphics.newPen(dlgMain.graphics.PenType.SOLID_COLOR, [.15, .15, .85], brush.color[3]);
				lbEvents.graphics.disabledForegroundColor =  disabledForePen; // dlgMain.graphics.newPen(dlgMain.graphics.PenType.SOLID_COLOR, [.85, .85, .15], brush.color[3]);
				}
			catch(e) {
				alert(e + ":" + e.line);
				}

				var pnlAdd = grpGrpLeft.add( 'panel' );
				pnlAdd.orientation = 'column';
				pnlAdd.alignChildren = 'left';
				pnlAdd.alignment = 'fill';
					var grpEvent = pnlAdd.add( 'group' );
					grpEvent.orientation = 'row';
					grpEvent.alignChildren = 'center';
						var stEvent = grpEvent.add( 'statictext' );
						stEvent.text = strEvent;
						stEvent.helpTip = strEventHelp;
						var ddEvent = grpEvent.add( 'dropdownlist' );
						ddEvent.helpTip = strEventHelp;
					var grpFile = pnlAdd.add( 'group' );
					grpFile.alignChildren = 'center';
						var rbFile = grpFile.add( 'radiobutton' );
						rbFile.text = strScript;
						rbFile.helpTip = strFileHelp;
						var ddFile = grpFile.add( 'dropdownlist' );
						ddFile.helpTip = strFileHelp;

					var stDescription = pnlAdd.add( 'edittext', undefined, undefined, {multiline:true, readonly:true} );
					stDescription.preferredSize.height = StrToIntWithDefault( strstDescription, 65 );
					stDescription.text = strDescriptionText;

					var grpAction = pnlAdd.add( 'group' );
					grpAction.orientation = 'row';
					grpAction.alignChildren = 'center';
						var rbAction = grpAction.add( 'radiobutton' );
						rbAction.text = strActionDialog + ":";
						rbAction.helpTip = strActionHelp;
						var ddSet = grpAction.add( 'dropdownlist' );
						ddSet.helpTip = strActionHelp;
						var ddAction = grpAction.add( 'dropdownlist' );
						ddAction.helpTip = strActionHelp;
		var pnlRight = dlgMain.add( 'group' );
		pnlRight.orientation = 'column';
		pnlRight.alignChildren = 'fill';
			var btnDone = pnlRight.add( 'button' );
			btnDone.text = strDone;
			var grpButtons = pnlRight.add( 'group' );
			grpButtons.orientation = 'column';
			grpButtons.alignChildren = 'fill';
				var btnRemove = grpButtons.add( 'button' );
				btnRemove.text = strRemove;
				btnRemove.helpTip = strRemoveHelp;
				var btnRemoveAll = grpButtons.add( 'button' );
				btnRemoveAll.text = strRemoveAll;
				btnRemoveAll.helpTip = strRemovAllHelp;
			var btnEventAdd = pnlRight.add( 'button' );
			btnEventAdd.text = strAdd;
			btnEventAdd.helpTip = strAddHelp;

	// end dialog layout

	// auto layout is great but we need some modifications
	dlgMain.onShow = function() {

		var rightEdge = pnlAdd.bounds.right - pnlAdd.bounds.left - 20;

		grpEvent.bounds.right = rightEdge;
		grpFile.bounds.right = rightEdge;
		grpAction.bounds.right = rightEdge;

		ddEvent.bounds.right = rightEdge - grpEvent.bounds.left;
		ddFile.bounds.right = rightEdge - grpEvent.bounds.left;
		stDescription.bounds.left = ddFile.bounds.left + grpFile.bounds.left;
		stDescription.bounds.right = ddFile.bounds.right + grpFile.bounds.left - this.spacing;
		ddAction.bounds.right = rightEdge - grpEvent.bounds.left;

		var btnHeight = btnEventAdd.bounds.height;

		var lbEventsCenter = lbEvents.bounds.top + lbEvents.bounds.height / 2;
		grpButtons.location.y = lbEventsCenter - grpButtons.size.height / 2;

		// buttons are usually smaller than dropdowns, the 2 adjusts accordingly
		btnEventAdd.bounds.top = pnlAdd.bounds.top + pnlAdd.spacing + 2; 
		btnEventAdd.bounds.bottom = btnEventAdd.bounds.top + btnHeight;

		pnlRight.bounds.bottom = btnEventAdd.bounds.bottom + pnlRight.spacing * 2;
	}

	btnDone.onClick = function() { 	
		gParams.Save();
		this.parent.parent.close(true); 
	}
	
	dlgMain.defaultElement = btnDone;
	dlgMain.cancelElement = btnDone;

	gCustomEventIndex = UpdateEventDropDown( ddEvent );
		
	ddEvent.onChange = function() {
		if ( gCustomEventIndex == this.selection.index ) {
			var newEvent = CreateNewEvent();
			if ( undefined != newEvent ) {
				gEvents.push( newEvent );
				gCustomEventIndex = UpdateEventDropDown( this, true );
			} else {
				ddEvent.items[ gLastEventIndex ].selected = true;
			}
		} else {
			gLastEventIndex = this.selection.index;
		}
		ddEvent.helpTip = ddEvent.items[ gLastEventIndex ].toString();
	}
	
	rbFile.onClick = function() {
		ddSet.enabled = ! this.value;
		ddAction.enabled = ! this.value;
		rbAction.value = ! this.value;
		ddFile.enabled = this.value;
		rbFile.value = this.value;
		stDescription.enabled = this.value;
		if ( this.value ) {
			ddFile.active = true;
		}
	}
	
	rbAction.onClick = function() {
		ddSet.enabled = this.value;
		ddAction.enabled = this.value;
		rbAction.value = this.value;
		ddFile.enabled = ! this.value;
		rbFile.value = ! this.value;
		stDescription.enabled = ! this.value;
		if ( this.value ) {
			ddSet.active = true;
		}
	}

	rbAction.value = false;
	rbFile.value = true;
	
	if ( actionInfo.length > 0 ) {
		for ( var i = 0; i < actionInfo.length; i++ ) {
			ddSet.add( "item", actionInfo[i].name );
		}
		ddSet.items[0].selected = true;
		ddSet.onChange = function() { 
			ddAction.removeAll();
			for ( var i = 0; i < actionInfo[ this.selection.index ].children.length; i++ ) {
				ddAction.add( "item", actionInfo[ this.selection.index ].children[ i ].name );
			}
			if ( ddAction.items.length > 0 ) {
				ddAction.items[0].selected = true;
			}
			ddSet.helpTip = ddSet.items[ ddSet.selection.index ].toString();
		}
		ddSet.onChange();
	} else {
		ddSet.enabled = false;
		ddAction.enabled = false;
	}
	
	ddAction.onChange = function() {
		ddAction.helpTip = ddAction.items[ ddAction.selection.index ].toString();
	}

	UpdateRemovePanel( lbEvents, btnRemove, btnRemoveAll );

	btnRemove.onClick = function () {
		if ( null != lbEvents && null != lbEvents.selection ) {
			for ( var i = 0; i < lbEvents.selection.length; i++ ) {
				if ( app.notifiers[ lbEvents.selection[ i ].index ].eventFile.name.substr( 0, strActionNotifier.length ) == strActionNotifier ) {
					app.notifiers[ lbEvents.selection[ i ].index ].eventFile.remove();
				}
				app.notifiers[ lbEvents.selection[ i ].index ].remove();
				var indexRemoved = lbEvents.selection[ i ].index;
				lbEvents.remove( lbEvents.selection[ i ].index );
				if ( 0 == app.notifiers.length ) {
					UpdateForNoNotifiers();
				} else {
					if ( indexRemoved < 1 ) {
						indexRemoved++;
					}
					lbEvents.items[ indexRemoved - 1 ].selected = true;
				}
			}
		} else {
			alert( strPleaseSelect );
		}
		dlgMain.defaultElement.active = true;
	}
	
	btnRemoveAll.onClick = function () {
		for ( var i = 0; i < app.notifiers.length; i++ ) {
			if ( app.notifiers[ i ].eventFile.name.substr( 0, strActionNotifier.length ) == strActionNotifier ) {
				app.notifiers[ i ].eventFile.remove();
			}
		}
		app.notifiers.removeAll();
		lbEvents.removeAll();
		UpdateForNoNotifiers();
		dlgMain.defaultElement.active = true;
	}
	
	btnEventAdd.onClick = function () {
		if ( true == rbFile.value ) { 
			AddFileNotifier( ddEvent, ddFile );
		} else {
			AddActionNotifier( ddEvent, ddSet, ddAction, lbEvents );
		}
		UpdateRemovePanel( lbEvents, btnRemove, btnRemoveAll );
		dlgMain.defaultElement.active = true;
	}
	
	gCustomFileIndex = UpdateScriptsFileDropDown( ddFile );

	ddFile.onChange = function () {
		if ( gCustomFileIndex == this.selection.index ) {
			var newFile = undefined;
			do {
				if ( "Windows" == File.fs ) {
					newFile = File.openDialog( strSelectFile, strFileExtension );
				} else {
					newFile = File.openDialog( strSelectFile, MacJSFilter );
				}
				if ( null != newFile && ! newFile.exists ) {
					alert( strPickAnExistingFile );
					newFile = -1;
					continue;
				}
				if ( null != newFile && ! IsJavaScriptExtension( newFile ) ) {
					alert( strPickAFileWithAJavaScriptExtension );
					newFile = -1;
					continue;
				}
			} while ( -1 == newFile );
			if ( null != newFile ) {
				gCustomFileIndex = UpdateScriptsFileDropDown( ddFile, newFile );
			} else {
				ddFile.items[ gLastFileIndex ].selected = true;
			}
		} else {
			gLastFileIndex = this.selection.index;
			stDescription.text = this.selection.description;
		}
		ddFile.helpTip = ddFile.items[ gLastFileIndex ].toString();
	}

	cbEnabled.onClick = function() {
		app.notifiersEnabled = this.value;
		grpButtons.enabled = this.value;
		lbEvents.enabled = this.value;
		pnlAdd.enabled = this.value;
		btnEventAdd.enabled = this.value;
	}

	rbFile.onClick();

	cbEnabled.onClick();

	// in case we double clicked the file
	app.bringToFront();

	dlgMain.center();
	
	dlgMain.show();

} // end try

catch( e ) { 
	if ( confirm( strBigError ) ) {
		alert( e + " : on line " + e.line );
	}
}


///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////////////
// Function: GetActionSetInfo
// Usage: walk all the items in the action palette and record the action set
//        names and all the action children
// Input: <none>
// Return: the array of all the ActionData
///////////////////////////////////////////////////////////////////////////////
function GetActionSetInfo() {
	var actionSetInfo = new Array();
	var setCounter = 1;
	while ( true ) {
		var ref = new ActionReference();
		ref.putIndex( gClassActionSet, setCounter );
		var desc = undefined;
		try { desc = executeActionGet( ref ); }
		catch( e ) { break; }
		var actionData = new ActionData();
		if ( desc.hasKey( gKeyName ) ) {
			actionData.name = desc.getString( gKeyName );
		}
		var numberChildren = 0;
		if ( desc.hasKey( gKeyNumberOfChildren ) ) {
			numberChildren = desc.getInteger( gKeyNumberOfChildren );
		}
		if ( numberChildren ) {
			actionData.children = GetActionInfo( setCounter, numberChildren );
			actionSetInfo.push( actionData );
		}
		setCounter++;
	}
	return actionSetInfo;
}


///////////////////////////////////////////////////////////////////////////////
// Function: GetActionInfo
// Usage: used when walking through all the actions in the action set
// Input: action set index, number of actions in this action set
// Return: true or false, true if file or folder is to be displayed
///////////////////////////////////////////////////////////////////////////////
function GetActionInfo( setIndex, numChildren ) {
	var actionInfo = new Array();
	for ( var i = 1; i <= numChildren; i++ ) {
		var ref = new ActionReference();
		ref.putIndex( gClassAction, i );
		ref.putIndex( gClassActionSet, setIndex );
		var desc = undefined;
		desc = executeActionGet( ref );
		var actionData = new ActionData();
		if ( desc.hasKey( gKeyName ) ) {
			actionData.name = desc.getString( gKeyName );
		}
		var numberChildren = 0;
		if ( desc.hasKey( gKeyNumberOfChildren ) ) {
			numberChildren = desc.getInteger( gKeyNumberOfChildren );
		}
		actionInfo.push( actionData );
	}
	return actionInfo;
}


///////////////////////////////////////////////////////////////////////////////
// Function: ActionData
// Usage: this could be an action set or an action
// Input: <none>
// Return: a new Object of ActionData
///////////////////////////////////////////////////////////////////////////////
function ActionData() {
	this.name = "";
	this.children = undefined;
	this.toString = function () {
		var strTemp = this.name;
		if ( undefined != this.children ) {
			for ( var i = 0; i < this.children.length; i++ ) {
				strTemp += " " + this.children[i].toString();
			}
		}
		return strTemp;
	}
}


///////////////////////////////////////////////////////////////////////////////
// Function: EventData
// Usage: Create a new Object for eventID and string
// Input: Descriptive name and value
// Return: EventData created
///////////////////////////////////////////////////////////////////////////////
function EventData( name, value, valueClass ) {
	this.name = name;
	this.value = value;
	if ( undefined == valueClass )
		this.valueClass = '';
	else
		this.valueClass = valueClass;
}


///////////////////////////////////////////////////////////////////////////////
// Function: InitParams
// Usage: Initialize my default parameter settings
// Input: Parameters object
// Return: <none>
///////////////////////////////////////////////////////////////////////////////
function InitParams( inObject ) {
	inObject['events'] = new Array();
	inObject['events'].push( new EventData( strStartApplication, 'Ntfy' ) );
	inObject['events'].push( new EventData( strNewDocument, 'Mk  ', 'Dcmn' ) );
	inObject['events'].push( new EventData( strOpenDocument, 'Opn ' ) );
	inObject['events'].push( new EventData( strSaveDocument, 'save' ) );
	inObject['events'].push( new EventData( strCloseDocument, 'Cls ' ) );
	inObject['events'].push( new EventData( strPrintDocument, 'Prnt' ) );
	inObject['events'].push( new EventData( strExportDocument, 'Expr' ) );
	inObject['events'].push( new EventData( strAll, 'All ' ) );

/*
//  Class IDs related to event make (new)
	inObject['events'].push( new EventData( 'New Layer', 'Mk  ', 'Lyr ' ) );
	inObject['events'].push( new EventData( 'New Channel', 'Mk  ', 'Chnl' ) );
	inObject['events'].push( new EventData( 'New Path', 'Mk  ', 'Path' ) );
	inObject['events'].push( new EventData( 'New Text Layer', 'Mk  ', 'TxLr' ) );
	inObject['events'].push( new EventData( 'New Solid Color Layer', 'Mk  ', 'solidColorLayer' ) );
	inObject['events'].push( new EventData( 'New Gradient Layer', 'Mk  ', 'gradientLayer' ) );
	inObject['events'].push( new EventData( 'New Pattern Layer', 'Mk  ', 'patternLayer' ) );
	inObject['events'].push( new EventData( 'New Levels Layer', 'Mk  ', 'Lvls' ) );
	inObject['events'].push( new EventData( 'New Curves Layer', 'Mk  ', 'Crvs' ) );
	inObject['events'].push( new EventData( 'New Color Balance Layer', 'Mk  ', 'ClrB' ) );
	inObject['events'].push( new EventData( 'New Brightness Contrast Layer', 'Mk  ', 'BrgC' ) );
	inObject['events'].push( new EventData( 'New Hue Saturation Layer', 'Mk  ', 'HStr' ) );
	inObject['events'].push( new EventData( 'New Selective Color Layer', 'Mk  ', 'SlcC' ) );
	inObject['events'].push( new EventData( 'New Channel Mixer Layer', 'Mk  ', 'ChnM' ) );
	inObject['events'].push( new EventData( 'New Gradient Map Layer', 'Mk  ', 'GdMp' ) );
	inObject['events'].push( new EventData( 'New Photo Filter Layer', 'Mk  ', 'photoFilter' ) );
	inObject['events'].push( new EventData( 'New Invert Layer', 'Mk  ', 'Invr' ) );
	inObject['events'].push( new EventData( 'New Threshold Layer', 'Mk  ', 'Thrs' ) );
	inObject['events'].push( new EventData( 'New Posterize Layer', 'Mk  ', 'Pstr' ) );
	inObject['events'].push( new EventData( 'New Brush', 'Mk  ', 'Brsh' ) );
	inObject['events'].push( new EventData( 'New Snapshot', 'Mk  ', 'SnpS' ) );
	inObject['events'].push( new EventData( 'New Swatch', 'Mk  ', 'Clrs' ) );
	inObject['events'].push( new EventData( 'New Tool Preset', 'Mk  ', 'toolPreset' ) );
	inObject['events'].push( new EventData( 'New Guide', 'Mk  ', 'Gd  ' ) );
	inObject['events'].push( new EventData( 'New Spot Color Channel', 'Mk  ', 'SCch' ) );
	inObject['events'].push( new EventData( 'New Group from Layers', 'Mk  ', 'layerSection' ) );
	inObject['events'].push( new EventData( 'New Comp', 'Mk  ', 'compsClass' ) );

	// generic make, this will get all makes
 	inObject['events'].push( new EventData( 'New Anything', 'Mk  ' ) );
*/

/*
//  Class IDs related to event select
	inObject['events'].push( new EventData( 'Select Layer', 'slct', 'Lyr ' ) );
	inObject['events'].push( new EventData( 'Select Channel', 'slct', 'Chnl' ) );
	inObject['events'].push( new EventData( 'Select Document', 'slct', 'Dcmn' ) );
	inObject['events'].push( new EventData( 'Select Path', 'slct', 'Path' ) );

	// generic select, this will get all selects
 	inObject['events'].push( new EventData( 'Select Anything', 'slct' ) );
*/

/*
//  Class IDs related to event delete
	inObject['events'].push( new EventData( 'Delete Layer', 'Dlt ', 'Lyr ' ) );
	inObject['events'].push( new EventData( 'Delete Channel', 'Dlt ', 'Chnl' ) );
	inObject['events'].push( new EventData( 'Delete Path', 'Dlt ', 'Path' ) );

	// generic delete, this will get all deletes
 	inObject['events'].push( new EventData( 'Delete Anything', 'Dlt ' ) );
*/

}

	
///////////////////////////////////////////////////////////////////////////////
// Function: GlobalVariables
// Usage: global action items that are reused
// Input: <none>
// Return: <none>
///////////////////////////////////////////////////////////////////////////////
function GlobalVariables() {
	gClassActionSet = charIDToTypeID( 'ASet' );
	gClassAction = charIDToTypeID( 'Actn' );
	gKeyName = charIDToTypeID( 'Nm  ' );
	gKeyNumberOfChildren = charIDToTypeID( 'NmbC' );
}


///////////////////////////////////////////////////////////////////////////////
// Function: GlobalStrings
// Usage: add your strings here that should be localized via the Photoshop
//        zstring table, all items here are global scope
// Input: <none>
// Return: <none>
///////////////////////////////////////////////////////////////////////////////
function GlobalStrings() {
	strTitle = localize( '$$$/JavaScript/ScriptEventsManager/Title=Script Events Manager' );
	strAdd = localize( '$$$/JavaScript/ScriptEventsManager/Add=&Add' );
	strEvent = localize( '$$$/JavaScript/ScriptEventsManager/Event=Photoshop Event:' );
	strScript = localize( '$$$/JavaScript/ScriptEventsManager/Script=&Script:' );
	strOK = localize( '$$$/JavaScript/ScriptEventsManager/OK=OK' );
	strDone = localize( '$$$/JavaScript/ScriptEventsManager/Done=&Done' );
	strCancel = localize( '$$$/JavaScript/ScriptEventsManager/Cancel=Cancel' );
	strRemove = localize( '$$$/JavaScript/ScriptEventsManager/Remove=&Remove' );
	strRemoveAll = localize( '$$$/JavaScript/ScriptEventsManager/RemoveAll=Remo&ve All' );
	strAction = localize( '$$$/JavaScript/ScriptEventsManager/Action=Action' );
	strActionDialog = localize( '$$$/JavaScript/ScriptEventsManager/ActionDialog=A&ction' );
	strScriptEventsFolder = localize( '$$$/JavaScript/ScriptEventsManager/Folder=/Presets/Scripts/Event Scripts Only/' );
	strName = localize( '$$$/JavaScript/ScriptEventsManager/Name=Event Name:' );
	strValue = localize( '$$$/JavaScript/ScriptEventsManager/Value=Descriptive Label:' );
	strPleaseSelect = localize( '$$$/JavaScript/ScriptEventsManager/PleaseSelect=Please select an installed notifier to remove.' );
	strActionNotifier = localize( '$$$/JavaScript/ScriptEventsManager/ActionNotifier=ActionNotifier' );
	strBrowse = localize( '$$$/JavaScript/ScriptEventsManager/Browse=Browse' );
	strAddEvent = localize( '$$$/JavaScript/ScriptEventsManager/AddEvent=Add an Event' );
	strFileExtension = localize( '$$$/JavaScript/ScriptEventsManager/FileExtension=JavaScript Files: *.js*' );
	strSelectFile = localize( '$$$/JavaScript/ScriptEventsManager/SelectFile=Select a JavaScript file' );
	strBigError = localize( "$$$/JavaScript/ScriptEventsManager/BigError=Sorry, something major happened and I can't continue! Would you like to see more info?" );
	strStartApplication = localize( '$$$/JavaScript/ScriptEventsManager/StartApplication=Start Application' );
	strNewDocument = localize( '$$$/JavaScript/ScriptEventsManager/NewDocument=New Document' );
	strOpenDocument = localize( '$$$/JavaScript/ScriptEventsManager/OpenDocument=Open Document' );
	strSaveDocument = localize( '$$$/JavaScript/ScriptEventsManager/SaveDocument=Save Document' );
	strCloseDocument = localize( '$$$/JavaScript/ScriptEventsManager/CloseDocument=Close Document' );
	strPrintDocument = localize( '$$$/JavaScript/ScriptEventsManager/PrintDocument=Print Document' );
	strExportDocument = localize( '$$$/JavaScript/ScriptEventsManager/ExportDocument=Export Document' );
	strAll = localize( '$$$/JavaScript/ScriptEventsManager/All=Everything' );
	strEventHelp = localize( '$$$/JavaScript/ScriptEventsManager/EventHelp=Select an event' );
	strFileHelp = localize( '$$$/JavaScript/ScriptEventsManager/FileHelp=Select a JavaScript file' );
	strActionHelp = localize( '$$$/JavaScript/ScriptEventsManager/ActionHelp=Select an action set and an action' );
	strAddHelp = localize( '$$$/JavaScript/ScriptEventsManager/AddHelp=Click to add the event' );
	strEventsHelp = localize( '$$$/JavaScript/ScriptEventsManager/EventsHelp=List of events currently enabled' );
	strRemoveHelp = localize( '$$$/JavaScript/ScriptEventsManager/RemoveHelp=Click to remove the selected event' );
	strRemovAllHelp = localize( '$$$/JavaScript/ScriptEventsManager/RemoveAllHelp=Click to remove all the events' );
	strDescription = localize( '$$$/JavaScript/ScriptEventsManager/Description=Description' );
	strDescriptionText = localize( '$$$/JavaScript/ScriptEventsManager/DescriptionText=Manage your events by adding and removing. Select different JavaScript files to get detailed descriptions.' );
	strAddFilesError = localize( '$$$/JavaScript/ScriptEventsManager/AddFilesError=Use the Browse item to add JavaScript files to the list.' );
	strEnterAValue = localize( '$$$/JavaScript/ScriptEventsManager/EnterAValue=Please enter a descriptive label.' );
	strEnterAName =  localize( '$$$/JavaScript/ScriptEventsManager/EnterAName=Please enter an event name.' );
	strNotifierAlreadyInstalled = localize( '$$$/ScriptingSupport/Error/NotifierAlreadyInstalled=Notifier already installed' );
	strError = localize( '$$$/JavaScript/ScriptEventsManager/Error=Error: ' );
	strEnabled = localize( '$$$/JavaScript/ScriptEventsManager/Enabled=&Enable Events to Run Scripts/Actions:' );
	strEnabledHelp = localize( '$$$/JavaScript/ScriptEventsManager/EnabledHelp=Enable or disable all notifiers' );
	strCannotOpen = localize( '$$$/JavaScript/ScriptEventsManager/CannotOpen=Cannot open file to save ' );
	strCannotWrite = localize( '$$$/JavaScript/ScriptEventsManager/CannotWrite=Cannot write to file ' );
	strCannotUndefined = localize( '$$$/JavaScript/ScriptEventsManager/CannotUndefined=Cannot save, file name is undefined.' );
	strNoScripts = localize( '$$$/JavaScript/ScriptEventsManager/NoScripts=no scripts/actions associated with events' );
	strSeeDocs = localize( '$$$/JavaScript/ScriptEventsManager/SeeDocs=Any scriptable event can be entered here. See the Scripting Reference for the full list of Photoshop event names.' );
	strPickAnExistingFile = localize( '$$$/JavaScript/ScriptEventsManager/PickAnExistingFile=Please select an existing file.' );
	strPickAFileWithAJavaScriptExtension = localize( '$$$/JavaScript/ScriptEventsManager/PickAFileWithJavaScriptExtension=Please select a file with a JavaScript extension. ( js or jsx)' );
    strlbEventsHeight = localize( "$$$/locale_specific/JavaScripts/ScriptEventsManager/LBEventsHeight=126" );
    strlbEventsWidth = localize( "$$$/locale_specific/JavaScripts/ScriptEventsManager/LBEventsWidth=400" );
    strstDescription = localize( "$$$/locale_specific/JavaScripts/ScriptEventsManager/STDescription=65" );
    stretName = localize( "$$$/locale_specific/JavaScripts/ScriptEventsManager/ETName=200" );
    stretValue = localize( "$$$/locale_specific/JavaScripts/ScriptEventsManager/ETValue=200" );
}


///////////////////////////////////////////////////////////////////////////////
// Function: UpdateRemovePanel
// Usage: update the list box for all the installed notifiers
// Input: list box, remove button and remove all button
// Return: <none>
// Note: This list box is sorted by the following rules.
// 1. Events are shown in the same order as the Event listbox
// 2. In alphabetical order for > 1 script/action per event 
///////////////////////////////////////////////////////////////////////////////
function UpdateRemovePanel( lb, btn, btnAll ) {
	if ( app.notifiers.length > 0 ) {
		lb.removeAll();
		var allEvents = new Array( app.notifiers.length );
		for ( var i = 0; i < app.notifiers.length; i++ ) {
			var niceName = app.notifiers[i].event;
			for ( var b = 0; b < gEvents.length; b++ ) {
				if ( gEvents[b].value == app.notifiers[i].event && 
				     gEvents[b].valueClass == app.notifiers[i].eventClass ) {
					niceName = gEvents[b].name;
					break;
				}
			}
			var betterDescription = File.decode( app.notifiers[i].eventFile.name.toString() );
			if ( true == app.notifiers[i].eventFile.alias ) {
				betterDescription = File.decode( app.notifiers[i].eventFile.resolve().name.toString() );
			}
			var inFile = app.notifiers[i].eventFile;
			inFile.open( "r" );
			var firstLine = inFile.readln();
			var splitUp = firstLine.split( ", " );
			if ( 4 == splitUp.length && splitUp[ 0 ] == gUniqueID ) {
				betterDescription = splitUp[ 3 ] + " " + strAction + " (" + splitUp[ 2 ] + ")";
			}
			inFile.close();
			allEvents[ i ] = niceName + ": " + betterDescription;
		}
		allEvents.sort( EventSort );
		for ( var i = 0; i < allEvents.length; i++ ) {
			lbEvents.add( "item", allEvents[ i ] );
		}
		// this used to select the new item in the list
		// now I have sorted them, how do I find the new one?
		// i could remember the old list and mark each one at a time
		// what about on start up?
		lb.items[ lb.items.length - 1 ].selected = true;
		btn.enabled = true;
		btnAll.enabled = true;
	} else {
		UpdateForNoNotifiers();
	}
}	


///////////////////////////////////////////////////////////////////////////////
// Function: UpdateEventDropDown
// Usage: Populate the drop down list with the events or add an event 
// Input: drop down list to update, new event created
// Return: the index of the custom event menu item
///////////////////////////////////////////////////////////////////////////////
function UpdateEventDropDown( dd, newEvent ) {
	var customIndex = 0;
	if ( undefined == newEvent ) {
		dd.removeAll();
		for ( var i = 0; i < gEvents.length; i++ ) {
			dd.add( "item", gEvents[i].name );
		}
		customIndex = dd.items.length + 1;
		dd.add( "separator", "before custom" ); 
		dd.add( "item", strAddEvent + "..." );
	
		dd.items[0].selected = true;
	} else {
		customIndex = gCustomEventIndex;
		if ( gCustomEventIndex == ( dd.items.length - 1 ) ) {
			dd.add( "separator", "after custom" );
		}
		dd.add( "item", gEvents[ gEvents.length - 1 ].name );
		dd.items[ dd.items.length - 1 ].selected = true;
	}
	return customIndex;
}

	
///////////////////////////////////////////////////////////////////////////////
// Function: CreateNewEvent
// Usage: pop another dialog to create a new event
// Input: <none>
// Return: a new EventData object
///////////////////////////////////////////////////////////////////////////////
function CreateNewEvent() {
	var newEvent;
	var dlgNewEvent = new Window( 'dialog' );
	// match our dialog background color to the host application
    dlgNewEvent.graphics.backgroundColor = dlgNewEvent.graphics.newBrush (dlgNewEvent.graphics.BrushType.THEME_COLOR, "appDialogBackground");
	dlgNewEvent.text = strAddEvent;
	dlgNewEvent.orientation = 'row';
	dlgNewEvent.alignChildren = 'top';
		var grpLeft = dlgNewEvent.add( 'group' );
		grpLeft.orientation = 'column';
		grpLeft.alignChildren = 'right';
			var grpName = grpLeft.add( 'group' );
			grpName.orientation = 'row';
				var stName = grpName.add( 'statictext' );
				stName.text = strName;
				var etName = grpName.add( 'edittext' );
				etName.preferredSize.width = StrToIntWithDefault( stretName, 200 );
			var grpValue = grpLeft.add( 'group' );
			grpValue.orientation = 'row';
				var stValue = grpValue.add( 'statictext' );
				stValue.text = strValue;
				var etValue = grpValue.add( 'edittext' );
				etValue.preferredSize.width = StrToIntWithDefault( stretValue, 200 );
			var grpMessage = grpLeft.add( 'group' );
			grpMessage.orientation = 'row';
				var pngI = grpMessage.add( "image", undefined, 'InfoIcon' );
				var stDescription = grpMessage.add( 'statictext', undefined, undefined, {multiline:true} );
				stDescription.text = strSeeDocs;
		var pnlRight = dlgNewEvent.add( 'group' );
		pnlRight.orientation = 'column';
		pnlRight.alignChildren = 'fill';
			var btnOk = pnlRight.add( 'button', undefined, strOK );
			var btnCancel = pnlRight.add( 'button', undefined, strCancel );

	dlgNewEvent.defaultElement = btnOk;
	dlgNewEvent.cancelElement = btnCancel;
		
	dlgNewEvent.center();
	
	btnOk.onClick = function() {
		if ( 0 == etName.text.length ) {
			alert( strEnterAName );
			return;
		}
		if ( 0 == etValue.text.length ) {
			alert( strEnterAValue );
			return;
		}
		dlgNewEvent.close( true );
	}

	if ( true == dlgNewEvent.show() ) {
		var splitValue = etValue.text.split( "," );
		newEvent = new EventData( etName.text, splitValue[0], splitValue[1] );
	}
	
	return newEvent;			
}


///////////////////////////////////////////////////////////////////////////////
// Function: UpdateScriptsFileDropDown
// Usage: Update the scripts drop down list, on init of the dialog I pull the
//        data from the presets/scripts/event scripts only folder
//        if the user browses to a new file then add it and some separators 
// Input: the drop down list to update, the file from the browse
// Return: the index of the browse menu item
///////////////////////////////////////////////////////////////////////////////
function UpdateScriptsFileDropDown( dd, newFile ) {
	var customIndex = 0;
	if ( undefined == newFile ) {
		var allFiles = Folder( path + strScriptEventsFolder ).getFiles();
		gScriptsFiles = new Array();
		if ( allFiles.length > 0 ) {
			dd.removeAll();
			for ( var i = 0; i < allFiles.length; i++ ) {
				if ( allFiles[i].name.substr( 0, strActionNotifier.length ) != strActionNotifier && 
				     IsJavaScriptExtension( allFiles[i] ) ) { 
						 
					var dataForMenu = GetDescriptionAndMenuNameFromFile( allFiles[i] );
					var menuItem = dd.add( "item", dataForMenu["Name"] );
					menuItem.description = dataForMenu["Desc"];
					gScriptsFiles.push( allFiles[i] );
					
				}
			}
		}
		if ( undefined != gExtraFiles ) {
			for ( var i = 0; i < gExtraFiles.length; i++ ) {
				var dataForMenu = GetDescriptionAndMenuNameFromFile( File( gExtraFiles[i] ) );
				var menuItem = dd.add( "item",  dataForMenu["Name"] );
				menuItem.description = dataForMenu["Desc"];
				gScriptsFiles.push( File( gExtraFiles[i] ) );
			}
		}
		if ( dd.items.length > 0 ) {
			dd.items[0].selected = true;
		}
		customIndex = dd.items.length + 1;
		dd.add( "separator", "before custom" ); 
		dd.add( "item", strBrowse + "..." );
	} else {
		customIndex = gCustomFileIndex;
		if ( gCustomFileIndex == ( dd.items.length - 1 ) ) {
			dd.add( "separator", "after custom" );
		}
		var dataForMenu = GetDescriptionAndMenuNameFromFile( newFile );
		var menuItem = dd.add( "item", dataForMenu["Name"] );
		menuItem.description = dataForMenu["Desc"];
		dd.items[ dd.items.length - 1 ].selected = true;
		gScriptsFiles.push( newFile );
		if ( undefined == gExtraFiles ) {
			gExtraFiles = new Array();
			gParams.Set( 'extrafiles', gExtraFiles );
		}
		gExtraFiles.push( newFile.absoluteURI );
	}
	return customIndex;
}


///////////////////////////////////////////////////////////////////////////////
// Function: AddFileNotifier
// Usage: The add button was clicked, add the notifier from the drop downs
// Input: two drop down lists, event and file
// Return: <none>
// Note: I have to adjust for the custom items and the separators
///////////////////////////////////////////////////////////////////////////////
function AddFileNotifier( edd, fdd ) {
	try {
		if ( null == fdd.selection && 0 == gScriptsFiles.length ) {
			throw strAddFilesError;
		}
		var eventsIndex = edd.selection.index;
		if ( eventsIndex > gCustomEventIndex ) {
			eventsIndex -= 3;
		}
		var filesIndex = fdd.selection.index;
		if ( filesIndex > gCustomFileIndex ) {
			filesIndex -= 3;
		}
		app.notifiers.add( gEvents[ eventsIndex ].value, gScriptsFiles[ filesIndex ], gEvents[ eventsIndex ].valueClass );
	}
	catch( e ) {
		alert( e );
	}
}


///////////////////////////////////////////////////////////////////////////////
// Function: AddActionNotifier
// Usage: Create a JavaScript file with the code to execute an action from
//        an action set
// Input: three drop down lists, event, action set and action, and the events list box
// Return: <none>
///////////////////////////////////////////////////////////////////////////////
function AddActionNotifier( edd, sdd, add, lb ) {
	try {
		var strLookingFor = edd.selection.toString() + ": " + add.selection.toString() + " " + strAction + " (" + sdd.selection.toString() + ")";
		for ( var i = 0; i < lb.items.length; i++ ) {
			if ( lb.items[i].toString() == strLookingFor ) {
				throw ( strError + strNotifierAlreadyInstalled );
			}
		}
		var uniqueFileName = CreateUniqueFileName( app.preferencesFolder.toString() + "/", strActionNotifier, ".jsx" );
		var outFile = new File ( uniqueFileName );
		var addStr = escape( add.selection.toString() );
		addStr = encodeURI( addStr );
		var sddStr = escape( sdd.selection.toString() );
		sddStr = encodeURI( sddStr );
		outFile.open( "w" );
		outFile.writeln( gUniqueID + ", " + edd.selection.toString() + ", " + sdd.selection.toString() + ", " + add.selection.toString() );
		outFile.writeln( "try {" );
		outFile.writeln( "     var actionStr = '" + addStr.toString() + "';" );
		outFile.writeln( "     actionStr = decodeURI( actionStr );" );
		outFile.writeln( "     actionStr = unescape( actionStr );" );
		outFile.writeln( "     var actionSetStr = '" + sddStr.toString() + "';" );
		outFile.writeln( "     actionSetStr = decodeURI( actionSetStr );" );
		outFile.writeln( "     actionSetStr = unescape( actionSetStr );" );
		outFile.writeln( "     doAction( actionStr, actionSetStr );" );
		outFile.writeln( "}" );
		outFile.writeln( "catch( e ) { }" );
		outFile.close();
		var eventsIndex = edd.selection.index;
		if ( eventsIndex > gCustomEventIndex ) {
			eventsIndex -= 3;
		}
		app.notifiers.add( gEvents[ eventsIndex ].value, outFile, gEvents[ eventsIndex ].valueClass );
	} 
	catch( e ) {
		alert( e );
	}
}


///////////////////////////////////////////////////////////////////////////////
// Function: CreateUniqueFileName
// Usage: given a folder, file name and extenstion create a file with a unique
//        file name
// Input: given a folder, file name and extenstion
// Return: the full path to the unique file
///////////////////////////////////////////////////////////////////////////////
function CreateUniqueFileName( inFolder, inFileName, inExtension ) {
	var uniqueFileName = inFolder + inFileName + inExtension;
	var fileNumber = 1;
	while ( File( uniqueFileName ).exists ) {
		uniqueFileName = inFolder + inFileName + "_" + fileNumber + inExtension;
		fileNumber++;
	}
	return uniqueFileName;
}


///////////////////////////////////////////////////////////////////////////////
// Function: MacJSFilter
// Input: f, file or folder to check
// Return: true or false, true if file or folder is to be displayed
///////////////////////////////////////////////////////////////////////////////
function MacJSFilter( f )
{
	var jsExtension = ".js";
	var jsExtension2 = ".jsx";
	var folderThatsAnApp = ".app"; // this doesn't cover all packages or bundles
	var lCaseName = f.name;
	lCaseName.toLowerCase();
	if ( lCaseName.lastIndexOf( jsExtension ) == f.name.length - jsExtension.length )
		return true;
	else if ( lCaseName.lastIndexOf( jsExtension2 ) == f.name.length - jsExtension2.length )
		return true;
	else if ( lCaseName.lastIndexOf( folderThatsAnApp ) == f.name.length - folderThatsAnApp.length )
		return false;
	else if ( f instanceof Folder )
		return true;
	else
		return false;
}


///////////////////////////////////////////////////////////////////////////////
// Function: GetDescriptionAndMenuNameFromFile
// Usage: Return the descriptive text and the name for the menu dropdown from
//        variables in the file. The default description "Desc" is strDescriptionText
//        and the default menu "Name" is the file name.
//        The description should be stored so this only gets called once per file.
// Input: file to read out a description, not an alias
// Output: Array of "Desc" and "Name" for each file
///////////////////////////////////////////////////////////////////////////////
function GetDescriptionAndMenuNameFromFile( inFile ) {
	var result = new Array;
	result["Desc"] = strDescriptionText;
	var readFile = inFile;
	if ( true == inFile.alias ) {
		readFile = inFile.resolve();
	}
	result["Name"] = File.decode( readFile.name );
	var searchStrings = [ "Desc", "Name" ];
	if ( undefined != readFile ) {
		if ( readFile.open( "r" ) ) {
			var readLength = 1000;
			if ( readFile.length < readLength ) {
				readLength = readFile.length;
			}
			var readData = readFile.read( readLength );
			readFile.close();
			for ( var i = 0; i < searchStrings.length; i++ ) {
				var stringStartNew = 'var beg' + searchStrings[i] + ' = "';
				var stringEndNew = '" // end' + searchStrings[i];
				var descriptionStart = readData.indexOf( stringStartNew, 0 ) + stringStartNew.length;
				var descriptionEnd = readData.indexOf( stringEndNew, descriptionStart );
				if ( descriptionStart != -1 && descriptionEnd != -1 && descriptionEnd > descriptionStart ) {
					result[ searchStrings[i] ] = localize( readData.substr( descriptionStart, descriptionEnd - descriptionStart ) );
				}
				// really old backwards compatibility search
				if ( result["Desc"] == strDescriptionText && searchStrings[i] == "Desc" ) {
					var stringStartOld = '/** "';
					var stringEndOld = '" **/';
					var descriptionStart = readData.indexOf( stringStartOld, 0 ) + stringStartOld.length;
					var descriptionEnd = readData.indexOf( stringEndOld, descriptionStart );
					if ( descriptionStart != -1 && descriptionEnd != -1 && descriptionEnd > descriptionStart ) {
						result[ searchStrings[i] ] = localize( readData.substr( descriptionStart, descriptionEnd - descriptionStart ) );
					}
				}
			}
		}
	}
	return result;
}


///////////////////////////////////////////////////////////////////////////////
// Function: IsJavaScriptExtension
// Usage: See if the file extension is .js or .jsx
// Input: file to check extension
// Output: true if extension is .js or .jsx, false otherwise
///////////////////////////////////////////////////////////////////////////////
function IsJavaScriptExtension( inFile ) { 
	var returnValue = false;
	var realFileName = inFile.name;
	if ( true == inFile.alias ) {
		realFileName = inFile.resolve().name;
	}
	var splitFileName = realFileName.split( "." );
	if ( splitFileName.length > 1 ) {
		var lastDot = splitFileName.length - 1;
		splitFileName[ lastDot ] = splitFileName[ lastDot ].toLowerCase();
		if ( splitFileName[ lastDot ] == "js" || splitFileName[ lastDot ] == "jsx" ) {
			returnValue = true;
		}
	}
	return returnValue;
}


///////////////////////////////////////////////////////////////////////////////
// Function: GetScriptNameForXML
// Usage: You can't save certain characters in xml, strip them here
// NOTE:  This list is not complete
// Input: <none>
// Output: The title stripped of characters bad for xml
///////////////////////////////////////////////////////////////////////////////
function GetScriptNameForXML () {
	var scriptNameForXML = new String( strTitle );
	var charsToStrip = Array( " ", "'", "." );
	for (var a = 0; a < charsToStrip.length; a++ )  {
		var nameArray = scriptNameForXML.split( charsToStrip[a] );
		scriptNameForXML = "";
		for ( var b = 0; b < nameArray.length; b++ ) {
			scriptNameForXML += nameArray[b];
		}
	}
	return scriptNameForXML;
}


///////////////////////////////////////////////////////////////////////////////
// Function: GetDefaultParamsFile
// Usage: Get the file where I store my default parameters
// Input: <none>, global strTitle must be defined
// Output: Location of File of my parameters
///////////////////////////////////////////////////////////////////////////////
function GetDefaultParamsFile() {
	return ( new File( app.preferencesFolder + "/" + strTitle + ".xml" ) );
}


///////////////////////////////////////////////////////////////////////////////
// Function: Parameters
// Usage: Object to load and save parameters to disk
// Input: inFileName is the path to the file, initRoutine will be called
//        to create your default parameters
// Output: new object, use the Get(), Set(), Load() and Save() routines
//         other routines are for private use by the object
///////////////////////////////////////////////////////////////////////////////
function Parameters( inFileName, initRoutine ) {

	// functions for public use

	this.Get = function ( index ) {
		return this.data[index];
	}
	
	this.Set = function ( index, value ) {
		this.data[index] = value;
	}

	this.Load = function ( ) {
		if ( File( this.fileName ).exists ) {
			var loadFile = File( this.fileName );
			if ( loadFile.open( "r" ) ) {
				var strXML = loadFile.read( loadFile.length );
				loadFile.close();
				var startSpace = strXML.indexOf( "<" ) + 1;
				var endSpace = strXML.indexOf( ">" );
				if ( endSpace == -1 ) return;
				var projectSpace = strXML.substring( startSpace, endSpace ); 
				if ( projectSpace == GetScriptNameForXML() ) {
					strXML = strXML.substring( endSpace + 1, strXML.length );
					this.ReadElements( strXML, this.data );
				}
			}
		}
	}

	this.Save = function ( ) {
		if ( undefined == this.fileName ) {
			alert( strCannotUndefined );
			return;
		}
		var saveFile = File( this.fileName );
		saveFile.encoding = "UTF8";
		if ( saveFile.open( "w", "TEXT", "????" ) ) {
			if ( saveFile.write( "\uFEFF" ) ) {
				saveFile.writeln( "<" + GetScriptNameForXML() + ">" );
				this.WriteData( saveFile, this.data );
				saveFile.writeln( "</" + GetScriptNameForXML() + ">" );
				saveFile.close();
			} else {
				alert( strCannotWrite + this.fileName.fsName );
				saveFile.close();
				return;
			}
		} else {
			alert( strCannotOpen + this.fileName.fsName );
		}
	}

	// functions for private use 

	this.Initialize = function( initRoutine ) {
		if ( undefined != initRoutine ) {
			initRoutine( this.data );
		}
	}
	
	this.WriteData = function( inFile, inData ) {
		this.tabLevel++;
		var prop;
		for ( prop in inData ) {
			if ( typeof( inData[ prop ] ) == "object" ) {
				this.WriteTabs( inFile, this.tabLevel );
				inFile.writeln( "<" + prop + ">" );
				this.WriteData( inFile, inData[ prop ] );
				this.WriteTabs( inFile, this.tabLevel );
				inFile.writeln( "</" + prop + ">" );
			} else {
				this.WriteTabs( inFile, this.tabLevel );
				inFile.writeln( "<" + prop + ">" + inData[ prop ] + "</" + prop + ">" );
			}
		}
		this.tabLevel--;
	}

	this.WriteTabs = function( inFile, tabs ) {
		while ( tabs-- ) {
			inFile.write( "\t" );
		}
	}

	this.ReadElements = function( inText, inData ) {
		while ( inText.length ) {
			var startMarker = inText.indexOf( "<" ) + 1;
			var endMarker = inText.indexOf( ">" );
			if ( endMarker == -1 ) break;
			var starter = inText.substring( startMarker, endMarker );
			var enderIndex = inText.indexOf( "</" + starter + ">" );
			if ( enderIndex == -1 ) break;
			var data = inText.substring( endMarker + 1, enderIndex );
			if ( data.search( "<" ) != -1 ) {
				inData[ starter ] = new Array();
				this.ReadElements( data, inData[ starter ] );
			} else {
				inData[ starter ] = data;
			}
			// force boolean values to boolean types
			if ( data == "true" || data == "false" ) {
				inData[ starter ] = data == "true";
			}
			// should I force number values to numbers ???
			inText = inText.substring( enderIndex + ("</" + starter + ">" ).length, inText.length );
		}
	}

	// internal variables, public should not access

	this.fileName = inFileName;

	this.data = new Array();

	this.tabLevel = 0;

	this.Initialize( initRoutine );
}


///////////////////////////////////////////////////////////////////////////////
// Function: UpdateForNoNotifiers
// Usage: set up the events list box for no events and disable the buttons
// Input: <none> : globals btnRemove, btnRemoveAll, strNoScripts and lbEvents
// Return: <none>
///////////////////////////////////////////////////////////////////////////////
function UpdateForNoNotifiers() {
	btnRemove.enabled = false;
	btnRemoveAll.enabled = false;
	lbEvents.add( "item", strNoScripts );
}


///////////////////////////////////////////////////////////////////////////////
// Function: EventSort
// Usage: sort function for the events list box
// Input: a, b are the two events to sort
// Return: -1 or 1, no need for 0 as there should be no dupes
///////////////////////////////////////////////////////////////////////////////
function EventSort( a, b ) {
	var aa = a.split( ":" );
	if ( aa.length < 2 ) {
		return -1;
	}
	var bb = b.split( ":" );
	if ( bb.length < 2 ) {
		return 1;
	}
	var aaIndex = 0;
	var bbIndex = 0;
	for ( var i = 0; i < ddEvent.items.length; i++ ) {
		if ( ddEvent.items[ i ].toString() == aa[ 0 ] ) {
			aaIndex = i;
		}
		if ( ddEvent.items[ i ].toString() == bb[ 0 ] ) {
			bbIndex = i;
		}
	}
	if ( bbIndex == aaIndex ) {
		var cc = [ aa[ 1 ], bb[ 1 ] ];
		cc.sort();
		if ( cc[ 0 ] == aa[ 1 ] ) {
			return -1;
		} else {
			return 1;
		}
	} else {
		if ( aaIndex < bbIndex )  {
			return -1;
		} else {
			return 1;
		}
	}
	return -1;
}

///////////////////////////////////////////////////////////////////////////
// Function: StrToIntWithDefault
// Usage: convert a string to a number, first stripping all characters
// Input: string and a default number
// Return: a number
///////////////////////////////////////////////////////////////////////////
function StrToIntWithDefault( s, n ) {
    var onlyNumbers = /[^0-9]/g;
    var t = s.replace( onlyNumbers, "" );
	t = parseInt( t );
	if ( ! isNaN( t ) ) {
        n = t;
    }
    return n;
}
// end Script Events Manager.jsx
