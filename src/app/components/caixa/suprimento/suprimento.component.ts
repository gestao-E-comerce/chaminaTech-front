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

@Component({
  selector: 'app-suprimento',
  standalone: true,
  imports: [FormsModule, NgClass],
  templateUrl: './suprimento.component.html',
  styleUrl: './suprimento.component.scss',
})
export class SuprimentoComponent {
  @Output() retorno = new EventEmitter<any>();
  @Input() suprimento: Suprimento = new Suprimento();
  funcionario: Funcionario = new Funcionario();

  toastr = inject(ToastrService);
  suprimentoService = inject(SuprimentoService);
  loginService = inject(LoginService);
  globalService = inject(GlobalService);
  modalService = inject(NgbModal);

  modalRef!: NgbModalRef;

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
          const nomeImpressora = this.getNomeImpressora();
          this.funcionario.id = this.loginService.getUser().id;
          this.funcionario.nome = this.loginService.getUser().nome;
          this.suprimento.funcionario = this.funcionario;
          this.suprimento.caixa = caixa;
          this.suprimento.nomeImpressora = nomeImpressora;
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
