package org.canay.backend.domain.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "accounts")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String surname;

    private String profilePicture;

    @Builder.Default
    @Column(nullable = false)
    private Boolean onboardingCompleted = false;

    @OneToMany(mappedBy = "account")
    private List<Address> addresses;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    public boolean isManager() {
        if (user == null || user.getRole() == null) return false;

        String role = user.getRole().getName();
        return role.equals("ROLE_ADMIN") || role.equals("ROLE_OWNER");
    }
}
