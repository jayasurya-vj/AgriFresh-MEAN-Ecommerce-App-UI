import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import { Router } from "@angular/router";
import { AuthData } from './auth.model';
import {Subject} from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn:"root"})
export class AuthService{

    // environment.apiDomain
    domain="http://localhost:5000";
    private token:string;
    private _isAuth = false;
    private isAuthenticated = new Subject<boolean>();
    private logoutTimer:any;

    constructor(private http:HttpClient, private router :Router){
    }

    getToken(){
        let token = localStorage.getItem("token");
        return token;
    }

    getAuthListener(){
        return this.isAuthenticated.asObservable();
    }

    get userId(){
        return localStorage.getItem("userId") || null;
    }

    get isAuth(){
        return this._isAuth;
    }

    autoAuthenticate(){
        const authInfo = this.getAuth();
        if(!authInfo) return;        
        let expiresIn = authInfo.expiryDate.getTime() - (new Date()).getTime() ; 
        if(expiresIn<0) return;
        this.setLogoutTimer(expiresIn/1000);
        this._isAuth=true;
        this.isAuthenticated.next(true);

    }

    createUser(email:string,password:string){
        const authData :AuthData = {
            email: email,
            password: password
        }
        this.http.post(this.domain + "/api/user/signup",authData).subscribe(response=>{
            console.log(response);
            this.router.navigate(["/"]);
        },error=>{
            this.isAuthenticated.next(false);
        });
    }

    loginUser(email:string,password:string){
        const authData :AuthData = {
            email: email,
            password: password
        }
        this.http.post<{message:string,token:string,expiresIn:number, userId:string}>(this.domain + "/api/user/login",authData)
        .subscribe(response=>{
            console.log(response);
            this.token=response.token;
            if(this.token && response.expiresIn){                
                this.setLogoutTimer(response.expiresIn);
                let expiryDate = new Date( new Date().getTime() + response.expiresIn*1000); 
                console.log(expiryDate);
                this.setAuth(this.token,expiryDate,response.userId);
                this._isAuth=true;
                this.isAuthenticated.next(true);
                this.router.navigate(["/"]);
            }
        },error=>{
            this.isAuthenticated.next(false);
        });
    }

    logout(){
        this.token=null;
        this._isAuth=false;
        this.isAuthenticated.next(false);
        this.removeAuth();
        clearTimeout(this.logoutTimer);
        this.router.navigate(["/"]);
    }

    private setLogoutTimer(expiresIn:number){
        this.logoutTimer = setTimeout(()=>this.logout(), expiresIn *1000)
    }

    private setAuth(token:string, expiryDate:Date, userId:string){
        localStorage.setItem("token",token);
        localStorage.setItem("expiryDate",expiryDate.toISOString());
        localStorage.setItem("userId",userId);
    }

    private getAuth(){
      let token = localStorage.getItem("token");
      let expiryDate =  localStorage.getItem("expiryDate");
      let userId =  localStorage.getItem("userId");
      if(!token || !expiryDate) return null;
      return {token, expiryDate: new Date(expiryDate), userId}
    }

    private removeAuth(){
        localStorage.removeItem("token");
        localStorage.removeItem("expiryDate");
        localStorage.removeItem("userId");
    }
}