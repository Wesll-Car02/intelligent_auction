-- Criar o banco de dados se ele não existir
CREATE DATABASE IF NOT EXISTS dbleilao;

-- Selecionar o banco de dados
USE dbleilao;

-- Criar a tabela se ela não existir
CREATE TABLE IF NOT EXISTS ofertasleiloesimoveis (
  id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  idleilao bigint(20) unsigned NOT NULL,
  bairro varchar(120) NOT NULL,
  tipoimovel varchar(60) NOT NULL,
  tipoleilao varchar(60) NOT NULL,
  descricao varchar(255) NOT NULL,
  valor decimal(15,2) NOT NULL,
  endereco varchar(255) NOT NULL,
  favorito tinyint(1) DEFAULT 0,
  link varchar(512) NOT NULL,
  datacriacao timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (id),
  UNIQUE KEY idleilao (idleilao)
) ENGINE=InnoDB AUTO_INCREMENT=555 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Você pode adicionar mais comandos SQL aqui se precisar (ex: criar outras tabelas, inserir dados iniciais)
-- Exemplo:
-- INSERT INTO ofertasleiloesimoveis (idleilao, bairro, tipoimovel, tipoleilao, descricao, valor, endereco, link) VALUES
-- (12345, 'Centro', 'Apartamento', 'Judicial', 'Apto bem localizado', 150000.00, 'Rua Exemplo, 123', 'http://exemplo.com/leilao1');