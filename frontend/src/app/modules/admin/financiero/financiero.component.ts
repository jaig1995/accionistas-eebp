import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { AngularMaterialModules } from 'app/shared/imports/Material/AngularMaterial';
import { AsambleaService } from '../asamblea/asamblea.service';
import { FuseLoadingBarComponent } from '@fuse/components/loading-bar';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent } from '@fuse/components/alert';
import { InputAutocompleteComponent } from 'app/shared/components/inputAutocomplete/inputAutocomplete.component';
import { Invitado } from '../asamblea/creacionPlantillas/interfaces/asamblea.interface';
import { forEach } from 'lodash';
import { DateTime } from 'luxon';
import { ButtonCargarDocumentosComponent } from 'app/shared/components/buttonCargarDocumentos/buttonCargarDocumentos.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { Acciones } from './financiero.interface';

@Component({
    selector: 'app-financiero',
    standalone: true,
    imports: [
        CommonModule,
        AngularMaterialModules,
        ReactiveFormsModule,
        FuseLoadingBarComponent,
        FuseAlertComponent,
        InputAutocompleteComponent,
        ButtonCargarDocumentosComponent,
        MatDatepickerModule
    ],
    templateUrl: `financiero.component.html`,
    changeDetection: ChangeDetectionStrategy.Default,
    animations: fuseAnimations,
})
export class FinancieroComponent implements OnInit {

    private _cdr = inject(ChangeDetectorRef);
    private fb = inject(FormBuilder);
    private _asambleaService = inject(AsambleaService);

    //componentenes hijos
    @ViewChild(ButtonCargarDocumentosComponent) buttonCargarDocumentosComponent: ButtonCargarDocumentosComponent;
    @ViewChild(InputAutocompleteComponent) inputAutocompleteComponent: InputAutocompleteComponent;



    consecutivoAsamblea: any;
    today = new Date();

    formulario: FormGroup;

    asistente: Invitado;
    valorInput: string;

    //alertas
    showSuccesAlert = false;
    showFailedAlert = false;


    //array de los anos de asamblea para reportes
    anioSeleccionado;
    asambleaSeleccionada;
    pruebasAnios = []
    asambleas: any[];

    //documentos cargue
    existeDocumento: boolean = false;
    archivoComprobantes: any;

    //fecha asamblea
    fechaDeCorte = new FormControl(null, Validators.required)
    nombreArchivoComprobantes: string;
    numeroDeAccionesEnElMercado: any;
    numeroDeAccionesConDerechoAUtilidades: number;


    ngOnInit(): void {
        console.log('💻🔥 49, financiero.component.ts: ',);

        this.obtenerAsambleasl()
        this.formulario = this.fb.group({
            numAccMercado: [{value: this.numeroDeAccionesEnElMercado, disabled: true}, [Validators.required, this.numberValidator]],
            numAccUtilidades: [{value: this.numeroDeAccionesConDerechoAUtilidades, disabled: true}, [Validators.required, this.numberValidator]],
            participacionAccion: ['', [Validators.required, this.numberValidator]],
            pagoUtilidad: ['', Validators.required],
            numPagos: this.fb.array([], [this.sumValidator]),
            valNomAccion: ['', [Validators.required, this.numberValidator]],
            valIntrinseco: ['', [Validators.required, this.numberValidator]],
            divParticipacion: ['', [Validators.required, this.numberValidator]],
        });

        this.formulario.get('pagoUtilidad').valueChanges.subscribe(value => {
            this.actualizarCamposDinamicos(value);
        });

        this.obtenerConsecutivoAsamblea();
        this.anioSeleccionado = this.fb.control('', [Validators.required]);
        this.asambleaSeleccionada = this.fb.control('', [Validators.required]);
        this.obtenerUtilidades()

        this.obtenerResultadoAcciones()
    }


    obtenerResultadoAcciones() {
        this._asambleaService.obtenerResultadoAcciones().subscribe({
            next: (data: Acciones) => {
                console.log('💻🔥 102, financiero.component.ts: ', data);
                this.numeroDeAccionesEnElMercado = data.numeroDeAccionesEnElMercado
                this.numeroDeAccionesConDerechoAUtilidades = data.numeroDeAccionesConDerechoAUtilidades
                this.formulario.patchValue({
                    numAccMercado: this.numeroDeAccionesEnElMercado,
                    numAccUtilidades: this.numeroDeAccionesConDerechoAUtilidades
                });
            },
            error: () => {
                console.error("no se pudo obtener resultado Acciones");
            }
        })
    }


    numberValidator(control: AbstractControl): ValidationErrors | null {
        const value = control.value;
        if (value === null || value === undefined || value === '') {
            return null; // No validar valores vacíos para permitir que el validador required los capture
        }

        // Usamos una expresión regular para verificar si el valor contiene solo números,
        // un punto decimal o una coma como separador decimal
        const validNumberRegex = /^[0-9]+([.,][0-9]+)?$/;
        return validNumberRegex.test(value) ? null : { notANumber: true };
    }


    enviarFecha() {
        const fechaCorte = new Date(this.fechaDeCorte.value);
        const fechaFormateada = DateTime.fromJSDate(fechaCorte).toFormat('yyyy-MM-dd');
        const objFechaCorte = {
            fechaCorte: fechaFormateada
        }

        this.enviarFechaDeCorte(objFechaCorte)
        this.fechaDeCorte.reset()
    }

    enviarFechaDeCorte(data) {
        this._asambleaService.enviarFechaDeCorte(data).subscribe({
            next: (data) => {
                this.mostrarAlertaExitosa()
            },
            error: (error) => {
                this.mostrarAlertaFallida()
                console.error('Fallo peticion', error)
            }
        })
    }

