import { Component, ViewEncapsulation } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import {MatDatepickerModule} from '@angular/material/datepicker';

@Component({
  selector     : 'app-registrotitulos',
  standalone   : true,
  templateUrl  : './registrotitulos.component.html',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatIconModule, 
    MatSelectModule,
    MatDividerModule,
    MatDatepickerModule,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class RegistrotitulosComponent {

}
