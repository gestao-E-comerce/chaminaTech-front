import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { Suprimento } from '../../../models/suprimento';
import { Funcionario } from '../../../models/funcionario';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { LoginService } from '../../../services/login.service';
import { SuprimentoService } from '../../../services/suprimento.service';
import { GlobalService } from '../../../services/global.service';
import { take } from 'rxjs';
import { Matriz } from '../../../models/matriz';

@Component({
    selector: 'app-suprimento',
    imports: [FormsModule, NgClass],
    templateUrl: './suprimento.component.html',
    styleUrl: './suprimento.component.scss'
})
export class SuprimentoComponent implements OnInit {
  @Output() retorno = new EventEmitter<any>();
  @Input() suprimento: Suprimento = new Suprimento();
  funcionario: Funcionario = new Funcionario();
  matriz!: Matriz;

  toastr = inject(ToastrService);
  suprimentoService = inject(SuprimentoService);
  loginService = inject(LoginService);
  globalService = inject(GlobalService);
  modalService = inject(NgbModal);

  modalRef!: NgbModalRef;

  ngOnInit() {
    this.globalService
      .getFuncionarioAsync()
      .pipe(take(1))
      .subscribe({
        next: (funcionario) => {
          this.funcionario = funcionario;
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

  salvar(modalConfermacao: any, formulario: any) {
    if (!formulario.valid) {
      this.toastr.error('Formulário inválido. Preencha os campos corretamente');
      Object.keys(formulario.controls).forEach((campo) => {
        formulario.controls[campo].markAsTouched();
      });
    } else {
      this.modalRef = this.modalService.open(modalConfermacao, { size: 'mm' });
    }
  }
  confirmarSuprimento() {
    this.globalService.getCaixaAsync().subscribe({
      next: (caixa) => {
        if (caixa) {
          this.suprimento.funcionario = this.funcionario;
          this.suprimento.caixa = caixa;
          if (this.matriz.configuracaoImpressao.imprimirSuprimento) {
            this.suprimento.nomeImpressora = this.getNomeImpressora();
          }
          this.suprimentoService.save(this.suprimento).subscribe({
            next: (mensagem) => {
              this.toastr.success(mensagem.mensagem);
              this.modalService.dismissAll();
              this.retorno.emit('ok');
            },
            error: (erro) => {
              this.toastr.error(erro.error.mensagem);
              this.modalRef.close();
            },
          });
        }
      },
      error: () => {
        this.toastr.error('Caixa não está definido.');
      },
    });
  }
  getNomeImpressora(): string | null {
    const valor = localStorage.getItem('identificador');
    if (!valor) return null;

    const partes = valor.split('/');
    return partes.length === 2 ? partes[0] : null;
  }
}
