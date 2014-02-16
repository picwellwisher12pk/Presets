// Preferences seem to get messed up all the time
// This utility will try to delete them
// This will work on CS4 (11), CS5 (12), CS5.5 (12.1), and CS6 (13.0)
// Result: Wed Aug 08 2012 12:08:35 GMT-0700

/*
@@@BUILDINFO@@@ Just Fix It.jsx 1.1.0.0
*/

#target "photoshop"

app.bringToFront();


// here is the list of files that write out xml files to remember
var gStandAloneFiles = [
    "Dr. Brown's 1-2-3 Process",
    "Dr. Brown's Caption Maker",
    "Image Processor Pro",
];


// check all the places we write out xml files
var gStandardPlaces = [
    app.preferencesFolder.toString(),
    app.path.toString() + "/Presets/Scripts",
    Folder.userData.toString(),
];


// here are the ones we make
var gCSXSPreferences = [
    "Watermark",
    "EMailer",
];


// panels store information in the same location
var csxsVersionArray = VersionToCSXS(app.version);
var gCSXSFile = new File(Folder.userData +
                         "/Adobe/" +
                         csxsVersionArray[0] +
                         "ServiceManager/preference/" + 
                         csxsVersionArray[1]);


// create a dialog and populate with our lists if you find the files
var dlg = new Window('dialog', "Just Fix It");
dlg.orientation = "row";
dlg.alignChildren = "top";
var grpLeft = dlg.add("group");
grpLeft.orientation = "column";
grpLeft.alignChildren = "left";
// for some reason [2,0,302,150], 
var st = grpLeft.add("statictext", undefined,
    "This script is designed to delete damaged preferences that may be causing problems " +
    "with some of the panels and scripts that are listed below. \r\rSelect the Dr. Brown items that you would like to repair " +
    "and then select OK. This script cannot solve all possible problems, but it's a good place to start. \r\rIt is mandatory to close all panels and restart Adobe Photoshop after " +
    "running this script.", 
    { multiline:true } );
st.preferredSize.width = 300;
st.preferredSize.height = IsWindowsOS() ? 150 : 200;


// add in the xml files
var cbArray = new Array();
for (var i = 0; i < gStandAloneFiles.length; i++) {
    var cb = grpLeft.add("checkbox", undefined, gStandAloneFiles[i]);
    // enabled was false and set to true in loop
    // fancy logic to only enable ones with files that I find
    // only confused users
    var enabled = true; 
    // for (var ii = 0; ii < gStandardPlaces.length && !enabled; ii++) {
    //    if (File(gStandardPlaces[ii] + "/" + gStandAloneFiles[i] + ".xml").exists) {
    //        enabled = true;
    //    }
    // }
    cb.value = enabled;
    cb.enabled = enabled;
    cbArray.push(cb);
}


// add in the csxs panels, they are all linked together
// kill one and you kill all prefs for all panels
var csxsArray = new Array();
enabled = true; // see comment above about fancy enable logic gCSXSFile.exists;
for (var i = 0; i < gCSXSPreferences.length; i++) {
    cb = grpLeft.add("checkbox", undefined, gCSXSPreferences[i]);
    cb.value = enabled;
    cb.enabled = enabled;
    cb.onClick = function() {
        for (var i = 0; i < csxsArray.length; i++) {
            csxsArray[i].value = this.value;
        }
    }
    csxsArray.push(cb);
}


// add in our buttons on the right
var grpRight = dlg.add("group");
grpRight.orientation = "column";
grpRight.alignChildren = "left";
grpRight.alignment = "top";
var btnOK = grpRight.add("button", undefined, "OK");
var btnCancel = grpRight.add("button", undefined, "Cancel");

// check for ok and do some deletes
if (dlg.show() == 1) {
    for (var i = 0; i < cbArray.length; i++) {
        if (cbArray[i].value) {
            for (var ii = 0; ii < gStandardPlaces.length; ii++) {
                File(gStandardPlaces[ii] + "/" + gStandAloneFiles[i] + ".xml").remove();
            }
        }
    }
    for (var i = 0; i < csxsArray.length; i++) {
        if (csxsArray[i].value) {
            gCSXSFile.remove();
            i = csxsArray.length;
        }
    }
}

'DONE';

///////////////////////////////////////////////////////////////////////////////
// Given the version string convert that to the CSXS folder name
// 11   == CS4
// 12   == CS5
// 12.1 == CS5.5
// 13   == CS6
function VersionToCSXS(inVersionStr) {
    var result = [];
    result[0] = "CS4";
    var vArray = inVersionStr.split(".");
    if (vArray.length > 1) {
        if (vArray[0] == 12 && vArray[1] == 0) {
            result[0] = "CS5";
            result[1] = "csxs2.pref";
        }
        if (vArray[0] == 12 && vArray[1] == 1) {
            result[0] = "CS5.5";
            result[1] = "csxs2.pref";
        }
        if (vArray[0] == 13) {
            result[0] = "CS6";
            result[1] = "csxs3.pref";
        }
    }
    return result;
}


///////////////////////////////////////////////////////////////////////////////
// Function: IsWindowsOS
// Usage: Are we running on the Windows OS?
// Input: <none>
// Return: true if on a Windows
///////////////////////////////////////////////////////////////////////////////
function IsWindowsOS() {
	if ( $.os.search(/windows/i) != -1 ) {
		return true;
	} else {
		return false;
	}
}
// end Just Fix It.jsx

