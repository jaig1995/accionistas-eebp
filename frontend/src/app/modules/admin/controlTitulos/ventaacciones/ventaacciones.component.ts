import { Component, ViewEncapsulation } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { NgFor, NgIf } from '@angular/common';
import {MatCheckboxModule} from '@angular/material/checkbox';

@Component({
  selector: 'app-ventaacciones',
  standalone   : true,
  templateUrl: './ventaacciones.component.html',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatIconModule, 
    MatSelectModule,
    MatDividerModule,
    MatDatepickerModule, 
    MatAutocompleteModule, 
    MatButtonModule, 
    MatCheckboxModule,
    NgFor, 
    NgIf,
  ],
  encapsulation: ViewEncapsulation.None,

})
export class VentaaccionesComponent {

}
