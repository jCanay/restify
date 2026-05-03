package org.canay.backend.domain.entities;

public enum BookingStatus {
    PENDING,    // Recibida, esperando aprobación
    ACCEPTED,   // Aprobada por el restaurante
    CANCELLED,  // Cancelada (por cliente)
    REJECTED,   // Cancelada (por restaurante)
    SEATED,     // El cliente ya está en el restaurante
    COMPLETED,  // El servicio terminó satisfactoriamente
    NO_SHOW     // El cliente no se presentó
}
