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
    const id = req.params.id;
    console.log(id);
    const query =
        "SELECT p.id, `username`, `title`, `desc`, p.img, u.img AS userImg, `cat`,`date` FROM users u JOIN posts p ON u.id = p.uid WHERE p.id = ? ";

    db.query(query, [id], (err, data) => {
        if (err) return res.json(err);

        return res.status(200).json(data[0]);
    });
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
