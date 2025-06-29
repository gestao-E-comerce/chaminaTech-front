import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  inject,
  Input,
  OnInit,
  Output,
  ViewChild,
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
import { take } from 'rxjs';
import { GorjetaComponent } from './gorjeta/gorjeta.component';
import { HistoricoVendaComponent } from "../historicos/historico-venda/historico-venda.component";
import { HistoricoConsumoComponent } from "../historicos/historico-consumo/historico-consumo.component";

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
    GorjetaComponent,
    HistoricoVendaComponent,
    HistoricoConsumoComponent
],
  templateUrl: './caixa.component.html',
  styleUrl: './caixa.component.scss',
})
export class CaixaComponent implements OnInit {
  @Output() retorno = new EventEmitter<any>();
  @ViewChild('numeroVendaInput', { static: false })
  numeroVendaInput!: ElementRef<HTMLInputElement>;
  @Input() modoModal!: boolean;

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
      this.menuPrincipalAberto = false;
      this.globalService.setModoTouch(!this.modoTouch);
    }
  }

  abrirModalLiberarVenda(modal: any) {
    this.menuPrincipalAberto = false;
    this.tipoLiberacao = 'mesa'; // Reset ao abrir o modal
    this.numeroVenda = null;
    this.tituloModal = 'Liberar Venda';
    this.modalRef = this.modalService.open(modal, { size: 'md' });
    this.focoNumeroVenda();
  }
  abrirModalHistoricoVendas(modalHistoricoVendas: any) {
    this.menuPrincipalAberto = false;
    this.modoModal = true;
    this.modalRef = this.modalService.open(modalHistoricoVendas, {
      size: 'fullscreen',
    });
  }
  abrirModalHistoricoConsumos(modalHistoricoConsumos: any) {
    this.menuPrincipalAberto = false;
    this.modoModal = true;
    this.modalRef = this.modalService.open(modalHistoricoConsumos, {
      size: 'fullscreen',
    });
  }
  confirmarLiberacao() {
    if (
      this.numeroVenda === null ||
      this.numeroVenda === undefined ||
      isNaN(Number(this.numeroVenda))
    ) {
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
    this.menuPrincipalAberto = false;
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
    this.menuPrincipalAberto = false;
    this.modalRef = this.modalService.open(modalSangria, { size: 'md' });
    this.tituloModal = 'Sangria';
  }

  gorjeta(modalGorjeta: any) {
    this.menuPrincipalAberto = false;
    this.modalRef = this.modalService.open(modalGorjeta, { size: 'md' });
    this.tituloModal = 'Gorjeta';
  }
  suprimento(modalSuprimento: any) {
    this.menuPrincipalAberto = false;
    this.modalRef = this.modalService.open(modalSuprimento, { size: 'md' });
    this.tituloModal = 'Adicionar Troco';
  }

  focoNumeroVenda() {
    setTimeout(() => {
      if (this.numeroVendaInput && this.numeroVendaInput.nativeElement) {
        this.numeroVendaInput.nativeElement.focus();
        this.numeroVendaInput.nativeElement.value = '';
      }
    }, 0);
  }
}
