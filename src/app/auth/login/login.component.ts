import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoading=false;
  authSub:Subscription;

  constructor(public authService:AuthService) { }

  

  ngOnInit(): void {
    this.isLoading=false;
    this.authSub= this.authService.getAuthListener().subscribe(isAuth => this.isLoading=false);
  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
    }
  
  onLogin(form:NgForm){
    if(form.invalid) return;
    this.isLoading=true;
    this.authService.loginUser(form.value.email,form.value.password);
  }

  getQueryParam(){
    if(this.authService.redirectedFrom){
        return {redirect : this.authService.redirectedFrom};
    }else{
        return null;
    }
  }
}
