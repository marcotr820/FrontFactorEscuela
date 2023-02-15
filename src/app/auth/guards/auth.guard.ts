import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService,
    private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.authService.validarRenovarToken()
      .pipe(
        tap(estaAutenticado => {
          if (!estaAutenticado) {
            //si el usuario no esta autenticado o el token expiro devolvemos al login
            this.router.navigateByUrl("/login");
          }
        })
      );
  }
}
