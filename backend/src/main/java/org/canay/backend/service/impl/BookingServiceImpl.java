package org.canay.backend.service.impl;

import lombok.RequiredArgsConstructor;
import org.canay.backend.domain.dto.BookingDTO;
import org.canay.backend.domain.dto.UserDTO;
import org.canay.backend.domain.entities.Account;
import org.canay.backend.domain.entities.Booking;
import org.canay.backend.domain.entities.Restaurant;
import org.canay.backend.domain.entities.User;
import org.canay.backend.exception.ResourceNotFoundException;
import org.canay.backend.mapper.Mapper;
import org.canay.backend.repository.AccountRepository;
import org.canay.backend.repository.BookingRepository;
import org.canay.backend.repository.RestaurantRepository;
import org.canay.backend.service.BookingService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {
    private final BookingRepository bookingRepository;
    private final RestaurantRepository restaurantRepository;
    private final AccountRepository accountRepository;
    private final Mapper<Booking, BookingDTO> bookingMapper;
    private final Mapper<User, UserDTO> userMapper;

    @Override
    @Transactional(readOnly = true)
    public Page<BookingDTO> getAll(Pageable pageable, User user) {
        Page<Booking> bookings = bookingRepository.findAll(pageable);

        return bookings.map(bookingMapper::mapTo);
    }

    @Override
    @Transactional(readOnly = true)
    public BookingDTO getById(Long id, User user) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        return bookingMapper.mapTo(booking);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<BookingDTO> getAllByRestaurantId(Long restaurantId, Pageable pageable, User user) {
        Page<Booking> bookings = bookingRepository.findAllByRestaurantId(restaurantId, pageable);

        UserDTO userDto = userMapper.mapTo(user);

        System.out.println(bookings.getNumberOfElements());

        return bookings.map(booking -> {
            BookingDTO bookingDTO = bookingMapper.mapTo(booking);
            bookingDTO.setUser(userDto);
            return bookingDTO;
        });
    }

    @Override
    @Transactional
    public BookingDTO create(BookingDTO bookingDTO, Long restaurantId, User user) {
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found"));

        Account account = accountRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found"));

        Booking booking = bookingMapper.mapFrom(bookingDTO);

        if (bookingDTO.getBookingDate() != null) {
            OffsetDateTime odt = OffsetDateTime.parse(bookingDTO.getBookingDate());
            booking.setBookingDate(odt.toLocalDateTime());
        }

        booking.setRestaurant(restaurant);
        booking.setAccount(account);

        Booking savedBooking = bookingRepository.save(booking);

        return bookingMapper.mapTo(savedBooking);
    }

    @Override
    @Transactional
    public BookingDTO update(Long id, BookingDTO bookingDTO, User user) {
        return null;
    }

    @Override
    @Transactional
    public void delete(Long id, User user) {

    }
}
