package ru.kata.spring.boot_security.demo.service;

import ru.kata.spring.boot_security.demo.model.User;

import java.util.List;


public interface UserService {
    List<User> listUsers();

    User findByEmail(String email);

    boolean saveUser(User user);

    boolean updateUser(User user);

    void deleteUser(long id);

    User findUserById(long id);
}
