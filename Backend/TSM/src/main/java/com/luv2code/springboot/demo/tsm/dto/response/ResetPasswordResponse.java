package com.luv2code.springboot.demo.tsm.dto.response;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class ResetPasswordResponse {
    private String message;
    private String temporaryPassword;

    public ResetPasswordResponse() {}

    public ResetPasswordResponse(String message, String temporaryPassword) {
        this.message = message;
        this.temporaryPassword = temporaryPassword;
    }

}
