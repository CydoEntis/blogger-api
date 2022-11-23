import { db } from "../db.js";
import jwt from "jsonwebtoken";

const getPosts = (req, res) => {
    const category = req.query.cat;
    const query = category
        ? "SELECT * FROM posts WHERE cat=?"
        : "SELECT * FROM posts";

    db.query(query, [category], (err, data) => {
        if (err) return res.status(500).json(err);

        return res.status(200).json(data);
    });
};

const getPost = (req, res) => {
    const id = req.params.id;
    console.log(id);
    const query =
        "SELECT p.id, `username`, `title`, `desc`, p.img, u.img AS userImg, `cat`,`date` FROM users u JOIN posts p ON u.id = p.uid WHERE p.id = ? ";

    db.query(query, [id], (err, data) => {
        if (err) return res.status(500).json(err);

        return res.status(200).json(data[0]);
    });
};

const addPost = (req, res) => {
    const token = req.cookies.access_token;
    if (!token) return res.status(401).json("Not authenticated");

    jwt.verify(token, "jwtkey", (err, userInfo) => {
        const { title, desc, img, cat, date } = req.body;
        if (err) return res.status(403).json("Token is not valid");

        const query =
            "INSERT INTO posts(`title`, `desc`, `img`, `cat`, `date`, `uid`) VALUES (?)";

        const values = [title, desc, img, cat, date, userInfo.id];

        db.query(query, [values], (err, data) => {
            if (err) return res.status(500).json(err);

            return res.status(200).json("Post has been created");
        });
    });
};

const deletePost = (req, res) => {
    const token = req.cookies.access_token;
    if (!token) return res.status(401).json("Not authenticated");

    jwt.verify(token, "jwtkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid");

        const postId = req.params.id;
        const query = "DELETE FROM posts WHERE `id` = ? AND `uid` = ?";

        db.query(query, [postId, userInfo.id], (err, data) => {
            if (err)
                return res.status(403).json("You can only delete your post");

            return res.json(`Post with id: ${postId} has been deleted`);
        });
    });
};

const updatePost = (req, res) => {
    const token = req.cookies.access_token;
    if (!token) return res.status(401).json("Not authenticated");

    jwt.verify(token, "jwtkey", (err, userInfo) => {
        const { title, desc, img, cat } = req.body;
        if (err) return res.status(403).json("Token is not valid");
        const postId = req.params.id;
        const query =
            "UPDATE posts SET `title`=?, `desc`=?, `img`=?, `cat`=? WHERE `id` = ? AND `uid` = ?";

        const values = [title, desc, img, cat];

        db.query(query, [...values, postId, userInfo.id], (err, data) => {
            if (err) return res.status(500).json(err);

            return res.status(200).json("Post has been updated");
        });
    });
};

export { getPosts, getPost, addPost, deletePost, updatePost };
