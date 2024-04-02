import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ParametrizacionService } from './parametrizacion.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { Parametrizacion } from './parametrizacion.interface';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { EditarParametroComponent } from './editarParametro/editarParametro.component';

@Component({
    selector: 'app-parametrizacion',
    standalone: true,
    templateUrl: './parametrizacion.component.html',
    imports: [
        CommonModule,
        MatFormFieldModule,
        MatInputModule,
        MatDividerModule,
        MatTableModule,
        MatButtonModule,
        MatIconModule,
    ],
    encapsulation: ViewEncapsulation.None,
})
export class ParametrizacionComponent implements OnInit {

    dataSource: Parametrizacion[] = [];
    displayedColumns: string[] = ['idParametro', 'descripcion', 'valor', 'actions'];



    constructor(private parametrizacionService: ParametrizacionService, private dialog: MatDialog) { }

    ngOnInit(): void {
        this.cargarDatos()
    }


    /**
     * Cargar datos de los parámetros existentes.
     */
    cargarDatos() {
        this.parametrizacionService.obtenerParametros()
            .subscribe((data: Parametrizacion[]) =>
                this.dataSource = data

            );
    }

    /**
     * Método para editar parámetros.
     * Abre un diálogo para editar o crear parámetros según el modo especificado.
     * @param {string} modo - El modo de edición ('editar' o 'crear').
     * @param {Parametrizacion} element - (Opcional) El elemento a editar.
     */
    async editarParametros(modo: string, element?: Parametrizacion) {
        const dialogRef = this.dialog.open(EditarParametroComponent, {
            width: '400px',
            height: modo === 'crear' ? '320px' : '420px',
            data: {
                parametro: element,
                modo: modo
            },
        });
        await dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.cargarDatos()
            }
        });
    }

    eliminarParemetro(element:any){
        const {idParametro} = element
        if(!idParametro) return
        this.parametrizacionService.eliminarParametros(idParametro).subscribe(data => console.log(data), )
        this.cargarDatos()
    }

}
