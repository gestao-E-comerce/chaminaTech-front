import { CurrencyPipe, DatePipe, NgClass } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SangriaComponent } from '../../caixa/sangria/sangria.component';
import { SuprimentoComponent } from '../../caixa/suprimento/suprimento.component';
import { Router, RouterLink } from '@angular/router';
import { GorjetaComponent } from '../../caixa/gorjeta/gorjeta.component';
import { Caixa } from '../../../models/caixa';
import { CaixaService } from '../../../services/caixa.service';
import { SangriaService } from '../../../services/sangria.service';
import { SuprimentoService } from '../../../services/suprimento.service';
import { GorjetaService } from '../../../services/gorjeta.service';
import { ImpressaoService } from '../../../services/impressao.service';
import { GlobalService } from '../../../services/global.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Usuario } from '../../../models/usuario';
import { Sangria } from '../../../models/sangria';
import { Suprimento } from '../../../models/suprimento';
import { Gorjeta } from '../../../models/gorjeta';
import { Matriz } from '../../../models/matriz';
import { forkJoin, take } from 'rxjs';

@Component({
  selector: 'app-historico-caixa',
  imports: [
    FormsModule,
    DatePipe,
    NgClass,
    SangriaComponent,
    SuprimentoComponent,
    RouterLink,
    GorjetaComponent,
    CurrencyPipe
  ],
  templateUrl: './historico-caixa.component.html',
  styleUrl: './historico-caixa.component.scss',
})
export class HistoricoCaixaComponent implements OnInit {
  listaCaixasOrginal: Caixa[] = [];
  listaCaixasFiltrada: Caixa[] = [];

  caixaService = inject(CaixaService);
  sangriaService = inject(SangriaService);
  suprimentoService = inject(SuprimentoService);
  gorjetaService = inject(GorjetaService);
  impressaoService = inject(ImpressaoService);
  globalService = inject(GlobalService);
  modalService = inject(NgbModal);
  toastr = inject(ToastrService);
  router = inject(Router);
  modalRef!: NgbModalRef;

  usuario!: Usuario;
  sangria!: Sangria;
  suprimento!: Suprimento;
  gorjeta!: Gorjeta;
  caixa!: Caixa;
  matriz!: Matriz;

  indice!: number;
  tituloModal!: string;
  nomeFuncionario: string = '';
  active!: any;
  caixaSelecionado!: Caixa | null;
  filtroTipo: string | null = null;
  motivoDeletar: string = '';
  saldo: number = 0;
  saldoDinheiro: number = 0;
  saldoCredito: number = 0;
  saldoDebito: number = 0;
  saldoPix: number = 0;
  saldoSangrias: number = 0;
  saldoSuprimentos: number = 0;
  saldoGorjetas: number = 0;
  saldoDescontos: number = 0;
  saldoServicos: number = 0;
  idCaixaSelecionado!: number | null;
  deletar!: number;
  menuAberto = true;

