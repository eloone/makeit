//Edits a task
editTask = function editTask(plusCount, starCount, event){
	var $target = $(event.target),
		text;

    $target.find('br').remove(); 
    $target.find('div').remove(); 
    text = $target.html().trim();

	//replaces * by bolts
    if (event.keyCode == 56 || event.keyCode == 106){// * sign
      if(starCount < 3){
        if(/\*$/.test(text)){
            starCount++;
            var html = $target.html();
            html = html.replace(/\*$/, '');
            $target.html(html+'&#xf0e7;&nbsp;');      
            setEndOfContenteditable($target.get(0));
            $target.focus();
        }
      }
    }

    //replaces + by hearts
    if (event.keyCode == 107 || event.keyCode == 187){// + sign
      if(plusCount < 3){
        if(/\+$/.test(text)){
            plusCount++;
            var html = $target.html();
            html = html.replace(/\+$/, '');
            $target.html(html+'&#xf004;&nbsp;');      
            setEndOfContenteditable($target.get(0));
            $target.focus();
        }
      }
    }

    return {plusCount : plusCount, starCount : starCount};
}

//Sends the cursor at the end of line
setEndOfContenteditable = function setEndOfContenteditable(contentEditableElement)
{
    var range,selection;
    if(document.createRange)//Firefox, Chrome, Opera, Safari, IE 9+
    {
        range = document.createRange();//Create a range (a range is a like the selection but invisible)
        range.selectNodeContents(contentEditableElement);//Select the entire contents of the element with the range
        range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
        selection = window.getSelection();//get the selection object (allows you to change selection)
        selection.removeAllRanges();//remove any selections already made
        selection.addRange(range);//make the range you have just created the visible selection
    }
    else if(document.selection)//IE 8 and lower
    { 
        range = document.body.createTextRange();//Create a range (a range is a like the selection but invisible)
        range.moveToElementText(contentEditableElement);//Select the entire contents of the element with the range
        range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
        range.select();//Select the range (make it the visible selection
    }
}

//Count hearts and bolts in a task
getCountChar = function getCountChar(char, inStr){
  return (inStr.split(char).length - 1);
}

getRawText = function getRawText(encodedTxt){
	var $currentTarget = $(event.currentTarget),
		rawEncodedHtml;
 	  //fasten your seatbelts some coconut stuff going on here
      //removes bolts from edited text
      rawEncodedHtml = encodedTxt.replace(/(%EF%83%A7)+/g, ''),
      //removes hearts from edited text
      rawEncodedHtml = rawEncodedHtml.replace(/(%EF%80%84)+/g, ''),
      //gets the resulting html
      rawHtml = decodeURIComponent(rawEncodedHtml),
      //gets the text in the html
      rawTxt = $($.parseHTML(rawHtml)).text().trim();

      return rawTxt;
};