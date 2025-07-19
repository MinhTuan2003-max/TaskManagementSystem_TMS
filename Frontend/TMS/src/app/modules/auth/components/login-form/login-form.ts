import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {LoginRequest} from '../../../../core/models';


@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './login-form.html',
  styleUrls: ['./login-form.scss']
})
export class LoginFormComponent implements OnInit {
  @Output() loginSubmit = new EventEmitter<LoginRequest>();
  @Output() loadingChange = new EventEmitter<boolean>();

  loginForm: FormGroup;
  isLoading = false;
  showPassword = false;

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.loadingChange.emit(true);
      this.loginSubmit.emit(this.loginForm.value);
    }
  }

  setLoading(loading: boolean): void {
    this.isLoading = loading;
    this.loadingChange.emit(loading);
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  get username() { return this.loginForm.get('username'); }
  get password() { return this.loginForm.get('password'); }
}
