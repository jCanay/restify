package org.canay.backend.mappers.impl;

import lombok.RequiredArgsConstructor;
import org.canay.backend.domain.dto.BookingDTO;
import org.canay.backend.domain.entities.Booking;
import org.canay.backend.mappers.Mapper;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class BookingMapper implements Mapper<Booking, BookingDTO> {
    private final ModelMapper modelMapper;

    @Override
    public BookingDTO mapTo(Booking booking) {
        return modelMapper.map(booking, BookingDTO.class);
    }

    @Override
    public Booking mapFrom(BookingDTO bookingDTO) {
        return modelMapper.map(bookingDTO, Booking.class);
    }
}
