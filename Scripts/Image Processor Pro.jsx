#target photoshop
//
// ImageProcessorNG.jsx
//
//
// $Id: ImageProcessorNG.jsx,v 1.88 2012/03/15 21:24:40 anonymous Exp $
// Copyright: (c)2012, xbytor, Adobe Systems, Inc.
// 2011-03-21
// Written by xbytor@gmail.com
//
// c2007 Adobe Systems, Inc. All rights reserved.
// Produced and Directed by Dr. Brown ( a.k.a Russell Preston Brown )
// Written by Tom Ruark and Mike Shaw
// UI Design by Dr. Brown
//
/*
// BEGIN__HARVEST_EXCEPTION_ZSTRING

<javascriptresource>
  <about>$$$/JavaScripts/ImageProcessor/About=Image Processor Pro^r^rCopyright 2012 Adobe Systems Incorporated. All rights reserved.^r^rProcesses multiple input and output files.^rNOTE:It's better than the Image Processor!</about>
  <category>DrBrown</category>
  <name>$$$/JavaScripts/ImageProcessor/Name/ImageProcessorPro=Image Processor Pro...</name>
  <menu>automate</menu>
  <eventid>611736f0-9c46-11e0-aa82-0800200c9a66</eventid>
  <terminology><![CDATA[<< /Version 1
    /Events <<
       /611736f0-9c46-11e0-aa82-0800200c9a66 [($$$/JavaScripts/ImageProcessor/Name/ImageProcessorPro=Image Processor Pro...) /imageProcessorProSettings <<
           /ImageProcessorProSettings [(ImageProcessorPro Settings) /typeText]
           /Msge [(Message) /typeText]
         >>]
     >>
   >>
]]></terminology>

</javascriptresource>

// END__HARVEST_EXCEPTION_ZSTRING
*/
app;
//
//@show include
//
//
//
// psx.jsx
//   This file contains a collection code extracted from other parts
//   of xtools for use in production scripts written for Adobe.
//
// $Id: psx.jsx,v 1.63 2012/03/15 21:34:28 anonymous Exp $
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

// tpr not used
ZStrs.ProfileWorkingCMYK = 
  localize("$$$/Actions/Key/ColorSettings/WorkingCMYK=Working CMYK");

// tpr not used
ZStrs.ProfileWorkingGray = 
  localize("$$$/Actions/Key/ColorSettings/WorkingGray=Working Gray");

