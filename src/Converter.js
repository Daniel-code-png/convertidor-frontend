import React, { useState, useEffect } from 'react';


const displayUnits = {
  
  hours: 'horas',
  days: 'días',
  months: 'meses',
  years: 'años',
  
  grams: 'gramos',
  kilograms: 'kilogramos',
  pounds: 'libras',
  
  celsius: 'celsius',
  fahrenheit: 'fahrenheit',
  kelvin: 'kelvin',
  
  USD: 'dólar estadounidense',
  COP: 'peso colombiano',
  CHF: 'franco suizo',
};

const Converter = ({ category, units }) => {
  const [inputValue, setInputValue] = useState('');
  const [fromUnit, setFromUnit] = useState(units[0]);
  const [conversions, setConversions] = useState({});

  useEffect(() => {
    
    setConversions({});
    if (inputValue !== '') {
      performConversions(inputValue);
    }
  }, [category, fromUnit]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (value && !isNaN(value)) {
      performConversions(value);
    } else {
      setConversions({}); 
    }
  };

  const performConversions = async (value) => {
    const newConversions = {};

    for (const toUnit of units) {
      if (fromUnit !== toUnit) {
        try {
          const response = await fetch('http://localhost:5000/api/convert', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ category, value: parseFloat(value), fromUnit, toUnit }),
          });
          const data = await response.json();
          if (response.ok) {
            newConversions[toUnit] = data.result.toFixed(4); 
          }
        } catch (error) {
          console.error('Error al convertir:', error);
        }
      }
    }
    setConversions(newConversions);
  };

  return (
    <div className="converter-card">
      <h3>{`Convertidor de ${category.charAt(0).toUpperCase() + category.slice(1)}`}</h3>
      <div className="input-group">
        <input
          type="number"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Ingresa un valor"
        />
        <select
          value={fromUnit}
          onChange={(e) => setFromUnit(e.target.value)}
        >
          {units.map((unit) => (
            <option key={unit} value={unit}>
              {displayUnits[unit]}
            </option>
          ))}
        </select>
      </div>

      <div className="results">
        {units.map((unit) => {
          if (unit === fromUnit) return null;
          return (
            <div key={unit} className="result-item">
              <strong>{displayUnits[unit]}:</strong>
              <span>{conversions[unit] || '...'}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Converter;