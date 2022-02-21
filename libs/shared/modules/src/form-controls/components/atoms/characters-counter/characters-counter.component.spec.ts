/* tslint:disable:no-unused-variable */
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CharactersCounterComponent } from './characters-counter.component';

describe('CharactersCounterComponent', () => {
  let componentUnderTest: CharactersCounterComponent;
  let fixture: ComponentFixture<CharactersCounterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CharactersCounterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CharactersCounterComponent);
    componentUnderTest = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(componentUnderTest).toBeTruthy();
  });

  describe('characters counter', () => {
    const fakeMaxLength = 5;

    beforeEach(() => {
      componentUnderTest.maxLength = fakeMaxLength;
    });

    async function detectChanges(): Promise<void> {
      fixture.detectChanges();
      await fixture.whenStable();
    }

    function getCharactersCounterDebugElement(): DebugElement {
      return fixture.debugElement;
    }

    function generateStringByCount(count: number): string {
      let resultString = '';

      for (let i = 0; i < count; i++) {
        resultString += 'a';
      }

      return resultString;
    }

    it('should render element that displays count of inputted characters', async () => {
      // Arrange
      const currentStringLength = 3;
      componentUnderTest.value = generateStringByCount(currentStringLength);

      // Act
      await detectChanges();

      // Assert
      const counter = getCharactersCounterDebugElement().query(By.css(':nth-child(1)'));
      expect(counter).toBeTruthy();
      expect(counter.nativeElement.innerText).toBe(currentStringLength.toString());
    });

    it('should render element that displays maxLength', async () => {
      // Arrange
      componentUnderTest.value = generateStringByCount(4);

      // Act
      await detectChanges();

      // Assert
      const maxLength = getCharactersCounterDebugElement().query(By.css(':nth-child(3)'));
      expect(maxLength).toBeTruthy();
      expect(maxLength.nativeElement.innerText).toBe(fakeMaxLength.toString());
    });
  });
});
