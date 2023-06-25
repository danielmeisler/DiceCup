namespace DiceCup {
    export interface ProbabilitiesDao {
        name: string;
        category: ScoringCategory;
        points: number;
        probability: number;
        value: number;
    }
}