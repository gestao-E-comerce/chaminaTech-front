import {
  Component,
  ElementRef,
  inject,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Caixa } from '../../../models/caixa';
import { CaixaService } from '../../../services/caixa.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { Usuario } from '../../../models/usuario';
import { GlobalService } from '../../../services/global.service';
import { Funcionario } from '../../../models/funcionario';
import { GestaoCaixaService } from '../../../services/gestao-caixa.service';

@Component({
  selector: 'app-abrir-caixa',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './abrir-caixa.component.html',
  styleUrl: './abrir-caixa.component.scss',
})
export class AbrirCaixaComponent implements OnInit {
  caixa: Caixa = new Caixa();
  @Input() usuario: Usuario = new Usuario();
  funsionario: Funcionario = new Funcionario();

  @ViewChild('valorAbertura', { static: false })
  valorAbertura!: ElementRef<HTMLInputElement>;

  globalService = inject(GlobalService);
  caixaService = inject(CaixaService);
  gestaoCaixaService = inject(GestaoCaixaService);
  modalService = inject(NgbModal);
  toastr = inject(ToastrService);
  router = inject(Router);
  modalRef!: NgbModalRef;
  ngOnInit() {
    this.funsionario.id = this.usuario.id;
    this.funsionario.nome = this.usuario.nome;
    setTimeout(() => {
      if (this.valorAbertura && this.valorAbertura.nativeElement) {
        this.valorAbertura.nativeElement.value = '0';
        this.caixa.valorAbertura = 0;
        this.valorAbertura.nativeElement.focus();
        this.valorAbertura.nativeElement.select();
      }
    }, 0);
  }
  abrir(modalConfermacao: any) {
    if (this.caixa.valorAbertura == null) {
      this.toastr.error('Valor abertura não deve estar vazio');
    } else {
      this.modalRef = this.modalService.open(modalConfermacao, { size: 'mm' });
    }
  }
  confirmarAbrir() {
    this.caixa.funcionario = this.funsionario;
    this.caixa.nomeImpressora = this.getNomeImpressora();

    this.caixaService.abrirCaixa(this.caixa).subscribe({
      next: (caixaSalvo) => {
        this.globalService.setCaixa(caixaSalvo);
        this.toastr.success('Caixa aberto com sucesso!');
        this.modalService.dismissAll();
        this.router.navigate(['/caixa/balcao']);
      },
      error: (erro) => {
        this.toastr.error('Erro ao abrir caixa: ' + erro.mensagem);
      },
    });
  }

  getNomeImpressora(): string | null {
    const valor = localStorage.getItem('identificador');
    if (!valor) return null;

    const partes = valor.split('/');
    return partes.length === 2 ? partes[0] : null;
  }

  zerarCupons() {
    this.gestaoCaixaService.zerarCupons().subscribe({
      next: (mensagem) => {
        this.toastr.success(mensagem.mensagem);
      },
      error: (erro) => {
        this.toastr.error(erro.error.mensagem);
      },
    });
  }
}
