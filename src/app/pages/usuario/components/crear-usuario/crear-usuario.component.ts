import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Rol } from 'src/app/pages/rol/classes/rol';
import { UsuarioService } from '../../services/usuario.service';
import { RegistroAutorizado } from '../../classes/registroAutorizado';
import { Respuesta } from '../../../../shared/classes/respuesta';
import { DataResult } from '../../../../shared/classes/dataResult';
import { EmailValidatorService } from '../../services/email-validator.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';

@Component({
   selector: 'app-crear-usuario',
   templateUrl: './crear-usuario.component.html',
   styleUrls: ['./crear-usuario.component.css'],
   providers: [MessageService],
   encapsulation: ViewEncapsulation.None
})
export class CrearUsuarioComponent {
   modalVisible: boolean = false;
   formSubmitted: boolean = false;

   @Input() set mostrarModalInput(mostrarModal: boolean) {
      if (mostrarModal) {
         this.modalVisible = mostrarModal;
      }
   }

   public formRegistroAutorizado: FormGroup = this.fb.group({
      userName: ['', [Validators.required]],
      email: ['',{
         validators: [Validators.required],
         asyncValidators: [this.emailValidator],
         updateOn: 'blur' //actualizacion de campo por propiedad
      }],
      password: ['Admin123*', Validators.required],
      password2: ['Admin123*', Validators.required],
      rol: ['', Validators.required],
   });

   constructor(private fb: FormBuilder, private usuarioService: UsuarioService,
               private emailValidator: EmailValidatorService, private messageService: MessageService) {}

   @Output() ocultarModalCreadoOkOutput: EventEmitter<boolean> = new EventEmitter<boolean>();
   @Output() ocultarModalCanceladoOutput: EventEmitter<boolean> = new EventEmitter<boolean>();

   get emailErrorMsj(): string {
      const errores = this.formRegistroAutorizado.get('email')?.errors;
      console.log(this.formRegistroAutorizado.get('email')?.hasError('required'));
      
      if(errores?.['required']) { return 'El email es obligatorio' }
      if(errores?.['emailTomado']) { return 'El email ya está en uso.' }
      return '';
   }

   crearUsuario(event: Event){
      event.preventDefault();
      // this.formSubmitted = true;
      if (this.formRegistroAutorizado.invalid) {
         this.formRegistroAutorizado.markAllAsTouched();
         return;
      }
      let usuario: RegistroAutorizado = this.formRegistroAutorizado.value;
      this.usuarioService.crearUsuarioAutorizadoService(usuario).subscribe({
         next: (resp: Respuesta<DataResult>) => {
            console.log(resp);
            if(!!resp.error){
               return;
            }
            this.ocultarModal();
            this.messageService.add({severity:'success', summary:'Confirmed', detail:'You have accepted'});
         },
         error: (err: HttpErrorResponse) => {
            console.log(err.error);
         }
      });
   }

   ocultarModal(event?: Event) {
      event?.preventDefault();
      this.modalVisible = false;
      if (!this.modalVisible) {
         this.ocultarModalCreadoOkOutput.emit(this.modalVisible);
      }
   }

   ocultarModalCancelado(){
      this.modalVisible = false;
      this.ocultarModalCanceladoOutput.emit(this.modalVisible);
   }

   recibirRol(rol: Rol){
      if (rol) {
         this.formRegistroAutorizado.get('rol')?.patchValue(rol.name);
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
