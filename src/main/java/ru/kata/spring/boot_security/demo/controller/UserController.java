package ru.kata.spring.boot_security.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.repository.RoleRepository;
import ru.kata.spring.boot_security.demo.repository.UserRepository;
import ru.kata.spring.boot_security.demo.service.UserServiceImp;

import java.util.*;

@Controller
public class UserController {

    private final UserServiceImp userService;
    final UserRepository userRepository;
    final RoleRepository roleRepository;

    @Autowired
    public UserController(UserServiceImp userService, UserRepository userRepository, RoleRepository roleRepository) {
        this.userService = userService;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    @GetMapping("/user")
    public String showUserInfo(Model model) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findByEmail(auth.getName());
        model.addAttribute("user", user);
        return "user_info";
    }

    @GetMapping("/admin")
    public String findAll(Model model) {
        model.addAttribute("users", userService.listUsers());
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findByEmail(auth.getName());
        model.addAttribute("user",user);
        return "list_users";
    }

    @RequestMapping(value="/admin/update",method = {RequestMethod.POST, RequestMethod.GET})
    public String update(User user,@RequestParam(value = "role") String[] roles){
        user.setRoles(getRoles(roles));
        userService.saveUser(user);
        return "redirect:/admin/";
    }

    @GetMapping("/admin/create_user")
    public String createUserForm(Model model) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findByEmail(auth.getName());
        model.addAttribute("oldUser", user);
        model.addAttribute("user", new User());
        model.addAttribute("role", new ArrayList<Role>());
        return "create_user";
    }

    @PostMapping("/admin/create_user")
    public String createUser (@ModelAttribute("user") User user, @RequestParam(value = "role") String[] roles) {
        user.setRoles(getRoles(roles));
        userService.saveUser(user);
        return "redirect:/admin/";
    }

    @PostMapping("/admin/remove/{id}")
    public String deleteUser(@PathVariable("id") long id) {
        userService.deleteUser(id);
        return "redirect:/admin/";
    }

    public Set<Role> getRoles(String[] roles) {
        Set<Role> roleSet = new HashSet<>();
        for (String role : roles) {
            roleSet.add(roleRepository.findByName(role));
        }
        return roleSet;
    }
}
