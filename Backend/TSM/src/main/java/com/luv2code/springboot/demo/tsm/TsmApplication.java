package com.luv2code.springboot.demo.tsm;

import com.luv2code.springboot.demo.tsm.service.UserService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class TsmApplication {

    @Bean
    CommandLineRunner init(UserService userService) {
        return args -> {
            userService.createAdminIfNotExists();
            userService.createManagerIfNotExists();
        };
    }

    public static void main(String[] args) {
        SpringApplication.run(TsmApplication.class, args);
    }
}
