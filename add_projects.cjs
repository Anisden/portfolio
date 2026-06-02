const fs = require('fs');
const path = require('path');

const publicDir = 'e:\\CV Anis BOUDEN\\Site CV portfolio\\portfolio-app\\public';

// ====================== NOUVEAUX PROJETS ======================
const newProjectsFR = [
  {
    id: "batiment-ferme-ul",
    title: "Bâtiment de ferme – Université Laval",
    region: "quebec",
    meta: "Nouvelle construction | Université Laval (2024)",
    description: "Construction d'un nouveau bâtiment de ferme pour l'Université Laval, intégrant les exigences fonctionnelles agricoles et les normes de construction modernes.",
    longDescription: "Mandat de conception et mise en plan pour la construction d'un nouveau bâtiment de ferme destiné à l'Université Laval. Le projet intègre les exigences fonctionnelles liées aux activités agricoles et de recherche, tout en respectant les normes de construction en vigueur au Québec.\n\nLe bâtiment a été conçu pour optimiser les flux de travail agricoles, avec une attention particulière portée à la ventilation naturelle, à la durabilité des matériaux et à l'intégration paysagère dans le contexte rural universitaire.",
    image: "/uploads/1780404906161_701_main.jpg",
    video: "",
    budget: "",
    currency: "CAD",
    tasks: [
      "Mise en plan des documents de construction",
      "Modélisation 3D et rendu réaliste",
      "Coordination avec les ingénieurs",
      "Conception architecturale"
    ],
    gallery: [
      "/uploads/1780404907183_701_v2.jpg",
      "/uploads/1780404907237_701_v3.jpg",
      "/uploads/1780404907308_701_v4.jpg",
      "/uploads/1780404907369_701_v5.jpg",
      "/uploads/1780404907428_701_v6.jpg"
    ],
    galleryDocs: [],
    galleryRealisation: [],
    galleryBefore: [],
    galleryAfter: [],
    showDistinctionBtn: false,
    year: 2024
  },
  {
    id: "centre-communautaire-ancienne-lorette",
    title: "Centre Communautaire – L'Ancienne-Lorette",
    region: "quebec",
    meta: "Nouvelle construction | Ville de L'Ancienne-Lorette (2023)",
    description: "Construction d'un nouveau centre communautaire multifonctionnel pour la Ville de L'Ancienne-Lorette, offrant des espaces de rassemblement, culturels et récréatifs.",
    longDescription: "Projet de nouvelle construction d'un centre communautaire pour la Ville de L'Ancienne-Lorette (VAL). Le bâtiment regroupe une grande salle polyvalente, des salles de réunion, des bureaux administratifs et des espaces de rassemblement communautaire.\n\nLa conception met de l'avant une architecture contemporaine adaptée au contexte urbain de la ville, avec une grande salle multifonctionnelle pouvant accueillir des événements culturels, sportifs et sociaux. Les matériaux ont été sélectionnés pour assurer durabilité et confort thermique.",
    image: "/uploads/1780404907486_684_main.jpg",
    video: "",
    budget: "",
    currency: "CAD",
    tasks: [
      "Mise en plan des documents de construction (plans, coupes, détails)",
      "Modélisation 3D et rendus réalistes",
      "Coordination avec les ingénieurs",
      "Conception des espaces intérieurs"
    ],
    gallery: [
      "/uploads/1780404907544_684_v2.jpg",
      "/uploads/1780405239995_684_v3.jpg",
      "/uploads/1780405240880_684_v4.jpg",
      "/uploads/1780405240895_684_v5.jpg",
      "/uploads/1780405240911_684_v6.jpg"
    ],
    galleryDocs: [],
    galleryRealisation: [],
    galleryBefore: [],
    galleryAfter: [],
    showDistinctionBtn: false,
    year: 2023
  },
  {
    id: "arena-levis-agrandissement",
    title: "Agrandissement de l'Aréna de Lévis",
    region: "quebec",
    meta: "Mise à jour du PFT – Ajout d'une glace | Ville de Lévis (2023)",
    description: "Mise à jour du Programme Fonctionnel et Technique (PFT) et conception architecturale de l'agrandissement de l'aréna de Lévis pour l'ajout d'une deuxième glace.",
    longDescription: "Mandat de mise à jour du Programme Fonctionnel et Technique (PFT) pour l'agrandissement de l'aréna de Lévis. Le projet consiste en l'ajout d'une deuxième surface de glace au complexe existant, avec les vestiaires, espaces techniques et zones d'accueil nécessaires.\n\nLa conception architecturale propose une intégration harmonieuse du nouvel agrandissement avec le bâtiment existant, en respectant les contraintes d'implantation et les besoins opérationnels de la Ville de Lévis. Le projet comprend également la révision des accès et stationnements.",
    image: "/uploads/1780405240926_689_main.jpg",
    video: "",
    budget: "",
    currency: "CAD",
    tasks: [
      "Mise à jour du Programme Fonctionnel et Technique (PFT)",
      "Conception architecturale de l'agrandissement",
      "Modélisation 3D et rendus réalistes",
      "Mise en plan des documents préliminaires"
    ],
    gallery: [
      "/uploads/1780404907740_689_v2.jpg",
      "/uploads/1780404907756_689_v3.jpg",
      "/uploads/1780404907772_689_v4.jpg",
      "/uploads/1780405240942_689_v5.jpg",
      "/uploads/1780405240957_689_v6.jpg"
    ],
    galleryDocs: [],
    galleryRealisation: [],
    galleryBefore: [],
    galleryAfter: [],
    showDistinctionBtn: false,
    year: 2023
  },
  {
    id: "chalet-parc-marechal-joffre",
    title: "Chalet du Parc Maréchal-Joffre",
    region: "quebec",
    meta: "Reconstruction | Ville de Lévis (2022–2023)",
    description: "Reconstruction complète du chalet de parc Maréchal-Joffre à Lévis, intégrant des vestiaires sportifs, des espaces communautaires et une signalétique adaptée.",
    longDescription: "Projet de reconstruction complète du chalet du parc Maréchal-Joffre pour la Ville de Lévis. Le nouveau bâtiment remplace l'installation vétuste par un édifice contemporain comprenant des vestiaires sportifs modernes, une grande salle communautaire polyvalente, des espaces sanitaires accessibles et un corridor de liaison.\n\nLa conception architecturale s'inspire des chalets de parcs traditionnels québécois tout en intégrant des standards modernes d'accessibilité universelle et d'efficacité énergétique. Le bâtiment a été réalisé et livré à la Ville de Lévis suite à un suivi de chantier rigoureux.",
    image: "/uploads/1780405240973_661_main.jpg",
    video: "",
    budget: "",
    currency: "CAD",
    tasks: [
      "Conception architecturale",
      "Mise en plan des documents de construction",
      "Modélisation 3D et rendus réalistes (Lumion)",
      "Coordination avec les ingénieurs",
      "Suivi de chantier"
    ],
    gallery: [
      "/uploads/1780405240988_661_v2.jpg",
      "/uploads/1780404907864_661_v3.jpg",
      "/uploads/1780404907880_661_v4.jpg",
      "/uploads/1780404907896_661_v5.jpg",
      "/uploads/1780405241003_661_v6.png",
      "/uploads/1780405241019_661_v7.png"
    ],
    galleryDocs: [],
    galleryRealisation: [],
    galleryBefore: [],
    galleryAfter: [],
    showDistinctionBtn: false,
    year: 2022
  },
  {
    id: "piscine-sainte-genevieve",
    title: "Réfection de la Piscine Sainte-Geneviève",
    region: "quebec",
    meta: "Réfection majeure | Ville de Québec (2021–2023)",
    description: "Réfection complète du bassin aquatique et du pavillon de la piscine Sainte-Geneviève à Québec, incluant la démolition et la reconstruction.",
    longDescription: "Projet de réfection majeure de la piscine extérieure Sainte-Geneviève pour la Ville de Québec. Le mandat comprend la démolition du bassin existant et sa reconstruction aux nouvelles normes aquatiques, ainsi que la réfection complète du pavillon de services.\n\nLa conception architecturale propose un bassin de 25 mètres avec des profondeurs variables, une zone peu profonde élargie pour les jeunes enfants, et des vestiaires modernisés favorisant l'accessibilité universelle. Le projet s'inscrit dans le programme de réfection des infrastructures aquatiques de la Ville de Québec.",
    image: "/uploads/1780405241034_629A_v2.png",
    video: "",
    budget: "",
    currency: "CAD",
    tasks: [
      "Mise en plan des documents de construction",
      "Modélisation 3D et rendus réalistes",
      "Coordination avec les ingénieurs (mécanique, structure, civil)",
      "Suivi de chantier"
    ],
    gallery: [
      "/uploads/1780405241050_629A_v3.png",
      "/uploads/1780405241065_629A_v4.png",
      "/uploads/1780405241080_629A_v5.png",
      "/uploads/1780405241096_629A_v6.png",
      "/uploads/1780405241111_629A_v7.png",
      "/uploads/1780405241188_629A_bleu.png",
      "/uploads/1780405241157_629A_v10.png",
      "/uploads/1780405241172_629A_v11.png"
    ],
    galleryDocs: [],
    galleryRealisation: [],
    galleryBefore: [],
    galleryAfter: [],
    showDistinctionBtn: false,
    year: 2021
  },
  {
    id: "piscine-saint-yves",
    title: "Réfection de la Piscine Saint-Yves",
    region: "quebec",
    meta: "Réfection majeure | Ville de Québec (2021–2023)",
    description: "Réfection complète du bassin aquatique de 25 mètres et des installations de la piscine Saint-Yves à Québec.",
    longDescription: "Projet de réfection majeure de la piscine extérieure Saint-Yves pour la Ville de Québec. Le mandat comprend la démolition du bassin existant et sa reconstruction avec un bassin de 25 mètres, une zone d'éclaboussures pour les enfants (playsplash), et la modernisation des infrastructures annexes.\n\nParallèlement à la reconstruction du bassin, le projet inclut la mise aux normes de l'ensemble du site, incluant les accès, le stationnement, la signalisation et l'aménagement paysager. Le suivi de chantier s'est étendu sur deux saisons de construction, assurant la conformité des travaux aux documents de construction.",
    image: "/uploads/1780404908048_629B_main.jpg",
    video: "",
    budget: "",
    currency: "CAD",
    tasks: [
      "Mise en plan des documents de construction",
      "Coordination avec les ingénieurs (mécanique, structure, civil)",
      "Suivi de chantier",
      "Rédaction de rapports de visite de chantier"
    ],
    gallery: [
      "/uploads/1780404908070_629B_v2.jpg",
      "/uploads/1780404908087_629B_v3.jpg",
      "/uploads/1780404908101_629B_v4.jpg",
      "/uploads/1780404908118_629B_v5.jpg",
      "/uploads/1780404908132_629B_v6.jpg"
    ],
    galleryDocs: [],
    galleryRealisation: [],
    galleryBefore: [],
    galleryAfter: [],
    showDistinctionBtn: false,
    year: 2021
  }
];

