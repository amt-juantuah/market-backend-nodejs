const JWT = require('jsonwebtoken');

// users should be able to do certain things
// like update their records and others
// but this middleware will check if they have a
// valid token to do that
const tokenMiddleware = ( req, res, next ) => {
  // access the token from the request headers

  const token = req.headers.token;

  const authToken = token ? token.split(" ")[1] : undefined;
  if (!authToken) {
    res.status(401).json({
      success: false,
      message: "Client not authenticated. No Token Provided",
      error: "Unauthenticated!",
    });
  } else {
    // verify the token provided
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
        if (req.user.id !== req.params.id) {
          res.status(500).json({
            success: false,
            message: "Client not authenticated. Wrong ID provided",
            reason: "id is not correct",
          });
        } else {
          next();
        }
      }
    });
  }
}

// admins should be able to do certain things
// like add products and delete products and others
// but this middleware will check if they have a
// valid token to do that and if they are admins indeed
const adminAndTokenMiddleware = ( req, res, next ) => {
    tokenMiddleware(req, res, () => {
        if (req.user.isAdmin) {
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

module.exports = { tokenMiddleware, adminAndTokenMiddleware }; 