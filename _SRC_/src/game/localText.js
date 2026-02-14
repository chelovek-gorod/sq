import { getDeviceType } from "../app/application"
import { createEnum } from "../utils/functions"
import { PET, PLACE } from "./scenes/game/constants"
import { TASK } from "./scenes/world/constants"

const isMobile = getDeviceType() !== 'desktop'

export const TEXT_GET_FIRST_CLICK = {
    en: isMobile ? 'Tap to start' : 'Click to start',
    ru: 'Нажми, чтобы начать', // универсально
    tr: isMobile ? 'Başlamak için dokun' : 'Başlamak için tıkla',
    es: isMobile ? 'Toca para empezar' : 'Haz clic para empezar',
    de: isMobile ? 'Zum Starten tippen' : 'Zum Starten klicken',
    pt: isMobile ? 'Toque para começar' : 'Clique para começar',
    fr: isMobile ? 'Appuyez pour commencer' : 'Cliquez pour commencer',
    pl: isMobile ? 'Dotknij, aby rozpocząć' : 'Kliknij, aby rozpocząć',
    it: isMobile ? 'Tocca per iniziare' : 'Clicca per iniziare',
    nl: isMobile ? 'Tik om te beginnen' : 'Klik om te beginnen',
    cs: isMobile ? 'Klepněte pro start' : 'Klikněte pro start'
}

export const TEXT_BUTTON_TYPE = createEnum(['START', 'OK', 'RETRY'])
export const TEXT_BUTTON = {
    [TEXT_BUTTON_TYPE.START]: {
        en: 'Play',
        ru: 'Играть',
        tr: 'Oyna',
        es: 'Jugar',
        de: 'Spielen',
        pt: 'Jogar',
        fr: 'Jouer',
        pl: 'Graj',
        it: 'Gioca',
        nl: 'Spelen',
        cs: 'Hrát'
    },
    [TEXT_BUTTON_TYPE.OK]: {
        en: 'Ok',
        ru: 'Хорошо',
        tr: 'Tamam',
        es: 'Ok',
        de: 'Ok',
        pt: 'Ok',
        fr: 'Ok',
        pl: 'Ok',
        it: 'Ok',
        nl: 'Ok',
        cs: 'Ok'
    },
    [TEXT_BUTTON_TYPE.RETRY]: {
        en: 'Again',
        ru: 'Заново',
        tr: 'Tekrar',
        es: 'Otra vez',
        de: 'Nochmal',
        pt: 'Repetir',
        fr: 'Encore',
        pl: 'Jeszcze',
        it: 'Ancora',
        nl: 'Opnieuw',
        cs: 'Znovu'
    }
}

