const JWT = require('jsonwebtoken');

const tokenMiddleware = ( req, res, next ) => {
  // access the token from the request headers
  const authToken = req.headers.token.split(" ")[1];

  if (!authToken) {
    res.status(401).json({
      success: false,
      message: "Client not authenticated. No Token Provided",
      error: "Unauthenticated!",
    });
  } else {
    console.log("checking jwt verification")
    JWT.verify(authToken, process.env.JWT_SK, (error, data) => {
      if (error) {
        res.status(403).json({
          success: false,
          message:
            "Client not authorized to access resource. Bad Token Provided",
          error: "Forbidden!",
        });
      } else if (data) {
        req.user = data;
        next();
      }
    });
  }
}


const authAndTokenMiddleware = ( req, res, next ) => {
    tokenMiddleware(req, res, () => {
        if (req.user.id === req.params.id && req.user.isAdmin) {
            next();
        } else {
            res.status(403).json({
              success: false,
              message:
                "Client not authorized to access resource. Bad Token Provided or no permission to access resource",
              error: "Forbidden!",
            });
        }
    });
}

module.exports = { tokenMiddleware, authAndTokenMiddleware }; 