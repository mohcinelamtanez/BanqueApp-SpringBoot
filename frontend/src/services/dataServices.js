import { clients, loans, payments } from "../data/mock/data";
const wait = (value, delay = 300) =>
  new Promise((resolve) => setTimeout(() => resolve(value), delay));
const clientLoans = (id) => loans.filter((loan) => loan.clientId === id);
export const clientService = {
  list: () => wait([...clients]),
  get: (id) => wait(clients.find((c) => c.id === id)),
  loans: (id) => wait(clientLoans(id)),
  create: (client) => {
    clients.push(client);
    return wait(client);
  },
  update: (id, values) => {
    const item = clients.find((c) => c.id === id);
    Object.assign(item, values);
    return wait(item);
  },
  remove: (id) => {
    const index = clients.findIndex((c) => c.id === id);
    if (index >= 0) clients.splice(index, 1);
    return wait();
  },
};
export const loanService = {
  list: () => wait([...loans]),
  get: (id) => wait(loans.find((l) => l.id === id)),
  create: (loan) => {
    loans.push(loan);
    return wait(loan);
  },
  update: (id, values) => {
    const item = loans.find((l) => l.id === id);
    Object.assign(item, values);
    return wait(item);
  },
  remove: (id) => {
    const index = loans.findIndex((l) => l.id === id);
    if (index >= 0) loans.splice(index, 1);
    return wait();
  },
};
export const paymentService = {
  list: (id) => wait(payments.filter((payment) => payment.loanId === id)),
  // MVP has no online payment — this simulates an Admin/Bank Agent
  // confirming, in person, that the client paid an installment at the
  // branch. Backend wiring for this action lands in a later step.
  markPaid: (id, paidDate = new Date().toISOString().slice(0, 10)) => {
    const item = payments.find((payment) => payment.id === id);
    if (item) Object.assign(item, { status: "PAID", date: paidDate });
    return wait(item);
  },
  // Lets an Admin/Bank Agent undo a Mark as Paid confirmed by mistake. The
  // payment reverts to PENDING — if its due date has already passed, it
  // simply reappears as OVERDUE (derived), no separate "unpaid" flag needed.
  markUnpaid: (id) => {
    const item = payments.find((payment) => payment.id === id);
    if (item) Object.assign(item, { status: "PENDING", date: null });
    return wait(item);
  },
};
