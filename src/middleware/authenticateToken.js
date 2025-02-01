const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv').config();

const supabaseLink = process.env.SUPABASE_URL || dotenv.parsed.SUPABASE_URL;
const supabaseAuth = process.env.SUPABASE_ANON_KEY || dotenv.parsed.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseLink, supabaseAuth);

async function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extract Bearer token

    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const { data, error } = await supabase.auth.getUser(token);
    
    if (error || !data.user) {
        return res.status(403).json({ error: 'Invalid or expired token' });
    }

    req.user = data.user; // Attach user info to request
    next();
}

module.exports = authenticateToken;
