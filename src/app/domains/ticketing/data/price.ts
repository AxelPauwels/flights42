export interface Price {
  flightClass: string;
  amount: number;
}

export const initialPrice: Price = {
  flightClass: '',
  amount: 0,
};
