package org.canay.backend.service.impl;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.canay.backend.domain.dto.AvailabilityRuleRequestDTO;
import org.canay.backend.domain.entities.AvailabilityRule;
import org.canay.backend.domain.entities.AvailabilityRuleType;
import org.canay.backend.domain.entities.Restaurant;
import org.canay.backend.repository.AvailabilityRuleRepository;
import org.canay.backend.repository.AvailabilityRuleTypeRepository;
import org.canay.backend.repository.RestaurantRepository;
import org.canay.backend.service.AvailabilityRuleService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AvailabilityRuleServiceImpl implements AvailabilityRuleService {

    private final AvailabilityRuleRepository ruleRepository;
    private final AvailabilityRuleTypeRepository typeRepository;
    private final RestaurantRepository restaurantRepository;

    @Override
    public boolean isOpenNow(Long restaurantId) {
        LocalDateTime now = LocalDateTime.now();
        LocalDate today = now.toLocalDate();
        int dayOfWeek = today.getDayOfWeek().getValue() - 1;

        List<AvailabilityRule> rules = ruleRepository.findActiveRulesOrdered(restaurantId, dayOfWeek, today);

        if (rules.isEmpty()) return false;

        // Al estar ordenadas por prioridad en la DB, la primera REGLA manda.
        // Pero cuidado: si hay varios "slots" (mañana y tarde) del mismo tipo de regla, 
        // debemos agruparlos.

        Integer topPriority = rules.getFirst().getType().getPriority();

        // Filtramos solo las reglas que tengan la prioridad más alta encontrada hoy
        List<AvailabilityRule> topRules = rules.stream()
                .filter(r -> r.getType().getPriority().equals(topPriority))
                .toList();

        // Si la regla de mayor prioridad dice que está cerrado (ej: Vacaciones)
        if (topRules.stream().anyMatch(AvailabilityRule::getIsClosed)) {
            return false;
        }

        // Si no, comprobamos si la hora actual cae en alguno de los tramos de esa prioridad
        LocalTime currentTime = now.toLocalTime();
        return topRules.stream()
                .anyMatch(r -> !currentTime.isBefore(r.getOpenTime()) && !currentTime.isAfter(r.getCloseTime()));
    }

    @Override
    @Transactional
    public void updateSchedule(Long restaurantId, List<AvailabilityRuleRequestDTO> requests) {
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new RuntimeException("Restaurante no encontrado"));

        LocalDate today = LocalDate.now();

        // 1. Invalidar reglas RECURRING actuales (Histórico legal en España)
        List<AvailabilityRule> currentRecurring = ruleRepository
                .findByRestaurantIdAndType_NameAndExpiryDateIsNull(restaurantId, "RECURRING");

        currentRecurring.forEach(rule -> rule.setExpiryDate(today.minusDays(1)));
        ruleRepository.saveAll(currentRecurring);

        // 2. Mapear y guardar las nuevas reglas
        List<AvailabilityRule> newRules = requests.stream().map(req -> {
            AvailabilityRuleType type = typeRepository.findByName(req.getTypeName())
                    .orElseThrow(() -> new RuntimeException("Tipo de regla no existe: " + req.getTypeName()));

            return AvailabilityRule.builder()
                    .restaurant(restaurant)
                    .type(type)
                    .dayOfWeek(req.getDayOfWeek())
                    .startDate(req.getStartDate())
                    .endDate(req.getEndDate())
                    .openTime(req.getOpenTime())
                    .closeTime(req.getCloseTime())
                    .isClosed(req.getIsClosed() != null ? req.getIsClosed() : false)
                    .effectiveDate(today) // Empieza a valer hoy
                    .build();
        }).toList();

        ruleRepository.saveAll(newRules);
    }
}