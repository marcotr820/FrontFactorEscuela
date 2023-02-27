import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Usuario } from '../classes/usuario';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { Respuesta } from 'src/app/shared/classes/respuesta';
import { RegistroAutorizado } from '../classes/registroAutorizado';
import { DataResult } from '../../../shared/classes/dataResult';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private baseUrl:string = environment.baseUrl;
  constructor(private http: HttpClient) { }

  GetAllService(): Observable<Respuesta<Usuario[]>>{
    return this.http.get<Respuesta<Usuario[]>>(`${this.baseUrl}/cuentas/GetUsuarios`);
  }

  get token(){
    return localStorage.getItem("token") || '';
  }
  
  get headers() {
    return {
      headers: { "Authorization": `Bearer ${this.token}` }
    }
  }

  crearUsuarioAutorizadoService(usuario: RegistroAutorizado){
    let body = usuario;
    return this.http.post<Respuesta<DataResult>>(`${this.baseUrl}/cuentas/RegistroAutorizado`, body, this.headers);
  }

  editarUsuarioAutorizadoService(usuario: any){
    let body = usuario;
    return this.http.put(`${this.baseUrl}/cuentas/EditarUsuarioAutorizado`, body, this.headers);
  }

  bloquearDesbloquearUsuarioService(usuarioId: string){
    const url = `${this.baseUrl}/cuentas/bloquearDesbloquearUsuario/${usuarioId}`;
    return this.http.put(url, {});
  }

  eliminarService(id: string){
    const url = `${this.baseUrl}/cuentas/EliminarUsuario`;
    const params = new HttpParams().set('id', id);
    return this.http.delete(url, {params});
  }
}
