package org.canay.backend.service;

import org.canay.backend.domain.dto.BookingDTO;
import org.canay.backend.domain.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface BookingService {
    Page<BookingDTO> getAll(Pageable pageable, User user);

    Page<BookingDTO> getAllByRestaurantId(Long restaurantId, Pageable pageable, User user);

    BookingDTO getById(Long id, User user);

    BookingDTO create(BookingDTO bookingDTO, Long restaurantId, User user);

    BookingDTO update(Long id, BookingDTO bookingDTO, User user);

    void delete(Long id, User user);
}
