let db = {
    users: [
        {
            email: '',
            password: '',
            name: '',
            surname: '',
            city: '',
            phoneNumber: '',
            photoUrl: '',
            createdAt: ''
        }
    ],
    rents: [
        {
            name: '',
            imageUrls: [],
            category: '',
            description: '',
            price: 0,
            daily: 0,
            weekly: 0,
            monthly: 0,
            city: '',
            province: '',
            commentCount: 0,
        }
    ],
    comments: [
        {
            userId: '',
            rentId: '',
            body: '',
            createdAt: ''
        }
    ],
    notifications: [
        {
            recipient: '',
            sender: '',
            read: 'T/F',
            rentId: '',
            type: 'chat | comment | demand',
            createdAt: ''
        }
    ]
};

export const pageTitlesAndDescriptions = {
    home: {title: 'Mandarent - Əşyaların icarə platforması', description: 'Sadəcə qısa müddətliyinə sizə lazım olan əşyaları almayın, Mandarentdə Kirayələyin. Yaxınlıqdakı icarə elanlarına baxın və sizə lazım olanı kirayələyin. Az istifadə etdiyiniz əşyanız var? Mandarentdə kirayə verin və əlavə gəlir qazanın.'},
    demand: { title: 'Mandarent - Təcili tələblər', description: 'İşlətmədiyin əşyaların digərlərinə lazım olduğuna bax, kirayə ver və gəlir qazan. Mandarent: Yeni nəsil əşyaların P2P icarə platforması.' },
    rentOut: { title: 'Mandarent - Kirayə ver', description: 'Əşyalarını kirayə ver və gəlir qazan. Mandarent: Yeni nəsil əşyaların P2P icarə platforması.' },
    request: { title: 'Mandarent - Tələb et', description: 'Ehtiyacın olan əşyanı təsvir et və əldə et. Mandarent: Yeni nəsil əşyaların P2P icarə platforması.' },
    category_All: { title: 'Mandarent - Kateqoriyalar', description: 'Elektronika, Əyləncə, Fotoqrafiya, Kitablar & Video oyun. Mandarent: Yeni nəsil əşyaların P2P icarə platforması. Mandarentlə alma, Kirayələ!' },
    category_Electronics: { title: 'Mandarent - Elektronika', description: 'Elektronika alətlərini alma, Kirayələ. Mandarent: Yeni nəsil əşyaların P2P icarə platforması. Mandarentlə alma, Kirayələ!' },
    category_boardGames: { title: 'Mandarent - Əyləncə', description: 'Boş vaxtınızı dəyərləndirmək üçün müxtəlif oyunları alma, Kirayələ. Mandarent: Yeni nəsil əşyaların P2P icarə platforması. Mandarentlə alma, Kirayələ!' },
    category_books: { title: 'Mandarent - Kitablar', description: 'Kitabları alma, Kirayələ. Mandarent: Yeni nəsil əşyaların P2P icarə platforması. Mandarentlə alma, Kirayələ!' },
    category_photography: { title: 'Mandarent - Fotoqrafiya ', description: 'Fotoaparat, kamera və çəkiliş ləvazimatlarını alma, Kirayələ. Mandarent: Yeni nəsil əşyaların P2P icarə platforması. Mandarentlə alma, Kirayələ!' },
    category_videoGames: { title: 'Mandarent - Video oyun ', description: 'Playstation və Xbox konsollarını alma, Kirayələ. Mandarent: Yeni nəsil əşyaların P2P icarə platforması. Mandarentlə alma, Kirayələ!' }
}

export const prefix_list = ['050', '051', '055', '060', '070', '077', '099'];

export const ID_series_list = ['AZE', 'AA', 'DYİ', 'MYİ'];

export const maxSizeMB = 0.05;

