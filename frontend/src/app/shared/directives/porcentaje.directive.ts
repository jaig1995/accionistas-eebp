import { Directive, ElementRef, Input,} from '@angular/core';
import { NgModel } from '@angular/forms';

@Directive({
  selector: '[porcentaje]',
  standalone: true,
})
export class PorcentajeDirective {
    @Input() porcentajes: string;

    constructor(private el: ElementRef, private ngModel: NgModel) { }

    ngAfterViewInit() {
        this.ngModel.valueChanges.subscribe((valorActual: any) => {
          const esPorcentaje = typeof valorActual === 'string' && valorActual.includes('%');
          let valorVisual = esPorcentaje ? valorActual : valorActual + '%';
          this.el.nativeElement.value = valorVisual;
        });
      }
}