    obtenerConsecutivoAsamblea() {
        this._asambleaService.obtenerConsecutivoAsamblea().subscribe({
            next: (data) => {
                this.consecutivoAsamblea = data.ultimoConsecutivo;
            },
            error: (error) => {
                this.consecutivoAsamblea = '';
            }
        });
    }



    contieneArchivo(valor: boolean) {
        console.log('💻🔥 149, financiero.component.ts: ', valor);
        this.existeDocumento = valor
    }

    recibirArchivo(archivo) {
        this.archivoComprobantes = archivo
    }


    enviarComprobante() {
        this._asambleaService.enviarArchivo(this.archivoComprobantes).subscribe({
            next: (data) => {
                console.log('💻🔥 153, financiero.component.ts: ', data);
                this.mostrarAlertaExitosa()
            },
            error: (error) => {
                console.error('no se pudo enviar el archivo')
                this.mostrarAlertaFallida()
            },
            complete: () => {
                this.asambleaSeleccionada.reset()
                this.asistente = undefined
                this.buttonCargarDocumentosComponent.reset()
                this.inputAutocompleteComponent.borrarFormulario()
            }
        })

    }


    sumValidator(control: FormArray): { [key: string]: boolean } | null {
        const valores = control.controls.map(c => c.value);
        const suma = valores.reduce((acc, cur) => acc + cur, 0);

        if (suma > 100) {
            return { sumExcedida: true };
        }

        if (valores.some(v => v < 0)) {
            return { valoresNegativos: true };
        }
        if (suma !== 100) {
            return { sumNoIgualA100: true };
        }

        return null;
    }

    actualizarCamposDinamicos(value: number) {
        while (this.numPagos.length) {
            this.numPagos.removeAt(0);
        }
        for (let i = 0; i < value; i++) {
            this.numPagos.push(this.fb.control('', Validators.required));
        }
    }

    get numPagos(): FormArray {
        return this.formulario.get('numPagos') as FormArray;
    }


    enviarFormularioParametrizacion() {

        const { value } = this.formulario
        //array con valores dinamicos
        const inputArray = value.numPagos
        const sumLimit = 100;
        const sumExceeds100 = inputArray.reduce((accumulator, currentValue) => accumulator + currentValue, 0) > sumLimit;
        if (sumExceeds100) {
            return
        }
        const dynamicObject: { [key: string]: string } = {};
        for (let i = 0; i < inputArray.length; i++) {
            const propertyName = `pago${i + 1}`;
            const propertyValue = inputArray[i];
            dynamicObject[propertyName] = propertyValue;
        }
        const Utilidades = {
            ...value,
            numAccMercado: this.numeroDeAccionesEnElMercado.toString(),
            numAccUtilidades: this.numeroDeAccionesConDerechoAUtilidades.toString(),
            numPagos: dynamicObject
        }
        this.enviarDatosUtilidades(Utilidades)
    }

    enviarDatosUtilidades(data) {
        this._asambleaService.enviarDatosUtilidades(data).subscribe({
            next: (data) => {
                this.mostrarAlertaExitosa()
                this.obtenerResultadoAcciones()
            },
            error: (error) => {
                this.mostrarAlertaFallida()
            },
            complete: () => {
                this.formulario.reset()
                this.formulario.markAsPristine();
                this.formulario.markAsUntouched();

                Object.keys(this.formulario.controls).forEach(key => {
                    this.formulario.get(key).setErrors(null);
                });
            }
        })
    }



    obtenerReporteDivididendo() {
        let anioSeleccionado = this.anioSeleccionado.value
        console.log('💻🔥 196, financiero.component.ts: ', anioSeleccionado);
        let fecha = new Date(anioSeleccionado.fechaCorte);
        let anio = fecha.getFullYear();
        if (!anioSeleccionado) return
        this._asambleaService.obtenerReporteDividendo(anio).subscribe({
            next: (data) => {
                const url = window.URL.createObjectURL(data);
                const a = document.createElement('a');
                a.href = url;
                a.download = `Reporte_Dividendos_${fecha}.zip`;
                a.click();
                window.URL.revokeObjectURL(url);
            },
            error: (error) => {
                this.mostrarAlertaFallida()
                console.error('Error al descargar el archivo:', error);
            },
            complete: () => {
                this.anioSeleccionado.reset()
            }
        })
    }



    obtenerUtilidades() {
        this._asambleaService.obtenerFechaDeCorte().subscribe({
            next: (data) => {
                console.log('💻🔥 235, financiero.component.ts: ', data);

                this.pruebasAnios = data.fechasDeCorte
                console.log('💻🔥 244, financiero.component.ts: ', this.pruebasAnios);
            },
            error: (error) => {
                this.mostrarAlertaFallida()
                console.error('error al obtener Utilidades', error);
            }
        })
    }

    obtenerAsambleasl() {
        this._asambleaService.obtenerAsambleas().subscribe({
            next: (data) => {
                const consecutivoAsamblea = data.map(objeto => {
                    return objeto.consecutivo

                });

                console.log('💻🔥 220, financiero.component.ts: ', consecutivoAsamblea);
                this.asambleas = consecutivoAsamblea
            },
            error: (error) => {
                console.error('error al obtener Utilidades', error);
            }
        })
    }


    enviarDocumentoComprobantes() {
        this.nombreArchivoComprobantes = `comprobante_${this.asambleaSeleccionada.value}_${this.asistente.idPer}`
        this.buttonCargarDocumentosComponent.enviarArchivo(this.nombreArchivoComprobantes)
        this.enviarComprobante()

    }





    obtenerPoderdante(valor: Invitado) {
        this.asistente = valor;
        console.log('💻🔥 208, financiero.component.ts: ', valor);
    }
    obtenerValorInput(valor: string) {
        this.valorInput = valor
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

}
