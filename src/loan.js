export default class Loan {
  constructor(amount, borrower_name, lender_name) {
    this.amount = amount
    this.borrower_name = borrower_name
    this.lender_name = lender_name
  }

  setOwner(owner) {
    this._owners = [owner]
  }
}
