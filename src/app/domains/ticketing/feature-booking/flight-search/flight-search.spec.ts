import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { FlightSearch } from './flight-search';
import { page } from 'vitest/browser';
import { By } from '@angular/platform-browser';
import { TestOptions } from 'vitest';
import { provideTestConfig } from '../../../../testing/provide-test-config';
import { DefaultLanguageService, LanguageService } from '../../../shared/util-common/language';
import { FlightCard } from '../../ui/flight-card/flight-card';

const suiteOptions: TestOptions = { timeout: 200 };
const caseOptions: TestOptions = { timeout: 300 };

describe('flight-search', () => {
  let component: FlightSearch;
  let fixture: ComponentFixture<FlightSearch>;
  let ctrl: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlightSearch],
      providers: [
        provideRouter([]),
        provideHttpClientTesting(),
        // { provide: ConfigService, useValue: { baseUrl: '' } },
        provideTestConfig(), // Mocked service for services that are provided at root level
      ],
    }).compileComponents();

    // Mocked service for services that are provided at component level (overrides the app-level provider)
    TestBed.overrideComponent(FlightSearch, {
      add: {
        providers: [
          {
            provide: LanguageService,
            useClass: DefaultLanguageService,
          },
        ],
      },
    });
    // Mocked child components for shallow testing
    TestBed.overrideComponent(FlightSearch, {
      remove: { imports: [FlightCard] },
      add: { imports: [DummyFlightCard] },
    });
    fixture = TestBed.createComponent(FlightSearch);
    component = fixture.componentInstance;

    ctrl = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // ctrl.verify();
  });

  it('can be created', () => {
    expect(component).not.toBeUndefined();
  });

  it('disables search button when from and to are not given', async () => {
    // Arrange
    // await page.getByLabelText('From').fill('');
    await page.getByLabelText(/From|Airport of Departure/i).fill(''); // regex
    await page.getByLabelText('To').fill('');
    const button = page.getByRole('button', { name: 'Search', exact: true }); // exact match
    // Access the DOM node behind a locator immediately:
    // const element = button.element();
    // Act

    // Assert
    // If the defined DOM element cannot be found, these methods retry until reaching a timeout.
    // Between each attempt, such methods wait for a short interval to allow asynchronous tasks to complete.
    // await expect.element(button ).toBeDisabled();
    await expect.element(button, { interval: 50, timeout: 100 }).toBeDisabled();
  });

  it('shows three flights', async () => {
    // Arrange
    const headings = page.getByRole('heading', {
      name: 'Paris - London',
    });
    // Act

    // Assert
    await expect.element(headings).toHaveLength(0);
  });

  it('test debugElement', async () => {
    // Arrange
    const to = await fixture.debugElement.query(By.css('input.to')).nativeElement;
    to.value = 'London';
    to.dispatchEvent(new Event('input'));
    // Act
    // Assert
  });

  describe('FlightEdit (router)', suiteOptions, () => {
    it('navigates to flight details on click', caseOptions, async () => {
      // ...
    });
  });
});
