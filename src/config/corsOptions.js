const allowedOrigins = [
  "http://127.0.0.1:5000",
  // "https://www.wemart.ng",
  // "https://wemart.ng",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
      db.loadOrigins(function (error, origins) {
        callback(error, origins);
      });
    } else {
      callback(new Error("Not allowed by cors"));
    }
  },
  Credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  optionsSuccessStatus: 200,
};

module.exports = corsOptions;
