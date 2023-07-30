import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { routeTransitionAnimations } from './route-transition-animations';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  animations: [routeTransitionAnimations]
})
export class AdminComponent implements OnInit {

  title: string = ""


  constructor(
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {

  }

  componentLoaded(component: any) {
    switch (component.title) {
      case 'Búsqueda':
        //this.title = "Búsqueda"
        break;
      case 'Cuestionario':
        //this.title = 'Cuestionario ' + this.activatedRoute.children[0].snapshot.params['id'];
        break;
    }
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && 
      outlet.activatedRouteData && 
      outlet.activatedRouteData['animationState'];
   }

}