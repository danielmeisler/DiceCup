namespace DiceCup {
    export interface ProbabilitiesDao {
        stringCategory: string;
        category: ScoringCategory;
        points: number;
        probability: number;
        value: number;
    }
}