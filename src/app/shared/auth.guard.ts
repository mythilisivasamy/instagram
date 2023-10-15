import { Injectable } from '@angular/core';
import {
  CanLoad,
  Route,
  Router
} from '@angular/router';
import {UserService } from './userService';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanLoad{
  constructor(private userService: UserService, private router: Router) {}
  canLoad(route: Route): boolean {
    const url = `/${route.path}`;

    return this.checkLogin(url);
  }

  checkLogin(url: string): boolean {
    if (this.userService.isLoggedIn) {
      return true;
    } else {
      this.userService.redirectUrl = url;
      this.router.navigate(['/login']);
      return false;
    }
  }
}
