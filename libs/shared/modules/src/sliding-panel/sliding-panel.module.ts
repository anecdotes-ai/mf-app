import { CommentingModule } from "core/modules/commenting";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { DataManipulationModule } from "core/modules/data-manipulation";
import { SlidingPanelOutletComponent } from "./components";
import { CoreModule } from "core";

@NgModule({
    imports: [CommonModule, DataManipulationModule, CommentingModule, CoreModule],
    declarations: [SlidingPanelOutletComponent],
    exports: [SlidingPanelOutletComponent]
})
export class SlidingPanelModule { }