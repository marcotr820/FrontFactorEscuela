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

@NgModule({
  declarations: [
    PagesComponent,
    IndexComponent,
    UsuarioComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    PrimeNgModule,
    BrowserAnimationsModule
  ],
  exports: [
    PagesComponent,
    IndexComponent
  ]
})
export class PagesModule { }
