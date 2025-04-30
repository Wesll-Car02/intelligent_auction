const Imovel = require('../models/Imovel');

exports.listarImoveis = async (req, res) => {
    try {
        const imoveis = await Imovel.findAll();
        res.json(imoveis);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.atualizarFavorito = async (req, res) => {
    try {
        await Imovel.updateFavorito(req.params.id, req.body.favorito);
        res.status(200).send('Favorito atualizado');
    } catch (error) {
        res.status(500).send(error.message);
    }
};