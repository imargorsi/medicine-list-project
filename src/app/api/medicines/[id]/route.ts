import { NextRequest } from "next/server";

import { ApiResponse } from "@/lib/api/response";
import { deleteMedicine } from "@/lib/medicines/delete-medicine";
import { updateMedicine } from "@/lib/medicines/update-medicine";
import { updateMedicineSchema } from "@/lib/validators/medicine";

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


export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {


  try {

    const body = await request.json();
    const parsed = updateMedicineSchema.safeParse(body);
    if(!parsed.success) {
      return ApiResponse.error(parsed.error.message, 400);
    }

    const updatedMedicine = await updateMedicine((await params).id, parsed.data);
    return ApiResponse.success(updatedMedicine, 200);

  } catch (error) {
    if (error instanceof SyntaxError) {
      return ApiResponse.error("Invalid JSON", 400);
    } else if (error instanceof Error && error.message === "Medicine not found") {
      return ApiResponse.error("Medicine not found", 404);
    } else if (error instanceof Error && error.message === "Medicine already exists") {
      return ApiResponse.error("Medicine already exists", 409);
    } else {
      return ApiResponse.error("Internal server error", 500);
    }
  }
}
