var im = require('imagemagick'),
    https = require('https');


im.readMetadata('image2.jpg', function(err, metadata){
  if (err) throw err;
  console.log(metadata.exif.gpsLatitude);
  console.log(metadata.exif.gpsLongitude);

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

  console.log(latitude);
  console.log(longitude);

  var apiKey = 'AIzaSyAbQw6_bpgYjoV5hMfeRv3NqtRUKCl9u0Y';
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
      // console.log(body[results]);
      body = JSON.parse(body);
      console.log(body.results[0].formatted_address);
    });
  }).on('error', function(e) {
    console.log('Got error: ' + e.message);
  });

  console.log(data);

})



// http://stackoverflow.com/questions/1140189/converting-latitude-and-longitude-to-decimal-values
var ConvertDMSToDD = function(days, minutes, seconds, direction) {
	console.log(days, minutes, seconds, direction)
  var dd = days + minutes/60 + seconds/(60*60);
  // Invert south and west.
  if (direction == 'S' || direction == 'W') {
    dd = dd * -1;
  }
  return dd;
}

