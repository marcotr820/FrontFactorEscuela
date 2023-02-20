import { NgModule } from '@angular/core';
//Primeng
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {MenubarModule} from 'primeng/menubar';
import {TableModule} from 'primeng/table';
import {DialogModule} from 'primeng/dialog';
import {CardModule} from 'primeng/card';
import {DropdownModule} from 'primeng/dropdown';
import {PasswordModule} from 'primeng/password';

@NgModule({
  declarations: [],
  imports: [],
  exports: [
    ButtonModule,
    InputTextModule,
    MenubarModule,
    TableModule,
    DialogModule,
    CardModule,
    DropdownModule,
    PasswordModule
  ]
})
export class PrimeNgModule { }
