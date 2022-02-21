import { Injectable } from '@angular/core';
import { GenericModalsService } from 'core/modules/modals';

@Injectable()
export class ConfirmationModalService {
  constructor(private genericModalsService: GenericModalsService) {}

  openThreadDeleteConfirmation(): Promise<boolean> {
    return this.genericModalsService.openConfirmationModal({
      confirmTranslationKey: 'commenting.deleteThreadConfirmation.yesBtn',
      dismissTranslationKey: 'commenting.deleteThreadConfirmation.cancelBtn',
      questionTranslationKey: 'commenting.deleteThreadConfirmation.question',
      aftermathTranslationKey: 'commenting.deleteThreadConfirmation.aftermath',
    });
  }

  openReplyDeleteConfirmation(): Promise<boolean> {
    return this.genericModalsService.openConfirmationModal({
      confirmTranslationKey: 'commenting.deleteCommentConfirmation.yesBtn',
      dismissTranslationKey: 'commenting.deleteCommentConfirmation.cancelBtn',
      questionTranslationKey: 'commenting.deleteCommentConfirmation.question',
      aftermathTranslationKey: 'commenting.deleteCommentConfirmation.aftermath',
    });
  }

  openDeleteAllConfirmation(): Promise<boolean> {
    return this.genericModalsService.openConfirmationModal({
      confirmTranslationKey: 'commenting.deleteAllConfirmation.yesBtn',
      dismissTranslationKey: 'commenting.deleteAllConfirmation.cancelBtn',
      questionTranslationKey: 'commenting.deleteAllConfirmation.question',
      aftermathTranslationKey: 'commenting.deleteAllConfirmation.aftermath',
    });
  }

  openResolveAllConfirmation(): Promise<boolean> {
    return this.genericModalsService.openConfirmationModal({
      confirmTranslationKey: 'commenting.resolveAllConfirmation.yesBtn',
      dismissTranslationKey: 'commenting.resolveAllConfirmation.cancelBtn',
      questionTranslationKey: 'commenting.resolveAllConfirmation.question',
      aftermathTranslationKey: 'commenting.resolveAllConfirmation.aftermath',
    });
  }
}
