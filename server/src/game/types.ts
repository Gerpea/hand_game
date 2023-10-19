import { Request } from 'express';
import { Socket } from 'socket.io';

export type Users = {
  [userID: string]: boolean;
};

export type Scores = {
  [userID: string]: number;
};

export type Game = {
  id: string;
  users: Users;
  scores: Scores;
};

export type AddUserFields = {
  gameID: string;
  userID: string;
};

export type RemoveUserFields = {
  gameID: string;
  userID: string;
};

export type AddScoreFields = {
  gameID: string;
  userID: string;
};

export type CreateGameData = {
  gameID: string;
};

export type AddScoreData = {
  gameID: string;
  userID: string;
};

export type AddUserData = {
  gameID: string;
  userID: string;
};

export type RemoveUserData = {
  gameID: string;
  userID: string;
};

export type AuthPayload = {
  userID: string;
  gameID: string;
};

export type RequestWithAuth = Request & AuthPayload;
export type SocketWithAuth = Socket & AuthPayload;
