import { Component, OnInit } from '@angular/core';
import { Usuario } from './classes/usuario';
import { UsuarioService } from './services/usuario.service';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {
  usuarios: Usuario[] = [];

  constructor(private usuarioService: UsuarioService){}

  ngOnInit(): void {
    this.GetAll();
  }

  GetAll(){
    this.usuarioService.GetAllService().subscribe({
      next: (resp:Usuario[]) => {
        this.usuarios = resp;
      }
    })
  }

}
