import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AbstractControl, AsyncValidator, ValidationErrors } from '@angular/forms';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmailValidatorService implements AsyncValidator {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  validate(control: AbstractControl<any, any>): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    const email = control.value;
    const params = new HttpParams().set('email', email);
    return this.http.get(`${this.baseUrl}/cuentas/EmailExiste`, { params })
      .pipe(
        map( (resp) => {
          return (!!resp)? { emailTomado: true } : null;
        })
      );
  }
}
