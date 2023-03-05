import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../auth/services/auth.service';
import { Usuario } from '../usuario/classes/usuario';

@Component({
   selector: 'app-cuenta',
   templateUrl: './cuenta.component.html',
   styleUrls: ['./cuenta.component.css']
})
export class CuentaComponent {

   public mostrarModalUserName: boolean = false;
   private usuario = new Usuario();
   public formCambiarPassword: FormGroup = this.fb.group({
      passwordActual: ['', [Validators.required]],
      nuevoPassword: ['', [Validators.required]]
   });

   constructor(private fb: FormBuilder, private authService: AuthService) {
      this.usuario = this.authService.getDatosUsuario;
   }

   get getDatosUsuario() { return this.usuario; }

   cambiarPassword() {
      console.log('cambiando...');
   }

   modalEditarUserNameVisible() {
      this.mostrarModalUserName = true;
   }
   ocultarModalUserName(valor: boolean){
      if (!valor) {
         this.mostrarModalUserName = valor;
      }
   }
   ocultarModalUserNameCancelado(valor: boolean) {
      if (!valor) {
         this.mostrarModalUserName = valor;
      }
   }

}
