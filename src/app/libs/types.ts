import { Message, Room, User } from "./DB";

export interface Database {
    rooms: Room[];
    messages: Message[];
    users: User[];
  }

export interface Payload {
    username: string;
    password: string;
    role: string;
  }