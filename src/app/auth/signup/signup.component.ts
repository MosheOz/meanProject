import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  isLoading = false;

  constructor(private authSerive: AuthService){}

  onSignup(form: NgForm) {
    this.authSerive.createUser(form.value.emailInput, form.value.passwordInput);
  }
}
