import { Injectable } from "@angular/core";
import { Effect } from "@ngrx/effects";
import { ResourceType } from "core/modules/data/models";
import { CommentPanelManagerService } from "core/modules/commenting";
import { ControlsFocusingService } from "core/modules/shared-controls";
import { tap } from "rxjs/operators";

@Injectable()
export class ControlsPageEffects {
    constructor(private controlsFocusingService: ControlsFocusingService, private commentingPanelManager: CommentPanelManagerService) {
     }

    @Effect({ dispatch: false })
    focusedResourceByComment$ = this.commentingPanelManager.getFocusedResource().pipe(tap(c => {
        if (c.resourceType === ResourceType.Control) {
            this.controlsFocusingService.focusControl(c.resourceId);
        }
    }));
}
