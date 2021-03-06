/**********************************************************/
//Check if we are on nzbindex.com or nzbindex.nl
var loc_nzbindex;

if (location.href.indexOf("nzbindex.com") != -1) {
    loc_nzbindex = 1;
}
else if (location.href.indexOf("nzbindex.nl") != -1) {
    loc_nzbindex = 1;
}
else {
    loc_nzbindex = 0;
}
/**********************************************************/


function addToNZBGetFromNzbindex() {
	var addLink = this;

    // Set the image to an in-progress image
    var img = safari.extension.baseURI + 'images/nzbget_16_fetching.png';
	
	if ($(this).find('img').length > 0) {
	    $(this).find('img').attr("src", img);
	    var nzburl = $(this).attr('href');

		//Construct message to send to background page
        var message = {
            callback : "setIconResult",
            arguments : [nzburl,''],
            reference : "a[href=\"" + addLink.href + "\"]"
        };
		safari.self.tab.dispatchMessage("Append", message);
	} else {
		$(this).css('background-image', 'url('+img+')');

	    //grab all checked boxes on page
		var a = document.getElementsByTagName('input');
		for (var i=0, len=a.length; i<len; ++i) {
			if (a[i].type == 'checkbox' && a[i].checked) {
				if ($(a[i]).parent().parent().find('td').length < 4) {
					continue;
				}

				var nzburl = $($(a[i]).parent().parent().find('td')[1]).find('a')[1];

                //Construct message to send to background page
                var message = {
                    callback : "setIconResult",
                    arguments : [nzburl,''],
                    reference : "a[href=\"" + nzburl + "\"]"
                };
                safari.self.tab.dispatchMessage("Append", message);
			}
		}
	}

	return false;
}

if (loc_nzbindex) {
    console.info("Parsing nzbindex");
	$('input[value="Create NZB"]').each(function() {
		// add button to send checked items to NZBGetConnect
		var img = safari.extension.baseURI + 'images/nzbget_16.png';
		var link = '<input class="addNZBGet" type="button" value="      Download selected" style="background-image: url('+img+'); background-repeat: no-repeat; background-position: 3px 1px;" />';
		$(this).after(link);
		$(this).parent().find('input[class="addNZBGet"]').first().click(addToNZBGetFromNzbindex);
	});
	
	$('table a[href*="nzbindex.nl\\/download\\/"]').each(function() {
	    var img = safari.extension.baseURI + 'images/nzbget_16.png';
	    var href = $(this).attr('href');
	    var link = '<a class="addNZBGetOnClick" href="' + href + '"><img title="Send to NZBGet" src="' + img + '" /></a> ';
	    $(this).before(link);
	});

	$('table a[href*="nzbindex.com\\/download\\/"]').each(function() {
	    var img = safari.extension.baseURI + 'images/nzbget_16.png';
	    var href = $(this).attr('href');
	    var link = '<a class="addNZBGetOnClick" href="' + href + '"><img title="Send to NZBGet" src="' + img + '" /></a> ';
	    $(this).before(link);
	});

    // Change the onclick handler to send to NZBGet
    $('.addNZBGetOnClick').click(addToNZBGetFromNzbindex);
}