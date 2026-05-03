package org.canay.backend.domain.dto;

import org.canay.backend.domain.entities.Restaurant;

import java.util.List;

public class DashboardDTO {
    private Long id;
    private Restaurant restaurant;
    private List<DashboardPageDTO> pages;
}
