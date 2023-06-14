namespace DiceCup {
    export interface LanguageDao {
        menu: {
            singleplayer: {
                lobby: {
                    title: string;
                    start_button: string;
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
                    waiting: string;
                    start_button: string;
                }
            },
            help: {
                title: string;
                page: string;
                page_1: {
                    title: string;
                    content: string;
                },
                page_2: {
                    title: string;
                    content: string;
                },
                page_3: {
                    title: string;
                    content: string;
                },
                page_4: {
                    title: string;
                    content: string;
                }
            },
            settings: {
                title: string;
                reset_button: string;
                volume: {
                    music: string;
                    sfx: string;
                }
                language: {
                    title: string;
                    english: string;
                    german: string;
                }
            },
            player: string;
            alerts: {
                invalid_tokes: string;
                identical_names: string;
                room_unavailable: string;
                waiting: string;
                offline: string;
            }
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
                placement: {
                    part_1: string;
                    part_2: string;
                } 
            }
        }
    }
}