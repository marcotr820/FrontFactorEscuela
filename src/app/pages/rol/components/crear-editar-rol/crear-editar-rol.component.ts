import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Rol } from '../../classes/rol';
import { RolService } from '../../services/rol.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';

@Component({
   selector: 'app-crear-editar-rol',
   templateUrl: './crear-editar-rol.component.html',
   styleUrls: ['./crear-editar-rol.component.css'],
   providers: [MessageService],
})
export class CrearEditarRolComponent {
   mostrarModal: boolean = false;
   formRol: FormGroup = this.fb.group({
      id: ['', []],
      name: ['', [Validators.required]]
   });

   constructor(private fb: FormBuilder, private rolService: RolService,
      private messageService: MessageService) { }

   @Input() set mostrarModalInput(mostrarModal: boolean) {
      if (mostrarModal) {
         this.mostrarModalFuncion();
      }
   }
   @Input() set rolValueInput(rolValue: Rol) {
      if (rolValue && (!!rolValue.id)) {
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
      if (!this.formRol.valid) {
         let formKeys = this.formRol.controls;
         Object.keys(formKeys).forEach((key) => {
            this.formRol.get(key)?.markAsDirty();
         });
         return;
      }
      let rol: Rol = this.formRol.value;
      this.rolService.registrarRol(rol).subscribe({
         next: (resp) => {
            this.ocultarModalDatoCreado();
            this.messageService.add({ severity: 'success', summary: 'Confirmed', detail: 'You have accepted' });
         },
         error: (err: HttpErrorResponse) => {
            // console.log(err.error);
         }
      })
   }

   mostrarModalFuncion() { this.mostrarModal = true; }

   cancelarModal() {
      this.mostrarModal = false
      this.modalCanceladoOutput.emit(this.mostrarModal);
      this.formRol.reset();
   }

   campoEsValido(campo: string): boolean {
      if (this.formRol.get(campo)?.invalid && this.formRol.get(campo)?.dirty) {
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
