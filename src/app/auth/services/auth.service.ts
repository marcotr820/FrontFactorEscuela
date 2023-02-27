import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Respuesta } from '../../shared/classes/respuesta';
import { DataResult } from '../../shared/classes/dataResult';
import { LoginUsuario } from '../classes/loginUsuario';
import { RegistroNormal } from '../registro/classes/registroNormal';
import { TokenModelo } from '../../shared/classes/tokenModelo';
import { UsuarioBloqueado } from '../login/classes/usuario-bloqueado';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl:string = environment.baseUrl;
  private _isLoggedIn = new BehaviorSubject<boolean>(false);
  public _tokenDatos!: TokenModelo;
  private usuarioBloqueado = new UsuarioBloqueado();

  constructor(private http: HttpClient) {
    this._isLoggedIn.next(!!this.token); //!! cambia el valor a bool
    this._tokenDatos = this.getTokenDatos(this.token);
  }

  get isLoggedIn$() : boolean{
    if (this._isLoggedIn) { return true }
    return false;
  }

  get getUsuarioBloqueado(): UsuarioBloqueado{
    return this.usuarioBloqueado;
  }

  get token(): string {
    return localStorage.getItem('token') || ''; //si no existe el token toma valor '';
  }
  
  private getTokenDatos(tokenRecibido: string){
    if(!!tokenRecibido){
      return JSON.parse(window.atob(tokenRecibido.split('.')[1]));
    }
    return new TokenModelo();
  }

  loginService(loginUsuario: LoginUsuario) {
    return this.http.post<Respuesta<DataResult>>(`${this.baseUrl}/cuentas/login`, loginUsuario)
      .pipe(
        tap((resp: Respuesta<DataResult>) => {
          if(resp.dataResult.isBlocked){
            const {name, email, exp} = JSON.parse(window.atob(resp.dataResult.token.split('.')[1]));
            this.usuarioBloqueado = new UsuarioBloqueado(name, email, exp);
          }
          if(!resp.error && !resp.dataResult.isBlocked){
            localStorage.setItem("token", resp.dataResult.token);
          }
        }),
      );
  }

  crearUsuarioNormalService(registroNormal: RegistroNormal) {
    return this.http.post<Respuesta<DataResult>>(`${this.baseUrl}/cuentas/CrearUsuarioNormal`, registroNormal)
      .pipe(
        tap((resp: Respuesta<DataResult>) => {
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
    return this.http.get<Respuesta<DataResult>>(`${this.baseUrl}/cuentas/renovarToken`).pipe(
      tap((resp: Respuesta<DataResult>) => {   //tap realiza operaciones con la respuesta
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
