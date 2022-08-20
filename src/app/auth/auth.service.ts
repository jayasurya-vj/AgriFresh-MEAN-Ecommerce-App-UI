import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import { AuthData } from './auth.model';
import {Subject} from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn:"root"})
export class AuthService{

   
    domain=environment.apiDomain;
    private token:string;
    private _isAuth = false;
    private isAuthenticated = new Subject<boolean>();
    private logoutTimer:any;
    private _isRedirectedToAuth:string = 'no';

    constructor(private http:HttpClient,
        private activatedRoute: ActivatedRoute, 
        private router :Router){
        this.activatedRoute.queryParams.subscribe(queryParams => {
            this.isRedirectedToAuth = queryParams['redirect'];
        })
    }

    getToken(){
        let token = localStorage.getItem("token");
        return token;
    }

    getAuthListener(){
        return this.isAuthenticated.asObservable();
    }

    get isRedirectedToAuth(){
        return this._isRedirectedToAuth;
    }

    set isRedirectedToAuth(val){
        this._isRedirectedToAuth=val;
    }

    get userId(){
        return localStorage.getItem("userId") || null;
    }

    get userName(){
        return localStorage.getItem("userName") || null;
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

    createUser(name:string,email:string,password:string){
        const authData :AuthData = {
            name:name,
            email: email,
            password: password
        }
        this.http.post<{message:string,token:string,expiresIn:number, userId:string, name:string}>(this.domain + "/api/user/signup",authData).subscribe(response=>{
           this.token=response.token;
            if(this.token && response.expiresIn){                
                this.setLogoutTimer(response.expiresIn);
                let expiryDate = new Date( new Date().getTime() + response.expiresIn*1000); 
                this.setAuth(this.token,expiryDate,response.userId,response.name);
                this._isAuth=true;
                this.isAuthenticated.next(true);
                this.router.navigate(["/"]);
            }
        },error=>{
            this.isAuthenticated.next(false);
        });
    }

    loginUser(email:string,password:string){
        const authData :AuthData = {
            email: email,
            password: password
        }
        this.http.post<{message:string,token:string,expiresIn:number, userId:string, name:string}>(this.domain + "/api/user/login",authData)
        .subscribe(response=>{
            this.token=response.token;
            if(this.token && response.expiresIn){                
                this.setLogoutTimer(response.expiresIn);
                let expiryDate = new Date( new Date().getTime() + response.expiresIn*1000); 
                this.setAuth(this.token,expiryDate,response.userId,response.name);
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

    private setAuth(token:string, expiryDate:Date, userId:string, name:string=''){
        localStorage.setItem("token",token);
        localStorage.setItem("expiryDate",expiryDate.toISOString());
        localStorage.setItem("userId",userId);
        localStorage.setItem("userName",name);
    }

    private getAuth(){
      let token = localStorage.getItem("token");
      let expiryDate =  localStorage.getItem("expiryDate");
      let userId =  localStorage.getItem("userId");
      let userName =  localStorage.getItem("userName");
      if(!token || !expiryDate) return null;
      return {token, expiryDate: new Date(expiryDate), userId, userName}
    }

    private removeAuth(){
        localStorage.removeItem("token");
        localStorage.removeItem("expiryDate");
        localStorage.removeItem("userId");
        localStorage.removeItem("userName");
    }
}