import { Component } from '@angular/core';
import { AgriFreshService } from './services/agrifresh.service';
import { AuthService } from './auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'AgriFresh';
  isAuthenticated = false;
  authSub: Subscription;

  constructor(private authService: AuthService,
    public agriFreshService: AgriFreshService) {
    this.authService.autoAuthenticate();
    this.isAuthenticated = this.authService.isAuth;
    this.authSub = this.authService.getAuthListener().subscribe(auth => {
      this.isAuthenticated = auth;
    })
    this.agriFreshService.getProducts();
    window.scroll(0, 0);
  }

  scrollToTop() {
    window.scroll(0, 0);
  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
  }

}
