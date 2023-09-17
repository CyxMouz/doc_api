const passport = require("./passport");

//const jwt = require("jsonwebtoken");
const requireAuth = passport.authenticate("jwt", { session: false });

// const verifyToken = (req, res, next) => {
//   // Get the token from the request headers or query string or wherever you are sending it
//   const token = req.headers.authorization || req.query.token;

//   if (!token) {
//     return res.status(401).json({ message: "Token not provided" });
//   }

//   // Verify and decode the token using the secret key
//   jwt.verify(token, process.env.SECRETKEY, (err, decoded) => {
//     if (err) {
//       return res.status(401).json({ message: "Token verification failed" });
//     }
//     req.token = decoded;
//     console.log(req.token);
//     next();
//   });
// };

module.exports = requireAuth;
