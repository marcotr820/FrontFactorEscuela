import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UsuarioBloqueado } from '../../classes/usuario-bloqueado';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-usuario-bloqueado',
  templateUrl: './usuario-bloqueado.component.html',
  styleUrls: ['./usuario-bloqueado.component.css']
})
export class UsuarioBloqueadoComponent {

  modalVisible:boolean = false;

  constructor(public authService: AuthService){}

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
