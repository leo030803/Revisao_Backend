import express from 'express'
import mysql from 'mysql2/promise'

const app = express()
app.use(express.json())

const dbConfig = {
  host: 'benserverplex.ddns.net',
  user: 'alunos',
  password: 'senhaAlunos',
  database: 'web_03ta'
}

const pool = mysql.createPool(dbConfig)

app.get('/', (req, res) => {
  res.json({ message: 'API de products online' })
})

// CRUD => CREATE
app.post('/products', async (req, res) => {
  try {
    const { name, price, description, category } = req.body

    if (!name || price === undefined) {
      return res.status(400).json({ message: 'name e price sao obrigatorios' })
    }

    const [result] = await pool.query(
      'INSERT INTO products (name, price, description, category) VALUES (?, ?, ?, ?)',
      [name, price, description ?? null, category ?? null]
    )

    return res.status(201).json({
      id: result.insertId,
      name,
      price,
      description: description ?? null,
      category: category ?? null
    })
  } catch (error) {
    console.error('Erro ao criar produto:', error)
    return res.status(500).json({ message: 'Erro interno ao criar produto' })
  }
})

// CRUD => READ
app.get('/products', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products ORDER BY id DESC')
    return res.json(rows)
  } catch (error) {
    console.error('Erro ao listar produtos:', error)
    return res.status(500).json({ message: 'Erro interno ao listar produtos' })
  }
})
// CRUD => DELETE
app.delete('/products/:id', async (req, res) => {
  try {
    const { id } = req.params
    const [result] = await pool.query('DELETE FROM products WHERE id = ?', [id])

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Produto nao encontrado' })
    }

    return res.json({ message: 'Produto removido com sucesso' })
  } catch (error) {
    console.error('Erro ao remover produto:', error)
    return res.status(500).json({ message: 'Erro interno ao remover produto' })
  }
})

const PORT = 3000

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})
