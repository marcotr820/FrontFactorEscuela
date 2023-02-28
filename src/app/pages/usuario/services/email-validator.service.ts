import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AbstractControl, AsyncValidator, FormControl, ValidationErrors } from '@angular/forms';
import { Observable, map, of, debounce, debounceTime, distinctUntilChanged, switchMap, filter, timer, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmailValidatorService implements AsyncValidator {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  validate(control: FormControl): Observable<ValidationErrors | null> {
    if(!!control.value){
      const email = control.value;
      const params = new HttpParams().set('email', email);
      return timer(700).pipe(
        tap(() => console.log(email)),
        switchMap( () => this.http.get(`${this.baseUrl}/cuentas/EmailExiste`, { params })),
        map( resp => {
          return (!!resp)? { emailTomado: true } : null;
        })
      )
    }
    return of(null);
  }
}
