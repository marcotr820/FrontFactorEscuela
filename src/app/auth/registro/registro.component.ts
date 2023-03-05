import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators, AsyncValidator} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { RegistroNormal } from './classes/registroNormal';
import { ValidatorService } from '../../shared/validator/validator.service';
import { EmailValidatorService } from '../../pages/usuario/services/email-validator.service';
import { HttpClient } from '@angular/common/http';

@Component({
   selector: 'app-registro',
   templateUrl: './registro.component.html',
   styleUrls: ['./registro.component.css'],
   encapsulation: ViewEncapsulation.None
})
export class RegistroComponent implements OnInit {

   registroForm: FormGroup = this.fb.group({
      userName: ['', 
         [Validators.required, Validators.minLength(5)],
         [this.emailValidator.validarUserName(this.http)]],
      email: ['', {
         validators: [Validators.required, Validators.pattern( this.validatorS.emailPattern )],
         asyncValidators: [this.emailValidator],
         // updateOn: 'change' //actualizacion de campo por propiedad
      }],
      password: ['', [Validators.required, Validators.minLength(7)]],
      password2: ['', [Validators.required]],
   }, {
      validators: [this.passwordsIguales("password", "password2")],
      // updateOn: 'submit'
   });

   constructor(private fb: FormBuilder, private router: Router, private authService: AuthService,
               private validatorS: ValidatorService, private emailValidator: EmailValidatorService,
               private http: HttpClient) {}
               
   ngOnInit(): void {}

   get userNameMsjError(): string{
      const error = this.registroForm.get('userName')?.errors;
      if(error?.['required']){ return 'El usuario es obligatorio.' }
      if(error?.['minlength']){ return 'El usuario debe tener mas de 5 caracteres.' }
      if(error?.['userNameTomado']){ return 'El nombre de usuario no esta disponible.' }
      return '';
   }
   
   get emailMsjError(): string {
      const error = this.registroForm.get('email')?.errors;
      if(error?.['required']){ return 'El email es obligatorio.' }
      if(error?.['pattern']){ return 'El email no tiene un formato correcto.' }
      if(error?.['emailTomado']){ return 'El email no esta disponible.' }
      return '';
   }

   crearUsuarioNormal(){
      if (!this.registroForm.valid) {
         Object.keys(this.registroForm.controls).forEach((key) => {
            this.registroForm.get(key)?.markAsDirty();
         });
         return;
      }
      let registroUsuario: RegistroNormal = this.registroForm.value;
      this.authService.crearUsuarioNormalService(registroUsuario).subscribe({
         next: (resp) => {
            console.log(resp);
            this.router.navigate(["/index"]);
         },
         error: (err) => {
            console.log(err);
         }
      });
   }

   campoNoValido(campo: string): boolean {
      if (!this.registroForm.get(campo)?.valid && this.registroForm.get(campo)?.dirty) {
         return true;
      }
      return false;
   }

   passwordsIguales(campo1:string, campo2:string){
      return (formGroup: AbstractControl) : ValidationErrors | null => {
         const pass1 = formGroup.get(campo1)?.value;
         const pass2 = formGroup.get(campo2)?.value;
         if (pass1 !== pass2){
            formGroup.get(campo2)?.setErrors({ noIguales: true });
            return { noIguales: true }
         }
         formGroup.get(campo2)?.setErrors(null);
         return null;
      }
   }

}