export const blockedWords = [
    'whatsapp',
    'vatsapp',
    'vatsap',
    'vatsp',
    'vasvas',
    'vaccap',
    'whatsap',
    'whatcap',
    'wasvas',
    'votsap',
    'votsapp',
    'çapçap',
    'vaççap',
    'vaccap',
    'vaçap',
    'vacap',
    'vaçapi',
    'vacapi',
    'capcap',
    'şatsapp',
    'şatsap',
    'facebook',
    'facebok',
    'facebuk',
    'feyzbuk',
    'feysbuk',
    'feyisbuk',
    'face',
    'feys',
    'façe',
    'fb',
    'ınstagram',
    'instagram',
    'instigram',
    'istagram',
    'ınsta',
    'insta',
    'ista',
    'ig',
    'mail',
    'email',
    'e-mail',
    'meyil',
    'imeyil',
    '@',
    // '.com',
    // '.az',
    // '.ru',
    'gmail',
    'telefon',
    'telfon',
    'nomre',
    // 'tel',
    'nömrə',
    'numre',
    'tiktok',
    'tik-tok',
    'agar',
    'adnaklasnik',
    'odnaklasnik',
    'lalafo',
    'tap.az',
    'rentmania',
    'ünvan.az',
    'unvan.az',
    'Фейсбук',
    'Фейзбук',
    'bотсап',
    'bатсап',
    'тикток',
    'тик-ток',
    'однакласник',
    'одноклассники',
    'инстаграм',
]

export const message_templates = [
    'Qeyd etdiyim tarixlərdə kirayə verirsinizmi?',
    'Hal-hazırda hansı şəhər/rayondasınız?',
    'Əşyanın vəziyyəti/işləkliyi necədir?',
    'Çatdırılma və geri götürmə harada və necə olacaq?',
    'Əşya ilə nələrisə etməyim və ya etməməyim lazımdırmı?',
    'Əşyanın necə işlədiyini və ya necə quraşdırdılmasını göstərəcəksinizmi?',
    'Əşya ilə birgə hər hansı aksessuar və ya əlavə əşya verirsinizmi?',
    'Asan qırılan və ya həssas əşyadırmı?',
    'Hər hansı qablaşdırmada və ya qutudamı veriləcək?',
    'Qaytarılmadan əvvəl yumaq, boşaltmaq, təmizləmək və ya qurulamaq lazımdırmı?',
    'Əşyanızı operator, işlədən, sürən və ya idarə edən biri ilə mi kirayə verirsiniz?',
    'Əşyanın quraşdırılmasını təşkil edirsinizmi?',
    'Minimum və ya maksimum nə qədər müddətə kirayələyə bilərəm?',
]

