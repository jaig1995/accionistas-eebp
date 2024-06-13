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
import { utils, writeFileXLSX } from 'xlsx';
import { PorcentajesPipe } from 'app/shared/pipes/procentajes.pipe';
import { Invitado } from '../creacionPlantillas/interfaces/asamblea.interface';
import { FuseAlertComponent } from '@fuse/components/alert';
import { AccionistasService } from '../../control-accionistas/addaccionista/accionistas.service';
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
        PorcentajesPipe,
        FuseAlertComponent,
        AngularMaterialModules
    ],
    templateUrl: 'asistencia.component.html',
    changeDetection: ChangeDetectionStrategy.Default,
    animations: fuseAnimations,
})
export class AsistenciaComponent implements OnInit {

    //inyeccion de Dependencias
    private _asambleaService = inject(AsambleaService)
    private _accionistasService = inject(AccionistasService)
    private _fb = inject(FormBuilder)

    //Tabla
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    displayedColumns: string[] = ['NUMERO', 'ASISTENCIA', 'ACCIONES', 'IDENTIFICACION', 'NOMBRES', 'APELLIDOS', 'TELEFONO', 'CORREO'];
    dataSource: any = []

    //validaciones y alertas
    showSuccesAlert = false;
    showFailedAlert = false;
    loading: boolean;
    showAlert: any;
    asistente: Invitado;
    valorInput: string;
    mensajeError:string = "¡Transacción no exitosa!";

    //validaciones por medio de huella Digital
    message: any;
    base64: any;
    //formulario
    formBuilder: any;
    datosAsamblea = this._fb.group({
        numeroAccionistas: [''],
        numeroAcciones: [''],
        qorum: ['']
    });
    consecutivoAsamblea: any;

    ngOnInit(): void {
        this.obtenerConsecutivoAsamblea()
        this.cargarDatos();
        this.obtenerDatosAsamblea()
    }


    obtenerConsecutivoAsamblea() {
        this._asambleaService.obtenerConsecutivoAsamblea().subscribe({
            next: (data) => {
                this.consecutivoAsamblea = data.ultimoConsecutivo
            },
            error: (error) => {
                this.consecutivoAsamblea = ''
            }
        })
    }

    cargarDatos() {
        this._asambleaService.obtenerAsistentes().subscribe({
            next: (data) => {
                this.dataSource = new MatTableDataSource<any>(data)
                this.dataSource.paginator = this.paginator;
            },
            error: (error) => {
                console.log(error)
            }
        })
    }

    obtenerDatosAsamblea() {
        this._asambleaService.obtenerDatosAsamblea().subscribe({
            next: (data: any) => {
                this.datosAsamblea.patchValue({
                    numeroAccionistas: data.totalRegistros,
                    numeroAcciones: data.totalAcciones,
                    qorum: data.quorum
                });
            },
            error: (data) => {
                console.log(data)
            }
        })
    }




    obtenerPoderdante(valor: Invitado) {
        this.asistente = valor;
    }
    obtenerValorInput(valor: string) {
        this.valorInput = valor
    }

    buscarAccionista() {
        // if(!this.asistente || this.valorInput) return;

        if (!this.asistente) {
            const valor = this.valorInput
            this.enviarPeticion(valor)
        } else {
            const { idPer } = this.asistente
            this.enviarPeticion(idPer)
        }
    }

    enviarPeticion(data) {
        this._asambleaService.registrarAsistente({ idePer: data, huella: null }).subscribe({
            next: (data) => {
                this.mostrarAlertaExitosa()
                this.obtenerConsecutivoAsamblea()
                this.cargarDatos();
                this.obtenerDatosAsamblea()
            },
            error:(error)=> {
                this.mostrarAlertaFallida()
                this.mensajeError = "La persona ya se encuentra registrada."

            }
        })
    }





    imprimirFila(row: any): void {
        row.asistencia = !row.asistencia;
        const data = {
            idAsistente: row.idAsistente,
            consecutivo: this.consecutivoAsamblea,
            asistencia: row.asistencia,
            idePer: row.codUsuario,
            huella: null
        }
        this.actualizarAsistencia(data)
        this.obtenerDatosAsamblea()

        console.log('💻🔥 165, asistencia.component.ts: ', data);
    }

    actualizarAsistencia(data){
        this._asambleaService.actualizarAsistencia(data).subscribe(
            {
                next:(data) => {
                    console.log('💻🔥 176, asistencia.component.ts: ', data);
                },
                error:(data) => {
                    console.log('💻🔥 179, asistencia.component.ts: ', data);
                }
            }
        )
    }

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


    obtenerHuella() {
        this._accionistasService.peticionGetHuella().subscribe(
            (response) => {
                const base64Data = response.fingerprint.message;
                this.message = base64Data;
                this.base64 = base64Data;
                // this.accionistasForm.get('huella').setValue(this.base64);
            },
            (error) => {
                console.error('Error en la petición:', error);
            }
        );
    }


    generarExcel() {
        //datos para exportar a PDF
        const datosRegistroPoderes = this.dataSource.data
        //se renombra los datos del objeto para que sean cabeceras de excel
        const ws_registro_poderes = this.dataSource.data
        //se agrega una hoja excel
        const ws = utils.json_to_sheet(ws_registro_poderes);
        //se crea un libro de excel
        const wb = utils.book_new();
        //agregamos una hoja al libro (wb workBook) (ws workSheet)
        utils.book_append_sheet(wb, ws, "Registro_poderes");
        //exportamos el libro excel
        writeFileXLSX(wb, `Asistencia_listado_${this.consecutivoAsamblea}.xlsx`, { compression: true });

    }


    applyFilter(event: Event) {
        console.log('💻🔥 215, asistencia.component.ts: ', event);
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }
}
