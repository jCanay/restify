package org.canay.backend.mapper.impl;

import lombok.RequiredArgsConstructor;
import org.canay.backend.domain.dto.WidgetDTO;
import org.canay.backend.domain.entities.Widget;
import org.canay.backend.mapper.Mapper;
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
