/* Ambient API model types for the generated API wrapper
   These are declared as global ambient types so the generated
   `src/services/api.ts` (which references these names) resolves
   correctly without editing the generated file.

   Keep these shapes synchronized with the backend/OpenAPI schema.
*/

interface ShowroomInstallment {
  id: string;
  duration: number;
  initialPayment: number;
  interestRate: number;
  paperWorkFee?: number;
}

interface ShowroomInstallmentCreate {
  duration: number;
  initialPayment: number;
  interestRate: number;
  paperWorkFee?: number;
}

interface ShowroomInstallmentUpdate {
  duration?: number;
  initialPayment?: number;
  interestRate?: number;
  paperWorkFee?: number;
}

interface BankInstallment {
  id: string;
  initialPayment: number;
  deposit: number;
}

interface BankInstallmentCreate {
  initialPayment: number;
  deposit: number;
}

interface BankInstallmentUpdate {
  initialPayment?: number;
  deposit?: number;
}
