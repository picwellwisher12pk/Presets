// Flexible 960gs - Adobe Photoshop Script
// Description:Divide your photoshop document into columns according to 960 grid system. 
// Requirements: Adobe Photoshop CS5 or higher
// Version: 1.0.0, June 2012
// Author: Amir Hameed (picwellwisher12pk@gmail.com)
// Copyright: (c) 2012 www.amirhameed.com
// Website: www.amirhameed.com

﻿preferences.rulerUnits = Units.PIXELS;
var layoutWidth=Number(prompt('enter width',960));
var cols=Number(prompt('Enter numbers of columns',12));
var space=Number(prompt('Enter space between columns',10));

var doc=app.activeDocument;
var docWidth=doc.width;
var docXcenter=docWidth/2;
var dspace=space*2;  //double space
var layoutHalf=layoutWidth/2;
//outer limits that is the layout width;
var maxLimitOuter=docXcenter+layoutHalf;
var minLimitOuter=docXcenter-layoutHalf;
//Inner limits for 960gs
var minLimitInner=minLimitOuter+space;
var maxLimitInner=maxLimitOuter-space;

var colWidth=(layoutWidth-(cols*dspace))/cols;



doc.guides.add(Direction.VERTICAL,minLimitOuter);
doc.guides.add(Direction.VERTICAL,maxLimitOuter);
//doc.guides.add(Direction.HORIZONTAL, 610);  

for(i=0;i<cols;i++){
	guidPos=minLimitInner+((colWidth+dspace)*i);
	//guidPos=new Number (guidPos);
	if(guidPos>maxLimitInner){
		break;
		}
	doc.guides.add(Direction.VERTICAL,Number(guidPos));
	//alert(guidPos);

	
	}

for(j=0;j<cols;j++){
	if(j==0){
			multiply=0
		}
	else
		{
			multiply=1;
		}
	temp_dspace=(dspace*multiply);
	
	guidPos=(minLimitOuter-space)+((colWidth+dspace)*(j+1));
	
	//guidPos=new Number (guidPos);
	if(guidPos>maxLimitInner){
		break;
		}
	doc.guides.add(Direction.VERTICAL,Number(guidPos));
	//alert((80+dspace)*i);
	
	}   