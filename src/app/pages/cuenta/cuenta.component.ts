import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-cuenta',
  templateUrl: './cuenta.component.html',
  styleUrls: ['./cuenta.component.css']
})
export class CuentaComponent {

  public formCambiarPassword: FormGroup = this.fb.group({
    passwordActual: ['', [Validators.required]],
    nuevoPassword: ['', [Validators.required]]
  });

  constructor(private fb: FormBuilder){}

  cambiarPassword(){
    console.log('cambiando...');
  }

}
