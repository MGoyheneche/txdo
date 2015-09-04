var expect = require('chai').expect,
    pctrLclzr = require('../index.js'),
    env = require('./env');

pctrLclzr.gmapApiKey = process.env['GMAP_KEY'];

describe('#localize', function() {

  it("should know the truth", function() {
    expect(true).to.be.true;
  });

  it('should be an object', function(done) {
    pctrLclzr.localize('./test/image.jpg', function(res) {
      expect(res).to.be.a('Object');
      done();
    });
  });
});
