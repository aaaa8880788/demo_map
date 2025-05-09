const siteData = [
  {
    type: 'site',
    name: '涠洲',
    coord: [109.1217, 21.05516],
    iconUrl: new URL('@/assets/images/map/site1.png', import.meta.url).href,
  },
  {
    type: 'site',
    name: '敦海',
    coord: [109.12255, 21.42699],
    iconUrl: new URL('@/assets/images/map/site1.png', import.meta.url).href,
  },
  {
    type: 'site',
    name: '紫荆',
    coord: [109.17984, 21.44447],
    iconUrl: new URL('@/assets/images/map/site1.png', import.meta.url).href,
  },
  {
    type: 'site',
    name: '平阳',
    coord: [109.22451, 21.49302],
    iconUrl: new URL('@/assets/images/map/site1.png', import.meta.url).href,
  },
  {
    type: 'site',
    name: '孙东',
    coord: [109.23325, 21.57654],
    iconUrl: new URL('@/assets/images/map/site1.png', import.meta.url).href,
  },
  {
    type: 'site',
    name: '冲口',
    coord: [109.24782, 21.67558],
    iconUrl: new URL('@/assets/images/map/site1.png', import.meta.url).href,
  },
  {
    type: 'site',
    name: '珊瑚',
    coord: [109.10507, 21.76784],
    iconUrl: new URL('@/assets/images/map/site1.png', import.meta.url).href,
  },
  {
    type: 'site',
    name: '福成',
    coord: [109.35852, 21.62897],
    iconUrl: new URL('@/assets/images/map/site2.png', import.meta.url).href,
  },
  {
    type: 'site',
    name: '铁山',
    coord: [109.50321, 21.53187],
    iconUrl: new URL('@/assets/images/map/site1.png', import.meta.url).href,
  },
  {
    type: 'site',
    name: '盐田',
    coord: [109.53719, 21.56197],
    iconUrl: new URL('@/assets/images/map/site1.png', import.meta.url).href,
  },
  {
    type: 'site',
    name: '北海电厂',
    coord: [109.57312, 21.58236],
    iconUrl: new URL('@/assets/images/map/site1.png', import.meta.url).href,
  },
  {
    type: 'site',
    name: '珠城电厂',
    coord: [109.58963, 21.53284],
    iconUrl: new URL('@/assets/images/map/site2.png', import.meta.url).href,
  },
  {
    type: 'site',
    name: '禄罗',
    coord: [109.61682, 21.65422],
    iconUrl: new URL('@/assets/images/map/site1.png', import.meta.url).href,
  },
  {
    type: 'site',
    name: '还珠',
    coord: [109.66537, 21.7455],
    iconUrl: new URL('@/assets/images/map/site1.png', import.meta.url).href,
  },
  {
    type: 'site',
    name: '客家（玉林网区）',
    coord: [109.70227, 21.72414],
    iconUrl: new URL('@/assets/images/map/site1.png', import.meta.url).href,
  },
]
const powerLineData = [
  {
    type: 'powerLine',
    name: '涠洲-敦海',
    style: '#bc77ff-solid',
    coord: [
      [109.1217, 21.05516],
      [109.09698, 21.39024],
      [109.12255, 21.42699],
    ],
  },
  {
    type: 'powerLine',
    name: '敦海-紫荆',
    style: '#bc77ff-solid',
    coord: [
      [109.12255, 21.42699],
      [109.13517, 21.41631],
      [109.18081, 21.43088],
      [109.17984, 21.44447],
    ],
  },
  {
    type: 'powerLine',
    name: '敦海-紫荆',
    style: '#bc77ff-solid',
    coord: [
      [109.12255, 21.42699],
      [109.13323, 21.42117],
      [109.17304, 21.43476],
      [109.17984, 21.44447],
    ],
  },
  {
    type: 'powerLine',
    name: '敦海-平阳',
    style: '#bc77ff-solid',
    coord: [
      [109.12255, 21.42699],
      [109.13517, 21.42505],
      [109.16819, 21.43573],
      [109.16819, 21.4435],
      [109.18664, 21.45418],
      [109.19344, 21.45612],
      [109.21189, 21.47652],
      [109.21965, 21.48331],
      [109.22451, 21.49302],
    ],
  },
  {
    type: 'powerLine',
    name: '紫荆-福成',
    style: '#bc77ff-solid',
    coord: [
      [109.17984, 21.44447],
      [109.19149, 21.45127],
      [109.19732, 21.45224],
      [109.20703, 21.46098],
      [109.21383, 21.47457],
      [109.23131, 21.48817],
      [109.25461, 21.48526],
      [109.28569, 21.48914],
      [109.34881, 21.48914],
      [109.37502, 21.49497],
      [109.376, 21.54352],
      [109.36337, 21.58042],
      [109.36726, 21.60275],
      [109.35852, 21.62897],
    ],
  },
  {
    type: 'powerLine',
    name: '平阳-福成',
    style: '#bc77ff-solid',
    coord: [
      [109.22451, 21.49302],
      [109.27406, 21.49478],
      [109.29913, 21.49369],
      [109.36998, 21.49969],
      [109.37162, 21.54438],
      [109.35963, 21.58089],
      [109.36344, 21.60215],
      [109.35852, 21.62897],
    ],
  },
  {
    type: 'powerLine',
    name: '平阳-孙东',
    style: '#bc77ff-solid',
    coord: [
      [109.22451, 21.49302],
      [109.23908, 21.55711],
      [109.23325, 21.57654],
    ],
  },
  {
    type: 'powerLine',
    name: '平阳-孙东',
    style: '#bc77ff-solid',
    coord: [
      [109.22451, 21.49302],
      [109.22451, 21.50565],
      [109.23325, 21.55614],
      [109.23325, 21.57654],
    ],
  },
  {
    type: 'powerLine',
    name: '孙东-福成',
    style: '#bc77ff-solid',
    coord: [
      [109.23325, 21.57654],
      [109.23519, 21.60955],
      [109.24102, 21.63286],
      [109.35852, 21.62897],
    ],
  },
  {
    type: 'powerLine',
    name: '孙东-冲口',
    style: '#bc77ff-solid',
    coord: [
      [109.23325, 21.57654],
      [109.23131, 21.61344],
      [109.24199, 21.65908],
      [109.24782, 21.67558],
    ],
  },
  {
    type: 'powerLine',
    name: '孙东-冲口',
    style: '#bc77ff-solid',
    coord: [
      [109.23325, 21.57654],
      [109.22451, 21.62606],
      [109.23713, 21.65908],
      [109.24782, 21.67558],
    ],
  },
  {
    type: 'powerLine',
    name: '冲口-福成',
    style: '#bc77ff-solid',
    coord: [
      [109.24782, 21.67558],
      [109.31385, 21.6649],
      [109.34783, 21.6416],
      [109.35852, 21.62897],
    ],
  },
  {
    type: 'powerLine',
    name: '冲口-福成',
    style: '#bc77ff-solid',
    coord: [
      [109.24782, 21.67558],
      [109.26335, 21.68335],
      [109.30608, 21.68044],
      [109.33327, 21.6649],
      [109.35172, 21.64937],
      [109.35852, 21.62897],
    ],
  },
  {
    type: 'powerLine',
    name: '至钦州网区220kV燕岭站',
    style: '#bc77ff-solid-arrow',
    coord: [
      [109.24782, 21.67558],
      [109.2585, 21.69501],
      [109.2517, 21.71928],
      [109.2585, 21.8931],
    ],
  },
  {
    type: 'powerLine',
    name: '冲口-珊瑚',
    style: '#bc77ff-solid',
    coord: [
      [109.24782, 21.67558],
      [109.24976, 21.69306],
      [109.24199, 21.71928],
      [109.10507, 21.76784],
    ],
  },
  {
    type: 'powerLine',
    name: '冲口-珊瑚',
    style: '#bc77ff-solid',
    coord: [
      [109.24782, 21.67558],
      [109.24684, 21.68724],
      [109.24005, 21.70277],
      [109.22451, 21.72025],
      [109.14003, 21.7455],
      [109.12449, 21.75812],
      [109.10507, 21.76784],
    ],
  },
  {
    type: 'powerLine',
    name: '福成-铁山',
    style: '#bc77ff-solid',
    coord: [
      [109.35852, 21.62897],
      [109.38862, 21.59013],
      [109.38959, 21.55906],
      [109.40221, 21.53187],
      [109.42455, 21.51536],
      [109.46436, 21.5105],
      [109.50321, 21.53187],
    ],
  },
  {
    type: 'powerLine',
    name: '福成-铁山',
    style: '#bc77ff-solid',
    coord: [
      [109.35852, 21.62897],
      [109.39639, 21.60858],
      [109.44494, 21.59596],
      [109.46922, 21.57945],
      [109.46825, 21.5678],
      [109.50321, 21.53187],
    ],
  },
  {
    type: 'powerLine',
    name: '福成-盐田',
    style: '#bc77ff-solid',
    coord: [
      [109.35852, 21.62897],
      [109.40513, 21.61149],
      [109.44688, 21.60081],
      [109.48475, 21.58139],
      [109.50223, 21.60373],
      [109.53622, 21.5979],
      [109.53719, 21.56197],
    ],
  },
  {
    type: 'powerLine',
    name: '福成-盐田',
    style: '#bc77ff-solid',
    coord: [
      [109.35852, 21.62897],
      [109.37794, 21.62897],
      [109.39153, 21.63092],
      [109.41969, 21.62703],
      [109.45659, 21.61052],
      [109.48573, 21.60664],
      [109.49058, 21.60373],
      [109.50321, 21.60664],
      [109.54011, 21.59984],
      [109.54304, 21.59519],
      [109.53719, 21.56197],
    ],
  },
  {
    type: 'powerLine',
    name: '福成-珠城电厂',
    style: '#ff8527-solid',
    coord: [
      [109.35852, 21.62897],
      [109.3925, 21.64063],
      [109.50515, 21.61926],
      [109.53234, 21.60858],
      [109.58963, 21.53284],
    ],
  },
  {
    type: 'powerLine',
    name: '福成-珠城电厂',
    style: '#ff8527-dash',
    coord: [
      [109.35852, 21.62897],
      [109.39251, 21.64569],
      [109.50694, 21.62346],
      [109.53671, 21.61015],
      [109.58963, 21.53284],
    ],
  },
  {
    type: 'powerLine',
    name: '至玉林网区500kV美林站',
    style: '#ff8527-solid-arrow',
    coord: [
      [109.35852, 21.62897],
      [109.3692, 21.64451],
      [109.37502, 21.70472],
      [109.39639, 21.7756],
      [109.64401, 21.90378],
    ],
  },
  {
    type: 'powerLine',
    name: '至钦州网区500kV久隆站',
    style: '#ff8527-solid-arrow',
    coord: [
      [109.35852, 21.62897],
      [109.35657, 21.65325],
      [109.30511, 21.71637],
      [109.04292, 21.86883],
    ],
  },
  {
    type: 'powerLine',
    name: '铁山-北海电厂',
    style: '#bc77ff-solid',
    coord: [
      [109.50321, 21.53187],
      [109.4799, 21.56683],
      [109.49058, 21.57654],
      [109.50612, 21.59693],
      [109.53331, 21.5911],
      [109.54787, 21.57654],
      [109.57312, 21.58236],
    ],
  },
  {
    type: 'powerLine',
    name: '铁山-北海电厂',
    style: '#bc77ff-solid',
    coord: [
      [109.50321, 21.53187],
      [109.47602, 21.56877],
      [109.48767, 21.57945],
      [109.50321, 21.60081],
      [109.53525, 21.59499],
      [109.54982, 21.57945],
      [109.57312, 21.58236],
    ],
  },
  {
    type: 'powerLine',
    name: '盐田-北海电厂',
    style: '#bc77ff-solid',
    coord: [
      [109.53719, 21.56197],
      [109.55247, 21.57512],
      [109.57312, 21.58236],
    ],
  },
  {
    type: 'powerLine',
    name: '盐田-北海电厂',
    style: '#bc77ff-solid',
    coord: [
      [109.53719, 21.56197],
      [109.54729, 21.58589],
      [109.55061, 21.58186],
      [109.57312, 21.58236],
    ],
  },
  {
    type: 'powerLine',
    name: '盐田-北海电厂',
    style: '#bc77ff-solid',
    coord: [
      [109.53719, 21.56197],
      [109.54573, 21.59139],
      [109.55216, 21.58399],
      [109.57312, 21.58236],
    ],
  },
  {
    type: 'powerLine',
    name: '北海电厂-禄罗',
    style: '#bc77ff-solid',
    coord: [
      [109.57312, 21.58236],
      [109.55467, 21.58819],
      [109.54011, 21.60664],
      [109.50223, 21.61441],
      [109.4867, 21.61441],
      [109.45854, 21.61635],
      [109.40901, 21.63771],
      [109.39347, 21.67073],
      [109.38959, 21.70375],
      [109.41581, 21.7455],
      [109.61099, 21.80765],
      [109.6275, 21.79211],
      [109.63041, 21.7756],
      [109.61196, 21.70277],
      [109.61682, 21.65422],
    ],
  },
  {
    type: 'powerLine',
    name: '北海电厂-禄罗',
    style: '#bc77ff-solid',
    coord: [
      [109.57312, 21.58236],
      [109.55467, 21.58625],
      [109.53719, 21.60373],
      [109.50223, 21.61052],
      [109.49058, 21.60761],
      [109.45854, 21.61344],
      [109.40027, 21.63674],
      [109.38474, 21.66782],
      [109.38182, 21.70957],
      [109.40221, 21.75812],
      [109.61196, 21.81833],
      [109.63333, 21.79794],
      [109.63721, 21.7756],
      [109.61585, 21.70277],
      [109.61682, 21.65422],
    ],
  },
  {
    type: 'powerLine',
    name: '至玉林网区500kV龙潭站',
    style: '#ff8527-dash-arrow',
    coord: [
      [109.58963, 21.53284],
      [109.55273, 21.61926],
      [109.42261, 21.65422],
      [109.40998, 21.67267],
      [109.40998, 21.70375],
      [109.43911, 21.74744],
      [109.71684, 21.90476],
    ],
  },
  {
    type: 'powerLine',
    name: '至玉林网区500kV龙潭站',
    style: '#ff8527-solid-arrow',
    coord: [
      [109.58963, 21.53284],
      [109.54593, 21.61441],
      [109.41484, 21.65131],
      [109.40416, 21.67073],
      [109.40319, 21.70277],
      [109.42552, 21.75327],
      [109.72461, 21.92029],
    ],
  },
  {
    type: 'powerLine',
    name: '还珠-客家',
    style: '#bc77ff-solid',
    coord: [
      [109.66537, 21.7455],
      [109.67314, 21.72025],
      [109.68965, 21.71443],
      [109.70227, 21.72414],
    ],
  },
  {
    type: 'powerLine',
    name: '还珠-客家',
    style: '#bc77ff-solid',
    coord: [
      [109.66537, 21.7455],
      [109.67897, 21.72511],
      [109.69159, 21.71831],
      [109.70227, 21.72414],
    ],
  },
  {
    type: 'powerLine',
    name: '至玉林网区220kV博白站',
    style: '#bc77ff-solid-arrow',
    coord: [
      [109.66537, 21.7455],
      [109.6644, 21.75327],
      [109.64789, 21.78434],
      [109.63818, 21.82707],
      [109.72655, 21.85135],
    ],
  },
  {
    type: 'powerLine',
    name: '至玉林网区220kV陆川站',
    style: '#bc77ff-solid-arrow',
    coord: [
      [109.70227, 21.72414],
      [109.70227, 21.73482],
      [109.68868, 21.75618],
      [109.67994, 21.7892],
      [109.68674, 21.80474],
      [109.74791, 21.81736],
    ],
  },
  {
    type: 'powerLine',
    name: '',
    style: '#bc77ff-solid-arrow',
    coord: [
      [109.70227, 21.72414],
      [109.68091, 21.76104],
      [109.66926, 21.79503],
      [109.67605, 21.8125],
      [109.73432, 21.82513],
    ],
  },
]

export {
  siteData,
  powerLineData
}