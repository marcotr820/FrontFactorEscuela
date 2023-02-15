import { NgModule } from '@angular/core';

import { RouterModule, Routes } from "@angular/router";
import { PagesRoutingModule } from './pages/pages-routing.module';

import { AuthRoutingModule } from './auth/auth-routing.module';

const rutasPrincipales: Routes = [
   //las rutas de Pages, login, register se cargan por que importamos las rutas hijas de los modulos
   {
      path: '**',
      redirectTo: '', pathMatch: 'full'
   }
];

@NgModule({
   declarations: [],
   imports: [
      RouterModule.forRoot(rutasPrincipales),
      PagesRoutingModule,
      AuthRoutingModule
   ],
   exports: [
      RouterModule
   ]
})

export class AppRoutingModule { }
