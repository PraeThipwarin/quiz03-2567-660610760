import { DB, readDB, writeDB } from "@lib/DB";
import { checkToken } from "@lib/checkToken";
import { Database, Payload } from "@lib/types";
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

  if(!payload) {
    return NextResponse.json(
      {
        ok: false,
        message: "Invalid token",
      },
      { status: 401 }
    );
  }
  
  const { role } = <Payload>payload;
  const body = await request.json();
  const { messageId } = body;
  readDB();
  const foundMessage = (<Database>DB).messages.find((x) => x.messageId === messageId);
  if(!foundMessage)
  {  
    return NextResponse.json(
      {
        ok: false,
        message: "Message is not found",
      },
      { status: 404 }
    );
  }
  if(role === "SUPER ADMIN"){
    return NextResponse.json({
      ok: true,
      message: "Message has been deleted",
    });
  }
  //delete message
  const index = (<Database>DB).messages.findIndex((x) => x.messageId === messageId);
  if(index === -1){
    return NextResponse.json(
      {
        ok: false,
        message: "Message is not found",
      },
      { status: 404 }
    );
  }
  const foundMessageIndex = (<Database>DB).messages.findIndex((x) => x.messageId === messageId);
  (<Database>DB).messages.splice(foundMessageIndex, 1);
  writeDB();

};
