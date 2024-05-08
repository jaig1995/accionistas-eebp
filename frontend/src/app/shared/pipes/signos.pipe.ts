import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
    name: 'insertarSignos',
    standalone: true,
})
export class SignosPipe implements PipeTransform {

    transform(value: unknown, ...args: unknown[]): unknown {
        return `¿ ${value} ?`;
    }

}
