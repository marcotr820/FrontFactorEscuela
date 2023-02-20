import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LoginUsuarioDto } from '../classes/loginUsuarioDto';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
  }

  public formSubmitted = false;

  loginForm = this.fb.group({
    userName: ["superadmin", [Validators.required, Validators.minLength(1)]],
    password: ["Admin123*", [Validators.required, Validators.minLength(1)]]
  });

  login() {
    this.formSubmitted = true;
    if (this.loginForm.invalid) { return; }
    let loginInfo: LoginUsuarioDto = {
      userName: this.loginForm.controls['userName'].value!,
      password: this.loginForm.controls['password'].value!,
    };
    this.authService.loginService(loginInfo).subscribe({
      next: (resp) => {
        if (resp.dataResult.isBlocked) {
          console.log(resp);
          alert("estas bloqueado wachin");
        } else {
          this.router.navigate(["/index"]);
        }
      },
      error: (err) => console.log(err)
    });
  }

  campoNoValido(campo: string): boolean {
    if (this.loginForm.get(campo)?.invalid && this.formSubmitted) {
      return true;
    }
    return false;
  }

}
