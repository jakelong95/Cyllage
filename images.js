var gm = require("gm");
var fs = require("fs");

module.exports = function(app, sessions)
{
	app.post("/images", function(req, res)
	{
		var sessionID = req.body.sessionID;
	
		var session = sessions.get(sessionID);
		var imageNumber = session.num++;

		//Save the image to disk
		var fileName = sessionID + "/" + imageNumber + ".png";
		var base64Data = req.body.image.replace(/^data:image\/png;base64,/, "");
		fs.writeFile(fileName, base64Data, 'base64', function(err)
		{
			if(err) console.log(err);
		});

		var x1 = req.body.operations.crop.x1;
		var x2 = req.body.operations.crop.x2;
		var y1 = req.body.operations.crop.y1;
		var y2 = req.body.operations.crop.y2;

		//If the user wants the photo cropped
		if(x1 != -1)
		{
			var width = x2 - x1;
			var height = y2 - y1;

			gm(fileName).crop(width, height, x1, y1).write(fileName, function(err)
			{
				if(err) console.log(err);
			});
		}

		var w = req.body.operations.size.w;
		var h = req.body.operations.size.h;

		//If the user wants the image resized
		if(w != -1)
		{
			gm(fileName).resize(w, h).write(fileName, function(err)
			{
				if(err) console.log(err);
			});
		}

		//Now record the image in the session for future use
		var img = 
		{
			file: fileName,
			layer: req.body.operations.layer,
			position: {x: req.body.operations.pos.x, y: req.body.operations.pos.y},
			rotate: req.body.operations.rotate
		};

		session.imgs.push(img);
		sessions.set(sessionID, session);

		res.send(JSON.stringify({"status":201}));
	});
}