import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators, AsyncValidator } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { RegistroNormal } from './classes/registroNormal';
import { ValidatorService } from '../../shared/validator/validator.service';
import { EmailValidatorService } from '../../pages/usuario/services/email-validator.service';

@Component({
   selector: 'app-registro',
   templateUrl: './registro.component.html',
   styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

   formularioEnviado = false;
   registroForm: FormGroup = this.fb.group({
      userName: ['', [Validators.required]],
      email: ['', {
         validators: [Validators.required, Validators.pattern( this.validatorS.emailPattern )],
         asyncValidators: [this.emailValidator],
         updateOn: 'blur' //actualizacion de campo por propiedad
      }],
      password: ['', [Validators.required]],
      password2: ['', [Validators.required]],
   }, {
      validators: [this.passwordsIguales("password", "password2")],
      // updateOn: 'submit'
   });

   constructor(private fb: FormBuilder, private router: Router, private authService: AuthService,
               private validatorS: ValidatorService, private emailValidator: EmailValidatorService) {}
               
   ngOnInit(): void {
      
   }
   
   get emailMsjError(): string {
      const errores = this.registroForm.get('email')?.errors;
      if(errores?.['required']){ return 'El email es obligatorio.' }
      if(errores?.['pattern']){ return 'El email no tiene un formato correcto.' }
      if(errores?.['emailTomado']){ return 'El email ya está en uso.' }
      return '';
   }

   crearUsuarioNormal(){
      this.formularioEnviado = true;
      if (this.registroForm.invalid) { this.registroForm.markAllAsTouched(); return; }

      console.log('enviado');
      
      let registroUsuario: RegistroNormal = this.registroForm.value;
      this.authService.crearUsuarioNormalService(registroUsuario).subscribe({
         next: (resp) => {
            this.router.navigate(["/index"]);
         },
         error: (err) => console.log(err)
      });
      this.formularioEnviado = false;
   }

   // passwordNoConinciden(){
   //    const pass1 = this.registroForm.get("password")?.value;
   //    const pass2 = this.registroForm.get("password2")?.value;
   //    if ( (pass1 !== pass2) && this.formSubmitted) {
   //       return true;
   //    }
   //    return false;
   // }

   campoNoValido(campo: string): boolean {
      if (this.registroForm.get(campo)?.invalid && this.formularioEnviado) {
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
