import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { RolService } from '../../services/rol.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Rol } from '../../classes/rol';

@Component({
  selector: 'app-select-rol',
  templateUrl: './select-rol.component.html',
  styleUrls: ['./select-rol.component.css']
})
export class SelectRolComponent implements OnInit {

  private rolSeleccionadoInput: string = ''; 
  roles: Rol[] = [];

  @Input() set rolInput(rolRecibido: string) {
    if (!!rolRecibido) {
      this.rolSeleccionadoInput = rolRecibido;
      this.cambiarRol();
    }
  }
  @Output() rolOutput: EventEmitter<Rol> = new EventEmitter<Rol>();

  @Input() clase: boolean | undefined = false;

  formRol: FormGroup = this.fb.group({
    rol: new Rol(),
  });

  constructor(private rolService: RolService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.getRoles();
    //cuando el valor del select cambie emitimos el evento output mandando los datos al padre
    this.formRol.get("rol")?.valueChanges.subscribe( rol => {
      this.rolOutput.emit(rol);
    });
  }

  cambiarRol(): void{
    let rol = this.roles.find( rol => rol.name == this.rolSeleccionadoInput);
    if(rol){
      this.formRol.reset({ 
        rol: rol, 
      })
    }
  }

  getRoles() {
    this.rolService.GetRolesService().subscribe(resp => {
      this.roles = resp;
    })
  }

}
