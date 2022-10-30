class Life {
  registeredUserLife;
  guestUserLife;
  addedLifeForRegister;
  addedLifeForGuest;

  constructor() {
    this.registeredUserLife = 5;
    this.guestUserLife = 3;
    this.addedLifeForRegister = {
      amount: 0,
      dueTo: "",
    };
    this.addedLifeForGuest = {
      amount: 0,
      dueTo: "",
    };
  }
}

module.exports = Life;