export const TEXT_SQUINKI_NAME = {
    // Саванна / Джунгли
    [PET.Zebra]: {
        en: 'Zebra',
        ru: 'Зебра',
        tr: 'Zebra',
        es: 'Cebra',
        de: 'Zebra',
        pt: 'Zebra',
        fr: 'Zèbre',
        pl: 'Zebra',
        it: 'Zebra',
        nl: 'Zebra',
        cs: 'Zebra'
    },
    [PET.Parrot]: {
        en: 'Parrot',
        ru: 'Попугай',
        tr: 'Papağan',
        es: 'Loro',
        de: 'Papagei',
        pt: 'Papagaio',
        fr: 'Perroquet',
        pl: 'Papuga',
        it: 'Pappagallo',
        nl: 'Papegaai',
        cs: 'Papoušek'
    },
    [PET.Ostrich]: {
        en: 'Ostrich',
        ru: 'Страус',
        tr: 'Devekuşu',
        es: 'Avestruz',
        de: 'Strauß',
        pt: 'Avestruz',
        fr: 'Autruche',
        pl: 'Struś',
        it: 'Struzzo',
        nl: 'Struisvogel',
        cs: 'Pštros'
    },
    [PET.Monkey]: {
        en: 'Monkey',
        ru: 'Обезьяна',
        tr: 'Maymun',
        es: 'Mono',
        de: 'Affe',
        pt: 'Macaco',
        fr: 'Singe',
        pl: 'Małpa',
        it: 'Scimmia',
        nl: 'Aap',
        cs: 'Opice'
    },
    [PET.Lion]: {
        en: 'Lion',
        ru: 'Лев',
        tr: 'Aslan',
        es: 'León',
        de: 'Löwe',
        pt: 'Leão',
        fr: 'Lion',
        pl: 'Lew',
        it: 'Leone',
        nl: 'Leeuw',
        cs: 'Lev'
    },
    [PET.Kangaroo]: {
        en: 'Kangaroo',
        ru: 'Кенгуру',
        tr: 'Kanguru',
        es: 'Canguro',
        de: 'Känguru',
        pt: 'Canguru',
        fr: 'Kangourou',
        pl: 'Kangur',
        it: 'Canguro',
        nl: 'Kangoeroe',
        cs: 'Klokan'
    },
    [PET.Jerboa]: {
        en: 'Jerboa',
        ru: 'Тушканчик',
        tr: 'Jerboa',
        es: 'Jerbo',
        de: 'Jerboa',
        pt: 'Jerboa',
        fr: 'Gerboise',
        pl: 'Jerboa',
        it: 'Gerboa',
        nl: 'Jerboa',
        cs: 'Jerboa'
    },
    [PET.Giraffe]: {
        en: 'Giraffe',
        ru: 'Жираф',
        tr: 'Zürafa',
        es: 'Jirafa',
        de: 'Giraffe',
        pt: 'Girafa',
        fr: 'Girafe',
        pl: 'Żyrafa',
        it: 'Giraffa',
        nl: 'Giraf',
        cs: 'Žirafa'
    },
    [PET.Elephant]: {
        en: 'Elephant',
        ru: 'Слон',
        tr: 'Fil',
        es: 'Elefante',
        de: 'Elefant',
        pt: 'Elefante',
        fr: 'Éléphant',
        pl: 'Słoń',
        it: 'Elefante',
        nl: 'Olifant',
        cs: 'Slon'
    },
    [PET.Capybara]: {
        en: 'Capybara',
        ru: 'Капибара',
        tr: 'Kapibara',
        es: 'Capibara',
        de: 'Capybara',
        pt: 'Capivara',
        fr: 'Capybara',
        pl: 'Kapibara',
        it: 'Capibara',
        nl: 'Capibara',
        cs: 'Kapybara'
    },

    // Арктика
    [PET.Walrus]: {
        en: 'Walrus',
        ru: 'Морж',
        tr: 'Mors',
        es: 'Morsa',
        de: 'Walross',
        pt: 'Morsa',
        fr: 'Morse',
        pl: 'Mors',
        it: 'Tricheco',
        nl: 'Walrus',
        cs: 'Mrož'
    },
    [PET.SnowyOwl]: {
        en: 'Snowy Owl',
        ru: 'Полярная сова',
        tr: 'Kar Baykuşu',
        es: 'Búho Nival',
        de: 'Schneeeule',
        pt: 'Coruja-das-neves',
        fr: 'Harfang',
        pl: 'Sowa śnieżna',
        it: 'Gufo delle nevi',
        nl: 'Sneeuwuil',
        cs: 'Sova sněžní'
    },
    [PET.Reindeer]: {
        en: 'Reindeer',
        ru: 'Северный олень',
        tr: 'Ren Geyiği',
        es: 'Reno',
        de: 'Rentier',
        pt: 'Rena',
        fr: 'Renne',
        pl: 'Renifer',
        it: 'Rangifero',
        nl: 'Rendier',
        cs: 'Sob'
    },
    [PET.PolarBear]: {
        en: 'Polar Bear',
        ru: 'Белый медведь',
        tr: 'Kutup Ayısı',
        es: 'Oso Polar',
        de: 'Eisbär',
        pt: 'Urso Polar',
        fr: 'Ours Blanc',
        pl: 'Niedźwiedź Polarny',
        it: 'Orso Polare',
        nl: 'IJsbeer',
        cs: 'Lední Medvěd'
    },
    [PET.Penguin]: {
        en: 'Penguin',
        ru: 'Пингвин',
        tr: 'Penguen',
        es: 'Pingüino',
        de: 'Pinguin',
        pt: 'Pinguim',
        fr: 'Manchot',
        pl: 'Pingwin',
        it: 'Pinguino',
        nl: 'Pinguïn',
        cs: 'Tučňák'
    },
    [PET.Narwhal]: {
        en: 'Narwhal',
        ru: 'Нарвал',
        tr: 'Narval',
        es: 'Narval',
        de: 'Narwal',
        pt: 'Narval',
        fr: 'Narval',
        pl: 'Narwal',
        it: 'Narvalo',
        nl: 'Narwal',
        cs: 'Narval'
    },
    [PET.Lemming]: {
        en: 'Lemming',
        ru: 'Лемминг',
        tr: 'Lemming',
        es: 'Lemming',
        de: 'Lemming',
        pt: 'Lemming',
        fr: 'Lemming',
        pl: 'Leming',
        it: 'Lemming',
        nl: 'Lemming',
        cs: 'Lemming'
    },
    [PET.KillerWhale]: {
        en: 'Killer Whale',
        ru: 'Косатка',
        tr: 'Katil Balina',
        es: 'Orca',
        de: 'Schwertwal',
        pt: 'Orca',
        fr: 'Orque',
        pl: 'Orka',
        it: 'Orca',
        nl: 'Orka',
        cs: 'Kosatka'
    },
    [PET.BelugaWhale]: {
        en: 'Beluga',
        ru: 'Белуха',
        tr: 'Beluga',
        es: 'Beluga',
        de: 'Beluga',
        pt: 'Baleia-branca',
        fr: 'Bélouga',
        pl: 'Białucha',
        it: 'Beluga',
        nl: 'Beluga',
        cs: 'Běluha'
    },
    [PET.ArcticFox]: {
        en: 'Arctic Fox',
        ru: 'Песец',
        tr: 'Kutup Tilkisi',
        es: 'Zorro Polar',
        de: 'Polarfuchs',
        pt: 'Raposa-do-Ártico',
        fr: 'Renard Polaire',
        pl: 'Lis polarny',
        it: 'Volpe artica',
        nl: 'Poolvos',
        cs: 'Liška polární'
    },

    // Ферма (здесь малыши)
    [PET.Mouse]: {
        en: 'Mouse',
        ru: 'Мышь',
        tr: 'Fare',
        es: 'Ratón',
        de: 'Maus',
        pt: 'Rato',
        fr: 'Souris',
        pl: 'Mysz',
        it: 'Topo',
        nl: 'Muis',
        cs: 'Myš'
    },
    [PET.Lamb]: {
        en: 'Lamb',
        ru: 'Ягнёнок',
        tr: 'Kuzu',
        es: 'Cordero',
        de: 'Lamm',
        pt: 'Cordeiro',
        fr: 'Agneau',
        pl: 'Baranek',
        it: 'Agnello',
        nl: 'Lam',
        cs: 'Beránek'
    },
    [PET.Filly]: {
        en: 'Pony',
        ru: 'Пони',
        tr: 'Poni',
        es: 'Poni',
        de: 'Pony',
        pt: 'Pônei',
        fr: 'Poney',
        pl: 'Kucyk',
        it: 'Pony',
        nl: 'Pony',
        cs: 'Poník'
    },
    [PET.Duck]: {
        en: 'Duckling',
        ru: 'Утёнок',
        tr: 'Ördek Yavrusu',
        es: 'Patito',
        de: 'Entenküken',
        pt: 'Pato',
        fr: 'Caneton',
        pl: 'Kaczuszka',
        it: 'Anatroccolo',
        nl: 'Eendje',
        cs: 'Káčátko'
    },
    [PET.Dog]: {
        en: 'Puppy',
        ru: 'Собачка',
        tr: 'Köpek Yavrusu',
        es: 'Perrito',
        de: 'Hündchen',
        pt: 'Cachorro',
        fr: 'Chiot',
        pl: 'Piesek',
        it: 'Cagnolino',
        nl: 'Hondje',
        cs: 'Štěně'
    },
    [PET.Chick]: {
        en: 'Chick',
        ru: 'Цыплёнок',
        tr: 'Civciv',
        es: 'Pollito',
        de: 'Küken',
        pt: 'Pintinho',
        fr: 'Poussin',
        pl: 'Pisklę',
        it: 'Pulcino',
        nl: 'Kuikentje',
        cs: 'Kuře'
    },
    [PET.Cat]: {
        en: 'Kitten',
        ru: 'Котик',
        tr: 'Kedi Yavrusu',
        es: 'Gatito',
        de: 'Kätzchen',
        pt: 'Gato',
        fr: 'Chaton',
        pl: 'Kotek',
        it: 'Gattino',
        nl: 'Poesje',
        cs: 'Koťátko'
    },
    [PET.Bunny]: {
        en: 'Rabbit',
        ru: 'Кролик',
        tr: 'Tavşan',
        es: 'Conejo',
        de: 'Kaninchen',
        pt: 'Coelho',
        fr: 'Lapin',
        pl: 'Królik',
        it: 'Coniglio',
        nl: 'Konijn',
        cs: 'Králík'
    },
    [PET.Mole]: {
        en: 'Mole',
        ru: 'Крот',
        tr: 'Köstebek',
        es: 'Topo',
        de: 'Maulwurf',
        pt: 'Toupeira',
        fr: 'Taupe',
        pl: 'Kret',
        it: 'Talpa',
        nl: 'Mol',
        cs: 'Krtek'
    },
    [PET.Bat]: {
        en: 'Bat',
        ru: 'Летучая мышь',
        tr: 'Yarasa',
        es: 'Murciélago',
        de: 'Fledermaus',
        pt: 'Morcego',
        fr: 'Chauve-souris',
        pl: 'Nietoperz',
        it: 'Pipistrello',
        nl: 'Vleermuis',
        cs: 'Netopýr'
    },

    // Подводный мир
    [PET.Zebrasoma]: {
        en: 'Fish',
        ru: 'Рыбка',
        tr: 'Balık',
        es: 'Pez',
        de: 'Fisch',
        pt: 'Peixe',
        fr: 'Poisson',
        pl: 'Ryba',
        it: 'Pesce',
        nl: 'Vis',
        cs: 'Ryba'
    },
    [PET.Turtle]: {
        en: 'Turtle',
        ru: 'Черепаха',
        tr: 'Kaplumbağa',
        es: 'Tortuga',
        de: 'Schildkröte',
        pt: 'Tartaruga',
        fr: 'Tortue',
        pl: 'Żółw',
        it: 'Tartaruga',
        nl: 'Schildpad',
        cs: 'Želva'
    },
    [PET.Shark]: {
        en: 'Shark',
        ru: 'Акула',
        tr: 'Köpek Balığı',
        es: 'Tiburón',
        de: 'Hai',
        pt: 'Tubarão',
        fr: 'Requin',
        pl: 'Rekin',
        it: 'Squalo',
        nl: 'Haai',
        cs: 'Žralok'
    },
    [PET.Seal]: {
        en: 'Seal',
        ru: 'Тюлень',
        tr: 'Fok',
        es: 'Foca',
        de: 'Seehund',
        pt: 'Foca',
        fr: 'Phoque',
        pl: 'Foka',
        it: 'Foca',
        nl: 'Zeehond',
        cs: 'Tuleň'
    },
    [PET.SeaHorse]: {
        en: 'Seahorse',
        ru: 'Морской конёк',
        tr: 'Deniz Atı',
        es: 'Caballito de Mar',
        de: 'Seepferdchen',
        pt: 'Cavalo-Marinho',
        fr: 'Hippocampe',
        pl: 'Konik Morski',
        it: 'Cavalluccio Marino',
        nl: 'Zeepaardje',
        cs: 'Mořský Koníček'
    },
    [PET.Octopus]: {
        en: 'Octopus',
        ru: 'Осьминог',
        tr: 'Ahtapot',
        es: 'Pulpo',
        de: 'Krake',
        pt: 'Polvo',
        fr: 'Pieuvre',
        pl: 'Ośmiornica',
        it: 'Polpo',
        nl: 'Octopus',
        cs: 'Chobotnice'
    },
    [PET.Goldfish]: {
        en: 'Goldfish',
        ru: 'Золотая рыбка',
        tr: 'Japon Balığı',
        es: 'Pez Dorado',
        de: 'Goldfisch',
        pt: 'Peixe Dourado',
        fr: 'Poisson Rouge',
        pl: 'Złota Rybka',
        it: 'Pesce Rosso',
        nl: 'Goudvis',
        cs: 'Zlatá Rybka'
    },
    [PET.Dolphin]: {
        en: 'Dolphin',
        ru: 'Дельфин',
        tr: 'Yunus',
        es: 'Delfín',
        de: 'Delfin',
        pt: 'Golfinho',
        fr: 'Dauphin',
        pl: 'Delfin',
        it: 'Delfino',
        nl: 'Dolfijn',
        cs: 'Delfín'
    },
    [PET.Cuttlefish]: {
        en: 'Cuttlefish',
        ru: 'Каракатица',
        tr: 'Mürekkep Balığı',
        es: 'Sepia',
        de: 'Sepia',
        pt: 'Choco',
        fr: 'Seiche',
        pl: 'Mątwa',
        it: 'Seppia',
        nl: 'Zeekat',
        cs: 'Sépie'
    },
    [PET.Axolotl]: {
        en: 'Axolotl',
        ru: 'Аксолотль',
        tr: 'Aksolotl',
        es: 'Ajolote',
        de: 'Axolotl',
        pt: 'Axolote',
        fr: 'Axolotl',
        pl: 'Aksolotl',
        it: 'Assolotto',
        nl: 'Axolotl',
        cs: 'Axolotl'
    },

    // Лес
    [PET.WhiteTiger]: {
        en: 'White Tiger',
        ru: 'Белый тигр',
        tr: 'Beyaz Kaplan',
        es: 'Tigre Blanco',
        de: 'Weißer Tiger',
        pt: 'Tigre Branco',
        fr: 'Tigre Blanc',
        pl: 'Biały Tygrys',
        it: 'Tigre Bianco',
        nl: 'Witte Tijger',
        cs: 'Bílý Tygr'
    },
    [PET.Snake]: {
        en: 'Snake',
        ru: 'Змея',
        tr: 'Yılan',
        es: 'Serpiente',
        de: 'Schlange',
        pt: 'Cobra',
        fr: 'Serpent',
        pl: 'Wąż',
        it: 'Serpente',
        nl: 'Slang',
        cs: 'Had'
    },
    [PET.Raccoon]: {
        en: 'Raccoon',
        ru: 'Енот',
        tr: 'Rakun',
        es: 'Mapache',
        de: 'Waschbär',
        pt: 'Guaxinim',
        fr: 'Raton Laveur',
        pl: 'Szop',
        it: 'Procione',
        nl: 'Wasbeer',
        cs: 'Mýval'
    },
    [PET.Peacock]: {
        en: 'Peacock',
        ru: 'Павлин',
        tr: 'Tavus Kuşu',
        es: 'Pavo Real',
        de: 'Pfau',
        pt: 'Pavão',
        fr: 'Paon',
        pl: 'Paw',
        it: 'Pavone',
        nl: 'Pauw',
        cs: 'Páv'
    },
    [PET.Panda]: {
        en: 'Panda',
        ru: 'Панда',
        tr: 'Panda',
        es: 'Panda',
        de: 'Panda',
        pt: 'Panda',
        fr: 'Panda',
        pl: 'Panda',
        it: 'Panda',
        nl: 'Panda',
        cs: 'Panda'
    },
    [PET.Koala]: {
        en: 'Koala',
        ru: 'Коала',
        tr: 'Koala',
        es: 'Koala',
        de: 'Koala',
        pt: 'Coala',
        fr: 'Koala',
        pl: 'Koala',
        it: 'Koala',
        nl: 'Koala',
        cs: 'Koala'
    },
    [PET.Frog]: {
        en: 'Frog',
        ru: 'Лягушка',
        tr: 'Kurbağa',
        es: 'Rana',
        de: 'Frosch',
        pt: 'Sapo',
        fr: 'Grenouille',
        pl: 'Żaba',
        it: 'Rana',
        nl: 'Kikker',
        cs: 'Žába'
    },
    [PET.Panther]: {
        en: 'Panther',
        ru: 'Пантера',
        tr: 'Panter',
        es: 'Pantera',
        de: 'Panther',
        pt: 'Pantera',
        fr: 'Panthère',
        pl: 'Pantera',
        it: 'Pantera',
        nl: 'Panter',
        cs: 'Panter'
    },
    [PET.Chameleon]: {
        en: 'Chameleon',
        ru: 'Хамелеон',
        tr: 'Bukalemun',
        es: 'Camaleón',
        de: 'Chamäleon',
        pt: 'Camaleão',
        fr: 'Caméléon',
        pl: 'Kameleon',
        it: 'Camaleonte',
        nl: 'Kameleon',
        cs: 'Chameleon'
    },
    [PET.Beaver]: {
        en: 'Beaver',
        ru: 'Бобр',
        tr: 'Kunduz',
        es: 'Castor',
        de: 'Biber',
        pt: 'Castor',
        fr: 'Castor',
        pl: 'Bóbr',
        it: 'Castoro',
        nl: 'Bever',
        cs: 'Bobr'
    },

    // Мифические
    [PET.Dragon]: {
        en: 'Dragon',
        ru: 'Дракон',
        tr: 'Ejderha',
        es: 'Dragón',
        de: 'Drache',
        pt: 'Dragão',
        fr: 'Dragon',
        pl: 'Smok',
        it: 'Drago',
        nl: 'Draak',
        cs: 'Drak'
    }
}

