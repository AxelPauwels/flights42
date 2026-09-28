import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { FlightStore } from './flight-store';
import { provideTestConfig } from '../../../../testing/provide-test-config';
import { createTestFlight } from '../../../../testing/create-test-flight';

describe('flight-store', () => {
  let ctrl: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        FlightStore,
        provideHttpClientTesting(),
        provideTestConfig()
      ],
    });

    ctrl = TestBed.inject(HttpTestingController);
  });

  it('loads flights when from and to given', async () => {
    // Arrange
    const store = TestBed.inject(FlightStore);

    // Act
    store.updateFilter('Paris', 'London');
    const request = await vi.waitFor(() => ctrl.expectOne('/flight?from=Paris&to=London'), {
      interval: 0,
    });
    request.flush([
      createTestFlight(1),
      createTestFlight(2),
      createTestFlight(3)
    ]);

    // Assert
    await vi.waitFor(
      () => {
        const flights = store.flights();
        expect(flights.length).toBe(3);
      },
      { interval: 0 },
    );
    ctrl.verify();
  });
});
