import { db } from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const register = (req, res) => {
    const query = "SELECT * FROM users WHERE email = ? OR username = ?";
    const { email, username, password } = req.body;

    db.query(query, [email, username], (err, data) => {
        if (err) return res.json(err);
        if (data.length) return res.status(409).json("User already exists");

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        const query =
            "INSERT INTO users (`username`, `email`, `password`) VALUES (?)";
        const values = [username, email, hash];

        db.query(query, [values], (err, data) => {
            if (err) return res.json(err);

            return res.status(200).json("User has been created");
        });
    });
};

const login = (req, res) => {
    const { username, password } = req.body;
    const query = "SELECT * FROM users WHERE username = ?";

    db.query(query, [username], (err, data) => {
        if (err) return res.json(err);
        if (data.length === 0) return res.status(404).json("User not found");

        const { password: hashedPassword, id, ...other } = data[0];

        const isPasswordCorrect = bcrypt.compareSync(password, hashedPassword);

        if (!isPasswordCorrect)
            return res.stats(400).json("Wrong username or password");

        const token = jwt.sign({ id: id }, "jwtkey");

        res.cookie("access_token", token, {
            httpOnly: true,
        })
            .status(200)
            .json({ ...other, id });
    });
};

const logout = (req, res) => {
    res.clearCookie("access_token", {
        sameSite: "none",
        secure: true,
    })
        .status(200)
        .json("User has been logged out");
};

export { register, login, logout };
