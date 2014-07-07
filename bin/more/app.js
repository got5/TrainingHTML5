var express = require('express'),
    http = require('http'),
    favicon = require('static-favicon'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    path = require('path'),
    fs = require('fs'),
    mv = require('mv'),
    os = require('os'),
    utils = require('./utils'),
    inspect = require('util').inspect,
    formidable= require('formidable'),
    basePath= __dirname + '/../..',
    app = express();

app.use(favicon());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(basePath, 'app')));


// console.log(__dirname);
var placesPath= basePath + '/app/data/places.json';
console.log(placesPath);
var places = utils.readJsonFile(placesPath);

//set cache manifest mime type
app.get('/application.manifest', function(req, res){
    res.contentType('text/cache-manifest');
    res.end(utils.getDynamicManifest(basePath + '/app/imgs', '.jpg', process.env.FULL_MANIFEST ));
});



app.get('/api/places', function (req, res) {
    res.json(places);
});

app.get('/api/places/:id', function (req, res) {
    if (places.length <= req.params.id || req.params.id < 0) {
        res.statusCode = 404;
        return res.send('Error 404: No quote found');
    }

    var n = utils.getFromCol(places, req.params.id);
    res.json(n);
});

app.post('/api/places', function (req, res) { 

    var id = req.body.id;
    var newPlaces = {
        id: (id || places.length+1).toString(),
        name: req.body.name,
        author: 'me',
        content: req.body.content,
        date: req.body.date,
        image: req.body.image,
        rate: req.body.rate,
        share: req.body.share,
        public: req.body.public === 'yes'
    };
    if (id) {
        if (!utils.replace(places, newPlaces)) {
            return res.send('Error 400: Post syntax incorrect.');
        }
    } else {
        places.push(newPlaces);
    }

    res.json(newPlaces);

});

app.post('/api/images', function (req, res) {

    var newId= (places.length + 1).toString();
    var imgUrl; 

    var form= new formidable.IncomingForm();

    form.parse(req, function(err, fields, files) {

      //First upload image
        if (files && files.uploadedfile){

            var uploadedFile= files.uploadedfile;

            //Get destination
            var filenameSplitted = uploadedFile.name.split('.');
            extension = filenameSplitted[filenameSplitted.length -1];
            imgUrl= 'imgs/img000' + newId + '.' +extension;
            var newDest= basePath + '/app/' + imgUrl;

            //Write to destination
            fs.readFile(uploadedFile.path, function (err, data) {
              fs.writeFile(newDest, data);
            });
        }

        imgUrl= imgUrl || 'imgs/no-image.jpg';

        //Set new pin attributes
        var pin={
            id: newId,
            author:'me',
            name: fields['pin-title'],
            content: fields['pin-desc'],
            date: fields['pin-date'],
            image: imgUrl,
            rate: fields['pin-rate'],
            share: fields['coms'],
            public: fields['allow'] === 'yes'
        };

        utils.updateJsonCacheAndFile(places, pin, placesPath);

        res.end();
    });

});


module.exports = app;
