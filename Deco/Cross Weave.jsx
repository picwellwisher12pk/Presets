///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Here are a few parameters that you can change to modify the behavior of the patterm
// Feel free to modify the values, don't change the variable names

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

// Get pattern  and its size
var pattern = RenderAPI.getParameter(kpsPattern)

var patternSize = pattern.getParameter(kpsSize)

// possibly add spacing
patternSize.x += spacing
patternSize.y += spacing

var scale = 1
 
patternSize *= scale;

var sizeStep = (patternSize.x + patternSize.y) / 2

// don't use % since sizeStep may not be integer
var xRel = outputOrigin.x - Math.floor (outputOrigin.x / sizeStep) * sizeStep
var yRel = outputOrigin.y - Math.floor (outputOrigin.y / sizeStep) * sizeStep
RenderAPI.translateRel ( -xRel, -yRel)

var row = Math.floor( outputOrigin.y / sizeStep ) 
var column = Math.floor( outputOrigin.x / sizeStep )

var mult = ((row*0 + column) % 2) == 0 ? 1 : -1;
RenderAPI.translate(-(column%2)* (patternSize.y - patternSize.x)/2, 0)

for (var y = -patternSize.y/2; y < outputSize.y + patternSize.x+patternSize.y;   row++)
{
    RenderAPI.pushMatrix()
    
    // shift each second row
    RenderAPI.translate(-mult*(row%2)* (patternSize.y - patternSize.x)/2 - 2*sizeStep, y)
 
    var col = column
    for (var x = 0; x < outputSize.x + 4*sizeStep;  x+= rotatedSizeX, col++)
    {
        // Set the seed based on the current row and column - this assures that the color will be modified
        // in the same way for the pattern in the neighboring selected area
        rand.seed = row * 1234567 + col * 7654321
       
        var angle = 90 * (col + row + Math.floor(rand()*2)*2)
        
        var side = (angle / 90) % 2
        rotatedSizeX = (1-side) * patternSize.x + side * patternSize.y
        
        // Use this computation if angle is not a multiple of 90
        //var sinA = Math.abs(Math.sin(angle / 180 * 3.141529) )
        //var cosA = Math.abs(Math.cos(angle / 180 * 3.141529) )
        //var rotatedSizeX = patternSize.x * cosA + patternSize.y * sinA
        //var rotatedSizeY = patternSize.x * sinA + patternSize.y * cosA
 
        RenderAPI.translate(rotatedSizeX/2, 0)
               
        // the pattern is centered
        RenderAPI.pushMatrix()
        RenderAPI.scale (scale, scale)
        RenderAPI.rotate(angle)
        var rc = colorRandomness  // color randomness
        var br = 1 - brightnessRandomness + rand()*brightnessRandomness  // brightness
        RenderAPI.Color (kFillColor, br *(1 - rc + rand()*rc), br*(1 - rc + rand()*rc), br*(1 - rc + rand()*rc))
        pattern.render(RenderAPI)
        RenderAPI.popMatrix()
        
        RenderAPI.translate(rotatedSizeX/2, 0) 
    }

    y+=sizeStep

    RenderAPI.popMatrix()
 }


