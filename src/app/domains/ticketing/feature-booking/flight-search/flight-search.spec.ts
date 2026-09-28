import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { FlightSearch } from './flight-search';
import { page } from 'vitest/browser';
import { By } from '@angular/platform-browser';
import { TestOptions } from 'vitest';
import { provideTestConfig } from '../../../../testing/provide-test-config';
import { DefaultLanguageService, LanguageService } from '../../../shared/util-common/language';
import { FlightCard } from '../../ui/flight-card/flight-card';
import { FlightStore } from './flight-store';
import { createTestFlight } from '../../../../testing/create-test-flight';
import { FlightEdit } from '../flight-edit/flight-edit';
import { RouterTestingHarness } from '@angular/router/testing';

const suiteOptions: TestOptions = { timeout: 200 };
const caseOptions: TestOptions = { timeout: 300 };

describe('flight-search', () => {
  let component: FlightSearch;
  let fixture: ComponentFixture<FlightSearch>;
  let httpController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlightSearch],
      providers: [
        provideRouter([]),
        provideHttpClientTesting(), // Mock HTTP client providers
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
      // remove: { imports: [FlightCard] },
      // add: { imports: [DummyFlightCard] },
    });
    fixture = TestBed.createComponent(FlightSearch);
    component = fixture.componentInstance;

    httpController = TestBed.inject(HttpTestingController);

    // Await initial data loading (httpResource uses effects internally to load data)
    const request = await vi.waitFor(
      () => httpController.expectOne('/flight?from=Graz&to=Hamburg'),
      // In our example, chances are high that we just need a single retry, as we only need to
      // wait for the pending microtask that triggers the resource. So, we could even set the
      // interval to zero to await the next possible event loop tick after this microtask has
      // been executed
      // { interval: 0 },
    );
    // After success or timeout, flush the request to complete it and avoid memory leaks
    request.flush([]);
  });

  afterEach(() => {
    // Ensure that all pending HTTP calls have been answered with a mock response.
    httpController.verify();
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

  it('searches for flights when from and to are given', async () => {
    // Arrange
    const flightStore = TestBed.inject(FlightStore);
    vi.spyOn(flightStore, 'updateFilter');
    // When a service is provided at component level, we should access it via the fixture's debugElement:
    // flightStore = fixture.debugElement.injector.get(FlightStore);
    // vi.spyOn(flightStore, 'updateFilter').mockImplementation((_from, _to) => {
      // Custom mock behavior
    // });

    await page.getByLabelText('From').fill('Paris');
    await page.getByLabelText('To').fill('London');

    // From commits on blur before the To value is committed.
    const intermediateRequest = await vi.waitFor(() =>
      httpController.expectOne('/flight?from=Paris&to=Hamburg'),
    );
    intermediateRequest.flush([]);

    const button = page.getByRole('button', { name: 'Search' });

    // Act
    await button.click();
    const request = await vi.waitFor(() =>
      httpController.expectOne('/flight?from=Paris&to=London'),
    );
    request.flush([createTestFlight(1), createTestFlight(2), createTestFlight(3)]);

    // Assert
    const headings = page.getByRole('heading', {
      name: 'Paris - London',
    });

    await expect.element(headings).toHaveLength(3);

    expect(flightStore.updateFilter).toBeCalled();
    expect(flightStore.updateFilter).toBeCalledTimes(3);
    expect(flightStore.updateFilter).toBeCalledWith('Paris', 'London');
  });
});

describe('FlightEdit (router)', suiteOptions, () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlightEdit],
      providers: [
        // Set up test routes
        provideRouter([
          {
            path: 'flight-edit/:id',
            component: FlightEdit,
          },
        ]),
      ],
    }).compileComponents();
  });

  it('navigates to flight details on click', caseOptions, async () => {
  // Example using caseOptions.
});

  it('shows the route id in the id field', async () => {
      // Arrange
      const harness = await RouterTestingHarness.create();
      await harness.navigateByUrl('/flight-edit/42');
      const input = page.getByLabelText('ID');
      // Act

      // Assert
      await expect.element(input).toHaveValue(42);
    });
});
