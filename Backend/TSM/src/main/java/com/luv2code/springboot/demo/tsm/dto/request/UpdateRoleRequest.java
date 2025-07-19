package com.luv2code.springboot.demo.tsm.dto.request;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
public class UpdateRoleRequest {
    private List<String> roles;
}
