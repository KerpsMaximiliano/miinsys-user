import { NgModule } from "@angular/core";
import { FechaPipe } from "./fecha-pipe.module";

@NgModule({
    declarations: [
        FechaPipe
    ],
    providers: [],
    bootstrap: [],
    exports: [
        FechaPipe
    ]
  })
  export class PipesModule { }