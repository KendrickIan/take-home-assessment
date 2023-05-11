import express from 'express';
import pool from '../db.js';
import { authenticateToken } from '../middleware/authorization.js';
import jwt from 'jsonwebtoken';
import {jwtTokens} from '../utils/jwt-helpers.js';
import request from 'request';

const router = express.Router();

/* Display user details and wallet balance API Definition */
router.get('/', authenticateToken, (req, res) => {
    try {
        jwt.verify(req.cookies.refresh_token, process.env.REFRESH_TOKEN_SECRET, async (error, user) => { //verify token then get user_id of current user
            if(error) return res.status(403).json({error: error.message});
            let tokens = jwtTokens(user);
            res.cookie('refresh_token', tokens.refreshToken, {httpOnly: true});
            const userId = tokens.user_id; 

            const walletInfo = await pool.query( //query to get user details and wallet balance
                `SELECT 
                    u.user_id, 
                    uw.wallet_id,
                    u.user_name,
                    u.user_email,
                    uw.balance
                FROM wallet AS uw
                INNER JOIN users AS u
                ON uw.user_id = u.user_id
                WHERE u.user_id = '${userId}'`
            );
            res.status(200).json(walletInfo.rows[0]);
        });
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

/* Add money API Definition */
router.post('/cash-in', authenticateToken, (req, res) => {
    try {
        jwt.verify(req.cookies.refresh_token, process.env.REFRESH_TOKEN_SECRET, async (error, user) => { //verify token then get user_id of current user
            if(error) return res.status(403).json({error: error.message});
            let tokens = jwtTokens(user);
            res.cookie('refresh_token', tokens.refreshToken, {httpOnly: true});
            const userId = tokens.user_id;

            const cashInAmount = req.query.amount; //get cash in amount provided in API request

            const walletInfo = await pool.query( //query to get wallet of current user
                `SELECT wallet_id, balance FROM wallet WHERE user_id = '${userId}'`
            );
            const walletId = walletInfo.rows[0].wallet_id; //get wallet_id then assign to 'walletId' variable

            let updatedBalance = Number(walletInfo.rows[0].balance) + Number(cashInAmount); //get sum of cash in amount and current balance
            const finalBalance = updatedBalance.toFixed(2); //format the sum 2 decimal places

            const cashInTxn = await pool.query( //query for new cash-in transaction data
                'INSERT INTO transaction_cash_in (wallet_id, updated_balance) VALUES ($1, $2) RETURNING *',
                [walletId, finalBalance]
            );

            await pool.query( //query to reflect updated balance in wallet table
                `UPDATE wallet
                SET balance = $1
                WHERE user_id = $2`,
                [finalBalance, userId]
            );
            res.status(201).json({
                wallet_info: walletInfo.rows[0],
                cash_in_amount: cashInAmount,
                cash_in_transaction: cashInTxn.rows[0]
            });
        });
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

/* Debit money API Definition */
router.post('/debit', authenticateToken, (req, res) => {
    try {
        jwt.verify(req.cookies.refresh_token, process.env.REFRESH_TOKEN_SECRET, async (error, user) => { //verify token then get user_id of current user
            if(error) return res.status(403).json({error: error.message});
            let tokens = jwtTokens(user);
            res.cookie('refresh_token', tokens.refreshToken, {httpOnly: true});
            const userId = tokens.user_id;

            const debitAmount = req.query.amount; //get debit amount provided in API request

            const walletInfo = await pool.query( //query to get wallet of current user
                `SELECT wallet_id, balance FROM wallet WHERE user_id = '${userId}'`
            );
            const walletId = walletInfo.rows[0].wallet_id; //get wallet_id then assign to 'walletId' variable

            let updatedBalance = Number(walletInfo.rows[0].balance) - Number(debitAmount); //get difference of debit amount and current balance
            const finalBalance = updatedBalance <= 0 ? 0 : updatedBalance.toFixed(2); //format the sum 2 decimal places

            if(finalBalance === 0) return res.status(200).json({message: "Insufficient balance"}); //validation if insufficient balance

            const debitTxn = await pool.query( //query for new cash-in transaction data
                'INSERT INTO transaction_debit (wallet_id, updated_balance) VALUES ($1, $2) RETURNING *',
                [walletId, finalBalance]
            );

            await pool.query( //query to reflect updated balance in wallet table
                `UPDATE wallet
                SET balance = $1
                WHERE user_id = $2`,
                [finalBalance, userId]
            );
            res.status(201).json({
                wallet_info: walletInfo.rows[0],
                debit_amount: debitAmount,
                debit_transaction: debitTxn.rows[0]
            });
        });
    } catch (error) {
        
    }
});

export default router;