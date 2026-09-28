import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { page } from 'vitest/browser';

import { createTestFlight } from '../../../../testing/create-test-flight';
import { provideTestConfig } from '../../../../testing/provide-test-config';
import { ReactiveFlightSearch } from './reactive-flight-search';

describe('reactive-flight-search with fake timers', () => {
  let component: ReactiveFlightSearch;
  let fixture: ComponentFixture<ReactiveFlightSearch>;
  let ctrl: HttpTestingController;

  beforeEach(async () => {
    vi.useFakeTimers();

    await TestBed.configureTestingModule({
      imports: [ReactiveFlightSearch],
      providers: [
        provideRouter([]),
        provideHttpClientTesting(),
        provideTestConfig(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ReactiveFlightSearch);
    component = fixture.componentInstance;

    ctrl = TestBed.inject(HttpTestingController);

    // Await initial data loading
    // executes all pending timers, such as debouncing timers,...
    await vi.runAllTimersAsync(); // Needs to be called before the expecting HTP request
    const request = ctrl.expectOne('/flight?from=Graz&to=Hamburg');
    request.flush([]);

    await vi.runAllTimersAsync(); // Also need to be called after flushing for httpResource inner working
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('can be created', () => {
    expect(component).not.toBeUndefined();
  });

  it('searches for flights when from and to are given', async () => {
    await page.getByLabelText('From').fill('Paris');
    await vi.runAllTimersAsync();

    await page.getByLabelText('To').fill('London');
    await vi.runAllTimersAsync();

    const request = ctrl.expectOne('/flight?from=Paris&to=London');

    request.flush([
      createTestFlight(1),
      createTestFlight(2),
      createTestFlight(3),
    ]);

    await vi.runAllTimersAsync();

    const headings = page.getByRole('heading', {
      name: 'Paris - London',
    });

    await expect.element(headings).toHaveLength(3);
  });
});
