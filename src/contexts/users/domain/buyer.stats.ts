export class BuyerStats {
    public readonly id: string;
    public purchasesCount: number;
    public totalSpent: number;

    constructor(
        id: string,
        purchasesCount: number,
        totalSpent: number,
    ) {
        this.id = id;
        this.purchasesCount = purchasesCount;
        this.totalSpent = totalSpent;
    }

    static createDefault(id: string): BuyerStats {
        return new BuyerStats(id, 0, 0);
    }
}
