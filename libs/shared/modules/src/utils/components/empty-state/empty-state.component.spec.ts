import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { EmptyStateComponent } from './empty-state.component';

describe('EmptyStateComponent', () => {
  let component: EmptyStateComponent;
  let fixture: ComponentFixture<EmptyStateComponent>;


  function getMainButton(): HTMLElement {
    return fixture.debugElement.query(By.css('#main-button')).nativeElement;
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmptyStateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmptyStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('main-button', () => {
    it('should emit mainActionClick when clicked', async () => {
      // Arrange
      spyOn(component.mainActionClick, 'emit');

      // Act
      getMainButton().dispatchEvent(new MouseEvent('click'));

      // Assert
      expect(component.mainActionClick.emit).toHaveBeenCalled();
    });
  });
});
