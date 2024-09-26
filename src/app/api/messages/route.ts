import { DB, readDB, writeDB } from "@lib/DB";
import { checkToken } from "@lib/checkToken";
import { Database } from "@lib/types";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  const roomId = request.nextUrl.searchParams.get("roomId");
  readDB();
  const foundRoom = (<Database>DB).rooms.find((x) => x.roomId === roomId);
  if(!foundRoom) {
    return NextResponse.json(
    {
      ok: false,
      message: `Room is not found`,
    },
    { status: 404 }
  );
  }

  const messageInRoom = [];
  for(let i = 0; i < (<Database>DB).messages.length; i++) {
    if((<Database>DB).messages[i].roomId === roomId) {
        messageInRoom.push((<Database>DB).messages[i]);
    }
  }

  return NextResponse.json({
    ok: true,
    messages: messageInRoom,
  });
  };

export const POST = async (request: NextRequest) => {
  readDB();
  const body = await request.json();
  const { roomId,messageText } = body;
  const foundRoom = (<Database>DB).rooms.find((x) => x.roomId === roomId);
  if(!foundRoom){
    return NextResponse.json(
        {
          ok: false,
          message: `Room is not found`,
        },
        { status: 404 }
      );
    }

  const messageId = nanoid();

  
  (<Database>DB).messages.push({
    roomId,
    messageId,
    messageText,
  });
  writeDB();
  return NextResponse.json({
    ok: true,
    messageId: messageId,
    message: "Message has been sent",
  });
};

export const DELETE = async (request: NextRequest) => {
  const payload = checkToken();

  // return NextResponse.json(
  //   {
  //     ok: false,
  //     message: "Invalid token",
  //   },
  //   { status: 401 }
  // );

  readDB();

  // return NextResponse.json(
  //   {
  //     ok: false,
  //     message: "Message is not found",
  //   },
  //   { status: 404 }
  // );

  writeDB();

  return NextResponse.json({
    ok: true,
    message: "Message has been deleted",
  });
};
