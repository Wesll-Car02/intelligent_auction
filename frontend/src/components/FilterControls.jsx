// src/components/FilterControls.jsx
import React, { useMemo } from 'react';

// Componente reutilizável para inputs de filtro com margem reduzida
const FilterInput = ({ label, id, type = "text", value, onChange, placeholder, className = "" }) => (
    // Reduzida a margem inferior de mb-4 para mb-2
    <div className={`mb-2 ${className}`}>
        <label htmlFor={id} className="block text-xs font-medium text-gray-600 mb-1"> {/* Fonte menor para label */}
            {label}
        </label>
        <input
            type={type}
            id={id}
            name={id}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            // Padding vertical reduzido (py-1.5), texto menor (text-sm)
            className="mt-1 block w-full px-2 py-1.5 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
        />
    </div>
);

// Componente reutilizável para selects de filtro com margem reduzida
const FilterSelect = ({ label, id, value, onChange, options, className = "" }) => (
     // Reduzida a margem inferior de mb-4 para mb-2
     <div className={`mb-2 ${className}`}>
        <label htmlFor={id} className="block text-xs font-medium text-gray-600 mb-1"> {/* Fonte menor para label */}
            {label}
        </label>
        <select
            id={id}
            name={id}
            value={value}
            onChange={onChange}
             // Padding vertical reduzido (py-1.5), texto menor (text-sm)
            className="mt-1 block w-full pl-2 pr-8 py-1.5 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white"
        >
            <option value="">Todos</option> {/* Default option */}
            {options.map((option) => (
                <option key={option} value={option}>
                    {option}
                </option>
            ))}
        </select>
    </div>
);


function FilterControls({ filters, onFilterChange, allOfertas, onResetFilters }) {

    // Extrai opções únicas para os selects a partir de todas as ofertas
    const uniqueBairros = useMemo(() => [...new Set(allOfertas.map(o => o.bairro).filter(Boolean))].sort(), [allOfertas]);
    const uniqueTiposImovel = useMemo(() => [...new Set(allOfertas.map(o => o.tipoimovel).filter(Boolean))].sort(), [allOfertas]);
    const uniqueTiposLeilao = useMemo(() => [...new Set(allOfertas.map(o => o.tipoleilao).filter(Boolean))].sort(), [allOfertas]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        onFilterChange(name, value);
    };

    const handleDateChange = (event) => {
         const { name, value } = event.target;
         onFilterChange(name, value ? value : '');
    };

    return (
        // Fundo ligeiramente mais escuro (gray-50), padding reduzido (p-3), borda mais visível
        <div className="bg-gray-50 p-3 md:p-4 rounded-lg shadow-md mb-6 border border-gray-300">
            {/* Título com margem inferior reduzida */}
            <h2 className="text-lg font-semibold text-gray-700 mb-3">Filtrar Ofertas</h2>
             {/* Grid com gap reduzido e mais colunas em telas maiores */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-3 items-end">
                {/* Filtro Bairro */}
                 <FilterSelect
                    label="Bairro"
                    id="bairro"
                    value={filters.bairro}
                    onChange={handleInputChange}
                    options={uniqueBairros}
                    className="col-span-1" // Ocupa 1 coluna
                />

                {/* Filtro Tipo de Imóvel */}
                <FilterSelect
                    label="Tipo de Imóvel"
                    id="tipoImovel"
                    value={filters.tipoImovel}
                    onChange={handleInputChange}
                    options={uniqueTiposImovel}
                    className="col-span-1"
                />

                 {/* Filtro Tipo de Leilão */}
                <FilterSelect
                    label="Tipo de Leilão"
                    id="tipoLeilao"
                    value={filters.tipoLeilao}
                    onChange={handleInputChange}
                    options={uniqueTiposLeilao}
                    className="col-span-1"
                />

                {/* Filtro Valor Mínimo */}
                <FilterInput
                    label="Valor Mínimo (R$)"
                    id="valorMin"
                    type="number"
                    value={filters.valorMin}
                    onChange={handleInputChange}
                    placeholder="Mínimo"
                    className="col-span-1"
                />

                {/* Filtro Valor Máximo */}
                <FilterInput
                    label="Valor Máximo (R$)"
                    id="valorMax"
                    type="number"
                    value={filters.valorMax}
                    onChange={handleInputChange}
                    placeholder="Máximo"
                    className="col-span-1"
                />

                 {/* Filtro Data Criação Início */}
                 <FilterInput
                    label="Data Início" // Label mais curta
                    id="dataInicio"
                    type="date"
                    value={filters.dataInicio}
                    onChange={handleDateChange}
                    className="col-span-1"
                />

                {/* Filtro Data Criação Fim */}
                <FilterInput
                    label="Data Fim" // Label mais curta
                    id="dataFim"
                    type="date"
                    value={filters.dataFim}
                    onChange={handleDateChange}
                    className="col-span-1"
                />

                 {/* Botão Limpar Filtros */}
                {/* Ocupa 1 coluna; ajustado para alinhar com os inputs */}
                <div className="col-span-1 self-end mb-2">
                     <button
                        onClick={onResetFilters}
                        // Cor vermelha, padding vertical menor (py-1.5), texto menor (text-sm)
                        className="w-full bg-red-700 hover:bg-red-800 text-white font-semibold py-1.5 px-3 rounded-md shadow-sm transition-colors duration-200 ease-in-out text-sm"
                    >
                        Limpar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default FilterControls;
