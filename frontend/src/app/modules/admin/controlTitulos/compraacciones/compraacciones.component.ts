import { Component, ViewEncapsulation } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import {MatTableModule, MatTableDataSource} from '@angular/material/table';
import { NgFor, NgIf } from '@angular/common';
import {MatCheckboxModule} from '@angular/material/checkbox';

export interface PeriodicElement {
  name: string;
  weight: number;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { name: 'Titulo 1', weight: 2, },
  { name: 'Titulo 2', weight: 1, },
  { name: 'Titulo 3', weight: 1, },
  { name: 'Titulo 4', weight: 2, },
  {name: 'Titulo 5', weight: 4, },
];

@Component({
  selector: 'app-compraacciones',
  standalone   : true,
  templateUrl: './compraacciones.component.html',
  imports: [
    MatTableModule,
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
export class CompraaccionesComponent {
  displayedColumns: string[] = ['name', 'weight', 'comprar'];
  dataSource = ELEMENT_DATA;
}
