import { ChangeDetectorRef, Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { AuthService } from '../../../../auth/services/auth.service';
import { Usuario } from '../../../usuario/classes/usuario';
import { FormGroup, FormBuilder, Validators, AsyncValidator } from '@angular/forms';
import { EmailValidatorService } from '../../../usuario/services/email-validator.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
   selector: 'app-editar-username',
   templateUrl: './editar-username.component.html',
   styleUrls: ['./editar-username.component.css']
})
export class EditarUsernameComponent implements OnInit {

   errorMsj:boolean = false;
   exitoMsj: boolean = false;
   modalVisible: boolean = false;
   formEditarUserName: FormGroup = this.fb.group({
      id:'',
      userName: ['', {
         validators:[Validators.required, Validators.minLength(5)],
         asyncValidators: [this.emailValidator.validarUserName(this.http)]
      }]
   });
   private usuario = {} as Usuario;

   constructor(private fb: FormBuilder, private authService: AuthService,
               private emailValidator: EmailValidatorService, private http: HttpClient,
               private router: Router){
      this.usuario = this.authService.getDatosUsuario;
   }

   ngOnInit(): void {
      this.ocultarMensajeError();
   }

   ocultarMensajeError(): void{
      this.formEditarUserName.valueChanges.subscribe( (val) => {
         if(this.errorMsj){
            this.errorMsj = false;
         }
      })
   }

   @Input() set mostrarModalInput(mostrarModal: boolean) {
      if (mostrarModal) {
         this.formEditarUserName.get('id')?.setValue(this.authService.getDatosUsuario.id);
         this.modalVisible = mostrarModal;
      }
   }
   @Output() ocultarModalOutput: EventEmitter<boolean> = new EventEmitter<boolean>();
   @Output() ocultarModalCanceladoOutput: EventEmitter<boolean> = new EventEmitter<boolean>();

   get getDatosUsuario(){
      return this.usuario;
   }

   get userNameMsjError(): string{
      const error = this.formEditarUserName.get('userName')?.errors;
      if(error?.['required']){ return '*El usuario es obligatorio.' }
      if(error?.['minlength']){ return '*El usuario debe tener mas de 5 caracteres.' }
      if(error?.['userNameTomado']){ return '*El nombre de usuario no esta disponible.' }
      return '';
   }

   editarUserName(event: Event){
      event.preventDefault();
      if (!this.formEditarUserName.valid) {
         Object.keys(this.formEditarUserName.controls).forEach((key) => {
            this.formEditarUserName.get(key)?.markAsDirty();
         });
         return;
      }
      let usuario = this.formEditarUserName.value;
      this.authService.editarUserName(usuario).subscribe({
         next: ((resp) => {
            localStorage.removeItem('token');
            this.exitoMsj = true;
            setTimeout(() => {
              this.router.navigateByUrl('/login');
            }, 2500);
         }),
         error: ((err) => {
            this.errorMsj = true;
         })
      });
   }
   ocultarModal(event?: Event){
      this.modalVisible = false;
      this.ocultarModalOutput.emit(this.modalVisible);
   }
   cancelarModal(){
      this.modalVisible = false;
      this.ocultarModalCanceladoOutput.emit(this.modalVisible);
      this.formEditarUserName.reset();
   }

   campoEsValido(campo: string){
      if (this.formEditarUserName.get(campo)?.invalid && this.formEditarUserName.get(campo)?.dirty) {
         return true;
      }
      return false;
   }

}
