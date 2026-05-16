package org.canay.backend.mapper.impl;

import lombok.RequiredArgsConstructor;
import org.canay.backend.domain.dto.DashboardPageDTO;
import org.canay.backend.domain.entities.DashboardPage;
import org.canay.backend.mapper.Mapper;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DashboardPageMapper implements Mapper<DashboardPage, DashboardPageDTO> {
    private final ModelMapper modelMapper;

    @Override
    public DashboardPageDTO mapTo(DashboardPage dashboardPage) {
        return modelMapper.map(dashboardPage, DashboardPageDTO.class);
    }

    @Override
    public DashboardPage mapFrom(DashboardPageDTO dashboardPageDTO) {
        return modelMapper.map(dashboardPageDTO, DashboardPage.class);
    }
}
