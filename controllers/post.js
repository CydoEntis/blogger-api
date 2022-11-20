import { db } from "../db.js";

const getPosts = (req, res) => {
    const category = req.query.cat;
    const query = category
        ? "SELECT * FROM posts WHERE cat=?"
        : "SELECT * FROM posts";

    db.query(query, [category], (err, data) => {
        if (err) return res.json(err);

        return res.status(200).json(data);
    });
};

const getPost = (req, res) => {
    res.json("Post from controller");
};

const addPost = (req, res) => {
    res.json("Post from controller");
};

const deletePost = (req, res) => {
    res.json("Post from controller");
};

const updatePost = (req, res) => {
    res.json("Post from controller");
};

export { getPosts, getPost, addPost, deletePost, updatePost };
