import { Component, inject } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AbrirCaixaComponent } from '../caixa/abrir-caixa/abrir-caixa.component';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GlobalService } from '../../services/global.service';
import { Identificador } from '../../models/identificador';
import { take } from 'rxjs';
import { Matriz } from '../../models/matriz';
import { NgClass } from '@angular/common';
import { Usuario } from '../../models/usuario';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from '../../services/login.service';

@Component({
    selector: 'app-home',
    imports: [FormsModule, AbrirCaixaComponent, NgClass],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent {
  identificador: Identificador = new Identificador();
  tipoImpressora!: boolean;

  router = inject(Router);
  modalService = inject(NgbModal);
  globalService = inject(GlobalService);
  toastr = inject(ToastrService);
  loginService = inject(LoginService);

  matriz: Matriz = new Matriz();
  usuario: Usuario = new Usuario();

  tituloModal!: string;
  modalRef!: NgbModalRef;
  acao: string = '';

  ngOnInit() {
    this.globalService
      .getUsuarioAsync()
      .pipe(take(1))
      .subscribe({
        next: (usuario) => {
          this.usuario = usuario;
          if (this.usuario.role != 'ADMIN') {
            this.globalService
              .getMatrizAsync()
              .pipe(take(1))
              .subscribe({
                next: (matriz) => {
                  this.matriz = matriz;
                },
              });
          }
        },
      });
  }
  alternarTema(): void {
    const temaAtual = this.globalService.getTema();
    const novoTema = temaAtual === 'claro' ? 'escuro' : 'claro';
    this.globalService.setTema(novoTema);
  }

  verificarUsuario(modalAbrirCaixa: any) {
    if (this.acao === 'caixa') {
      if (this.usuario.permissao.caixa == true) {
        this.usuarioCaixa(modalAbrirCaixa);
      } else {
        this.toastr.error('Acesso negado pra este usuario!');
      }
    } else if (this.acao === 'lancarVenda') {
      if (this.usuario.permissao.venda == true) {
        this.router.navigate(['/venda/mesa']);
        this.modalService.dismissAll();
      } else {
        this.toastr.error('Acesso negado pra este usuario!');
      }
    } else if (this.acao === 'estoque') {
      if (this.usuario.permissao.estoque == true) {
        this.modalService.dismissAll();
        this.router.navigate(['/estoque']);
      } else {
        this.toastr.error('Acesso negado pra este usuario!');
      }
    } else if (this.acao === 'materia') {
      if (this.usuario.permissao.materia == true) {
        this.modalService.dismissAll();
        this.router.navigate(['/materia']);
      } else {
        this.toastr.error('Acesso negado pra este usuario!');
      }
    } else if (this.acao === 'produto') {
      if (this.usuario.permissao.produto == true) {
        this.modalService.dismissAll();
        this.router.navigate(['/produto']);
      } else {
        this.toastr.error('Acesso negado pra este usuario!');
      }
    } else if (this.acao === 'deposito') {
      if (this.usuario.permissao.deposito == true) {
        this.modalService.dismissAll();
        this.router.navigate(['/deposito']);
      } else {
        this.toastr.error('Acesso negado pra este usuario!');
      }
    } else if (this.acao === 'funcionario') {
      if (this.usuario.permissao.funcionario == true) {
        this.modalService.dismissAll();
        this.router.navigate(['/funcionario']);
      } else {
        this.toastr.error('Acesso negado pra este usuario!');
      }
    } else if (this.acao === 'cliente') {
      if (this.usuario.permissao.cliente == true) {
        this.modalService.dismissAll();
        this.router.navigate(['/cliente']);
      } else {
        this.toastr.error('Acesso negado pra este usuario!');
      }
    } else if (this.acao === 'config') {
      if (this.usuario.permissao.editarConfiguracoes == true) {
        this.modalService.dismissAll();
        this.router.navigate(['/config/perfil']);
      } else {
        this.toastr.error('Acesso negado pra este usuario!');
      }
    } else if (this.acao === 'historicos') {
      this.modalService.dismissAll();
      this.router.navigate(['/historicos']);
    } else if (this.acao === 'audit') {
      if (this.usuario.permissao.auditoria == true) {
        this.modalService.dismissAll();
        this.router.navigate(['/audit']);
      } else {
        this.toastr.error('Acesso negado pra este usuario!');
      }
    } else if (this.acao === 'relatorios') {
      if (this.usuario.permissao.relatorio == true) {
        this.modalService.dismissAll();
        this.router.navigate(['/relatorios']);
      } else {
        this.toastr.error('Acesso negado pra este usuario!');
      }
    }
  }
  verificarUsuarioAdmin() {
    if (this.acao === 'matriz') {
      this.router.navigate(['/matriz']);
      this.modalService.dismissAll();
    } else if (this.acao === 'funcionarios') {
      if (this.usuario.permissao.funcionario == true) {
        this.modalService.dismissAll();
        this.router.navigate(['/funcionarios']);
      } else {
        this.toastr.error('Acesso negado pra este usuario!');
      }
    } else if (this.acao === 'configadmin') {
      if (this.usuario.permissao.editarConfiguracoes == true) {
        this.modalService.dismissAll();
        this.router.navigate(['/conf']);
      } else {
        this.toastr.error('Acesso negado pra este usuario!');
      }
    }
  }

  usuarioCaixa(modalAbrirCaixa: any) {
    if (this.matriz.configuracaoImpressao.usarImpressora == true) {
      const identificadorLocal = localStorage.getItem('identificador');
      if (!identificadorLocal) {
        this.toastr.warning(
          'Trabalhar com Impressão está ativado, mas nenhuma impressora de caixa foi encontrada. Vá até a tela de Configuração e cadastre uma antes de abrir o caixa.'
        );
        return;
      }
    }
    this.globalService
      .getCaixaAsync()
      .pipe(take(1))
      .subscribe({
        next: (caixaAtivo) => {
          if (caixaAtivo) {
            this.router.navigate(['/caixa/balcao']);
          } else {
            this.usuario = Object.assign({}, this.usuario);
            this.modalService.open(modalAbrirCaixa, { size: 'mm' });
            this.tituloModal = 'Abrir Caixa';
          }
        },
      });
  }
}
