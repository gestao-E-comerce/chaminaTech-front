import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { Mensagem } from '../../../models/mensagem';
import { Funcionario } from '../../../models/funcionario';
import { Caixa } from '../../../models/caixa';
import { CaixaService } from '../../../services/caixa.service';
import { LoginService } from '../../../services/login.service';
import { GlobalService } from '../../../services/global.service';

@Component({
  selector: 'app-fechar-caixa',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './fechar-caixa.component.html',
  styleUrl: './fechar-caixa.component.scss',
})
export class FecharCaixaComponent implements OnInit {
  @Output() retorno = new EventEmitter<Mensagem>();
  caixa: Caixa = new Caixa();
  funcionario: Funcionario = new Funcionario();

  caixaService = inject(CaixaService);
  loginService = inject(LoginService);
  globalService = inject(GlobalService);
  toastr = inject(ToastrService);

  ngOnInit() {
    this.funcionario.id = this.loginService.getUser().id;
    this.funcionario.nome = this.loginService.getUser().nome;

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
  }

  fechar() {
    this.caixa.funcionario = this.funcionario;
    this.caixa.nomeImpressora = this.getNomeImpressora();

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
