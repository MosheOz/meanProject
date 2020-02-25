import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isUserAuthenticated = false;
  IsAuthSub: Subscription;

  constructor(private authService: AuthService){}

  ngOnInit(){
    this.isUserAuthenticated = this.authService.getIsUserAutheticated();
    this.IsAuthSub = this.authService.getStatusListener().subscribe(
      isAuth => {
        this.isUserAuthenticated = isAuth;
      }
    );
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy(){
    this.IsAuthSub.unsubscribe();
  }
}
