export type PartnershipFit = "low" | "medium" | "high" | "selective";
export type PartnershipWeight = "light" | "medium" | "heavy";

export type PartnershipModel = {
  id: string;
  name: string;
  tag: string;
  description: string;
  attributes: string[];
  integration: number;
  control: number;
  risk: number;
  commitment: number;
  color: string;
  accentClassName: string;
  surfaceClassName: string;
  borderClassName: string;
  legalEntity: string;
  sharedCapital: string;
  exitDifficulty: string;
  tubaFit: PartnershipFit;
  mechanics: string[];
  whenToUse: string[];
  tubaNote: string;
  example: string;
  weight: PartnershipWeight;
};

export const PARTNERSHIP_METRIC_MAX = 6;

export const partnershipModels: PartnershipModel[] = [
  {
    id: "referral",
    name: "معرفی / ارجاع",
    tag: "سبک‌ترین",
    description:
      "یک طرف، مشتری یا فرصت را به طرف دیگر معرفی می‌کند؛ بدون عملیات مشترک، سرمایه‌گذاری یا ساختار حاکمیتی.",
    attributes: ["بدون قرارداد رسمی", "کارمزد مبتنی بر معرفی"],
    integration: 1,
    control: 1,
    risk: 1,
    commitment: 1,
    color: "#378ADD",
    accentClassName: "text-blue-700 dark:text-blue-300",
    surfaceClassName: "bg-blue-50/90 dark:bg-blue-950/30",
    borderClassName: "border-blue-200/80 dark:border-blue-900/60",
    legalEntity: "ندارد",
    sharedCapital: "ندارد",
    exitDifficulty: "بسیار آسان",
    tubaFit: "low",
    mechanics: [
      "TUBA یک فرستنده کالا یا فرصت عملیاتی را به یک شریک حمل‌ونقل معرفی می‌کند.",
      "شریک در ازای معرفی، کارمزد ثابت یا درصدی از قرارداد می‌پردازد.",
      "هیچ ساختار حکمرانی یا تعهد مستمر میان طرفین شکل نمی‌گیرد.",
      "با نهایی شدن قرارداد اصلی یا پایان معرفی، رابطه نیز تمام می‌شود.",
    ],
    whenToUse: [
      "برای آزمودن بازار جدید پیش از هرگونه تعهد عمیق‌تر.",
      "برای درآمدزایی از شبکه ارتباطی بدون درگیر شدن در اجرا.",
      "برای گرم‌کردن شریک بالقوه پیش از ورود به مذاکره ساختارهای سنگین‌تر.",
    ],
    tubaNote:
      "به‌عنوان گام پیش‌نیاز JV مفید است؛ قبل از ساختاردهی همکاری عمیق‌تر، جریان معامله و کیفیت شریک را می‌سنجد.",
    example:
      "مثال: TUBA یک برند تجارت الکترونیک را به یک شرکت لجستیکی معرفی می‌کند و ۵٪ از ارزش قرارداد سال اول را دریافت می‌کند.",
    weight: "light",
  },
  {
    id: "mou",
    name: "تفاهم‌نامه / MoU",
    tag: "اکتشافی",
    description:
      "بیانیه مکتوب قصد همکاری که الزام اجرایی کامل ندارد، اما رابطه را رسمی و جهت‌دار می‌کند.",
    attributes: ["غیرالزام‌آور", "انحصار اختیاری"],
    integration: 2,
    control: 1,
    risk: 1,
    commitment: 2,
    color: "#378ADD",
    accentClassName: "text-blue-700 dark:text-blue-300",
    surfaceClassName: "bg-blue-50/90 dark:bg-blue-950/30",
    borderClassName: "border-blue-200/80 dark:border-blue-900/60",
    legalEntity: "ندارد",
    sharedCapital: "ندارد",
    exitDifficulty: "بسیار آسان",
    tubaFit: "low",
    mechanics: [
      "دامنه همکاری، قصد مشترک و جدول زمانی اولیه را مشخص می‌کند.",
      "می‌تواند یک بازه انحصار ۶۰ تا ۱۲۰ روزه برای مذاکره ایجاد کند.",
      "آغازگر فاز بررسی دقیق، هماهنگی تیم‌ها و شکل‌دهی گزینه‌های معامله است.",
      "به‌طور معمول درآمد، سود و زیان مشترکی ایجاد نمی‌کند.",
    ],
    whenToUse: [
      "وقتی می‌خواهید پیش از توافق نهایی، شریک را برای مذاکره قفل کنید.",
      "وقتی نیاز دارید لنگر اولیه تعهد و جدیت متقابل را نشان دهید.",
      "وقتی مرحله بررسی دقیق پیش از JV یا اتحاد راهبردی در حال شروع است.",
    ],
    tubaNote:
      "برای قفل‌کردن شریک اولیه Q-Commerce یا لجستیک شهری در حین طراحی ساختار JV مناسب است.",
    example:
      "مثال: TUBA با یک اپراتور فروشگاه تاریک، تفاهم‌نامه ۹۰ روزه با حق انحصار مذاکره برای بررسی JV امضا می‌کند.",
    weight: "light",
  },
  {
    id: "alliance",
    name: "اتحاد استراتژیک",
    tag: "میانی",
    description:
      "توافق رسمی برای همکاری در حوزه‌های مشخص، در حالی که استقلال حقوقی و عملیاتی هر طرف حفظ می‌شود.",
    attributes: ["قرارداد الزام‌آور", "بدون شخصیت حقوقی مشترک", "دامنه مشخص"],
    integration: 3,
    control: 2,
    risk: 2,
    commitment: 3,
    color: "#1D9E75",
    accentClassName: "text-emerald-700 dark:text-emerald-300",
    surfaceClassName: "bg-emerald-50/90 dark:bg-emerald-950/30",
    borderClassName: "border-emerald-200/80 dark:border-emerald-900/60",
    legalEntity: "ندارد؛ بر پایه قرارداد",
    sharedCapital: "گاهی؛ بیشتر به‌صورت تقسیم هزینه",
    exitDifficulty: "متوسط",
    tubaFit: "medium",
    mechanics: [
      "از طریق قرارداد همکاری، اشتراک داده، فروش مشترک یا توسعه بازار اجرا می‌شود.",
      "هر طرف برند، حسابداری و سود و زیان مستقل خود را حفظ می‌کند.",
      "فعالیت‌های مشترک به‌صورت شفاف تعریف می‌شوند؛ مانند بازاریابی، تحلیل یا توزیع.",
      "بندهای تقسیم درآمد و حل اختلاف معمولاً در متن قرارداد دیده می‌شوند.",
    ],
    whenToUse: [
      "وقتی دسترسی به شبکه یا مشتری شریک بدون یکپارچه‌سازی کامل کافی است.",
      "برای ترتیبات اشتراک داده، فناوری یا فروش مشترک.",
      "برای ورود سریع به بازار یا جغرافیای جدید با ریسک محدودتر.",
    ],
    tubaNote:
      "برای همکاری‌های پلتفرم هوش TUBA مناسب است؛ می‌توان تحلیل و داده را با اپراتورها به اشتراک گذاشت بدون آنکه مالکیت تغییر کند.",
    example:
      "مثال: TUBA با یک SaaS بهینه‌سازی مسیر، قرارداد اتحاد می‌بندد؛ TUBA فناوری را در JVها جاسازی می‌کند و شریک به داده‌های عملیاتی ناشناس دسترسی می‌گیرد.",
    weight: "medium",
  },
  {
    id: "consortium",
    name: "کنسرسیوم",
    tag: "جمعی",
    description:
      "چند طرف مستقل منابع خود را برای یک پروژه مشخص تجمیع می‌کنند و پس از اتمام پروژه، ساختار خاتمه می‌یابد.",
    attributes: ["پروژه‌محور", "چندطرفه", "مسئولیت مشترک"],
    integration: 3,
    control: 3,
    risk: 3,
    commitment: 3,
    color: "#1D9E75",
    accentClassName: "text-emerald-700 dark:text-emerald-300",
    surfaceClassName: "bg-emerald-50/90 dark:bg-emerald-950/30",
    borderClassName: "border-emerald-200/80 dark:border-emerald-900/60",
    legalEntity: "SPV یا ساختار قراردادی پروژه‌ای",
    sharedCapital: "بله؛ محدود به پروژه",
    exitDifficulty: "آسان پس از تکمیل پروژه",
    tubaFit: "medium",
    mechanics: [
      "یک عضو لید، تحویل را مدیریت می‌کند و دیگر اعضا توانمندی‌های مکمل می‌آورند.",
      "سود و مسئولیت بر اساس فرمول مشارکت و دامنه تحویل تقسیم می‌شود.",
      "ریسک و تعهد به محدوده همان پروژه یا مناقصه محدود می‌ماند.",
      "پس از تکمیل پروژه یا پایان قرارداد، ساختار به‌طور طبیعی منحل می‌شود.",
    ],
    whenToUse: [
      "برای بردن قراردادهای بزرگ لجستیکی که یک طرف به‌تنهایی قادر به انجام آن نیست.",
      "برای مناقصات زیرساختی یا شبکه‌های گسترده last-mile.",
      "برای ورود اولیه به بازار پیش از ساخت JV دائمی.",
    ],
    tubaNote:
      "TUBA می‌تواند به‌عنوان رهبر کنسرسیوم عمل کند؛ حاکمیت و منطق سرمایه را می‌آورد و اپراتورها دارایی‌ها و ظرفیت اجرایی را اضافه می‌کنند.",
    example:
      "مثال: TUBA رهبری کنسرسیوم سه شرکت حمل‌ونقل را برای مناقصه یک قرارداد ملی تحویل بر عهده می‌گیرد.",
    weight: "medium",
  },
  {
    id: "jv",
    name: "سرمایه‌گذاری مشترک (JV)",
    tag: "مدل اصلی",
    description:
      "یک شخصیت حقوقی جدید که توسط دو یا چند طرف مشترکاً مالکیت و اداره می‌شود و سود، زیان و حاکمیت مشترک دارد.",
    attributes: ["شخصیت حقوقی جدید", "سهام‌داری", "هیئت‌مدیره مشترک"],
    integration: 5,
    control: 4,
    risk: 4,
    commitment: 5,
    color: "#EF9F27",
    accentClassName: "text-amber-700 dark:text-amber-300",
    surfaceClassName: "bg-amber-50/90 dark:bg-amber-950/30",
    borderClassName: "border-amber-200/80 dark:border-amber-900/60",
    legalEntity: "شخصیت حقوقی جدید",
    sharedCapital: "بله؛ آورده سهام‌داری",
    exitDifficulty: "پیچیده؛ خرید یا فروش سهام",
    tubaFit: "high",
    mechanics: [
      "توافق‌نامه JV سهام، حاکمیت، حقوق رأی و موضوعات رزرو شده را مشخص می‌کند.",
      "حساب‌های بانکی، قراردادها و سود و زیان در نهاد جدید متمرکز می‌شود.",
      "ترکیب هیئت‌مدیره و حقوق کنترلی بر اساس سهم و مذاکرات تعیین می‌شود.",
      "خروج معمولاً با بندهای buyout، tag-along و drag-along مدیریت می‌شود.",
    ],
    whenToUse: [
      "وقتی هر دو طرف دارایی یا قابلیت استراتژیک واقعی و مکمل وارد می‌کنند.",
      "وقتی افق همکاری بلندمدت ۳ تا ۷ ساله تعریف شده است.",
      "وقتی برند مشترک یا نهاد مستقل برای توسعه بازار ارزش راهبردی دارد.",
    ],
    tubaNote:
      "وسیله اصلی TUBA برای ساخت پلتفرم‌های مشترک است. داشتن کرسی هیئت‌مدیره و حقوق کنترلی کلیدی، بخشی از منطق تخصیص سرمایه فخر/TUBA است.",
    example:
      "مثال: TUBA با سهم ۳۵٪، اپراتور فروشگاه تاریک با ۵۰٪ و شریک فناوری با ۱۵٪ یک شرکت Q-Commerce Hub تأسیس می‌کنند.",
    weight: "heavy",
  },
  {
    id: "acquisition",
    name: "تملک / M&A",
    tag: "سنگین‌ترین",
    description:
      "مالکیت کامل یا اکثریتی یک کسب‌وکار دیگر؛ بیشترین سطح کنترل، سرمایه‌گذاری و پیچیدگی ادغام را ایجاد می‌کند.",
    attributes: ["مالکیت کامل یا کنترلی", "بدون استقلال شریک", "بیشترین نیاز سرمایه"],
    integration: 6,
    control: 6,
    risk: 6,
    commitment: 6,
    color: "#D85A30",
    accentClassName: "text-orange-700 dark:text-orange-300",
    surfaceClassName: "bg-orange-50/90 dark:bg-orange-950/30",
    borderClassName: "border-orange-200/80 dark:border-orange-900/60",
    legalEntity: "شرکت تابعه یا جذب‌شده",
    sharedCapital: "ندارد؛ خریدار سرمایه را تأمین می‌کند",
    exitDifficulty: "بسیار سخت",
    tubaFit: "selective",
    mechanics: [
      "می‌تواند به‌صورت خرید ۱۰۰٪ یا سهم کنترلی ۵۱٪ به بالا انجام شود.",
      "خریدار تمام دارایی‌ها، بدهی‌ها و الزامات ادغام پس از معامله را می‌پذیرد.",
      "هم‌افزایی واقعی در گرو یکپارچه‌سازی فرآیند، تیم و فناوری پس از closing است.",
      "امکان تقسیم ریسک با شریک از بین می‌رود و مسئولیت سود و زیان کاملاً متمرکز می‌شود.",
    ],
    whenToUse: [
      "وقتی شریک فعلی به یک دارایی استراتژیک غیرقابل‌جایگزین تبدیل شده است.",
      "وقتی فناوری، شبکه یا مجوزها باید کاملاً در اختیار قرار گیرند.",
      "در حالت دفاعی برای جلوگیری از تصاحب یک دارایی کلیدی توسط رقیب.",
    ],
    tubaNote:
      "برای TUBA یک حالت انتخابی و endgame است؛ بهتر است حقوق تملک احتمالی از ابتدا در اسناد JV یا اتحادهای عمیق‌تر دیده شود.",
    example:
      "مثال: پس از سه سال، TUBA اختیار از پیش‌توافق‌شده برای تملک ۶۵٪ باقیمانده JV را بر اساس ضریب EBITDA اعمال می‌کند.",
    weight: "heavy",
  },
];

export const collaborationInsightChips = [
  {
    id: "lightest",
    title: "سبک‌ترین مسیر",
    description: "معرفی / تفاهم‌نامه",
  },
  {
    id: "middle",
    title: "مسیر میانی",
    description: "اتحاد استراتژیک / کنسرسیوم",
  },
  {
    id: "heaviest",
    title: "مسیر سنگین",
    description: "JV / تملک",
  },
];
