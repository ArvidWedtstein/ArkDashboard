import { RedwoodRecord } from "@redwoodjs/record";

export default class User extends RedwoodRecord {
  id?: string;
  sub?: string;
  roles?: string[];
  email?: string;
  role_id?: string;
  avatar_url?: string;
}