export const categories = [
    {
        name: 'Fotoqrafiya',
        img: 'photo.png',
        sub: [
            {
                name: 'Fotoaparat / Kameralar'
            },
            {
                name: 'Linzalar'
            },
            {
                name: 'İşıqlandırma'
            },
            {
                name: 'Aksessuar'
            },
            {
                name: 'Studio'
            },
            {
                name: 'Digər'
            }
        ]
    },
    // {
    //     name: 'Dron',
    //     img: 'drone.png',
    //     sub: [
    //         {
    //             name: 'Dron Operatoru'
    //         },
    //         {
    //             name: 'Digər'
    //         },
    //     ]
    // },
    // {
    //     name: 'Skuter',
    //     img: 'scooter.png',
    //     sub: null
    // },
    // {
    //     name: 'Təmir alətləri',
    //     img: 'tools.png',
    //     sub: [
    //         {
    //             name: 'Drel'
    //         },
    //         {
    //             name: 'Çəkiç'
    //         },
    //         {
    //             name: 'Balta'
    //         },
    //         {
    //             name: 'Generator'
    //         },
    //         {
    //             name: 'Vintaçan / Şunur qaytaran'
    //         },
    //         {
    //             name: 'Mişar'
    //         },
    //         {
    //             name: 'Alət dəsti'
    //         },
    //         {
    //             name: 'Məngənə'
    //         },
    //         {
    //             name: 'Kəlbətin'
    //         },
    //         {
    //             name: 'Pardaqlama maşınları'
    //         },
    //         {
    //             name: 'Bağ qayçıları'
    //         },
    //         {
    //             name: 'Qaynaq aparatları'
    //         },
    //         {
    //             name: 'Ruletka / Məsafə ölçən'
    //         },
    //         {
    //             name: 'Texniki Fen'
    //         },
    //         {
    //             name: 'Digər'
    //         }
    //     ]
    // },
    {
        name: 'Video Oyun',
        img: 'game.png',
        sub: [
            {
                name: 'Playstation 3'
            },
            {
                name: 'Playstation 4'
            },
            {
                name: 'Playstation 5'
            },
            {
                name: 'Playstation diskləri'
            },
            {
                name: 'Xbox'
            },
            {
                name: 'Xbox diskləri'
            },
            {
                name: 'Oyun hesabları'
            },
            {
                name: 'Coystik'
            },
            {
                name: 'VR'
            },
            {
                name: 'Digər'
            }
        ]
    },
    // {
    //     name: 'İdman',
    //     img: 'fitness.png',
    //     sub: [
    //         {
    //             name: 'Trenajor alətləri'
    //         },
    //         {
    //             name: 'Qış idmanı'
    //         },
    //         {
    //             name: 'Su idmanı'
    //         },
    //         {
    //             name: 'Açıq idmanlar / Həyət'
    //         },
    //         {
    //             name: 'Digər'
    //         }
    //     ]
    // },
    // {
    //     name: 'Musiqi',
    //     img: 'music.png',
    //     sub: [
    //         {
    //             name: 'Gitara'
    //         },
    //         {
    //             name: 'Piano / Sintizator'
    //         },
    //         {
    //             name: 'DJ ləvazimatları'
    //         },
    //         {
    //             name: 'Nəfəs alətləri'
    //         },
    //         {
    //             name: 'Qulaqcıqlar / Aksesuarlar'
    //         },
    //         {
    //             name: 'Skripka'
    //         },
    //         {
    //             name: 'Zərb alətləri'
    //         },
    //         {
    //             name: 'Notalar'
    //         },
    //         {
    //             name: 'Digər'
    //         }
    //     ]
    // },
    // {
    //     name: 'Bağ və Həyət',
    //     img: 'home.png',
    //     sub: [
    //         {
    //             name: 'Mebel'
    //         },
    //         {
    //             name: 'Manqal'
    //         },
    //         {
    //             name: 'Bağ ləvazimatları'
    //         },
    //         {
    //             name: 'Samovar'
    //         },
    //         {
    //             name: 'Digər'
    //         }
    //     ]
    // },
    // {
    //     name: 'Səyahət',
    //     img: 'travel.png',
    //     sub: [
    //         {
    //             name: 'Kempinq / Çadır'
    //         },
    //         {
    //             name: 'Çamadan'
    //         },
    //         {
    //             name: 'Hovuz / Dəniz oyuncaqları'
    //         },
    //         {
    //             name: 'Digər'
    //         }
    //     ]
    // },
    {
        name: 'Kitablar',
        img: 'books.png',
        sub: [
            {
                name: 'Şəxsi inkişaf / Biznes'
            },
            {
                name: 'Detektiv'
            },
            {
                name: 'Təhsil / Tədris'
            },
            {
                name: 'Tarix'
            },
            {
                name: 'Klassika'
            },
            {
                name: 'Bioqrafiya'
            },
            {
                name: 'Tibb / Sağlamlıq'
            },
            {
                name: 'Psixologiya'
            },
            {
                name: 'Dünya ədəbiyyatı'
            },
            {
                name: 'Milli'
            },
            {
                name: 'Uşaq ədəbiyyatı'
            },
            {
                name: 'Roman'
            },
            {
                name: 'Digər'
            }
        ]
    },
    {
        name: 'Əyləncə',
        img: 'board-games.png',
        sub: [
            {
                name: 'Stolüstü oyunlar'
            },
            {
                name: 'Karaoke'
            },
            {
                name: 'Digər'
            }
        ]
    },
    // {
    //     name: 'Velosiped',
    //     img: 'bicycle.png',
    //     sub: [
    //         {
    //             name: 'Yol Velosipedi'
    //         },
    //         {
    //             name: 'Dağ velosipedi'
    //         },
    //         {
    //             name: 'Profesional / Yarış velosipedi'
    //         },
    //         {
    //             name: 'Elektrik velosipedi'
    //         },
    //         {
    //             name: 'Uşaq velosipedi'
    //         },
    //         {
    //             name: 'Velosiped aksesuarları'
    //         },
    //         {
    //             name: 'Digər'
    //         }
    //     ]
    // },
    {
        name: 'Elektronika',
        img: 'technology.png',
        sub: [
            {
                name: 'Komputer / Noutbuk'
            },
            {
                name: 'Məişət texnikası / cihazı'
            },
            {
                name: 'Audio'
            },
            {
                name: 'Mobil Telefon / Aksessuarlar'
            },
            {
                name: 'Proyektorlar'
            },
            {
                name: 'Ekranlar'
            },
            {
                name: 'Digər'
            }
        ]
    },
    // {
    //     name: 'Hobbi',
    //     img: 'drawing.png',
    //     sub: [
    //         {
    //             name: 'Ovçuluq / Balıqçılıq'
    //         },
    //         {
    //             name: 'İncəsənət / Kolleksiya'
    //         },
    //         {
    //             name: 'Qəlyan'
    //         },
    //         {
    //             name: 'Digər'
    //         }
    //     ]
    // },
    // {
    //     name: 'Avadanlıq',
    //     img: 'equipment.png',
    //     sub: [
    //         {
    //             name: 'Konteyner'
    //         },
    //         {
    //             name: 'Generator'
    //         },
    //         {
    //             name: 'Lazer/Epilyasiya aparatları'
    //         },
    //         {
    //             name: 'Kompressor'
    //         },
    //         {
    //             name: 'Tikinti texnikası'
    //         },
    //         {
    //             name: 'Oyun aparatı'
    //         },
    //         {
    //             name: 'Digər'
    //         }
    //     ]
    // },
    // {
    //     name: 'Uşaq və Körpə',
    //     img: 'baby.png',
    //     sub: [
    //         {
    //             name: 'Avtomobil oturacaqları'
    //         },
    //         {
    //             name: 'Uşaq arabaları və avtomobillər'
    //         },
    //         {
    //             name: 'Uşaq mebeli'
    //         },
    //         {
    //             name: 'Uşaq daşıyıcıları'
    //         },
    //         {
    //             name: 'Yürütəclər'
    //         },
    //         {
    //             name: 'Manejlər'
    //         },
    //         {
    //             name: 'Oyuncaqlar'
    //         },
    //         {
    //             name: 'Uşaq geyimi'
    //         },
    //         {
    //             name: 'Digər'
    //         }
    //     ]
    // },
    // {
    //     name: 'Xidmətlər',
    //     img: 'service.png',
    //     sub: null
    // }
]

