// frontend/src/components/OfertaTable.jsx
// Corrected SHOW_DELAY timer, larger size, positioning above mouse.
import React, { useState, useRef, useCallback, useEffect } from 'react';
import ReactDOM from 'react-dom'; // Necessário para createPortal
import { toggleFavoritoStatus } from '../services/api';

// --- Constantes para o tamanho do Preview ---
const PREVIEW_WIDTH = 1024; // Tamanho aumentado
const PREVIEW_HEIGHT = 768; // Tamanho aumentado
// --- Constantes para os Timers (em milissegundos) ---
const SHOW_DELAY = 1000; // 1 segundo para mostrar
const STICKY_DELAY = 3000; // 3 segundos *total* para ficar sticky
const HIDE_DELAY = 100; // Pequeno atraso para esconder ao sair do link (se não for sticky)
// --- Constante para o offset (distância do mouse e da borda) ---
const MOUSE_OFFSET = 15; // Distância do cursor
const EDGE_OFFSET = 10; // Distância mínima das bordas da janela

// --- Componente PreviewBox (Renderizado via Portal) ---
const PreviewBox = ({ url, position, onMouseEnter, onMouseLeave }) => {
    if (!position) return null;
    const portalRoot = document.getElementById('preview-portal');
    if (!portalRoot) {
        console.error("Elemento #preview-portal não encontrado no DOM.");
        return null;
    }

    // Define o estilo incluindo o tamanho explicitamente
    const previewStyle = {
        top: `${position.top}px`,
        left: `${position.left}px`,
        width: `${PREVIEW_WIDTH}px`, // Aplica largura via style
        height: `${PREVIEW_HEIGHT}px`, // Aplica altura via style
    };
    console.log("[PreviewBox] Rendering with style:", previewStyle); // Log para verificar estilo

    return ReactDOM.createPortal(
        <div
            style={previewStyle} // Aplica o estilo calculado
            // Classes Tailwind para posicionamento fixo, z-index e aparência geral
            className={`fixed z-50 bg-white border border-gray-400 rounded-md shadow-xl overflow-hidden cursor-grab`}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <iframe
                src={url}
                title={`Preview de ${url}`}
                className="w-full h-full border-0 pointer-events-auto"
                onError={(e) => console.warn(`Erro ao carregar iframe para ${url}:`, e)}
            >
                Seu navegador não suporta iframes ou o site de destino bloqueou o carregamento (X-Frame-Options).
            </iframe>
        </div>,
        portalRoot
    );
};


