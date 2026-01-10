import { PrismaClient, UserRole, CheckInStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  await prisma.checkIn.deleteMany();
  await prisma.document.deleteMany();
  await prisma.task.deleteMany();
  await prisma.taskGroup.deleteMany();
  await prisma.guest.deleteMany();
  await prisma.guestGroup.deleteMany();
  await prisma.event.deleteMany();
  await prisma.user.deleteMany();


  // Create admin user (mandatory test account)
  const adminPassword = await bcrypt.hash('@dm!nnoRw@', 10);
  const adminUser = await prisma.user.create({
    data: {
      email: 'ephremkodah7@gmail.com',
      password: adminPassword,
      name: 'Ephrem Kodah',
      role: UserRole.Admin,
    },
  });
  console.log('✅ Admin user created:', adminUser.email);

  // Create additional admin user
  const admin2Password = await bcrypt.hash('P@ss!nn0Ag', 10);
  const admin2User = await prisma.user.create({
    data: {
      email: 'yayalatifou@reliancewestafrica.com',
      password: admin2Password,
      name: 'Admin Inno',
      role: UserRole.Admin,
    },
  });
  console.log('✅ Additional admin user created:', admin2User.email);

  // // Create regular users
  // const regularPassword = await bcrypt.hash('user1234', 10);
  // const regularUser1 = await prisma.user.create({
  //   data: {
  //     email: 'user1@inno.com',
  //     password: regularPassword,
  //     name: 'RWA Regular User',
  //     role: UserRole.RegularUser,
  //   },
  // });

  // console.log('✅ Regular user created');

  // // Create events
  // const event1 = await prisma.event.create({
  //   data: {
  //     name: 'Conférence Annuelle RWA 2025',
  //     description: 'Conférence annuelle sur les stratégies de développement en Afrique de l\'Ouest',
  //     startDate: new Date('2025-03-15T09:00:00'),
  //     endDate: new Date('2025-03-15T17:00:00'),
  //     maxGuests: 150,
  //     createdById: adminUser.id,
  //   },
  // });

  // const event2 = await prisma.event.create({
  //   data: {
  //     name: 'Gala de Bienfaisance',
  //     description: 'Soirée de gala pour lever des fonds pour les projets communautaires',
  //     startDate: new Date('2025-04-20T18:00:00'),
  //     endDate: new Date('2025-04-20T23:00:00'),
  //     maxGuests: 200,
  //     createdById: adminUser.id,
  //   },
  // });

  // const event3 = await prisma.event.create({
  //   data: {
  //     name: 'Séminaire de Formation',
  //     description: 'Formation sur les nouvelles technologies et l\'innovation',
  //     startDate: new Date('2025-02-10T10:00:00'),
  //     endDate: new Date('2025-02-10T16:00:00'),
  //     maxGuests: null, // No limit
  //     createdById: regularUser1.id,
  //   },
  // });
  // console.log('✅ Events created');

  // // Create guest groups for event 1
  // const group1_1 = await prisma.guestGroup.create({
  //   data: {
  //     name: 'VIP - Dirigeants',
  //     eventId: event1.id,
  //   },
  // });

  // const group1_2 = await prisma.guestGroup.create({
  //   data: {
  //     name: 'Partenaires Commerciaux',
  //     eventId: event1.id,
  //   },
  // });

  // const group1_3 = await prisma.guestGroup.create({
  //   data: {
  //     name: 'Invités Généraux',
  //     eventId: event1.id,
  //   },
  // });

  // // Create guest groups for event 2
  // const group2_1 = await prisma.guestGroup.create({
  //   data: {
  //     name: 'Donateurs Principaux',
  //     eventId: event2.id,
  //   },
  // });

  // const group2_2 = await prisma.guestGroup.create({
  //   data: {
  //     name: 'Invités Spéciaux',
  //     eventId: event2.id,
  //   },
  // });

  // // Create guest groups for event 3
  // const group3_1 = await prisma.guestGroup.create({
  //   data: {
  //     name: 'Participants Confirmés',
  //     eventId: event3.id,
  //   },
  // });
  // console.log('✅ Guest groups created');

  // // Create guests for event 1
  // const guests1_1 = await Promise.all([
  //   prisma.guest.create({
  //     data: {
  //       name: 'Dr. Amina Traoré',
  //       email: 'amina.traore@example.com',
  //       phone: '+225 07 12 34 56 78',
  //       guestGroupId: group1_1.id,
  //     },
  //   }),
  //   prisma.guest.create({
  //     data: {
  //       name: 'M. Kofi Mensah',
  //       email: 'kofi.mensah@example.com',
  //       phone: '+233 20 123 4567',
  //       guestGroupId: group1_1.id,
  //     },
  //   }),
  //   prisma.guest.create({
  //     data: {
  //       name: 'Mme. Aïcha Ndiaye',
  //       email: 'aicha.ndiaye@example.com',
  //       phone: '+221 77 123 45 67',
  //       guestGroupId: group1_1.id,
  //     },
  //   }),
  // ]);

  // const guests1_2 = await Promise.all([
  //   prisma.guest.create({
  //     data: {
  //       name: 'Société TechAfrica Ltd',
  //       email: 'contact@techafrica.com',
  //       phone: '+225 27 20 30 40 50',
  //       guestGroupId: group1_2.id,
  //     },
  //   }),
  //   prisma.guest.create({
  //     data: {
  //       name: 'M. Ibrahim Sanogo',
  //       email: 'ibrahim.sanogo@example.com',
  //       phone: '+225 05 12 34 56 78',
  //       guestGroupId: group1_2.id,
  //     },
  //   }),
  //   prisma.guest.create({
  //     data: {
  //       name: 'Mme. Fatou Diop',
  //       email: 'fatou.diop@example.com',
  //       phone: '+221 76 234 56 78',
  //       guestGroupId: group1_2.id,
  //     },
  //   }),
  //   prisma.guest.create({
  //     data: {
  //       name: 'M. Kwame Asante',
  //       email: 'kwame.asante@example.com',
  //       phone: '+233 24 567 8901',
  //       guestGroupId: group1_2.id,
  //     },
  //   }),
  // ]);

  // const guests1_3 = await Promise.all([
  //   prisma.guest.create({
  //     data: {
  //       name: 'Mlle. Sophie Kouassi',
  //       email: 'sophie.kouassi@example.com',
  //       phone: '+225 07 89 12 34 56',
  //       guestGroupId: group1_3.id,
  //     },
  //   }),
  //   prisma.guest.create({
  //     data: {
  //       name: 'M. Abdoulaye Cissé',
  //       email: 'abdoulaye.cisse@example.com',
  //       phone: '+223 76 12 34 56',
  //       guestGroupId: group1_3.id,
  //     },
  //   }),
  //   prisma.guest.create({
  //     data: {
  //       name: 'Mme. Yaa Boateng',
  //       email: 'yaa.boateng@example.com',
  //       phone: '+233 20 987 6543',
  //       guestGroupId: group1_3.id,
  //     },
  //   }),
  //   prisma.guest.create({
  //     data: {
  //       name: 'M. Ousmane Bah',
  //       email: 'ousmane.bah@example.com',
  //       phone: '+224 622 12 34 56',
  //       guestGroupId: group1_3.id,
  //     },
  //   }),
  //   prisma.guest.create({
  //     data: {
  //       name: 'Mme. Mariama Sy',
  //       email: 'mariama.sy@example.com',
  //       phone: '+221 77 890 12 34',
  //       guestGroupId: group1_3.id,
  //     },
  //   }),
  // ]);

  // // Create guests for event 2
  // const guests2_1 = await Promise.all([
  //   prisma.guest.create({
  //     data: {
  //       name: 'M. Jean-Claude Bakayoko',
  //       email: 'jc.bakayoko@example.com',
  //       phone: '+225 07 11 22 33 44',
  //       guestGroupId: group2_1.id,
  //     },
  //   }),
  //   prisma.guest.create({
  //     data: {
  //       name: 'Mme. Grace Opoku',
  //       email: 'grace.opoku@example.com',
  //       phone: '+233 24 111 2222',
  //       guestGroupId: group2_1.id,
  //     },
  //   }),
  //   prisma.guest.create({
  //     data: {
  //       name: 'Dr. Mamadou Keita',
  //       email: 'mamadou.keita@example.com',
  //       phone: '+223 66 33 44 55',
  //       guestGroupId: group2_1.id,
  //     },
  //   }),
  // ]);

  // const guests2_2 = await Promise.all([
  //   prisma.guest.create({
  //     data: {
  //       name: 'M. Pierre Koffi',
  //       email: 'pierre.koffi@example.com',
  //       phone: '+225 05 44 55 66 77',
  //       guestGroupId: group2_2.id,
  //     },
  //   }),
  //   prisma.guest.create({
  //     data: {
  //       name: 'Mlle. Aminata Touré',
  //       email: 'aminata.toure@example.com',
  //       phone: '+221 77 445 566',
  //       guestGroupId: group2_2.id,
  //     },
  //   }),
  // ]);

  // // Create guests for event 3
  // const guests3_1 = await Promise.all([
  //   prisma.guest.create({
  //     data: {
  //       name: 'M. Sekou Condé',
  //       email: 'sekou.conde@example.com',
  //       phone: '+224 628 11 22 33',
  //       guestGroupId: group3_1.id,
  //     },
  //   }),
  //   prisma.guest.create({
  //     data: {
  //       name: 'Mme. Ama Darko',
  //       email: 'ama.darko@example.com',
  //       phone: '+233 20 333 4444',
  //       guestGroupId: group3_1.id,
  //     },
  //   }),
  //   prisma.guest.create({
  //     data: {
  //       name: 'M. Lamine Fofana',
  //       email: 'lamine.fofana@example.com',
  //       phone: '+225 07 66 77 88 99',
  //       guestGroupId: group3_1.id,
  //     },
  //   }),
  // ]);
  // console.log('✅ Guests created');

  // // Create some check-ins with different statuses
  // // Present on time (before event time)
  // await prisma.checkIn.create({
  //   data: {
  //     guestId: guests1_1[0].id,
  //     checkInTime: new Date('2025-03-15T08:45:00'),
  //     status: CheckInStatus.present_ontime,
  //     description: 'Arrivée anticipée, accueilli à l\'entrée VIP',
  //     checkedInById: adminUser.id,
  //   },
  // });

  // // Present late (after event time)
  // await prisma.checkIn.create({
  //   data: {
  //     guestId: guests1_2[0].id,
  //     checkInTime: new Date('2025-03-15T09:30:00'),
  //     status: CheckInStatus.present_late,
  //     description: 'Retardé par le trafic',
  //     checkedInById: regularUser1.id,
  //   },
  // });

  // // Absent
  // await prisma.checkIn.create({
  //   data: {
  //     guestId: guests1_3[1].id,
  //     checkInTime: new Date('2025-03-15T09:00:00'),
  //     status: CheckInStatus.absent,
  //     description: 'N\'a pas confirmé sa présence',
  //     checkedInById: regularUser1.id,
  //   },
  // });

  // // Declined
  // await prisma.checkIn.create({
  //   data: {
  //     guestId: guests1_3[2].id,
  //     checkInTime: new Date('2025-03-14T10:00:00'),
  //     status: CheckInStatus.declined,
  //     description: 'A décliné l\'invitation pour raisons professionnelles',
  //     checkedInById: adminUser.id,
  //   },
  // });

  // console.log('🎉 Check-ins created');
  console.log('\n✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
