import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) { }

  public formSubmitted = false;

  public loginForm = this.fb.group({
    userName: ["superadmin", Validators.required],
    password: ["Admin123*", Validators.required]
  });

  login() {
    this.formSubmitted = true;
    if (this.loginForm.invalid) { return; }
    this.authService.loginService(this.loginForm.value).subscribe({
      next: (resp) => {
        if (resp.isBlocked) {
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
