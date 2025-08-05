const User =require("../models/user.js");
const bcrypt =require('bcryptjs');
const  generateToken  =require('../lib/utils.js');
const cloudinary=require('../lib/cloudinary.js');

// sign up new user
const signUp = async (req, res) => {
    const { fullName, email, password, bio } = req.body;
    try {
        if (!fullName || !email || !password || !bio) {
            return res.json({ success: false, message: "Missing Details" });
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.json({ success: false, message: "User Already Exists" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({ fullName, email, password: hashedPassword, bio });

        const token = await generateToken(newUser._id);
        res.json({ success: true, userData: newUser, token: token, message: "Account is Created Successfully" })

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}


// login user

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userData = await User.findOne({ email });

        if (!userData) {
            return res.json({ success: false, message: "Invalid Credentials" });
        }

        const isPasswordValid = await bcrypt.compare(password, userData.password);
        if (!isPasswordValid) {
            return res.json({ success: false, message: "Invalid Credentials" })
        }

        const token = await generateToken(userData._id);
        res.json({ success: true, userData: userData, token: token, message: "User Logged-in Successfully" })

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }

}

// controller to check user is authenticated
const checkAuth = (req, res) => {
    res.json({ success: true, user: req.user })
}

// update profile
const updateProfile = async (req, res) => {
  try {
    const { profilePic, bio, fullName } = req.body;
    const userId = req.user._id;
    let updatedUser;

    if (!profilePic) {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { bio, fullName },
        { new: true }
      );
    } else {
      const upload = await cloudinary.uploader.upload(profilePic);
      updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          profilePic: upload.secure_url,
          bio,
          fullName,
        },
        { new: true }
      );
    }

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.warn(error.message);
    res.json({ success: false, message: error.message });
  }
};


module.exports = { signUp, login, checkAuth, updateProfile };