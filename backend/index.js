// backend/index.js
require('dotenv').config();           // Carrega variáveis de ambiente de um arquivo .env (opcional)
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const DB_HOST = process.env.DB_HOST || 'db';        // Host do container do MySQL (serviço 'db')
const DB_PORT = process.env.DB_PORT || 3306;
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || 'example';
const DB_DATABASE = process.env.DB_DATABASE || 'leiloes';

// Criar pool de conexões com MariaDB/MySQL
const pool = mysql.createPool({
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
});

// Criação da tabela se não existir
const createTable = async () => {
  const tableSQL = `
    CREATE TABLE IF NOT EXISTS ofertasleiloesimoveis (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
      idleilao BIGINT UNSIGNED NOT NULL,
      bairro VARCHAR(120) NOT NULL,
      tipoimovel VARCHAR(60) NOT NULL,
      tipoleilao VARCHAR(60) NOT NULL,
      descricao VARCHAR(255) NOT NULL,
      valor DECIMAL(15,2) NOT NULL,
      endereco VARCHAR(255) NOT NULL,
      favorito TINYINT(1) DEFAULT 0,
      link VARCHAR(512) NOT NULL,
      datacriacao TIMESTAMP NOT NULL DEFAULT current_timestamp(),
      PRIMARY KEY (id),
      UNIQUE KEY (idleilao)
    );
  `;
  await pool.query(tableSQL);
};

// Iniciar servidor após criar tabela
createTable()
  .then(() => {
    console.log('Tabela pronta no banco de dados.');
    app.listen(PORT, () => {
      console.log(`Backend rodando na porta ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Erro ao conectar/criar tabela no banco:', err);
    process.exit(1);
  });

// Endpoint GET /ofertas - retorna todas as ofertas ordenadas por data de criação (descendente)
app.get('/ofertas', async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM ofertasleiloesimoveis ORDER BY datacriacao DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error('Erro ao buscar ofertas:', err);
    res.status(500).json({ error: 'Erro ao buscar ofertas' });
  }
});

// Endpoint PATCH /ofertas/:idleilao/favorito - alterna o campo 'favorito'
app.patch('/ofertas/:idleilao/favorito', async (req, res) => {
  const idleilao = req.params.idleilao;
  try {
    // Alterna favorito usando operação aritmética (1 - favorito)
    const [updateResult] = await pool.query(
      "UPDATE ofertasleiloesimoveis SET favorito = 1 - favorito WHERE idleilao = ?",
      [idleilao]
    );
    if (updateResult.affectedRows === 0) {
      // Se não encontrou oferta com esse idleilao
      return res.status(404).json({ error: 'Oferta não encontrada' });
    }
    // Recupera o novo valor de favorito
    const [rows] = await pool.query(
      "SELECT favorito FROM ofertasleiloesimoveis WHERE idleilao = ?",
      [idleilao]
    );
    res.json({ idleilao: idleilao, favorito: rows[0].favorito });
  } catch (err) {
    console.error('Erro ao atualizar favorito:', err);
    res.status(500).json({ error: 'Erro ao atualizar favorito' });
  }
});
