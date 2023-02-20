import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Usuario } from './classes/usuario';
import { UsuarioService } from './services/usuario.service';

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
        next: (resp: Usuario[]) => {
          this.usuarios = resp;
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

  cambiarEstadoUsuario(event: Event, usuario: Usuario){
    // console.log(event, usuario);
    this.usuarioService.bloquearDesbloquearUsuarioService(usuario).subscribe({
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
