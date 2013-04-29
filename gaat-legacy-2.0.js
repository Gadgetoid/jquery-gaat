//	Google Analytics Advanced Tracker v2.0 - Legacy JS version
//  -------------------------------------------------------
//  Created by Further.co.uk
//  -------------------------------------------------------
//  This javascript tags file downloads and external links in Google Analytics.
//	You need to be using the Google Analytics New Tracking Code (ga.js) for this script to work
//	To use, place this file on all pages just below the Google Analytics tracking code. ( _gaq must be defined )
//	All outbound links and links to non-html files should now be automatically tracked.


function startListening(obj, evnt, func) {
    if (obj.addEventListener) {
        obj.addEventListener(evnt, func, false);
    } else if (obj.attachEvent) {
        obj.attachEvent("on" + evnt, func);
    }
}

function gaat_trackEvent(category, action, opt_label, opt_value, opt_noninteraction)
{
    _gaq.push(['_trackEvent', category, action, opt_label, opt_value, opt_noninteraction]);
}

function trackFtp(evnt) {
    var href = (evnt.srcElement) ? evnt.srcElement.href : this.href;

    gaat_trackEvent('Link','FTP',href,0,true);
}

function trackDownloads(evnt) {
    var href = (evnt.srcElement) ? evnt.srcElement.href : this.href;

    var sub_category = 'Other';

    // pdf files
    if (href.match(/\.(?:pdf)/)) {
        sub_category = 'PDF';
    }

    // excel files
    if (href.match(/\.(?:xls|xlsx)/)) {
        sub_category = 'Excel';
    }

    // document files
    if (href.match(/\.(?:doc|docx)/)) {
        sub_category = 'Document';
    }

    // archive files
    if (href.match(/\.(?:zip|gzip|7z)/)) {
        sub_category = 'Zip';
    }


    if(gaat_debug){
        alert('Raising tracking event for ' + href + ' in sub cat ' + sub_category + ', cat Download');
    }

    gaat_trackEvent('Download', sub_category, href, 0, false);
}

function trackMailto(evnt) {
    var href = (evnt.srcElement) ? evnt.srcElement.href : this.href;
    var mailto = href.substring(7);
    _gaq.push(['_trackEvent', 'Link', 'Email', mailto, 0, false]);
}

function trackExternalLinks(evnt) {
    var e = (evnt.srcElement) ? evnt.srcElement : this;

    while (e.tagName != "A") {
        e = e.parentNode;
    }

    var lnk = (e.pathname.charAt(0) == "/") ? e.pathname : "/" + e.pathname;

    if (e.search && e.pathname.indexOf(e.search) == -1) lnk += e.search;

    lnk = e.hostname + lnk;
    gaat_trackEvent('Link', 'External', lnk, 0, true);
}

function trackInternalLinks(evnt) {
    var e = (evnt.srcElement) ? evnt.srcElement : this;

    while (e.tagName != "A") {
        e = e.parentNode;
    }

    var lnk = (e.pathname.charAt(0) == "/") ? e.pathname : "/" + e.pathname;

    if (e.search && e.pathname.indexOf(e.search) == -1) lnk += e.search;

    lnk = e.hostname + lnk;
    _gaq.push(['_trackEvent', 'Link', 'Internal', lnk, 0, true]);
}

function trackFormPost(evnt){
    var e = (evnt.srcElement) ? evnt.srcElement : this;
    if (e.method.toLowerCase() == 'post')
    {
        lnk = e.action;
        gaat_trackEvent('Form', 'Submit', lnk, 0, true);
    }
}

gaat_debug = false;

window.onload = function () {

    if (typeof(_gaq) != "object") {

        if(gaat_debug){
            alert('Google Analytics Advanced Tracking requires asynchronous Google tracking code and _gaq ' + location.host);
            _gaq = [];
        }
        else{
            return false;
        }

    }

    if (document.getElementsByTagName) {
        // Initialize form post handlers
        var forms = document.getElementsByTagName("form");
        for (var f = 0; f < forms.length; f++)
        {
            if(gaat_debug){
                alert('Tracking ' + forms[f].action + ' as Form');
            }
            startListening(forms[f], "submit", trackFormPost);
        }
        // Initialize external link handlers
        var hrefs = document.getElementsByTagName("a");
        for (var l = 0; l < hrefs.length; l++) {
            try {
                //protocol, host, hostname, port, pathname, search, hash
                if ( hrefs[l].href.match(/^javascript:/) || hrefs[l].href == '#' || hrefs[l].href == '' ){
                     // Do nowt!
                } else if (hrefs[l].protocol == "mailto:") {
                    if(gaat_debug){
                        alert('Tracking ' + hrefs[l].href + ' as mail link');
                    }
                    startListening(hrefs[l], "click", trackMailto);
                } else if (hrefs[l].protocol == "ftp:") {
                    if(gaat_debug){
                        alert('Tracking ' + hrefs[l].href + ' as FTP link');
                    }
                    startListening(hrefs[l], "click", trackFtp);
                } else if (hrefs[l].hostname == location.host) {
                    var path = hrefs[l].pathname + hrefs[l].search;
                    var isDoc = path.match(/\.(?:doc|eps|jpg|png|svg|xls|xlsx|docx|7zip|gzip|ppt|pdf|xls|zip|txt|vsd|vxd|js|css|rar|exe|wma|mov|avi|wmv|mp3)($|\&|\?)/);
                    var isTracked = (hrefs[l].className == "gaattracked") || hrefs[l].getAttribute('data-gaattracked');
                    if (isDoc) {
                        if(gaat_debug){
                            alert('Tracking ' + hrefs[l].href + ' as download');
                        }
                        startListening(hrefs[l], "click", trackDownloads);
                    } else if (isTracked) {
                        if (gaat_debug) {
                            alert('Tracking ' + hrefs[l].href + ' as tracked internal');
                        }
                        startListening(hrefs[l], "click", trackInternalLinks);

                    }
                } else if (hrefs[l].href.hostname != location.host) {
                    if(gaat_debug){
                        alert('Tracking ' + href[l].href + ' as external link')
                    }
                    startListening(hrefs[l], "click", trackExternalLinks);

                }
            }
            catch (e) {
                continue;
            }
        }
    }

}