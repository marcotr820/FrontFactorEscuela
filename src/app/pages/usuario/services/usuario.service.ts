import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../classes/usuario';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private baseUrl:string = environment.baseUrl;
  constructor(private http: HttpClient) { }

  GetAllService(){
    return this.http.get<Usuario[]>(`${this.baseUrl}/cuentas/Usuarios`);
  }

}
