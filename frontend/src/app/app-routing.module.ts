import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/auth-guard.service';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'paciente',
    loadChildren: () => import('./Pacientes/paciente/paciente.module').then( m => m.PacientePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'marcar-consulta',
    loadChildren: () => import('./Pacientes/marcar-consulta/marcar-consulta.module').then( m => m.MarcarConsultaPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'consulta-modal',
    loadChildren: () => import('./Pacientes/consulta-modal/consulta-modal.module').then( m => m.ConsultaModalPageModule),
    canActivate: [AuthGuard]
  },
  { 
    path: 'admin',
    loadChildren: () => import('./Administradores/admin/admin.module').then( m => m.AdminPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'home-adm',
    loadChildren: () => import('./Administradores/home-adm/home-adm.module').then( m => m.HomeAdmPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'gerencia-usuarios',
    loadChildren: () => import('./Gerencia-usuários/gerencia-usuarios/gerencia-usuarios.module').then( m => m.GerenciaUsuariosPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'recuperar-senha',
    loadChildren: () => import('./recuperar-senha/recuperar-senha.module').then( m => m.RecuperarSenhaPageModule)
  },
  {
    path: 'redefinir-senha',
    loadChildren: () => import('./redefinir-senha/redefinir-senha.module').then( m => m.RedefinirSenhaPageModule)
  },
  {
    path: 'especialidades',
    loadChildren: () => import('./Administradores/especialidades/especialidades.module').then( m => m.EspecialidadesPageModule)
  },
  {
    path: 'aprovar-usuarios',
    loadChildren: () => import('./Gerencia-usuários/aprovar-usuarios/aprovar-usuarios.module').then( m => m.AprovarUsuariosPageModule)
  },
  {
    path: 'tabs',
    loadChildren: () => import('./Gerencia-usuários/tabs/tabs.module').then( m => m.TabsPageModule)
  },
  {
    path: 'exames',
    loadChildren: () => import('./Administradores/exames/exames.module').then( m => m.ExamesPageModule)
  },
  {
    path: 'medico',
    loadChildren: () => import('./Medicos/medico/medico.module').then( m => m.MedicoPageModule)
  },
  {
    path: 'consultas-marcadas',
    loadChildren: () => import('./Medicos/consultas-marcadas/consultas-marcadas.module').then( m => m.ConsultasMarcadasPageModule)
  },
  {
    path: 'enfermeiro',
    loadChildren: () => import('./Enfermeiros/home-enfermeiros/home-enfermeiros.module').then( m => m.HomeEnfermeirosPageModule)
  },
  {
    path: 'exames-pendentes',
    loadChildren: () => import('./Enfermeiros/exames-pendentes/exames-pendentes.module').then( m => m.ExamesPendentesPageModule)
  },
  {
    path: 'marcar-exames',
    loadChildren: () => import('./Medicos/marcar-exames/marcar-exames.module').then( m => m.MarcarExamesPageModule)
  },
  {
    path: 'exames-marcados',
    loadChildren: () => import('./Pacientes/exames-marcados/exames-marcados.module').then( m => m.ExamesMarcadosPageModule)
  },
  {
    path: '**',
    redirectTo: '/home',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
