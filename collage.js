var gm = require("gm");
var fs = require("fs");

module.exports = function(app, sessions)
{	
	app.get("/collage", function(req, res)
	{
		var layers = new Array(); //Stores filenames for each layer
		var session = sessions.get(req.query.session);

		var createCollage = function()
		{
			console.log("Started collaging");
			var collageName = req.query.session + "/collage.png";
			var processed = 0;

			gm(req.query.height, req.query.width, "#ffffff").write(collageName, function(err)
			{
				if(err) console.log(err);

				var layer = layers.length - 1;
				var addLayer = function(l)
				{
					console.log(l);
					if(l < 0)
					{
						console.log("Finished");
						fs.readFile(collageName, function(err, data)
						{
							var base64 = new Buffer(data, "binary").toString("base64");
							var response = {status: 200, image: base64};
							res.send(JSON.stringify(response));
						});
					}
					else
					{
						gm(layers[l]).draw("image over 0,0 " + req.query.width + "," + req.query.height + " " + layers[l]).write(collageName,
						function(err)
						{
							if(err) console.log(err);
							addLayer(l - 1);
						});
					}
				}
				addLayer(layers.length - 1);
			});
		}

		gm(req.query.height, req.query.width, "#ffffff").write(req.query.session + "/layer0.png", function(err)
		{
			if(err) console.log(err);
		});
		layers.push(req.query.session + "/layer0.png");

		session.imgs.forEach(function(item)
		{
			//Check if the layer already exists
			if(item.layer >= layers.length)
			{
				var fileName = req.query.session + "/layer" + layers.length + ".png";
				gm(req.query.height, req.query.width, "#ffffff").write(fileName, function(err)
				{
					if(err) console.log(err);
				});
				layers.push(fileName);
				console.log("Finished creating image");
			}

			var imageFile = item.file;
			gm(layers[item.layer]).size(function(err, size)
			{
				if(!err)
				{
					console.log(imageFile + " " + layers[item.layer]);
					gm(imageFile).draw("image over " + item.position.x + "," + 
						item.position.y + " " + size.width + "," + size.height +
						" " + imageFile).write(layers[item.layer], function(err)
						{
							if(err) console.log(err);
							session.processed++;
							if(session.processed >= session.imgs.length)
							{
								console.log("Done");
								createCollage();
							}
						});

					sessions.set(req.query,session, session);
				}
			});
		});
	});
}