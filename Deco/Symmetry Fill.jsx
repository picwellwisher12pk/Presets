///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Here are a few parameters that you can change to modify the behavior of the patterm
// Feel free to modify the values, don't change the variable names

// This variable defines the type of symmetry.:
//   Try   6, 7(*),16, 19, 21(*), 23, 26(*),  27, 29, 31(*), 32(**)
Initial.isymmetryType = 32 //  use an integer value between 0 and 32. The default is 32.
// Here is the list of supported symmetries
//     0: line reflection
//     1: point reflection, frameZero
//     2: rotation symmetry with 4 elements around the center
//     3: translation symmetry
//     4: glide reflection

//     5: dilatation symmetry
//     6: dilative rotation symmetry
//     7: a different dilative rotation  symmetry
//     8: infinite dilative rotation symmetry

// The Frieze tilings (1D tilings on an infinite line
//     9:  translation frieze
//   10: glide reflection frieze
//   11: translation line reflection freeze
//   12: translation mirror reflection freeze
//   13: translation point reflection freeze
//   14: translation double reflection freeze
//   15: glide reflection rotation freeze

// The Wallpaper tilings 2D tilings on an infinite plane
//   16: wallpaperP1 symmetry
//   17: wallpaperP2 symmetry
//   18: wallpaperPM symmetry
//   19: wallpaperPG symmetry
//   20: wallpaperPMM symmetry
//   21: wallpaperCM symmetry
//   22: wallpaperPMG symmetry
//   23: wallpaperPGG symmetry
//   24: wallpaperCMM symmetry
//   25: wallpaperP4 symmetry
//   26: wallpaperP4M symmetry
//   27: wallpaperP4G symmetry
//  28: wallpaperP3 symmetry
//  29: wallpaperP3M1 symmetry
//  30: wallpaperP31M symmetry
//  31: wallpaperP6 symmetry
//  32: wallpaperP6M symmetry

// Pattern translation.
// By modifying this value you will change the layout of the pattern.
// Try the following pairs of values: 0, 0 or 0, 0.75 or 0.75, 0
// Note that the behavior is different when your pattern is thin in x or y .
var patternTranslationX = 0.75   // The default is 0.75
var patternTranslationY = 0.75   // The default is 0.75

// Variation of color of the pattern. 
// For example, value of 0.2 means that each of the red, green, and blue color components
// will be multiplied by a DIFFERENT random value from interval 0.8 and 1. 
// Set to 0 if you do not want to modify the pattern color.
var colorRandomness = 0.2    // use a value between 0 and 1. The default is 0.2.

// Variation of pattern brightness. 
// For example, value of 0.6 means that each of the red, green, and blue color components
// will be multiplied by THE SAME random value from interval 0.4 and 1. 
// Set to 0 if you do not want to modify the pattern brightness.
var brightnessRandomness = 0.4   // use a value between 0 and 1. The default is 0.4.

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// You can modify the code below but keep in mind that as with any scripting
// you can break things. Keep a backup copy.
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// We could use Math.random but  then we do not have control over the seed

// Object rand
rand.seed = 1 

function rand()
{
    rand.seed = (rand.seed*9301+49297) % 233280;
	return rand.seed/(233280.0);
}

///////////////////////////////////////////////////////////////////////////

// get the size of the output area
var outputSize = RenderAPI.getParameter(kpsSize)
// get the location of the top left corner of the bounding rectangle around the selected area
var outputOrigin = RenderAPI.getParameter(kpsOrigin)


///////////////////////////////////////////////////////////////////////////

var pattern = RenderAPI.getParameter(kpsPattern)

var patternSize = pattern.getParameter(kpsSize)


function PatternModule() 
{
}



