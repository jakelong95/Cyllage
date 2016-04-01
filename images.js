var gm = require("gm");
var fs = require("fs");

module.exports = function(app, sessions)
{
	app.post("/images", function(req, res)
	{
		var sessionID = req.body.sessionID;
	
		var imageNumber = sessions.get(sessionID); //Used as the name of the file
		sessions.set(sessionID, imageNumber + 1);

		//Save the image to disk
		var base64Data = req.body.image.replace(/^data:image\/png;base64,/, "");
		fs.writeFile(sessionID + "/" + imageNumber + ".png", base64Data, 'base64', function(err)
		{
			if(err) console.log(err);
		});

		/*var cropCoordinates = req.body.crop;

		//If the user wants the photo cropped
		if(cropCoordinates.x1 != -1)
		{

		}*/

		res.send(JSON.stringify({"status":201}));
	});
}