import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { Matriz } from '../../../../models/matriz';
import { MatrizService } from '../../../../services/matriz.service';
import { GlobalService } from '../../../../services/global.service';
import { take } from 'rxjs';
import { Produto } from '../../../../models/produto';

@Component({
    selector: 'app-impressoras',
    imports: [FormsModule],
    templateUrl: './impressoras.component.html',
    styleUrl: './impressoras.component.scss'
})
export class ImpressorasComponent implements OnInit {
  @Output() retorno = new EventEmitter<any>();
  @Input() produto!: Produto;
  matriz!: Matriz;

  toastr = inject(ToastrService);
  globalService = inject(GlobalService);
  matrizService = inject(MatrizService);

  impressoraSelecionada!: string;

  ngOnInit() {
    this.globalService
      .getMatrizAsync()
      .pipe(take(1))
      .subscribe({
        next: (matriz) => {
          this.matriz = matriz;
          matriz.configuracaoImpressao.impressoras = matriz.configuracaoImpressao.impressoras.filter(
            imp => !this.produto.impressoras.some(p => p.apelidoImpressora === imp.apelidoImpressora)
          );
        },
      });
  }
  
  salvar() {
    if(this.impressoraSelecionada != null){
      this.retorno.emit(this.impressoraSelecionada);
      this.toastr.success('Impressora adicionada com sucesso');
    }
  }

  byId(item1: any, item2: any) {
    if (item1 != null && item2 != null) return item1.id === item2.id;
    else return item1 === item2;
  }
}