PatternModule.prototype.render = function (api) 
{
        api.pushMatrix()
        api.translateRel(patternSize.x * patternTranslationX, patternSize.y * patternTranslationY)   
        
        // Set the random seed based on the current position - this assures that the color will be modified
        // in the same way for the pattern in the neighboring selected area
        var currentFrame = api.getFrame()
        rand.seed = Math.floor(currentFrame.position().x + 100000) * 1237 + Math.floor(currentFrame.position().y + 100000) * 7654321
        //Engine.message ("rendering at position " + currentFrame.position().x + ", " + currentFrame.position().y)
 
        var rc = colorRandomness  // color randomness
        var br = 1 - brightnessRandomness + rand()*brightnessRandomness  // brightness
        RenderAPI.Color (kFillColor, br *(1 - rc + rand()*rc), br*(1 - rc + rand()*rc), br*(1 - rc + rand()*rc))
       pattern.render(api)
        api.popMatrix()
}




var patternModule = new PatternModule();

// Symmetry - module should be added to the system before modules that 
// are part of the symmetry
var symmetry = new Symmetry;

var frameZero = new Frame2();
var frameOrigin = new Frame2();
frameOrigin.setPosition(0, 0);
frameOrigin.rotateDeg(0.0);

//symmetry.frame = frameOrigin;  // no need to set the frame if it is a default frame at position (0,0) and no rotation

function Initial () {}
var initial = new Initial()


