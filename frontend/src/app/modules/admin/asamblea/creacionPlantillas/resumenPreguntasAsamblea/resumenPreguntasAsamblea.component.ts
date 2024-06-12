import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { AngularMaterialModules } from 'app/shared/imports/Material/AngularMaterial';
import { PlantillaPreguntas } from '../interfaces/asamblea.interface';
import { AsambleaService } from '../../asamblea.service';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-resumen-preguntas-asamblea',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        AngularMaterialModules
    ],
    templateUrl: 'resumenPreguntasAsamblea.component.html',
})
export class ResumenPreguntasAsambleaComponent implements OnInit {

    //Inyeccion de dependencias
    private asambleaService = inject(AsambleaService)
    private fb = inject(FormBuilder)



    //variable formulario
    preguntasGenerales: FormGroup;

    //validaciones y alertas
    botonActivo = true
    consecutivoAsamblea: any;
    pantallaDeCarga: boolean;

    ngOnInit(): void {
        this.obtenerDatosResumen()


    }

    obtenerDatosResumen(){
        this.obtenerConsecutivoAsamblea()
        this.cargarDatosFormulario()
        this.inicializarFormulario()
    }

    /////////////////////////////////////////////////////
    // SECCION FORMULARIO
    /////////////////////////////////////////////////////

    inicializarFormulario() {
        this.preguntasGenerales = this.fb.group({
            juntaDirectiva: this.fb.group({
                preguntas: this.fb.array([])
            }),
            reformaEstatutos: this.fb.group({
                preguntas: this.fb.array([])
            }),
            distribucionUtilidades: this.fb.group({
                preguntas: this.fb.array([])
            }),
            revisoriaFiscal: this.fb.group({
                preguntas: this.fb.array([])
            }),
            estadosFinancieros: this.fb.group({
                preguntas: this.fb.array([])
            }),
            proposicionesVarios: this.fb.group({
                preguntas: this.fb.array([])
            })
        });
    }


    // -----seccion juntadirectiva -----
    get juntaDirectivaPreguntas() {
        return this.preguntasGenerales.get('juntaDirectiva.preguntas') as FormArray
    }

    // -----seccion reformaEstatutos -----

    get reformaEstatutosPreguntas() {
        return this.preguntasGenerales.get('reformaEstatutos.preguntas') as FormArray
    }

    // -----seccion revisoriaFiscal -----

    get revisoriaFiscalPreguntas() {
        return this.preguntasGenerales.get('revisoriaFiscal.preguntas') as FormArray
    }

    // -----seccion distribucionUtilidades -----

    get distribucionUtilidadesPreguntas() {
        return this.preguntasGenerales.get('distribucionUtilidades.preguntas') as FormArray
    }

    // -----seccion estadosFinancieros -----

    get estadosFinancierosPreguntas() {
        return this.preguntasGenerales.get('estadosFinancieros.preguntas') as FormArray
    }

    // -----seccion estadosFinancieros -----

    get proposicionesVariosPreguntas() {
        return this.preguntasGenerales.get('proposicionesVarios.preguntas') as FormArray
    }


    enviarFormulario() {
        console.log(this.preguntasGenerales.value)
    }

    cargarDatosFormulario() {
        this.pantallaDeCarga = true
        this.asambleaService.obtenerConsecutivoAsamblea().subscribe({
            next:(data)=>{
                console.log('💻🔥 111, resumenPreguntasAsamblea.component.ts: ', data);
                this.consecutivoAsamblea = data.ultimoConsecutivo
                this.asambleaService.obtenerPreguntasAsamblea2(this.consecutivoAsamblea).subscribe({
                    next: (data: PlantillaPreguntas) => {
                        console.log('💻🔥 115, resumenPreguntasAsamblea.component.ts: ', data);
                        this.cargarDatosCategoria(data.juntaDirectiva, 'juntaDirectiva');
                        this.cargarDatosCategoria(data.reformaEstatutos, 'reformaEstatutos');
                        this.cargarDatosCategoria(data.distribucionUtilidades, 'distribucionUtilidades');
                        this.cargarDatosCategoria(data.revisoriaFiscal, 'revisoriaFiscal');
                        this.cargarDatosCategoria(data.estadosFinancieros, 'estadosFinancieros');
                        this.cargarDatosCategoria(data.proposicionesVarios, 'proposicionesVarios');
                        this.botonActivo = false
                    },
                    error: (error) => {
                        console.log(error)
                    },
                    complete: () => {
                        this.botonActivo = false
                        this.pantallaDeCarga = false
                    }
                });
            },
            error:(error)=>{
                this.consecutivoAsamblea = ''
            }
        })


    }

    obtenerConsecutivoAsamblea(){
        this.asambleaService.obtenerConsecutivoAsamblea().subscribe({
            next:(data)=>{
                this.consecutivoAsamblea = data.ultimoConsecutivo
            },
            error:(error)=>{
                this.consecutivoAsamblea = ''
            }
        })
    }

    cargarDatosCategoria(data: any[], categoria: string) {
        const preguntas = this.preguntasGenerales.get(`${categoria}.preguntas`) as FormArray;
        if (!data) return
        preguntas.clear();

        data.forEach(pregunta => {
            const nuevaPregunta = this.fb.group({
                id: pregunta.id,
                tipoRespuesta: pregunta.tipoRespuesta,
                pregunta: pregunta.pregunta,
                opcionesRespuesta: this.fb.array(pregunta.opcionesRespuesta.map(respuesta => this.fb.control(respuesta.opcRespuesta)))
            });
            preguntas.push(nuevaPregunta);
        });
    }

    eliminarPregunta(id: string, contexto: string) {
        const data = {
            [contexto]: id
        }

        this.cargarDatosFormulario()
        //
        this.botonActivo = true
    }


    /////////////////////////////////////////////////////
    // FIN SECCION FORMULARIO
    /////////////////////////////////////////////////////





}
