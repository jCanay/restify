package org.canay.backend.domain.entities;

import com.fasterxml.jackson.databind.JsonNode;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.Set;

@Entity
@Table(name = "widgets")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Widget {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private WidgetType type;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "widget_access_roles", joinColumns = @JoinColumn(name = "widget_id"), inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<UserRole> accessRoles;

    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    @ManyToOne
    @JoinColumn(name = "dashboard_page_id")
    private DashboardPage dashboardPage;

    @Column(columnDefinition = "json")
    @JdbcTypeCode(SqlTypes.JSON)
    private JsonNode layouts;
}
