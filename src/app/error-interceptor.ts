import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { MatDialog } from '@angular/material';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { ErrorComponent } from './error/error.component';
import { Injectable } from '@angular/core';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private dialog: MatDialog) {}

  intercept(req: HttpRequest<any>, next: HttpHandler){
    return next.handle(req).pipe(
      catchError(error => {
        let errorMessage = 'An unknown error occured!';
        if(error.error.message) {
          errorMessage = error.error.message;
        }
        this.dialog.open(ErrorComponent, { data: { message: errorMessage }});
        return throwError(error);
      })
    )
  }
}
