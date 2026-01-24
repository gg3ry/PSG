import express from 'express'
import cors from 'cors'
import { createPool } from 'mysql2/promise'
import argon from 'argon2'
import jwt from 'jsonwebtoken'

const app = express();
app.use(express.json());
app.use(cors());

const port = 3002

const pool = createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "games"
})