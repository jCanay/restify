package org.canay.backend.mappers.impl;

import lombok.RequiredArgsConstructor;
import org.canay.backend.domain.dto.DashboardDTO;
import org.canay.backend.domain.entities.Dashboard;
import org.canay.backend.mappers.Mapper;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DashboardMapper implements Mapper<Dashboard, DashboardDTO> {
    private final ModelMapper modelMapper;

    @Override
    public DashboardDTO mapTo(Dashboard dashboard) {
        return modelMapper.map(dashboard, DashboardDTO.class);
    }

    @Override
    public Dashboard mapFrom(DashboardDTO dashboardDTO) {
        return modelMapper.map(dashboardDTO, Dashboard.class);
    }
}
