import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
   selector: 'app-registro',
   templateUrl: './registro.component.html',
   styleUrls: ['./registro.component.css']
})
export class RegistroComponent {

   public formSubmitted = false;

   public registroForm = this.fb.group({
      userName: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      password2: ['', Validators.required],
   }, {
      validators: [this.passwordsIguales("password", "password2")]
   });

   constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) { }

   registrarUsuario(){
      this.formSubmitted = true;
      if (this.registroForm.invalid) { return; }
      this.authService.registrarService(this.registroForm.value).subscribe({
         next: (resp) => {
            this.router.navigate(["/index"]);
         },
         error: (err) => console.log(err)
      });
   }

   passwordNoConinciden(){
      const pass1 = this.registroForm.get("password")?.value;
      const pass2 = this.registroForm.get("password2")?.value;
      if ( (pass1 !== pass2) && this.formSubmitted) {
         return true;
      }
      return false;
   }

   campoNoValido(campo: string): boolean {
      if (this.registroForm.get(campo)?.invalid && this.formSubmitted) {
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
         return null
      }
   }

}
