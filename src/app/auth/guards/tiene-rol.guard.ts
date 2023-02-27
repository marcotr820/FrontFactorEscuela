import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class TieneRolGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router){}

  canActivate(route: ActivatedRouteSnapshot,state: RouterStateSnapshot): Observable<boolean 
              | UrlTree> 
              | Promise<boolean 
              | UrlTree> 
              | boolean 
              | UrlTree {
    const roles: string[] = route.data['rolesPermitidos'];
    const rolUsuario: string = this.authService._tokenDatos.role;
    const tieneElRol = roles.includes(rolUsuario);
    if(!tieneElRol){
      alert('No tienes permisos');
      this.router.navigateByUrl("/");
    }
    return tieneElRol;
  }
}
