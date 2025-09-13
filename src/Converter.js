import React, { useState, useEffect } from 'react';

const Converter = ({ category }) => {
  const [inputValue, setInputValue] = useState('');
  const [units, setUnits] = useState([]);
  const [fromUnit, setFromUnit] = useState('');
  const [conversions, setConversions] = useState({});

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        // Usa la URL completa del backend
        const response = await fetch(`https://convertidor-backend.vercel.app/api/units/${category}/es`);
        const data = await response.json();
        setUnits(data);
        if (data.length > 0) {
          setFromUnit(data[0].key);
        }
      } catch (error) {
        console.error('Error al obtener las unidades:', error);
      }
    };
    fetchUnits();
  }, [category]);

  useEffect(() => {
    setConversions({});
    if (inputValue && fromUnit) {
      performConversions(inputValue);
    }
  }, [inputValue, fromUnit]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
  };

  const performConversions = async (value) => {
    const newConversions = {};

    for (const toUnit of units) {
      if (fromUnit !== toUnit.key) {
        try {
          // Usa la URL completa del backend
          const response = await fetch('https://convertidor-backend.vercel.app/api/convert', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ category, value: parseFloat(value), fromUnit, toUnit: toUnit.key }),
          });
          const data = await response.json();
          if (response.ok) {
            newConversions[toUnit.key] = data.result.toFixed(4);
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
            <option key={unit.key} value={unit.key}>
              {unit.name}
            </option>
          ))}
        </select>
      </div>

      <div className="results">
        {units.map((unit) => {
          if (unit.key === fromUnit) return null;
          return (
            <div key={unit.key} className="result-item">
              <strong>{unit.name}:</strong>
              <span>{conversions[unit.key] || '...'}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Converter;