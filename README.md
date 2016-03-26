# JavaScript-Speech-API-Library
An easy-to-use library for using the HTML5 Speech API.

#Requirements

Note: Some browsers may require this to be hosted from a server in order to run correctly.

- synthesis_demo.html: Requires a browser that supports the speech synthesis api.  (See Known Issues)
- recognition_demo.html: Requires a browser that supports webkit speech recognition.

#Compatability:

This is known to work correctly with the following browsers:
- Chrome  (44.0.2403.155 m)
- Opera   (31.0.1889.161)
- Firefox (39.0.3) - (See Known Issues)

#Known Issues:

Speech Synthesis:
-- Firefox:
---- Currently Firefox does not enable speech synthesis by default.  It must be enabled by changing a flag in about:config.
Even if enabled, there are no voices to use.  If the demo.html page is ran on Firefox with the speech synthesis flag enabled,
it will attempt to fetch the available voices from the client.  If the request times out, it will display a notice to the user.
Until Firefox implements some voices, the demo.html page will continue to display this notice to Firefox users who have the
speech synthesis flag enabled in their browser.
