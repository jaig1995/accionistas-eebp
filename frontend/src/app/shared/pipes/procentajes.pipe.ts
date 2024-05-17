import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
    name: 'porcentajesQuorum',
    standalone: true,
})
export class PorcentajesPipe implements PipeTransform {

    transform(value: unknown, ...args: unknown[]): unknown {
        return ` ${value}%`;
    }

}
