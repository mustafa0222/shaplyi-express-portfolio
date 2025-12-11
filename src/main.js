import './style.css'

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  lucide.createIcons();

  // --- Constants & Config ---
  const typingSpeed = 100;
  const erasingSpeed = 50;
  const newTextDelay = 2000;
  const typingElement = document.getElementById('typing-text');

  // UI Elements
  const navbar = document.getElementById('navbar');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  // --- Typing Animation ---
  if (typingElement) {
    const texts = ["From UAE to Iraq", "Door to Door", "From China to Iraq", "From America to Iraq", "From Turkey to Iraq"];
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
        typeSpeed = newTextDelay; // Pause at end
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
        typeSpeed = 500; // Pause before new word
      }

      setTimeout(type, typeSpeed);
    }

    // Start typing
    setTimeout(type, 1000);
  }

  // --- Mobile Menu ---
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }

  // --- Smooth Scroll ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId.startsWith('#')) return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        // Close mobile menu if open
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
          mobileMenu.classList.add('hidden');
        }

        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });

  // --- Navbar Scroll Effect ---
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('shadow-md');
      navbar.classList.add('bg-white/95');
      // navbar.classList.remove('bg-transparent'); // removed as we start white now
    } else {
      navbar.classList.remove('shadow-md');
    }
  });

  // --- Fade In Animation ---
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.remove('opacity-0', 'translate-y-10');
        entry.target.classList.add('opacity-100', 'translate-y-0');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('section > div').forEach(el => {
    el.classList.add('transform', 'transition-all', 'duration-1000', 'opacity-0', 'translate-y-10');
    observer.observe(el);
  });

  // --- Carousel Logic ---
  const track = document.getElementById('carousel-track');
  if (track) {
    const slides = track.children;
    const prevBtn = document.getElementById('prev-slide');
    const nextBtn = document.getElementById('next-slide');
    const dots = document.querySelectorAll('#carousel-dots button');
    let currentIndex = 0;
    const totalSlides = slides.length;

    function updateCarousel() {
      // Check direction directly from html dir attribute
      const isRTL = document.documentElement.dir === 'rtl';
      const directionModifier = isRTL ? 1 : -1;
      // In logical RTL, translateX negative still moves left (showing right content). 
      // But standard flex row in RTL mode flips automatically!
      // If dir="rtl", 1st item is on Right. 
      // transform: translateX(100%) moves it Left. 
      // transform: translateX(-100%) moves it Right.
      // We need to test this. Standard Carousel implementation often forces LTR or handles offset manually.
      // Easiest is to keep carousel container dir="ltr" to simplify logic, but let's see. 
      // I'll stick to LTR logic for the carousel track specifically if needed, OR just plain percentages.
      // Actually, for a simple implementation, let's assume standard LTR behavior for the transform logic unless container is fliped.
      // Let's force LTR style for the carousel track to ensure consistency across langs? No, user wants native feel.
      // If dir=rtl, `flex-row` naturally orders items R->L.
      // So Slide 1 is Rightmost. Slide 2 is to its Left.
      // To show Slide 2, we need to move track to the Right (+100%).
      // So for RTL: translateX(index * 100%).
      // For LTR: translateX(-index * 100%).

      if (document.documentElement.dir === 'rtl') {
        track.style.transform = `translateX(${currentIndex * 100}%)`;
      } else {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
      }

      // Update dots
      dots.forEach((dot, index) => {
        if (index === currentIndex) {
          dot.classList.add('bg-accent');
          dot.classList.remove('bg-gray-300');
        } else {
          dot.classList.remove('bg-accent');
          dot.classList.add('bg-gray-300');
        }
      });
    }

    function nextSlide() {
      currentIndex = (currentIndex + 1) % totalSlides;
      updateCarousel();
    }

    function prevSlide() {
      currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
      updateCarousel();
    }

    if (nextBtn) nextBtn.addEventListener('click', () => {
      nextSlide();
      resetTimer();
    });
    if (prevBtn) prevBtn.addEventListener('click', () => {
      prevSlide();
      resetTimer();
    });

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        currentIndex = index;
        updateCarousel();
        resetTimer();
      });
    });

    // Auto Play
    let slideInterval = setInterval(nextSlide, 5000);

    function resetTimer() {
      clearInterval(slideInterval);
      slideInterval = setInterval(nextSlide, 5000);
    }

    // Swipe Support
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener('touchend', e => {
      touchEndX = e.changedTouches[0].screenX;
      const isRTL = document.documentElement.dir === 'rtl';
      const diff = touchStartX - touchEndX;

      // Logical Next/Prev depends on direction
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          // Swiped Left
          isRTL ? prevSlide() : nextSlide();
        } else {
          // Swiped Right
          isRTL ? nextSlide() : prevSlide();
        }
        resetTimer();
      }
    }, { passive: true });
  }

  // --- Translations ---
  const translations = {
    en: {
      nav: { home: 'HOME', about: 'ABOUT', services: 'SERVICES', platform: 'APPLICATION', contact: 'CONTACT', cta: 'Get Started' },
      hero: {
        badge: 'NEXT GEN LOGISTICS',
        title_start: 'Your Global Logistics Partner',
        subtitle: 'Seamless, reliable, and efficient shipping solutions tailored for your business needs.',
        cta_primary: 'Get Started',
        cta_secondary: 'Download App'
      },
      stats: { deliveries: 'Deliveries', countries: 'Countries', clients: 'Happy Clients', support: 'Support' },
      about: {
        title: 'About SHIPLY: Our Commitment to Logistics',
        p1: 'At SHIPLY, we are dedicated to redefining global logistics through a fusion of cutting-edge technology and unwavering reliability. Our mission is to empower businesses with seamless, transparent, and efficient supply chain solutions. Driven by a customer-centric approach, we ensure that every shipment—whether local or international—is handled with precision, speed, and the utmost care.'
      },
      services: {
        label: 'Our Solutions',
        title: 'Comprehensive Logistics Services',
        subtitle: 'We offer a full spectrum of shipping and supply chain solutions tailored to your specific requirements.',
        air: { title: 'Air Freight', desc: 'Speed and efficiency for your time-sensitive cargo to any destination worldwide.' },
        ocean: { title: 'Ocean Shipping', desc: 'Cost-effective solutions for large volumes with full container load (FCL) options.' },
        land: { title: 'Land Transport', desc: 'Reliable road freight network across regions for seamless door-to-door delivery.' },
        storage: { title: 'Warehousing', desc: 'Secure storage solutions with advanced inventory management systems.' },
        ecom: { title: 'E-Commerce', desc: 'Specialized logistics for online businesses, from fulfillment to last-mile delivery.' },
        customs: { title: 'Customs Brokerage', desc: 'Navigating complex regulations to ensure your goods clear customs quickly.' }
      },
      platform: {
        label: 'Technology',
        title: 'Smart Tracking & Management',
        desc: 'Stay in control with our digital platform. Track shipments in real-time, manage documentation, and get analytics at your fingertips.',
        feat1: { title: 'Secure Packaging', desc: 'Expert packaging to keep your products safe.' },
        feat2: { title: 'Mobile App', desc: 'Manage shipping on the go with our dedicated app.' },
        feat3: { title: 'Digital Docs', desc: 'Secure, paperless documentation management.' }
      },
      contact: {
        label: 'Contact Us',
        title: "Let's Talk Logistics",
        subtitle: 'Have a question or need a quote? Reach out to our team today.',
        phone: 'Phone',
        email: 'Email',
        address: 'Headquarters'
      },
      form: { name: 'Full Name', email: 'Email Address', message: 'Message', submit: 'SEND INQUIRY' },
      footer: {
        links: 'QUICK LINKS',
        rights: '© 2025 SHIPLY Express. All rights reserved.'
      }
    },
    ku: {
      nav: { home: 'سەرەکی', about: 'دەربارە', services: 'خزمەتگوزارییەکان', platform: 'پلاتفۆرمی ئێمە', contact: 'پەیوەندی', cta: 'دەستپێبکە' },
      hero: {
        badge: 'لۆجستی نەوەی نوێ',
        title_start: 'ھاوبەشی لۆجستی جیھانی ئێوە',
        subtitle: 'چارەسەری گواستنەوەی بێ کێشە و جێی متمانە و کارا کە بۆ پێداویستییەکانی بازرگانی ئێوە دیزاین کراون.',
        cta_primary: 'دەستپێبکە',
        cta_secondary: 'خزمەتگوزارییەکانمان'
      },
      stats: { deliveries: 'گەیاندن', countries: 'وڵات', clients: 'بەکارهێنەری دڵخۆش', support: 'پشتگیری' },
      about: {
        label: 'دەربارەی ئێمە',
        title: 'بونیادنانی داهاتووی لۆجستی',
        p1: 'لە SHIPLY، ئێمە تەنها کۆمپانیایەکی لۆجستی نین؛ ئێمە هاوبەشی ستراتیژی ئێوەین لە بازرگانی جیهانیدا. ڕێبازی مۆدێرنمان تەکنەلۆژیای پێشکەوتوو لەگەڵ شارەزایی مرۆیی کۆدەکاتەوە بۆ دڵنیابوون لەوەی کە بارەکەت بە ئاسانی بە سنورەکاندا دەگوازرێتەوە.',
        point1: 'تۆڕی جیهانی جێی متمانە',
        point2: 'نرخی شەفاف',
        point3: 'شارەزایی لە گومرگ'
      },
      services: {
        label: 'چارەسەرەکانمان',
        title: 'خزمەتگوزارییە لۆجستییە گشتگیرەکان',
        subtitle: 'ئێمە کۆمەڵێک چارەسەری تەواوی گواستنەوە و زنجیرەی دابینکردن پێشکەش دەکەین کە تایبەتن بە داواکارییە تایبەتەکانتان.',
        air: { title: 'گواستنەوەی ئاسمانی', desc: 'خێرایی و کارایی بۆ بارە هەستیارەکانتان بۆ هەر شوێنێکی جیهان.' },
        ocean: { title: 'گواستنەوەی دەریا', desc: 'چارەسەری تێچوو کەم بۆ قەبارە گەورەکان بە بژاردەی کۆنتێنەری تەواو (FCL).' },
        land: { title: 'گواستنەوەی وشکانی', desc: 'تۆڕی بارهەڵگری ڕێگای جێی متمانە لە سەرتاسەری ناوچەکان بۆ گەیاندنی بێ کێشە لە دەرگاوە بۆ دەرگا.' },
        storage: { title: 'کۆگا', desc: 'چارەسەری پاراستنی کۆگا لەگەڵ سیستەمی پێشکەوتووی بەڕێوەبردنی کۆگا.' },
        ecom: { title: 'بازرگانی ئەلیکترۆنی', desc: 'لۆجستی تایبەتمەند بۆ بازرگانییە ئۆنلاینەکان، لە جێبەجێکردنەوە تا گەیاندنی کۆتایی.' },
        customs: { title: 'نوێنەرایەتی گومرگی', desc: 'بەڕێوەبردنی ڕێسا ئاڵۆزەکان بۆ دڵنیابوون لەوەی کاڵاکانت بە خێرایی لە گومرگ تێدەپەڕن.' }
      },
      platform: {
        label: 'تەکنەلۆژیا',
        title: 'بەدواداچوون و بەڕێوەبردنی زیرەک',
        desc: 'لەگەڵ پلاتفۆرمە دیجیتاڵییەکەمان لە کۆنترۆڵدا بمێنەرەوە. بەدواداچوونی بارەکان بە شێوەی ڕاستەوخۆ، بەڕێوەبردنی بەڵگەنامەکان، و بەدەستهێنانی ئامارەکان.',
        feat1: { title: 'پاکەتکردنی پارێزراو', desc: 'پاکەتکردنی پسپۆڕانە بۆ پاراستنی بەرهەمەکانت.' },
        feat2: { title: 'ئەپڵیکەیشنی مۆبایل', desc: 'بەڕێوەبردنی گواستنەوە لە هەر شوێنێک بیت لەگەڵ ئەپە تایبەتەکەمان.' },
        feat3: { title: 'بەڵگەنامەی دیجیتاڵی', desc: 'بەڕێوەبردنی بەڵگەنامەی پارێزراو و بێ کاغەز.' }
      },
      contact: {
        label: 'پەیوەندیمان پێوە بکەن',
        title: "با باسی لۆجستی بکەین",
        subtitle: 'پرسیارت هەیە یان پێویستت بە نرخ هەیە؟ ئەمڕۆ پەیوەندی بە تیمەکەمانەوە بکە.',
        phone: 'تەلەفۆن',
        email: 'ئیمەیڵ',
        address: 'بارەگای سەرەکی'
      },
      form: { name: 'ناوی تەواو', email: 'ناونیشانی ئیمەیڵ', message: 'نامە', submit: 'ناردنی داواکاری' },
      footer: {
        links: 'بەستەرە خێراکان',
        rights: '© 2025 SHIPLY Express. هەموو مافەکان پارێزراون.'
      }
    },
    ar: {
      nav: { home: 'الرئيسية', about: 'من نحن', services: 'خدماتنا', platform: 'منصتنا', contact: 'اتصل بنا', cta: 'ابدأ الآن' },
      hero: {
        badge: 'اللوجستيات من الجيل القادم',
        title_start: 'شريكك اللوجستي العالمي',
        subtitle: 'حلول شحن سلسة وموثوقة وفعالة مصممة خصيصًا لاحتياجات عملك.',
        cta_primary: 'ابدأ الآن',
        cta_secondary: 'خدماتنا'
      },
      stats: { deliveries: 'عملية توصيل', countries: 'دولة', clients: 'عميل سعيد', support: 'دعم فني' },
      about: {
        label: 'من نحن',
        title: 'بناء مستقبل اللوجستيات',
        p1: 'في SHIPLY، نحن أكثر من مجرد شركة لوجستية؛ نحن شريكك الاستراتيجي في التجارة العالمية. يجمع نهجنا الحديث بين التكنولوجيا المتقدمة والخبرة البشرية لضمان تحرك بضائعك بسلاسة عبر الحدود.',
        point1: 'شبكة عالمية موثوقة',
        point2: 'أسعار شفافة',
        point3: 'خبرة في التخليص الجمركي'
      },
      services: {
        label: 'حلولنا',
        title: 'خدمات لوجستية شاملة',
        subtitle: 'نقدم مجموعة كاملة من حلول الشحن وسلسلة التوريد المصممة خصيصًا لمتطلباتك المحددة.',
        air: { title: 'الشحن الجوي', desc: 'السرعة والكفاءة لبضائعك الحساسة للوقت إلى أي وجهة في جميع أنحاء العالم.' },
        ocean: { title: 'الشحن البحري', desc: 'حلول فعالة من حيث التكلفة للأحجام الكبيرة مع خيارات حمولة حاوية كاملة (FCL).' },
        land: { title: 'النقل البري', desc: 'شبكة نقل بري موثوقة عبر المناطق لتسليم سلس من الباب إلى الباب.' },
        storage: { title: 'التخزين', desc: 'حلول تخزين آمنة مع أنظمة إدارة مخزون متقدمة.' },
        ecom: { title: 'التجارة الإلكترونية', desc: 'لوجستيات متخصصة للشركات عبر الإنترنت، من التنفيذ إلى التسليم النهائي.' },
        customs: { title: 'التخليص الجمركي', desc: 'التنقل في اللوائح المعقدة لضمان تخليص بضائعك بسرعة.' }
      },
      platform: {
        label: 'التكنولوجيا',
        title: 'تتبع وإدارة ذكية',
        desc: 'ابق في السيطرة مع منصتنا الرقمية. تتبع الشحنات في الوقت الفعلي، وأدر الوثائق، واحصل على التحليلات في متناول يدك.',
        feat1: { title: 'تغليف آمن', desc: 'تغليف احترافي للحفاظ على سلامة منتجاتك.' },
        feat2: { title: 'تطبيق الجوال', desc: 'أدر الشحن أثناء التنقل مع تطبيقنا المخصص.' },
        feat3: { title: 'وثائق رقمية', desc: 'إدارة توثيق آمنة وخالية من الورق.' }
      },
      contact: {
        label: 'اتصل بنا',
        title: "لنتحدث في اللوجستيات",
        subtitle: 'هل لديك سؤال أو تحتاج إلى عرض سعر؟ تواصل مع فريقنا اليوم.',
        phone: 'الهاتف',
        email: 'البريد الإلكتروني',
        address: 'المقر الرئيسي'
      },
      form: { name: 'الاسم الكامل', email: 'عنوان البريد الإلكتروني', message: 'الرسالة', submit: 'إرسال الاستفسار' },
      footer: {
        links: 'روابط سريعة',
        rights: '© 2025 SHIPLY Express. جميع الحقوق محفوظة.'
      }
    }
  };

  // Make setLanguage globally available for onclick handlers in HTML
  window.setLanguage = function (lang) {
    if (!translations[lang]) return;

    // Update UI Direction and Lang Attribute
    document.documentElement.dir = (lang === 'ar' || lang === 'ku') ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;

    // Update Font based on language
    if (lang === 'ar' || lang === 'ku') {
      document.body.style.fontFamily = '"Amiri", "Outfit", sans-serif'; // Example font switch if needed
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

    // Update Current Lang Toggle Text
    const currentLangSpan = document.getElementById('current-lang');
    if (currentLangSpan) currentLangSpan.textContent = lang.toUpperCase();

    // Update Mobile Menu Links (Manual Sync as they might not duplicate IDs)
    // Since we share data-i18n, the querySelectorAll above handles both desktop and mobile if structure matches.

    console.log(`Language set to ${lang}`);
  };

});
