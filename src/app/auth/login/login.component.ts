import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LoginUsuario } from '../classes/loginUsuario';
import { Message, MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {

  formularioEnviado = false;
  modalBloqueoVisible:boolean = false; 
  msjError: Message[] = [];

  loginForm:FormGroup = this.fb.group({
    userName: ['superadmin', [Validators.required, Validators.minLength(1)]],
    password: ['Admin123*', [Validators.required, Validators.minLength(1)]]
  }, {
    updateOn: 'submit'
  });

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
  }

  mostrarMensajeError(msj: string){
    this.msjError = [{severity:'error', detail:msj}];
  }

  ocultarModalBloqueo(valor: boolean){ 
    if(!valor){ this.modalBloqueoVisible = valor; }
  }

  login() {
    this.formularioEnviado = true;
    if (this.loginForm.invalid) { this.loginForm.markAllAsTouched(); return; }
    let loginUsuario: LoginUsuario = this.loginForm.value;
    this.authService.loginService(loginUsuario).subscribe({
      next: (resp) => {
        // console.log(resp);
        if(resp.dataResult.isBlocked){
          this.modalBloqueoVisible = true;  //mostrarModal
        }else {
          this.router.navigateByUrl('/');
        }
      },
      error: (err: HttpErrorResponse) => {
        if(!!err.error.error){
          this.mostrarMensajeError(err.error.error);
          this.loginForm.controls['password'].reset();
        }
      }
    });
    this.formularioEnviado = false;
  }

  campoNoValido(campo: string){
    if(this.loginForm.get(campo)?.invalid && this.formularioEnviado){
      return true;
    }
    return false;
  }

}
