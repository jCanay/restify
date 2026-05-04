package org.canay.backend.mappers.impl;

import lombok.RequiredArgsConstructor;
import org.canay.backend.domain.dto.WidgetDTO;
import org.canay.backend.domain.entities.Widget;
import org.canay.backend.mappers.Mapper;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class WidgetMapper implements Mapper<Widget, WidgetDTO> {
    private final ModelMapper modelMapper;

    @Override
    public WidgetDTO mapTo(Widget widget) {
        return modelMapper.map(widget, WidgetDTO.class);
    }

    @Override
    public Widget mapFrom(WidgetDTO widgetDTO) {
        return modelMapper.map(widgetDTO, Widget.class);
    }
}
