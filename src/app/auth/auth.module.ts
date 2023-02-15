import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { LoginComponent } from './login/login.component';
import { RegistroComponent } from './registro/registro.component';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';

@NgModule({
  declarations: [
    LoginComponent,
    RegistroComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule,
    PrimeNgModule
  ],
  exports: [
    LoginComponent,
    RegistroComponent
  ]
})
export class AuthModule { }
