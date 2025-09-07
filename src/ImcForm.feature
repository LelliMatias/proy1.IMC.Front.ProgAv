Feature: Pruebas unitarias del componente ImcForm
	Como desarrollador
	Quiero asegurarme que el formulario IMC funciona correctamente
	Para garantizar la calidad y robustez de la aplicación

  Scenario: Renderizado de campos
    Given el componente ImcForm está montado
    Then se muestra el campo de peso
    And se muestra el campo de altura

  Scenario: Cálculo correcto de IMC
    Given el componente ImcForm está montado
    When el usuario ingresa "70" en el campo de peso
    And el usuario ingresa "1.75" en el campo de altura
    And el usuario presiona el botón "Calcular"
    Then se muestra el resultado del IMC y la categoría

  Scenario: Validación de datos inválidos
    Given el componente ImcForm está montado
    When el usuario deja vacío el campo de peso
    And el usuario deja vacío el campo de altura
    And el usuario presiona el botón "Calcular"
    Then se muestra un mensaje de error indicando que los valores son inválidos
