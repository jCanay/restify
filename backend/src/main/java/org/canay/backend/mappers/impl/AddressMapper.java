package org.canay.backend.mappers.impl;

import lombok.RequiredArgsConstructor;
import org.canay.backend.domain.dto.AddressDTO;
import org.canay.backend.domain.entities.Address;
import org.canay.backend.mappers.Mapper;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class AddressMapper implements Mapper<Address, AddressDTO> {
    private final ModelMapper modelMapper;

    @Override
    public AddressDTO mapTo(Address address) {
        return modelMapper.map(address, AddressDTO.class);
    }

    @Override
    public Address mapFrom(AddressDTO addressDTO) {
        return modelMapper.map(addressDTO, Address.class);
    }
}
