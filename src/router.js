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

router.get('/:user_id/searchManga', authenticateToken, async (req, res) => {
    if (req.params.user_id !== req.user.id) {
        return res.status(403).json({ error: "Access denied" });
    }

    const { title } = req.query;  // Get manga name from query

    if (!title) return res.status(400).json({ error: "Manga title is required" });

    try {
        const url = `https://api.mangadex.org/manga?title=${encodeURIComponent(title)}&includes[]=cover_art`
        const response = await fetch(url);
        const data = await response.json();

        if (data && data.data) {
            // array of manga results
            const results = data.data.map((manga) => {
                const cover = manga.relationships.find((rel) => rel.type === "cover_art");
                const coverFileName = cover?.attributes?.fileName;
                const coverUrl = coverFileName
                    ? `https://uploads.mangadex.org/covers/${manga.id}/${coverFileName}`
                    : null;

                const mangaUrl = `https://mangadex.org/title/${manga.id}`;

                return {
                    id: manga.id,
                    title: manga.attributes.title.en || "No English Title",
                    description: manga.attributes.description.en || "No English Description Available",
                    image_url: coverUrl,
                    url: mangaUrl
                }
            });

            res.status(200).json({ status: "Success", data: results });
        }
    } catch (error) {
        res.status(500).json({ status: "Failed", error: error.message });
    }
});

router.get('/mangadex-cover', async (req, res) => {
    const coverUrl = req.query.url;  // Get the image URL from the query parameter
    try {
        const response = await fetch(coverUrl);  // Fetch the image from MangaDex
        const buffer = await response.buffer();
        res.set('Content-Type', 'image/png'); // Set appropriate content type
        res.send(buffer);  // Send the image back to the frontend
    } catch (error) {
        res.status(500).send('Failed to fetch image');
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