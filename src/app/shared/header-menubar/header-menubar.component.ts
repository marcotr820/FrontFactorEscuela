import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-header-menubar',
  templateUrl: './header-menubar.component.html',
  styleUrls: ['./header-menubar.component.css'],
  encapsulation: ViewEncapsulation.None //permitir agregar estilos
})
export class HeaderMenubarComponent implements OnInit {
  items: MenuItem[] = [];

  constructor(private authService: AuthService) { }

  private get superAdmin(): string{
    return 'SUPERADMIN';
  }

  ngOnInit(): void {
    this.items = [
      {label: 'Usuarios', icon: 'pi pi-fw pi-envelope', visible: this.authService._tokenDatos.role.includes(this.superAdmin), routerLink: 'usuarios'},
      {label: 'Roles', icon: 'pi pi-fw pi-unlock', routerLink: 'roles'},
      {label: 'Iniciar Sesion', visible: !this.authService.isLoggedIn$, icon: 'pi pi-fw pi-user', routerLink: 'login'},
      {label: 'Soporte', icon: 'pi pi-fw pi-envelope'},
      {label: 'Cerrar Sesion', visible: this.authService.isLoggedIn$, command: () => this.eliminarToken(), icon: 'pi pi-fw pi-user', routerLink: 'login'},
    ];
  }

  eliminarToken(){
    localStorage.removeItem('token');
  }

}