// tpr not used
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
// tpr, why can't we use the DOM for this call?
psx.convertProfile = function(doc, profile, flatten) {
  profile = profile.replace(/\.icc$/i, '');

  profile = psx.delocalizeProfile(profile);

  function _ftn() {
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putEnumerated( cTID('Dcmn'), cTID('Ordn'), cTID('Trgt') );
    desc.putReference( cTID('null'), ref);

    if (profile == 'Working RGB' || profile == 'Working CMYK') {
      var idTargetMode = cTID('TMd ');
      var idTargetModeValue = profile == 'Working RGB' ? cTID('RGBM') : cTID('CMYM');
      desc.putClass( idTargetMode, idTargetModeValue );
    } else {
        desc.putString( cTID('T   '), profile );
    }
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
  // tpr needs zstring
  var w = pnl.add('statictext', [x,y+tOfs,x+60,y+22+tOfs], 'File Type:');
  x += w.bounds.width + (isWindows() ? 5 : 15);
  pnl.fileType = pnl.add('dropdownlist', [x,y,x+150,y+22], menuElements);

  var ftype = opts.fileType || opts.fileSaveType || "jpg";

  var ft = psx.getByProperty(FileSaveOptionsTypes,
                             "fileType",
                             ftype);
  pnl.fileType.selection = pnl.fileType.find(ft.menu);

  x += pnl.fileType.bounds.width + 10;
  // tpr needs zstring
  pnl.saveForWeb = pnl.add('checkbox', [x,y,x+135,y+22], 'Save for Web');
  pnl.saveForWeb.visible = false;
  pnl.saveForWeb.value = false;
    // tpr needs zstring
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
    // tpr needs zstring
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
    // tpr needs zstring
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
    x += isWindows() ? 65 : 75;
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

//app.bringToFront();
$.localize = true;

//
// ZStrings will be where we keep strings that need to be localized.
// This will be fully implemented at a later date.
//
try {
  ZStrings;
} catch (e) {
  ZStrings = {};
}

ZStrings.ImageProcessorProTitle = 
  localize("$$$/JavaScripts/ImageProcessor/ImageProcessorProTitle=Image Processor Pro");


// Source Panel (1)

ZStrings.SelectSourceImages =
  localize("$$$/JavaScripts/ImageProcessor/SelectImages=Select the images to process");

ZStrings.SelectSourceImagesTip =
  localize("$$$/JavaScripts/ImageProcessor/SelectImagesTip=Select the images to process");

ZStrings.UseOpenImages =
  localize("$$$/JavaScripts/ImageProcessor/UseOpenImages=Use Open &Images");

ZStrings.UseOpenImagesTip =
  localize("$$$/JavaScripts/ImageProcessor/UseOpenImagesTip=Use the images that are currently open");

// deprecated
ZStrings.SelectFolder =
  localize("$$$/JavaScripts/ImageProcessor/SelectFolder=Select Folder...");

ZStrings.Choose =
  localize("$$$/JavaScripts/ImageProcessor/Choose=Choose...");

ZStrings.IncludeSubFolders =
  localize("$$$/JavaScripts/ImageProcessor/IncludSubFolders=Include All Subfolders");

ZStrings.IncludeSubFoldersTip =
  localize("$$$/JavaScripts/ImageProcessor/IncludeSubFoldersTip=Process all the folders within the source folder");

ZStrings.ProcessFilesFromBridgeFmt =
  localize("$$$/JavaScripts/ImageProcessor/ProcessFilesFromBridgeFmt=Process Files From Bridge Only (%d)");

ZStrings.SelectedFilesFromBridge =
  localize("$$$/JavaScripts/ImageProcessor/SelectedFilesFromBridge=Selected files from Bridge will be processed");


// Destination Panel (2)

ZStrings.SelectSaveLocation =
  localize("$$$/JavaScripts/ImageProcessor/SelectSaveLocation=Select location to save processed images");

ZStrings.SelectSaveLocationTip
  localize("$$$/JavaScripts/ImageProcessor/SelectSaveLocationTip=Select location to save processed images");

ZStrings.SaveInSameLocation =
  localize("$$$/JavaScripts/ImageProcessor/SaveInSameLocation=S&ave in Same Location");

ZStrings.SaveInSameLocationTip =
  localize("$$$/JavaScripts/ImageProcessor/SaveInSameLocationTip=Save the new documents next to the original documents");

ZStrings.SaveInSubFolder =
  localize("$$$/JavaScripts/ImageProcessor/SaveInSubFolder=Save in Subfolder");

ZStrings.SaveInSubFolderTip =
  localize("$$$/JavaScripts/ImageProcessor/SaveInSubFolderTip=Save the new documents in subfolder");

ZStrings.KeepFolderStructure =
  localize("$$$/JavaScripts/ImageProcessor/KeepFolderStructure=Keep Folder Structure");

ZStrings.KeepFolderStructureTip =
  localize("$$$/JavaScripts/ImageProcessor/KeepFolderStructureTip=Keep Folder Structure");



// Buttons

ZStrings.RunBtn =
  localize("$$$/JavaScripts/ImageProcessor/RunBtn=Run");

ZStrings.CancelBtn =
  localize("$$$/JavaScripts/ImageProcessor/CancelBtn=Cancel");

ZStrings.LoadBtn =
  localize("$$$/JavaScripts/ImageProcessor/LoadBtn=&Load...");

ZStrings.LoadBtnTip =
  localize("$$$/JavaScripts/ImageProcessor/LoadBtnTip=Load a settings file from disk");

ZStrings.SaveBtn =
  localize("$$$/JavaScripts/ImageProcessor/SaveBtn=&Save...");

ZStrings.SaveBtnTip =
  localize("$$$/JavaScripts/ImageProcessor/SaveBtnTip=Save the current dialog settings to disk");

ZStrings.ResetBtn =
  localize("$$$/JavaScripts/ImageProcessor/ResetBtn=Reset...");

ZStrings.ResetBtnTip =
  localize("$$$/JavaScripts/ImageProcessor/ResetBtnTip=Use default settings");


// alerts

ZStrings.SpecifySource =
  localize("$$$/JavaScripts/ImageProcessor/SpecifySource=Please specify a source folder.");

ZStrings.SpecifyDest =
  localize("$$$/JavaScripts/ImageProcessor/SpecifyDest=Please specify a destination folder.");


ZStrings.NoImagesSelected =
  localize("$$$/JavaScripts/ImageProcessor/NoImagesSelected=No images have been selected");

ZStrings.NoFilesProcessed =
  localize("$$$/JavaScripts/ImageProcessor/NoFilesProcessed=No files were processed. Possible empty folder?");

ZStrings.NoSaveSelected =
  localize("$$$/JavaScripts/ImageProcessor/NoSaveSelected=Please select one of the SAVE check boxes to process the targeted images in a set. None of the SAVE check boxes is selected at this time.");

ZStrings.CouldNotProcess =
  localize("$$$/JavaScripts/ImageProcessor/CouldNotProcessSkipped=Sorry, the following files could not be processed and were skipped:^r");

ZStrings.NoFolderSelected =
  localize("$$$/JavaScripts/ImageProcessor/NoFolderSelected=No folder has been selected");

ZStrings.FollowingNotSaved =
  localize("$$$/JavaScripts/ImageProcessor/FollowingNotSaved=The following files will not be saved.");

ZStrings.MustSaveOpen =
  localize("$$$/JavaScripts/ImageProcessor/MustSaveOpen=Open files must be saved before they can be used by the Image Processor.");

ZStrings.Sorry =
  localize("$$$/JavaScripts/ImageProcessor/Sorry=Sorry, something major happened and I can't continue! Would you like to see more info?");

ZStrings.MoreInfo =
  localize("$$$/JavaScripts/ImageProcessor/MoreInfo=For more information, refer to the log file.");

// Task Panel
ZStrings.AddTaskTip =
  localize("$$$/JavaScripts/ImageProcessor/AddTaskTip=Create a new set");

ZStrings.RemoveTaskTip =
  localize("$$$/JavaScripts/ImageProcessor/RemoveTaskTip=Remove a set");

ZStrings.Save =
  localize("$$$/JavaScripts/ImageProcessor/Save2=Save");

ZStrings.FileTypes =
  localize("$$$/JavaScripts/ImageProcessor/FileTypes=File Types");

ZStrings.SubFolderNameLbl =
  localize("$$$/JavaScripts/ImageProcessor/SubFolderNameLbl=Subfolder Name: ");

ZStrings.OutputProfileLbl =
  localize("$$$/JavaScripts/ImageProcessor/OutputProfileLbl=Output Profile: ");

ZStrings.BitDepthLbl =
  localize("$$$/JavaScripts/ImageProcessor/BitDepthLbl=Bit Depth: ");

ZStrings.RunAction =
  localize("$$$/JavaScripts/ImageProcessor/RunAction=Run Action:");

ZStrings.ActionLbl =
  localize("$$$/JavaScripts/ImageProcessor/ActionLbl=Action: ");

ZStrings.ResizeToFit =
  localize("$$$/JavaScripts/ImageProcessor/ResizeToFit=Resize to Fit");

ZStrings.WidthLbl =
  localize("$$$/JavaScripts/ImageProcessor/WidthLbl=Width:");

ZStrings.HeightLbl =
  localize("$$$/JavaScripts/ImageProcessor/HeightLbl=Height:");

ZStrings.ResolutionLbl =
  localize("$$$/JavaScripts/ImageProcessor/ResolutionLbl=Resolution:");

ZStrings.ScaleStyles =
  localize("$$$/JavaScripts/ImageProcessor/ScaleStyles=Scale Styles");

ZStrings.WidthValueErr =
  localize("$$$/JavaScripts/ImageProcessor/WidthValueErr=Bad value for resize width");

ZStrings.HeightValueErr =
  localize("$$$/JavaScripts/ImageProcessor/HeightValueErr=Bad value for resize height");

ZStrings.WidthAndOrHeightErr =
  localize("$$$/JavaScripts/ImageProcessor/WidthAndOrHeight=Width and/or Height must be specified");

ZStrings.WidthAndHeightErr =
  localize("$$$/JavaScripts/ImageProcessor/WidthAndHeightErr=Width and Height must be specified");

ZStrings.WidthOrHeightErr =
  localize("$$$/JavaScripts/ImageProcessor/WidthOrHeightErr=Width or Height must be specified");

// Preferences Panel

ZStrings.Preferences =
  localize("$$$/JavaScripts/ImageProcessor/Preferences=Preferences");

ZStrings.PreferencesTip =
  localize("$$$/JavaScripts/ImageProcessor/PreferencesTip=Preferences");

ZStrings.CopyrightInfoLbl =
  localize("$$$/JavaScripts/ImageProcessor/CopyrightInfoLbl=Copyright Info: ");

ZStrings.CopyrightInfoTip =
  localize("$$$/JavaScripts/ImageProcessor/CopyrightInfoTip=Add copyright metadata to your images");


ZStrings.ResolutionErr =
  localize("$$$/JavaScripts/ImageProcessor/ResolutionErr=Bad value for resolution");

ZStrings.PickXMLFileLoad =
  localize("$$$/JavaScripts/ImageProcessor/PickXMLFileLoad=Pick an XML file to load");

ZStrings.PickXMLFileSave =
  localize("$$$/JavaScripts/ImageProcessor/PickXMLFileSave=Pick an XML file to save");

ZStrings.XMLFileDlgPattern =
  localize("$$$/JavaScripts/ImageProcessor/XMLFileDlgPattern=XML File: *.xml");

ZStrings.SettingsFileErr =
  localize("$$$/JavaScripts/ImageProcessor/SettingsFileErr=Error reading Image Processor settings");

ZStrings.NoSourceFolder =
  localize("$$$/JavaScripts/ImageProcessor/NoSourceFolder=Source folder does not exist");

ZStrings.SaveForWebNotice = 
  localize("$$$/JavaScripts/ImageProcessor/SaveForWebNotice=Save for Web will reduce your file size by removing the preview and some metadata from your images. This option will automatically set the resolution to the default value of 72 pixels/inch.");

ZStrings.RemovePreviewAndMetadata = 
  localize("$$$/JavaScripts/ImageProcessor/RemovePreviewAndMetadata=Remove preview and metadata for reduced file size");

ZStrings.UnableToOpenErr =
  localize("$$$/JavaScripts/ImageProcessor/UnableToOpenErr=Unable to open image file.");

ZStrings.ConfirmReset =
  localize("$$$/JavaScripts/ImageProcessor/ConfirmReset=Restore default settings?");

ZStrings.DefaultSettingsMissingErr =
  localize("$$$/JavaScripts/ImageProcessor/DefaultSettingsMissingErr=The default settings file is missing");

ZStrings.AfterImageResize =
  localize("$$$/JavaScripts/ImageProcessor/AfterImageResize=After Image Resize");

ZStrings.BeforeImageResize =
  localize("$$$/JavaScripts/ImageProcessor/BeforeImageResize=Before Image Resize");


ZStrings.InvalidValueMsg =
  localize("$$$/JavaScripts/ImageProcessor/InvalidValueMsg=Invalid value for %%s.");

ZStrings.InvalidNumberMsg =
  localize("$$$/JavaScripts/ImageProcessor/InvalidNumberMsg=Invalid numeric value for %%s.");

ZStrings.NumberOutOfRangeMsg =
  localize("$$$/JavaScripts/ImageProcessor/NumberOutOfRangeMsg=%%s is out of range.^r^nnPlease specify a number between %%.03f and %%.03f. Closest value inserted.");

ZStrings.PSVersionError =
  localize("$$$/JavaScripts/ImageProcessor/PSVersionError=Image Processor Pro does not work with this version of Photoshop");

//------------------------ ImageProcessorNG --------------------------

function ImageProcessorOptions() {
};
ImageProcessorOptions.prototype.typename = "ImageProcessorOptions";

// JDI aka "Just Do It"
// Set this to true to have Image Processor make best attempt
// efforts and coercing the document into a state that will
// allow it to be saved as indicated. This is a best-effort
// attempt is not a guarantee
ImageProcessorOptions.JDI = false;

// RETAIN_EXTENSION_CASE
// This rather esoteric setting will permit the case of the extension
// to be retained when
// - the lowercase extension is used in the File Naming panel
// - the source file extension is the same as the output file extension
// - the underlying file system is truly case sensitive
//
ImageProcessorOptions.RETAIN_EXTENSION_CASE = false;

//
// LEGACY_RESIZE
// In 1-2-3 Process, if only one dimension is specified in the UI, it is
// is also used for the other dimension. Setting the option to true
// will retain that behaviour. If set to false, the image will resize
// so that the image has the width or height specified.
//
ImageProcessorOptions.LEGACY_RESIZE = false;

ImageProcessorOptions.getUserOptionsFile = function() {
  return File(Folder.userData + '/' + ImageProcessor.TITLE_UI + ".xml");
};

ImageProcessorOptions.getDefaultOptionsFile = function() {
  var f = File($.fileName);

  if (f.exists) {
    f = File(f.parent + '/' + ImageProcessor.TITLE_UI + ".xml");
  } 

  if (!f.exists) {
    var strPresets = localize ("$$$/ApplicationPresetsFolder/Presets=Presets");
    var strScripts = localize ("$$$/PSBI/Automate/ImageProcessor/Photoshop/Scripts=Scripts");
    var strProcessXML = ImageProcessor.TITLE_UI + ".xml";
    f = new File (app.path + "/" + strPresets + "/" + strScripts +
                  "/" + strProcessXML);
  }

  return f;
};

ImageProcessorOptions.DEFAULT_XML = <ImageProcessorProSettings/>;

ImageProcessorOptions.getDefaultOptions = function() {
  var xml = undefined;
  var f = ImageProcessorOptions.getDefaultOptionsFile();

  if (f.exists) {
    xml = ImageProcessor.readSettingsFile(f);

  } else {
    xml = ImageProcessorOptions.DEFAULT_XML.copy();
    xml.input = XML("<input/>");
    xml.input.@source = "folder";

    xml.output = XML("<output/>");
    xml.output.@path = Folder.desktop + "/" + "Output Folder";
    xml.output.@subfolder = true;
    xml.output.@keepStructure = false;

    xml.taskList = XML("<taskList/>");

    var task = XML("<task/>");
    task.@enabled = true;
    task.@subfolderName = "Set 1";
    task.@colorProfile = "sRGB IEC61966-2.1";
    task.saveOptions = XML("<saveOptions/>");
    task.saveOptions.@fileSaveType = "jpg";
    task.saveOptions.@jpqQuality = 10;
    task.saveOptions.@jpgEmbedColorProfile = true;
    task.saveOptions.@jpgFormat = "Standard";
    task.saveOptions.@saveForWeb = false;
    task.resizeOptions = XML("<resizeOptions/>");
    task.resizeOptions.@enabled = true;
    task.resizeOptions.@width = 800;
    task.resizeOptions.@widthUnits = "pixels";
    task.resizeOptions.@height = 800;
    task.resizeOptions.@heightUnits = "pixels";
    task.resizeOptions.@resolution = 72;
    task.resizeOptions.@resolutionUnits = "pixels/inch";
    task.resizeOptions.@scale = true;
    task.resizeOptions.@resampleMethod = "bicubic";
    task.action = XML("<action/>");
    task.action.@enabled = false;
    task.action.@when = "Before Image Resize";
    task.action.@set = "Default Actions";
    task.action.@name = "Sepia Toning (layer)";
    task.namingOptions = XML("<namingOptions/>");
    task.namingOptions = "Name,lowerCaseExtension";
    task.namingOptions.@startingSerial = 1;

    xml.taskList.appendChild(task);

    var task = XML("<task/>");
    task.@enabled = true;
    task.@subfolderName = "Set 2";
    task.@colorProfile = "Same as Source";
    task.saveOptions = XML("<saveOptions/>");
    task.saveOptions.@fileSaveType = "tiff";
    task.saveOptions.@tiffByteOrder = "MacOS"; // platform local
    task.saveOptions.@tiffEncoding = "None";
    task.saveOptions.@tiffEmbedColorProfile = true;
    task.saveOptions.@flattenImage = false;
    task.resizeOptions = XML("<resizeOptions/>");
    task.resizeOptions.@enabled = true;
    task.resizeOptions.@width = 1200;
    task.resizeOptions.@widthUnits = "pixels";
    task.resizeOptions.@height = 1200;
    task.resizeOptions.@heightUnits = "pixels";
    task.resizeOptions.@resolution = 240;
    task.resizeOptions.@resolutionUnits = "pixels/inch";
    task.resizeOptions.@scale = true;
    task.resizeOptions.@resampleMethod = "bicubic";
    task.action = XML("<action/>");
    task.action.@enabled = false;
    task.action.@when = "After Image Resize";
    task.action.@set = "Default Actions";
    task.action.@name = "Sepia Toning (layer)";
    task.namingOptions = XML("<namingOptions/>");
    task.namingOptions = "Name,lowerCaseExtension";
    task.namingOptions.@startingSerial = 1;

    xml.taskList.appendChild(task);

    var task = XML("<task/>");
    task.@enabled = true;
    task.@subfolderName = "Set 3";
    task.@colorProfile = "Same as Source";
    task.saveOptions = XML("<saveOptions/>");
    task.saveOptions.@fileSaveType = "psd";
    task.saveOptions.@pasAlphaChannels = true;
    task.saveOptions.@psdEmbedColorProfile = true;
    task.saveOptions.@psdLayers = true;
    task.saveOptions.@psdMaximizeCompatibility = true;
    task.saveOptions.@flattenImage = false;
    task.resizeOptions = XML("<resizeOptions/>");
    task.resizeOptions.@enabled = false;
    task.action = XML("<action/>");
    task.action.@enabled = false;
    task.action.@when = "After Image Resize";
    task.namingOptions = XML("<namingOptions/>");
    task.namingOptions = "Name,lowerCaseExtension";
    task.namingOptions.@startingSerial = 1;

    xml.taskList.appendChild(task);

    xml.preferences = XML("<preferences/>");
  }

  return xml;
};

// ImageProcessorOptions.DEFAULT_XML = <ImageProcessorProSettings>
//   <input source="folder"/>
//   <output path="~/Desktop/Output Folder" subfolder="true" keepStructure="false"/>
//   <taskList>
//     <task enabled="true" subfolderName="Set 1" colorProfile="sRGB IEC61966-2.1">
//       <saveOptions fileSaveType="jpg" jpgQuality="10" jpgEmbedColorProfile="true" jpgFormat="Standard" saveForWeb="false"/>
//       <resizeOptions enabled="true" width="800" widthUnits="pixels" height="800" heightUnits="pixels" resolution="72" resolutionUnits="pixels/inch" scale="true" resampleMethod="bicubic"/>
//       <action enabled="false" when="Before Image Resize" set="Default Actions" name="Sepia Toning (layer)"/>
//       <namingOptions startingSerial="1" >Name,_,twoDigit,lowerCaseExtension</namingOptions>
//     </task>

//     <task enabled="true" subfolderName="Set 2" colorProfile="Same as Source">
//       <saveOptions fileSaveType="tiff" tiffByteOrder="MacOS" tiffEncoding="None" tiffEmbedColorProfile="true"/>
//       <resizeOptions enabled="true" width="1200" widthUnits="pixels" height="1200" heightUnits="pixels" resolution="240" resolutionUnits="pixels/inch" scale="true" resampleMethod="bicubic"/>
//       <action enabled="false" when="After Image Resize" set="Default Actions" name="Vignette (selection)"/>
//       <namingOptions startingSerial="1">Name,lowerCaseExtension</namingOptions>
//     </task>

//     <task enabled="true" subfolderName="Set 3" colorProfile="Same as Source">
//       <saveOptions fileSaveType="psd" psdAlphaChannels="true" psdEmbedColorProfile="true" psdLayers="true" psdMaximizeCompatibility="true"/>
//       <resizeOptions enabled="false"/>
//       <action enabled="false" when="After Image Resize" set="Default Actions" name="Vignette (selection)"/>
//       <namingOptions startingSerial="1">Name,lowerCaseExtension</namingOptions>
//     </task>
//   </taskList>
//   <preferences/>
// </ImageProcessorProSettings>


ImageProcessorOptions.loadOptions = function(file, opts) {
  if (opts == undefined) {
    opts = ImageProcessorOptions.DEFAULT_XML.copy();
  }

  var xml = ImageProcessor.readSettingsFile(file);
  // reconcile defaults here

  return xml;
};

function ImageProcessor() {
  var self = this;

  self.actionSetNames = [];
  ImageProcessor.actionSets = psx.getActionSets();
  for (var i = 0; i < ImageProcessor.actionSets.length; i++) {
    self.actionSetNames[i] = ImageProcessor.actionSets[i].name;
  }

  self.init();
};

ImageProcessor.prototype.typename = "ImageProcessor";
ImageProcessor.VERSION = "2.3.1";

ImageProcessor.REQUIRED_PS_VERSION = 12;

ImageProcessor.SCRIPT_PATH = File($.fileName);
ImageProcessor.ICON_FOLDER = Folder(psx.SCRIPTS_FOLDER + '/icons');
// ImageProcessor.ICON_FOLDER = Folder(ImageProcessor.SCRIPT_PATH.parent + '/icons');
ImageProcessor.TITLE_UI = ZStrings.ImageProcessorProTitle;
ImageProcessor.VTITLE_UI = (ImageProcessor.TITLE_UI + ' ' +
                            ImageProcessor.VERSION)
ImageProcessor.TITLE = ImageProcessor.TITLE_UI.replace(/\s/g, '');

ImageProcessor.BAD_CHARS = /[\/\\:\*\?"<>\|]/;
ImageProcessor.BAD_CHARS_REX = /[\/\\:\*\?"<>\|]/g;

// localize???
// tpr, untagging means uncheck embed profile ImageProcessor.UNTAGGED_RGB = 'Untagged RGB';
ImageProcessor.SAME_AS_SOURCE = 'Same as Source';
ImageProcessor.PROFILES = 
  [/* // tpr, untagging means uncheck embed profile ImageProcessor.UNTAGGED_RGB, */
    ImageProcessor.SAME_AS_SOURCE, 'Working RGB',
    'Working CMYK', 'sRGB IEC61966-2.1', 'Adobe RGB (1998)',
    'ProPhoto RGB', 'ColorMatch RGB' ];

ImageProcessor.AFTER_IMAGE_RESIZE = ZStrings.AfterImageResize;
ImageProcessor.BEFORE_IMAGE_RESIZE = ZStrings.BeforeImageResize;

ImageProcessor.ACTION_MENU =
  [ ImageProcessor.AFTER_IMAGE_RESIZE, ImageProcessor.BEFORE_IMAGE_RESIZE ];

ImageProcessor.FILES_TO_SKIP =
  [ "db", "xmp", "thm", "txt", "doc", "md0", "tb0",
    "adobebridgedb", "adobebridgedbt", "bc", "bct", "atn" ];

ImageProcessor.CAMERA_RAW_FILES = 
  [ "tif", "crw", "nef", "raf", "orf", "mrw", "dcr", "mos",
    "srf", "pef", "dcr", "cr2", "dng", "erf", "x3f", "raw" ];

// UI text edit limit
ImageProcessor.SHORT_FNAME_LEN_WIN = 360;
ImageProcessor.SHORT_FNAME_LEN_MAC = ImageProcessor.SHORT_FNAME_LEN_WIN - 4;
ImageProcessor.SHORT_FNAME_LEN = ImageProcessor.SHORT_FNAME_LEN_MAC;
ImageProcessor.LOG_FILE = Folder.userData + '/' + ImageProcessor.TITLE_UI + ".log";

ImageProcessor.CM_PER_INCH = 2.54;
ImageProcessor.MIN_RES_INCHES =	35.0;
ImageProcessor.MAX_RES_INCHES =	1200.0;
ImageProcessor.MIN_RES_CM = 
    (ImageProcessor.MIN_RES_INCHES / ImageProcessor.CM_PER_INCH);
ImageProcessor.MAX_RES_CM =
    (ImageProcessor.MAX_RES_INCHES / ImageProcessor.CM_PER_INCH);
ImageProcessor.MIN_PIXELS = 1;
ImageProcessor.MAX_PIXELS = 30000;

ImageProcessor.MIN_PERCENT = 1;
ImageProcessor.MAX_PERCENT = 1000;

ImageProcessor.kFilesList = sTID('filesList');


ImageProcessor.fieldErrorPrompt = function(msg) {
  // shold probably check for dialogMode
  if (app.dialogModes != DialogModes.NO) {
    alert(msg);
  }
  return false;
};

ImageProcessor.invalidValuePrompt = function(nm) {
  var msg = ZStrings.InvalidValueMsg.sprintf(nm);
  return ImageProcessor.fieldErrorPrompt(msg);
};

ImageProcessor.invalidNumberPrompt = function(nm) {
  var msg = ZStrings.InvalidNumberMsg.sprintf(nm);
  return ImageProcessor.fieldErrorPrompt(msg);
};

ImageProcessor.numberOutOfRange = function(nm, min, max) {
  var msg = ZStrings.NumberOutOfRangeMsg.sprintf(nm, min, max);
  return ImageProcessor.fieldErrorPrompt(msg);
};

ImageProcessor.getNumber = function(s, type, nm, min, max, base) {
  var n = Number(s);
  if (isNaN(n)) {
    ImageProcessor.invalidNumberPrompt(nm);
    return undefined;
  }

  var unit = UnitValue(n, type);
  unit.baseUnit = base;

  var val = unit.as("px");

  if (val < min || val > max) {
    var v = ImageProcessor.pixelsToUnits(max, type,
                                         1/base.as("in"),
                                         undefined);
    max = toNumber(v.toFixed(3));
    if (max > v) {
      max -= 0.001;
    }

    v = ImageProcessor.pixelsToUnits(min, type,
                                    1/base.as("in"),
                                    undefined);
    min = toNumber(v.toFixed(3));
    if (min < v) {
      min += 0.001;
    }
    ImageProcessor.numberOutOfRange(nm, min, max);
    n = (val < min) ? min : max;
  }
  return n;
};

ImageProcessor.readSettingsFile = function(file) {
  var xml = psx.readXMLFile(file);
  var str = xml.toXMLString();

  if (str.contains("<resizeOpts")) {
    xml = new XML(str.replace(/resizeOpts/g, "resizeOptions"));
  }

  return xml;
};

ImageProcessor.globalInit = function() {
  ImageProcessorOptions.defaultXML = ImageProcessorOptions.getDefaultOptions();

  LogFile.setFilename(ImageProcessor.LOG_FILE);
  LogFile.write("Start TutorialBuilder.jsx");
  LogFile.write("Revision: $Revision: 1.88 $");
  LogFile.write("App: " + app.name);
  LogFile.write("App Version: " + app.version);
  LogFile.write("OS: " + $.os);
  LogFile.write("Version: " + ImageProcessor.VERSION);

  // remember the dialog modes
  ImageProcessor.dialogMode = app.displayDialogs;
  app.displayDialogs = DialogModes.NO;

  // remember the units
  ImageProcessor.rulerUnits = app.preferences.rulerUnits;
  app.preferences.rulerUnits = Units.PIXELS;
  
  // remember the number of history states
  ImageProcessor.numberOfHistoryStates = app.preferences.numberOfHistoryStates;
  app.preferences.numberOfHistoryStates = 40;

  return true;
};

ImageProcessor.globalCleanup = function() {
  app.preferences.rulerUnits = ImageProcessor.rulerUnits;
  app.preferences.numberOfHistoryStates = ImageProcessor.numberOfHistoryStates;
  app.displayDialogs = ImageProcessor.dialogMode;
};


ImageProcessor.getIconPath = function(fname) {
  return File(ImageProcessor.ICON_FOLDER + '/' + fname);
};


ImageProcessor.setIcon = function(ctrl, fname) {
  var file = ImageProcessor.getIconPath(fname);
  if (file.exists) {
    ctrl.icon = file;
  }
};

ImageProcessor.prototype.errorPrompt = function(str) {
  return confirm(str + "\r\rDo you wish to continue?");
};

ImageProcessor.getBridgeFiles = function() {
  var fileList;
  if ( BridgeTalk.isRunning( "bridge" ) ) {
    var bt = new BridgeTalk();
    bt.target = "bridge";
    bt.body = "var theFiles = photoshop.getBridgeFileListForAutomateCommand();theFiles.toSource();";
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

ImageProcessor.prototype.init = function() {
  var self = this;

  if (typeof(gFilesFromBridge) == "undefined") {
    self.runningFromBridge = false;
    self.filesFromBridge = undefined;

  } else {
    self.filesFromBridge = gFilesFromBridge;
    if (self.filesFromBridge.length > 0) {
      self.runningFromBridge = true;
    } else {
      self.runningFromBridge = false;
    }
  }

  self.bridgeIsRunning = BridgeTalk.isRunning("bridge");
  self.fnOpts = [];
};

ImageProcessor.prototype.createInputPanel = function(pnl) {
  var self = this;

  var lineH = UIC.lineH;

  pnl.img = pnl.add('image', [0, 0, 30, 30], undefined, { name : 'img'} );
  ImageProcessor.setIcon(pnl.img, "one.png");
  pnl.img.helpTip = ZStrings.SelectSourceImagesTip;

  var len = (self.filesFromBridge ? self.filesFromBridge.length : 0);
  var str = ZStrings.ProcessFilesFromBridgeFmt.sprintf(len);

  pnl.bridgeLbl = pnl.add('statictext', [30, 8, 300, lineH],
                          str, { name: "bridgeLbl"} );
  pnl.bridgeLbl.helpTip = ZStrings.SelectedFilesFromBridge;

  pnl.lbl = pnl.add('statictext', [30, 8, 300, lineH],
                    ZStrings.SelectSourceImages);
  pnl.lbl.helpTip = ZStrings.SelectSourceImagesTip;

  pnl.folder = pnl.add('image', [0, 0, 100, 120], 'SourceFolderIcon');

  var xx = UIC.col1X;
  var yy = lineH;

  pnl.useOpenImages = pnl.add('radiobutton',
                              [xx, yy, xx+UIC.col1W, yy+lineH],
                              ZStrings.UseOpenImages,
                              {name: "useOpenImages"});

  pnl.useOpenImages.helpTip = ZStrings.UseOpenImagesTip;

  yy += lineH;

  pnl.useFolder = pnl.add('radiobutton',
                          [xx, yy, xx+lineH-7, yy+lineH],
                          undefined, {name: "useFolder"});
  yy -= lineH;
  xx = UIC.col2X + 10;

  pnl.includeSubFolders = pnl.add('checkbox',
                                  [xx, yy, xx+300, yy+lineH],
                                  ZStrings.IncludeSubFolders,
                                  {name: "includeSubFolders"});
  pnl.includeSubFolders.helpTip = ZStrings.IncludeSubFoldersTip;

  yy += lineH;
  xx = UIC.col1X + 20;
  var btnW = 80;

  pnl.sourceBrowse = pnl.add('button', [xx, yy, xx+btnW,
                                        yy+UIC.btnH],
                             ZStrings.Choose);

  pnl.sourceBrowse.helpTip = ZStrings.SelectSourceImagesTip;

  xx = UIC.col2X + 10;
  pnl.source = pnl.add('statictext', [xx, yy+UIC.txtOfs, xx+500, yy+lineH],
                       ZStrings.NoImagesSelected, {name: "source"});

  pnl.useFolder.value = true;

  pnl.useOpenImages.onClick = pnl.useFolder.onClick = function() {
    var pnl = this.parent;
    pnl.includeSubFolders.enabled = pnl.sourceBrowse.enabled =
      pnl.source.enabled = pnl.useFolder.value;
  }
  pnl.useOpenImages.onClick();

  pnl.sourceBrowse.onClick = function() {
    var pnl = this.parent;
    var processor = pnl.window.processor;

    try {
      var def = (processor.lastInputFolder ?
                 processor.lastInputFolder : Folder.desktop);
      var txt = pnl.source.text || ZStrings.NoImagesSelected;
      def = (txt != ZStrings.NoImagesSelected ?
             new Folder(txt) : def);
      
      var f = psx.selectFolder(ZStrings.SelectFolder, def);
      if (f) {
        pnl.source.text = decodeURI(f.fsName);
        pnl.source.helpTip = pnl.source.text;
        processor.lastInputFolder = f;
      }
    } catch (e) {
      LogFile.logException(e, "sourceBrowse", true);
    }
  }

  var childs = pnl.children;
  for (var i = 0; i < childs.length; i++) {
    var child = childs[i];
    if (child.properties) {
      if (self.runningFromBridge) {
        var nm = child.properties.name;
        child.visible = (nm == "bridgeLbl" || nm == "img");
      } else {
        child.visible = child.properties.name != "bridgeLbl";
      }
    } else {
      child.visible = !self.runningFromBridge;
    }
  }

  return pnl;
};

ImageProcessor.prototype.createOutputPanel = function(pnl) {
  var self = this;
  var lineH = UIC.lineH;

  pnl.img = pnl.add('image', [0, 0, 30, 30]);
  ImageProcessor.setIcon(pnl.img, "two.png");
  pnl.img.helpTip = ZStrings.SelectSaveLocationTip;

  pnl.lbl = pnl.add('statictext', [30, 8, 300, lineH],
                    ZStrings.SelectSaveLocation);
  pnl.lbl.helpTip = ZStrings.SelectSaveLocationTip;

  pnl.folder = pnl.add('image', [0, 0, 100, 120], 'SourceFolderIcon');

  var xx = UIC.col1X;
  var yy = lineH;
  var wideCol1 = UIC.col1W+10;

  pnl.sameLocation = pnl.add('radiobutton',
                             [xx, yy, xx+wideCol1, yy+lineH],
                             ZStrings.SaveInSameLocation,
                             {name: "sameLocation"});
  pnl.sameLocation.helpTip = ZStrings.SaveInSameLocationTip;

  yy += lineH;

  pnl.useFolder = pnl.add('radiobutton',
                          [xx, yy, xx+lineH-7, yy+lineH],
                          undefined, {name: "useFolder"});
  pnl.useFolder.helpTip = ZStrings.SelectSaveLocationTip;

  yy -= lineH;
  xx = UIC.col2X + 10;

  var csfWidth = 150;
  pnl.createSubFolder = pnl.add('checkbox',
                                [xx, yy, xx+csfWidth, yy+lineH],
                                ZStrings.SaveInSubFolder,
                                {name: "createSubFolder"});
  pnl.createSubFolder.helpTip = ZStrings.SaveInSubFolderTip;

  pnl.createSubFolder.onClick = function() {
    var pnl = this.parent;
    // if (!pnl.createSubFolder.value && !pnl.keepFolderStructure.value) {
    //   pnl.createSubFolder.value = true;
    // }
    pnl.window.processor.setFolderNameState(pnl.createSubFolder.value);
  }

  xx += csfWidth;
  pnl.keepFolderStructure = pnl.add('checkbox',
                                    [xx, yy, xx+csfWidth+20, yy+lineH],
                                    ZStrings.KeepFolderStructure,
                                    {name: "keepFolderStructure"});
  pnl.keepFolderStructure.helpTip = ZStrings.KeepFolderStructureTip;

  pnl.keepFolderStructure.onClick = function() {
    var pnl = this.parent;
    // if (!pnl.createSubFolder.value && !pnl.keepFolderStructure.value) {
    //   pnl.keepFolderStructure.value = true;
    // }
    pnl.window.processor.setFolderNameState(pnl.createSubFolder.value);
  }

  yy += lineH;
  xx = UIC.col1X + 20;
  var btnW = 80;

  pnl.destBrowse = pnl.add('button', [xx, yy, xx+btnW,
                                        yy+UIC.btnH],
                           ZStrings.Choose);
  pnl.destBrowse.helpTip = ZStrings.SelectSaveLocation;

  xx = UIC.col2X + 10;
  pnl.dest = pnl.add('statictext', [xx, yy+UIC.txtOfs, xx+500, yy+lineH],
                     ZStrings.NoFolderSelected, {name: "dest"});

  pnl.sameLocation.value = true;
  pnl.sameLocation.onClick = pnl.useFolder.onClick = function() {
    var pnl = this.parent;
    pnl.keepFolderStructure.enabled = pnl.destBrowse.enabled = 
    pnl.dest.enabled = pnl.useFolder.value;
  }
  pnl.sameLocation.onClick();

  pnl.destBrowse.onClick = function() {
    var pnl = this.parent;
    var processor = pnl.window.processor;

    try {
      var def = (processor.lastOutputFolder ?
                 processor.lastOutputFolder : Folder.desktop);

      var txt = pnl.dest.text || ZStrings.NoFolderSelected;
      def = (txt != ZStrings.NoFolderSelected ?
             new Folder(txt) : def);
      var f = psx.selectFolder(ZStrings.SelectFolder, def);

      if (f) {
        pnl.dest.text = decodeURI(f.fsName);
        pnl.dest.helpTip = pnl.dest.text;
        processor.lastOutputFolder = f;
      }

    } catch (e) {
      LogFile.logException(e, "destBrowse", true);
    }
  }

  return pnl;
};

ImageProcessor.prototype.createCtrlPanel = function(pnl) {
  var self = this;
  var lineH = UIC.lineH;

  var w = pnl.bounds.width;
  var btnW = w - 10;
  var btnH = UIC.btnH;
  var xx = 10;
  var yy = 10;
  
  pnl.runBtn = pnl.add('button', [xx,yy,xx+btnW,yy+btnH], ZStrings.RunBtn);

  pnl.window.defaultElement = pnl.runBtn;
  pnl.runBtn.active = true;

  yy += btnH + 5;
  pnl.cancelBtn = pnl.add('button', [xx,yy,xx+btnW,yy+btnH], ZStrings.CancelBtn);
  yy += btnH + 25;
  pnl.loadBtn = pnl.add('button', [xx,yy,xx+btnW,yy+btnH], ZStrings.LoadBtn);
  pnl.loadBtn.helpTip = ZStrings.LoadBtnTip;
  yy += btnH + 5;
  pnl.saveBtn = pnl.add('button', [xx,yy,xx+btnW,yy+btnH], ZStrings.SaveBtn);
  pnl.saveBtn.helpTip = ZStrings.SaveBtnTip;
  yy += btnH + 5;
  pnl.resetBtn = pnl.add('button', [xx,yy,xx+btnW,yy+btnH], ZStrings.ResetBtn);
  pnl.resetBtn.helpTip = ZStrings.ResetBtnTip;

  pnl.runBtn.onClick = function() {
    this.window.processor.run();
  }
  // pnl.cancelBtn.onClick = function() {
  //   this.window.processor.cancel();
  // }
  pnl.loadBtn.onClick = function() {
    this.window.processor.load();
  }
  pnl.saveBtn.onClick = function() {
    this.window.processor.save();
  }
  pnl.resetBtn.onClick = function() {
    this.window.processor.reset();
  }

  return pnl;
};


ImageProcessor.prototype.setFolderNameState = function(enabled) {
  try {
    var self = this;
    var tabs = self.tabPanel.children;
    for (var i = 0; i < tabs.length; i++) {
      var tab = tabs[i];
      tab.subfolderName.enabled = enabled;
    }
  } catch (e) {
  }
};

ImageProcessor.prototype.createFileSavePanel = FileSaveOptions.createFileSavePanel;
ImageProcessor.prototype.validateFileSavePanel = FileSaveOptions.validateFileSavePanel;

ImageProcessor.prototype.createFileTypesPanel = function(pnl) {
  var self = this;

  var lineH = UIC.lineH;

  pnl.img = pnl.add('image', [0, 0, 30, 30]);
  ImageProcessor.setIcon(pnl.img, "three.png");
  pnl.img.helpTip = ZStrings.FileTypes;

  pnl.lbl = pnl.add('statictext', [30, 8, 300, lineH], ZStrings.FileTypes);
  pnl.lbl.helpTip = ZStrings.FileTypes;

  var btnW = 30;
  var btnX = UIC.col1X - btnW - 10;
  var yy = lineH*2;

  pnl.addBtn = pnl.add('button', [btnX,yy,btnX+btnW,yy+UIC.btnH], '+');
  pnl.addBtn.helpTip = ZStrings.AddTaskTip;
  yy += lineH;

  pnl.removeBtn = pnl.add('button', [btnX,yy,btnX+btnW,yy+UIC.btnH], '-');
  pnl.removeBtn.helpTip = ZStrings.RemoveTaskTip;
  pnl.removeBtn.enabled = false;

  pnl.updateState = function() {
    var pnl = this;
    pnl.removeBtn.enabled = pnl.tabPnl.children.length > 1;
  }

  pnl.addBtn.onClick = function() {
    try {
      if (self.tabPanel.children.length >= 10) {
        alert("I really don't want to work that hard. Could you just use 10 output settings please?");
        return;
      }
      var pnl = this.parent;
      var processor = pnl.window.processor;
      var xml = self.readTaskSettings(pnl.tabPnl.selection);
      
      var tab = processor.createFileTypeTab("jpg");
      var nm = tab.subfolderName.text;
      pnl.tabPnl.selection = tab;
      self.writeTaskSettings(tab, xml);
      tab.subfolderName.text = nm;
      tab.updateTabName();
      
      if (pnl.onChange) {
        pnl.onChange();
      }
      
      pnl.updateState();
      
    } catch (e) {
      LogFile.logException(e, "add", true);
    }
  }
  pnl.removeBtn.onClick = function() {
    var pnl = this.parent;
    var sel = pnl.tabPnl.selection;
    var children = pnl.tabPnl.children;
    var len = children.length;
    var idx = 0;
    for (var i = 0; i < len; i++) {
      if (children[i] == sel) {
        idx = i;
        break;
      }
    }
    pnl.tabPnl.remove(pnl.tabPnl.selection);
    pnl.removeBtn.enabled = pnl.tabPnl.children.length > 1;
    if (idx > 0) {
      idx--;
    }
    pnl.tabPnl.selection = children[idx];

    if (pnl.onChange) {
      pnl.onChange();
    }
  }

  pnl.tabPnl =  pnl.add('tabbedpanel', [UIC.col1X, lineH,
                                        pnl.bounds.width-10,
                                        pnl.bounds.height-10]);
  self.tabPanel = pnl.tabPnl;

  try {
    self.createFileTypeTab("jpg");
  } catch (e) {
    LogFile.logException(e, "Failed creating default FileType tab", true);
    return undefined;
  }

  pnl.onChange = function() {
    var pnl = this;
    var processor = pnl.window.processor;
    processor.findAllWidgets();

    pnl.updateState();
  }

  pnl.updateState();

  return pnl;
};

ImageProcessor.prototype.createFileNamingPanel = FileNamingOptions.createFileNamingPanel;

ImageProcessor.prototype.createFileTypeTab = function(type) {
  var self = this;

  if (!type) {
    type = "jpg";
  }
  var idx = self.tabPanel.children.length + 1;
  var name = "Set " + idx;
  var pnl = self.tabPanel.add('tab', undefined, name);

  pnl.mgr = self;
  
  var xOfs = 10;
  var xx = xOfs;
  var yy = 10;
  var lineH = UIC.lineH;

  pnl.isEnabled = pnl.add('checkbox', [xx,yy,xx+80,yy+UIC.textH], ZStrings.Save,
                        { name: "isEnabled" });
  pnl.isEnabled.value = true;

  pnl.isEnabled.onClick = function() {
    var pnl = this.parent;
    pnl.updateTabName();
  }
  
  xx = 139;
  pnl.subfolderNameLbl = pnl.add('statictext', [xx,yy+3,xx+105,yy+lineH],
                                 ZStrings.SubFolderNameLbl);
  xx += pnl.subfolderNameLbl.bounds.width+10;
  pnl.subfolderName = pnl.add('edittext', [xx,yy,xx+UIC.folderW,yy+UIC.textH],
                              name, { name: "subfolderName" });

  pnl.subfolderName.onChanging = function() {
    var pnl = this.parent;
    if (pnl.subfolderName.text.match(RegExp(ImageProcessor.BAD_CHARS))) {
      pnl.subfolderName.text = 
        pnl.subfolderName.text.replace(ImageProcessor.BAD_CHARS_REX, '');
    }
    pnl.updateTabName();
  }
  // this is a little awkward...
  pnl.subfolderName.enabled = pnl.window.outputPanel.createSubFolder.value;

  pnl.updateTabName = function() {
    var pnl = this;
    var name = pnl.subfolderName.text;

    var filetype = pnl.fileSavePanel.getFileSaveType();
    pnl.text = (!pnl.isEnabled.value ? "*" : "") + name + ' (.' + filetype + ')';
  }
 
  yy += lineH + 5;
  xx = xOfs;

  // Output Format
  pnl.fileSavePanel = pnl.add('group', [xx,yy,xx+400,yy+95],
                              { name: "fileSavePanel" });
  self.createFileSavePanel(pnl.fileSavePanel, { fileType: type});

  // remove the Convert to sRGB button
  var idx = pnl.fileSavePanel.jpg.indexOf("jpgConvertToSRGB");
  pnl.fileSavePanel.jpg.splice(idx, 1);
  pnl.fileSavePanel.jpgConvertToSRGB.visible = false;
  pnl.fileSavePanel.jpgConvertToSRGB.enabled = false;
  pnl.fileSavePanel.jpgConvertToSRGB.value = false;

  pnl.fileSavePanel.saveForWeb.helpTip = ZStrings.RemovePreviewAndMetadata;

  pnl.fileSavePanel.onChange = function() {
    var pnl = this.parent;

    pnl.updateTabName();

    var opts = {};
    pnl.mgr.validateFileSavePanel(pnl.fileSavePanel, opts);
    var mcExt = (opts.fileSaveType[0].toUpperCase() +
                 opts.fileSaveType.substring(1));
    var outFile = File(Folder.temp + '/Document.' + mcExt);
    var fnp = pnl.fileNamingPanel.getFileNamingOptions();
    var example = fnp.format(outFile);
    pnl.fileNamingPanel.example.text = example;

    var type = opts.fileSaveType;
    if (type == "bmp" || type == "gif" || type == "jpg" ||
        type == "tga" || type == "eps") {
      pnl.setBitDepthState(false);
    } else {
      pnl.setBitDepthState(true);
    }
  }

  yy += 105;

  var colW = 90;

  // Output Profile
  var lbl = pnl.add('statictext', [xx,yy+3,xx+95,yy+lineH],
                    ZStrings.OutputProfileLbl);
  xx += lbl.bounds.width + 5;

  pnl.colorProfile = pnl.add('dropdownlist', [xx, yy, xx+UIC.col1W+5, yy+25],
                             ImageProcessor.PROFILES,
                             { name: "colorProfile" } );
  pnl.colorProfile.items[1].selected = true;

 
  xx += pnl.colorProfile.bounds.width + 20;

  // Bit Depth
  pnl.bitDepthEnabled = pnl.add('checkbox', [xx,yy,xx+90,yy+lineH],
                                ZStrings.BitDepthLbl,
                                { name: "bitDepthEnabled" });

  pnl.bitDepthEnabled.onClick = function() {
    var pnl = this.parent;
    if (pnl.bitDepthEnabled.enabled) {
      pnl.bitDepth.enabled = pnl.bitDepthEnabled.value;
    } else {
      pnl.bitDepth.enabled = false;
    }
  }

  xx += pnl.bitDepthEnabled.bounds.width + 3;

  pnl.bitDepth = pnl.add('dropdownlist', [xx, yy, xx+40, yy+23],
                         ["8", "16"], { name: "bitDepth" } );
  pnl.bitDepth.items[0].selected = true;

  pnl.bitDepthEnabled.onClick();

  pnl.setBitDepthState = function(st) {
    var pnl = this;
    
    pnl.bitDepthEnabled.enabled = st;
    pnl.bitDepthEnabled.onClick();
  }

  pnl.setBitDepthState(false);

  
  yy += lineH;
  xx = xOfs;

  // Run Action
  pnl.runAction = pnl.add('checkbox', [xx,yy,xx+colW+10,yy+UIC.textH],
                          ZStrings.RunAction,
                          { name: "runAction" });
  pnl.runAction.value = false;
  pnl.runAction.onClick = function() {
    var pnl = this.parent;
    var on = this.value;
    pnl.runActionWhen.enabled = pnl.actionLbl.enabled =
    pnl.actionSets.enabled = pnl.actions.enabled = on;
  }
  
  xx += colW + 10;

  pnl.runActionWhen = pnl.add('dropdownlist', [xx,yy,xx+UIC.col1W+5,yy+25],
                              ImageProcessor.ACTION_MENU,
                              { name: "runActionWhen" });
  pnl.runActionWhen.items[0].selected = true;

//   yy += lineH;
//   xx = xOfs;
  xx += pnl.runActionWhen.bounds.width + 20;

  // Action Selector
  pnl.actionLbl = pnl.add('statictext', [xx,yy+3,xx+UIC.col1W,yy+lineH],
                          ZStrings.ActionLbl);
  xx += 45;

  pnl.actionSets = pnl.add('dropdownlist', [xx,yy,xx+UIC.col1W,yy+25],
                              self.actionSetNames,
                              { name: "actionSets" });
  pnl.actionSets.items[0].selected = true;

  xx += UIC.col1W + 5;

  pnl.actions = pnl.add('dropdownlist', [xx,yy,xx+UIC.col1W,yy+25],
                       [], { name: "actions" });

  pnl.actionSets.onChange = function() {
    var pnl = this.parent;
    pnl.actions.removeAll();
    var acts = ImageProcessor.actionSets[this.selection.index].actions;
    for (var i = 0; i < acts.length; i++) {
      pnl.actions.add("item", acts[i]);
    }
    if (acts.length) {
      pnl.actions.items[0].selected = true;
    }
  }
  pnl.actionSets.onChange();
  pnl.runAction.onClick();

  xx = xOfs;
  yy += lineH;

  var useSerial = true;

  // Filenaming
  pnl.fileNamingPanel = pnl.add('panel',
                                [xx,yy,xx+550,yy+110],
                                '',
                                { name: "fileNamingPanel" });

  var fn = "Name,lowerCaseExtension";

  var op = { fileNaming: fn};
  self.createFileNamingPanel(pnl.fileNamingPanel, op, '', useSerial);

  var w = pnl.fileNamingPanel.example;
  var x = w.bounds.x + 295;
  var y = w.bounds.y;
  var lbl = pnl.fileNamingPanel.startingSerialLbl;
  lbl.bounds = [x,y+3,x+109,y+22+3];
  x += isWindows() ? 105 : 119;
  var txt = pnl.fileNamingPanel.startingSerial;
  txt.bounds = [x,y,x+40,y+22];

  pnl.fileNamingPanel.onChange = function() {
    var pnl = this.parent;
    pnl.fileSavePanel.onChange();
  }

  pnl.fileNamingPanel.notifyCustomText = function(event,
                                                  text,
                                                  oldText) {
    var pnl = this.parent;
    var tabs = pnl.parent.children;
    var len = tabs.length;

    for (var i = 0; i < len; i++) {
      var tab = tabs[i];
      if (tab == pnl) {
        continue;
      }
      tab.fileNamingPanel.updateCustomText(event, text, oldText);
    }
  }

  yy = 5;

  xx = 455; //pnl.parent.bounds.width-200;


  // Resize Panel
  pnl.resizePanel = pnl.add('panel', [xx, yy, xx+ResizePanel.DEFAULT_WIDTH,
                                      yy+ResizePanel.DEFAULT_HEIGHT],
                            '',
                            { name: "resizePanel" } );

  ResizePanel.createPanel(pnl.resizePanel, { width: 480, height: 640 }, "");

  pnl.saveForWebNotice = false;

  // this bit of code forces the resolution to 72ppi when SfW is selected
  pnl.fileSavePanel.saveForWeb.onClick = function() {
    var pnl = this.parent.parent;
    if (pnl.fileSavePanel.saveForWeb.value) {
      var proc = pnl.window.processor;
      if (!proc.saveForWebNotice) {
        alert(ZStrings.SaveForWebNotice);
        proc.saveForWebNotice = true;
      }
      if (pnl.resizePanel.resolution.text != 72) {
        pnl.resizePanel.resolution.text = 72;
      }
      var resUnits = pnl.resizePanel.resolutionUnits;
      if (resUnits.selection.text != ResizePanel.PPI) {
        resUnits.selection = resUnits.find(ResizePanel.PPI);
      }

      pnl.setBitDepthState(false);

    } else {
      pnl.fileSavePanel.onChange();
    }
  }

  pnl.runAction.onClick();

  pnl.updateTabName();

  return pnl;
};

ResizeOptions = function(obj, prefix) {
  var self = this;

  self.enabled = false;
  self.dontEnlarge = false;
  self.width = 1024;
  self.widthUnits = "px";
  self.height = 1024;
  self.heightUnits = "px";
  self.scale = true;  // styles
  self.resample = true;
  self.resampleMethod = ResampleMethod.BICUBIC;

  self._fitImage = false;

  if (obj) {
    if (prefix == undefined) {
      prefix = '';
    }
    var props = ResizeOptions.properties;
    for (var i = 0; i < props.length; i++) {
      var name = props[i];
      var oname = prefix + name;
      if (oname in obj) {
        self[name] = obj[oname];
      } else if (name == 'width' || name == 'height') {
        self[name] = '';
      }
    }
  }
};

ResizeOptions.properties = ["enabled", "dontEnlarge",
                            "width", "widthUnits",
                            "height", "heightUnits",
                            "resolution", "resolutionUnits",
                            "scale", "resample", "resampleMethod"];

ResizeOptions.resizeImage = function(doc, opts, p) {
  p = p || '';

  if (!toBoolean(opts[p + 'enabled'])) {
    return;
  }

  var dontEnlarge = toBoolean(opts[p + 'dontEnlarge']);

  var width = toNumber(opts[p + 'width']);
  var height = toNumber(opts[p + 'height']);
  
//   if (!width || !height) {
//     Error.runtimeError(9001, ZStrings.WidthAndHeightErr);
//   }

  var oldPref = app.preferences.rulerUnits;
  app.preferences.rulerUnits = Units.PIXELS; // save old preferences

  var rez = doc.resolution;

  var docWidth = (1.0 * doc.width.as('px') * rez) / 72.0;
  var docHeight = (1.0 * doc.height.as('px') * rez) / 72.0;
  
  var docRatio = docWidth / docHeight; // decimal ratio of original width/height

  if (ImageProcessorOptions.LEGACY_RESIZE) {
    if (!width) {
      width = height;
    }
    if (!height) {
      height = width;
    }

  } else {
    if (!width) {
      width = height * docRatio;
    }
    if (!height) {
      height = width / docRatio;
    }
  }
  
  var newWidth = Math.round(width);
  var newHeight = ((1.0 * width) / docRatio); // decimal calc
  
  if (dontEnlarge) {
    if (newWidth > docWidth ||
        newHeight > docHeight) {
      return;
    }
  }

  if (newHeight > height) {
    newWidth = undefined;
    newHeight = Math.round(height);

  } else {
    newHeight = undefined;
  }

  var desc = new ActionDescriptor();
  if (newWidth != undefined) {
    desc.putUnitDouble(cTID('Wdth'), cTID('#Pxl'), newWidth);
  }
  if (newHeight != undefined) {
    desc.putUnitDouble(cTID('Hght'), cTID('#Pxl'), newHeight);
  }

  // We always constrain proportions
  desc.putBoolean( cTID('CnsP'), true );

  var scaleStyles = toBoolean(opts[p + 'scaleStyles']);
  desc.putBoolean(sTID('scaleStyles'), scaleStyles);
                  
  var id = ResizePanel.typeIdFromResampleMethod(opts[p + 'resampleMethod']);
  desc.putEnumerated(cTID('Intr'), cTID('Intp'), id);

  executeAction(cTID('ImgS'), desc, DialogModes.NO);
};


//
// ResizePanel
// 
ResizePanel = function() {};

ResizePanel.DEFAULT_WIDTH = 250;
ResizePanel.DEFAULT_HEIGHT = 160;

ResizePanel.METHOD_LABELS = ["Bicubic", "BicubicSharper","BicubicSmoother",
                            "None", "Bilinear", "NearestNeighbor"];

ResizePanel.UNITS = ["pixels", "percent", "inches",
                     "cm", "mm", "points", "picas"];

ResizePanel.PPI = "pixels/inch";
ResizePanel.PPCM = "pixels/cm";
ResizePanel.RES_UNITS = [ResizePanel.PPI, ResizePanel.PPCM];

ResizePanel.createPanel = function(pnl, ini, prefix) {
  var self = this;

  var xofs = 0;
  var yofs = 0;
  var tOfs = ((CSVersion() >= 3) ? 3 : 0);
  var deltaY = 23;

  if (pnl.type == 'panel') {
    xofs += 5;
    yofs += 5;
  }

  pnl.prefix = prefix || '';

  var xx = xofs;
  var yy = yofs;

  var opts = new ResizeOptions(ini, pnl.prefix);

//   alert(listProps(ini));
//   alert(listProps(opts));

  //
  // Enabled
  //
  pnl.resizeEnabled = pnl.add('checkbox', [xx,yy,xx+100,yy+25],
                              ZStrings.ResizeToFit);
  pnl.resizeEnabled.value = toBoolean(opts.enabled);

  pnl.resizeEnabled.onClick = function() {
    var pnl = this.parent;
    var st = pnl.resizeEnabled.value;
    var props = ["resizeWidthLabel", "resizeWidth", "resizeWidthUnits",
                 "resizeHeightLabel", "resizeHeight", "resizeHeightUnits",
                 "resolutionLabel", "resolution", "resolutionUnits",
                 "resizeScale", "resampleMethod","resizeReset",
                 "resizeDontEnlarge"
                 ];
    for (var i = 0; i < props.length; i++) {
      var w = props[i];
      pnl[w].enabled = st;
    }

    pnl.resampleMethod.enabled = st;
  }

  
  xx += 128;

  pnl.resizeDontEnlarge = pnl.add('checkbox', [xx,yy,xx+120,yy+25],
                                  "Don't Enlarge");
  pnl.resizeDontEnlarge.value = toBoolean(opts.dontEnlarge);


  // Reset - probably not needed here
  pnl.resizeReset = pnl.add('button', [xx,yy,xx+80,yy+20], 'Reset...');
  pnl.resizeReset.visible = false;
  pnl.resizeReset.onClick = function() {
    var pnl = this.parent;
    if (pnl._width) {
      pnl.resizeWidth.text = pnl._width;
    }
    if (pnl._height) {
      pnl.resizeHeight.text = pnl._height;
    }
  }

  yy += deltaY + 5;
  xx = xofs;


  var units = ResizePanel.UNITS;
  var resUnits = ResizePanel.RES_UNITS;

  var col1 = 73;

  var menuWidth = 100;

  //
  // Width
  //
  pnl.resizeWidthLabel = pnl.add('statictext',
                                 [xx,yy+tOfs,xx+col1,yy+tOfs+23],
                                 ZStrings.WidthLbl);
  xx += col1;
  pnl.resizeWidth = pnl.add('edittext', [xx,yy,xx+50,yy+20], 1024);
  var w = toNumber(opts.width) || '';
  pnl._width = w;
  pnl.resizeWidth.text = w;
  xx += 55;
  pnl.resizeWidthUnits = pnl.add('dropdownlist',
                                 [xx,yy,xx+menuWidth,yy+22], units);

  psxui.setMenuSelection(pnl.resizeWidthUnits, opts.resizeWidthUnits || '', 0);

  pnl.resizeWidth.onChange = function() {
    var pnl = this.parent;
    var obj = this;
    var txt = obj.text;
    var units = pnl.resizeWidthUnits.selection.text;

    if (!txt) {
      return undefined;
    }

    var nm = "Resize Width";

    if (units == "percent") {
      var n = toNumber(txt);

      if (isNaN(n)) {
        ImageProcessor.invalidNumberPrompt(nm);
        return false;
      }

      if (n < ImageProcessor.MIN_PERCENT || n > ImageProcessor.MAX_PERCENT) {
        ImageProcessor.numberOutOfRange(nm, ImageProcessor.MAX_PERCENT,
                                        ImageProcessor.MAX_PERCENT);
        if (n < ImageProcessor.MIN_PERCENT) {
          obj.text = ImageProcessor.MIN_PERCENT;
        }
        if (n > ImageProcessor.MAX_PERCENT) {
          obj.text = ImageProcessor.MAX_PERCENT;
        }
        return false;
      }

      return true;
    }

    var baseUnit = new UnitValue(1/pnl.resolutionToInches(), "in");

    var n = ImageProcessor.getNumber(txt, units, nm,
                                     ImageProcessor.MIN_PIXELS,
                                     ImageProcessor.MAX_PIXELS,
                                     baseUnit);
    
    if (typeof n == "number") {
      obj.text = n;
      pnl.widthPX = ImageProcessor.unitsToUnits(n, units, "px",
                                                pnl.resolutionToInches(),
                                                undefined);
      return true;
    }

    return false;
  }

  yy += deltaY;
  xx = xofs;

  // Height
  pnl.resizeHeightLabel = pnl.add('statictext',
                                 [xx,yy+tOfs,xx+col1,yy+tOfs+23],
                                  ZStrings.HeightLbl);
  xx += col1;
  pnl.resizeHeight = pnl.add('edittext', [xx,yy,xx+50,yy+20], 1024);
  var h = toNumber(opts.height) || '';
  pnl._height = h;
  pnl.resizeHeight.text = h;
  xx += 55;
  pnl.resizeHeightUnits = pnl.add('dropdownlist',
                                  [xx,yy,xx+menuWidth,yy+22], units);

  psxui.setMenuSelection(pnl.resizeHeightUnits,
                         opts.resizeHeightUnits || '', 0);

  pnl.resizeHeight.onChange = function() {
    var pnl = this.parent;
    var obj = this;
    var txt = obj.text;
    var units = pnl.resizeHeightUnits.selection.text;

    if (!txt) {
      return undefined;
    }

    var nm = "Resize Height";

    if (units == "percent") {
      var n = toNumber(txt);

      if (isNaN(n)) {
        ImageProcessor.invalidNumberPrompt(nm);
        return false;
      }

      if (n < ImageProcessor.MIN_PERCENT || n > ImageProcessor.MAX_PERCENT) {
        ImageProcessor.numberOutOfRange(nm, ImageProcessor.MAX_PERCENT, ImageProcessor.MAX_PERCENT);
        if (n < ImageProcessor.MIN_PERCENT) {
          obj.text = ImageProcessor.MIN_PERCENT;
        }
        if (n > ImageProcessor.MAX_PERCENT) {
          obj.text = ImageProcessor.MAX_PERCENT;
        }
        return false;
      }

      return true;
    }

    var baseUnit = new UnitValue(1/pnl.resolutionToInches(), "in");

    var n = ImageProcessor.getNumber(txt, units, nm,
                                     ImageProcessor.MIN_PIXELS,
                                     ImageProcessor.MAX_PIXELS,
                                     baseUnit);

    if (typeof n == "number") {
      obj.text = n;
      pnl.heightPX = ImageProcessor.unitsToUnits(n, units, "px",
                                                 pnl.resolutionToInches(),
                                                 undefined);
      return true;
    }

    return false;
  }

  yy += deltaY;
  xx = xofs;

  pnl.resizeWidthUnits.onChange = function() {
    try {
      var pnl = this.parent;
      var last = pnl._lastUnits || this.selection;
      var val = pnl.resizeWidth.text;
      var sel = this.selection.text;

      if (val && last != this.selection) {
        if (sel == "percent") {
          pnl.resizeWidth.text = "100";

        } else {
          val = toNumber(val);
          var newVal;

          if (pnl.widthPX != undefined) {
            newVal = ImageProcessor.pixelsToUnits(pnl.widthPX,
                                                  sel,
                                                  pnl.resolutionToInches(),
                                                  undefined);
          } else {
            newVal = ImageProcessor.unitsToUnits(val, last.text,
                                                 sel,
                                                 pnl.resolutionToInches(),
                                                 undefined);
          }

          newVal = Math.floor(Math.round(newVal * 100))/100;
          pnl.resizeWidth.text = newVal;
        }
      }

      if (pnl.resizeHeightUnits.selection.text != sel) {
        var f = pnl.resizeWidthUnits.onChange;
        psxui.setMenuSelection(pnl.resizeHeightUnits, sel);
        pnl.resizeWidthUnits.onChange = f;
      }

      pnl._lastUnits = this.selection;

    } catch (e) {
      alert(psx.exceptionMessage(e));
    }
  }

  pnl.resizeHeightUnits.onChange = function() {
    try {
      var pnl = this.parent;
      var last = pnl._lastUnits || this.selection;
      var val = pnl.resizeHeight.text;
      var sel = this.selection.text;

      if (val && last != this.selection) {
        if (sel == "percent") {
          pnl.resizeHeight.text = "100";

        } else {
          val = toNumber(val);
          var newVal;

          if (pnl.heightPX != undefined) {
            newVal = ImageProcessor.pixelsToUnits(pnl.heightPX,
                                                  sel,
                                                  pnl.resolutionToInches(),
                                                  undefined);
          } else {
            newVal = ImageProcessor.unitsToUnits(val, last.text,
                                                 sel,
                                                 pnl.resolutionToInches(),
                                                 undefined);
          }

          newVal = Math.floor(Math.round(newVal * 100))/100;
          pnl.resizeHeight.text = newVal;
        }
      }

      if (pnl.resizeWidthUnits.selection.text != sel) {
        var f = pnl.resizeHeightUnits.onChange;
        psxui.setMenuSelection(pnl.resizeWidthUnits, sel);
        pnl.resizeHeightUnits.onChange = f;
      }

      pnl._lastUnits = this.selection;

    } catch (e) {
      alert(psx.exceptionMessage(e));
    }
  }

  // Resolution
  pnl.resolutionLabel = pnl.add('statictext',
                                [xx,yy+tOfs,xx+col1,yy+tOfs+23],
                                ZStrings.ResolutionLbl);
  xx += col1;
  pnl.resolution = pnl.add('edittext', [xx,yy,xx+50,yy+20], 1024);
  var h = toNumber(opts.resolution) || 72;
  pnl.resolution.text = h;
  xx += 55;
  pnl.resolutionUnits = pnl.add('dropdownlist',
                               [xx,yy,xx+menuWidth,yy+22], resUnits);


  psxui.setMenuSelection(pnl.resolutionUnits, opts.resolutionUnits || '', 0);

  pnl.resizeWidth.onChanging = pnl.resizeHeight.onChanging =
      pnl.resolution.onChanging = function() {
    var pnl = this.parent;
    psxui.numberKeystrokeFilter.call(this);
  }

  pnl.resolution.onChange = function() {
    var pnl = this.parent;
    var obj = this;
    var txt = obj.text;
    var units = (pnl.resolutionUnits.selection.text == ResizePanel.PPI ?
                 "in" : "cm");
    var nm = "Resolution";

    if (!txt) {
      return undefined;
    }

    var n = toNumber(txt);
    if (isNaN(n)) {
      ImageProcessor.invalidNumberPrompt(nm);
      return false;
    }

    var min = ((units == "in") ? 
               ImageProcessor.MIN_RES_INCHES :ImageProcessor.MIN_RES_CM);
    var max = ((units == "in") ? 
               ImageProcessor.MAX_RES_INCHES :ImageProcessor.MAX_RES_CM);

    if (n < min || n > max) {
      ImageProcessor.numberOutOfRange(nm, min, max);
      n = (n < min) ? min : max;
      obj.text = n;
      return false;
    }

    return true;
  }

  pnl.resolutionUnits.onChange = function() {
    var pnl = this.parent;
    if (pnl.resolution.text) {
      var txt = pnl.resolutionUnits.selection.text;
      var val = toNumber(pnl.resolution.text);
      if (txt == ResizePanel.PPI) {
        val *= 2.54;
      } else {
        val /= 2.54;
      }
      pnl.resolution.text = val;
    }
  }
  pnl.resolutionToInches = function() {
    var pnl = this;
    var rez = undefined;
    if (pnl.resolution.text) {
      var txt = pnl.resolutionUnits.selection.text;
      var rez = toNumber(pnl.resolution.text);
      if (txt != ResizePanel.PPI) {
        rez = rez * 2.54;
      }
    }
    return rez;
  }

  yy += deltaY;
  xx = xofs + col1;


  // Scale
  pnl.resizeScale = pnl.add('checkbox', [xx,yy,xx+180,yy+23],
                            ZStrings.ScaleStyles);
  pnl.resizeScale.value = toBoolean(opts.scale);

  yy += deltaY;
  xx = xofs + col1;

  var methods = ResizePanel.METHOD_LABELS;
  var rsm = opts.resampleMethod;

  pnl.resampleMethod = pnl.add('dropdownlist', [xx,yy,xx+150,yy+22], methods);

  var it = pnl.resampleMethod[0];
  var items = pnl.resampleMethod.items;
  for (var i = 0; i < items.length; i++) {
    if (rsm == items[i].text.toLowerCase()) {
      it = items[i];
      break;
    }
  }
  pnl.resampleMethod.selection = it;

  yy += deltaY;
  xx = xofs;

  pnl.updateSettings = function(ini) {
    var pnl = this;

    var opts = new ResizeOptions(ini, pnl.prefix);
    pnl.resizeEnabled.value = toBoolean(opts.enabled);

    pnl.resizeDontEnlarge.value = toBoolean(opts.dontEnlarge);

    psxui.setMenuSelection(pnl.resizeWidthUnits, opts.widthUnits || '', 0);
    psxui.setMenuSelection(pnl.resizeHeightUnits, opts.heightUnits || '', 0);

    var w = toNumber(opts.width) || '';
    pnl._width = w;
    pnl.resizeWidth.text = w;
    pnl.resizeWidth.onChange();
    
    var h = toNumber(opts.height) || '';
    pnl._height = h;
    pnl.resizeHeight.text = h;
    pnl.resizeHeight.onChange();

    psxui.setMenuSelection(pnl.resolutionUnits, opts.resolutionUnits || '', 0);
    pnl.resolution.text = toNumber(opts.resolution) || 72;

    pnl.resizeScale.value = toBoolean(opts.scale);

    var rsm = opts.resampleMethod;

    var it = pnl.resampleMethod[0];
    var items = pnl.resampleMethod.items;
    for (var i = 0; i < items.length; i++) {
      if (rsm == items[i].text.toLowerCase()) {
        it = items[i];
        break;
      }
    }
    pnl.resampleMethod.selection = it;
    pnl.resizeEnabled.onClick();
  }

  pnl.resizeEnabled.onClick();

  pnl.resizeWidth.text = toNumber(opts.width) || '';
  pnl.resizeWidth.onChange();
  pnl.resizeHeight.text = toNumber(opts.height) || '';
  pnl.resizeHeight.onChange();
  
  return pnl;
};

ImageProcessor.prototype.validateResizePanel = function(pnl, opts) {
  var self = this;

  var p = pnl.prefix;

  var st = pnl.resizeEnabled.value;
  opts[p + 'enabled'] = st;

  if (!st) {
    return opts;
  }

  var st = pnl.resizeDontEnlarge.value;
  opts[p + 'dontEnlarge'] = st;

  var w = 0;
  if (pnl.resizeWidth.text.trim() != '') {
    var n = toNumber(pnl.resizeWidth.text);
    if (isNaN(n) || n < 1) {
      return self.errorPrompt(ZStrings.WidthValueErr);
    }
    w = n;
  }
  opts[p + 'width'] = w;
  opts[p + 'widthUnits'] = pnl.resizeWidthUnits.selection.text;

  var h = 0;
  if (pnl.resizeHeight.text.trim() != '') {
    n = toNumber(pnl.resizeHeight.text);
    if (isNaN(n) || n < 1) {
      return self.errorPrompt(ZStrings.HeightValueErr);
    }
    h = n;
  }
  opts[p + 'height']  = h;
  opts[p + 'heightUnits'] = pnl.resizeHeightUnits.selection.text;

//   if (!h && !w) {
//     // return self.errorPrompt(ZStrings.WidthAndOrHeightErr);
//   } else {
//     if (!h) {
//       h = w;
//       opts[p + 'height']  = h;
//       opts[p + 'heightUnits'] = opts[p + 'widthUnits'] ;
//     } 
//     if (!w) {
//       w = h;
//       opts[p + 'width']  = w;
//       opts[p + 'widthUnits'] = opts[p + 'heightUnits'] ;
//     }
//   }

  var r = '';
  if (pnl.resolution.text.trim() != '') {
    n = toNumber(pnl.resolution.text);
    if (isNaN(n) || n < 1) {
      return self.errorPrompt(ZStrings.ResolutionErr);
    }
    r = n;
  }

  opts[p + 'resolution']  = r;
  opts[p + 'resolutionUnits'] = pnl.resolutionUnits.selection.text;


  opts[p + 'scale'] = pnl.resizeScale.value;

  var str = pnl.resampleMethod.selection.text;
  opts[p + 'resampleMethod'] = str.toLowerCase();

  return opts;
};

ResizePanel.refreshPanel = function(pnl, opts) {
  var self = this;

  if (opts.width) {
    pnl._width = toNumber(opts.width);
  }

  if (opts.height) {
    pnl.height = toNumber(opts.height);
  }

  pnl.resizeWidth.onChanging();
  pnl.resizeHeight.onChanging();
};

ResizePanel.strToResampleMethod = function(s) {
  s = s.toString();
  var str = s.replace(/(ResampleMethod\.)|(\s+)/, '').toLowerCase();
  var methods = ["bicubic", "bicubicsharper","bicubicsmoother",
    "none", "bilinear", "nearestneighbor"];

  if (methods.contains(str)) {
    return ResampleMethod[str.toUpperCase()];
  }

  return undefined;
};

ResizePanel.strFromResampleMethod = function(rsm) {
  var str = rsm.toString();

  return str.replace(/ResampleMethod\./, '').toLowerCase();
};
ResizePanel.typeIdFromResampleMethod = function(rsm) {
  var str = (rsm.constructor == String ?
             rsm.toLowerCase() : ResizePanel.strFromResampleMethod(rsm));

  if (str == 'bicubic') {
    return sTID(str);
  }
  if (str == 'bicubicsmoother') {
    return sTID('bicubicSmoother');
  }
  if (str == 'bicubicsharper') {
    return sTID('bicubicSharper');
  }
  if (str == 'none') {
    return sTID('none');
  }
  if (str == 'bilinear') {
    return sTID('bilinear');
  }
  if (str == 'nearestneighbor') {
    return sTID('nearestNeighbor');
  }

  return 0;
};

ImageProcessor.prototype.createPreferencesPanel = function(pnl) {
  var self = this;
  var lineH = UIC.lineH;

  pnl.img = pnl.add('image', [0, 0, 30, 30]);
  ImageProcessor.setIcon(pnl.img, "four.png");
  pnl.img.helpTip = ZStrings.PreferencesTip;

  pnl.lbl = pnl.add('statictext', [30, 8, 300, lineH], ZStrings.Preferences);
  pnl.lbl.helpTip = ZStrings.PreferencesTip;

  var xx = UIC.col1X;
  var yy = lineH;
  var width = 100;

  pnl.copyrightInfoLbl = pnl.add('statictext',
                                 [xx,yy+UIC.txtOfs,xx+width,yy+UIC.textH],
                                 ZStrings.CopyrightInfoLbl);
  pnl.copyrightInfoLbl.helTip = ZStrings.CopyrightInfoTip

  xx += width;
  pnl.copyrightInfo = pnl.add('edittext',
                              [xx,yy+3,xx+UIC.folderW*3,yy+UIC.textH],
                              "", { name: "copyrightInfo"});
  return pnl;
};


// User Interface Layout constants...
UIC = {
  lineH: 28,
  textH: 23,
  btnH: 25,
  margin: 15,
  sizeW: 40,
  folderW: 150,
  inputH: 85,
  outputH: 85,
  ctrlPnlW: 100,
  ctrlBtnW: 80,
  fileTypesH: 390,
  preferencesH: 60,
  col1X: 80,
  col1W: 150,
  col2W: 150,
  // col2X: col1X + col1W + gPad
  gPad: 7,
  txtOfs: 7
};
UIC._init = function() {
  UIC.col2X = UIC.col1X + UIC.col1W + UIC.gPad;
};
UIC._init();

ImageProcessor.prototype.createDialog = function() {
  var self = this;

  var win = new Window('dialog', ImageProcessor.VTITLE_UI,
                       [200, 200, 1040, 880]);

  win.center();

  win.mgr = self;
  win.processor = self;
  self.window = win;

  var margin = UIC.margin;
  var lmargin = margin;
  var rmargin = win.bounds.width-margin;
  var tmargin = margin;
  var bmargin = win.bounds.height-margin;

  var ptype = 'group'; //'panel'; // for layout debugging, set to panel

  var yy = margin;
  var xx = margin;

  var edgeR = rmargin - UIC.ctrlPnlW - margin;

  try {
  // Input panel
  win.inputPanel = win.add(ptype, [lmargin, yy, edgeR, yy+UIC.inputH]);
  if (!self.createInputPanel(win.inputPanel)) {
    Error.runtimeError(9005, "panel creation failure");
  }
  } catch (e) {
    LogFile.logException(e, "Failed creating Input panel", true);
    return undefined;
  }

  // divider
  yy += win.inputPanel.bounds.height + 5;
  win.add('panel', [xx, yy, edgeR, yy+2], undefined, { borderStyle: 'sunken'} );
  yy += 7;

  try {
  // Output Panel
  win.outputPanel = win.add(ptype, [lmargin, yy, edgeR, yy+UIC.outputH]);
  if (!self.createOutputPanel(win.outputPanel))  {
    Error.runtimeError(9005, "panel creation failure");
  }
  } catch (e) {
    LogFile.logException(e, "Failed creating Output panel", true);
    return undefined;
  }

  yy += win.outputPanel.bounds.height;

  try {
  // Control Panel
  win.ctrlPanel = win.add(ptype, [rmargin-UIC.ctrlPnlW, tmargin, rmargin, yy]);
  if (!self.createCtrlPanel(win.ctrlPanel)) {
    Error.runtimeError(9005, "panel creation failure");
  }
  } catch (e) {
    LogFile.logException(e, "Failed creating Control panel", true);
    return undefined;
  }

  // divider
  yy += 5;
  win.add('panel', [xx, yy, rmargin, yy+2], undefined,
          { borderStyle: 'sunken'} );
  yy += 7;

  try {
  // File Types Panel
  win.fileTypesPanel = win.add(ptype,
                               [lmargin, yy, rmargin, yy+UIC.fileTypesH]);
  if (!self.createFileTypesPanel(win.fileTypesPanel))  {
    Error.runtimeError(9005, "panel creation failure");
  }
  } catch (e) {
    LogFile.logException(e, "Failed creating File Types panel", true);
    return undefined;
  }

  // divider
  yy += win.fileTypesPanel.bounds.height + 5;
  win.add('panel', [xx, yy, rmargin, yy+2], undefined,
          { borderStyle: 'sunken'} );
  yy += 7;

  try {
  // PreferencesPanel
  win.preferencesPanel = win.add(ptype,
                                 [lmargin, yy, rmargin, yy+UIC.preferencesH]);
  if (!self.createPreferencesPanel(win.preferencesPanel))  {
    Error.runtimeError(9005, "panel creation failure");
  }
  } catch (e) {
    LogFile.logException(e, "Failed creating Preferences panel", true);
    return undefined;
  }

  return win;
};

//
// read settings from the UI
//
ImageProcessor.prototype.readSettings = function() {
  var self = this;
  var settings = ImageProcessorOptions.DEFAULT_XML.copy();

  settings.input = self.readInputSettings();
  settings.output = self.readOutputSettings();
  settings.taskList = self.readFileTypeSettings();
  settings.preferences = self.readPreferencesSettings();

  return settings;
};

//
// write settings to the UI
//
ImageProcessor.prototype.writeSettings = function(settings) {
  var self = this;

  self.settings = settings;

  self.writeInputSettings(settings.input);
  self.writeOutputSettings(settings.output);
  self.writeFileTypeSettings(settings.taskList);
  self.writePreferencesSettings(settings.preferences);
};


// Input Settings
ImageProcessor.prototype.readInputSettings = function() {
  var self = this;
  var widgets = ImageProcessor.findWidgets(self.window.inputPanel);
  var settings = new XML("<input/>");

  if (self.runningFromBridge) {
    settings.@source = "bridge";

  } else if (widgets.useOpenImages.value) {
    settings.@source = "openImages";

  } else {
    settings.@source = "folder";
    settings.@includeSubFolders = widgets.includeSubFolders.value;

    var fileStr = widgets.source.text;

    if (fileStr == ZStrings.NoImagesSelected) {
      settings.@path = '';

    } else {
      var folder = Folder(fileStr);
      if (folder.exists) {
        settings.@path = decodeURI(folder.fsName);
      } else {
        settings.@path = fileStr;
      }
    }
  } 

  return settings;
};

ImageProcessor.prototype.writeInputSettings = function(settings) {
  var self = this;
  var widgets = ImageProcessor.findWidgets(self.window.inputPanel);

  var src = settings.@source.toString();
  widgets.useOpenImages.value = (src == "openImages");

  widgets.useFolder.value = !widgets.useOpenImages.value;

  widgets.includeSubFolders.value = toBoolean(settings.@includeSubFolders);

  // if no path information is available, then NoFolderSelected
  var def = ZStrings.NoImagesSelected;

  // check for path in the settings
  var path;
  if (settings.@path.toString().length != 0) {
    path = Folder(settings.@path.toString()).toUIString();
  } else {
    path = settings.@path.toString();
  }

  // the lastFolder has either been set, or is in the prefs,
  // or is the path in the settings if available
  var lastFolder = (self.lastInputFolder ||
                    self.settings.uiPrefs.lastInputFolder.toString() ||
                    path || '');

  if (lastFolder) {
    // make sure we save the last folder for the .xml file
    self.lastInputFolder = psx.convertFptr(lastFolder);
    def = self.lastInputFolder.toUIString();

    // if there wasn't a path in the settings but there was a
    // last folder, use it
    if (!path) {
      path = def;
    }
  }

  widgets.source.text = path || def;

  if (app.documents.length == 0) {
    widgets.useOpenImages.enabled = false;
    widgets.useFolder.value = true;
  }

  widgets.useOpenImages.onClick();
};


// Output Settings
ImageProcessor.prototype.readOutputSettings = function() {
  var self = this;
  var doc;

  var widgets = ImageProcessor.findWidgets(self.window.outputPanel);
  var settings = new XML("<output/>");

  if (widgets.sameLocation.value) {
    settings.@path = "same";

  } else {
    var fileStr = widgets.dest.text;
    if (fileStr == ZStrings.NoFolderSelected) {
      settings.@path = '';

    } else {
      var file = File(fileStr);
      if (file.exists) {
        settings.@path = decodeURI(file.fsName);
      } else {
        settings.@path = fileStr;
      }
    }
  }

  settings.@subfolder = widgets.createSubFolder.value;
  settings.@keepStructure = widgets.keepFolderStructure.value;

  return settings;
};

ImageProcessor.prototype.writeOutputSettings = function(settings) {
  var self = this;
  var widgets = ImageProcessor.findWidgets(self.window.outputPanel);

  // if no path information is available, then NoFolderSelected
  var def = ZStrings.NoFolderSelected;

  // check for path in the settings
  var path = Folder(settings.@path.toString()).toUIString();

  // the lastFolder has either been set, or is in the prefs,
  // or is the path in the settings if available
  var lastFolder = (self.lastOutputFolder ||
                    self.settings.uiPrefs.lastOutputFolder.toString() || 
                    ((path && settings.@path.toString() != "same") ? path : ''));

  if (lastFolder) {
    // make sure we save the last folder for the .xml file
    self.lastOutputFolder = psx.convertFptr(lastFolder);
    def = self.lastOutputFolder.toUIString();

    // if there wasn't a path in the settings but there was a
    // last folder, use it
    if (!path) {
      path = def;
    }
  }

  // if the path is really a path, use it
  widgets.dest.text = (settings.@path.toString() != "same") ? path : def;

  widgets.sameLocation.value = (settings.@path.toString() == "same");

  widgets.useFolder.value = !widgets.sameLocation.value;

  widgets.createSubFolder.value = toBoolean(settings.@subfolder);
  widgets.keepFolderStructure.value = toBoolean(settings.@keepStructure);

  widgets.useFolder.onClick();
};

// File Type Settings
ImageProcessor.prototype.readFileTypeSettings = function() {
  var self = this;
  var settings = new XML("<taskList/>");

  var tabs = self.tabPanel.children;
  for (var i = 0; i < tabs.length; i++) {
    var tab = tabs[i];
    var xml = self.readTaskSettings(tab);
    settings.appendChild(xml);
  }

  return settings;
};

ImageProcessor.prototype.writeFileTypeSettings = function(settings) {
  var self = this;
  var subs = self.tabPanel;

  while (subs.children.length > 0) {
    subs.remove(0);
  }

  var tasks = settings.task;
  var len = tasks.length();
  if (len > 0) {
    for (var i = 0; i < len; i++) {
      var task = tasks[i];
      try {
        if (!self.createFileTypeTab("jpg")) {
          Error.runtimeError(9005, "Failed creating FileType tab");
        }
      } catch (e) {
        Error.runtimeError(9005, "Failed creating FileType tab: " +
                           psx.exceptionMessage(e));
      }
      self.writeTaskSettings(self.tabPanel.children[i], task);
    }
  } else {
    try {
      if (!self.createFileTypeTab("jpg")) {
        Error.runtimeError(9005, "Failed creating FileType tab");
      }
    } catch (e) {
      Error.runtimeError(9005, "Failed creating FileType tab: " +
                         psx.exceptionMessage(e));
    }
  }

  self.window.fileTypesPanel.updateState();
};

// Task Settings
ImageProcessor.prototype.readTaskSettings = function(tab) {
  var self = this;
  var settings = new XML("<task/>");
  var widgets = ImageProcessor.findWidgets(tab);

  settings.@enabled = widgets.isEnabled.value;
  settings.@subfolderName = widgets.subfolderName.text;
  settings.@colorProfile = widgets.colorProfile.selection.text;

  if (widgets.bitDepthEnabled.enabled && widgets.bitDepthEnabled.value) {
    if (widgets.bitDepth.enabled) {
      settings.@bitDepth = toNumber(widgets.bitDepth.selection.text);
    }
  }

  var ini = {};
  self.validateFileSavePanel(widgets.fileSavePanel, ini);

  var saveOpts = <saveOptions/>;
  for (var idx in ini) {
    if (!idx.startsWith('_')) {
      eval('saveOpts.@' + idx + '= "' + ini[idx] + '"');
    } else {
      self[idx] = ini[idx];
    }
  }

  settings.saveOptions = saveOpts;

  var ini = {};
  self.validateResizePanel(widgets.resizePanel, ini);

  var resizeOptions = <resizeOptions/>;
  for (var idx in ini) {
    if (!idx.startsWith('_')) {
      eval('resizeOptions.@' + idx + '= "' + ini[idx] + '"');
    } else {
      self[idx] = ini[idx];
    }
  }

  settings.resizeOptions = resizeOptions;

  var action = <action/>;
  action.@enabled = widgets.runAction.value;
  action.@when = widgets.runActionWhen.selection.text;
  action.@set = widgets.actionSets.selection.text;
  action.@name = widgets.actions.selection.text;

  settings.action = action;

  var opts = widgets.fileNamingPanel.getFileNamingOptions();

  settings.namingOptions = opts.fileNaming.toString();
  settings.namingOptions.@startingSerial = opts.startingSerial;

  return settings;
};

ImageProcessor.prototype.writeTaskSettings = function(tab, settings) {
  var self = this;
  var widgets = ImageProcessor.findWidgets(tab);

  widgets.isEnabled.value = toBoolean(settings.@enabled);
  widgets.subfolderName.text = settings.@subfolderName.toString();
  widgets.subfolderName.onChanging();

  var profile = settings.@colorProfile.toString();
  if (!profile) {
    widgets.colorProfile.items[1].selected = true;
  } else {
    var it = (widgets.colorProfile.find(profile) ||
              widgets.colorProfile.items[1]);
    it.selected = true;
  }

  var bpc = settings.@bitDepth.toString();
  if (bpc != "") {
    var it = widgets.bitDepth.find(bpc) || widgets.bitDepth.items[0];
    it.selected = true;
    tab.setBitDepthState(true);
    widgets.bitDepthEnabled.value = true;
  } else {
    tab.setBitDepthState(false);
  }
  widgets.bitDepthEnabled.onClick();

  // save options
  var ini = ImageProcessor.attrsToIni(settings.saveOptions);
  widgets.fileSavePanel.updateSettings(ini);


  // resize options
  var ini = ImageProcessor.attrsToIni(settings.resizeOptions);
  widgets.resizePanel.updateSettings(ini);

  // action settings
  var action = settings.action;
  widgets.runAction.value = toBoolean(action.@enabled);

  psxui.setMenuSelection(widgets.runActionWhen, action.@when, 0);
  psxui.setMenuSelection(widgets.actionSets, action.@set, 0);
  psxui.setMenuSelection(widgets.actions, action.@name, 0);

  // naming options
  var str = settings.namingOptions.toString() || "Name,lowerCaseExtension";
  var ini = { fileNaming: str };
  ini.startingSerial = settings.namingOptions.@startingSerial.toString() || "1";

  widgets.fileNamingPanel.updateSettings(ini);

  widgets.fileSavePanel.onChange();
  widgets.runAction.onClick();
};


// Preferences Settings
ImageProcessor.prototype.readPreferencesSettings = function() {
  var self = this;
  var widgets = ImageProcessor.findWidgets(self.window.preferencesPanel);
  var settings = new XML("<preferences/>");

  if (widgets.copyrightInfo.text) {
    settings.copyrightInfo = widgets.copyrightInfo.text;
  }

  return settings;
};

ImageProcessor.prototype.writePreferencesSettings = function(settings) {
  var self = this;
  var widgets = ImageProcessor.findWidgets(self.window.preferencesPanel);

  if (settings.copyrightInfo != undefined) {
    widgets.copyrightInfo.text = settings.copyrightInfo.toString();
  } else {
    widgets.copyrightInfo.text = '';
  }
};


// Find Widgets
ImageProcessor.isContainer = function(o) {
  return (o.type == 'dialog' || o.type == 'group'
          || o.type == 'panel' || o.type == 'tab');
};

ImageProcessor.findWidgets = function(c, o, recurse) {
  if (o == undefined) {
    o = {};
  }
  if (ImageProcessor.isContainer(c)) {
    if (recurse == undefined) {
      recurse = true;
    }

    var children = c.children;

    if (children == undefined || children.length == 0) {
      return;
    }

    var len = children.length;
    
    for (var i = 0; i < len; i++) {
      var p = children[i];
      if (p == undefined) {
        continue;
      }
      
      if (ImageProcessor.isContainer(p) && recurse == true) {
        ImageProcessor.findWidgets(p, o, recurse);
      }
      
      if (p.properties != undefined && p.properties.name != undefined) {
        o[p.properties.name] = p;
      }
    }
  }

  return o;
};
  
ImageProcessor.prototype.findAllWidgets = function() {
  var self = this;

  self.widgets = {};
  self.fileTypeWidgets = [];

  var w = self.window;
  ImageProcessor.findWidgets(w.inputPanel, self.widgets, false);
  ImageProcessor.findWidgets(w.outputPanel, self.widgets, false);
  ImageProcessor.findWidgets(w.preferencesPanel, self.widgets, false);
  
  var ftPanels = self.tabPanel.children;

  for (var i = 0; i < ftPanels.length; i++) {
    var pnl = ftPanels[i];
    var obj = {};
    ImageProcessor.findWidgets(pnl, obj, true);
    self.fileTypeWidgets.push(obj);
  }
};


ImageProcessor.prototype.getFiles = function(input) {
  var self = this;
  var src = input.@source.toString().toLowerCase();
  var files = [];

  if (src == "openimages") {
    var unsavedDocs = [];

    for (var i = 0; i < app.documents.length; i++) {
      var doc = app.documents[i];
      try {
        var temp = doc.fullName;
        files.push(doc);

      } catch (e) {
        if (e.number == 8103) {
          unsavedDocs.push(doc.name);
        } else {
          throw e;
        }
      }
    }

    if (unsavedDocs.length > 0) {
      alert(ZStrings.MustSaveOpen + "\r" + ZStrings.FollowingNotSaved +
            "\r( " + unsavedDocs.join(", ") + " )" );
    }

  } else if (src == "folder") {
    var recurse = toBoolean(input.@includeSubFolders);
    var folder = Folder(input.@path.toString());

    if (folder.exists) {
      if (recurse) {
        files = psx.findFiles(folder);
      } else {
        files = psx.getFiles(folder);
      }
    } else {
      alert(ZStrings.NoSourceFolder);
      files = [];
    }


  } else if (src == "bridge") {
    files = ImageProcessor.getImageFilesFromBridge();
  }

  return files;
};

ImageProcessor.prototype.openDocument = function(file) {
  var self = this;
  var settings = self.settings;
  var mode = DialogModes.NO;
  var ext = file.strf("%e").toLowerCase();
  var isRaw = ImageProcessor.CAMERA_RAW_FILES.contains(ext);


  if (isRaw) {
  }

  var currentDoc = (app.documents.length > 0) ? app.activeDocument : undefined;

  var desc = new ActionDescriptor();
  desc.putPath(cTID('null'), file);
 
  // Uncommment the following line to open the file as a SmartObject...
  // desc.putBoolean( stringIDToTypeID( "smartObject" ), true );

  var rdesc = executeAction(cTID('Opn '), desc, mode);

  // we could also check rdesc...
  if (app.documents.length == 0 || app.activeDocument == currentDoc) {
    Error.runtimeError(9002, ZStrings.UnableToOpenErr);
  }

  var doc = app.activeDocument;

//   if (rdesc.hasKey(cTID('As  '))) {
//     if (rdesc.hasKey(cTID('null'))) {
//       var path = rdesc.getPath(cTID('null'));
//     }
//   }

  $.gc();
  return doc;
};


ImageProcessor.prototype.saveDocument = function(doc, file, task) {
  var self = this;
  var sRGB = "sRGB IEC61966-2.1";
  var settings = self.settings;
  var input = settings.input;
  var output = settings.output;

  var historyState = doc.activeHistoryState;

  // Save Options
  var ini = ImageProcessor.attrsToIni(task.saveOptions);
  var saveOpts = FileSaveOptions.convert(ini);
  var ext = ini.fileSaveType;
  saveOpts._ext = ext;

  // Force a color profile if one is not present
  // XXX - This may only really be appropriate for jpgs
  if (doc.colorProfileType == ColorProfile.NONE) {
    try {
      doc.colorProfileName = sRGB;
    } catch (e) {
    }
  }

  // Pre-resize Action
  var action = task.action;
  if (toBoolean(action.@enabled) &&
      action.@when == ImageProcessor.BEFORE_IMAGE_RESIZE) {
    app.doAction(action.@name.toString(), action.@set.toString());
  }

  if (saveOpts.flattenImage) {
    // doc.flatten();
    try { psx.mergeAllLayers(doc); } catch (e) {}
  }

  if (saveOpts._flatten) {
    // doc.flatten();
    try { psx.mergeAllLayers(doc); } catch (e) {}
  }

  if (saveOpts._8Bit) {
    var bpc = doc.bitsPerChannel;
    if (bpc != BitsPerChannelType.ONE && bpc != BitsPerChannelType.EIGHT) {
      doc.bitsPerChannel = BitsPerChannelType.EIGHT;
    }
  }

  // Bit Depth
  var bd = toNumber(task.@bitDepth) || 0;
  if (bd) {
    var bpc = doc.bitsPerChannel;
    try {
      if (bd == 8) {
        doc.bitsPerChannel = BitsPerChannelType.EIGHT;
      } else if (bd == 16) {
        doc.bitsPerChannel = BitsPerChannelType.SIXTEEN;
      }
    } catch (e) { 
      LogFile.logException(e, "Error selecting bit depth " + bd);
    }
  }

  // remove alpha channels
  if (doc.mode != DocumentMode.MULTICHANNEL) {
    ImageProcessor.removeAlphaChannels(doc);
  }

  // convert profile
  var profile = task.@colorProfile.toString();
  if (profile != ImageProcessor.SAME_AS_SOURCE) {

    try {
      // doc.flatten();
      // try { psx.mergeAllLayers(doc); } catch (e) {}
      psx.convertProfile(doc, profile, false);

    } catch(e) {
      // $.level = 1; debugger;
      // do nothing, if you convert to "Working RGB" and working rgb
      // is the same as the current profile
      // you will get an error, this will catch the error and continue on
    }
  }

  // resize/fit image
  var resizeOptions = task.resizeOptions;

  if (toBoolean(saveOpts.@saveForWeb)) {
    resizeOptions.@resolution = 72;
    resizeOptions.@resolutionUnits = ResizePanel.PPI;
  }

  if (toBoolean(resizeOptions.@enabled)) {
    var res = toNumber(resizeOptions.@resolution);
    if (resizeOptions.@resolutionUnits != ResizePanel.PPI) {
      res *= 2.54;
    }
    if (res == 0 || isNaN(res)) {
      res = doc.resolution;
    }
    if (doc.resolution != res) {
      doc.resizeImage(undefined, undefined, res, ResampleMethod.NONE);
    }

    var width = toNumber(resizeOptions.@width);
    var height = toNumber(resizeOptions.@height);
//     if (width == 0 || isNaN(width)) {
//       width = height;
//     }
//     if (height == 0 || isNaN(height)) {
//       height = width;
//     }

    if (!width && !height) {
      // resolution change only
      // Error.runtimeError(9005, "Bad resize width and height values specified");
    } else {
      var ini = {};
      ini.width = ImageProcessor.unitsToPixels(width,
                                               resizeOptions.@widthUnits,
                                               res, doc.width.as('px'));
      ini.height = ImageProcessor.unitsToPixels(height,
                                                resizeOptions.@heightUnits,
                                                res, doc.height.as('px'));

      ini.resampleMethod = resizeOptions.@resampleMethod.toString();
      ini.scaleStyles = toBoolean(resizeOptions.@scale);
      ini.enabled = true;
      ini.dontEnlarge = toBoolean(resizeOptions.@dontEnlarge);
      
      ResizeOptions.resizeImage(doc, ini);
    }
  }

  // Post-resize Action
  if (toBoolean(action.@enabled) &&
      action.@when == ImageProcessor.AFTER_IMAGE_RESIZE) {
    app.doAction(action.@name.toString(), action.@set.toString());
  }

  if (saveOpts._convertToIndexed) {
//     LogFile.write("Converting to Indexed");

    if (doc.mode != DocumentMode.INDEXEDCOLOR) {
      if (doc.mode != DocumentMode.RGB) {
        doc.changeMode(ChangeMode.RGB);
      }

      var cnvtOpts = new IndexedConversionOptions();
      doc.changeMode(ChangeMode.INDEXEDCOLOR, cnvtOpts);
    }
  }

  if (ImageProcessorOptions.JDI) {
    if ((doc.mode == DocumentMode.MULTICHANNEL ||
         doc.mode == DocumentMode.DUOTONE) &&
        ext != "psd" && ext != "eps") {
      doc.changeMode(ChangeMode.RGB);      
    }
  }

  if (ImageProcessorOptions.JDI) {
    // This is for the common case of converting to jpg
    // files. Change the document mode to something that works.
    if (ext == "jpg") {
      if (doc.mode == DocumentMode.MULTICHANNEL) {
        doc.changeMode(ChangeMode.RGB);
      }

      if (doc.mode == DocumentMode.DUOTONE) {
        doc.changeMode(ChangeMode.RGB);
      }
      
      if (doc.mode == DocumentMode.INDEXEDCOLOR) {
        doc.changeMode(ChangeMode.RGB);
      }
      
      if (doc.mode == DocumentMode.BITMAP) {
        doc.changeMode(ChangeMode.GRAYSCALE);
      }
    }
  }

  // Determine the destination path
  var folderName;

  var openImages = (input.@source.toString().toLowerCase() == "openimages");
  var saveInSame = output.@path == "same";

  if (saveInSame) {
    folderName = file.parent.absoluteURI;
  } else {
    folderName = output.@path.toString();
  }

  if (toBoolean(output.@subfolder)) {
    folderName += '/' + task.@subfolderName.toString();
  }

  var isBridge = self.runningFromBridge;
  if (toBoolean(output.@keepStructure) &&
      !isBridge && !openImages && !saveInSame) {
    var fp = file.parent.absoluteURI;
    if (!toBoolean(output.@subfolder)) {
      folderName = fp.replace(File(input.@path.toString()).absoluteURI, 
                              File(output.@path.toString()).absoluteURI);
    } else {
       folderName += fp.replace(File(input.@path.toString()).absoluteURI,"");
    }
  }

  Folder(folderName).create();

  // Determine output filename
  var fnOpts = self.fnOpts[task];

  if (fnOpts == undefined) {
    var fn = task.namingOptions.toString();
    var ini = {fileNaming: fn};
    ini.startingSerial = toNumber(task.namingOptions.@startingSerial);
    fnOpts = new FileNamingOptions(ini);
    self.fnOpts[task] = fnOpts;

  } else {
    if (fnOpts._serial) {
      fnOpts.startingSerial = fnOpts._serial;
    }
  }

  if (file.strf("%e").length > 0)
    var fname = file.strf("%d/%f.") + ext;
  else
    var fname = file.strf("%d/%f");

  // Should this be the file-created or the file-modified date???
  var cdate = (file.exists ? file.created : new Date());
  var nm = fnOpts.format(File(fname), cdate);

  // if we want to retain the original case of the file extension
  if (ImageProcessorOptions.RETAIN_EXTENSION_CASE) {
    var f = File(nm);
    var originalExt = file.strf("%e");

    // this is only applicable when the source and target
    // file types are the same
    if (originalExt.toLowerCase() == f.strf("%e".toLowerCase())) {
      nm = f.strf("%f.") + originalExt;
    }
  }
  
  var outfile = File(folderName + '/' + nm);

  LogFile.write("saving " + file.toUIString() + " as " + outfile.toUIString());

  var extType = undefined;
  if (nm.match(/\.[A-Z]+$/)) {
    extType = Extension.UPPERCASE;

  } else if (nm.match(/\.[a-z]+$/)) { 
    extType = Extension.LOWERCASE;
  }

  outfile = ImageProcessor.createUniqueFileName(outfile, saveOpts._saveForWeb);

  // Save file
  if (saveOpts._saveForWeb) {
    self.saveForWeb(doc, outfile, saveOpts);

  } else {
    doc.saveAs(outfile, saveOpts, true, extType);

    if (extType == undefined && ImageProcessorOptions.RETAIN_EXTENSION_CASE) {
      // PS appears to default to lowercase extensions regardles of
      // case in the file name. If we want to retain the case, we have
      // to do a little more work...
      if (!outfile.exists) {
        var check = File(outfile.strf("%d/%f.") +
                         outfile.strf("%e").toLowerCase());
        if (check.exists) {
          check.rename(outfile.name);
        }
      }
    }

  }

  doc.activeHistoryState = historyState;
};


ImageProcessor.prototype.saveForWeb = function(doc, outfile, saveOpts) {
  var self = this;
  var settings = self.settings;
  var ext = outfile.strf("%e").toLowerCase();

  var fPNG = "PN24";
  var fGIF = "GIFf";
  var fJPG = "JPEG";

  if (outfile.exists) {
    outfile.remove();
  }

  // this code was largely copied from the old script
  // added png support and fixing passive file renames

  // now we handle gif, jpg, and png

  if (ext == '') {
    ext = saveOpts._ext || "jpg";
  }

  var inFormat = undefined;
  if (ext == "jpg") {
    inFormat = fJPG;
  } else if (ext == "gif") {
    inFormat = fGIF;
  } else if (ext == "png") {
    inFormat = fPNG;
  } else {
    Error.runtimeError(9002, "Cannot Save " + ext + " for Web");
  }

  try {
    var desc24 = new ActionDescriptor();
    var desc25 = new ActionDescriptor();
    desc25.putEnumerated(cTID("Op  "), cTID("SWOp"), cTID("OpSa"));
    desc25.putEnumerated(cTID("Fmt "), cTID("IRFm"), cTID(inFormat));

    // false for JPEG
    if (inFormat == "JPEG") {
      desc25.putBoolean(cTID("Intr"), false);
    } else {
    }

    // don't convert to sRGB
    desc25.putEnumerated( cTID('SWch'), cTID('STch'), cTID('CHDc') );
  
    if (inFormat == fGIF) { // only for GIF
      var id133 = cTID("RedA" );
      var id134 = cTID("IRRd" );
      var id135 = cTID("Sltv" );
      desc25.putEnumerated(cTID("RedA"), cTID("IRRd"), cTID("Sltv"));
      desc25.putBoolean(cTID("RChT"), false );
      desc25.putBoolean(cTID("RChV"), false );
      desc25.putBoolean(cTID("AuRd"), false );
      desc25.putInteger(cTID("NCol"), toNumber(saveOpts.colors));
      desc25.putEnumerated(cTID("Dthr"), cTID("IRDt"), cTID("None"));
      desc25.putInteger(cTID("DthA"), 100 );
      desc25.putInteger(cTID("DChS"), 0 );
      desc25.putInteger(cTID("DCUI"), 0 );
      desc25.putBoolean(cTID("DChT"), false );
      desc25.putBoolean(cTID("DChV"), false );
      desc25.putInteger(cTID("WebS"), 0 );
      desc25.putEnumerated(cTID("TDth"), cTID("IRDt"), cTID("None"));
      desc25.putInteger(cTID("TDtA"), 100 );
      desc25.putInteger(cTID("Loss"), 0 );
      desc25.putInteger(cTID("LChS"), 0 );
      desc25.putInteger(cTID("LCUI"), 100 );
      desc25.putBoolean(cTID("LChT"), false );
      desc25.putBoolean(cTID("LChV"), false );

      desc25.putBoolean(cTID("Trns"), true );
      desc25.putBoolean(cTID("Intr"), saveOpts.interlaced);

    } else if (inFormat == fJPG) { // only for JPEG
      // we use the photoshop 0 to 12, this thing uses 0 to 100
      desc25.putInteger(cTID("Qlty"),
                        Math.round(toNumber(saveOpts.quality) / 12 * 100));
      desc25.putInteger(cTID("QChS"), 0 );
      desc25.putInteger(cTID("QCUI"), 0 );
      desc25.putBoolean(cTID("QChT"), false );
      desc25.putBoolean(cTID("QChV"), false );
      desc25.putBoolean(cTID("Optm"), true );
      desc25.putInteger(cTID("Pass"), 1 );
      desc25.putDouble(cTID("blur"), 0.000000 );
      desc25.putBoolean(cTID("EICC"), toBoolean(saveOpts.embedColorProfile));
      desc25.putBoolean(cTID("Intr"), false);

    } else if (inFormat == fPNG) { // only for PNG
      desc25.putBoolean(cTID("Trns"), true );
      desc25.putBoolean(cTID("Intr"), saveOpts.interlaced);

    } // end only for GIF, JPEG, PNG

    desc25.putBoolean(cTID("Mtt "), true);
    desc25.putInteger(cTID("MttR"), 255 );
    desc25.putInteger(cTID("MttG"), 255 );
    desc25.putInteger(cTID("MttB"), 255 );
    desc25.putBoolean(cTID("SHTM"), false );
    desc25.putBoolean(cTID("SImg"), true );
    desc25.putBoolean(cTID("SSSO"), false );
    var list3 = new ActionList();
    desc25.putList(cTID("SSLt"), list3 );
    desc25.putBoolean(cTID("DIDr"), false );
    desc25.putPath(cTID("In  "), outfile); // here goes the file name
    desc24.putObject(cTID("Usng"), sTID("SaveForWeb"), desc25);

    var odesc = executeAction(cTID("Expr"), desc24, DialogModes.NO);

    // In some situations, SfW munges the file name if there
    // is a potential character set issue.
    if (!outfile.exists) {
      if (odesc.count != 0) {
        var desc = odesc.getObjectValue(cTID("Usng"));
        var f = desc.getPath(cTID("In  "));
        f.rename(outfile.name);

      } else {
        Error.runtimeError(9001, "Unknown error with Save for Web");
      }
    }

//   } catch(e) {
//     LogFile.logException(e, "Save for Web problems", true);
  } finally {
  }
};

ImageProcessor.prototype.adjustDocument = function(doc) {
  var self = this;
  var settings = self.settings;
  var ci = settings.preferences.copyrightInfo;

  if (ci != undefined && ci.toString() != '') {
    doc.info.copyrightNotice = ci.toString();
    doc.info.copyrighted = CopyrightedType.COPYRIGHTEDWORK;
  }
};


ImageProcessor.prototype.processDocument = function(doc, file) {
  var self = this;
  var settings = self.settings;

  try {
    LogFile.write("Processing: " + doc.name);
  } catch (e) {
  }

  self.adjustDocument(doc);

  var taskList = settings.taskList;
  var len = taskList.task.length();

  var ok = true;

  for (var i = 0; i < len; i++) {
    var task = taskList.task[i];

    if (toBoolean(task.@enabled)) {
      try {
        self.saveDocument(doc, file, task);

      } catch (e) {
        if (e.number == 8007) {
          throw e;
        }
        LogFile.logException(e);
        ok = false;
      }
    }
  }

  return ok;
};

ImageProcessor.findOpenDocument = function(file) {
  function getDocumentName(idx) {
    var ref = new ActionReference();
    ref.putProperty(cTID('Prpr'), cTID('FilR'));
    ref.putIndex(cTID('Dcmn'), idx);
    var desc = executeActionGet(ref);
    return desc.hasKey(cTID('FilR')) ? desc.getPath(cTID('FilR')) : undefined;
  };

  var docs = app.documents;
  var fstr = file.absoluteURI;

  for (var i = 0; i < docs.length; i++) {
    var nm = getDocumentName(i+1);
    if (nm != undefined && nm.absoluteURI == fstr) {
      return docs[i];
    }
  }
  return undefined;
};

ImageProcessor.prototype.processFile = function(file) {
  var self = this;
  var settings = self.settings;
  var doc;

  if (file instanceof String) {
    file = File(file);
    if (!file.exists) {
      return false;
    }
  }

  if (file instanceof File) {
    if (file.hidden) {
      return false;
    }

    doc = ImageProcessor.findOpenDocument(file);

    if (doc) {
      app.activeDocument = doc;
      doc = app.activeDocument.duplicate();

    } else {
      doc = self.openDocument(file);
    }

    if (!doc) {
      return false;
    }

  } else if (file instanceof Document) {
    app.activeDocument = file;
    file = app.activeDocument.fullName;
    doc = app.activeDocument.duplicate();
  }

  try {
    if (!self.processDocument(doc, file)) {
      self.failedFiles.push(file);
    }
  } finally {
    doc.close(SaveOptions.DONOTSAVECHANGES);
  }
  
  return true;
};

ImageProcessor.prototype.process = function() {
  var self = this;
  var settings = self.settings;

  var input = settings.input;
  var files = self.getFiles(settings.input);
  var filesProcessed = 0;

  self.failedFiles = [];

  var tasks = settings.taskList.task;
  var len = tasks.length();
  var active = 0;

  for (var i = 0; i < len; i++) {
    var task = tasks[i];
    if (toBoolean(task.@enabled)) {
      active++;
    }
  }
  
  if (active == 0) {
    return;
  }


  function skipFile(f) {
    return !ImageProcessor.isValidImageFile(f) || f.hidden;
  }

  var userCancelled = false;

  for (var i = 0; i < files.length; i++) {
    var file = files[i];

    if (file instanceof Folder) {
      continue;
    }

    try {
      if (file.typename != "Document" && skipFile(file)) {
        continue;
      }

      var rc = self.processFile(file);

      if (rc) {
        filesProcessed++;
      }
    } catch (e) {
      if (e.number == 8007) {  // if User Cancelled Operation
        userCancelled = true;
        break;

      } else {
        LogFile.logException(e);
        self.failedFiles.push(file);
      }
    }
  }

  var failedFiles = self.failedFiles;

  if (filesProcessed == 0 && failedFiles.length == 0 && !userCancelled) {
    LogFile.write(ZStrings.NoFilesProcessed);
    alert(ZStrings.NoFilesProcessed);
  }

  if (failedFiles.length > 0) {
    var msg = ZStrings.CouldNotProcess;
    var len = Math.min(failedFiles.length, 25);

    for (var i = 0; i < len; i++) {
      var f = failedFiles[i];
      msg += "\r" + decodeURI(f.name);
    }
    if (failedFiles.length > 25) {
      msg += "...\r";
    }

    msg += "\r\r" + ZStrings.MoreInfo;
    msg += "\r" + File(ImageProcessor.LOG_FILE).toUIString();
    LogFile.write(msg);
    alert(msg);
  }
};


ImageProcessor.prototype.run = function() {
  var self = this;

  LogFile.write("ImageProcessor.run()");

  try {
    // sanity test of settings
    var xml = self.readSettings();
    
    if (xml.input.@source == "openImages" &&
       app.documents.length == 0) {
      alert(ZStrings.SelectSourceImagesTip);
      return;
    }

    if (xml.input.@source == "folder" &&
        xml.input.@path == '') {
      alert(ZStrings.SpecifySource);
      return;
    }

    if (xml.output.@path.toString() == '') {
      alert(ZStrings.SpecifyDest);
      return;
    }

    if (xml.input.@source == "folder") {
      var files = self.getFiles(xml.input);
      if (files.length == 0) {
        alert(ZStrings.NoFilesProcessed);
        return;
      }
    }
    
    var tasks = xml.taskList.task;
    var len = tasks.length();
    var active = 0;
    for (var i = 0; i < len; i++) {
      var task = tasks[i];
      if (toBoolean(task.@enabled)) {
        active++;
      }
    }

    if (active == 0) {
      alert(ZStrings.NoSaveSelected);
      return;
    }

  } catch (e) {
    LogFile.logException(e, ZStrings.SettingsFileErr + ": " + e.message, true);
    return;
  }

  // do validation of settings
 
  self.window.close(1);
};

ImageProcessor.prototype.cancel = function() {
  var self = this;

  LogFile.write("ImageProcessor.cancel()");
  self.window.close(2);
};

ImageProcessor.prototype.load = function() {
  var self = this;

  LogFile.write("ImageProcessor.load()");

  try {
    var def = (self.lastSettingsFile ?
               self.lastSettingsFile :
               ImageProcessorOptions.getUserOptionsFile());
    var file = psx.selectFileOpen(ZStrings.PickXMLFileLoad,
                                  ZStrings.XMLFileDlgPattern,
                                  def);
    if (file) {
      var xml = ImageProcessor.readSettingsFile(file);

      self.writeSettings(xml);

      self.lastSettingsFile = file;
    }

  } catch (e) {
    LogFile.logException(e, "load settings", true);
  } 
};

ImageProcessor.prototype.save = function() {
  var self = this;

  LogFile.write("ImageProcessor.save()");

  try {
    var def = (self.lastSettingsFile ?
               self.lastSettingsFile :
               ImageProcessorOptions.getUserOptionsFile());
    var file = psx.selectFileSave(ZStrings.PickXMLFileSave,
                                  ZStrings.XMLFileDlgPattern,
                                  def);
    
    if (file) {
      var xml = self.readSettings();
      xml.date = new Date().toISOString();
      xml.version = ImageProcessor.VERSION;
      xml.uiPrefs.lastSettingsFile = file.toUIString();
      psx.writeXMLFile(file, xml);

      self.lastSettingsFile = file;
    }
  
  } catch (e) {
    LogFile.logException(e, "save settings", true);
  }
};

ImageProcessor.prototype.reset = function() {
  var self = this;

  LogFile.write("ImageProcessor.reset()");

  try {
    if (confirm(ZStrings.ConfirmReset)) {
      var xml = ImageProcessorOptions.getDefaultOptions();

      self.writeSettings(xml);
    }

  } catch (e) {
    LogFile.logException(e, "reset settings", true);
  }
};

ImageProcessor.prototype.loadDefaultUserOptions = function() {
  var self = this;
  var xml = undefined;
  var xfile = ImageProcessorOptions.getUserOptionsFile();

  if (xfile.exists) {
    try {
      xml = ImageProcessor.readSettingsFile(xfile);
      self.writeSettings(xml);

    } catch (e) {
      LogFile.logException(e, "loadDefaultUserOptions", true);
    }

  } else {
    xml = ImageProcessorOptions.getDefaultOptions();
  }

  return xml;
};

ImageProcessor.prototype.saveDefaultUserOptions = function(xml) {
  var self = this;
  var xfile = ImageProcessorOptions.getUserOptionsFile();
  xml.date = new Date().toISOString(); 
  xml.version = ImageProcessor.VERSION;
  psx.writeXMLFile(xfile, xml);
};

///////////////////////////////////////////////////////////////////////////////
// Function: UnitsToPixels
// Usage: convert a number in the given units to pixels
// Input: value in the current units
//        units of the value to convert
//        resolution needed for certain conversions
//        docValue needed for certain conversions
// Return: value in pixels 
///////////////////////////////////////////////////////////////////////////////
ImageProcessor.unitsToPixels = function(value, units, resolution, docValue) {
  units = units.toString();
  var n = Number( value );
  if ( units.search( "inches" ) != -1 ) {
    n = value * resolution;
    return n;
  }
  if ( units.search( "cm" ) != -1 ) {
    n = value / 2.54 * resolution;
    return n;
  }
  if ( units.search( "mm" ) != -1 ) {
    n = value / 25.4 * resolution;
    return n;
  }
  if ( units.search( "points" ) != -1 ) {
    n = value * resolution / 72;
    return n;
  }
  if ( units.search( "picas" ) != -1 ) {
    n = value * resolution / 6;
    return n;
  }
  if ( ( units.search( "percent" ) != -1 ) && ( docValue != undefined ) ) {
    n = value * docValue / 100.0;
    return n;
  }
  return n;
};

///////////////////////////////////////////////////////////////////////////////
// Function: PixelsToUnits
// Usage: convert a value in pixels to the given units
// Input: value to convert in pixels
//        units to convert to
//        resolution to use for certain conversions
//        docValue to use for certain conversions
// Return: converted value in the given units
///////////////////////////////////////////////////////////////////////////////
ImageProcessor.pixelsToUnits = function(pixels, units, resolution, docValue) {
    var n = Number( pixels );
    if ( units.search( "inches" ) != -1 ) {
        n = pixels / resolution;
        return n;
    }
    if ( units.search( "cm" ) != -1 ) {
        n = pixels * 2.54 / resolution;
        return n;
    }
    if ( units.search( "mm" ) != -1 ) {
        n = pixels * 25.4 / resolution;
        return n;
    }
    if ( units.search( "points" ) != -1 ) {
        n = pixels / resolution * 72;
        return n;
    }
    if ( units.search( "picas" ) != -1 ) {
        n = pixels / resolution * 6;
        return n;
    }
    if ( ( units.search( "percent" ) != -1 ) && ( docValue != undefined ) ) {
        n = pixels / docValue * 100.0;
        return n;
    }
    return n;
}

///////////////////////////////////////////////////////////////////////////////
// Function: UnitsToUnits
// Usage: Convert from one unit to another unit
// Input: value to convert
//        fromUnits is the units the value is in
//        toUnits the units the return value is in
//        resolution to use for certain converstions
//        docValue to use for certain conversions
// Return: converted value in units given by toUnits
///////////////////////////////////////////////////////////////////////////////
ImageProcessor.unitsToUnits = function(value, fromUnits, toUnits, resolution, docValue) {
  var p = ImageProcessor.unitsToPixels(value, fromUnits, resolution, docValue);
  p = ImageProcessor.pixelsToUnits(p, toUnits, resolution, docValue);
  return p;
};

ImageProcessor.removeAlphaChannels = function(doc) {
  var channels = doc.channels;
  var channelCount = channels.length - 1;
  while (channels[channelCount].kind != ChannelType.COMPONENT) {
    channels[channelCount].remove();
    channelCount--;
  }
};

ImageProcessor.createUniqueFileName = function(file, sfw) {
  var fname = file.strf("%f");
  var dir = file.strf("%d");
  var ext = file.strf("%e");
  var chr = '_'; // (sfw ? '-' : '_');

  // First, clean out any problematic characters
  fname = fname.replace(/[:\/\\*\?\"\<\>\|]/g, chr);  // '/\:*?"<>|' -> '_'
  if (sfw) {
    fname = fname.replace(/\s/g, chr);
  }
  if (ext.length > 0)
    file = File(dir + '/' + fname + '.' + ext);
  else
    file = File(dir + '/' + fname);  

  if (!file.exists) {
    return file;
  }

  // There is a dupe. Make unique by adding _## to the basename

  var idx = 1;
  while (file.exists) {
    if (ext.length > 0)
      var newFname = "%s/%s_%02d.%s".sprintf(dir, fname, idx++, ext);
    else
      var newFname = "%s/%s_%02d".sprintf(dir, fname, idx++);
    file = File(newFname);
  }

  return file;
};


ImageProcessor.attrsToIni = function(xml) {
  var ini = {};
  var attrs = xml.attributes();
  var len = attrs.length();
  for (var i = 0; i < len; i++) {
    var attr = attrs[i];
    ini[attr.localName()] = attr.toString();
  }
  return ini;
}

ImageProcessor.isValidImageFile = function(f) {
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

  return (((File.fs == "Macintosh") && _macCheck(f)) ||
          ((File.fs == "Windows") && _winCheck(f)));
};

ImageProcessor.createShortFileName = function(fname) {
  var max = ImageProcessor.SHORT_FNAME_LEN;
  if (fname.length > max) {
    fname = "..." + fname.substr(fname.length - max + 3, max - 3 );
  }
  return fname;
};

ImageProcessor.getFilesFromBridge = function() {
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

ImageProcessor.getImageFilesFromBridge = function() {
	var list = ImageProcessor.getFilesFromBridge();
  var fileList = [];

  for (var i = 0; i < list.length; i++) {
    var file = list[i];
    if (psx.isValidImageFile(file)) {
      fileList.push(file);
    }
  }

  return fileList;
};



ImageProcessor.exec = function() {
	ImageProcessor.dialogMode = app.displayDialogs;
	app.displayDialogs = DialogModes.NO;

  try {
    // Version check...
    var v = toNumber(app.version.match(/^\d+/)[0]);
    if (v < ImageProcessor.REQUIRED_PS_VERSION) {
      alert(ZStrings.PSVersionError);
      return;
    }

    var mode = app.playbackDisplayDialogs;

    // if we are launched from the debugger OR we have no parameters
    // we need a UI
    if (mode == DialogModes.NO || app.playbackParameters.count == 0) {
      mode = DialogModes.ALL;
    }

    // only turn off the ui if we have parameters and are called from an action
    var opts = {};
    opts.headless = (app.playbackDisplayDialogs == DialogModes.ERROR);

    var obj = new ImageProcessor();

    // get bridge files/state

    if (app.playbackParameters.count > 0) {
      obj.runningFromBridge = false;
      obj.filesFromBridge = undefined;

      var desc = app.playbackParameters;
      if (desc.hasKey(sTID('ImageProcessorProSettings'))) {
        var str = desc.getString(sTID('ImageProcessorProSettings'));
        opts.settings = new XML(str);
        if (opts.settings.input.@source == "bridge") {
          obj.runningFromBridge = true;
          obj.filesFromBridge = ImageProcessor.getImageFilesFromBridge();
        }
      } else {
        opts.headless = false;
      }

      // see if we are called by automation framework
      if (app.playbackParameters.hasKey(ImageProcessor.kFilesList)) {
        obj.runningFromBridge = true;
        obj.filesFromBridge = [];
        
        var flist = app.playbackParameters.getList(ImageProcessor.kFilesList);
        for (var i = 0; i < flist.count; i++) {
          obj.filesFromBridge.push(flist.getPath(i));
        }
      }

    } else {
      opts.headless = false;
    }

    if (opts.headless) {
      obj.settings = opts.settings;
      obj.process();

    } else {
      app.bringToFront();

      var win = obj.createDialog();

      // There are times when ScriptUI/PS gets really confused.
      // if win == undefined, there means it is probably
      // completely hosed and restarting PS is the only thing
      // we can do. RPB has seen this and there has been at least
      // one user that has seen the problem. If we don't handle
      // it the way we have, PS will lock up completely and require
      // an external kill.
      if (win == undefined) {
        Error.runtimeError(9005,
                           "Failed to create Image Processor Pro dialog.\r\n" +
                           "Please restart Photoshop.");
      }

      obj.findAllWidgets();

      if (!opts.settings) {
        opts.settings = obj.loadDefaultUserOptions();
      }

      obj.writeSettings(opts.settings);

      win.title = ImageProcessor.VTITLE_UI;
      win.center();

      var uiPrefs = undefined;

      if (obj.settings != undefined) {
        uiPrefs = obj.settings.uiPrefs;
      }
      obj.uiPrefs = uiPrefs;

      if (uiPrefs != undefined) {
        if (uiPrefs.lastSettingsFile.toString()) {
          obj.lastSettingsFile = File(uiPrefs.lastSettingsFile);
        }

        if (uiPrefs.lastInputFolder.toString()) {
          obj.lastInputFolder = File(uiPrefs.lastInputFolder);
        }

        if (uiPrefs.lastOutputFolder.toString()) {
          obj.lastOutputFolder = File(uiPrefs.lastOutputFolder);
        }

        if (uiPrefs.lastX != undefined &&
            uiPrefs.lastY != undefined) {
          var x = toNumber(uiPrefs.lastX);
          if (!isNaN(x)) {
            var w = win.bounds.width;
            win.bounds.left = x;
            win.bounds.width = w;
          }

          var y = toNumber(uiPrefs.lastY);
          if (!isNaN(y)) {
            var h = win.bounds.height;
            win.bounds.top = y;
            win.bounds.height = h;
          }
        } else {
          win.center();
        }
      }

      var res = win.show();

      if (res == 1) {
        var xml = obj.readSettings();
        xml.uiPrefs.lastX = win.bounds.x;
        xml.uiPrefs.lastY = win.bounds.y;

        if (obj.lastSettingsFile) {
          if (obj.lastSettingsFile instanceof File) {
            xml.uiPrefs.lastSettingsFile = obj.lastSettingsFile.toUIString();
          } else {
            xml.uiPrefs.lastSettingsFile = obj.lastSettingsFile;
          }
        }

        if (obj.lastInputFolder) {
          if (obj.lastInputFolder instanceof Folder) {
            xml.uiPrefs.lastInputFolder = 
                obj.lastInputFolder.toUIString();
          } else {
            xml.uiPrefs.lastInputFolder = obj.lastInputFolder;
          }
        }

        if (obj.lastOutputFolder) {
          if (obj.lastOutputFolder instanceof Folder) {
            xml.uiPrefs.lastOutputFolder = 
                obj.lastOutputFolder.toUIString();
          } else {
            xml.uiPrefs.lastOutputFolder = obj.lastOutputFolder;
          }
        }

        obj.settings = xml;

        LogFile.write(xml.toXMLString());
        obj.saveDefaultUserOptions(xml);
        obj.process();

      } else {
        obj.settings = undefined;
      }
    }

    if (obj.settings) {
      var desc = new ActionDescriptor();
      desc.putString(sTID('ImageProcessorProSettings'),
                     obj.settings.toXMLString());
      desc.putString(cTID('Msge'), "Settings for Image Processor Pro");

      app.playbackParameters = desc;
    }

  } catch (e) {
    if (e.number != 8007) {  // if not User Cancelled Operation
      var msg = psx.exceptionMessage(e);
      LogFile.write(msg);

      if (confirm(ZStrings.Sorry)) {
        alert(msg);
      }
    }
  }

  app.displayDialogs = ImageProcessor.dialogMode;
};

ImageProcessor.globalInit();
try {
  ImageProcessor.exec();
} catch (e) {
}
ImageProcessor.globalCleanup();

"ImageProcessorNG.jsx";
// EOF

