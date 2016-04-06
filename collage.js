var gm = require("gm");
var fs = require("fs");

module.exports = function(app, sessions)
{	
	app.get("/collage", function(req, res)
	{
		var session = sessions.get(req.query.session);
		var finishedFile = req.query.session + "/collage.png";
		
		var createCollage = function()
		{
            console.log("Creating collage");
			session.imgs.sort(function(a, b)
			{
					return a.layer - b.layer;
			});

			var addLayer = function(currentLayer)
			{
				//if(currentLayer < 0)
				if(currentLayer >= session.imgs.length)
				{
					fs.readFile(finishedFile, function(err, data)
					{
						var base64 = new Buffer(data, "binary").toString("base64");
						var response = {status: 200, image: base64};
						res.send(JSON.stringify(response));
					});
				}
				else
				{
					//gm(session.imgs[currentLayer].file).size(function(err, size)
					//{
						//if(!err)
						//{
							//gm(session.imgs[currentLayer].file).draw("image over " + session.imgs[currentLayer].position.x + "," +
                            //session.imgs[currentLayer].position.y + " " + "0,0 " + 
							//finishedFile).write(finishedFile, function(err)
                            gm(finishedFile).draw("image over " + session.imgs[currentLayer].position.x + "," + session.imgs[currentLayer].position.y +
                                                  " 0,0 " + session.imgs[currentLayer].file).write(finishedFile, function(err)
							{
								if(err) console.log(err);
								addLayer(currentLayer + 1);
							});
                            /*gm(session.imgs[currentLayer].file)
                                .command("composite")
                                .out("-geometry", "+" + session.imgs[currentLayer].position.x + "+" + session.imgs[currentLayer].position.y)
                                .in(session.imgs[currentLayer].file)
                                .stream()
                                .write(finishedFile, function(err)
                                       {
                                            if(err) console.log(err);
                                            addLayer(currentLayer + 1);
                                       });*/
                            //setTimeout(100, addLayer(currentLayer + 1));
						//}
					//});
				}
			}
			addLayer(0);
            //addLayer(session.imgs.length - 1);
		}

		gm(req.query.height, req.query.width, "#ffffff").write(finishedFile, function(err)
		{
			if(err) console.log(err);
			createCollage();
		});
	});
}