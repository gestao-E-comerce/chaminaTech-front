import {
  Component,
  inject,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfiguracaoRetirada } from '../../../../models/configuracao-retirada';
import { ConfiguracaoRetiradaService } from '../../../../services/configuracaoRetirada.service';
import { GlobalService } from '../../../../services/global.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgClass } from '@angular/common';
import { catchError, from, Observable, of, switchMap, take } from 'rxjs';

@Component({
  selector: 'app-configuracao-retirada',
  standalone: true,
  imports: [FormsModule, NgClass],
  templateUrl: './configuracao-retirada.component.html',
  styleUrl: './configuracao-retirada.component.scss',
})
export class ConfiguracaoRetiradaComponent implements OnInit {
  @ViewChild('modalCancelar') modalCancelar!: TemplateRef<any>;
  confRetiradaOriginal: ConfiguracaoRetirada = new ConfiguracaoRetirada();
  confRetirada: ConfiguracaoRetirada = new ConfiguracaoRetirada();

  confRetiradaService = inject(ConfiguracaoRetiradaService);
  globalService = inject(GlobalService);
  toastr = inject(ToastrService);
  modalService = inject(NgbModal);

  ngOnInit() {
    this.buscarConfiguracaoRetirada();
  }

  buscarConfiguracaoRetirada() {
    this.confRetiradaService.buscarConfiguracaoRetirada().subscribe({
      next: (conf) => {
        this.confRetiradaOriginal = JSON.parse(JSON.stringify(conf));
        this.confRetirada = JSON.parse(JSON.stringify(conf));
      },
    });
  }

  isModified(): boolean {
    return (
      JSON.stringify(this.confRetiradaOriginal) !==
      JSON.stringify(this.confRetirada)
    );
  }
  salvar() {
    if (!this.isModified()) {
      console.log('TMC ta achando facil ehn kkk');
      return;
    }

    if (!this.confRetirada.tempoEstimadoRetidara?.toString().trim()) {
      this.toastr.error('Tempo obrigatório!');
      return;
    }

    this.confRetiradaService.salvar(this.confRetirada).subscribe({
      next: (mensagem) => {
        this.toastr.success(mensagem.mensagem);
        this.globalService.limparMatrizSalva();
        this.confRetiradaOriginal = JSON.parse(
          JSON.stringify(this.confRetirada)
        );
      },
      error: (erro) => {
        this.toastr.error(
          'Erro ao salvar a configuração entrega: ' + erro.error.message
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
