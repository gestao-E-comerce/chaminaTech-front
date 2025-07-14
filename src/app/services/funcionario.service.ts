import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { Mensagem } from '../models/mensagem';
import { Funcionario } from '../models/funcionario';
import { GlobalService } from './global.service';
import { Config } from '../../config';

@Injectable({
  providedIn: 'root',
})
export class FuncionarioService {
  private readonly API = `${Config.BACKEND_URL}/funcionario`;
  http = inject(HttpClient);
  globalService = inject(GlobalService);

  listarFuncionarios(
    termoPesquisa?: string,
    ativo?: string | null
  ): Observable<Funcionario[]> {
    return this.globalService.getMatrizAsync().pipe(
      switchMap((matriz) => {
        let params = new HttpParams().set('matrizId', matriz.id.toString());
        if (termoPesquisa != null && termoPesquisa !== '') {
          params = params.set('termoPesquisa', termoPesquisa);
        }
        if (ativo != null && ativo !== '') {
          params = params.set('ativo', ativo);
        }
        return this.http.get<Funcionario[]>(`${this.API}/lista`, {
          params,
        });
      })
    );
  }

  listarTudosFuncionarios(): Observable<Funcionario[]> {
    return this.globalService.getMatrizAsync().pipe(
      switchMap((matriz) => {
        let params = new HttpParams().set('matrizId', matriz.id.toString());
        return this.http.get<Funcionario[]>(`${this.API}/listaTudo`, {
          params,
        });
      })
    );
  }

  save(funcionario: Funcionario): Observable<Mensagem> {
    return this.globalService.getMatrizAsync().pipe(
      switchMap((matriz) => {
        funcionario.matriz = matriz;
        if (funcionario.id) {
          return this.http.put<Mensagem>(
            `${this.API}/${funcionario.id}`,
            funcionario
          );
        } else {
          return this.http.post<Mensagem>(this.API, funcionario);
        }
      })
    );
  }

  salvarPreferenciasFuncionarios(
    funcionarios: Funcionario[]
  ): Observable<Mensagem> {
    return this.globalService.getMatrizAsync().pipe(
      switchMap((matriz) => {
        funcionarios.forEach((func) => {
          func.matriz = matriz;
        });

        return this.http.put<Mensagem>(
          `${this.API}/preferencias/impressao`,
          funcionarios
        );
      })
    );
  }

  ativarOuDesativarFuncionario(funcionario: Funcionario): Observable<Mensagem> {
    return this.globalService.getMatrizAsync().pipe(
      switchMap((matriz) => {
        funcionario.matriz = matriz;
        return this.http.put<Mensagem>(
          `${this.API}/desativar/${funcionario.id}`,
          funcionario
        );
      })
    );
  }

  deletar(id: number): Observable<Mensagem> {
    return this.http.delete<Mensagem>(`${this.API}/${id}`);
  }
}
