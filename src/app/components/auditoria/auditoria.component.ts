import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { GlobalService } from '../../services/global.service';
import { AuditoriaService } from '../../services/auditoria.service';
import { ToastrService } from 'ngx-toastr';
import { Auditoria } from '../../models/auditoria';
import { Funcionario } from '../../models/funcionario';
import { DatePipe } from '@angular/common';
import { NgxMaskDirective } from 'ngx-mask';
import { Usuario } from '../../models/usuario';
import { take } from 'rxjs';

@Component({
  selector: 'app-auditoria',
  standalone: true,
  imports: [FormsModule, RouterLink, DatePipe, NgxMaskDirective],
  templateUrl: './auditoria.component.html',
  styleUrl: './auditoria.component.scss',
})
export class AuditoriaComponent {
  listaAuditorias: Auditoria[] = [];
  usuarioLogado!: Usuario;

  globalService = inject(GlobalService);
  auditoriaService = inject(AuditoriaService);
  toastr = inject(ToastrService);
  router = inject(Router);

  tipo: string = '';
  usuario: string = '';
  operacao: string = '';
  dataInicio: string = '';
  dataFim: string = '';
  funcionarios: Funcionario[] = [];
  page!: number;
  size!: number;
  totalPages: number = 0;

  ngOnInit() {
    this.page = 0;
    this.size = 10;

    this.globalService.getMatrizAsync().subscribe({
      next: (matriz) => {
        this.funcionarios = (matriz.funcionarios || []).filter(
          (f) => f.deletado === false
        );

        this.filtrarAuditoria();
      },
      error: () => this.toastr.error('Erro ao carregar dados da matriz.'),
    });

    this.globalService
      .getUsuarioAsync()
      .pipe(take(1))
      .subscribe({
        next: (usuarioLogado) => {
          this.usuarioLogado = usuarioLogado;
        },
      });
  }

  filtrarAuditoria() {
    let di: Date | undefined;
    let df: Date | undefined;

    try {
      if (this.dataInicio) {
        const dataConvertida = this.convertStringToDate(this.dataInicio);
        if (!dataConvertida) throw new Error('Data Início inválida');
        di = dataConvertida;
      }

      if (this.dataFim) {
        const dataConvertida = this.convertStringToDate(this.dataFim);
        if (!dataConvertida) throw new Error('Data Fim inválida');
        df = dataConvertida;
      }

      if (di && df && df < di) {
        this.toastr.error('Data Fim não pode ser anterior à Data Início');
        return;
      }

      const isoInicio = di ? this.formatToISO(di) : undefined;
      const isoFim = df ? this.formatToISO(df) : undefined;

      this.auditoriaService
        .listarAuditorias(
          this.usuario,
          this.operacao,
          this.tipo,
          isoInicio,
          isoFim,
          this.page,
          this.size
        )
        .subscribe({
          next: (resposta) => {
            this.listaAuditorias = resposta.content;
            this.totalPages = resposta.totalPages;
          },
          error: () => {
            this.toastr.error('Erro ao filtrar auditorias.');
          },
        });
    } catch (err: any) {
      this.toastr.error(err.message || 'Erro desconhecido nas datas.');
    }
  }

  convertStringToDate(value: string): Date | null {
    const numeros = value.replace(/\D/g, '');

    if (numeros.length !== 12) {
      throw new Error('Formato incompleto');
    }

    const dia = parseInt(numeros.substring(0, 2), 10);
    const mes = parseInt(numeros.substring(2, 4), 10);
    const ano = parseInt(numeros.substring(4, 8), 10);
    const hora = parseInt(numeros.substring(8, 10), 10);
    const minuto = parseInt(numeros.substring(10, 12), 10);

    // Cria a data
    const data = new Date(ano, mes - 1, dia, hora, minuto);

    // Validação real: confere se os componentes foram preservados
    if (
      isNaN(data.getTime()) ||
      data.getDate() !== dia ||
      data.getMonth() + 1 !== mes ||
      data.getFullYear() !== ano ||
      data.getHours() !== hora ||
      data.getMinutes() !== minuto
    ) {
      throw new Error('Data inexistente ou inválida');
    }

    return data;
  }

  private formatToISO(date: Date): string {
    const y = date.getFullYear();
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const d = date.getDate().toString().padStart(2, '0');
    const hh = date.getHours().toString().padStart(2, '0');
    const mm = date.getMinutes().toString().padStart(2, '0');
    const ss = '00';
    return `${y}-${m}-${d}T${hh}:${mm}:${ss}`;
  }

  setPage(i: number) {
    if (i >= 0 && i < this.totalPages) {
      this.page = i;
      this.filtrarAuditoria();
    }
  }

  alterarTamanho(event: Event) {
    const valor = +(event.target as HTMLSelectElement).value;
    this.size = valor;
    this.page = 0;
    this.filtrarAuditoria();
  }
  pagesVisiveis(): number[] {
    const total = this.totalPages;
    const atual = this.page;

    const maxVisiveis = 5;
    let inicio = Math.max(0, atual - Math.floor(maxVisiveis / 2));
    let fim = inicio + maxVisiveis;

    if (fim > total) {
      fim = total;
      inicio = Math.max(0, fim - maxVisiveis);
    }

    const intervalo = [];
    for (let i = inicio; i < fim; i++) {
      intervalo.push(i);
    }
    return intervalo;
  }
}
