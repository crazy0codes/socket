class Queue {
    constructor() {
        this.queue = [];
        this.offerCandidate = null;
        this.answerCandidate = null;
    }

    push(client) {
        this.queue.push(client);
    }

    pop() {
        if (this.queue.length < 2) {
            console.log("Not enough clients in the queue");
            return;
        }
        this.offerCandidate = this.queue.shift();
        this.answerCandidate = this.queue.shift();
    }

    print() {
        this.queue.forEach(candidate => console.log(candidate));
    }

    size() {
        return this.queue.length;
    }
}

module.exports = new Queue();
