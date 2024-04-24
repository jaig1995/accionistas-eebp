import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { FuseLoadingBarComponent } from '@fuse/components/loading-bar';
import { InputAutocompleteComponent } from 'app/shared/components/inputAutocomplete/inputAutocomplete.component';
import { AngularMaterialModules } from 'app/shared/imports/Material/AngularMaterial';
import { AsambleaService } from '../asamblea.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PorcentajeDirective } from 'app/shared/directives/porcentaje.directive';

@Component({
    selector: 'app-asistencia',
    standalone: true,
    imports: [
        CommonModule,
        InputAutocompleteComponent,
        FuseLoadingBarComponent,
        ReactiveFormsModule,
        PorcentajeDirective,
        FormsModule,
        AngularMaterialModules
    ],
    templateUrl: 'asistencia.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations,
})
export class AsistenciaComponent implements OnInit {

    //inyeccion de Dependencias
    private _asambleaService = inject(AsambleaService)
    private _fb = inject(FormBuilder)

    //Tabla
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    dataSource: any = []

    //formulario
    datosAsamblea = this._fb.group({
        numeroAccionistas: [''],
        numeroAcciones: [''],
        qorum: ['']
      });
    formBuilder: any;

    ngOnInit(): void {
        this.cargarDatos();
        this.obtenerDatosAsamblea()
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    loading: boolean;
    showAlert: any;
    poderdante: string;
    valorInput: string


    cargarDatos() {
        this._asambleaService.obtenerAsistentes().subscribe({
            next: (data) => {
                console.log(data)
                this.dataSource = new MatTableDataSource<any>(data)
                this.dataSource.paginator = this.paginator;
            }
        })
    }

    obtenerDatosAsamblea(){
        this._asambleaService.obtenerDatosAsamblea().subscribe({
            next:(data:any)=>{
                console.log(data)
                this.datosAsamblea.patchValue({
                    numeroAccionistas: data.numeroAccionistas,
                    numeroAcciones: data.numeroAcciones,
                    qorum: data.quorum
                  });
            },
            error:(data)=>{
                console.log(data)
            }
        })
    }

    displayedColumns: string[] = ['NUMERO', 'ASISTENCIA', 'ACCIONES', 'IDENTIFICACION', 'NOMBRES', 'APELLIDOS', 'TELEFONO', 'CORREO'];


    obtenerPoderdante(valor: string) {
        this.poderdante = valor;
        console.log("desde obtenerPoderdante", valor)
    }
    obtenerValorInput(valor: string) {
        this.valorInput = valor
        console.log("desde obtenerValorInput", valor)
    }

    buscarAccionista() {


    }


    imprimirFila(row: any): void {
        row.asistencia = !row.asistencia;
        console.log('Información de la fila:', row);
        // Aquí puedes hacer lo que quieras con la fila, como imprimir sus propiedades o enviarla a otro lugar
    }
}
