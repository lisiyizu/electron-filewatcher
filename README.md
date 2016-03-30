# electron-filewatcher
desktop app using electron node package to monitor files in folders

## Requirements
To run this project you need first to download and configure [Node.js](https://nodejs.org) and [Npm.js](https://www.npmjs.com) tools on your development machine. 

## Download dependencies
After preparing the development environment you can use npm to download all packages needed to build the application.
```
npm install
```
## Running the app
To run the application without installing it you can run the command on root folder:
```
npm run start
```
## Creating installer
To generate windows installer you need first to install the [NSIS](http://nsis.sourceforge.net/) tool and set its path on the PATH environment variable.

run the command bellow on root folder:
```
npm run dist
```