import './style.css'

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  lucide.createIcons();

  // --- UI Elements ---
  const navbar = document.getElementById('navbar');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenuCloseBtn = document.getElementById('mobile-menu-close');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');

  // --- Mobile Menu Logic ---
  function openMobileMenu() {
    mobileMenuOverlay.classList.remove('hidden');
    // slight delay to allow display:block to apply before opacity transition
    setTimeout(() => {
      mobileMenuOverlay.classList.remove('opacity-0');
      mobileMenu.classList.remove('translate-x-full');
      mobileMenu.classList.remove('rtl:-translate-x-full');
      // For RTL, we want 0. For LTR, we want 0. 
      // The default class is translate-x-full (hidden right) or rtl:-translate-x-full (hidden left)
      // Removing them brings it to 0 (default position).

      // Actually to be safe, let's explicitely add translate-x-0
      mobileMenu.classList.add('translate-x-0');
    }, 10);
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    mobileMenuOverlay.classList.add('opacity-0');
    // Remove the force-0 class so it reverts to the CSS default (hidden)
    mobileMenu.classList.remove('translate-x-0');

    // Add back the hidden state classes if they were removed (actually mostly handled by CSS if we toggle a state class, but here we toggle base classes)
    mobileMenu.classList.add('translate-x-full');
    mobileMenu.classList.add('rtl:-translate-x-full'); // Ensure it goes back to correct side

    // Wait for transition to finish before hiding
    setTimeout(() => {
      mobileMenuOverlay.classList.add('hidden');
    }, 300);
    document.body.style.overflow = '';
  }

  if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', openMobileMenu);
  if (mobileMenuCloseBtn) mobileMenuCloseBtn.addEventListener('click', closeMobileMenu);
  if (mobileMenuOverlay) mobileMenuOverlay.addEventListener('click', closeMobileMenu);

  document.querySelectorAll('#mobile-menu a').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });


  // --- Navbar Scroll Effect ---
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('glass-nav');
      navbar.classList.remove('border-transparent');
    } else {
      navbar.classList.remove('glass-nav');
      navbar.classList.add('border-transparent');
    }
  });


  // --- Luxury Card Hover Glow Effect ---
  const cards = document.querySelectorAll('.luxury-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // --- Typing Animation ---
  const typingElement = document.getElementById('typing-text');
  if (typingElement) {
    const texts = ["Dubai to Iraq", "China to Iraq", "USA to Iraq", "Turkey to Iraq", "Europe to Iraq"];
    const typingSpeed = 100;
    const erasingSpeed = 50;
    const newTextDelay = 2000;
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
      const currentText = texts[textIndex];
      if (isDeleting) {
        typingElement.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typingElement.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
      }

      let typeSpeed = isDeleting ? erasingSpeed : typingSpeed;
      if (!isDeleting && charIndex === currentText.length) {
        isDeleting = true;
        typeSpeed = newTextDelay;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
        typeSpeed = 500;
      }
      setTimeout(type, typeSpeed);
    }
    setTimeout(type, 1000);
  }


  // --- Intersection Observer for Fade In ---
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (entry.target.style.animationDelay) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);


  // --- Carousel Logic ---
  const track = document.getElementById('carousel-track');
  if (track) {
    let currentIndex = 0;
    const slides = track.children;
    const totalSlides = slides.length;

    function updateCarousel() {
      // Assuming LTR for simplicity in transform
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    setInterval(() => {
      currentIndex = (currentIndex + 1) % totalSlides;
      updateCarousel();
    }, 4000);
  }


  // --- WhatsApp Form Handling ---
  const whatsappForm = document.getElementById('whatsapp-form');
  if (whatsappForm) {
    whatsappForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('form-name').value;
      const phone = document.getElementById('form-phone').value;
      const address = document.getElementById('form-address').value;
      const country = document.getElementById('form-country').value;

      const message = `Name: ${name}%0APhone: ${phone}%0AAddress: ${address}%0ACountry: ${country}`;
      const whatsappUrl = `https://wa.me/9647509490950?text=${message}`;

      window.open(whatsappUrl, '_blank');
    });
  }

  // --- Language Handling ---
  const translations = {
    en: {
      nav: { menu: 'Menu', home: 'HOME', about: 'ABOUT', services: 'SERVICES', platform: 'PLATFORM', contact: 'CONTACT', cta: 'Get Started' },
      hero: {
        badge: 'Your express bridge to the world',
        title_start: 'Shiply Iraq',
        title_end: 'Express',
        subtitle: 'Experience the future of shipping with our AI-powered logistics platform. Reliable, fast, and completely transparent from pickup to delivery.',
        cta_primary: 'Start Shipping',
        cta_secondary: 'Download App',
        scaling: 'Shipping from'
      },
      stats: { deliveries: 'Shipments', clients: 'Success Rate', support: 'Support' },
      about: {
        title: 'Redefining Logistics through Innovation',
        p1: 'SHIPLY is not just a shipping company; we are an orbit of connectivity. We merge high-end technology with human expertise to ensure your cargo moves through the world with the elegance and speed it deserves.'
      },
      services: {
        label: 'Our Solutions',
        title: 'Comprehensive Logistics',
        subtitle: 'Premium shipping solutions tailored to your specific business requirements.',
        air: { title: 'Air Freight', desc: 'Rapid global delivery for your most critical time-sensitive shipments.' },
        ocean: { title: 'Ocean Shipping', desc: 'Efficient, large-scale transport solutions across major global trade routes.' },
        land: { title: 'Land Transport', desc: 'Secure and reliable ground fleet network for door-to-door interconnectivity.' },
        storage: { title: 'Smart Warehousing', desc: 'Climate-controlled storage with real-time digital inventory management.' },
        ecom: { title: 'E-Commerce', desc: 'End-to-end fulfillment solutions designed to scale your online business.' },
        customs: { title: 'Customs Brokerage', desc: 'Expert handling of documentation and clearance for hassle-free entry.' }
      },
      platform: {
        label: 'THE APP',
        title: 'Power in Your Pocket',
        desc: 'Manage your entire supply chain from your mobile device. Get push notifications, track shipments in real-time, and handle documentation instantly.',
        feat1: { title: 'Real-Time Tracking', desc: 'Live GPS updates for total visibility.' },
        feat2: { title: 'Instant Notifications', desc: 'Never miss a status update or delivery.' },
        feat3: { title: 'Digital Archive', desc: 'Access all your shipping documents securely.' }
      },
      contact: {
        label: 'CONTACT US',
        title: "Let's Talk.",
        subtitle: 'If you want to get code and address to login our app fill this form',
        phone: 'PHONE',
        email: 'EMAIL',
        address: 'LOCATION'
      },
      form: { name: 'Your Full Name', phone: 'Your Phone Number', address: 'Your Address', country: 'Country', favorites: { emirates: 'Emirates', china: 'China', usa: 'USA', turkey: 'Turkey' }, submit: 'Send Message' },
      footer: { tagline: 'Global logistics partner for the modern world.', rights: '© 2025 SHIPLY Express. All right reserved.' }
    },
    ar: {
      nav: { menu: 'القائمة', home: 'الرئيسية', about: 'من نحن', services: 'خدماتنا', platform: 'المنصة', contact: 'تواصل معنا', cta: 'ابدأ الآن' },
      hero: {
        badge: 'جسركم السريع إلى العالم',
        title_start: 'شيبلي العراق',
        title_end: 'اكسبريس',
        subtitle: 'جرب مستقبل الشحن مع منصتنا اللوجستية المدعومة بالذكاء الاصطناعي. موثوقة، سريعة، وشفافة تمامًا من الاستلام إلى التسليم.',
        cta_primary: 'ابدأ الشحن',
        cta_secondary: 'حمل التطبيق',
        scaling: 'الشحن من'
      },
      stats: { deliveries: 'شحنة', clients: 'نسبة نجاح', support: 'دعم فني' },
      about: {
        title: 'إعادة تعريف اللوجستيات عبر الابتكار',
        p1: 'شيبلي ليست مجرد شركة شحن؛ نحن مدار للاتصال. ندمج التكنولوجيا الراقية مع الخبرة البشرية لضمان تحرك بضائعك عبر العالم بالأناقة والسرعة التي تستحقها.'
      },
      services: {
        label: 'حلولنا',
        title: 'خدمات لوجستية شاملة',
        subtitle: 'حلول شحن متميزة مصممة خصيصًا لمتطلبات عملك المحددة.',
        air: { title: 'الشحن الجوي', desc: 'توصيل عالمي سريع لشحناتك الأكثر أهمية وحساسية للوقت.' },
        ocean: { title: 'الشحن البحري', desc: 'حلول نقل فعالة وواسعة النطاق عبر طرق التجارة العالمية الرئيسية.' },
        land: { title: 'النقل البري', desc: 'شبكة أسطول بري آمنة وموثوقة للربط من الباب إلى الباب.' },
        storage: { title: 'تخزين ذكي', desc: 'تخزين مراقب مناخيًا مع إدارة مخزون رقمية في الوقت الفعلي.' },
        ecom: { title: 'التجارة الإلكترونية', desc: 'حلول تلبية كاملة مصممة لتوسيع نطاق عملك عبر الإنترنت.' },
        customs: { title: 'التخليص الجمركي', desc: 'معاملة خبيرة للوثائق والتخليص لدخول خالٍ من المتاعب.' }
      },
      platform: {
        label: 'التطبيق',
        title: 'القوة في جيبك',
        desc: 'أدر سلسلة التوريد الخاصة بك بالكامل من جهازك المحمول. احصل على إشعارات فورية، تتبع الشحنات في الوقت الفعلي، وتعامل مع الوثائق فورًا.',
        feat1: { title: 'تتبع لحظي', desc: 'تحديثات GPS حية لرؤية كاملة.' },
        feat2: { title: 'إشعارات فورية', desc: 'لا تفوت أبدًا تحديثًا للحالة أو التسليم.' },
        feat3: { title: 'أرشيف رقمي', desc: 'الوصول إلى جميع وثائق الشحن الخاصة بك بشكل آمن.' }
      },
      contact: {
        label: 'تواصل معنا',
        title: "لنتحدث.",
        subtitle: 'إذا كنت ترغب في الحصول على الرمز والعنوان لتسجيل الدخول إلى تطبيقنا، املأ هذا النموذج',
        phone: 'الهاتف',
        email: 'البريد الإلكتروني',
        address: 'الموقع'
      },
      form: { name: 'الاسم الكامل', phone: 'رقم الهاتف', address: 'العنوان', country: 'البلد', favorites: { emirates: 'الإمارات', china: 'الصين', usa: 'أمريكا', turkey: 'تركيا' }, submit: 'إرسال الرسالة' },
      footer: { tagline: 'شريكك اللوجستي العالمي للعالم الحديث.', rights: '© 2025 SHIPLY Express. جميع الحقوق محفوظة.' }
    },
    ku: {
      nav: { menu: 'مێنۆ', home: 'سەرەکی', about: 'دەربارە', services: 'خزمەتگوزارییەکان', platform: 'پلاتفۆرمی ئێمە', contact: 'پەیوەندی', cta: 'دەستپێبکە' },
      hero: {
        badge: 'پردی خێرای ئێوە بۆ جیهان',
        title_start: 'شيبلي عێراق',
        title_end: 'ئێکسپرێس',
        subtitle: 'ئەزموونی داهاتووی گواستنەوە بکە لەگەڵ پلاتفۆرمە لۆجستییە زیرەکەکەمان. جێی متمانە، خێرا، و بە تەواوی شەفاف لە وەرگرتنەوە تا گەیاندن.',
        cta_primary: 'دەستپێکردنی گواستنەوە',
        cta_secondary: 'داگرتنی ئەپ',
        scaling: 'گواستنەوە لە'
      },
      stats: { deliveries: 'گواستنەوە', clients: 'ڕێژەی سەرکەوتن', support: 'پشتگیری' },
      about: {
        title: 'پێناسەکردنەوەی لۆجستی لە ڕێگەی داهێنانەوە',
        p1: 'شيبلي تەنها کۆمپانیایەکی گواستنەوە نییە؛ ئێمە بازنەی پەیوەندین. ئێمە تەکنەلۆژیای بەرز لەگەڵ شارەزایی مرۆیی تێکەڵ دەکەین بۆ دڵنیابوون لەوەی بارەکەت بەو جوانی و خێراییەی کە شایستەیەتی بە جیهاندا دەجوڵێت.'
      },
      services: {
        label: 'چارەسەرەکانمان',
        title: 'خزمەتگوزارییە لۆجستییەکان',
        subtitle: 'چارەسەری گواستنەوەی نایاب کە تایبەتن بە داواکارییە بازرگانییەکانتان.',
        air: { title: 'گواستنەوەی ئاسمانی', desc: 'گەیاندنی جیهانی خێرا بۆ بارە هەستیارەکانتان.' },
        ocean: { title: 'گواستنەوەی دەریا', desc: 'چارەسەری گواستنەوەی کارا و فراوان لە ڕێگە بازرگانییە جیهانییەکان.' },
        land: { title: 'گواستنەوەی وشکانی', desc: 'تۆڕی بارهەڵگری پارێزراو و جێی متمانە بۆ گەیاندنی دەرگا بۆ دەرگا.' },
        storage: { title: 'کۆگای زیرەک', desc: 'کۆگای کۆنترۆڵکراوی کەشوهەوا لەگەڵ بەڕێوەبردنی دیجیتاڵی کاڵاکان.' },
        ecom: { title: 'بازرگانی ئەلیکترۆنی', desc: 'چارەسەری تەواو بۆ گەورەکردنی بازرگانی ئۆنلاینەکەت.' },
        customs: { title: 'کاروباری گومرگی', desc: 'مامەڵەی شارەزایانە لەگەڵ بەڵگەنامەکان بۆ تێپەڕبوونی بێ کێشە.' }
      },
      platform: {
        label: 'ئەپڵیکەیشن',
        title: 'هێز لە گیرفانتدا',
        desc: 'بەڕێوەبردنی تەواوی زنجیرەی دابینکردنەکەت لە مۆبایلەکەتەوە. وەرگرتنی ئاگاداری، بەدواداچوونی بارەکان، و مامەڵەکردن لەگەڵ بەڵگەنامەکان.',
        feat1: { title: 'بەدواداچوونی ڕاستەوخۆ', desc: 'نوێکاری GPS بۆ بینینی تەواو.' },
        feat2: { title: 'ئاگاداری دەستبەجێ', desc: 'هەرگیز نوێکارییەک یان گەیاندنێک لەدەست مەدە.' },
        feat3: { title: 'ئەرشیفی دیجیتاڵی', desc: 'دەستگەیشتن بە هەموو بەڵگەنامەکانی گواستنەوە بە پارێزراوی.' }
      },
      contact: {
        label: 'پەیوەندی',
        title: "با قسە بکەین.",
        subtitle: 'ئەگەر دەتەوێت کۆد و ناونیشان بەدەست بهێنیت بۆ چوونەژوورەوەی ئەپەکەمان، ئەم فۆرمە پڕبکەرەوە',
        phone: 'تەلەفۆن',
        email: 'ئیمەیڵ',
        address: 'ناونیشان'
      },
      form: { name: 'ناوی تەواو', phone: 'ژمارەی تەلەفۆن', address: 'ناونیشان', country: 'وڵات', favorites: { emirates: 'ئیماڕات', china: 'چین', usa: 'ئەمریکا', turkey: 'تورکیا' }, submit: 'ناردنی نامە' },
      footer: { tagline: 'هاوبەشی لۆجستی جیهانی بۆ جیهانی مۆدێرن.', rights: '© 2025 SHIPLY Express. هەموو مافەکان پارێزراون.' }
    }
  };

  const langBtn = document.getElementById('lang-toggle-btn');
  const currentLangSpan = document.getElementById('current-lang');

  if (langBtn) {
    langBtn.addEventListener('click', () => {
      const current = document.documentElement.lang || 'en';
      let next = 'en';
      if (current === 'en') next = 'ar';
      else if (current === 'ar') next = 'ku';
      else if (current === 'ku') next = 'en';

      window.setLanguage(next);
    });
  }

  // --- Mobile Language Dropdown ---
  const mobileLangBtn = document.getElementById('mobile-lang-btn');
  const mobileLangDropdown = document.getElementById('mobile-lang-dropdown');
  const mobileLangText = document.getElementById('mobile-lang-text');

  if (mobileLangBtn && mobileLangDropdown) {
    mobileLangBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      mobileLangDropdown.classList.toggle('hidden');
      mobileLangDropdown.classList.toggle('flex');
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!mobileLangBtn.contains(e.target) && !mobileLangDropdown.contains(e.target)) {
        mobileLangDropdown.classList.add('hidden');
        mobileLangDropdown.classList.remove('flex');
      }
    });
  }

  window.setLanguage = function (lang) {
    if (!translations[lang]) return;

    // Update UI Direction and Lang Attribute
    document.documentElement.dir = (lang === 'ar' || lang === 'ku') ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;

    // Update Font
    if (lang === 'ar' || lang === 'ku') {
      document.body.style.fontFamily = '"Noto Sans Arabic", "OutOf", sans-serif';
    } else {
      document.body.style.fontFamily = '"Inter", sans-serif';
    }

    // Update Text Content
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      const keys = key.split('.');
      let value = translations[lang];

      for (const k of keys) {
        value = value?.[k];
      }

      if (value) {
        element.textContent = value;
      }
    });

    if (currentLangSpan) currentLangSpan.textContent = lang.toUpperCase();
    if (mobileLangText) mobileLangText.textContent = lang.toUpperCase();

    // Hide mobile dropdown after selection
    if (mobileLangDropdown) {
      mobileLangDropdown.classList.add('hidden');
      mobileLangDropdown.classList.remove('flex');
    }

    console.log(`Language set to ${lang}`);
  };

});
