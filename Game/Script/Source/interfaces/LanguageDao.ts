namespace DiceCup {
    export interface LanguageDao {
        menu: {
            singleplayer: {
                lobby: {
                    title: string;
                    start_button: string;
                    alerts: {
                        invalid_tokes: string;
                        identical_names: string;
                    }
                    difficulties: {
                        easy: string;
                        normal: string;
                        hard: string;
                    },
                },
                lobby_settings: {
                    title: string;
                }
            },
            multiplayer: {
                list: {
                    title: string;
                    create_button: string;
                    join_button: string;
                },
                lobby: {
                    title: string;
                    alert: string;
                    waiting: string;
                    start_button: string;
                }
            },
            help: {
                title: string;
            },
            settings: {
                title: string;
            },
            player: string;
        },
        game: {
            transition: {
                phrase_1: string;
                phrase_2: string;
                phrase_3: string;
            },
            categories: {
                title: string;
            },
            summary: {
                sum: string;
            },
            placements: {
                title: string;
                alerts: {
                    part_1: string;
                    part_2: string;
                } 
            }
        }
    }
}