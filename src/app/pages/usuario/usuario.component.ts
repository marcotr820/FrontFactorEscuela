import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Usuario } from './classes/usuario';
import { UsuarioService } from './services/usuario.service';
import { Resultado } from '../../shared/classes/respuesta';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class UsuarioComponent implements OnInit {

  usuarios: Usuario[] = [];
  isLoading: boolean = false;
  mostrarModal: boolean = false;
  statuses: any[] =[];
  constructor(private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.statuses = [
      {label: 'Habilitado', value: false},
      {label: 'Bloqueado', value: true},
    ];
    this.GetAll();
  }

  GetAll() {
    this.isLoading = true;
    setTimeout(() => {
      this.usuarioService.GetAllService().subscribe({
        next: (resp) => {
          this.usuarios = resp.dataResult;
          this.isLoading = false;
        }
      });
    }, 300);
    
  }

  mostrarModalFuncion() {
    this.mostrarModal = true;
  }

  recibirMostrarModal(valor: boolean) {
    if (!valor) {
      this.GetAll();
      this.mostrarModal = valor;
    }
  }

  cambiarEstadoUsuario(usuarioId: string){
    this.usuarioService.bloquearDesbloquearUsuarioService(usuarioId).subscribe({
      next: () => {
        this.GetAll();
      }
    })
  }

  eliminar(id: string){
    this.usuarioService.eliminarService(id).subscribe({
      next: () => {
        this.GetAll();
      }
    })
  }

}
