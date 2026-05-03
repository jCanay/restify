package org.canay.backend.domain.dto;

import jakarta.persistence.*;
import org.canay.backend.domain.entities.Widget;

import java.util.List;

public class DashboardPageDTO {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private Object tabs;
    private List<Widget> widgets;
}
