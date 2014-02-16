///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Here are a few parameters that you can change to modify the behavior of the patterm
// Feel free to modify the values, don't change the variable names

// Density of the covered pattern
// For example,density of 1 places patters such that if they were aligned one next to another
// they would cover all pixels. Keep in mind that since the patterns overlap, you will see gaps.
var density = 2   // use a value between 0.1 to 10. The default is 2.

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

// You include random scaling of the patter
// If you don't want any variation, set both to 1
 var patternScaleFrom = 0.5   // use a values between 0.1 and 3 . The default is 0.5.
 var patternScaleTo = 1         // use a values between 0.1 and 3 , larger or equal to patternScaleFrom. The default is 1.
 

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// You can modify the code below but keep in mind that as with any scripting
// you can break things. Keep a backup copy.
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// get size of the output area
var outputSize = RenderAPI.getParameter(kpsSize)

// Get pattern  and its size
var pattern = RenderAPI.getParameter(kpsPattern)
 
var patternSize = pattern.getParameter(kpsSize)

//RenderAPI.translater(bbox.min[0], bbox.min[1])

// possibly add spacing
patternSize.x += 0
patternSize.y += 0
// place elements at random locations and size

var rB = 0.0  // blue color randomness
var rI = 0.1 // intensity randomness

Math.random(1) // sets the seed

var sizes = new Array()
sizes.push (5)
sizes.push (2)
//sizes.push (1)
//sizes.push (0.5)

// determine the number approximately based on size of the element and filled area
var num = ((outputSize.x + patternSize.x) * (outputSize.y + patternSize.y)) / (patternSize.x * patternSize.y) * density
if (num < 1)
    num = 1

for (var n = 0; n < num; n++)
{
    RenderAPI.pushMatrix()

    //var size = 1
        
    var scale = (patternScaleFrom + (patternScaleTo - patternScaleFrom) * Math.random() )

    var spanx = outputSize.x + patternSize.x * scale
    var spany = outputSize.y + patternSize.y * scale
 
    var x =  -patternSize.x * scale * 0.5 + spanx * Math.random()
    var y =  -patternSize.y * scale * 0.5 + spany * Math.random()
        
    RenderAPI.translate(x, y)
    RenderAPI.scale(scale, scale)
     
    var rotate = 360/30 * Math.floor(Math.random() * 30) // 30 distinct rotations
    RenderAPI.rotate(rotate)

    var rc = colorRandomness  // color randomness
    var br = 1 - brightnessRandomness + Math.random()*brightnessRandomness  // brightness
    RenderAPI.Color (kFillColor, br *(1 - rc + Math.random()*rc), br*(1 - rc + Math.random()*rc), br*(1 - rc + Math.random()*rc))
    pattern.render(RenderAPI)
    RenderAPI.popMatrix()
}




