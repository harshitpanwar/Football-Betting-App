const mongoose = require('mongoose');
const Country = require('./models/Country');
const Club = require('./models/ClubTeam');

require('dotenv').config();
const countries = [
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", 
    "Australia", "Austria", "Azerbaijan", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", 
    "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", 
    "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", 
    "Chile", "China", "Colombia", "Comoros", "Congo, Democratic Republic of the", "Congo, Republic of the", 
    "Costa Rica", "Côte d’Ivoire", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", 
    "Dominica", "Dominican Republic", "East Timor (Timor-Leste)", "Ecuador", "Egypt", "El Salvador", 
    "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", 
    "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", 
    "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", 
    "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea, North", "Korea, South", 
    "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", 
    "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", 
    "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia, Federated States of", 
    "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar (Burma)", "Namibia", 
    "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Macedonia", 
    "Norway", "Oman", "Pakistan", "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", 
    "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", 
    "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", 
    "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", 
    "Somalia", "South Africa", "Spain", "Sri Lanka", "Sudan", "South Sudan", "Suriname", "Sweden", 
    "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "The Bahamas", "The Gambia", 
    "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", 
    "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", 
    "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];
const clubs = ["A Italiano","A Klagenfurt","Aalborg","Aarhus","Abahani","Aberdeen","Abha","AC Milan",
    "Academica","Academico Viseu","Adana Demirspor","Admira","AEK","AEK Larnaca","Aguilas","Ajax",
    "Akhmat Grozny","Akron","Al Ahli (Egy)","Al Ahli (KSA)","Al Ain (UAE)","Al Akhdoud",
    "Al Batin (KSA)","Al Ettifaq","Al Feiha (KSA)","Al Gharafa (Qat)","Al Hazem","Al Hilal (KSA)",
    "Al Ittihad","Al Jazira (UAE)","Al Khaleej (KSA)","Al Khor (Qat)","Al Merreick (Sudan)",
    "Al Nasr (UAE)","Al Nassr","Al Raed","Al Rayvan (Qat)","Al Riyadh","Al Sadd","Al Safa",
    "Al Shabab (KSA)","Al Taawon (KSA)","Al Taraji (KSA)","Al Wasl (UAE)","Alacranes","Alajuelense",
    "Alanyaspor","Alaves","Albacete","ALBANIA","Aldosivi","Algeria","Al-Hilal Omdurman","Alianza",
    "Alianza Lima","Almeria","Alvarado","Alverca","Always Ready","Amazonas","Ameliano","America Cali",
    "America MG","Amiens","Amorebieta","Anapolina","Anapolis","Anderlecht","Angers","Ankarugucu",
    "Anorthosis","Antalyaspor","Antwerp","APOEL","Apollon Larissa","Apollon Limassol",
    "Apollon Smyrnis","Arandina","Ararat","ARGENTINA","Argentinos Jrs","Aris","Arminia Bielefeld",
    "Arouca","Arsenal","Arsenal Sarandi","Arsenal U21","Asan","Ascoli","Asteras","Aston Villa",
    "Aston Villa U21","Atalanta","Ath Bilbao","Athletico-PR","Atl Madrid","Atl Nacional",
    "Atl. San Luis","Atlanta United","Atlas","Atletico GO","Atletico MG","Atromitos","Augsburg",
    "Aurora","Austin","AUSTRALIA","AUSTRIA","Austria Vienna","Auxerre","Avai","Avelino","Aves",
    "AZ Alkmaar","B SAD","Backa Topola","Bahia","Balingen","Baltika","Banfield","Bangkok Utd",
    "Barcelona","Barcelona B","Barcelona SC","Barnsley","Barracas Central","Basaksehir","Basel"
    ,"Bayern","Beira Mar","Belgium","Belgrano","Benevento","Benfica","Benfica B","Berço","Beroe"
    ,"Besiktas","Betis","Birmingham","Blackburn","Blackpool","Boavista","Boca Juniors","Bochum"
    ,"Bodo Glimt","Bodrumspor","Bogota","Bolivar","BOLIVIA","Bologna","Bolton","Borac","Bordeaux"
    ,"BOSNIA","Botafogo","Botafogo PB","Botafogo SP","Botev Plovdiv","Bournemouth","Braga","Braga B"
    ,"Bragantino","Brann","Brannenburg","BRAZIL","Brentford","Brescia","Brest","Brighton",
    "Bristol City","Bristol Rovers","Brondby","Brusque","Bucaramanga","Budejovice","BULGARIA"
    ,"Burgos","BURKINA FASO","Burnley","Bursaspor","Burton","CABO VERDE","Cadiz","Cagliari",
    "Cambridge","Cameroon","CANADA","Cardiff","Carpi","Cartagena SAD","Cartagines","Casa Pia"
    ,"Cascavel","Castellon","CD Everton","CD Olimpia","CD Vitoria","Ceara","Cejle","Celje"
    ,"Celta","Celtic","Central Cordoba","Cercle Brugge","Cerro Porteno","Chapecoense"
    ,"Charleroi","Charlotte","Charlton","Chauvigny","Chaves","Chelsea","Cheltenham",
    "Chesterfield","Chicago Fire","Chico","CHILE","Chivas Guadalajara","Cincinnati",
    "Clermont","Club A. Guemes","Club America","Club Brugge","Club Leon","Club Nacional",
    "Club Tijuana","Cluj","Cobresal","Colo Colo","COLOMBIA","Colon","Colorado Rapids","Columbus",
    "Como","COMORES","Concordia","Confianca","Copiapo","Corinthians","Coritiba","Cosenza",
    "COSTA DO MARFIM","COSTA RICA","Cova De Piedade","Coventry","Covilha","CRB","Cremonese",
    "Crewe","Criciuma","CROÁCIA U21","CROATIA","Crotone","Cruz Azul","Cruzeiro","Crvena Zvezda",
    "Crystal Palace","CSA","CSKA Moscovo","Cuiaba","Czech Republic","Dallas","Damac","Danubio",
    "Darmstadt","DC United","Defensa Y Justicia","Defensores Belgrano","Defensores Unidos","Deinze",
    "Delfin","Dender","Denizlispor","DENMARK","Dep Cali","Dep La Coruna","Dep Pasto","Deportes Tolima",
    "Desna","Dietikon","Dijon","Din Minsk","Din Zagreb","Dinamo Tbilissi","Djurgarden","Dnipro",
    "Domzale","Dortmund","Dundalk","Dusseldorf","DVTK","Dynamo Kyiv","Dynamo Moscow","ECUADOR",
    "EGIPTO","Egnatia","Eibar","Eintracht Frankfurt","El Gouna","Elche","Emelec","Empoli","ENGLAND",
    "Envigado","Erzgebirge","ESPANHA U21","Espanyol","ESTONIA","Estoril","Estrela","Estudiantes",
    "Ethiopia Bunna","ETIOPIA","Eupen","Everton","Excursionistas","Exeter","Fabril Barreiro",
    "Famalicao","Farense","FC Copenhagen","FCSB","Feirense","Felgueiras","Fenerbahce","Ferencvaros",
    "Feyenoord","FINLAND","Fiorentina","Flamengo","Floresta EC","Fluminense","Fortaleza",
    "Fortaleza (Col)","Foz Do Iguacu","FRANÇA U21","France","Freiburg","Frosinone","Fuenlabrada",
    "Fulham","GABON","Galatasaray","Galway","Gamba Osaka","GAMBIA","Gaz Metan","Gaziantep",
    "Genk","Genoa","Gent","GEORGIA","GERMANY","Getafe","GHANA","Giannina","Gijon","Gil Vicente",
    "Gimnasia L P","Giresunspor","Girona","Gnistan","Go Ahead Eagles","Godoy Cruz","Goias","Goteborg",
    "Goztepe","Granada","Granada B","Grasshoppers","Green Buffaloes","Gremio","GRENADA",
    "Greuther Furth","Groningen","GUADELOUPE","Guairena","Guarani (Parag)","Guimarães B",
    "GUINE BISSAU","GUINE EQUATORIAL","Guinea","GV San Jose","Hajduk Split","Halmstads",
    "Hamburg","Hamilton","Hannover","Hanoi FC","Hansa Rostock","Hapoel Beer Sheva","Hapoel Tel Aviv",
    "Harrogate","Hartberg","Hatayspor","Hatta (UAE)","Hearts","Heidenheim","Heracles","Herediano","Hertha",
    "Hibernian","HJK","Hoffenheim","Holstein Kiel","HONDURAS","Hong Ling (VIE)","Houston",
    "Hradec Kralove","Huachipato","Huddersfield","Huesca","Huila","HUNGARY","Huracan",
    "Iberia 1999","Ibiza","ICELAND","ILHAS FAROE","Ind Medellin","Ind. Rivadavia","Independiente",
    "Independiente Del Valle","Inglaterra U21","Ingolstadt","Instituto","Inter","Inter Miami",
    "Internacional","Ionikos","Ipswich","IRAQ","IRELAND","IRLANDA DO NORTE","Israel","Istanbulspor",
    "ITALIA","Ituano","Jaguares De Cordoba","JAPAN","Jimma","Juarez","Junior","Juventude","Juventus",
    "Juventus-SP","Kairat Almaty","Karagumruk","Karlsruher","Karmitiossa","Kashiwa Reysol",
    "Kasimpasa","Kayserispor","Kazakhstan","Khor Fakkan ","Kilmarnock","Klaksvik","Koln","Kolos",
    "Konyaspor","Kortrijk","KOSOVO","Krasnodar","Krumovgrad","KUPS","KV Mechelen","La Calzada",
    "La Equidad","Lahti","Lamia","Lanus","Larissa","Las Palmas","LASK LINZ","LATVIA","Lausanne",
    "Laval","Lazio","LDU Quito","Leça","Lecce","Lech Poznan","Lechia Gdansk","Leeds","Leganes",
    "Legia","Leicester","Leipzig","Lens","LENS SUB 21","Leones","Levadiakos","Levante","Lille",
    "Lillestrom","Limon","Lincoln Red Imps","LINDA","Liverpool","Liverpool Montevideo","LIVINGSTON",
    "Ljutomer","Lommel","Los Angeles FC","Los Angeles Galaxy","Lotte","Ludogorets","Lugo","Luton",
    "Luxembourg","Lyon","Lyon-Duchère","Macará","Macedonia","Machida Zelvia","Madureira","Mainz",
    "Malaga","Malawi","Malaysia","Maldivas","Malmo","Malta","Mamelodi Sundowns","Manchester City",
    "Manchester United","Mansfield","Marseille","Martigues","Martyas","Mauritania","Mazatlan",
    "MC Alger","Meizhou","Melgar","Melilla","Melipilla","Melrose","Mexico","Middlesbrough","Millwall",
    "Minesota","Minsk","Mirandes","Mjondalen","Mladá","Modena","Molde","Monaco","Monarcas",
    "Monaro Panthers","Monterrey","Montpellier","Montreal","Moreirense","Morocco","MOTAGUA",
    "Motherwell","Mottingham","Moyale","Mulhouse","Mumbai City","Musketeers","Mutual","Mykolaiv",
    "Nakhon Ratchasima","Nancy","Nantes","Napoli","Nashville","Nassaji","Nautico","Nea Salamis",
    "Netherlands","New York","Newcastle","Newell's Old Boys","NICE","Nigeria","Nimes","Niriz",
    "Norway","Nottingham Forest","Nurnberg","OB Odense","Oberneuland","Oeste","Olympiacos",
    "OMONIA","Ontario Fury","Orense","Orlando City","Orleans","Orsha","Osasuna","Osijek",
    "Oskarshamn","Ostende","Osters","Ostersund","Oud-Heverlee Leuven","Pachuca","Pacific",
    "Padova","Palermo","Palestino","Palmeiras","Panaitolikos","Panama","Panathinaikos","Pandaia",
    "Panionios","Pardubice","Paris FC","Parma","PAS Giannina","Patriotas","Pau","Paxtakor",
    "Paysandu","PEC Zwolle","Penarol","Pendikspor","Perugia","Persija Jakarta","Persikabo 1973",
    "Perth Glory","Pescara","PFC Ludogorets","PFC Slavia Sofia","Pharco","Philippines",
    "Phoenix Rising","Pisa","Pohang Steelers","Poland","Ponferradina","Pordenone","Portimonense",
    "Portland Timbers","Porto","Portsmouth","Portugal","Potenza","Preussen Munster","Progresso",
    "PSG","Puebla","Pueblito","Punta Arenas","Puskás Akadémia","Qarabag","Qatar","Querétaro",
    "Queens Park Rangers","Quilmes","Radnik Bijeljina","Raja Casablanca","Raków Czestochowa",
    "Rapid Vienna","Ratchaburi","Rayo Vallecano","RB Bragantino","RB Leipzig","Real Betis",
    "Real Madrid","Real Oviedo","Real Salt Lake","Real Sociedad","Red Bull Salzburg",
    "Red Star Belgrade","Reggina","Registan","Remo","Reus","Reykjavik","Ried","Rijeka","Rio Ave",
    "Rionegro Aguilas","River Plate","Rivers United","Rizespor","Rochdale","Roma","Romania",
    "Rosenborg","Rosario Central","Rostov","Rotherham","Royal Antwerp","Rubin Kazan",
    "Rudar Prijedor","Rudar Velenje","Sabadell","Sagan Tosu","Salernitana","Salford City",
    "Salzburg","Sampdoria","Samsunspor","San Antonio","San Lorenzo","San Marcos","San Martin Tucuman",
    "San Telmo","Sanat Mes Kerman","Sandhausen","Santos","Santos Laguna","Sao Paulo","Sarajevo",
    "Sarandi","Sarmiento","Sassuolo","Saudi Arabia","Sault Ste Marie","Schalke","Scotland",
    "Scunthorpe","Seina","Sekhukhune","Senegal","Septemvri Sofia","Sepsi Sfantu Gheorghe","Serbia",
    "Servette","Sevilla","Shabab Al Ahli","Shabab Al-Ordon","Shakhtar Donetsk","Shandong Taishan",
    "Shanghai Port","Sharjah","Shenyang","Shimizu S-Pulse","Shkendija","Shonan Bellmare","Shrewsbury",
    "Sichuan Jiuniu","Sigma Olomouc","Silkeborg","Simba SC","Sint-Truiden","Skenderbeu",
    "Slaven Belupo","Slavia Mozyr","Slavia Prague","Slovakia","Slovenia","Slovan Bratislava",
    "Sochaux","Sogndal","Sonderjyske","South Africa","Southampton","Spal","Spain","Spartak Moscow",
    "Spezia","Sporting CP","Sporting Cristal","Sporting Kansas City","Sportivo Luqueño","Spurs",
    "St Johnstone","St Louis City","St Mirren","St Patrick's Athletic","St Polten","Stade Brestois",
    "Stade Lavallois","Standard Liege","Stevenage","Stjarnan","Stoke City","Strasbourg",
    "Stromsgodset","Stuttgart","Sudan","Sunderland","Suwon Samsung Bluewings","Switzerland",
    "Sydney FC","Syria","Tacuary","Taipei","Talleres","Tampico","Tampines Rovers","Tanzania",
    "Tarsus","Tartu","Tenerife","Ternana","Thailand","The Strongest","Thisted","Tigres","Tirana",
    "Tobol Kostanay","Tokushima Vortis","Toluca","Torino","Tottenham","Trabzonspor","Troyes",
    "Trujillanos","Tucuman","Tunisia","Turkiye","Tuzlaspor","Tychy","Ukraine","UNAM Pumas",
    "Union Berlin","Union de Santa Fe","Union La Calera","Universidad Catolica",
    "Universidad de Chile","Universitario","Universitario de Deportes","Urawa Reds","Uruguay",
    "Utrecht","Uzbekistan","Valencia","Valenciennes","Valerenga","Valladolid","Vancouver Whitecaps",
    "Venezuela","Venezia","Venezia FC","Ventspils","Vere United","Veria","Verona","VfB Stuttgart",
    "Vfl Wolfsburg","Viitorul","Vietnam","Viking FK","Villarreal","Vizela","Vojvodina","Volendam",
    "Volgar Astrakhan","Waasland-Beveren","Wakefield","Walsall","Wanderers","Wang Topp","Watford",
    "Wealdstone","Wellington Phoenix","West Bromwich Albion","West Ham United",
    "Western Sydney Wanderers","Whitecaps","Wigan Athletic","Wil","Willem II","Wolves","Wrexham",
    "Xamax","Yemen","Yeovil Town","Yokohama","Young Boys","Ypiranga FC","Yverdon","Zamalek",
    "Zamora FC","Zenit St. Petersburg","Zimbabwe","Zrinjski Mostar","Zurich","Zwolle"];

const seedDatabase = async () => {
    try {
        const MONGO_URI = process.env.MONGO_URI;
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Connected to MongoDB");

        await Country.deleteMany({});
        console.log("Existing data for Countries cleared");

        await Club.deleteMany({});
        console.log("Existing data for Clubs cleared");

        const countryData = countries.map(country => ({
            country,
            status: 'Active' 
        }));

        const clubData = clubs.map(club => ({
            name: club,
            status: 'Active'
        }));

        await Country.insertMany(countryData);
        console.log("Database seeded with countries");
        await Club.insertMany(clubData);
        console.log("Database seeded with clubs");

        mongoose.connection.close();
    } catch (error) {
        console.error("Error seeding database:", error);
    }
};

seedDatabase();
