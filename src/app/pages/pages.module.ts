import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesComponent } from './pages.component';
import { IndexComponent } from './index/index.component';
import { RouterModule } from '@angular/router';
import { UsuarioComponent } from './usuario/usuario.component';
import { SharedModule } from '../shared/shared.module';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
//animaciones tabla
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CrearEditarUsuarioComponent } from './usuario/components/crear-editar-usuario/crear-editar-usuario.component';
import { RolComponent } from './rol/rol.component';
import { SelectRolComponent } from './rol/components/select-rol/select-rol.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    PagesComponent,
    IndexComponent,
    UsuarioComponent,
    CrearEditarUsuarioComponent,
    RolComponent,
    SelectRolComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    PrimeNgModule,
    BrowserAnimationsModule,
    FormsModule,  //importamos formsmodule para el uso del ngmodel en el select de la tabla
    ReactiveFormsModule
  ],
  exports: [
    PagesComponent,
    IndexComponent
  ]
})
export class PagesModule { }
