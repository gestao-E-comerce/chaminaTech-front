import { DatePipe, NgClass } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GestaoCaixa } from '../../../models/gestao-caixa';
import { GestaoCaixaService } from '../../../services/gestao-caixa.service';
import { ImpressaoService } from '../../../services/impressao.service';
import { GlobalService } from '../../../services/global.service';
import { VendaService } from '../../../services/venda.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterLink } from '@angular/router';
import { Usuario } from '../../../models/usuario';
import { Venda } from '../../../models/venda';
import { Matriz } from '../../../models/matriz';
import { take } from 'rxjs';
import { Observacoes } from '../../../models/observacoes';

@Component({
  selector: 'app-historico-venda',
  standalone: true,
  imports: [FormsModule, DatePipe, NgClass, RouterLink],
  templateUrl: './historico-venda.component.html',
  styleUrl: './historico-venda.component.scss',
})
export class HistoricoVendaComponent implements OnInit {
  @Input() modoModal: boolean = false;
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
    this.menuAberto = false;
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
    if (!this.motivoDeletar?.trim()) {
      this.toastr.error('Motivo indefinido!!');
      return;
    } else {
      this.venda.imprimirCadastrar = false;
      this.venda.imprimirDeletar = false;
      this.venda.imprimirNotaFiscal = false;
      this.venda.deletado = true;
      this.venda.motivoDeletar = this.motivoDeletar;
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
