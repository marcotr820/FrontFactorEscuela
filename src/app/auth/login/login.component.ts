import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LoginUsuario } from '../classes/loginUsuario';
import { MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
   selector: 'app-login',
   templateUrl: './login.component.html',
   styleUrls: ['./login.component.css'],
   providers: [MessageService],
   encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {

   modalBloqueoVisible: boolean = false;
   mensajeAlertaErrorVisible: boolean = false;

   loginForm: FormGroup = this.fb.group({
      userName: ['', [Validators.required, Validators.minLength(5)]],
      password: ['', [Validators.required, Validators.minLength(7)]]
   }, {
      // updateOn: 'submit'
   });

   constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) { }

   ngOnInit(): void {
      this.ocultarAlertaMensajeError();
   }

   ocultarAlertaMensajeError(): void{
      this.loginForm.valueChanges.subscribe( (val) => {
         if(this.mensajeAlertaErrorVisible){
            this.mensajeAlertaErrorVisible = false;
         }
      });
   }

   ocultarModalBloqueo(valor: boolean) {
      if (!valor) { this.modalBloqueoVisible = valor; }
   }

   login() {
      if (!this.loginForm.valid) {
         let formKeys = this.loginForm.controls;
         Object.keys(formKeys).forEach((key) => {
            this.loginForm.get(key)?.markAsDirty();
         });
         return;
      }
      let loginUsuario: LoginUsuario = this.loginForm.value;
      this.authService.loginService(loginUsuario).subscribe({
         next: (resp) => {
            var datosUsuario = resp.dataResult.usuario || '';
            if(!!resp.dataResult.token && !(!!datosUsuario)){
               this.router.navigateByUrl('/');
               return;
            }
            if (resp.dataResult.usuario.isBlocked) {
               this.modalBloqueoVisible = true;  //mostrarModal bloqueo
            }
         },
         error: (err: HttpErrorResponse) => {
            this.mensajeAlertaErrorVisible = true;
         }
      });
   }

   campoNoValido(campo: string) {
      if (this.loginForm.get(campo)?.invalid && this.loginForm.get(campo)?.dirty) {
         return true;
      }
      return false;
   }

}
