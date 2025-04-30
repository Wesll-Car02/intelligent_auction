// frontend/src/App.js
import React, { useState, useEffect } from 'react';

function App() {
  const [ofertas, setOfertas] = useState([]);

  // Carrega ofertas do backend ao montar o componente
  useEffect(() => {
    fetch('http://localhost:5000/ofertas')
      .then(response => response.json())
      .then(data => setOfertas(data))
      .catch(error => console.error('Erro ao carregar ofertas:', error));
  }, []);

  // Função para alternar favorito de uma oferta
  const toggleFavorito = async (idleilao) => {
    try {
      const res = await fetch(`http://localhost:5000/ofertas/${idleilao}/favorito`, {
        method: 'PATCH'
      });
      if (res.ok) {
        const result = await res.json();
        // Atualiza o estado local para refletir nova informação
        setOfertas(ofertas.map(oferta =>
          oferta.idleilao === idleilao
            ? { ...oferta, favorito: result.favorito }
            : oferta
        ));
      }
    } catch (error) {
      console.error('Erro ao atualizar favorito:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Ofertas de Imóveis em Leilão</h1>

      {/* Filtros (apenas UI, não funcionais) */}
      <div className="flex gap-4 mb-4">
        <select className="border rounded px-2 py-1">
          <option>Bairro</option>
          {/* ... opções estáticas ... */}
        </select>
        <select className="border rounded px-2 py-1">
          <option>Tipo de Imóvel</option>
          {/* ... */}
        </select>
        <select className="border rounded px-2 py-1">
          <option>Tipo de Leilão</option>
          {/* ... */}
        </select>
      </div>

      {/* Tabela de ofertas */}
      <table className="min-w-full bg-white border">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border">Bairro</th>
            <th className="py-2 px-4 border">Tipo Imóvel</th>
            <th className="py-2 px-4 border">Tipo Leilão</th>
            <th className="py-2 px-4 border">Descrição</th>
            <th className="py-2 px-4 border">Valor</th>
            <th className="py-2 px-4 border">Endereço</th>
            <th className="py-2 px-4 border">Favorito</th>
            <th className="py-2 px-4 border">Link</th>
          </tr>
        </thead>
        <tbody>
          {ofertas.map(oferta => (
            <tr key={oferta.idleilao}>
              <td className="py-1 px-2 border">{oferta.bairro}</td>
              <td className="py-1 px-2 border">{oferta.tipoimovel}</td>
              <td className="py-1 px-2 border">{oferta.tipoleilao}</td>
              <td className="py-1 px-2 border">{oferta.descricao}</td>
              <td className="py-1 px-2 border">R$ {oferta.valor.toFixed(2)}</td>
              <td className="py-1 px-2 border">{oferta.endereco}</td>
              <td className="py-1 px-2 border text-center">
                <span
                  className={"cursor-pointer text-xl " + (oferta.favorito ? 'text-yellow-500' : 'text-gray-400')}
                  onClick={() => toggleFavorito(oferta.idleilao)}
                >
                  {oferta.favorito ? '★' : '☆'}
                </span>
              </td>
              <td className="py-1 px-2 border text-center">
                {/* Exibe o link como ícone ou texto */}
                <a href={oferta.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Ver</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
