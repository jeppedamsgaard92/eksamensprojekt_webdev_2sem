const endpoints = {

    // TILGÆNGELIGE FOR ALLE UDEN AT VÆRE LOGGET IND
    '.post("/auth/login")': {
        forklaring: 'til at logge ind. Send brugernavn og kode i body',
        hvis_res_ok: {
            success: true,
            message: 'Du er logget ind',
            id: 'randomId',
            username: "Brugernavn",
            role: 'client' || 'admin',
        }, hvis_res_IKKE_ok: {
            success: false,
            message: "Fejlbesked"
        }
    },

    '.get("/auth/user")': {
        forklaring: 'For at vide om man er logget ind eller ej og hvilken rolle man er. Hvis man ikke er logget ind får man vist login-siden',
        hvis_res_ok: {
            success: true,
            id: 'randomId',
            username: "Brugernavn",
            role: 'client' || 'admin',
        },
        hvis_res_IKKE_ok: {
            success: false,
            message: 'User is not logged in'
        }
    },

    '.get("/survey/survey-questions")': {
        forklaring: "For at få spørgsmålene til surveyen",
        hvis_res_ok: [
            'Spørgsmål 1',
            'Spørgsmål 2',
            'Spørgsmål 3'
        ],
        hvis_res_IKKE_ok: {
            success: false,
            message: 'fejlbesked'
        }
    },

    '.post("/survey/survey-answers")': {
        forklaring: 'Til at sende survey besvarelsen ind. Send alle svar i array hvor hvert svar er et objekt med spørgsmål og svar',
        hvis_res_ok: {
            success: true,
            message: 'Surveyen blev modtaget'
        },
        hvis_res_IKKE_ok: {
            success: false,
            message: "Fejlbesked"
        }
    },

    // KUN TILGÆNGELIGE HVIS MAN ER LOGGET IND SOM ADMIN
    '.post("/survey/new-survey")': {
        forklaring: 'For at poste en json-fil med survey spørgsmål. Hvis der allerede findes en, bliver den erstattet med den nye',
        hvis_res_ok: {
            success: true,
            message: 'Survey blev modtaget'
        },
        hvis_res_IKKE_ok: {
            success: false,
            message: 'Fejlbesked'
        }
    },

    /*'.post("/onboarding/pdf-slides")': {
        forklaring: 'Til at oploade ALLE pdf-slides som virksomheden har som del af onboarding.',
        hvis_res_ok: {
            success: true,
            message: 'pdf slides blev uploaded'
        },
        hvis_res_IKKE_ok: {
            success: false,
            message: 'fejlbesked'
        }
    },*/

    /*'.get("/onboarding/pdf-slides")': {
        forklaring: 'til at se alle uploadede pdf-filer',
        hvis_res_ok: [
            {
                filnavn: "filnavn1.pdf",
                src: "path-to-file1.pdf"
            },
            {
                filnavn: "filnavn2.pdf",
                src: "path-to-file2.pdf"
            }
        ],
        hvis_res_IKKE_ok: {
            success: false,
            message: 'Fejlbesked'
        }
    },*/

    '.post("/onboarding/youtube-links")': {
        forklaring: 'Til at poste alle youtube links. Send links i array hvor hvert link er objekt med titel og url',
        hvis_res_ok: {
            success: true,
            message: 'youtube links blev oprettet',
        },
        hvis_res_IKKE_ok: {
            success: false,
            message: 'fejlbesked'
        }
    },

    '.get("/onboarding/youtube-links")': {
        forklaring: 'Til at få liste med alle registrerede youtube links',
        hvis_res_ok: [
            {
                id: "et-id", // Unikt string genereret på serveren
                titel: 'En titel',
                url: 'https://youtube.com/blabla'
            },
            {
                id: "et-id",
                titel: 'En anden titel',
                url: 'https://youtube.com/blabla'
            }
        ]
    },

    '.get("/survey/answered-surveys")': {
        forklaring: 'Til at få alle besvarede surveys',
        hvis_res_ok: [
            {
                surveyId: "et-id", // Unik string genereret på server
                survey: [
                    {
                        question: 'spørgsmål 1',
                        answer: 'Svar 1'
                    },
                    {
                        question: 'spørgsmål 2',
                        answer: 'Svar 2'
                    },
                    {
                        question: 'spørgsmål 3',
                        answer: 'Svar 3'
                    }
                ]
            },
            {
                surveyId: "et-id",
                survey: [
                    {
                        question: 'spørgsmål 1',
                        answer: 'Svar 1'
                    },
                    {
                        question: 'spørgsmål 2',
                        answer: 'Svar 2'
                    },
                    {
                        question: 'spørgsmål 3',
                        answer: 'Svar 3'
                    }
                ]
            }
        ],
        hvis_res_IKKE_ok: {
            success: false,
            message: 'fejlbesked'
        }
    },
     '.get("/survey/answered-surveys")': {
        forklaring: 'Til at få nye besvarede surveys (ikke linkede)',
        hvis_res_ok: [
            {
                surveyId: "et-id",
                survey: [
                    {
                        question: 'spørgsmål 1',
                        answer: 'Svar 1'
                    },
                    {
                        question: 'spørgsmål 2',
                        answer: 'Svar 2'
                    },
                    {
                        question: 'spørgsmål 3',
                        answer: 'Svar 3'
                    }
                ]
            }
        ],
        hvis_res_IKKE_ok: {
            success: false,
            message: 'fejlbesked'
        }
    },          
    '.post("/register/create-new-client-account/:surveyId")': {
        forklaring: 'Admin opretter ny klient bruger ved at sende brugernavn og email i body. Send det relaterede surveyId med i params så server ved hvilken survey der skal tilknyttes konto',
        hvis_res_ok: {
            success: true,
            message: 'Ny klient konto er oprettet'
        },
        hvis_res_IKKE_ok: {
            success: false,
            message: 'fejlbesked'
        }
    },

    '.post("/register/create-new-admin-account")': {
        forklaring: 'Til at oprette ny admin konto. Send brugernavn og kode i body',
        hvis_res_ok: {
            success: true,
            message: 'Ny admin oprettet'
        },
        hvis_res_IKKE_ok: {
            success: false,
            message: 'fejlbesked'
        }
    },

    '.get("/clients/all-clients")': {
        forklaring: 'For at få alle oprettede klienter med alt info om dem',
        hvis_res_ok: [
            {
                userId: "etRandomId", // Genereret på server 
                clientName: "Et virksomhedsnavn",
                surveyAnswers: [
                    { question: "Spørsgmål 1", answer: "Svar 1" },
                    { question: "Spørsgmål 2", answer: "Svar 2" },
                ],
                onboardingSlides: undefined || [ // undefined hvis der ikke er oprettet slides endnu
                    {
                        type: "youtube" || "pdf",
                        src: 'https://link-til-noget.pdf/com' // Link til enten youtube video eller pdf. Brug iframe til at vise både youtube eller pdf
                    },
                    {
                        type: "youtube" || "pdf",
                        src: 'https://link-til-noget.pdf/com'
                    }
                ],
                onboardingProgress: undefined || { // undefined hvis der ikke er uploaded en onboarding til klienten endnu
                    completedSlides: 3, // Det slide klienten er nået til
                    totalSlides: 7 // Antallet af slides
                }
            }
        ],
        hvis_res_IKKE_ok: {
            success: false,
            message: "Kunne ikke finde nogle oprettede klienter"
        }
    },

    'get("/clients/client-info/:userId")': {
        forklaring: 'For at få alt info om en specifik klient',
        hvis_res_ok: {
            userId: "et-id",
            clientName: "Et virksomhedsnavn",
            surveyAnswers: [
                { question: "Spørsgmål 1", answer: "Svar 1" },
                { question: "Spørsgmål 2", answer: "Svar 2" },
            ],
            onboardingSlides: undefined || [ // undefined hvis der ikke er oprettet slides endnu
                {
                    type: "youtube" || "pdf",
                    src: 'https://link-til-noget.pdf/com' // Link til enten youtube video eller pdf. Brug iframe til at vise både youtube eller pdf
                },
                {
                    type: "youtube" || "pdf",
                    src: 'https://link-til-noget.pdf/com'
                }
            ],
            onboardingProgress: undefined || { // undefined hvis der ikke er uploaded en onboarding til klienten endnu
                completedSlides: 3, // Det slide klienten er nået til
                totalSlides: 7 // Antallet af slides
            }
        }
    },

    '.delete("/clients/:userId")': {
        forklaring: 'For at slette en specifik klient-bruger',
        hvis_res_ok: {
            success: true,
            message: 'Klienten blev slettet'
        },
        hvis_res_IKKE_ok: {
            success: false,
            message: 'Fejlbesked'
        }
    },

    '.post("/onboarding/:userId/onboarding")': { //email til registrering/oprettelse af login ligger her
        forklaring: 'Til at poste alle slides til en specifik klient. Hvert slide er et objekt med type (enten youtube eller pdf) og navn som er enten filnavn til en uploaded pdf-fil eller youtube link. I body send array med alle slides. Server sender email notifikation til klient der siger at onboarding er klar',
        hvis_res_ok: {
            success: true,
            message: "Onboarding slides blev uploaded"
        },
        hvis_res_IKKE_ok: {
            success: false,
            message: "Fejlbesked"
        }
    },

    '.put("/onboarding/:userId/onboarding")': {
        forklaring: "for at ændre i et onboarding kursus for en enkelt klient. Send nyt array i body med slides",
        hvis_res_ok: {
            success: true,
            message: 'Onboarding slides blev opdateret'
        },
        hvis_res_IKKE_ok: {
            success: false,
            message: 'fejlbesked'
        }
    },

    '.delete("/onboarding/:userId/onboarding")': {
        forklaring: 'For at slette et onboarding kursus for en bestemt klient',
        hvis_res_ok: {
            success: true,
            message: 'Onboarding kursus blev slettet'
        },
        hvis_res_IKKE_ok: {
            success: false,
            message: 'Fejlbesked'
        }
    },

    // TILGÆNGELIG HVIS MAN ER LOGGET IND SOM KLIENT
    '.get("/onboarding")': {
        forklaring: 'For at få fat i sine onboarding slides. Serveren tjekker hvilken klient, der er logget ind for at finde den rigtige onboarding',
        hvis_res_ok: [
            {
                type: "youtube" || "pdf",
                src: 'https://link-til-noget.pdf/com' // Link til enten youtube video eller pdf. Brug iframe til at vise både youtube eller pdf
            },
            {
                type: "youtube" || "pdf",
                src: 'https://link-til-noget.pdf/com'
            }
        ],
        hvis_res_IKKE_ok: {
            success: false,
            message: "Onboarding er ikke oprettet endnu"
        }
    },

    '.post("/onboarding/onboarding-progress")': {
        forklaring: "For at gemme sin progress i onboardingen. Man gemmer bare hvilken side man er nået til ud af hvor mange der er i alt. Send objekt med currentSlide og totalSlides i body",
        hvis_res_ok: {
            success: true,
            message: 'Onboarding progress blev gemt'
        },
        hvis_res_IKKE_ok: {
            success: false,
            message: 'Fejlbesked'
        }
    },

    // TILGÆNGELIG FOR ALLE ROLLER DER ER LOGGET IND
    '.post("/auth/logout")': {
        forklaring: 'Til at logge ud',
        hvis_res_ok: {
            success: true,
            message: 'Bruger er logget ud'
        },
        hvis_res_IKKE_ok: {
            success: false,
            message: 'fejlbesked'
        }
    }

    //Til at bruger kan slette sin egen konto. Hvis en klient sletter sin konto, slettes også tilknyttet survey og onboarding data. Hvis en admin sletter sin konto, slettes der ikke noget data da admin ikke har nogen survey eller onboarding data tilknyttet.
    '.delete("/me")': {
        forklaring: 'Til at slette sin egen konto som bruger',
        hvis_res_ok: {
            success: true,
            message: "Your account and linked data were deleted.",
        },
        hvis_res_IKKE_ok: {
            success: false,
            message: "User was not found.",
        }
        
    }
    
}

