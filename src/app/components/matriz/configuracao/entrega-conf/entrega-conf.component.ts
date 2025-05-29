import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Matriz } from '../../../../models/matriz';
import { GlobalService } from '../../../../services/global.service';
import { take } from 'rxjs';
import { TaxaEntregaKm } from '../../../../models/taxaEntregaKm';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TaxaEntregaKmService } from '../../../../services/taxaEntregaKmService ';

@Component({
  selector: 'app-entrega-conf',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './entrega-conf.component.html',
  styleUrl: './entrega-conf.component.scss',
})
export class EntregaConfComponent implements OnInit {
  globalService = inject(GlobalService);
  taxaEntregaService = inject(TaxaEntregaKmService);
  toastr = inject(ToastrService);
  modalService = inject(NgbModal);

  matriz: Matriz = new Matriz();
  listaKmOrginal: TaxaEntregaKm[] = [];
  listaKm: TaxaEntregaKm[] = [];

  ngOnInit() {
    this.globalService
      .getMatrizAsync()
      .pipe(take(1))
      .subscribe({
        next: (matriz) => {
          this.matriz = matriz;
        },
      });

    this.listarTaxas();
  }

  listarTaxas() {
    this.taxaEntregaService.listarTaxasKm().subscribe({
      next: (lista) => {
        this.listaKmOrginal = lista.map((item) => ({ ...item }));
        this.listaKm =
          lista && lista.length > 0
            ? lista.map((item) => ({ ...item }))
            : [{ km: undefined, valor: undefined, tempo: undefined }];
      },
    });
  }

  adicionarCampo() {
    this.listaKm.push({ km: undefined, valor: undefined, tempo: undefined });
  }

  removerCampo(index: number) {
    this.listaKm.splice(index, 1);
  }

  isValidoParaSalvar(): boolean {
    const todosPreenchidos = this.listaKm.every((item, i) => {
      const valido =
        item.km !== undefined &&
        item.valor !== undefined &&
        item.tempo !== undefined;
      return valido;
    });
    return todosPreenchidos;
  }

  isModificado(): boolean {
    if (this.listaKm.length !== this.listaKmOrginal.length) {
      return true;
    }

    for (let i = 0; i < this.listaKm.length; i++) {
      const atual = this.listaKm[i];
      const original = this.listaKmOrginal[i];

      if (
        atual.km !== original.km ||
        atual.valor !== original.valor ||
        atual.tempo !== original.tempo
      ) {
        return true;
      }
    }

    return false;
  }

  salvar() {
    if (!this.isValidoParaSalvar()) {
      this.toastr.error('Preencha todos os campos obrigatórios!');
      return;
    }

    const kmDuplicado = this.temKmDuplicado();
    if (kmDuplicado !== null) {
      this.toastr.error(
        `Já existe um campo com KM ${kmDuplicado}. Remova ou altere para continuar.`
      );
      return;
    }

    if (!this.isModificado()) {
      return;
    }

    this.taxaEntregaService.salvarLista(this.listaKm, this.matriz).subscribe({
      next: (mensagem) => {
        this.toastr.success(mensagem.mensagem);
        this.modalService.dismissAll();
        this.globalService.limparMatrizSalva();
      },
      error: (erro) => {
        this.toastr.error(erro.error.mensagem);
      },
    });
  }
  temKmDuplicado(): number | null {
    const vistos = new Set<number>();

    for (let item of this.listaKm) {
      if (item.km === undefined) continue;

      if (vistos.has(item.km)) {
        return item.km; // retorna o valor duplicado
      }

      vistos.add(item.km);
    }

    return null; // sem duplicados
  }
}
