export type Statistic = {
  id: number,
  value: string,
  label: string
}

export type SettingsResponse = {
    success: boolean|string,
    message: string,
    data: {
        id: number,
        siteName: string|null,
        siteLogo: string|null,
        metaTitle: string|null,
        metaDescription: string|null,
        metaKeywords: string|null,
        metaImage: string|null,
        heroTitle: string,
        heroDescription: string,
        heroImage: string,
        heroButton1Link: string,
        heroButton2Link: string,
        email: string|null,
        phone: string|null,
        address: string|null,
        facebook: string|null,
        twitter: string|null,
        instagram: string|null,
        linkedin: string|null,
        youtube: string|null,
        tiktok: string|null,
        snapchat: string|null,
        pinterest: string|null,
        whatsapp: string|null,
        telegram: string|null,
        statisticsHeading: string,
        statisticsDescription: string,
        statistics: Statistic[]
    }
}