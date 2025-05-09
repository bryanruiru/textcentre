import { Book, User } from './types';
import { getRandomBookCover } from './utils/unsplashService';

// Helper function to generate a book cover
const generateBookCover = (): string => {
  // Use random Unsplash images for book covers
  return getRandomBookCover();
};

// Helper function to format book title from filename
const formatBookTitle = (filename: string): string => {
  // Remove file extension and replace hyphens with spaces
  const withoutExtension = filename.replace(/\.(epub|mp3|opus)$/, '');
  const withSpaces = withoutExtension.replace(/-/g, ' ');
  
  // Capitalize each word
  return withSpaces
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Helper function to extract genre from book title/filename
const extractGenre = (title: string): string[] => {
  const lowerTitle = title.toLowerCase();
  
  if (lowerTitle.includes('recipe') || lowerTitle.includes('food') || lowerTitle.includes('diet') || lowerTitle.includes('smoothie') || lowerTitle.includes('chicken')) {
    return ['Cooking', 'Food & Drink'];
  } else if (lowerTitle.includes('business') || lowerTitle.includes('money') || lowerTitle.includes('chatgpt') || lowerTitle.includes('income')) {
    return ['Business', 'Self-Help'];
  } else if (lowerTitle.includes('romance') || lowerTitle.includes('love') || lowerTitle.includes('seduction') || lowerTitle.includes('alpha') || lowerTitle.includes('billionaire')) {
    return ['Romance', 'Fiction'];
  } else if (lowerTitle.includes('history') || lowerTitle.includes('empire') || lowerTitle.includes('renaissance') || lowerTitle.includes('vikings') || lowerTitle.includes('celtic')) {
    return ['History', 'Non-Fiction'];
  } else if (lowerTitle.includes('god') || lowerTitle.includes('prayer') || lowerTitle.includes('spiritual') || lowerTitle.includes('hell')) {
    return ['Religion', 'Spirituality'];
  } else if (lowerTitle.includes('health') || lowerTitle.includes('skin') || lowerTitle.includes('herbal')) {
    return ['Health', 'Wellness'];
  } else if (lowerTitle.includes('hack') || lowerTitle.includes('anonymous') || lowerTitle.includes('bitcoin')) {
    return ['Technology', 'Computing'];
  } else if (lowerTitle.includes('intelligence') || lowerTitle.includes('introvert') || lowerTitle.includes('psychology')) {
    return ['Psychology', 'Self-Help'];
  } else if (lowerTitle.includes('story')) {
    return ['Short Stories', 'Fiction'];
  } else {
    // Default genre if none detected
    return ['General', 'Non-Fiction'];
  }
};

// Helper function to generate a realistic price
const generatePrice = (title: string, isPremium: boolean, isFree: boolean): number | null => {
  if (isFree) return null;
  
  // Generate a price based on the title length (just for variety)
  const basePrice = 499 + (title.length * 25);
  return isPremium ? basePrice + 500 : basePrice;
};

// Create eBooks from the Book store folder
const ebooks = [
  // eBooks
  '25-productivity-tips-for-successful-business-owners.epub',
  '50-fun-ways-to-stay-healthy.epub',
  '7-prayers-for-your-spiritual-life.epub',
  'angel-dust.epub',
  'are-men-the-weaker-sex.epub',
  'bitcoin-scams.epub',
  'celtic-history.epub',
  'chicken-recipes.epub',
  'death-in-dollars-a-short-story.epub',
  'dirty-seduction.epub',
  'emotional-intelligence-mastery-a-practical-guide-to-improving.epub',
  'farting-with-all-his-might-the-endangered-status-of-the-hetero-male.epub',
  'forget-the-mistletoe_10pct_sample.epub',
  'girl-to-girl.epub',
  'hacking-tools-you-need-for-your-first-online-business.epub',
  'hell-is-real.epub',
  'how-to-become-anonymous-secure-and-free-online.epub',
  'how-to-know-your-iq-level-without-taking-the-test.epub',
  'introvert-go-from-wallflower-to-confident-public-speaker-in-30-minutes.epub',
  'is-donald-trump-666_8pct_sample.epub',
  'ketogenic-diet-meal-prep-weight-loss-cookbook-with-breakfast.epub',
  'make-money-with-chatgpt-your-guide-to-making-passive-income.epub',
  'navigating-the-seasons-of-love.epub',
  'one-god.epub',
  'quick-no-cook-low-carb-recipes.epub',
  'rapture-happened-left-behind-whats-next-tribulation-period-s.epub',
  'rules-every-educated-man-should-know.epub',
  'smoothies-smoothies-for-beginners-smoothies-recipe-book.epub',
  'the-alphas-saviour.epub',
  'the-art-of-balance-cheat-sheet.epub',
  'the-beginners-herbal-handbook-discover-50-tips-to-get-you-started.epub',
  'the-charming-billionaire.epub',
  'the-joan-wilder-effect.epub',
  'the-left-hand-of-agnes-a-short-story.epub',
  'the-ottoman-empire.epub',
  'the-renaissance-a-history-from-beginning-to-end.epub',
  'the-secret-of-healthy-skin-7-surprising-benefits-you-never-know.epub',
  'the-silent-killer.epub',
  'the-sweet-escape-small-town-romance.epub',
  'understanding-genesis-1-11-from-adam-to-abraham.epub',
  'uxui-design-playbook.epub',
  'vikings.epub'
].map((filename, index) => {
  const title = formatBookTitle(filename);
  const isPremium = index % 5 === 0; // Make every 5th book premium
  const isFree = index % 7 === 0; // Make every 7th book free
  
  return {
    id: `ebook-${index + 1}`,
    title,
    author: `Author ${index + 1}`,
    coverImage: generateBookCover(),
    description: `${title} - An engaging read that will captivate your imagination and expand your knowledge.`,
    rating: 3.5 + (Math.random() * 1.5),
    reviewCount: Math.floor(Math.random() * 300) + 50,
    price: generatePrice(title, isPremium, isFree),
    isPremium,
    isFree,
    hasAudio: false,
    genre: extractGenre(title),
    publishedDate: `2023-${Math.floor(Math.random() * 12) + 1}-${Math.floor(Math.random() * 28) + 1}`,
    filePath: `/Book store/${filename}`
  };
});

// Create audiobooks from the Audio Books folder
const audiobooks = [
  'Eternal Embrace (soulful).mp3',
  'Eternal Embrace.mp3',
  'Preeminence.opus',
  'Sound of the Risen.mp3'
].map((filename, index) => {
  const title = formatBookTitle(filename);
  const isPremium = true; // Make all audiobooks premium
  const isFree = false; // No free audiobooks
  
  return {
    id: `audio-${index + 1}`,
    title,
    author: `Audio Author ${index + 1}`,
    coverImage: generateBookCover(),
    description: `${title} - An immersive audiobook experience narrated by professional voice actors.`,
    rating: 4.0 + (Math.random() * 1.0),
    reviewCount: Math.floor(Math.random() * 200) + 100,
    price: generatePrice(title, isPremium, isFree),
    isPremium,
    isFree,
    hasAudio: true,
    genre: ['Audio', 'Spoken Word'],
    publishedDate: `2023-${Math.floor(Math.random() * 12) + 1}-${Math.floor(Math.random() * 28) + 1}`,
    filePath: `/Audio Books/${filename}`
  };
});

// Combine ebooks and audiobooks
export const mockBooks: Book[] = [...ebooks, ...audiobooks];


export const mockUser: User = {
  id: '1',
  name: 'Alex Johnson',
  email: 'alex@example.com',
  isPremium: false,
  readingList: ['1', '4', '7'],
  recentlyViewed: ['2', '5', '3'],
};

export const genres = [
  'Adventure', 
  'Science Fiction', 
  'Mystery', 
  'Romance', 
  'Fantasy', 
  'Thriller', 
  'Historical Fiction', 
  'Non-fiction', 
  'Biography', 
  'Self-help'
];

export const popularAuthors = [
  'Elena Michaels',
  'Jonathan Blake',
  'Sophia Chen',
  'Marcus Johnson',
  'Aiden Zhang',
  'Emma Sullivan'
];