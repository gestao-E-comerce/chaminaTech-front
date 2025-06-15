import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { Mensagem } from '../models/mensagem';
import { Materia } from '../models/materia';
import { GlobalService } from './global.service';
import { Config } from '../../config';

@Injectable({
  providedIn: 'root',
})
export class MateriaService {
  private readonly API = `${Config.BACKEND_URL}/materia`;
  http = inject(HttpClient);
  globalService = inject(GlobalService);

  listarMaterias(
    termoPesquisa?: string,
    ativo?: string
  ): Observable<Materia[]> {
    return this.globalService.getMatrizAsync().pipe(
      switchMap((matriz) => {
        let params = new HttpParams().set('matrizId', matriz.id.toString());
        if (termoPesquisa != null && termoPesquisa !== '') {
          params = params.set('termoPesquisa', termoPesquisa);
        }
        if (ativo != null && ativo !== '') {
          params = params.set('ativo', ativo);
        }
        return this.http.get<Materia[]>(`${this.API}/lista`, {
          params,
        });
      })
    );
  }

  listarMateriasDeposito(termoPesquisa?: string): Observable<Materia[]> {
    return this.globalService.getMatrizAsync().pipe(
      switchMap((matriz) => {
        let params = new HttpParams().set('matrizId', matriz.id.toString());
        if (termoPesquisa != null && termoPesquisa !== '') {
          params = params.set('termoPesquisa', termoPesquisa);
        }
        return this.http.get<Materia[]>(
          `${this.API}/listarMateriasDeposito`,
          { params }
        );
      })
    );
  }

  listarMateriasDepositoDescartar(termoPesquisa?: string): Observable<Materia[]> {
    return this.globalService.getMatrizAsync().pipe(
      switchMap((matriz) => {
        let params = new HttpParams().set('matrizId', matriz.id.toString());
        if (termoPesquisa != null && termoPesquisa !== '') {
          params = params.set('termoPesquisa', termoPesquisa);
        }
        return this.http.get<Materia[]>(
          `${this.API}/listarMateriasDepositoDescartar`,
          { params }
        );
      })
    );
  }

  save(materia: Materia): Observable<any> {
    return this.globalService.getMatrizAsync().pipe(
      switchMap((matriz) => {
        materia.matriz = matriz;
        if (materia.id) {
          return this.http.put<any>(`${this.API}/${materia.id}`, materia);
        } else {
          return this.http.post<any>(this.API, materia);
        }
      })
    );
  }

  ativarOuDesativarMateria(materia: Materia): Observable<Mensagem> {
    return this.globalService.getMatrizAsync().pipe(
      switchMap((matriz) => {
        materia.matriz = matriz;
        return this.http.put<Mensagem>(
          `${this.API}/desativar/${materia.id}`,
          materia
        );
      })
    );
  }

  deletar(id: number): Observable<Mensagem> {
    return this.http.delete<Mensagem>(`${this.API}/${id}`);
  }
}
