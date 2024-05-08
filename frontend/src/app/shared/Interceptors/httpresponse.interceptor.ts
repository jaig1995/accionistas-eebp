// import { HttpErrorResponse, HttpEvent, HttpHandler, HttpHandlerFn, HttpRequest, HttpResponse } from '@angular/common/http';
// import { inject } from '@angular/core';

// import { catchError, Observable, tap, throwError } from 'rxjs';


// export const responseInterceptor = (request: HttpRequest<any>, next: HttpHandlerFn) =>{
//     return next(request).pipe(
//       tap((event: HttpEvent<any>) => {
//         if (event instanceof HttpResponse) {
//           // Manejar respuesta exitosa
//           console.log('Respuesta exitosa:', event);
//         }
//       }),
//       catchError((error: HttpErrorResponse) => {
//         // Manejar error
//         console.error('Hubo un Error:', error);
//         // Propagar el error al componente
//         return throwError(error);
//       })
//     );
//   }
