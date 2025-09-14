Feature: Pruebas unitarias del componente ImcForm
  Como desarrollador
  Quiero asegurarme que el formulario IMC funciona correctamente con validaciones avanzadas
  Para garantizar la calidad, robustez y usabilidad de la aplicación

  Scenario: Renderizado de campos
    Given el componente ImcForm está montado
    Then se muestra el campo de peso
    And se muestra el campo de altura
    And se muestra el botón "Calcular"

  Scenario: Cálculo correcto de IMC con valores válidos
    Given el componente ImcForm está montado
    When el usuario ingresa "70" en el campo de peso
    And el usuario ingresa "1.75" en el campo de altura
    And el usuario presiona el botón "Calcular"
    Then se muestra el resultado del IMC y la categoría
    And no se muestra ningún mensaje de error

  Scenario: Validación de campos vacíos o no numéricos
    Given el componente ImcForm está montado
    When el usuario deja vacío el campo de peso
    And el usuario deja vacío el campo de altura
    And el usuario presiona el botón "Calcular"
    Then se muestra un mensaje de error "Por favor, ingresa valores numéricos positivos para altura y peso."

  Scenario: Validación de valores negativos o cero
    Given el componente ImcForm está montado
    When el usuario ingresa "-5" en el campo de peso
    And el usuario ingresa "0" en el campo de altura
    And el usuario presiona el botón "Calcular"
    Then se muestra un mensaje de error "Por favor, ingresa valores numéricos positivos para altura y peso."

  Scenario: Validación de peso superior a 500 kg
    Given el componente ImcForm está montado
    When el usuario ingresa "600" en el campo de peso
    And el usuario ingresa "1.75" en el campo de altura
    And el usuario presiona el botón "Calcular"
    Then se muestra un mensaje de error "El peso no puede superar los 500 kg."
    And no se muestra el resultado del IMC

  Scenario: Validación de altura superior a 3 metros
    Given el componente ImcForm está montado
    When el usuario ingresa "70" en el campo de peso
    And el usuario ingresa "4" en el campo de altura
    And el usuario presiona el botón "Calcular"
    Then se muestra un mensaje de error "La altura no puede superar los 3 metros."
    And no se muestra el resultado del IMC

  Scenario: Manejo de error en la llamada a la API
    Given el componente ImcForm está montado
    When el usuario ingresa "70" en el campo de peso
    And el usuario ingresa "1.75" en el campo de altura
    And el usuario presiona el botón "Calcular"
    But la API responde con un error
    Then se muestra un mensaje de error "Error al calcular el IMC. Verifica la conexión con el servidor."
    And no se muestra el resultado del IMC

  Scenario: Limpieza de errores previos en nuevo submit
    Given el componente ImcForm está montado
    When el usuario ingresa "600" en el campo de peso (inválido)
    And el usuario ingresa "1.75" en el campo de altura
    And el usuario presiona el botón "Calcular"
    Then se muestra un mensaje de error de peso
    When el usuario corrige el peso a "70"
    And el usuario presiona el botón "Calcular"
    Then el mensaje de error anterior desaparece
    And se muestra el resultado del IMC