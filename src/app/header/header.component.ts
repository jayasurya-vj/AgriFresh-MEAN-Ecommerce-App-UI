import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import {AuthService} from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  isAuthenticated=false;
  authSub:Subscription;

  constructor(public authService:AuthService) { }

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isAuth;
    this.authSub = this.authService.getAuthListener().subscribe(auth=>{
      this.isAuthenticated=auth;
    })
  }

  ngOnDestroy() : void {
    this.authSub.unsubscribe();
  }
}
