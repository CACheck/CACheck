// CACert Checker
// Description: checks if your clients accept CACert as an authority.
// Authors: Carlos Briseño, Renich Bon Ciric
// License: AGPLv3


/* Config */
var CACertOverlayID     = 'CACertOverlay';
var CACertLanguage      = 'en'; /* en, es */
var CACertStyleWidth    = '50%';
var CACertStyleHeight   = '420px';
var CACertTemplateDir   = 'http://unidadlocal.com/Mantiz/js/CACert/';
var CACertServerPing    = 'https://btcsrv.com/cc';
var CACertCookieDays    = 1;
var CACertCookieName    = 'CACertCookie';
var CACertCookieValue   = 'CACertCookieValue';


/* General */
var CACertByID = function( i ) {
	return document.getElementById( i );
};


/* Cookies */
var CACertSetCookie = function() {
	var exdate = new Date();
	exdate.setDate( exdate.getDate() + CACertCookieDays );
	var c_value = escape( CACertCookieValue ) + ( ( CACertCookieDays == null ) ? '' : '; expires=' + exdate.toUTCString() );
	document.cookie = CACertCookieName + '=' + c_value;
};

var CACertGetCookie = function() {
	var i, x, y, ARRcookies = document.cookie.split( ';' );
	for ( i = 0; i < ARRcookies.length; i++ ) {
		x = ARRcookies[i].substr( 0, ARRcookies[i].indexOf( '=' ) );
		y = ARRcookies[i].substr( ARRcookies[i].indexOf( '=' ) + 1 );
		x = x.replace( /^\s+|\s+$/g, '' );
		if ( x == CACertCookieName ) {
			return unescape( y );
		}
	}
};


/*
 * Overlay*/
var CACertShowOverlay=function() {
	CACertByID(CACertOverlayID).style.display = 'block';
};

/* this function changes the display of the overlay section/div to none; it will make it disappear.*/
var CACertRemoveOverlay = function() {
	CACertByID(CACertOverlayID).style.display = 'none';
};


/*
 * Language*/
var CACertChangeLanguage = function( lng ) {
	CACertByID( 'CACertIframe' ).src = CACertTemplateDir + 'instructions.' + lng + '.html';
};

var CACertAddOverlay = function( o ) {
	var ni = document.createElement( 'section' );
	ni.id = CACertOverlayID;
	ni.innerHTML = 
	    '<section class="overlayContent" style="width: "' + CACertStyleWidth + '; height: ' + CACertStyleHeight + '"> ' + 
            '<ul class="CACertselectLanguage">' +
                '<li onclick="CACertChangeLanguage( \'en\' );">English</li>' +
                '<li onclick="CACertChangeLanguage( \'ESP\' );">Español</li>' +
            '</ul>' +
		    
		    '<button class="CACertclose" onclick="CACertRemoveOverlay();" type="button">X</button>' +
		
		    '<iframe id="CACertIframe" src="' + CACertTemplateDir + 'instructions.' + CACertLanguage + '.html" width="100%" height="' + CACertStyleHeight + '"></iframe>' +
		'</section>';
	try {
		document.body.appendChild(ni);
	} catch( e ) {
		try {
			document.getElementsByTagName( 'body' )[0].appendChild( ni );
		} catch( ex ) {
			document.getElementsByTagName( 'body' ).appendChild( ni );
		}
	}
};

/* this one checks for the url and it will fail if you don't have the certs installed.*/
var detectCACert = function() {
    try {
        var xhr = new XMLHttpRequest();
        xhr.open( "GET", CACertServerPing, false );
        xhr.send();
    } catch( err ) {
        console.log( 'There was an error: ' + err );
        console.log( 'CACert root certificate not installed.' );
        CACertAddOverlay();
        CACertShowOverlay();
    }

    if ( xhr.readyState == 4 && xhr.status == 200 ) {
        console.log( 'CACert root certificate installed.' );
        CACertSetCookie();
    } 
};


/* do */
( function() { detectCACert(); } )();
