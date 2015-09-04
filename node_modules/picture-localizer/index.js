var im = require('imagemagick'),
    https = require('https');


module.exports = {

  gmapApiKey: "",

  localize: function(image, callback) {

    if (this.gmapApiKey.length === 0) {
      console.log('Please, set your api key');
      return;
    }

    im.readMetadata(image, function(err, metadata){
      if (err) throw(err);

      var degreeLatitude = metadata.exif.gpsLatitude.split(', ')
      var degreeLongitude = metadata.exif.gpsLongitude.split(', ')

      var latitude = ConvertDMSToDD(
        parseInt(degreeLatitude[0].split('/')),
        parseInt(degreeLatitude[1].split('/')),
        parseInt(degreeLatitude[2].split('/'))/100,
        metadata.exif.gpsLatitudeRef
      );

      var longitude = ConvertDMSToDD(
        parseInt(degreeLongitude[0].split('/')),
        parseInt(degreeLongitude[1].split('/')),
        parseInt(degreeLongitude[2].split('/'))/100,
        metadata.exif.gpsLongitudeRef
      );

      var apiKey = process.env['GMAP_KEY'];
      var data = '';
      var options = {
        host: 'maps.googleapis.com',
        path: '/maps/api/geocode/json?latlng=' + latitude + ',' + longitude + '&key=' + apiKey
      };


      https.get(options, function(res) {
        var body = '';
        res.on('data', function(chunk) {
          body += chunk;
        });
        res.on('end', function() {
          body = JSON.parse(body);
          callback(body);
        });
      }).on('error', function(e) {
      });

    })
  }
};


// http://stackoverflow.com/questions/1140189/converting-latitude-and-longitude-to-decimal-values
var ConvertDMSToDD = function(days, minutes, seconds, direction) {
  var dd = days + minutes/60 + seconds/(60*60);
  // Invert south and west.
  if (direction == 'S' || direction == 'W') {
    dd = dd * -1;
  }
  return dd;
}

