import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Calendar } from "lucide-react"

export interface ContentCardProps {
  type: string;
  title: string;
  description: string | null;
  createdAt: Date;
  readTime: string | null;
  imageUrl: string | null;
  slug: string;
  isPdf?: boolean; // Add this prop
  tags: { 
    name: string;
    slug: string;
  }[];
}

export function ContentCard({ 
  type, 
  title, 
  description, 
  createdAt,
  readTime,
  imageUrl,
  slug,
  isPdf,
  tags = []
}: ContentCardProps) {
  const CardContent = () => (
    <motion.article 
      className="group relative bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
      whileHover={{ y: -5 }}
    >
      <div className="relative aspect-video">
        <Image
          src={imageUrl || "/placeholder.jpg"}
          alt={title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>
      
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-block px-3 py-1 text-xs font-semibold text-white bg-[#862996] rounded-full">
            {type === 'blog' ? 'News & Press Releases' : type}
          </span>
        </div>
        
        <h3 className="text-xl font-bold mb-2 line-clamp-2">{title}</h3>
        
        {description && (
          <p className="text-gray-600 mb-4 line-clamp-2">{description}</p>
        )}
        
        <div className="flex items-center text-sm text-gray-500">
          <Calendar size={16} className="mr-2" />
          {new Date(createdAt).toLocaleDateString()}
          {readTime && (
            <>
              <span className="mx-2">•</span>
              {readTime}
            </>
          )}
        </div>
        
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {tags.map((tag) => (
              <span
                key={tag.slug}
                className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.article>
  );

  // If it's a PDF, don't wrap in Link
  return isPdf ? <CardContent /> : (
    <Link href={`/media-center/news/${type}/${slug}`}>
      <CardContent />
    </Link>
  );
}