export const TEXT_PLACE = {
    [PLACE.Arctic]: {
        en: 'Arctic',
        ru: 'Арктика',
        tr: 'Kutup',
        es: 'Ártico',
        de: 'Arktis',
        pt: 'Ártico',
        fr: 'Arctique',
        pl: 'Arktyka',
        it: 'Artico',
        nl: 'Arctis',
        cs: 'Arktida'
    },
    [PLACE.Farm]: {
        en: 'Farm',
        ru: 'Ферма',
        tr: 'Çiftlik',
        es: 'Granja',
        de: 'Bauernhof',
        pt: 'Fazenda',
        fr: 'Ferme',
        pl: 'Farma',
        it: 'Fattoria',
        nl: 'Boerderij',
        cs: 'Farma'
    },
    [PLACE.Jungle]: {
        en: 'Forest',
        ru: 'Лес',
        tr: 'Orman',
        es: 'Bosque',
        de: 'Wald',
        pt: 'Floresta',
        fr: 'Forêt',
        pl: 'Las',
        it: 'Foresta',
        nl: 'Bos',
        cs: 'Les'
    },
    [PLACE.Ocean]: {
        en: 'Ocean',
        ru: 'Океан',
        tr: 'Okyanus',
        es: 'Océano',
        de: 'Ozean',
        pt: 'Oceano',
        fr: 'Océan',
        pl: 'Ocean',
        it: 'Oceano',
        nl: 'Oceaan',
        cs: 'Oceán'
    },
    [PLACE.Savannah]: {
        en: 'Savannah',
        ru: 'Саванна',
        tr: 'Savana',
        es: 'Sabana',
        de: 'Savanne',
        pt: 'Savana',
        fr: 'Savane',
        pl: 'Sawanna',
        it: 'Savana',
        nl: 'Savanne',
        cs: 'Savana'
    }
}

