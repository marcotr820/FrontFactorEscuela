import { Component, EventEmitter, Input, Output, ViewEncapsulation, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { AuthService } from '../../../../auth/services/auth.service';

@Component({
   selector: 'app-editar-password',
   templateUrl: './editar-password.component.html',
   styleUrls: ['./editar-password.component.css'],
   encapsulation: ViewEncapsulation.None
})
export class EditarPasswordComponent implements OnInit {

   modalVisible: boolean = false;
   errorMsj: boolean = false;
   exitoMsj: boolean = false;
   formEditarPassword: FormGroup = this.fb.group({
      id:[this._authService.getDatosUsuario.id],
      actualPassword: [, [Validators.required, Validators.minLength(7)]],
      nuevoPassword: [, [Validators.required, Validators.minLength(7)]],
      confirmarPassword: [, [Validators.required]]
   }, {
      validators: [this.passwordsIguales("nuevoPassword", "confirmarPassword")],
   });

   @Input() set mostrarModalInput(modalVisibleRecibido: boolean) {
      if (modalVisibleRecibido) {
         this.formEditarPassword.get('id')?.setValue(this._authService.getDatosUsuario.id);
         this.modalVisible = modalVisibleRecibido;
      }
   }
   constructor(private fb: FormBuilder, private _authService: AuthService) { }

   ngOnInit(): void {
      this.ocultarMensajeError();
   }

   @Output() ocultarModalCanceladoOutput: EventEmitter<boolean> = new EventEmitter<boolean>();

   ocultarMensajeError(): void{
      this.formEditarPassword.valueChanges.subscribe( (val) => {
         if(this.errorMsj){
            this.errorMsj = false;
         }
      })
   }

   editarPassword(event: Event){
      event.preventDefault();
      if (!this.formEditarPassword.valid) {
         Object.keys(this.formEditarPassword.controls).forEach((key) => {
            this.formEditarPassword.get(key)?.markAsDirty();
         });
         return;
      }
      let passwords = this.formEditarPassword.value;
      this._authService.editarPassword(passwords).subscribe({
         next: ((resp) => {
            this.exitoMsj = true;
         }),
         error: ((err) => {
            this.errorMsj = true;
         })
      });
   }

   campoEsValido(campo: string){
      if (this.formEditarPassword.get(campo)?.invalid && this.formEditarPassword.get(campo)?.dirty) {
         return true;
      }
      return false;
   }

   cancelarModal(){
      this.modalVisible = false;
      this.ocultarModalCanceladoOutput.emit(this.modalVisible);
      if(this.exitoMsj){
         this.exitoMsj = false;
      }
      if(this.errorMsj){
         this.errorMsj = false;
      }
      this.formEditarPassword.reset();
   }

   passwordsIguales(nuevoPassword:string, confirmarPassword:string){
      return (formGroup: AbstractControl) : ValidationErrors | null => {
         const pass1 = formGroup.get(nuevoPassword)?.value;
         const pass2 = formGroup.get(confirmarPassword)?.value;
         if (pass1 !== pass2){
            formGroup.get(confirmarPassword)?.setErrors({ noIguales: true });
            return { noIguales: true }
         }
         formGroup.get(confirmarPassword)?.setErrors(null);
         return null;
      }
   }
}
