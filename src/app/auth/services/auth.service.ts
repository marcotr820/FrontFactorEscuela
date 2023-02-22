import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Resultado } from '../../shared/classes/respuesta';
import { dataResult } from '../../shared/classes/dataResult';
import { LoginUsuario } from '../classes/loginUsuario';
import { RegistroNormal } from '../registro/classes/registroNormal';
import { TokenModelo } from '../../shared/classes/tokenModelo';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl:string = environment.baseUrl;
  private _isLoggedIn = new BehaviorSubject<boolean>(false);
  public _tokenDatos!: TokenModelo;

  get isLoggedIn$() : boolean{
    if (this._isLoggedIn) { return true }
    return false;
  }

  get token(): string {
    return localStorage.getItem('token') || ''; //si no existe el token toma valor '';
  }

  constructor(private http: HttpClient) {
    this._isLoggedIn.next(!!this.token); //!! cambia el valor a bool
    this._tokenDatos = this.getTokenDatos(this.token);
  }

  private getTokenDatos(tokenRecibido: string){
    if(!!tokenRecibido){
      return JSON.parse(window.atob(tokenRecibido.split('.')[1]));
    }
    return new TokenModelo();
  }

  loginService(loginUsuario: LoginUsuario) {
    return this.http.post<Resultado<dataResult>>(`${this.baseUrl}/cuentas/login`, loginUsuario)
      .pipe(
        tap((resp: Resultado<dataResult>) => {
          if (!resp.dataResult.isBlocked) {
            localStorage.setItem("token", resp.dataResult.token);
          }
        })
      );
  }

  registroNormalService(registroNormal: RegistroNormal) {
    return this.http.post<Resultado<dataResult>>(`${this.baseUrl}/cuentas/RegistroNormal`, registroNormal)
      .pipe(
        tap((resp: Resultado<dataResult>) => {
          if (!resp.dataResult.isBlocked) {
            localStorage.setItem("token", resp.dataResult.token);
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
    return this.http.get<Resultado<dataResult>>(`${this.baseUrl}/cuentas/renovarToken`).pipe(
      tap((resp: Resultado<dataResult>) => {   //tap realiza operaciones con la respuesta
        localStorage.setItem("token", resp.dataResult.token);
        this._isLoggedIn.next(true);
        this._tokenDatos = this.getTokenDatos(resp.dataResult.token);
      }),
      map( (resp) => {  //solo se ejecuta el map si es una respuesta exitosa
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
