import { AppUser } from './app-user.model';
import { Book } from './book.model';

export interface Loan {
  id?: number;
  user: number;
  book: number;
  status: string;
  returnDate: string;
  loanDate: string;
  bookName?: string;
}
