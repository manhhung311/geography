import PostModel from "@/model/post";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import fs from 'fs';
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const fd = fs.readFileSync(`./public/uploads/${params.id}`);
    const type = params.id.split('.').pop()
    let contentType = ""
    if(type === "jpg") {
      contentType = 'image/jpg'
    }
    if(type === "jpeg") {
      contentType = 'image/jpeg'
    }
    if(type === "png") {
      contentType = 'image/png'
    }
    if(type === "mp4") {
      contentType = 'video/mp4'
    }
    if(type === "avi") {
      contentType = 'video/avi'
    }
    if(type === "mpeg") {
      contentType = 'video/mpeg'
    }
    return new NextResponse(fd, {status: 200, headers: {"Content-type": contentType}})
  }catch(ex) {
    console.log(ex)
    return new NextResponse("NOT FOUND", {status: 404})
  }
  const post = params.id
    ? await PostModel.findById(params.id)
    : await PostModel.find({});
  return NextResponse.json({ post });
}

