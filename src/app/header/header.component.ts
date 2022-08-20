import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import {AuthService} from '../auth/auth.service';
import {AgriFreshService} from '../services/agrifresh.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  isAuthenticated=false;
  authSub:Subscription;
  isDropdownOpen=false;
  
  constructor(public authService:AuthService,
    public agriFreshService:AgriFreshService) { }

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
