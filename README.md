<p align="center">
  <img src="https://github.com/vanitysys28/watchd/blob/main/icon128.png"/>
</p>

# watchd 

## Description

This extension was created in order to fix a common issue people binge-watching on YouTube might have faced.<br>
<br>
The purpose is to inject a button in current YouTube UI to keep track of the watchtime on a per video basis.<br>
Watchtime is displayed in percentage.<br>
<br>
The data is stored in browser localstorage, and can't unfortunately be shared across devices yet.<br>

## Features
- Injecting button next to Subscribe button
- Displaying watchtime in percentage in previously injected button
- Updating watchtime everytime the `timeupdate` event is fired
- Displaying a tick when the video reached the end, independantly of the total watchtime

## Installation

The extension isn't available to install from the Chrome Web Store yet.<br>
<br>
To install it, please follow these instructions:
1. Clone this git repository
2. Navigate to `chrome://extensions`
3. Enable developer mode
4. Load the unpacked extension by locating the previously cloned repository

## Support

Improvements to this extension are more than welcome!<br>
Do not hesitate to initiate PR if you believe a great feature could be added to it.



