import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { LoginComponent } from './login/login.component';
import { RegistroComponent } from './registro/registro.component';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { TokenInterceptorService } from './interceptores/token-interceptor.service';

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
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptorService, multi: true}
  ]
})
export class AuthModule { }
