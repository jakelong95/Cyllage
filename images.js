module.exports = function(app, sessions)
{
	app.post("/images", function(req, res)
	{
		res.write(req.body);
		res.end();
	});
}