import { CommonModule, formatDate } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AngularMaterialModules } from 'app/shared/imports/Material/AngularMaterial';
import { ResumenPreguntasAsambleaComponent } from './resumenPreguntasAsamblea/resumenPreguntasAsamblea.component';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TemasAsamblea } from './Datos/temasAsamblea';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { FuseLoadingService } from '@fuse/services/loading';
import { AsambleaService } from '../asamblea.service';
import { FuseLoadingBarComponent } from '@fuse/components/loading-bar';
import { PlantillaPreguntas } from './interfaces/asamblea.interface';
import { FuseAlertComponent } from '@fuse/components/alert';
import { fuseAnimations } from '@fuse/animations';
import { Router } from '@angular/router';

@Component({
    selector: 'app-creacion-plantillas',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ResumenPreguntasAsambleaComponent,
        ReactiveFormsModule,
        FuseAlertComponent,
        FuseLoadingBarComponent,
        AngularMaterialModules
    ],
    templateUrl: 'creacionPlantillas.component.html',
    changeDetection: ChangeDetectionStrategy.Default,
    animations: fuseAnimations
})
export class CreacionPlantillasComponent implements OnInit {

    // Inyeccion de dependencias
    private fb = inject(FormBuilder)
    private asambleaService = inject(AsambleaService)
    private router = inject(Router);

    //componentes hijos
    @ViewChild(ResumenPreguntasAsambleaComponent) resumenPreguntasAsambleaComponent!: ResumenPreguntasAsambleaComponent;

    //stepper
    @ViewChild('stepper') stepper!: MatStepper;
    pasoActual: number

    // alertas y cargas
    showAlert
    loading
    showSuccesAlert = false;
    showFailedAlert = false;
    // arrays
    contextoPreguntas: any = [];
    respuestasOpcionMultiple: any = []

    // informacion temas asamblea
    temasAsamblea: any = []
    esEditableTemasAsamblea = false

    // dialogo
    dialogRef: MatDialogRef<any>;

    //consecutivos asamblea, encuesta
    consecutivoAsamblea: any;
    consecutivoEncuestaActual: any;

    // asamblea arrays
    preguntasAsamblea: any;
    existePreguntaMultiple: boolean;

    // formulario Plantilla preguntas
    respuestaOpcionMultiple = new FormControl
    formularioPreguntas = this.fb.group({
        tipoEncuesta: ['', Validators.required],
        fechaCreacion: [formatDate(new Date(), 'yyyy-MM-dd', 'en-US'), Validators.required],
        idsTemas: ['', Validators.required],
        estadoEncuesta: ['Activa'],
        nombreEncuesta: ['', Validators.required]
    })
    asignacionPregunta = this.fb.group({
        idTema: ['', Validators.required],
        tipoPregunta: ['',],
        pregunta: ['', Validators.required],
        tipoRespuesta: ['', Validators.required],
        opcionesRespuesta: this.fb.array([]),
    });

    // Fin formularios

    constructor(public dialog: MatDialog, private _fuseLoadingService: FuseLoadingService) { }



    ngOnInit(): void {
        this.obtenerConsecutivoAsamblea();

    }

    //peticiones HTTP
    obtenerDatosEncuesta() {
        this.temasAsamblea = TemasAsamblea
        this.asambleaService.obtenerDatosEncuesta(this.consecutivoAsamblea).subscribe(
            {
                next: (data: any) => {

                    //habilitar seccion escoge los temas a tratar checkbox
                    this.esEditableTemasAsamblea = true

                    const ultimoId = data.reduce((maxId, item) => {
                        return item.idEncuesta > maxId ? item.idEncuesta : maxId;
                    }, 0);

                    // Recibir los datos
                    const datosEncuesta = data[0]
                    console.log('💻🔥 115, creacionPlantillas.component.ts: ', datosEncuesta);


                    const pr = this.temasAsamblea.filter(item => {
                        if (datosEncuesta.temas.includes(item.id)) {
                            item.selected = true;
                            return true;
                        }
                        return false;
                    });
                    this.formularioPreguntas = this.fb.group({
                        tipoEncuesta: [{ value: datosEncuesta.tipoEncuesta, disabled: true },],
                        fechaCreacion: [{ value: datosEncuesta.fechaCreacion, disabled: true }, ''],
                        idsTemas: [{ value: pr, disabled: true }, Validators.required],
                        nombreEncuesta: [{ value: datosEncuesta.nombreEncuesta, disabled: true }],
                        estadoEncuesta: [{ value: datosEncuesta.estadoEncuesta, disabled: true }],
                    });
                },
                error: (error) => {
                    this.pasoActual = 0;
                    this.temasAsamblea.forEach(tema => {
                        tema.selected = false;
                    });

                }
            }
        )
    }

