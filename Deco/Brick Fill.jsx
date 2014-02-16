///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Here are a few parameters that you can change to modify the behavior of the patterm
// Feel free to modify the values, don't change the variable names

// Offset between rows of pattern expressed in pattern width. 
// For example 0.5 is half the width.
var offset = 0.5    // use a value between 0 and 1. The default is 0.5.

// Spacing between patterns in pixels. 
// For example,1 creates 1 pixel gap between patterns
var spacing = 0   // use a value between -10 to 20. The default is 0.

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


// Get pattern and its size
var pattern = RenderAPI.getParameter(kpsPattern)

var patternSize = pattern.getParameter(kpsSize)

// possibly add spacing
patternSize.x += spacing
patternSize.y += spacing

RenderAPI.translateRel (patternSize.x/2, patternSize.y/2)

RenderAPI.translateRel ( -(outputOrigin.x % patternSize.x), -(outputOrigin.y % patternSize.y))

var row = Math.floor( outputOrigin.y / patternSize.y )
var column = Math.floor( outputOrigin.x / patternSize.x )

pattern.setParameter (kpsColorBlendMode, kpsBlendMultiply)
//pattern.setParameter (kpsColorBlendMode, kpsBlendLinearLight)

for (var y = 0; y < outputSize.y + patternSize.y;  y+= patternSize.y, row++)
{
    RenderAPI.pushMatrix()
    
    var x = 0
    
    
    if ( (row%2) == 1)
    {
        RenderAPI.translate(-offset * patternSize.x, 0)
         x = -patternSize.x // one extra, just in case
    }
   
    for (var c = column; x < outputSize.x + patternSize.x * (1 + offset);  x+= patternSize.x, c ++)
    {
        RenderAPI.pushMatrix()
        
        // Set the seed based on the current row and column - this assures that the color will be modified
        // in the same way for the pattern in the neighboring selected area
        rand.seed =  row * 1234567 + c * 7654321
         // setting seed for each pattern is not that good, but calling an extra rand helps
        rand()
        var rc = colorRandomness  // color randomness
        var br = 1 - brightnessRandomness + rand()*brightnessRandomness  // brightness
        RenderAPI.Color (kFillColor, br *(1 - rc + rand()*rc), br*(1 - rc + rand()*rc), br*(1 - rc + rand()*rc))
        
        //RenderAPI.scale(rand()*0.1 + 1)
        //RenderAPI.rotate(-4 + Math.floor(rand()*60) / 7.5)  // 60 distinct rotations - to help cache
        pattern.render(RenderAPI)
        
        RenderAPI.popMatrix()
        RenderAPI.translate(patternSize.x, 0)
    }

    RenderAPI.popMatrix()
    RenderAPI.translate(0, patternSize.y)
}




