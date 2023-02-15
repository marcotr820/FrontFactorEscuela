import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-header-menubar',
  templateUrl: './header-menubar.component.html',
  styleUrls: ['./header-menubar.component.css'],
  encapsulation: ViewEncapsulation.None //permitir agregar estilos
})
export class HeaderMenubarComponent implements OnInit {
  items: MenuItem[]=[];
  constructor() { }

  ngOnInit(): void {
    this.items = [
      {label: 'Usuarios', icon: 'pi pi-fw pi-envelope', routerLink: 'usuarios'},
      {label: 'Roles', icon: 'pi pi-fw pi-unlock', routerLink: 'roles'},
      {label: 'Iniciar Sesion', icon: 'pi pi-fw pi-user', routerLink: 'login'},
      {label: 'Soporte', icon: 'pi pi-fw pi-envelope'},
    ];
  }

}
