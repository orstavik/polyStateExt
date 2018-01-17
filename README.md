### How to install
1) In chrome, open [chrome://extensions](chrome://extensions)
2) Make sure "developer mode" is selected.
3) Select _Load unpacked  extension..._ and 
   choose the folder in which devtools-page.js is located.
4) You must close and reopen the dev tools window to see the plugin.

### How to make changes
When you have made changes in the folder from where you
installed the extension, you can simply close and reopen the devtools.

#### How to debug: content-script.js
1) Open the __normal__ devtools (F12) from an app that uses JoiState.
2) Select __sources__ panel
3) Select __content scripts__ above the list of files.
   
#### How to debug: injected-script.js
1) Open the __normal__ devtools (F12) from an app that uses JoiState.
2) Select __console__ panel (!!This is weird trick!!) 
3) Click on the link to right of the console.info message saying:
"To debug the injected script StatePrinter, click here!"
  
#### How to debug: devtools.panel.js, app.js and all other js files
1) Open the __normal__ devtools (F12) from an app that uses JoiState.
2) Select __polyState__ panel.
3) __Rightclick__ anywhere on the panel
4) Choose __inspect__. This will open __devtools of devtools__.
5) In __devtools of devtools__, select __sources__
6) In the file selector, choose __devtools-panel.html__
7) Here you will find devtools.panel.js, app.js and all other js files.
                                            