    //Enviar peticiones para crear la encuesta stpe 1 contexto preguntas asamblea NO.consecutivoAsamblea
    enviarPeticionEncuesta(encuesta) {
        this.asambleaService.enviarEncuestaCreacionPLantillas(encuesta).subscribe({
            next: (data) => {
                this.mostrarAlertaExitosa()
            },
            error: (error) => {
                this.mostrarAlertaFallida()
            },
            complete: () => {
                this.obtenerIdEncuestaActual()
                console.log('💻🔥 150, creacionPlantillas.component.ts: ', 'hereee');
            }
        })
    }

    obtenerConsecutivoAsamblea() {
        this.asambleaService.obtenerConsecutivoAsamblea().subscribe({
            next: (data) => {
                this.consecutivoAsamblea = data.ultimoConsecutivo
                this.obtenerDatosEncuesta()
            },
            error: (error) => {
                this.consecutivoAsamblea = ''
            }
        })
    }


    filtrarCaracteres(event: Event) {
        const input = event.target as HTMLTextAreaElement;
        const valorSinCaracteresProhibidos = input.value.replace(/[¿?]/g, '');
        this.asignacionPregunta.get('pregunta')?.setValue(valorSinCaracteresProhibidos, { emitEvent: false });
    }

    // fin peticiones http

    goToFirstStep(): void {
        this.stepper.previous();
    }

    // seccion agregar y eliminar respuestas de seleccion multiple
    agregarOpcion() {
        const opcion = this.respuestaOpcionMultiple.value;
        if (opcion) {
            this.respuestasOpcionMultiple.push(opcion);
            this.respuestaOpcionMultiple.reset();
        }
    }

    obtenerIdEncuestaActual() {
        this.asambleaService.obtenerIdEncuesta().subscribe({
            next: (data) => {
                this.consecutivoEncuestaActual = data.ultimoConsecutivo
                console.log('💻🔥 180, creacionPlantillas.component.ts: ', this.consecutivoEncuestaActual);
            },
            error: (error) => {
                console.log('💻🔥 185, creacionPlantillas.component.ts: ', error);
            }
        })
    }

    eliminarOpcion(index: number) {
        this.respuestasOpcionMultiple.splice(index, 1);
    }

    //todo: desde aqui logica no lista asamblea
    // Método para agregar una nueva pregunta al FormArray
    agregarPregunta() {
        const { idTema, tipoRespuesta, pregunta } = this.asignacionPregunta.value;
        const respuestas = this.respuestasOpcionMultiple
        const pruebas = {
            idEncuesta: this.consecutivoEncuestaActual,
            idTema: idTema,
            pregunta: pregunta,
            tipoPregunta: tipoRespuesta,
            opcionesRespuesta: tipoRespuesta === 'unica' ? ['si', 'no'] : respuestas
        };
        this.preguntasAsamblea = pruebas;
        console.log('💻🔥 194, creacionPlantillas.component.ts: ', this.preguntasAsamblea);
        this.enviarPreguntas(this.preguntasAsamblea)
    }
    // Fin seccion agregar

    enviarPreguntas(preguntas) {
        this.asambleaService.enviarPreguntasAsamblea(preguntas).subscribe({
            next: (data) => {
                this.mostrarAlertaExitosa()
                this.resumenPreguntasAsambleaComponent.obtenerDatosResumen()

            },
            error: (error) => {
                this.mostrarAlertaFallida()
            }
        })
    }

    //actualizar respuestas seccion asignacion de preguntas del array de respuestas para opcion multiple
    actualizarRespuesta(nuevoValor: string, indice: number) {
        if (nuevoValor.trim() !== '') {
            this.respuestasOpcionMultiple[indice] = nuevoValor;
            this.existePreguntaMultiple = false
        } else {
            this.existePreguntaMultiple = true
        }
    }

    // Enviar Preguntas al BackEnd
    guardarPreguntas() {
        this.agregarPregunta()
        this.asignacionPregunta.reset()
        this.respuestasOpcionMultiple = []
    }

    //modificador y seleccionador de opciones del del escoger los temas a tratar
    toggleCheckbox(tema: any,) {
        tema.selected = !tema.selected;
        const index = this.temasAsamblea.findIndex(item => item.id === tema.id);
        if (index !== -1) {
            this.temasAsamblea[index].selected = tema.selected;
        }
        let seleccionadosToogle = this.temasAsamblea.filter(item => item.selected === true);
        let idsSeleccionados = seleccionadosToogle.map(item => item.id)
        this.formularioPreguntas.get('idsTemas').patchValue(idsSeleccionados);
    }


    //Seccion Abrir dialogo
    abrirDialogo(template: TemplateRef<any>): void {
        this.dialogRef = this.dialog.open(template);
        this.dialogRef.afterClosed().subscribe(result => {
            if (!result) return
            this.enviarPeticionEncuesta(this.formularioPreguntas.value)
            this.temasAsamblea = TemasAsamblea


        });
        this.esEditableTemasAsamblea = true

    }

    cerrarDialogo() {
        this.dialogRef.close(false);
        this.goToFirstStep()
    }

    aprobarDialogo() {
        this.dialogRef.close(true);
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