Initial.variableUpdated = function (varname)
{

	switch (Initial.isymmetryType)
	{
	case 0:
		symmetry.set(kSymmetryLineReflection, frameZero, kTransformToLocal);
		break;
	case 1:
		symmetry.set(kSymmetryPointReflection, frameZero, kTransformToLocal);
		break;
	case 2:
         // Type, number of elements around the center, frame specifying local position of an element, optional center of rotation (must be a point)
		symmetry.set(kSymmetryRotation, 4, frameZero);
		break;
	case 3:
		symmetry.set(kSymmetryTranslation, 4, 1.0, frameZero, kTransformToLocal);
		break;
	case 4:
		symmetry.set(kSymmetryGlideReflection, 5, 4.0, frameZero, kTransformToLocal);
		break;


		// Number, initial angle, angle increment, initial scale, scale ratio
	case 5:
		symmetry.set(kSymmetryDilatation, 600, 1.0, 1.0 / 1.01, frameZero, kTransformToLocal); 
		break;
	case 6:
		symmetry.set(kSymmetryDilativeRotation, 600, 0.0, kFibonacciAngleInDegrees, 1.0, 1.0 / 1.01, frameZero, kTransformToLocal); 
		break;
	case 7:
		symmetry.set(kSymmetryDilativeRotation, 200, 0.0, kFibonacciAngleInDegrees, 0.0333, 1.02, frameZero, kTransformToLocal); 
		break;
	case 8:
		symmetry.set(kSymmetryInfiniteDilativeRotation, 0.0, kFibonacciAngleInDegrees, 0.5, 1.01, frameZero, kTransformToLocal); 

	}

	var uStep = patternSize.y * 1.25;
	var vStep = patternSize.x * 1.25;

	// The Frieze tilings (1D tilings on an infinite line
	switch (Initial.isymmetryType)
	{
	case 9:
		symmetry.set(kSymmetryFriezeTranslation, Math.max(uStep, vStep), frameZero, kTransformToLocal);
		break;
	case 10:
		symmetry.set(kSymmetryFriezeGlideReflection, Math.max(uStep, vStep), frameZero, kTransformToLocal);
		break;
	case 11:
		symmetry.set(kSymmetryFriezeTranslationLineReflection, Math.max(uStep, vStep), frameZero, kTransformToLocal);
		break;
	case 12:
		symmetry.set(kSymmetryFriezeTranslationMirrorReflection, Math.max(uStep, vStep), frameZero, kTransformToLocal);
		break;
	case 13:
		symmetry.set(kSymmetryFriezeTranslationPointReflection, Math.max(uStep, vStep), frameZero, kTransformToLocal);
		break;
	case 14:
		symmetry.set(kSymmetryFriezeTranslationDoubleReflection, Math.max(uStep, vStep), frameZero, kTransformToLocal);
		break;
	case 15:
		symmetry.set(kSymmetryFriezeGlideReflectionRotation, Math.max(uStep, vStep), frameZero, kTransformToLocal);
		break;
	}

	uStep = uStep //* 2.5;
	vStep = vStep //* 2.5

	// The Wallpaper tilings 2D tilings on an infinite plane
	switch (Initial.isymmetryType)
	{
	case 16:
		symmetry.set(kSymmetryWallpaperP1, uStep, vStep, frameZero, kTransformToLocal);
		break;
	case 17:
		symmetry.set(kSymmetryWallpaperP2, uStep, vStep, frameZero, kTransformToLocal);
		break;
	case 18:
		symmetry.set(kSymmetryWallpaperPM, uStep, vStep, frameZero, kTransformToLocal);
		break;
	case 19:
		symmetry.set(kSymmetryWallpaperPG, uStep, vStep, frameZero, kTransformToLocal);
		break;
	}

	uStep = uStep * 1.5;
	vStep = vStep * 1.5;

	switch (Initial.isymmetryType)
	{
	case 20:
		symmetry.set(kSymmetryWallpaperPMM, uStep, vStep, frameZero, kTransformToLocal);
		break;
	case 21:
		symmetry.set(kSymmetryWallpaperCM, uStep, vStep, frameZero, kTransformToLocal);
		break;
	}

	uStep = uStep * 0.75;
	vStep = vStep * 0.75;
	switch (Initial.isymmetryType)
	{
	case 22:
		symmetry.set(kSymmetryWallpaperPMG, uStep, vStep, frameZero, kTransformToLocal);
		break;
	case 23:
		symmetry.set(kSymmetryWallpaperPGG, uStep, vStep, frameZero, kTransformToLocal);
		break;
	case 24:
		symmetry.set(kSymmetryWallpaperCMM, uStep, vStep, frameZero, kTransformToLocal);
		break;
	case 25:
		symmetry.set(kSymmetryWallpaperP4, Math.max(uStep, vStep), frameZero, kTransformToLocal);
		break;
	case 26:
		symmetry.set(kSymmetryWallpaperP4M, Math.max(uStep, vStep), frameZero, kTransformToLocal);
		break;
	case 27:
		symmetry.set(kSymmetryWallpaperP4G, Math.max(uStep, vStep), frameZero, kTransformToLocal);
		break;
	}

	uStep = uStep * 1.75;
	vStep = vStep * 1.75;
	switch (Initial.isymmetryType)
	{
	case 28:
		symmetry.set(kSymmetryWallpaperP3, Math.max(uStep, vStep), frameZero, kTransformToLocal);
		break;
	case 29:
		symmetry.set(kSymmetryWallpaperP3M1, Math.max(uStep, vStep), frameZero, kTransformToLocal);
		break;
	case 30:
		symmetry.set(kSymmetryWallpaperP31M, Math.max(uStep, vStep), frameZero, kTransformToLocal); 
		break;
	case 31:
		symmetry.set(kSymmetryWallpaperP6,  Math.max(uStep, vStep), frameZero, kTransformToLocal);
		break;
	case 32:
		symmetry.set(kSymmetryWallpaperP6M, Math.max(uStep, vStep), frameZero, kTransformToLocal);
	break;
	}

	return 1
}


// set the symmetry type
Initial.variableUpdated("isymmetryType")


Engine.addModule (symmetry)

Engine.addModule (patternModule)

// Add to the symmetry
symmetry.addModule (patternModule)

if (Initial.isymmetryType >= 16)
    // Setting the bounding box like this will insure that neighboring fills are aligned for 2D tilings
    Engine.setSceneBBox (outputOrigin.x, outputOrigin.x + outputSize.x,  outputOrigin.y,  outputOrigin.y + outputSize.y)
else
{
    // Other symmetries will be centered around the center of the selection bounding box
    Engine.setSceneBBox (-outputSize.x/2,  outputSize.x/2,  -outputSize.y/2,  outputSize.y/2)
 }
