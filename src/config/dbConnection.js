const dbConnection = (db) => {
	db.connect(process.env.MONGODB_URL).then(() => console.log('Database connection made...'))
	.catch(err => console.log(err.message));
}

module.exports = dbConnection;