import { Component, OnInit } from '@angular/core';
import { SuspensoService } from 'src/app/services/suspenso.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {
  // Variável para armazenar a aba selecionada
  selectedTab: any;
  // Variável para armazenar o número total de itens suspensos
  totalSuspensos: number = 0;


  constructor(private suspensoService: SuspensoService) { }

  ngOnInit() {
    // Subscribing ao observable suspensoCount$ para obter o número total de itens suspensos
    this.suspensoService.suspensoCount$.subscribe(count => {
      this.totalSuspensos = count;
    });
  }

  // Método para definir a aba atual selecionada
  setCurrentTab(event: any){
    this.selectedTab = event.tab;
  }

}
