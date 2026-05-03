/**
 * @file test-db.js
 * @description Connectivity test to isolate ETIMEDOUT errors.
 */
require('dotenv').config({ quiet: true })

const mysql = require('mysql2/promise')

async function test() {
  const requiredEnv = ['DB_HOST', 'DB_USER', 'DB_NAME']
  const missingEnv = requiredEnv.filter((key) => !process.env[key])

  if (missingEnv.length > 0) {
    console.error(`Missing required environment variables: ${missingEnv.join(', ')}`)
    process.exitCode = 1
    return
  }

  console.log('Checking connection to:', process.env.DB_HOST)

  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: parseInt(process.env.DB_PORT || '3306', 10),
      connectTimeout: 5000, // 5 seconds
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    })

    console.log('Success! Connection established.')
    await conn.end()
  } catch (err) {
    console.error('Connection failed:', err.message)
    if (err.code === 'ETIMEDOUT') {
      console.error("HINT: The server is ignoring your IP. Check 'Remote MySQL' in cPanel.")
    }
    process.exitCode = 1
  }
}

test()
