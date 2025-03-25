import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function restoreContactInfo() {
  try {
    // Check if contact info already exists
    const existing = await prisma.contactInfo.findFirst();
    
    if (existing) {
      console.log('Contact info already exists, updating...');
      const updated = await prisma.contactInfo.update({
        where: { id: existing.id },
        data: {
          addressEn: 'Haifa Building 4th floor, Al Irsal, Ramallah-AlBireh, Palestine',
          addressAr: 'مبنى حيفا الطابق الرابع، الإرسال، رام الله-البيرة، فلسطين',
          phone: '+970 2 296 4840',
          email: 'info@techstart.ps'
        }
      });
      console.log('Contact info updated:', updated);
    } else {
      // Create new contact info
      const created = await prisma.contactInfo.create({
        data: {
          addressEn: 'Haifa Building 4th floor, Al Irsal, Ramallah-AlBireh, Palestine',
          addressAr: 'مبنى حيفا الطابق الرابع، الإرسال، رام الله-البيرة، فلسطين',
          phone: '+970 2 296 4840',
          email: 'info@techstart.ps'
        }
      });
      console.log('Contact info created:', created);
    }
  } catch (error) {
    console.error('Error restoring contact info:', error);
  } finally {
    await prisma.$disconnect();
  }
}

restoreContactInfo()
  .catch(console.error); 