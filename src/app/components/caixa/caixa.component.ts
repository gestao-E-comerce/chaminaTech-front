import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostListener,
  inject,
  OnInit,
  Output,
} from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { CaixaService } from '../../services/caixa.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Mensagem } from '../../models/mensagem';
import { FecharCaixaComponent } from './fechar-caixa/fechar-caixa.component';
import { NgClass } from '@angular/common';
import { Identificador } from '../../models/identificador';
import { GlobalService } from '../../services/global.service';
import { SangriaComponent } from './sangria/sangria.component';
import { SuprimentoComponent } from './suprimento/suprimento.component';
import { VendaService } from '../../services/venda.service';
import { Usuario } from '../../models/usuario';
import { HistoricoVendasComponent } from './historico-vendas/historico-vendas.component';
import { take } from 'rxjs';

@Component({
  selector: 'app-caixa',
  standalone: true,
  imports: [
    FormsModule,
    RouterOutlet,
    RouterLink,
    FecharCaixaComponent,
    NgClass,
    SangriaComponent,
    SuprimentoComponent,
    HistoricoVendasComponent,
  ],
  templateUrl: './caixa.component.html',
  styleUrl: './caixa.component.scss',
})
export class CaixaComponent implements OnInit {
  @Output() retorno = new EventEmitter<any>();

  identificador: Identificador = new Identificador();
  urlString!: string;
  usuario!: Usuario;

  globalService = inject(GlobalService);
  caixaService = inject(CaixaService);
  vendaService = inject(VendaService);
  modalService = inject(NgbModal);
  toastr = inject(ToastrService);
  router = inject(Router);
  cdr = inject(ChangeDetectorRef);

  modalRef!: NgbModalRef;
  tituloModal!: string;
  menuAberto = false;
  menuPrincipalAberto = false;
  tipoLiberacao: string = 'mesa';
  numeroVenda: number | null = null;
  modoTouch: boolean = false;
  podeMudarModo: boolean = true;

  @HostListener('window:resize', [])
  onResize() {
    this.podeMudarModo = window.innerWidth > 1024;
  }
  ngOnInit() {
    this.urlString = this.router.url.split('/')[1] ?? '';
    this.globalService.modoTouch$.subscribe((modo) => {
      this.modoTouch = modo;
      this.cdr.detectChanges();
    });

    this.podeMudarModo = window.innerWidth > 1024;

    this.globalService
      .getUsuarioAsync()
      .pipe(take(1))
      .subscribe({
        next: (usuario) => {
          this.usuario = usuario;
        },
      });
  }

  trocarModoTouch() {
    if (this.podeMudarModo) {
      this.globalService.setModoTouch(!this.modoTouch);
    }
  }

  abrirModalLiberarVenda(modal: any) {
    this.tipoLiberacao = 'mesa'; // Reset ao abrir o modal
    this.numeroVenda = null;
    this.tituloModal = 'Liberar Venda';
    this.modalRef = this.modalService.open(modal, { size: 'md' });
  }
  abrirModalHistoricoVendas(modalHistoricoVendas: any) {
    this.modalRef = this.modalService.open(modalHistoricoVendas, {
      size: 'fullscreen',
    });
  }
  confirmarLiberacao() {
    if (!this.numeroVenda) {
      this.toastr.error('Digite um número válido.');
      return;
    }

    if (!this.tipoLiberacao) {
      this.toastr.error('Selecione um tipo de venda.');
      return;
    }

    this.vendaService
      .liberarVendaPorNumero(this.numeroVenda, this.tipoLiberacao)
      .subscribe({
        next: (mensagem) => {
          this.toastr.success(mensagem.mensagem);
          this.modalRef.dismiss();
        },
        error: (erro) => {
          this.toastr.error(erro.error.mensagem);
        },
      });
  }

  abrirModalFechar(modalFecharCaixa: any) {
    this.modalService.dismissAll();
    this.modalRef = this.modalService.open(modalFecharCaixa, { size: 'mm' });
    this.tituloModal = 'Fechar Caixa';
  }

  fechar(modalFecharCaixa: any, modalConfermacao: any) {
    this.caixaService.verificarVendaAtiva().subscribe(
      (vendaAtiva) => {
        if (vendaAtiva) {
          this.modalRef = this.modalService.open(modalConfermacao, {
            size: 'mm',
          });
        } else {
          this.modalRef = this.modalService.open(modalFecharCaixa, {
            size: 'mm',
          });
          this.tituloModal = 'Fechar Caixa';
        }
      },
      (error) => {
        this.toastr.error('Erro ao verificar venda ativa');
      }
    );
  }

  fechamentoCaixa(mensagem: Mensagem) {
    this.modalService.dismissAll();
    this.retorno.emit('ok');
    this.router.navigate(['/home']);
  }
  sangria(modalSangria: any) {
    this.modalRef = this.modalService.open(modalSangria, { size: 'md' });
    this.tituloModal = 'Sangria';
  }

  suprimento(modalSuprimento: any) {
    this.modalRef = this.modalService.open(modalSuprimento, { size: 'md' });
    this.tituloModal = 'Adicionar Troco';
  }
}
