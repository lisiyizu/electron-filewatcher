$(function(){
    const fs = require('fs');
    
    var watcher = null;
    
    watchFolder = function(folderpath){
        
        if (fs.exists(folderpath) && fs.lstatSync(folderpath).isDirectory()){
        
            watcher = fs.watch(folderpath, (event, filename) => {
              if (filename) {
                fs.exists(folderpath+'\\'+filename, (exists) => {
                    if (exists && event === 'rename'){
                        fs.unlinkSync(folderpath+filename);
                        $('#textlog').append('<li>processando: '+folderpath+'\\'+filename+'</li>');
                    }
                });
              }
            });
            
            return true;
        }else{
            alert('invalid folder path '+folderpath);
            return false;
        }
    };

    $('#watch').click(function(e){
        var folder = $('#folder').val();

        if (watcher){
            watcher.close();
        }
        
        if (watchFolder(folder)){
            $('#textlog').append('<li>monitorando: '+folder+'</li>');
        }
    });
});
