import { db } from "../../../drizzle";
import { BaseRepository } from "../../base.repository";
import { users } from "../models";

export class UserRepository extends BaseRepository(db, users) { }