export const TEXT_SQUINKI_LEVEL = {
    en: 'Level',
    ru: 'Уровень',
    tr: 'Seviye',
    es: 'Nivel',
    de: 'Level',
    pt: 'Nível',
    fr: 'Niveau',
    pl: 'Poziom',
    it: 'Livello',
    nl: 'Level',
    cs: 'Úroveň'
}
export const TEXT_SQUINKI_BIOM = {
    en: 'Native biome:',
    ru: 'Родной биом:',
    tr: 'Doğal ortam:',
    es: 'Bioma nativo:',
    de: 'Heimatbiom:',
    pt: 'Bioma nativo:',
    fr: 'Biome d\'origine:',
    pl: 'Naturalne środowisko:',
    it: 'Bioma nativo:',
    nl: 'Natuurlijke leefomgeving:',
    cs: 'Domovský biom:'
}

export const TEXT_TASK_TITLE = {
    [TASK.NEW]: {
        en: 'Unlock new Squinki',
        ru: 'Открой нового Сквинки',
        tr: 'Yeni Squinki aç',
        es: 'Descubre nuevo Squinki',
        de: 'Neues Squinki freischalten',
        pt: 'Desbloqueie novo Squinki',
        fr: 'Débloque un nouveau Squinki',
        pl: 'Odblokuj nowego Squinki',
        it: 'Sblocca nuovo Squinki',
        nl: 'Ontgrendel nieuwe Squinki',
        cs: 'Odemkni nového Squinki'
    },
    [TASK.CLOUD]: {
        en: 'Clear all clouds',
        ru: 'Разгони все тучи',
        tr: 'Tüm bulutları dağıt',
        es: 'Despeja todas las nubes',
        de: 'Alle Wolken vertreiben',
        pt: 'Limpe todas as nuvens',
        fr: 'Chasse tous les nuages',
        pl: 'Rozgarnij wszystkie chmury',
        it: 'Spazza via tutte le nuvole',
        nl: 'Verjaag alle wolken',
        cs: 'Zažeň všechny mraky'
    },
    [TASK.LOCK]: {
        en: 'Open all locks',
        ru: 'Открой все замки',
        tr: 'Tüm kilitleri aç',
        es: 'Abre todos los candados',
        de: 'Öffne alle Schlösser',
        pt: 'Abra todos os cadeados',
        fr: 'Ouvre tous les cadenas',
        pl: 'Otwórz wszystkie zamki',
        it: 'Apri tutti i lucchetti',
        nl: 'Open alle sloten',
        cs: 'Otevři všechny zámky'
    }
}

