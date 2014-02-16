#target photoshop
//
// ContactSheetII
//
// $Id: ContactSheetII.jsx,v 1.7 2012/03/03 00:23:54 anonymous Exp $
// Copyright: (c)2011, Adobe
// Author: xbytor@gmail.com
//
//$.level = 1;
//

/*

@@@BUILDINFO@@@ ContactSheetII.jsx 2.2.9

*/
 
/*
// BEGIN__HARVEST_EXCEPTION_ZSTRING
<javascriptresource>
  <name>$$$/AdobePlugin/PIPLInfo/PluginName/ContactSheetII=Contact Sheet II...</name>
  <menu>automate</menu>
  <category>$$$/private/ContactSheet=**ContactSheet**</category>
  <eventid>0B71D221-F8CE-11d2-B21B-0008C75B322C</eventid>
<terminology><![CDATA[<< /Version 1
    /Events <<
       /0B71D221-F8CE-11d2-B21B-0008C75B322C [($$$/AdobePlugin/PIPLInfo/PluginName/ContactSheetII=Contact Sheet II...) /contactSheetSettings <<
           /InSr [($$$/AETE/ContactSheet2/Source2=source) /typeInputSource]
           /InpD [($$$/AETE/ContactSheet2/Source=source) /typePlatformFilePath]
           /InSd [($$$/AETE/ContactSheet2/Directories=Directories) /typeBoolean]
           /Wdth [($$$/AETE/ContactSheet2/SheetWidth=sheet width) /typeUnitFloat]
           /Hght [($$$/AETE/ContactSheet2/SheetHeight=sheet height) /typeUnitFloat]
           /Unit [($$$/AETE/ContactSheet2/WidthHeightUnit=Width Height Unit) /typeWidthHeightUnit]
           /Rslt [($$$/AETE/ContactSheet2/Resolution=resolution) /typeUnitFloat]
           /RsUn [($$$/AETE/ContactSheet2/ResolutionUnit=Resolution Unit) /typeResolutionUnit]
           /Md   [($$$/AETE/ContactSheet2/Mode=mode) /typeColorSpace]
           /FltT [($$$/AETE/ContactSheet2/Flattened=Flattened Layers) /typeBoolean]
           /RowO [($$$/AETE/ContactSheet2/PlaceAcrossFirst=place across first) /typeBoolean]
           /Cols [($$$/AETE/ContactSheet2/NumberOfColumns=number of columns) /typeInteger]
           /Rows [($$$/AETE/ContactSheet2/NumberOfRows=number of rows) /typeInteger]
           /IndN [($$$/AETE/ContactSheet2/FilenameCaption=filename caption) /typeBoolean]
           /Font [($$$/AETE/ContactSheet2/Font=font) /typeFont]
           /FtSz [($$$/AETE/ContactSheet2/FontSize=font size) /typeInteger]
           /UAS  [($$$/AETE/ContactSheet2/UseAutoSpacing=Auto Spacing) /typeBoolean]
           /HtSp [($$$/AETE/ContactSheet2/HorizontalSpacing=Horizontal Spacing) /typeUnitFloat]
           /VtSp [($$$/AETE/ContactSheet2/VerticalSpacing=Vertical Spacing) /typeUnitFloat]
           /Rtbf [($$$/AETE/ContactSheet2/RotateForBestFit=Rotate For Best Fit) /typeBoolean]

           /CSIISettings [(ContactSheetII Settings) /typeText]
           /Msge [(Message) /typeText]
         >>]
     >>

    /Enums <<
        /typeFont <<
          /Sans ($$$/AETE/ContactSheet2/Mac/SansSerif=Helvetica)
          /Serf ($$$/AETE/ContactSheet2/Mac/Serif=Times)
          /Cour ($$$/AETE/ContactSheet2/Mac/Courier=Courier)
         >>
        /typeWidthHeightUnit <<
          /Inch ($$$/AETE/ContactSheet2/Inches=inches)
          /Ctmr ($$$/AETE/ContactSheet2/Centimeter=cm)
          /Pixl ($$$/AETE/ContactSheet2/Pixels=pixels)
         >>
        /typeResolutionUnit <<
          /PpIn ($$$/AETE/ContactSheet2/Pixels/Inches=pixels/inch)
          /PpCm ($$$/AETE/ContactSheet2/Pixels/Centimeter=pixels/cm)
         >>
        /typeInputSource <<
          /cuod ($$$/AETE/ContactSheet2/CurrentDocs=Open Documents)
          /fold ($$$/AETE/ContactSheet2/Folder=Folder)
          /flbr ($$$/AETE/ContactSheet2/Bridge=Bridge)
          /file ($$$/AETE/ContactSheet2/Files=Files)
         >>
     >>
   >>
   
]]></terminology>

</javascriptresource>
// END__HARVEST_EXCEPTION_ZSTRING
*/

/* fonts for Windows
        /typeFont <<
          /Sans ($$$/AETE/ContactSheet2/Win/SansSerif=Arial)
          /Serf ($$$/AETE/ContactSheet2/Win/Serif=Times New Roman)
          /Cour ($$$/AETE/ContactSheet2/Win/Courier=Courier)
         >>
*/

app;

$.localize = true;

//
//@show include
//
//
//
// psx.jsx
//   This file contains a collection code extracted from other parts
//   of xtools for use in production scripts written for Adobe.
//
// $Id: psx.jsx,v 1.61 2012/02/07 01:17:13 anonymous Exp $
// Copyright: (c)2011, xbytor
// Author: xbytor@gmail.com
//
//@show include
//
//

//
// cTID and sTID are wrappers for standard PS ID conversion functions.
// They require fewer keystrokes and are easier to read.
// Their implementations cache the calls to the underlying PS DOM
// functions making them fractionally faster than the underlying functions
// in some boundary cases.
//
cTID = function(s) { return cTID[s] || (cTID[s] = app.charIDToTypeID(s)); };
sTID = function(s) { return sTID[s] || (sTID[s] = app.stringIDToTypeID(s)); };

// return an ID for whatever s might be
xTID = function(s) {
  if (s.constructor == Number) {
    return s;
  }
  try {
    if (s instanceof XML) {
      var k = s.nodeKind();
      if (k == 'text' || k == 'attribute') {
        s = s.toString();
      }
    }
  } catch (e) {
  }

  if (s.constructor == String) {
    if (s.length > 0) {
      if (s.length != 4) return sTID(s);
      try { return cTID(s); } catch (e) { return sTID(s); }
    }
  }
  Error.runtimeError(19, s);  // Bad Argument

  return undefined;
};

//
// Convert a 32 bit ID back to either a 4 character representation or the
// mapped string representation.
//
id2char = function(s) {
  if (isNaN(Number(s))){
    return '';
  }
  var v;

  var lvl = $.level;
  $.level = 0;
  try {
    if (!v) {
      try { v = app.typeIDToCharID(s); } catch (e) {}
    }
    if (!v) {
      try { v = app.typeIDToStringID(s); } catch (e) {}
    }
  } catch (e) {
  }
  $.level = lvl;

  if (!v) {
    // neither of the builtin PS functions know about this ID so we
    // force the matter
    v = psx.numberToAscii(s);
  }

  return v ? v : s;
};


//
// What platform are we on?
//
isWindows = function() { return $.os.match(/windows/i); };
isMac = function() { return !isWindows(); };

//
// Which app are we running in?
//
isPhotoshop = function() { return !!app.name.match(/photoshop/i); };
isBridge = function() { return !!app.name.match(/bridge/i); };

//
// Which CS version is this?
//
CSVersion = function() {
  var rev = Number(app.version.match(/^\d+/)[0]);
  return isPhotoshop() ? (rev - 7) : rev;
};
CSVersion._version = CSVersion();

isCS6 = function()  { return CSVersion._version == 6; };
isCS5 = function()  { return CSVersion._version == 5; };
isCS4 = function()  { return CSVersion._version == 4; };
isCS3 = function()  { return CSVersion._version == 3; };
isCS2 = function()  { return CSVersion._version == 2; };
isCS  = function()  { return CSVersion._version == 1; };

//
// ZStrs is a container for (mostly) localized strings used in psx
// or elsewhere
//
try {
  var _lvl = $.level;
  $.level = 0;
  ZStrs;
} catch (e) {
  ZStrs = {};
} finally {
  $.level = _lvl;
  delete _lvl;
}

ZStrs.SelectFolder = 
  localize("$$$/JavaScripts/psx/SelectFolder=Select a folder");

ZStrs.SelectFile = 
  localize("$$$/JavaScripts/psx/SelectFile=Select a file");

ZStrs.FileErrorStr = 
  localize("$$$/JavaScripts/psx/FileError=File Error: ");

ZStrs.BadFileSpecified = 
  localize("$$$/JavaScripts/psx/BadFileSpecified=Bad file specified");

ZStrs.UnableToOpenLogFile =
  localize("$$$/JavaScripts/psx/UnableToOpenLogFile=Unable to open log file %%s : %%s");

ZStrs.UnableToWriteLogFile =
  localize("$$$/JavaScripts/psx/UnableToWriteLogFile=Unable to write to log file %%s : %%s");

ZStrs.UnableToOpenFile =
  localize("$$$/JavaScripts/psx/UnableToOpenFile=Unable to open file");

ZStrs.UnableToOpenInputFile =
  localize("$$$/JavaScripts/psx/UnableToOpenInputFile=Unable to open input file");

ZStrs.UnableToOpenOutputFile =
  localize("$$$/JavaScripts/psx/UnableToOpenOutputFile=Unable to open output file");

ZStrs.CharacterConversionError =
  localize("$$$/JavaScripts/psx/CharacterConversionError=Probable character conversion error");

// need to break up the ZString prefix to avoid
// the ZString harvester
ZStrs.InstalledScripts = 
  localize('$' + '$' + '$' + '/' +
           (isCS6() ? "private/" : "") +
           "ScriptingSupport/InstalledScripts=Presets/Scripts");

ZStrs.DocumentName =
  localize("$$$/JavaScripts/psx/DocumentName=Document Name");

ZStrs.LCDocumentName =
  localize("$$$/JavaScripts/psx/LCDocumentName=document name");

ZStrs.UCDocumentName =
  localize("$$$/JavaScripts/psx/UCDocumentName=DOCUMENT NAME");

ZStrs.FN1Digit =
  localize("$$$/JavaScripts/psx/FN1Digit=1 Digit Serial Number");

ZStrs.FN2Digit =
  localize("$$$/JavaScripts/psx/FN2Digit=2 Digit Serial Number");

ZStrs.FN3Digit =
  localize("$$$/JavaScripts/psx/FN3Digit=3 Digit Serial Number");

ZStrs.FN4Digit =
  localize("$$$/JavaScripts/psx/FN4Digit=4 Digit Serial Number");

ZStrs.FN5Digit =
  localize("$$$/JavaScripts/psx/FN5Digit=5 Digit Serial Number");

ZStrs.LCSerial =
  localize("$$$/JavaScripts/psx/LCSerial=Serial Letter (a, b, c...)");

ZStrs.UCSerial =
  localize("$$$/JavaScripts/psx/UCSerial=Serial Letter (A, B, C...)");

ZStrs.Date_mmddyy =
  localize("$$$/JavaScripts/psx/Date/mmddyy=mmddyy (date)");

ZStrs.Date_mmdd =
  localize("$$$/JavaScripts/psx/Date/mmdd=mmdd (date)");

ZStrs.Date_yyyymmdd =
  localize("$$$/JavaScripts/psx/Date/yyyymmdd=yyyymmdd (date)");

ZStrs.Date_yymmdd =
  localize("$$$/JavaScripts/psx/Date/yymmdd=yymmdd (date)");

ZStrs.Date_yyddmm =
  localize("$$$/JavaScripts/psx/Date/yyddmm=yyddmm (date)");

ZStrs.Date_ddmmyy =
  localize("$$$/JavaScripts/psx/Date/ddmmyy=ddmmyy (date)");

ZStrs.Date_ddmm =
  localize("$$$/JavaScripts/psx/Date/ddmm=ddmm (date)");

ZStrs.Extension =
  localize("$$$/JavaScripts/psx/Extension=Extension");

ZStrs.LCExtension =
  localize("$$$/JavaScripts/psx/LCextension=extension");

ZStrs.UCExtension =
  localize("$$$/JavaScripts/psx/UCextension=EXTENSION");

ZStrs.FileNaming =
  localize("$$$/JavaScripts/psx/FileNaming=File Naming");

ZStrs.ExampleLabel =
  localize("$$$/JavaScripts/psx/ExampleLabel=Example:");

ZStrs.StartingSerialNumber =
  localize("$$$/JavaScripts/psx/StartingSerialNumber=Starting Serial #:");

ZStrs.CompatibilityPrompt =
  localize("$$$/JavaScripts/psx/CompatibilityPrompt=Compatibilty:");

ZStrs.Windows =
  localize("$$$/JavaScripts/psx/Windows=Windows");

ZStrs.MacOS =
  localize("$$$/JavaScripts/psx/MacOS=MacOS");

ZStrs.Unix =
  localize("$$$/JavaScripts/psx/Unix=Unix");

ZStrs.CustomTextEditor =
  localize("$$$/JavaScripts/psx/CustomTextEditor=Custom Text Editor");

ZStrs.CreateCustomText =
  localize("$$$/JavaScripts/psx/CreateCustomText=Create Custom Text");

ZStrs.EditCustomText =
  localize("$$$/JavaScripts/psx/EditCustomText=Edit Custom Text");

ZStrs.DeleteCustomText =
  localize("$$$/JavaScripts/psx/DeleteCustomText=Delete Custom Text");

ZStrs.DeleteCustomTextPrompt =
  localize("$$$/JavaScripts/psx/DeleteCustomTextPrompt=Do you really want to remove %%s?");

ZStrs.CustomTextPrompt = 
  localize("$$$/JavaScripts/psx/CustomTextPrompt=Please enter the desired Custom Text: ");

ZStrs.Cancel = 
  localize("$$$/JavaScripts/psx/Cancel=Cancel");

ZStrs.Save = 
  localize("$$$/JavaScripts/psx/Save=Save");

ZStrs.UserCancelled = 
  localize("$$$/ScriptingSupport/Error/UserCancelled=User cancelled the operation");

// Units
ZStrs.UnitsPX = 
  localize("$$$/UnitSuffixes/Short/Px=px");

ZStrs.UnitsIN = 
  localize("$$$/UnitSuffixes/Short/In=in");

ZStrs.Units_IN = 
  localize("$$$/UnitSuffixes/Short/IN=in");

ZStrs.UnitsCM = 
  localize("$$$/UnitSuffixes/Short/Cm=cm");

ZStrs.Units_CM = 
  localize("$$$/UnitSuffixes/Short/CM=cm");

ZStrs.UnitsMM = 
  localize("$$$/UnitSuffixes/Short/MM=mm");

ZStrs.UnitsPercent = 
  localize("$$$/UnitSuffixes/Short/Percent=%");

ZStrs.UnitsPica = 
  localize("$$$/UnitSuffixes/Short/Pica=pica");

ZStrs.UnitsPT =
  localize("$$$/UnitSuffixes/Short/Pt=pt");

ZStrs.UnitsShortCM =
  localize("$$$/UnitSuffixes/Short/CM=cm");

ZStrs.UnitsShortIn =
  localize("$$$/UnitSuffixes/Short/In=in");

ZStrs.UnitsShortIN =
  localize("$$$/UnitSuffixes/Short/IN=in");

ZStrs.UnitsShortMM = 
  localize("$$$/UnitSuffixes/Short/MM=mm");

ZStrs.UnitsShortPercent = 
  localize("$$$/UnitSuffixes/Short/Percent=%");

ZStrs.UnitsShortPica = 
  localize("$$$/UnitSuffixes/Short/Pica=pica");

ZStrs.UnitsShortPT =
  localize("$$$/UnitSuffixes/Short/Pt=pt");

ZStrs.UnitsShortPx = 
  localize("$$$/UnitSuffixes/Short/Px=px");

ZStrs.UnitsShortMMs = 
  localize("$$$/UnitSuffixes/Short/MMs=mm");

ZStrs.UnitsShortPluralCMS =
  localize("$$$/UnitSuffixes/ShortPlural/CMS=cms");

ZStrs.UnitsShortPluralIns =
  localize("$$$/UnitSuffixes/ShortPlural/Ins=ins");

ZStrs.UnitsShortPluralPercent =
  localize("$$$/UnitSuffixes/ShortPlural/Percent=%");

ZStrs.UnitsShortPluralPicas =
  localize("$$$/UnitSuffixes/ShortPlural/Picas=picas");

ZStrs.UnitsShortPluralPts =
  localize("$$$/UnitSuffixes/ShortPlural/Pts=pts");

ZStrs.UnitsShortPluralPx =
  localize("$$$/UnitSuffixes/ShortPlural/Px=px");

ZStrs.UnitsVerboseCentimeter =
  localize("$$$/UnitSuffixes/Verbose/Centimeter=centimeter");

ZStrs.UnitsVerboseInch =
  localize("$$$/UnitSuffixes/Verbose/Inch=inch");

ZStrs.UnitsVerboseMillimeter =
  localize("$$$/UnitSuffixes/Verbose/Millimeter=millimeter");

ZStrs.UnitsVerbosePercent =
  localize("$$$/UnitSuffixes/Verbose/Percent=percent");

ZStrs.UnitsVerbosePica =
  localize("$$$/UnitSuffixes/Verbose/Pica=pica");

ZStrs.UnitsVerbosePixel =
  localize("$$$/UnitSuffixes/Verbose/Pixel=pixel");

ZStrs.UnitsVerbosePoint =
  localize("$$$/UnitSuffixes/Verbose/Point=point");

ZStrs.UnitsVerbosePluralCentimeters =
  localize("$$$/UnitSuffixes/VerbosePlural/Centimeters=Centimeters");

ZStrs.UnitsVerbosePluralInches =
  localize("$$$/UnitSuffixes/VerbosePlural/Inches=Inches");

ZStrs.UnitsVerbosePluralMillimeters =
  localize("$$$/UnitSuffixes/VerbosePlural/Millimeters=Millimeters");

ZStrs.UnitsVerbosePluralPercent =
  localize("$$$/UnitSuffixes/VerbosePlural/Percent=Percent");

ZStrs.UnitsVerbosePluralPicas =
  localize("$$$/UnitSuffixes/VerbosePlural/Picas=Picas");

ZStrs.UnitsVerbosePluralPixels =
  localize("$$$/UnitSuffixes/VerbosePlural/Pixels=Pixels");

ZStrs.UnitsVerbosePluralPoints =
  localize("$$$/UnitSuffixes/VerbosePlural/Points=Points");

ZStrs.FontLabel =
  localize("$$$/JavaScripts/psx/FontLabel=Font:");

ZStrs.FontTip =
  localize("$$$/JavaScripts/psx/FontTip=Select the font");

ZStrs.FontStyleTip =
  localize("$$$/JavaScripts/psx/FontStyleTip=Select the font style");

ZStrs.FontSizeTip =
  localize("$$$/JavaScripts/psx/FontSizeTip=Select the font size");


//
// Colors
//
ZStrs.black =
  localize("$$$/Actions/Enum/Black=black");
ZStrs.white =
  localize("$$$/Actions/Enum/White=white");
ZStrs.foreground =
  localize("$$$/JavaScripts/psx/Color/foreground=foreground");
ZStrs.background =
  localize("$$$/Actions/Enum/Background=background");
ZStrs.gray =
  localize("$$$/Actions/Enum/Gray=gray");
ZStrs.grey =
  localize("$$$/JavaScripts/psx/Color/grey=grey");
ZStrs.red =
  localize("$$$/Actions/Enum/Red=red");
ZStrs.green =
  localize("$$$/Actions/Enum/Green=green");
ZStrs.blue =
  localize("$$$/Actions/Enum/Blue=blue");

//
// Days of the week
//
ZStrs.Monday = 
  localize("$$$/JavaScripts/psx/Date/Monday=Monday");
ZStrs.Mon = 
  localize("$$$/JavaScripts/psx/Date/Mon=Mon");
ZStrs.Tuesday =
  localize("$$$/JavaScripts/psx/Date/Tuesday=Tuesday");
ZStrs.Tue =
  localize("$$$/JavaScripts/psx/Date/Tue=Tue");
ZStrs.Wednesday =
  localize("$$$/JavaScripts/psx/Date/Wednesday=Wednesday");
ZStrs.Wed =
  localize("$$$/JavaScripts/psx/Date/Wed=Wed");
ZStrs.Thursday =
  localize("$$$/JavaScripts/psx/Date/Thursday=Thursday");
ZStrs.Thu =
  localize("$$$/JavaScripts/psx/Date/Thu=Thu");
ZStrs.Friday =
  localize("$$$/JavaScripts/psx/Date/Friday=Friday");
ZStrs.Fri =
  localize("$$$/JavaScripts/psx/Date/Fri=Fri");
ZStrs.Saturday =
  localize("$$$/JavaScripts/psx/Date/Saturday=Saturday");
ZStrs.Sat =
  localize("$$$/JavaScripts/psx/Date/Sat=Sat");
ZStrs.Sunday =
  localize("$$$/JavaScripts/psx/Date/Sunday=Sunday");
ZStrs.Sun =
  localize("$$$/JavaScripts/psx/Date/Sun=Sun");


//
// Months
//
ZStrs.January =
  localize("$$$/JavaScripts/psx/Date/January=January");
ZStrs.Jan =
  localize("$$$/JavaScripts/psx/Date/Jan=Jan");
ZStrs.February =
  localize("$$$/JavaScripts/psx/Date/February=February");
ZStrs.Feb =
  localize("$$$/JavaScripts/psx/Date/Feb=Feb");
ZStrs.March =
  localize("$$$/JavaScripts/psx/Date/March=March");
ZStrs.Mar =
  localize("$$$/JavaScripts/psx/Date/Mar=Mar");
ZStrs.April =
  localize("$$$/JavaScripts/psx/Date/April=April");
ZStrs.Apr =
  localize("$$$/JavaScripts/psx/Date/Apr=Apr");
ZStrs.May =
  localize("$$$/JavaScripts/psx/Date/May=May");
ZStrs.June =
  localize("$$$/JavaScripts/psx/Date/June=June");
ZStrs.Jun =
  localize("$$$/JavaScripts/psx/Date/Jun=Jun");
ZStrs.July =
  localize("$$$/JavaScripts/psx/Date/July=July");
ZStrs.Jul =
  localize("$$$/JavaScripts/psx/Date/Jul=Jul");
ZStrs.August =
  localize("$$$/JavaScripts/psx/Date/August=August");
ZStrs.Aug =
  localize("$$$/JavaScripts/psx/Date/Aug=Aug");
ZStrs.September =
  localize("$$$/JavaScripts/psx/Date/September=September");
ZStrs.Sep =
  localize("$$$/JavaScripts/psx/Date/Sep=Sep");
ZStrs.October =
  localize("$$$/JavaScripts/psx/Date/October=October");
ZStrs.Oct =
  localize("$$$/JavaScripts/psx/Date/Oct=Oct");
ZStrs.November =
  localize("$$$/JavaScripts/psx/Date/November=November");
ZStrs.Nov =
  localize("$$$/JavaScripts/psx/Date/Nov=Nov");
ZStrs.December =
  localize("$$$/JavaScripts/psx/Date/December=December");
ZStrs.Dec =
  localize("$$$/JavaScripts/psx/Date/Dec=Dec");

ZStrs.AM =
  localize("$$$/JavaScripts/psx/Date/AM=AM");
ZStrs.PM =
  localize("$$$/JavaScripts/psx/Date/PM=PM");

//
// Color Profiles
//
ZStrs.ProfileAdobeRGB = 
  localize("$$$/Menu/Primaries/AdobeRGB1998=Adobe RGB (1998)");

ZStrs.ProfileAppleRGB = 
  localize("$$$/Actions/Enum/AppleRGB=Apple RGB");

ZStrs.ProfileProPhotoRGB = 
  localize("$$$/JavaScripts/ContactSheet2/Profile/ProPhotoRGB=ProPhoto RGB");

ZStrs.ProfileSRGB = 
  localize("$$$/JavaScripts/ContactSheet2/Profile/sRGB=sRGB IEC61966-2.1");

ZStrs.ProfileColorMatchRGB = 
  localize("$$$/Actions/Enum/ColorMatch=ColorMatch RGB");

ZStrs.ProfileWideGamutRGB = 
  localize("$$$/Actions/Enum/WideGamut=Wide Gamut RGB");

ZStrs.ProfileLab = 
  localize("$$$/Actions/Enum/Lab=Lab");

ZStrs.ProfileWorkingCMYK = 
  localize("$$$/Actions/Key/ColorSettings/WorkingCMYK=Working CMYK");

ZStrs.ProfileWorkingGray = 
  localize("$$$/Actions/Key/ColorSettings/WorkingGray=Working Gray");

ZStrs.ProfileWorkingRGB = 
  localize("$$$/Actions/Key/ColorSettings/WorkingRGB=Working RGB");

//
// Color Modes
//
ZStrs.CMYKMode =
  localize("$$$/Menu/ModePopup/CMYKColor=CMYK Color");

ZStrs.GrayscaleMode =
  localize("$$$/Menu/ModePopup/Grayscale=Grayscale");

ZStrs.LabMode =
  localize("$$$/Menu/ModePopup/LabColor=Lab Color");

ZStrs.RGBMode =
  localize("$$$/Menu/ModePopup/RGBColor=RGB Color");

//
// psx works as a namespace for commonly used functions
//
psx = function() {};

// If IOEXCEPTIONS_ENABLED is true, psx File I/O operations
// perform strict error checking and throw IO_ERROR_CODE exceptions
// when errors are detected
psx.IOEXCEPTIONS_ENABLED = true;

// Generic psx error number
psx.ERROR_CODE = 9001;

// File IO error number used by psx functions
psx.IO_ERROR_CODE = 9002;

//
// Convert a 4 byte number back to a 4 character ASCII string.
//
psx.numberToAscii = function(n) {
  if (isNaN(n)) {
    return n;
  }
  var str = (String.fromCharCode(n >> 24) +
             String.fromCharCode((n >> 16) & 0xFF) +
             String.fromCharCode((n >> 8) & 0xFF) +
             String.fromCharCode(n & 0xFF));

  return (psx.isAscii(str[0]) && psx.isAscii(str[1]) &&
          psx.isAscii(str[2]) && psx.isAscii(str[3])) ? str : n;
};

//
// Character types...
//
psx.ASCII_SPECIAL = "\r\n !\"#$%&'()*+,-./:;<=>?@[\]^_`{|}~";
psx.isSpecialChar = function(c) {
  return psx.ASCII_SPECIAL.contains(c[0]);
};
psx.isAscii = function(c) {
  return !!(c.match(/[\w\s]/) || psx.isSpecialChar(c));
};

//
// Define mappings between localized UnitValue type strings and strings
// acceptable to UnitValue constructors
//
psx._units = undefined;
psx._unitsInit = function() {
  if (!isPhotoshop()) {
    return;
  }
  psx._units = app.preferences.rulerUnits.toString();

  // map ruler units to localized strings
  psx._unitMap = {};
  psx._unitMap[Units.CM.toString()] =      ZStrs.UnitsCM;
  psx._unitMap[Units.INCHES.toString()] =  ZStrs.UnitsIN;
  psx._unitMap[Units.MM.toString()] =      ZStrs.UnitsMM;
  psx._unitMap[Units.PERCENT.toString()] = ZStrs.UnitsPercent;
  psx._unitMap[Units.PICAS.toString()] =   ZStrs.UnitsPica;
  psx._unitMap[Units.PIXELS.toString()] =  ZStrs.UnitsPX;
  psx._unitMap[Units.POINTS.toString()] =  ZStrs.UnitsPT;

  // since these are only used for construction UnitValue objects
  // don't bother with plural or verbose variants
  psx._unitStrMap = {};
  psx._reverseMap = {};

  function _addEntry(local, en) {
    psx._unitStrMap[local] = en;
    psx._unitStrMap[local.toLowerCase()] = en;
    psx._reverseMap[en.toLowerCase()] = local;
  }

  _addEntry(ZStrs.UnitsCM, "cm");
  _addEntry(ZStrs.UnitsShortCM, "cm");
  // _addEntry(ZStrs.UnitsShortPluralCMS, "cm");
  _addEntry(ZStrs.UnitsVerboseCentimeter, "centimeter");
  _addEntry(ZStrs.UnitsVerbosePluralCentimeters, "Centimeters");

  _addEntry(ZStrs.UnitsIN, "in");
  _addEntry(ZStrs.UnitsShortIN, "in");
  _addEntry(ZStrs.UnitsShortIn, "in");
  // _addEntry(ZStrs.UnitsShortPluralIns, "ins");
  _addEntry(ZStrs.UnitsVerboseInch, "inch");
  _addEntry(ZStrs.UnitsVerbosePluralInches, "Inches");

  _addEntry(ZStrs.UnitsMM, "mm");
  _addEntry(ZStrs.UnitsShortMM, "mm");
  // _addEntry(ZStrs.UnitsShortPluralMMs, "mm");
  _addEntry(ZStrs.UnitsVerboseMillimeter, "millimeter");
  _addEntry(ZStrs.UnitsVerbosePluralMillimeters, "Millimeters");

  _addEntry(ZStrs.UnitsPercent, "%");
  _addEntry(ZStrs.UnitsShortPercent, "%");
  _addEntry(ZStrs.UnitsShortPluralPercent, "%");
  _addEntry(ZStrs.UnitsVerbosePercent, "percent");
  _addEntry(ZStrs.UnitsVerbosePluralPercent, "Percent");

  _addEntry(ZStrs.UnitsPica, "pc");
  _addEntry(ZStrs.UnitsShortPica, "pc");
  _addEntry(ZStrs.UnitsShortPluralPicas, "picas");
  _addEntry(ZStrs.UnitsVerbosePica, "pica");
  _addEntry(ZStrs.UnitsVerbosePluralPicas, "Picas");

  _addEntry(ZStrs.UnitsPX, "px");
  _addEntry(ZStrs.UnitsShortPx, "px");
  _addEntry(ZStrs.UnitsShortPluralPx, "px");
  _addEntry(ZStrs.UnitsVerbosePixel, "pixel");
  _addEntry(ZStrs.UnitsVerbosePluralPixels, "Pixel");

  _addEntry(ZStrs.UnitsPT, "pt");
  _addEntry(ZStrs.UnitsShortPT, "pt");
  // _addEntry(ZStrs.UnitsShortPluralPts, "pt");
  _addEntry(ZStrs.UnitsVerbosePoint, "points");
  _addEntry(ZStrs.UnitsVerbosePluralPoints, "Points");
};
psx._unitsInit();


//
// Function: localizeUnitValue
// Description: Convert a UnitValue object to a localized string
// Input: un - UnitValue
// Return: a localized string
//
psx.localizeUnitValue = function(un) {
  var obj = {};
  obj.toString = function() {
    return this.value + ' ' + this.type;
  }
  obj.value = psx.localizeNumber(un.value);
  obj.type = un.type;

  var map = psx._unitStrMap;
  for (var idx in map) {
    if (un.type == map[idx]) {
      obj.type = idx;
      break;
    }
  }
  return obj;
};

//
// Function: localizeUnitType
// Description: Convert a UnitValue type string to a localized string
// Input: txt - UnitValue type string
// Return: a localized string
//
psx.localizeUnitType = function(txt) {
  var type = psx._reverseMap[txt.toLowerCase()];
  return type;
};

//
// Function: delocalizeUnitType
// Description: Convert a localized type to a UnitValue type string
// Input: txt - a localized type string
// Return: a UnitValue type string
//
psx.delocalizeUnitType = function(txt) {
  var type = psx._unitStrMap[txt.toLowerCase()];
  if (!type) {
    type = psx._unitStrMap[txt];
  }
  return type;
};


//
// Function: delocalizeUnitValue
// Description: Convert a localized UnitValue string into a UnitValue object
// Input: localized UnitValue string
// Return: a UnitValue object or undefined if there was a problem
//
psx.delocalizeUnitValue = function(str) {
  var un = undefined;
  var ar = str.split(/\s+/);
  if (ar.length == 2) {
    var n = psx.delocalizeNumber(ar[0]);
    var val = psx.delocalizeUnitType(ar[1]);
    un = UnitValue(n, val);
  } 
  return un;
};

//
// Function: getDefaultUnits
// Description: gets the default ruler units as localized string
// Input: <input>
// Return: the default ruler units as localized string
//
psx.getDefaultUnits = function() {
  return psx._unitMap[psx._units];
};

//
// Function: getDefaultUnitsString
// Description: Get the ruler unit default Unit type
// Input: <none>
// Return: the default ruler unit as a UnitValue type
//
psx.getDefaultUnitsString = function() {
  return psx._unitStrMap[psx._unitMap[psx._units]];
};
psx.getDefaultRulerUnitsString = psx.getDefaultUnitsString;

//
// Function: validateUnitValue
// Description: Convert string to a UnitValue object
// Input: str - the string to be converted
//        bu  - the base UnitValue to use for conversion (opt)
//        ru  - the Unit type to use if one is not specified (opt)
//
// If bu is a Document, ru is set to the docs type and the
// docs resolution is used to determine the base UnitValue
//
// If ru is not specified, the default ruler unit type is used.
//
// If bu is not specified, a resolution of 1/72 is used.
//
// Note: this does not handle localized Unit value strings
//
// Return: A UnitValue object or undefined if it's not a valid string
//
psx.validateUnitValue = function(str, bu, ru) {
  var self = this;

  if (str instanceof UnitValue) {
    return str;
  }

  if (bu && bu instanceof Document) {
    var doc = bu;
    ru = doc.width.type;
    bu = UnitValue(1/doc.resolution, ru);

  } else {
    if (!ru) {
      ru = psx.getDefaultRulerUnitsString();
    }
    if (!bu) {
      UnitValue.baseUnit = UnitValue(1/72, ru);
    }
  }
  str = str.toString().toLowerCase();

  var zero = new UnitValue("0 " + ru);
  var un = zero;
  if (!str.match(/[a-z%]+/)) {
    str += ' ' + ru.units;
  }
  str = psx.delocalizeNumber(s);
  un = new UnitValue(str);

  if (isNaN(un.value) || un.type == '?') {
    return undefined;
  }

  if (un.value == 0) {
    un = zero;
  }

  return un;
};


//
// Function: doEvent
// Description: Invoke a Photoshop Event with no arguments
// Input:  doc - the target document (opt: undefined)
//         eid - the event ID
//         interactive - do we run the event interactively (opt: true)
//         noDesc - do we pass in an empty descriptor (opt: true)
// Return: the result descriptor
//
psx.doEvent = function(doc, eid, interactive, noDesc) {
  var id;

  if (doc != undefined && eid == undefined) {
    if (doc.constructor == Number) {
      eid = doc.valueOf();
    } else if (doc.constructor == String) {
      eid = doc;
    }
    doc = undefined;
  }

  if (!eid) {
    Error.runtimeError(8600); // Event key is missing "No event id specified");
  }

  if (eid.constructor != Number) {
    if (eid.length < 4) {
      // "Event id must be at least 4 characters long"
      Error.runtimeError(19, "eventID");
    }

    if (eid.length == 4) {
      id = cTID(eid);
    } else {
      id = sTID(eid);
    }
  } else {
    id  = eid;
  }

  interactive = (interactive == true);
  noDesc = (noDesc == true);

  function _ftn(id) {
    var dmode = (interactive ? DialogModes.ALL : DialogModes.NO);
    var desc = (noDesc ? undefined : new ActionDescriptor());
    return app.executeAction(id, desc, dmode);
  }

  return _ftn(id);
};


//
// Function: hist
// Description: Move back and forth through the history stack.
// Input: dir - "Prvs" or "Nxt "
// Return: <none>
//
psx.hist = function(dir) {
  function _ftn() {
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putEnumerated(cTID("HstS"), cTID("Ordn"), cTID(dir));
    desc.putReference(cTID("null"), ref);
    executeAction(cTID("slct"), desc, DialogModes.NO);
  }

  _ftn();
};

//
// Function: back
// Description: Move back through the history stack.
// Input: <none>
// Return: <none>
//
psx.undo = function () {
  psx.hist("Prvs");
};
//
// Function: redo
// Description: Move forward through the history stack.
// Input: <none>
// Return: <none>
//
psx.redo = function () {
  psx.hist("Nxt ");
};
//
// Function: Undo
// Description: Do an "Undo"
// Input: <none>
// Return: <none>
//
psx.Undo = function () {
  psx.doEvent("undo");
};
//
// Function: Redo
// Description: do a Redo
// Input: <none>
// Return: <none>
//
psx.Redo = function () {
  psx.doEvent(sTID('redo'));
};


//
// Function: delocalizeColorMode
// Description: Convert a localized mode string into a non-localized string.
//   This is useful for constructing API constants.
//   ex:
//     var mode = psx.delocalizeColorMode(ZStrs.LabMode);
//     doc.changeMode(eval("ChangeMode." + mode));
//   ex:
//     var mode = psx.delocalizeColorMode(ZStrs.LabMode);
//     var doc = Documents.add(UnitValue("6 in"), UnitValue("4 in"),
//                             300, "NoName", eval("NewDocumentMode." + mode));
// Input: a localized color mode string
// Return: a delocalized color mode string
//
psx.delocalizeColorMode = function(str) {
  var mode = str;

  switch (str) {
    case ZStrs.RGBMode:       mode = "RGB"; break;
    case ZStrs.CMYKMode:      mode = "CMYK"; break;
    case ZStrs.LabMode:       mode = "Lab"; break;
    case ZStrs.GrayscaleMode: mode = "Grayscale"; break;
  }

  return mode;
};

//=========================== PS Paths =============================

//
// Some PS folder constants
//
// need to break up the ZString prefix to avoid
// the ZString harvester because the ZString definition changed
// in CS6
//
psx.PRESETS_FOLDER =
  new Folder(app.path + '/' +
             localize('$' + '$' + '$' + '/' +
                      (isCS6() ? "private/" : "") +
                      "ApplicationPresetsFolder/Presets=Presets"));

psx.SCRIPTS_FOLDER =
  new Folder(app.path + '/' + ZStrs.InstalledScripts);

psx.USER_PRESETS_FOLDER =
  new Folder(Folder.userData + '/' +
             localize("$$$/private/AdobeSystemFolder/Adobe=Adobe") + '/' +
             localize("$$$/private/FolderNames/AdobePhotoshopProductVersionFolder") + '/' +
             localize("$$$/private/FolderName/UserPresetsFolder/Presets=Presets"));


//======================= File functions ===========================

//
// Function: fileError
// Description: Format a standard File/Folder error string
// Input: f - File
//        msg - an error message (opt: '')
// Return: an File I/O error string
//
psx.fileError = function(f, msg) {
 return (ZStrs.FileErrorStr + (msg || '') + " \"" + decodeURI(f) +
         "\": " +  f.error + '.');
};

//
// Function: convertFptr
// Description: convert something into a File/Folder object
// Input: fptr - a String, XML object, or existing File/Folder object
// Return: a File/Folder object
//
psx.convertFptr = function(fptr) {
  var f;
  try { if (fptr instanceof XML) fptr = fptr.toString(); } catch (e) {}

  if (fptr.constructor == String) {
    f = File(fptr);

  } else if (fptr instanceof File || fptr instanceof Folder) {
    f = fptr;

  } else {
    Error.runtimeError(19, "fptr");
  }
  return f;
};

//
// Function: writeToFile
// Description: Open a file, write a string into it, then close it
// Input: fptr - a file reference
//        str - a String
//        encoding - the encoding (opt)
//        lineFeed - the lineFeed (opt) 
// Return: <none>
//
psx.writeToFile = function(fptr, str, encoding, lineFeed) {
  var xfile = psx.convertFptr(fptr);
  var rc;

  if (encoding) {
    xfile.encoding = encoding;
  }

  rc = xfile.open("w");
  if (!rc) {
    Error.runtimeError(psx.IO_ERROR_CODE,
                       psx.fileError(xfile, ZStrs.UnableToOpenOutputFile));
  }

  if (lineFeed) {
    xfile.lineFeed = lineFeed;
  }

  rc = xfile.write(str);
  if (!rc && psx.IOEXCEPTIONS_ENABLED) {
    Error.runtimeError(psx.IO_ERROR_CODE, ZStrs.fileError(xfile));
  }

  rc = xfile.close();
  if (!rc && psx.IOEXCEPTIONS_ENABLED) {
    Error.runtimeError(psx.IO_ERROR_CODE, ZStrs.fileError(xfile));
  }
};

//
// Function: readFromFile
// Description: Read the entire contents of a file as a string
// Input:  fptr - a file reference
//         encoding - the encoding (opt) 
//         lineFeed - the lineFeed (opt) 
// Returns: a String
// Note: there are some subtleties involved in handling
// some character conversions errors
//
psx.readFromFile = function(fptr, encoding, lineFeed) {
  var file = psx.convertFptr(fptr);
  var rc;

  rc = file.open("r");
  if (!rc) {
    Error.runtimeError(psx.IO_ERROR_CODE,
                       psx.fileError(file, ZStrs.UnableToOpenInputFile));
  }
  if (encoding) {
    file.encoding = encoding;
  }
  if (lineFeed) {
    file.lineFeed = lineFeed;
  }
  var str = file.read();

  // In some situations, read() will set the file.error to
  // 'Character conversion error' but read the file anyway
  // In other situations it won't read anything at all from the file
  // we ignore the error if we were able to read the file anyway
  if (str.length == 0 && file.length != 0) {
    if (!file.error) {
      file.error = ZStrs.CharacterConversionError;
    }
    if (psx.IOEXCEPTIONS_ENABLED) {
      Error.runtimeError(psx.IO_ERROR_CODE, psx.fileError(file));
    }
  } else {
    // if (file.error) {
    //   Error.runtimeError(psx.IO_ERROR_CODE, psx.fileError(file));
    // }
  }

  rc = file.close();
  if (!rc && psx.IOEXCEPTIONS_ENABLED) {
    Error.runtimeError(psx.IO_ERROR_CODE, psx.fileError(file));
  }

  return str;
};


//
// Function: readXMLFile
// Description: Reads a text file and returns an XML object.
//              psx assumes UTF8 with \n
// Input:  fptr - a reference to a file
// Return: an XML object
//
psx.readXMLFile = function(fptr) {
  var rc;
  var file = psx.convertFptr(fptr);
  if (!file.exists) {
    Error.runtimeError(48); // File/Folder does not exist
  }

  // Always work with UTF8/unix
  file.encoding = "UTF8";
  file.lineFeed = "unix";

  rc = file.open("r", "TEXT", "????");
  if (!rc && psx.IOEXCEPTIONS_ENABLED) {
    Error.runtimeError(psx.IO_ERROR_CODE, psx.fileError(file));
  }

  var str = file.read();
  // Need additional error checking here...

  rc = file.close();
  if (!rc && psx.IOEXCEPTIONS_ENABLED) {
    Error.runtimeError(psx.IO_ERROR_CODE, psx.fileError(file));
  }

  return new XML(str);
};

//
// Function: writeXMLFile
// Description: Writes an XML object to a file
//              psx uses UTF8 with \n
// Input:  fptr - a file reference
//         xml - an XML object
// Return: a File object
//
psx.writeXMLFile = function(fptr, xml) {
  var rc;
  if (!(xml instanceof XML)) {
    Error.runtimeError(19, "xml"); // "Bad XML parameter";
  }

  var file = psx.convertFptr(fptr);

  // Always work with UTF8/unix
  file.encoding = "UTF8";

  rc = file.open("w", "TEXT", "????");
  if (!rc && psx.IOEXCEPTIONS_ENABLED) {
    Error.runtimeError(psx.IO_ERROR_CODE, psx.fileError(file));
  }

  // file.write("\uFEFF");
  // unicode signature, this is UTF16 but will convert to UTF8 "EF BB BF"
  // optional and not used since it confuses most programming editors
  // and command line tools

  file.lineFeed = "unix";

  file.writeln('<?xml version="1.0" encoding="utf-8"?>');

  rc = file.write(xml.toXMLString());
  if (!rc && psx.IOEXCEPTIONS_ENABLED) {
    Error.runtimeError(psx.IO_ERROR_CODE, psx.fileError(file));
  }

  rc = file.close();
  if (!rc && psx.IOEXCEPTIONS_ENABLED) {
    Error.runtimeError(psx.IO_ERROR_CODE, psx.fileError(file));
  }

  return file;
};


//
// Function: psx.createFileSelect
// Description: File 'open' functions take a string of the format
//              "JPEG Files: *.jpg" on Windows and a function on
//              OS X. This function takes a Windows-style select string
//              a returns the OS X select-function on Mac.
//   ex:
//     var sel = psx.createFileSelect("XML Files: *.xml");
//     var file = psx.selectFileOpen(promptStr, sel, Folder.desktop);
// Input:  str - a Windows-style select string
// Return: The orignal select-string on Windows, or a select-function
//         for the select-string on OS X
//
psx.createFileSelect = function(str) {
  if (isWindows()) {
    return str;
  }

  if (!str.constructor == String) {
    return str;
  }

  var exts = [];
  var rex = /\*\.(\*|[\w]+)(.*)/;
  var m;
  while (m = rex.exec(str)) {
    exts.push(m[1].toLowerCase());
    str = m[2];
  }

  function macSelect(f) {
    var name = decodeURI(f.absoluteURI).toLowerCase();
    var _exts = macSelect.exts;

    // alert(name);

    while (f.alias) {
      try {
        f = f.resolve();
      } catch (e) {
        f = null;
      }

      if (f == null) {
        return false;
      }
    }

    if (f instanceof Folder) {
      return true;
    }

    for (var i = 0; i < _exts.length; i++) {
      var ext = _exts[i];
      if (ext == '.*') {
        return true;
      }
      if (name.match(RegExp("\\." + ext + "$", "i")) != null) {
        return true;
      }
    }
    return false;
  }

  macSelect.exts = exts;
  return macSelect;
};

//
// Function: selectFileOpen, selectFileSave
// Description: Open a dialog to prompt the user to select a file.
//              An initial file or folder can optionally be specified
//              Change the current directory reference if we it
//              seems appropriate.
//    ex: var file = psx.selectFileOpen("Choose a file to open",
//                                      "JPEG Files: *.jpg", "/c/tmp")
//    ex: var file = psx.selectFileSave("Choose a file to save",
//                                      "JPEG Files: *.jpg",
//                                      File("/c/tmp/tmp.jpg"))
// Input:  prompt - a prompt for the dialog (opt)
//         select - a select-string (opt)
//         start  - the initial directory
// Return: a File or undefined if the user canceled
//
psx.selectFileOpen = function(prompt, select, start) {
  return psx._selectFile(prompt, select, start, true);
};
psx.selectFileSave = function(prompt, select, start) {
  return psx._selectFile(prompt, select, start, false);
};
psx.selectFile = psx.selectFileOpen;

psx._selectFile = function(prompt, select, start, open) {
  var file;

  if (!prompt) {
    prompt = ZStrs.SelectFile;
  }

  if (start) {
    start = psx.convertFptr(start);
  } else {
    start = Folder.desktop;
  }

  var classFtn = (open ? File.openDialog : File.saveDialog);

  if (!start) {
    file = classFtn(prompt, select);

  } else {
    if (start instanceof Folder) {
      while (start && !start.exists) {
        start = start.parent;
      }

      var files = start.getFiles(select);
      if (!files || files.length == 0) {
        files = start.getFiles();
      }
      for (var i = 0; i < files.length; i++) {
        if (files[i] instanceof File) {
          start = files[i];
          break;
        }
      }
      if (start instanceof Folder) {
        start = new File(start + "/file");
      }
    }

    while (true) {
      if (start instanceof File) {
        var instanceFtn = (open ? "openDlg" : "saveDlg");
        file = start[instanceFtn](prompt, select);

      } else {
        file = Folder.selectDialog(prompt);
      }

      if (open && file && !file.exists) {
        continue;
      }

      break;
    }
  }

  if (file) {
    Folder.current = file.parent;
  }

  return file;
};

//
// Function: selectFolder
// Description: Open a dialog to select a folder
// Input:  prompt - (opt: "Select a Folder")
//         start - the initial folder
// Return: a Folder object or undefined if the user canceled
//
psx.selectFolder = function(prompt, start) {
  var folder;

  if (!prompt) {
    prompt = ZStrs.SelectFolder;
  }

  if (start) {
    start = psx.convertFptr(start);
    while (start && !start.exists) {
      start = start.parent;
    }
  }

  if (!start) {
    folder = Folder.selectDialog(prompt);

  } else {
    if (start instanceof File) {
      start = start.parent;
    }

    folder = start.selectDlg(prompt);
  }

  return folder;
};

//
// Function: getFiles
// Description: Get a set of files from a folder
// Input:  folder - a Folder
//         mask - a file mask pattern or RegExp (opt: undefined)
// Return: an array of Files
//
psx.getFiles = function(folder, mask) {
  var files = [];

  folder = psx.convertFptr(folder);

  if (folder.alias) {
    folder = folder.resolve();
  }

  return folder.getFiles(mask);
};

//
// Function: getFolders
// Description: Get a set of folders from a folder
// Input:  folder - a Folder
// Return: an array of Folders
//
psx.getFolders = function(folder) {
  folder = psx.convertFptr(folder);

  if (folder.alias) {
    folder = folder.resolve();
  }
  var folders = psx.getFiles(folder,
                             function(f) { return f instanceof Folder; });
  return folders;
};

//
// Function: findFiles
// Description: Find a set of files from a folder recursively
// Input:  folder - a Folder
//         mask - a file mask pattern or RegExp (opt: undefined)
// Return: an array of Files
//
psx.findFiles = function(folder, mask) {
  folder = psx.convertFptr(folder);

  if (folder.alias) {
    folder = folder.resolve();
  }
  var files = psx.getFiles(folder, mask);
  var folders = psx.getFolders(folder);

  for (var i = 0; i < folders.length; i++) {
    var f = folders[i];
    var ffs = psx.findFiles(f, mask);
    // files.concat(ffs); This occasionally fails for some unknown reason (aka
    // interpreter Bug) so we do it manually instead
    while (ffs.length > 0) {
      files.push(ffs.shift());
    }
  }
  return files;
};

//
// Function: exceptionMessage
// Description: create a useful error message based on an exception
// Input: e - an Exception
// Return: a String
//
// Thanks to Bob Stucky for this...
//
psx.exceptionMessage = function(e) {
  var str = '';
  var fname = (!e.fileName ? '???' : decodeURI(e.fileName));
  str += "   Message: " + e.message + '\n';
  str += "   File: " + fname + '\n';
  str += "   Line: " + (e.line || '???') + '\n';
  str += "   Error Name: " + e.name + '\n';
  str += "   Error Number: " + e.number + '\n';

  if (e.source) {
    var srcArray = e.source.split("\n");
    var a = e.line - 10;
    var b = e.line + 10;
    var c = e.line - 1;
    if (a < 0) {
      a = 0;
    }
    if (b > srcArray.length) {
      b = srcArray.length;
    }
    for ( var i = a; i < b; i++ ) {
      if ( i == c ) {
        str += "   Line: (" + (i + 1) + ") >> " + srcArray[i] + '\n';
      } else {
        str += "   Line: (" + (i + 1) + ")    " + srcArray[i] + '\n';
      }
    }
  }

  try {
    if ($.stack) {
      str += '\n' + $.stack + '\n';
    }
  } catch (e) {
  }

  if (str.length > psx.exceptionMessage._maxMsgLen) {
    str = str.substring(0, psx.exceptionMessage._maxMsgLen) + '...';
  }

  if (LogFile.defaultLog.fptr) {
    str += "\nLog File:" + LogFile.defaultLog.fptr.toUIString();
  }

  return str;
};
psx.exceptionMessage._maxMsgLen = 5000;

//============================ LogFile =================================

//
// Class: LogFile
// Description: provides a interface for logging information
// Input: fname - a file name
//
LogFile = function(fname) {
  var self = this;
  
  self.filename = fname;
  self.enabled = fname != undefined;
  self.encoding = "UTF8";
  self.append = false;
  self.fptr = undefined;
};

//
// Function: LogFile.setFilename
// Description: set the name of the log file. The log file is
//              enabled if a filename is passed in.
// Input: filename - the log filename or undefined
//        encoding - the file encoding (opt: "UTF8")
// Return: <none>
//
LogFile.prototype.setFilename = function(filename, encoding) {
  var self = this;
  self.filename = filename;
  self.enabled = filename != undefined;
  self.encoding = encoding || "UTF8";
  self.fptr = undefined;
};

//
// Function LogFile.write
// Description: Writes a string to a log file if the log is enabled
//              and it has a valid filename. The log file is opened
//              and closed for each write in order to flush the
//              message to disk.
// Input: msg - a message for the log file
// Return: <none>
//
LogFile.prototype.write = function(msg) {
  var self = this;
  var file;

  if (!self.enabled) {
    return;
  }

  if (!self.filename) {
    return;
  }

  if (!self.fptr) {
    file = new File(self.filename);
    if (self.append && file.exists) {
      if (!file.open("e", "TEXT", "????"))  {
        var err = ZStrs.UnableToOpenLogFile.sprintf(file.toUIString(),
                                                    file.error);
        Error.runtimeError(psx.IO_ERROR_CODE, err);
      }
      file.seek(0, 2); // jump to the end of the file

    } else {
      if (!file.open("w", "TEXT", "????")) {
        if (!file.open("e", "TEXT", "????")) {
          var err = ZStrs.UnableToOpenLogFile.sprintf(file.toUIString(),
                                                      file.error);
          Error.runtimeError(psx.IO_ERROR_CODE, err);
        }
        file.seek(0, 0); // jump to the beginning of the file
      }
    }
    self.fptr = file;

  } else {
    file = self.fptr;
    if (!file.open("e", "TEXT", "????"))  {
      var err = ZStrs.UnableToOpenLogFile.sprintf(file.toUIString(),
                                                  file.error);
      Error.runtimeError(psx.IO_ERROR_CODE, err);
    }
    file.seek(0, 2); // jump to the end of the file
  }

  if (isMac()) {
    file.lineFeed = "Unix";
  }

  if (self.encoding) {
    file.encoding = self.encoding;
  }

  if (msg) {
    msg = msg.toString();
  }

  if (!file.writeln(new Date().toISODateString() + " - " + msg)) {
    var err = ZStrs.UnableToOpenLogFile.sprintf(file.toUIString(),
                                                file.error);
    Error.runtimeError(psx.IO_ERROR_CODE, err);
  }

  file.close();
};

//
// Function: LogFile.defaultLog 
// Description: This is the default log file
//
LogFile.defaultLog = new LogFile(Folder.userData + "/stdout.log");

//
// Function: LogFile.setFilename
// Description: sets the name of the default log file
// Input:  fptr - a file name
//         encoding - the encoding for the file (opt)
// Return: <none>
//
LogFile.setFilename = function(fptr, encoding) {
  LogFile.defaultLog.setFilename(fptr, encoding);
};

//
// Function: LogFile.write
// Description: write a message to the default log file
// Input:  msg - a message for the log file
// Return: <none>
//
LogFile.write = function(msg) {
  LogFile.defaultLog.write(msg);
};

//
// Function: LogFile.logException
// Description: log a formatted message based on an exception
// Input:  e - an Exception
//         msg - a message for the log file (opt)
//         doAlert - open an alert with the formatted message (opt: false)
// Return: <none>
//
LogFile.logException = function(e, msg, doAlert) {
  var log = LogFile.defaultLog;
  if (!log || !log.enabled) {
    return;
  }

  if (doAlert == undefined) {
    doAlert = false;

    if (msg == undefined) {
      msg = '';
    } else if (isBoolean(msg)) {
      doAlert = msg;
      msg = '';
    }
  }

  doAlert = !!doAlert;

  var str = ((msg || '') + "\n" +
             "==============Exception==============\n" +
             psx.exceptionMessage(e) +
             "\n==============End Exception==============\n");

  log.write(str);

  if (doAlert) {
    str += ("\r\r" + ZStrs.LogFileReferences + "\r" +
            "    " + log.fptr.toUIString());

    alert(str);
  }
};

//
// Function: toBoolean
// Description: convert something to a boolean
// Input:  s - the thing to convert
// Return: a boolean
//
function toBoolean(s) {
  if (s == undefined) { return false; }
  if (s.constructor == Boolean) { return s.valueOf(); }
  try { if (s instanceof XML) s = s.toString(); } catch (e) {}
  if (s.constructor == String)  { return s.toLowerCase() == "true"; }

  return Boolean(s);
};

//
// Function: isBoolean
// Description: determine if something is a boolean
// Input:  s - the thing to test
// Return: true if s is boolean, false if not
//
function isBoolean(s) {
  return (s != undefined && s.constructor == Boolean);
};

//
// Description: Should the PS locale be used to determine the
//              decimal point or should the OS locale be used.
//              PS uses the OS locale so scripts may not match
//              the PS UI.
//
psx.USE_PS_LOCALE_FOR_DECIMAL_PT = true;

// 
// Function: determineDecimalPoint
// Description: determine what to use for the decimal point
// Input:  <none>
// Return: a locale-specific decimal point
//
// Note: Currently there is no way to determine what decimal
//       point is being used in the PS UI so this always returns
//       the decimal point for the PS locale
//
psx.determineDecimalPoint = function() {
//   if (psx.USE_PS_LOCALE_FOR_DECIMAL_PT) {
    psx.decimalPoint = $.decimalPoint;
//   }
  return psx.decimalPoint;
};
psx.determineDecimalPoint();

//
// Function: localizeNumber
// Description: convert a number to a string with a localized decimal point
// Input: n - a number or UnitValue
// Return: a number as a localized string
//
psx.localizeNumber = function(n) {
  return n.toString().replace('.', psx.decimalPoint);
};

//
// Function: delocalizeNumber
// Description: convert a string containing a localized number to
//              a "standard" number string
// Input:  a localized numeric string
// Return: a numeric string with a EN decimal point
//
psx.delocalizeNumber = function(n) {
  return n.toString().replace(psx.decimalPoint, '.');
};


//
// Function: toNumber
// Description: convert a something to a number
// Input: s - some representation of a number
//        def - a value to use if s cannot be parsed
// Return: a number or NaN if there was a problem and no default was specified
//
function toNumber(s, def) {
  if (s == undefined) { return def || NaN; }
  try { if (s instanceof XML) s = s.toString(); } catch (e) {}
  if (s.constructor == String && s.length == 0) { return def || NaN; }
  if (s.constructor == Number) { return s.valueOf(); }
  try {
    var n = Number(psx.delocalizeNumber(s.toString()));
  } catch (e) {
    // $.level = 1; debugger;
  }
  return (isNaN(n) ? (def || NaN) : n);
};

//
// Function: isNumber
// Description: see if something is a number
// Input: s - some representation of a number
//        def - a value to use if s cannot be parsed
// Return: true if s is a number, false if not
//
function isNumber(s) {
  try { if (s instanceof XML) s = s.toString(); }
  catch (e) {}
  return !isNaN(psx.delocalizeNumber(s));
};

//
// Function: isNumber
// Description: see if something is a String
// Input: s - something
// Return: true if s is a String, false if not
//
function isString(s) {
  return (s != undefined && s.constructor == String);
};

//
// Function: toFont
// Description: convert something to a font name
// Input: fs - a TextFont or a string
// Return: a font name that can be used with TextItem.font
//
function toFont(fs) {
  if (fs.typename == "TextFont") { return fs.postScriptName; }

  var str = fs.toString();
  var f = psx.determineFont(str);  // first, check by PS name

  return (f ? f.postScriptName : undefined);
};

// 
// Function: getXMLValue
// Description: returns the value of an xml object as a string if it
//              is not undefined else it returns a default value
// Input: xml - an XML object
//        def - a default value (opt: undefined)
// Return: a String or undefined
//
psx.getXMLValue = function(xml, def) {
  return (xml == undefined) ? def : xml.toString();
}

// 
// Function: getByName
// Description: Get an element in the container with a desired name property
// Input: container - an Array or something with a [] interface
//        value - the name of the element being sought
//        all - get all elements with the given name
// Return: an object, array of objects, or undefined
//
psx.getByName = function(container, value, all) {
  return psx.getByProperty(container, "name", value, all);
};

// 
// Function: getByProperty
// Description: Get an element in the container with a desired property
// Input: container - an Array or something with a [] interface
//        prop - the name of the property
//        value - the value of the property of the element being sought
//        all - get all elements that match
// Return: an object, array of objects, or undefined
//
psx.getByProperty = function(container, prop, value, all) {
  // check for a bad index
  if (prop == undefined) {
    Error.runtimeError(2, "prop");
  }
  if (value == undefined) {
    Error.runtimeError(2, "value");
  }
  var matchFtn;

  all = !!all;

  if (value instanceof RegExp) {
    matchFtn = function(s1, re) { return s1.match(re) != null; };
  } else {
    matchFtn = function(s1, s2) { return s1 == s2; };
  }

  var obj = [];

  for (var i = 0; i < container.length; i++) {
    if (matchFtn(container[i][prop], value)) {
      if (!all) {
        return container[i];     // there can be only one!
      }
      obj.push(container[i]);    // add it to the list
    }
  }

  return all ? obj : undefined;
};

//
// Function: determineFont
// Description: find a font based on a name
// Input: str - a font name or postScriptName
// Return: a TextFont or undefined
//
psx.determineFont = function(str) {
  return (psx.getByName(app.fonts, str) ||
          psx.getByProperty(app.fonts, 'postScriptName', str));
};

//
// Function: getDefaultFont
// Description: Attempt to find a resonable locale-specific font
// Input:  <none>
// Return: TextFont or undefined
//
psx.getDefaultFont = function() {
  var str;

  if (isMac()) {
    str = localize("$$$/Project/Effects/Icon/Font/Name/Mac=Lucida Grande");
  } else {
    str = localize("$$$/Project/Effects/Icon/Font/Name/Win=Tahoma");
  }

  var font = psx.determineFont(str);

  if (!font) {
    var f = psx.getApplicationProperty(sTID('fontLargeName'));
    if (f != undefined) {
      font = psx.determineFont(f);
    }
  }

  return font;
};

// 
// Function: psx.getDefaultTypeToolFont
// Description: This attemps gets the default Type Tool font. Since there is no
//         direct API for this, we have to save the current type tool settings,
//         reset the settings, then restore the saved settings.
//         This will fail if there already exists a tool preset called
//         "__temp__". Working around this shortcoming would make things even
//         more complex than they already are
// Input:  <none>
// Return: TextFont or undefined
//
psx.getDefaultTypeToolFont = function() {
  var str = undefined;
  var typeTool = "typeCreateOrEditTool";

  try {
    // get the current tool
    var ref = new ActionReference();
    ref.putEnumerated(cTID("capp"), cTID("Ordn"), cTID("Trgt") );
    var desc = executeActionGet(ref);
    var tid = desc.getEnumerationType(sTID('tool'));
    var currentTool = typeIDToStringID(tid);

    // switch to the type tool
    if (currentTool != typeTool) {
      var desc = new ActionDescriptor();
      var ref = new ActionReference();
      ref.putClass(sTID(typeTool));
      desc.putReference(cTID('null'), ref);
      executeAction(cTID('slct'), desc, DialogModes.NO);
    }

    var ref = new ActionReference();
    ref.putEnumerated(cTID("capp"), cTID("Ordn"), cTID("Trgt") );
    var desc = executeActionGet(ref);
    var tdesc = desc.hasKey(cTID('CrnT')) ?
      desc.getObjectValue(cTID('CrnT')) : undefined;

    if (tdesc) {
      // save the current type tool settings
      var desc4 = new ActionDescriptor();
      var ref4 = new ActionReference();
      ref4.putClass( sTID('toolPreset') );
      desc4.putReference( cTID('null'), ref4 );
      var ref5 = new ActionReference();
      ref5.putProperty( cTID('Prpr'), cTID('CrnT') );
      ref5.putEnumerated( cTID('capp'), cTID('Ordn'), cTID('Trgt') );
      desc4.putReference( cTID('Usng'), ref5 );
      desc4.putString( cTID('Nm  '), "__temp__" );

      // this will fail if there is already a preset called __temp__
      executeAction( cTID('Mk  '), desc4, DialogModes.NO );

      // reset the type tool
      var desc2 = new ActionDescriptor();
      var ref2 = new ActionReference();
      ref2.putProperty( cTID('Prpr'), cTID('CrnT') );
      ref2.putEnumerated( cTID('capp'), cTID('Ordn'), cTID('Trgt') );
      desc2.putReference( cTID('null'), ref2 );
      executeAction( cTID('Rset'), desc2, DialogModes.NO );

      // get the current type tool settings
      var ref = new ActionReference();
      ref.putEnumerated(cTID("capp"), cTID("Ordn"), cTID("Trgt") );
      var desc = executeActionGet(ref);
      var tdesc = desc.getObjectValue(cTID('CrnT'));

      // get the default type tool font
      var charOpts = tdesc.getObjectValue(sTID("textToolCharacterOptions"));
      var styleOpts = charOpts.getObjectValue(cTID("TxtS"));
      str = styleOpts.getString(sTID("fontPostScriptName"));

      // restore the type tool settings
      var desc9 = new ActionDescriptor();
      var ref10 = new ActionReference();
      ref10.putName( sTID('toolPreset'), "__temp__" );
      desc9.putReference( cTID('null'), ref10 );
      executeAction( cTID('slct'), desc9, DialogModes.NO );

      // delete the temp setting
      var desc11 = new ActionDescriptor();
      var ref12 = new ActionReference();
      ref12.putEnumerated( sTID('toolPreset'), cTID('Ordn'), cTID('Trgt') );
      desc11.putReference( cTID('null'), ref12 );
      executeAction( cTID('Dlt '), desc11, DialogModes.NO );
    }

    // switch back to the original tool
    if (currentTool != typeTool) {
      var desc = new ActionDescriptor();
      var ref = new ActionReference();
      ref.putClass(tid);
      desc.putReference(cTID('null'), ref);
      executeAction(cTID('slct'), desc, DialogModes.NO);
    }
  } catch (e) {
    return undefined;
  }

  return str;
};

//
// Function: trim
// Description: Trim leading and trailing whitepace from a string
// Input: value - String
// Return: String
//
psx.trim = function(value) {
   return value.replace(/^[\s]+|[\s]+$/g, '');
};


//
// Function: copyFromTo
// Description: copy the properties from one object to another. functions
//              and 'typename' are skipped
// Input: from - object
//        to - Object
// Return: <none>
//
psx.copyFromTo = function(from, to) {
  if (!from || !to) {
    return;
  }
  for (var idx in from) {
    var v = from[idx];
    if (typeof v == 'function') {
      continue;
    }
    if (v == 'typename'){
      continue;
    }

    to[idx] = v;
  }
};

//
// Function: listProps
// Description: create a string with name-value pairs for each property
//              in an object. Functions are skipped.
// Input: obj - object
// Return: String
//
psx.listProps = function(obj) {
  var s = [];
  var sep = (isBridge() ? "\r" : "\r\n");

  for (var x in obj) {
    var str = x + ":\t";
    try {
      var o = obj[x];
      str += (typeof o == "function") ? "[function]" : o;
    } catch (e) {
    }
    s.push(str);
  }
  s.sort();

  return s.join(sep);
};


//
//============================ Strings  Extensions ===========================
//

//
// Function: String.contains
// Description: Determines if a string contains a substring
// Input: sub - a string
// Return: true if sub is a part of a string, false if not
//
String.prototype.contains = function(sub) {
  return this.indexOf(sub) != -1;
};

//
// Function: String.containsWord
// Description: Determines if a string contains a word
// Input: str - a word
// Return: true if str is word in a string, false if not
//
String.prototype.containsWord = function(str) {
  return this.match(new RegExp("\\b" + str + "\\b")) != null;
};

//
// Function: String.endsWith
// Description: Determines if a string ends with a substring
// Input: sub - a string
// Return: true if a string ends with sub, false if not
//
String.prototype.endsWith = function(sub) {
  return this.length >= sub.length &&
    this.slice(this.length - sub.length) == sub;
};

//
// Function: String.reverse
// Description: Creates a string with characters in reverse order
// Input:  <none>
// Return: the string with the characters in reverse order
//
String.prototype.reverse = function() {
  var ar = this.split('');
  ar.reverse();
  return ar.join('');
};

//
// Function: String.startsWith
// Description: Determines if a string starts with a substring
// Input: sub - a string
// Return: true if a string starts with sub, false if not
//
String.prototype.startsWith = function(sub) {
  return this.indexOf(sub) == 0;
};

//
// Function: String.trim
// Description: Trims whitespace from the beginning and end of a string
// Input:  <none>
// Return: the string with whitespace trimmed off
//
String.prototype.trim = function() {
  return this.replace(/^[\s]+|[\s]+$/g, '');
};
//
// Function: String.ltrim
// Description: Trims whitespace off the beginning of the string
// Input:  <none>
// Return: the string with whitespace trimmed off the start of the string
//
String.prototype.ltrim = function() {
  return this.replace(/^[\s]+/g, '');
};
//
// Function: String.rtrim
// Description: Trims whitespace off the end of a string
// Input:  <none>
// Return: the string with whitespace of the end of the string
//
String.prototype.rtrim = function() {
  return this.replace(/[\s]+$/g, '');
};


//========================= String formatting ================================
//
// Function: String.sprintf
// Description: Creates a formatted string
// Input: the format specification and values to be used in formatting
// Return: a formatted string
//
// Documentation:
//   http://www.opengroup.org/onlinepubs/007908799/xsh/fprintf.html
//
// From these sites:
//   http://forums.devshed.com/html-programming-1/sprintf-39065.html
//   http://jan.moesen.nu/code/javascript/sprintf-and-printf-in-javascript/
//
// Example:    var idx = 1;
//             while (file.exists) {
//                var newFname = "%s/%s_%02d.%s".sprintf(dir, fname,
//                                                       idx++, ext);
//                file = File(newFname);
//              }
//
String.prototype.sprintf = function() {
  var args = [this];
  for (var i = 0; i < arguments.length; i++) {
    args.push(arguments[i]);
  }
  return String.sprintf.apply(null, args);
};
String.sprintf = function() {
  function _sprintf() {
    if (!arguments || arguments.length < 1 || !RegExp)  {
      return "Error";
    }
    var str = arguments[0];
    var re = /([^%]*)%('.|0|\x20)?(-)?(\d+)?(\.\d+)?(%|b|c|d|u|f|o|s|x|X)/m;
            //') /* for xemacs auto-indent  */
    var a = b = [], numSubstitutions = 0, numMatches = 0;
    var result = '';

    while (a = re.exec(str)) {
      var leftpart = a[1], pPad = a[2], pJustify = a[3], pMinLength = a[4];
      var pPrecision = a[5], pType = a[6], rightPart = a[7];

      rightPart = str.slice(a[0].length);

      numMatches++;

      if (pType == '%') {
        subst = '%';
      } else {
        numSubstitutions++;
        if (numSubstitutions >= arguments.length) {
          alert('Error! Not enough function arguments (' +
                (arguments.length - 1)
                + ', excluding the string)\n'
                + 'for the number of substitution parameters in string ('
                + numSubstitutions + ' so far).');
        }
        var param = arguments[numSubstitutions];
        var pad = '';
        if (pPad && pPad.slice(0,1) == "'") {
          pad = leftpart.slice(1,2);
        } else if (pPad) {
          pad = pPad;
        }
        var justifyRight = true;
        if (pJustify && pJustify === "-") {
          justifyRight = false;
        }
        var minLength = -1;
        if (pMinLength) {
          minLength = toNumber(pMinLength);
        }
        var precision = -1;
        if (pPrecision && pType == 'f') {
          precision = toNumber(pPrecision.substring(1));
        }
        var subst = param;
        switch (pType) {
        case 'b':
          subst = toNumber(param).toString(2);
          break;
        case 'c':
          subst = String.fromCharCode(toNumber(param));
          break;
        case 'd':
          subst = toNumber(param) ? Math.round(toNumber(param)) : 0;
          break;
        case 'u':
          subst = Math.abs(Math.round(toNumber(param)));
          break;
        case 'f':
          if (precision == -1) {
            precision = 6;
          }
          var n = Number(parseFloat(param).toFixed(Math.min(precision, 20)));
          subst = psx.localizeNumber(n);
//             ? Math.round(parseFloat(param) * Math.pow(10, precision))
//             / Math.pow(10, precision)
//             : ;
            break;
        case 'o':
          subst = toNumber(param).toString(8);
          break;
        case 's':
          subst = param;
          break;
        case 'x':
          subst = ('' + toNumber(param).toString(16)).toLowerCase();
          break;
        case 'X':
          subst = ('' + toNumber(param).toString(16)).toUpperCase();
          break;
        }
        var padLeft = minLength - subst.toString().length;
        if (padLeft > 0) {
          var arrTmp = new Array(padLeft+1);
          var padding = arrTmp.join(pad?pad:" ");
        } else {
          var padding = "";
        }
      }
      result += leftpart + padding + subst;
      str = rightPart;
    }
    result += str;
    return result;
  };

  return _sprintf.apply(null, arguments);
};


//========================= Date formatting ================================
//
// Function: Date.strftime
// Description:
//    This is a third generation implementation. This is a JavaScript
//    implementation of C the library function 'strftime'. It supports all
//    format specifiers except U, W, z, Z, G, g, O, E, and V.
//    For a full description of this function, go here:
//       http://www.opengroup.org/onlinepubs/007908799/xsh/strftime.html
//    Donating implementations can be found here:
//      http://redhanded.hobix.com/inspect/showingPerfectTime.html
//    and here:
//      http://wiki.osafoundation.org/bin/view/Documentation/JavaScriptStrftime
//  Input:  the date object and the format specification
//  Return: a formatted string
//
//  Example: var date = new Date(); alert(date.strftime("%Y-%m-%d"));
//
// Object Method
Date.prototype.strftime = function (fmt) {
  return Date.strftime(this, fmt);
};

// Class Function
Date.strftime = function(date, fmt) {
  var t = date;
  var cnvts = Date.prototype.strftime._cnvt;
  var str = fmt;
  var m;
  var rex = /([^%]*)%([%aAbBcCdDehHIjmMprRStTuwxXyYZ]{1})(.*)/;

  var result = '';
  while (m = rex.exec(str)) {
    var pre = m[1];
    var typ = m[2];
    var post = m[3];
    result += pre + cnvts[typ](t);
    str = post;
  }
  result += str;
  return result;
};

// the specifier conversion function table
Date.prototype.strftime._cnvt = {
  zeropad: function( n ){ return n>9 ? n : '0'+n; },
  spacepad: function( n ){ return n>9 ? n : ' '+n; },
  ytd: function(t) {
    var first = new Date(t.getFullYear(), 0, 1).getTime();
    var diff = t.getTime() - first;
    return parseInt(((((diff/1000)/60)/60)/24))+1;
  },
  a: function(t) {
    return [ZStrs.Sun,ZStrs.Mon,ZStrs.Tue,ZStrs.Wed,ZStrs.Thu,
            ZStrs.Fri,ZStrs.Sat][t.getDay()];
  },
  A: function(t) {
    return [ZStrs.Sunday,ZStrs.Monday,ZStrs.Tuesdsay,ZStrs.Wednesday,
            ZStrs.Thursday,ZStrs.Friday,
            ZStrs.Saturday][t.getDay()];
  },
  b: function(t) {
    return [ZStrs.Jan,ZStrs.Feb,ZStrs.Mar,ZStrs.Apr,ZStrs.May,ZStrs.Jun,
            ZStrs.Jul,ZStrs.Aug,ZStrs.Sep,ZStrs.Oct,
            ZStrs.Nov,ZStrs.Dec][t.getMonth()]; },
  B: function(t) {
    return [ZStrs.January,ZStrs.February,ZStrs.March,ZStrs.April,ZStrs.May,
            ZStrs.June,ZStrs.July,ZStrs.August,
            ZStrs.September,ZStrs.October,ZStrs.November,
            ZStrs.December][t.getMonth()]; },
  c: function(t) {
    return (this.a(t) + ' ' + this.b(t) + ' ' + this.e(t) + ' ' +
            this.H(t) + ':' + this.M(t) + ':' + this.S(t) + ' ' + this.Y(t));
  },
  C: function(t) { return this.Y(t).slice(0, 2); },
  d: function(t) { return this.zeropad(t.getDate()); },
  D: function(t) { return this.m(t) + '/' + this.d(t) + '/' + this.y(t); },
  e: function(t) { return this.spacepad(t.getDate()); },
  // E: function(t) { return '-' },
  F: function(t) { return this.Y(t) + '-' + this.m(t) + '-' + this.d(t); },
  g: function(t) { return '-'; },
  G: function(t) { return '-'; },
  h: function(t) { return this.b(t); },
  H: function(t) { return this.zeropad(t.getHours()); },
  I: function(t) {
    var s = this.zeropad((t.getHours() + 12) % 12);
    return (s == "00") ? "12" : s;
  },
  j: function(t) { return this.ytd(t); },
  k: function(t) { return this.spacepad(t.getHours()); },
  l: function(t) {
    var s = this.spacepad((t.getHours() + 12) % 12);
    return (s == " 0") ? "12" : s;
  },
  m: function(t) { return this.zeropad(t.getMonth()+1); }, // month-1
  M: function(t) { return this.zeropad(t.getMinutes()); },
  n: function(t) { return '\n'; },
  // O: function(t) { return '-' },
  p: function(t) { return this.H(t) < 12 ? ZStrs.AM : ZStrs.PM; },
  r: function(t) {
    return this.I(t) + ':' + this.M(t) + ':' + this.S(t) + ' ' + this.p(t);
  },
  R: function(t) { return this.H(t) + ':' + this.M(t); },
  S: function(t) { return this.zeropad(t.getSeconds()); },
  t: function(t) { return '\t'; },
  T: function(t) {
    return this.H(t) + ':' + this.M(t) + ':' + this.S(t) + ' ' + this.p(t);
  },
  u: function(t) {return t.getDay() ? t.getDay()+1 : 7; },
  U: function(t) { return '-'; },
  w: function(t) { return t.getDay(); }, // 0..6 == sun..sat
  W: function(t) { return '-'; },       // not available
  x: function(t) { return this.D(t); },
  X: function(t) { return this.T(t); },
  y: function(t) { return this.zeropad(this.Y(t) % 100); },
  Y: function(t) { return t.getFullYear().toString(); },
  z: function(t) { return ''; },
  Z: function(t) { return ''; },
  '%': function(t) { return '%'; }
};

// this needs to be worked on...
function _weekNumber(date) {
  var ytd = toNumber(date.strftime("%j"));
  var week = Math.floor(ytd/7);
  if (new Date(date.getFullYear(), 0, 1).getDay() < 4) {
    week++;
  }
  return week;
};

//
// Format a Date object into a proper ISO 8601 date string
//
psx.toISODateString = function(date, timeDesignator, dateOnly, precision) {
  if (!date) date = new Date();
  var str = '';
  if (timeDesignator == undefined) { timeDesignator = 'T'; };
  function _zeroPad(val) { return (val < 10) ? '0' + val : val; }
  if (date instanceof Date) {
    str = (date.getFullYear() + '-' +
           _zeroPad(date.getMonth()+1,2) + '-' +
           _zeroPad(date.getDate(),2));
    if (!dateOnly) {
      str += (timeDesignator +
              _zeroPad(date.getHours(),2) + ':' +
              _zeroPad(date.getMinutes(),2) + ':' +
              _zeroPad(date.getSeconds(),2));
      if (precision && typeof(precision) == "number") {
        var ms = date.getMilliseconds();
        if (ms) {
          var millis = _zeroPad(ms.toString(),precision);
          var s = millis.slice(0, Math.min(precision, millis.length));
          str += "." + s;
        }
      }
    }
  }
  return str;
};

//
// Make it a Date object method
//
Date.prototype.toISODateString = function(timeDesignator, dateOnly, precision) {
  return psx.toISODateString(this, timeDesignator, dateOnly, precision);
};

// some ISO8601 formats
Date.strftime.iso8601_date = "%Y-%m-%d";
Date.strftime.iso8601_full = "%Y-%m-%dT%H:%M:%S";
Date.strftime.iso8601      = "%Y-%m-%d %H:%M:%S";
Date.strftime.iso8601_time = "%H:%M:%S";

Date.prototype.toISO = function() {
  return this.strftime(Date.strftime.iso8601);
};

Date.prototype.toISOString = Date.prototype.toISODateString;


//
//============================ Array  Extensions ===========================
//

//
// Function: Array.contains
// Description: Determines if an array contains a specific element
// Input:  the array and the element to search for
// Return: true if the element is found, false if not
//
Array.contains = function(ar, el) {
  for (var i = 0; i < ar.length; i++) {
    if (ar[i] == el) {
      return true;
    }
  }
  return false;
};
if (!Array.prototype.contains) {
  // define the instance method
  Array.prototype.contains = function(el) {
    for (var i = 0; i < this.length; i++) {
      if (this[i] == el) {
        return true;
      }
    }
    return false;
  };
}

//
// Function: Array.indexOf
// Description: Determines the index of an element in an array
// Input:  the array and the element to search for
// Return: the index of the element or -1 if not found
//
if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function(el) {
    for (var i = 0; i < this.length; i++) {
      if (this[i] == el) {
        return i;
      }
    }
    return -1;
  };
}

//
// Function: Array.lastIndexOf
// Description: Determines the last index of an element in an array
// Input:  the array and the element to search for
// Return: the last index of the element or -1 if not found
//
if (!Array.prototype.lastIndexOf) {
  Array.prototype.indexOf = function(el) {
    for (var i = this.length-1; i >= 0; i--) {
      if (this[i] == el) {
        return i;
      }
    }
  return -1;
  };
}


//
// Class: Timer
// Description: a simple timer with start and stop methods
//
Timer = function() {
  var self = this;
  self.startTime = 0;
  self.stopTime  = 0;
  self.elapsed = 0;
  self.cummulative = 0;
  self.count = 0;
};

Timer.prototype.start = function() {
  this.startTime = new Date().getTime();
};
Timer.prototype.stop = function() {
  var self = this;
  self.stopTime = new Date().getTime();
  self.elapsed = (self.stopTime - self.startTime)/1000.00;
  self.cummulative += self.elapsed;
  self.count++;
  self.per = self.cummulative/self.count;
};


//
//======================== File and Folder ===================================
//
// Function: toUIString
// Description: the name of a File/Folder suitable for use in a UI
// Input:  <none>
// Return: the formatted file name
//
File.prototype.toUIString = function() {
  return decodeURI(this.fsName);
};
Folder.prototype.toUIString = function() {
  return decodeURI(this.fsName);
};

//========================= Filename formatting ===============================
//
// Function: strf
// Input: File/Folder and the format string
// File.strf(fmt [, fs])
// Folder.strf(fmt [, fs])
//   This is based of the file name formatting facility in exiftool. Part of
//   the description is copied directly from there. You can find exiftool at:
//      http://www.sno.phy.queensu.ca/~phil/exiftool/
//
// Description:
//   Format a file string using a printf-like format string
//
// fmt is a string where the following substitutions occur
//   %d - the directory name (no trailing /)
//   %f - the file name without the extension
//   %e - the file extension without the leading '.'
//   %p - the name of the parent folder
//   %% - the '%' character
//
// if fs is true the folder is in local file system format
//   (e.g. C:\images instead of /c/images)
//
// Examples:
//
// Reformat the file name:
// var f = new File("/c/work/test.jpg");
// f.strf("%d/%f_%e.txt") == "/c/work/test_jpg.txt"
//
// Change the file extension
// f.strf("%d/%f.psd") == "/c/work/test.psd"
//
// Convert to a file name in a subdirectory named after the extension
// f.strf("%d/%e/%f.%e") == "/c/work/jpg/test.jpg"
//
// Change the file extension and convert to a file name in a subdirectory named
//   after the new extension
// f.strf("%d/psd/%f.psd") == "/c/work/psd/test.psd"
//
// var f = new File("~/.bashrc");
// f.strf("%f") == ".bashrc"
// f.strf("%e") == ""
//
// Advanced Substitution
//   A substring of the original file name, directory or extension may be
//   taken by specifying a string length immediately following the % character.
//   If the length is negative, the substring is taken from the end. The
//   substring position (characters to ignore at the start or end of the
//   string) may be given by a second optional value after a decimal point.
// For example:
//
// var f = new File("Picture-123.jpg");
//
// f.strf("%7f.psd") == "Picture.psd"
// f.strf("%-.4f.psd") == "Picture.psd"
// f.strf("%7f.%-3f") == "Picture.123"
// f.strf("Meta%-3.1f.xmp") == "Meta12.xmp"
//
File.prototype.strf = function(fmt, fs) {
  var self = this;
  var name = decodeURI(self.name);
  //var name = (self.name);

  // get the portions of the full path name

  // extension
  var m = name.match(/.+\.([^\.\/]+)$/);
  var e = m ? m[1] : '';

  // basename
  m = name.match(/(.+)\.[^\.\/]+$/);
  var f = m ? m[1] : name;

  fs |= !($.os.match(/windows/i)); // fs only matters on Windows
  // fs |= isMac();

  // full path...
  var d = decodeURI((fs ? self.parent.fsName : self.parent.absoluteURI));

  // parent directory...
  var p = decodeURI(self.parent.name);

  //var d = ((fs ? self.parent.fsName : self.parent.toString()));

  var str = fmt;

  // a regexp for the format specifiers

  var rex = /([^%]*)%(-)?(\d+)?(\.\d+)?(%|d|e|f|p)(.*)/;

  var result = '';

  while (m = rex.exec(str)) {
    var pre = m[1];
    var sig = m[2];
    var len = m[3];
    var ign = m[4];
    var typ = m[5];
    var post = m[6];

    var subst = '';

    if (typ == '%') {
      subst = '%';
    } else {
      var s = '';
      switch (typ) {
        case 'd': s = d; break;
        case 'e': s = e; break;
        case 'f': s = f; break;
        case 'p': s = p; break;
        // default: s = "%" + typ; break; // let others pass through
      }

      var strlen = s.length;

      if (strlen && (len || ign)) {
        ign = (ign ? Number(ign.slice(1)) : 0);
        if (len) {
          len = Number(len);
          if (sig) {
            var _idx = strlen - len - ign;
            subst = s.slice(_idx, _idx+len);
          } else {
            subst = s.slice(ign, ign+len);
          }
        } else {
          if (sig) {
            subst = s.slice(0, strlen-ign);
          } else {
            subst = s.slice(ign);
          }
        }

      } else {
        subst = s;
      }
    }

    result += pre + subst;
    str = post;
  }

  result += str;

  return result;
};
Folder.prototype.strf = File.prototype.strf;


//=========================== PS Functions ===============================

//
// Function: getApplicationProperty
// Description: Get a value from the Application descriptor
// Input:  key - an ID
// Return: The value or undefined
//
psx.getApplicationProperty = function(key) {
  var ref = ref = new ActionReference();
  ref.putProperty(cTID("Prpr"), key);
  ref.putEnumerated(cTID('capp'), cTID("Ordn"), cTID("Trgt") );
  var desc;
  try {
    desc = executeActionGet(ref);
  } catch (e) {
    return undefined;
  }
  var val = undefined;
  if (desc.hasKey(key)) {
    var typ = desc.getType(key);
    switch (typ) {
    case DescValueType.ALIASTYPE:
      val = desc.getPath(key); break;
    case DescValueType.BOOLEANTYPE:
      val = desc.getBoolean(key); break;
    case DescValueType.CLASSTYPE:
      val = desc.getClass(key); break;
    case DescValueType.DOUBLETYPE:
      val = desc.getDouble(key); break;
    case DescValueType.ENUMERATEDTYPE:
      val = desc.getEnumeratedValue(key); break;
    case DescValueType.INTEGERTYPE:
      val = desc.getInteger(key); break;
    case DescValueType.LISTTYPE:
      val = desc.getList(key); break;
    case DescValueType.OBJECTTYPE:
      val = desc.getObjectValue(key); break;
    case DescValueType.RAWTYPE:
      val = desc.getData(key); break;
    case DescValueType.REFERENCETYPE:
      val = desc.getReference(key); break;
    case DescValueType.STRINGTYPE:
      val = desc.getString(key); break;
    case DescValueType.UNITDOUBLE:
      val = desc.getUnitDoubleValue(key); break;
    }
  }
  return val;
};

//
// Class: ColorProfileNames
// Description: a holder for common color profile names
//
ColorProfileNames = {};
ColorProfileNames.ADOBE_RGB      = "Adobe RGB (1998)";
ColorProfileNames.APPLE_RGB      = "Apple RGB";
ColorProfileNames.PROPHOTO_RGB   = "ProPhoto RGB";
ColorProfileNames.SRGB           = "sRGB IEC61966-2.1";
ColorProfileNames.COLORMATCH_RGB = "ColorMatch RGB";
ColorProfileNames.WIDEGAMUT_RGB  = "Wide Gamut RGB";

//
// Function: delocalizeProfile
// Description: converts a localized color profile name to a name
//              that can be used in the PS DOM API
// Input:  profile - localized color profile name
// Return: a color profile name in EN
//
psx.delocalizeProfile = function(profile) {
  var p = profile;

  switch (profile) {
    case ZStrs.ProfileAdobeRGB:      p = ColorProfileNames.ADOBE_RGB; break;
    case ZStrs.ProfileAppleRGB:      p = ColorProfileNames.APPLE_RGB; break;
    case ZStrs.ProfileProPhotoRGB:   p = ColorProfileNames.PROPHOTO_RGB; break;
    case ZStrs.ProfileSRGB:          p = ColorProfileNames.SRGB; break;
    case ZStrs.ProfileColorMatchRGB: p = ColorProfileNames.COLORMATCH_RGB; break;
    case ZStrs.ProfileWideGamutRGB:  p = ColorProfileNames.WIDEGAMUT_RGB; break;
    case ZStrs.ProfileLab:           profile = "Lab"; break;
    case ZStrs.ProfileWorkingCMYK:   profile = "Working CMYK"; break;
    case ZStrs.ProfileWorkingGray:   profile = "Working Gray"; break;
    case ZStrs.ProfileWorkingRGB:    profile = "Working RGB"; break;
  }

  return p;
};

//
// Function: convertProfile
// Description: converts a document's color profile
// Input:  doc - a Document
//         profile - a color profile name (possibly localized)
//         flatten - should the document be flattened (opt)
// Return: <none>
//
psx.convertProfile = function(doc, profile, flatten) {
  profile = profile.replace(/\.icc$/i, '');

  profile = psx.delocalizeProfile(profile);

  function _ftn() {
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putEnumerated( cTID('Dcmn'), cTID('Ordn'), cTID('Trgt') );
    desc.putReference( cTID('null'), ref);
    desc.putString( cTID('T   '), profile );
    desc.putEnumerated( cTID('Inte'), cTID('Inte'), cTID('Clrm') );
    desc.putBoolean( cTID('MpBl'), true );
    desc.putBoolean( cTID('Dthr'), false );
    desc.putInteger( cTID('sdwM'), -1 );
    if (flatten != undefined) {
      desc.putBoolean( cTID('Fltt'), !!flatten);
    }
    executeAction( sTID('convertToProfile'), desc, DialogModes.NO );
  }

  _ftn();
};


//
// Function: getDocumentDescriptor
// Description: Gets the ActionDescriptor of a Document
// Input:  doc - a Document
// Return: an ActionDescriptor
//
psx.getDocumentDescriptor = function(doc) {
  var active = undefined;
  if (doc && doc != app.activeDocument) {
    active = app.activeDocument;
    app.activeDocument = doc;
  }
  var ref = new ActionReference();
  ref.putEnumerated( cTID("Dcmn"),
                     cTID("Ordn"),
                     cTID("Trgt") );  //activeDoc
  var desc = executeActionGet(ref);

  if (active) {
    app.activeDocument = active;
  }

  return desc;
};

//
// Function: getDocumentIndex
// Description: Gets the index of a Document in app.documents
// Input:  doc - a Document
// Return: The index of the document or -1 if not found
//
psx.getDocumentIndex = function(doc) {
  var docs = app.documents;
  for (var i = 0; i < docs.length; i++) {
    if (docs[i] == doc) {
      return i+1;
    }
  }

  return -1;

//   return psx.getDocumentDescriptor(doc).getInteger(cTID('ItmI'));
};

//
// Function: revertDocument
// Description: Reverts a document to it's original state
// Input:  doc - a Document
// Return: <none>
//
psx.revertDocument = function(doc) {
  psx.doEvent(doc, "Rvrt");
};


//
// Function: getXMPValue
// Description: Get the XMP value for (tag) from the object (obj).
//              obj can be a String, XML, or Document. Support for
//              Files will be added later.
//              Based on getXMPTagFromXML from Adobe's StackSupport.jsx
// Input:  obj - an object containing XMP data
//         tag - the name of an XMP field
// Return: the value of an XMP field as a String
//
psx.getXMPValue = function(obj, tag) {
  var xmp;

  if (obj.constructor == String) {
    xmp = new XML(obj);

  } else if (obj.typename == "Document") {
    xmp = new XML(obj.xmpMetadata.rawData);

  } else if (obj instanceof XML) {
    xmp = obj;

  // } else if (obj instanceof File) {
  // add support for Files

  } else {
    Error.runtimeError(19, "obj");
  }

  var s;
  
  // Ugly special case
  if (tag == "ISOSpeedRatings") {
    s = String(xmp.*::RDF.*::Description.*::ISOSpeedRatings.*::Seq.*::li);

  }  else {
    s = String(eval("xmp.*::RDF.*::Description.*::" + tag));
  }

  return s;
};


//
// Function: getDocumentName
// Description: Gets the name of the document. Doing it this way
//              avoids the side effect recomputing the histogram.
// Input:  doc - a Document
// Return: the name of the Document
//
psx.getDocumentName = function(doc) {
  function _ftn() {
    var ref = new ActionReference();
    ref.putProperty(cTID('Prpr'), cTID('FilR'));
    ref.putEnumerated(cTID('Dcmn'), cTID('Ordn'), cTID('Trgt'));
    var desc = executeActionGet(ref);
    return desc.hasKey(cTID('FilR')) ? desc.getPath(cTID('FilR')) : undefined;
  }
  return _ftn();
};

//
// Function: hasBackgruond
// Description: Determines if a Document has a background
// Input:  doc - a Document
// Return: true if the document has a background, false if not
//
psx.hasBackground = function(doc) {
   return doc.layers[doc.layers.length-1].isBackgroundLayer;
};

//
// Function: copyLayerToDocument
// Description: Copies a layer from on Document to another
// Input:  doc   - a Document
//         layer - a Layer
//         otherDocument - a Document
// Return: <none>
//
psx.copyLayerToDocument = function(doc, layer, otherDoc) {
  var desc = new ActionDescriptor();
  var fref = new ActionReference();
  fref.putEnumerated(cTID('Lyr '), cTID('Ordn'), cTID('Trgt'));
  desc.putReference(cTID('null'), fref);
  var tref = new ActionReference();
  tref.putIndex(cTID('Dcmn'), psx.getDocumentIndex(otherDoc));
  // tref.putName(cTID('Dcmn'), otherDoc.name);
  desc.putReference(cTID('T   '), tref);
  desc.putInteger(cTID('Vrsn'), 2 );
  executeAction(cTID('Dplc'), desc, DialogModes.NO);
};

//
// Function: getLayerDescriptor
// Description: Gets the ActionDescriptor for a layer
// Input:  doc   - a Document
//         layer - a Layer
// Return: an ActionDescriptor
//
psx.getLayerDescriptor = function(doc, layer) {
  var ref = new ActionReference();
  ref.putEnumerated(cTID("Lyr "), cTID("Ordn"), cTID("Trgt"));
  return executeActionGet(ref);
};

//
// Function: createLayerMask
// Description: Creates a layer mask for a layer optionally from the
//              current selection
// Input:  doc   - a Document
//         layer - a Layer
//         fromSelection - should mask be made from the current selection (opt)
// Return: <none>
//
psx.createLayerMask = function(doc, layer, fromSelection) {
  var desc = new ActionDescriptor();
  desc.putClass(cTID("Nw  "), cTID("Chnl"));
  var ref = new ActionReference();
  ref.putEnumerated(cTID("Chnl"), cTID("Chnl"), cTID("Msk "));
  desc.putReference(cTID("At  "), ref);
  if (fromSelection == true) {
    desc.putEnumerated(cTID("Usng"), cTID("UsrM"), cTID("RvlS"));
  } else {
    desc.putEnumerated(cTID("Usng"), cTID("UsrM"), cTID("RvlA"));
  }
  executeAction(cTID("Mk  "), desc, DialogModes.NO);
};

//
// Function: hasLayerMask
//           isLayerMaskEnabled
//           disableLayerMask
//           enableLayerMask
//           setLayerMaskEnabledState
// Description: A collection of functions dealing with the state
//              of a layer's mask.
//              
// Input:  doc   - a Document
//         layer - a Layer
// Return: boolean or <none>
//
psx.hasLayerMask = function(doc, layer) {
  return psx.getLayerDescriptor().hasKey(cTID("UsrM"));
};
psx.isLayerMaskEnabled = function(doc, layer) {
  var desc = psx.getLayerDescriptor(doc, layer);
  return (desc.hasKey(cTID("UsrM")) && desc.getBoolean(cTID("UsrM")));
};
psx.disableLayerMask = function(doc, layer) {
  psx.setLayerMaskEnabledState(doc, layer, false);
};
psx.enableLayerMask = function(doc, layer) {
  psx.setLayerMaskEnabledState(doc, layer, true);
};
psx.setLayerMaskEnabledState = function(doc, layer, state) {
  if (state == undefined) {
    state = false;
  }
  var desc = new ActionDescriptor();

  var ref = new ActionReference();
  ref.putEnumerated(cTID('Lyr '), cTID('Ordn'), cTID('Trgt'));
  desc.putReference(cTID('null'), ref );

  var tdesc = new ActionDescriptor();
  tdesc.putBoolean(cTID('UsrM'), state);
  desc.putObject(cTID('T   '), cTID('Lyr '), tdesc);

  executeAction(cTID('setd'), desc, DialogModes.NO );
};

//
// Function: mergeVisible
//           mergeSelected
//           mergeDown
//           mergeAllLayers
// Description: A collection of functions for merging layers
// Input:  doc - a Document
// Return: <none>
//
psx.mergeVisible = function(doc) {
  psx.doEvent(doc, "MrgV");  // "MergeVisible"
};
psx.mergeSelected = function(doc) {
  psx.doEvent(doc, "Mrg2");  // "MergeLayers"
};
psx.mergeDown = function(doc) {
  psx.doEvent(doc, "Mrg2");  // "MergeLayers"
};
psx.mergeAllLayers = function(doc) {
  psx.selectAllLayers(doc);

  if (psx.hasBackground(doc)) {
    psx.appendLayerToSelectionByName(doc, doc.backgroundLayer.name);
  }
  psx.mergeSelected(doc);
};

//
// Function: appendLayerToSelectionByName
// Description: Adds a layer to the current set of selected layers
// Input:  doc  - a Document
//         name - a layer's name
// Return: <none>
//
psx.appendLayerToSelectionByName = function(doc, name) {
  var desc25 = new ActionDescriptor();
  var ref18 = new ActionReference();
  ref18.putName( cTID('Lyr '), name );
  desc25.putReference( cTID('null'), ref18 );
  desc25.putEnumerated( sTID('selectionModifier'),
                        sTID('selectionModifierType'),
                        sTID('addToSelection') );
  desc25.putBoolean( cTID('MkVs'), false );
  executeAction( cTID('slct'), desc25, DialogModes.NO );
};

//
// Function: selectAllLayers
// Description: Select all layers in a document
// Input:  doc  - a Document
// Return: <none>
//
psx.selectAllLayers = function(doc) {
  var desc18 = new ActionDescriptor();
  var ref11 = new ActionReference();
  ref11.putEnumerated( cTID('Lyr '), cTID('Ordn'), cTID('Trgt') );
  desc18.putReference( cTID('null'), ref11 );
  executeAction( sTID('selectAllLayers'), desc18, DialogModes.NO );
};

//
// Function: getLayerBounds
// Description: Gets the bounds of the layer content (without the mask)
// Input:  doc  - a Document
//         layer - a Layer
// Return: the bounding rectangle of the layer's content
//
psx.getLayerBounds = function(doc, layer) {
  var ru = app.preferences.rulerUnits;

  var reenable = false;
  var st;
  if (psx.hasLayerMask(doc, layer) &&
      psx.isLayerMaskEnabled(doc, layer)) {
      st = doc.activeHistoryState;
    psx.disableLayerMask(doc, layer);
    reenable = true;
  }

  var lbnds = layer.bounds;
  
  // fix this to modify the history state
  if (reenable) {
    psx.enableLayerMask(doc, layer);
  }
  for (var i = 0; i < 4; i++) {
    lbnds[i] = lbnds[i].as("px");
  }

  return lbnds;
};

//
// Function: selectBounds
// Description: Create a selection using the given bounds
// Input:  doc  - a Document
//         b - bounding rectangle (in pixels)
//         type - the selection type
//         feather - the amount of feather (opt: 0)
//         antialias - should antialias be used (opt: false)
// Return: <none>
//
psx.selectBounds = function(doc, b, type, feather, antialias) {
  if (feather == undefined) {
    feather = 0;
  }

  if (antialias == undefined) {
    antialias = false;
  }
  
  doc.selection.select([[ b[0], b[1] ],
                        [ b[2], b[1] ],
                        [ b[2], b[3] ],
                        [ b[0], b[3] ]],
                       type, feather, antialias);
};

//
// Function: getSelectionBounds
// Description: Get the bounds of the current selection
// Input:  doc  - a Document
// Return: a bound rectangle (in pixels)
//
psx.getSelectionBounds = function(doc) {
  var bnds = [];
  var sbnds = doc.selection.bounds;
  for (var i = 0; i < sbnds.length; i++) {
    bnds[i] = sbnds[i].as("px");
  }
  return bnds;
};

//
// Function: hasSelection
// Input:  doc  - a Document
// Return: returns true if the document has as selection, false if not
//
psx.hasSelection = function(doc) {
  var res = false;

  var as = doc.activeHistoryState;
  doc.selection.deselect();
  if (as != doc.activeHistoryState) {
    res = true;
    doc.activeHistoryState = as;
  }

  return res;
};

//
// Function: rgbToString
// Description: Convert a SolidColor into a RGB string
// Input:  c - SolidColor
// Return: an RGB string (e.g. "[128,255,128]")
//
psx.rgbToString = function(c) {
  return "[" + c.rgb.red + "," + c.rgb.green + "," + c.rgb.blue + "]";
};
//
// Function: rgbToArray
// Description: Convert a SolidColor into a RGB array
// Input:  c - SolidColor
// Return: an RGB array (e.g. [128,255,128])
//
psx.rgbToArray = function(c) {
  return [c.rgb.red, c.rgb.green, c.rgb.blue];
};
//
// Function: rgbFromString
// Description: Converts an RBG string to a SolidColor
// Input:  str - an RGB string
// Return: a SolidColor
//
psx.rgbFromString = function(str) {
  var rex = /([\d\.]+),([\d\.]+),([\d\.]+)/;
  var m = str.match(rex);
  if (m) {
    return psx.createRGBColor(Number(m[1]),
                              Number(m[2]),
                              Number(m[3]));
  }
  return undefined;
};
//
// Function: createRGBColor
// Description: Creates a SolidColor from RGB values
// Input:  r - red
//         g - green
//         b - blue
// Return: a SolidColor
//
psx.createRGBColor = function(r, g, b) {
  var c = new RGBColor();
  if (r instanceof Array) {
    b = r[2]; g = r[1]; r = r[0];
  }
  c.red = parseInt(r); c.green = parseInt(g); c.blue = parseInt(b);
  var sc = new SolidColor();
  sc.rgb = c;
  return sc;
};

//
// Predefine some common colors
//
psx.COLOR_BLACK = psx.createRGBColor(0, 0, 0);
psx.COLOR_RED = psx.createRGBColor(255, 0, 0);
psx.COLOR_GREEN = psx.createRGBColor(0, 255, 0);
psx.COLOR_BLUE = psx.createRGBColor(0, 0, 255);
psx.COLOR_GRAY = psx.createRGBColor(128, 128, 128);
psx.COLOR_WHITE = psx.createRGBColor(255, 255, 255);

//
// Function: colorFromString
// Description: Creates a SolidColor from an RGBString
// Input:  str - an RGB string
// Return: a SolidColor
//
psx.colorFromString = function(str) {
  var c = psx.rgbFromString(str);
  if (!c) {
    str = str.toLowerCase();
    if (str == ZStrs.black.toLowerCase()) {
      c = psx.COLOR_BLACK;
    } else if (str == ZStrs.white.toLowerCase()) {
      c = psx.COLOR_WHITE;
    } else if (str == ZStrs.foreground.toLowerCase()) {
      c = app.foregroundColor;
    } else if (str == ZStrs.background.toLowerCase()) {
      c = app.backgroundColor;
    } else if (str == ZStrs.gray.toLowerCase() ||
               str == ZStrs.grey.toLowerCase()) {
      c = psx.COLOR_GRAY;
    } else if (str == ZStrs.red.toLowerCase()) {
      c = psx.COLOR_RED;
    } else if (str == ZStrs.green.toLowerCase()) {
      c = psx.COLOR_GREEN;
    } else if (str == ZStrs.blue.toLowerCase()) {
      c = psx.COLOR_BLUE;
    }
  }
  return c;
};


//
// Function: winFileSelection
// Description: Determines if a File is an image file (checks file extension)
// Input:  f - File
// Return: true if f is an image file, false if not
//
psx.winFileSelection = function(f) {
  var suffix = f.name.match(/[.](\w+)$/);
  var t;
  
  if (suffix && suffix.length == 2)  {
    suffix = suffix[1].toUpperCase();
    for (t in app.windowsFileTypes) {
      if (suffix == app.windowsFileTypes[t]) {
        // Ignore mac-generated system thumbnails
        if (f.name.slice(0,2) != "._") {
          return true;
        }
      }
    }
  }

  return false;
};

//
// Function: macFileSelection
// Description: Determines if a File is an image file (by file type/extension)
// Input:  f - File
// Return: true if f is an image file, false if not
//
psx.macFileSelection = function(f) {
  var t;
  for (t in app.macintoshFileTypes) {
    if (f.type == app.macintoshFileTypes[t]) {
      return true;
    }
  }
  
  // Also check windows suffixes...
  return winFileSelection( f );
}


//
// Function: isValidImageFile
// Description: Determines if a File is an image file (by file type/extension)
// Input:  f - File
// Return: true if f is an image file, false if not
//
psx.isValidImageFile = function(f) {
  function _winCheck(f) {
    // skip mac system files
    if (f.name.startsWith("._")) {
      return false;
    }

    var ext = f.strf('%e').toUpperCase();
    return (ext.length > 0) && app.windowsFileTypes.contains(ext);
  }
  function _macCheck(f) {
    return app.macintoshFileTypes.contains(f.type) || _winCheck(f);
  }

  return ((f instanceof File) &&
          (((File.fs == "Macintosh") && _macCheck(f)) ||
           ((File.fs == "Windows") && _winCheck(f))));
};



//============================ Actions =====================================

//
// Function: getActionSets
// Description: Returns the ActionSets in the Actions palette
// Input:  <none>
// Return: an array of objects that have these properties
//         name - the name of the ActionSet
//         actions - an array of the names of the actions in this set
//
psx.getActionSets = function() {
  var i = 1;
  var sets = [];

  while (true) {
    var ref = new ActionReference();
    ref.putIndex(cTID("ASet"), i);
    var desc;
    var lvl = $.level;
    $.level = 0;
    try {
      desc = executeActionGet(ref);
    } catch (e) {
      break;    // all done
    } finally {
      $.level = lvl;
    }
    if (desc.hasKey(cTID("Nm  "))) {
      var set = {};
      set.index = i;
      set.name = desc.getString(cTID("Nm  "));
      set.toString = function() { return this.name; };
      set.count = desc.getInteger(cTID("NmbC"));
      set.actions = [];
      for (var j = 1; j <= set.count; j++) {
        var ref = new ActionReference();
        ref.putIndex(cTID('Actn'), j);
        ref.putIndex(cTID('ASet'), set.index);
        var adesc = executeActionGet(ref);
        var actName = adesc.getString(cTID('Nm  '));
        set.actions.push(actName);
      }
      sets.push(set);
    }
    i++;
  }

  return sets;
};


//============================= ScriptUI stuff =============================

psxui = function() {}

// XXX - Need to check to see if decimalPoint is a special RegEx character
// that needs to be escaped. Currently, we only handle '.'
psxui.dpREStr = (psx.decimalPoint == '.' ? "\\." : psx.decimalPoint);

//
// Function: numberKeystrokeFilter
//           positiveNumberKeystrokeFilter
//           numericKeystrokeFilter
//           unitValueKeystrokeFilter
// Description: A collection of KeyStroke filters that can be used with
//              EditText widgets
// Input:  <none>
// Return: <none>
//
psxui.numberKeystrokeFilter = function() {
  var ftn = psxui.numberKeystrokeFilter;

  if (this.text.match(ftn.matchRE)) {
    if (!ftn.replaceRE) {
      ftn.replaceRE = RegExp(ftn.matchRE.toString().replace(/\//g, ''), "g");
    }
    this.text = this.text.replace(ftn.replaceRE.toString(), '');
  }
};
psxui.numberKeystrokeFilter.matchRE = RegExp("[^\\-" + psxui.dpREStr + "\\d]");

psxui.positiveNumberKeystrokeFilter = function() {
  var ftn = psxui.positiveNumberKeystrokeFilter;

  if (this.text.match(ftn.matchRE)) {
    if (!ftn.replaceRE) {
      ftn.replaceRE = RegExp(ftn.matchRE.toString().replace(/\//g, ''), "g");
    }
    this.text = this.text.replace(ftn.replaceRE, '');
  }
};
psxui.positiveNumberKeystrokeFilter.matchRE =
  RegExp("[^" + psxui.dpREStr + "\\d]");

psxui.numericKeystrokeFilter = function() {
  if (this.text.match(/[^\d]/)) {
    this.text = this.text.replace(/[^\d]/g, '');
  }
};

psxui.unitValueKeystrokeFilter = function() {
  var ftn = psxui.unitValueKeystrokeFilter;

  if (this.text.match(ftn.matchRE)) {
    if (!ftn.replaceRE) {
      ftn.replaceRE = RegExp(ftn.matchRE.toString().replace(/\//g, ''), "g");
    }
    this.text = this.text.toLowerCase().replace(ftn.replaceRE, '');
  }
};
psxui.unitValueKeystrokeFilter.matchRE =
  RegExp("[^\\w% " + psxui.dpREStr + "\\d]");

psxui.unitValueKeystrokeFilter.replaceRE =
  RegExp("[^\\w% " + psxui.dpREStr + "\\d]", "gi");


//
// Function: setMenuSelection
// Description: Select an item on a menu
// Input:  menu - a Menu UI widget
//         txt - text of the menu element
//         def - an element to use if the desired one can't be found
//         ignoreCase - whether or not case insensitive comparison is used
// Return: <none>
//
psxui.setMenuSelection = function(menu, txt, def, ignoreCase) {
  var it = menu.find(txt);
  var last = menu.selection;

  if (!it && ignoreCase) {
    var items = menu.items;
    txt = txt.toLowerCase();
    for (var i = 0; i < items.length; i++) {
      if (txt == items[i].text.toLowerCase()) {
        it = items[i];
        break;
      }
    }
  }

  if (!it) {
    if (def != undefined) {
      var n = toNumber(def);
      if (!isNaN(n)) {
        it = def;

      } else {
        it = menu.find(def);
      }
    }
  }

  if (it != undefined) {
    menu.selection = it;
    menu._last = last;

  } else {
    // XXX debug only...
    if (Folder("/Users/xbytor").exists) {
      $.level = 1; debugger;
    }
    alert("DEBUG: " + txt + " not found in menu");
  }
};

//============================ File Save =====================================
//
// FileSave is only available in Photoshop
//
FileSaveOptions = function(obj) {
  var self = this;

  self.saveDocumentType = undefined; // SaveDocumentType
  self.fileType = "jpg";             // file extension

  self._saveOpts = undefined;

  self.saveForWeb = false; // gif, png, jpg

  self.flattenImage = false; // psd, tif

  self.bmpAlphaChannels = true;
  self.bmpDepth = BMPDepthType.TWENTYFOUR;
  self.bmpRLECompression = false;

  self.gifTransparency = true;
  self.gifInterlaced = false;
  self.gifColors = 256;

  self.jpgQuality = 10;
  self.jpgEmbedColorProfile = true;
  self.jpgFormat = FormatOptions.STANDARDBASELINE;
  self.jpgConvertToSRGB = false;          // requires code

  self.epsEncoding = SaveEncoding.BINARY;
  self.epsEmbedColorProfile = true;

  self.pdfEncoding = PDFEncoding.JPEG;
  self.pdfEmbedColorProfile = true;

  self.psdAlphaChannels = true;
  self.psdEmbedColorProfile = true;
  self.psdLayers = true;
  self.psdMaximizeCompatibility = true;           // requires code for prefs

  self.pngInterlaced = false;

  self.tgaAlphaChannels = true;
  self.tgaRLECompression = true;

  self.tiffEncoding = TIFFEncoding.NONE;
  self.tiffByteOrder = (isWindows() ? ByteOrder.IBM : ByteOrder.MACOS);
  self.tiffEmbedColorProfile = true;

  if (obj) {
    for (var idx in self) {
      if (idx in obj) {       // only copy in FSO settings
        self[idx] = obj[idx];
      }
    }
    if (!obj.fileType) {
      self.fileType = obj.fileSaveType;
      if (self.fileType == "tiff") {
        self.fileType = "tif";
      }
    }
  }
};
//FileSaveOptions.prototype.typename = "FileSaveOptions";
FileSaveOptions._enableDNG = false;

FileSaveOptions.convert = function(fsOpts) {
  var fsType = fsOpts.fileType;
  if (!fsType) {
    fsType = fsOpts.fileSaveType;
  }
  var fs = FileSaveOptionsTypes[fsType];
  if (fs == undefined) {
    return undefined;
  }
  if (!fs.optionsType) {
    return undefined;
  }
  var saveOpts = new fs.optionsType();

  switch (fsType) {
    case "bmp": {
      saveOpts.rleCompression = toBoolean(fsOpts.bmpRLECompression);

      var value = BMPDepthType.TWENTYFOUR;
      var str = fsOpts.bmpDepth.toString();
      if (str.match(/1[^6]|one/i)) {
        value = BMPDepthType.ONE;
      } else if (str.match(/24|twentyfour/i)) {
        // we have to match 24 before 4
        value = BMPDepthType.TWENTYFOUR;
      } else if (str.match(/4|four/i)) {
        value = BMPDepthType.FOUR;
      } else if (str.match(/8|eight/i)) {
        value = BMPDepthType.EIGHT;
      } else if (str.match(/16|sixteen/i)) {
        value = BMPDepthType.SIXTEEN;
      } else if (str.match(/32|thirtytwo/i)) {
        value = BMPDepthType.THIRTYTWO;
      }
      saveOpts.depth = value;
      saveOpts.alphaChannels = toBoolean(fsOpts.bmpAlphaChannels);

      saveOpts._flatten = true;
      saveOpts._8Bit = true; //XXX Should this be true?
      break;
    }
    case "gif": {
      saveOpts.transparency = toBoolean(fsOpts.gifTransparency);
      saveOpts.interlaced = toBoolean(fsOpts.gifInterlaced);
      saveOpts.colors = toNumber(fsOpts.gifColors);

      saveOpts._convertToIndexed = true;
      saveOpts._flatten = true;
      saveOpts._8Bit = true;
      saveOpts._saveForWeb = toBoolean(fsOpts.saveForWeb);
      break;
    }
    case "jpg": {
      saveOpts.quality = toNumber(fsOpts.jpgQuality);
      saveOpts.embedColorProfile = toBoolean(fsOpts.jpgEmbedColorProfile);
      var value = FormatOptions.STANDARDBASELINE;
      var str = fsOpts.jpgFormat.toString();
      if (str.match(/standard/i)) {
        value = FormatOptions.STANDARDBASELINE;
      } else if (str.match(/progressive/i)) {
        value = FormatOptions.PROGRESSIVE;
      } else if (str.match(/optimized/i)) {
        value = FormatOptions.OPTIMIZEDBASELINE;
      }
      saveOpts.formatOptions = value;

      saveOpts._convertToSRGB = toBoolean(fsOpts.jpgConvertToSRGB);
      saveOpts._flatten = true;
      saveOpts._8Bit = true;
      saveOpts._saveForWeb = toBoolean(fsOpts.saveForWeb);
      break;
    }
    case "psd": {
      saveOpts.alphaChannels = toBoolean(fsOpts.psdAlphaChannels);
      saveOpts.embedColorProfile = toBoolean(fsOpts.psdEmbedColorProfile);
      saveOpts.layers = toBoolean(fsOpts.psdLayers);
      saveOpts.maximizeCompatibility =
        toBoolean(fsOpts.psdMaximizeCompatibility);
      saveOpts.flattenImage = toBoolean(fsOpts.flattenImage);
      break;
    }
    case "eps": {
      var value = SaveEncoding.BINARY;
      var str = fsOpts.epsEncoding.toString();
      if (str.match(/ascii/i)) {
        value = SaveEncoding.ASCII;
      } else if (str.match(/binary/i)) {
        value = SaveEncoding.BINARY;
      } else if (str.match(/jpg|jpeg/i)) {
        if (str.match(/high/i)) {
          value = SaveEncoding.JPEGHIGH;
        } else if (str.match(/low/i)) {
          value = SaveEncoding.JPEGLOW;
        } else if (str.match(/max/i)) {
          value = SaveEncoding.JPEGMAXIMUM;
        } else if (str.match(/med/i)) {
          value = SaveEncoding.JPEGMEDIUM;
        }
      }
      saveOpts.encoding = value;
      saveOpts.embedColorProfile = toBoolean(fsOpts.epsEmbedColorProfile);

      saveOpts._flatten = true;
      break;
    }
    case "pdf": {
      saveOpts.embedColorProfile = toBoolean(fsOpts.pdfEmbedColorProfile);
      break;
    }
    case "png": {
      saveOpts.interlaced = toBoolean(fsOpts.pngInterlaced);

      saveOpts._flatten = true;
      saveOpts._saveForWeb = toBoolean(fsOpts.saveForWeb);
      break;
    }
    case "tga": {
      saveOpts.alphaChannels = toBoolean(fsOpts.tgaAlphaChannels);
      saveOpts.rleCompression = toBoolean(fsOpts.tgaRLECompression);

      saveOpts._flatten = true;
      break;
    }
    case "tif": {
      var value = (isWindows() ? ByteOrder.IBM : ByteOrder.MACOS);
      var str = fsOpts.tiffByteOrder.toString();
      if (str.match(/ibm|pc/i)) {
        value = ByteOrder.IBM;
      } else if (str.match(/mac/i)) {
        value = ByteOrder.MACOS;
      }
      saveOpts.byteOrder = value;

      var value = TIFFEncoding.NONE;
      var str = fsOpts.tiffEncoding.toString();
      if (str.match(/none/i)) {
        value = TIFFEncoding.NONE;
      } else if (str.match(/lzw/i)) {
        value = TIFFEncoding.TIFFLZW;
      } else if (str.match(/zip/i)) {
        value = TIFFEncoding.TIFFZIP;
      } else if (str.match(/jpg|jpeg/i)) {
        value = TIFFEncoding.JPEG;
      }
      saveOpts.imageCompression = value;

      saveOpts.embedColorProfile = toBoolean(fsOpts.tiffEmbedColorProfile);
      saveOpts.flattenImage = toBoolean(fsOpts.flattenImage);
      break;
    }
    case "dng": {
    }
    default: {
      Error.runtimeError(9001, "Internal Error: Unknown file type: " +
                         fs.fileType);
    }
  }

  return saveOpts;
};

FileSaveOptionsType = function(fileType, menu, saveType, optionsType) {
  var self = this;

  self.fileType = fileType;    // the file extension
  self.menu = menu;
  self.saveType = saveType;
  self.optionsType = optionsType;
};
FileSaveOptionsType.prototype.typename = "FileSaveOptionsType";

FileSaveOptionsTypes = [];
FileSaveOptionsTypes._add = function(fileType, menu, saveType, optionsType) {
  var fsot = new FileSaveOptionsType(fileType, menu, saveType, optionsType);
  FileSaveOptionsTypes.push(fsot);
  FileSaveOptionsTypes[fileType] = fsot;
};
FileSaveOptionsTypes._init = function() {
  if (!isPhotoshop()) {
    return;
  }
  FileSaveOptionsTypes._add("bmp", "Bitmap (BMP)", SaveDocumentType.BMP,
                            BMPSaveOptions);
  FileSaveOptionsTypes._add("gif", "GIF", SaveDocumentType.COMPUSERVEGIF,
                            GIFSaveOptions);
  FileSaveOptionsTypes._add("jpg", "JPEG", SaveDocumentType.JPEG,
                            JPEGSaveOptions);
  FileSaveOptionsTypes._add("psd", "Photoshop PSD", SaveDocumentType.PHOTOSHOP,
                            PhotoshopSaveOptions);
  FileSaveOptionsTypes._add("eps", "Photoshop EPS",
                            SaveDocumentType.PHOTOSHOPEPS, EPSSaveOptions);
  FileSaveOptionsTypes._add("pdf", "Photoshop PDF",
                            SaveDocumentType.PHOTOSHOPPDF, PDFSaveOptions);
  FileSaveOptionsTypes._add("png", "PNG", SaveDocumentType.PNG,
                            PNGSaveOptions);
  FileSaveOptionsTypes._add("tga", "Targa", SaveDocumentType.TARGA,
                            TargaSaveOptions);
  FileSaveOptionsTypes._add("tif", "TIFF", SaveDocumentType.TIFF,
                            TiffSaveOptions);

  if (FileSaveOptions._enableDNG) {
    FileSaveOptionsTypes._add("dng", "DNG", undefined, undefined);
  }
};
FileSaveOptionsTypes._init();

// XXX remove file types _before_ creating a FS panel!
FileSaveOptionsTypes.remove = function(ext) {
  var ar = FileSaveOptionsTypes;
  var fsot = ar[ext];
  if (fsot) {
    for (var i = 0; i < ar.length; i++) {
      if (ar[i] == fsot) {
        ar.splice(i, 1);
        break;
      }
    }
    delete ar[ext];
  }
};

FileSaveOptions.createFileSavePanel = function(pnl, ini) {
  var win = pnl.window;
  pnl.mgr = this;

  var menuElements = [];

  for (var i = 0; i < FileSaveOptionsTypes.length; i++) {
    menuElements.push(FileSaveOptionsTypes[i].menu);
  }

  var w = pnl.bounds[2] - pnl.bounds[0];
  var xofs = 0;
  var y = 0;

  var opts = new FileSaveOptions(ini);

  if (pnl.type == 'panel') {
    xofs += 5;
    y += 10;
  }
  pnl.text = "Save Options";

  var tOfs = 3;

  var x = xofs;
  var w = pnl.add('statictext', [x,y+tOfs,x+55,y+22+tOfs], 'File Type:');
  x += w.bounds.width + 10;
  pnl.fileType = pnl.add('dropdownlist', [x,y,x+150,y+22], menuElements);

  var ftype = opts.fileType || opts.fileSaveType || "jpg";

  var ft = psx.getByProperty(FileSaveOptionsTypes,
                             "fileType",
                             ftype);
  pnl.fileType.selection = pnl.fileType.find(ft.menu);

  x += pnl.fileType.bounds.width + 10;
  pnl.saveForWeb = pnl.add('checkbox', [x,y,x+135,y+22], 'Save for Web');
  pnl.saveForWeb.visible = false;
  pnl.saveForWeb.value = false;

  pnl.flattenImage = pnl.add('checkbox', [x,y,x+135,y+22], 'Flatten Image');
  pnl.flattenImage.visible = false;
  pnl.flattenImage.value = false;


  y += 30;
  var yofs = y;

  x = xofs;

  //=============================== Bitmap ===============================
  if (FileSaveOptionsTypes["bmp"]) {
    pnl.bmpAlphaChannels = pnl.add('checkbox', [x,y,x+125,y+22],
                                   "Alpha Channels");

    x += 150;
    var bmpDepthMenu = ["1", "4", "8", "16", "24", "32"];
    pnl.bmpDepthLabel = pnl.add('statictext', [x,y+tOfs,x+60,y+22+tOfs],
                                'Bit Depth:');
    x += 65;
    pnl.bmpDepth = pnl.add('dropdownlist', [x,y,x+55,y+22], bmpDepthMenu);
    pnl.bmpDepth.selection = pnl.bmpDepth.find("24");

    pnl.bmpDepth.find("1")._value = BMPDepthType.ONE;
    pnl.bmpDepth.find("4")._value = BMPDepthType.FOUR;
    pnl.bmpDepth.find("8")._value = BMPDepthType.EIGHT;
    pnl.bmpDepth.find("16")._value = BMPDepthType.SIXTEEN;
    pnl.bmpDepth.find("24")._value = BMPDepthType.TWENTYFOUR;
    pnl.bmpDepth.find("32")._value = BMPDepthType.THIRTYTWO;

    x = xofs;
    y += 30;
    pnl.bmpRLECompression = pnl.add('checkbox', [x,y,x+145,y+22],
                                    "RLE Compression");

    pnl.bmp = ["bmpAlphaChannels", "bmpDepthLabel", "bmpDepth",
               "bmpRLECompression"];

    pnl.bmpAlphaChannels.value = toBoolean(opts.bmpAlphaChannels);
    var it = pnl.bmpDepth.find(opts.bmpDepth.toString());
    if (it) {
      pnl.bmpDepth.selection = it;
    }
    pnl.bmpRLECompression.value = toBoolean(opts.bmpRLECompression);

    y = yofs;
    x = xofs;
  }


  //=============================== GIF ===============================
  if (FileSaveOptionsTypes["gif"]) {
    pnl.gifTransparency = pnl.add('checkbox', [x,y,x+125,y+22],
                                  "Transparency");

    x += 125;
    pnl.gifInterlaced = pnl.add('checkbox', [x,y,x+125,y+22],
                                "Interlaced");

    x += 125;
    pnl.gifColorsLabel = pnl.add('statictext', [x,y+tOfs,x+55,y+22+tOfs],
                                  'Colors:');

    x += 60;
    pnl.gifColors = pnl.add('edittext', [x,y,x+55,y+22], "256");
    pnl.gifColors.onChanging = psx.numericKeystrokeFilter;
    pnl.gifColors.onChange = function() {
      var pnl = this.parent;
      var n = toNumber(pnl.gifColors.text || 256);
      if (n < 2)   { n = 2; }
      if (n > 256) { n = 256; }
      pnl.gifColors.text = n;
    }

    pnl.gif = ["gifTransparency", "gifInterlaced", "gifColors", "gifColorsLabel",
               "saveForWeb"];

    pnl.gifTransparency.value = toBoolean(opts.gifTransparency);
    pnl.gifInterlaced.value = toBoolean(opts.gifInterlaced);
    pnl.gifColors.text = toNumber(opts.gifColors || 256);

    pnl.saveForWeb.value = toBoolean(opts.saveForWeb);
    y = yofs;
    x = xofs;
  }


  //=============================== JPG ===============================
  if (FileSaveOptionsTypes["jpg"]) {
    pnl.jpgQualityLabel = pnl.add('statictext', [x,y+tOfs,x+55,y+22+tOfs],
                                  'Quality:');
    x += 60;
    var jpqQualityMenu = ["1","2","3","4","5","6","7","8","9","10","11","12"];
    pnl.jpgQuality = pnl.add('dropdownlist', [x,y,x+55,y+22], jpqQualityMenu);
    pnl.jpgQuality.selection = pnl.jpgQuality.find("10");

    y += 30;
    x = xofs;
    pnl.jpgEmbedColorProfile = pnl.add('checkbox', [x,y,x+155,y+22],
                                       "Embed Color Profile");

    y = yofs;
    x += 150;

    var jpgFormatMenu = ["Standard", "Progressive", "Optimized"];
    pnl.jpgFormatLabel = pnl.add('statictext', [x,y+tOfs,x+50,y+22+tOfs],
                                 'Format:');
    x += 55;
    pnl.jpgFormat = pnl.add('dropdownlist', [x,y,x+110,y+22], jpgFormatMenu);
    pnl.jpgFormat.selection = pnl.jpgFormat.find("Standard");

    pnl.jpgFormat.find("Standard")._value = FormatOptions.STANDARDBASELINE;
    pnl.jpgFormat.find("Progressive")._value = FormatOptions.PROGRESSIVE;
    pnl.jpgFormat.find("Optimized")._value = FormatOptions.OPTIMIZEDBASELINE;

    y += 30;
    x = xofs + 150;
    pnl.jpgConvertToSRGB = pnl.add('checkbox', [x,y,x+145,y+22],
                                   "Convert to sRGB");

    pnl.jpg = ["jpgQualityLabel", "jpgQuality", "jpgEmbedColorProfile",
               "jpgFormatLabel", "jpgFormat", "jpgConvertToSRGB", "saveForWeb" ];

    var it = pnl.jpgQuality.find(opts.jpgQuality.toString());
    if (it) {
      pnl.jpgQuality.selection = it;
    }
    pnl.jpgEmbedColorProfile.value = toBoolean(opts.jpgEmbedColorProfile);
    var it = pnl.jpgFormat.find(opts.jpgFormat);
    if (it) {
      pnl.jpgFormat.selection = it;
    }
    pnl.jpgConvertToSRGB.value = toBoolean(opts.jpgConvertToSRGB);

    pnl.saveForWeb.value = toBoolean(opts.saveForWeb);

    x = xofs;
    y = yofs;
  }


  //=============================== PSD ===============================
  if (FileSaveOptionsTypes["psd"]) {
    pnl.psdAlphaChannels = pnl.add('checkbox', [x,y,x+125,y+22],
                                   "Alpha Channels");

    y += 30;
    pnl.psdEmbedColorProfile = pnl.add('checkbox', [x,y,x+155,y+22],
                                       "Embed Color Profile");

    y = yofs;
    x = xofs + 150;

    pnl.psdLayers = pnl.add('checkbox', [x,y,x+125,y+22],
                          "Layers");

    y += 30;
    pnl.psdMaximizeCompatibility = pnl.add('checkbox', [x,y,x+175,y+22],
                                           "Maximize Compatibility");

    pnl.psd = ["psdAlphaChannels", "psdEmbedColorProfile",
               "psdLayers", "psdMaximizeCompatibility",
               "flattenImage"];

    pnl.psdAlphaChannels.value = toBoolean(opts.psdAlphaChannels);
    pnl.psdEmbedColorProfile.value = toBoolean(opts.psdEmbedColorProfile);
    pnl.psdLayers.value = toBoolean(opts.psdLayers);
    pnl.psdMaximizeCompatibility.value =
       toBoolean(opts.psdMaximizeCompatibility);

    pnl.flattenImage.value = toBoolean(opts.flattenImage);

    x = xofs;
    y = yofs;
  }

  //=============================== EPS ===============================
  if (FileSaveOptionsTypes["eps"]) {
    var epsEncodingMenu = ["ASCII", "Binary", "JPEG High", "JPEG Med",
                           "JPEG Low", "JPEG Max"];
    pnl.epsEncodingLabel = pnl.add('statictext', [x,y+tOfs,x+60,y+22+tOfs],
                                 'Encoding:');
    x += 65;
    pnl.epsEncoding = pnl.add('dropdownlist',
                              [x,y,x+100,y+22],
                              epsEncodingMenu);
    pnl.epsEncoding.selection = pnl.epsEncoding.find("Binary");

    pnl.epsEncoding.find("ASCII")._value = SaveEncoding.ASCII;
    pnl.epsEncoding.find("Binary")._value = SaveEncoding.BINARY;
    pnl.epsEncoding.find("JPEG High")._value = SaveEncoding.JPEGHIGH;
    pnl.epsEncoding.find("JPEG Low")._value = SaveEncoding.JPEGLOW;
    pnl.epsEncoding.find("JPEG Max")._value = SaveEncoding.JPEGMAXIMUM;
    pnl.epsEncoding.find("JPEG Med")._value = SaveEncoding.JPEGMEDIUM;

    x = xofs;
    y += 30;
    pnl.epsEmbedColorProfile = pnl.add('checkbox', [x,y,x+155,y+22],
                                       "Embed Color Profile");

    pnl.eps = ["epsEncodingLabel", "epsEncoding", "epsEmbedColorProfile"];

    var it = pnl.epsEncoding.find(opts.epsEncoding);
    if (it) {
      pnl.epsEncoding.selection = it;
    }
    pnl.epsEmbedColorProfile.value = toBoolean(opts.epsEmbedColorProfile);

    x = xofs;
    y = yofs;
  }


  //=============================== PDF ===============================
  if (FileSaveOptionsTypes["pdf"]) {
    pnl.pdf = ["pdfEmbedColorProfile"];

    x = xofs;
    y = yofs;

    x = xofs;
    y += 30;
    pnl.pdfEmbedColorProfile = pnl.add('checkbox', [x,y,x+155,y+22],
                                       "Embed Color Profile");
    pnl.pdfEmbedColorProfile.value = toBoolean(opts.pdfEmbedColorProfile);

    x = xofs;
    y = yofs;
  }


  //=============================== PNG ===============================
  if (FileSaveOptionsTypes["png"]) {
    pnl.pngInterlaced = pnl.add('checkbox', [x,y,x+125,y+22],
                                "Interlaced");

    pnl.png = ["pngInterlaced", "saveForWeb"];

    pnl.pngInterlaced.value = toBoolean(opts.pngInterlaced);

    pnl.saveForWeb.value = toBoolean(opts.saveForWeb);

    x = xofs;
    y = yofs;
  }


  //=============================== TGA ===============================
  if (FileSaveOptionsTypes["tga"]) {
    pnl.tgaAlphaChannels = pnl.add('checkbox', [x,y,x+125,y+22],
                                   "Alpha Channels");

    y += 30;

    pnl.tgaRLECompression = pnl.add('checkbox', [x,y,x+145,y+22],
                                    "RLE Compression");

    pnl.tga = ["tgaAlphaChannels", "tgaRLECompression"];

    pnl.tgaAlphaChannels.value = toBoolean(opts.tgaAlphaChannels);
    pnl.tgaRLECompression.value = toBoolean(opts.tgaRLECompression);

    x = xofs;
    y = yofs;
  }


  //=============================== TIFF ===============================
  if (FileSaveOptionsTypes["tif"]) {
    var tiffEncodingMenu = ["None", "LZW", "ZIP", "JPEG"];
    pnl.tiffEncodingLabel = pnl.add('statictext', [x,y+tOfs,x+60,y+22+tOfs],
                                    'Encoding:');
    x += 65;
    pnl.tiffEncoding = pnl.add('dropdownlist', [x,y,x+75,y+22],
                               tiffEncodingMenu);
    pnl.tiffEncoding.selection = pnl.tiffEncoding.find("None");

    pnl.tiffEncoding.find("None")._value = TIFFEncoding.NONE;
    pnl.tiffEncoding.find("LZW")._value = TIFFEncoding.TIFFLZW;
    pnl.tiffEncoding.find("ZIP")._value = TIFFEncoding.TIFFZIP;
    pnl.tiffEncoding.find("JPEG")._value = TIFFEncoding.JPEG;

    x += 90;

    var tiffByteOrderMenu = ["IBM", "MacOS"];
    pnl.tiffByteOrderLabel = pnl.add('statictext', [x,y+tOfs,x+65,y+22+tOfs],
                                     'ByteOrder:');
    x += 70;
    pnl.tiffByteOrder = pnl.add('dropdownlist', [x,y,x+85,y+22],
                                tiffByteOrderMenu);
    var bo = (isWindows() ? "IBM" : "MacOS");
    pnl.tiffByteOrder.selection = pnl.tiffByteOrder.find(bo);

    pnl.tiffByteOrder.find("IBM")._value = ByteOrder.IBM;
    pnl.tiffByteOrder.find("MacOS")._value = ByteOrder.MACOS;

    x = xofs;
    y += 30;
    pnl.tiffEmbedColorProfile = pnl.add('checkbox', [x,y,x+155,y+22],
                                        "Embed Color Profile");

    pnl.tif = ["tiffEncodingLabel", "tiffEncoding", "tiffByteOrderLabel",
               "tiffByteOrder", "tiffEmbedColorProfile", "flattenImage"];

    pnl.dng = [];

    var it = pnl.tiffEncoding.find(opts.tiffEncoding);
    if (it) {
      pnl.tiffEncoding.selection = it;
    }
    var it = pnl.tiffByteOrder.find(opts.tiffByteOrder);
    if (it) {
      pnl.tiffByteOrder.selection = it;
    }
    pnl.tiffEmbedColorProfile.value = toBoolean(opts.tiffEmbedColorProfile);

    pnl.flattenImage.value = toBoolean(opts.flattenImage);
  }
  
  pnl.fileType.onChange = function() {
    var pnl = this.parent;
    var ftsel = pnl.fileType.selection.index;
    var ft = FileSaveOptionsTypes[ftsel];

    for (var i = 0; i < FileSaveOptionsTypes.length; i++) {
      var fsType = FileSaveOptionsTypes[i];
      var parts = pnl[fsType.fileType];

      for (var j = 0; j < parts.length; j++) {
        var part = parts[j];
        pnl[part].visible = (fsType == ft);
      }
    }

    var fsType = ft.fileType;
    pnl.saveForWeb.visible = (pnl[fsType].contains("saveForWeb"));
    pnl.flattenImage.visible = (pnl[fsType].contains("flattenImage"));
    pnl._onChange();
  };

  pnl._onChange = function() {
    var self = this;
    if (self.onChange) {
      self.onChange();
    }
  };

  if (false) {
    y = yofs;
    x = 300;
    var btn = pnl.add('button', [x,y,x+50,y+22], "Test");
    btn.onClick = function() {
      try {
        var pnl = this.parent;
        var mgr = pnl.mgr;

        var opts = {};
        mgr.validateFileSavePanel(pnl, opts);
        alert(listProps(opts));
        alert(listProps(FileSaveOptions.convert(opts)));

      } catch (e) {
        var msg = psx.exceptionMessage(e);
        LogFile.write(msg);
        alert(msg);
      }
    };
  }

  pnl.fileType.onChange();

  pnl.getFileSaveType = function() {
    var pnl = this;
    var fstype = '';
    if (pnl.fileType.selection) {
      var fsSel = pnl.fileType.selection.index;
      var fs = FileSaveOptionsTypes[fsSel];
      fstype = fs.fileType;
    }
    return fstype;
  };

  pnl.updateSettings = function(ini) {
    var pnl = this;

    function _select(m, s, def) {
      var it = m.find(s.toString());
      if (!it && def != undefined) {
        it = m.items[def];
      }
      if (it) {
        m.selection = it;
      }
    }

    var opts = new FileSaveOptions(ini);
    var ftype = opts.fileType || opts.fileSaveType || "jpg";

    var ft = psx.getByProperty(FileSaveOptionsTypes,
                               "fileType",
                               ftype);
    pnl.fileType.selection = pnl.fileType.find(ft.menu);

    if (FileSaveOptionsTypes["bmp"]) {
      pnl.bmpAlphaChannels.value = toBoolean(opts.bmpAlphaChannels);
      _select(pnl.bmpDepth, opts.bmpDepth.toString(), 0);
      pnl.bmpRLECompression.value = toBoolean(opts.bmpRLECompression);
    }

    if (FileSaveOptionsTypes["gif"]) {
      pnl.gifTransparency.value = toBoolean(opts.gifTransparency);
      pnl.gifInterlaced.value = toBoolean(opts.gifInterlaced);
      pnl.gifColors.text = toNumber(opts.gifColors || 256);
      pnl.saveForWeb.value = toBoolean(opts.saveForWeb);
    }

    if (FileSaveOptionsTypes["jpg"]) {
      _select(pnl.jpgQuality, opts.jpgQuality.toString(), 0);
      pnl.jpgEmbedColorProfile.value = toBoolean(opts.jpgEmbedColorProfile);
      _select(pnl.jpgFormat, opts.jpgFormat, 0);
      pnl.jpgConvertToSRGB.value = toBoolean(opts.jpgConvertToSRGB);
      pnl.saveForWeb.value = toBoolean(opts.saveForWeb);
    }

    if (FileSaveOptionsTypes["psd"]) {
      pnl.psdAlphaChannels.value = toBoolean(opts.psdAlphaChannels);
      pnl.psdEmbedColorProfile.value = toBoolean(opts.psdEmbedColorProfile);
      pnl.psdLayers.value = toBoolean(opts.psdLayers);
      pnl.psdMaximizeCompatibility.value =
          toBoolean(opts.psdMaximizeCompatibility);
      pnl.flattenImage.value = toBoolean(opts.flattenImage);
    }
    
    if (FileSaveOptionsTypes["eps"]) {
      _select(pnl.epsEncoding, opts.epsEncoding, 0);
      pnl.epsEmbedColorProfile.value = toBoolean(opts.epsEmbedColorProfile);
    }
    
    if (FileSaveOptionsTypes["pdf"]) {
      pnl.pdfEmbedColorProfile.value = toBoolean(opts.pdfEmbedColorProfile);
    }
    
    if (FileSaveOptionsTypes["png"]) {
      pnl.pngInterlaced.value = toBoolean(opts.pngInterlaced);
      pnl.saveForWeb.value = toBoolean(opts.saveForWeb);
    }
    
    if (FileSaveOptionsTypes["tga"]) {
      pnl.tgaAlphaChannels.value = toBoolean(opts.tgaAlphaChannels);
      pnl.tgaRLECompression.value = toBoolean(opts.tgaRLECompression);
    }
    
    if (FileSaveOptionsTypes["tif"]) {
      _select(pnl.tiffEncoding, opts.tiffEncoding, 0);
      _select(pnl.tiffByteOrder, opts.tiffByteOrder, 0);
      pnl.tiffEmbedColorProfile.value = toBoolean(opts.tiffEmbedColorProfile);
      pnl.flattenImage.value = toBoolean(opts.flattenImage);
    }

    pnl.fileType.onChange();
  }

  return pnl;
};
FileSaveOptions.validateFileSavePanel = function(pnl, opts) {
  var win = pnl.window;

  // XXX This function needs to remove any prior file save
  // options and only set the ones needed for the
  // selected file type

  var fsOpts = new FileSaveOptions();
  for (var idx in fsOpts) {
    if (idx in opts) {
      delete opts[idx];
    }
  }

  var fsSel = pnl.fileType.selection.index;
  var fs = FileSaveOptionsTypes[fsSel];

  opts.fileSaveType = fs.fileType;
  opts._saveDocumentType = fs.saveType;

  if (!fs.optionsType) {
    opts._saveOpts = undefined;
    return;
  }

  var saveOpts = new fs.optionsType();

  switch (fs.fileType) {
    case "bmp": {
      saveOpts.rleCompression = pnl.bmpRLECompression.value;
      saveOpts.depth = pnl.bmpDepth.selection._value;
      saveOpts.alphaChannels = pnl.bmpAlphaChannels.value;

      opts.bmpRLECompression = pnl.bmpRLECompression.value;
      opts.bmpDepth = Number(pnl.bmpDepth.selection.text);
      opts.bmpAlphaChannels = pnl.bmpAlphaChannels.value;
      break;
    }
    case "gif": {
      saveOpts.transparency = pnl.gifTransparency.value;
      saveOpts.interlaced = pnl.gifInterlaced.value;
      var colors = toNumber(pnl.gifColors.text || 256);
      if (colors < 2)   { colors = 2; }
      if (colors > 256) { colors = 256; }
      saveOpts.colors = colors; 
      saveOpts._saveForWeb = pnl.saveForWeb.value;

      opts.gifTransparency = pnl.gifTransparency.value;
      opts.gifInterlaced = pnl.gifInterlaced.value;
      opts.gifColors = colors;
      opts.saveForWeb = pnl.saveForWeb.value;
      break;
    }
    case "jpg": {
      saveOpts.quality = Number(pnl.jpgQuality.selection.text);
      saveOpts.embedColorProfile = pnl.jpgEmbedColorProfile.value;
      saveOpts.formatOptions = pnl.jpgFormat.selection._value;
      saveOpts._convertToSRGB = pnl.jpgConvertToSRGB.value;
      saveOpts._saveForWeb = pnl.saveForWeb.value;

      opts.jpgQuality = Number(pnl.jpgQuality.selection.text);
      opts.jpgEmbedColorProfile = pnl.jpgEmbedColorProfile.value;
      opts.jpgFormat = pnl.jpgFormat.selection.text;
      opts.jpgConvertToSRGB = pnl.jpgConvertToSRGB.value;
      opts.saveForWeb = pnl.saveForWeb.value;
      break;
    }
    case "psd": {
      saveOpts.alphaChannels = pnl.psdAlphaChannels.value;
      saveOpts.embedColorProfile = pnl.psdEmbedColorProfile.value;
      saveOpts.layers = pnl.psdLayers.value;
      saveOpts.maximizeCompatibility = pnl.psdMaximizeCompatibility.value;

      opts.psdAlphaChannels = pnl.psdAlphaChannels.value;
      opts.psdEmbedColorProfile = pnl.psdEmbedColorProfile.value;
      opts.psdLayers = pnl.psdLayers.value;
      opts.psdMaximizeCompatibility = pnl.psdMaximizeCompatibility.value;
      opts.flattenImage = pnl.flattenImage.value;
      break;
    }
    case "eps": {
      saveOpts.encoding = pnl.epsEncoding.selection._value;
      saveOpts.embedColorProfile = pnl.epsEmbedColorProfile.value;

      opts.epsEncoding = pnl.epsEncoding.selection.text;
      opts.epsEmbedColorProfile = pnl.epsEmbedColorProfile.value;
      break;
    }
    case "pdf": {
      saveOpts.embedColorProfile = pnl.pdfEmbedColorProfile.value;

      opts.pdfEmbedColorProfile = pnl.pdfEmbedColorProfile.value;
      break;
    }
    case "png": {
      saveOpts.interlaced = pnl.pngInterlaced.value;
      saveOpts._saveForWeb = pnl.saveForWeb.value;

      opts.pngInterlaced = pnl.pngInterlaced.value;
      opts.saveForWeb = pnl.saveForWeb.value;
      break;
    }
    case "tga": {
      saveOpts.alphaChannels = pnl.tgaAlphaChannels.value;
      saveOpts.rleCompression = pnl.tgaRLECompression.value;

      opts.tgaAlphaChannels = pnl.tgaAlphaChannels.value;
      opts.tgaRLECompression = pnl.tgaRLECompression.value;
      break;
    }
    case "tif": {
      saveOpts.byteOrder = pnl.tiffByteOrder.selection._value;
      saveOpts.imageCompression = pnl.tiffEncoding.selection._value;
      saveOpts.embedColorProfile = pnl.tiffEmbedColorProfile.value;

      opts.tiffByteOrder = pnl.tiffByteOrder.selection.text;
      opts.tiffEncoding = pnl.tiffEncoding.selection.text;
      opts.tiffEmbedColorProfile = pnl.tiffEmbedColorProfile.value;
      opts.flattenImage = pnl.flattenImage.value;
      break;
    }
    default:
      Error.runtimeError(9001, "Internal Error: Unknown file type: " +
                         fs.fileType);
  }

  opts._saveOpts = saveOpts;

  return;
};

//============================= FileNaming ====================================
//
// Function: _getFontArray
// Description: 
// Input:  <none> 
// Return: an array of font info objects created by _getFontTable
//
//
FileNamingOptions = function(obj, prefix) {
  var self = this;

  self.fileNaming = [];      // array of FileNamingType and/or String
  self.startingSerial = 1;
  self.windowsCompatible = isWindows();
  self.macintoshCompatible = isMac();
  self.unixCompatible = true;

  if (obj) {
    if (prefix == undefined) {
      prefix = '';
    }
    var props = FileNamingOptions.props;
    for (var i = 0; i < props.length; i++) {
      var name = props[i];
      var oname = prefix + name;
      if (oname in obj) {
        self[name] = obj[oname];
      }
    }

    if (self.fileNaming.constructor == String) {
      self.fileNaming = self.fileNaming.split(',');

      // remove "'s from around custom text
    }
  }
};
FileNamingOptions.prototype.typename = FileNamingOptions;
FileNamingOptions.props = ["fileNaming", "startingSerial", "windowsCompatible",
                           "macintoshCompatible", "unixCompatible"];

FileNamingOptions.prototype.format = function(file, cdate) {
  var self = this;
  var str  = '';

  file = psx.convertFptr(file);

  if (!cdate) {
    cdate = file.created || new Date();
  }

  var fname = file.strf("%f");
  var ext = file.strf("%e");

  var parts = self.fileNaming;

  if (parts.constructor == String) {
    parts = parts.split(',');
  }

  var serial = self.startingSerial;
  var aCode = 'a'.charCodeAt(0);
  var ACode = 'A'.charCodeAt(0);
  var hasSerial = false;

  for (var i = 0; i < parts.length; i++) {
    var p = parts[i];
    var fnel = FileNamingElements.getByName(p);

    if (!fnel) {
      str += p;
      continue;
    }

    var s = '';
    switch (fnel.type) {
    case FileNamingType.DOCUMENTNAMEMIXED: s = fname; break;
    case FileNamingType.DOCUMENTNAMELOWER: s = fname.toLowerCase(); break;
    case FileNamingType.DOCUMENTNAMEUPPER: s = fname.toUpperCase(); break;
    case FileNamingType.SERIALNUMBER1:
      s = "%d".sprintf(serial);
      hasSerial = true;
      break;
    case FileNamingType.SERIALNUMBER2:
      s = "%02d".sprintf(serial);
      hasSerial = true;
      break;
    case FileNamingType.SERIALNUMBER3:
      s = "%03d".sprintf(serial);
      hasSerial = true;
      break;
    case FileNamingType.SERIALNUMBER4:
      s = "%04d".sprintf(serial);
      hasSerial = true;
      break;
    case FileNamingElement.SERIALNUMBER5:
      s = "%05d".sprintf(serial);
      hasSerial = true;
      break;
    case FileNamingType.EXTENSIONLOWER:    s = '.' + ext.toLowerCase(); break;
    case FileNamingType.EXTENSIONUPPER:    s = '.' + ext.toUpperCase(); break;
    case FileNamingType.SERIALLETTERLOWER:
      s = FileNamingOptions.nextAlphaIndex(aCode, serial);
      hasSerial = true;
      break;
    case FileNamingType.SERIALLETTERUPPER:
      s = FileNamingOptions.nextAlphaIndex(ACode, serial);
      hasSerial = true;
      break;
    }

    if (s) {
      str += s;
      continue;
    }

    var fmt = '';
    switch (fnel.type) {
    case FileNamingType.MMDDYY:   fmt = "%m%d%y"; break;
    case FileNamingType.MMDD:     fmt = "%m%d"; break;
    case FileNamingType.YYYYMMDD: fmt = "%Y%m%d"; break;
    case FileNamingType.YYMMDD:   fmt = "%y%m%d"; break;
    case FileNamingType.YYDDMM:   fmt = "%y%d%m"; break;
    case FileNamingType.DDMMYY:   fmt = "%d%m%y"; break;
    case FileNamingType.DDMM:     fmt = "%d%m"; break;
    }

    if (fmt) {
      str += cdate.strftime(fmt);
      continue;
    }
  }

  if (hasSerial) {
    serial++;
  }

  self._serial = serial;

  return str;
};

FileNamingOptions.nextAlphaIndex = function(base, idx) {
  var str = '';

  while (idx > 0) {
    idx--;
    var m = idx % 26;
    var idx = Math.floor(idx / 26);

    str = String.fromCharCode(m + base) + str;
  }

  return str;
};

FileNamingOptions.prototype.copyTo = function(opts, prefix) {
  var self = this;
  var props = FileNamingOptions.props;

  for (var i = 0; i < props.length; i++) {
    var name = props[i];
    var oname = prefix + name;
    opts[oname] = self[name];
    if (name == 'fileNaming' && self[name] instanceof Array) {
      opts[oname] = self[name].join(',');
    } else {
      opts[oname] = self[name];
    }
  }
};


// this array is folder into FileNamingElement
FileNamingOptions._examples =
  [ "",
    "Document",
    "document",
    "DOCUMENT",
    "1",
    "01",
    "001",
    "0001",
    "a",
    "A",
    "103107",
    "1031",
    "20071031",
    "071031",
    "073110",
    "311007",
    "3110",
    ".Psd",
    ".psd",
    ".PSD"
    ];

FileNamingOptions.prototype.getExample = function() {
  var self = this;
  var str = '';
  return str;
};

FileNamingElement = function(name, menu, type, sm, example) {
  var self = this;
  self.name = name;
  self.menu = menu;
  self.type = type;
  self.smallMenu = sm;
  self.example = (example || '');
};
FileNamingElement.prototype.typename = FileNamingElement;

FileNamingElements = [];
FileNamingElements._add = function(name, menu, type, sm, ex) {
  FileNamingElements.push(new FileNamingElement(name, menu, type, sm, ex));
}

FileNamingElement.NONE = "(None)";

FileNamingElement.SERIALNUMBER5 = {
  toString: function() { return "FileNamingElement.SERIALNUMBER5"; }
};

FileNamingElements._init = function() {

  FileNamingElements._add("", "", "", "", ""); // Same as (None)

  try {
    FileNamingType;
  } catch (e) {
    return;
  }

  // the names here correspond to the sTID symbols used when making
  // a Batch request via the ActionManager interface. Except for "Name",
  // which should be "Nm  ".
  // the names should be the values used when serializing to and from
  // an INI file.
  // A FileNamingOptions object needs to be defined.
  FileNamingElements._add("Name", ZStrs.DocumentName,
                          FileNamingType.DOCUMENTNAMEMIXED,
                          "Name", "Document");
  FileNamingElements._add("lowerCase", ZStrs.LCDocumentName,
                          FileNamingType.DOCUMENTNAMELOWER,
                          "name", "document");
  FileNamingElements._add("upperCase", ZStrs.UCDocumentName,
                          FileNamingType.DOCUMENTNAMEUPPER,
                          "NAME", "DOCUMENT");
  FileNamingElements._add("oneDigit", ZStrs.FN1Digit,
                          FileNamingType.SERIALNUMBER1,
                          "Serial #", "1");
  FileNamingElements._add("twoDigit", ZStrs.FN2Digit,
                          FileNamingType.SERIALNUMBER2,
                          "Serial ##", "01");
  FileNamingElements._add("threeDigit", ZStrs.FN3Digit,
                          FileNamingType.SERIALNUMBER3,
                          "Serial ###", "001");
  FileNamingElements._add("fourDigit", ZStrs.FN4Digit,
                          FileNamingType.SERIALNUMBER4,
                          "Serial ####", "0001");
  FileNamingElements._add("fiveDigit", ZStrs.FN5Digit,
                          FileNamingElement.SERIALNUMBER5,
                          "Serial #####", "00001");
  FileNamingElements._add("lowerCaseSerial", ZStrs.LCSerial,
                          FileNamingType.SERIALLETTERLOWER,
                          "Serial a", "a");
  FileNamingElements._add("upperCaseSerial", ZStrs.UCSerial,
                          FileNamingType.SERIALLETTERUPPER,
                          "Serial A", "A");
  FileNamingElements._add("mmddyy", ZStrs.Date_mmddyy,
                          FileNamingType.MMDDYY,
                          "mmddyy", "103107");
  FileNamingElements._add("mmdd", ZStrs.Date_mmdd,
                          FileNamingType.MMDD,
                          "mmdd", "1031");
  FileNamingElements._add("yyyymmdd", ZStrs.Date_yyyymmdd,
                          FileNamingType.YYYYMMDD,
                          "yyyymmdd", "20071031");
  FileNamingElements._add("yymmdd", ZStrs.Date_yymmdd,
                          FileNamingType.YYMMDD,
                          "yymmdd", "071031");
  FileNamingElements._add("yyddmm", ZStrs.Date_yyddmm,
                          FileNamingType.YYDDMM,
                          "yyddmm", "073110");
  FileNamingElements._add("ddmmyy", ZStrs.Date_ddmmyy,
                          FileNamingType.DDMMYY,
                          "ddmmyy", "311007");
  FileNamingElements._add("ddmm", ZStrs.Date_ddmm,
                          FileNamingType.DDMM,
                          "ddmm", "3110");
  FileNamingElements._add("lowerCaseExtension", ZStrs.LCExtension,
                          FileNamingType.EXTENSIONLOWER,
                          "ext", ".psd");
  FileNamingElements._add("upperCaseExtension", ZStrs.UCExtension,
                          FileNamingType.EXTENSIONUPPER,
                          "EXT", ".PSD");
};
FileNamingElements._init();
FileNamingElements.getByName = function(name) {
  return psx.getByName(FileNamingElements, name);
};

FileNamingOptions.CUSTOM_TEXT_CREATE = "Create";
FileNamingOptions.CUSTOM_TEXT_DELETE = "Delete";
FileNamingOptions.CUSTOM_TEXT_EDIT = "Edit";

FileNamingOptions.createFileNamingPanel = function(pnl, ini,
                                                   prefix,
                                                   useSerial,
                                                   useCompatibility,
                                                   columns) {
  var win = pnl.window;
  if (useSerial == undefined) {
    useSerial = false;
  }
  if (useCompatibility == undefined) {
    useCompatibility = false;
  }
  if (columns == undefined) {
    columns = 3;
  } else {
    if (columns != 2 && columns != 3) {
      Error.runtimeError(9001, "Internal Error: Bad column spec for " +
                         "FileNaming panel");
    }
  }

  pnl.fnmenuElements = [];
  for (var i = 0; i < FileNamingElements.length; i++) {
    var fnel = FileNamingElements[i];
    pnl.fnmenuElements.push(fnel.menu);
  }
  var extrasMenuEls = [
    "-",
    ZStrs.CreateCustomText,
    ZStrs.EditCustomText,
//     ZStrs.DeleteCustomText,
    "-",
    FileNamingElement.NONE,
    ];
  for (var i = 0; i < extrasMenuEls.length; i++) {
    pnl.fnmenuElements.push(extrasMenuEls[i]);
  }

  pnl.win = win;
  if (prefix == undefined) {
    prefix = '';
  }
  pnl.prefix = prefix;

  var w = pnl.bounds[2] - pnl.bounds[0];
  var xofs = 0;
  var y = 0;

  if (pnl.type == 'panel') {
    xofs += 5;
    y += 10;
  }
  pnl.text = ZStrs.FileNaming;

  var tOfs = 3;

  if (columns == 2) {
    var menuW = (w - 50)/2;

  } else {
    var menuW = (w - 65)/3;
  }

  var opts = new FileNamingOptions(ini, pnl.prefix);

  x = xofs;

  pnl.exampleLabel = pnl.add('statictext', [x,y+tOfs,x+70,y+22+tOfs],
                             ZStrs.ExampleLabel);
  x += 70;
  pnl.example = pnl.add('statictext', [x,y+tOfs,x+250,y+22+tOfs], '');
  y += 30;
  x = xofs;

  pnl.menus = [];

  pnl.menus[0]  = pnl.add('dropdownlist', [x,y,x+menuW,y+22],
                          pnl.fnmenuElements);
  x += menuW + 5;
  pnl.add('statictext', [x,y+tOfs,x+10,y+22+tOfs], '+');

  x += 15;

  pnl.menus[1]  = pnl.add('dropdownlist', [x,y,x+menuW,y+22],
                          pnl.fnmenuElements);
  x += menuW + 5;
  pnl.add('statictext', [x,y+tOfs,x+10,y+22+tOfs], '+');

  if (columns == 2) {
    y += 30;
    x = xofs;
  } else {
    x += 15;
  }

  pnl.menus[2]  = pnl.add('dropdownlist', [x,y,x+menuW,y+22],
                          pnl.fnmenuElements);
  x += menuW + 5;
  pnl.add('statictext', [x,y+tOfs,x+10,y+22+tOfs], '+');

  if (columns == 3) {
    y += 30;
    x = xofs;

  } else {
    x += 15;
  }

  pnl.menus[3]  = pnl.add('dropdownlist', [x,y,x+menuW,y+22],
                          pnl.fnmenuElements);
  x += menuW + 5;
  pnl.add('statictext', [x,y+tOfs,x+10,y+22+tOfs], '+');

  if (columns == 2) {
    y += 30;
    x = xofs;

  } else {
    x += 15;
  }

  pnl.menus[4]  = pnl.add('dropdownlist', [x,y,x+menuW,y+22],
                          pnl.fnmenuElements);
  x += menuW + 5;
  pnl.add('statictext', [x,y+tOfs,x+10,y+22+tOfs], '+');

  x += 15;

  pnl.menus[5]  = pnl.add('dropdownlist', [x,y,x+menuW,y+22],
                          pnl.fnmenuElements);
  y += 30;
  x = xofs;

  pnl.addMenuElement = function(text) {
    var pnl = this;
    for (var i = 0; i < 6; i++) {
      var vmenu = pnl.menus[i];
      vmenu.add('item', text);
    }
  }

  pnl.addCustomMenuElement = function(text) {
    var pnl = this;
    if (text == '-') {
      text = '- ';
    }
    for (var i = 0; i < 6; i++) {
      var vmenu = pnl.menus[i];
      var it = menu.find(text);
      if (it == undefined) {
        vmenu.add('item', text);
      }
    }
  }

  pnl.useSerial = useSerial;
  if (useSerial) {
    pnl.startingSerialLbl = pnl.add('statictext', [x,y+tOfs,x+80,y+22+tOfs],
                                    ZStrs.StartingSerialNumber);
    x += 90;
    pnl.startingSerial = pnl.add('edittext', [x,y,x+50,y+22],
                                 opts.startingSerial);
    y += 30;
    x = xofs;
    pnl.startingSerial.onChanging = psx.numberKeystrokeFilter;
    pnl.startingSerial.onChange = function() {
      var pnl = this.parent;
      pnl.onChange();
    }
  }

  pnl.useCompatibility = useCompatibility;
  if (useCompatibility) {
    pnl.add('statictext', [x,y+tOfs,x+80,y+22+tOfs], ZStrs.CompatibilityPrompt);
    x += 90;
    pnl.compatWindows = pnl.add('checkbox', [x,y,x+70,y+22], ZStrs.Windows);
    x += 80;
    pnl.compatMac = pnl.add('checkbox', [x,y,x+70,y+22], ZStrs.MacOS);
    x += 80;
    pnl.compatUnix = pnl.add('checkbox', [x,y,x+70,y+22], ZStrs.Unix);

    pnl.compatWindows.value = opts.windowsCompatible;
    pnl.compatMac.value = opts.macintoshCompatible;
    pnl.compatUnix.value = opts.unixCompatible;
  }

  function menuOnChange() {
    var pnl = this.parent;
    var win = pnl.window;
    if (pnl.processing) {
      return;
    }
    pnl.processing = true;
    try {
      var menu = this;
      if (!menu.selection) {
        return;
      }

      var currentSelection = menu.selection.index;
      var lastSelection = menu.lastMenuSelection;

      menu.lastMenuSelection = menu.selection.index;

      var lastWasCustomText = (lastSelection >= pnl.fnmenuElements.length);

      var sel = menu.selection.text;
      if (sel == FileNamingElement.NONE) {
        menu.selection = menu.items[0];
        sel = menu.selection.text;
      }

      if (sel == ZStrs.CreateCustomText ||
          (sel == ZStrs.EditCustomText && !lastWasCustomText)) {
        var text = FileNamingOptions.createCustomTextDialog(win,
                                                    ZStrs.CreateCustomText,
                                                    "new");
        if (text) {
          if (text == '-') {
            text = '- ';
          }
          if (!menu.find(text)) {
            pnl.addMenuElement(text);
          }

          var it = menu.find(text);
          menu.selection = it;

        } else {
          if (lastSelection >= 0) {
            menu.selection = menu.items[lastSelection];
          } else {
            menu.selection = menu.items[0];
          }
        }

        if (pnl.notifyCustomText) {
          pnl.notifyCustomText(FileNamingOptions.CUSTOM_TEXT_CREATE, text);
        }

      } else if (lastWasCustomText) {
        if (sel == ZStrs.EditCustomText) {
          var lastText = menu.items[lastSelection].text;
          if (lastText == '- ') {
            lastText = '-'
          }
          var text = FileNamingOptions.createCustomTextDialog(win,
                                                      ZStrs.EditCustomText,
                                                      "edit",
                                                      lastText);
          if (text) {
            if (text == '-') {
              text = '- ';
            }
            for (var i = 0; i < 6; i++) {
              var vmenu = pnl.menus[i];
              vmenu.items[lastSelection].text = text;
            }

            var it = menu.find(text);
            menu.selection = it;

            if (pnl.notifyCustomText) {
              if (lastText == '-') {
                lastText = '- ';
              }

              pnl.notifyCustomText(FileNamingOptions.CUSTOM_TEXT_EDIT, text,
                                   lastText);
            }

          } else {
            if (lastSelection >= 0) {
              menu.selection = menu.items[lastSelection];
            } else {
              menu.selection = menu.items[0];
            }
          }

        } else if (sel == ZStrs.DeleteCustomText) {
          var lastText = menu.items[lastSelection].text;
          if (confirm(ZStrs.DeleteCustomTextPrompt.sprintf(lastText))) {
            for (var i = 0; i < 6; i++) {
              var vmenu = pnl.menus[i];
              vmenu.remove(lastSelection);
            }
            menu.selection = menu.items[0];

          } else {
            menu.selection = menu.items[lastSelection];
          }

          if (pnl.notifyCustomText) {
            pnl.notifyCustomText(FileNamingOptions.CUSTOM_TEXT_DELETE, lastText);
          }

        } else {
          //alert("Internal error, Custom Text request");
        }

      } else {
        if (lastSelection >= 0 && (sel == ZStrs.EditCustomText ||
                                   sel == ZStrs.DeleteCustomText)) {
          menu.selection = menu.items[lastSelection];
        }
      }

      menu.lastMenuSelection = menu.selection.index;

      var example = '';
      var format = [];

      for (var i = 0; i < 6; i++) {
        var vmenu = pnl.menus[i];
        if (vmenu.selection) {
          var fmt = '';
          var text = vmenu.selection.text;
          var fne = psx.getByProperty(FileNamingElements, "menu", text);
          if (fne) {
            text = fne.example;
            fmt = fne.name;
          } else {
            fmt = text;
          }

          if (text) {
            if (text == '- ') {
              text = '-';
            }
            example += text;
          }

          if (fmt) {
            if (fmt == '- ') {
              fmt = '-';
            }
            format.push(fmt);
          }
        }
      }
      if (pnl.example) {
        pnl.example.text = example;
      }
      format = format.join(",");
      var win = pnl.window;
      if (win.mgr.updateNamingFormat) {
        win.mgr.updateNamingFormat(format, example);
      }

    } finally {
      pnl.processing = false;
    }

    if (pnl.onChange) {
      pnl.onChange();
    }
  }

  // default all slots to ''
  for (var i = 0; i < 6; i++) {
    var menu = pnl.menus[i];
    menu.selection = menu.items[0];
    menu.lastMenuSelection = 0;
  }

  for (var i = 0; i < 6; i++) {
    var name = opts.fileNaming[i];
    if (name) {
      var fne = FileNamingElements.getByName(name);
      var it;

      if (!fne) {
        if (name == '- ') {
          name = '-';
        }
        it = pnl.menus[i].find(name);
        if (!it) {
          pnl.addMenuElement(name);
          it = pnl.menus[i].find(name);
        }
      } else {
        it = pnl.menus[i].find(fne.menu);
      }
      pnl.menus[i].selection = it;
    }
  }

//   pnl.menus[0].selection = pnl.menus[0].find("document name");
//   pnl.menus[0].lastMenuSelection = pnl.menus[0].selection.index;
//   pnl.menus[1].selection = pnl.menus[1].find("extension");
//   pnl.menus[1].lastMenuSelection = pnl.menus[1].selection.index;

  for (var i = 0; i < 6; i++) {
    var menu = pnl.menus[i];
    menu.onChange = menuOnChange;
  }

  pnl.getFileNamingOptions = function(ini) {
    var pnl = this;
    var fileNaming = [];

    for (var i = 0; i < 6; i++) {
      var menu = pnl.menus[i];

      if (menu.selection) {
        var idx = menu.selection.index;

        if (idx) {
          // [0] is the "" item so we ignore it
          var fnel = FileNamingElements[idx];
          if (fnel) {
            fileNaming.push(fnel.name);

          } else {
            // its a custom naming option
            var txt = menu.selection.text;
            if (txt == '- ') {
              txt = '-';
            }

            // txt = '"' + text + '"';
            fileNaming.push(txt);
          }
        }
      }
    }

    var prefix = pnl.prefix;
    var opts = new FileNamingOptions(ini, prefix);
    opts.fileNaming = fileNaming;

    if (pnl.startingSerial) {
      opts.startingSerial = Number(pnl.startingSerial.text);
    }
    if (pnl.compatWindows) {
      opts.windowsCompatible = pnl.compatWindows.value;
    }
    if (pnl.compatMac) {
      opts.macintoshCompatible = pnl.compatMac.value;
    }
    if (pnl.compatUnix) {
      opts.unixCompatible = pnl.compatUnix.value;
    }
    return opts;
  }
  pnl.getFilenamingOptions = pnl.getFileNamingOptions;

  pnl.updateSettings = function(ini) {
    var pnl = this;

    var opts = new FileNamingOptions(ini, pnl.prefix);

    if (pnl.useSerial) {
      pnl.startingSerial.text = opts.startingSerial;
    }

    if (pnl.useCompatibility) {
      pnl.compatWindows.value = opts.windowsCompatible;
      pnl.compatMac.value = opts.macintoshCompatible;
      pnl.compatUnix.value = opts.unixCompatible;
    }

    // default all slots to ''
    for (var i = 0; i < 6; i++) {
      var menu = pnl.menus[i];
      menu.selection = menu.items[0];
      menu.lastMenuSelection = 0;
    }

    for (var i = 0; i < 6; i++) {
      var name = opts.fileNaming[i];
      if (name) {
        var fne = FileNamingElements.getByName(name);
        var it;

        if (!fne) {
          if (name == '-') {
            name = '- ';
          }
          it = pnl.menus[i].find(name);
          if (!it) {
            pnl.addMenuElement(name);
            it = pnl.menus[i].find(name);
          }
        } else {
          it = pnl.menus[i].find(fne.menu);
        }
        pnl.menus[i].selection = it;
      }
    }

    for (var i = 0; i < 6; i++) {
      var menu = pnl.menus[i];
      menu.onChange = menuOnChange;
    }

    pnl.menus[0].onChange();

    if (pnl.onChange) {
      pnl.onChange();
    }
  }

  pnl.updateCustomText = function(event, text, oldText) {
    var pnl = this;

    if (!event || !text) {
      return;
    }

    if (event == FileNamingOptions.CUSTOM_TEXT_CREATE) {
      if (!pnl.menus[0].find(text)) {
        pnl.addMenuElement(text);
      }

    } else if (event == FileNamingOptions.CUSTOM_TEXT_DELETE) {
      var it = pnl.menus[0].find(text);
      if (it) {
        var idx = it.index;
        for (var i = 0; i < 6; i++) {
          var vmenu = pnl.menus[i];
          vmenu.remove(idx);
        }
      }

    } else if (event == FileNamingOptions.CUSTOM_TEXT_EDIT) {
      if (oldText) {
        var idx = -1;
        var it = pnl.menus[0].find(oldText);
        if (it) {
          idx = it.index;

          for (var i = 0; i < 6; i++) {
            var vmenu = pnl.menus[i];
            vmenu.items[idx].text = text;
          }
        } else {
          pnl.updateCustomText(FileNamingOptions.CUSTOM_TEXT_CREATE,
                               text);
        }
      } else {
        pnl.updateCustomText(FileNamingOptions.CUSTOM_TEXT_CREATE,
                             text);
      }
    }

    if (pnl.onChange) {
      pnl.onChange();
    }
  }

  pnl.menus[0].onChange();

  if (pnl.onChange) {
    pnl.onChange();
  }

  return pnl;
};
FileNamingOptions.createCustomTextDialog = function(win, title, mode, init) {
  var rect = {
    x: 200,
    y: 200,
    w: 350,
    h: 150
  };

  function rectToBounds(r) {
    return[r.x, r.y, r.x+r.w, r.y+r.h];
  };

  var cwin = new Window('dialog', title || ZStrs.CustomTextEditor,
                        rectToBounds(rect));

  cwin.text = title || ZStrs.CustomTextEditor;
  if (win) {
    cwin.center(win);
  }

  var xofs = 10;
  var y = 10;
  var x = xofs;

  var tOfs = 3;

  cwin.add('statictext', [x,y+tOfs,x+300,y+22+tOfs], ZStrs.CustomTextPrompt);

  y += 30;
  cwin.customText = cwin.add('edittext', [x,y,x+330,y+22]);

  cwin.customText.onChanging = function() {
    cwin = this.parent;
    var text = cwin.customText.text;

    if (cwin.initText) {
      cwin.saveBtn.enabled = (text.length > 0) && (text != cwin.initText);
    } else {
      cwin.saveBtn.enabled = (text.length > 0);
    }
  }

  if (init) {
    cwin.customText.text = init;
    cwin.initText = init;
  }

  y += 50;
  x += 100;
  cwin.saveBtn = cwin.add('button', [x,y,x+70,y+22], ZStrs.Save);
  cwin.saveBtn.enabled = false;

  x += 100;
  cwin.cancelBtn = cwin.add('button', [x,y,x+70,y+22], ZStrs.Cancel);

  cwin.defaultElement = cwin.saveBtn;

  cwin.customText.active = true;

  cwin.onShow = function() {
    this.customText.active = true;
  }

  var res = cwin.show();
  return (res == 1) ? cwin.customText.text : undefined;
};

FileNamingOptions.validateFileNamingPanel = function(pnl, opts) {
  var self = this;
  var win = pnl.window;
  var fopts = pnl.getFileNamingOptions(opts);

  if (fopts.fileNaming.length == 0) {
    return self.errorPrompt("You must specify a name for the files.");
  }

  fopts.copyTo(opts, pnl.prefix);

  return opts;
};


//======================== Font Panel =================================
//
// Function: createFontPanel
// Description: Creates a font selector panel
// Input: pnl - the panel that will be populated
//        ini - an object that contains initial values (not used)
//        label  - the lable for the panel (opt)
//        lwidth - the width to use for the lable in the UI
// Return: the panel
//
psxui.createFontPanel = function(pnl, ini, label, lwidth) {
  var win = pnl.window;

  pnl.win = win;

  var w = pnl.bounds[2] - pnl.bounds[0];
  var xofs = 0;
  var y = 0;

  if (pnl.type == 'panel') {
    xofs += 5;
    y += 5;
  }

  var tOfs = 3;
  var x = xofs;

  if (label == undefined) {
    label = ZStrs.FontLabel;
    lwidth = pnl.graphics.measureString(label)[0] + 5;
  }

  if (label != '') {
    pnl.label = pnl.add('statictext', [x,y+tOfs,x+lwidth,y+22+tOfs], label);
    pnl.label.helpTip = ZStrs.FontTip;
    x += lwidth;
  }
  pnl.family = pnl.add('dropdownlist', [x,y,x+180,y+22]);
  pnl.family.helpTip = ZStrs.FontTip;
  x += 185;
  pnl.style  = pnl.add('dropdownlist', [x,y,x+110,y+22]);
  pnl.style.helpTip = ZStrs.FontStyleTip; 
  x += 115;
  pnl.fontSize  = pnl.add('edittext', [x,y,x+30,y+22], "12");
  pnl.fontSize.helpTip = ZStrs.FontSizeTip; 
  x += 34;
  pnl.sizeLabel = pnl.add('statictext', [x,y+tOfs,x+15,y+22+tOfs],
                          ZStrs.UnitsPT);

  var lbl = pnl.sizeLabel;
  lbl.bounds.width = pnl.graphics.measureString(ZStrs.UnitsPT)[0] + 3;

  // make adjustments if panel is not wide enough to display all of the
  // controls steal space from the family and style dropdown menus
  var pw = pnl.bounds.width;
  var slMax = pnl.sizeLabel.bounds.right;
  var diff = slMax - pw;
  if (diff > 0) {
    diff += 6; // for padding on the right side
    var delta = Math.ceil(diff/2);
    pnl.family.bounds.width -= delta;
    pnl.style.bounds.left -= delta;
    delta *= 2;
    pnl.style.bounds.width -= delta;
    pnl.fontSize.bounds.left -= delta;
    pnl.fontSize.bounds.right -= delta;
    pnl.sizeLabel.bounds.left -= delta;
    pnl.sizeLabel.bounds.right -= delta;
  }

  pnl.fontTable = psxui._getFontTable();
  var names = [];
  for (var idx in pnl.fontTable) {
    names.push(idx);
  }
  // names.sort();
  for (var i = 0; i < names.length; i++) {
    pnl.family.add('item', names[i]);
  }

  pnl.family.onChange = function() {
    var pnl = this.parent;
    var sel = pnl.family.selection.text;
    var family = pnl.fontTable[sel];

    pnl.style.removeAll();

    var styles = family.styles;

    for (var i = 0; i < styles.length; i++) {
      var it = pnl.style.add('item', styles[i].style);
      it.font = styles[i].font;
    }
    if (pnl._defaultStyle) {
      var it = pnl.style.find(pnl._defaultStyle);
      pnl._defaultStyle = undefined;
      if (it) {
        it.selected = true;
      } else {
        pnl.style.items[0].selected = true;
      }
    } else {
      pnl.style.items[0].selected = true;
    }
  };
  pnl.family.items[0].selected = true;

  pnl.fontSize.onChanging = psxui.numericKeystrokeFilter;

//
// Function: setFont
// Description: set the font and font size
// Input: str  - TextFont or the font name
//        size - the font size in points 
// Return: <none>
//
  pnl.setFont = function(str, size) {
    var pnl = this;
    if (!str) {
      return;
    }
    var font = (str.typename == "TextFont") ? str : psx.determineFont(str);
    if (!font) {
      font = psx.getDefaultFont();
    }
    if (font) {
      var it = pnl.family.find(font.family);
      if (it) {
        it.selected = true;
        pnl._defaultStyle = font.style;
      }
    }
    pnl.fontSize.text = size;
    pnl._fontSize = size;
    pnl.family.onChange();
  };

//
// Function: getFont
// Description: Gets the current font and font size
// Input:  <none> 
// Return: an object containing the font and size
//
  pnl.getFont = function() {
    var pnl = this;
    var font = pnl.style.selection.font;
    return { font: font.postScriptName, size: toNumber(pnl.fontSize.text) };

    var fsel = pnl.family.selection.text;
    var ssel = pnl.style.selection.text;
    var family = pnl.fontTable[sel];
    var styles = familyStyles;
    var font = undefined;

    for (var i = 0; i < styles.length && font == undefined; i++) {
      if (styles[i].style == ssel) {
        font = styles[i].font;
      }
    }
    return { font: font, size: toNumber(font.fontSize) };
  }

  return pnl;
};

//
// Function: _getFontTable
// Description: Used by the Font Panel. Creates a table that
//              maps font names to their styles
// Input:  <none> 
// Return: an object where the names are font.family and the
//         values are objects containing the font family and styles
//
psxui._getFontTable = function() {
  var fonts = app.fonts;
  var fontTable = {};
  for (var i = 0; i < fonts.length; i++) {
    var font = fonts[i];
    var entry = fontTable[font.family];
    if (!entry) {
      entry = { family: font.family, styles: [] };
      fontTable[font.family] = entry;
    }
    entry.styles.push({ style: font.style, font: font });
  }
  return fontTable;
};

//
// Function: _getFontArray
// Description: 
// Input:  <none> 
// Return: an array of font info objects created by _getFontTable
//
psxui._getFontArray = function() {
  var fontTable = psxui._getFontTable();
  var fonts = [];
  for (var idx in fontTable) {
    var f = fontTable[idx];
    fonts.push(f);
  }
  return fonts;
};

//
// Function: createProgressPalette
// Description: Opens up a palette window with a progress bar that can be
//              'asynchronously' while the script continues running
// Input:
//   title     the window title
//   min       the minimum value for the progress bar
//   max       the maximum value for the progress bar
//   parent    the parent ScriptUI window (opt)
//   useCancel flag for having a Cancel button (opt)
//   msg        message that can be displayed and changed in the palette (opt)
//
//   onCancel  This method will be called when the Cancel button is pressed.
//             This method should return 'true' to close the progress window
// Return: The palette window
//
psxui.createProgressPalette = function(title, min, max,
                                       parent, useCancel, msg) {
  var opts = {
    closeButton: false,
    maximizeButton: false,
    minimizeButton: false
  };
  var win = new Window('palette', title, undefined, opts);
  win.bar = win.add('progressbar', undefined, min, max);
  if (msg) {
    win.msg = win.add('statictext');
    win.msg.text = msg;
  }
  win.bar.preferredSize = [500, 20];

  win.parentWin = undefined;
  win.recenter = false;
  win.isDone = false;

  if (parent) {
    if (parent instanceof Window) {
      win.parentWin = parent;
    } else if (useCancel == undefined) {
      useCancel = !!parent;
    }
  }

  if (useCancel) {
    win.onCancel = function() {
      this.isDone = true;
      return true;  // return 'true' to close the window
    };

    win.cancel = win.add('button', undefined, ZStrs.Cancel);

    win.cancel.onClick = function() {
      var win = this.parent;
      try {
        win.isDone = true;
        if (win.onCancel) {
          var rc = win.onCancel();
          if (rc != false) {
            if (!win.onClose || win.onClose()) {
              win.close();
            }
          }
        } else {
          if (!win.onClose || win.onClose()) {
            win.close();
          }
        }
      } catch (e) {
        LogFile.logException(e, '', true);
      }
    };
  }

  win.onClose = function() {
    this.isDone = true;
    return true;
  };

  win.updateProgress = function(val) {
    var win = this;

    if (val != undefined) {
      win.bar.value = val;
    }
//     else {
//       win.bar.value++;
//     }

    if (win.recenter) {
      win.center(win.parentWin);
    }

    win.update();
    win.show();
    // win.hide();
    // win.show();
  };

  win.recenter = true;
  win.center(win.parent);

  return win;
};

"psx.jsx";
// EOF

//
//
// CSIIConst
//
// $Id: CSIIConst.jsx,v 1.5 2012/03/03 01:06:52 anonymous Exp $
// Copyright: (c)2011, xbytor
// Author: xbytor@gmail.com
//
//
//@show include
//
//

try {
  var _lvl = $.level;
  $.level = 0;
  ZStrings;
} catch (e) {
  ZStrings = {};
} finally {
  $.level = _lvl;
  delete _lvl;
}

// Setup locale-specific strings

ZStrings.Photoshop =
  localize("$$$/AETE/Common/Photoshop=Photoshop");

ZStrings.Bridge =
  localize("$$$/JavaScripts/ContactSheet2/Bridge=Bridge");

ZStrings.SourceIntro =
  localize("$$$/JavaScripts/ContactSheet2/SourceIntro=Select files for Contact Sheet(s)");

ZStrings.LoadSettingsFile =
  localize("$$$/JavaScripts/ContactSheet2/LoadSettingsFile=Load Contact Sheet Settings");

ZStrings.SaveSettingsFile =
  localize("$$$/JavaScripts/ContactSheet2/SaveSettingsFile=Save Contact Sheet Settings");

ZStrings.XMLFileDlgPattern =
  localize("$$$/JavaScripts/ContactSheet2/XMLFileDlgPattern=XML File: *.xml");

ZStrings.SettingsForCSII =
  localize("$$$/JavaScripts/ContactSheet2/SettingsForCSII=Settings for Contact Sheet II");

ZStrings.ConfirmReset =
  localize("$$$/JavaScripts/ContactSheet2/ConfirmReset=Restore default settings?");

ZStrings.DefaultSettingsMissingErr =
  localize("$$$/JavaScripts/ContactSheet2/DefaultSettingsMissingErr=The default settings file is missing");

ZStrings.ContactSheetIIName =
  localize("$$$/AdobePlugin/ContactSheet2/Name=Contact Sheet II");

ZStrings.CSIIFileName = ZStrings.ContactSheetIIName;

ZStrings.ContactSheetIIPluginName =
  localize("$$$/AdobePlugin/PIPLInfo/PluginName/ContactSheetII=Contact Sheet II...");

ZStrings.ContactSheetIIUIError = 
  localize("$$$/JavaScripts/ContactSheet2/ContactSheetIIUIError=Error in ContactSheet II UI");

ZStrings.ContactSheetIIProcessingError = 
  localize("$$$/JavaScripts/ContactSheet2/ContactSheetIIProcessingError=Error in ContactSheet Processing");

ZStrings.ContactSheetIISettingsError = 
  localize("$$$/JavaScripts/ContactSheet2/ContactSheetIISettingsError=Error saving ContactSheet settings");

ZStrings.ErrorInProcessing = 
  localize("$$$/JavaScripts/ContactSheet2/ErrorInProcessing=Error in processing: ");

ZStrings.BadRecordingFmt = 
  localize("$$$/JavaScripts/ContactSheet2/BadRecordingFmt=Bad %%s information recorded in action.");

ZStrings.BadFolder = 
  localize("$$$/JavaScripts/ContactSheet2/BadFolder=folder");

ZStrings.BadSource = 
  localize("$$$/JavaScripts/ContactSheet2/BadSource=source");

ZStrings.BadUnits = 
  localize("$$$/JavaScripts/ContactSheet2/BadUnits=Units");

ZStrings.BadResolution = 
  localize("$$$/JavaScripts/ContactSheet2/BadResolution=Resolution Units");

ZStrings.BadColorMode = 
  localize("$$$/JavaScripts/ContactSheet2/BadColorMode=Color Mode");

ZStrings.ProfileConversionError = 
  localize("$$$/JavaScripts/ContactSheet2/ProfileConversionError=Unknown color profile error");

ZStrings.BridgeFilesNotSelected = 
  localize("$$$/JavaScripts/ContactSheet2/BridgeFilesNotSelected=Files not selected in Bridge");

//
// Source Images Panel
//
ZStrings.SourceImages =
  localize("$$$/JavaScripts/ContactSheet2/SourceImages=Source Images");

ZStrings.SourcePnlBtnWidth =
  localize("$$$/locale_specific/JavaScripts/ContactSheet2/SourcePnlBtnWidth=120");

ZStrings.UseLabel =
  localize("$$$/JavaScripts/ContactSheet2/UseLabel=Use:");

ZStrings.UseTip = 
  localize("$$$/JavaScripts/ContactSheet2/UseTip=Select whether to use files or a folder of images");

ZStrings.CurrentDocs =
  localize("$$$/JavaScripts/ContactSheet2/CurrentDocs=Open Documents");

ZStrings.Directories =
  localize("$$$/JavaScripts/ContactSheet2/Directories=Directories");

ZStrings.Files =
  localize("$$$/JavaScripts/ContactSheet2/Files=Files");

ZStrings.Folder =
  localize("$$$/JavaScripts/ContactSheet2/Folder=Folder");

ZStrings.Browse =
  localize("$$$/JavaScripts/ContactSheet2/Browse=Browse...");

ZStrings.Remove =
  localize("$$$/JavaScripts/ContactSheet2/Remove=Remove");

ZStrings.AddOpenFiles =
  localize("$$$/JavaScripts/ContactSheet2/AddOpenFiles=Add Open Files");

ZStrings.AddBridgeFiles =
  localize("$$$/JavaScripts/ContactSheet2/AddBridgeFiles=Add Bridge Files");

ZStrings.Choose =
  localize("$$$/JavaScripts/ContactSheet2/Choose=Choose...");

ZStrings.ChooseSourceFolderTip =
  localize("$$$/JavaScripts/ContactSheet2/ChooseSourceFolderTip=Select the folder of images to use");

ZStrings.IncludeSubfolders =
  localize("$$$/JavaScripts/ContactSheet2/IncludeSubfolders=Include Subfolders");

ZStrings.IncludeSubfoldersTip =
  localize("$$$/JavaScripts/ContactSheet2/IncludeSubfoldersTip=Include all images in all subfolders");

ZStrings.GroupByFolder =
  localize("$$$/JavaScripts/ContactSheet2/GroupByFolder=Group Images by Folder");

ZStrings.GroupByFolderTip =
  localize("$$$/JavaScripts/ContactSheet2/GroupByFolderTip=Images in subfolders will start on a new Contact Sheet");

ZStrings.FilesSelectedFmt =
  localize("$$$/JavaScripts/ContactSheet2/FilesSelectedFmt=%%d files selected");

//
// Document Panel
//
ZStrings.Document =
  localize("$$$/JavaScripts/ContactSheet2/Document=Document");

ZStrings.DocumentPnlCol2 =
  localize("$$$/locale_specific/JavaScripts/ContactSheet2/DocumentPnlCol2=90");

ZStrings.UnitsLabel = 
  localize("$$$/JavaScripts/ContactSheet2/UnitsLabel=Units:");

ZStrings.UnitsTip = 
  localize("$$$/JavaScripts/ContactSheet2/UnitsTip=Select the unit");

ZStrings.WidthLabel = 
  localize("$$$/JavaScripts/ContactSheet2/WidthLabel=Width:");

ZStrings.Width =
  localize("$$$/JavaScripts/ContactSheet2/Width=Width");

ZStrings.WidthTip =
  localize("$$$/JavaScripts/ContactSheet2/WidthTip=Select the width");

ZStrings.HeightLabel = 
  localize("$$$/JavaScripts/ContactSheet2/HeightLabel=Height:");

ZStrings.Height = 
  localize("$$$/JavaScripts/ContactSheet2/Height=Height");

ZStrings.HeightTip = 
  localize("$$$/JavaScripts/ContactSheet2/HeightTip=Select the height");

ZStrings.ResolutionLabel = 
  localize("$$$/JavaScripts/ContactSheet2/ResolutionLabel=Resolution:");

ZStrings.Resolution =
  localize("$$$/JavaScripts/ContactSheet2/Resolution=Resolution");

ZStrings.ResolutionTip =
  localize("$$$/JavaScripts/ContactSheet2/ResolutionTip=Select the resolution");

ZStrings.ModeLabel =
  localize("$$$/JavaScripts/ContactSheet2/ModeLabel=Mode:");

ZStrings.Mode =
  localize("$$$/JavaScripts/ContactSheet2/Mode=Mode");

ZStrings.ModeTip =
  localize("$$$/JavaScripts/ContactSheet2/ModeTip=Select the color mode");

ZStrings.BitDepthLabel =
  localize("$$$/JavaScripts/ContactSheet2/BitDepthLabel=Bit Depth:");

ZStrings.BitDepthTip =
  localize("$$$/JavaScripts/ContactSheet2/BitDepthTip=Select the bit depth");

ZStrings.ColorProfileLabel =
  localize("$$$/JavaScripts/ContactSheet2/ColorProfileLabel=Color Profile:");

ZStrings.ColorProfileTip =
  localize("$$$/JavaScripts/ContactSheet2/ColorProfileTop=Select the color profile");

ZStrings.FlattenAllLayers =
  localize("$$$/JavaScripts/ContactSheet2/FlattenAllLayers=Flatten All Layers");

ZStrings.FlattenAllLayersTip =
  localize("$$$/JavaScripts/ContactSheet2/FlattenAllLayersTip=Flattened images will only have a background layer");

ZStrings.Flattened =
  localize("$$$/JavaScripts/ContactSheet2/Flattened=Flattened Layers");


ZStrings.Centimeter =
  localize("$$$/JavaScripts/ContactSheet2/Centimeter=cm");

ZStrings.Inches =
  localize("$$$/JavaScripts/ContactSheet2/Inches=inches");

ZStrings.Pixels =
  localize("$$$/JavaScripts/ContactSheet2/Pixels=pixels");

ZStrings.PixelsPerInch =
  localize("$$$/JavaScripts/ContactSheet2/Pixels/Inch=pixels/inch");

ZStrings.PixelsPerCM =
  localize("$$$/JavaScripts/ContactSheet2/Pixels/cm=pixels/cm");

ZStrings.CMYKMode = ZStrs.CMYKMode;

ZStrings.GrayscaleMode = ZStrs.GrayscaleMode;

ZStrings.LabMode = ZStrs.LabMode;

ZStrings.RGBMode = ZStrs.RGBMode;

ZStrings.BitDepth8 =
  localize("$$$/Info/Depth/8Bit=8-bit");

ZStrings.BitDepth16 =
  localize("$$$/Info/Depth/16Bit=16-bit");

//
// Thumbnails Panel
//
ZStrings.Thumbnails =
  localize("$$$/JavaScripts/ContactSheet2/Thumbnails=Thumbnails");

ZStrings.PlaceLabel =
  localize("$$$/JavaScripts/ContactSheet2/PlaceLabel=Place:");

ZStrings.PlaceTip =
  localize("$$$/JavaScripts/ContactSheet2/PlaceTip=Select which direction the images appear on the Contact Sheet");

ZStrings.AcrossFirst = 
  localize("$$$/JavaScripts/ContactSheet2/AcrossFirst=across first");

ZStrings.DownFirst = 
  localize("$$$/JavaScripts/ContactSheet2/DownFirst=down first");

ZStrings.ColumnsLabel =
  localize("$$$/JavaScripts/ContactSheet2/ColumnsLabel=Columns:");

ZStrings.Columns =
  localize("$$$/JavaScripts/ContactSheet2/Columns=Columns");

ZStrings.ColumnsTip =
  localize("$$$/JavaScripts/ContactSheet2/ColumnsTip=Enter the number of columns");

ZStrings.RowsLabel =
  localize("$$$/JavaScripts/ContactSheet2/RowsLabel=Rows:");

ZStrings.Rows =
  localize("$$$/JavaScripts/ContactSheet2/Rows=Rows");

ZStrings.RowsTip =
  localize("$$$/JavaScripts/ContactSheet2/RowsTip=Enter the number of rows");

ZStrings.NumberOfColumns =
  localize("$$$/JavaScripts/ContactSheet2/NumberOfColumns=number of columns");

ZStrings.NumberOfRows =
  localize("$$$/JavaScripts/ContactSheet2/NumberOfRows=number of rows");

ZStrings.UseAutoSpacing =
  localize("$$$/JavaScripts/ContactSheet2/UseAutoSpacing=Use Auto-Spacing");

ZStrings.UseAutoSpacingTip =
  localize("$$$/JavaScripts/ContactSheet2/UseAutoSpacingTip=Select spacing between images");

ZStrings.VerticalLabel =
  localize("$$$/JavaScripts/ContactSheet2/VerticalLabel=Vertical:");

ZStrings.Vertical =
  localize("$$$/JavaScripts/ContactSheet2/Vertical=Vertical");

ZStrings.VerticalTip =
  localize("$$$/JavaScripts/ContactSheet2/VerticalTip=Enter vertical spacing between images");

ZStrings.VerticalSpacing =
  localize("$$$/JavaScripts/ContactSheet2/VerticalSpacing=Vertical Spacing");

ZStrings.HorizontalLabel =
  localize("$$$/JavaScripts/ContactSheet2/HorizontalLabel=Horizontal:");

ZStrings.Horizontal =
  localize("$$$/JavaScripts/ContactSheet2/Horizontal=Horizontal");

ZStrings.HorizontalTip =
  localize("$$$/JavaScripts/ContactSheet2/HorizontalTip=Enter horizontal spacing between images");

ZStrings.HorizontalSpacing =
  localize("$$$/JavaScripts/ContactSheet2/HorizontalSpacing=Horizontal Spacing");

ZStrings.RotateForBestFit =
  localize("$$$/JavaScripts/ContactSheet2/RotateForBestFit=Rotate For Best Fit");

ZStrings.RotateForBestFitTip =
  localize("$$$/JavaScripts/ContactSheet2/RotateForBestFitTip=Rotate images when necessary for a better fit");


ZStrings.PlaceAcrossFirst =
  localize("$$$/JavaScripts/ContactSheet2/PlaceAcrossFirst=place across first");

ZStrings.ResolutionUnit =
  localize("$$$/JavaScripts/ContactSheet2/ResolutionUnit=Resolution Unit");

ZStrings.SheetHeight =
  localize("$$$/JavaScripts/ContactSheet2/SheetHeight=sheet height");

ZStrings.SheetWidth =
  localize("$$$/JavaScripts/ContactSheet2/SheetWidth=sheet width");

ZStrings.Source2 =
  localize("$$$/JavaScripts/ContactSheet2/Source2=source");

ZStrings.Source =
  localize("$$$/JavaScripts/ContactSheet2/Source=source");

ZStrings.WidthHeightUnit =
  localize("$$$/JavaScripts/ContactSheet2/WidthHeightUnit=Width Height Unit");

ZStrings.ContactSheet2Name =
  localize("$$$/AdobePlugin/ContactSheet2/Name=Contact Sheet II");


//
// Caption Panel
//
ZStrings.FilenameAsCaption =
  localize("$$$/JavaScripts/ContactSheet2/FilenameAsCaption=Use Filename as Caption");

ZStrings.FilenameCaption =
  localize("$$$/JavaScripts/ContactSheet2/FilenameCaption=filename caption");

ZStrings.Font =
  localize("$$$/JavaScripts/ContactSheet2/Font=font");

ZStrings.FontSize =
  localize("$$$/JavaScripts/ContactSheet2/FontSize=Font Size");

ZStrings.MacCourier =
  localize("$$$/JavaScripts/MeasurementScaleMarker/TextFont/Mac/Courier=Courier");
// was AETE/ContactSheet2/Mac/Courier=Courier
// mapped to Myriad Pro for en_*

ZStrings.MacSansSerif =
  localize("$$$/JavaScripts/MeasurementScaleMarker/TextFont/Mac/Helvetica=Helvetica");
// was AETE/ContactSheet2/Mac/SansSerif=Helvetica
// mapped to Minion Pro for en_*

ZStrings.MacSansSerifFaceName =
  localize("$$$/JavaScripts/MeasurementScaleMarker/TextFontFaceName/Mac/Helvetica=Helvetica");

ZStrings.MacSerif =
  localize("$$$/JavaScripts/MeasurementScaleMarker/TextFont/Mac/TimesNewRoman=Times New Roman");
// was AETE/ContactSheet2/Mac/Serif=Times
// mapped to Lucida Grande for en_*

ZStrings.WinCourier =
  localize("$$$/JavaScripts/MeasurementScaleMarker/TextFont/Windows/Courier=Courier");
// was AETE/ContactSheet2/Win/Courier=Courier

ZStrings.WinSansSerif =
  localize("$$$/JavaScripts/MeasurementScaleMarker/TextFont/Windows/Arial=Arial")
// was AETE/ContactSheet2/Win/SansSerif=Arial

ZStrings.WinSansSerifFaceName =
  localize("$$$/JavaScripts/MeasurementScaleMarker/TextFontFaceName/Windows/Arial=Arial")

ZStrings.WinSerif =
  localize("$$$/JavaScripts/MeasurementScaleMarker/TextFont/Windows/TimesNewRoman=Times New Roman");
// was AETE/ContactSheet2/Win/Serif=Times New Roman


ZStrings.FontArial = 
  localize("$$$/JavaScripts/ContactSheet2/FontArial=ArialMT");

ZStrings.ContactSheetFilenameFormat = 
  localize("$$$/JavaScripts/ContactSheet2/ContactSheetFilenameFormat=ContactSheet-%%03d");

ZStrings.FolderSelect = 
  localize("$$$/JavaScripts/ContactSheet2/FolderSelect=Select folder");

ZStrings.BrowseForFolder = 
  localize("$$$/JavaScripts/ContactSheet2/BrowseForFolder=Browse For Folder");

ZStrings.NoFolderSelected = 
  localize("$$$/JavaScripts/ContactSheet2/NoFolderSelected=[Select Image Folder]");

ZStrings.InvalidValueMsg =
  localize("$$$/JavaScripts/ContactSheet2/InvalidValueMsg=Invalid value for %%s. Last good value inserted.");

ZStrings.InvalidNumberMsg =
  localize("$$$/JavaScripts/ContactSheet2/InvalidNumberMsg=Invalid numeric value for %%s. Last good value inserted.");

ZStrings.NumberOutOfRangeMsg =
  localize("$$$/JavaScripts/ContactSheet2/NumberOutOfRangeMsg=%%s is out of range.^r^nPlease specify a number between %%.03f and %%.03f. Closest value inserted.");

ZStrings.BadLegacyFont = 
  localize("$$$/JavaScripts/ContactSheet2/BadLegacyFont=Bad font in Legacy Action");

ZStrings.UnknownInternalError = 
  localize("$$$/JavaScripts/ContactSheet2/UnknownInternalError=Unknown Internal Error");

ZStrings.UserCancelledProcessing =
  localize("$$$/JavaScripts/ContactSheet2/UserCancelledProcessing=User cancelled processing.");

ZStrings.OK =
  localize("$$$/JavaScripts/ContactSheet2/OK=OK");

ZStrings.Cancel =
  localize("$$$/JavaScripts/ContactSheet2/Cancel=Cancel");

ZStrings.Load =
  localize("$$$/JavaScripts/ContactSheet2/Load=Load...");

ZStrings.Save =
  localize("$$$/JavaScripts/ContactSheet2/Save=Save...");

ZStrings.Reset =
  localize("$$$/JavaScripts/ContactSheet2/Reset=Reset...");

ZStrings.ProcessingSheets = 
  localize("$$$/JavaScripts/ContactSheet2/ProcessingSheets=Contact Sheet II - Processing %%d of %%d sheets...");

ZStrings.PressESC =
  localize("$$$/JavaScripts/ContactSheet2/PressESC=Press the ESC key to Cancel processing images");

ZStrings.VersionWarning =
  localize("$$$/JavaScripts/ContactSheet2/VersionWarning=This script requires at least version %%d of Photoshop");

ZStrings.LogFileReference =
  localize("$$$/JavaScripts/ContactSheet2/LogFileReference=More information can be found in the log file:");

ZStrings.ErrorDetailsPrompt =
  localize("$$$/JavaScripts/ContactSheet2/ErrorDetailsPrompt=There was an error. See details?");

ZStrings.NoSettingsError =
  localize("$$$/JavaScripts/ContactSheet2/NoSettingsError=No settings available");

ZStrings.NoImageFiles =
  localize("$$$/JavaScripts/ContactSheet2/NoImageFiles=No image files were found.");

ZStrings.ImageDoesNotExistFmt =
  localize("$$$/JavaScripts/ContactSheet2/ImagDoesNotExistFmt=Image %%s does not exist.");

ZStrings.SelectAnImageFolderWarning =
  localize("$$$/JavaScripts/ContactSheet2/SelectAnImageFolderWarning=Select an Image Folder");

ZStrings.SelectImageFilesWarning =
  localize("$$$/JavaScripts/ContactSheet2/SelectImageFilesWarning=Please select image files for processing");

ZStrings.ReadSettingsError =
  localize("$$$/JavaScripts/ContactSheet2/ReadSettingsError=Error reading settings: ");

ZStrings.ActionRecordingError = 
  localize("$$$/JavaScripts/ContactSheet2/ActionRecordingError=Internal Error. Unable to record as an Action step: ");

ZStrings.ErrorsDetectedFmt = 
  localize("$$$/JavaScripts/ContactSheet2/ErrorsDetectedFmt=%%d errors were detected.");

ZStrings.CreateFailure = 
  localize("$$$/JavaScripts/ContactSheet2/CreateFailure=Unable create new Contact Sheet document.^rPlease check your document dimensions and units");

ZStrings.InvalidThumbnailSize = 
  localize("$$$/JavaScripts/ContactSheet2/InvalidThumbnailSize=The values you have entered for document width or height, thumbnail columns or rows and font size produce an invalid thumbnail size.");


// CSII is a namespace for constants and enumerations used in this script
CSII = function() {};

CSII.UUID = "0B71D221-F8CE-11d2-B21B-0008C75B322C";

CSII.CONTACT_SHEET = ZStrings.ContactSheetIIName;
CSII.CS_LAYER_NAME = CSII.CONTACT_SHEET;

CSII.RELEASE = "2.2.9";

CSII.FILE = CSII.CONTACT_SHEET + CSII.RELEASE.replace(/\./g, '_') + ".jsx";

CSII.VERSION  = "v" + CSII.RELEASE;
CSII.REVISION = "$Revision: 1.5 $";
CSII.TITLE = ZStrings.ContactSheetIIName;

CSII.CW  = 'CW';
CSII.CCW = 'CCW';

CSII.TOP = 'Top';
CSII.MIDDLE = 'Middle';
CSII.BOTTOM = 'Bottom';

CSII.LEFT = 'Left';
CSII.CENTER = 'Center';
CSII.RIGHT = 'Right';

CSII.NO_CAPTION_STYLE = 'None';
CSII.NO_THUMB_STYLE = 'None';

CSII.REQUIRED_PS_VERSION = 12;

CSII.kForceRecording = sTID('forceRecording');
CSII.kCSIISettings = sTID('CSIISettings');
CSII.kFilesList = sTID('filesList');
CSII.kMessage = cTID('Msge');
CSII.kFileOpenError = 9050;

// Controls whether or not a flattened sheet has an
// empty background layer with the sheet (true) or not (false)
CSII.USE_LEGACY_FLATTEN = false;


// CSIIDefaults are values for initially populating the UI
CSIIDefaults = {};

// Source settings
CSIIDefaults.imageSource = ZStrings.Folder;
CSIIDefaults.path = "";
CSIIDefaults.includeSubfolders = true;
CSIIDefaults.groupImages = false;


// Document settings
CSIIDefaults.units = ZStrings.Inches;
CSIIDefaults.width = 8;
CSIIDefaults.height = 10;
CSIIDefaults.resolution = 300;
CSIIDefaults.resUnits = ZStrings.PixelsPerInch;
CSIIDefaults.mode = ZStrings.RGBMode;
CSIIDefaults.bitDepth = ZStrings.BitDepth8;
CSIIDefaults.colorProfile = ZStrs.ProfileSRGB;
CSIIDefaults.flattenLayers = true;

CSIIDefaults.pixelsPerInch = "pixels/inch"
CSIIDefaults.pixelsPerInch = "pixels/cm";

// Thumbnail settings
CSIIDefaults.place = ZStrings.AcrossFirst;
CSIIDefaults.cols = 5;
CSIIDefaults.rows = 6;
CSIIDefaults.bestFit = false;
CSIIDefaults.useAutospacing = true;
CSIIDefaults.vert = 0.014;  // 1 px @ 72 ppi
CSIIDefaults.horz = 0.014;  // 1 px @ 72 ppi

CSIIDefaults.acrossFirst = "across first"
CSIIDefaults.downFirst = "across first"


// Caption settings
CSIIDefaults.captionEnabled = true;
CSIIDefaults.fontName = (isWindows() ?
                         ZStrings.WinSansSerif : ZStrings.MacSansSerif);
CSIIDefaults.fontFaceName = (isWindows() ?
                             ZStrings.WinSansSerifFaceName :
                             ZStrings.MacSansSerifFaceName);
CSIIDefaults.fontSize = 12;

CSIIDefaults.OUTPUT_PREFIX = "sheet_";
CSIIDefaults.FILENAME_FMT = "sheet_%03d";


// IDs for Legacy interface
Keys = {};
Keys.InputLocation = cTID('InpD');
Keys.OutputLocation = cTID('OutD');
Keys.UseFrontmostDoc = cTID('Frnt');
Keys.DocType = cTID('DcTy');
Keys.DocDest = cTID('DcDs');
Keys.ThumbSize = cTID('ThSz');
Keys.LayoutFile = cTID('Lyt ');
Keys.PageSize = cTID('PgSz');
Keys.Layout = cTID('Lytt');
Keys.OverrideFileList = cTID('ovfl');
Keys.IncludeName = cTID('IndN');
Keys.IncludeSubDir = cTID('InSd');
Keys.Font = cTID('Font');
Keys.FontSize = cTID('FtSz');
Keys.InputFile = cTID('InpF');
Keys.Columns = cTID('Cols');
Keys.Rows = cTID('Rows');
Keys.RowOrdered = cTID('RowO');
Keys.ResolutionUnits = cTID('RsUn');
Keys.Units = cTID('Unit');
Keys.UseAutoSpacing = cTID('UAS ');
Keys.HorizontalSpacing = cTID('HzSp');
Keys.VerticalSpacing = cTID('VtSp');
Keys.InputSource = cTID('InSr');
Keys.RotateForBestFit = cTID('Rfbf');
Keys.FlattenText = cTID('FltT');
Keys.Width = cTID('Wdth');
Keys.Height = cTID('Hght');
Keys.Resolution = cTID('Rslt');
Keys.Mode = cTID('Md  ');

Enums = {};
Enums.CurrentDocs = cTID('cudo');
Enums.Folder = cTID('fold');
Enums.FileBrowser = cTID('flbr');
Enums.Files = cTID('file');

Enums.UnitInches = cTID('Inch');
Enums.UnitCentimeter =cTID('Ctmr');
Enums.UnitPixels =cTID('Pixl');

Enums.PixelsPerInch =	cTID('PpIn');
Enums.PixelsPerCentimeter =	cTID('PpCm');

Enums.CMYKMode = cTID('ECMY');
Enums.GrayscaleMode = cTID('Grys');
Enums.LabMode = cTID('LbCl');
Enums.RGBMode = cTID('RGBC');

Enums.SansSerif = cTID('Sans');
Enums.Serif = cTID('Serf');
Enums.Courier = cTID('Cour');

"CSIIConst.jsx";
// EOF

//
// CSIILayout
//
// $Id: CSIILayout.jsx,v 1.9 2012/03/03 01:06:52 anonymous Exp $
// Copyright: (c)2011, xbytor
// Author: xbytor@gmail.com
//
//
//@show include
//
//

//
// ContactSheetIIOptions - these are the settings used for
//                         creating sheets.
//
ContactSheetIIOptions = function ContactSheetIIOptions(obj) {
  var self = this;

  self._version    = CSII.VERSION;
  self._revision   = CSII.REVISION;
  self._appName    = app.name;
  self._appVersion = app.version;
  self._os         = $.os;

  // Source Images - 
  // Files, Folder,Open Documents, Bridge
  self.imageSource  = CSIIDefaults.imageSource; 
  self.folder       = CSIIDefaults.path;
  self.recurse      = CSIIDefaults.includeSubfolders; 
  self.spanFolders  = !CSIIDefaults.groupImages;

  // Document
  self.background   = ZStrs.white;
  // pixles, inches, cm
  self.docUnitsLocalized = CSIIDefaults.units;
  self.docUnits     = delocalizeUnitType(CSIIDefaults.units);
  self.docWidth     = CSIIDefaults.width;      // 100..20000 fix
  self.docHeight    = CSIIDefaults.height;     // 100..20000 fix
  self.resolution   = CSIIDefaults.resolution; // 25..1200 fix
  // pixels/in, pixels/cm
  self.resUnitsLocalized  = CSIIDefaults.resUnitsLocalized;
  self.resUnits       = delocalizeUnitType(CSIIDefaults.resUnits);
  self.modeLocalized  = CSIIDefaults.mode;
  self.mode           = ContactSheetIIOptions.toMode(CSIIDefaults.mode);
  self.colorProfile   = CSIIDefaults.colorProfile;

  // Layout
  self.acrossFirst     = (CSIIDefaults.place == ZStrings.AcrossFirst);
  self.bestFit         = CSIIDefaults.bestFit;
  self.rotate          = CSII.CCW;       // CW,CCW
  self.autoFill        = false;
  self.valign          = CSII.MIDDLE;       // Top,Middle,Bottom
  self.halign          = CSII.CENTER;    // Left,Center,Right
  self.rowCount        = CSIIDefaults.rows;           // 1..30 fix
  self.columnCount     = CSIIDefaults.cols;           // 1..30 fix
  self.useAutoSpacing  = CSIIDefaults.useAutospacing;
  self.spacingUnits    = CSIIDefaults.units;        // all units
  self.vertical        = CSIIDefaults.vert;         // 0..1000 fix
  self.horizontal      = CSIIDefaults.horz;         // 0..1000 fix

  // Caption
  self.caption         = CSIIDefaults.captionEnabled;
  self.captionFilename = true;
  self.captionFormat   = "%f.%e";
  self.noExtensions    = false;
  self.font            = CSIIDefaults.fontName;
  self.fontFaceName    = CSIIDefaults.fontFaceName;
  self.fontSize        = CSIIDefaults.fontSize;
  self.fontColor       = ZStrs.black;

  // enable using ... for truncated captions
  self.dotTruncate     = true;

  self.captionStyle    = CSII.NO_CAPTION_STYLE;
  self.overlayCaption  = false;

  // Output
  self.keepOpen        = false;
  self.saveSheet       = false;
  self.outputFolder    = "~";
  self.flatten         = true;

  self.nextPage        = false;
  self.nextFile        = false;
  self._pageStart      = 1;
  self._pagePad        = 2;
  self._outputStart    = 1;
  self._outputPad      = 3;
  self.outputPrefix    = CSIIDefaults.OUTPUT_PREFIX;
  self.fileNameFormat  = CSIIDefaults.FILENAME_FMT;

  self.fileSaveType    = "jpg";        // bmp,gif,jpg,psd,eps,pdf,png,tga,tiff

  // Advanced
  self.autospaceFactor = 1.0;   // percent of width

  self.hiperfMode = 1; // needs to be removed

  self.forceRecording = true;
  self.xpSort         = false;

  self.autoscaleCaptions = true;

  psx.copyFromTo(obj, self);
};


ContactSheetIIOptions.prototype.toString = function() { return this.typename; };
ContactSheetIIOptions.prototype.typename = "ContactSheetIIOptions";

ContactSheetIIOptions.SETTINGS_FOLDER = Folder.userData;

ContactSheetIIOptions.INI_FILE = (ContactSheetIIOptions.SETTINGS_FOLDER +
                                  "/" + ZStrings.CSIIFileName +".ini");
ContactSheetIIOptions.LOG_FILE = (ContactSheetIIOptions.SETTINGS_FOLDER +
                                  "/ContactSheetII.log");
ContactSheetIIOptions.UI_LOG_FILE = (ContactSheetIIOptions.SETTINGS_FOLDER +
                                     "/ContactSheetII-UI.log");
ContactSheetIIOptions.SETTINGS_FILE_NAME = ZStrings.CSIIFileName + ".xml";


ContactSheetIIOptions.DEFAULT_XML = new XML("<ContactSheetIISettings/>");

ContactSheetIIOptions.SHORT_FILENAME_LENGTH = 43;

ContactSheetIIOptions.LOG_ENABLED = true;
ContactSheetIIOptions.PAGE_PAD = 2;
ContactSheetIIOptions.FILE_PAD = 4;

//
// Function: toMode
// Description: convert a possibly localized mode string into something useful
// Input: a mode string
// Return: a NewDocumentMode value or undefined if no mapping is found
//
ContactSheetIIOptions.toMode = function(str) {
  str = str.toString();
  if (str.match(/rgb/i) || str == ZStrings.RGBMode) {
    return NewDocumentMode.RGB;
  }
  if (str.match(/cmyk/i) || str == ZStrings.CMYKMode) {
    return NewDocumentMode.CMYK;
  }
  if (str.match(/lab/i) || str == ZStrings.LabMode) {
    return NewDocumentMode.LAB;
  }
  if (str.match(/grayscale/i) || str == ZStrings.GrayscaleMode) {
    return NewDocumentMode.GRAYSCALE;
  }

  return undefined;
};

//
// Function: toModeStr
// Description: convert some kind of "mode" value to a EN string
// Input: a "mode" value
// Return: an EN representation of the mode
//
ContactSheetIIOptions.toModeStr = function(str) {
  var mode = ContactSheetIIOptions.toMode(str);
  var modeStr = undefined;
  switch (mode) {
    case NewDocumentMode.RGB:       modeStr = "RGB"; break;
    case NewDocumentMode.CMYK:      modeStr = "CMYK"; break;
    case NewDocumentMode.LAB:       modeStr = "Lab"; break;
    case NewDocumentMode.GRAYSCALE: modeStr = "Grayscale"; break;
  }

  return modeStr;
};


//
// Function: toFont
// Description: convert a string to a canonical Font name
// Input: a string
// Return: a canonical Font name
//
ContactSheetIIOptions.toFont = function(str) {
  str = str.toString();

  var f = psx.determineFont(str);  // first, check by PS name

  return (f ? f.postScriptName : undefined);
};

//
// Placeholder for a function that would rationalized/validate
// a ContactSheetIIOptions object
//
ContactSheetIIOptions.prototype.rationalize = function() {
  var self = this;

  Error.runtimeError(9500, ZStrings.UnknownInternalError);

  return self;
};



//
// ContactSheetUI - these settings are used for control of the CSII UI
//
ContactSheetUI = function ContactSheetUI(obj) {
  var self = this;

  self.title = CSII.TITLE;
  self.winRect = {   // the rect for the Standard window
    x: 100,
    y: 100,
    w: ContactSheetUI.CSII_WIDTH,
    h: ContactSheetUI.CSII_HEIGHT
  };

  self.iniFile = undefined;
  self.saveIni = false;
  self.hasBorder = false;

  self.windowCreationProperties = { resizeable : false };
  self.center = false;
  self.setDefault = false;
  self.textOfs = 3;
};
ContactSheetUI.prototype.typename = "ContactSheetUI";

ContactSheetUI.CSII_WIDTH  = 560;
ContactSheetUI.CSII_HEIGHT = 700;

//
// Not used at this time. Would be used for putting page numbers on sheets
//
ContactSheetUI.nextPageNumber = function(folder, prefix) {
  var st = ContactSheetUI.zeroPad(1, ContactSheetIIOptions.PAGE_PAD);
  var p = ContactSheetUI.getNextIndex(folder, prefix, st);
  return ContactSheetUI.zeroPad(Number(p), ContactSheetIIOptions.PAGE_PAD);
};


//
// Just returns 1 at this time. Would be used for determining the
// next file number if sheets were saved into a folder with previously
// generated sheets
//
ContactSheetUI.nextFileNumber = function(folder, format) {
  return 1;

  if (!len) {
    len = ContactSheetIIOptions.FILE_PAD;
  }
  return ContactSheetUI.getNextIndex(folder, format, 1);
};

//
// Not used. Needed when saving to sheets to files
//
ContactSheetUI.getNextIndex = function(folder, format, def) {
  var idx = 0;

  if (!(folder instanceof Folder)) {
    return def;
  }

  if (folder.alias) {
    folder = folder.resolve();
  }

  var ar = format.split('-');
  prefix = decodeURI(ar[0]) + '-';
  var rex = RegExp(prefix + "(\\d+)");

  var flist = folder.getFiles(rex);
  if (flist && flist.length) {
    for (var i = 0; i < flist.length; i++) {
      var file = flist[i];
      var m = file.name.match(/(\d+)\.[^\.]+$/);
      if (m) {
        var v = Number(m[1]);
        if (v > idx) {
          idx = v;
          pad = m[1].length;
        }
      }
    }

    idx++;
  }

  return idx;
};
ContactSheetUI.prototype.getNextIndex = ContactSheetUI.getNextIndex;

//
// Function: fieldErrorPrompt
// Description: opens an alert window if appropriate
// Input: an error message
// Return: false
//
ContactSheetUI.fieldErrorPrompt = function(msg) {
  // shold probably check for dialogMode
  if (app.dialogModes != DialogModes.NO) {
    alert(msg);
  }
  return false;
};

//
// Function: invalidValuePrompt
// Description: opens an alert window for a field with an invalid value
// Input: the name of a UI field
// Return: false
//
ContactSheetUI.invalidValuePrompt = function(nm) {
  var msg = ZStrings.InvalidValueMsg.sprintf(nm);
  return ContactSheetUI.fieldErrorPrompt(msg);
};

//
// Function: invalidNumberPrompt
// Description: opens an alert window for a field with an invalid number
// Input: the name of a UI field
// Return: false
//
ContactSheetUI.invalidNumberPrompt = function(nm) {
  var msg = ZStrings.InvalidNumberMsg.sprintf(nm);
  return ContactSheetUI.fieldErrorPrompt(msg);
};

//
// Function: numberOutOfRange
// Description: opens an alert window for a field with number out of range
// Input: the name of a UI field, the minimum and maximum values of the range
// Return: false
//
ContactSheetUI.numberOutOfRange = function(nm, min, max) {
  if (typeof min == "number") {
    min = "%.03f".sprintf(min);
  }
  if (typeof max == "number") {
    max = "%.03f".sprintf(max);
  }

  // XXX - we should really change the zstring db to %s...
  var fmt = ZStrings.NumberOutOfRangeMsg.replace(/%\.03f/g, "%s");
  var msg = fmt.sprintf(nm, psx.localizeNumber(min), psx.localizeNumber(max));

  return ContactSheetUI.fieldErrorPrompt(msg);
};

//
// Function: getNumber
// Description: get the number from a UI field. Errors get raised where needed
// Input:  s    - the string from the UI
//         type - the UnitValue type
//         nm   - the name of the UI field
//         min  - the minimum allowed px value for the field
//         min  - the maximum allowed px value for the field
//         base - the baseUnit appropriate for the field
// Return: undefined - if the number is invalid
//         number    - the value of the field as a number. If the original
//                     value was out of range, the minimum or maximum
//                     value will be returned
//
ContactSheetUI.getNumber = function(s, type, nm, min, max, base) {
  var n = toNumber(s);
  if (isNaN(n)) {
    ContactSheetUI.invalidNumberPrompt(nm);
    return undefined;
  }

  var unit = UnitValue(n, type);
  unit.baseUnit = base;

  var val = unit.as("px");

  if (val < min || val > max) {
    var un = UnitValue(max, "px");
    un.baseUnit = base;
    var v = un.as(type);
    max = toNumber(v.toFixed(3));
    if (max > v) {
      max -= 0.001;
    }
    un.value = min;
    v = un.as(type);
    min = toNumber(v.toFixed(3));
    if (min < v) {
      min += 0.001;
    }
    ContactSheetUI.numberOutOfRange(nm, min, max);
    n = (unit.value < min) ? min : max;
  }
  return n;
};

//
// Not used. This is an alternative to alert()
//
ContactSheetUI.prototype.popup = function(title, str, win, bnds) {
  if (!bnds) {
    bnds = [200,200,700,750];
  }
  var w = new Window('dialog', title, bnds);
  var t = w.add('edittext', [10, 10,
                             bnds[2]-bnds[0]-10,
                             bnds[3]-bnds[1]-10],
                '', {multiline:true, readonly:true});
  t.text = str;
  if (win) {
    w.center(win);
  }
  w.show();
};


//
// Not used. Returns the contents of the log file for use
// in error alerts.
//
ContactSheetUI.prototype.getLogFileContents = function() {
  var file = new File(ContactSheetIIOptions.LOG_FILE);

  var str = "Log File: " + file.toUIString() + '\n';
  if (file.exists) {
    str += psx.readFromFile(file);
  } else {
    str += "Log file not found.";
  }

  return str;
};


//
// Function: zeroPad
// Description: pads a number with zeros on the left to a desired width
// Input:  num - the number
//         w - the total number of desired digits
// Return: the padded string
//
ContactSheetUI.zeroPad = function(num, w) {
  var str = num.toString();

  while (str.length < w) {
    str = "0" + str;
  }
  return str;
};


//
// Not used. Returns the number of pages and images to be generated
//
ContactSheetUI.prototype.getPageAndImageCounts = function() {
  var self = this;
  var opts = new ContactSheetIIOptions();
  var win = self.win;
  var appPnl = win.appPnl;

  Error.runtimeError(9500, ZStrings.UnknownInternalError);

  self.validateSourcePanel(appPnl.source, opts);

  if (!appPnl.layoutPanel) {
    return;
  }
  opts.rowCount = Number(appPnl.layoutPanel.rows.text);
  opts.columnCount = Number(appPnl.layoutPanel.cols.text);
  if (opts.folder) {
    opts.folder = new Folder(opts.folder);
  }

  var fileSets = ContactSheetII.getSourceImages(opts);
  var pages = fileSets.length;
  var images = 0;
  for (var i = 0; i < fileSets.length; i++) {
    var set = fileSets[i];
    images += set.length;
  }

  return { pages: pages, images: images };
};

//
// Function: createContactSheetII
// Description: create a contact sheet generator based on the UI settings
// Input: <none>
// Return: a ContactSheetII object
//
ContactSheetUI.prototype.createContactSheetII = function() {
  return new ContactSheetII(this.settings);
};

//============================== END OF UI ================================

//
// ContactSheetII - the contact sheet generator
// Input: CSII XML settings
//
ContactSheetII = function(settings) {
  var self = this;

  self.settings = settings;

  self.now = new Date();
  self.dateStr = '';
  self.imageCount = 0;
  self.errorCount = 0;
  self.skipImageErrors = false;
};
ContactSheetII.prototype.typename = "ContactSheetII";

//
// Function: isCompatible
// Description: determines whether the version of PS is valid for CSII
// Input: <none>
// Return: true if compatible, false if not
//
ContactSheetII.isCompatible = function() {
  return toNumber(app.version.match(/^\d+/)[0]) >= CSII.REQUIRED_PS_VERSION;
};

//
// Function: toDescriptor
// Description: creates a descriptor for an XML settings object
// Input:  an XML settings object
// Return: an ActionDescriptor containing the XML settings as a string
//         as one of the properties
//
ContactSheetII.toDescriptor = function(xml) {
  var desc = new ActionDescriptor();
  var str = xml.toXMLString();

  desc.putString(CSII.kCSIISettings, str);

  return desc;
};

//
// Function: fromDescriptor
// Description: creates an XML settings object from a descriptor
// Input:  an ActionDescriptor in either legacy format or from
//         the new XML settings format
// Return: an XML settings object
//
ContactSheetII.fromDescriptor = function(desc) {

  // see if its in the new XML format
  if (desc.hasKey(CSII.kCSIISettings)) {
    var str = desc.getString(CSII.kCSIISettings);
    return new XML(str);
  }

  // if there is no Units, assume the descriptor
  // is incomplete or invalid and bail out

  if (!desc.hasKey(Keys.Units)) {
    return undefined;
  }

  // It may be an old style legacy descriptor
  var settings = ContactSheetUI.getDefaultOptions();

  //======= Source Panel ================

  var source = settings.source;
  var inputSource = (desc.hasKey(Keys.InputSource) ?
                     desc.getEnumerationValue(Keys.InputSource) : Enums.Folder);

  switch (inputSource) {
  case Enums.CurrentDocs:
    source.@imageSource = ZStrings.CurrentDocs;
    break;

  case Enums.Folder:
    source.@imageSource = ZStrings.Folder;
    try {
      source.@path = desc.getPath(Keys.InputLocation);

    } catch (e) {
      var msg = ZStrings.BadRecordingFmt.sprintf(ZStrings.BadFolder);

      if (app.playbackDisplayDialogs == DialogModes.ALL) {
        delete source.@path;
        alert(msg);
      } else {
        Error.runtimeError(9006, msg);
      }
    }
    source.@includeSubfolders = desc.getBoolean(Keys.IncludeSubDir);
    source.@groupImages = false;
    break;

  case Enums.FileBrowser:
    source.@imageSource = ZStrings.Bridge;
    break;

  case Enums.Files:
    source.@imageSource = ZStrings.Files;
    break;

  default:
    Error.runtimeError(9006, ZStrings.BadRecordingFmt.sprintf(ZStrings.BadSource));
  }

  //============ Document Panel ==============

  var document = settings.document;
  var units = desc.getEnumerationValue(Keys.Units);
  if (units == Enums.UnitInches) {
    document.@units = ZStrings.Inches;
  } else if (units == Enums.UnitCentimeter) {
    document.@units = ZStrings.Centimeter;
  } else if (units == Enums.UnitPixels) {
    document.@units = ZStrings.Pixels;
  } else {
    Error.runtimeError(9006, ZStrings.BadRecordingFmt.sprintf(ZStrings.BadUnits));
  }

  var res = desc.getUnitDoubleValue(Keys.Resolution);

  var resUnits = desc.getEnumerationValue(Keys.ResolutionUnits);
  if (resUnits == Enums.PixelsPerInch) {
    document.@resUnits = ZStrings.PixelsPerInch;
  } else if (resUnits == Enums.PixelsPerCentimeter) {
    document.@resUnits = ZStrings.PixelsPerCM;
  } else {
    Error.runtimeError(9006,
                       ZStrings.BadRecordingFmt.sprintf(ZStrings.BadResolution));
  }

  // res is stored as pixels per inch

  if (document.@resUnits == ZStrings.PixelsPerCM) {
    document.@resolution = res/2.54;
  } else {
    document.@resolution = res;
  }

  var h = desc.getUnitDoubleValue(Keys.Height) * res / 72;
  var w = desc.getUnitDoubleValue(Keys.Width) * res / 72;

  var baseUnit = new UnitValue(1/res, "in");
  var un = new UnitValue(w, "px");
  un.baseUnit = baseUnit;

  document.@width = un.as(document.@units);

  un.value = h;
  document.@height = un.as(document.@units);


  var mode = desc.getEnumerationValue(Keys.Mode);
  switch (mode) {
  case Enums.CMYKMode:
    document.@mode = ZStrings.CMYKMode;
    break;

  case Enums.LabMode:
    document.@mode = ZStrings.LabMode;
    break;

  case Enums.GrayscaleMode:
    document.@mode = ZStrings.GrayscaleMode;
    break;

  case Enums.RGBMode:
    document.@mode = ZStrings.RGBMode;
    break;

  default:
    Error.runtimeError(9006,
                       ZStrings.BadRecordingFmt.sprintf(ZStrings.BadColorMode));
  }

  // use defaults...
  document.@bitDepth = ZStrings.BitDepth8;
  document.@colorProfile = ZStrs.ProfileSRGB;
  
  document.@flattenLayers = desc.getBoolean(Keys.FlattenText);


  // ======== Thumbnail Panel ===========

  var thumbnail = settings.thumbnail;
  var rowOrdered = desc.getBoolean(Keys.RowOrdered);
  if (rowOrdered) {
    thumbnail.@place = ZStrings.AcrossFirst;
  } else {
    thumbnail.@place = ZStrings.DownFirst;
  }

  thumbnail.@cols = desc.getInteger(Keys.Columns);
  thumbnail.@rows = desc.getInteger(Keys.Rows);
  thumbnail.@bestFit = (desc.hasKey(Keys.RotateForBestFit) &&
                        desc.getBoolean(Keys.RotateForBestFit));

  var uas = (desc.hasKey(Keys.UseAutoSpacing) &&
             desc.getBoolean(Keys.UseAutoSpacing));
  thumbnail.@useAutospacing = uas;

  if (!uas) {
    var h = desc.getUnitDoubleValue(Keys.HorizontalSpacing) * res / 72;
    var v = desc.getUnitDoubleValue(Keys.VerticalSpacing) * res / 72;

    var baseUnit = new UnitValue(1/res, "in");
    var un = new UnitValue(h, "px");
    un.baseUnit = baseUnit;
    
    thumbnail.@horz = un.as(document.@units);

    un.value = v;
    thumbnail.@vert = un.as(document.@units);
  }


  // ======== Caption Panel ===========

  var caption = settings.caption;

  var cap = desc.hasKey(Keys.IncludeName) && desc.getBoolean(Keys.IncludeName);
  caption.@enabled = cap;

  var font = undefined;
  var fkind = desc.getEnumerationValue(Keys.Font);
  if (fkind == Enums.Serif) {
    font = (isWindows() ? ZStrings.WinSerif :
            ContactSheetII.fixMacFont(ZStrings.MacSerif));

  } else if (fkind == Enums.SansSerif) {
    font = (isWindows() ? ZStrings.WinSansSerif :
            ContactSheetII.fixMacFont(ZStrings.MacSansSerif));

  } else if (fkind == Enums.Courier) {
    font = (isWindows() ? ZStrings.WinCourier :
            ContactSheetII.fixMacFont(ZStrings.MacCourier));

  } else {
    Error.runtimeError(9006, ZStrings.BadLegacyFont);
  }

  caption.font.@name = toFont(font);
  caption.font.@size = desc.getInteger(Keys.FontSize);

  return settings;
};


//
// Function: fixMacFont
// Description: The default fonts for the Mac changed but the ZString weren't
// Input: an original Mac font name
// Return: the correct "new" Mac font name
//
ContactSheetII.fixMacFont = function(font) {
  switch (font) {
    case "Courier":   font = "Myriad Pro"; break;
    case "Helvetica": font = "Minion Pro"; break;
    case "Times":     font = "Lucida Grande"; break;
  }
  return font;
};

// This is a hack to reset the default fontName and fontFaceName on the mac
function _fixDefaultMacFont() {
  if (!isMac()) {
    return;
  }

  CSIIDefaults.fontName = ContactSheetII.fixMacFont(ZStrings.MacSansSerif);
  CSIIDefaults.fontFaceName = ContactSheetII.fixMacFont(ZStrings.MacSansSerif);
};
_fixDefaultMacFont();


//
// Function: process
// Description: Does setup, error handling, and timing for the sheet generator
// Input: ContactSheetIIOptions
// Return: ContactSheetIIOptions
//
ContactSheetII.prototype.process = function(opts) {
  var self = this;

  function handleError(e, pre) {
    LogFile.logException(e);

    var str = (pre || ZStrings.ErrorInProcessing) + e.toString();

    str += ("\n\n" + ZStrings.LogFileReference + "\n    " +
            decodeURI(ContactSheetIIOptions.LOG_FILE));

    return str;
  }

  var timer = new Timer();
  timer.start();

  self.imageProcessingTimer = new Timer();

  if (ContactSheetIIOptions.LOG_ENABLED) {
    LogFile.setFilename(ContactSheetIIOptions.LOG_FILE, "UTF8");
  }

  LogFile.write("Version: " + CSII.VERSION);
  LogFile.write("Revision: $Revision: 1.9 $");
  LogFile.write("App: " + app.name);
  LogFile.write("App Version: " + app.version);
  LogFile.write("OS: " + $.os);

  LogFile.write("Begin Processing");
  LogFile.write(psx.listProps(opts));

  try {
    // if this fails, it will only cause a problem for recording in an action
    // this is a non-fatal error
    self.descriptor = ContactSheetII.toDescriptor(self.settings);

  } catch (e) {
    var str = handleError(e, ZStrings.ActionRecordingError);
    self.descriptor = undefined;

    if (opts.forceRecording) {
      self.errorCount++;
    }
  }

  var ru = app.preferences.rulerUnits;
  app.preferences.rulerUnits = Units.PIXELS;
  var tu = app.preferences.typeUnits;
  app.preferences.typeUnits = TypeUnits.POINTS;

  try {
    self._processX(opts);

    // post processing
    LogFile.write("End Processing");

    timer.stop();

    var s = String.sprintf("%.3f seconds overall per image",
                           1.0 * timer.elapsed/self.imageCount);
    LogFile.write(s);

    var tmr = self.imageProcessingTimer;
    if (!isNaN(tmr.per)) {
      s = String.sprintf("%.3f seconds processing time per image", tmr.per);
      LogFile.write(s);
    }

  } catch (e) {
    if (e && e.number != 8007) {  // if not User Cancelled Operation
      var str = handleError(e, ZStrings.ErrorInProcessing);

      alert(str);
    }

    self.descriptor = undefined;

  } finally {
    app.preferences.rulerUnits = ru;
    app.preferences.typeUnits = tu;
  }

  if (self.errorCount) {
    var str = ZStrings.ErrorsDetectedFmt.sprintf(self.errorCount);
    str += "\r" + ZStrings.LogFileReference;
    str += "\r" + decodeURI(ContactSheetIIOptions.LOG_FILE);

    alert(str);
  }

  return opts;
};

//
// Function: _processX
// Description: Initializes sheet generation, then calls processFiles
//              to generate the individual sheets
// Input: ContactSheetIIOptions
// Return: <none>
//
ContactSheetII.prototype._processX = function(opts) {
  var self = this;

  self.openDocMode = (opts.imageSource == ZStrings.CurrentDocs);

  opts.noUI = toBoolean(opts.noUI);

  var fileSets = ContactSheetII.getSourceImages(opts);

  if (fileSets.length == 0) {
    var msg = ZStrings.NoImageFiles;
    LogFile.write(msg);
    alert(msg);
    return;
  }
  self.fileSets = fileSets;

  app.purge(PurgeTarget.ALLCACHES);

  if (opts.resUnits == 'cm') {
    opts._resolution = opts.resolution;
    opts.resolution = opts.resolution * 2.54;
  }

  var sheet;
  opts.mode = ContactSheetIIOptions.toMode(opts.mode);

  opts.leftMargin   = 0;
  opts.rightMargin  = 0;
  opts.topMargin    = 0;
  opts.bottomMargin = 0;

  opts._width  = opts.docWidth;
  opts._height = opts.docHeight;

  if (opts.docUnits != 'pixels') {
    var res;

    if (opts.docUnits == 'inches') {
      res = opts.resolution;

    } else if (opts.docUnits == 'cm') {
      res = opts.resolution/2.54;
    }

    opts.docWidth  = Math.round(opts.docWidth * res);
    opts.docHeight = Math.round(opts.docHeight * res);

    // would need to adjust margins here if used...
  }

  var w = opts.docWidth;
  var h = opts.docHeight;
  var res = opts.resolution;

  // configure autospacing
  if (opts.useAutoSpacing) {
    var v = (w/opts.columnCount) * opts.autospaceFactor / 100;
    opts.horizontal = Math.floor(v);
//     v = (h /opts.rowCount) * opts.autospaceFactor / 100;
//     opts.vertical = Math.floor(v);

    opts.vertical = opts.horizontal;

  } else {
    if (opts.spacingUnits != "px") {
      Error.runtimeError(9200, "Bad spacingUnits value");
    }
  }

  // these 'frame' dimensions describe the size of the thumbnail/caption
  // area in a non-template-based sheet (would need to 
  opts.frameWidth  = opts.docWidth - (opts.leftMargin + opts.rightMargin);
  opts.frameHeight = opts.docHeight - (opts.topMargin + opts.bottomMargin);

  // font size is already in points
  opts.fontSizePT = Math.floor(opts.fontSize);

  if (opts.caption) {
    if (opts.captionFilename) {
      opts.captionFormat = (opts.noExtensions ? "%f" : "%f.%e");
    }
  }

//   if (opts.nextPage) {
//     var start = ContactSheetUI.nextPageNumber(opts.outputFolder,
//                                               opts.fileNameFormat);
//     opts._pageStart = Number(start);
//     opts._pagePad = start.length;
//   }

//   if (opts.nextFile) {
//     var start = ContactSheetUI.nextFileNumber(opts.outputFolder,
//                                               opts.fileNameFormat);
//     opts._outputStart = Number(start);
//     opts._outputPad = start.length;
//   }

  self.currentPageNumber = opts._pageStart;
  self.currentFileIndex = opts._outputStart;

  LogFile.write("Options:\n" + psx.listProps(opts));


  for (var i = 0; i < fileSets.length; i++) {
    var set = fileSets[i];

    if (set.length > 0) {
      opts.files = set;

      var rc = self.processFiles(opts);

      if (!rc) {
        break;
      }
    }
  }
};


//
// Function: processFiles
// Description: calls contactSheetX to create a sheet then do any
//              additional processing on the sheet (e.g. flatten)
// Input: ContactSheetIIOptions
// Return: true if successful, false if not
//
ContactSheetII.prototype.processFiles = function(opts) {
  var self = this;

  var csLayer;        // the Contact Sheet layer, if there is one
  var csdoc;
  var fileCount = opts.files.length;

  // create and populate a sheet
  csdoc = self.contactSheetX(opts);

  if (!csdoc) {
    return false;
  }

  // it's not a template-based document

  if (opts.flatten) {
    // The legacy plugin has slightly different behavior here.
    // All of the layers are merged together except the background.
    // and the name of the merged layer is the name of the last
    // image added
    if (CSII.USE_LEGACY_FLATTEN && psx.hasBackground(csdoc)) {
      var name = csdoc.layers[csdoc.layers.length-2].name;
      csdoc.backgroundLayer.visible = false;
      psx.mergeVisible();
      csdoc.backgroundLayer.visible = true;
      csdoc.activeLayer.name = name;

    } else {
      csdoc.flatten();
      csdoc.activeLayer.name = CSII.CS_LAYER_NAME;
    }
  }

  if (opts.saveSheet) {
    self.saveDocument(csdoc, opts);
  }
  if (!opts.keepOpen) {
    csdoc.close(SaveOptions.DONOTSAVECHANGES);
  }

  self.currentPageNumber++;
  self.currentFileIndex++;

  return true;
};

//
// Function: createSheet
// Description: create a new empty sheet document with the desired properties
// Input: ContactSheetIIOptions
// Return: a Document
//
ContactSheetII.prototype.createSheet = function(opts) {
  var self = this;
  var doc;

  var name = self.getSheetName(opts);

  var bpc = BitsPerChannelType.EIGHT;
  if (opts.bitDepth && opts.bitDepth.contains("16")) {
    bpc = BitsPerChannelType.SIXTEEN;
  }

  try {
    doc = app.documents.add(opts.docWidth,
                            opts.docHeight,
                            opts.resolution,
                            name,
                            opts.mode,
                            DocumentFill.WHITE,
                            1,
                            bpc);
  } catch (e) {
    var msg;
    if (e.number == 8007) {
      msg = ZStrs.UserCancelled;

    } else {
      msg = (ZStrings.CreateFailure + "\r\r\"" + e.toString() + "\"");
      Error.runtimeError(9001, msg);
    }
  }

  self.convertProfile(doc, opts.colorProfile);

  // need to see if the mode got changed...
  if (opts.mode.toString() != ("New" + doc.mode.toString())) {
    var str = opts.mode.toString().replace('NewDocument', 'Change');
    var mode = eval(str);
    doc.changeMode(mode);
  }

  return doc;
};

//
// Function: convertProfile
// Description: convert a document to the desired profile. This requires
//              some unexpected subtlety
// Input: doc     - Document
//        profile - the name of the desired profile
// Return: <none>
//
ContactSheetII.prototype.convertProfile = function(doc, profile) {
  var self = this;
  var convert = true;

  if (profile == ZStrs.ProfileLab && doc.mode == DocumentMode.LAB) {
    return;
  }

  if (profile == ZStrs.ProfileWorkingGray && doc.mode == DocumentMode.GRAYSCALE) {
    return;
  }

  if (profile == ZStrs.ProfileWorkingCMYK && doc.mode == DocumentMode.CMYK) {
    return;
  }

  if (profile == ZStrs.ProfileWorkingRGB && doc.mode == DocumentMode.RGB) {
    return;
  }

  if (doc.colorProfileType != ColorProfile.NONE) {
    convert = doc.colorProfileName != profile;
  }

  if (convert) {
    LogFile.write("Convert color profile for " + decodeURI(doc.name) +
                  " to " + profile);
    try {
      psx.convertProfile(doc, profile);

    } catch (e) {
      // convertProfile throws an 8007 if it doesn't know the profile.
      // Remap it to something else so it gets caught by the top-level
      // error handling code
      if (e.number == 8007) {
        e.number = 9100;
        e.message = ZStrings.ProfileConversionError;
      }
      Error.runtimeError(e.number, e.message);
    }
  }
};

//
// Function: getSheetName
// Description: create a name for a new contact sheet
// Input: ContactSheetIIOptions
// Return: a sheet name
//
ContactSheetII.prototype.getSheetName = function(opts) {
  var self = this;
  var name;
  var base = '';

  var base = opts.fileNameFormat.sprintf(self.currentFileIndex);

  if (opts.saveSheet) {
    name = base + '.' + opts.fileSaveType;

  } else {
    name = base;
  }

  // base = (opts.outputPrefix +
  //         self.zeroPad(self.currentFileIndex, opts._outputPad));

  return name;
};

//
// Not used in this release.
//
ContactSheetII.prototype.saveDocument = function(doc, opts) {
  var self = this;

  Error.rutimeError(9500, ZStrings.UnknownInternalError);

  // save as PSD files only

  if (!opts.saveSheet) {
    LogFile.write("Contact Sheet not saved #" + self.currentPageNumber);
    return;
  }

  var profileConverted = false;

  var saveOpts = self.getSaveOpts(opts);

  var name = self.getSheetName(opts);

  if (opts._formatPanel) {
    var fname = (opts.outputFolder + '/' + name);

    var file = new File(fname);

    if (opts.fileSaveType == 'jpg') {
      var bpc = doc.bitsPerChannel;
      if (bpc != BitsPerChannelType.ONE && bpc != BitsPerChannelType.EIGHT) {
        doc.bitsPerChannel = BitsPerChannelType.EIGHT;
      }
    }

    if (saveOpts._flatten) {
      doc.flatten();
    }

    if (saveOpts._convertToIndexed) {
      if (doc.mode != DocumentMode.INDEXEDCOLOR) {
        if (doc.mode != DocumentMode.RGB) {
          doc.changeMode(ChangeMode.RGB);
        }
        var cnvtOpts = new IndexedConversionOptions();
        doc.changeMode(ChangeMode.INDEXEDCOLOR, cnvtOpts);
      }
    }

    if (saveOpts._convertToSRGB) {
      try {
        LogFile.write("Converting to sRGB");

        self.convertProfile(doc, ZStrs.ProfileSRGB);
        profileConverted = true;

      } catch (e) {
      }
    }

  } else {
    var fname = opts.outputFolder + '/' + base + '.' + opts.outputFormat;

    var file = new File(fname);

    if (opts.outputFormat == 'jpg') {
      var bpc = doc.bitsPerChannel;
      if (bpc != BitsPerChannelType.ONE && bpc != BitsPerChannelType.EIGHT) {
        doc.bitsPerChannel = BitsPerChannelType.EIGHT;
      }
    }
  }

  LogFile.write("Saving sheet: " + file.toUIString());
  doc.saveAs(file, saveOpts, false);

  LogFile.write("Contact Sheet saved " + file.toUIString());
};


//
// Function: zeroPad
// Description: pads a number with zeros on the left to a desired width
// Input:  num - the number
//         w - the total number of desired digits
// Return: the padded string
//
ContactSheetII.prototype.zeroPad = function(num, w) {
  var str = num.toString();

  while (str.length < w) {
    str = "0" + str;
  }
  return str;
};

//
// Function: getSourceImages
// Description: get the source images/files collected into page sets
// Input: ContactSheetIIOptions
// Return: an array of page sets which are arrays of images/files
//
ContactSheetII.getSourceImages = function(opts) {
  var fileSets;

  if (opts.imageSource == ZStrings.Folder && opts.folder &&
      !(opts.folder instanceof Folder)) {
    opts.folder = new Folder(opts.folder);
  }

  if (opts.files && opts.files.length > 0) {
    fileSets = ContactSheetII.getFileSetsFromFiles(opts, opts.files);

  } else if (opts.imageSource == ZStrings.CurrentDocs) {
    fileSets = ContactSheetII.getImageSets(opts);

  } else {
    fileSets = ContactSheetII.getFileSets(opts);
  }
  return fileSets;
};

//
// Function: getImageSets
// Description: get the open images collected into page sets
// Input: ContactSheetIIOptions
// Return: an array of page sets which are arrays of open images
//
ContactSheetII.getImageSets = function(opts) {
  var sets = [];
  var setSize = opts.rowCount * opts.columnCount;

  var docs = app.documents;

  var images = [];

  for (var i = 0; i < docs.length; i++) {
    images.push(docs[i]);
  }

//   ContactSheetII.caseInsensitiveFileSort(images);
  docs = images;

  var currentSet = [];

  for (var i = 0; i < docs.length; i++) {
    currentSet.push(docs[i]);
    if (currentSet.length == setSize) {
      sets.push(currentSet);
      currentSet = [];
    }
  }

  if (currentSet.length != 0) {
    sets.push(currentSet);
  }

  return sets;
};


//
// Function: getFileSetsFromFiles
// Description: get the selected files collected into page sets
// Input: opts - ContactSheetIIOptions
//        files - image files
// Return: an array of page sets which are arrays of files
//
ContactSheetII.getFileSetsFromFiles = function(opts, files) {
  var sets = [];
  var setSize = opts.rowCount * opts.columnCount;
  var span = opts.spanFolders;

  var currentSet = [];
  var folderStr = files[0].parent.absoluteURI;

//   ContactSheetII.caseInsensitiveFileSort(files);

  while (files.length > 0) {
    var file = files.shift();
    if (file.parent.absoluteURI != folderStr && !span) {
      folder = file.parent;
      sets.push(currentSet);
      currentSet = [];
    }
    currentSet.push(file);
    if (currentSet.length == setSize) {
      sets.push(currentSet);
      currentSet = [];
    }
  }
  if (currentSet.length != 0) {
    sets.push(currentSet);
  }

  return sets;
};


//
// Function: xpFileSort
// Description: sorts an array of files using XP Smart Sort rules
//              (recognizes leading or trailing numbers)
// Input: list - an array of files
// Return: a sorted array of files
//
ContactSheetII.xpFileSort = function(list) {
  var rex = /(\d+)\./;   // handles numbers at the end of the base name
  var rex2 = /(^\d+)/;   // handles numbers at the start of the base name

  function xpCmp(a, b) {
    var r = rex;
    var ap = a.name.match(r);
    if (ap == null) {
      r = rex2;
      ap = a.name.match(r);
    }
    var bp = b.name.match(r);

    if (ap != null && bp != null) {
      return toNumber(ap[1]) - toNumber(bp[1]);
    }
    if (a.name.toLowerCase() < b.name.toLowerCase()) {
      return -1;
    } else if (a.name.toLowerCase() > b.name.toLowerCase()) {
      return 1;
    }
    return 0;
  }

  return list.sort(xpCmp);
};

//
// Function: caseInsensitiveFileSort
// Description: sorts an array of files case insensitive
// Input: list - an array of files
// Return: a sorted array of files
//
ContactSheetII.caseInsensitiveFileSort = function(list) {
  function ciCmp(a, b) {
    if (a.name.toLowerCase() < b.name.toLowerCase()) {
      return -1;
    } else if (a.name.toLowerCase() > b.name.toLowerCase()) {
      return 1;
    }
    return 0;
  }
  return list.sort(ciCmp);
};

//
// Function: caseInsensitiveSort
// Description: sorts an array of strings case insensitive
// Input: list - an array of strings
// Return: a sorted array of strings
//
ContactSheetII.caseInsensitiveSort = function(list) {
  function ciCmp(a, b) {
    if (a.toLowerCase() < b.toLowerCase()) {
      return -1;
    } else if (a.toLowerCase() > b.toLowerCase()) {
      return 1;
    }
    return 0;
  }
  return list.sort(ciCmp);
};

//
// Function: getFileSets
// Description: get the selected files collected into page sets
//              This function is called when source is Bridge or Folder
// Input: opts - ContactSheetIIOptions
// Return: an array of page sets which are arrays of files
//
ContactSheetII.getFileSets = function(opts) {
  var sets = [];
  var setSize = opts.rowCount * opts.columnCount;
  var span = opts.spanFolders;

  var currentSet = [];

  function collectSets(f) {
    var images = f.images;
    var ss = sets;
    var cs = currentSet;

    while (images.length) {
      currentSet.push(images.shift());
      if (currentSet.length == setSize) {
        sets.push(currentSet);
        currentSet = [];
      }
    }
    if (currentSet.length != 0 && !span) {
      sets.push(currentSet);
      currentSet = [];
    }
    var folders = f.subfolders;
    while (folders.length) {
      collectSets(folders.shift());
    }
  };

  // 
  if (opts.imageSource == ZStrings.Folder) {
    var tree = ContactSheetII.getDirectoryTree(opts);
    if (tree == undefined) {
      var msg =  ZStrings.BadRecordingFmt.sprintf(ZStrings.BadFolder);
      Error.runtimeError(9006, msg);
    }

    collectSets(tree);

    if (currentSet.length != 0) {
      sets.push(currentSet);
    }

  } else if (opts.imageSource == ZStrings.Bridge) {
    if (!BridgeTalk.isRunning("bridge")) {
      Error.runtimeError(9006, ZStrings.BridgeFilesNotSelected);
    }

    var files = ContactSheetUI.getImageFilesFromBridge();
    if (!files || files.length == 0) {
      Error.runtimeError(9006, ZStrings.BridgeFilesNotSelected);
    }

    sets = ContactSheetII.getFileSetsFromFiles(opts, files);

  } else {
    // Should not reach this block
    Error.runtimeError(9500, ZStrings.UnknownInternalError);
  }

  return sets;
};

//
// Function: getDirectoryTree
// Description: Called when source is Folder to collect required files.
// Input: opts - ContactSheetIIOptions
// Return: A 'tree' object containing a reference to the root folder,
//         the image files in the folder, and an array of 'tree' objects
//         for subfolders (if indicated by opts.recurse)
//
ContactSheetII.getDirectoryTree = function(opts) {

  function getTree(f, recurse) {
    var tree = {
      folder: f,
      images: [],
      subfolders: [],
    };

    var files = f.getFiles();
    var flist = [];
    for (var i = 0; i < files.length; i++) {
      var file = files[i];
      if (psx.isValidImageFile(file) || file instanceof Folder) {
        flist.push(file);
      }
    }

    if (opts.xpSort) {
      // deviant XP Intuitive sort
      ContactSheetII.xpFileSort(flist);

    } else {
      ContactSheetII.caseInsensitiveFileSort(flist);
    }

    for (var i = 0; i < flist.length; i++) {
      var fl = flist[i];

      if (fl instanceof Folder && recurse) {
        var sub = getTree(fl, true);
        tree.subfolders.push(sub);

      } else if (psx.isValidImageFile(fl) && !fl.hidden) {
        tree.images.push(fl);
      }
    }

    return tree;
  }

  if (opts.imageSource == ZStrings.Folder && opts.folder &&
      opts.folder instanceof Folder) {
    var tree = getTree(opts.folder, opts.recurse);
    return tree;
  }

  return undefined;
};


//
// Function: computeBounds
// Description: Given the cell width and height, set properties in csOpts
//              that determine the bounds the image and (optional) caption
//              within a contact sheet cell
// Input:  csOpts - ContactSheetIIOptions
//         cellW - cell width
//         cellH - cell height
// Return: <none>
//
ContactSheetII.prototype.computeBounds = function(csOpts, cellW, cellH) {
  var self = this;

  // compute the cell bounds
  csOpts.cellBnds = [0, 0, cellW, cellH];

  csOpts.landscape = (cellW > cellH);

  // compute the basic image bounds with spacing
  var imageW = cellW - (2 * csOpts.horizontal);
  var imageH = cellH - (2 * csOpts.vertical);

  csOpts.imageBnds = [csOpts.horizontal, csOpts.vertical,
                      imageW+csOpts.horizontal, imageH+csOpts.vertical];

  var capHeight = 0;
  var overlay = false;

  var caption = csOpts.caption;

  if (caption) {
    var heightV = UnitValue(csOpts.fontSizePT, "pt");
    heightV.baseUnit = UnitValue(1/csOpts.resolution, "in");
    capHeight = heightV.as('px');
    imageH -= Math.round(capHeight + csOpts.vertical/2);
  }

  csOpts.imageBnds[2] = csOpts.imageBnds[0] + imageW;

  if (!caption) {
    csOpts.imageBnds[3] = csOpts.imageBnds[1] + imageH;
    csOpts.captionBnds = [0, 0, 0, 0];

  } else {
    csOpts.imageBnds[3] = csOpts.imageBnds[1] + imageH;

    // compute the bounds for the caption
    var yy;
    yy = Math.round(csOpts.imageBnds[3] + csOpts.vertical/2);
    
    csOpts.captionBnds = [0, yy, cellW, yy + capHeight];
  }
};

//
// Function: offsetBounds
// Description: translate the rectangle defined by bnds by x,y
// Input:  bnds - the rectangle to be translated
//         x,y  - to amount translate
// Return: a translated copy of bnds
//
ContactSheetII.prototype.offsetBounds = function(bnds, x, y) {
  return [bnds[0]+x, bnds[1]+y, bnds[2]+x, bnds[3]+y];
};


//
// Function: contactSheetX
// Description: Creates a new sheet document and populates it with cells
// Input:  csOpts - ContactSheetIIOptions
// Return: the newly created and populated contact sheet
//
ContactSheetII.prototype.contactSheetX = function(csOpts) {
  var self = this;

  LogFile.write("Creating sheet " + self.currentPageNumber + " with files:\n" +
                csOpts.files.toString().replace(/,/g, '\n'));

  var xbase = 0;
  var ybase = 0;
  var doc;

  doc = self.createSheet(csOpts);

  var res = doc.resolution;

  var cellW = Math.floor(csOpts.frameWidth / csOpts.columnCount);
  var cellH = Math.floor(csOpts.frameHeight / csOpts.rowCount);

  self.computeBounds(csOpts, cellW, cellH);

  var row = 0;
  var col = 0;

  var okay = true;
  var isDone = false;

  if (csOpts.acrossFirst) {
    var useGuides = false; // XXX true for debugging

    for (var i = 0; i < csOpts.rowCount && okay && !isDone; i++) {
      var yofs = i * cellH + csOpts.topMargin + ybase;

      if (useGuides) {
        doc.guides.add(Direction.HORIZONTAL, UnitValue(yofs, "px"));
        doc.guides.add(Direction.HORIZONTAL, UnitValue(yofs+cellH, "px"));
      }

      for (var j = 0; j < csOpts.columnCount && okay && !isDone; j++) {
        var xofs = j * cellW + csOpts.leftMargin + xbase;

        if (useGuides) {
          doc.guides.add(Direction.VERTICAL, UnitValue(yofs, "px"));
          doc.guides.add(Direction.VERTICAL, UnitValue(yofs+cellH, "px"));
        }

        if (self.progressPalette && self.progressPalette.isDone) {
          LogFile.write(ZStrings.UserCancelledProcessing);
          okay = false;
          break;
        }

        isDone = !self.createCell(doc, csOpts, xofs, yofs);
      }
    }
  } else {
    for (var j = 0; j < csOpts.columnCount && okay && !isDone; j++) {
      var xofs = j * cellW + csOpts.leftMargin + xbase;

      for (var i = 0; i < csOpts.rowCount && okay && !isDone; i++) {
        var yofs = i * cellH + csOpts.topMargin + ybase;

        if (self.progressPalette && self.progressPalette.isDone) {
          LogFile.write(ZStrings.UserCancelledProcessing);
          okay = false;
          break;
        }

        isDone = !self.createCell(doc, csOpts, xofs, yofs);
      }
    }
  }
  
  if (okay) {
    LogFile.write("Sheet creation complete");

    if (csOpts.alternateMargins) {
      var m = csOpts.leftMargin;
      csOpts.leftMargin = csOpts.rightMargin;
      csOpts.rightMargin = m;
    }

  } else {
    doc = undefined;
  }

  return doc;
};

//
// Function: createCellHP
// Description: Creates a new cell (thumbnail and caption) in a sheet
//              using the next available file. This file is inserted
//              by either Place or ViewlessDocument methods
// Input:  doc - the contact sheet
//         csOpts - ContactSheetIIOptions
///        x,y - the location of the cell
// Return: true if successful, false if there are no more images
//
ContactSheetII.prototype.createCellHP = function(doc, csOpts, x, y) {
  var self = this;

  var bnds = self.offsetBounds(csOpts.imageBnds, x, y);

  var rc = false;
  while (!rc) {
    try {
      var file = csOpts.files.shift();

      if (!file) {
        return false;  // we're done
      }

      LogFile.write("Processing: " + file.toUIString());

      self.imageProcessingTimer.start();
      rc = self.insertImageHP(doc, csOpts, bnds, file);
    } catch (e) {
      if (e.number != CSII.kFileOpenError) {
        // Error.runtimeError(ZStrings.ErrorInProcessing);
      }
    }
  }

  self.imageProcessingTimer.stop();

  if (csOpts.caption) {
    var bnds = self.offsetBounds(csOpts.captionBnds, x, y);

    self.insertCaption(doc, csOpts, bnds, file);
  }

  return true;
};


//
// Function: createCell
// Description: Creates a new cell (thumbnail and caption) in a sheet
//              using the next available image. If the image is a file,
//              createCellHP is called. If not, the image is an open
//              document and is ultimately copy/pasted into the sheet
// Input:  doc - the contact sheet
//         csOpts - ContactSheetIIOptions
///        x,y - the location of the cell
// Return: true if successful, false if there are no more images
//
ContactSheetII.prototype.createCell = function(doc, csOpts, x, y) {
  var self = this;

  if (csOpts.files.length == 0) {
    return false;
  }

  if (csOpts.files[0] instanceof File) {
    return self.createCellHP(doc, csOpts, x, y);
  }

  var image = undefined;
  var bnds = self.offsetBounds(csOpts.imageBnds, x, y);

  var histState;

  while (image == undefined) {
    try {
      var file = csOpts.files.shift();

      if (!file) {
        return false;  // we're done
      }

      if (file.typename == "Document") {
        LogFile.write("Processing: " + file.name);

        image = file;
        file = psx.getDocumentName(image);
        app.activeDocument = image;

        image = image.duplicate(image.name, true);
        // try { psx.mergeVisible(image); } catch (e) {}

      } else {
        LogFile.write("Processing: " + file.toUIString());
        image = self.openImage(file);
      }

      self.imageProcessingTimer.start();

      if (image.colorProfileType != ColorProfile.NONE) {
        if (csOpts.colorProfile != image.colorProfileName) {
          if (image.bitDepth != doc.bitDepth) {
            try { image.bitDepth = doc.bitDepth; }
            catch (e) {}
            try { self.convertProfile(image, csOpts.colorProfile); }
            catch (e) {}
          }
        }
      }
    } catch (e) {
      if (e.number == 8007) { // User cancelled the operation
        Error.runtimeError(8007);
      }
      var msg = ('Image file not placed: ' + file + ' - ' + e.message +
                 '@' + e.line);
      LogFile.write(msg);
      LogFile.logException(e);
      self.errorCount++;
    }
  }

  self.insertImage(doc, csOpts, bnds, image);

  self.imageProcessingTimer.stop();

  if (csOpts.caption) {
    var bnds = self.offsetBounds(csOpts.captionBnds, x, y);

    self.insertCaption(doc, csOpts, bnds, file, image);
  }

  app.activeDocument = image;
  image.close(SaveOptions.DONOTSAVECHANGES);
  app.activeDocument = doc;

  return true;
};

//
// Function: insertImage
// Description: Inserts an image into a sheet using the specified bounds
// Input:  doc - the contact sheet
//         csOpts - ContactSheetIIOptions
//         bnds - the rectangle into which the image is to be inserted
//         image - the open image to be inserted
// Return: the new image layer
//
ContactSheetII.prototype.insertImage = function(doc, csOpts, bnds, image) {
  var self = this;

  self.imageCount++;

//   LogFile.write("Inserting image " + image.name + " at " + bnds);

  app.activeDocument = doc;
  var layer = doc.artLayers.add();

  // XXX app.activeDocument = image;
  var lname = File(image.name).strf("%f");

  app.activeDocument = doc;
  layer.name = lname;

  psx.selectBounds(doc, bnds, SelectionType.REPLACE, 0.0, false);

  var fit = !csOpts.autoFill;

  layer = self.insertImageIntoSelection(doc, csOpts, layer, image, fit);

  app.activeDocument = doc;
  doc.selection.deselect();

  self.alignThumbnail(doc, csOpts, bnds, layer);

  var style = csOpts.thumbStyle;
  if (style && style != CSII.NO_THUMB_STYLE) {
    layer.applyStyle(style);
  }

  if (csOpts.accumulateKeywords) {
    var iptc = new IPTC(doc);
    iptc.addKeywords(image.info.keywords);
  }

  return layer;
};


//
// Function: insertCaption
// Description: Inserts a caption for a thumbnail on a sheet. For performance
//              reasons, the first text layer created is used as a template
//              for subsequent captions
// Input:  doc - the contact sheet
//         csOpts - ContactSheetIIOptions
//         bnds - the rectangle into which the caption is to be inserted
//         file - the file used for the caption
//         image - the open image to be inserted
// Return: the text layer containing the caption
//
ContactSheetII.prototype.insertCaption = function(doc, csOpts, bnds, file,
                                                  image) {
  var self = this;

  if (file == undefined) {
    file = File(image.name);
  }
  var caption = decodeURI(file.name);

  if (csOpts.captionFilename) {
    if (csOpts.noExtensions) {
      caption = file.strf("%f");
    }
  } else {
    caption = '';
  }

//   LogFile.write("Inserting caption " + caption + " at " + bnds);

  app.activeDocument = doc;

  if (!self.cacheLayers) {
    self.cacheLayers = {};
  }

  var layer = self.cacheLayers[doc.name];
  var titem;

  if (!layer) {
    layer = doc.artLayers.add();
    doc.activeLayer = layer;
    self.cacheLayers[doc.name] = layer;
    layer.kind = LayerKind.TEXT;
    titem = layer.textItem;

    if (!csOpts._fontColor) {
      csOpts._fontColor = psx.colorFromString(csOpts.fontColor);
    }
    titem.color = csOpts._fontColor;
    titem.size = csOpts.fontSizePT;
    titem.font = csOpts.font;
    titem.kind = TextType.PARAGRAPHTEXT;  // XXX ???

    if (csOpts.autoscaleCaptions) {
      titem.minimumGlyphScaling = 75;
      titem.desiredGlyphScaling = 100;
    }

    titem.justification = Justification.CENTERJUSTIFIED;

    titem.width = bnds[2]-bnds[0];

    var style = csOpts.captionStyle;
    if (style && style != CSII.NO_CAPTION_STYLE) {
      layer.applyStyle(style);
    }

  } else {
    var imageLayer = doc.activeLayer;
    layer = layer.duplicate(imageLayer, ElementPlacement.PLACEBEFORE);
    doc.activeLayer = layer;
    titem = layer.textItem;
    if (titem.desiredGlyphScaling != 100) {
      titem.desiredGlyphScaling = 100;
    }
  }

  layer.name = decodeURI(file.name);
  // app.preferences.typeUnits = TypeUnits.PIXELS;
  titem = layer.textItem;
  titem.contents = caption;

  function _recomputeWidth(textItem) {
    // switching the kind forces PS to recompute the text size
    var contents = textItem.contents;
    textItem.kind = TextType.POINTTEXT;
    textItem.contents = contents;
    textItem.kind = TextType.PARAGRAPHTEXT;

    return Math.round(textItem.parent.bounds[2]-textItem.parent.bounds[0]);
    // return Math.round(textItem.width); Needs to be converted...
  }

  var captionWidth = bnds[2]-bnds[0];

  // Check to see if the caption is too wide
  var twidth = _recomputeWidth(titem);

  if (csOpts.autoscaleCaptions) {
    // try to scale the glyph width to make it fit
    if (twidth > captionWidth) {
      if ((captionWidth / twidth) > 0.75) {
        titem.desiredGlyphScaling = (100 * captionWidth) / twidth;
      } else {
        titem.desiredGlyphScaling = 75;
      }

      twidth = _recomputeWidth(titem);
    }
  }

  if (csOpts.dotTruncate) {
    // truncate the text until it fits
    if (twidth > captionWidth) {
      if (caption.length <= 4) {
        // handle the deviant case here
        titem.contents = caption[0] + '...';

      } else {
        // we need to retrieve the caption from the contents
        // because the initial _recomputeWidth may have truncated
        // the caption. It may be a bug or just odd behaviour
        caption = titem.contents;
        var len = Math.round((captionWidth/twidth) * caption.length);
        var str = caption.substring(0, len-4) + '...';

        // take off the file extension first
        while (twidth > captionWidth+4) {
          titem.contents = str;
          if (str.length <= 4) {
            break;
          }

          twidth = _recomputeWidth(titem);
          
          str = str.substring(0, str.length-4) + '...';
        }
      }
    }
  }

  var rightV = UnitValue(bnds[2], "px");
  rightV.baseUnit = UnitValue(1/csOpts.resolution, "in");
  var leftV = UnitValue(bnds[0], "px");
  leftV.baseUnit = UnitValue(1/csOpts.resolution, "in");
  
  titem.width = (rightV.as('pt')-leftV.as('pt'));

  var topV = UnitValue(bnds[1], "px");
  topV.baseUnit = UnitValue(1/csOpts.resolution, "in");
  
  titem.position = [leftV, topV];

  return layer;
};


//
// Function: insertImageIntoSelection
// Description: Inserts an image into a sheet using the current selection
//              and creates a mask for the image
// Input:  doc - the contact sheet
//         csOpts - ContactSheetIIOptions
//         layer - the layer into which the image is to be inserted
//         im - the open image or file to be inserted
//         fit - should the image fit the selection bounds or fill the bounds
// Return: the new image layer
//
ContactSheetII.prototype.insertImageIntoSelection = function(doc, csOpts,
                                                            layer, im, fit) {
  var self = this;

  var imageDoc;
  var imageFile;

  if (im instanceof Document) {
    imageDoc = im;

  } else {
    imageFile = psx.convertFptr(im);
  }

  if (fit == undefined) fit = true;

  app.activeDocument = doc;

  if (!psx.hasSelection(doc)) {
    Error.runtimeError(8152); // NoSelection
  }

  var bnds = psx.getSelectionBounds(doc);

  // resize the image doc based on the selection bounds
  var width = bnds[2] - bnds[0];
  var height = bnds[3] - bnds[1];

  if (!imageDoc) {
    if (!imageFile.exists) {
      alert(ZStrings.ImageDoesNotExistFmt.sprintf(imageFile.toUIString()));
      return;
    }
    imageDoc = app.open(imageFile);
  }

  app.activeDocument = imageDoc;
  var lname = imageDoc.name;

  if (imageDoc.mode == DocumentMode.BITMAP) {
    imageDoc.changeMode(ChangeMode.GRAYSCALE);
    psx.copyLayerToDocument(imageDoc, imageDoc.activeLayer, doc);
    psx.undo();

  } else if (imageDoc.mode == DocumentMode.INDEXEDCOLOR ||
             imageDoc.mode == DocumentMode.MULTICHANNEL) {
    imageDoc.changeMode(ChangeMode.RGB);
    psx.copyLayerToDocument(imageDoc, imageDoc.activeLayer, doc);
    psx.undo();

  } else 
    psx.copyLayerToDocument(imageDoc, imageDoc.activeLayer, doc); {
  }

  // the rest of this code is the same insertImageIntoBounds

  app.activeDocument = doc;
  var layer = doc.activeLayer;
  layer.name = lname;

  var lbnds = psx.getLayerBounds(doc, layer);
  var lw = lbnds[2]-lbnds[0];
  var lh = lbnds[3]-lbnds[1];

  if (csOpts.bestFit) {
    var deg = (csOpts.rotate == 'CW' ? 90 : -90);

    if (csOpts.landscape && lh > lw) {
      layer.rotate(deg);
    }
    if (!csOpts.landscape && lw > lh) {
      layer.rotate(deg);
    }

    lbnds = psx.getLayerBounds(doc, layer);
    lw = lbnds[2]-lbnds[0];
    lh = lbnds[3]-lbnds[1];
  }

  var orient;

  var lrat = lh/lw;
  var rat  = height/width;
  if (fit) {
    if (lrat > rat) {
      orient = 'vert';
    } else {
      orient = 'horz';
    }
  } else { // fill
    if (lrat > rat) {
      orient = 'horz';
    } else {
      orient = 'vert';
    }
  }

  doc.selection.deselect();
  ContactSheetII.transformLayer(doc, layer, bnds, orient);
  psx.selectBounds(doc, bnds);
  psx.createLayerMask(doc, layer, true);

  return layer;
};


// HiPerf Code

// function replaceLayer(file){
//   var desc = new ActionDescriptor();
//   desc.putPath(cTID("null"), new File(file));
//   executeAction(sTID("placedLayerReplaceContents"), desc, DialogModes.NO);
// };


//
// Function: placeImage
// Description: place an image into the active document as a smart object
// Input:  file - the image file to be placed
// Return: the result descriptor
//
function placeImage(file) {
  var desc7 = new ActionDescriptor();
  desc7.putPath( cTID('null'), file);
  desc7.putEnumerated( cTID('FTcs'), cTID('QCSt'), cTID('Qcsa') );
  var desc8 = new ActionDescriptor();
  desc8.putUnitDouble( cTID('Hrzn'), cTID('#Pxl'), 0.000000 );
  desc8.putUnitDouble( cTID('Vrtc'), cTID('#Pxl'), 0.000000 );
  desc7.putObject( cTID('Ofst'), cTID('Ofst'), desc8 );
  return executeAction( cTID('Plc '), desc7, DialogModes.NO );
};


//
// Function: alignThumbnail
// Description: aligns the thumbnail within the cell. For this release,
//              this is always CENTER, BOTTOM
// Input:  doc - the contact sheet
//         csOpts - ContactSheetIIOptions
//         bnds - the bounds of the current cell
//         layer - the thumbnail layuer
//         fit - should the image fit the selection bounds or fill the bounds
// Return: <none>
//
ContactSheetII.prototype.alignThumbnail = function(doc, csOpts, bnds, layer) {
  var vert = 0;
  var horz = 0;

  if (csOpts.valign == CSII.TOP) {
    vert = -(layer.bounds[1].value-bnds[1]);

  } else if (csOpts.valign == CSII.BOTTOM) {
    vert = layer.bounds[1].value-bnds[1];
  }

  var imageCenter = (bnds[0]+bnds[2])/2; // the horizontal center of the image
  var cellCenter = (csOpts.cellBnds[0]+csOpts.cellBnds[2])/2;

  // assert(imageCenter == cellCenter);

  if (csOpts.halign == CSII.LEFT) {
    horz = bnds[0] + csOpts.cellBnds[0] - layer.bounds[0].value;

  } else if (csOpts.halign == CSII.RIGHT) {
    horz = -(bnds[0] + csOpts.cellBnds[0] - layer.bounds[0].value);
  }

  if (vert || horz) {
    layer.translate(UnitValue(horz, "px"), UnitValue(vert, "px"));
  }
};

//
// Function: insertImageHP
// Description: Inserts a file into a sheet using the specified bounds.
//              This will use either Place or ViewDocument method
// Input:  doc - the contact sheet
//         csOpts - ContactSheetIIOptions
//         bnds - the rectangle into which the image is to be inserted
//         file - the file to be inserted
// Return: the new image layer or undefined if there was a failure
//
ContactSheetII.prototype.insertImageHP = function(doc, csOpts, bnds, file) {
  var self = this;

  self.imageCount++;

//   LogFile.write("Inserting image " + decodeURI(file.name) + " at " + bnds);

  app.activeDocument = doc;

  // Add the thumbnail layer and give it the files name
  var layer = doc.artLayers.add();
  var lname = file.strf("%f");

  layer.name = lname;

  var fit = !csOpts.autoFill;

  layer = self.insertImageIntoBounds(doc, layer, csOpts, bnds, file, fit);

  if (!layer) {
    return undefined;
  }

  app.activeDocument = doc;

  self.alignThumbnail(doc, csOpts, bnds, layer);

  return layer;
};

//
// if PLACE_IMAGE is true, images are placed directly from the file to the layer
// if PLACE_IMAGE is false, a ViewDocument is created then copied to the sheet
//
var PLACE_IMAGE = true;

if (!PLACE_IMAGE) {
  var s = psx.SCRIPTS_FOLDER + "/Stack Scripts Only/Terminology.jsx";
  $.evalFile(s);
  var s = psx.SCRIPTS_FOLDER + "/Stack Scripts Only/StackSupport.jsx";
  $.evalFile(s);
}


//
// Function: insertImageIntoBounds
// Description: Inserts a file into a sheet using the specified bounds.
//              This will use either Place or ViewDocument method
// Input:  doc - the contact sheet
//         layer - the layer where the image file will be inserted
//         csOpts - ContactSheetIIOptions
//         bnds - the rectangle into which the image is to be inserted
//         file - the file to be inserted
//         fit - should the image fit the selection bounds or fill the bounds
// Return: the new image layer or undefined if there was a failure
//
ContactSheetII.prototype.insertImageIntoBounds = function(doc, layer, csOpts,
                                                          bnds, file, fit) {
  var self = this;

  if (fit == undefined) fit = true;

  var width = bnds[2] - bnds[0];
  var height = bnds[3] - bnds[1];

  if (!file.exists) {
    var msg = ZStrings.ImageDoesNotExistFmt.sprintf(file.toUIString());
    LogFile.write(msg);
    return undefined;
  }

  var f = file;

  if (PLACE_IMAGE) {
    try {
      var desc = placeImage(f);

      layer = doc.activeLayer;

      if (f != file) {
        f.remove();
      }

      try {
        layer.resize(100, 100, AnchorPosition.MIDDLECENTER);

      } catch (e) {
        if (e.number == 8007) {      // User cancelled
          try {
            layer.resize(100, 100, AnchorPosition.MIDDLECENTER);
          } catch (e) {
            if (e.number != 8007) {      // User cancelled
              Error.runtimeError(9001, e.toString());
            }
          }
        } else {
          Error.runtimeError(9001, e.toString());
        }
      }

    } catch (e) {
      if (e.number == 8007) { // User cancelled the operation
        Error.runtimeError(8007);
      }

      var msg = ('Image file not placed: ' + file + ' - ' + e.message +
                 '@' + e.line);
      LogFile.write(msg);
      LogFile.logException(e);
      self.errorCount++;

      // try some error recovery...
      Error.runtimeError(CSII.kFileOpenError, ZStrings.ErrorInProcessing);
      return undefined;
    }

    function _rasterize() {
      var desc = new ActionDescriptor();
      var ref = new ActionReference();
      ref.putEnumerated( cTID('Lyr '), cTID('Ordn'), cTID('Trgt') );
      desc.putReference( cTID('null'), ref );
      executeAction( sTID('rasterizeLayer'), desc, DialogModes.NO );
    };

    if (!csOpts.embedSmartObjects) {
      _rasterize(doc, layer);
    }

  } else {
    // Use ViewlessDocument code from StackSupport
    // This currently does not work
    var vd = openViewlessDocument(f.fsName);
    vd.addToActiveDocument();
    if (layer != doc.activeLayer) {
      psx.mergeDown(doc);
    }
    layer = doc.activeLayer;
  }

  var lname = layer.name;

  var lbnds = psx.getLayerBounds(doc, layer);
  var lw = lbnds[2]-lbnds[0];
  var lh = lbnds[3]-lbnds[1];

  if (csOpts.bestFit) {
    var deg = (csOpts.rotate == CSII.CW ? 90 : -90);

    if (csOpts.landscape && lh > lw) {
      layer.rotate(deg);
    }
    if (!csOpts.landscape && lw > lh) {
      layer.rotate(deg);
    }

    lbnds = psx.getLayerBounds(doc, layer);
    lw = lbnds[2]-lbnds[0];
    lh = lbnds[3]-lbnds[1];
  }

  var orient;

  var lrat = lh/lw;
  var rat  = height/width;
  if (fit) {
    if (lrat > rat) {
      orient = 'vert';
    } else {
      orient = 'horz';
    }
  } else { // fill
    if (lrat > rat) {
      orient = 'horz';
    } else {
      orient = 'vert';
    }
  }

  ContactSheetII.transformLayer(doc, layer, bnds, orient);
  psx.selectBounds(doc, bnds);
  psx.createLayerMask(doc, layer, true);
  doc.selection.deselect();

  return layer;
};


//
// Function: transformLayer
// Description: transform a layer to fit the bounds indicated. If there
//              was a problem populating the layer, the space defined
//              by bnds will be filled grey.
// Input:  doc - the contact sheet
//         layer - the layer where the image file will be inserted
//         bnds - the rectangle into which the image is to be inserted
//         orient - 'vert' or 'horz'. Needed for fit/fill setting.
// Return: the new image layer or undefined if there was a failure
//
ContactSheetII.transformLayer = function(doc, layer, bnds, orient) {
  var lbnds = psx.getLayerBounds(doc, layer);

  var newW = bnds[2]-bnds[0];
  var newH = bnds[3]-bnds[1];
  var oldW = lbnds[2]-lbnds[0];
  var oldH = lbnds[3]-lbnds[1];

  var hrzn = bnds[0] - (lbnds[0] - (newW-oldW)/2);
  var vrtc = bnds[1] - (lbnds[1] - (newH-oldH)/2);

  if (oldW == 0 || oldH == 0) {
    psx.selectBounds(doc, bnds);
    doc.selection.fill(psx.COLOR_GRAY);
    return;
  }

  var prc  = 0;
  if (orient == 'horz') {
    prc = (newW/oldW) * 100;
  } else {
    prc = (newH/oldH) * 100;
  }

  function _ftn() {
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putEnumerated( cTID('Lyr '), cTID('Ordn'), cTID('Trgt') );
    desc.putReference( cTID('null'), ref );
    desc.putEnumerated( cTID('FTcs'), cTID('QCSt'), cTID('Qcsa') );
    var ldesc = new ActionDescriptor();
    ldesc.putUnitDouble( cTID('Hrzn'), cTID('#Pxl'), hrzn );
    ldesc.putUnitDouble( cTID('Vrtc'), cTID('#Pxl'), vrtc );
    desc.putObject( cTID('Ofst'), cTID('Ofst'), ldesc );
    desc.putUnitDouble( cTID('Wdth'), cTID('#Prc'), prc );
    desc.putUnitDouble( cTID('Hght'), cTID('#Prc'), prc );
    executeAction( cTID('Trnf'), desc, DialogModes.NO );
  };

  app.activeDocument = doc;
  doc.activeLayer = layer;
  _ftn();
};

"CSIILayout.jsx";
// EOF

//
// CSIIExt
//
// $Id: CSIIExt.jsx,v 1.4 2012/03/03 01:06:52 anonymous Exp $
// Copyright: (c)2011, xbytor
// Author: xbytor@gmail.com
//
// Some parts: c2009 Adobe Systems, Inc. All rights reserved.
//


//
// UI constants
//
ContactSheetUI.CSII_WIDTH  = 560;
ContactSheetUI.CSII_HEIGHT = 700;

ContactSheetUI.MIN_COLS_ROWS = 1;
ContactSheetUI.MAX_COLS_ROWS = 100;
ContactSheetUI.CM_PER_INCH = 2.54;
ContactSheetUI.MM_PER_INCH = 25.4;
ContactSheetUI.MIN_RES_INCHES =	35.0;
ContactSheetUI.MAX_RES_INCHES =	1200.0;
ContactSheetUI.MIN_RES_CM = 
    (ContactSheetUI.MIN_RES_INCHES / ContactSheetUI.CM_PER_INCH);
ContactSheetUI.MAX_RES_CM =
    (ContactSheetUI.MAX_RES_INCHES / ContactSheetUI.CM_PER_INCH);
ContactSheetUI.MIN_RES_MM =
    (ContactSheetUI.MIN_RES_INCHES / ContactSheetUI.MM_PER_INCH);
ContactSheetUI.MAX_RES_MM =
    (ContactSheetUI.MAX_RES_INCHES / ContactSheetUI.MM_PER_INCH);
ContactSheetUI.MIN_PIXELS = 100;
ContactSheetUI.MAX_PIXELS = 29000;

ContactSheetUI.DEFAULT_FONT_SIZE = 12;
ContactSheetUI.MIN_FONTSIZE =	4;
ContactSheetUI.MAX_FONTSIZE =	72;

ContactSheetUI.PS_MIN_DESIRED_X_GAP = 20;
ContactSheetUI.PS_MIN_DESIRED_Y_GAP = 20;

ContactSheetUI.notes = undefined;

//
// Function: createPanel
// Description: Creates the subpanels in the CSII Dialog
// Input:  pnl - Panel
//         ini - ContactSheetIIOptions
// Return: pnl
//
ContactSheetUI.prototype.createPanel = function(pnl, ini) {
  var self = this;
  var opts = new ContactSheetIIOptions(ini);

  pnl.window.processor = self;
  pnl.mgr = self;

  // var bnds = pnl.window.bounds;
  // self.winRect.w = bnds.width = 560;
  // self.winRect.h = bnds.height = 600;

  self.textOfs = 2;
  self.menuWidth = 120;
  self.textWidth = 80;
  self.lineH = 28;
  self.xOfs = 5;
  self.gutter = 90;

  var panelWidth = 400;

  var yOfs = 0;
  var xOfs = self.xOfs;
  var xx = xOfs;
  var yy = yOfs;

  pnl.sourcePanel = pnl.add('panel', [xx,yy,xx+panelWidth,yy+210],
                            ZStrings.SourceImages, { name: 'SourcePanel'});
  self.createCSIISourcePanel(pnl.sourcePanel, opts);

  yy += pnl.sourcePanel.bounds.height + 10;

  pnl.docPanel = pnl.add('panel', [xx,yy,xx+panelWidth,yy+250], 
                         ZStrings.Document,
                         { name: 'docPanel' });
  self.createCSIIDocumentPanel(pnl.docPanel, opts);

  yy += pnl.docPanel.bounds.height + 10;

  pnl.thumbnailPanel = pnl.add('panel', [xx,yy,xx+panelWidth+50,yy+130],
                               ZStrings.Thumbnails,
                               { name: 'thumbnailPanel' });
  self.createCSIIThumbnailPanel(pnl.thumbnailPanel, opts);

  yy += pnl.thumbnailPanel.bounds.height + 10;

  pnl.captionPanel = pnl.add('panel', [xx,yy,xx+panelWidth+50,yy+50],
                             ZStrings.FilenameAsCaption,
                             { name: 'captionPanel' });
  self.createCSIICaptionPanel(pnl.captionPanel, opts);

  var maxW = Math.max(pnl.thumbnailPanel.bounds.width,
                      pnl.captionPanel.bounds.width);
  pnl.thumbnailPanel.bounds.width = pnl.captionPanel.bounds.width = maxW;

  pnl.ctrlPanel = pnl.add('group',
                          [xx+panelWidth+10,0,pnl.bounds.width-10,400],
                          { name: 'ctrlPanel' });
  self.createCSIIControlPanel(pnl.ctrlPanel);

  return pnl;
};

//
// Function: _fixMaxWidth
// Description: Returns the widest display width from an array of strings
// Input:  pnl - Panel
//         ary - Array of UI strings
// Return: int
//
function _findMaxWidth(pnl, ary) {
  var maxW = 0;
  for (var i = 0; i < ary.length; i++) {
    var w = pnl.graphics.measureString(ary[i])[0];
    maxW = Math.max(maxW, w);
  }
  return maxW;
};

//
// Function: createCSIISourcePanel
// Description: Creates the Source pnl
// Input:  pnl - Panel
//         opts - ContactSheetIIOptions
// Return: pnl
//
ContactSheetUI.prototype.createCSIISourcePanel = function(pnl, opts) {
  var self = this;

  LogFile.write("Creating Source Panel");

  self.sourcePanel = pnl;

  var xOfs = self.xOfs;
  var yOfs = 12;
  var gutter1 = 40;
  var gutter = 90

  var x = xOfs;
  var y = yOfs;

  var w = pnl.bounds.width;

  var width = 125;

  pnl.mgr = this;

  var maxLen = _findMaxWidth(pnl, [ZStrings.Choose, ZStrings.UseLabel]);

  if (maxLen + 15 > gutter) {
    gutter = maxLen + 15;
  }

  // Image Source
  pnl.useLbl = pnl.add('statictext',
                       [x,y+self.textOfs,x+gutter-10,y+22+self.textOfs],
                       ZStrings.UseLabel,
                       { name: 'imageSourceLabel' });
  pnl.useLbl.helpTip = ZStrings.UseTip;
  x += gutter;

  var srcsel = [ZStrings.Files, ZStrings.Folder];

  if (app.documents.length > 0) {
    srcsel.push(ZStrings.CurrentDocs);
  }

  if (ContactSheetII.bridgeIsRunning) {
    srcsel.push(ZStrings.Bridge);
  }

  if (ContactSheetII.runningFromBridge == true) {
    srcsel = [ZStrings.Bridge];
  }

  var maxW = _findMaxWidth(pnl, srcsel);
  var menuWidth = Math.max(maxW + 25, width);

  pnl.imageSource = pnl.add('dropdownlist', [x,y,x+menuWidth,y+22], srcsel,
                            { name: 'imageSource' });

  pnl.imageSource.selection = 0;
  pnl.imageSource.helpTip = ZStrings.UseTip;
  y += 28;
  x = xOfs;

  // adjust the button width if we have long strings in a particular locale
  var btnH = 25;
  var btnW = 120;
  // var btnW = psx.delocalize(ZStrings.SourcePnlBtnWidth, 120);
  // btnW = 140; // locale testing

  var btns = [ZStrings.Browse, ZStrings.Remove, 
              ZStrings.AddOpenFiles, ZStrings.AddBridgeFiles];
  
  var maxW = _findMaxWidth(pnl, btns);

  btnW = Math.max(maxW+10, btnW);


  var fileListWidth = pnl.bounds.width - x - 20 - btnW;

  pnl.fileList = pnl.add('listbox', [x,y,x+fileListWidth,y+152], undefined,
                         { name: 'fileList', multiselect: true });

  pnl.fileList.onDoubleClick = function() {
    var pnl = this.parent;
    ContactSheetII.caseInsensitiveFileSort(pnl.fileSet);
    _updateFileList(pnl, pnl.fileSet);
  }

  x += fileListWidth + 10;

  pnl.browseBtn = pnl.add('button', [x,y,x+btnW,y+btnH], ZStrings.Browse);
  y += btnH + 5;
  pnl.removeBtn = pnl.add('button', [x,y,x+btnW,y+btnH], ZStrings.Remove);
  y += btnH + 5;
  pnl.addOpenBtn = pnl.add('button', [x,y,x+btnW,y+btnH],
                           ZStrings.AddOpenFiles);
  y += btnH + 5;
  pnl.addBridgeBtn = pnl.add('button', [x,y,x+btnW,y+btnH],
                             ZStrings.AddBridgeFiles);

  pnl.fileWidgetList = [pnl.fileList, pnl.browseBtn, pnl.removeBtn,
                        pnl.addOpenBtn, pnl.addBridgeBtn];

  y = yOfs + 28;
  x = xOfs;

  pnl.selNote = pnl.add('statictext',
                        [x+gutter1,y+self.textOfs,w-xOfs,y+22+self.textOfs],
                        '', { name: 'selectionNote' });
  // Images
  pnl.browse = pnl.add('button', [x,y,x+gutter-10,y+22], ZStrings.Choose);
  pnl.browse.helpTip = ZStrings.ChooseSourceFolderTip;
  x += gutter;

  var textType = (isMac() ? 'statictext' : 'edittext');
  var xtofs = (isMac() ? 3 : 0);

  pnl.folder = pnl.add(textType, [x,y+xtofs,w-10,y+23+xtofs], '',
                       { readonly : true, name: 'sourceFolder' });
  pnl.folder.helpTip = ZStrings.ChooseSourceFolderTip;

  y += 30;
  x = xOfs;

  // Subfolders
  pnl.recurse = pnl.add('checkbox', [x,y,pnl.bounds.width,y+25],
                        ZStrings.IncludeSubfolders,
                        CSIIDefaults.includeSubfolders,
                        { name: 'recurse' });
  pnl.recurse.helpTip = ZStrings.IncludeSubfoldersTip;

  y += 30;

  // Group
  pnl.group = pnl.add('checkbox', [x,y,pnl.bounds.width,y+25],
                      ZStrings.GroupByFolder,
                      CSIIDefaults.groupImages,
                      { name: 'groupByFolder' });
  pnl.group.helpTip = ZStrings.GroupByFolderTip;

  pnl.imageSource.onChange = function() {
    var pnl = this.parent;
    var sel = pnl.imageSource.selection.text;

    var isFolder = (sel == ZStrings.Folder);

    pnl.browse.enabled = isFolder;
    pnl.folder.enabled = isFolder;
    pnl.recurse.enabled = isFolder;
    pnl.group.enabled   = isFolder && pnl.recurse.value;

    if (sel == ZStrings.Bridge) {
      var files = ContactSheetUI.getImageFilesFromBridge();
      var txt = ZStrings.FilesSelectedFmt.sprintf(files.length);
      pnl.selNote.text = txt;
    }
    if (sel == ZStrings.CurrentDocs) {
      var txt = ZStrings.FilesSelectedFmt.sprintf(app.documents.length);
      pnl.selNote.text = txt;
    }

    pnl._setUIState();
  }

  pnl.fileSet = [];

  function _updateFileList(pnl, files) {
    pnl.fileList.removeAll();

    for (var i = 0; i < files.length; i++) {
      pnl.fileList.add('item', File.decode(files[i].name));
    }
  }
  function _addFileToList(pnl, files, f) {
    if (f == null) {
      return;
    }
    var fstr;
    if (f.typename == "Document") {
      fstr = name;

    } else {
      if (typeof (f) != File) {
        f = File(f.toString());
      }
      if (!psx.isValidImageFile(f)) {
        return;
      }
      fstr = f.absoluteURI;
    } 

    var i = 0;
    for (var i = 0; i < files.length; i++) {
      var file = files[i];
      if (f.typename == "Document") {
        if (f == file) {
          return;
        }
      } else {
        var estr = file.absoluteURI;
        if (fstr == estr) {
          return;
        }
      }
    }

    files.push(f);
//     ContactSheetII.caseInsensitiveFileSort(files);
  }

  pnl.removeBtn.onClick = function() {
    var pnl = this.parent;
    var list = pnl.fileList.selection;
    var fileSet = pnl.fileSet;
    if (!list || list.length == 0) {
      return;
    }
    for (var i = 0; i < list.length; i++) {
      var el = list[i];
      var txt = el.text;
      for (var j = 0; j < fileSet.length; j++) {
        var file = fileSet[j];
        var fname = File.decode(file.name);
        if (fname == txt) {
          fileSet.splice(j, 1);
          break;
        }
      }
      pnl.fileList.remove(el);
    }

    pnl._setUIState();
  }

  pnl.browseBtn.onClick = function() {
    var pnl = this.parent;
    var sel = pnl.imageSource.selection.text;

    try {
      if (sel == ZStrings.Files) {
        var files = photoshopFileOpenDialog();

        if (files.length) {
          ContactSheetII.caseInsensitiveSort(files);

          for (var i = 0; i < files.length; i++) {
            var f = files[i];
            _addFileToList(pnl, pnl.fileSet, f);
          }
        }

        _updateFileList(pnl, pnl.fileSet);

      } else if (sel == ZStrings.Folder) {
        var str = ZStrings.FolderSelect;
        var folder = Folder.selectDialog(str);
        if (folder)	{
          var sel = isMac() ? psx.macFileSelection : psx.winFileSelection;
          var files = folder.getFiles(sel);
          ContactSheetII.caseInsensitiveSort(files); 

          for (var i = 0; i < files.length; i++) {
            var f = files[i];
            _addFileToList(pnl, pnl.fileSet, f);
          }

          _updateFileList(pnl, pnl.fileSet);
        }
      }
    } catch (e) {
      alert(psx.exceptionMessage(e));
    }
    
    pnl._setUIState();
  }

  pnl.addOpenBtn.onClick = function() {
    var pnl = this.parent;
    var docs = app.documents;

    for (var i = 0; i < docs.length; i++) {
      var doc = docs[i];

      _addFileToList(pnl, pnl.fileSet, doc);
    }

    _updateFileList(pnl, pnl.fileSet);
  }

  pnl.addBridgeBtn.onClick = function() {
    var pnl = this.parent;
    var files = ContactSheetUI.getImageFilesFromBridge();
    for (var i = 0; i < files.length; i++) {
      var file = files[i];
      _addFileToList(pnl, pnl.fileSet, file);
    }

    _updateFileList(pnl, pnl.fileSet);
  }

  if (opts.folder) {
    pnl.folder._folder = new Folder(opts.folder).toUIString();
    pnl.folder.text = ContactSheetUI.shortFileName(pnl.folder._folder);

  } else {
    pnl.folder._folder = undefined;
    pnl.folder.text = '';
  }
  pnl.recurse.value = toBoolean(opts.recurse);
  pnl.group.value = !toBoolean(opts.spanFolders);

  pnl.browse.onClick = function() {
    try {
      var pnl = this.parent;
      var def;
      if (pnl.folder._folder) {
        def = pnl.folder._folder;
      } else {
        def = Folder.desktop;
      }
      var f = psx.selectFolder(ZStrings.BrowseForFolder, def);
      if (f) {
        var fname = decodeURI(f.fsName);
        pnl.folder._folder = f;
        pnl.folder.text = ContactSheetUI.shortFileName(fname);
      }
    } catch (e) {
      alert(psx.exceptionMessage(e));
    }
  };

  pnl.recurse.onClick = function() {
    var pnl = this.parent;
    pnl.group.enabled = pnl.recurse.value;
  };

  pnl._setUIState = function() {
    try {
      var pnl = this;
      var sel = pnl.imageSource.selection.text;
      var isFiles = (sel == ZStrings.Files);
      var isFolder = (sel == ZStrings.Folder);
      var len = pnl.children.length;

      for (var i = 0; i < len; i++) {
        var child = pnl.children[i];
        if (child.properties && child.properties.name &&
            child.properties.name.contains('imageSource')) {
          continue;
        }

        if (isFiles) {
          child.visible = pnl.fileWidgetList.contains(child);
        } else if (isFolder) {
          child.visible = !pnl.fileWidgetList.contains(child);
        } else {
          child.visible = false;
        }
      }

      pnl.selNote.visible = !(isFiles || isFolder);

      // pnl.removeBtn.enabled = (pnl.fileSet.length > 0
      //                          && pnl.fileList.selection);
      pnl.addOpenBtn.enabled = app.documents.length > 0;
      pnl.addBridgeBtn.enabled = BridgeTalk.isRunning("bridge");

    } catch (e) {
      alert(psx.exceptionMessage(e));
    }
  }

  pnl.imageSource.onChange();

  return pnl;
};


//
// Function: _approximate
// Description: Approximates a number for the UI
// Input:  f - number
// Return: number or UnitValue
//
function _approximate(f) {
  var p = 3;

  if (f instanceof UnitValue) {
    var un = UnitValue(f.toString());
    f = un.value;
    var v = Number(f.toFixed(3));
    un = UnitValue(v, un.type);

    if (un.type == "px") {
      if (un.value == 0) {
        un.value = 1;
      } else {
        un.value = Math.round(un.value);
      }
    }

    return un;

  } else {
    return Number(f.toFixed(3));
  }
};

//
// Function: updateUnitWidget
// Description: Set the value of a numeric UI field
// Input:  obj - UI widget
//         type - UnitValue type
//         base - the resolution base (opt)
// Return: number or UnitValue
//
ContactSheetUI.prototype.updateUnitWidget = function(obj, type, base) {
  var pnl = obj.parent;

  var un = UnitValue(obj._last, "px");

  if (!base) {
    base = UnitValue(1/72, "in");
  }

  un.baseUnit = base;
  var val = un.as(type);

  if (type == "px") {
    // var processor = pnl.window.processor;
    // if (pnl == processor.docPnl) {
    //   var rez = psx.delocalizeNumber(pnl.resolution.text);
    //   var lastUnit = UnitValue(psx.delocalizeNumber(obj.text), pnl.units._last);
    //   lastUnit.baseUnit = base;

    //   if (lastUnit.type == "in") {
    //     val = rez * lastUnit.value;
    //   } else {
    //     val = rez * lastUnit.value * ContactSheetUI.CM_PER_INCH;
    //   }

    //   un.value = val;
    //   obj._last = un.as("px");

    // } else {
    val = Math.round(val);
  }

  obj.text = psx.localizeNumber(_approximate(val));

  return;
};

//
// Function: currentUnits
// Description:  current Units in delocalized form
// Input:  <none>
// Return: delocalized Units value
//
ContactSheetUI.prototype.currentUnits = function() {
  var self = this;
  return delocalizeUnitType(self.docPnl.units.selection.text);
};

//
// Function: currentLocalizedUnits
// Description: current Units in localized form in short form
// Input:  <none>
// Return: localized Units value
//
ContactSheetUI.prototype.currentLocalizedUnits = function() {
  var self = this;
  var type = delocalizeUnitType(self.docPnl.units.selection.text);
  var un = UnitValue(0, type);
  return psx.localizeUnitValue(un).type;
};


//
// Function: handleEnterKey
// Description: This function eats Enter keys in edittext widgets
//              The onChange callback is temporarily disabled so
//              that it does not get called if the function throws
//              up an alert which would cause another onChange
//              event to get fired because of the loss of focus
//  Input: event - a UI event
//  Return: <none>
//
ContactSheetUI.handleEnterKey = function(event) {
  var obj = event.currentTarget;

  if (event.keyName == 'Enter') {
    if (obj.onChange) {
      obj._ftn = obj.onChange;
      obj.onChange = undefined;
      var res = obj._ftn();
      obj.onChange = obj._ftn;
      obj._ftn = undefined;

      // if the field validation failed, eat the Enter key
      if (res == false) {
        event.stopPropagation();
        event.preventDefault();

      } else if (res == true) {
        // if it was valid, run the script

      } else {
        // we didn't validate
      }
    }
  }
};

//
// Function: createCSIIDocumentPanel
// Description: Creates the Document panel
// Input:  pnl - Panel
//         opts - ContactSheetIIOptions
// Return: pnl
//
ContactSheetUI.prototype.createCSIIDocumentPanel = function(pnl, opts) {
  var self = this;

  var xOfs = 10;
  var yOfs = 12;
  var xx = xOfs;
  var yy = yOfs;
  var tOfs = self.textOfs;
  var menuW = self.menuWidth;
  var textW = self.textWidth;
  var lineH = self.lineH;
  var gutter = 90;
  // var gutter = toNumber(ZStrings.DocumentPnlCol2, 90);
  // gutter = 140; // locale testing

  self.docPnl = pnl;

  // adjust the gutter width if there is a long localized label strings
  var labels = [ZStrings.UnitsLabel, ZStrings.WidthLabel, ZStrings.HeightLabel,
                ZStrings.ResolutionLabel, ZStrings.ModeLabel,
                ZStrings.BitDepthLabel, ZStrings.ColorProfileLabel];
  var maxW = _findMaxWidth(pnl, labels);

  var x = gutter;
  gutter = Math.max(maxW+5, gutter);

  function _resAsInches(val, type) {
    val = psx.delocalizeNumber(val);
    return ((type == ZStrings.PixelsPerInch) ?
            val : (val/ContactSheetUI.CM_PER_INCH));
  }

  pnl._baseUnit = new UnitValue(1/300, "in");

  pnl.toPixels = function(val, type) {
    var pnl = this;
    if (isString(val)) {
      val = psx.delocalizeNumber(val);
    }
    val = toNumber(val) || undefined;
    var un = new UnitValue(val, type);
    un.baseUnit = pnl._baseUnit;
    return Math.round(un.as('px'));
  }

  pnl.getResolution = function() {
    var pnl = this;
    var val = psx.delocalizeNumber(pnl.resolution.text);
    var type = ((pnl.resUnits.selection.text == ZStrings.PixelsPerInch) ?
                "in" : "cm");
    return UnitValue(val, type);
  }

  pnl.getWidth = function() {
    return toNumber(psx.delocalizeNumber(pnl.width.text));
  }
  pnl.getHeight = function() {
    return toNumber(psx.delocalizeNumber(pnl.height.text));
  }

  //
  // Units
  //
  pnl.unitsLabel = pnl.add('statictext',
                           [xx,yy+tOfs,xx+gutter,yy+22+tOfs],
                           ZStrings.UnitsLabel);
  pnl.unitsLabel.helpTip = ZStrings.UnitsTip;

  xx += gutter;
  pnl.units = pnl.add('dropdownlist', [xx,yy,xx+menuW,yy+22],
                      [ZStrings.Inches,
                       ZStrings.Centimeter,
                       ZStrings.Pixels],
                      { name: 'units'});
  pnl.units.helpTip = ZStrings.UnitsTip;

  psxui.setMenuSelection(pnl.units, CSIIDefaults.units, undefined, true);
  pnl.units._last = UnitValue(0, delocalizeUnitType(CSIIDefaults.units)).type;

  pnl.units.onChange = function() {
    try {
      var pnl = this.parent;
      var ltype = pnl.units.selection.text;
      var processor = pnl.window.processor;
      var last = pnl.units._last;

      var type = UnitValue(0, delocalizeUnitType(ltype)).type;

      processor.updateUnitWidget(pnl.width, type, pnl._baseUnit);
      processor.updateUnitWidget(pnl.height, type, pnl._baseUnit);

      if (processor.thumbnailPnl) {
        var th = processor.thumbnailPnl;

        processor.updateUnitWidget(th.vert, type);
        th.vert.text +=  ' ' + processor.currentLocalizedUnits();

        // processor.thumbnailPnl.vert.onChange();

        processor.updateUnitWidget(th.horz, type);
        th.horz.text +=  ' ' + processor.currentLocalizedUnits();

        // processor.thumbnailPnl.horz.onChange();

        pnl.units._last = type;
      }
      
    } catch (e) {
      alert(psx.exceptionMessage(e));
    }
  }

  yy += lineH;
  xx = xOfs;

  var unitType = delocalizeUnitType(pnl.units.selection.text);

  //
  // Width
  //
  pnl.widthLabel = pnl.add('statictext',
                           [xx,yy+tOfs,xx+gutter,yy+22+tOfs],
                           ZStrings.WidthLabel);
  pnl.widthLabel.helpTip = ZStrings.WidthTip;
  xx += gutter;
  pnl.width = pnl.add('edittext', [xx,yy,xx+textW,yy+20],
                      opts.docWidth || CSIIDefaults.width,
                      { name: 'width' } );

  pnl.width._last = pnl.toPixels(pnl.width.text, unitType);
  pnl.width.helpTip = ZStrings.WidthTip;

  pnl.width.onChange = function() {
    var pnl = this.parent;
    var type = delocalizeUnitType(pnl.units.selection.text);
    var n = ContactSheetUI.getNumber(pnl.width.text,
                                     type,
                                     ZStrings.Width,
                                     ContactSheetUI.MIN_PIXELS,
                                     ContactSheetUI.MAX_PIXELS,
                                     pnl._baseUnit);
    if (typeof n != "number") {
      var un = UnitValue(pnl.width._last, "px");
      un.baseUnit = pnl._baseUnit;
      pnl.width.text = psx.localizeNumber(un.as(type));
      return false;
    }

    var last = psx.delocalizeNumber(pnl.width.text);
    pnl.width.text = psx.localizeNumber(n);
    pnl.width._last = pnl.toPixels(n, type);
    return last == n;
  }

  // pnl.width.onChanging = psxui.positiveNumberKeystrokeFilter;
  // pnl.width.addEventListener('keydown', ContactSheetUI.handleEnterKey);
  ContactSheetUI.addPositiveNumberFilter(pnl.width);

  //
  // Height
  //
  yy += lineH;
  xx = xOfs;

  pnl.heightLabel = pnl.add('statictext',
                           [xx,yy+tOfs,xx+gutter,yy+22+tOfs],
                            ZStrings.HeightLabel,
                            { justify: 'right' });
  pnl.heightLabel.helpTip = ZStrings.HeightTip;
  // The right justification bit does not work...

  xx += gutter;
  pnl.height = pnl.add('edittext', [xx,yy,xx+textW,yy+20],
                       opts.docHeight || CSIIDefaults.height,
                       { name: 'height' } );
  pnl.height.helpTip = ZStrings.HeightTip;
  pnl.height._last = pnl.toPixels(pnl.height.text, unitType);

  pnl.height.onChange = function() {
    var pnl = this.parent;
    var type = delocalizeUnitType(pnl.units.selection.text);
    
    var n = ContactSheetUI.getNumber(pnl.height.text, 
                                     type,
                                     ZStrings.Height,
                                     ContactSheetUI.MIN_PIXELS,
                                     ContactSheetUI.MAX_PIXELS,
                                     pnl._baseUnit);
    if (typeof n != "number") {
      pnl.height.active = true;
      var un = UnitValue(pnl.height._last, "px");
      un.baseUnit = pnl._baseUnit;
      pnl.height.text = psx.localizeNumber(un.as(type));
      return false;
    }
    
    var last = psx.delocalizeNumber(pnl.height.text);
    pnl.height.text = psx.localizeNumber(n);
    pnl.height._last = pnl.toPixels(n, type);
    return last == n;
  }

  // pnl.height.onChanging = psxui.positiveNumberKeystrokeFilter;
  // pnl.height.addEventListener('keydown', ContactSheetUI.handleEnterKey);
  ContactSheetUI.addPositiveNumberFilter(pnl.height);

  yy += lineH;
  xx = xOfs;

  //
  // Resolution
  //
  pnl.resolutionLabel = pnl.add('statictext',
                           [xx,yy+tOfs,xx+gutter,yy+22+tOfs],
                           ZStrings.ResolutionLabel);
  pnl.resolutionLabel.helpTip = ZStrings.ResolutionTip;
  xx += gutter;

  pnl.resolution = pnl.add('edittext', [xx,yy,xx+textW,yy+20],
                           opts.resolution || CSIIDefaults.resolution,
                           { name: 'resolution' } );
  pnl.resolution.helpTip = ZStrings.ResolutionTip;

  pnl.resolution.onChange = function(unitsOnly) {
    try {
      var pnl = this.parent;
      var processor = pnl.window.processor;
      var last = pnl.resolution._value;
      var resType = ((pnl.resUnits.selection.text == ZStrings.PixelsPerInch) ?
                     ZStrs.Units_IN : ZStrs.Units_CM);

      var res = psx.delocalizeNumber(pnl.resolution.text);
      if (isNaN(res)) {
        ContactSheetUI.invalidNumberPrompt(ZStrings.Resolution);
        pnl.resolution.active = true;
        pnl.resolution.text = psx.localizeNumber(pnl.resolution._value);
        return false;
      }

      var min;
      var max;
      if (resType == ZStrs.Units_IN) {
        min = ContactSheetUI.MIN_RES_INCHES;
        max = ContactSheetUI.MAX_RES_INCHES;

      } else {
        min = ContactSheetUI.MIN_RES_CM;
        max = ContactSheetUI.MAX_RES_CM;
      }

      var ok = true;

      if (res < min || res > max) {
        res = (res < min) ? min : max;

        min = toNumber(min.toFixed(3));
        max = toNumber(max.toFixed(3));
        ContactSheetUI.numberOutOfRange(ZStrings.Resolution, min, max);
                                        
        pnl.resolution.active = true;
        pnl.resolution.text = psx.localizeNumber(_approximate(res));
        ok = false;
      }

      var base = new UnitValue(1/res, psx.delocalizeUnitType(resType));
      pnl._baseUnit = base;

      if (!unitsOnly) {
        if (resType == ZStrs.Units_IN) {
          pnl.resolution._inches = res;
        } else {
          pnl.resolution._inches = res / ContactSheetUI.CM_PER_INCH;
        }
      }

      pnl.resolution._value = res;
      var units = processor.currentUnits();

      if (units != "px") {
        var w = pnl.getWidth();
        var h = pnl.getHeight();
        var un = UnitValue(0, units);
        un.baseUnit = pnl._baseUnit;

        un.value = w; 
        pnl.width._last = un.as("px");
        un.value = h; 
        pnl.height._last = un.as("px");
      }

      return ok;

    } catch (e) {
      alert(psx.exceptionMessage(e));
      return false;
    }
  }

  // pnl.resolution.onChanging = psxui.positiveNumberKeystrokeFilter;
  // pnl.resolution.addEventListener('keydown', ContactSheetUI.handleEnterKey);
  ContactSheetUI.addPositiveNumberFilter(pnl.height);

  xx += pnl.resolution.bounds.width + 5;

  //
  // Res Units
  //
  pnl.resUnits = pnl.add('dropdownlist', [xx,yy,xx+menuW,yy+22],
                         [ZStrings.PixelsPerInch, ZStrings.PixelsPerCM],
                         { name: 'resUnits' });
  pnl.resUnits.helpTip = ZStrings.ResolutionTip;

  psxui.setMenuSelection(pnl.resUnits, CSIIDefaults.resUnits, undefined, true);

  pnl.resUnits.onChange = function() { 
    var pnl = this.parent;
    var resType = ((pnl.resUnits.selection.text == ZStrings.PixelsPerInch) ?
                   ZStrs.UnitsIN : ZStrs.UnitsCM);

    var res = psx.delocalizeNumber(pnl.resolution.text);

    if (resType == ZStrs.UnitsCM) {
      pnl.resolution.text = psx.localizeNumber(_approximate(res/2.54));
    } else {
      pnl.resolution.text =
        psx.localizeNumber(_approximate(pnl.resolution._inches));
    }

    pnl.resolution.onChange(true);
  }

  var type = delocalizeUnitType(pnl.resUnits.selection.text);

  pnl.resolution._value = psx.delocalizeNumber(pnl.resolution.text);
  pnl.resolution._inches = _resAsInches(pnl.resolution.text, type);

  pnl.resolution.onChange(true);

  //
  // Color Mode
  //
  yy += lineH;
  xx = xOfs;

  pnl.modeLabel = pnl.add('statictext',
                          [xx,yy+tOfs,xx+gutter,yy+22+tOfs],
                          ZStrings.ModeLabel);
  pnl.modeLabel.helpTip = ZStrings.ModeTip;
  xx += gutter;

  pnl.mode = pnl.add('dropdownlist', [xx,yy,xx+menuW,yy+22],
                     [ZStrings.GrayscaleMode,
                      ZStrings.RGBMode,
                      ZStrings.CMYKMode,
                      ZStrings.LabMode]);
  pnl.mode.helpTip = ZStrings.ModeTip;

  psxui.setMenuSelection(pnl.mode, CSIIDefaults.mode);

  pnl.mode.onChange = function() {
    var pnl = this.parent;
    var mode = pnl.mode.selection.text;
    pnl.setColorProfileMenu(mode);
  }

  pnl.RGB_PROFILES = [ZStrs.ProfileAdobeRGB,
                      ZStrs.ProfileAppleRGB,
                      ZStrs.ProfileProPhotoRGB,
                      ZStrs.ProfileSRGB,
                      ZStrs.ProfileColorMatchRGB,
                      ZStrs.ProfileWideGamutRGB,
                      ZStrs.ProfileWorkingRGB];

  pnl.setColorProfileMenu = function(mode) {
    var pnl = this;

    pnl.colorProfile.removeAll();
    var profiles = [];
    switch (mode) {
    case ZStrings.GrayscaleMode: profiles = [ZStrs.ProfileWorkingGray]; break;
    case ZStrings.RGBMode: profiles = pnl.RGB_PROFILES; break;
    case ZStrings.CMYKMode:  profiles = [ZStrs.ProfileWorkingCMYK]; break;
    case ZStrings.LabMode:  profiles = [ZStrs.ProfileLab]; break;
    }

    for (var i = 0; i < profiles.length; i++) {
      var p = profiles[i];
      pnl.colorProfile.add('item', p);
    }

    var lastProfile = pnl._lastProfile[mode];
    if (lastProfile) {
      pnl.colorProfile.selection = pnl.colorProfile.find(lastProfile);

    } else {
      pnl.colorProfile.selection = pnl.colorProfile.items[0];
      pnl._lastProfile[mode] = pnl.colorProfile.selection.text;
    }
  }


  yy += lineH;
  xx = xOfs;

  //
  // Bit Depth
  //
  pnl.bitDepthLabel = pnl.add('statictext',
                              [xx,yy+tOfs,xx+gutter,yy+22+tOfs],
                              ZStrings.BitDepthLabel);
  pnl.bitDepthLabel.helpTip = ZStrings.BitDepthTip;
  xx += gutter;
  pnl.bitDepth = pnl.add('dropdownlist', [xx,yy,xx+menuW,yy+22],
                         [ZStrings.BitDepth8,
                          ZStrings.BitDepth16],
                         { name: 'bitDepth' });
  pnl.bitDepth.helpTip = ZStrings.BitDepthTip;
  psxui.setMenuSelection(pnl.bitDepth, CSIIDefaults.bitDepth);

  xx = xOfs;
  yy += lineH;

  //
  // Color Profile
  //
  pnl.colorProfileLabel = pnl.add('statictext',
                                  [xx,yy+tOfs,xx+gutter,yy+22+tOfs],
                                  ZStrings.ColorProfileLabel); 
  pnl.colorProfileLabel.helpTip = ZStrings.ColorProfileTip;
  xx += gutter;

  pnl.colorProfile = pnl.add('dropdownlist', [xx,yy,xx+menuW+30,yy+22],
                             pnl.RGB_PROFILES,
                             { name: 'colorProfile' });
  pnl.colorProfile.helpTip = ZStrings.ColorProfileTip;
  
  // this keeps track of the last profile selected for a given mode
  pnl._lastProfile = [];           
  psxui.setMenuSelection(pnl.colorProfile, CSIIDefaults.colorProfile);

  pnl.colorProfile.onChange = function() {
    var pnl = this.parent;
    var mode = pnl.mode.selection.text;
    pnl._lastProfile[mode] = pnl.colorProfile.selection.text;
  }

  pnl.mode.onChange();

  xx = xOfs;
  yy += lineH;

  //
  // Flatten All Layers
  //
  pnl.flattenAllLayers = pnl.add('checkbox', [xx,yy,pnl.bounds.width,yy+22],
                                 ZStrings.FlattenAllLayers,
                                 { name: 'flattenAllLayers'});
  pnl.flattenAllLayers.helpTip = ZStrings.FlattenAllLayersTip;
  pnl.flattenAllLayers.value = CSIIDefaults.flattenLayers;

  return pnl;
};

//
// Function: addNumericFilter
// Description: Adds a numeric keystroke filter to a widget
// Input:  obj - UI widget
// Return: <none>
//
ContactSheetUI.addNumericFilter = function(obj) {
  obj.keyFilter = /\d/;
  obj.addEventListener('keydown', ContactSheetUI.filterKey);
};

//
// Function: addNumberFilter
// Description: Adds a number/localized-decimal-point keystroke filter
// Input:  obj - UI widget
// Return: <none>
//
ContactSheetUI.addNumberFilter = function(obj) {
  obj.keyFilter = RegExp("[\\-" + psxui.dpREStr + "\\d]");
  obj.addEventListener('keydown', ContactSheetUI.filterKey);
};
//
// Function: addPositiveNumberFilter
// Description: Adds a positive number/localized-decimal-point keystroke filter
// Input:  obj - UI widget
// Return: <none>
//
ContactSheetUI.addPositiveNumberFilter = function(obj) {
  obj.keyFilter = RegExp("[" + psxui.dpREStr + "\\d]");
  obj.addEventListener('keydown', ContactSheetUI.filterKey);
};
//
// Function: addUnitValue
// Description: Adds a localied UnitValue keystroke filter
// Input:  obj - UI widget
// Return: <none>
//
ContactSheetUI.addUnitValueFilter = function(obj) {
  // Need to allow anything because \w doesn't work with non-latin alphabets
  return;
  obj.keyFilter = RegExp("[\w% " + psxui.dpREStr + "\\d]");
  obj.addEventListener('keydown', ContactSheetUI.filterKey);
};

//
// Function: filterKey
// Description: Keystroke event filter
// Input:  event - UI event
// Return: <none>
//
ContactSheetUI.filterKey = function(event) {
  var obj = event.currentTarget;
  var filter = obj.keyFilter;

  var c = Number("0x" + event.keyIdentifier.substring(2));
  var key = String.fromCharCode(c);

  // $.writeln(event.keyName + ' : ' + key + ' : ' + filter);

  if (filter && key.match(filter)) {
    return;

  } else if (event.keyName == 'Enter') {
    ContactSheetUI.handleEnterKey(event);

  } else if (event.keyName.length == 1) {
    event.stopPropagation();
    event.preventDefault();
  }
};

//
// Function: createCSIIThumbnailPanel
// Description: Creates the Thumbnails panel
// Input:  pnl - Panel
//         opts - ContactSheetIIOptions
// Return: pnl
//
ContactSheetUI.prototype.createCSIIThumbnailPanel = function(pnl, opts) {
  var self = this;

  var gutter = 90;
  var xOfs = 10;
  var yOfs = 12;
  var xx = xOfs;
  var yy = yOfs;
  var tOfs = self.textOfs;
  var menuW = self.menuWidth;
  var textW = self.textWidth;
  var lineH = self.lineH;

  self.thumbnailPnl = pnl;

  pnl._baseUnit = UnitValue(1/72, "in");

  pnl.toPixels = function(val, type) {
    val = toNumber(val) || undefined;
    var un = new UnitValue(val, type);
    un.baseUnit = pnl._baseUnit;
    return un.as('px');
  }

  //
  // Place
  //
  pnl.placeLbl = pnl.add('statictext', [xx,yy+tOfs,xx+gutter,yy+22+tOfs],
                         ZStrings.PlaceLabel);
  pnl.placeLbl.helpTip = ZStrings.PlaceTip;
  xx += gutter;

  pnl.place = pnl.add('dropdownlist', [xx,yy,xx+menuW,yy+22],
                      [ZStrings.AcrossFirst,
                       ZStrings.DownFirst],
                      { name: 'place'});
  pnl.place.helpTip = ZStrings.PlaceTip;
  psxui.setMenuSelection(pnl.place, CSIIDefaults.place);

  yy += lineH;
  xx = xOfs;
  
  //
  // Columns
  //
  pnl.colsLbl = pnl.add('statictext', [xx,yy+tOfs,xx+gutter,yy+22+tOfs],
                        ZStrings.ColumnsLabel);
  pnl.colsLbl.helpTip = ZStrings.ColumnsTip;
  xx += gutter;
  pnl.cols = pnl.add('edittext', [xx,yy,xx+50,yy+20],
                     opts.columnCount || CSIIDefaults.cols,
                     { name: 'cols' } );
  pnl.cols.helpTip = ZStrings.ColumnsTip;
  pnl.cols._value = CSIIDefaults.cols;

  //pnl.cols.onChanging = psxui.numericKeystrokeFilter;
  // pnl.cols.addEventListener('keydown', ContactSheetUI.handleEnterKey);
  ContactSheetUI.addNumericFilter(pnl.cols);

  yy += lineH;
  xx = xOfs;
  
  //
  // Rows
  //
  pnl.rowsLbl = pnl.add('statictext', [xx,yy+tOfs,xx+gutter,yy+22+tOfs],
                        ZStrings.RowsLabel);
  pnl.rowsLbl.helpTip = ZStrings.RowsTip;
  xx += gutter;
  pnl.rows = pnl.add('edittext', [xx,yy,xx+50,yy+20],
                     opts.rowCount || CSIIDefaults.rows,
                     { name: 'rows' } );
  pnl.rows.helpTip = ZStrings.RowsTip;
  pnl.rows._value = CSIIDefaults.rows;

  // pnl.rows.onChanging = psxui.numericKeystrokeFilter;
  // pnl.rows.addEventListener('keydown', ContactSheetUI.handleEnterKey);
  ContactSheetUI.addNumericFilter(pnl.cols);

  yy += lineH;
  xx = xOfs;

  function _onChange(w, nm, min, max) {
    var pnl = w.parent;
    var n = toNumber(w.text);
    if (isNaN(n)) {
      ContactSheetUI.invalidNumberPrompt(nm);
      w.active = true;
      w.text = w._value;
      return false;
    }
   
    var ok = true;
    if (n < min || n > max) {
      ContactSheetUI.numberOutOfRange(nm, min, max);
      w.active = true;
      n = (n < min) ? min : max;
      w.text = n;
      ok = false;
    }

    w._value = n;
    return ok;
  }

  pnl.cols.onChange = function() {
    return _onChange(this, ZStrings.Columns, ContactSheetUI.MIN_COLS_ROWS,
                     ContactSheetUI.MAX_COLS_ROWS);
  }

  pnl.rows.onChange = function() {
    return _onChange(this, ZStrings.Rows, ContactSheetUI.MIN_COLS_ROWS,
                     ContactSheetUI.MAX_COLS_ROWS);
  }
  
  pnl.rows.onChange();
  pnl.cols.onChange();

  //
  // Best Fit
  //
  pnl.bestFit = pnl.add('checkbox', [xx,yy,pnl.bounds.width,yy+22],
                        ZStrings.RotateForBestFit,
                        { name: 'bestFit'});
  pnl.bestFit.helpTip = ZStrings.RotateForBestFitTip;
  pnl.bestFit.value = CSIIDefaults.bestFit;

  xOfs = gutter + menuW + 5 + xOfs + 15;
  xx = xOfs;
  yy = yOfs;
  gutter = 75;
  
  //
  // Autospacing
  //
  pnl.autoSpacing = pnl.add('checkbox', [xx,yy,pnl.bounds.width,yy+22],
                            ZStrings.UseAutoSpacing,
                            { name: 'autoSpacing'});
  pnl.autoSpacing.helpTip = ZStrings.UseAutoSpacingTip;
  pnl.autoSpacing.value = CSIIDefaults.useAutospacing;

  // See if we need to widen the panel to fit the localized string
  var d = pnl.graphics.measureString(ZStrings.UseAutoSpacing);
  var w = d[0] + 25; // add 25 for the checkbox and padding
  if (w > pnl.autoSpacing.bounds.width) {
    pnl.autoSpacing.bounds.width = w;
    pnl.bounds.width = pnl.autoSpacing.bounds.right;
  }

  yy += lineH;
  xx = xOfs;

  var units = self.currentUnits();

  textW -= 5;

  var labels = [ZStrings.VerticalLabel, ZStrings.HorizontalLabel];
  var maxW = _findMaxWidth(pnl, labels);

  gutter = Math.max(maxW+5, gutter);

  //
  // Vertical
  //
  pnl.vertLabel = pnl.add('statictext',
                           [xx,yy+tOfs,xx+gutter,yy+22+tOfs],
                           ZStrings.VerticalLabel);
  pnl.vertLabel.helpTip = ZStrings.VerticalTip;
  xx += gutter;
  pnl.vert = pnl.add('edittext', [xx,yy,xx+textW,yy+20],
                     opts.vert || CSIIDefaults.vert,
                     { name: 'vert' } );
  pnl.vert.helpTip = ZStrings.VerticalTip;

  pnl.vert._last = pnl.toPixels(pnl.vert.text, units);

  pnl.vert.onChange = function() {
    try {
      var pnl = this.parent;
      var processor = pnl.window.processor;
      var un = processor.validateLocalizedUnitString(pnl.vert.text);

      if (!un) {
        un = processor.validateLocalizedUnitString(pnl.vert.text + ' ' + type);
      }

      var type = processor.currentUnits();

      if (!un) {
        ContactSheetUI.invalidValuePrompt(ZStrings.Vertical);
        pnl.vert.active = true;
        var v = UnitValue(pnl.vert._last, "px").as(type);
        pnl.vert.text = psx.localizeUnitValue(UnitValue(_approximate(v), type));
        return false;
      }

      var n = ContactSheetUI.getNumber(un.value.toString(),
                                       un.type.toString(),
                                       ZStrings.Vertical,
                                       0,
                                       ContactSheetUI.MAX_PIXELS,
                                       un.baseUnit);
      if (typeof n != "number") {
        pnl.vert.active = true;
        var v = UnitValue(pnl.vert._last, "px").as(type);
        pnl.vert.text = psx.localizeUnitValue(UnitValue(_approximate(v), type));
        return false;
      }

      var old = new UnitValue(un.value, un.type);
      un.value = n;

      pnl.vert.text = psx.localizeUnitValue(_approximate(un));
      pnl.vert._last = Math.round(un.as("px"));

      // un = UnitValue(pnl.vert.text);

      return un.value == old.value;

    } catch (e) {
      alert(psx.exceptionMessage(e));
      return false;
    }
  }

  // pnl.vert.onChanging = ContactSheetUI.unitValueKeystrokeFilter;
  // pnl.vert.addEventListener('keydown', ContactSheetUI.handleEnterKey);
  ContactSheetUI.addUnitValueFilter(pnl.vert);

  yy += lineH;
  xx = xOfs;

  //
  // Horizontal
  //
  pnl.horzLabel = pnl.add('statictext',
                           [xx,yy+tOfs,xx+gutter,yy+22+tOfs],
                           ZStrings.HorizontalLabel);
  pnl.horzLabel.helpTip = ZStrings.HorizontalTip;
  xx += gutter;
  pnl.horz = pnl.add('edittext', [xx,yy,xx+textW,yy+20],
                     opts.horz || CSIIDefaults.horz,
                     { name: 'horz' } );
  pnl.horz.helpTip = ZStrings.HorizontalTip;

  pnl.horz._last = pnl.toPixels(pnl.horz.text, units);

  pnl.horz.onChange = function() {
    try {
      var pnl = this.parent;
      var processor = pnl.window.processor;
      var un = processor.validateLocalizedUnitString(pnl.horz.text);

      if (!un) {
        un = processor.validateLocalizedUnitString(pnl.horz.text + ' ' + type);
      }

      var type = processor.currentUnits();

      if (!un) {
        ContactSheetUI.invalidValuePrompt(ZStrings.Horizontal);
        pnl.horz.active = true;
        var v = UnitValue(pnl.horz._last, "px").as(type);
        pnl.horz.text = psx.localizeUnitValue(UnitValue(_approximate(v), type));
        return false;
      }

      var n = ContactSheetUI.getNumber(un.value.toString(),
                                       un.type.toString(),
                                       ZStrings.Horizontal,
                                       0,
                                       ContactSheetUI.MAX_PIXELS,
                                       un.baseUnit);
      if (typeof n != "number") {
        pnl.horz.active = true;
        var v = UnitValue(pnl.horz._last, "px").as(type);
        pnl.horz.text = psx.localieUnitValue(UnitValue(_approximate(v), type));
        return false;
      }

      var old = new UnitValue(un.value, un.type);
      un.value = n;

      pnl.horz.text = psx.localizeUnitValue(_approximate(un));
      pnl.horz._last = Math.round(un.as("px"));

      // un = UnitValue(pnl.horz.text);

      return un.value == old.value;

    } catch (e) {
      alert(psx.exceptionMessage(e));
      return false;
    }
  }

  // pnl.horz.onChanging = ContactSheetUI.unitValueKeystrokeFilter;
  pnl.horz.addEventListener('keydown', ContactSheetUI.handleEnterKey);
  // ContactSheetUI.addUnitValueFilter(pnl.horz);


  pnl.autoSpacing.onClick = function() {
    var pnl = this.parent;
    var st = !pnl.autoSpacing.value;

    pnl.vert.enabled = st;
    pnl.horz.enabled = st;
  }

  pnl.autoSpacing.onClick();

  return pnl;
};

ContactSheetUI.prototype.createFontPanel = psxui.createFontPanel;

//
// Function: createCSIICaptionPanel
// Description: Creates the Caption panel
// Input:  pnl - Panel
//         opts - ContactSheetIIOptions
// Return: pnl
//
ContactSheetUI.prototype.createCSIICaptionPanel = function(pnl, opts) {
  var self = this;
  
  var xx = 5;
  var yy = 10;

  self.captionPnl = pnl;

  pnl.captionEnabled = pnl.add('checkbox', [xx,yy-5,xx+20,yy+30], '',
                               { name: 'captionEnabled' });
  pnl.captionEnabled.helpTip = ZStrs.FontTip;
  pnl.captionEnabled.value = CSIIDefaults.captionEnabled;

  xx += 20;

  pnl.fontPanel = pnl.add('group', [xx,yy,pnl.bounds.width,yy+30],
                          { name: 'fontPanel' });
  self.createFontPanel(pnl.fontPanel, opts);
  
  var font = psx.determineFont(CSIIDefaults.fontFaceName);
  if (!font) {
    font = psx.determineFont(CSIIDefaults.fontName);
  }
  if (!font) {
    font = psx.getDefaultFont();
  }

  pnl.fontPanel.setFont(font, CSIIDefaults.fontSize);
  pnl.fontPanel._fontSize = CSIIDefaults.fontSize;

  pnl.fontPanel.fontSize.addEventListener('keydown',
                                          ContactSheetUI.handleEnterKey);

  pnl.fontPanel.fontSize.onChange = function() {
    var pnl = this.parent.parent;
    var fontInfo = pnl.fontPanel.getFont();
    var n = fontInfo.size;
    var min = ContactSheetUI.MIN_FONTSIZE;
    var max = ContactSheetUI.MAX_FONTSIZE;
    var nm = ZStrings.FontSize;

    if (isNaN(n)) {
      ContactSheetUI.invalidNumberPrompt(nm);
      pnl.fontPanel.fontSize.active = true;
      pnl.fontPanel.fontSize.text = pnl.fontPanel._fontSize;
      return false;
    }
   
    var ok = true;
    if (n < min || n > max) {
      ContactSheetUI.numberOutOfRange(nm, min, max);
      pnl.fontPanel.fontSize.active = true;
      n = (n < min) ? min : max;
      pnl.fontPanel.fontSize.text = n;
      ok = false;
    }

    pnl.fontPanel._fontSize = n;
    return ok;
  }

  pnl.captionEnabled.onClick = function() {
    var pnl = this.parent;
    pnl.fontPanel.enabled = pnl.captionEnabled.value;
  }

  pnl.captionEnabled.onClick();

  return pnl;
};

//
// Function: createCSIIControlPanel
// Description: Creates the Control/Button panel
// Input:  pnl - Panel
//         opts - ContactSheetIIOptions
// Return: pnl
//
ContactSheetUI.prototype.createCSIIControlPanel = function(pnl, opts) {
  var self = this;

  var w = pnl.bounds.width;
  var btnW = w - 10;
  var btnH = 25;
  var xx = 10;
  var yy = 10;


  pnl.runBtn = pnl.add('button', [xx,yy,xx+btnW,yy+btnH],
                       ZStrings.OK, {name: 'ok'});
  pnl.window.defaultElement = pnl.runBtn;

  yy += btnH + 5;


  pnl.cancelBtn = pnl.add('button', [xx,yy,xx+btnW,yy+btnH],
                          ZStrings.Cancel, {name: 'cancel'});
  pnl.window.cancelElement = pnl.cancelBtn;

  yy += 85;

  pnl.loadBtn = pnl.add('button', [xx,yy,xx+btnW,yy+btnH],
                        ZStrings.Load, {name: 'load'});
  yy += btnH + 5;
  pnl.saveBtn = pnl.add('button', [xx,yy,xx+btnW,yy+btnH],
                        ZStrings.Save, {name: 'save'});
  yy += btnH + 5;
  pnl.resetBtn = pnl.add('button', [xx,yy,xx+btnW,yy+btnH],
                         ZStrings.Reset, {name: 'reset'});

  xx += 5;
  yy += 60;
  pnl.esc = pnl.add('statictext', [xx,yy,xx+btnW-10,yy+150], ZStrings.PressESC,
                    { multiline: true });

  pnl.runBtn.onClick = function() {
    if (this.window.processor.validateCSII() == true) {
      this.window.close(1);
    }
  }

  pnl.window.runBtn = pnl.runBtn;

  // pnl.cancelBtn.onClick = function() {
  //   this.window.processor.cancel();
  // }
  pnl.resetBtn.onClick = function() {
    this.window.processor.reset();
  }
  pnl.loadBtn.onClick = function() {
    this.window.processor.load();
  }
  pnl.saveBtn.onClick = function() {
    this.window.processor.save();
  }

  return pnl;
};


//
// Function: createWindow
// Description: Creates the CSII Dialog
// Input:  ini - ContactSheetIIOptions
// Return: pnl
//
ContactSheetUI.prototype.createWindow = function(ini) {
  var self = this;
  var wrect = self.winRect;

//   $.level = 1; debugger;

  function rectToBounds(r) {
    return[r.x, r.y, r.x+r.w, r.y+r.h];
  };

  var win = new Window('dialog', self.title, rectToBounds(wrect),
                       self.windowCreationProperties);

  win.mgr = self;  // save a ref to the UI manager
  win.ini = ini;
  if (!self.ini) {
    self.ini = win.ini;
  }
  self.window = self.win = win;

  var xOfs = 10;
  var yy = 10;

  var hasButtons = false;
  var hasNotesPanel = false;

  var appBottom = wrect.h - 10;

  // Now, create the application panel
  var pnlType = 'panel';
  pnlType = (self.hasBorder ? 'panel' : 'group');

  win.appPnl = win.add(pnlType, [xOfs, yy, wrect.w-xOfs, appBottom]);
  win.appPanel = win.appPnl;

  yy = appBottom + 10;

  // and call the application callback function with the ini object
  self.createPanel(win.appPnl, ini);

  return win;
};

ContactSheetUI.prototype.useDefaultUnits = function() {
};

//
// Function: execCSII_UI
// Description: Executes the CSII UI, if necessary. If opts are passed in
//              from a recorded Action, the UI may not actually run.
//              If the UI is needed, the Dialog is created and run.
//              When complete, the settings are scraped from the UI
//              and stored.
// Input:  opts - ContactSheetIIOptions
// Return: pnl
//
ContactSheetUI.prototype.execCSII_UI = function(opts) {
  var self = this;

  LogFile.write("execUI");
  try {
    var win = undefined;
    var settings = opts._settings;

    if (!settings) {
      // this is (almost) identical to loadDefaultUserOptions
      var file = ContactSheetUI.getUserOptionsFile();
      if (file.exists) {
        settings = psx.readXMLFile(file);

        if (!ContactSheetUI.isValidLocale(settings)) {
          LogFile.write("locale mismatch:" + $.locale + " - " +
                        settings.locale.toString());
          settings = ContactSheetUI.getDefaultOptionsObj();
        } else {
          opts._settings = settings;
        }
      } else {
        settings = ContactSheetUI.getDefaultOptions();
      }
    }

    if (!toBoolean(opts.noUI)) {
      win = self.createWindow(opts);
      self.win = win;
      self.writeSettings(settings);

      // if we are using default settings,
      // we need to tweak the default units setting to use
      // the Ruler Units preference
      if (!opts._settings) {
        self.setDefaultUnits();
      }

      win.center();
      var res = win.show();
      
      if (res == 1) {
        var xml = self.readSettings();
        self.settings = xml;

        if (!opts._runFromAction) {
          self.saveDefaultUserOptions(xml);
        }
      } else {
        self.settings = undefined;
        opts = undefined;
      }

    } else {
      // No UI. Just get the settings...
      self.settings = settings;
    }
  } catch (e) {
    var msg = psx.exceptionMessage(e);
    LogFile.write(msg);

    if (confirm(ZStrings.ErrorDetailsPrompt)) {
      alert(msg);
    }
  }
  
  return opts;
};

//
// Function: process
// Description: Converts the XML settings and calls the Contact Sheet processor
// Input:  ini - ContactSheetIIOptions
// Return: pnl
//
ContactSheetUI.prototype.process = function(ini) {
  var self = this;
  var xml = self.settings;

  if (xml == undefined) {
    Error.runtimeError(9002, ZStrings.UnknownInternalError +
                       " - No settings available");
  }

  // switch log files at this point...
  LogFile.setFilename(ContactSheetIIOptions.LOG_FILE, "UTF8");
  LogFile.write(xml.toXMLString());

  // we control the log file, not CSXCore
  ContactSheetIIOptions.LOG_ENABLED = false;

  LogFile.write("process");

  var opts = new ContactSheetIIOptions(ini);

  ContactSheetUI.settingsToOpts(xml, opts);
  // var s = psx.toIniString(opts);
  // opts = psx.fromIniString(s);

  opts.files = self._fileList;

  LogFile.write(psx.listProps(opts));

  var csx = self.createContactSheetII();

  var res = csx.process(opts);

  self.descriptor = csx.descriptor;

  return opts;
};

//
// Function: settingsToOpts
// Description: Converts the XML settings to ContactSheetIIOptions
// Input:  settings - ContactSheetIIOptions
//         opts - ContactSheetIIOptions
// Return: opts
//
ContactSheetUI.settingsToOpts = function(settings, opts) {
  if (!opts) {
    opts = new ContactSheetIIOptions();
  }

  // Source
  opts.imageSource = settings.source.@imageSource.toString();
  opts.folder = settings.source.@path.toString();
  opts.recurse = toBoolean(settings.source.@includeSubfolders);

  if (opts.imageSource == ZStrings.Folder) {
    opts.spanFolders = !toBoolean(settings.source.@groupImages);
  } else {
    opts.spanFolders = true;
  }

  // Document
  opts.background = 'White';
  var str = settings.document.@resUnits.toString().toLowerCase();
  var resType = (str == ZStrings.PixelsPerInch.toLowerCase()) ? "in" : "cm";

  var res = psx.delocalizeNumber(settings.document.@resolution);
  opts.resolution = (resType == "cm") ? _approximate(res*2.54) : res;

  opts.resUnits = "in";

  var baseUnit = new UnitValue(1/opts.resolution, opts.resUnits);

  opts.docUnits = 'pixels';
  var units = delocalizeUnitType(settings.document.@units.toString());

  var un = new UnitValue(psx.delocalizeNumber(settings.document.@width), units);
  un.baseUnit = baseUnit;
  opts.docWidth = un.as('px');

  var un = new UnitValue(psx.delocalizeNumber(settings.document.@height), units);
  un.baseUnit = baseUnit;
  opts.docHeight = un.as('px');

  opts.mode = ContactSheetIIOptions.toModeStr(settings.document.@mode.toString());
  opts.bitDepth = settings.document.@bitDepth.toString();

  var str = settings.document.@colorProfile.toString();
  // XXX localization hack
  var m = str.match(/.+\[.+\] (.+)/);
  var profile = (m ? m[1] : str);
  opts.colorProfile = psx.delocalizeProfile(profile);
  opts.marginsEnabled = false;

  // Thumbnail
  opts.acrossFirst = settings.thumbnail.@place.toString() != ZStrings.DownFirst;
  opts.bestFit = toBoolean(settings.thumbnail.@bestFit);
  opts.rotate = 'CCW';
  opts.autoFill = false;
  opts.rowCount = toNumber(settings.thumbnail.@rows);
  opts.columnCount = toNumber(settings.thumbnail.@cols);

  opts.useAutoSpacing = toBoolean(settings.thumbnail.@useAutospacing);

  var baseUnit = new UnitValue(1/opts.resolution, resType);
  var un = new UnitValue(settings.thumbnail.@vert);
  un.baseUnit = baseUnit; 
  opts.vertical = un.as('px') / 2;
  
  var un = new UnitValue(settings.thumbnail.@horz);
  un.baseUnit = baseUnit; 
  opts.horizontal = un.as('px') / 2;
  
  opts.spacingUnits = 'px'
  
  opts.caption = toBoolean(settings.caption.@enabled);
  if (opts.caption) {
    if (settings.caption.font != undefined) {
      var font = settings.caption.font.@name.toString();
      opts.font = font;
      opts.fontSize = toNumber(settings.caption.font.@size);
    }
  }

  opts.keepOpen = true;
  opts.saveSheet = false;
  opts.flatten = toBoolean(settings.document.@flattenLayers);
  opts.flattenCells = false;
  opts.fileNameFormat = ZStrings.ContactSheetFilenameFormat;
  opts.prefix = opts.fileNameFormat.replace(/#/g, '');


  opts.metadataSubstitution = false;
  opts.accumulateKeywords = false;
  opts.enableTextSubstitution = false;
  opts.forceRecording = true;
  opts.fixMaskPhantomPixels = false;

  opts.csiiMode = true;

  return opts;
};

//
// Function: validateCSII
// Description: Scrape the settings from the UI and validate where appropriate
// Input:  <none>
// Return: true if OK, false if there was a problem
//
ContactSheetUI.prototype.validateCSII = function() {
  var self = this;

  LogFile.write("validateCSII");

  try {
    // read settings from the UI
    var xml = self.readSettings();

    // validate settings
    var src = xml.source;
    if (src.@imageSource == ZStrings.Folder && src.@path == "") {
      alert(ZStrings.SelectAnImageFolderWarning);
      return false;
    }

    if (self._fileList && self._fileList.length == 0) {
      alert(ZStrings.SelectImageFilesWarning);
      return false;
    }

    // check (roughly) to see if any numbers are really out of whack
    var width = self.docPnl.width._last;
    var height = self.docPnl.height._last;
    var rez = self.docPnl.resolution._value;
    var cols = toNumber(self.thumbnailPnl.cols.text);
    var rows = toNumber(self.thumbnailPnl.rows.text);

    var vert = 0;
    var horz = 0;

    if (!toBoolean(xml.thumbnail.@useAutospacing)) {
      vert = self.thumbnailPnl.vert._last;
      horz = self.thumbnailPnl.horz._last;

    } else {
      vert = (width/cols)/100 * 2;
      horz = (height/rows)/100 * 2;
    }

    var fontSize = 0;
    if (toBoolean(xml.caption.@enabled)) {
      fontSize = toNumber(xml.caption.font.@size);
    }
      
    var cellWidth = Math.floor(width/cols);
    var imageWidth = cellWidth - horz;
    var cellHeight = Math.floor(height/rows);
    var imageHeight = cellHeight - vert - fontSize;

    if (imageWidth < 0 || imageHeight < 0) {
      alert(ZStrings.InvalidThumbnailSize);
      return false;
    }

    self.settings = xml;

  } catch (e) {
    LogFile.logException(e, ZStrings.ReadSettingsError + e.message, true);
    return false;
  }

  return true;
};


//
// Function: load
// Description: Prompt the user to select an XML settings file to load.
//              If a file is selected, the UI is updated.
// Input:  <none>
// Return: <none>
//
ContactSheetUI.prototype.load = function() {
  var self = this;

  LogFile.write("ContactSheetUI.load()");

  try {
    var file = psx.selectFileOpen(ZStrings.LoadSettingsFile,
                                  ZStrings.XMLFileDlgPattern,
                                  ContactSheetUI.getUserOptionsFile());
    if (file) {
      var xml = psx.readXMLFile(file);
      self.writeSettings(xml);
    }

  } catch (e) {
    alert(psx.exceptionMessage(e));
  } 
};

//
// Function: save
// Description: Prompt the user to select an XML settings file to save.
//              If a file is selected, the current settings are saved.
// Input:  <none>
// Return: <none>
//
ContactSheetUI.prototype.save = function() {
  var self = this;

  LogFile.write("ContactSheetUI.save()");

  try {
    var file = psx.selectFileSave(ZStrings.SaveSettingsFile,
                                  ZStrings.XMLFileDlgPattern,
                                  ContactSheetUI.getUserOptionsFile());
    
    if (file) {
      var xml = self.readSettings();
      xml.date = new Date().toISOString();
      xml.version = CSII.RELEASE;
      xml.locale = $.locale;
      psx.writeXMLFile(file, xml);
    }
  
  } catch (e) {
    alert(psx.exceptionMessage(e));
  }
};

//
// Function: reset
// Description: Asks the user if they want to reset the UI.
//              If yes, the UI is reset.
// Input:  <none>
// Return: <none>
//
ContactSheetUI.prototype.reset = function() {
  var self = this;

  LogFile.write("ContactSheetUI.reset()");

  if (confirm(ZStrings.ConfirmReset)) {
    var xml = ContactSheetUI.getDefaultOptions();
    self.writeSettings(xml);
    self.setDefaultUnits();
  }
};

//
// Function: setDefaultUnits
// Description: Sets the default Unit type in the UI.
// Input:  <none>
// Return: <none>
//
ContactSheetUI.prototype.setDefaultUnits = function() {
  var self = this;
  var type = undefined;
  var resType = undefined;
  var str = psx.getDefaultRulerUnitsString();
  var metric = ($.locale != "en_US");

  if (str == "in") {
    type = ZStrings.Inches;
    resType = ZStrings.PixelsPerInch;

  } else if (str == "px") {
    type = (metric ? ZStrings.Centimeter : ZStrings.Inches);
    resType = ((!metric || type == ZStrings.Inches) ?
               ZStrings.PixelsPerInch : ZStrings.PixelsPerCM);

  } else if (metric || str == "cm" || str == "mm") {
    type = ZStrings.Centimeter;
    resType = ZStrings.PixelsPerCM;

  } else {
    type = ZStrings.Inches;
    resType = ZStrings.PixelsPerInch;
  }

  psxui.setMenuSelection(self.docPnl.units, type, undefined, true);
  psxui.setMenuSelection(self.docPnl.resUnits, resType, undefined, true);
};


//
// Function: readSettings
// Description: Reads the settings from the UI
// Input:  <none>
// Return: XML settings
//
ContactSheetUI.prototype.readSettings = function() {
  var self = this;
  var settings = ContactSheetIIOptions.DEFAULT_XML.copy();

  settings.source = self.readSourceSettings();
  settings.document = self.readDocumentSettings();
  settings.thumbnail = self.readThumbnailSettings();
  settings.caption = self.readCaptionSettings();

  return settings;
};

//
// Function: writeSettings
// Description: Writes XML settings to the UI
// Input:  XML settings
// Return: <none>
//
ContactSheetUI.prototype.writeSettings = function(settings) {
  var self = this;

  self.writeSourceSettings(settings.source);
  self.writeDocumentSettings(settings.document);
  self.writeThumbnailSettings(settings.thumbnail);
  self.writeCaptionSettings(settings.caption);
};

//
// Function: readSourceSettings
// Description: Reads the settings from the Document panel
// Input:  <none>
// Return: XML settings
//
ContactSheetUI.prototype.readSourceSettings = function() {
  var self = this;
  var pnl = self.sourcePanel;
  var settings = new XML("<source/>");

  var src = pnl.imageSource.selection.text;
  settings.@imageSource = src;

  self._fileList = undefined;
  if (src == ZStrings.Files) {
    self._fileList = self.sourcePanel.fileSet;
  }

  if (src == ZStrings.Bridge) {
    self._fileList = [];
    var files = ContactSheetUI.getImageFilesFromBridge();
    for (var i = 0; i < files.length; i++) {
      var file = files[i];
      self._fileList.push(file);
    }
  }

  var s = pnl.folder.text;
  if (s == ZStrings.NoFolderSelected) {
    s = "";

  } else {
    s = pnl.folder._folder.toUIString();
  }
  settings.@path = s;
  settings.@includeSubfolders = pnl.recurse.value;
  settings.@groupImages = pnl.group.value;

  return settings;
};

//
// Function: writeSourceSettings
// Description: Writes XML settings to the Source panel
// Input:  XML settings
// Return: <none>
//
ContactSheetUI.prototype.writeSourceSettings = function(settings) {
  var self = this;
  var pnl = self.sourcePanel;

  if (ContactSheetII.runningFromBridge) {
    psxui.setMenuSelection(pnl.imageSource, ZStrings.Bridge);

  } else {
    var imageSource = settings.@imageSource.toString();
    psxui.setMenuSelection(pnl.imageSource,
                           imageSource || CSIIDefaults.imageSource,
                           CSIIDefaults.imageSource);
  }

  var path = ZStrings.NoFolderSelected;
  if (settings.@path != undefined && settings.@path.toString() != "") {
    path = settings.@path.toString();
  }
  if (path != ZStrings.NoFolderSelected) {
    pnl.folder._folder = Folder(path);
  } else {
    pnl.folder._folder = undefined;
  }
  pnl.folder.text = ContactSheetUI.shortFileName(path);

  pnl.recurse.value = toBoolean(settings.@includeSubfolders);
  pnl.group.value = toBoolean(settings.@groupImages);

  pnl.imageSource.onChange();
  pnl.recurse.onClick();
};


//
// Function: readDocumentSettings
// Description: Reads the settings from the Document panel
// Input:  <none>
// Return: XML settings
//
ContactSheetUI.prototype.readDocumentSettings = function() {
  var self = this;
  var pnl = self.docPnl;
  var settings = new XML("<document/>");

  settings.@units = pnl.units.selection.text;
  settings.@width = psx.delocalizeNumber(pnl.width.text);
  settings.@height = psx.delocalizeNumber(pnl.height.text);
  settings.@resolution = psx.delocalizeNumber(pnl.resolution.text);
  settings.@resUnits = pnl.resUnits.selection.text;

  settings.@mode = pnl.mode.selection.text;
  settings.@bitDepth = pnl.bitDepth.selection.text;

  settings.@colorProfile = pnl.colorProfile.selection.text;
  settings.@flattenLayers = pnl.flattenAllLayers.value;

  return settings;
};

ContactSheetUI._getXMLValue = function(xml, def) {
  return (xml == undefined) ? def : xml.toString();
}

//
// Function: writeDocumentSettings
// Description: Writes XML settings to the Document panel
// Input:  XML settings
// Return: <none>
//
ContactSheetUI.prototype.writeDocumentSettings = function(settings) {
  var self = this;
  var pnl = self.docPnl;

  var str = settings.@units.toString();

  psxui.setMenuSelection(pnl.units, str || CSIIDefaults.units,
                         undefined, true);

  pnl.width.text = psx.getXMLValue(settings.@width, CSIIDefaults.width);
  pnl.height.text = psx.getXMLValue(settings.@height,CSIIDefaults.height);

  // we have set the resUnits before setting the resolution
  // to avoid a conversion problem
  var str = settings.@resUnits.toString();
  psxui.setMenuSelection(pnl.resUnits, str || CSIIDefaults.resUnits,
                         undefined, true);
                                    
  pnl.resolution.text = psx.getXMLValue(settings.@resolution,
                                        CSIIDefaults.resolution);

  psxui.setMenuSelection(pnl.mode,
                         psx.getXMLValue(settings.@mode, CSIIDefaults.mode));

  psxui.setMenuSelection(pnl.bitDepth,
                         psx.getXMLValue(settings.@bitDepth,
                                         CSIIDefaults.bitDepth));

  var str = CSIIDefaults.colorProfile;
  if (settings.@colorProfile != undefined) {
    var str = settings.@colorProfile.toString();
    // XXX localization hack
    var m = str.match(/.+\[.+\] (.+)/);
    str = (m ? m[1] : str);
  }

  psxui.setMenuSelection(pnl.colorProfile, str);

  pnl.flattenAllLayers.value = toBoolean(settings.@flattenLayers);

  pnl.resolution.onChange();
  pnl.width.onChange();
  pnl.height.onChange();
};


//
// Function: readThumbnailSettings
// Description: Reads the settings from the Thumbnails panel
// Input:  <none>
// Return: XML settings
//
ContactSheetUI.prototype.readThumbnailSettings = function() {
  var self = this;
  var pnl = self.thumbnailPnl;
  var settings = new XML("<thumbnail/>");

  settings.@place = pnl.place.selection.text;
  settings.@cols = pnl.cols.text;
  settings.@rows = pnl.rows.text;
  settings.@bestFit = pnl.bestFit.value;

  settings.@useAutospacing = pnl.autoSpacing.value;

  // XXX may need to append a unit type on these
  settings.@horz = psx.delocalizeNumber(pnl.horz.text);
  settings.@vert = psx.delocalizeNumber(pnl.vert.text);

  return settings;
};

ContactSheetUI.prototype.validateLocalizedUnitString = function(s, defValueStr) {
  var self = this;
  var units = self.currentUnits();

  if (isString(s)) {
    s = psx.delocalizeNumber(s);
    var ar = s.split(/\s+/);
    if (ar.length == 2) {
      var type = delocalizeUnitType(ar[1]);
      // this bit of code lets us parse EN as well
      if (type) {
        ar[1] = type;
      }
    }
    s = ar.join(' ');
  }
  var un = new UnitValue(s);

  if (isNaN(un.value) || un.type == '?') {
    var n = toNumber(s);
    if (isNaN(n)) {
      if (defValueStr) {
        un = UnitValue(defValueStr);
      } else {
        un = undefined;
      }
    } else {
      un = UnitValue(s + ' ' + units);
    }
    if (un && un.type == '?') {
      un = undefined;
    }
  }

  if (un) {
    un.convert(units);
  }

  return un;
};

//
// Function: writeThumbnailSettings
// Description: Writes XML settings to the Thumbnails panel
// Input:  XML settings
// Return: <none>
//
ContactSheetUI.prototype.writeThumbnailSettings = function(settings) {
  var self = this;
  var pnl = self.thumbnailPnl;

  var str = settings.@place.toString();
  psxui.setMenuSelection(pnl.place, str || CSIIDefaults.place);

  pnl.cols.text = psx.getXMLValue(settings.@cols, CSIIDefaults.cols);
  pnl.rows.text = psx.getXMLValue(settings.@rows, CSIIDefaults.rows);
  pnl.bestFit.value = toBoolean(settings.@bestFit);

  pnl.autoSpacing.value = toBoolean(settings.@useAutospacing);

  // may need to add some error handling in here...
  var un = self.validateLocalizedUnitString(settings.@vert.toString(),
                CSIIDefaults.vert + " " + ZStrs.UnitsIN);
  pnl.vert.text = _approximate(un).toString();

  pnl.vert.onChange();

  var un = self.validateLocalizedUnitString(settings.@horz.toString(),
                CSIIDefaults.horz + " " + ZStrs.UnitsIN);
  pnl.horz.text = _approximate(un).toString();
  pnl.horz.onChange();

  pnl.autoSpacing.onClick();
};

//
// Function: readCaptionSettings
// Description: Reads the settings from the Caption panel
// Input:  <none>
// Return: XML settings
//
ContactSheetUI.prototype.readCaptionSettings = function() {
  var self = this;
  var pnl = self.captionPnl;
  var settings = new XML("<caption/>");

  settings.@enabled = pnl.captionEnabled.value;

  try {
    var font = pnl.fontPanel.getFont();
    settings.font.@name = font.font;
    settings.font.@size = font.size;
  } catch (e) {
  }

  return settings;
};

//
// Function: writeCaptionSettings
// Description: Writes XML settings to the Caption panel
// Input:  XML settings
// Return: <none>
//
ContactSheetUI.prototype.writeCaptionSettings = function(settings) {
  var self = this;
  var pnl = self.captionPnl;

  pnl.captionEnabled.value = toBoolean(settings.@enabled);

  try {
    var size = toNumber(settings.font.@size) || CSIIDefaults.fontSize;

    // if we don't have a good font name in the settings,
    // try to find a reasonable default for this locale
    var name = settings.font.@name.toString();
    var font = psx.determineFont(name);

    if (!font) {
      font = psx.determineFont(CSIIDefaults.fontFaceName);
    }
    if (!font) {
      font = psx.determineFont(CSIIDefaults.fontName);
    }
    if (!font) {
      font = psx.getDefaultFont();
    }

    name = font.name;

    pnl.fontPanel.setFont(name,  size);

  } catch (e) {
  }

  pnl.captionEnabled.onClick();
};

//======================================================================

//
// Function: getUserOptionsFile
// Description: Gets the users XML settings file
// Input:  <none>
// Return: XML settings file
//
ContactSheetUI.getUserOptionsFile = function() {
  return File(ContactSheetIIOptions.SETTINGS_FOLDER + '/' +
              ContactSheetIIOptions.SETTINGS_FILE_NAME);
};

//
// Function: getDefaultOptionsObj
// Description: Gets the default XML settings
// Input:  <none>
// Return: XML settings
//
ContactSheetUI.getDefaultOptionsObj = function() {
  var xml = ContactSheetIIOptions.DEFAULT_XML.copy();
  xml.source = XML("<source/>");
  xml.source.@imageSource = CSIIDefaults.imageSource;
  xml.source.@path = CSIIDefaults.path;
  xml.source.@includeSubfolders = CSIIDefaults.includeSubfolders;
  xml.source.@groupImages = CSIIDefaults.groupImages;
  
  xml.document = XML("<document/>");
  xml.document.@units = CSIIDefaults.units;
  xml.document.@width = CSIIDefaults.width;
  xml.document.@height = CSIIDefaults.height;
  xml.document.@resolution = CSIIDefaults.resolution;
  xml.document.@resUnits = CSIIDefaults.resUnits;
  xml.document.@mode = CSIIDefaults.mode;
  xml.document.@bidDepth = CSIIDefaults.bitDepth;
  xml.document.@colorProfile = CSIIDefaults.colorProfile;
  xml.document.@flattenLayers = CSIIDefaults.flattenLayers;
  
  xml.thumbnail = XML("<thumbnail/>");
  xml.thumbnail.@place = CSIIDefaults.place;
  xml.thumbnail.@cols = CSIIDefaults.cols; 
  xml.thumbnail.@rows = CSIIDefaults.rows;
  xml.thumbnail.@bestFit = CSIIDefaults.bestFit;
  xml.thumbnail.@useAutospacing = CSIIDefaults.useAutospacing;
  xml.thumbnail.@vert = CSIIDefaults.vert;
  xml.thumbnail.@horz = CSIIDefaults.horz;
  
  xml.caption = XML("<caption/>");
  xml.caption.@enabled = CSIIDefaults.captionEnabled;
  xml.caption.font = XML("<font/>");
  xml.caption.font.@fontName = CSIIDefaults.fontName;
  xml.caption.font.@fontSize = CSIIDefaults.fontSize;

  return xml;
};

//
// Function: isValidLocale
// Description: Determines if the locale of the XML settings match
//              the current locale
// Input:  XML settings
// Return: true if the locale matches, false if not
//
ContactSheetUI.isValidLocale = function(xml) {
  if (xml.locale != undefined) {
    var l = xml.locale.toString();
    return $.locale.startsWith(l.substring(0, 2))
  }

  return true;
};

//
// Function: getDefaultOptions
// Description: Loads the XML settings from the user's default settings file.
//              If no file is present, hardwired defaults are used.
// Input:  <none>
// Return: XML settings
//
ContactSheetUI.getDefaultOptions = function() {
  var xml = undefined;
  var f = ContactSheetUI.getDefaultOptionsFile();

  if (f.exists) {
    xml = psx.readXMLFile(f);

    if (!ContactSheetUI.isValidLocale(xml)) {
      LogFile.write("locale mismatch:" + $.locale + " - " + xml.locale.toString());
      xml = ContactSheetUI.getDefaultOptionsObj();
    }

  } else {
    xml = ContactSheetUI.getDefaultOptionsObj();
  }

  return xml;
};

//
// Function: getDefaultOptionsFile
// Description: Attempts to find settings file in the Scripts folder
//              or where CSII is located. This would function as
//              site specific defaults.
// Input:  <none>
// Return: XML settings file
//
ContactSheetUI.getDefaultOptionsFile = function() {
  var f = File($.fileName);

  if (f.exists) {
    f = File(f.parent + '/' + ContactSheetIIOptions.SETTINGS_FILE_NAME);
  } 

  if (!f.exists) {
    var strScripts = ZStrs.InstalledScripts;
    var strProcessXML = ContactSheetIIOptions.SETTINGS_FILE_NAME;
    f = new File(app.path + '/' + strScripts + "/" + strProcessXML);
  }

  return f;
};


//
// Function: readDefaultSettings
// Description: Attempts to read a site-specific default XML settings file
// Input:  <none>
// Return: XML settings or undefined
//
ContactSheetUI.readDefaultSettings = function() {
  var file = ContactSheetUI.getDefaultOptionsFile();
  return (file.exists) ? psx.readXMLFile(file) : undefined;
};

//
// Function: loadDefaultUserOptions
// Description: Attempts to read a user's default XML settings file
// Input:  <none>
// Return: XML settings or undefined
//
ContactSheetUI.prototype.loadDefaultUserOptions = function() {
  var self = this;
  var file = ContactSheetUI.getUserOptionsFile();
  var settings = undefined;

  if (file.exists) {
    settings = psx.readXMLFile(file);

    if (!ContactSheetUI.isValidLocale(settings)) {
      LogFile.write("locale mismatch:" + $.locale + " - " +
                    settings.locale.toString());
      settings = ContactSheetUI.getDefaultOptionsObj();
    }
  } else {
    settings = ContactSheetUI.getDefaultOptions();
  }
  return settings;
};

//
// Function: saveDefaultUserOptions
// Description: Writes settings to a user's default XML settings file
// Input:  XML settings
// Return: <none>
//
ContactSheetUI.prototype.saveDefaultUserOptions = function(settings) {
  var self = this;
  var file = ContactSheetUI.getUserOptionsFile();
  var xml = settings.copy();
  xml.date = new Date().toISOString();
  xml.version = CSII.RELEASE;
  xml.locale = $.locale;
  psx.writeXMLFile(file, xml);
};


//
// Function: findWidgets
// Description: Populates an object with widget references
//              using the name as the key
// Input:  c - A widget container
//         o - A object to contain widgets
//         recurse - search into nested containers
// Return: <none>
//
ContactSheetUI.findWidgets = function(c, o, recurse) {
  if (o == undefined) {
    o = {};
  }

  if (!ContactSheetUI.isContainer(c)) {
    return o;
  }

  if (recurse == undefined) {
    recurse = true;
  }

  var children = c.children;

  if (children == undefined || children.length == 0) {
    return o;
  }

  var len = children.length;
    
  for (var i = 0; i < len; i++) {
    var p = children[i];
    if (p == undefined) {
      continue;
    }
      
    if (ContactSheetUI.isContainer(p) && recurse == true) {
      ContactSheetUI.findWidgets(p, o, recurse);
    }
      
    if (p.properties != undefined && p.properties.name != undefined) {
      o[p.properties.name] = p;
    }
  }

  return o;
};

//
// Function: isContainer
// Description: Determines if a UI widget is a container
// Input:  o - A UI widget
// Return: true if is a container, false if not
//
ContactSheetUI.isContainer = function(o) {
  return (o.type == 'dialog' || o.type == 'group' ||
          o.type == 'panel' || o.type == 'tab');
};

//
// Function: attrsToIni
// Description: Populates an object with the attributes of an XML node
// Input:  XML settings
// Return: an object
//
ContactSheetUI.attrsToIni = function(xml) {
  var ini = {};
  var attrs = xml.attributes();
  var len = attrs.length();
  for (var i = 0; i < len; i++) {
    var attr = attrs[i];
    ini[attr.localName()] = attr.toString();
  }
  return ini;
};


//
// Function: shortFileName
// Description: Returns a shortend version of a file name for the UI
// Input:  fname - File or String
// Return: a String
//
ContactSheetUI.shortFileName = function(fname) {
  if (fname instanceof File) {
    fname = fname.toUIString();
  }
  var max = ContactSheetIIOptions.SHORT_FILENAME_LENGTH;
  if (fname.length > max) {
    fname = "..." + fname.substr(fname.length - max + 3, max - 3 );
  }
  return fname;
};


//
// Function: getFilesFromBridge
// Description: Gets the currently selected files in Bridge
// Input:  <none>
// Return: Array of Files
//
ContactSheetUI.getFilesFromBridge = function() {
	var fileList;
	if ( BridgeTalk.isRunning( "bridge" ) ) {
    var bt = new BridgeTalk();
    bt.target = "bridge";
    bt.body =
      "var lst = photoshop.getBridgeFileListForAutomateCommand(true, false);" +
      "lst.toSource();";
    bt.onResult = function( inBT ) { fileList = eval( inBT.body ); }
    bt.onError = function( inBT ) { fileList = new Array(); }
    bt.send();
    bt.pump();
    $.sleep( 100 );
    var timeOutAt = ( new Date() ).getTime() + 5000;
    var currentTime = ( new Date() ).getTime();
    while ( ( currentTime < timeOutAt ) && ( undefined == fileList ) ) {
      bt.pump();
      $.sleep( 100 );
      currentTime = ( new Date() ).getTime();
    }
	}

	if ( undefined == fileList ) {
    fileList = new Array();
	}

	return fileList; 
};

//
// Function: getImageFilesFromBridge
// Description: Gets the currently selected image files in Bridge
// Input:  <none>
// Return: Array of Files
//
ContactSheetUI.getImageFilesFromBridge = function() {
	var list = ContactSheetUI.getFilesFromBridge();
  var fileList = [];

  for (var i = 0; i < list.length; i++) {
    var file = list[i];
    if (psx.isValidImageFile(file)) {
      fileList.push(file);
    }
  }

  return fileList;
};


//
// Function: photoshopFileOpenDialog
// Description: Prompts the user for one or more files
// Input:  <none>
// Return: Array of filenames
//
function photoshopFileOpenDialog() {
  var result = [];
  var nlist = app.openDialog();
  var isWin = $.os.match(/^Windows.*/);

  for (var i = 0; i < nlist.length; i++) {
    var s = decodeURI(nlist[i].toString());
    s = s.replace(/^file:\/\//, "");
    if (isWin) {  // Pull off ":" from drive letter
      s = s.replace(/^\/(.):\//, "/$1/");
    }
    result.push(s);
  }
  
  return result;
};

//
// Function: delocalizeUnitType
// Description: Convert a localized unit type string to something that
//              can be used to construct a UnitValue object.
// Input: A localized unit type strings
// Return: The EN form of the string
//
function delocalizeUnitType(localTxt) {
  var txt = psx.delocalizeUnitType(localTxt);

  // if we found it, return it
  if (txt) {
    return txt;
  }

  // It might be one of the CSII UI strings
  // which we handle here
  switch (localTxt) {
    case ZStrings.Centimeter:    txt = "cm"; break;
    case ZStrings.Inches:        txt = "in"; break;
    case ZStrings.Pixels:        txt = "px"; break;
    case ZStrings.PixelsPerInch: txt = "pixels/in"; break;
    case ZStrings.PixelsPerCM:   txt = "pixels/cm"; break; 
  }

  return txt;

  // may need to be this
  // return txt || localTxt;
};

"CSIIExt.jsx";
// EOF

//

// This is where we start
ContactSheetII.main = function() {
  CSII.REVISION = "$Revision: 1.7 $";

  if (!ContactSheetII.isCompatible()) {
    alert(ZStrings.VersionWarning.sprintf(CSII.REQUIRED_PS_VERSION));
    return;
  }

  // set the log file for the UI portion of the script

  // LogFile.setFilename(ContactSheetIIOptions.UI_LOG_FILE, "UTF8");
  LogFile.setFilename(undefined);
  LogFile.write("Version: " + CSII.VERSION);
  LogFile.write("Revision: $Revision: 1.7 $");
  LogFile.write("App: " + app.name);
  LogFile.write("App Version: " + app.version);
  LogFile.write("OS: " + $.os);

  LogFile.write("CSII Starting up.");
	ContactSheetII.dialogMode = app.displayDialogs;
	app.displayDialogs = DialogModes.NO;

  try {
    ContactSheetII._main();

  } catch (e) {
    LogFile.logException(e, "", true);

  } finally {
    app.displayDialogs = ContactSheetII.dialogMode;
    LogFile.write("ContactSheetII Shutting down.");
  }
};


//
// Function: _main
// Usage: Determines the context in which CSII is being invoked
//        This context may be a) from File > Automate, from Bridge,
//        or from a recorded Action.
// Input:  <none>
// Return: <none>
//
ContactSheetII._main = function() {

  // This start up logic may not cover everything, but it's good enough
  // for now...
  //
  // For displayDialogs
  // ALL - direct exec (menu/browse) or from action with dialogs
  // ERROR - from action no dialogs
  // NO - from debugger
  //
  var mode = app.playbackDisplayDialogs;

  // if we are launched from the debugger OR we have no parameters
  // we need a UI
  if (mode == DialogModes.NO || app.playbackParameters.count == 0) {
    mode = DialogModes.ALL;
  }

  // only turn off the ui if we have parameters and are called from an action
  var opts = {
    noUI: (app.playbackDisplayDialogs == DialogModes.ERROR)
  };

  // This code handles the CSII being called via the
  // Automation Framework in CS3+
  var lvl = $.level;
  $.level = 0;

  // Get things setup for a possible call from Bridge
  try {
    ContactSheetII.runningFromBridge = false;
    ContactSheetII.filesFromBridge = undefined;

    // see if we are called by the automation framework
    if (app.playbackParameters.hasKey(CSII.kFilesList)) {
      ContactSheetII.runningFromBridge = true;
      ContactSheetII.filesFromBridge = [];
      opts.noUI = false;

      var flist = app.playbackParameters.getList(CSII.kFilesList);
      for (var i = 0; i < flist.count; i++) {
        ContactSheetII.filesFromBridge.push(flist.getPath(i));
      }

      // since we are only interested in the filesList
      // we can clear the playbackParameters and read in
      // settings from the user's or default XML file
      app.playbackParameters = new ActionDescriptor();
      app.displayDialogs = DialogModes.ERROR;
    }

    ContactSheetII.bridgeIsRunning = BridgeTalk.isRunning("bridge");
    
  } catch (e) {
  }
  $.level = lvl;

  var desc;
  if (app.playbackParameters.count > 0) {
    // now set up our options based on the parameters
    // for use with Adobe Automation framework. This will
    // typically be when called from an Action

    // Start off with the default hardwired settings
    opts = new ContactSheetIIOptions(opts);

    // Get the recorded settings, if available
    var desc = app.playbackParameters;
    var xml = ContactSheetII.fromDescriptor(desc);

    // If no settings were available, use the default settings
    if (xml == undefined) {
      xml = ContactSheetUI.readDefaultSettings();
      opts.noUI = false;
    }

    opts._settings = xml;
    opts._runFromAction = true;

    // If CSII was recorded using Files as the source, force
    // make sure the UI is used.
    if (xml.source.@imageSource.toString() == ZStrings.Files) {
      opts.noUI = false;
    }

//     var dstr = app.playbackParameters.toStream();
//     psx.writeToFile("/c/work/csx/in-desc.bin", dstr, 'BINARY');

  } else {
    opts.noUI = false;
    opts._runFromAction = false;
  }

  // Uncomment the next line to force CSII to run without a UI 
  // opts.noUI = true;

  if (!opts.noUI) {
    app.bringToFront();
  }

  var ui = new ContactSheetUI(opts);

  // Overrides for CSII
  ui.iniFile = undefined;
  ui.windowCreationProperties.resizeable = false;  

  // Run the UI here...
  try {
    var uiOpts = ui.execCSII_UI(opts);

  } catch (e) {
    LogFile.logException(e, ZStrings.ContactSheetIIUIError, true);
    return;
  }

  // No uiOpts means the user canceled the script
  if (!uiOpts) {
    return;
  }

  // Do the processing here...
  try {
    var xopts = ui.process(uiOpts);

  } catch (e) {
    LogFile.logException(e, ZStrings.ContactSheetIIProcessingError, true);
    return;
  }

  // If the script completes successfully, save the settings
  // as a descriptor that can be recorded
  if (xopts) {
    try {
      // see if 'forceRecording' is set to 'true'
      if (toBoolean(xopts.forceRecording) && ui.descriptor) {
        var xdesc = ui.descriptor;
        var dstr = xdesc.toStream();

//     psx.writeToFile("/c/work/csx/out-desc.bin", dstr, 'BINARY');

        var desc;

        desc = new ActionDescriptor();
        desc.fromStream(dstr);
        desc.putString(CSII.kMessage, ZStrings.SettingsForCSII);

        app.playbackParameters = desc;
      }

    } catch (e) {
      LogFile.logException(e, ZStrings.ContactSheetIISettingsError, true);
    }
  }
};

// Let's get this party started...
ContactSheetII.main();

"ContactSheetII.jsx";
// EOF

