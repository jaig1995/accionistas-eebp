import { Component, ViewEncapsulation,OnInit } from '@angular/core';
import {MatTableModule, MatTableDataSource} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import { RouterModule } from '@angular/router';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'accionistas',
  standalone   : true,
  imports: [ MatIconModule,RouterModule,MatFormFieldModule,MatInputModule,MatTableModule,MatButtonModule],
  templateUrl: './accionistas.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class AccionistasComponent {

}
