var gm = require("gm");
var fs = require("fs");

module.exports = function(app, sessions)
{
	app.post("/images", function(req, res)
	{
		var sessionID = req.body.sessionID;
	
		var session = sessions.get(sessionID);
		console.log(JSON.stringify(session));
		var imageNumber = session.num++;

		//Save the image to disk
		var fileName = sessionID + "/" + imageNumber + ".png";
		var base64Data = /*req.body.image*/"data:image/png;base64,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".replace(/^data:image\/png;base64,/, "");
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