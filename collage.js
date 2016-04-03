var gm = require("gm");
var fs = require("fs");

module.exports = function(app, sessions)
{	
	app.get("/collage", function(req, res)
	{
		var layers = new Array(); //Stores filenames for each layer
		var session = sessions.get(req.query.session);

		/*var createCollage = function()
		{
			var collageName = req.query.session + "/collage.png";
			var processed = 0;

			gm(req.query.height, req.query.width, "#000000").write(collageNam, function(err)
			{
				if(err) console.log(err);

				//Combine each of the layers
				layers.forEach(function(item)
				{

					processed++;
					if(processed >= layers.length)
					{
						//Load the image and convert it
						 fs.readFile(collageName, function(err, data)
						 {
						 	var base64 = new Buffer(data, "binary").toString("base64");
						 	var response = {status: 200, image: base64};
						 	res.send(JSON.stringify(response));
						 	deleteFolderRecursive(req.query.session);
						 });
					}
				});
			});
		}*/

		gm(req.query.height, req.query.width, "#000000").write(req.query.session + "/layer0.png", function(err)
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
				gm(req.query.height, req.query.width, "#000000").write(fileName, function(err)
				{
					if(err) console.log(err);
				});
				layers.push(fileName);
			}

			var imageFile = item.file;
			gm(imageFile).size(function(err, size)
			{
				if(!err)
				{
					console.log(imageFile + " " + layers[item.layer]);
					gm(imageFile).draw("image over " + item.position.x + "," + 
						item.position.y + " " + size.width + "," + size.height +
						" " + layers[item.layer]).write(layers[item.layer], function(err)
						{
							if(err) console.log(err);
						});

					session.processed++;
					if(session.processed >= session.imgs.length)
					{
						console.log("Done");
						//createCollage();
						//TODO Remove the session from sessions
					}

					sessions.set(req.query,session, session);
				}
			});
		});
	});


	
	/*
	.draw(['image Over 0,0 0,0 /Users/malik/Desktop/target/nike-global-diversity-logo.png'])
	create an array of layers
	var session = sessions.get(sessionID) //session id from query parameter
	for each img in session.imgs
		format will be:
			{
 	        	file: the file for the image,
   				layer: the layer the image is on,
    			position: {x:int,y:int},
    			rotate: int in degrees
    		}
    		if layer is > layers.size
    			add a new layer

    		draw the image on the layer at the position with the rotation
    		//the layer needs to be saved to disc

    draw each layer on each other in the specified order
}	*/
}

function deleteFolderRecursive(path)
{
  if( fs.existsSync(path) ) {
    fs.readdirSync(path).forEach(function(file,index){
      var curPath = path + "/" + file;
      if(fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};