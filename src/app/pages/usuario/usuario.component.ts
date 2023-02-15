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
  constructor(private usuarioService: UsuarioService){}

  ngOnInit(): void {
    this.GetAll();
  }

  GetAll(){
    this.isLoading = true;
    this.usuarioService.GetAllService().subscribe({
      next: (resp:Usuario[]) => {
        this.usuarios = resp;
        this.isLoading = false;
      }
    })
  }

}
