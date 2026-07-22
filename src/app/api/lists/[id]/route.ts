import { NextRequest } from "next/server";

import { ApiResponse } from "@/lib/api/response";
import { deleteList } from "@/lib/lists/delete-list";

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await deleteList((await params).id);
    return new Response(null, { status: 204 });
  } catch (error) {
    if (error instanceof Error && error.message === "List not found") {
      return ApiResponse.error(error.message, 404);
    }

    return ApiResponse.error("Internal server error", 500);
  }
}
