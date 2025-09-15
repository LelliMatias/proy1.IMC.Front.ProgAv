Feature: IMC List Component
    Como usuario de la aplicación web
    Quiero ver el historial de cálculos de IMC
    Para poder revisar mis registros pasados

    Scenario: Listar cálculos exitosamente
        Given la API responde con una lista de cálculos
        When el usuario hace clic en "Listar cálculos"
        Then se muestran los registros en la tabla con peso, altura, IMC y categoría

    Scenario: Respuesta inesperada de la API
        Given la API responde con un objeto en lugar de una lista
        When el usuario hace clic en "Listar cálculos"
        Then se muestra el mensaje de error "Respuesta inesperada del servidor"

    Scenario: Filtrar cálculos por rango de fechas
        Given el usuario selecciona Desde=2025-09-01 y Hasta=2025-09-30
        When hace clic en "Listar cálculos"
        Then el endpoint se construye con los parámetros "fechaInicio=2025-09-01" y "fechaFin=2025-09-30"
