package org.canay.backend.domain.entity;

public enum PaymentStatus {
    PENDING,            // Creado, esperando que el cliente complete el flujo
    PAID,               // Confirmado por la pasarela o el repartidor
    FAILED,             // Tarjeta rechazada, fondos insuficientes, etc.
    REFUNDED,           // Reembolsado totalmente
    PARTIALLY_REFUNDED  // Reembolso parcial (ej.: faltaba un refresco de 2 €)
}
