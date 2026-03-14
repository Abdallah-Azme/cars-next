import type { VehicleData } from "./vehicles";

export type AddToFavResponse = {
    success: boolean |string;
    message: string;
    data: null;
}
export type FavResponse = {
    success: boolean |string;
    message: string;
    data: VehicleData[];
}

