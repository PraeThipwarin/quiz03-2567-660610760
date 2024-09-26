import { DB, readDB, writeDB } from "@lib/DB";
import { checkToken } from "@lib/checkToken";
import { Database, Payload } from "@lib/types";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";

export const GET = async () => {
  readDB();
  return NextResponse.json({
    ok: true,
    rooms: (<Database>DB).rooms,
    totalRooms: (<Database>DB).rooms.length,
  });
};

export const POST = async (request: NextRequest) => {
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
  const { roomName } = body;
  const roomId = nanoid();
  readDB();
  const foundRoom = (<Database>DB).rooms.find((x) => x.roomName === roomName);

  if(foundRoom){
  return NextResponse.json(
    {
      ok: false,
      message: `Room ${roomName} already exists`,
    },
    { status: 400 }
  );
  }

  //call writeDB after modifying Database
  
  (<Database>DB).rooms.push({
    roomName,
    roomId,
  });
  writeDB();
  if(!foundRoom && role === "ADMIN" ||role === "SUPER_ADMIN"){
    return NextResponse.json({
      ok: true,
      roomId: roomId,
      message: `Room ${roomName} has been created`,
    });
  };
  
  
  }