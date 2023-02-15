import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesComponent } from './pages.component';
import { IndexComponent } from './index/index.component';
import { RouterModule } from '@angular/router';
import { UsuarioComponent } from './usuario/usuario.component';



@NgModule({
  declarations: [
    PagesComponent,
    IndexComponent,
    UsuarioComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    PagesComponent,
    IndexComponent
  ]
})
export class PagesModule { }
