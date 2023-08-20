import React, { useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import './App.css'; // Importa o arquivo CSS que você criou

function App() {
  const [sum, setSum] = useState<number | null>(null); // Estado para armazenar a soma
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      const data = new Uint8Array(event.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });

      const worksheet = workbook.Sheets[workbook.SheetNames[0]];

      const columnBetCells = Object.keys(worksheet)
        .filter((cell) => cell.match(/^[A-Z]+[0-9]+$/) && worksheet[cell]?.v !== undefined)
        .filter((cell) => {
          const column = cell.match(/^[A-Z]+/)?.[0]; // Extrai a letra da coluna
          return column === 'F'; // Verifica se a coluna é a sexta (começando do índice 0)
        })
        .map((cell) => worksheet[cell]?.v) // Obtém o valor da célula
        .filter((value) => typeof value === 'number'); // Filtra apenas valores numéricos

      const calculatedSum = columnBetCells.reduce((acc, value) => acc + value, 0);

      setSum(calculatedSum); // Atualiza o estado com a soma calculada
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="container">
      <h1>Calculadora de rollover</h1>
      <div className="file-input-wrapper">
        <label className="file-input-label" htmlFor="fileInput">
          Escolha um arquivo
        </label>
        <input
          type="file"
          id="fileInput"
          className="file-input"
          ref={fileInputRef}
          onChange={handleFileUpload}
        />
      </div>

      {/* Renderiza o resultado da soma, se disponível */}
      {sum !== null && (
        <p className="result">
          A soma da coluna "bet" é R$ <span className="highlight">R${(sum / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
        </p>
      )}
    </div>
  );
}

export default App;
