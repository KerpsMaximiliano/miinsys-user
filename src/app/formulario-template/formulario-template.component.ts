import { Component, OnInit } from '@angular/core';
import {PageEvent} from "@angular/material/paginator";

@Component({
  selector: 'app-cuestionario-send',
  templateUrl: './formulario-template.component.html',
})
export class FormularioTemplateComponent implements OnInit {

  productListData: number [] = []
  constructor() {
    // Generaing dummy content
    for (let i = 0; i < 1000; i++) {
      let dummyObject = i
      this.productListData.push(dummyObject);
    }
  }
  ngOnInit(): void {
  }
 
  pageIndex:number = 0;
  pageSize:number = 10;
  lowValue:number = 0;
  highValue:number = 10;       
getPaginatorData(event: PageEvent){
   if(event.pageIndex === this.pageIndex + 1){
      this.lowValue = this.lowValue + this.pageSize;
      this.highValue =  this.highValue + this.pageSize;
     }
  else if(event.pageIndex === this.pageIndex - 1){
     this.lowValue = this.lowValue - this.pageSize;
     this.highValue =  this.highValue - this.pageSize;
    }   
     this.pageIndex = event.pageIndex;
}

nextPage()
{
  this.lowValue = this.lowValue + this.pageSize;
      this.highValue =  this.highValue + this.pageSize;
}

}
