const dotenv = require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Create a single supabase client for interacting with your database

// const bucketName = process.env.SUPABASE_BUCKET_NAME || dotenv.parsed.SUPABASE_BUCKET_NAME;
const supabaseLink = process.env.SUPABASE_URL || dotenv.parsed.SUPABASE_URL;
const supabaseAuth = process.env.SUPABASE_ANON_KEY || dotenv.parsed.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseLink, supabaseAuth)

// Get all the files from bucket
async function getBookmarks(user_id) {
    const { data, error } = await supabase
        .from("bookmarks")
        .select()
        .eq("user_id", user_id);
    if (error) {
        throw error;
    }
    return data;
}

async function addBookmark(request) {
    // Inserts a bookmark into the database
    const { user_id } = request.params;
    const { content_url, content_title, content_description, content_thumbnail_url } = request.body;
    const { data, error } = await supabase
        .from("bookmarks")
        .insert({
            user_id: user_id,
            url: content_url,
            title: content_title,
            description: content_description,
            image_url: content_thumbnail_url
        });

    if (error) {
        throw error;
    }
    return data;
}

async function deleteBookmark(bookmark_id) {
    const { data, error } = await supabase
        .from("bookmarks")
        .delete()
        .eq('id', bookmark_id);

    if (error) {
        throw error;
    }
    return data;
}

exports.getBookmarks = getBookmarks;
exports.addBookmark = addBookmark;
exports.deleteBookmark = deleteBookmark;