export const TEXT_TASK_DESCRIPTION = {
    [TASK.NEW]: {
        en: 'Merge two same Squinki to unlock a new one',
        ru: 'Соедини двух одинаковых Сквинки, чтобы открыть нового',
        tr: 'İki aynı Squinki\'yi birleştir, yenisini aç',
        es: 'Fusiona dos Squinki iguales para descubrir uno nuevo',
        de: 'Verbinde zwei gleiche Squinki, um ein neues freizuschalten',
        pt: 'Combine dois Squinki iguais para desbloquear um novo',
        fr: 'Fusionne deux Squinki identiques pour débloquer un nouveau',
        pl: 'Połącz dwa takie same Squinki, aby odblokować nowego',
        it: 'Unisci due Squinki uguali per sbloccarne uno nuovo',
        nl: 'Voeg twee dezelfde Squinki samen om een nieuwe te ontgrendelen',
        cs: 'Spoj dva stejné Squinki a odemkni nového'
    },
    [TASK.CLOUD]: {
        en: 'Merge two Squinki next to a cloud — and it will disappear',
        ru: 'Соединяй двух Сквинки на соседних с тучей клетках — и тучи исчезнут',
        tr: 'Bulutun yanındaki iki Squinki\'yi birleştir — bulut kaybolur',
        es: 'Fusiona dos Squinki junto a una nube — y desaparecerá',
        de: 'Verbinde zwei Squinki neben einer Wolke — und sie verschwindet',
        pt: 'Combine dois Squinki ao lado de uma nuvem — e ela desaparece',
        fr: 'Fusionne deux Squinki à côté d\'un nuage — et il disparaît',
        pl: 'Połącz dwa Squinki obok chmury — a zniknie',
        it: 'Unisci due Squinki accanto a una nuvola — e sparirà',
        nl: 'Voeg twee Squinki naast een wolk samen — en hij verdwijnt',
        cs: 'Spoj dva Squinki vedle mraku — a ten zmizí'
    },
    [TASK.LOCK]: {
        en: 'Collect 10 Glimmers — unlock one random lock',
        ru: 'Собери 10 сияний — откроется один случайный замок',
        tr: '10 Parıltı topla — rastgele bir kilit açılır',
        es: 'Reúne 10 Destellos — abre un candado al azar',
        de: 'Sammle 10 Glitzer — ein zufälliges Schloss öffnet sich',
        pt: 'Colete 10 Brilhos — um cadeado aleatório é aberto',
        fr: 'Collecte 10 Étincelles — déverrouille un cadenas aléatoire',
        pl: 'Zbierz 10 Błysków — odblokuj losowy zamek',
        it: 'Raccogli 10 Bagliori — sblocca un lucchetto casuale',
        nl: 'Verzamel 10 Glinsteringen — open een willekeurig slot',
        cs: 'Nasbírej 10 Září — odemkni náhodný zámek'
    }
}

