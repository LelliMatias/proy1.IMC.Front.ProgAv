import { validateImcInputs, ValidationResult } from './validation';  // Ajusta ruta si es necesario

describe('validateImcInputs', () => {
  // Helper para assertions comunes
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

  describe('Casos de entrada básica (NaN o no positivos)', () => {
    test('Debe fallar con NaN en altura', () => {
      expectInvalid('abc', '70', 'Por favor, ingresa valores numéricos positivos para altura y peso.');
    });

    test('Debe fallar con NaN en peso', () => {
      expectInvalid('1.75', 'xyz', 'Por favor, ingresa valores numéricos positivos para altura y peso.');
    });

    test('Debe fallar con altura <= 0', () => {
      expectInvalid('0', '70', 'Por favor, ingresa valores numéricos positivos para altura y peso.');
    });

    test('Debe fallar con peso <= 0', () => {
      expectInvalid('1.75', '-5', 'Por favor, ingresa valores numéricos positivos para altura y peso.');
    });

    test('Debe fallar con ambos inválidos', () => {
      expectInvalid('-1', '0', 'Por favor, ingresa valores numéricos positivos para altura y peso.');
    });
  });

  describe('Casos de límites superiores', () => {
    test('Debe fallar con peso >= 500 kg', () => {
      expectInvalid('1.75', '500', 'El peso no puede superar los 500 kg.');
    });

    test('Debe fallar con altura >= 3 m', () => {
      expectInvalid('3', '70', 'La altura no puede superar los 3 metros.');
    });

    test('Debe fallar con ambos límites superados', () => {
      expectInvalid('3.5', '600', 'El peso no puede superar los 500 kg.');  // Prioriza el primero que chequea
    });
  });

  describe('Casos válidos', () => {
    test('Debe pasar con valores mínimos válidos', () => {
      expectValid('0.1', '0.1');
    });

    test('Debe pasar con valores típicos', () => {
      expectValid('1.75', '70');
    });

    test('Debe pasar con límites inferiores a los máximos', () => {
      expectValid('2.99', '499.99');
    });
  });

  // Test de cobertura edge-case
  test('Debe manejar strings vacíos como inválidos', () => {
    expectInvalid('', '', 'Por favor, ingresa valores numéricos positivos para altura y peso.');
  });
});