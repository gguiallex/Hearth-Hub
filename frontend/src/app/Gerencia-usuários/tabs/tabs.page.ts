import { Component, OnInit } from '@angular/core';
import { SuspensoService } from 'src/app/services/suspenso.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {

  selectedTab: any;
  totalSuspensos: number = 0;


  constructor(private suspensoService: SuspensoService) { }

  ngOnInit() {
    this.suspensoService.suspensoCount$.subscribe(count => {
      this.totalSuspensos = count;
    });
  }

  setCurrentTab(event: any){
    this.selectedTab = event.tab;
  }

}
