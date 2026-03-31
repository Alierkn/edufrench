import { defineField, defineType } from "sanity";
import { ComposeIcon } from "@sanity/icons";

/** Tüm sabit arayüz metinleri — tek belge (singleton) */
export const appCopy = defineType({
  name: "appCopy",
  title: "Uygulama metinleri",
  type: "document",
  icon: ComposeIcon,
  groups: [
    { name: "home", title: "Ana sayfa", default: true },
    { name: "auth", title: "Giriş / Kayıt" },
    { name: "onboarding", title: "Onboarding" },
    { name: "dashboard", title: "Dashboard" },
    { name: "learning", title: "Modül sayfaları" },
    { name: "admin", title: "Admin / diğer" },
  ],
  fields: [
    defineField({
      name: "homeSeo",
      title: "Ana sayfa SEO",
      type: "seo",
      group: "home",
    }),
    defineField({
      name: "homeBadge",
      title: "Ana sayfa rozet",
      type: "string",
      group: "home",
    }),
    defineField({
      name: "homeHeadlineLine1",
      title: "Hero satır 1",
      type: "string",
      group: "home",
    }),
    defineField({
      name: "homeHeadlineAccent",
      title: "Hero vurgulu satır (mavi)",
      type: "string",
      group: "home",
    }),
    defineField({
      name: "homeSubhead",
      title: "Alt başlık",
      type: "text",
      rows: 4,
      group: "home",
    }),
    defineField({
      name: "homeCtaLabel",
      title: "CTA buton metni",
      type: "string",
      group: "home",
    }),
    defineField({
      name: "homeCtaHref",
      title: "CTA bağlantısı",
      type: "string",
      initialValue: "/login",
      group: "home",
    }),

    defineField({
      name: "loginBadge",
      title: "Giriş rozeti",
      type: "string",
      group: "auth",
    }),
    defineField({
      name: "loginTitle",
      title: "Giriş başlık",
      type: "string",
      group: "auth",
    }),
    defineField({
      name: "loginSubtitle",
      title: "Giriş alt başlık",
      type: "string",
      group: "auth",
    }),
    defineField({
      name: "loginEmailLabel",
      title: "E-posta alan etiketi",
      type: "string",
      group: "auth",
    }),
    defineField({
      name: "loginPasswordLabel",
      title: "Şifre alan etiketi",
      type: "string",
      group: "auth",
    }),
    defineField({
      name: "loginSubmitLabel",
      title: "Gönder butonu",
      type: "string",
      group: "auth",
    }),
    defineField({
      name: "loginErrorMessage",
      title: "Hata mesajı (genel)",
      type: "string",
      group: "auth",
    }),

    defineField({
      name: "registerTitle",
      title: "Kayıt başlık",
      type: "string",
      group: "auth",
    }),
    defineField({
      name: "registerSubtitle",
      title: "Kayıt alt başlık",
      type: "string",
      group: "auth",
    }),

    defineField({
      name: "onboardingProgressTemplate",
      title: "İlerleme şablonu",
      description: "Örn. Adım {current}/{total} — {current} ve {total} yer tutucu",
      type: "string",
      group: "onboarding",
    }),
    defineField({
      name: "onboardingHeaderRight",
      title: "İlerleme çubuğu sağ etiket",
      type: "string",
      group: "onboarding",
    }),
    defineField({
      name: "onboardingNextButton",
      title: "Sonraki adım butonu",
      type: "string",
      group: "onboarding",
    }),
    defineField({
      name: "onboardingCompleteButton",
      title: "Tamamla butonu",
      type: "string",
      group: "onboarding",
    }),
    defineField({
      name: "onboardingSavingLabel",
      title: "Kaydediliyor metni",
      type: "string",
      group: "onboarding",
    }),
    defineField({
      name: "onboardingSteps",
      title: "Adımlar ve seçenekler",
      type: "array",
      of: [{ type: "onboardingStepCopy" }],
      group: "onboarding",
    }),

    defineField({
      name: "dashboardLoading",
      title: "Yükleniyor",
      type: "string",
      group: "dashboard",
    }),
    defineField({
      name: "dashboardWelcomePrefix",
      title: "Karşılama ön eki",
      description: "Örn. Bonjour, — isim sonra eklenir",
      type: "string",
      group: "dashboard",
    }),
    defineField({
      name: "dashboardGuestName",
      title: "İsim yoksa varsayılan",
      type: "string",
      group: "dashboard",
    }),
    defineField({
      name: "dashboardWelcomeSub",
      title: "Hoş geldin alt satırı",
      type: "string",
      group: "dashboard",
    }),
    defineField({
      name: "dashboardSignOut",
      title: "Çıkış butonu",
      type: "string",
      group: "dashboard",
    }),
    defineField({
      name: "dashboardRecommendationBadge",
      title: "Öneri rozeti",
      type: "string",
      group: "dashboard",
    }),
    defineField({
      name: "dashboardWeaknessTitleTemplate",
      title: "Zayıflık başlığı şablonu",
      description: '{weakness} yer tutucu kullanın',
      type: "string",
      group: "dashboard",
    }),
    defineField({
      name: "dashboardWeaknessBodyTemplate",
      title: "Zayıflık gövde şablonu",
      description: "{module} yer tutucu",
      type: "text",
      rows: 2,
      group: "dashboard",
    }),
    defineField({
      name: "dashboardModuleCtaTemplate",
      title: "Modüle git butonu şablonu",
      description: "{module} yer tutucu",
      type: "string",
      group: "dashboard",
    }),
    defineField({
      name: "dashboardMetricsTitle",
      title: "Metrikler kutusu başlığı",
      type: "string",
      group: "dashboard",
    }),
    defineField({
      name: "dashboardTotalScoreLabel",
      title: "Toplam puan etiketi",
      type: "string",
      group: "dashboard",
    }),
    defineField({
      name: "dashboardScoreHint",
      title: "Puan alt açıklama",
      type: "string",
      group: "dashboard",
    }),
    defineField({
      name: "dashboardWeaknessesLabel",
      title: "Zayıflıklar kutusu başlığı",
      type: "string",
      group: "dashboard",
    }),
    defineField({
      name: "dashboardNoWeaknesses",
      title: "Zayıflık yok mesajı",
      type: "text",
      rows: 2,
      group: "dashboard",
    }),
    defineField({
      name: "dashboardQuickLinksTitle",
      title: "Hızlı modül başlığı",
      type: "string",
      group: "dashboard",
    }),

    defineField({
      name: "learningAreas",
      title: "Öğrenme alanları (CE, CO, …)",
      type: "array",
      of: [{ type: "learningAreaCopy" }],
      group: "learning",
    }),

    defineField({
      name: "adminPanelTitle",
      title: "Admin panel başlığı",
      type: "string",
      group: "admin",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Uygulama metinleri" };
    },
  },
});
