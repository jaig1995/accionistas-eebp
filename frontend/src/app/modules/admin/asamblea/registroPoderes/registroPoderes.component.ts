

import { AfterViewInit, Component, inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { map, Observable, startWith } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FuseAlertComponent } from '@fuse/components/alert';

import { AngularMaterialModules } from 'app/shared/imports/Material/AngularMaterial';
import { ControlTitulosService } from '../../controlTitulos/controlTitulos.service';
import { InputAutocompleteComponent } from 'app/shared/components/inputAutocomplete/inputAutocomplete.component';

@Component({
    selector: 'app-registro-poderes',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AsyncPipe,
        FuseAlertComponent,
        InputAutocompleteComponent,
        AngularMaterialModules

    ],
    templateUrl: 'registroPoderes.component.html',
    encapsulation: ViewEncapsulation.Emulated,
})
export class RegistroPoderesComponent implements AfterViewInit {

    //alertas o validaciones
    loading: boolean;
    showAlert: any;

    //variables componentes
    poderdante: any
    apoderado: any;

    //tabla
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    displayedColumns: string[] = ['CONSECUTIVO', 'DOCUMENTO PODERDANTE', 'PODERDANTE', 'N.ACCIONES', 'APODERADO', 'DOCUMENTO APODERADO', 'VER MÁS', 'ACCIONES'];
    dataSource: MatTableDataSource<any>;


    constructor() {
        this.dataSource = new MatTableDataSource(['users']);
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    obtenerPoderdante(valor: string) {
        this.poderdante = valor;
    }

    obtenerApoderado(valor: any) {
        this.apoderado = valor;
    }

    mostrar(){
        console.log("hola")
        console.log(this.poderdante,this.apoderado )
    }





    //tablas
    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }



}
