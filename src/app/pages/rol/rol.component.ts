import { Component, OnInit } from '@angular/core';
import { RolService } from './services/rol.service';
import { Rol } from './classes/rol';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-rol',
  templateUrl: './rol.component.html',
  styleUrls: ['./rol.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class RolComponent implements OnInit {
  roles:Rol[] = [];
  isLoading:boolean = false;
  mostrarModal:boolean = false;
  form: FormGroup = this.fb.group({
    rol: ""
  });

  constructor(private fb: FormBuilder, private rolService: RolService,
    private confirmationService: ConfirmationService, private messageService: MessageService){}

  ngOnInit(): void {
    this.getAll();
  }

  mostrarModalFuncion(){ this.mostrarModal = true; }

  modalCanceladoOutput(valor: boolean){ this.mostrarModal = valor; }

  ocultarModalDatoCreadoOutput(valor: boolean) {
    if (!valor) {
      this.getAll();
      this.mostrarModal = valor;
    }
  }

  getAll(){
    this.isLoading = true;
    setTimeout(() => {
      this.rolService.getAllRolesService().subscribe({
        next: (resp:any) => {
          this.roles = resp;
          this.isLoading = false;
        }
      });
    }, 250);
  }

  editar(value: Rol) {
    // {...value} crea una copia de los datos para que no sean modificados por accidente
    this.form.get('rol')?.setValue({...value});
    this.mostrarModalFuncion();
  }

  confirmarEliminar(id: string){
    this.confirmationService.confirm({
      message: 'Eliminar Registro?',
      header: 'Eliminar',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Aceptar',
      rejectLabel: 'Cancelar',
      accept: () => { this.eliminarRol(id) }
    })
  }

  eliminarRol(id: string){
    this.rolService.eliminarRol(id).subscribe({
      next: (resp) => {
        this.getAll();
        this.messageService.add({severity:'success', detail:'Acción realizada correctamente'});
      }
    })
  }

}
