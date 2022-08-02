package ru.kata.spring.boot_security.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.repository.RoleRepository;
import ru.kata.spring.boot_security.demo.repository.UserRepository;
import ru.kata.spring.boot_security.demo.service.UserService;
import ru.kata.spring.boot_security.demo.service.UserServiceImp;

import java.security.Principal;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@RestController
public class AdminController {
    private final UserService userService;
    final UserRepository userRepository;
    final RoleRepository roleRepository;

    @Autowired
    public AdminController(UserService userService, UserRepository userRepository, RoleRepository roleRepository) {
        this.userService = userService;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }
    //вывод всех
    @GetMapping("/rest")
    public List<User> findALl() {
        return userService.listUsers();
    }
    // 1
    @GetMapping("/rest/principal")
    public User getPrincipalInfo(Principal principal) {
        return userService.findByEmail(principal.getName());
    }

    // добавление
    @PostMapping("/rest")
    public User createUser(@RequestBody User user) {
        roleRepository.saveAll(user.getRoles());
        userService.saveUser(user);
        return user;
    }

    // редактирование
    @PutMapping("/rest/{id}")
    public User updateUser(@RequestBody User user, @PathVariable ("id") int id) {
        roleRepository.saveAll(user.getRoles());
        userService.updateUser(user);
        return user;
    }
    // по айди
    @GetMapping("/rest/{id}")
    public User findOneUser(@PathVariable long id) {
        return userService.findUserById(id);
    }

    @DeleteMapping("/rest/{id}")
    public String deleteUser(@PathVariable long id) {
        userService.deleteUser(id);
        return ("User was delete, ID " + id);
    }

    public Set<Role> getRoles(String[] roles) {
        Set<Role> roleSet = new HashSet<>();
        for (String role : roles) {
            roleSet.add(roleRepository.findByName(role));
        }
        return roleSet;
    }
}
