const express = require('express');
const router = express.Router();
const authenticateToken = require('./middleware/authenticateToken')
const { getBookmarks, deleteBookmark, addBookmark } = require('./SupabaseService')

// Default
router.get('/', (req, res) => {
    res.status(200).send("Server is online...")
});

// Get all the keys from bucket
router.get('/:user_id/bookmarks/getBookmarks', authenticateToken, async (req, res) => {
    if (req.params.user_id !== req.user.id) {
        return res.status(403).json({ error: "Access denied" });
    }

    try {
        let bookmarks = await getBookmarks(req.user.id);
        res.status(200).json({ status: "Success", bookmarks });
    } catch (error) {
        res.status(500).json({ status: "Failed", error: error.message });
    }
});

router.post('/:user_id/bookmarks/addBookmark', authenticateToken, async (req, res) => {
    if (req.params.user_id !== req.user.id) {
        return res.status(403).json({ error: "Access denied" });
    }

    try {
        let result = await addBookmark(req);
        res.status(200).json({ status: "Success", result });
    }
    catch (error) {
        res.status(500).json({ status: "Failed", error: error.message });
    }
});

router.delete('/:user_id/:bookmark_id/deleteBookmark', authenticateToken, async (req, res) => {
    if (req.params.user_id !== req.user.id) {
        return res.status(403).json({ error: "Access denied" });
    }

    try {
        let result = await deleteBookmark(req.params.bookmark_id);
        res.status(200).json({ status: "Success", result });
    } catch (error) {
        res.status(500).json({ status: "Failed", error: error.message });
    }
});

module.exports = router;