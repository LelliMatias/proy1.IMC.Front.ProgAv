import { API_URL } from "./config/api"; // Importar la configuración
import { HttpApadter } from "./api/axios.adapter";
import React, { useState } from "react";
import { validateImcInputs, ValidationResult } from "./utils/validation";  // Importa el módulo de validación (ajusta la ruta si es necesario)

interface ImcResult {
  imc: number;
  categoria: string;
}

interface ImcFormProps {
  api: HttpApadter;
}

function ImcForm({ api }: ImcFormProps) {

  const [altura, setAltura] = useState<string>("");
  const [peso, setPeso] = useState<string>("");
  const [resultado, setResultado] = useState<ImcResult | null>(null);
  const [error, setError] = useState<string>("");


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setResultado(null);

    const validation: ValidationResult = validateImcInputs(altura, peso); // valido los valores con el helper validation.ts
    if (!validation.isValid) {
      setError(validation.error || "Error en la validación.");
      return;
    }

    const alturaNum = parseFloat(altura);
    const pesoNum = parseFloat(peso);


    try {
      // Usar API_URL en lugar de localhost hardcodeado
      const response = await api.post<ImcResult>(`${API_URL}/imc/calcular`, {
        altura: alturaNum,
        peso: pesoNum,
      });
      setResultado(response);
      setError("");
    } catch (err) {
      setError(
        "Error al calcular el IMC. Verifica la conexión con el servidor."
      );
      setResultado(null);
    }
  };

  return (
    <div>
      <div>
        <h1>Calculadora de IMC</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="altura">Altura (m):</label>
            <input
              id="altura"
              type="number"
              value={altura}
              onChange={(e) => setAltura(e.target.value)}
              step="0.01"
              min="0.1"
              required
              placeholder="Ej: 1.75"
            />
          </div>
          <div>
            <label htmlFor="peso">Peso (kg):</label>
            <input
              id="peso"
              type="number"
              value={peso}
              onChange={(e) => setPeso(e.target.value)}
              min="1"
              required
              placeholder="Ej: 70"
            />
          </div>
          <button type="submit">Calcular</button>
        </form>

        {resultado && (
          <div style={{ color: "green", marginTop: "10px" }}>
            <p>IMC: {resultado.imc.toFixed(2)}</p>
            <p>Categoría: {resultado.categoria}</p>
          </div>
        )}

        {error && (
          <div style={{ color: "red", marginTop: "10px" }}>
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ImcForm;