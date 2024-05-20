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

    enviarArchivo(archivo: any): Observable<any> {
        const formData = new FormData();
        formData.append('file', archivo);
        return this.http.post<any>(`${this._baseUrl}/api/transaccion/uploadFile`, formData);
    }

    //Pantalla registro de poderes
    obtenerRegistradosPoderes() {
        return this.http.get<any[]>(`${this._baseUrl}/api/asamblea/obtener-registro-poderes`)
    }

    registrarPoder(data) {
        return this.http.post<any[]>(`${this._baseUrl}/api/asamblea/registro-poderes`, data)
    }

    aprobarRechazarPoder(consecutivo, data) {
        return this.http.put<any[]>(`${this._baseUrl}/api/asamblea/actualizar-estado/${consecutivo}`, data)
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

    enviarInvitacionAsamblea(consecutivo) {
        return this.http.post<any>(`${this._baseUrl}/api/asamblea/enviar-invitacion/${consecutivo}`, null)
    }

    obtenerAsambleas() {
        return this.http.get<any[]>(`${this._baseUrl}/api/asamblea/obtener-asambleas`)
    }

    modificarAsamblea(data) {
        return this.http.put<any>(`${this._baseUrl}/api/asamblea/actualizar`, data)
    }

    obtenerConsecutivosAsamblea() {
        return this.http.get<any>(`${this._baseUrl}/api/asamblea/obtener-consecutivo-asamblea`)
    }
    //Pantalla Asistencia y listado
    obtenerAsistentes() {
        return this.http.get<any[]>(`${this._baseUrl}/api/asamblea/obtener-asitentes-asamblea`)
    }

    registrarAsistente(data) {
        return this.http.post<any[]>(`${this._baseUrl}/api/asamblea/registrar-asistente-asamblea`, data)
    }

    enviarEncuestaCreacionPLantillas(encuesta) {
        return this.http.post<any>(`${this._baseUrl}/api/encuesta/agregar`, encuesta)
    }
    enviarPreguntasAsamblea(preguntas) {
        return this.http.post<any>(`${this._baseUrl}/api/encuesta/guardarPregunta`, preguntas)
    }
    obtenerDatosAsamblea() {
        return this.http.get<any[]>(`${this._baseUrl}/api/asamblea/obtener-datos-asamblea`)
    }

    obtenerDatosEncuesta(id) {
        return this.http.get<any[]>(`${this._baseUrl}/api/encuesta/${id}`)
    }

    //creacion de plantillas preguntas asamblea y init de votaciones

    //TODO: iniciar aqui asambleas
    obtenerPreguntasAsamblea() {
        return this.http.get<PlantillaPreguntas>(`api/asamblea/creacion-plantillas-preguntas`)
    }
    obtenerPreguntasAsamblea2(consecutivoAsamblea) {
        return this.http.get<PlantillaPreguntas>(`${this._baseUrl}/api/encuesta/resumen/${consecutivoAsamblea}`)
    }

    //Seccion votaciones

    obtenerFormularioAccionista(datosVotante) {
        return this.http.get<PlantillaPreguntas>('api/asamblea/obtener-formulario-accionista', datosVotante)
    }

    obtenerFormularioAccionista2(datosVotante) {
        return this.http.get<PlantillaPreguntas>(`${this._baseUrl}/api/encuesta/asignada/${datosVotante}`)
    }

    inicializarFormularioAccionista(formulario) {
        return this.http.post<PlantillaPreguntas>('api/asamblea/inicializar-formulario-asamblea', formulario)
    }


    // seccion quorum

    obtenerQuorumDatos() {
        return this.http.get<any>(`${this._baseUrl}/api/asamblea/obtener-datos-asamblea`)
    }


    obtenerConsecutivoAsamblea() {
        return this.http.get<any>(`${this._baseUrl}/api/asamblea/consecutivo`,)
    }
    //votaciones

    votar(formulario) {
        return this.http.post<PlantillaPreguntas>(`${this._baseUrl}/api/respuestas/guardarRespuestas`, formulario)
    }

    obtenerDatosVotaciones() {
        return this.http.get<any>(`api/votaciones/obtener-poderdantes`,)
    }


    // resultados
    obtenerResultadosVotaciones(consecutivoAsamblea) {
        return this.http.get<any>(`${this._baseUrl}/api/respuestas/encuesta/${consecutivoAsamblea}`)
    }
    obtenerpoderDantes(consecutivoAsamblea) {
        console.log("desde obtenerpoderDantes", consecutivoAsamblea)
        return this.http.get<any>(`${this._baseUrl}/api/asamblea/poder/${consecutivoAsamblea}`)
    }

}