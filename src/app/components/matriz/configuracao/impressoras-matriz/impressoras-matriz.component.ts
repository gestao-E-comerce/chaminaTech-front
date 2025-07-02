import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { Impressora } from '../../../../models/impressora';
import { Identificador } from '../../../../models/identificador';

@Component({
    selector: 'app-impressoras-matriz',
    imports: [FormsModule],
    templateUrl: './impressoras-matriz.component.html',
    styleUrl: './impressoras-matriz.component.scss'
})
export class ImpressorasMatrizComponent {
  @Output() retornoImpressora = new EventEmitter<Impressora>();
  @Output() retornoIdentificador = new EventEmitter<Identificador>();
  @Input() tipoImpressoa: Boolean = false;
  @Input() impressora: Impressora = new Impressora();
  @Input() identificador: Identificador = new Identificador();

  toastr = inject(ToastrService);

  listaImpressoras: String[] = [];
  
  salvar() {
    if (this.tipoImpressoa === false) {
      if (!this.impressora.apelidoImpressora?.trim()) {
        this.toastr.error('Apelido da impressora indefinido!!');
        return;
      }
      if (!this.impressora.nomeImpressora?.trim()) {
        this.toastr.error('Nome da impressora indefinido!!');
        return;
      }
      if (
        this.impressora.apelidoImpressora.includes('/') ||
        this.impressora.nomeImpressora.includes('/')
      ) {
        this.toastr.error(
          'Não é permitido usar "/" no nome ou apelido da impressora.'
        );
        return;
      }

      this.impressora.apelidoImpressora = this.impressora.apelidoImpressora
        .trim()
        .toUpperCase();

      this.retornoImpressora.emit(this.impressora);
      this.toastr.success('Impressora de produto adicionada com sucesso');
    } else {
      if (!this.identificador.identificadorNome?.trim()) {
        this.toastr.error('Apelido do caixa indefinido!!');
        return;
      }
      if (!this.identificador.impressoraNome?.trim()) {
        this.toastr.error('Nome da impressora indefinido!!');
        return;
      }
      if (
        this.identificador.identificadorNome.includes('/') ||
        this.identificador.impressoraNome.includes('/')
      ) {
        this.toastr.error(
          'Não é permitido usar "/" no nome ou apelido da impressora de caixa.'
        );
        return;
      }

      this.identificador.identificadorNome =
        this.identificador.identificadorNome.trim().toUpperCase();

      this.retornoIdentificador.emit(this.identificador);
      this.toastr.success('Impressora de caixa adicionada com sucesso');
    }
  }
}
