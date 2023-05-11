
-- follow these steps in terminal to set up the database --

-- * to access postgres (requires password)
--psql -U postgres
-- * then create database by copying query below
CREATE DATABASE assessment; --right click on terminal to paste the copied query


-- * to access newly created database, run command below
--\c assessment


-- * once inside database, run the following queries in order:
CREATE EXTENSION IF NOT EXISTS "uuid-ossp"; --1st query (only need if initializing the database)

CREATE TABLE users (
    user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_name TEXT NOT NULL,
    user_email TEXT NOT NULL UNIQUE,
    user_password TEXT NOT NULL
); --2nd query

CREATE TABLE wallet (
    wallet_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid ,
    balance NUMERIC NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(user_id)
); --3rd query

CREATE TABLE transaction_cash_in (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_id uuid,
    updated_balance NUMERIC,
    FOREIGN KEY(wallet_id) REFERENCES wallet(wallet_id)
); --4th query

CREATE TABLE transaction_debit (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_id uuid,
    updated_balance NUMERIC,
    FOREIGN KEY(wallet_id) REFERENCES wallet(wallet_id)
); --5th query



-- * this command will list all tables in the current database
--\dt