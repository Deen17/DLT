
export interface transactionRow {
    transactionID: string;
    senderAccNum: string;
    senderRoutingNum: string;
    instrument: string;
    currency: string;
    receiverRoutingNum: string;
    receiverAccNum: string;
    amt: number;
    initial_amt: number;
    settled: boolean;
    mutations: (string | number)[][];
  }


export interface TransactionResponse {
    transactionID: string;
    senderAcctNum: string;
    senderRoutingNum: string;
    receiverAcctNum: string;
    receiverRoutingNum: string;
    currency: string;
    instrument: string;
    initial_amt: string;
    amt: string;
    settled: string;
    mutations: string
}

export class Transaction {
    public transactionID: string;
    public senderAccNum: string;
    public senderRoutingNum: string;
    public receiverAccNum: string;
    public receiverRoutingNum: string;
    public initial_amt: number;
    public amt: number;
    public currency: string;
    public instrument: string;
    public settled: boolean;
    public mutations: (string | number)[][]

    constructor(
        transactionID: string,
        senderAccNum: string,
        senderRoutingNum: string,
        receiverAccNum: string,
        receiverRoutingNum: string,
        initial_amt: string,
        amt: string,
        currency: string,
        instrument: string,
        settled: string,
        mutations: string
    ) {
        this.transactionID = transactionID,
            this.senderAccNum = senderAccNum,
            this.senderRoutingNum = senderRoutingNum,
            this.instrument = instrument,
            this.currency = currency,
            this.receiverRoutingNum = receiverRoutingNum,
            this.receiverAccNum = receiverAccNum,
            this.amt = +amt,
            this.initial_amt = +initial_amt,
            this.settled = "True" ? true : false,
            this.mutations = convertMutationsToObject(mutations)
    }
    public toJSON(): transactionRow{
        return {
            transactionID: this.transactionID,
            senderAccNum: this.senderAccNum,
            senderRoutingNum: this.senderRoutingNum,
            instrument: this.instrument,
            currency: this.currency,
            receiverRoutingNum: this.receiverRoutingNum,
            receiverAccNum: this.receiverAccNum,
            amt: this.amt,
            initial_amt: this.initial_amt,
            settled: this.settled,
            mutations: this.mutations
        }
    }
}

//  "[{'user:00010000': 50.0}, {'user:00010000': 50.0}]"
function convertMutationsToObject(str: string) {
    let field = str.substr(3, 13)
    let val = +str.substring(19, str.indexOf('}, {\''));
    let field2 = str.substr(str.indexOf('}, {\'') + 5, 13);
    let val2 = +str.substring(str.indexOf('}, {\'') + 21, str.lastIndexOf('}'));
    return [
        [field, val],
        [field2, val]
    ]
}


export function convertResponseToTransaction
    (response: TransactionResponse): Transaction {
    return new Transaction(
        response.transactionID,
        response.senderAcctNum,
        response.senderRoutingNum,
        response.receiverAcctNum,
        response.receiverRoutingNum,
        response.initial_amt,
        response.amt,
        response.currency,
        response.instrument,
        response.settled,
        response.mutations
    )
}
