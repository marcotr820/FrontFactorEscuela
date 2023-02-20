import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Rol } from '../classes/rol';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RolService {

  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  GetRolesService(): Observable<Rol[]>{
    const token = localStorage.getItem("token");
    return this.http.get<Rol[]>(`${this.baseUrl}/roles/Roles`, {
      headers: {
        "Authorization": `Bearer ${token}`  //enviamos el valor del token
      }
    });
  }
}
