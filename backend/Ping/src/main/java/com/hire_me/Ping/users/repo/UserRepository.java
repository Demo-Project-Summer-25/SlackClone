package com.hire_me.Ping.users.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
import java.util.Optional;
import com.hire_me.Ping.users.entity.User.AccountStatus;
import com.hire_me.Ping.users.entity.User;
import java.util.List;

public interface UserRepository extends JpaRepository<User, UUID> {
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    List<User> findByAccountStatus(AccountStatus status);
}
