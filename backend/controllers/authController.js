const User = require("../models/User");

exports.register = async (req, res) => {
    try {

        const user = new User(req.body);

        await user.save();

        res.status(201).json({
            message: "User Registered"
        });

    } catch (err) {

        res.status(500).json(err);

    }
};

exports.login = async (req, res) => {

    const { email, password } = req.body;

    const user = await User.findOne({
        email,
        password
    });

    if (!user) {
        return res.status(400).json({
            message: "Invalid Credentials"
        });
    }

    res.json({
        message: "Login Success",
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            goal: user.goal,
        }
    });
};