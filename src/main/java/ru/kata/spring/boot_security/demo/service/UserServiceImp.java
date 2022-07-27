package ru.kata.spring.boot_security.demo.service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.repository.RoleRepository;
import ru.kata.spring.boot_security.demo.repository.UserRepository;

import java.util.List;

@Service
public class UserServiceImp implements UserService, UserDetailsService {

    private final UserRepository userRepository;

    private final RoleRepository roleRepository;

    public UserServiceImp(UserRepository userRepository, RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    @Override
    public List<User> listUsers() {
        return userRepository.findAll();
    }

    // поменять булиан на войд
    @Override
    public boolean saveUser(User user) {
        userRepository.saveAndFlush(user);
        return true;
    }

    @Override
    public boolean updateUser(User user) {
        userRepository.saveAndFlush(user);
        return true;
    }

    @Override
    public User findUserById(long id) {
        return userRepository.findUserById(id);
    }


    @Override
    public void deleteUser(long id) {
        userRepository.deleteById(id);
    }

    @Override
    public User findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String name) throws UsernameNotFoundException {
        return userRepository.findByEmail(name);
    }
}



