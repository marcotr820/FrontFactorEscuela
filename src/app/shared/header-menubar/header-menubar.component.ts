import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../auth/services/auth.service';
import { CS } from '../classes/CS';
import { Usuario } from '../../pages/usuario/classes/usuario';

@Component({
   selector: 'app-header-menubar',
   templateUrl: './header-menubar.component.html',
   styleUrls: ['./header-menubar.component.css'],
   encapsulation: ViewEncapsulation.None //permitir agregar estilos
})
export class HeaderMenubarComponent implements OnInit {

   items: MenuItem[] = [];
   private usuario = new Usuario();

   constructor(private authService: AuthService) {
      this.usuario = this.authService.getDatosUsuario;
   }

   get getDatosUsuario(){ return this.usuario; }

   private get rolSuperAdminRolAdmin(): string[] {
      return [CS.SUPERADMIN, CS.ADMIN];
   }

   private get rolAdmin(): string[] {
      return [CS.ADMIN];
   }

   private get rolSuperAdmin(): string[] {
      return [CS.SUPERADMIN];
   }

   ngOnInit(): void {
      this.items = [
         {
            label: 'Usuarios', icon: 'pi pi-fw pi-users', routerLink: 'usuarios',
            visible: this.rolSuperAdminRolAdmin.includes(this.authService._tokenDatos.role)
         },
         {
            label: 'Roles', routerLink: 'roles',
            visible: this.rolSuperAdmin.includes(this.authService._tokenDatos.role)
         },
         { label: 'Iniciar Sesion', visible: !this.authService.isLoggedIn$, routerLink: 'login' },
         { label: 'Soporte', icon: 'pi pi-fw pi-envelope' },
         { label: 'Configuración', icon: 'pi pi-fw pi-cog', routerLink: 'cuenta' },
         // {icon: 'pi pi-fw pi-user', visible: this.authService.isLoggedIn$, command: () => this.eliminarToken(), routerLink: 'login'},
         {
            styleClass: 'estilo-dropdown alinear-derecha',
            icon: 'pi pi-fw pi-user',
            items: [
               { label: this.getDatosUsuario.userName, disabled: true},
               { separator: true },
               { label: 'Cerrar Sesion', visible: this.authService.isLoggedIn$, command: () => this.eliminarToken(), routerLink: 'login' }
            ]
         }
      ];
   }

   eliminarToken() {
      localStorage.removeItem('token');
   }

}
