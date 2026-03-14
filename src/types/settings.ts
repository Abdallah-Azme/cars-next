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
        statisticsHeading: string,
        statisticsDescription: string,
        statistics: Statistic[]
    }
}