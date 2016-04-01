module.exports = function(app, sessions, fs)
{
	app.get("/start", function(req, res)
	{
		var id = generateSessionID();
		
		//Make sure the ID isn't in use
		while(sessions.has(id))
		{
			id = generateSessionID();
		}
		
		//Create a place to store the images as they are uploaded
		var dir = "./" + id;
		if(!fs.existsSync(dir))
		{
			fs.mkdirSync(dir);
		}
		
		res.json({ "status" : 201, "id" : id });
	});
}

//Generates a 10 character alpha-numeric session ID
function generateSessionID()
{
	var id = "";
	var charset = "abcdefghijklmnopqrstuvwxyz0123456789";
	
	for(var i = 0; i < 10; i++)
	{
		id += charset.charAt(Math.floor(Math.random() * charset.length));
	}
	
	return id;
}