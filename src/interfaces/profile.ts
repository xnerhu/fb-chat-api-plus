export interface IProfile {
  alternateName?: string;
  firstName?: string;
  gender?: string;
  userID?: string;
  isFriend?: boolean;
  fullName?: string;
  profilePicture?: string;
  type?: 'user' | 'group' | 'page' | 'event' | 'app';
  profileUrl?: string;
  vanity?: string;
  isBirthday?: boolean;
  thumbSrc?: string;
}
