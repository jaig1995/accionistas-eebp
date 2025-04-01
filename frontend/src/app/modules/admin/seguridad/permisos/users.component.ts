import { Component, ViewEncapsulation, OnInit, ViewChild } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { UserDataService } from 'app/modules/admin/seguridad/permisos/user-data.service';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { Usuario } from './usuarios.model';
import { NgIf } from "@angular/common";
import { InputAutocompleteComponent } from "../../../../shared/components/inputAutocomplete/inputAutocomplete.component";

@Component({
    selector: 'permisos-usuarios',
    standalone: true,
    templateUrl: './users.component.html',
    encapsulation: ViewEncapsulation.None,
    imports: [MatDividerModule, MatIconModule, RouterModule, MatFormFieldModule, MatInputModule, MatTableModule, MatButtonModule, NgIf, InputAutocompleteComponent]
})
export class UsersComponent implements OnInit {
    datos: MatTableDataSource<Usuario>;
    displayedColumns: string[] = ['avatar', 'codUsuario', 'nombreUsuario', 'apellidoUsuario', 'email', 'permisos'];

    accionistaAutoComplete: any;

    constructor(private userDatos: UserDataService) {
        // Inicializar el dataSource vacío para evitar errores
        this.datos = new MatTableDataSource<Usuario>([]);
    }

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

    /**
     * Método que se ejecuta cuando se aplica un filtro en el campo de búsqueda.
     * Aplica el filtro a los datos de la tabla según el valor ingresado.
     * @param {string} filterValue - Valor del filtro a aplicar.
     */
    applyFilter(filterValue: string): void {
        if (this.datos) {
            this.datos.filter = filterValue.trim().toLowerCase();
        }
    }

    /**
     * Método para manejar la selección de accionista desde el componente hijo.
     * @param valor - El valor seleccionado en el autocomplete.
     */
    obtenerAccionista(valor) {
        this.accionistaAutoComplete = valor.idPer;
        this.applyFilter(this.accionistaAutoComplete.toString());
    }
}