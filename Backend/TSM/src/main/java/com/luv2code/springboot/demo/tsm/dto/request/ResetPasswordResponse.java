package com.luv2code.springboot.demo.tsm.dto.request;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class ResetPasswordResponse {
    private String message;
    private String temporaryPassword;

    public ResetPasswordResponse(String message, String temporaryPassword) {
        this.message = message;
        this.temporaryPassword = temporaryPassword;
    }

}
