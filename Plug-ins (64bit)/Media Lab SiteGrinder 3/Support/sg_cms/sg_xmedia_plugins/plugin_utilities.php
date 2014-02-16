<?php


function stripFormSlashes($arr)
 {
 	if(!is_array($arr))
 	{
 		return stripslashes($arr);
 	}
 	else
 	{
 		return array_map('stripFormSlashes', $arr);
 	}
 }
 
 function path_to_root($path)
 {
   $a = explode('/', $path);
   $max = count($a) -1;
   $p = '';
   for($i=0; $i < $max; $i++)
   {
     $p .= '../';
   }
   return $p;
 }

 
 
 
 
 function find_matching_node($tag, $attr, $val, $dom)
{
  $nodeList = $dom->getElementsByTagname($tag);
  $x=0;
  $cnode = $nodeList->item($x);
  while($cnode)
  {
    if($cnode->getAttribute($attr) === $val)
    {
      return($cnode);
    }
    $x++;
    $cnode = $nodeList->item($x);
  }
  return(0);
}
 
 function PLUGIN_OPTION_VAL($optionsDom, $nm)
 {
   $optionNode = find_matching_node('option', 'name', $nm, $optionsDom);
   if($optionNode)
   {
     return($optionNode->getAttribute('value'));
   }
 }
 
 function PLUGIN_PATH($path)
 {
   global $pathToRoot;
   return($pathToRoot . $path);
 }
 
 function PLUGIN_PATH_VAL($optionsDom, $nm, $enviroDom)
 {
   $url = PLUGIN_OPTION_VAL($optionsDom, $nm);
   if(PROTOCOLEDP($url))
   {
     return $url;
   }
   else
   {
    return PLUGIN_PATH($url);
   }
 }
 
 function PLUGIN_LINK($optionsDom, $nm, $enviroDom)
 {
   $optionNode = find_matching_node('option', 'name', $nm, $optionsDom);
   return("href=\"'; 
    sg_d_link('" . $optionNode->getAttribute('linktype') . "' , '" . $optionNode->getAttribute('value') . "' , '" . $optionNode->getAttribute('aux') . "' , '" . $optionNode->getAttribute('newwin') . "'); 
    echo '\" ");
 }
 
 function BOOL_STRING($s)
 {
  if(is_string($s))
  {
    return $s == "" ? false : true;
  }
  else if($s)
  {
    return true;
  }
  else
  { 
    return false;
  }
 }
 
 function BOOL_NUMBER($b)
 {
   if(is_string($b))
   {
     return $b === "false" ? "0" : "1";
   }
   else if($b)
   {
     return "1";
   }
   else
   {
 	return "0";
   }
 }
 
 function BOOL($b)
 {
   if(is_string($b))
   {
     return $b === "false" ? false : true;
   }
   else if($b)
   {
     return true;
   }
   else
   {
 	return false;
   }
 }
 
 $url_html_array = array();
 $url_token_array = array();
 function FETCH_URL($url, $token, $enviro)
 {
    global $url_html_array, $url_token_array;
    
     $html = 0;
 	$past_tokens = $url_token_array[$url];
 	if(!$past_tokens){ $past_tokens = array(); }
 	if( !in_array($token, $past_tokens) )
 	{
 	   $html = $url_html_array[$url];
 	   $past_tokens[] = $token;
 	}
 	else
 	{
 	  $past_tokens = array();
 	}
 	if(!$html){  if(PROTOCOLEDP($url)){ $html = F_URL($url); }else{ $html = file_get_contents(PLUGIN_PATH($url)); }  }
 	$url_html_array[$url] = $html;
 	$url_token_array[$url] = $past_tokens;
 	return $html;
 }
 
  	     
 
 function F_URL($url)
 {
  $ch = curl_init($url);
  curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
  ob_start();
  curl_exec($ch);
  curl_close($ch);
  $html = ob_get_contents();
  ob_end_clean();
  return $html;
 }
 
 function PROTOCOLEDP($url)
 {
    return (strpos( $url, ":/") === false) ? false : true;
 }
 

 function REGEX_REMOVE($reg, $text)
 {
   return REGEX_REPLACE($reg, $text, '');
 }
 
 function REGEX_MATCH($reg, $text)
 {
   preg_match('(' . $reg . ')ms', $text, $matches);
   return $matches[1];
 }
 
 function REGEX_REPLACE($reg, $text, $replacement)
 {
   return preg_replace('(' . $reg . ')ms', $replacement, $text);
 }
 
 /*
 class rr_closure { public $idx; 
                    public $f;
                    public function rr_lambda($matches)
                    {
                       return call_user_func($this->f, $matches[$this->idx]);
                    }
                  }
 
 function REGEX_REPLACE_LAMBDA($enviro, $reg, $fname, $matchIdx, $text)
 {
    $cl = new rr_closure(); $cl->idx = $matchIdx + 1; $cl->f=$fname;
    return preg_replace_callback('(' . $reg . ')ms', array($cl, 'rr_lambda'), $text);
 }
 */
 
  class rr2_closure { public $idx; 
                     public $f;
                     public $argArray;
                    public function rr2_lambda($matches)
                    {
                       array_shift($this->argArray);
                       array_unshift($this->argArray, $matches[$this->idx]);
                       
                       return call_user_func_array($this->f, $this->argArray);
                    }
                  }
 
  function REGEX_REPLACE_LAMBDA($enviro, $reg, $text, $matchIdx, $fname) //ACCEPTS MORE ARGS THAN THIS
 {
    
    $argArray = array("sitegrinderrocks");
    for($i=5; $i<func_num_args(); $i++)
    {  
       $argArray[]= func_get_arg($i);
    }
    $cl = new rr2_closure(); $cl->idx = $matchIdx + 1; $cl->f=$fname; $cl->argArray = $argArray;
    return preg_replace_callback('(' . $reg . ')ms', array($cl, 'rr2_lambda'), $text);
 }
 
 function FORMAT_S($fmat)//accepts for more args
 {
    $newfmat  = str_replace('~A', '%s', $fmat);
    $argArray = func_get_args();
    array_shift($argArray);
    array_unshift($argArray, $newfmat);
    return call_user_func_array('sprintf', $argArray);
 }
 
 
 function JOIN_STRING($s, $t)
 {
    return $s . $t;
 }
 
 function STRING_DOWNCASE($s)
 {
 	return strtolower($s);
 }
 
function log_xmc_timestamp($path)
{
	$time = time();
	$tspath = "../../../sg_info/cms_timestamps.ts";
	$exists = file_exists($tspath);
	$fh = fopen($tspath, 'a');
	$fsize = sprintf("%u", filesize('../../' . $path));
	fprintf($fh, "(:time $time :file \"$path\" :op :new :size $fsize)\n");
	fclose($fh);
	if(!$exists){ chmod($tspath, 0666); }
}
	

 function update_media_xml($optionsDom)
 {
 	$optionNodes = $optionsDom->getElementsByTagname('option');
 	$firstOptionNode = $optionNodes ? $optionNodes->item(0) : null;
 	
 	$xmediaXml_path = '../../' . $_POST['xmedia_xml'];
 	$xmediaDom = new DomDocument();
 	$xmediaDom->load($xmediaXml_path);
 	$layerName = $_POST['name'];
 	$layerNode = find_matching_node('entry', 'name', $layerName, $xmediaDom);
 	if($layerNode)
 	{
	 	$layerNode->setAttribute('path', $_POST['path']);
	 	$layerNode->setAttribute('plugin', $_POST['plugname']);
	 	$layerNode->setAttribute('type', $_POST['plugtype']);
	 	$suffix = $firstOptionNode ?  $firstOptionNode->getAttribute('value')  : ''; 
	 	$layerNode->setAttribute('display', $_POST['plugname'] . ": $suffix");
 	}
 	$xmediaDom->save($xmediaXml_path);
 	
 	//trigger_error("xmediaDom: " . $xmediaDom->saveXML(), E_USER_NOTICE); 
 }
 
 function check_post_values()
 {
   return isset($_POST['path']) && isset($_POST['options']) 
   && isset($_POST['plugtype']) && isset($_POST['xmedia_xml']) && isset($_POST['name']) && isset($_POST['plugname']);
 }
 

?>