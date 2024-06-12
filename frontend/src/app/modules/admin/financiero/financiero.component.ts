import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { AngularMaterialModules } from 'app/shared/imports/Material/AngularMaterial';
import { AsambleaService } from '../asamblea/asamblea.service';
import { FuseLoadingBarComponent } from '@fuse/components/loading-bar';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent } from '@fuse/components/alert';

@Component({
    selector: 'app-financiero',
    standalone: true,
    imports: [
        CommonModule,
        AngularMaterialModules,
        ReactiveFormsModule,
        FuseLoadingBarComponent,
        FuseAlertComponent
    ],
    templateUrl: `financiero.component.html`,
    changeDetection: ChangeDetectionStrategy.Default,
    animations: fuseAnimations,
})
export class FinancieroComponent implements OnInit {
    private _cdr = inject(ChangeDetectorRef);
    private fb = inject(FormBuilder);
    private _asambleaService = inject(AsambleaService);

    consecutivoAsamblea: any;

    formulario: FormGroup;

    //alertas
    showSuccesAlert = false;
    showFailedAlert = false;


    //array de los anos de asamblea para reportes
    anioSeleccionado;
    pruebasAnios = []

    ngOnInit(): void {

        this.formulario = this.fb.group({
            numAccMercado: ['', [Validators.required, this.numberValidator]],
            numAccUtilidades: ['', [Validators.required, this.numberValidator]],
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
        this.obtenerUtilidades()
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

    obtenerConsecutivoAsamblea() {
        this._asambleaService.obtenerConsecutivoAsamblea().subscribe({
            next: (data) => {
                console.log('💻🔥 64, cierreAsamblea.component.ts: ', data);
                this.consecutivoAsamblea = data.ultimoConsecutivo;
            },
            error: (error) => {
                this.consecutivoAsamblea = '';
            }
        });
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
        console.log('💻🔥 99, cierreAsamblea.component.ts: ', value);
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
            numPagos: dynamicObject
        }
        console.log('💻🔥 102, cierreAsamblea.component.ts: ', Utilidades);
        this.enviarDatosUtilidades(Utilidades)
    }

    enviarDatosUtilidades(data) {
        this._asambleaService.enviarDatosUtilidades(data).subscribe({
            next: (data) => {
                this.mostrarAlertaExitosa()
                console.log('💻🔥 232, cierreAsamblea.component.ts: ', data);
            },
            error: (error) => {
                // console.log('💻🔥 235, cierreAsamblea.component.ts: ', error);
                this.mostrarAlertaFallida()
            }
        })
    }



    obtenerReporteDivididendo() {
        console.log('💻🔥 212, reportes.component.ts: ', this.anioSeleccionado.value);
        let anioSeleccionado = this.anioSeleccionado.value
        if (!anioSeleccionado) return
        this._asambleaService.obtenerReporteDividendo(anioSeleccionado).subscribe({
            next: (data) => {
                const url = window.URL.createObjectURL(data);
                const a = document.createElement('a');
                a.href = url;
                a.download = `Reporte_Dividendos_${anioSeleccionado}.zip`;
                a.click();
                window.URL.revokeObjectURL(url);
            },
            error: (error) => {
                this.mostrarAlertaFallida()
                console.error('Error al descargar el archivo:', error);
            }
        })
    }


    obtenerUtilidades() {
        this._asambleaService.obtenerUtLidades().subscribe({
            next: (data) => {
                const aniosArray = data.map(objeto => {
                    const fecha = new Date(objeto.fecUtilidad);
                    const anio = fecha.getFullYear();
                    return anio;
                });

                this.pruebasAnios = aniosArray
            },
            error: (error) => {
                console.error('error al obtener Utilidades', error);
            }
        })
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
