const corsOptions = {
  origin: function (origin, callback) {
    // İzin verilen origins listesi
    const whiteList = ["http://localhost:3000", "http://localhost:5173"];

    if (whiteList.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("CORS politikası tarafından engellendiniz"));
    }
  },
  allowedHeader: ["Content-Type", "Authorization"],
  credentials: true,
};

module.exports = corsOptions;
