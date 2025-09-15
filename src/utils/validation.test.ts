// tests/validation.imc.test.ts
import { validateImcInputs, ValidationResult } from './validation';

describe('validateImcInputs (mejorado)', () => {
  const expectInvalid = (alturaStr: string, pesoStr: string, expectedError: string) => {
    const result: ValidationResult = validateImcInputs(alturaStr, pesoStr);
    expect(result.isValid).toBe(false);
    expect(result.error).toBe(expectedError);
  };

  const expectValid = (alturaStr: string, pesoStr: string) => {
    const result: ValidationResult = validateImcInputs(alturaStr, pesoStr);
    expect(result.isValid).toBe(true);
    expect(result.error).toBeUndefined();
  };

  describe('Casos básicos (ya cubiertos)', () => {
    test('NaN en altura', () => {
      expectInvalid('abc', '70', 'Por favor, ingresa valores numéricos positivos para altura y peso.');
    });

    test('NaN en peso', () => {
      expectInvalid('1.75', 'xyz', 'Por favor, ingresa valores numéricos positivos para altura y peso.');
    });

    test('altura <= 0', () => {
      expectInvalid('0', '70', 'Por favor, ingresa valores numéricos positivos para altura y peso.');
    });

    test('peso <= 0', () => {
      expectInvalid('1.75', '-5', 'Por favor, ingresa valores numéricos positivos para altura y peso.');
    });

    test('ambos inválidos', () => {
      expectInvalid('-1', '0', 'Por favor, ingresa valores numéricos positivos para altura y peso.');
    });
  });

  describe('Límites superiores', () => {
    test('peso >= 500', () => {
      expectInvalid('1.75', '500', 'El peso no puede superar los 500 kg.');
    });

    test('altura >= 3', () => {
      expectInvalid('3', '70', 'La altura no puede superar los 3 metros.');
    });

    test('ambos encima de límite -> prioriza el chequeo de peso (orden actual)', () => {
      // Código actual chequea peso antes que altura, así que esperamos el mensaje de peso.
      expectInvalid('3.5', '600', 'El peso no puede superar los 500 kg.');
    });
  });

  describe('Casos válidos', () => {
    test('valores mínimos válidos', () => {
      expectValid('0.1', '0.1');
    });

    test('valores típicos', () => {
      expectValid('1.75', '70');
    });

    test('límites inferiores a máximos', () => {
      expectValid('2.99', '499.99');
    });
  });

  describe('Edge-cases y comportamientos reales', () => {
    test('maneja espacios alrededor de la cadena', () => {
      expectValid(' 1.75 ', ' 70 ');
    });

    test('maneja notación exponencial en peso (7e1 -> 70)', () => {
      expectValid('1.75', '7e1'); // 7e1 === 70
    });

    test('Infinity en peso se trata como > 500 (error de peso)', () => {
      expectInvalid('1.75', 'Infinity', 'El peso no puede superar los 500 kg.');
    });

    test('coma decimal "1,75" - DOCUMENTA comportamiento actual (parseFloat se detiene en la coma)', () => {
      // Atención: actualmente parseFloat("1,75") === 1, por lo que el validador considera 1 como altura válida.
      // Este test documenta el comportamiento actual (si preferís cambiarlo, refactorizar validateImcInputs).
      const res = validateImcInputs('1,75', '70');
      expect(res.isValid).toBe(true);
      // Opcional: si querés que '1,75' sea válido como 1.75 debes normalizar la coma a punto antes de parsear.
    });

    test('valores muy pequeños no nulos (0.0001) son válidos', () => {
      expectValid('0.0001', '0.0001');
    });

    test('strings vacíos son inválidos', () => {
      expectInvalid('', '', 'Por favor, ingresa valores numéricos positivos para altura y peso.');
    });
  });
});