// English translations
const newProjectsEN = [
  {
    id: "batiment-ferme-ul",
    title: "Farm Building – Laval University",
    region: "quebec",
    meta: "New Construction | Université Laval (2024)",
    description: "Construction of a new farm building for Université Laval, integrating functional agricultural requirements and modern building standards.",
    longDescription: "Design and drafting mandate for the construction of a new farm building for Université Laval. The project integrates functional requirements related to agricultural and research activities, while complying with Quebec construction standards.\n\nThe building was designed to optimize agricultural workflows, with particular attention to natural ventilation, material durability, and landscape integration in the rural university context.",
    image: "/uploads/1780404906161_701_main.jpg",
    video: "",
    budget: "",
    currency: "CAD",
    tasks: [
      "Construction document drafting",
      "3D modeling and realistic rendering",
      "Engineering coordination",
      "Architectural design"
    ],
    gallery: [
      "/uploads/1780404907183_701_v2.jpg",
      "/uploads/1780404907237_701_v3.jpg",
      "/uploads/1780404907308_701_v4.jpg",
      "/uploads/1780404907369_701_v5.jpg",
      "/uploads/1780404907428_701_v6.jpg"
    ],
    galleryDocs: [], galleryRealisation: [], galleryBefore: [], galleryAfter: [],
    showDistinctionBtn: false, year: 2024
  },
  {
    id: "centre-communautaire-ancienne-lorette",
    title: "Community Centre – L'Ancienne-Lorette",
    region: "quebec",
    meta: "New Construction | City of L'Ancienne-Lorette (2023)",
    description: "Construction of a new multifunctional community centre for the City of L'Ancienne-Lorette, offering gathering, cultural and recreational spaces.",
    longDescription: "New construction project for a community centre for the City of L'Ancienne-Lorette (VAL). The building includes a large multipurpose hall, meeting rooms, administrative offices and community gathering spaces.\n\nThe design features contemporary architecture adapted to the urban context, with a multifunctional hall capable of hosting cultural, sporting and social events.",
    image: "/uploads/1780404907486_684_main.jpg",
    video: "",
    budget: "",
    currency: "CAD",
    tasks: [
      "Construction document drafting (plans, sections, details)",
      "3D modeling and realistic rendering",
      "Engineering coordination",
      "Interior space design"
    ],
    gallery: [
      "/uploads/1780404907544_684_v2.jpg",
      "/uploads/1780405239995_684_v3.jpg",
      "/uploads/1780405240880_684_v4.jpg",
      "/uploads/1780405240895_684_v5.jpg",
      "/uploads/1780405240911_684_v6.jpg"
    ],
    galleryDocs: [], galleryRealisation: [], galleryBefore: [], galleryAfter: [],
    showDistinctionBtn: false, year: 2023
  },
  {
    id: "arena-levis-agrandissement",
    title: "Lévis Arena – Second Ice Rink Addition",
    region: "quebec",
    meta: "PFT Update – Second Ice Rink | City of Lévis (2023)",
    description: "Update of the Functional and Technical Program (PFT) and architectural design for the expansion of the Lévis arena to add a second ice surface.",
    longDescription: "Mandate to update the Functional and Technical Program (PFT) for the expansion of the Lévis arena. The project consists of adding a second ice surface to the existing complex, with the required locker rooms, technical spaces and welcome areas.\n\nThe architectural design proposes a harmonious integration of the new expansion with the existing building, while respecting site constraints and the City of Lévis's operational needs.",
    image: "/uploads/1780405240926_689_main.jpg",
    video: "",
    budget: "",
    currency: "CAD",
    tasks: [
      "Update of the Functional and Technical Program (PFT)",
      "Architectural design of the expansion",
      "3D modeling and realistic rendering",
      "Preliminary drawing production"
    ],
    gallery: [
      "/uploads/1780404907740_689_v2.jpg",
      "/uploads/1780404907756_689_v3.jpg",
      "/uploads/1780404907772_689_v4.jpg",
      "/uploads/1780405240942_689_v5.jpg",
      "/uploads/1780405240957_689_v6.jpg"
    ],
    galleryDocs: [], galleryRealisation: [], galleryBefore: [], galleryAfter: [],
    showDistinctionBtn: false, year: 2023
  },
  {
    id: "chalet-parc-marechal-joffre",
    title: "Maréchal-Joffre Park Chalet",
    region: "quebec",
    meta: "Reconstruction | City of Lévis (2022–2023)",
    description: "Complete reconstruction of the Maréchal-Joffre park chalet in Lévis, integrating sports locker rooms, community spaces and adapted signage.",
    longDescription: "Complete reconstruction project for the Maréchal-Joffre park chalet for the City of Lévis. The new building replaces the outdated facility with a contemporary structure including modern sports locker rooms, a large multipurpose community hall, accessible washrooms and a connecting corridor.\n\nThe architectural design draws inspiration from traditional Quebec park chalets while integrating modern standards of universal accessibility and energy efficiency.",
    image: "/uploads/1780405240973_661_main.jpg",
    video: "",
    budget: "",
    currency: "CAD",
    tasks: [
      "Architectural design",
      "Construction document drafting",
      "3D modeling and realistic rendering (Lumion)",
      "Engineering coordination",
      "Construction site supervision"
    ],
    gallery: [
      "/uploads/1780405240988_661_v2.jpg",
      "/uploads/1780404907864_661_v3.jpg",
      "/uploads/1780404907880_661_v4.jpg",
      "/uploads/1780404907896_661_v5.jpg",
      "/uploads/1780405241003_661_v6.png",
      "/uploads/1780405241019_661_v7.png"
    ],
    galleryDocs: [], galleryRealisation: [], galleryBefore: [], galleryAfter: [],
    showDistinctionBtn: false, year: 2022
  },
  {
    id: "piscine-sainte-genevieve",
    title: "Sainte-Geneviève Pool Renovation",
    region: "quebec",
    meta: "Major Renovation | City of Québec (2021–2023)",
    description: "Complete renovation of the aquatic basin and pavilion of the Sainte-Geneviève outdoor pool in Québec City.",
    longDescription: "Major renovation project for the Sainte-Geneviève outdoor pool for the City of Québec. The mandate includes demolition of the existing basin and its reconstruction to new aquatic standards, as well as complete renovation of the service pavilion.\n\nThe architectural design features a 25-meter pool with variable depths, an enlarged shallow area for young children, and modernized changerooms promoting universal accessibility.",
    image: "/uploads/1780405241034_629A_v2.png",
    video: "",
    budget: "",
    currency: "CAD",
    tasks: [
      "Construction document drafting",
      "3D modeling and realistic rendering",
      "Engineering coordination (mechanical, structural, civil)",
      "Construction site supervision"
    ],
    gallery: [
      "/uploads/1780405241050_629A_v3.png",
      "/uploads/1780405241065_629A_v4.png",
      "/uploads/1780405241080_629A_v5.png",
      "/uploads/1780405241096_629A_v6.png",
      "/uploads/1780405241111_629A_v7.png",
      "/uploads/1780405241188_629A_bleu.png",
      "/uploads/1780405241157_629A_v10.png",
      "/uploads/1780405241172_629A_v11.png"
    ],
    galleryDocs: [], galleryRealisation: [], galleryBefore: [], galleryAfter: [],
    showDistinctionBtn: false, year: 2021
  },
  {
    id: "piscine-saint-yves",
    title: "Saint-Yves Pool Renovation",
    region: "quebec",
    meta: "Major Renovation | City of Québec (2021–2023)",
    description: "Complete renovation of the 25-meter aquatic basin and facilities of the Saint-Yves outdoor pool in Québec City.",
    longDescription: "Major renovation project for the Saint-Yves outdoor pool for the City of Québec. The mandate includes demolition of the existing pool and reconstruction with a 25-meter basin, a splash pad for children, and modernization of ancillary infrastructure.\n\nAlongside the pool reconstruction, the project includes upgrading the entire site including access routes, parking, signage and landscaping. Construction site supervision spanned two construction seasons.",
    image: "/uploads/1780404908048_629B_main.jpg",
    video: "",
    budget: "",
    currency: "CAD",
    tasks: [
      "Construction document drafting",
      "Engineering coordination (mechanical, structural, civil)",
      "Construction site supervision",
      "Site visit report writing"
    ],
    gallery: [
      "/uploads/1780404908070_629B_v2.jpg",
      "/uploads/1780404908087_629B_v3.jpg",
      "/uploads/1780404908101_629B_v4.jpg",
      "/uploads/1780404908118_629B_v5.jpg",
      "/uploads/1780404908132_629B_v6.jpg"
    ],
    galleryDocs: [], galleryRealisation: [], galleryBefore: [], galleryAfter: [],
    showDistinctionBtn: false, year: 2021
  }
];

