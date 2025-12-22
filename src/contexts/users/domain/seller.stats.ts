export class SellerStats {
    public readonly id: string;
    public rating: number;
    public joinedDate: string;
    public responseTime: string;   
    public salesCount: number;
    public location: string;
    public description: string;

    constructor(
        id: string,
        rating: number,
        joinedDate: string,
        responseTime: string,
        salesCount: number,
        location: string,
        description: string,
    ) {
        this.id = id;
        this.rating = rating;
        this.joinedDate = joinedDate;
        this.responseTime = responseTime;
        this.salesCount = salesCount;
        this.location = location;
        this.description = description;
    }

    static createDefault(id: string): SellerStats {
        return new SellerStats(id, 0, "", "", 0, "", "");
    }
}
