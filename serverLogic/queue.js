class Queue {
    constructor() {
        this.queue = [];
    }

    push(client) {
        if (!this.queue.includes(client) && !client.inCall && !client.disconnected) {
            this.queue.push(client);
        }
    }

    pairClients() {
        while (this.queue.length >= 2) {
            const offer = this.queue.shift();
            const answer = this.queue.shift();

            if (
                offer.disconnected || answer.disconnected ||
                offer.inCall || answer.inCall
            ) {
                continue; // skip these and try the next pair
            }

            offer.inCall = true;
            answer.inCall = true;

            return { offer, answer };
        }
        return null;
    }

    removeClient(client) {
        this.queue = this.queue.filter(c => c !== client);
    }

    size() {
        return this.queue.length;
    }

    print() {
        this.queue.forEach(c => console.log(c.id));
    }
}

module.exports = new Queue();
