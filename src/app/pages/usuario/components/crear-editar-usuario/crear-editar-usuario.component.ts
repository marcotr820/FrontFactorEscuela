import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RolService } from '../../../rol/services/rol.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Rol } from 'src/app/pages/rol/classes/rol';
import { UsuarioService } from '../../services/usuario.service';
import { RegistroAutorizado } from '../../classes/registroAutorizado';

@Component({
   selector: 'app-crear-editar-usuario',
   templateUrl: './crear-editar-usuario.component.html',
   styleUrls: ['./crear-editar-usuario.component.css']
})
export class CrearEditarUsuarioComponent {
   mostrarModal: boolean = false;
   formSubmitted: boolean = false;
   @Input() set mostrarModalInput(mostrarModal: boolean) {
      if (mostrarModal) {
         this.mostrarModal = mostrarModal;
      }
   }
   @Output() mostrarModalOutput: EventEmitter<boolean> = new EventEmitter<boolean>();

   public formRegistroAutorizado: FormGroup = this.fb.group({
      userName: ['luis123', Validators.required],
      email: ['luis@gmail.com', Validators.required],
      password: ['Admin123*', Validators.required],
      password2: ['Admin123*', Validators.required],
      rolId: ['', Validators.required],
   });

   constructor(private fb: FormBuilder, private usuarioService: UsuarioService) {}

   registrarUsuario(event: Event){
      event.preventDefault();
      // this.formSubmitted = true;
      if (this.formRegistroAutorizado.invalid) {
         this.formRegistroAutorizado.markAllAsTouched();
         return;
      }
      let usuario: RegistroAutorizado = this.formRegistroAutorizado.value;
      this.usuarioService.registroUsuarioService(usuario).subscribe({
         next: (resp) => {
            console.log(resp);
            this.ocultarModal();
         }
      })
   }

   ocultarModal(event?: Event) {
      event?.preventDefault();
      this.mostrarModal = false;
      if (!this.mostrarModal) {
         this.mostrarModalOutput.emit(this.mostrarModal);
      }
   }

   recibirRol(rol: Rol){
      if (rol && rol.id != "") {
         this.formRegistroAutorizado.get('rolId')?.patchValue(rol.id);
      }
   }

   campoEsValido(campo: string): boolean {
      if (this.formRegistroAutorizado.get(campo)?.invalid 
         && this.formRegistroAutorizado.controls[campo].touched) {
         return true;
      }
      return false;
   }
}
