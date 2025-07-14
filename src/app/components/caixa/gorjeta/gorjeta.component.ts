import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Gorjeta } from '../../../models/gorjeta';
import { Funcionario } from '../../../models/funcionario';
import { ToastrService } from 'ngx-toastr';
import { GorjetaService } from '../../../services/gorjeta.service';
import { GlobalService } from '../../../services/global.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { take } from 'rxjs';
import { Matriz } from '../../../models/matriz';

@Component({
    selector: 'app-gorjeta',
    imports: [FormsModule],
    templateUrl: './gorjeta.component.html',
    styleUrl: './gorjeta.component.scss'
})
export class GorjetaComponent implements OnInit {
  @Output() retorno = new EventEmitter<any>();
  @Input() gorjeta: Gorjeta = new Gorjeta();
  funcionario: Funcionario = new Funcionario();
  matriz!: Matriz;

  toastr = inject(ToastrService);
  gorjetaService = inject(GorjetaService);
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
  confirmarGorjeta() {
    this.globalService.getCaixaAsync().subscribe({
      next: (caixa) => {
        if (caixa) {
          this.gorjeta.funcionario = this.funcionario;
          this.gorjeta.caixa = caixa;
          if (this.matriz.configuracaoImpressao.imprimirGorjeta) {
            this.gorjeta.nomeImpressora = this.getNomeImpressora();
          }
          this.gorjetaService.save(this.gorjeta).subscribe({
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
