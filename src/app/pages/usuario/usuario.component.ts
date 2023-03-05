import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Usuario } from './classes/usuario';
import { UsuarioService } from './services/usuario.service';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css'],
  providers: [ConfirmationService, MessageService],
  encapsulation: ViewEncapsulation.None
})
export class UsuarioComponent implements OnInit {

  usuarios: Usuario[] = [];
  isLoading: boolean = false;
  modalCrearVisible: boolean = false;
  modalEditarVisible:boolean = false;
  statuses: any[] = [];

  items: MenuItem[] = [];

  constructor(private usuarioService: UsuarioService, private confirmationService: ConfirmationService,
              private messageService: MessageService, private fb: FormBuilder) { }

  form:FormGroup = this.fb.group({
    usuario: ''
  });

  ngOnInit(): void {
    this.items = [
      {label: 'Update', command: () => {
          // this.update();
      }},
      {label: 'Delete', command: () => {
          // this.delete();
      }},
      {label: 'Angular.io', url: 'http://angular.io'},
      {separator: true},
      {label: 'Setup', routerLink: ['/setup']}
    ];

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
    }, 250);
  }

  mostrarModalCrear() {
    this.modalCrearVisible = true;
  }
  ocultarModalCrear(valor: boolean) {
    this.GetAll();
    this.modalCrearVisible = valor;
  }
  ocultarModalCrearCancelado(valor: boolean){ 
    this.modalCrearVisible = valor; 
  }

  cambiarEstadoUsuario(usuarioId: string){
    this.usuarioService.bloquearDesbloquearUsuarioService(usuarioId).subscribe({
      next: () => {
        this.GetAll();
      }
    })
  }

  mostrarModalEditar(usuario: Usuario){
    //{...usuario} toma una copia del valor y no el valor en si
    this.form.get('usuario')?.setValue({...usuario});
    this.modalEditarVisible = true;
  }
  ocultarModalEditar(valor: boolean){
    this.GetAll();
    this.modalEditarVisible = valor 
  }
  ocultarModalEditarCancelado(valor: boolean){
    this.modalEditarVisible = valor 
  }

  confirmarEliminar(id: string){
    this.confirmationService.confirm({
      message: 'Eliminar Registro?',
      header: 'Eliminar',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Aceptar',
      rejectLabel: 'Cancelar',
      accept: () => { this.eliminar(id) }
    })
  }

  eliminar(id: string){
    this.usuarioService.eliminarService(id).subscribe({
      next: (resp) =>{
        this.GetAll();
        this.messageService.add({severity:'success', summary:'Confirmed', detail:'You have accepted'});
      }
    })
  }

}
