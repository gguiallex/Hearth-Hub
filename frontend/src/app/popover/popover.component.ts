import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../services/auth.service'
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent  implements OnInit {

  @Input() popoverController!: PopoverController;

  constructor(private authService: AuthService,
              private router: Router,) { }

  ngOnInit() {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
    this.popoverController.dismiss();
  }

}
