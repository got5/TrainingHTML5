var fs = require('fs');
var path = require('path');

var ret = {
    "path": path.join(__dirname, 'app')
};

function readJsonFileSync(filepath, encoding) {

    if (typeof (encoding) == 'undefined') {
        encoding = 'utf8';
    }
    var file = fs.readFileSync(filepath, encoding);
    return JSON.parse(file);
};

ret.readJsonFile = function loadFile(file) {
    return readJsonFileSync(file);
};

ret.getIndexFromCol = function (col, pId) {
    for (var index = 0; index < col.length; index++) {
        var n = col[index];
        if (n.id == pId) {
            return index;
        }
    }
    return -1;
};

ret.getFromCol = function (col, pId) {
    var index = this.getIndexFromCol(col, pId);
    return index > -1 ? col[index] : null;
};

ret.replace = function(col,elem){
    var index = this.getIndexFromCol(col,elem.id);
    if(index < 0){
        return false;
    }else{
        col[index] = elem;
        return true;
    }
};

/*
Generate a manifest to cache all resources in path 'path' with extension
'extension'
*/
ret.getDynamicManifest= function(path, extension, fullManifest){

    var getExtension= function(filename) {
        var i = filename.lastIndexOf('.');
        return (i < 0) ? '' : filename.substr(i);
    }

    var res=[
     'CACHE MANIFEST',
    '#' + (process.env.MANIFEST_VERSION || 'v1')
    ];

    if (fullManifest){
        var files= fs.readdirSync(path);

        for(var i in files){
            if ( getExtension(files[i])==extension ){
                res.push('imgs/' + files[i]);
            }
        }
    }

    res.push('NETWORK:');
    res.push('*');

    return res.join('\n');

}


ret.updateJsonCacheAndFile= function(placesObject, newPlace, placesFilePath){

    //Update places in cache and on the file
    placesObject.push(newPlace);
    var jsonStr=JSON.stringify(placesObject); 
    var regexp= new RegExp('},','g'); 
    jsonStr= jsonStr.replace(regexp,'},\n');
    fs.writeFile(placesFilePath, jsonStr);    

}



module.exports = ret;