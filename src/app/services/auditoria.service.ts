import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { GlobalService } from './global.service';
import { Observable, switchMap } from 'rxjs';
import { Auditoria } from '../models/auditoria';
import { Config } from '../../config';

@Injectable({ providedIn: 'root' })
export class AuditoriaService {
  private readonly API = `${Config.BACKEND_URL}/auditoria`;
  http = inject(HttpClient);
  globalService = inject(GlobalService);

  listarAuditorias(
    usuario?: string,
    operacao?: string,
    tipo?: string,
    dataInicio?: string,
    dataFim?: string,
    page?: number,
    size?: number
  ): Observable<{
    content: Auditoria[];
    totalElements: number;
    totalPages: number;
  }> {
    return this.globalService.getMatrizAsync().pipe(
      switchMap((matriz) => {
        let params = new HttpParams().set('matrizId', matriz.id.toString());

        if (usuario) params = params.set('usuario', usuario);
        if (operacao) params = params.set('operacao', operacao);
        if (tipo) params = params.set('tipo', tipo);
        if (dataInicio) params = params.set('dataInicio', dataInicio);
        if (dataFim) params = params.set('dataFim', dataFim);

        if (page != null) params = params.set('page', page.toString());
        if (size != null) params = params.set('size', size.toString());

        return this.http.get<{
          content: Auditoria[];
          totalElements: number;
          totalPages: number;
        }>(this.API, { params });
      })
    );
  }
}
