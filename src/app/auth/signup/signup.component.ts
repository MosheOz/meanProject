import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
  isLoading = false;
  authSub: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authSub = this.authService.getStatusListener().subscribe(authStatus => {
        this.isLoading = false;
    });
  }

  onSignup(form: NgForm) {
    if (!form.valid) {
      return;
    }
    this.isLoading = true;
    this.authService.createUser(form.value.emailInput, form.value.passwordInput);
  }

  ngOnDestroy() {
    this.authSub.unsubscribe();
  }
}