export const location = [
    {
        name: "Bakı-Abşeron",
        districts: [
            {
                name: "Abşeron",
                sub: [
                    {
                        name: "Ceyranbatan",
                        longitude: 49.661529,
                        latitude: 40.5416391
                    },
                    {
                        name: "Çiçək",
                        longitude: 49.7159226,
                        latitude: 40.4283423
                    },
                    {
                        name: "Digah",
                        longitude: 49.8687927,
                        latitude: 40.4976798
                    },
                    {
                        name: "Fatmayı",
                        longitude: 49.8353895,
                        latitude: 40.530092
                    },
                    {
                        name: "Görədil",
                        longitude: 49.823088,
                        latitude: 40.5488478
                    },
                    {
                        name: "Hökməli",
                        longitude: 49.722622,
                        latitude: 40.4310633
                    },
                    {
                        name: "Köhnə Corat",
                        longitude: 49.7106747,
                        latitude: 40.5707344
                    },
                    {
                        name: "Qobu",
                        longitude: 49.6912654,
                        latitude: 40.4040302
                    },
                    {
                        name: "Masazır",
                        longitude: 49.7214383,
                        latitude: 40.471376
                    },
                    {
                        name: "Mehdiabad",
                        longitude: 49.8355123,
                        latitude: 40.4994548
                    },
                    {
                        name: "Müşviqabad",
                        longitude: 49.6145582,
                        latitude: 40.4674041
                    },
                    {
                        name: "Novxanı",
                        longitude: 49.7691606,
                        latitude: 40.5274168
                    },
                    {
                        name: "Pirəkəşkül",
                        longitude: 49.5861052,
                        latitude: 40.4848851
                    },
                    {
                        name: "Saray",
                        longitude: 49.6939912,
                        latitude: 40.535827
                    },
                    {
                        name: "Yeni Corat",
                        longitude: 49.6959314,
                        latitude: 40.574041
                    },
                    {
                        name: "Zağulba",
                        longitude: 50.102147,
                        latitude: 40.5406973
                    }
                ]
            },


            {
                name: "Binəqədi",
                sub: [
                    {
                        name: "28 May",
                        longitude: 49.6389285,
                        latitude: 40.4582296
                    },
                    {
                        name: "2-ci Alatava",
                        longitude: 49.7998508,
                        latitude: 40.4113819
                    },
                    {
                        name: "6-cı mikrorayon",
                        longitude: 49.8264316,
                        latitude: 40.4198531
                    },
                    {
                        name: "7-ci mikrorayon",
                        longitude: 49.8517473,
                        latitude: 40.4297176
                    },
                    {
                        name: "8-ci mikrorayon",
                        longitude: 49.8400592,
                        latitude: 40.4217269
                    },
                    {
                        name: "9-cu mikrorayon",
                        longitude: 49.808405,
                        latitude: 40.4224632
                    },
                    {
                        name: "Binəqədi",
                        longitude: 49.8225053,
                        latitude: 40.4729971
                    },
                    {
                        name: "Biləcəri",
                        longitude: 49.8053773,
                        latitude: 40.436088
                    },
                    {
                        name: "Xocasən",
                        longitude: 49.7605928,
                        latitude: 40.4124993
                    },
                    {
                        name: "Xutor",
                        longitude: 49.8258397,
                        latitude: 40.4114291
                    },
                    {
                        name: "M.Ə.Rəsulzadə",
                        longitude: 49.8290776,
                        latitude: 40.4327119
                    },
                    {
                        name: "Sulutəpə",
                        longitude: 49.7663253,
                        latitude: 40.4304656
                    }
                ]
            },
            {
                name: "Qaradağ",
                sub: [
                    {
                        name: "Bibi Heybət",
                        longitude: 49.8182459,
                        latitude: 40.3085368
                    },
                    {
                        name: "Ələt",
                        longitude: 49.3718377,
                        latitude: 39.9538362
                    },
                    {
                        name: "Qızıldaş",
                        longitude: 49.5853332,
                        latitude: 40.3088505
                    },
                    {
                        name: "Qobustan",
                        longitude: 49.3969487,
                        latitude: 40.088996
                    },
                    {
                        name: "Lökbatan",
                        longitude: 49.7212958,
                        latitude: 40.3267247
                    },
                    {
                        name: "Puta",
                        longitude: 49.6614386,
                        latitude: 40.2993019
                    },
                    {
                        name: "Sahil",
                        longitude: 49.6088309,
                        latitude: 40.2499826
                    },
                    {
                        name: "Səngəçal",
                        longitude: 49.4309863,
                        latitude: 40.1627588
                    },
                    {
                        name: "Şıxov",
                        longitude: 49.7546492,
                        latitude: 40.3106934
                    },
                    {
                        name: "Şübani",
                        longitude: 49.7520293,
                        latitude: 40.365413
                    }
                ]
            },
            {
                name: "Nizami",
                sub: [
                    {
                        name: "8-ci kilometr",
                        longitude: 49.9261105,
                        latitude: 40.4109732
                    },
                    {
                        name: "Keşlə",
                        longitude: 49.8931552,
                        latitude: 40.392618
                    }
                ]
            },
            {
                name: "Nərimanov",
                sub: [
                    {
                        name: "Nərimanov",
                        longitude: 49.8563507,
                        latitude: 40.4027896
                    },
                    {
                        name: "Böyükşor",
                        longitude: 49.8813823,
                        latitude: 40.4243134
                    }
                ]
            },
            {
                name: "Nəsimi",
                sub: [
                    {
                        name: "1-ci mikrorayon",
                        longitude: 49.8050082,
                        latitude: 40.407513
                    },
                    {
                        name: "2-ci mikrorayon",
                        longitude: 49.8161585,
                        latitude: 40.4133411
                    },
                    {
                        name: "3-cü mikrorayon",
                        longitude: 49.8166577,
                        latitude: 40.409066
                    },
                    {
                        name: "4-cü mikrorayon",
                        longitude: 49.8050749,
                        latitude: 40.4159287
                    },
                    {
                        name: "5-ci mikrorayon",
                        longitude: 49.8064717,
                        latitude: 40.4101498
                    },
                    {
                        name: "Kubinka",
                        longitude: 49.8293406,
                        latitude: 40.3842408
                    }
                ]
            },
            {
                name: "Pirallahı",
                longitude: 50.2953237,
                latitude: 40.4619908,
                sub: null
            },
            {
                name: "Sabunçu",
                sub: [
                    {
                        name: "Bakıxanov",
                        longitude: 49.9335908,
                        latitude: 40.4249855
                    },
                    {
                        name: "Balaxanı",
                        longitude: 49.9112724,
                        latitude: 40.4616113
                    },
                    {
                        name: "Bilgəh",
                        longitude: 50.0254437,
                        latitude: 40.5758868
                    },
                    {
                        name: "Kürdəxanı",
                        longitude: 49.9096379,
                        latitude: 40.5470142
                    },
                    {
                        name: "Maştağa",
                        longitude: 50.0061324,
                        latitude: 40.5289721
                    },
                    {
                        name: "Məmmədli",
                        longitude: 49.9431503,
                        latitude: 40.513431
                    },
                    {
                        name: "Nardaran",
                        longitude: 49.9656568,
                        latitude: 40.5726306
                    },
                    {
                        name: "Pirşağı",
                        longitude: 49.8802341,
                        latitude: 40.5636311
                    },
                    {
                        name: "Ramana",
                        longitude: 49.9791783,
                        latitude: 40.4572211
                    },
                    {
                        name: "Sabunçu",
                        longitude: 49.9386446,
                        latitude: 40.442434
                    },
                    {
                        name: "Savalan",
                        longitude: 49.966427,
                        latitude: 40.5156011
                    },
                    {
                        name: "Yeni Ramana",
                        longitude: 49.9754845,
                        latitude: 40.4433731
                    },
                    {
                        name: "Zabrat",
                        longitude: 49.9266566,
                        latitude: 40.4843781
                    }
                ]
            },
            {
                name: "Səbail",
                sub: [
                    {
                        name: "20-ci Sahə",
                        longitude: 49.8177916,
                        latitude: 40.3295368
                    },
                    {
                        name: "Badamdar",
                        longitude: 49.7887526,
                        latitude: 40.3286043
                    },
                    {
                        name: "Bayıl",
                        longitude: 49.8275865,
                        latitude: 40.3493601
                    }
                ]
            },
            {
                name: "Suraxanı",
                sub: [
                    {
                        name: "Bahar",
                        longitude: 50.0345413,
                        latitude: 40.3708834
                    },
                    {
                        name: "Bülbülə",
                        longitude: 49.9767318,
                        latitude: 40.4338805
                    },
                    {
                        name: "Dədə Qorqud",
                        longitude: 50.0277758,
                        latitude: 40.3813455
                    },
                    {
                        name: "Əmircan",
                        longitude: 49.9780965,
                        latitude: 40.4263281
                    },
                    {
                        name: "Günəşli",
                        longitude: 49.9459926,
                        latitude: 40.3690765
                    },
                    {
                        name: "Hövsan",
                        longitude: 50.0804092,
                        latitude: 40.374886
                    },
                    {
                        name: "Qaraçuxur",
                        longitude: 49.9736771,
                        latitude: 40.3990045
                    },
                    {
                        name: "Massiv A",
                        longitude: 49.977091,
                        latitude: 40.380289
                    },
                    {
                        name: "Massiv B",
                        longitude: 49.977091,
                        latitude: 40.380289
                    },
                    {
                        name: "Massiv D",
                        longitude: 49.977411,
                        latitude: 40.370584
                    },
                    {
                        name: "Massiv V",
                        longitude: 49.98113,
                        latitude: 40.383786
                    },
                    {
                        name: "Suraxanı",
                        longitude: 50.0066082,
                        latitude: 40.4166757
                    },
                    {
                        name: "Şərq",
                        longitude: 49.9822954,
                        latitude: 40.3991928
                    },
                    {
                        name: "Yeni Günəşli",
                        longitude: 49.9622368,
                        latitude: 40.3794537
                    },
                    {
                        name: "Yeni Suraxanı",
                        longitude: 50.0211327,
                        latitude: 40.4246423
                    },
                    {
                        name: "Zığ",
                        longitude: 49.9736706,
                        latitude: 40.3472193
                    }
                ]
            },
            {
                name: "Xətai",
                sub: [
                    {
                        name: "Əhmədli",
                        longitude: 49.9446767,
                        latitude: 40.3806572
                    },
                    {
                        name: "Həzi Aslanov",
                        longitude: 49.9513126,
                        latitude: 40.3730533
                    },
                    {
                        name: "Köhnə Günəşli",
                        longitude: 49.9646165,
                        latitude: 40.3739689
                    },
                    {
                        name: "NZS",
                        longitude: 49.9182598,
                        latitude: 40.3856704
                    }
                ]
            },
            {
                name: "Xəzər",
                sub: [
                    {
                        name: "Binə",
                        longitude: 50.078473,
                        latitude: 40.4592865
                    },
                    {
                        name: "Buzovna",
                        longitude: 50.0646538,
                        latitude: 40.5220904
                    },
                    {
                        name: "Dübəndi",
                        longitude: 50.1956319,
                        latitude: 40.4349884
                    },
                    {
                        name: "Gürgən",
                        longitude: 50.3275966,
                        latitude: 40.3971065
                    },
                    {
                        name: "Qala",
                        longitude: 50.1535962,
                        latitude: 40.4430824
                    },
                    {
                        name: "Mərdəkan",
                        longitude: 50.1152497,
                        latitude: 40.4887808
                    },
                    {
                        name: "Şağan",
                        longitude: 50.1014327,
                        latitude: 40.4896487
                    },
                    {
                        name: "Şimal DRES",
                        longitude: 50.2073262,
                        latitude: 40.498729
                    },
                    {
                        name: "Şüvəlan",
                        longitude: 50.1755091,
                        latitude: 40.4853064
                    },
                    {
                        name: "Türkan",
                        longitude: 50.2044236,
                        latitude: 40.3667382
                    },
                    {
                        name: "Zirə",
                        longitude: 50.2701533,
                        latitude: 40.3684899
                    }
                ]
            },
            {
                name: "Yasamal",
                longitude: 49.776006,
                latitude: 40.3844682,
                sub: null
            }
        ]
    },
    {
        name: "Ağcabədi",
        longitude: 47.4517822,
        latitude: 40.0410152
    },
    {
        name: "Ağdam",
        longitude: 46.7120192,
        latitude: 40.0047532
    },
    {
        name: "Ağdaş",
        longitude: 47.4665533,
        latitude: 40.6450097
    },
    {
        name: "Ağstafa",
        longitude: 45.4258273,
        latitude: 41.1178479
    },
    {
        name: "Ağsu",
        longitude: 48.0858285,
        latitude: 40.5209247
    },
    {
        name: "Astara",
        longitude: 48.8323395,
        latitude: 38.4680119
    },
    {
        name: "Babək",
        longitude: 45.4442783,
        latitude: 39.1561491
    },
    {
        name: "Balakən",
        longitude: 46.4069073,
        latitude: 41.723651
    },
    {
        name: "Beyləqan",
        longitude: 47.3873986,
        latitude: 39.8341009
    },
    {
        name: "Bərdə",
        longitude: 47.1226433,
        latitude: 40.3805851
    },
    {
        name: "Biləsuvar",
        longitude: 48.5116439,
        latitude: 39.4573606
    },
    {
        name: "Cəbrayıl",
        longitude: 46.7731315,
        latitude: 39.3989172
    },
    {
        name: "Cəlilabad",
        longitude: 48.4732695,
        latitude: 39.2075202
    },
    {
        name: "Culfa",
        longitude: 45.624192,
        latitude: 38.9587226
    },
    {
        name: "Daşkəsən",
        longitude: 45.7445693,
        latitude: 40.4847057
    },
    {
        name: "Füzuli",
        longitude: 47.0466889,
        latitude: 39.5490491
    },
    {
        name: "Gədəbəy",
        longitude: 45.7941054,
        latitude: 40.5688792
    },
    {
        name: "Gəncə",
        longitude: 46.3652823,
        latitude: 40.686031
    },
    {
        name: "Goranboy",
        longitude: 46.7665671,
        latitude: 40.6091272
    },
    {
        name: "Göyçay",
        longitude: 47.6600619,
        latitude: 40.6320298
    },
    {
        name: "Göygöl",
        longitude: 46.3220608,
        latitude: 40.5605684
    },
    {
        name: "Hacıqabul",
        longitude: 48.6193183,
        latitude: 40.075544
    },
    {
        name: "Xaçmaz",
        longitude: 48.7977433,
        latitude: 41.463124
    },
    {
        name: "Xankəndi",
        longitude: 46.7280997,
        latitude: 39.8253496
    },
    {
        name: "Xızı",
        longitude: 48.8674608,
        latitude: 40.7420712
    },
    {
        name: "Xocalı",
        longitude: 46.775016,
        latitude: 39.912389
    },
    {
        name: "Xocavənd",
        longitude: 46.7312495,
        latitude: 39.759505
    },
    {
        name: "İmişli",
        longitude: 48.0294824,
        latitude: 39.8648397
    },
    {
        name: "İsmayıllı",
        longitude: 47.8334913,
        latitude: 40.7841836
    },
    {
        name: "Kəlbəcər",
        longitude: 45.9041078,
        latitude: 40.0639116
    },
    {
        name: "Kəngərli",
        longitude: 45.0036332,
        latitude: 39.4314099
    },
    {
        name: "Kəpəz",
        longitude: 46.3779663,
        latitude: 40.6895881
    },
    {
        name: "Kürdəmir",
        longitude: 48.1432949,
        latitude: 40.3425901
    },
    {
        name: "Qax",
        longitude: 46.9268683,
        latitude: 41.420976
    },
    {
        name: "Qazax",
        longitude: 45.3466913,
        latitude: 41.089653
    },
    {
        name: "Qəbələ",
        longitude: 47.8460007,
        latitude: 40.9811119
    },
    {
        name: "Qobustan",
        longitude: 48.6806115,
        latitude: 40.535453
    },
    {
        name: "Quba",
        longitude: 48.5233213,
        latitude: 41.361881
    },
    {
        name: "Qubadlı",
        longitude: 46.3279322,
        latitude: 39.3054546
    },
    {
        name: "Qusar",
        longitude: 48.4251233,
        latitude: 41.425412
    },
    {
        name: "Laçın",
        longitude: 46.5286881,
        latitude: 39.6346096
    },
    {
        name: "Lerik",
        longitude: 48.3962343,
        latitude: 38.7754634
    },
    {
        name: "Lənkəran",
        longitude: 48.8502943,
        latitude: 38.7573892
    },
    {
        name: "Masallı",
        longitude: 48.6511515,
        latitude: 39.0322663
    },
    {
        name: "Mingəçevir",
        longitude: 47.0432933,
        latitude: 40.772326
    },
    {
        name: "Naftalan",
        longitude: 46.8046821,
        latitude: 40.5147111
    },
    {
        name: "Naxçıvan",
        longitude: 45.4073583,
        latitude: 39.2078781
    },
    {
        name: "Neftçala",
        longitude: 49.1757889,
        latitude: 39.3830094
    },
    {
        name: "Nizami",
        longitude: 46.3540435,
        latitude: 40.6776072
    },
    {
        name: "Oğuz",
        longitude: 47.446947,
        latitude: 41.075951
    },
    {
        name: "Ordubad",
        longitude: 45.7422208,
        latitude: 38.9053251
    },
    {
        name: "Saatlı",
        longitude: 48.1751086,
        latitude: 39.811232
    },
    {
        name: "Sabirabad",
        longitude: 48.3236591,
        latitude: 39.8668845
    },
    {
        name: "Samux",
        longitude: 46.1467529,
        latitude: 40.9382374
    },
    {
        name: "Salyan",
        longitude: 48.7661999,
        latitude: 39.6328098
    },
    {
        name: "Sədərək",
        longitude: 44.8041215,
        latitude: 39.7155379
    },
    {
        name: "Siyəzən",
        longitude: 49.1799223,
        latitude: 40.9961581
    },
    {
        name: "Sumqayıt",
        longitude: 49.6642773,
        latitude: 40.5939811
    },
    {
        name: "Şabran",
        longitude: 48.6159149,
        latitude: 41.114793
    },
    {
        name: "Şahbuz",
        longitude: 45.4607631,
        latitude: 39.4461499
    },
    {
        name: "Şamaxı",
        longitude: 48.6048239,
        latitude: 40.629969
    },
    {
        name: "Şəki",
        longitude: 47.1769853,
        latitude: 41.199666
    },
    {
        name: "Şəmkir",
        longitude: 45.7381949,
        latitude: 40.849984
    },
    {
        name: "Şərur",
        longitude: 44.7729833,
        latitude: 39.5836766
    },
    {
        name: "Şirvan",
        longitude: 48.8540526,
        latitude: 39.9262472
    },
    {
        name: "Şuşa",
        longitude: 46.7312495,
        latitude: 39.759505
    },
    {
        name: "Tərtər",
        longitude: 46.9220065,
        latitude: 40.342158
    },
    {
        name: "Tovuz",
        longitude: 45.5996883,
        latitude: 40.9919613
    },
    {
        name: "Ucar",
        longitude: 47.5844759,
        latitude: 40.4184578
    },
    {
        name: "Yardımlı",
        longitude: 47.996923,
        latitude: 38.8789738
    },
    {
        name: "Yevlax",
        longitude: 47.1277194,
        latitude: 40.6119753
    },
    {
        name: "Zaqatala",
        longitude: 46.3883144,
        latitude: 41.6174994
    },
    {
        name: "Zəngilan",
        longitude: 46.3769867,
        latitude: 39.0488591
    },
    {
        name: "Zərdab",
        longitude: 47.4048174,
        latitude: 40.2351699
    }
];
