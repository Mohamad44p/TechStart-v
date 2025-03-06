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
      nameAr: nameEn, // Using English name as Arabic for now
      slug,
      programId,
    },
  })
}

async function seedUpskillFaqs() {
  console.log('Starting to seed Upskill FAQs...')
  
  // First, check if the program exists
  const upskillProgram = await prisma.programsPages.findFirst({
    where: {
      name_en: { contains: 'Upskill', mode: 'insensitive' }
    }
  })

  if (!upskillProgram) {
    console.error('Upskill program not found in the database')
    return
  }

  const UPSKILL_PROGRAM_ID = upskillProgram.id
  console.log(`Found Upskill program with ID: ${UPSKILL_PROGRAM_ID}`)
  
  const category = await createFaqCategory('Upskill FAQs', UPSKILL_PROGRAM_ID)
  console.log(`Created FAQ category with ID: ${category.id}`)

  // Handle the nested structure of upskill.json
  const faqs = upskillData.data
    .filter(item => 
      (item['UpSkill FAQs'] || item['UpSkill FAQs'] === '') && 
      (item[''] || item[''] === '') &&
      !(item['UpSkill FAQs'] === 'Questions ' && item[''] === 'Answers')
    )
    .map(item => ({
      questionEn: item['UpSkill FAQs'] || '',
      questionAr: item['UpSkill FAQs'] || '', // Using English as Arabic for now
      answerEn: item[''] || '',
      answerAr: item[''] || '', // Using English as Arabic for now
      categoryId: category.id,
      programId: UPSKILL_PROGRAM_ID,
    }))
    .filter(faq => faq.questionEn && faq.answerEn && faq.answerEn !== '#VALUE!')

  console.log(`Prepared ${faqs.length} Upskill FAQs for insertion`)

  for (const [index, faq] of faqs.entries()) {
    try {
      await prisma.faqItem.create({ 
        data: {
          ...faq,
          order: index
        } 
      })
    } catch (error) {
      console.error(`Error creating FAQ item: ${error}`)
      console.error('FAQ data:', faq)
    }
  }

  console.log(`Successfully seeded ${faqs.length} Upskill FAQs`)
}

async function seedPioneerFaqs() {
  console.log('Starting to seed Pioneer FAQs...')
  
  // First, check if the program exists
  const pioneerProgram = await prisma.programsPages.findFirst({
    where: {
      name_en: { contains: 'Pioneer', mode: 'insensitive' }
    }
  })

  if (!pioneerProgram) {
    console.error('Pioneer program not found in the database')
    return
  }

  const PIONEER_PROGRAM_ID = pioneerProgram.id
  console.log(`Found Pioneer program with ID: ${PIONEER_PROGRAM_ID}`)
  
  const category = await createFaqCategory('Pioneer FAQs', PIONEER_PROGRAM_ID)
  console.log(`Created FAQ category with ID: ${category.id}`)

  // Handle the flat structure of poinnerfaq.json
  const faqs = pioneerData
    .filter(item => 
      (item['Pioneer FAQs'] || item['Pioneer FAQs'] === '') && 
      (item[''] || item[''] === '') &&
      !(item['Pioneer FAQs'] === 'Questions' && item[''] === 'Answers')
    )
    .map(item => ({
      questionEn: item['Pioneer FAQs'] || '',
      questionAr: item['Pioneer FAQs'] || '', // Using English as Arabic for now
      answerEn: item[''] || '',
      answerAr: item[''] || '', // Using English as Arabic for now
      categoryId: category.id,
      programId: PIONEER_PROGRAM_ID,
    }))
    .filter(faq => faq.questionEn && faq.answerEn)

  console.log(`Prepared ${faqs.length} Pioneer FAQs for insertion`)

  for (const [index, faq] of faqs.entries()) {
    try {
      await prisma.faqItem.create({ 
        data: {
          ...faq,
          order: index
        } 
      })
    } catch (error) {
      console.error(`Error creating FAQ item: ${error}`)
      console.error('FAQ data:', faq)
    }
  }

  console.log(`Successfully seeded ${faqs.length} Pioneer FAQs`)
}

async function main() {
  try {
    console.log('Starting FAQ seeding process...')
    
    // Clean existing data first
    console.log('Cleaning existing FAQ data...')
    
    // Find program IDs first
    const upskillProgram = await prisma.programsPages.findFirst({
      where: {
        name_en: { contains: 'Upskill', mode: 'insensitive' }
      }
    })
    
    const pioneerProgram = await prisma.programsPages.findFirst({
      where: {
        name_en: { contains: 'Pioneer', mode: 'insensitive' }
      }
    })
    
    const programIds = [
      upskillProgram?.id,
      pioneerProgram?.id
    ].filter(Boolean) as string[]
    
    if (programIds.length > 0) {
      // Delete existing FAQ items for these programs
      const deletedItems = await prisma.faqItem.deleteMany({
        where: {
          programId: {
            in: programIds
          }
        }
      })
      console.log(`Deleted ${deletedItems.count} existing FAQ items`)
      
      // Delete existing FAQ categories for these programs
      const deletedCategories = await prisma.faqCategory.deleteMany({
        where: {
          programId: {
            in: programIds
          }
        }
      })
      console.log(`Deleted ${deletedCategories.count} existing FAQ categories`)
    } else {
      console.log('No matching programs found, skipping deletion step')
    }

    // Seed new data
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
