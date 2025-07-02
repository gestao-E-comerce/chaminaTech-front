import {
  Component,
  inject,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { Matriz } from '../../../models/matriz';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GlobalService } from '../../../services/global.service';
import { take } from 'rxjs';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { GestaoCaixaService } from '../../../services/gestao-caixa.service';
import { Usuario } from '../../../models/usuario';

@Component({
    selector: 'app-configuracao',
    imports: [FormsModule, RouterLink, RouterOutlet],
    templateUrl: './configuracao.component.html',
    styleUrl: './configuracao.component.scss'
})
export class ConfiguracaoComponent implements OnInit {
  @ViewChild('modalCancelar') modalCancelar!: TemplateRef<any>;
  matrizOriginal: Matriz = new Matriz();
  matriz: Matriz = new Matriz();
  usuario!: Usuario;
  menuAberto = false;

  gestaoCaixaService = inject(GestaoCaixaService);
  globalService = inject(GlobalService);
  modalService = inject(NgbModal);
  router = inject(Router);
  toastr = inject(ToastrService);

  ngOnInit() {
    this.globalService
      .getMatrizAsync()
      .pipe(take(1))
      .subscribe({
        next: (matriz) => {
          this.matriz = matriz;
          this.matrizOriginal = JSON.parse(JSON.stringify(matriz));
        },
      });
    this.globalService
      .getUsuarioAsync()
      .pipe(take(1))
      .subscribe({
        next: (usuario) => {
          this.usuario = usuario;
        },
      });
  }

  isModified(): boolean {
    return JSON.stringify(this.matriz) !== JSON.stringify(this.matrizOriginal);
  }

  zerarCupons() {
    this.gestaoCaixaService.zerarCupons().subscribe({
      next: (mensagem) => {
        this.toastr.success(mensagem.mensagem);
      },
      error: (erro) => {
        this.toastr.error(erro.error.mensagem);
      },
    });
  }
}
