import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginUsuarioDto } from '../classes/loginUsuarioDto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl:string = environment.baseUrl;
  constructor(private http: HttpClient) { }

  loginService(loginInfo: LoginUsuarioDto) {
    return this.http.post(`${this.baseUrl}/cuentas/login`, loginInfo)
      .pipe(
        tap((resp: any) => {
          if (!resp.dataResult.isBlocked) {
            localStorage.setItem("token", resp.dataResult.token);
            console.log(resp.dataResult.token);
          }
        })
      );
  }

  registroNormalService(formData: any) {
    return this.http.post(`${this.baseUrl}/cuentas/RegistroNormal`, formData)
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
    if (!token) { return of(false); }//si no existe el token retorna false
  
    // {
    //   headers: {
    //     "Authorization": `Bearer ${token}`  //enviamos el valor del token
    //   }
    // }

    return this.http.get<any>(`${this.baseUrl}/cuentas/renovarToken`).pipe(
      tap((resp: any) => {   //tap realiza operaciones con la respuesta
        localStorage.setItem("token", resp.dataResult.token);
      }),
      map((resp) => {  //solo se ejecuta el map si es una respuesta exitosa
        return true;
      }),
      //si el token no ves valido o expiro mandara un error 401 donde devolvemos false como observable
      catchError((error) => {
        localStorage.removeItem("token"); //eliminamos el token si expiro
        return of(false);
      })
    );
  }

}