// TEXT_TASK_TURNS['ru'](12) вернёт: «За 12 ходов!»
export const TEXT_TASK_TURNS = {
    en: (turns) => `In ${turns} moves!`,
    ru: (turns) => `За ${turns} ходов!`,
    tr: (turns) => `${turns} hamlede!`,
    es: (turns) => `¡En ${turns} movimientos!`,
    de: (turns) => `In ${turns} Zügen!`,
    pt: (turns) => `Em ${turns} movimentos!`,
    fr: (turns) => `En ${turns} coups !`,
    pl: (turns) => `W ${turns} ruchach!`,
    it: (turns) => `In ${turns} mosse!`,
    nl: (turns) => `In ${turns} zetten!`,
    cs: (turns) => `Za ${turns} tahů!`,
}

export const TEXT_HELP_DRAGON_TITLE = {
    en: 'Magical Dragon',
    ru: 'Волшебный дракон',
    tr: 'Sihirli Ejderha',
    es: 'Dragón Mágico',
    de: 'Magischer Drache',
    pt: 'Dragão Mágico',
    fr: 'Dragon Magique',
    pl: 'Magiczny Smok',
    it: 'Drago Magico',
    nl: 'Magische Draak',
    cs: 'Magický Drak'
}

export const TEXT_HELP_GET_DRAGON_DESCRIPTION = {
    en: 'Collect 10 Glimmers to get the Dragon',
    ru: 'Собери 10 сияний и получи Дракона',
    tr: '10 Parıltı topla ve Ejderhayı al',
    es: 'Reúne 10 Destellos para obtener al Dragón',
    de: 'Sammle 10 Glitzer und erhalte den Drachen',
    pt: 'Colete 10 Brilhos para ganhar o Dragão',
    fr: 'Collecte 10 Étincelles pour obtenir le Dragon',
    pl: 'Zbierz 10 Błysków, aby zdobyć Smoka',
    it: 'Raccogli 10 Bagliori per ottenere il Drago',
    nl: 'Verzamel 10 Glinsteringen om de Draak te krijgen',
    cs: 'Nasbírej 10 Září a získej Draka'
}

