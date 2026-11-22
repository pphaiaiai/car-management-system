import type { Prisma } from '../src/generated/prisma/client.js';
import { prisma } from '../src/lib/prisma.js';

const cars: Prisma.CarCreateManyInput[] = [
  {
    registrationNumber: '1กข 1234',
    province: 'กรุงเทพมหานคร',
    brand: 'Toyota',
    model: 'Yaris Ativ',
    year: 2023,
    color: 'White',
    notes: 'ประจำสาขาสยาม',
  },
  {
    registrationNumber: '2กค 5678',
    province: 'กรุงเทพมหานคร',
    brand: 'Honda',
    model: 'City Hatchback',
    year: 2022,
    color: 'Gray',
    notes: 'ประจำสาขาอโศก',
  },
  {
    registrationNumber: '3ขง 9012',
    province: 'กรุงเทพมหานคร',
    brand: 'MG',
    model: 'ZS EV',
    year: 2023,
    color: 'Blue',
    notes: 'รถไฟฟ้า ชาร์จที่สาขาเท่านั้น',
  },
  {
    registrationNumber: '4ฆจ 3456',
    province: 'กรุงเทพมหานคร',
    brand: 'BYD',
    model: 'Atto 3',
    year: 2024,
    color: 'White',
    notes: 'รถไฟฟ้า',
  },
  {
    registrationNumber: '5กฉ 7788',
    province: 'นนทบุรี',
    brand: 'Toyota',
    model: 'Corolla Cross',
    year: 2022,
    color: 'Silver',
    notes: null,
  },
  {
    registrationNumber: '6ขช 2468',
    province: 'กรุงเทพมหานคร',
    brand: 'Nissan',
    model: 'Almera',
    year: 2021,
    color: 'Black',
    notes: 'นัดเช็คระยะ 40,000 กม.',
  },
  {
    registrationNumber: 'กข 1234',
    province: 'เชียงใหม่',
    brand: 'Toyota',
    model: 'Hilux Revo',
    year: 2020,
    color: 'Silver',
    notes: 'ประจำสาขาเชียงใหม่',
  },
  {
    registrationNumber: '1กข 1234',
    province: 'ชลบุรี',
    brand: 'Mazda',
    model: '2',
    year: 2019,
    color: 'Red',
    notes: 'เลขทะเบียนซ้ำกับคันที่ กทม. แต่คนละจังหวัด',
  },
  {
    registrationNumber: '7กญ 1357',
    province: 'กรุงเทพมหานคร',
    brand: 'Honda',
    model: 'HR-V e:HEV',
    year: 2024,
    color: 'White',
    notes: null,
  },
  {
    registrationNumber: 'ฒฒ 9999',
    province: 'ภูเก็ต',
    brand: 'Mitsubishi',
    model: 'Xpander',
    year: 2022,
    color: 'Brown',
    notes: 'รถ 7 ที่นั่ง ประจำสาขาภูเก็ต',
  },
  {
    registrationNumber: '8กฎ 2580',
    province: 'กรุงเทพมหานคร',
    brand: 'Tesla',
    model: 'Model 3',
    year: 2024,
    color: 'Black',
    notes: 'รถไฟฟ้า',
  },
  {
    registrationNumber: 'บก 4321',
    province: 'ขอนแก่น',
    brand: 'Isuzu',
    model: 'D-Max',
    year: 2021,
    color: 'Gray',
    notes: 'กระบะ ใช้ขนอุปกรณ์',
  },
];

try {
  const { count } = await prisma.car.createMany({ data: cars, skipDuplicates: true });
  console.log(`🌱 Seeded ${count} car(s), skipped ${cars.length - count} existing`);
} finally {
  await prisma.$disconnect();
}
