class RateLimit {
    constructor(period, limit) {
        this.period = period;
        this.limit = limit;
    }

    setParams(period, limit) {
        this.period = period;
        this.limit = limit;
    }

    spend(amount) {
        if (this.used + amount <= this.limit) {
            this.used += amount;
            return true;
        }

        const now = Date.now();

        if (amount > this.limit || now - this.usageStart < this.period) return false;

        this.used = amount;
        this.usageStart = now;
        return true;
    }
}

export default RateLimit;