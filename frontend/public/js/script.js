document.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch('http://backend:3000/api/imoveis');
    const imoveis = await response.json();
    
    const tbody = document.querySelector('#tabela-imoveis tbody');
    
    imoveis.forEach(imovel => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${imovel.bairro}</td>
            <td>${imovel.tipoimovel}</td>
            <td>${imovel.tipoleilao}</td>
            <td>R$ ${imovel.valor.toFixed(2)}</td>
            <td>${imovel.endereco}</td>
            <td>
                <span class="favorito" data-id="${imovel.id}">
                    ${imovel.favorito ? '★' : '☆'}
                </span>
            </td>
        `;
        tbody.appendChild(row);
    });

    document.querySelectorAll('.favorito').forEach(star => {
        star.addEventListener('click', async () => {
            const id = star.dataset.id;
            const isFavorito = star.textContent.trim() === '★';
            
            await fetch(`http://backend:3000/api/favorito/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ favorito: isFavorito ? 0 : 1 })
            });
            
            star.textContent = isFavorito ? '☆' : '★';
        });
    });
});