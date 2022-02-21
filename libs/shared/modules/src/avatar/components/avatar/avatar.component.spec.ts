import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AvatarComponent } from './avatar.component';

@Component({
  template: `<app-avatar [name]="name"></app-avatar>`,
})
export class TestWrapperComponent {
  name: string;
}

describe('AvatarComponent', () => {

  let hostComponent: TestWrapperComponent;
  let fixture: ComponentFixture<TestWrapperComponent>;
  let componentUnderTestDebugElement: DebugElement;
  let componentUnderTest: AvatarComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvatarComponent, TestWrapperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestWrapperComponent);
    hostComponent = fixture.componentInstance;
    componentUnderTestDebugElement = fixture.debugElement.query(By.directive(AvatarComponent));
    componentUnderTest = componentUnderTestDebugElement.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(hostComponent).toBeTruthy();
  });

  it('Should be empty avatar', () => {
    // Arrange
    hostComponent.name = '';
    const expectedIcon = 'empty-avatar';

    // Act
    fixture.detectChanges();

    // Assert
    expect(componentUnderTest.icon).toEqual(expectedIcon);
    expect(componentUnderTest.insideIconText).toBeUndefined();
  });
  it('Should be user avatar ', async () => {
    // Arrange
    hostComponent.name = 'Sample Name';
    const expectedIcon = 'user-icon-logo';

    // Act
    fixture.detectChanges();
    await fixture.whenStable();

    // Assert
    expect(componentUnderTest.icon).toEqual(expectedIcon);
    expect(componentUnderTest.insideIconText).toEqual('SN');
  });

});
