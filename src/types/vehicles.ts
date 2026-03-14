export type VehicleStatusHistory = {
  status: string;
  result: string;
  soldPrice: string | null;
  at: string;
};

export type VehicleTranslatedData = {
  maker: string | null;
  carMaker: string | null;
  model: string | null;
  color: string | null;
  vehicleType: string | null;
  transmission: string | null;
  fuel: string | null;
  score: string | null;
  vehicleHistory: string | null;
  repairHistory: string | null;
  inspection: string | null;
  vehicleSize: string | null;
  constructionVehicleSize: string | null;
  corner: string | null;
  auctionSite: string | null;
  result: string;
  startPrice: string | null;
  displacement: string | null;
};

export type VehicleImage = {
  image_url: string;
  download_url: string | null;
  is_inspection_sheet: number;
};

export type VehicleData = {
  id: number;
  dataVid: string;
  auctionDay: string;
  lotNumber: string;
  maker: string | null;
  carMaker: string | null;
  model: string | null;
  chassisId: string;
  year: string;
  vehicleType: string;
  score: string | null;
  color: string | null;
  transmission: string | null;
  displacement: string | null;
  fuel: string | null;
  odometer: string;
  workingHours: string;
  equipment: string;
  vehicleHistory: string | null;
  repairHistory: string | null;
  inspection: string | null;
  vehicleSize: string | null;
  constructionVehicleSize: string | null;
  startPrice: string;
  corner: string;
  selectionMaker: string;
  selectionModel: string;
  auctionSite: string;
  holdingDate: string;
  acceptancePeriod: string;
  url: string;
  status: string;
  result: string;
  soldPrice: string | null;
  statusHistory: VehicleStatusHistory[];
  firstSeenAt: string;
  lastUpdatedAt: string;
  updateCount: number;
  imageCount: number;
  translatedData: VehicleTranslatedData;
  images: VehicleImage[];
};

export type SingleVehicleResponse = {
  message:string
  data: VehicleData
}

export type AuctionSummaryItem = {
  auctionDay: string;
  date: string;
  itemsCount: number;
};

export type Pagination = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};
export type VehicleSResponse = {
  success: boolean | string
  message:string
  data: {
    vehicles: VehicleData[],
    summary: AuctionSummaryItem[],
    pagination:Pagination
  }
};


export type FiltersData = {
  makers: string[];
  models: string[];
  types: string[];
  sizes: string[];
  years: string[];
  workingHours: string[];
  scores: string[];
};

export type FiltersResponse = {
  success: boolean;
  message: string;
  data: FiltersData;
};

export const defaultFilters: FiltersData = {
  makers: [],
  models: [],
  types: [],
  sizes: [],
  years: [],
  workingHours: [],
  scores: [],
};