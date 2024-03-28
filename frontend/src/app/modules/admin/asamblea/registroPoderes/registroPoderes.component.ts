import { AsyncPipe, CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { FuseAlertComponent } from '@fuse/components/alert';
import { map, Observable, startWith } from 'rxjs';
import { ControlTitulosService } from '../../controlTitulos/controlTitulos.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';

@Component({
    selector: 'app-registro-poderes',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatButtonModule,
        MatDividerModule,
        MatTableModule,
        MatCheckboxModule,
        ReactiveFormsModule,
        MatProgressSpinnerModule,
        FuseAlertComponent,
        MatAutocompleteModule,
        MatTableModule,
        MatSortModule,
        MatPaginatorModule,
        MatMenuModule,
        AsyncPipe,

    ],
    templateUrl: 'registroPoderes.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistroPoderesComponent implements OnInit, AfterViewInit {

    //inyeccion de dependencias
    private controlTitulosService = inject(ControlTitulosService);

    //alertas o validaciones
    loading: boolean;
    showAlert: any;

    //autocomplete para accionistas
    poderdantes: any[] = [];
    apoderados: any[] = [];
    filtroPoderdantes: Observable<any[]>;
    filtroApoderados: Observable<any[]>;

    //formularios
    poderdante = new FormControl('');
    apoderado = new FormControl('');

    //tabla
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    displayedColumns: string[] = ['CONSECUTIVO', 'DOCUMENTO PODERDANTE', 'PODERDANTE', 'N.ACCIONES', 'APODERADO', 'DOCUMENTO APODERADO', 'VER MÁS', 'ACCIONES'];
    dataSource: MatTableDataSource<any>;

    constructor() {
        this.dataSource = new MatTableDataSource(['users']);
    }


    ngOnInit(): void {
        this.obtenerAccionistas()
        this.filtroPoderdante()
        this.filtroApoderado()
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }


    obtenerAccionistas() {
        this.controlTitulosService.obtenerAccionistas().subscribe(data => {
            this.poderdantes = data;
            this.apoderados = data;
        });
    }

    filtroPoderdante() {
        this.filtroPoderdantes = this.poderdante.valueChanges.pipe(
            startWith(''),
            map(value => this._filtroPoderdante(value))
        );
    }

    filtroApoderado() {
        this.filtroApoderados = this.apoderado.valueChanges.pipe(
            startWith(''),
            map(value => this._filtroApoderado(value))
        );
    }

    private _filtroPoderdante(value: string): any[] {
        const filterValue = value;
        return this.poderdantes.filter(accionista => accionista.Nombres.includes(filterValue));
    }

    private _filtroApoderado(value: string): any[] {
        const filterValue = value;
        return this.apoderados.filter(accionista => accionista.Nombres.includes(filterValue));
    }

    mostrarPoderdante(poderdante: any): string {
        return poderdante && poderdante.Nombres ? poderdante.Nombres : '';
    }

    mostrarApoderado(apoderado: any): string {
        return apoderado && apoderado.Nombres ? apoderado.Nombres : '';
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
