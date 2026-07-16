import { NextRequest } from "next/server";

import { ApiResponse } from "@/lib/api/response";
import { createMedicine } from "@/lib/medicines/create-medicine";
import { createMedicineSchema } from "@/lib/validators/medicine";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const parsed = createMedicineSchema.safeParse(body);
    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? "Invalid request";
      return ApiResponse.error(message, 400);
    }

    const createdMedicine = await createMedicine(parsed.data);
    return ApiResponse.success(createdMedicine, 201);
  } catch (error) {
    if (error instanceof SyntaxError) {
      return ApiResponse.error("Invalid JSON body", 400);
    }

    if (error instanceof Error && error.message === "Medicine already exists") {
      return ApiResponse.error(error.message, 409);
    }

    return error instanceof Error
      ? ApiResponse.error(error.message, 500)
      : ApiResponse.error("Internal server error", 500);
  }
}