export const TEXT_HELP_USE_DRAGON_DESCRIPTION = {
    en: 'Dragon can merge with any Squinki',
    ru: 'Дракон соединяется с любым Сквинки',
    tr: 'Ejderha herhangi bir Squinki ile birleşebilir',
    es: 'El Dragón puede fusionarse con cualquier Squinki',
    de: 'Der Drache kann mit jedem Squinki verschmelzen',
    pt: 'O Dragão pode se combinar com qualquer Squinki',
    fr: 'Le Dragon peut fusionner avec n\'importe quel Squinki',
    pl: 'Smok może łączyć się z dowolnym Squinki',
    it: 'Il Drago può unirsi a qualsiasi Squinki',
    nl: 'De Draak kan met elke Squinki samenvoegen',
    cs: 'Drak se může spojit s jakýmkoli Squinki'
}

export const TEXT_RESULT_WIN = {
    en: 'Victory!',
    ru: 'Победа!',
    tr: 'Zafer!',
    es: '¡Victoria!',
    de: 'Sieg!',
    pt: 'Vitória!',
    fr: 'Victoire !',
    pl: 'Zwycięstwo!',
    it: 'Vittoria!',
    nl: 'Overwinning!',
    cs: 'Vítězství!'
}

export const TEXT_RESULT_LOSE = {
    en: 'Not this time...',
    ru: 'Не получилось...',
    tr: 'Olmadı...',
    es: 'Casi...',
    de: 'Schade...',
    pt: 'Não foi dessa vez...',
    fr: 'Pas cette fois...',
    pl: 'Nie tym razem...',
    it: 'Quasi...',
    nl: 'Bijna...',
    cs: 'Tentokrát ne...'
}

