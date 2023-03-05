import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-restablecer-password',
  templateUrl: './restablecer-password.component.html',
  styleUrls: ['./restablecer-password.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class RestablecerPasswordComponent implements OnInit {

  private reset_token: string = '';
  private email: string = '';
  errorMsj: boolean = false;
  passwordRestablecidoMsj: boolean = false;

  form:FormGroup = this.fb.group({
    password:['', [Validators.required, Validators.minLength(7)]],
    passwordConfirmado:['', [Validators.required]]
  }, {
    validators: [this.passwordsIguales("password", "passwordConfirmado")],
  });

  constructor(private routeActiva: ActivatedRoute, private fb: FormBuilder, private authService: AuthService,
              private router: Router){
    this.routeActiva.queryParamMap.subscribe((param: ParamMap) => {
      this.reset_token = param.get('reset_token') || '';
      this.email = param.get('email') || '';
    });

    if(!(!!this.reset_token) || !(!!this.email)){
      this.router.navigateByUrl("/login");
    }
  }

  ngOnInit(): void {
    //EJEMPLO  console.log(this.route.snapshot.queryParamMap.get('email'));
  }

  restablecerPassword(){
    if (!this.form.valid) {
      Object.keys(this.form.controls).forEach((key) => {
         this.form.get(key)?.markAsDirty();
      });
      return;
   }
    this.authService.restablecerPassword(this.form.value, this.reset_token, this.email).subscribe({
      next: (resp) => {
        this.passwordRestablecidoMsj = true;
      },
      error: (err) => {
        this.errorMsj = true;
        console.log(err);
      }
    })
  }

  campoNoValido(campo: string): boolean {
    if (!this.form.get(campo)?.valid && this.form.get(campo)?.dirty) {
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
