import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if(localStorage.getItem('token') !== null && localStorage.getItem('token') !== undefined) {
      const token =  localStorage.getItem('token')!;
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
      const Request = request.clone({ headers: headers });
      return next.handle(Request)
    } else {
      return next.handle(request);
    }
  }
}
