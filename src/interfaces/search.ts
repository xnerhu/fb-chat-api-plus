import { IProfile } from './profile';

export interface ISearchRes {
  userID: string;
  photoUrl: string;
  indexRank: number;
  name: string;
  isVerified: boolean;
  profileUrl: string;
  category: string;
  score: number;
  type: 'user' | 'group' | 'page' | 'event' | 'app';
}

export interface IUserInfoRes {
  [key: string]: IProfile;
}
