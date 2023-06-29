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
                }
            },
            multiplayer: {
                list: {
                    title: string;
                    create_button: string;
                    join_button: string;
                    password: string;
                },
                lobby: {
                    title: string;
                    waiting: string;
                    start_button: string;
                    ready_button: string;
                    not_ready_button: string;
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
                },
                help_category_hud: {
                    title: string;
                }
            },
            gamesettings: {
                title: string;
                password_switch: string;
                password: string;
                round_timer: string;
                round_timer_unit: string;
            },
            player: string;
            alerts: {
                invalid_tokes: string;
                invalid_length: string;
                identical_names: string;
                room_unavailable: string;
                ingame: string;
                waiting: string;
                offline: string;
                wrong_password: string;
                not_ready: string;
                min_player: string;
            },
            gamemodes: {
                normal: string;
                fast: string;
                slow: string;
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
                skip: string;
            },
            validation: {
                wait_for_validation: string;
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