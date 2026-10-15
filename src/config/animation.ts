/**
 * Animation, Authentication, and Portfolio Configuration
 * Centralized configuration for timings, video continuation, credentials, and projects.
 */

export interface ProjectItem {
  id: string;
  row: 1 | 2 | 3;
  index: number;
  title: string;
  category: string;
  subtitle: string;
  image: string;
  remoteCoverUrl?: string;
  behanceUrl: string;
  slug?: string;
  stats?: {
    views: number;
    appreciations: number;
  };
  color?: string;
  publishedOn?: number;
}

export interface AnimationConfig {
  intro: {
    cameraFov: number;
    cameraZ: number;
    entranceDuration: number;
    ctaRevealDelay: number;
    rotationSpeedY: number;
    mouseParallaxStrength: number;
    cellSpreadScale: number;
  };
  continuation: {
    videoSrc: string;
    splitTimestamp: number;
    endTimestamp?: number;
    playbackRate: number;
    autoTransitionDelay: number;
  };
  auth: {
    authorizedPhone: string;
    authorizedPassword?: string;
    defaultCountryCode: string;
    sessionRedirectUrl: string;
  };
  portfolio: {
    name: string;
    title: string;
    headline: string;
    supportingCopy: string;
    hireMeDestination: string; // Configurable destination
    behanceProfileUrl: string;
    projects: ProjectItem[];
  };
}

