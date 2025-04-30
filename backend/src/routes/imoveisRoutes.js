const express = require('express');
const router = express.Router();
const imovelController = require('../controllers/imoveisController');

router.get('/imoveis', imovelController.listarImoveis);
router.put('/favorito/:id', imovelController.atualizarFavorito);

module.exports = router;