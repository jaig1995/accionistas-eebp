// import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { BehaviorSubject } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class HttpResponseService {

//     private respuestaExitosaSubject = new BehaviorSubject<HttpResponse<any> | null>(null);
//     respuestaExitosa$ = this.respuestaExitosaSubject.asObservable();

//     private errorSubject = new BehaviorSubject<HttpErrorResponse | null>(null);
//     error$ = this.errorSubject.asObservable();

//     emitirRespuestaExitosa(respuesta: HttpResponse<any>) {
//       this.respuestaExitosaSubject.next(respuesta);
//     }

//     emitirError(error: HttpErrorResponse) {
//         console.log("++++++++++>>>>>>>______")
//       this.errorSubject.next(error);
//     }

// }
