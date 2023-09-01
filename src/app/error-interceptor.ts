import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { Injectable } from "@angular/core";
import {catchError} from "rxjs/operators";
import { MatDialog } from "@angular/material/dialog";
import { ErrorComponent } from "./error/error.component";


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    
    constructor(private dialog: MatDialog) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                console.log(error);

                let errorMessage = "An unknown error has occurred";
                if(error.error.message) {
                    errorMessage = error.error.message;
                }
                this.dialog.open(ErrorComponent, {data: {message: errorMessage}});
                return throwError(error);
                // return throwError(() => new Error(error.error.message));
            })
        )
    }
}