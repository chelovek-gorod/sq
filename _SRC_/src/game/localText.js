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

export const TEXT_BUTTON_TYPE = createEnum(['START', 'OK'])
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
}

export const TEXT_SQUINKI_NAME = {
    // Саванна / Джунгли
    [PET.Zebra]: {
        en: 'Zippy Zebra',
        ru: 'Зеброчка',
        tr: 'Zebra Bebek',
        es: 'Cebrita',
        de: 'Zebrachen',
        pt: 'Zebrinha',
        fr: 'Zébrette',
        pl: 'Zebruszka',
        it: 'Zebretta',
        nl: 'Zebraatje',
        cs: 'Zebřička'
    },
    [PET.Parrot]: {
        en: 'Polly Parrot',
        ru: 'Попугайчик',
        tr: 'Papağan Bebek',
        es: 'Lorito',
        de: 'Papageichen',
        pt: 'Papagaiozinho',
        fr: 'Perruchette',
        pl: 'Papuzka',
        it: 'Pappagallino',
        nl: 'Papegaaitje',
        cs: 'Papoušek'
    },
    [PET.Ostrich]: {
        en: 'Ozzy Ostrich',
        ru: 'Страусёнок',
        tr: 'Devekuşu Bebek',
        es: 'Avestrucito',
        de: 'Straußchen',
        pt: 'Avestruzinho',
        fr: 'Autruchon',
        pl: 'Strusiątko',
        it: 'Struzzoletto',
        nl: 'Struisvogeltje',
        cs: 'Pštrosáček'
    },
    [PET.Monkey]: {
        en: 'Coco Monkey',
        ru: 'Обезьянка',
        tr: 'Maymun Bebek',
        es: 'Monito',
        de: 'Äffchen',
        pt: 'Macaco',
        fr: 'Petit Singe',
        pl: 'Małpka',
        it: 'Scimmietta',
        nl: 'Aapje',
        cs: 'Opice'
    },
    [PET.Lion]: {
        en: 'Leo Lion',
        ru: 'Львёнок',
        tr: 'Aslan Bebek',
        es: 'Leoncio',
        de: 'Löwchen',
        pt: 'Leãozinho',
        fr: 'Lionceau',
        pl: 'Lwiątko',
        it: 'Leoncino',
        nl: 'Leeuwtje',
        cs: 'Lvíček'
    },
    [PET.Kangaroo]: {
        en: 'Kip Kangaroo',
        ru: 'Кенгурёнок',
        tr: 'Kanguru Bebek',
        es: 'Cangurito',
        de: 'Känguruhchen',
        pt: 'Canguru',
        fr: 'Kangourou',
        pl: 'Kangurek',
        it: 'Cangurino',
        nl: 'Kangoeroetje',
        cs: 'Klokánek'
    },
    [PET.Jerboa]: {
        en: 'Jumpy Jerboa',
        ru: 'Тушканчик',
        tr: 'Jerboa Bebek',
        es: 'Jerbo',
        de: 'Wüstenhüpfchen',
        pt: 'Jerboa',
        fr: 'Petite Gerboise',
        pl: 'Jerboik',
        it: 'Gerboa',
        nl: 'Jerboatje',
        cs: 'Jerboška'
    },
    [PET.Giraffe]: {
        en: 'Gerry Giraffe',
        ru: 'Жирафик',
        tr: 'Zürafa Bebek',
        es: 'Jirafita',
        de: 'Giraffenkind',
        pt: 'Girafinha',
        fr: 'Girafon',
        pl: 'Żyrafka',
        it: 'Giraffetta',
        nl: 'Girafje',
        cs: 'Žirafka'
    },
    [PET.Elephant]: {
        en: 'Ellie Elephant',
        ru: 'Слонёнок',
        tr: 'Fil Bebek',
        es: 'Elefantito',
        de: 'Elefäntchen',
        pt: 'Elefantinho',
        fr: 'Éléphanteau',
        pl: 'Słoniątko',
        it: 'Elefantino',
        nl: 'Olifantje',
        cs: 'Slůně'
    },
    [PET.Capybara]: {
        en: 'Capi Capybara',
        ru: 'Капибарик',
        tr: 'Kapibara Bebek',
        es: 'Capibara',
        de: 'Capybärchen',
        pt: 'Capivarinha',
        fr: 'Capybarou',
        pl: 'Kapibarka',
        it: 'Capibarino',
        nl: 'Capibaraatje',
        cs: 'Kapibarinka'
    },

    // Арктика
    [PET.Walrus]: {
        en: 'Wally Walrus',
        ru: 'Моржонок',
        tr: 'Mors Bebek',
        es: 'Morsita',
        de: 'Walrosschen',
        pt: 'Morsa',
        fr: 'Petit Morse',
        pl: 'Morsik',
        it: 'Trichechetto',
        nl: 'Walrusje',
        cs: 'Mrožek'
    },
    [PET.SnowyOwl]: {
        en: 'Snowy Owl',
        ru: 'Совушка',
        tr: 'Kar Baykuşu Bebek',
        es: 'Búho Nevado',
        de: 'Schneeeulchen',
        pt: 'Coruja-da-neve',
        fr: 'Petite Chouette',
        pl: 'Sowa Śnieżna',
        it: 'Gufetto',
        nl: 'Sneeuwuiltje',
        cs: 'Sovička'
    },
    [PET.Reindeer]: {
        en: 'Rudy Reindeer',
        ru: 'Оленёнок',
        tr: 'Ren Geyiği Bebek',
        es: 'Rudolph',
        de: 'Rentierkind',
        pt: 'Rena',
        fr: 'Renneau',
        pl: 'Reniferek',
        it: 'Cervetto',
        nl: 'Rendiertje',
        cs: 'Sobíček'
    },
    [PET.PolarBear]: {
        en: 'Polo Polar Bear',
        ru: 'Белый Мишка',
        tr: 'Kutup Ayısı Bebek',
        es: 'Osito Polar',
        de: 'Eisbärchen',
        pt: 'Ursinho Polar',
        fr: 'Ourson Polaire',
        pl: 'Niedźwiadek Polarny',
        it: 'Orsetto Polare',
        nl: 'IJsbeertje',
        cs: 'Medvídek'
    },
    [PET.Penguin]: {
        en: 'Pippin Penguin',
        ru: 'Пингвинчик',
        tr: 'Penguen Bebek',
        es: 'Pingüinito',
        de: 'Pinguinchen',
        pt: 'Pinguim',
        fr: 'Bébé Pingouin',
        pl: 'Pingwinek',
        it: 'Pinguinetto',
        nl: 'Pinguïntje',
        cs: 'Tučňáček'
    },
    [PET.Narwhal]: {
        en: 'Nori Narwhal',
        ru: 'Нарвальчик',
        tr: 'Narval Bebek',
        es: 'Narvalito',
        de: 'Narwalchen',
        pt: 'Narvalzinho',
        fr: 'Narvalou',
        pl: 'Narwalek',
        it: 'Narvaletto',
        nl: 'Narwalletje',
        cs: 'Narvalíček'
    },
    [PET.Lemming]: {
        en: 'Lemmy Lemming',
        ru: 'Лемминчик',
        tr: 'Lemming Bebek',
        es: 'Lemming',
        de: 'Lemmingchen',
        pt: 'Lemminguinho',
        fr: 'Lemming',
        pl: 'Leming',
        it: 'Lemming',
        nl: 'Lemmingetje',
        cs: 'Lemmínek'
    },
    [PET.KillerWhale]: {
        en: 'Willy Whale',
        ru: 'Косатка',
        tr: 'Katil Balina Bebek',
        es: 'Orca',
        de: 'Orcachen',
        pt: 'Orca',
        fr: 'Orque',
        pl: 'Orka',
        it: 'Orchetta',
        nl: 'Orcaatje',
        cs: 'Kosatka'
    },
    [PET.BelugaWhale]: {
        en: 'Bella Beluga',
        ru: 'Белушок',
        tr: 'Beluga Bebek',
        es: 'Beluguita',
        de: 'Belugachen',
        pt: 'Beluga',
        fr: 'Bélouga',
        pl: 'Białucha',
        it: 'Belughina',
        nl: 'Belugaatje',
        cs: 'Běluháček'
    },
    [PET.ArcticFox]: {
        en: 'Archie Fox',
        ru: 'Песец',
        tr: 'Kutup Tilkisi Bebek',
        es: 'Zorrito Ártico',
        de: 'Polarfüchschen',
        pt: 'Raposinha-do-Ártico',
        fr: 'Renardeau Polaire',
        pl: 'Piesek Arktyczny',
        it: 'Volpettina',
        nl: 'Poolvosje',
        cs: 'Lištička'
    },

    // Ферма
    [PET.Mouse]: {
        en: 'Mimi Mouse',
        ru: 'Мышонок',
        tr: 'Fare Bebek',
        es: 'Ratón',
        de: 'Mäuschen',
        pt: 'Ratinho',
        fr: 'Souriceau',
        pl: 'Myszka',
        it: 'Topolino',
        nl: 'Muizje',
        cs: 'Myška'
    },
    [PET.Lamb]: {
        en: 'Lily Lamb',
        ru: 'Ягнёнок',
        tr: 'Kuzu Bebek',
        es: 'Corderito',
        de: 'Lämmchen',
        pt: 'Cordeirinho',
        fr: 'Agnelet',
        pl: 'Baranki',
        it: 'Agnellino',
        nl: 'Lammerje',
        cs: 'Beránek'
    },
    [PET.Filly]: {
        en: 'Fiona Filly',
        ru: 'Жеребёнок',
        tr: 'Tay Bebek',
        es: 'Potrillo',
        de: 'Fohlen',
        pt: 'Potrinho',
        fr: 'Poulain',
        pl: 'Źrebaczek',
        it: 'Puledro',
        nl: 'Veulentje',
        cs: 'Hříbě'
    },
    [PET.Duck]: {
        en: 'Daisy Duck',
        ru: 'Утёнок',
        tr: 'Ördek Bebek',
        es: 'Patito',
        de: 'Entchen',
        pt: 'Patinho',
        fr: 'Caneton',
        pl: 'Kaczuszka',
        it: 'Anatroccolo',
        nl: 'Eendje',
        cs: 'Káčátko'
    },
    [PET.Dog]: {
        en: 'Dexter Dog',
        ru: 'Щенок',
        tr: 'Köpek Bebek',
        es: 'Perrito',
        de: 'Hündchen',
        pt: 'Cachorrinho',
        fr: 'Chiot',
        pl: 'Piesek',
        it: 'Cagnolino',
        nl: 'Hondje',
        cs: 'Štěňátko'
    },
    [PET.Chick]: {
        en: 'Cheep Chick',
        ru: 'Цыплёнок',
        tr: 'Civciv',
        es: 'Pollito',
        de: 'Küken',
        pt: 'Pintinho',
        fr: 'Poussin',
        pl: 'Pisklak',
        it: 'Pulcino',
        nl: 'Kuikentje',
        cs: 'Kuřátko'
    },
    [PET.Cat]: {
        en: 'Cleo Cat',
        ru: 'Котёнок',
        tr: 'Kedi Bebek',
        es: 'Gatito',
        de: 'Kätzchen',
        pt: 'Gatinho',
        fr: 'Chaton',
        pl: 'Kotek',
        it: 'Gattino',
        nl: 'Poesje',
        cs: 'Koťátko'
    },
    [PET.Bunny]: {
        en: 'Benny Bunny',
        ru: 'Зайчик',
        tr: 'Tavşan Bebek',
        es: 'Conejito',
        de: 'Häschen',
        pt: 'Coelhinho',
        fr: 'Lapin',
        pl: 'Króliczek',
        it: 'Coniglietto',
        nl: 'Konijntje',
        cs: 'Králíček'
    },
    [PET.Mole]: {
        en: 'Molly Mole',
        ru: 'Кротик',
        tr: 'Köstebek Bebek',
        es: 'Topito',
        de: 'Maulwurfchen',
        pt: 'Toupeirinha',
        fr: 'Taupe',
        pl: 'Krecik',
        it: 'Talponcino',
        nl: 'Molletje',
        cs: 'Krteček'
    },
    [PET.Bat]: {
        en: 'Bella Bat',
        ru: 'Летучая Мышка',
        tr: 'Yarasa Bebek',
        es: 'Murcielaguito',
        de: 'Fledermäuschen',
        pt: 'Morceguinho',
        fr: 'Chauve-Souriceau',
        pl: 'Nietoperzyk',
        it: 'Pipistrellino',
        nl: 'Vleermuisje',
        cs: 'Netopýrek'
    },

    // Подводный мир
    [PET.Zebrasoma]: {
        en: 'Ziggy Tang',
        ru: 'Зебрасома',
        tr: 'Zebrasoma',
        es: 'Zebrasoma',
        de: 'Segelflossler',
        pt: 'Zebrasoma',
        fr: 'Zebrasoma',
        pl: 'Pielęgniczek',
        it: 'Zebrasoma',
        nl: 'Zebrasomaatje',
        cs: 'Zebrasomka'
    },
    [PET.Turtle]: {
        en: 'Toby Turtle',
        ru: 'Черепашка',
        tr: 'Kaplumbağa Bebek',
        es: 'Tortuguita',
        de: 'Schildkrötchen',
        pt: 'Tartaruguinha',
        fr: 'Tortue',
        pl: 'Żółwik',
        it: 'Tartarughina',
        nl: 'Schildpadje',
        cs: 'Želvička'
    },
    [PET.Shark]: {
        en: 'Shelby Shark',
        ru: 'Акулка',
        tr: 'Köpek Balığı Bebek',
        es: 'Tiburón',
        de: 'Haifischlein',
        pt: 'Tubarãozinho',
        fr: 'Requin',
        pl: 'Rekinek',
        it: 'Squalo',
        nl: 'Haaitje',
        cs: 'Žralůček'
    },
    [PET.Seal]: {
        en: 'Sammy Seal',
        ru: 'Тюленька',
        tr: 'Fok Bebek',
        es: 'Foquita',
        de: 'Seehündchen',
        pt: 'Foquinha',
        fr: 'Bébé Phoque',
        pl: 'Foczka',
        it: 'Focetta',
        nl: 'Zeehondje',
        cs: 'Tuleňátko'
    },
    [PET.SeaHorse]: {
        en: 'Hector Seahorse',
        ru: 'Морской Конёк',
        tr: 'Deniz Atı Bebek',
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
        en: 'Ollie Octopus',
        ru: 'Осьминожка',
        tr: 'Ahtapot Bebek',
        es: 'Pulpito',
        de: 'Krakenkind',
        pt: 'Polvinho',
        fr: 'Petite Pieuvre',
        pl: 'Ośmiorniczka',
        it: 'Polpetto',
        nl: 'Octopusje',
        cs: 'Chobotnička'
    },
    [PET.Goldfish]: {
        en: 'Goldie Fish',
        ru: 'Золотая Рыбка',
        tr: 'Japon Balığı Bebek',
        es: 'Pez Dorado',
        de: 'Goldfischchen',
        pt: 'Peixinho Dourado',
        fr: 'Poisson Rouge',
        pl: 'Złota Rybka',
        it: 'Pesciolino Rosso',
        nl: 'Goudvisje',
        cs: 'Zlatá Rybka'
    },
    [PET.Dolphin]: {
        en: 'Dolly Dolphin',
        ru: 'Дельфинчик',
        tr: 'Yunus Bebek',
        es: 'Delfinito',
        de: 'Delfinchen',
        pt: 'Golfinho',
        fr: 'Dauphin',
        pl: 'Delfinek',
        it: 'Delfinetto',
        nl: 'Dolfijntje',
        cs: 'Delfínek'
    },
    [PET.Cuttlefish]: {
        en: 'Carly Cuttlefish',
        ru: 'Каракатица',
        tr: 'Mürekkep Balığı Bebek',
        es: 'Sepia',
        de: 'Tintenfischlein',
        pt: 'Séquia',
        fr: 'Seiche',
        pl: 'Mątwa',
        it: 'Seppiolina',
        nl: 'Zeekatje',
        cs: 'Sépička'
    },
    [PET.Axolotl]: {
        en: 'Axel Axolotl',
        ru: 'Аксолотлик',
        tr: 'Aksolotl Bebek',
        es: 'Ajolote',
        de: 'Axolotlchen',
        pt: 'Axolotinho',
        fr: 'Axolotl',
        pl: 'Aksolotek',
        it: 'Assolotto',
        nl: 'Axolotltje',
        cs: 'Axolotlek'
    },

    // Лес / Экзотика
    [PET.WhiteTiger]: {
        en: 'Snow Tiger',
        ru: 'Белый Тигрёнок',
        tr: 'Beyaz Kaplan Bebek',
        es: 'Tigre Blanco',
        de: 'Weißes Tigerbaby',
        pt: 'Tigrinho Branco',
        fr: 'Tigreau Blanc',
        pl: 'Biały Tygrysek',
        it: 'Tigrotto Bianco',
        nl: 'Witte Tijger',
        cs: 'Bílý Tygr'
    },
    [PET.Snake]: {
        en: 'Sid Snake',
        ru: 'Змейка',
        tr: 'Yılan Bebek',
        es: 'Serpiente',
        de: 'Schlängchen',
        pt: 'Cobrinha',
        fr: 'Serpenteau',
        pl: 'Wężyk',
        it: 'Serpentello',
        nl: 'Slangetje',
        cs: 'Hádek'
    },
    [PET.Raccoon]: {
        en: 'Rocky Raccoon',
        ru: 'Енотик',
        tr: 'Rakun Bebek',
        es: 'Mapachito',
        de: 'Waschbärchen',
        pt: 'Guaxinim',
        fr: 'Raton Laveur',
        pl: 'Szopik',
        it: 'Procione',
        nl: 'Wasbeertje',
        cs: 'Mývalíček'
    },
    [PET.Peacock]: {
        en: 'Perry Peacock',
        ru: 'Павлинчик',
        tr: 'Tavus Kuşu Bebek',
        es: 'Pavito Real',
        de: 'Pfauenfeder',
        pt: 'Pavãozinho',
        fr: 'Paonneau',
        pl: 'Pawik',
        it: 'Pavoncino',
        nl: 'Pauwtje',
        cs: 'Pávek'
    },
    [PET.Panda]: {
        en: 'Pippa Panda',
        ru: 'Пандочка',
        tr: 'Panda Bebek',
        es: 'Pandita',
        de: 'Pandabär',
        pt: 'Pandinha',
        fr: 'Petit Panda',
        pl: 'Pandusia',
        it: 'Pandino',
        nl: 'Pandabeertje',
        cs: 'Pandí'
    },
    [PET.Koala]: {
        en: 'Koby Koala',
        ru: 'Коала',
        tr: 'Koala Bebek',
        es: 'Koalita',
        de: 'Koalabärchen',
        pt: 'Koalinha',
        fr: 'Koala',
        pl: 'Koalek',
        it: 'Koalino',
        nl: 'Koalaatje',
        cs: 'Koala'
    },
    [PET.Frog]: {
        en: 'Freddy Frog',
        ru: 'Лягушонок',
        tr: 'Kurbağa Bebek',
        es: 'Ranita',
        de: 'Fröschchen',
        pt: 'Sapinho',
        fr: 'Grenouillette',
        pl: 'Żabka',
        it: 'Ranocchietta',
        nl: 'Kikkertje',
        cs: 'Žabička'
    },
    [PET.Panther]: {
        en: 'Penny Panther',
        ru: 'Пантерка',
        tr: 'Panter Bebek',
        es: 'Pantera',
        de: 'Pantherchen',
        pt: 'Panterinha',
        fr: 'Panthère',
        pl: 'Panterek',
        it: 'Panterina',
        nl: 'Pantertje',
        cs: 'Panterka'
    },
    [PET.Chameleon]: {
        en: 'Cammy Chameleon',
        ru: 'Хамелеончик',
        tr: 'Bukalemun Bebek',
        es: 'Camaleoncito',
        de: 'Chamäleonchen',
        pt: 'Camaleãozinho',
        fr: 'Caméléon',
        pl: 'Kameleonek',
        it: 'Camaleontino',
        nl: 'Kameleonnetje',
        cs: 'Chameleonek'
    },
    [PET.Beaver]: {
        en: 'Benny Beaver',
        ru: 'Бобрёнок',
        tr: 'Kunduz Bebek',
        es: 'Castorcito',
        de: 'Biberchen',
        pt: 'Castorzinho',
        fr: 'Biberon',
        pl: 'Bobrek',
        it: 'Castorino',
        nl: 'Bevertje',
        cs: 'Bobříček'
    },

    // Мифические
    [PET.Dragon]: {
        en: 'Draco Dragon',
        ru: 'Дракончик',
        tr: 'Ejderha Bebek',
        es: 'Dragón',
        de: 'Drachenkind',
        pt: 'Dragãozinho',
        fr: 'Dragonneau',
        pl: 'Smok',
        it: 'Draghetto',
        nl: 'Draakje',
        cs: 'Drakáček'
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

export const TEXT_SQUINKI_INFO_TYPE = createEnum(['LEVEL', 'BIOM'])
export const TEXT_SQUINKI_INFO = {
    [TEXT_SQUINKI_INFO_TYPE.LEVEL]: {
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
    },
    [TEXT_SQUINKI_INFO_TYPE.BIOM]: {
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

export const TEXT_TASK_WIN = {
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

export const TEXT_TASK_LOSE = {
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