  ngOnInit() {
    this.listaCaixas();

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
  atualizar() {
    this.idCaixaSelecionado = this.caixaSelecionado
      ? this.caixaSelecionado.id
      : null;

    this.listaCaixas();
    this.deletar = 4;
  }

  listaCaixas(nome?: string, tipo?: string) {
    this.caixaService.listarCaixas(nome, tipo).subscribe({
      next: (listaCaixas) => {
        this.listaCaixasOrginal = listaCaixas;
        this.listaCaixasFiltrada = listaCaixas;

        if (this.idCaixaSelecionado != null) {
          const caixasMapa: { [id: number]: Caixa } = {};
          listaCaixas.forEach((caixa) => {
            caixasMapa[caixa.id] = caixa;
          });
          const caixaSelecionadoAtualizado =
            caixasMapa[this.idCaixaSelecionado];
          if (caixaSelecionadoAtualizado) {
            this.selecionarCaixa(caixaSelecionadoAtualizado);
          }
        }
      },
    });
  }

  selecionarCaixa(caixa: any) {
    this.caixaSelecionado = caixa;
    this.active = caixa;
    this.menuAberto = false;

    if (caixa.vendas) {
      caixa.vendas = caixa.vendas.filter((v: any) => !v.deletado);
    }
    if (caixa.sangrias) {
      caixa.sangrias = caixa.sangrias.filter((v: any) => v.ativo);
    }
    if (caixa.suprimentos) {
      caixa.suprimentos = caixa.suprimentos.filter((v: any) => v.ativo);
    }
    if (caixa.gorjetas) {
      caixa.gorjetas = caixa.gorjetas.filter((v: any) => v.ativo);
    }

    this.defenirSaldos(caixa);
  }

  pesquisarCaixa(nomeFuncionario: string) {
    let trimmedNomeFuncionario = nomeFuncionario.trim();
    trimmedNomeFuncionario = trimmedNomeFuncionario.toLocaleUpperCase();
    const tipo =
      this.filtroTipo && this.filtroTipo.trim() !== ''
        ? this.filtroTipo
        : undefined;

    if (trimmedNomeFuncionario) {
      this.listaCaixas(trimmedNomeFuncionario, tipo);
    } else {
      this.listaCaixas(trimmedNomeFuncionario, tipo);
    }
    this.caixaSelecionado = null;
  }

  filtrarPorTipo() {
    const tipoValido =
      this.filtroTipo && this.filtroTipo.trim() !== ''
        ? this.filtroTipo
        : undefined;
    const trimmedNomeFuncionario =
      this.nomeFuncionario.trim() !== '' ? this.nomeFuncionario : undefined;

    this.listaCaixas(trimmedNomeFuncionario, tipoValido);
    this.caixaSelecionado = null;
  }

  editarCaixa(modalCaixa: any) {
    if (this.caixaSelecionado != null) {
      this.caixa = this.caixaSelecionado;
    }
    this.modalRef = this.modalService.open(modalCaixa, { size: 'md' });
    this.tituloModal = 'Editar Caixa';
  }

  salvarCaixa() {
    this.caixaService.editar(this.caixa).subscribe({
      next: (mensagem) => {
        this.toastr.success(mensagem.mensagem);
        this.modalRef.close();
        this.atualizar();
      },
    });
  }

  deletarCaixa(modalDelatarCaixa: any) {
    this.deletar = 2;
    this.modalRef = this.modalService.open(modalDelatarCaixa, {
      size: 'md',
    });
    this.tituloModal = 'Deleter Suprimento';
  }

  confirmarDeletarCaixa() {
    if (this.caixaSelecionado != null) {
      const caixa = this.caixaSelecionado;
      this.caixaService.deletar(caixa.id).subscribe({
        next: (mensagem) => {
          this.toastr.success(mensagem.mensagem);
          this.modalRef.close();
          this.listaCaixas();
          this.caixaSelecionado = null;
        },
      });
    }
  }

  editarSangria(modalSangria: any, sangria: Sangria, indice: number) {
    if (this.caixaSelecionado != null) {
      this.caixa = this.caixaSelecionado;
    }
    this.sangria = Object.assign({}, sangria);
    this.indice = indice;

    this.modalRef = this.modalService.open(modalSangria, { size: 'md' });
    this.tituloModal = 'Editar Sangria';
  }

  deletarSangria(modalDelatarSangria: any, sangria: Sangria) {
    if (this.caixaSelecionado != null) {
      this.caixa = this.caixaSelecionado;
    }
    this.sangria = Object.assign({}, sangria);
    this.deletar = 0;
    this.modalRef = this.modalService.open(modalDelatarSangria, { size: 'md' });
    this.tituloModal = 'Deleter Sangria';
  }

  confirmarDeletar() {
    if (this.deletar == 0) {
      this.confirmarDeletarSangria();
    } else if (this.deletar == 1) {
      this.confirmarDeletarSuprimento();
    } else if (this.deletar == 2) {
      this.confirmarDeletarCaixa();
    } else if (this.deletar === 3) {
      this.confirmarDeletarGorjeta();
    }
  }

  confirmarDeletarSangria() {
    this.sangriaService.deletar(this.sangria.id).subscribe({
      next: (mensagem) => {
        this.toastr.success(mensagem.mensagem);
        this.modalRef.close();
        this.atualizar();
      },
    });
  }

  editarSuprimento(
    modalSuprimento: any,
    suprimento: Suprimento,
    indice: number
  ) {
    if (this.caixaSelecionado != null) {
      this.caixa = this.caixaSelecionado;
    }
    this.suprimento = Object.assign({}, suprimento);
    this.indice = indice;

    this.modalRef = this.modalService.open(modalSuprimento, { size: 'md' });
    this.tituloModal = 'Editar Suprimento';
  }

  deletarSuprimento(modalDelatarSuprimento: any, suprimento: Suprimento) {
    if (this.caixaSelecionado != null) {
      this.caixa = this.caixaSelecionado;
    }
    this.suprimento = Object.assign({}, suprimento);
    this.deletar = 1;
    this.modalRef = this.modalService.open(modalDelatarSuprimento, {
      size: 'md',
    });
    this.tituloModal = 'Deleter Suprimento';
  }

  confirmarDeletarSuprimento() {
    this.suprimentoService.deletar(this.suprimento.id).subscribe({
      next: (mensagem) => {
        this.toastr.success(mensagem.mensagem);
        this.modalRef.close();
        this.atualizar();
      },
    });
  }
  editarGorjeta(modalGorjeta: any, gorjeta: Gorjeta, indice: number) {
    if (this.caixaSelecionado != null) {
      this.caixa = this.caixaSelecionado;
    }
    this.gorjeta = Object.assign({}, gorjeta);
    this.indice = indice;

    this.modalRef = this.modalService.open(modalGorjeta, { size: 'md' });
    this.tituloModal = 'Editar Gorjeta';
  }

  deletarGorjeta(modalDelatarGorjeta: any, gorjeta: Gorjeta) {
    if (this.caixaSelecionado != null) {
      this.caixa = this.caixaSelecionado;
    }
    this.gorjeta = Object.assign({}, gorjeta);
    this.deletar = 3;
    this.modalRef = this.modalService.open(modalDelatarGorjeta, {
      size: 'md',
    });
    this.tituloModal = 'Deletar Gorjeta';
  }
  confirmarDeletarGorjeta() {
    this.gorjetaService.deletar(this.gorjeta.id).subscribe({
      next: (mensagem) => {
        this.toastr.success(mensagem.mensagem);
        this.modalRef.close();
        this.atualizar();
      },
    });
  }
  abrirModalImpressao(modalImpressao: any) {
    this.modalRef = this.modalService.open(modalImpressao, {
      size: 'md',
    });
    this.tituloModal = 'Impressao';
  }

  imprimirGorjeta(gorjeta: Gorjeta) {
    gorjeta.nomeImpressora = this.getNomeImpressora();
    this.impressaoService.imprimirGorjeta(gorjeta).subscribe({
      next: (mensagem) => {
        this.toastr.success(mensagem.mensagem);
      },
    });
  }
  imprimirSangria(sangria: Sangria) {
    sangria.nomeImpressora = this.getNomeImpressora();
    this.impressaoService.imprimirSangria(sangria).subscribe({
      next: (mensagem) => {
        this.toastr.success(mensagem.mensagem);
      },
    });
  }
  imprimirSuprimento(suprimento: Suprimento) {
    suprimento.nomeImpressora = this.getNomeImpressora();
    this.impressaoService.imprimirSuprimento(suprimento).subscribe({
      next: (mensagem) => {
        this.toastr.success(mensagem.mensagem);
      },
    });
  }
  imprimirAbertura(caixa: Caixa) {
    if (this.caixaSelecionado != null) {
      caixa = this.caixaSelecionado;
      caixa.nomeImpressora = this.getNomeImpressora();
      this.impressaoService.imprimirAbertura(caixa).subscribe({
        next: (mensagem) => {
          this.toastr.success(mensagem.mensagem);
          this.modalRef.close();
        },
      });
    }
  }
  imprimirConferenciaCaixa(caixa: Caixa) {
    if (this.caixaSelecionado != null) {
      caixa = this.caixaSelecionado;
      caixa.nomeImpressora = this.getNomeImpressora();
      this.impressaoService.imprimirConferenciaCaixa(caixa).subscribe({
        next: (mensagem) => {
          this.toastr.success(mensagem.mensagem);
          this.modalRef.close();
        },
      });
    }
  }
  getNomeImpressora(): string | null {
    const valor = localStorage.getItem('identificador');
    if (!valor) return null;

    const partes = valor.split('/');
    return partes.length === 2 ? partes[0] : null;
  }

  defenirSaldos(caixa: any) {
    this.saldoDinheiro = 0;
    this.saldoCredito = 0;
    this.saldoDebito = 0;
    this.saldoPix = 0;
    this.saldoSangrias = 0;
    this.saldoSuprimentos = 0;
    this.saldoGorjetas = 0;
    this.saldoDescontos = 0;
    this.saldoServicos = 0;

    forkJoin({
      dinheiro: this.caixaService.getTotalDinheiroByCaixaId(caixa.id),
      credito: this.caixaService.getTotalCreditoByCaixaId(caixa.id),
      debito: this.caixaService.getTotalDebitoByCaixaId(caixa.id),
      pix: this.caixaService.getTotalPixByCaixaId(caixa.id),
      sangrias: this.caixaService.getTotalSangriasByCaixaId(caixa.id),
      suprimentos: this.caixaService.getTotalSuprimentosByCaixaId(caixa.id),
      gorjetas: this.caixaService.getTotalGorjetasByCaixaId(caixa.id),
      descontos: this.caixaService.getTotalDescontosByCaixaId(caixa.id),
      servicos: this.caixaService.getTotalServicosByCaixaId(caixa.id),
    }).subscribe({
      next: (results) => {
        this.saldoDinheiro = results.dinheiro || 0;
        this.saldoCredito = results.credito || 0;
        this.saldoDebito = results.debito || 0;
        this.saldoPix = results.pix || 0;
        this.saldoSangrias = results.sangrias || 0;
        this.saldoSuprimentos = results.suprimentos || 0;
        this.saldoGorjetas = results.gorjetas || 0;
        this.saldoDescontos = results.descontos || 0;
        this.saldoServicos = results.servicos || 0;

        this.calcularSaldoTotal();
      },
      error: (err) => {
        console.error('Erro ao buscar saldos:', err);
      },
    });
  }

  calcularSaldoTotal() {
    this.saldo =
      this.saldoDinheiro +
      this.saldoCredito +
      this.saldoPix +
      this.saldoDebito +
      this.saldoSuprimentos +
      this.saldoGorjetas +
      (this.caixaSelecionado ? this.caixaSelecionado.valorAbertura : 0);
  }
}
