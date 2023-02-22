import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { PagesComponent } from './pages.component';
import { AuthGuard } from '../auth/guards/auth.guard';
import { UsuarioComponent } from './usuario/usuario.component';
import { RolComponent } from './rol/rol.component';
import { TieneRolGuard } from '../auth/guards/tiene-rol.guard';

const rutasHijas: Routes = [
  {
    path: '',
    component: PagesComponent, //componente con El style que heredan las rutas hijas
    canActivate: [AuthGuard],
    children: [
      { path: '', component: IndexComponent },
      { path: 'usuarios', component: UsuarioComponent, canActivate: [TieneRolGuard],
        data: {
          role: 'SUPERADMIN',
        }
      },
      { path: 'roles', component: RolComponent},
    ]
  },
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(rutasHijas),
  ],
  exports: [RouterModule]
})

export class PagesRoutingModule { }
