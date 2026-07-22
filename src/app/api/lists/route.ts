import { NextRequest } from "next/server";

import { ApiResponse } from "@/lib/api/response";
import { createList } from "@/lib/lists/create-list";
import { listLists } from "@/lib/lists/list-lists";
import { createListSchema } from "@/lib/validators/list";

export async function GET() {
  try {
    const lists = await listLists();
    return ApiResponse.success(lists, 200);
  } catch (error) {
    return error instanceof Error
      ? ApiResponse.error(error.message, 500)
      : ApiResponse.error("Internal server error", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const parsed = createListSchema.safeParse(body);
    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? "Invalid request";
      return ApiResponse.error(message, 400);
    }

    const list = await createList(parsed.data);
    return ApiResponse.success(list, 201);
  } catch (error) {
    if (error instanceof SyntaxError) {
      return ApiResponse.error("Invalid JSON body", 400);
    }

    if (
      error instanceof Error &&
      error.message === "One or more medicines not found"
    ) {
      return ApiResponse.error(error.message, 404);
    }

    return error instanceof Error
      ? ApiResponse.error(error.message, 500)
      : ApiResponse.error("Internal server error", 500);
  }
}
