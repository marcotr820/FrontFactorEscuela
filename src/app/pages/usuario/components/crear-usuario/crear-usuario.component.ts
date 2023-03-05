import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Rol } from 'src/app/pages/rol/classes/rol';
import { UsuarioService } from '../../services/usuario.service';
import { RegistroAutorizado } from '../../classes/registroAutorizado';
import { Respuesta } from '../../../../shared/classes/respuesta';
import { DataResult } from '../../../../shared/classes/dataResult';
import { EmailValidatorService } from '../../services/email-validator.service';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { ValidatorService } from 'src/app/shared/validator/validator.service';

@Component({
   selector: 'app-crear-usuario',
   templateUrl: './crear-usuario.component.html',
   styleUrls: ['./crear-usuario.component.css'],
   providers: [MessageService],
   encapsulation: ViewEncapsulation.None
})
export class CrearUsuarioComponent {

   modalVisible: boolean = false;

   @Input() set mostrarModalInput(mostrarModal: boolean) {
      if (mostrarModal) {
         this.modalVisible = mostrarModal;
      }
   }

   public formRegistroAutorizado: FormGroup = this.fb.group({
      userName: ['', {
         validators:[Validators.required, Validators.minLength(5)],
         asyncValidators: [this.emailValidator.validarUserName(this.http)]
      }],
      email: ['',{
         validators: [Validators.required, Validators.pattern(this.validatorS.emailPattern)],
         asyncValidators: [this.emailValidator]
      }],
      password: ['', [Validators.required, Validators.minLength(7)]],
      password2: ['', [Validators.required]],
      rol: ['', Validators.required],
   }, {
      validators: [this.passwordsIguales("password", "password2")],
   });

   constructor(private fb: FormBuilder, private usuarioService: UsuarioService,
               private emailValidator: EmailValidatorService, private messageService: MessageService,
               private validatorS: ValidatorService, private http: HttpClient) {}

   @Output() ocultarModalCreadoOkOutput: EventEmitter<boolean> = new EventEmitter<boolean>();
   @Output() ocultarModalCanceladoOutput: EventEmitter<boolean> = new EventEmitter<boolean>();

   get userNameMsjError(): string{
      const error = this.formRegistroAutorizado.get('userName')?.errors;
      if(error?.['required']){ return 'El usuario es obligatorio.' }
      if(error?.['minlength']){ return 'El usuario debe tener mas de 5 caracteres.' }
      if(error?.['userNameTomado']){ return 'El nombre de usuario no esta disponible.' }
      return '';
   }

   get emailErrorMsj(): string {
      const error = this.formRegistroAutorizado.get('email')?.errors;
      if(error?.['required']) { return 'El email es obligatorio' }
      if(error?.['pattern']){ return 'El email no tiene un formato correcto.' }
      if(error?.['emailTomado']) { return 'El email ya está en uso.' }
      return '';
   }

   crearUsuario(event: Event){
      event.preventDefault();
      if (!this.formRegistroAutorizado.valid) {
         Object.keys(this.formRegistroAutorizado.controls).forEach((key) => {
            this.formRegistroAutorizado.get(key)?.markAsDirty();
         });
         return;
      }
      let usuario: RegistroAutorizado = this.formRegistroAutorizado.value;
      this.usuarioService.crearUsuarioAutorizadoService(usuario).subscribe({
         next: (resp: Respuesta<DataResult>) => {
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
         && this.formRegistroAutorizado.controls[campo].dirty) {
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
