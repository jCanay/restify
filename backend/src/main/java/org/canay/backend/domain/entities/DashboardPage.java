package org.canay.backend.domain.entities;

import com.fasterxml.jackson.databind.JsonNode;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.List;

@Entity
@Table(name = "dashboard_pages", uniqueConstraints = {
        @UniqueConstraint(
                name = "uk_dashboard_slug",
                columnNames = {"dashboard_id", "slug"}
        )
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardPage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String slug;

    @Column(columnDefinition = "json")
    @JdbcTypeCode(SqlTypes.JSON)
    private JsonNode tabs;

    @ToString.Exclude
    @ManyToOne
    @JoinColumn(name = "dashboard_id")
    private Dashboard dashboard;

    @OneToMany(mappedBy = "dashboardPage")
    private List<Widget> widgets;
}