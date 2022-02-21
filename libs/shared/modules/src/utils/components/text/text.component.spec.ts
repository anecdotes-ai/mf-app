import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { TextComponent } from './text.component';

describe('TextComponent', () => {
  let component: TextComponent;
  let fixture: ComponentFixture<TextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [TextComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should correctly split text by line-breaks', () => {
    // Arrange
    const translatedText = 'some\ntext\nexample';

    // Act
    const result = component.buildSpans(translatedText);

    // Assert
    expect(result).toEqual(['some', 'text', 'example']);
  });

  it('should correctly render spans', () => {
    // Arrange
    component.text = 'some\ntext\nexample';
    const expectedSpansContent = ['some', 'text', 'example'];

    // Act
    fixture.detectChanges();

    // Assert
    const spans = fixture.debugElement.queryAll(By.css('span'));
    expect(spans.length).toEqual(3);
    spans.forEach((span, idx) => expect(span.nativeElement.innerText).toEqual(expectedSpansContent[idx]));
  });
});
