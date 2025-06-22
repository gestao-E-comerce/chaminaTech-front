import {
  Component,
  inject,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfiguracaoEntregaService } from '../../../../services/configuracaoEntrega.service';
import { ConfiguracaoEntrega } from '../../../../models/configuracao-entrega';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TaxaEntregaKm } from '../../../../models/taxaEntregaKm';
import { GlobalService } from '../../../../services/global.service';
import { catchError, from, Observable, of, switchMap, take } from 'rxjs';

@Component({
  selector: 'app-configuracao-entrega',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './configuracao-entrega.component.html',
  styleUrl: './configuracao-entrega.component.scss',
})
export class ConfiguracaoEntregaComponent implements OnInit {
  @ViewChild('modalCancelar') modalCancelar!: TemplateRef<any>;
  confEntregaOriginal: ConfiguracaoEntrega = new ConfiguracaoEntrega();
  confEntrega: ConfiguracaoEntrega = new ConfiguracaoEntrega();

  confEntregaService = inject(ConfiguracaoEntregaService);
  globalService = inject(GlobalService);
  toastr = inject(ToastrService);
  modalService = inject(NgbModal);

  listaKmOrginal: TaxaEntregaKm[] = [];
  listaKm: TaxaEntregaKm[] = [];

  ngOnInit() {
    this.buscarConfiguracaoEntrega();
  }

  buscarConfiguracaoEntrega() {
    this.confEntregaService.buscarConfiguracaoEntrega().subscribe({
      next: (conf) => {
        this.confEntregaOriginal = JSON.parse(JSON.stringify(conf));
        this.confEntrega = JSON.parse(JSON.stringify(conf));
        this.listaKm =
          conf.taxasEntregaKm && conf.taxasEntregaKm.length > 0
            ? conf.taxasEntregaKm.map((item) => ({ ...item }))
            : [{ km: undefined, valor: undefined, tempo: undefined }];

        this.listaKmOrginal = this.listaKm.map((item) => ({ ...item }));
      },
    });
  }

  isModified(): boolean {
    return (
      JSON.stringify(this.confEntregaOriginal) !==
        JSON.stringify(this.confEntrega) ||
      JSON.stringify(this.listaKmOrginal) !== JSON.stringify(this.listaKm)
    );
  }
  adicionarCampo() {
    this.listaKm.push({ km: undefined, valor: undefined, tempo: undefined });
  }

  removerCampo(index: number) {
    this.listaKm.splice(index, 1);
  }

  isValidoParaSalvar(): boolean {
    const todosPreenchidos = this.listaKm.every((item, i) => {
      const valido =
        item.km !== undefined &&
        item.valor !== undefined &&
        item.tempo !== undefined;
      return valido;
    });
    return todosPreenchidos;
  }

  temKmDuplicado(): number | null {
    const vistos = new Set<number>();

    for (let item of this.listaKm) {
      if (item.km === undefined) continue;

      if (vistos.has(item.km)) {
        return item.km; // retorna o valor duplicado
      }

      vistos.add(item.km);
    }

    return null; // sem duplicados
  }

  salvar() {
    if (!this.isModified()) {
      console.log('TMC ta achando facil ehn kkk');
      return;
    }

    if (!this.isValidoParaSalvar()) {
      this.toastr.error('Preencha todos os campos obrigatórios!');
      return;
    }

    const kmDuplicado = this.temKmDuplicado();
    if (kmDuplicado !== null) {
      this.toastr.error(
        `Já existe um campo com KM ${kmDuplicado}. Remova ou altere para continuar.`
      );
      return;
    }

    this.confEntrega.taxasEntregaKm = this.listaKm;
    this.confEntregaService.salvar(this.confEntrega).subscribe({
      next: (mensagem) => {
        this.toastr.success(mensagem.mensagem);
        this.globalService.limparMatrizSalva();
        this.confEntregaOriginal = JSON.parse(JSON.stringify(this.confEntrega));
        this.listaKmOrginal = JSON.parse(JSON.stringify(this.listaKm));
        this.buscarConfiguracaoEntrega();
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
