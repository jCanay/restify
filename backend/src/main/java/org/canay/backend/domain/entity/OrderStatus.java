package org.canay.backend.domain.entity;

public enum OrderStatus {
    PENDING,            // Recibida, esperando confirmación del restaurante
    ACCEPTED,           // Confirmada por el restaurante
    READY_FOR_PICKUP,   // En pedido está listo para la entrega
    IN_TRANSIT,         // El repartidor va de camino
    DELIVERED,          // Entregado satisfactoriamente al cliente
    CANCELLED,          // Cancelado por el cliente (antes de cocinarse)
    REJECTED,           // Rechazado por el restaurante (falta de stock, cerrado, etc.)
    FAILED              // El pedido no se pudo entregar (ej.: el cliente no estaba en casa)
}
