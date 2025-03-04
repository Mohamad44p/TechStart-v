import { PrismaClient } from '@prisma/client'
import upskillData from '../data/upskill.json'
import pioneerData from '../data/poinnerfaq.json'
import slugify from 'slugify'

const prisma = new PrismaClient()


async function createFaqCategory(nameEn: string, programId: string) {
  const slug = slugify(nameEn, { lower: true })
  return prisma.faqCategory.create({
    data: {
      nameEn,
      nameAr: nameEn, 
      slug,
      programId,
    },
  })
}

async function seedUpskillFaqs() {
  const UPSKILL_PROGRAM_ID = 'cm6o9bcdt0000t7i8d4by3u2l' // Updated ID
  
  const category = await createFaqCategory('Upskill FAQs', UPSKILL_PROGRAM_ID)

  const faqs = upskillData.data
    .filter(item => item['UpSkill FAQs'] || item[''])
    .map(item => ({
      questionEn: item['UpSkill FAQs'] || '',
      questionAr: item['UpSkill FAQs'] || '',
      answerEn: item[''] || '',
      answerAr: item[''] || '',
      categoryId: category.id,
      programId: UPSKILL_PROGRAM_ID,
    }))
    .filter(faq => faq.questionEn && faq.answerEn)

  for (const faq of faqs) {
    await prisma.faqItem.create({ data: faq })
  }

  console.log(`Seeded ${faqs.length} Upskill FAQs`)
}

async function seedPioneerFaqs() {
  const PIONEER_PROGRAM_ID = 'cm6thpe9x0004jp03w659tlsf' // Updated ID
  
  const category = await createFaqCategory('Pioneer FAQs', PIONEER_PROGRAM_ID)

  const faqs = pioneerData
    .filter(item => item['Pioneer FAQs'] || item[''])
    .map(item => ({
      questionEn: item['Pioneer FAQs'] || '',
      questionAr: item['Pioneer FAQs'] || '',
      answerEn: item[''] || '',
      answerAr: item[''] || '',
      categoryId: category.id,
      programId: PIONEER_PROGRAM_ID,
    }))
    .filter(faq => faq.questionEn && faq.answerEn)

  for (const faq of faqs) {
    await prisma.faqItem.create({ data: faq })
  }

  console.log(`Seeded ${faqs.length} Pioneer FAQs`)
}

async function main() {
  try {
    // Clean existing data first
    await prisma.faqItem.deleteMany({
      where: {
        programId: {
          in: ['cm6o9bcdt0000t7i8d4by3u2l', 'cm6thpe9x0004jp03w659tlsf']
        }
      }
    })
    await prisma.faqCategory.deleteMany({
      where: {
        programId: {
          in: ['cm6o9bcdt0000t7i8d4by3u2l', 'cm6thpe9x0004jp03w659tlsf']
        }
      }
    })

    // Remove the ensureProgram calls since programs already exist
    await seedUpskillFaqs()
    await seedPioneerFaqs()

    console.log('FAQ seeding completed successfully')
  } catch (error) {
    console.error('Error seeding FAQs:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
