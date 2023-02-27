import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
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

  constructor(private usuarioService: UsuarioService, private confirmationService: ConfirmationService,
              private messageService: MessageService, private fb: FormBuilder) { }

  form:FormGroup = this.fb.group({
    usuario: ''
  });

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
    }, 250);
  }

  mostrarModalCrear() {
    this.modalCrearVisible = true;
  }
  ocultarModalCrear(valor: boolean) {
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
    this.form.get('usuario')?.setValue(usuario);
    this.modalEditarVisible = true;
  }
  ocultarModalEditar(valor: boolean){
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
        this.messageService.add({severity:'info', summary:'Confirmed', detail:'You have accepted'});
      }
    })
  }

}
