import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";


@Injectable()
export class AuthGuard implements CanActivate{
    constructor(public authService:AuthService, private router :Router) { }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        if(this.authService.isAuth) return true;
        else{
            this.router.navigate(["/user/login"]);
            return false;
        }
    }

}