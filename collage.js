module.exports = function(app, sessions)
{
	app.get("/collage", function(req, res)
	{
	//TODO Delete the session from sessions, also delete the images and directory

	/*
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
	});
}