import { EnumProviderDirective } from './enum-provider/enum-provider.directive';
import { VisibleForRoleDirective } from './visible-for-role/visible-for-role.directive';
import { UserEventDirective } from './user-event/user-event.directive';
import { OpenTooltipWhenOverflowedAndHoveredDirective } from './open-tooltip-when-overflowed-and-hovered/open-tooltip-when-overflowed-and-hovered.directive';
import { KeepTooltipOrPopoverOnHoverDirective } from './keep-tooltip-or-popover-on-hover/keep-tooltip-or-popover-on-hover.directive';
import { NgVarDirective } from './ng-var/ng-var.directive';
import { HtmlElementReferenceDirective } from './html-element-reference/html-element-reference.directive';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { NgbPopoverModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { SvgIconsModule } from 'core/modules/svg-icons';
import { RouterModule } from '@angular/router';
import { WindowHelperService } from 'core/services/window-helper/window-helper.service';

@NgModule({
    imports: [
        CommonModule,
        TranslateModule.forChild(),
        NgbTooltipModule,
        SvgIconsModule,
        RouterModule,
        NgbPopoverModule
    ],
    declarations: [
        HtmlElementReferenceDirective,
        KeepTooltipOrPopoverOnHoverDirective,
        NgVarDirective,
        OpenTooltipWhenOverflowedAndHoveredDirective,
        UserEventDirective,
        VisibleForRoleDirective,
        EnumProviderDirective
    ],
    exports: [
        HtmlElementReferenceDirective,
        KeepTooltipOrPopoverOnHoverDirective,
        NgVarDirective,
        OpenTooltipWhenOverflowedAndHoveredDirective,
        UserEventDirective,
        VisibleForRoleDirective,
        EnumProviderDirective
    ],
    providers: [WindowHelperService],
})
export class DirectivesModule {
}
