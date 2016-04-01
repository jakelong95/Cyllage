var gm = require("gm");
var fs = require("fs");

module.exports = function(app, sessions)
{
	app.post("/images", function(req, res)
	{
		var sessionID = req.body.sessionID;
	
		var session = sessions.get(sessionID);
		var imageNumber = session.num;

		//Save the image to disk
		var fileName = sessionID + "/" + imageNumber + ".png";
		var base64Data = req.body.image.replace(/^data:image\/png;base64,/, "");
		fs.writeFile(fileName, base64Data, 'base64', function(err)
		{
			if(err) console.log(err);
		});

		var operations = req.body.operations;
		var cropCoordinates = operations.crop;

		//If the user wants the photo cropped
		if(cropCoordinates.x1 != -1)
		{
			var width = cropCoordinates.x2 - cropCoordinates.x1;
			var height = cropCoordinates.y2 - cropCoordinates.y1;
			gm(fileName).crop(width, height, cropCoordinates.x1, cropCoordinates.y1);
		}

		var resize = operations.size;

		//If the user wants the image resized
		if(size.w != -1)
		{
			gm(fileName).
		}

		//Now record the image in the session for future use
		var img = 
		{
			file: fileName,
			layer: operations.layer,
			position: operations.pos,
			rotate: operations.rotate
		};

		session.imgs.push(img);
		sessions.set(sessionID, session);

		res.send(JSON.stringify({"status":201}));
	});
}