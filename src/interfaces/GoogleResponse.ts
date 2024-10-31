interface User {
  email: string;
  familyName: string | null;
  givenName: string | null;
  id: string;
  name: string | null;
  photo: string | null;
}
interface Data {
  idToken: string | null;
  scopes: string[];
  serverAuthCode: string | null;
  user: User | null;
}

export interface GoogleResponse {
  data: Data | null;
  type: string;
}
