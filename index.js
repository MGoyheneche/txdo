var pctrLclzr = require('picture-localizer')
    env = require('./env');

pctrLclzr.gmapApiKey = process.env['GMAP_KEY'];

pctrLclzr.localize('image.jpg', function(data){
  console.log(data);
});
