'use strict';

const electron = require('electron');
const app = electron.app;
const path = require('path');
const cp = require('child_process');
const fs = require('fs');

const BrowserWindow = electron.BrowserWindow;
const Tray = electron.Tray;
const Menu = electron.Menu;

let mainWindow;
let appIcon;

require('crash-reporter').start();

/* --------------------------------------------------------------
  interceptando squirrel events 
 -------------------------------------------------------------- */
var handleStartupEvent = function() {
  if (process.platform !== 'win32') {
    return false;
  }

  function executeSquirrelCommand(args, done) {
      var updateDotExe = path.resolve(path.dirname(process.execPath), 
         '..', 'update.exe');
      var child = cp.spawn(updateDotExe, args, { detached: true });
      child.on('close', function(code) {
         done();
      });
   };

   function install(done) {
      // Optionally do things such as:
      //
      // - Install desktop and start menu shortcuts
      // - Add your .exe to the PATH
      // - Write to the registry for things like file associations and
      //   explorer context menus
      var target = path.basename(process.execPath);
      executeSquirrelCommand(["--createShortcut", target], done);
   };

   function uninstall(done) {
       //remove everything that was created during instalation
      var target = path.basename(process.execPath);
      executeSquirrelCommand(["--removeShortcut", target], done);
   };

   var squirrelEvent = process.argv[1];
   switch (squirrelEvent) {
      case '--squirrel-install':
      case '--squirrel-updated':
         install(app.quit);
         return true;
      case '--squirrel-obsolete':
         app.quit();
         return true;
      case '--squirrel-uninstall':
         uninstall(app.quit);
         return true;
   }

   return false;
};

if (handleStartupEvent()) {
  return;
}
//---------------------------------------------------------------------
//---------------------------------------------------------------------

app.on('window-all-closed', function() {
  if (process.platform != 'darwin') {
    app.quit();
  }
});

app.on('ready', function() {
    
  mainWindow = new BrowserWindow({width: 1000, height: 600});

  mainWindow.loadUrl('file://' + __dirname + '/index.html');

  mainWindow.on('closed', function() {
    mainWindow = null;
  });
  
  var trayIconPath = path.join(__dirname,'/resources/trayicon.png');
  appIcon = new Tray(trayIconPath);
  var contextMenu = Menu.buildFromTemplate([
    { label: 'Dev Tools', click: function(){ mainWindow.openDevTools();} },
    { label: 'Help', click: function(){ electron.shell.openExternal('http://electron.atom.io');} },
    { type: 'separator' },
    { label: 'Sair', click: function(){ app.quit(); } }
  ]);
  appIcon.setToolTip('filewatcher');
  appIcon.setContextMenu(contextMenu);
    
});