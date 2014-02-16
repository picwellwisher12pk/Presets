function attachEventListener(target, eventType, f, c)
{
  if(typeof target.addEventListener != "undefined") //w3c
  {
  	target.addEventListener(eventType, f, c);
  }
  else if (typeof target.attachEvent != "undefined") //IE
  {
  	target.attachEvent("on" + eventType, f);
  }
  else  //IE5Mac
  {
  	var eventName = "on" + eventType;
  	if(typeof target[eventName] == "function")
  	{
  		var prev = target[eventName];
  		target[eventName] = function()
  		                    {
  		                      prev();
  		                      return f();
  		                    };
     }
     else
     {
       target[eventName] = f;
     }
   }
}