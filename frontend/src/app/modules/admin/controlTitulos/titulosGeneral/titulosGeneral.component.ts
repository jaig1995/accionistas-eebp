import { AsyncPipe, CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';


import { FuseAlertComponent } from '@fuse/components/alert';
import { ControlTitulosService } from '../controlTitulos.service';
import { AprobarTitulos } from '../interfaces/aprobarTitulos.interface';
import { VerMasModalComponent } from '../modales/verMasModal/verMasModal.component';
import { InputAutocompleteComponent } from 'app/shared/components/inputAutocomplete/inputAutocomplete.component';
import { AngularMaterialModules } from 'app/shared/imports/Material/AngularMaterial';
@Component({
    selector: 'app-titulos-general',
    standalone: true,
    imports: [
        CommonModule,
        InputAutocompleteComponent,
        FuseAlertComponent,
        AsyncPipe,
        AngularMaterialModules
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

    //variables componente hijo autocomplete
    accionistaAutoComplete: any;


    constructor(private controlTitulosService: ControlTitulosService, private dialog: MatDialog) {
        this.inicializarDatos()
    }

    ngOnInit(): void {
        this.inicializarDatos();
    }


    // Seccion Recibir valor componente hijo (app-input-autocomplete)
    obtenerAccionista(valor) {
        this.accionistaAutoComplete = valor.idPer;
        console.log(this.accionistaAutoComplete)
        this.applyFilter(this.accionistaAutoComplete)
    }

    ngAfterViewInit(): void {
        this.inicializarDatos();

    }
    //fin seccion



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
    applyFilter(event): void {
        const filterValue = event
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
}