export const TEXT_RESULT_NEW = {
    en: 'New Squinki discovered!',
    ru: 'Открыт новый Сквинки!',
    tr: 'Yeni Squinki keşfedildi!',
    es: '¡Nuevo Squinki descubierto!',
    de: 'Neues Squinki entdeckt!',
    pt: 'Novo Squinki descoberto!',
    fr: 'Nouveau Squinki découvert !',
    pl: 'Odkryto nowego Squinki!',
    it: 'Nuovo Squinki scoperto!',
    nl: 'Nieuwe Squinki ontdekt!',
    cs: 'Objeven nový Squinki!'
}

export const TEXT_SETTING_TYPE = createEnum(['TITLE', 'MUSIC', 'SOUND', 'LANGUAGE', 'RESET'])
export const TEXT_SETTINGS = {
    [TEXT_SETTING_TYPE.TITLE]: {
        en: 'Settings',
        ru: 'Настройки',
        tr: 'Ayarlar',
        es: 'Ajustes',
        de: 'Einstellungen',
        pt: 'Configurações',
        fr: 'Paramètres',
        pl: 'Ustawienia',
        it: 'Impostazioni',
        nl: 'Instellingen',
        cs: 'Nastavení'
    },
    [TEXT_SETTING_TYPE.MUSIC]:{
        en: 'Music',
        ru: 'Музыка',
        tr: 'Müzik',
        es: 'Música',
        de: 'Musik',
        pt: 'Música',
        fr: 'Musique',
        pl: 'Muzyka',
        it: 'Musica',
        nl: 'Muziek',
        cs: 'Hudba'
    },
    [TEXT_SETTING_TYPE.SOUND]:{
        en: 'Sound',
        ru: 'Звуки',
        tr: 'Ses',
        es: 'Sonido',
        de: 'Sound',
        pt: 'Som',
        fr: 'Son',
        pl: 'Dźwięk',
        it: 'Suono',
        nl: 'Geluid',
        cs: 'Zvuk'
    },
    [TEXT_SETTING_TYPE.LANGUAGE]:{
        en: 'Language:',
        ru: 'Язык:',
        tr: 'Dil:',
        es: 'Idioma:',
        de: 'Sprache:',
        pt: 'Idioma:',
        fr: 'Langue:',
        pl: 'Język:',
        it: 'Lingua:',
        nl: 'Taal:',
        cs: 'Jazyk:'
    },
    [TEXT_SETTING_TYPE.RESET]:{
        en: (count) => `To reset all game progress and start over - press the cross button ${count} times`,
        ru: (count) => {
            const word = count % 10 === 1 && count % 100 !== 11 ? 'раз' : 'раза';
            return `Что бы сбросить весь прогрес игры и начать все сначало - нажимай кнопку с крестиком ${count} ${word}`
        },
        tr: (count) => `Tüm oyun ilerlemesini sıfırlamak ve yeniden başlamak için çarpı işaretli düğmeye ${count} kez basın`,
        es: (count) => `Para reiniciar todo el progreso del juego y empezar de nuevo - presiona el botón de la cruz ${count} veces`,
        de: (count) => `Um den gesamten Spielstand zurückzusetzen und von vorne zu beginnen - drücke die Kreuz-Taste ${count} Mal`,
        pt: (count) => `Para redefinir todo o progresso do jogo e começar de novo - pressione o botão com a cruz ${count} vezes`,
        fr: (count) => `Pour réinitialiser toute la progression du jeu et recommencer - appuyez sur le bouton avec la croix ${count} fois`,
        pl: (count) => `Aby zresetować cały postęp w grze i zacząć od nowa - naciśnij przycisk z krzyżykiem ${count} razy`,
        it: (count) => `Per ripristinare tutti i progressi del gioco e ricominciare - premi il pulsante con la croce ${count} volte`,
        nl: (count) => `Om alle spelvoortgang te resetten en opnieuw te beginnen - druk ${count} keer op de knop met het kruisje`,
        cs: (count) => `Pro resetování veškerého postupu ve hře a začátek od začátku - stiskněte tlačítko s křížkem ${count}krát`
    }
}

export const TEXT_EMPTY = {
    en: '',
    ru: '',
    tr: '',
    es: '',
    de: '',
    pt: '',
    fr: '',
    pl: '',
    it: '',
    nl: '',
    cs: ''
}