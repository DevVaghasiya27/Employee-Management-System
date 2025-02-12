import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import bcrypt from 'bcrypt';

const login = async (req, res) => {
      try{
        const {email, password} = req.body;
        console.log("============req.body=========",req.body);
        const user = await User.findOne({email})
        console.log("=========user============",user);
        console.log("=======user.password==============",user.password);
        if(!user){
           return res.status(404).json({success: false, error: "User Not Found"})
        }

        const isMatch = await bcrypt.compare(password, user.password)
        console.log("===================isMatched================",isMatch);
        
        if(!isMatch){
           return res.status(404).json({success: false, error: "Wrong Password"})
        }

        const token = jwt.sign(
            {_id: user._id, role: user.role},
            process.env.JWT_KEY,
            { expiresIn: '10d' }
        );
        console.log("=========token=========",token);

        return res.status(200).json({
            success: true, 
            token,
            user: {_id: user._id, name: user.name, role: user.role},
        });
    } catch(error) {
        // console.log(error)
        return res.status(500).json({success: false, error: error.message});
    }
}

const verify = (req, res) => {
    return res.status(200).json({success: true, user: req.user})
}

export  { login, verify }