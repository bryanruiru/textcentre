/**
 * Collection of direct Unsplash image URLs for book covers
 */

// Array of Unsplash book cover image URLs
export const bookCoverImages = [
  // General book covers
  'https://images.unsplash.com/photo-1591778967891-4c44dbb3e636?w=800&h=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&h=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&h=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=800&h=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1531901599143-df5010ab9438?w=800&h=1200&auto=format&fit=crop',
  
  // Fiction/Fantasy
  'https://images.unsplash.com/photo-1535666669445-e8c15cd2e7d9?w=800&h=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1518744386442-2d48ac47a7eb?w=800&h=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=800&h=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1479660095429-2cf4e1360472?w=800&h=1200&auto=format&fit=crop',
  
  // Romance
  'https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=800&h=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1515894203077-9cd25e14b407?w=800&h=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1492552085122-36706be22ba8?w=800&h=1200&auto=format&fit=crop',
  
  // Business/Self-help
  'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&h=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=1200&auto=format&fit=crop',
  
  // History
  'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=800&h=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1461088945293-0c17689e48ac?w=800&h=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1447069387593-a5de0862481e?w=800&h=1200&auto=format&fit=crop',
  
  // Cooking/Food
  'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&h=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1505935428862-770b6f24f629?w=800&h=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=800&h=1200&auto=format&fit=crop',
  
  // Technology/Computing
  'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=1200&auto=format&fit=crop',
  
  // Religion/Spirituality
  'https://images.unsplash.com/photo-1507434965515-31d3ae681d17?w=800&h=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=800&h=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=800&h=1200&auto=format&fit=crop',
  
  // Audio/Music
  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&h=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&h=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&h=1200&auto=format&fit=crop'
];

/**
 * Gets a random book cover URL from the collection
 * @returns URL to an Unsplash image
 */
export const getRandomBookCover = (): string => {
  const randomIndex = Math.floor(Math.random() * bookCoverImages.length);
  return bookCoverImages[randomIndex];
};
