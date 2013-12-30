

module.exports = function(){
	var development = {
		"serverUrl": "http://localhost",
		"port": 8080,
		"mongoUrl": "mongodb://localhost/baiban"
	},
	production = {
		"serverUrl": "http://baiban.herokuapp.com",
		"port": process.env.PORT,
		"mongoUrl": process.env.MONGO_URL	
	};

	switch(process.env.NODE_ENV){
		case 'development':
			return development;

		case 'production':
			return production;

		default:
			return production;
	}
};

