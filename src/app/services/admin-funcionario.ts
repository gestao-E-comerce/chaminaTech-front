import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { GlobalService } from './global.service';
import { AdminFuncionario } from '../models/admin-funcionario';
import { Observable, switchMap } from 'rxjs';
import { Mensagem } from '../models/mensagem';
import { Config } from '../../config';

@Injectable({
  providedIn: 'root',
})
export class AdminFuncionarioService {
  private readonly API = `${Config.BACKEND_URL}/adminFuncionario`;
  http = inject(HttpClient);
  globalService = inject(GlobalService);

  listarAdminFuncionarios(
    termoPesquisa?: string,
    ativo?: string | null
  ): Observable<AdminFuncionario[]> {
    return this.globalService.getAdminAsync().pipe(
      switchMap((admin) => {
        let params = new HttpParams().set('adminId', admin.id.toString());
        if (termoPesquisa != null && termoPesquisa !== '') {
          params = params.set('termoPesquisa', termoPesquisa);
        }
        if (ativo != null && ativo !== '') {
          params = params.set('ativo', ativo);
        }
        return this.http.get<AdminFuncionario[]>(`${this.API}/lista`, {
          params,
        });
      })
    );
  }

  save(funcionario: AdminFuncionario): Observable<Mensagem> {
    return this.globalService.getAdminAsync().pipe(
      switchMap((admin) => {
        funcionario.admin = admin;
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

  ativarOuDesativarAdminFuncionario(funcionario: AdminFuncionario): Observable<Mensagem> {
    return this.globalService.getAdminAsync().pipe(
      switchMap((admin) => {
        funcionario.admin = admin;
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
