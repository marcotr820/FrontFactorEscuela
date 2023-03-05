import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Usuario } from '../../../../pages/usuario/classes/usuario';

@Component({
  selector: 'app-usuario-bloqueado',
  templateUrl: './usuario-bloqueado.component.html',
  styleUrls: ['./usuario-bloqueado.component.css']
})
export class UsuarioBloqueadoComponent {

  modalVisible:boolean = false;
  usuarioBloqueado = new Usuario();

  constructor(){}

  @Input() set modalVisibleInput(modalVisibleBloqueo: boolean) {
    if (modalVisibleBloqueo) {
      this.modalVisible = modalVisibleBloqueo;
    }
  }
  
  @Output() modalVisibleOutput: EventEmitter<boolean> = new EventEmitter<boolean>();

  ocultarModal(){ 
    this.modalVisible = false;
    this.modalVisibleOutput.emit(this.modalVisible);
  }

}
