import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, throwError, of, catchError } from 'rxjs';
//import { catchError, map, tap } from 'rxjs/operators';
import { User } from './user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}
  isLoggedIn=false;
  redirectUrl: string | null = null;

  private uri = 'http://localhost:8000/api/auth';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  private handleError(error: HttpErrorResponse) {
    if (error.status === 501) {
      
      console.error('An error occurred:', error.error);
    } else {
      
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    // Return an observable with a user-facing error message.
    return throwError(() => new Error('userName already exist'));
  }

  addUser(user: User): Observable<unknown> {
    return this.http.post(`${this.uri}/signup`, user)
    .pipe(catchError(this.handleError));
  }

  login(user:any):Observable<unknown>{
    return this.http.post(`${this.uri}/login`, user)
    .pipe(catchError(this.handleError));
  }
}
