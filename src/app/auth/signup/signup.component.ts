import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  isLoading=false;
  authSub:Subscription;

  constructor(public authService:AuthService) { }

  ngOnInit(): void {
    this.isLoading=false;
    this.authSub=this.authService.getAuthListener().subscribe(isAuth => this.isLoading=false);
  }

  ngOnDestroy(): void {
  this.authSub.unsubscribe();
  }
  
  onSignup(form:NgForm){
    if(form.invalid) return;
    this.isLoading=true;
    this.authService.createUser(form.value.name,form.value.email,form.value.password);

  }

}
