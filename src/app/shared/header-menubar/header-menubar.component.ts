import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../auth/services/auth.service';
import { CS } from '../classes/CS';

@Component({
  selector: 'app-header-menubar',
  templateUrl: './header-menubar.component.html',
  styleUrls: ['./header-menubar.component.css'],
  encapsulation: ViewEncapsulation.None //permitir agregar estilos
})
export class HeaderMenubarComponent implements OnInit {
  items: MenuItem[] = [];

  constructor(private authService: AuthService) {}

  private get rolSuperAdminRolAdmin(): string[]{
    return [CS.SUPERADMIN, CS.ADMIN];
  }

  ngOnInit(): void {
    this.items = [
      {
        label: 'Usuarios', icon: 'pi pi-fw pi-envelope', routerLink: 'usuarios', 
        visible: this.rolSuperAdminRolAdmin.includes(this.authService._tokenDatos.role)
      },
      {label: 'Roles', icon: 'pi pi-fw pi-unlock', routerLink: 'roles'},
      {label: 'Iniciar Sesion', visible: !this.authService.isLoggedIn$, icon: 'pi pi-fw pi-user', routerLink: 'login'},
      {label: 'Soporte', icon: 'pi pi-fw pi-envelope'},
      {label: 'Cuenta', icon: 'pi pi-fw pi-android', routerLink: 'cuenta'},
      // {icon: 'pi pi-fw pi-user', visible: this.authService.isLoggedIn$, command: () => this.eliminarToken(), routerLink: 'login'},
      {
        styleClass:'estilo-dropdown alinear-derecha',
        icon: 'pi pi-fw pi-user',
        items: [
          {label: 'Registro Como: jose luis perales@gmail.com', disabled: true},
          {separator:true},
          {label: 'Cerrar Sesion', visible: this.authService.isLoggedIn$, command: () => this.eliminarToken(), routerLink: 'login'}
        ]
      }
    ];
  }

  eliminarToken(){
    localStorage.removeItem('token');
  }

}
