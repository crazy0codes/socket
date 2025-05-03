class Queue {
    constructor() {
        this.queue = [];
    }

    push(client) {
        if (!this.queue.includes(client)) {
            this.queue.push(client);
        }
    }

    pairClients() {
        if (this.queue.length < 2) {
            console.log("Not enough clients in the queue");
            return null;
        }
        const offer = this.queue.shift();
        const answer = this.queue.shift();
        return { offer, answer };
    }

    removeClient(client) {
        this.queue = this.queue.filter(c => c !== client);
    }

    print() {
        this.queue.forEach(candidate => console.log(candidate));
    }

    size() {
        return this.queue.length;
    }
}

module.exports = new Queue();
