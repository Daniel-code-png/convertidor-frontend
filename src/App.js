import React, { useState } from 'react';
import Converter from './Converter';
import './index.css';

const categories = {
  time: ['hours', 'days', 'months', 'years'],
  weight: ['grams', 'kilograms', 'pounds'],
  temperature: ['celsius', 'fahrenheit', 'kelvin'],
  money: ['USD', 'COP', 'CHF'],
};

// Objeto para mapear las claves en inglés a nombres de visualización en español
const displayNames = {
  time: 'Tiempo',
  weight: 'Peso',
  temperature: 'Temperatura',
  money: 'Dinero',
};

const App = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const renderContent = () => {
    if (selectedCategory) {
      return (
        <div className="converter-container">
          <button className="back-button" onClick={() => setSelectedCategory(null)}>
            ← Volver a Categorías
          </button>
          <Converter category={selectedCategory} units={categories[selectedCategory]} />
        </div>
      );
    } else {
      return (
        <div className="category-selection">
          <h1>Selecciona un Convertidor</h1>
          <div className="category-buttons">
            {Object.keys(categories).map((category) => (
              <button key={category} onClick={() => setSelectedCategory(category)}>
                {displayNames[category]}
              </button>
            ))}
          </div>
        </div>
      );
    }
  };

  return <div className="app">{renderContent()}</div>;
};

export default App;