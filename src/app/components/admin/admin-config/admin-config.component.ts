import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgxMaskDirective } from 'ngx-mask';
import { Admin } from '../../../models/admin';
import { ToastrService } from 'ngx-toastr';
import { GlobalService } from '../../../services/global.service';
import { take } from 'rxjs';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-admin-config',
  standalone: true,
  imports: [FormsModule, RouterLink, NgClass],
  templateUrl: './admin-config.component.html',
  styleUrl: './admin-config.component.scss',
})
export class AdminConfigComponent {
  adminOriginal: Admin = new Admin();
  admin: Admin = new Admin();

  globalService = inject(GlobalService);
  adminService = inject(AdminService);
  toastr = inject(ToastrService);

  ngOnInit() {
    this.globalService
      .getAdminAsync()
      .pipe(take(1))
      .subscribe({
        next: (admin) => {
          this.admin = admin;
          this.adminOriginal = JSON.parse(JSON.stringify(admin));
        },
      });
  }

  isModified(): boolean {
    return JSON.stringify(this.admin) !== JSON.stringify(this.adminOriginal);
  }

  salvar(formulario: any) {
    if (!this.isModified()) {
      console.log('TMC ta achando facil ehn kkk');
      return;
    }
    if (!formulario.valid) {
      this.toastr.error('Formulário inválido. Preencha os campos corretamente');
      Object.keys(formulario.controls).forEach((campo) => {
        formulario.controls[campo].markAsTouched();
      });
      return;
    }
    if (!this.admin.nome?.trim()) {
      this.toastr.error('Nome obrigatório!');
      return;
    } else if (!this.admin.username?.trim()) {
      this.toastr.error('UserName obrigatório!');
      return;
    } else {
      this.adminService.editar(this.admin).subscribe({
        next: (mensagem) => {
          this.toastr.success(mensagem.mensagem);
        },
        error: (erro) => {
          this.toastr.error(erro.error.mensagem);
        },
      });
    }
  }
}
