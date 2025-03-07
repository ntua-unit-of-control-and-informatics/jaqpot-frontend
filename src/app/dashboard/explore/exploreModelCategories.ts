export interface ExplorePageCategory {
  name: string;
  description: string;
  imageUrl?: string;
  href?: string;
  categories: ExplorePageCategory[];
  models?: ExplorePageModel[];
  organizations?: ExplorePageOrganization[];
}

export interface ExplorePageModelBase {
  name: string;
  imageUrl: string;
  description: string;
}

export type ExplorePageModelWithId = ExplorePageModelBase & { id: number };
export type ExplorePageModelWithHref = ExplorePageModelBase & { href: string };
export type ExplorePageModel =
  | ExplorePageModelWithId
  | ExplorePageModelWithHref;

export interface ExplorePageOrganization {
  name: string;
  description: string;
  imageUrl: string;
  models?: ExplorePageModel[];
}

const CHIASMA_ORGANIZATION = {
  name: 'CHIASMA',
  description: 'EU Horizon project (grant agreement No. 101137613.)',
  imageUrl:
    'https://raw.githubusercontent.com/ntua-unit-of-control-and-informatics/images/master/CHIASMA.png',
};
const SCENARIOS_ORGANIZATION = {
  name: 'SCENARIOS',
  description: 'EU Horizon project (grant agreement No. 101037509)',
  imageUrl:
    'https://raw.githubusercontent.com/ntua-unit-of-control-and-informatics/images/master/SCENARIOS.jpg',
};
export const EXPLORE_PAGE_CATEGORIES: ExplorePageCategory = {
  name: 'Explore models',
  description: 'Explore models hosted in the Jaqpot platform',
  categories: [
    {
      name: 'LLMs',
      description: 'Large language models for text generation and analysis',
      imageUrl:
        'https://raw.githubusercontent.com/ntua-unit-of-control-and-informatics/images/refs/heads/master/LLM.webp',
      models: [
        {
          id: 1994,
          name: 'Mistral 7B',
          imageUrl:
            'https://raw.githubusercontent.com/ntua-unit-of-control-and-informatics/images/refs/heads/master/mistral-7b-v0.1.jpg',
          description:
            'A 7.3 billion parameter language model that performs well on reasoning, math, and coding tasks',
        },
        {
          id: 2000,
          name: 'DeepSeek-R1-Distill-Qwen-1.5B',
          imageUrl:
            'https://raw.githubusercontent.com/ntua-unit-of-control-and-informatics/images/3822d8e2eca90b33218be14a1c93485805b700d3/deepseek.svg',
          description:
            'DeepSeek-R1-Distill-Qwen-1.5B is a 1.5 billion parameter language model that was created by distilling the larger Qwen model. The model has been optimized specifically for tasks that involve reasoning.',
        },
        {
          id: 1983,
          name: 'LLama 3.2 1B',
          imageUrl:
            'https://raw.githubusercontent.com/ntua-unit-of-control-and-informatics/images/refs/heads/master/llama.png',
          description:
            "A compact 1 billion parameter version of meta's llama 3.2 model, optimized for efficiency",
        },
      ],
      organizations: [],
      categories: [],
    },
    {
      name: 'Generative',
      description:
        'Models designed to generate novel data, such as molecules, images, and sequences, using AI-driven probabilistic and deep learning approaches.',
      imageUrl:
        'https://raw.githubusercontent.com/ntua-unit-of-control-and-informatics/images/refs/heads/master/generative.webp',
      models: [
        {
          id: 2032,
          name: 'GFlowNet LogP Generator',
          imageUrl:
            'https://raw.githubusercontent.com/ntua-unit-of-control-and-informatics/images/refs/heads/master/gflownet.webp',
          description:
            'A generative model based on GFlowNet that designs molecules with high logP values, optimizing for lipophilicity in drug discovery applications.',
        },
      ],
      organizations: [],
      categories: [],
    },
    {
      name: 'Image-Analysis',
      description:
        'This category includes AI-driven models designed to analyze, generate, and enhance images using deep learning and probabilistic approaches. These models can perform tasks such as pattern recognition, image segmentation, and data generation, enabling advancements in fields like scientific research, medical imaging, and generative design.',
      imageUrl:
        'https://nanoimage.jaqpot.org/nanoImage/resources/images/hero-bg.jpg',
      models: [
        {
          name: 'Extracting data from microscopy images',
          imageUrl:
            'https://nanoimage.jaqpot.org/nanoImage/resources/images/hero-bg.jpg',
          href: 'https://nanoimage.jaqpot.org/nanoImage/',
          description:
            'A generative model based on GFlowNet that designs molecules with high logP values, optimizing for lipophilicity in drug discovery applications.',
        },
      ],
      organizations: [],
      categories: [],
    },
    {
      name: 'Read-across',
      description:
        'Read-across is a computational approach used for property prediction by identifying structurally similar molecules and inferring their characteristics. Unlike traditional machine learning models, read-across relies on similarity searches to find close molecular analogs and make predictions based on known properties of similar compounds. This method is widely used in toxicology, regulatory science, and chemical risk assessment.',
      imageUrl:
        'https://raw.githubusercontent.com/ntua-unit-of-control-and-informatics/images/refs/heads/master/read-across.webp',
      models: [
        {
          name: 'Apellis',
          imageUrl:
            'https://raw.githubusercontent.com/ntua-unit-of-control-and-informatics/images/refs/heads/master/read-across.webp',
          href: 'https://apellis.jaqpot.org/',
          description:
            'A computational model that performs similarity-based predictions by identifying structurally related molecules and inferring their properties, supporting applications in chemical safety and regulatory assessments.',
        },
      ],
      organizations: [],
      categories: [],
    },

    {
      name: 'PFAS',
      description: 'Predictive models for per- and polyfluoroalkyl substances',
      imageUrl:
        'https://raw.githubusercontent.com/ntua-unit-of-control-and-informatics/images/master/PFAS.jpg',
      models: [
        {
          id: 1685,
          name: 'PFOS/PFOA Human PBK',
          imageUrl:
            'https://raw.githubusercontent.com/ntua-unit-of-control-and-informatics/images/master/Loccisano_human_pfoa.jpg',
          description:
            'The model of this application is a deployment of the model published by Loccisano et al. (2011).',
        },
        {
          id: 1730,
          name: 'Extended PFOA male rat PBK',
          imageUrl:
            'https://raw.githubusercontent.com/ntua-unit-of-control-and-informatics/images/master/Tsiros_PFOA_2024.png',
          description:
            'This PBK model describes the biodistribution of PFOA in male rats after IV or oral administration (presented in Tsiros et al., 2024) ',
        },
        {
          id: 1689,
          name: 'PFAAs Protein-Binding Fish PBK',
          imageUrl:
            'https://raw.githubusercontent.com/ntua-unit-of-control-and-informatics/images/master/NG_et_al_2013.jpg',
          description:
            'This PBK model predicts the biodistribution of various PFAAs in fish, who are exposed via water (Ng et al., 2013)',
        },
        {
          id: 1686,
          name: 'PFOS Rainbow trout PBTK',
          imageUrl:
            'https://raw.githubusercontent.com/ntua-unit-of-control-and-informatics/images/master/PFOS_RT.jpg',
          description:
            'This PBK model predicts the biodistribution of PFOS in Rainbow trout after both oral and dietary exposure (Vidal et al., 2020) ',
        },
        {
          id: 1554,
          name: 'PFDA rat PBK',
          imageUrl:
            'https://raw.githubusercontent.com/ntua-unit-of-control-and-informatics/images/master/PFDA.png',
          description:
            ' This PBK model developed by Kim et al., 2019 for describing the biodistribution of PFDA in rats after oral or iv exposure (application from Bernstein et al., 2021) ',
        },
      ],
      organizations: [SCENARIOS_ORGANIZATION, CHIASMA_ORGANIZATION],
      categories: [],
    },
    {
      name: 'Nanomaterials',
      description: 'Predictive models for nanomaterials',
      imageUrl:
        'https://raw.githubusercontent.com/ntua-unit-of-control-and-informatics/images/master/nanomaterials.jpg',
      categories: [],
      models: [
        {
          id: 1731,
          name: 'TiO2 IV rat PBK model',
          imageUrl:
            'https://raw.githubusercontent.com/ntua-unit-of-control-and-informatics/images/master/tio2_iv_pbk_new.png',
          description:
            'A PBK model for describing the biodistribution of TiO2 nanoparticles in rats after IV injection',
        },

        {
          id: 1470,
          name: 'MWCNTs genotoxicity',
          imageUrl:
            'https://raw.githubusercontent.com/ntua-unit-of-control-and-informatics/images/master/MWCNT.jpg',
          description:
            'Random Forest model for the genotoxicity classificaton of Multi-walled Carbon nanotubes',
        },

        {
          id: 1243,
          name: 'PAA-PEG PBK model',
          imageUrl:
            'https://raw.githubusercontent.com/ntua-unit-of-control-and-informatics/images/master/paa-peg.PNG',
          description:
            'A PBK model for describing the biodistribution of PAA-PEG nanoparticles in rats after IV injection',
        },

        {
          id: 1487,
          name: 'Technetium PBK model',
          imageUrl:
            'https://raw.githubusercontent.com/ntua-unit-of-control-and-informatics/images/master/technetium.PNG',
          description: ' ',
        },
      ],
    },
    {
      name: 'Pharmaceuticals',
      description: 'Predictive models for pharmaceuticals',
      imageUrl:
        'https://raw.githubusercontent.com/ntua-unit-of-control-and-informatics/images/master/pharmaceuticals.jpg',
      categories: [],
      models: [
        {
          id: 1210,
          name: 'Diazepam PBK model',
          imageUrl:
            'https://raw.githubusercontent.com/ntua-unit-of-control-and-informatics/images/master/DiazPBPK.png',
          description:
            'A PBK model for describing the biodistribution of diazepam in humans after IV injection',
        },
      ],
    },
    {
      name: 'QSAR',
      description: 'Quantitative Structure-Activity Relationship models',
      imageUrl:
        'https://raw.githubusercontent.com/ntua-unit-of-control-and-informatics/images/master/biological_activity.jpg',
      categories: [],
      models: [
        {
          id: 1837,
          name: 'QSAR Toolbox ExplorePageModel Integration',
          imageUrl:
            'https://raw.githubusercontent.com/ntua-unit-of-control-and-informatics/images/master/QSAR_toolbox_logo.jpg',
          description:
            'This machine learning model serves as an interface for the QSAR Toolbox API, allowing users to input SMILES strings and select a QSPR model to generate predictive values for various properties.',
        },
        {
          id: 1842,
          name: 'QSAR Toolbox Profiler integration',
          imageUrl:
            'https://raw.githubusercontent.com/ntua-unit-of-control-and-informatics/images/master/QSAR_toolbox_logo.jpg',
          description:
            'This machine learning model serves as an interface for the QSAR Toolbox API, allowing users to input SMILES strings and select a QSPR model to generate predictive values for various properties.',
        },

        {
          id: 6,
          name: 'QSAR Toolbox Calculator Integration',
          imageUrl:
            'https://raw.githubusercontent.com/ntua-unit-of-control-and-informatics/images/master/QSAR_toolbox_logo.jpg',
          description:
            'This machine learning model serves as an interface for the QSAR Toolbox API, allowing users to input SMILES strings and select a QSPR model to generate predictive values for various properties.',
        },

        {
          id: 1470,
          name: 'MWCNTs genotoxicity',
          imageUrl:
            'https://raw.githubusercontent.com/ntua-unit-of-control-and-informatics/images/master/MWCNT.jpg',
          description:
            'Random Forest model for the genotoxicity classificaton of Multi-walled Carbon nanotubes',
        },
      ],
    },

    {
      name: 'QSPR',
      description: 'Quantitative Structure-Property Relationship models',
      imageUrl:
        'https://raw.githubusercontent.com/ntua-unit-of-control-and-informatics/images/master/molecular_property.jpg',
      categories: [],
      models: [
        {
          id: 1837,
          name: 'QSAR Toolbox ExplorePageModel Integration',
          imageUrl:
            'https://raw.githubusercontent.com/ntua-unit-of-control-and-informatics/images/master/QSAR_toolbox_logo.jpg',
          description:
            'This machine learning model serves as an interface for the QSAR Toolbox API, allowing users to input SMILES strings and select a QSPR model to generate predictive values for various properties.',
        },

        {
          id: 1842,
          name: 'QSAR Toolbox Profiler integration',
          imageUrl:
            'https://raw.githubusercontent.com/ntua-unit-of-control-and-informatics/images/master/QSAR_toolbox_logo.jpg',
          description:
            'This machine learning model serves as an interface for the QSAR Toolbox API, allowing users to input SMILES strings and select a QSPR model to generate predictive values for various properties.',
        },
        {
          id: 6,
          name: 'QSAR Toolbox Calculator Integration',
          imageUrl:
            'https://raw.githubusercontent.com/ntua-unit-of-control-and-informatics/images/master/QSAR_toolbox_logo.jpg',
          description:
            'This machine learning model serves as an interface for the QSAR Toolbox API, allowing users to input SMILES strings and select a QSPR model to generate predictive values for various properties.',
        },
        {
          id: 2032,
          name: 'GFlowNet LogP Generator',
          imageUrl:
            'https://raw.githubusercontent.com/ntua-unit-of-control-and-informatics/images/refs/heads/master/gflownet.webp',
          description:
            'A generative model based on GFlowNet that designs molecules with high logP values, optimizing for lipophilicity in drug discovery applications.',
        },
      ],
    },
    {
      name: 'Biokinetics',
      description:
        'Models for predicting the internal disposition of chemicals and materials',
      imageUrl:
        'https://raw.githubusercontent.com/ntua-unit-of-control-and-informatics/images/master/biokinetics.jpg',
      categories: [],
      models: [
        {
          id: 1731,
          name: 'TiO2 IV rat PBK model',
          imageUrl:
            'https://raw.githubusercontent.com/ntua-unit-of-control-and-informatics/images/master/tio2_iv_pbk_new.png',
          description:
            'PBK model for describing the biodistribution of TiO2 nanoparticles in rats after IV injection',
        },
        {
          id: 1731,
          name: 'PFOA IV rat PBK model',
          imageUrl:
            'https://raw.githubusercontent.com/ntua-unit-of-control-and-informatics/images/master/Tsiros_PFOA_2024.png',
          description:
            'PBK model for describing the biodistribution of TiO2 nanoparticles in rats after IV injection',
        },

        {
          id: 1210,
          name: 'Diazepam PBK model',
          imageUrl:
            'https://raw.githubusercontent.com/ntua-unit-of-control-and-informatics/images/master/DiazPBPK.png',
          description:
            'A PBK model for describing the biodistribution of diazepam in humans after IV injection',
        },
      ],
    },
    {
      name: 'Multi-scale-Modeling',
      description:
        'Models for predicting the internal disposition of chemicals and materials at multiple scales, including pharmacokinetics and biodistribution studies.',
      imageUrl:
        'https://raw.githubusercontent.com/ntua-unit-of-control-and-informatics/images/refs/heads/master/multiscale-modeling.webp',
      categories: [],
      models: [
        {
          name: 'Parametrization of DPD Models using the Groot - De Warren Approach',
          imageUrl:
            'https://raw.githubusercontent.com/ntua-unit-of-control-and-informatics/images/refs/heads/master/multiscale-modeling.webp',
          description:
            "A web application for the parametrization of Dissipative Particle Dynamics (DPD) models using the Groot-De Warren methodology. Based on the reference: 'Dissipative particle dynamics: Bridging the gap between atomistic and mesoscopic simulation' (J. Chem. Phys. DOI:10.1063/1.474784).",
          href: 'https://dpd.jaqpot.org',
        },
      ],
    },
  ],
  organizations: [
    {
      name: 'PINK',
      description: 'EU Horizon project (grant agreement No. 101137809)',
      imageUrl:
        'https://raw.githubusercontent.com/ntua-unit-of-control-and-informatics/images/master/PINK.jpg',
    },
    SCENARIOS_ORGANIZATION,
    CHIASMA_ORGANIZATION,
    {
      name: 'INSIGHT',
      description: 'EU Horizon project (grant agreement No. 101137742)',
      imageUrl:
        'https://raw.githubusercontent.com/ntua-unit-of-control-and-informatics/images/master/INSIGHT.png',
    },
  ],
};
