import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Rol } from '../../classes/rol';
import { RolService } from '../../services/rol.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-crear-editar-rol',
  templateUrl: './crear-editar-rol.component.html',
  styleUrls: ['./crear-editar-rol.component.css']
})
export class CrearEditarRolComponent {
  mostrarModal: boolean = false;
  formRol: FormGroup = this.fb.group({
    id: ['', []],
    name: ['', [Validators.required]]
  });
  
  constructor(private fb: FormBuilder, private rolService: RolService) { }

  @Input() set mostrarModalInput(mostrarModal: boolean) {
    if (mostrarModal) {
      this.mostrarModalFuncion();
    }
  }
  @Input() set rolValueInput(rolValue: Rol){
    if(rolValue && (!!rolValue.id)){
      const { id, name } = rolValue;
      this.formRol.patchValue({
        id,
        name,
      });
    }
  }
  @Output() ocultarModalDatoCreadoOutput: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() modalCanceladoOutput: EventEmitter<boolean> = new EventEmitter<boolean>();

  registrarRol(event: Event) {
    event.preventDefault();
    if (this.formRol.invalid) {
      this.formRol.markAllAsTouched();
      return;
    }
    let rol: Rol = this.formRol.value;
    this.rolService.registrarRol(rol).subscribe({
      next: (resp) => {
        console.log(resp);
        this.ocultarModalDatoCreado();
      },
      error: (err: HttpErrorResponse) => {
        console.log(err.error);
        
      }
   })
  }

  mostrarModalFuncion(){ this.mostrarModal = true; }

  cancelarModal(){
    this.formRol.reset();
    this.mostrarModal = false
    this.modalCanceladoOutput.emit(this.mostrarModal);
  }

  campoEsValido(campo: string): boolean {
    if (this.formRol.get(campo)?.invalid
      && this.formRol.controls[campo].touched) {
      return true;
    }
    return false;
  }

  ocultarModalDatoCreado(event?: Event) {
    event?.preventDefault();
    this.mostrarModal = false;
    this.ocultarModalDatoCreadoOutput.emit(this.mostrarModal);
    this.formRol.reset();
  }
}
