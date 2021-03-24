const fs = require('fs')
const express = require('express')
let app = express()


app.get('/40325ec2-5efd-4bd3-805f-53576e581d13', function(req,res) {
  let file = "./sample.wav";

  fs.stat(file, function(err,stats){

    var start, end;
    var total = stats.size;

    var range = req.headers.range;
    if(range) {
      var positions = range.replace(/bytes=/, "").split("-");
      start = parseInt(positions[0], 10);
      end = positions[1] ? parseInt(positions[1], 10) : total - 1;
    } else {
      start = 0;
      end = total - 1;
    }
    var chunksize = (end - start) + 1;

    res.writeHead(200, {
      "Content-Range": "bytes " + start + "-" + end + "/" + total,
      "Accept-Ranges": "bytes",
      "Content-Length": chunksize,
      //"Content-Type": "audio/mpeg"
      "Content-Type": "audio/wav"
    });

    var stream = fs.createReadStream(file, { start: start, end: end })
      .on("open", function() {
        stream.pipe(res);
      }).on("error", function(err) {
        res.end(err);
      });
  })
})

app.listen(4000)
