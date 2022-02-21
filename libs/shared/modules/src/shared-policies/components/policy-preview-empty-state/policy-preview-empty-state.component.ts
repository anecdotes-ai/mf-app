import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-policy-preview-empty-state',
  templateUrl: './policy-preview-empty-state.component.html',
  styleUrls: ['./policy-preview-empty-state.component.scss']
})
export class PolicyPreviewEmptyStateComponent {

  @Output()
  linkClick = new EventEmitter();

  buildTranslationKey(relativeKey: string): string {
    return `policyManager.policy.emptyPreview.${relativeKey}`;
  }

  onLinkClick(): void
  {
    this.linkClick.emit();
  }
}
