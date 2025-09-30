package com.luv2code.springboot.demo.tsm.service;

import com.luv2code.springboot.demo.tsm.dto.request.UpdateUserRequest;
import com.luv2code.springboot.demo.tsm.dto.response.AdminUserStatsResponse;
import com.luv2code.springboot.demo.tsm.dto.response.UserStatsResponse;
import com.luv2code.springboot.demo.tsm.entity.Role;
import com.luv2code.springboot.demo.tsm.entity.User;
import com.luv2code.springboot.demo.tsm.repository.RoleRepository;
import com.luv2code.springboot.demo.tsm.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Random;
import java.util.Set;

@Service
@Transactional
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User createUser(String username, String email, String password, String fullName) {
        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setFullName(fullName);

        Role userRole = roleRepository.findByName("ROLE_USER")
                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
        Set<Role> roles = new HashSet<>();
        roles.add(userRole);
        user.setRoles(roles);

        return userRepository.save(user);
    }

    public void createAdminIfNotExists() {
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@example.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setFullName("Administrator");
            admin.setEnabled(true);

            Role adminRole = roleRepository.findByName("ROLE_ADMIN")
                    .orElseThrow(() -> new RuntimeException("Error: ROLE_ADMIN not found."));
            Set<Role> roles = new HashSet<>();
            roles.add(adminRole);
            admin.setRoles(roles);

            userRepository.save(admin);
        }
    }

    public void createManagerIfNotExists() {
        if (!userRepository.existsByUsername("manager")) {
            User manager = new User();
            manager.setUsername("manager");
            manager.setEmail("manager@example.com");
            manager.setPassword(passwordEncoder.encode("manager123"));
            manager.setFullName("Project Manager");
            manager.setEnabled(true);

            Role managerRole = roleRepository.findByName("ROLE_MANAGER")
                    .orElseThrow(() -> new RuntimeException("Error: ROLE_MANAGER not found."));
            Set<Role> roles = new HashSet<>();
            roles.add(managerRole);
            manager.setRoles(roles);

            userRepository.save(manager);
        }
    }

    public User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found with username: " + username));
    }

    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public User updateUser(Long userId, UpdateUserRequest request) {
        User user = findById(userId);
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setAvatarUrl(request.getAvatarUrl());
        return userRepository.save(user);
    }

    public List<User> findAll() {
        return userRepository.findAll();
    }

    public Page<User> findAll(Pageable pageable) {
        return userRepository.findAll(pageable);
    }

    public List<User> searchUsers(String keyword) {
        return userRepository.findByUsernameContainingIgnoreCaseOrFullNameContainingIgnoreCase(keyword, keyword);
    }

    public User updateUserStatus(Long userId, boolean enabled) {
        User user = findById(userId);
        user.setEnabled(enabled);
        return userRepository.save(user);
    }

    public void deleteUser(Long userId) {
        User user = findById(userId);
        userRepository.delete(user);
    }

    public void changePassword(Long userId, String oldPassword, String newPassword) {
        User user = findById(userId);

        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new RuntimeException("Old password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    public UserStatsResponse getUserStats() {
        long totalUsers = userRepository.count();
        long activeUsers = userRepository.countByEnabled(true);
        long newUsersThisMonth = userRepository.countByCreatedAtAfter(
                LocalDateTime.now().minusMonths(1)
        );

        return new UserStatsResponse(totalUsers, activeUsers, newUsersThisMonth);
    }

    public AdminUserStatsResponse getAdminUserStats() {
        long totalUsers = userRepository.count();
        long activeUsers = userRepository.countByEnabledTrueAndAccountNonLockedTrue();
        long lockedUsers = userRepository.countByAccountNonLockedFalse();

        LocalDateTime startOfMonth = LocalDateTime.now().withDayOfMonth(1)
                .withHour(0).withMinute(0).withSecond(0).withNano(0);
        long newUsersThisMonth = userRepository.countByCreatedAtAfter(startOfMonth);

        AdminUserStatsResponse stats = new AdminUserStatsResponse(totalUsers, activeUsers, lockedUsers, newUsersThisMonth);
        AdminUserStatsResponse.UsersByRole usersByRole = stats.getUsersByRole();
        usersByRole.setAdmin(userRepository.countByRoles_Name("ROLE_ADMIN"));
        usersByRole.setManager(userRepository.countByRoles_Name("ROLE_MANAGER"));
        usersByRole.setUser(userRepository.countByRoles_Name("ROLE_USER"));

        return stats;
    }

    // Lock/Unlock methods
    public void lockUser(Long userId) {
        User user = findById(userId);
        user.setAccountNonLocked(false);
        userRepository.save(user);
    }

    public void unlockUser(Long userId) {
        User user = findById(userId);
        user.setAccountNonLocked(true);
        userRepository.save(user);
    }

    // Role management
    public void updateUserRoles(Long userId, List<String> roleNames) {
        User user = findById(userId);
        Set<Role> roles = new HashSet<>();

        for (String roleName : roleNames) {
            Role role = roleRepository.findByName(roleName)
                    .orElseThrow(() -> new RuntimeException("Role not found: " + roleName));
            roles.add(role);
        }

        user.setRoles(roles);
        userRepository.save(user);
    }

    // Reset password
    public String resetPassword(Long userId) {
        User user = findById(userId);

        // Generate temporary password
        String tempPassword = generateTempPassword();
        user.setPassword(passwordEncoder.encode(tempPassword));

        userRepository.save(user);

        return tempPassword;
    }

    private String generateTempPassword() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        Random random = new Random();
        StringBuilder sb = new StringBuilder();

        for (int i = 0; i < 8; i++) {
            sb.append(chars.charAt(random.nextInt(chars.length())));
        }

        return sb.toString();
    }
}
