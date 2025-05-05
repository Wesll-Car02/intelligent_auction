// frontend/src/App.jsx
// Main application component with filtering capabilities
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import OfertaTable from './components/OfertaTable';
import FilterControls from './components/FilterControls'; // Importa o novo componente
import { getOfertas } from './services/api';

function App() {
    // State for the original, unfiltered list of offers
    const [allOfertas, setAllOfertas] = useState([]);
    // State to track loading status
    const [loading, setLoading] = useState(true);
    // State to track errors during data fetching
    const [error, setError] = useState(null);

    // State for filter values
    const initialFilters = {
        bairro: '',
        tipoImovel: '',
        tipoLeilao: '',
        valorMin: '',
        valorMax: '',
        dataInicio: '',
        dataFim: '',
    };
    const [filters, setFilters] = useState(initialFilters);

    // Function to fetch offers from the backend
    const fetchOfertas = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getOfertas();
            // Sort offers by creation date, newest first (optional, done before setting)
            const sortedOfertas = response.data.sort((a, b) => new Date(b.datacriacao) - new Date(a.datacriacao));
            setAllOfertas(sortedOfertas); // Store the original, sorted list
        } catch (err) {
            console.error("Erro ao buscar ofertas:", err);
            setError('Falha ao carregar dados das ofertas. Verifique a conexão com o backend.');
            setAllOfertas([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch data on component mount
    useEffect(() => {
        fetchOfertas();
    }, [fetchOfertas]);

    // Handler to update a specific filter value
    const handleFilterChange = useCallback((filterName, value) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            [filterName]: value,
        }));
    }, []);

     // Handler to reset all filters
    const handleResetFilters = useCallback(() => {
        setFilters(initialFilters);
    }, []);

    // Apply filters whenever 'allOfertas' or 'filters' change
    const filteredOfertas = useMemo(() => {
        // Start with the full list
        let tempOfertas = [...allOfertas];

        // Apply Bairro Filter
        if (filters.bairro) {
            tempOfertas = tempOfertas.filter(oferta => oferta.bairro === filters.bairro);
        }
        // Apply Tipo Imóvel Filter
        if (filters.tipoImovel) {
            tempOfertas = tempOfertas.filter(oferta => oferta.tipoimovel === filters.tipoImovel);
        }
        // Apply Tipo Leilão Filter
        if (filters.tipoLeilao) {
            tempOfertas = tempOfertas.filter(oferta => oferta.tipoleilao === filters.tipoLeilao);
        }
        // Apply Valor Mínimo Filter
        if (filters.valorMin) {
             // Convert to number for comparison, handle potential NaN
            const valorMinNum = parseFloat(filters.valorMin);
            if (!isNaN(valorMinNum)) {
                 tempOfertas = tempOfertas.filter(oferta => parseFloat(oferta.valor) >= valorMinNum);
            }
        }
        // Apply Valor Máximo Filter
        if (filters.valorMax) {
            // Convert to number for comparison, handle potential NaN
            const valorMaxNum = parseFloat(filters.valorMax);
             if (!isNaN(valorMaxNum)) {
                tempOfertas = tempOfertas.filter(oferta => parseFloat(oferta.valor) <= valorMaxNum);
            }
        }
        // Apply Data Início Filter
        if (filters.dataInicio) {
            try {
                // Create Date objects ensuring correct timezone handling (consider UTC or local based on data)
                // Adding 'T00:00:00' assumes the date string is local timezone date part
                const dataInicioFilter = new Date(filters.dataInicio + 'T00:00:00');
                 if (!isNaN(dataInicioFilter.getTime())) { // Check if date is valid
                    tempOfertas = tempOfertas.filter(oferta => {
                        const dataCriacaoOferta = new Date(oferta.datacriacao);
                        // Normalize offer date to start of day for comparison
                        dataCriacaoOferta.setHours(0, 0, 0, 0);
                        return dataCriacaoOferta >= dataInicioFilter;
                    });
                 }
            } catch (e) { console.error("Error parsing start date:", e); } // Handle potential date parsing errors
        }
        // Apply Data Fim Filter
        if (filters.dataFim) {
             try {
                 // Create Date objects ensuring correct timezone handling
                const dataFimFilter = new Date(filters.dataFim + 'T00:00:00');
                 if (!isNaN(dataFimFilter.getTime())) { // Check if date is valid
                    tempOfertas = tempOfertas.filter(oferta => {
                        const dataCriacaoOferta = new Date(oferta.datacriacao);
                         // Normalize offer date to start of day for comparison
                        dataCriacaoOferta.setHours(0, 0, 0, 0);
                        return dataCriacaoOferta <= dataFimFilter;
                    });
                 }
             } catch (e) { console.error("Error parsing end date:", e); } // Handle potential date parsing errors
        }

        return tempOfertas; // Return the final filtered list
    }, [allOfertas, filters]);

    // Handler function to update the local state when a favorite is toggled
    // Needs to update BOTH allOfertas and potentially re-filter if needed,
    // though filtering happens automatically via useMemo based on allOfertas change.
    const handleToggleFavorito = useCallback((id, newStatus) => {
        setAllOfertas(prevOfertas =>
            prevOfertas.map(oferta =>
                oferta.id === id ? { ...oferta, favorito: newStatus } : oferta
            )
        );
        // The filteredOfertas will update automatically because allOfertas changed
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-100 to-gray-200 font-inter">
            {/* Header */}
            <header className="bg-white shadow-md py-4 mb-8">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl font-bold text-center text-gray-800 tracking-tight">
                        Painel de Leilões de Imóveis
                    </h1>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-grow container mx-auto px-4 pb-8">
                {/* Render Filter Controls */}
                 {!loading && !error && (
                    <FilterControls
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        allOfertas={allOfertas} // Pass all offers to extract unique values
                        onResetFilters={handleResetFilters} // Pass reset handler
                    />
                 )}

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        <p className="ml-3 text-lg text-blue-600">Carregando ofertas...</p>
                    </div>
                )}
                {/* Error State */}
                {error && (
                     <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow" role="alert">
                        <p className="font-bold">Erro</p>
                        <p>{error}</p>
                    </div>
                )}
                {/* Data Display - Pass filtered data to the table */}
                {!loading && !error && (
                    // Display message if filters result in no offers
                     filteredOfertas.length > 0 ? (
                        <OfertaTable ofertas={filteredOfertas} onToggleFavorito={handleToggleFavorito} />
                    ) : (
                        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md shadow mt-4" role="alert">
                            <p className="font-bold">Nenhum Resultado</p>
                            <p>Nenhuma oferta corresponde aos filtros selecionados. Tente ajustar os critérios ou limpar os filtros.</p>
                        </div>
                    )
                )}
                 {/* Refresh Button */}
                 {!loading && (
                    <div className="text-center mt-6">
                        <button
                            onClick={fetchOfertas}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-5 rounded-lg shadow-md transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={loading}
                        >
                            {loading ? 'Atualizando...' : 'Atualizar Dados'}
                        </button>
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="bg-white shadow-inner mt-auto py-4">
              <div className="container mx-auto px-4 text-center text-sm text-gray-600">
                 <p>&copy; {new Date().getFullYear()} Leilão App - Desenvolvido por Weslley @ Veloo</p>
              </div>
            </footer>
        </div>
    );
}

export default App;
