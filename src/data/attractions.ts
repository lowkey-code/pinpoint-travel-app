import type { Attraction } from '@/types/attraction';

export const mockAttractions: Attraction[] = [
  {
    id: '1',
    name: '故宫博物院',
    address: '北京市东城区景山前街4号',
    coordinates: {
      latitude: 39.9163,
      longitude: 116.3972,
    },
    category: 'museum',
    notes: 'Chegar cedo para evitar filas. Comprar ingresso online.',
  },
  {
    id: '2',
    name: '长城 - 八达岭',
    address: '北京市延庆区八达岭镇',
    coordinates: {
      latitude: 40.3598,
      longitude: 116.0201,
    },
    category: 'monument',
    notes: 'Levar água e usar sapato confortável. Subida íngreme!',
  },
  {
    id: '3',
    name: '天坛公园',
    address: '北京市东城区天坛东里甲1号',
    coordinates: {
      latitude: 39.8822,
      longitude: 116.4066,
    },
    category: 'temple',
    notes: 'Melhor visitar de manhã para ver os locais praticando Tai Chi.',
  },
  {
    id: '4',
    name: '南锣鼓巷',
    address: '北京市东城区南锣鼓巷',
    coordinates: {
      latitude: 39.9371,
      longitude: 116.4025,
    },
    category: 'shopping',
    notes: 'Hutong tradicional com lojas de artesanato e cafés.',
  },
];