export const ANIMATION_CONFIG: AnimationConfig = {
  intro: {
    cameraFov: 45,
    cameraZ: 4.2,
    entranceDuration: 2.2,
    ctaRevealDelay: 1.8,
    rotationSpeedY: 0.007,
    mouseParallaxStrength: 0.08,
    cellSpreadScale: 1.05,
  },
  continuation: {
    videoSrc: '/assets/video/12676832_3840_2160_30fps.mp4',
    splitTimestamp: 0.0,
    endTimestamp: 20.0,
    playbackRate: 1.0,
    autoTransitionDelay: 500,
  },
  auth: {
    authorizedPhone: '8803100375',
    authorizedPassword: 'vR8!qZ4#Lm9@Tx2$Np7^Kc5&',
    defaultCountryCode: '+91',
    sessionRedirectUrl: '/portfolio',
  },
  portfolio: {
    name: 'SANJANA SHARMA',
    headline: 'Beyond The Ordinary',
    title: 'UI/UX Designer · Creative Development · Purposeful Interaction',
    supportingCopy: 'I transform ideas into thoughtful digital experiences through UI/UX design, creative development, and purposeful interaction.',
    hireMeDestination: 'mailto:sanjana19122001@gmail.com',
    behanceProfileUrl: 'https://www.behance.net/sanjanasharma14',
    projects: [
      // ROW 1: WEB & SAAS PLATFORMS (4 Authentic Behance Works)
      {
        id: '246132999',
        index: 1,
        row: 1,
        title: 'AI & Workflow, Automation website Design',
        category: 'ARTIFICIAL INTELLIGENCE',
        subtitle: 'SaaS Platform & Workflow Engine',
        image: '/assets/projects/behance-246132999.webp',
        remoteCoverUrl: 'https://mir-s3-cdn-cf.behance.net/projects/original_webp/6b8833246132999.Y3JvcCwxNjE2LDEyNjQsMCww.png',
        behanceUrl: 'https://www.behance.net/gallery/246132999/AI-Workflow-Automation-website-Design',
        slug: 'AI-Workflow-Automation-website-Design',
        stats: { views: 20, appreciations: 2 },
        color: 'rgb(237, 241, 248)',
        publishedOn: 1773989866,
      },
      {
        id: '244207705',
        index: 2,
        row: 1,
        title: 'MindHaven',
        category: 'MOBILE HEALTHCARE',
        subtitle: 'Mental Wellbeing & Mindfulness App',
        image: '/assets/projects/behance-244207705.webp',
        remoteCoverUrl: 'https://mir-s3-cdn-cf.behance.net/projects/original_webp/86cb6e244207705.Y3JvcCw5NjEsNzUyLDIxOCww.png',
        behanceUrl: 'https://www.behance.net/gallery/244207705/MindHaven',
        slug: 'MindHaven',
        stats: { views: 14, appreciations: 3 },
        color: 'rgb(241, 238, 210)',
        publishedOn: 1771225631,
      },
      {
        id: '235725021',
        index: 3,
        row: 1,
        title: 'CARENT- Webiste design',
        category: 'E-COMMERCE PLATFORM',
        subtitle: 'Modern Vehicle Rental Portal',
        image: '/assets/projects/behance-235725021.webp',
        remoteCoverUrl: 'https://mir-s3-cdn-cf.behance.net/projects/original_webp/42b869235725021.Y3JvcCwxMDYzLDgzMiwxMDcsMA.png',
        behanceUrl: 'https://www.behance.net/gallery/235725021/CARENT-Webiste-design',
        slug: 'CARENT-Webiste-design',
        stats: { views: 42, appreciations: 5 },
        color: 'rgb(4, 4, 4)',
        publishedOn: 1759321679,
      },
      {
        id: '231633509',
        index: 4,
        row: 1,
        title: 'MoneyPlay – Financial Website',
        category: 'FINTECH INTERFACE',
        subtitle: 'Next-Gen Investment & Wealth UI',
        image: '/assets/projects/behance-231633509.webp',
        remoteCoverUrl: 'https://mir-s3-cdn-cf.behance.net/projects/original_webp/98ff6b231633509.Y3JvcCwxOTAzLDE0ODgsMCww.png',
        behanceUrl: 'https://www.behance.net/gallery/231633509/MoneyPlay-Financial-Website',
        slug: 'MoneyPlay-Financial-Website',
        stats: { views: 37, appreciations: 7 },
        color: 'rgb(12, 14, 5)',
        publishedOn: 1754045066,
      },

      // ROW 2: DIGITAL PRODUCTS & EDITORIAL EXPERIENCES (4 Authentic Behance Works)
      {
        id: '248916319',
        index: 5,
        row: 2,
        title: 'Wedding Website Design',
        category: 'EDITORIAL WEB DESIGN',
        subtitle: 'Luxury Digital Invitation Experience',
        image: '/assets/projects/behance-248916319.webp',
        remoteCoverUrl: 'https://mir-s3-cdn-cf.behance.net/projects/original_webp/13f0d3248916319.Y3JvcCwyNDAwLDE4NzcsMCw1OQ.png',
        behanceUrl: 'https://www.behance.net/gallery/248916319/Wedding-Website-Design',
        slug: 'Wedding-Website-Design',
        stats: { views: 14, appreciations: 1 },
        color: 'rgb(251, 253, 244)',
        publishedOn: 1778135998,
      },
      {
        id: '231542687',
        index: 6,
        row: 2,
        title: 'Roomora- Furniture App',
        category: 'MOBILE APPLICATION',
        subtitle: 'Interior Living & Furniture Store',
        image: '/assets/projects/behance-231542687.webp',
        remoteCoverUrl: 'https://mir-s3-cdn-cf.behance.net/projects/original_webp/4612bb231542687.Y3JvcCw5NDAsNzM2LDgxLDA.png',
        behanceUrl: 'https://www.behance.net/gallery/231542687/Roomora-Furniture-App',
        slug: 'Roomora-Furniture-App',
        stats: { views: 28, appreciations: 6 },
        color: 'rgb(180, 165, 154)',
        publishedOn: 1753943036,
      },
      {
        id: '232275381',
        index: 7,
        row: 2,
        title: 'Hero Section Design-Sail Through Chaos',
        category: 'CREATIVE DIRECTION',
        subtitle: 'High-Impact Editorial Hero Landing',
        image: '/assets/projects/behance-232275381.webp',
        remoteCoverUrl: 'https://mir-s3-cdn-cf.behance.net/projects/original_webp/194868232275381.Y3JvcCwxMzkyLDEwODksMzEsMA.png',
        behanceUrl: 'https://www.behance.net/gallery/232275381/Hero-Section-Design-Sail-Through-Chaos',
        slug: 'Hero-Section-Design-Sail-Through-Chaos',
        stats: { views: 29, appreciations: 4 },
        color: 'rgb(14, 15, 15)',
        publishedOn: 1754894065,
      },
      {
        id: '229937607',
        index: 8,
        row: 2,
        title: 'Global Freight, Local Expertise',
        category: 'LOGISTICS SYSTEM',
        subtitle: 'Worldwide Cargo & Supply Chain Portal',
        image: '/assets/projects/behance-229937607.webp',
        remoteCoverUrl: 'https://mir-s3-cdn-cf.behance.net/projects/original_webp/abb785229937607.Y3JvcCwxNTEyLDExODIsMCw5Mw.png',
        behanceUrl: 'https://www.behance.net/gallery/229937607/Global-Freight-Local-Expertise',
        slug: 'Global-Freight-Local-Expertise',
        stats: { views: 27, appreciations: 5 },
        color: 'rgb(8, 8, 8)',
        publishedOn: 1752036063,
      },

      // ROW 3: PACKAGING, BRANDING & MOTION (4 Authentic Behance Works)
      {
        id: '232276203',
        index: 9,
        row: 3,
        title: 'Shampoo Mockup Design',
        category: 'PACKAGING // 3D PRODUCT',
        subtitle: 'Organic Cosmetic Brand Identity',
        image: '/assets/projects/behance-232276203.webp',
        remoteCoverUrl: 'https://mir-s3-cdn-cf.behance.net/projects/original_webp/cfa82c232276203.Y3JvcCw4MzQsNjUyLDAsMzA3.png',
        behanceUrl: 'https://www.behance.net/gallery/232276203/Shampoo-Mockup-Design',
        slug: 'Shampoo-Mockup-Design',
        stats: { views: 70, appreciations: 7 },
        color: 'rgb(178, 55, 90)',
        publishedOn: 1754894982,
      },
      {
        id: '246689165',
        index: 10,
        row: 3,
        title: 'Navratri Posts',
        category: 'CAMPAIGN & BRANDING',
        subtitle: 'Festival Campaign & Cultural Graphics',
        image: '/assets/projects/behance-246689165.webp',
        remoteCoverUrl: 'https://mir-s3-cdn-cf.behance.net/projects/original_webp/7c7d8a246689165.Y3JvcCwzNjgyLDI4ODAsMTM5NCww.png',
        behanceUrl: 'https://www.behance.net/gallery/246689165/Navratri-Posts',
        slug: 'Navratri-Posts',
        stats: { views: 11, appreciations: 2 },
        color: 'rgb(255, 237, 221)',
        publishedOn: 1774868460,
      },
      {
        id: '220555567',
        index: 11,
        row: 3,
        title: 'WhatsApp Guide',
        category: 'USER EXPERIENCE',
        subtitle: 'Onboarding & Communication Flow',
        image: '/assets/projects/behance-220555567.webp',
        remoteCoverUrl: 'https://mir-s3-cdn-cf.behance.net/projects/original_webp/f34d79220555567.Y3JvcCw0MTIwLDMyMjMsMTgzLDA.jpg',
        behanceUrl: 'https://www.behance.net/gallery/220555567/WhatsApp-Guide',
        slug: 'WhatsApp-Guide',
        stats: { views: 21, appreciations: 2 },
        color: 'rgb(172, 105, 13)',
        publishedOn: 1740996631,
      },
      {
        id: '230879303',
        index: 12,
        row: 3,
        title: 'Unleashed: The Spirit of Motion',
        category: 'MOTION & IDENTITY',
        subtitle: 'Dynamic Kinetic Typography & Sports',
        image: '/assets/projects/behance-230879303.webp',
        remoteCoverUrl: 'https://mir-s3-cdn-cf.behance.net/projects/original_webp/7e0b2d230879303.Y3JvcCwzNDEwLDI2NjgsMjk1LDA.png',
        behanceUrl: 'https://www.behance.net/gallery/230879303/Unleashed-The-Spirit-of-Motion-%28COPY%29',
        slug: 'Unleashed-The-Spirit-of-Motion-(COPY)',
        stats: { views: 22, appreciations: 4 },
        color: 'rgb(25, 39, 43)',
        publishedOn: 1753166150,
      },
    ],
  },
};
