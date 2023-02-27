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
import { RolComponent } from './rol/rol.component';
import { SelectRolComponent } from './rol/components/select-rol/select-rol.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CuentaComponent } from './cuenta/cuenta.component';
import { CrearEditarRolComponent } from './rol/components/crear-editar-rol/crear-editar-rol.component';
import { CrearUsuarioComponent } from './usuario/components/crear-usuario/crear-usuario.component';
import { EditarUsuarioComponent } from './usuario/components/editar-usuario/editar-usuario.component';

@NgModule({
  declarations: [
    PagesComponent,
    IndexComponent,
    UsuarioComponent,
    CrearUsuarioComponent,
    RolComponent,
    SelectRolComponent,
    CuentaComponent,
    CrearEditarRolComponent,
    EditarUsuarioComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    PrimeNgModule,
    BrowserAnimationsModule,
    FormsModule,  //importamos formsModule para el uso del ngmodel en el select de la tabla
    ReactiveFormsModule
  ],
  exports: [
    PagesComponent,
    IndexComponent
  ]
})
export class PagesModule { }
