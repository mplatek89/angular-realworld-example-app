export interface Inspiraton {
  createtAd?: string;
  deleted?: boolean;
  source?: string;
  status?: Status;
  text: string;
  type?: string;
  updatedAt?: string;
  used?: boolean;
  user?: string;
  __v?: number;
  _id?: string;
}

interface Status {
  verified: boolean;
  sentCount: number;
}
