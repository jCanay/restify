package org.canay.backend.mapper.impl;

import lombok.RequiredArgsConstructor;
import org.canay.backend.domain.dto.PaymentDTO;
import org.canay.backend.domain.entity.Payment;
import org.canay.backend.mapper.Mapper;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class PaymentMapper implements Mapper<Payment, PaymentDTO> {
    private final ModelMapper modelMapper;

    @Override
    public PaymentDTO mapTo(Payment payment) {
        return modelMapper.map(payment, PaymentDTO.class);
    }

    @Override
    public Payment mapFrom(PaymentDTO paymentDTO) {
        return modelMapper.map(paymentDTO, Payment.class);
    }
}
