$(function(){
    const fs = require('fs');
    const xsd = require('xsd-schema-validator');
    
    var watcher = null;
    
    watchFolder = function(folderpath, schemapath){
        
        if (fs.statSync(folderpath) && fs.lstatSync(folderpath).isDirectory()){
        
            watcher = fs.watch(folderpath, (event, filename) => {
              if (filename) {
                var filepath = folderpath+'\\'+filename;
                  
                fs.exists(filepath, (exists) => {
                    if (exists && event === 'rename'){
                        var xmlStr = fs.readFileSync(filepath, 'utf8');
                        xsd.validateXML(xmlStr, schemapath, (err,result) => {
                            if (!err){
                                $('#textlog').append('<li>processando: '+filepath+': ' +result.valid+'</li>');
                            }else{
                                $('#textlog').append('<li>'+filepath+': ' +err.message+'</li>');
                            }
                            fs.unlinkSync(filepath);
                        });
                        
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
        var schema = $('#schema').val();

        if (watcher){
            watcher.close();
        }
        
        if (watchFolder(folder, schema)){
            $('#textlog').append('<li>monitorando: '+folder+'</li>');
        }
    });
});
