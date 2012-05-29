// gaat - Google Analytics Advanced Tracker
// (c)2010 Further Search Marketing
//
// Version: 1.1 - Updated to check for and use _gaq
// Version: 1.2 - Changed to use .prop() for hostname,search,
//                pathname and protocol which are now considered
//                properties in jQ
//              - Also added check for lack of prop() function in
//                earlier versions of jQuery, and patched with a
//                simple redirect to attr()
//
// Usage:
//
// Normal:
// jQuery.gaat();
// This will track according to the default options below
//
// Advaned:
// jQuery.gaat({
//		email:		'fakeemailfolder',
//		downloads:	'fakedownloadsfolder',
//		external:	'fakeexternalfolder',
//		extensions: ['pdf','doc']
//	});
//
//

(function(jQuery){
	
	jQuery.gaat = function(opts){
	
		opts = jQuery.extend({
			extensions: ['doc','eps','svg','xls','ppt','pdf','xls','zip','txt','vsd','vxd','js','css','rar','exe','wma','mov','avi','wmv','mp3'],
			email: 		'/email/',
			external: 	'/external/',
			download: 	'/tracked/',
			hostname: 	location.host,
			debug:		false
		}, opts);
		
		opts.extensions = new RegExp('\\.(?:' + opts.extensions.join('|') + ')($|\\&|\\?)');

        /* Add the prop function for jQuery < 1.6 */
        if( !jQuery.fn.prop )
        {
            jQuery.fn.extend({	
                prop: function(property){
                    return jQuery(this).attr(property);
                }
            });
        }

		/* Double check the status of pageTracker */
		function trackSafe(url)
		{
			if (typeof(_gaq) 	== "object") {_gaq.push(['_trackPageview', url]);return true;}
			if (typeof(pageTracker) == "object") {pageTracker._trackPageview(url);return true;}
		}
	
		/* Track email addresses with the email prefix from opts */
		function trackEmail(e,obj)
		{
			if(opts.debug) e.preventDefault();
			
			var href = jQuery(obj).attr('href');
			var mailto = opts.email + href.substring(7);
			
			if(opts.debug) alert(mailto);
			trackSafe(mailto);
		}
		
		function trackDownload(e,obj)
		{
			if(opts.debug) e.preventDefault();
			
			var pathname	= jQuery(obj).prop('pathname');
			var search	 = jQuery(obj).prop('search');
							
			var link 	= (pathname.charAt(0) == "/") ? pathname : "/" + pathname;

			if (search && pathname.indexOf(search) == -1) link += search;
			
			link		= opts.download + pathname.split('.').pop() + link;
			
			if(opts.debug) alert(link);
			trackSafe(link);
		}
		
		function trackExternal(e,obj)
		{
			if(opts.debug) e.preventDefault();
			
			var pathname	= jQuery(obj).prop('pathname');
			var hostname 	= jQuery(obj).prop('hostname');
			var search	= jQuery(obj).prop('search');
							
			var link 	= (pathname.charAt(0) == "/") ? pathname : "/" + pathname;

			if (search && pathname.indexOf(search) == -1) link += search;

			link		= opts.external + hostname + link;
			
			if(opts.debug) alert(link);
			trackSafe(link);
		}
	
		function addLinkTracking()
		{
			jQuery('a').each(
				function(){
					try{
						var href 	= jQuery(this).prop('href');
						var hostname 	= jQuery(this).prop('hostname');
						var protocol 	= jQuery(this).prop('protocol');
						var pathname	= jQuery(this).prop('pathname');
						var search	= jQuery(this).prop('search');
						var path	= pathname + search;
						
						if(protocol == "mailto:")
						{
							jQuery(this).click(function(e){trackEmail(e,this)});
						}
						else if(hostname == opts.hostname && path.match(opts.extensions)) // Track links with matching hostnames as internal
						{
							jQuery(this).click(function(e){trackDownload(e,this)});
						}
						else if(hostname != opts.hostname && !href.match(/^javascript:/)) // Track anything that isn't Javascript as external
						{
							jQuery(this).click(function(e){trackExternal(e,this)});
						}
						
					}
					catch(e)
					{
					}	
				}
			);
		}
	
		if (typeof(pageTracker) == "object" || typeof(_gaq) == "object")
		{
			addLinkTracking();
		}
		else
		{
			if(opts.debug) alert("Unable to initialise GAAT, missing Google Analytics pageTracker");
			addLinkTracking();
			return false;
		}
	
	};

})(jQuery);
