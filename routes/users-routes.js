import express from 'express';
import pool from '../db.js';
import bcrypt from 'bcrypt';
import { authenticateToken } from '../middleware/authorization.js';


const router = express.Router();

/* Get all users from DB API Definition */
router.get('/', authenticateToken, async (req, res) => {
    try {
        const users = await pool.query('SELECT * FROM users');
        res.status(200).json({users : users.rows});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

/* Signup user API Definition */
router.post('/', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10); //function to hash password
        const newUser = await pool.query(
            'INSERT INTO users (user_name, user_email, user_password) VALUES ($1, $2, $3) RETURNING *', 
            [req.body.name, req.body.email, hashedPassword]
        );

        const userId = newUser.rows[0].user_id; //get unique ID of created user then assign value to 'userId'
        const userWallet = await pool.query(
            'INSERT INTO wallet (user_id, balance) VALUES ($1, $2) RETURNING *',
            [userId, req.body.balance]
        );

        res.json({
            new_user: newUser.rows[0],
            wallet_info: userWallet.rows[0]
        });
    } catch (error) {
        res.status(500).json({error: error.message});
    }
})

export default router;