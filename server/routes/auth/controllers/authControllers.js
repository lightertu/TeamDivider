/**
 * Created by rui on 5/9/17.
 */


module.exports = {
    loginController: function(req, res, next) {
        console.log("triggered");
        res.send("logged in");
    },

    signupController: function(req, res, next) {
        res.send("signed up");
    },
};