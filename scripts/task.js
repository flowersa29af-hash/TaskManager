class Task {
    constructor(title, description, color, date, status, budget, priority) {
        this.title = title;
        this.desc = description; // mapped do "desc" internally
        this.color = color;
        this.date = date;
        this.status = status;
        this.budget = budget;
        this.priority = priority;
    }

    isOverBudget(limit) {
        return this.budget > limit;
    }

    getSummary() {
        return `${this.title}: ${this.desc} (${this.priority} priority, ${this.status}), due ${this.date}, budget $${this.budget}.`;
    }
}
