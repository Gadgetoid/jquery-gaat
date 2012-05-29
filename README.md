jquery-gaat
===========

Google Analytics Advanced Tracking JS/JQuery

GAAT is a jQuery Plugin designed to enhance your Google Analytics external link and download tracking. It will automatically detect external links and track clicks to a virtual page, and will do the same for file downloads and email links.

You can specify which file formats you wish to track, in addition to the virtual paths which track each type of resources.

By default email links will be tracked to /email/<emailaddress>

Extenal links will be tracked to /external/<url>

Downloads will be tracked to /tracked/<filepath>

GAAT requires the filepath to be present in the URL to succesfully detect and track downloads, if your files are served via a gateway page (ie: downloads.php?file=1) then you will need to adjust accordingly (use a property to store the real filename, for example)

credits
=======

GAAT was developed for Further Search Marketing by Rob Welsby, see gaat-legacy.js, and ported to jQuery by myself. Feel free to use it in your websites, but please share if you change/improve anything.
