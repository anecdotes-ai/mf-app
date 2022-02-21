import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { spyOnMessageBusMethods } from 'core/utils/testing';
import { MessageBusService } from 'core';
import { EvidenceCollectionModalService } from 'core/modules/shared-controls';
import { RequirementLikeComponent } from './requirement-like.component';
import { Directive } from '@angular/core';

@Directive({
  selector: '[collectingEvidenceHost]',
  exportAs: 'collectingEvidenceHost',
})
export class CollectingEvidenceHostDirectiveMock {}

describe('RequirementLikeComponent', () => {
  let component: RequirementLikeComponent;
  let fixture: ComponentFixture<RequirementLikeComponent>;
  let messageBusService: MessageBusService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule],
      declarations: [RequirementLikeComponent, CollectingEvidenceHostDirectiveMock],
      providers: [{ provide: MessageBusService, useValue: {} }, { provide: EvidenceCollectionModalService, useValue: {} }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequirementLikeComponent);
    component = fixture.componentInstance;
    component.requirementLike = { evidence: [] };
    messageBusService = TestBed.inject(MessageBusService);
    spyOnMessageBusMethods(messageBusService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('expandFully', () => {
    it('should be true by default', () => {
      // assert
      expect(component.expandFully).toBeTrue();
    });

    it('should set childrenExpand to true on rowClick expand when true, expandable', () => {
      // Arrange
      component.expandFully = true;
      component.expandable = true;
      component.expanded = false;

      // Act
      component.rowClick(new MouseEvent('bla'));

      // assert
      expect(component.childrenExpanded).toBeTrue();
    });

    it('should set childrenExpand to false on rowClick collapse when true, expandable', () => {
      // Arrange
      component.expandFully = true;
      component.expandable = true;
      component.expanded = true;

      // Act
      component.rowClick(new MouseEvent('bla'));

      // assert
      expect(component.childrenExpanded).toBeFalse();
    });

    it('shouldnt change childrenExpand on rowClick collapse when false & expandable', () => {
      // Arrange
      component.expandable = true;
      component.expandFully = false;
      component.expanded = false;

      const preClick = component.childrenExpanded;

      // Act
      component.rowClick(new MouseEvent('bla'));

      // assert
      expect(component.childrenExpanded).toEqual(preClick);
    });
  });
});
