$(function(){
    const fs = require('fs');
    
    var watcher = null;
    
    watchFolder = function(folderpath){
        watcher = fs.watch(folderpath, (event, filename) => {
          if (filename) {
            fs.exists(folderpath+'\\'+filename, (exists) => {
                if (exists && event === 'rename'){
                    fs.unlinkSync(folderpath+filename);
                    $('#textlog').append('<li>processando: '+folderpath+'\\'+filename+'</li>');
                }
            });
            
          } else {
            console.log('filename not provided');
          }
        });
    };

    $('#watch').click(function(e){
        var folder = $('#folder').val();
        
        if (watcher){
            watcher.close();
        }
        
        watchFolder('C:\\temp\\deleteme\\');
        $('#textlog').append('<li>monitorando: '+folder+'</li>');
    });
});
