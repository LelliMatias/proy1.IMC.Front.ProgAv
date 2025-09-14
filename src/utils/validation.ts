

export interface ValidationResult {
    isValid: boolean;
    error?: string;
  }
  
  export const validateImcInputs = (alturaStr: string, pesoStr: string): ValidationResult => {
    const alturaNum = parseFloat(alturaStr);
    const pesoNum = parseFloat(pesoStr);
  
    // Chequeo básico: NaN o no positivo
    if (isNaN(alturaNum) || isNaN(pesoNum) || alturaNum <= 0 || pesoNum <= 0) {
      return { isValid: false, error: "Por favor, ingresa valores numéricos positivos para altura y peso." };
    }
  
    // Límites superiores
    if (pesoNum >= 500 || pesoNum <= 0) {
      return { isValid: false, error: "El peso no puede superar los 500 kg y debe ser positivo." };
    }
    if (alturaNum >= 3 || alturaNum <= 0) {
      return { isValid: false, error: "La altura no puede superar los 3 metros y debe ser positiva." };
    }
  
    return { isValid: true };
  };