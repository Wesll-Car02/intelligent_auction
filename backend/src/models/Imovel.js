const db = require('../config/database');

class Imovel {
    static async findAll() {
        const [rows] = await db.query('SELECT * FROM ofertasleiloesimoveis');
        return rows;
    }

    static async updateFavorito(id, favorito) {
        await db.query(
            'UPDATE ofertasleiloesimoveis SET favorito = ? WHERE id = ?',
            [favorito, id]
        );
    }
}

module.exports = Imovel;