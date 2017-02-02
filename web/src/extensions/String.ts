interface String {
  firstAndLastCharacters(amount: number): string;
}

String.prototype.firstAndLastCharacters = function (amount: number) {
  return this.slice(0, amount) + '...' + this.slice(-amount);
};