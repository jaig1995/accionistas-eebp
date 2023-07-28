import { Component, ViewEncapsulation,OnInit } from '@angular/core';
import {MatTableModule, MatTableDataSource} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import { UserDataService } from 'app/modules/admin/seguridad/permisos/user-data.service';
import { RouterModule } from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { Usuario } from './usuarios.model';
import {NgIf} from "@angular/common";



@Component({
    selector     : 'permisos-usuarios',
    standalone   : true,
    imports: [MatDividerModule, MatIconModule, RouterModule, MatFormFieldModule, MatInputModule, MatTableModule, MatButtonModule, NgIf],
    templateUrl  : './users.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class UsersComponent implements OnInit
{
  datos: MatTableDataSource<Usuario>;
  displayedColumns: string[] = ['avatar', 'codUsuario', 'nombreUsuario', 'apellidoUsuario', 'email', 'permisos'];

  constructor(private userDatos: UserDataService) {}

  ngOnInit() {
    this.userDatos.obtenerUsuarios().subscribe(
      (datos: Usuario[]) => {
        this.datos = new MatTableDataSource<Usuario>(datos);
      },
      (error) => {
        console.error('Error al obtener los datos:', error);
      }
    );
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    console.log(filterValue);
    this.datos.filterPredicate = (data: Usuario, filter: string) => {
      const idStr = data.codUsuario;
      return idStr.includes(filterValue);
    };
    this.datos.filter = filterValue.trim();
  }
}

