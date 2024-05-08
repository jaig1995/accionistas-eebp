import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ServicesConfig } from 'app/services.config';
import { Observable, tap } from 'rxjs';
import { PlantillaPreguntas } from './creacionPlantillas/interfaces/asamblea.interface';

@Injectable({
    providedIn: 'root'
})
export class AsambleaService {

    private _baseUrl: string = ServicesConfig.apiUrl;
    private http = inject(HttpClient);

    constructor() { }


    enviarRegistroPoderesregistro(registro) {
        return this.http.post<any>(`${this._baseUrl}/api/registroPoder/`, registro)
    }

    enviarArchivo(archivo: any): Observable<any> {
        const formData = new FormData();
        formData.append('file', archivo);
        return this.http.post<any>(`${this._baseUrl}/api/transaccion/uploadFile`, formData);
    }



    //Pantalla registro de poderes
    obtenerRegistradosPoderes() {
        return this.http.get<any[]>('api/asamblea/obtener-registro-poderes')
    }

    registrarPoder(data) {
        return this.http.post<any[]>('api/asamblea/registro-poderes', data)
    }


    //Pantalla Postulaciones
    registrarPostulantes(data) {
        return this.http.post<any[]>('api/asamblea/postulaciones', data)
    }

    obtenerPostulantes() {
        return this.http.get<any[]>('api/asamblea/obtener-postulaciones')
    }


    //Pantalla crear Asamblea
    crearAsamblea(data) {
        return this.http.post<any[]>(`${this._baseUrl}/api/asamblea/crear-asamblea`, data)
    }

    obtenerAsambleas() {
        return this.http.get<any[]>(`${this._baseUrl}/api/asamblea/obtener-asambleas`)
    }

    enviarInvitacionAsamblea() {

    }

    obtenerConsecutivosAsamblea() {
        return this.http.get<any[]>('api/asamblea/obtener-consecutivo-asamblea')
    }

    //Pantalla Asistencia y listado
    obtenerAsistentes(){
        return this.http.get<any[]>('api/asamblea/obtener-asitentes-asamblea')
    }
    registrarAsistente(data){
        return this.http.post<any[]>('api/asamblea/registrar-asitente-asamblea', data)
    }

    obtenerDatosAsamblea(){
        return this.http.get<any[]>('api/asamblea/obtener-datos-asamblea')
    }


    //creacion de plantillas preguntas asamblea y init de votaciones


    obtenerPreguntasAsamblea(){
        return this.http.get<PlantillaPreguntas>('api/creacion-plantillas-preguntas')
    }

    //Seccion votaciones

    obtenerFormularioAccionista(datosVotante){
        return this.http.get<PlantillaPreguntas>('api/obtener-formulario-accionista', datosVotante)
    }

    inicializarFormularioAccionista(formulario){
        return this.http.post<PlantillaPreguntas>('api/inicializar-formulario-asamblea',formulario)
    }



}
