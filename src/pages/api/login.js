import User from "@/src/models/User";
import connectDb from "@/middleware/mongoose";
var CryptoJS = require("crypto-js");
var jwt = require('jsonwebtoken');


const handler = async (req, res) => {
    if (req.method == "POST") {
      console.log(req.body);
      let user= await User.findOne({email:req.body.email});
      const bytes = CryptoJS.AES.decrypt(user.password, "secret123");
    let decryptedpass =  bytes.toString(CryptoJS.enc.Utf8);
    console.log(decryptedpass);
    if (user) {
        if (req.body.email == user.email && req.body.password == decryptedpass) {
          var token = jwt.sign({ email: user.email, name: user.name }, 'jwtsecret',{
            expiresIn:"20min"
          });
          res
            .status(200)
            .json({ success: true, token});
            
        } else {
          res.status(200).json({ success: false, error: "Invalid Credentials!" });
        }
      }
       else {
        res.status(200).json({ success: false, error: "No User Found!" });
      }
    }
     else {
      res.status(400).json({ error: "Bad Request!" });
    }
  };
  export default connectDb(handler);
