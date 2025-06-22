import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { ConfiguracaoTaxaServico } from '../../../../models/configuracao-taxa-servico';
import { ConfiguracaoTaxaServicoService } from '../../../../services/configuracaoTaxaServico.service';
import { GlobalService } from '../../../../services/global.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { catchError, from, Observable, of, switchMap, take } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-configuracao-taxa-servico',
  standalone: true,
  imports: [FormsModule, NgClass],
  templateUrl: './configuracao-taxa-servico.component.html',
  styleUrl: './configuracao-taxa-servico.component.scss',
})
export class ConfiguracaoTaxaServicoComponent {
  @ViewChild('modalCancelar') modalCancelar!: TemplateRef<any>;
  confTaxaServicoOriginal: ConfiguracaoTaxaServico =
    new ConfiguracaoTaxaServico();
  confTaxaServico: ConfiguracaoTaxaServico = new ConfiguracaoTaxaServico();

  confTaxaServicoService = inject(ConfiguracaoTaxaServicoService);
  globalService = inject(GlobalService);
  toastr = inject(ToastrService);
  modalService = inject(NgbModal);

  ngOnInit() {
    this.buscarConfiguracaoTaxaServico();
  }

  buscarConfiguracaoTaxaServico() {
    this.confTaxaServicoService.buscarConfiguracaoTaxaServicio().subscribe({
      next: (conf) => {
        this.confTaxaServicoOriginal = JSON.parse(JSON.stringify(conf));
        this.confTaxaServico = JSON.parse(JSON.stringify(conf));
      },
    });
  }

  isModified(): boolean {
    return (
      JSON.stringify(this.confTaxaServicoOriginal) !==
      JSON.stringify(this.confTaxaServico)
    );
  }
  salvar() {
    if (!this.isModified()) {
      console.log('TMC ta achando facil ehn kkk');
      return;
    }

    if (this.confTaxaServico.aplicar) {
      if (!this.confTaxaServico.tipo?.trim()) {
        this.toastr.error('Tipo da taxa obrigatório!');
        return;
      }
      if (
        this.confTaxaServico.tipo == 'PERCENTUAL' &&
        !this.confTaxaServico.percentual.toString().trim()
      ) {
        this.toastr.error('Valor taxa obrigatório!');
        return;
      }

      if (
        this.confTaxaServico.tipo == 'FIXO' &&
        !this.confTaxaServico.valorFixo.toString().trim()
      ) {
        this.toastr.error('Valor taxa obrigatório!');
        return;
      }
    }

    this.confTaxaServicoService.salvar(this.confTaxaServico).subscribe({
      next: (mensagem) => {
        this.toastr.success(mensagem.mensagem);
        this.globalService.limparMatrizSalva();
        this.confTaxaServicoOriginal = JSON.parse(
          JSON.stringify(this.confTaxaServico)
        );
      },
      error: (erro) => {
        this.toastr.error(
          'Erro ao salvar a configuração taxa de serviço: ' + erro.error.message
        );
      },
    });
  }
  cancelar(): Observable<boolean> {
    if (this.isModified()) {
      return from(
        this.modalService.open(this.modalCancelar, {
          size: 'md',
          backdrop: 'static',
          keyboard: false,
        }).result
      ).pipe(
        take(1),
        switchMap((result) => of(result === 'confirmado')),
        catchError(() => of(false))
      );
    }

    return of(true);
  }
}
