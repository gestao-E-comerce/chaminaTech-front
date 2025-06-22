import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Materia } from '../../../models/materia';
import { Mensagem } from '../../../models/mensagem';
import { MateriaService } from '../../../services/materia.service';
import { ToastrService } from 'ngx-toastr';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-materia-detalhes',
  standalone: true,
  imports: [FormsModule,NgClass],
  templateUrl: './materia-detalhes.component.html',
  styleUrl: './materia-detalhes.component.scss'
})
export class MateriaDetalhesComponent {
  @Input() materia: Materia = new Materia();
  @Output() retorno = new EventEmitter<Mensagem>;

  materiaService = inject(MateriaService);
  toastr = inject(ToastrService);

  salvar() {
    if (!this.materia.nome?.trim()) {
      this.toastr.error('Nome obrigatório!');
      return;
    } else {
      this.materiaService.save(this.materia).subscribe({
        next: mensagem => {
          this.toastr.success(mensagem.mensagem);
          this.retorno.emit(mensagem);
        },
        error: erro => {
          this.toastr.error(erro.error.mensagem);
        }
      });
    }
    }
}
