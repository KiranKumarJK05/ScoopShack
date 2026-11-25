import { MenuItem } from '../types/scoopshack';

export const OFFICIAL_MENU_ITEMS: MenuItem[] = [
  {
    id: 101,
    name: 'Vanilla Scoop',
    category: 'Scoop',
    price: 60,
    stock: 40,
    stockStatus: 'OK',
    description:
      'Slow-churned whole dairy infused with speckled Madagascar vanilla pods for a clean, velvety finish.',
    tastingNotes: 'Madagascar bean · Sweet cream · Silk finish',
    imageUrl: '/src/assets/images/menu_vanilla_scoop_1795410437083.jpg',
  },
  {
    id: 102,
    name: 'Chocolate Sundae',
    category: 'Sundae',
    price: 150,
    stock: 20,
    stockStatus: 'OK',
    description:
      'Double Belgian dark cocoa scoops layered with warm fudge ganache, toasted hazelnuts, and a crisp wafer curl.',
    tastingNotes: '70% dark cocoa · Roasted hazelnut · Warm fudge',
    imageUrl: '/src/assets/images/menu_chocolate_sundae_1795410437753.jpg',
  },
  {
    id: 103,
    name: 'Mango Shake',
    category: 'Shake',
    price: 120,
    stock: 25,
    stockStatus: 'OK',
    description:
      'Ratnagiri Alphonso mango purée spun thick with chilled creamery ice cream and fresh orchard mango ribbons.',
    tastingNotes: 'Alphonso pulp · Chilled cream · Velvet pour',
    imageUrl: '/src/assets/images/menu_mango_shake_1795410440097.jpg',
  },
  {
    id: 104,
    name: 'Kulfi Stick',
    category: 'Kulfi',
    price: 50,
    stock: 30,
    stockStatus: 'OK',
    description:
      'Reduced-milk heritage malai kulfi steeped with Kashmiri saffron strands, crushed green pistachios, and rose petals.',
    tastingNotes: 'Saffron · Green pistachio · Slow-simmered malai',
    imageUrl: '/src/assets/images/menu_kulfi_stick_1795410440004.jpg',
  },
  {
    id: 105,
    name: 'Brownie with Ice Cream',
    category: 'Dessert',
    price: 180,
    stock: 15,
    stockStatus: 'OK',
    description:
      'Warm dark-fudge bakery brownie square crowned with a cold Madagascar vanilla scoop and glossy ganache.',
    tastingNotes: 'Warm fudge crumb · Cold vanilla contrast',
    imageUrl: '/src/assets/images/menu_brownie_icecream_1795410440203.jpg',
  },
  {
    id: 106,
    name: 'Family Pack 1 L',
    category: 'Pack',
    price: 350,
    stock: 10,
    stockStatus: 'OK',
    description:
      'Insulated 1-litre take-home creamery tub swirled with classic vanilla bean and Belgian chocolate ribbons.',
    tastingNotes: '1000 ml tub · Swirled duo · Serves 6–8',
    imageUrl: '/src/assets/images/menu_family_pack_1795410440251.jpg',
  },
];

export const MENU_CATEGORIES = ['All', 'Scoop', 'Sundae', 'Shake', 'Kulfi', 'Dessert', 'Pack'] as const;