// Arabic translations
const newProjectsAR = [
  {
    id: "batiment-ferme-ul",
    title: "مبنى المزرعة – جامعة لافال",
    region: "quebec",
    meta: "بناء جديد | جامعة لافال (2024)",
    description: "إنشاء مبنى مزرعة جديد لجامعة لافال، يدمج المتطلبات الوظيفية الزراعية ومعايير البناء الحديثة.",
    longDescription: "مهمة تصميم وإعداد وثائق بناء مبنى مزرعة جديد لجامعة لافال. يدمج المشروع المتطلبات الوظيفية المتعلقة بالأنشطة الزراعية والبحثية، مع الالتزام بمعايير البناء المعمول بها في كيبك.",
    image: "/uploads/1780404906161_701_main.jpg",
    video: "",
    budget: "",
    currency: "CAD",
    tasks: [
      "إعداد وثائق البناء",
      "النمذجة ثلاثية الأبعاد والتصيير الواقعي",
      "التنسيق مع المهندسين",
      "التصميم المعماري"
    ],
    gallery: [
      "/uploads/1780404907183_701_v2.jpg",
      "/uploads/1780404907237_701_v3.jpg",
      "/uploads/1780404907308_701_v4.jpg",
      "/uploads/1780404907369_701_v5.jpg",
      "/uploads/1780404907428_701_v6.jpg"
    ],
    galleryDocs: [], galleryRealisation: [], galleryBefore: [], galleryAfter: [],
    showDistinctionBtn: false, year: 2024
  },
  {
    id: "centre-communautaire-ancienne-lorette",
    title: "المركز الاجتماعي – لانسيان لوريت",
    region: "quebec",
    meta: "بناء جديد | مدينة لانسيان لوريت (2023)",
    description: "إنشاء مركز اجتماعي متعدد الوظائف لمدينة لانسيان لوريت.",
    longDescription: "مشروع بناء جديد لمركز اجتماعي في مدينة لانسيان لوريت (VAL). يضم المبنى قاعة متعددة الاستخدامات كبيرة وقاعات اجتماعات ومكاتب إدارية وفضاءات تجمع مجتمعي.",
    image: "/uploads/1780404907486_684_main.jpg",
    video: "",
    budget: "",
    currency: "CAD",
    tasks: [
      "إعداد وثائق البناء (مخططات، مقاطع، تفاصيل)",
      "النمذجة ثلاثية الأبعاد والتصيير الواقعي",
      "التنسيق مع المهندسين",
      "تصميم الفضاءات الداخلية"
    ],
    gallery: [
      "/uploads/1780404907544_684_v2.jpg",
      "/uploads/1780405239995_684_v3.jpg",
      "/uploads/1780405240880_684_v4.jpg",
      "/uploads/1780405240895_684_v5.jpg",
      "/uploads/1780405240911_684_v6.jpg"
    ],
    galleryDocs: [], galleryRealisation: [], galleryBefore: [], galleryAfter: [],
    showDistinctionBtn: false, year: 2023
  },
  {
    id: "arena-levis-agrandissement",
    title: "توسعة ملعب الجليد – ليفي",
    region: "quebec",
    meta: "تحديث البرنامج الوظيفي – إضافة ملعب جليد | مدينة ليفي (2023)",
    description: "تحديث البرنامج الوظيفي والتقني وتصميم توسعة ملعب الجليد في ليفي لإضافة سطح جليد ثانٍ.",
    longDescription: "مهمة تحديث البرنامج الوظيفي والتقني لتوسعة ملعب الجليد في ليفي. يتضمن المشروع إضافة سطح جليد ثانٍ إلى المجمع القائم، مع غرف تبديل الملابس والفضاءات التقنية وأماكن الاستقبال الضرورية.",
    image: "/uploads/1780405240926_689_main.jpg",
    video: "",
    budget: "",
    currency: "CAD",
    tasks: [
      "تحديث البرنامج الوظيفي والتقني",
      "التصميم المعماري للتوسعة",
      "النمذجة ثلاثية الأبعاد والتصيير الواقعي",
      "إعداد الوثائق التمهيدية"
    ],
    gallery: [
      "/uploads/1780404907740_689_v2.jpg",
      "/uploads/1780404907756_689_v3.jpg",
      "/uploads/1780404907772_689_v4.jpg",
      "/uploads/1780405240942_689_v5.jpg",
      "/uploads/1780405240957_689_v6.jpg"
    ],
    galleryDocs: [], galleryRealisation: [], galleryBefore: [], galleryAfter: [],
    showDistinctionBtn: false, year: 2023
  },
  {
    id: "chalet-parc-marechal-joffre",
    title: "شاليه حديقة ماريشال جوفر",
    region: "quebec",
    meta: "إعادة بناء | مدينة ليفي (2022–2023)",
    description: "إعادة بناء كاملة لشاليه الحديقة في ليفي، يضم غرف تبديل الملابس وفضاءات مجتمعية.",
    longDescription: "مشروع إعادة بناء كاملة لشاليه حديقة ماريشال جوفر لمدينة ليفي. يحل المبنى الجديد محل المنشأة القديمة بهيكل معاصر يتضمن غرف تبديل ملابس رياضية حديثة وقاعة مجتمعية كبيرة ودورات مياه يسهل الوصول إليها.",
    image: "/uploads/1780405240973_661_main.jpg",
    video: "",
    budget: "",
    currency: "CAD",
    tasks: [
      "التصميم المعماري",
      "إعداد وثائق البناء",
      "النمذجة ثلاثية الأبعاد والتصيير الواقعي (Lumion)",
      "التنسيق مع المهندسين",
      "الإشراف على الورشة"
    ],
    gallery: [
      "/uploads/1780405240988_661_v2.jpg",
      "/uploads/1780404907864_661_v3.jpg",
      "/uploads/1780404907880_661_v4.jpg",
      "/uploads/1780404907896_661_v5.jpg",
      "/uploads/1780405241003_661_v6.png",
      "/uploads/1780405241019_661_v7.png"
    ],
    galleryDocs: [], galleryRealisation: [], galleryBefore: [], galleryAfter: [],
    showDistinctionBtn: false, year: 2022
  },
  {
    id: "piscine-sainte-genevieve",
    title: "تجديد مسبح سانت جينيفيف",
    region: "quebec",
    meta: "ترميم شامل | مدينة كيبك (2021–2023)",
    description: "ترميم كامل لحوض المسبح وجناح الخدمات في مسبح سانت جينيفيف الخارجي بمدينة كيبك.",
    longDescription: "مشروع ترميم شامل لمسبح سانت جينيفيف الخارجي لمدينة كيبك. يتضمن المهمة هدم الحوض القائم وإعادة بنائه وفق معايير المسابح الجديدة، فضلاً عن الترميم الكامل لجناح الخدمات.",
    image: "/uploads/1780405241034_629A_v2.png",
    video: "",
    budget: "",
    currency: "CAD",
    tasks: [
      "إعداد وثائق البناء",
      "النمذجة ثلاثية الأبعاد والتصيير الواقعي",
      "التنسيق مع المهندسين",
      "الإشراف على الورشة"
    ],
    gallery: [
      "/uploads/1780405241050_629A_v3.png",
      "/uploads/1780405241065_629A_v4.png",
      "/uploads/1780405241080_629A_v5.png",
      "/uploads/1780405241096_629A_v6.png",
      "/uploads/1780405241111_629A_v7.png",
      "/uploads/1780405241188_629A_bleu.png",
      "/uploads/1780405241157_629A_v10.png",
      "/uploads/1780405241172_629A_v11.png"
    ],
    galleryDocs: [], galleryRealisation: [], galleryBefore: [], galleryAfter: [],
    showDistinctionBtn: false, year: 2021
  },
  {
    id: "piscine-saint-yves",
    title: "تجديد مسبح سان إيف",
    region: "quebec",
    meta: "ترميم شامل | مدينة كيبك (2021–2023)",
    description: "ترميم كامل لحوض السباحة ذو 25 متراً ومرافق مسبح سان إيف الخارجي بمدينة كيبك.",
    longDescription: "مشروع ترميم شامل لمسبح سان إيف الخارجي لمدينة كيبك. يتضمن المهمة هدم المسبح القائم وإعادة بنائه بحوض 25 متراً ومنطقة مائية للأطفال وتحديث البنية التحتية.",
    image: "/uploads/1780404908048_629B_main.jpg",
    video: "",
    budget: "",
    currency: "CAD",
    tasks: [
      "إعداد وثائق البناء",
      "التنسيق مع المهندسين",
      "الإشراف على الورشة",
      "كتابة تقارير زيارات الورشة"
    ],
    gallery: [
      "/uploads/1780404908070_629B_v2.jpg",
      "/uploads/1780404908087_629B_v3.jpg",
      "/uploads/1780404908101_629B_v4.jpg",
      "/uploads/1780404908118_629B_v5.jpg",
      "/uploads/1780404908132_629B_v6.jpg"
    ],
    galleryDocs: [], galleryRealisation: [], galleryBefore: [], galleryAfter: [],
    showDistinctionBtn: false, year: 2021
  }
];

// ====================== UPDATE JSON FILES ======================
function updateJsonFile(filename, newProjects) {
  const filePath = path.join(publicDir, filename);
  const existing = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  // Remove any existing entries with same IDs (avoid duplicates)
  const ids = newProjects.map(p => p.id);
  const filtered = existing.filter(p => !ids.includes(p.id));
  
  // Find insertion points based on year
  // Insert new projects at the right position (sorted by year desc)
  const combined = [...filtered];
  
  for (const newProj of newProjects) {
    // Find first project with year <= newProj.year
    const insertIdx = combined.findIndex(p => (p.year || 0) <= newProj.year);
    if (insertIdx === -1) {
      combined.push(newProj);
    } else {
      combined.splice(insertIdx, 0, newProj);
    }
  }
  
  fs.writeFileSync(filePath, JSON.stringify(combined, null, 2), 'utf8');
  console.log(`Updated ${filename}: ${combined.length} projects total`);
}

updateJsonFile('projects_fr.json', newProjectsFR);
updateJsonFile('projects_en.json', newProjectsEN);
updateJsonFile('projects_ar.json', newProjectsAR);
updateJsonFile('projects.json', newProjectsFR);

console.log('\nDone! All JSON files updated.');
