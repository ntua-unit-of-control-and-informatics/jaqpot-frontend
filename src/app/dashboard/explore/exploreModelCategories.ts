export interface ExplorePageCategory {
  name: string;
  description: string;
  imageUrl?: string;
  href?: string;
  categories: ExplorePageCategory[];
  models?: ExplorePageModel[];
  organizations?: ExplorePageOrganization[];
}

export interface ExplorePageModel {
  id: number;
  name: string;
  imageUrl: string;
  description: string;
}

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
    'https://raw.githubusercontent.com/periklis91/images/master/CHIASMA.png',
};
const SCENARIOS_ORGANIZATION = {
  name: 'SCENARIOS',
  description: 'EU Horizon project (grant agreement No. 101037509)',
  imageUrl:
    'https://raw.githubusercontent.com/periklis91/images/master/SCENARIOS.jpg',
};
export const EXPLORE_PAGE_CATEGORIES: ExplorePageCategory = {
  name: 'Explore models',
  description: 'Explore models hosted in the Jaqpot platform',
  categories: [
    {
      name: 'PFAS',
      description: 'Predictive models for per- and polyfluoroalkyl substances',
      imageUrl:
        'https://raw.githubusercontent.com/periklis91/images/master/PFAS.jpg',
      models: [
        {
          id: 1685,
          name: 'PFOS/PFOA Human PBK',
          imageUrl:
            'https://raw.githubusercontent.com/periklis91/images/master/Loccisano_human_pfoa.jpg',
          description:
            'The model of this application is a deployment of the model published by Loccisano et al. (2011).',
        },
        {
          id: 1730,
          name: 'Extended PFOA male rat PBK',
          imageUrl:
            'https://raw.githubusercontent.com/periklis91/images/master/Tsiros_PFOA_2024.png',
          description:
            'This PBK model describes the biodistribution of PFOA in male rats after IV or oral administration (presented in Tsiros et al., 2024) ',
        },
        {
          id: 1689,
          name: 'PFAAs Protein-Binding Fish PBK',
          imageUrl:
            'https://raw.githubusercontent.com/periklis91/images/master/NG_et_al_2013.jpg',
          description:
            'This PBK model predicts the biodistribution of various PFAAs in fish, who are exposed via water (Ng et al., 2013)',
        },
        {
          id: 1686,
          name: 'PFOS Rainbow trout PBTK',
          imageUrl:
            'https://raw.githubusercontent.com/periklis91/images/master/PFOS_RT.jpg',
          description:
            'This PBK model predicts the biodistribution of PFOS in Rainbow trout after both oral and dietary exposure (Vidal et al., 2020) ',
        },
        {
          id: 1554,
          name: 'PFDA rat PBK',
          imageUrl:
            'https://raw.githubusercontent.com/periklis91/images/master/PFDA.png',
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
        'https://raw.githubusercontent.com/periklis91/images/master/nanomaterials.jpg',
      categories: [],
      models: [
        {
          id: 1731,
          name: 'TiO2 IV rat PBK model',
          imageUrl:
            'https://raw.githubusercontent.com/periklis91/images/master/tio2_iv_pbk_new.png',
          description:
            'A PBK model for describing the biodistribution of TiO2 nanoparticles in rats after IV injection',
        },

        {
          id: 1470,
          name: 'MWCNTs genotoxicity',
          imageUrl:
            'https://raw.githubusercontent.com/periklis91/images/master/MWCNT.jpg',
          description:
            'Random Forest model for the genotoxicity classificaton of Multi-walled Carbon nanotubes',
        },

        {
          id: 1243,
          name: 'PAA-PEG PBK model',
          imageUrl:
            'https://raw.githubusercontent.com/periklis91/images/master/paa-peg.PNG',
          description:
            'A PBK model for describing the biodistribution of PAA-PEG nanoparticles in rats after IV injection',
        },

        {
          id: 1487,
          name: 'Technetium PBK model',
          imageUrl:
            'https://raw.githubusercontent.com/periklis91/images/master/technetium.PNG',
          description: ' ',
        },
      ],
    },

    {
      name: 'Pharmaceuticals',
      description: 'Predictive models for pharmaceuticals',
      imageUrl:
        'https://raw.githubusercontent.com/periklis91/images/master/pharmaceuticals.jpg',
      categories: [],
      models: [
        {
          id: 1210,
          name: 'Diazepam PBK model',
          imageUrl:
            'https://raw.githubusercontent.com/periklis91/images/master/DiazPBPK.png',
          description:
            'A PBK model for describing the biodistribution of diazepam in humans after IV injection',
        },
      ],
    },

    {
      name: 'QSAR',
      description: 'Quantitative Structure-Activity Relationship models',
      imageUrl:
        'https://raw.githubusercontent.com/periklis91/images/master/biological_activity.jpg',
      categories: [],
      models: [
        {
          id: 1837,
          name: 'QSAR Toolbox ExplorePageModel Integration',
          imageUrl:
            'https://raw.githubusercontent.com/periklis91/images/master/QSAR_toolbox_logo.jpg',
          description:
            'This machine learning model serves as an interface for the QSAR Toolbox API, allowing users to input SMILES strings and select a QSPR model to generate predictive values for various properties.',
        },

        {
          id: 1842,
          name: 'QSAR Toolbox Profiler integration',
          imageUrl:
            'https://raw.githubusercontent.com/periklis91/images/master/QSAR_toolbox_logo.jpg',
          description:
            'This machine learning model serves as an interface for the QSAR Toolbox API, allowing users to input SMILES strings and select a QSPR model to generate predictive values for various properties.',
        },

        {
          id: 6,
          name: 'QSAR Toolbox Calculator Integration',
          imageUrl:
            'https://raw.githubusercontent.com/periklis91/images/master/QSAR_toolbox_logo.jpg',
          description:
            'This machine learning model serves as an interface for the QSAR Toolbox API, allowing users to input SMILES strings and select a QSPR model to generate predictive values for various properties.',
        },

        {
          id: 1470,
          name: 'MWCNTs genotoxicity',
          imageUrl:
            'https://raw.githubusercontent.com/periklis91/images/master/MWCNT.jpg',
          description:
            'Random Forest model for the genotoxicity classificaton of Multi-walled Carbon nanotubes',
        },
      ],
    },

    {
      name: 'QSPR',
      description: 'Quantitative Structure-Property Relationship models',
      imageUrl:
        'https://raw.githubusercontent.com/periklis91/images/master/molecular_property.jpg',
      categories: [],
      models: [
        {
          id: 1837,
          name: 'QSAR Toolbox ExplorePageModel Integration',
          imageUrl:
            'https://raw.githubusercontent.com/periklis91/images/master/QSAR_toolbox_logo.jpg',
          description:
            'This machine learning model serves as an interface for the QSAR Toolbox API, allowing users to input SMILES strings and select a QSPR model to generate predictive values for various properties.',
        },

        {
          id: 1842,
          name: 'QSAR Toolbox Profiler integration',
          imageUrl:
            'https://raw.githubusercontent.com/periklis91/images/master/QSAR_toolbox_logo.jpg',
          description:
            'This machine learning model serves as an interface for the QSAR Toolbox API, allowing users to input SMILES strings and select a QSPR model to generate predictive values for various properties.',
        },

        {
          id: 6,
          name: 'QSAR Toolbox Calculator Integration',
          imageUrl:
            'https://raw.githubusercontent.com/periklis91/images/master/QSAR_toolbox_logo.jpg',
          description:
            'This machine learning model serves as an interface for the QSAR Toolbox API, allowing users to input SMILES strings and select a QSPR model to generate predictive values for various properties.',
        },
      ],
    },

    {
      name: 'Biokinetics',
      description:
        'Models for predicting the internal disposition of chemicals and materials',
      imageUrl:
        'https://raw.githubusercontent.com/periklis91/images/master/biokinetics.jpg',
      categories: [],
      models: [
        {
          id: 1731,
          name: 'TiO2 IV rat PBK model',
          imageUrl:
            'https://raw.githubusercontent.com/periklis91/images/master/tio2_iv_pbk_new.png',
          description:
            'PBK model for describing the biodistribution of TiO2 nanoparticles in rats after IV injection',
        },
        {
          id: 1731,
          name: 'PFOA IV rat PBK model',
          imageUrl:
            'https://raw.githubusercontent.com/periklis91/images/master/Tsiros_PFOA_2024.png',
          description:
            'PBK model for describing the biodistribution of TiO2 nanoparticles in rats after IV injection',
        },

        {
          id: 1210,
          name: 'Diazepam PBK model',
          imageUrl:
            'https://raw.githubusercontent.com/periklis91/images/master/DiazPBPK.png',
          description:
            'A PBK model for describing the biodistribution of diazepam in humans after IV injection',
        },
      ],
    },
  ],
  organizations: [
    {
      name: 'PINK',
      description: 'EU Horizon project (grant agreement No. 101137809)',
      imageUrl:
        'https://raw.githubusercontent.com/periklis91/images/master/PINK.jpg',
    },

    SCENARIOS_ORGANIZATION,

    CHIASMA_ORGANIZATION,

    {
      name: 'INSIGHT',
      description: 'EU Horizon project (grant agreement No. 101137742)',
      imageUrl:
        'https://raw.githubusercontent.com/periklis91/images/master/INSIGHT.png',
    },
  ],
};
