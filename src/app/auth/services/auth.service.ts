import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Respuesta } from '../../shared/classes/respuesta';
import { DataResult } from '../../shared/classes/dataResult';
import { LoginUsuario } from '../classes/loginUsuario';
import { RegistroNormal } from '../registro/classes/registroNormal';
import { TokenModelo } from '../../shared/classes/tokenModelo';
import { Usuario } from 'src/app/pages/usuario/classes/usuario';

@Injectable({
   providedIn: 'root'
})
export class AuthService {
   
   public _tokenDatos!: TokenModelo;
   private _usuario = new Usuario();
   private _baseUrl: string = environment.baseUrl;
   private _isLoggedIn = new BehaviorSubject<boolean>(false);

   constructor(private http: HttpClient) {
      this._isLoggedIn.next(!!this.token); //!! cambia el valor a bool
      this._tokenDatos = this.getTokenDatos(this.token);
   }

   get isLoggedIn$(): boolean {
      if (this._isLoggedIn) { return true }
      return false;
   }

   get token(): string {
      return localStorage.getItem('token') || ''; //si no existe el token toma valor '';
   }

   get getDatosUsuario(): Usuario{ 
      return {...this._usuario}; //rompemos la relacion con los datos para no que puedan ser afectados
   } 

   private getTokenDatos(tokenRecibido: string) {
      if (!!tokenRecibido) {
         return JSON.parse(window.atob(tokenRecibido.split('.')[1]));
      }
      return new TokenModelo();
   }

   loginService(loginUsuario: LoginUsuario) {
      return this.http.post<Respuesta<DataResult>>(`${this._baseUrl}/cuentas/login`, loginUsuario)
         .pipe(
            tap((resp: Respuesta<DataResult>) => {
               if (!!resp.dataResult.token) {
                  localStorage.setItem("token", resp.dataResult.token);
               }
            }),
         );
   }

   crearUsuarioNormalService(registroNormal: RegistroNormal) {
      return this.http.post<Respuesta<DataResult>>(`${this._baseUrl}/cuentas/CrearUsuarioNormal`, registroNormal)
         .pipe(
            tap((resp: Respuesta<DataResult>) => {
               //solo se entrara al map cuando la respuesta no tengo error
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
      return this.http.get<Respuesta<DataResult>>(`${this._baseUrl}/cuentas/renovarToken`).pipe(
         tap((resp: Respuesta<DataResult>) => {   //tap realiza operaciones con la respuesta
            localStorage.setItem("token", resp.dataResult.token);
            this._isLoggedIn.next(true);
            this._tokenDatos = this.getTokenDatos(resp.dataResult.token);
            const { id, userName, email, isBlocked } = resp.dataResult.usuario;
            this._usuario = new Usuario(id, userName, email, isBlocked);
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

   enviarEmailRestablecerPassword(email: string) {
      console.log(email, 'asd');
      const params = new HttpParams().set('email', email);
      return this.http.get(`${this._baseUrl}/cuentas/EnviarEmailRestablecerPassword`, { params });
   }

   restablecerPassword(passwords: any, reset_token: string, email: string) {
      const body = passwords;
      const params = new HttpParams().set('reset_token', reset_token).set('email', email);
      return this.http.post(`${this._baseUrl}/cuentas/RestablecerPassword`, body, { params });
   }

   editarUserName(usuario: any){
      const body = usuario;
      return this.http.post<boolean>(`${this._baseUrl}/cuentas/EditarUsername`, body);
   }

   editarPassword(passwords: any){
      const body = passwords;
      return this.http.put(`${this._baseUrl}/cuentas/EditarPassword`, body);
   }

}
