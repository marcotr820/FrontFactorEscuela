import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Usuario } from '../classes/usuario';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private baseUrl:string = environment.baseUrl;
  private token:string = localStorage.getItem("token") || '';
  constructor(private http: HttpClient) { }

  GetAllService(){
    return this.http.get<Usuario[]>(`${this.baseUrl}/cuentas/Usuarios`);
  }
  
  get headers() {
    return {
      headers: {
        "Authorization": `Bearer ${this.token}`
      }
    }
  }

  registroUsuarioService(usuario: any){
    const token = localStorage.getItem("token");
    let body = usuario;
    let headers = {"Authorization": `Bearer ${token}`}
    return this.http.post(`${this.baseUrl}/cuentas/RegistroAutorizado`, body, { headers });
  }

  bloquearDesbloquearUsuarioService(usuario: Usuario){
    const url = `${this.baseUrl}/cuentas/bloquearDesbloquearUsuario`;
    const body = usuario;
    return this.http.post(url, body);
  }

  eliminarService(id: string){
    const url = `${this.baseUrl}/cuentas/EliminarUsuario`;
    const params = new HttpParams().set('usuarioId', id);
    return this.http.delete(url, {params});
  }
}
