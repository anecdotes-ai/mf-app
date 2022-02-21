import { Directive, Input, OnChanges, OnInit, SimpleChanges, TemplateRef, ViewContainerRef } from '@angular/core';
import { RoleService } from 'core/modules/auth-core/services';
import { BehaviorSubject, combineLatest, Subscription } from 'rxjs';

@Directive({
  selector: '[visibleForRole]',
})
export class VisibleForRoleDirective implements OnInit, OnChanges {
  private visibleForRoleSubject = new BehaviorSubject<string[]>([]);
  private subscription: Subscription[] = [];
  private visibleForAll = false;

  @Input()
  visibleForRole: string[];

  constructor(
    private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    private roleService: RoleService
  ) {}

  ngOnInit(): void {
    this.subscription.push(
      combineLatest([this.visibleForRoleSubject, this.roleService.getCurrentUserRole()]).subscribe(
        ([visibleForRole, res]) => {
          if (this.visibleForAll || (res.role && visibleForRole.includes(res.role))) {
            this.viewContainerRef.createEmbeddedView(this.templateRef);
          } else {
            this.viewContainerRef.clear();
          }
        }
      )
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('visibleForRole' in changes) {
      if (typeof this.visibleForRole === 'string') {
        this.visibleForRoleSubject.next([this.visibleForRole]);
      } else if (Array.isArray(this.visibleForRole)) {
        this.visibleForRoleSubject.next(this.visibleForRole);
      } else if (this.visibleForRole === undefined) { 
        this.visibleForAll = true;
      } else {
        this.visibleForRoleSubject.next([]);
      }
    }
  }

  ngOnDestroy(): void {
    this.subscription.forEach((subscription: Subscription) => subscription.unsubscribe());
  }
}
