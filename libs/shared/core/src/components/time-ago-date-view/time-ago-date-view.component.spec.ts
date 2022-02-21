import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeAgoDateViewComponent } from './time-ago-date-view.component';
import { configureTestSuite } from 'ng-bullet';
import { TranslateModule } from '@ngx-translate/core';

describe('TimeAgoDateViewComponent', () => {
  configureTestSuite();

  let component: TimeAgoDateViewComponent;
  let fixture: ComponentFixture<TimeAgoDateViewComponent>;

  const translationKey = 'evidences.evidenceCollectionDate';

  const todayKey = 'evidences.evidenceCollectionDate.today';
  const dayKey = 'evidences.evidenceCollectionDate.day';
  const monthKey = 'evidences.evidenceCollectionDate.month';

  const daysAgo = new Date();
  const monthAgo = new Date();

  daysAgo.setDate(daysAgo.getDate() - 2);
  monthAgo.setDate(monthAgo.getDate() - 30);

  const testData = [
    {
      date: new Date(),
      amount: undefined,
      translationKey: todayKey,
    },
    {
      date: daysAgo,
      amount: 2,
      translationKey: dayKey,
    },
    {
      date: monthAgo,
      amount: 1,
      translationKey: monthKey,
    },
  ];

  beforeAll(() => {
    TestBed.configureTestingModule({
      declarations: [TimeAgoDateViewComponent],
      imports: [TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeAgoDateViewComponent);
    component = fixture.componentInstance;
    component.date = new Date(2021, 9, 15);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('buildTranslationKey should return appropriate key', () => {
    // Arrange
    const key = 'some-key';

    // Act
    const result = component.buildTranslationKey(key);

    // Assert
    expect(result).toEqual(`${translationKey}.${key}`);
  });

  describe('resolveDisplayedDateMessage', () => {
    testData.forEach((testItem) =>
      it(`resolveDisplayedDateMessage should return ${testItem.translationKey} and component.amount should be equal to ${testItem.amount}`, () => {
        // Arrange
        component.date = testItem.date;

        // Act
        const result = component.resolveDisplayedDateMessage();

        // Assert
        expect(component.amount).toEqual(testItem.amount);
        expect(result).toEqual(testItem.translationKey);
      })
    );
  });
});
