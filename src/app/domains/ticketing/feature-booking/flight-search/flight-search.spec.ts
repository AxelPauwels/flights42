import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { FlightSearch } from './flight-search';
import { page } from 'vitest/browser';
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
      ],
    }).compileComponents();
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
    await page.getByLabelText('From').fill('');
    await page.getByLabelText('To').fill('');
    const button = page.getByRole('button', { name: 'Search' });
    await expect.element(button).toBeDisabled();
  });
});
