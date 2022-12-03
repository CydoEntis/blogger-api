import { db } from "../db.js";
import jwt from "jsonwebtoken";

const getPosts = (req, res) => {
    const resultsPerPage = 2;
    const category = req.query.cat;
    let query = category
        ? "SELECT * FROM posts WHERE cat=?"
        : "SELECT * FROM posts";

    db.query(query, [category], (err, data) => {
        console.log("data: ", data);

        console.log("error: ", err);
        const numOfResults = data.length;
        console.log(numOfResults);
        if (numOfResults <= 0) {
            return res.status(404).json({ message: "No records found" });
        }
        const numOfPages = Math.ceil(numOfResults / resultsPerPage);
        let page = req.query.page ? Number(req.query.page) : 1;
        console.log(page);

        if (page > numOfPages) {
            page = numOfPages;
        } else if (page < 0) {
            page = 1;
        }

        const startingLimit = (page - 1) * resultsPerPage;
        // console.log("Starting limit" + startingLimit);
        const category = req.query.cat;
        console.log(category);
        query = category
            ? `SELECT * FROM posts WHERE cat=? LIMIT ${startingLimit}, ${resultsPerPage}`
            : `SELECT * FROM posts LIMIT ${startingLimit}, ${resultsPerPage}`;

        console.log(query);
        db.query(query, [category], (err, data) => {
            console.log(data);

            return res.status(200).json({
                data,
                page,
                numOfPages,
            });
        });
    });
};

const getPost = (req, res) => {
    const id = req.params.id;
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
