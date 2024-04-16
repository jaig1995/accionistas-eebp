import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, inject, OnInit, ViewChild, } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ButtonCargarDocumentosComponent } from 'app/shared/components/buttonCargarDocumentos/buttonCargarDocumentos.component';
import { AngularMaterialModules } from 'app/shared/imports/Material/AngularMaterial';
import { DateTime } from 'luxon';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { eebpTheme } from '../../../../shared/imports/temaPicker/temaPicker';

@Component({
    selector: 'app-crear-asamblea',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        AngularMaterialModules,
        TimepickerModule,
        ReactiveFormsModule,
        NgxMaterialTimepickerModule,
        ButtonCargarDocumentosComponent,

    ],
    templateUrl: 'crearAsamblea.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CrearAsambleaComponent implements OnInit, AfterViewInit {

    private formBuilder = inject(FormBuilder);

    //temaEEBP
    eebpTheme = eebpTheme;

    //alertas o validaciones
    showSuccesAlert = false;
    showFailedAlert = false;
    existeDocumento: boolean = false;
    loading: boolean;
    archivoImagen: any;

    //formulario

    crearAsamblea = this.formBuilder.group({
        consecutivoAsamblea: [],
        fechaAsamblea: ['', [Validators.required,]],
        horaAsamblea: ['', Validators.required],
        tipoAsamblea: ['', Validators.required],
        estado: ['Activa']
    });

    //tabla
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    displayedColumns: string[] = ['CONSECUTIVO', 'FECHA_ASAMBLEA', 'HORA_ASAMBLEA', 'TIPO', 'ESTADO', 'VER_MAS', 'ACCIONES'];
    ejemplo = [
        { consecutivo: 23, fechaAsamble: '23/04/2024', horaAsamblea: '9:30 PM', tipoAsamblea: 'Ordinaria', estado: 'Activa', },
        { consecutivo: 24, fechaAsamble: '18/12/2023', horaAsamblea: '10:30 AM', tipoAsamblea: 'Extraordinaria', estado: 'Inactiva', },
        { consecutivo: 25, fechaAsamble: '24/08/2023', horaAsamblea: '3:45 PM', tipoAsamblea: 'Ordinaria', estado: 'Inactiva', },
    ];
    dataSource = new MatTableDataSource<any>(this.ejemplo)


    constructor() {
    }

    ngOnInit(): void {
        //TODO:recibir consecutivo de backend
        this.crearAsamblea.get('consecutivoAsamblea').setValue(23);
    }


    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    enviarAsamblea() {
        const formValue = this.crearAsamblea.value;
        const fechaAsamblea = new Date(formValue.fechaAsamblea);
        const fechaFormateada = DateTime.fromJSDate(fechaAsamblea).toFormat('dd/MM/yyyy');
        const valoresActualizados = { ...formValue, fechaAsamblea: fechaFormateada };
        console.log(valoresActualizados);
    }

    //tablas
    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    contieneArchivo(valor: boolean) {
        this.existeDocumento = valor
    }

    recibirArchivo(archivo) {
        this.archivoImagen = archivo
    }

    //alertas
    mostrarAlertaExitosa(): void {
        this.showSuccesAlert = true;
        setTimeout(() => {
            this.showSuccesAlert = false;
        }, 3000);
    }

    mostrarAlertaFallida(): void {
        this.showFailedAlert = true;
        setTimeout(() => {
            this.showFailedAlert = false;
        }, 3000);
    }

    getColor(estado: string): string {
        switch (estado) {
            case 'Inactiva':
                return '#D6DCE4';
            case 'Activa':
                return '#5A9C30';
            default:
                return 'black';
        }
    }
}
