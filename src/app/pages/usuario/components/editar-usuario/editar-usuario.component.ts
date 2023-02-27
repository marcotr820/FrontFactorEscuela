import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Rol } from 'src/app/pages/rol/classes/rol';
import { Usuario } from '../../classes/usuario';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-editar-usuario',
  templateUrl: './editar-usuario.component.html',
  styleUrls: ['./editar-usuario.component.css']
})
export class EditarUsuarioComponent {
  modalVisible: boolean = false;
  emailErrorMsj: any;
  
  @Input() set mostrarModalInput(mostrarModal: boolean) {
    if (mostrarModal) {
      this.modalVisible = mostrarModal;
    }
  }
  @Input() set usuarioInput(usuario: Usuario){
    if (usuario && (!!usuario.id)) {
      const {id, userName, email, rol} = usuario;
      this.formEditarUsuario.patchValue({
        id: id,
        userName: userName,
        email: email,
        rol: rol
      });
    }
  }
  @Output() ocultarModalOutput: EventEmitter<boolean> = new EventEmitter<boolean>();

  formEditarUsuario:FormGroup = this.fb.group({
    id: ['', []],
    userName: ['', []],
    email: ['', []],
    rol: ['', []]
  });

  constructor(private fb: FormBuilder, private us: UsuarioService){}

  editarUsuario(e: Event){
    e.preventDefault();
    console.log(this.formEditarUsuario.value);
    if(this.formEditarUsuario.invalid){ return; }
    let usuario = this.formEditarUsuario.value;
    this.us.editarUsuarioAutorizadoService(usuario).subscribe({
      next:(resp) => {
        this.ocultarModal();
      },
      error: (err) => console.log(err)
      
    })
  }

  campoEsValido(campo: string){

  }

  recibirRol(rol: Rol){
    if (rol) {
      this.formEditarUsuario.get('rol')?.patchValue(rol.name);
    }
  }

  ocultarModal(event?: Event) {
    event?.preventDefault();
    this.modalVisible = false;
    if (!this.modalVisible) {
      this.ocultarModalOutput.emit(this.modalVisible);
    }
  }
}
