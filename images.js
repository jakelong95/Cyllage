module.exports = function(app, sessions)
{
	app.post("/images", function(req, res)
	{
		console.log(req.body);
		console.log(req.test);
		res.send("OK");
	});
}