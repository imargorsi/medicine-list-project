import { NextRequest } from "next/server";

import { ApiResponse } from "@/lib/api/response";
import { deleteMedicine } from "@/lib/medicines/delete-medicine";

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await deleteMedicine((await params).id);
    return new Response(null, { status: 204 });
  } catch (error) {
    if (error instanceof Error && error.message === "Medicine not found") {
      return ApiResponse.error("Medicine not found", 404);
    } else {
      return ApiResponse.error("Internal server error", 500);
    }
  }
}
