const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.JWT_KEY); //decoding the jwt token which has the email and userId of the user
        req.userData = {email: decodedToken.email, userId: decodedToken.userId}; //userData is added to the request to use it for adding/updating/deleting a post for that
        //specific user alone
        next();

    } catch (error) {
        return res.status(401).json({"message": "Auth Failed"});
    }
};