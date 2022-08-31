import {HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest} from  "@angular/common/http";
import { catchError, throwError } from "rxjs";
import {MatDialog} from '@angular/material/dialog';
import { Injectable } from "@angular/core";
import { ErrorComponent } from "./error/error.component";
import { AgriFreshService } from './services/agrifresh.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor{

    constructor(public dialog: MatDialog,
        public agriFreshService: AgriFreshService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler){
        return next.handle(req)  //outgoing request interceptor
        //incoming response interceptor
        .pipe(
            catchError((error: HttpErrorResponse)=>{
                console.log(error);
                let errMsg="An unknown Error Occured! Please try again later.";
                if(error.error.message){
                    errMsg=error.error.message;
                }
                this.agriFreshService.loaded=true;
                this.dialog.open(ErrorComponent,{data:{message:errMsg}})
                return throwError(()=> error);
            })
        );
    }

}