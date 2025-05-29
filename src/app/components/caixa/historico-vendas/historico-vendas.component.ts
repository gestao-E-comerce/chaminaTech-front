import { Component, inject, OnInit } from '@angular/core';
import { Venda } from '../../../models/venda';
import { VendaService } from '../../../services/venda.service';
import { GestaoCaixa } from '../../../models/gestao-caixa';
import { GestaoCaixaService } from '../../../services/gestao-caixa.service';
import { FormsModule } from '@angular/forms';
import { DatePipe, NgClass } from '@angular/common';
import { Observacoes } from '../../../models/observacoes';
import { Usuario } from '../../../models/usuario';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ImpressaoService } from '../../../services/impressao.service';
import { take } from 'rxjs';
import { GlobalService } from '../../../services/global.service';
import { Matriz } from '../../../models/matriz';

@Component({
  selector: 'app-historico-vendas',
  standalone: true,
  imports: [FormsModule, DatePipe, NgClass],
  templateUrl: './historico-vendas.component.html',
  styleUrl: './historico-vendas.component.scss',
})
export class HistoricoVendasComponent implements OnInit {
  listaCuponsOrginal: GestaoCaixa[] = [];
  listaCuponsFiltrada: GestaoCaixa[] = [];

  gestaoCaixaService = inject(GestaoCaixaService);
  impressaoService = inject(ImpressaoService);
  globalService = inject(GlobalService);
  vendaService = inject(VendaService);
  modalService = inject(NgbModal);
  toastr = inject(ToastrService);
  router = inject(Router);
  modalRef!: NgbModalRef;

  usuario: Usuario = new Usuario();
  venda: Venda = new Venda();
  matriz: Matriz = new Matriz();

  tituloModal!: string;
  termoPesquisa!: 0;
  active!: any;
  cupomSelecionado!: GestaoCaixa | null;
  filtroTipo: string = '';
  urlString!: string;
  motivoDeletar: string = '';
  menuAberto = true;

  ngOnInit() {
    this.urlString = this.router.url.split('/')[1] ?? '';

    this.listaCupons();

    this.globalService
      .getUsuarioAsync()
      .pipe(take(1))
      .subscribe({
        next: (usuario) => {
          this.usuario = usuario;
        },
      });
    this.globalService
      .getMatrizAsync()
      .pipe(take(1))
      .subscribe({
        next: (matriz) => {
          this.matriz = matriz;
        },
      });
  }

  listaCupons(tipo?: string, cupom?: number) {
    this.gestaoCaixaService.buscarCuponsHistorico(tipo, cupom).subscribe({
      next: (listaCupons) => {
        this.listaCuponsOrginal = listaCupons;
        this.listaCuponsFiltrada = listaCupons;
      },
    });
  }

  selecionarCupom(cupom: any) {
    this.cupomSelecionado = cupom;
    this.active = cupom;
  }

  pesquisarCupom(termo: number) {
    const tipoValido =
      this.filtroTipo.trim() !== '' ? this.filtroTipo : undefined;
    const cupom = termo > 0 ? termo : undefined;

    this.listaCupons(tipoValido, cupom);
  }
  filtrarPorTipo() {
    const tipoValido =
      this.filtroTipo.trim() !== '' ? this.filtroTipo : undefined;
    const cupom = this.termoPesquisa > 0 ? this.termoPesquisa : undefined;

    this.listaCupons(tipoValido, cupom);
  }

  getObservacoesFormatadas(produto: any): string {
    const observacoesLista =
      produto.observacoesProdutoVenda
        ?.map((o: Observacoes) => o.observacao)
        .join(', ') || '';
    const observacaoIndividual = produto.observacaoProdutoVenda
      ? (observacoesLista ? ', ' : '') + produto.observacaoProdutoVenda
      : '';
    return observacoesLista + observacaoIndividual;
  }

  deletarVenda(venda: Venda, modalDelatarVenda: any) {
    this.venda = Object.assign({}, venda);
    this.modalRef = this.modalService.open(modalDelatarVenda, { size: 'md' });
    this.tituloModal = 'Deleter Venda';
  }

  confirmarDeletarVenda() {
    if (this.motivoDeletar.trim() === '') {
      this.toastr.error('Motivo indefinido!!');
    } else {
      this.venda.imprimirCadastrar = false;
      this.venda.imprimirDeletar = false;
      this.venda.imprimirNotaFiscal = false;
      this.venda.deletado = true;
      this.venda.motivo = this.motivoDeletar;
      this.vendaService.deletar(this.venda).subscribe({
        next: (mensagem) => {
          this.toastr.success(mensagem.mensagem);
          this.motivoDeletar = '';
          this.modalRef.close();
          this.listaCupons();
          this.cupomSelecionado = null;
        },
      });
    }
  }
  abrirModalImpressao(venda: Venda, modalImpressao: any) {
    this.venda = Object.assign({}, venda);
    this.modalRef = this.modalService.open(modalImpressao, {
      size: 'md',
    });
    this.tituloModal = 'Impressao';
  }

  imprimirComprovante() {
    this.impressaoService.imprimirComprovante(this.venda).subscribe({
      next: (mensagem) => {
        this.toastr.success(mensagem.mensagem);
        this.modalRef.close();
      },
    });
  }
  imprimirNotaFiscal() {
    console.log('Nota Fiscal');
    // this.impressaoService.imprimirNotaFiscal(this.venda).subscribe({
    //   next: (mensagem) => {
    //     this.toastr.success(mensagem.mensagem);
    //     this.modalRef.close();
    //   },
    // });
  }
}
