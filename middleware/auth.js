const jwt = require('jsonwebtoken')
const UserModel = require('../models/user')
const checkAuth = async (req, res, next) => {
    // console.log("hello auth")
    const { token } = req.cookies
    // console.log(token)
    if (!token) {
        return res.status(400).json({
            success: false,
            message: "Unauthorised user please login."
        })
    } else {
        const verifyToken = jwt.verify(token, 'gdaugdasg@1213')
        // console.log(verifyToken)
        const data = await UserModel.findOne({ _id: verifyToken.ID })
        // console.log(data)
        req.userdata = data
        next()
    }

}
module.exports = checkAuth