import { AsyncPipe, CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { FuseAlertComponent } from '@fuse/components/alert';
import { MatDialog } from '@angular/material/dialog';

import { ControlTitulosService } from '../controlTitulos.service';
import { AprobarTitulos } from '../interfaces/aprobarTitulos.interface';
import { VerMasModalComponent } from '../modales/verMasModal/verMasModal.component';
import { map, Observable, startWith } from 'rxjs';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
    selector: 'app-titulos-general',
    standalone: true,
    imports: [
        CommonModule,
        MatFormFieldModule,
        MatInputModule,
        MatDividerModule,
        MatTableModule,
        MatButtonModule,
        MatIconModule,
        MatSelectModule,
        ReactiveFormsModule,
        MatChipsModule,
        MatCheckboxModule,
        FormsModule,
        FuseAlertComponent,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        MatSortModule,
        MatAutocompleteModule,
        AsyncPipe,

    ],
    templateUrl: 'titulosGeneral.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class TitulosGeneralComponent implements OnInit, AfterViewInit {
    //Tabla
    datosTabla: AprobarTitulos[];
    displayedColumns: string[] = ['TIPO', 'IDENTIFICACION', 'CONSECUTIVO', 'ESTADO', 'TRANSACCION',];
    dataSource: any;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;


    //alertas, spinner
    loading = false;
    showAlert = false;
    isEnableButton = false;

    accionistas: any[] = [];
    filteredAccionistas: Observable<any[]>;
    buscar = new FormControl('');


    constructor(private controlTitulosService: ControlTitulosService, private dialog: MatDialog) {
        this.inicializarDatos()
    }

    ngOnInit(): void {
        this.inicializarDatos();

        this.controlTitulosService.obtenerAccionistasHabilitados().subscribe(data => {
            this.accionistas = data;
        });

        this.controlTitulosService.obtenerAccionistas().subscribe(data => {
            this.accionistas = data;
        });

        this.filteredAccionistas = this.buscar.valueChanges.pipe(
            startWith(''),
            map(value => this._filterAccionistas(value))
        );
    }


    private _filterAccionistas(value: string): any[] {
        const filterValue = value;
        return this.accionistas.filter(accionista => accionista.Nombres.includes(filterValue));
    }

    displayAccionista(accionista: any): string {
        return accionista && accionista.Nombres ? accionista.Nombres : '';
    }

    ngAfterViewInit(): void {
        this.inicializarDatos();

    }


    /**
     * Método para cargar los datos de transacciones desde el servicio y actualizar la tabla.
     * Este metodo realiza dos llamados para buscar el path en el cual contiene el documento
     * De la transacción de acuerdo al consecutivo de la misma.
     */
    async inicializarDatos(): Promise<void> {
        try {
            this.loading = true;
            this.controlTitulosService.obtenerTransacciones().subscribe({
                next: (transacciones) => {
                    this.datosTabla = transacciones.map(data => {
                        return {
                            ...data,
                            tipoTransaccionN: data.tipoTransaccion.desTran,
                            estadoTransaccionN: data.estadoTransaccion?.descEstado
                        };
                    });
                    this.dataSource = new MatTableDataSource<any>(this.datosTabla);
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.sort = this.sort;
                    this.loading = false;
                },
                error: (data) => {
                    this.datosTabla = []
                    this.dataSource = []
                }
            })
        } catch (error) {
            this.datosTabla = []
            this.dataSource = []
        }
    }


    /**
     * Método que se ejecuta cuando cambia la selección en el filtro de categorías.
     * Filtra los datos de la tabla según el valor seleccionado en el filtro y
     * navega a la primera página del paginador si está disponible.
     * @param {any} event - Evento que contiene el valor seleccionado en el filtro.
     */
    onSelectionChange(event: any): void {
        const filterValue = event.value;;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    /**
     * Método que se ejecuta cuando se aplica un filtro en el campo de búsqueda.
     * Aplica el filtro a los datos de la tabla según el valor ingresado en el campo de búsqueda,
     * convirtiendo el valor a minúsculas y eliminando los espacios en blanco al principio y al final.
     * Además, navega a la primera página del paginador si está disponible.
     * @param {Event} event - Evento que contiene el valor ingresado en el campo de búsqueda.
     */
    applyFilter(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    /**
     * Abre un diálogo modal para mostrar más detalles sobre una transacción específica.
     * @param transaccion La transacción para la cual se mostrarán los detalles.
     */
    verMasModal(transaccion) {
        const dialogRef = this.dialog.open(VerMasModalComponent, {
            width: '650px',
            height: '620px',
            data: {
                transaccion
            },
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                console.log("exito")
            }
        });
    }


    onOptionSelected(event: MatAutocompleteSelectedEvent): void {
        const accionistaSeleccionado = event.option.value;
        const filterValue = accionistaSeleccionado.idPer;
        this.dataSource.filter = filterValue.trim().toLowerCase();
      }
}