// --- Componente OfertaRow (Linha da Tabela) ---
const OfertaRow = ({ oferta, onToggleFavorito }) => {
    const [showPreview, setShowPreview] = useState(false);
    const [previewUrl, setPreviewUrl] = useState('');
    const [isPreviewSticky, setIsPreviewSticky] = useState(false);
    const [previewPosition, setPreviewPosition] = useState(null);

    const showTimerRef = useRef(null);
    const stickyTimerRef = useRef(null);
    const hideTimerRef = useRef(null);

    const handleFavoritoClick = async () => {
        try {
            const response = await toggleFavoritoStatus(oferta.id);
            onToggleFavorito(response.data.id, response.data.favorito);
        } catch (error) {
            console.error(`Erro ao atualizar favorito para ID ${oferta.id}:`, error);
            alert('Não foi possível atualizar o status de favorito. Tente novamente.');
        }
    };

    // --- Lógica de Hover e Sticky Atualizada ---
    const handleMouseEnterLink = useCallback((event, url) => {
        // Limpa timers anteriores para evitar múltiplas execuções
        clearTimeout(showTimerRef.current);
        clearTimeout(stickyTimerRef.current);
        clearTimeout(hideTimerRef.current);

        // Guarda as coordenadas do mouse na página (pageX/Y já incluem scroll)
        const pageX = event.pageX;
        const pageY = event.pageY;

        // Inicia o timer para MOSTRAR o preview após SHOW_DELAY
        showTimerRef.current = setTimeout(() => {
            console.log("Show timer fired!"); // Log para confirmar execução do timer
            // --- Cálculo de Posição Acima/Direita com Clamping ---
            const scrollX = window.scrollX;
            const scrollY = window.scrollY;
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            // 1. Posição vertical ideal: ACIMA do cursor
            let targetTop = pageY - PREVIEW_HEIGHT - MOUSE_OFFSET;

            // 2. Posição horizontal ideal: à DIREITA do cursor
            let targetLeft = pageX + MOUSE_OFFSET;

            // 3. Clamping Vertical
            const minTop = scrollY + EDGE_OFFSET;
            const maxTop = scrollY + viewportHeight - PREVIEW_HEIGHT - EDGE_OFFSET;
            // Se não cabe acima (targetTop < minTop), tenta abaixo
            if (targetTop < minTop) {
                targetTop = pageY + MOUSE_OFFSET; // Tenta abaixo
            }
            // Garante que fique dentro dos limites verticais
            targetTop = Math.max(minTop, Math.min(targetTop, maxTop < minTop ? minTop : maxTop));

            // 4. Clamping Horizontal
            const minLeft = scrollX + EDGE_OFFSET;
            const maxLeft = scrollX + viewportWidth - PREVIEW_WIDTH - EDGE_OFFSET;
             // Se não cabe à direita (targetLeft > maxLeft), tenta à esquerda
             if (targetLeft + PREVIEW_WIDTH > scrollX + viewportWidth - EDGE_OFFSET) {
                  targetLeft = pageX - PREVIEW_WIDTH - MOUSE_OFFSET; // Tenta à esquerda
             }
            // Garante que fique dentro dos limites horizontais
            targetLeft = Math.max(minLeft, Math.min(targetLeft, maxLeft < minLeft ? minLeft : maxLeft));
            // --- Fim do Cálculo ---

            console.log(`Final Position - Top: ${targetTop}, Left: ${targetLeft}`);

            // Define a posição, URL e visibilidade SOMENTE AQUI DENTRO
            setPreviewPosition({ top: targetTop, left: targetLeft });
            setPreviewUrl(url);
            setShowPreview(true);
            setIsPreviewSticky(false); // Reseta sticky ao mostrar

        }, SHOW_DELAY); // Atraso para mostrar

        // Inicia o timer para TORNAR STICKY (independente do timer de mostrar)
        stickyTimerRef.current = setTimeout(() => {
             console.log("Sticky timer fired!"); // Log para confirmar timer de sticky
            setIsPreviewSticky(true);
        }, STICKY_DELAY);

    }, []); // Dependências vazias

    const handleMouseLeaveLink = useCallback(() => {
        // Limpa os timers de mostrar e de tornar sticky ao sair do link
        clearTimeout(showTimerRef.current);
        clearTimeout(stickyTimerRef.current);
        // Se não ficou sticky, inicia timer para esconder
        if (!isPreviewSticky) {
            hideTimerRef.current = setTimeout(() => {
                console.log("Hide timer fired (leave link, not sticky)!");
                setShowPreview(false);
                setPreviewUrl('');
                setPreviewPosition(null);
            }, HIDE_DELAY);
        }
    }, [isPreviewSticky]);

    const handleMouseEnterPreviewBox = useCallback(() => {
        // Cancela o timer de esconder ao entrar na caixa
        clearTimeout(hideTimerRef.current);
        // Cancela outros timers também (precaução)
        clearTimeout(showTimerRef.current);
        clearTimeout(stickyTimerRef.current);
        console.log("Mouse entered preview box, clearing hide timer.");
    }, []);

    const handleMouseLeavePreviewBox = useCallback(() => {
        // Sempre fecha e reseta tudo ao sair da caixa
        console.log("Mouse left preview box, closing.");
        clearTimeout(showTimerRef.current);
        clearTimeout(stickyTimerRef.current);
        clearTimeout(hideTimerRef.current);
        setShowPreview(false);
        setIsPreviewSticky(false);
        setPreviewUrl('');
        setPreviewPosition(null);
    }, []);
    // --- Fim da Lógica ---

    const isFavorited = oferta.favorito === 1;
    const buttonBaseStyle = "px-3 py-1 text-xs font-medium rounded-full shadow-sm transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-1";
    const favoritedStyle = "bg-yellow-400 hover:bg-yellow-500 text-yellow-900 border border-yellow-500 focus:ring-yellow-400";
    const notFavoritedStyle = "bg-gray-200 hover:bg-gray-300 text-gray-700 border border-gray-300 hover:border-gray-400 focus:ring-gray-400";
    const buttonClass = `${buttonBaseStyle} ${isFavorited ? favoritedStyle : notFavoritedStyle}`;
    const buttonText = isFavorited ? 'Desfavoritar' : 'Favoritar';
    const formattedValue = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(oferta.valor || 0);
    const formattedDate = oferta.datacriacao ? new Date(oferta.datacriacao).toLocaleDateString('pt-BR', {
        day: '2-digit', month: '2-digit', year: 'numeric'
    }) : '-';

    return (
        <tr className="border-b border-gray-200 hover:bg-indigo-50 transition-colors duration-150 ease-in-out even:bg-gray-50 group">
            <td className="py-3 px-4 text-sm text-gray-700 font-medium whitespace-nowrap">{oferta.idleilao || '-'}</td>
            <td className="py-3 px-4 text-sm text-gray-600">{oferta.bairro || '-'}</td>
            <td className="py-3 px-4 text-sm text-gray-600">{oferta.tipoimovel || '-'}</td>
            <td className="py-3 px-4 text-sm text-gray-600">{oferta.tipoleilao || '-'}</td>
            <td className="py-3 px-4 text-sm text-gray-600 max-w-xs truncate" title={oferta.descricao}>
                {oferta.descricao || '-'}
            </td>
            <td className="py-3 px-4 text-sm text-gray-800 font-semibold text-right whitespace-nowrap">
                {formattedValue}
            </td>
            <td className="py-3 px-4 text-sm text-gray-600 max-w-xs truncate" title={oferta.endereco}>
                {oferta.endereco || '-'}
            </td>
            <td className="py-3 px-4 text-sm text-center">
                <a
                    href={oferta.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-blue-100 text-blue-700 hover:bg-blue-200 hover:text-blue-800 px-2 py-1 rounded-md text-xs font-medium transition-colors duration-150 ease-in-out whitespace-nowrap"
                    title="Abrir link do leilão em nova aba (hover 1s para preview, 3s para fixar)"
                    onMouseEnter={(e) => handleMouseEnterLink(e, oferta.link)}
                    onMouseLeave={handleMouseLeaveLink}
                >
                    Ver Link
                </a>
            </td>
            <td className="py-3 px-4 text-center">
                <button onClick={handleFavoritoClick} className={buttonClass}>
                    {buttonText}
                </button>
            </td>
            <td className="py-3 px-4 text-sm text-gray-500 whitespace-nowrap">
                {formattedDate}
            </td>

            {showPreview && previewUrl && (
                <PreviewBox
                    url={previewUrl}
                    position={previewPosition}
                    onMouseEnter={handleMouseEnterPreviewBox}
                    onMouseLeave={handleMouseLeavePreviewBox}
                />
            )}
        </tr>
    );
};


// --- Componente OfertaTable (Tabela Principal) ---
const OfertaTable = ({ ofertas, onToggleFavorito }) => {
     if (!Array.isArray(ofertas) || ofertas.length === 0) {
        return null;
    }

    return (
         <div className="overflow-x-auto bg-white rounded-lg shadow-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100 sticky top-0 z-10">
                    <tr>
                        <th scope="col" className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">ID Leilão</th>
                        <th scope="col" className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Bairro</th>
                        <th scope="col" className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tipo Imóvel</th>
                        <th scope="col" className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tipo Leilão</th>
                        <th scope="col" className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Descrição</th>
                        <th scope="col" className="py-3 px-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">Valor (R$)</th>
                        <th scope="col" className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Endereço</th>
                        <th scope="col" className="py-3 px-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Link</th>
                        <th scope="col" className="py-3 px-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Favorito</th>
                        <th scope="col" className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">Data Criação</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {ofertas.map((oferta) => (
                        <OfertaRow
                            key={oferta.id}
                            oferta={oferta}
                            onToggleFavorito={onToggleFavorito}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default OfertaTable;
