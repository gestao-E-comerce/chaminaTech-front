import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { Mensagem } from '../../../models/mensagem';
import { Funcionario } from '../../../models/funcionario';
import { Caixa } from '../../../models/caixa';
import { CaixaService } from '../../../services/caixa.service';
import { LoginService } from '../../../services/login.service';
import { GlobalService } from '../../../services/global.service';
import { take } from 'rxjs';
import { Matriz } from '../../../models/matriz';

@Component({
    selector: 'app-fechar-caixa',
    imports: [FormsModule],
    templateUrl: './fechar-caixa.component.html',
    styleUrl: './fechar-caixa.component.scss'
})
export class FecharCaixaComponent implements OnInit {
  @Output() retorno = new EventEmitter<Mensagem>();
  caixa: Caixa = new Caixa();
  funcionario: Funcionario = new Funcionario();
  matriz!: Matriz;

  caixaService = inject(CaixaService);
  globalService = inject(GlobalService);
  toastr = inject(ToastrService);

  ngOnInit() {
    this.globalService
      .getFuncionarioAsync()
      .pipe(take(1))
      .subscribe({
        next: (funcionario) => {
          this.funcionario = funcionario;
        },
      });

    this.globalService.getCaixaAsync().subscribe({
      next: (caixa) => {
        if (caixa) {
          this.caixa = caixa;
        }
      },
      error: () => {
        this.toastr.error('Erro ao buscar o caixa.');
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

  fechar() {
    this.caixa.funcionario = this.funcionario;
    if (this.matriz.configuracaoImpressao.imprimirConferenciaCaixa) {
      this.caixa.nomeImpressora = this.getNomeImpressora();
    }

    this.caixaService.fecharCaixa(this.caixa).subscribe({
      next: (mensagem) => {
        this.toastr.success(mensagem.mensagem);
        this.retorno.emit(mensagem);
        this.globalService.limparCaixaSalva();
      },
      error: (erro) => {
        this.toastr.error(erro.error.mensagem);
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
