//call:  equalizeColumns('id1', 'id2', ....) where id1 and id2 are the div ids of the columns.
function equalizeColumns() 
{
	var bottom = 0; var stor;
	if(arguments.length > 1)
	{
		for(x=0; x < arguments.length; x++)
		{
			var column = document.getElementById(arguments[x]);
			if(column)
			{
				column.style.height = null;
				var colbottom = column.offsetTop + column.clientHeight; //column.offsetHeight;
				
				
				if(colbottom > bottom)
				{
					bottom = colbottom
				}
			}
		}				
		//height = height-2; /* border */
		if(bottom > 0)
		{
			for(x = 0; x < arguments.length; x++)
			{
				var column = document.getElementById(arguments[x]);
				if(column)
				{
					column.style.height = (bottom - column.offsetTop ) + 'px';
				}
			}
		}
	}
	
}

function sizePageInterior(fspace)
{
  var page = document.getElementById('page');
  var contentFooter = document.getElementById('ridefooter');
  var footer = document.getElementById('footer');
  var fheight = footer.scrollHeight;
 
  var contentBottom = contentFooter.offsetTop;
  var windowBottom = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : document.body.clientHeight;
    
 if (contentBottom + fspace < windowBottom)
 {
     page.style.height = (windowBottom-fheight)+ 'px';
 }
 else
 {
    page.style.height = (contentBottom + fspace) + 'px';
 }
  
}

function handleOverflowX(minw)
{
  var windowWidth = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : document.body.clientWidth;
  var top = document.body;
  if(windowWidth < minw)
  {
    
    top.style.overflowX = 'visible';
  }
  else
  {
    top.style.overflowX = 'hidden';
  }
}
