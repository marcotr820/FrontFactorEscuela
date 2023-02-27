import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Rol } from '../classes/rol';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RolService {

  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  get getToken(){
    return localStorage.getItem("token") || '';
  }

  get getHeaders() {
    return new HttpHeaders().set('Authorization', `Bearer ${this.getToken}`);
  }

  registrarRol(rol: Rol){
    const body = rol;
    return this.http.post(`${this.baseUrl}/roles/CrearEditarRol`, body, {headers:this.getHeaders});
  }

  getAllRolesService(){
    return this.http.get(`${this.baseUrl}/roles/GetAllRoles`,{
      headers: {
        "Authorization": `Bearer ${this.getToken}`
      }
    });
  }

  GetRolesService(): Observable<Rol[]>{
    return this.http.get<Rol[]>(`${this.baseUrl}/roles/Roles`, {
      headers: {
        "Authorization": `Bearer ${this.getToken}`  //enviamos el valor del token
      }
    });
  }

  eliminarRol(id: string){
    const params = new HttpParams().set('id', id);
    return this.http.delete(`${this.baseUrl}/roles/EliminarRol`, { headers:this.getHeaders, params});
  }
}
