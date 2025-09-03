const allowedTransitions = {
    initial: ["inProgress", "cancelled"],
    inProgress: ["completed", "failed", "cancelled"],
    failed: ["inProgress", "cancelled"],
    completed: [],
    cancelled: []
};

export function canTransition(from, to) {
    const allowed = allowedTransitions[from] || [];
    return allowed.includes(to);
}
