import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl:string = environment.baseUrl; 
  constructor(private http: HttpClient) { }

  loginService(formData: any) {
    return this.http.post(`${this.baseUrl}/cuentas/login`, formData)
      .pipe(
        tap((resp: any) => {
          if (!resp.isBlocked) {
            localStorage.setItem("token", resp.token);
          }
        })
      );
  }

  registrarService(formData: any) {
    return this.http.post(`${this.baseUrl}/cuentas/crearUsuario`, formData)
      .pipe(
        tap((resp: any) => {
          if (!resp.isBlocked) {
            localStorage.setItem("token", resp.token);
          }
        })
      );
  }

  validarRenovarToken(): Observable<boolean> {
    const token = localStorage.getItem("token"); //si no existe el token tomara un valor vacio
    if (!token) { //si no existe el token retorna false
      return of(false);
    }

    return this.http.get<any>(`${this.baseUrl}/cuentas/renovarToken`, {
      headers: {
        "Authorization": `Bearer ${token}`  //enviamos el valor del token
      }
    }).pipe(
      tap((resp: any) => {   //tap realiza operaciones con la respuesta
        localStorage.setItem("token", resp.token);
      }),
      map((resp) => {  //solo se ejecuta el map si es una respuesta exitosa
        // console.log(resp);
        return true;
      }),
      //si el token no ves valido o expiro mandara un error 401 donde devolvemos false como observable
      catchError((error) => {
        console.log(error);
        localStorage.removeItem("token"); //eliminamos el token
        return of(false);
      })
    );
  }

}
