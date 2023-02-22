import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Usuario } from '../classes/usuario';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { Resultado } from 'src/app/shared/classes/respuesta';
import { RegistroAutorizado } from '../classes/registroAutorizado';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private baseUrl:string = environment.baseUrl;
  private token:string = localStorage.getItem("token") || '';
  constructor(private http: HttpClient) { }

  GetAllService(): Observable<Resultado<Usuario[]>>{
    return this.http.get<Resultado<Usuario[]>>(`${this.baseUrl}/cuentas/GetUsuarios`);
  }
  
  get headers() {
    return {
      headers: {
        "Authorization": `Bearer ${this.token}`
      }
    }
  }

  registroUsuarioService(usuario: RegistroAutorizado){
    console.log(usuario);
    
    const token = localStorage.getItem("token");
    let body = usuario;
    let headers = {"Authorization": `Bearer ${token}`}
    return this.http.post(`${this.baseUrl}/cuentas/RegistroAutorizado`, body, { headers });
  }

  bloquearDesbloquearUsuarioService(usuarioId: string){
    const url = `${this.baseUrl}/cuentas/bloquearDesbloquearUsuario/${usuarioId}`;
    return this.http.put(url, {});
  }

  eliminarService(id: string){
    const url = `${this.baseUrl}/cuentas/EliminarUsuario`;
    const params = new HttpParams().set('usuarioId', id);
    return this.http.delete(url, {params});
  }
}
