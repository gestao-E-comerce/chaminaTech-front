import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Relatorio } from '../../models/relatorio';
import { RelatorioService } from '../../services/relatorio.service';
import { GlobalService } from '../../services/global.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Usuario } from '../../models/usuario';
import { Matriz } from '../../models/matriz';
import { take } from 'rxjs';
import { Mensagem } from '../../models/mensagem';
import { Funcionario } from '../../models/funcionario';
import { FuncionarioService } from '../../services/funcionario.service';

@Component({
  selector: 'app-relatorio',
  standalone: true,
  imports: [FormsModule, NgClass, RouterLink],
  templateUrl: './relatorio.component.html',
  styleUrl: './relatorio.component.scss',
})
export class RelatorioComponent {
  listaRelatoriosOrginal: Relatorio[] = [];

  funcionarioService = inject(FuncionarioService);
  relatorioService = inject(RelatorioService);
  globalService = inject(GlobalService);
  modalService = inject(NgbModal);
  toastr = inject(ToastrService);
  router = inject(Router);
  modalRef!: NgbModalRef;

  usuario: Usuario = new Usuario();
  matriz: Matriz = new Matriz();
  relatorio: Relatorio = new Relatorio();
  funcionarios: Funcionario[] = [];

  tituloModal!: string;
  active!: any;
  relatorioSelecionado!: Relatorio | null;
  urlString!: string;
  menuAberto = false;
  indice!: number;

  ngOnInit() {
    this.urlString = this.router.url.split('/')[1] ?? '';

    this.listaRelatorios();

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
          this.funcionarioService.listarFuncionarios().subscribe({
            next: (lista) => {
              this.funcionarios = lista || [];
            },
            error: () => {
              this.toastr.error('Erro ao filtrar funcionarios.');
            },
          });
        },
      });
  }

  alternarTipoVenda(tipo: string) {
    if (!this.relatorio.tiposVenda) {
      this.relatorio.tiposVenda = [];
    }

    const index = this.relatorio.tiposVenda.indexOf(tipo);
    if (index > -1) {
      this.relatorio.tiposVenda.splice(index, 1);
    } else {
      this.relatorio.tiposVenda.push(tipo);
    }
  }

  alternarTipoPagamento(forma: string) {
    if (!this.relatorio.formasPagamento) {
      this.relatorio.formasPagamento = [];
    }

    const index = this.relatorio.formasPagamento.indexOf(forma);
    if (index > -1) {
      this.relatorio.formasPagamento.splice(index, 1);
    } else {
      this.relatorio.formasPagamento.push(forma);
    }
  }

  atualizarListaRelatorio(menssagem: Mensagem) {
    this.modalService.dismissAll();
    this.listaRelatorios();
    this.relatorioSelecionado = null;
  }

  deletarRelatorio(modal: any, relatorio: Relatorio, indice: number) {
    this.relatorio = Object.assign({}, relatorio);
    this.indice = indice;

    this.modalService.open(modal, { size: 'sm' });
    this.tituloModal = 'Deletar Relatório';
  }

  confirmarDeletarRelatorio(relatorio: Relatorio) {
    this.relatorioService.deletar(relatorio.id).subscribe({
      next: (mensagem: Mensagem) => {
        this.toastr.success(mensagem.mensagem);
        this.atualizarListaRelatorio(mensagem);
        this.modalService.dismissAll();
      },
      error: (erro) => {
        this.toastr.error(erro.error.mensagem);
      },
    });
  }

  listaRelatorios() {
    this.relatorioService.listarRelatorios().subscribe({
      next: (listaRelatorios) => {
        this.listaRelatoriosOrginal = listaRelatorios;
      },
    });
  }

  selecionarRelatorio(cupom: any) {
    this.relatorioSelecionado = cupom;
    this.active = cupom;
    this.menuAberto = false;
  }
  aplicarRelatorio() {
    console.log('Relatorio:', this.relatorio);
  }
}
