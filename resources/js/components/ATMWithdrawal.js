import React from 'react';
import ReactDOM from 'react-dom';

export default class ATMWithdrawal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            amount: 0,
            bills: [1000, 1000, 500, 500, 500, 100, 100, 100, 100, 100],
            dispense: [],
            availBal: 0,
            totalDispense: 0,
            showError: false,
            errorMessage: null,
        };
        this.init = this.init.bind(this);
        this.setAmount = this.setAmount.bind(this);
        this.withdraw = this.withdraw.bind(this);
        this.handleDispenser = this.handleDispenser.bind(this);
        this.denCounter = this.denCounter.bind(this);
    }

    componentDidMount() {
        this.init();
    }

    init() {
        var availBal = 0;
        this.state.bills.forEach(bill => {
            availBal += bill;
        });
        this.setState({ availBal: availBal });
    }

    setAmount(e) {
        this.setState({ amount: e.target.value });
    }

    withdraw(e) {
        e.preventDefault();
        this.setState({ dispense: [] });
        if (Number(this.state.amount) == 0) {
            alert("Please input a number greater than 0");
            return;
        }
        // get bills
        var amount = Number(this.state.amount);
        var dispense = [];
        console.log("Amount", amount);
        console.log("Available Bills", this.state.bills);
        var notesCounter = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (var i = 0; i < this.state.bills.length; i++) {
            if (amount >= this.state.bills[i]) {
                notesCounter[i] = parseInt(Number(amount / this.state.bills[i]));
                amount = amount - notesCounter[i] * this.state.bills[i];
            }
        }
        // currency count
        for (var j = 0; j < this.state.bills.length; j++) {
            if (notesCounter[j] != 0) {
                dispense.push({
                    bill: this.state.bills[j],
                    quantity: notesCounter[j]
                });
            }
        }
        console.log("Dispense", dispense);
        this.handleDispenser(dispense);
    }

    handleDispenser(dispense) {
        console.log("Handling Cash Dispensing");
        // check each denomination in the object 
        // and verify if it is available
        let temp_bills = this.state.bills, totDispense = 0;
        dispense.forEach(cash => {
            console.log("Checking Cash");
            var checker = this.denCounter(cash);
            if (!checker.isValid) {
                console.log("UNABLE TO DISPENSE CASH");
                this.setState({ dispense: [], showError: true, errorMessage: "Temporarily unable to dispense cash" });
                return;
            } else {
                temp_bills = checker.bills;
                // remove any used bill from the ATM
                let remove_counter = 0;
                temp_bills.forEach((item, index) => {
                    if (item == cash.bill && remove_counter <= cash.quantity) {
                        temp_bills.splice(index, 1);
                        remove_counter++;
                    }
                });
                totDispense = this.state.totalDispense + Number(this.state.amount);
            }
        });
        if (totDispense > 0) {
            this.setState({ totalDispense: totDispense });
        }
        this.setState({ dispense: dispense, bills: temp_bills });
        this.init();
    }

    denCounter(cash) {
        console.log("Checking if ATM has sufficient denominations", cash);
        // search through the array of denominations and check if the available quantity exists
        let max = cash.quantity;
        let value = cash.bill;
        let counter = 0;
        let bills = this.state.bills;
        bills.forEach((item) => {
            if (item == value) {
                counter++;
            }
        });
        if (counter >= max) {
            // this.setState({ bills: bills });
            return { isValid: true, bills: bills };
        }
        return { isValid: false, bills: bills };
    }

    render() {
        return (
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="card">
                            <div className="card-header">ATMWithdrawal</div>
                            <div className="card-body">
                                {this.state.showError ?
                                    <div className="alert alert-danger">
                                        <p className="lead">{this.state.errorMessage}</p>
                                        <button className="btn btn-primary btn-block" onClick={() => this.setState({ dispense: [], errorMessage: null, showError: false, amount: 0 })}>Perform another transaction</button>
                                    </div>
                                    :
                                    this.state.dispense.length == 0 ?
                                        <React.Fragment>
                                            <div className="alert alert-info">Kindly input amount</div>
                                            <form onSubmit={this.withdraw}>
                                                <div className="md-form mx-5">
                                                    <input type="number" className="form-control" defaultValue={this.state.amount} onChange={this.setAmount} required />
                                                </div>
                                                <div className="md-form">
                                                    <button className="btn btn-block btn-success" type="submit">Withdraw</button>
                                                </div>
                                            </form>
                                        </React.Fragment>
                                        :
                                        <React.Fragment>
                                            <div className="alert alert-success">Please take your cash</div>
                                            <ul className="list-group">
                                                {this.state.dispense.map(cash => {
                                                    return (
                                                        <li key={cash.bill} className="list-group-item">{cash.quantity + " X $" + cash.bill}</li>
                                                    )
                                                })}
                                            </ul>
                                            <button className="btn btn-primary btn-block" onClick={() => this.setState({ dispense: [], amount: 0 })}>Perform another transaction</button>
                                        </React.Fragment>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 mx-auto">
                        <div className="navbar grey darken-4">
                            <h4 className="h4-responsive white-text">Available Bills</h4>
                        </div>
                        <ul className="list-group">
                            {this.state.bills.map((bill, index) => {
                                return (
                                    <li key={index} className="list-group-item">{bill}</li>
                                )
                            })}
                        </ul>
                    </div>
                    <div className="mt-4 col-md-8 mx-auto" style={{ textAlign: "center" }}>
                        <strong>Available Balance: ${this.state.availBal}</strong>
                        <br />
                        <strong>Total Dispensed: ${this.state.totalDispense}</strong>
                    </div>
                </div>
            </div>
        );
    }
}

// export default ATMWithdrawal;

if (document.getElementById('atmWithdrawal')) {
    ReactDOM.render(<ATMWithdrawal />, document.getElementById('atmWithdrawal'));
}
